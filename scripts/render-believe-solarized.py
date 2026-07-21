#!/usr/bin/env python3
"""Bake the BELIEVE look into duplicate clips on the Hermes workstation.

The cleared originals are read-only inputs. Outputs retain their filenames in a
parallel directory, with a solarized plate plus authored tracking-box, point-map,
and pose-etch treatments. The website only plays the finished files; no per-frame
CV ships to the browser.
"""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path

import cv2
import numpy as np


PALETTES = (
    np.array(((3, 5, 16), (20, 35, 188), (0, 192, 248), (244, 246, 230)), dtype=np.float32),
    np.array(((5, 4, 14), (101, 25, 153), (238, 48, 115), (255, 222, 68)), dtype=np.float32),
    np.array(((1, 9, 18), (0, 77, 176), (20, 222, 205), (247, 241, 215)), dtype=np.float32),
)

ANALYSIS_MODES = {
    'cleared-joker-singing-58-67.mp4': 'box',
    'cleared-mandalorian-grogu-56.mp4': 'depth',
    'cleared-joker-spotlight-82-84.mp4': 'depth',
    'cleared-joker-dance-86-88.mp4': 'pose',
    'cleared-joker-09.mp4': 'box',
    'cleared-mandalorian-grogu-19.mp4': 'solar',
    'cleared-mandalorian-grogu-31.mp4': 'depth',
    'cleared-mandalorian-grogu-27.mp4': 'depth',
    'cleared-mandalorian-grogu-11.mp4': 'pose',
    'cleared-obi-wan-07.mp4': 'pose',
    'cleared-mandalorian-grogu-58.mp4': 'depth',
    'cleared-big-bold-01.mp4': 'box',
    'cleared-joker-05.mp4': 'box',
    'cleared-joker-08.mp4': 'pose',
    'cleared-joker-07.mp4': 'box',
}

OPENPOSE_BODY_EDGES = (
    (0, 1), (1, 2), (2, 3), (3, 4),
    (1, 5), (5, 6), (6, 7),
    (1, 8), (8, 9), (9, 10),
    (1, 11), (11, 12), (12, 13),
    (0, 14), (14, 16), (0, 15), (15, 17),
)


@dataclass
class Detection:
    box: np.ndarray
    score: float


@dataclass
class Track:
    track_id: int
    box: np.ndarray
    score: float
    missed: int = 0


def iou(a: np.ndarray, b: np.ndarray) -> float:
    x1, y1 = max(a[0], b[0]), max(a[1], b[1])
    x2, y2 = min(a[2], b[2]), min(a[3], b[3])
    intersection = max(0.0, x2 - x1) * max(0.0, y2 - y1)
    union = max(1.0, (a[2] - a[0]) * (a[3] - a[1]) + (b[2] - b[0]) * (b[3] - b[1]) - intersection)
    return intersection / union


class PersonTracker:
    def __init__(self) -> None:
        self.tracks: list[Track] = []
        self.next_id = 1

    def update(self, detections: list[Detection]) -> list[Track]:
        available = set(range(len(detections)))
        for track in self.tracks:
            best = max(available, key=lambda j: iou(track.box, detections[j].box), default=None)
            if best is not None and iou(track.box, detections[best].box) >= 0.24:
                detection = detections[best]
                # Tight enough to follow movement, damped enough to remove box chatter.
                track.box = track.box * 0.68 + detection.box * 0.32
                track.score = detection.score
                track.missed = 0
                available.remove(best)
            else:
                track.missed += 1
        self.tracks = [track for track in self.tracks if track.missed <= 5]
        for index in available:
            detection = detections[index]
            self.tracks.append(Track(self.next_id, detection.box.copy(), detection.score))
            self.next_id += 1
        return [track for track in self.tracks if track.missed <= 2]


class YoloPersonDetector:
    def __init__(self, model_path: Path, confidence: float = 0.34) -> None:
        self.net = cv2.dnn.readNetFromONNX(str(model_path))
        self.confidence = confidence

    def detect(self, frame: np.ndarray) -> list[Detection]:
        height, width = frame.shape[:2]
        side = max(height, width)
        padded = np.full((side, side, 3), 114, dtype=np.uint8)
        padded[:height, :width] = frame
        blob = cv2.dnn.blobFromImage(padded, 1 / 255.0, (640, 640), swapRB=True, crop=False)
        self.net.setInput(blob)
        prediction = self.net.forward()
        prediction = np.squeeze(prediction)
        if prediction.ndim != 2:
            return []
        if prediction.shape[0] < prediction.shape[1]:
            prediction = prediction.T
        scale = side / 640.0
        boxes: list[list[int]] = []
        scores: list[float] = []
        for row in prediction:
            # YOLOv8/11 export: cx, cy, w, h, then class confidences. Person = 0.
            if len(row) < 5:
                continue
            score = float(row[4])
            if score < self.confidence:
                continue
            cx, cy, bw, bh = (float(value) * scale for value in row[:4])
            x = int(round(cx - bw / 2))
            y = int(round(cy - bh / 2))
            boxes.append([x, y, int(round(bw)), int(round(bh))])
            scores.append(score)
        keep = cv2.dnn.NMSBoxes(boxes, scores, self.confidence, 0.46)
        detections: list[Detection] = []
        for index in np.array(keep).reshape(-1) if len(keep) else []:
            x, y, bw, bh = boxes[int(index)]
            detections.append(Detection(
                np.array((max(0, x), max(0, y), min(width, x + bw), min(height, y + bh)), dtype=np.float32),
                scores[int(index)],
            ))
        return detections


def solarize(frame: np.ndarray, palette_index: int) -> np.ndarray:
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB).astype(np.float32) / 255.0
    luminance = rgb[..., 0] * 0.2126 + rgb[..., 1] * 0.7152 + rgb[..., 2] * 0.0722
    # A Sabattier-like fold reverses upper tones; four authored bands keep the
    # LED image graphic and readable instead of looking like a generic filter.
    folded = np.where(luminance < 0.56, luminance / 0.56, (1.0 - luminance) / 0.44)
    folded = np.clip(folded, 0.0, 1.0)
    levels = np.clip(np.floor(folded * 3.999), 0, 3).astype(np.int32)
    palette = PALETTES[palette_index % len(PALETTES)]
    treated_rgb = palette[levels]
    edges = cv2.Canny(cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY), 70, 150)
    treated_rgb[edges > 0] *= 0.25
    return cv2.cvtColor(np.clip(treated_rgb, 0, 255).astype(np.uint8), cv2.COLOR_RGB2BGR)


def draw_corner_box(
    frame: np.ndarray,
    box: tuple[int, int, int, int],
    track_id: int,
    score: float,
    mode: str,
) -> None:
    x1, y1, x2, y2 = box
    width, height = x2 - x1, y2 - y1
    length = max(10, min(30, int(min(width, height) * 0.18)))
    color = (255, 242, 210)
    accent = (255, 221, 36)
    weight = max(1, round(frame.shape[1] / 960))
    for ax, ay, sx, sy in (
        (x1, y1, 1, 1), (x2, y1, -1, 1), (x1, y2, 1, -1), (x2, y2, -1, -1),
    ):
        cv2.line(frame, (ax, ay), (ax + sx * length, ay), color, weight, cv2.LINE_AA)
        cv2.line(frame, (ax, ay), (ax, ay + sy * length), color, weight, cv2.LINE_AA)
    label = f"{mode.upper()} {track_id:02d}  {score:.2f}"
    font_scale = max(0.34, frame.shape[1] / 2500)
    cv2.putText(frame, label, (x1, max(14, y1 - 7)), cv2.FONT_HERSHEY_SIMPLEX, font_scale, accent, weight, cv2.LINE_AA)


def detections_from_mask(mask_frame: np.ndarray, width: int, height: int) -> list[Detection]:
    gray = cv2.cvtColor(mask_frame, cv2.COLOR_BGR2GRAY)
    if gray.shape[:2] != (height, width):
        gray = cv2.resize(gray, (width, height), interpolation=cv2.INTER_NEAREST)
    binary = np.where(gray > 48, 255, 0).astype(np.uint8)
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))
    binary = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, kernel)
    count, _, stats, _ = cv2.connectedComponentsWithStats(binary, 8)
    minimum_area = width * height * 0.0012
    detections: list[Detection] = []
    for index in range(1, count):
        x, y, bw, bh, area = stats[index]
        if area < minimum_area or bw < width * 0.025 or bh < height * 0.06:
            continue
        detections.append(Detection(
            np.array((x, y, x + bw, y + bh), dtype=np.float32),
            min(0.99, 0.9 + float(area) / max(1.0, width * height)),
        ))
    return detections


def draw_pose_etch(frame: np.ndarray, pose_frame: dict, frame_index: int) -> None:
    """Draw crisp, authored OpenPose etching from Sapiens keypoints."""
    height, width = frame.shape[:2]
    source_width = max(1, int(pose_frame.get('canvas_width', width)))
    source_height = max(1, int(pose_frame.get('canvas_height', height)))
    scale_x, scale_y = width / source_width, height / source_height
    weight = max(1, round(width / 960))
    for person_index, person in enumerate(pose_frame.get('people', [])):
        values = person.get('pose_keypoints_2d', [])
        points = []
        for offset in range(0, len(values) - 2, 3):
            points.append((
                int(round(values[offset] * scale_x)),
                int(round(values[offset + 1] * scale_y)),
                float(values[offset + 2]),
            ))
        accent = (255, 232, 46) if person_index % 2 == 0 else (248, 192, 0)
        ghost = (210, 58, 255)
        for start, end in OPENPOSE_BODY_EDGES:
            if start >= len(points) or end >= len(points):
                continue
            a, b = points[start], points[end]
            if min(a[2], b[2]) < 0.18:
                continue
            # A one-pixel magenta registration echo makes it read as an
            # analytical etch, not a fitness-app skeleton.
            cv2.line(frame, (a[0] + 2, a[1]), (b[0] + 2, b[1]), ghost, weight, cv2.LINE_AA)
            cv2.line(frame, a[:2], b[:2], accent, weight + 1, cv2.LINE_AA)
        for x, y, score in points:
            if score < 0.22:
                continue
            radius = max(2, weight + 1)
            cv2.circle(frame, (x, y), radius + 1, (7, 9, 20), -1, cv2.LINE_AA)
            cv2.circle(frame, (x, y), radius, accent, -1, cv2.LINE_AA)
        confident = [(x, y) for x, y, score in points if score >= 0.22]
        if confident:
            x1 = min(point[0] for point in confident)
            y1 = min(point[1] for point in confident)
            label = f'POSE/{person_index + 1:02d}  F{frame_index:04d}'
            cv2.putText(
                frame, label, (x1, max(16, y1 - 8)), cv2.FONT_HERSHEY_SIMPLEX,
                max(0.34, width / 2500), (255, 244, 224), weight, cv2.LINE_AA,
            )


def render_clip(
    source: Path,
    destination: Path,
    detector: YoloPersonDetector | None,
    palette_index: int,
    mask_path: Path | None,
    analysis_path: Path | None,
    analysis_mode: str,
) -> None:
    capture = cv2.VideoCapture(str(source))
    if not capture.isOpened():
        raise RuntimeError(f"cannot open {source}")
    fps = float(capture.get(cv2.CAP_PROP_FPS)) or 24.0
    width = int(capture.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(capture.get(cv2.CAP_PROP_FRAME_HEIGHT))
    frame_count = int(capture.get(cv2.CAP_PROP_FRAME_COUNT))
    mask_capture = cv2.VideoCapture(str(mask_path)) if mask_path and mask_path.exists() else None
    analysis_capture = (
        cv2.VideoCapture(str(analysis_path))
        if analysis_path and analysis_path.exists() and analysis_path.suffix.lower() != '.json'
        else None
    )
    pose_frames = None
    if analysis_mode == 'pose' and analysis_path and analysis_path.suffix.lower() == '.json' and analysis_path.exists():
        pose_frames = json.loads(analysis_path.read_text(encoding='utf-8'))
    destination.parent.mkdir(parents=True, exist_ok=True)
    silent = destination.with_suffix('.silent.mp4')
    ffmpeg = subprocess.Popen((
        'ffmpeg', '-hide_banner', '-loglevel', 'error', '-y',
        '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-s', f'{width}x{height}', '-r', f'{fps:.6f}', '-i', '-',
        '-an', '-c:v', 'h264_nvenc', '-preset', 'p5', '-tune', 'hq', '-cq', '19', '-b:v', '0',
        '-pix_fmt', 'yuv420p', '-movflags', '+faststart', str(silent),
    ), stdin=subprocess.PIPE)
    tracker = PersonTracker()
    frame_index = 0
    while True:
        ok, frame = capture.read()
        if not ok:
            break
        mask_ok, mask_frame = mask_capture.read() if mask_capture is not None else (False, None)
        analysis_ok, analysis_frame = (
            analysis_capture.read() if analysis_capture is not None else (False, None)
        )
        detections = (
            detections_from_mask(mask_frame, width, height)
            if mask_ok and mask_frame is not None
            else detector.detect(frame) if detector is not None
            else []
        )
        tracks = tracker.update(detections)
        treated = solarize(frame, palette_index)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        gray = cv2.convertScaleAbs(gray, alpha=1.42, beta=-24)
        monochrome = cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR)
        subject_mask = None
        if mask_ok and mask_frame is not None:
            subject_mask = cv2.cvtColor(mask_frame, cv2.COLOR_BGR2GRAY)
            if subject_mask.shape[:2] != (height, width):
                subject_mask = cv2.resize(subject_mask, (width, height), interpolation=cv2.INTER_NEAREST)
            subject_mask = subject_mask > 48
        if analysis_ok and analysis_frame is not None:
            if analysis_frame.shape[:2] != (height, width):
                analysis_frame = cv2.resize(analysis_frame, (width, height), interpolation=cv2.INTER_LINEAR)
            if analysis_mode == 'depth':
                depth_gray = cv2.cvtColor(analysis_frame, cv2.COLOR_BGR2GRAY)
                depth_color = cv2.applyColorMap(depth_gray, cv2.COLORMAP_TURBO)
                if subject_mask is not None and np.any(subject_mask):
                    treated[subject_mask] = depth_color[subject_mask]
                else:
                    treated = cv2.addWeighted(treated, 0.48, depth_color, 0.52, 0)
            elif analysis_mode == 'pose':
                pose_luma = cv2.cvtColor(analysis_frame, cv2.COLOR_BGR2GRAY)
                pose_pixels = pose_luma > 22
                treated[pose_pixels] = np.maximum(treated[pose_pixels], analysis_frame[pose_pixels])
        if analysis_mode == 'pose' and pose_frames:
            draw_pose_etch(treated, pose_frames[min(frame_index, len(pose_frames) - 1)], frame_index)
        for track in tracks:
            x1, y1, x2, y2 = (int(round(value)) for value in track.box)
            pad_x = max(3, int((x2 - x1) * 0.025))
            pad_y = max(3, int((y2 - y1) * 0.02))
            x1, y1 = max(0, x1 - pad_x), max(0, y1 - pad_y)
            x2, y2 = min(width, x2 + pad_x), min(height, y2 + pad_y)
            if x2 <= x1 or y2 <= y1:
                continue
            if analysis_mode == 'box':
                treated[y1:y2, x1:x2] = monochrome[y1:y2, x1:x2]
            draw_corner_box(
                treated,
                (x1, y1, x2, y2),
                track.track_id,
                track.score,
                'person' if analysis_mode == 'box' else analysis_mode,
            )
        assert ffmpeg.stdin is not None
        ffmpeg.stdin.write(treated.tobytes())
        frame_index += 1
        if frame_index % max(1, round(fps * 2)) == 0:
            print(f"{source.name}: {frame_index}/{frame_count}", flush=True)
    capture.release()
    if mask_capture is not None:
        mask_capture.release()
    if analysis_capture is not None:
        analysis_capture.release()
    assert ffmpeg.stdin is not None
    ffmpeg.stdin.close()
    if ffmpeg.wait() != 0:
        raise RuntimeError(f"video encode failed for {source.name}")
    subprocess.run((
        'ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', str(silent), '-i', str(source),
        '-map', '0:v:0', '-map', '1:a?', '-c:v', 'copy', '-c:a', 'copy', '-shortest',
        '-movflags', '+faststart', str(destination),
    ), check=True)
    silent.unlink(missing_ok=True)
    print(f"wrote {destination}", flush=True)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('--model', type=Path)
    parser.add_argument('--source-dir', type=Path, required=True)
    parser.add_argument('--output-dir', type=Path, required=True)
    parser.add_argument('--mask-dir', type=Path)
    parser.add_argument('--analysis-dir', type=Path)
    parser.add_argument('clips', nargs='+')
    arguments = parser.parse_args()
    detector = YoloPersonDetector(arguments.model) if arguments.model else None
    for index, filename in enumerate(arguments.clips):
        mode = ANALYSIS_MODES.get(filename, 'box')
        analysis_path = (
            arguments.analysis_dir / mode / (
                f'{Path(filename).stem}.json' if mode == 'pose' else filename
            )
            if arguments.analysis_dir and mode in {'depth', 'pose'}
            else None
        )
        render_clip(
            arguments.source_dir / filename,
            arguments.output_dir / filename,
            detector,
            index,
            arguments.mask_dir / filename if arguments.mask_dir else None,
            analysis_path,
            mode,
        )
    return 0


if __name__ == '__main__':
    sys.exit(main())
