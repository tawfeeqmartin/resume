#!/usr/bin/env python3
"""Submit a BELIEVE subject-tracking mask job to workstation ComfyUI.

This is a control-plane client only. ComfyUI and all media processing run on
the Windows GPU workstation exposed through the local 8188 tunnel.
"""

from __future__ import annotations

import argparse
import ast
import json
from pathlib import Path
import time
import urllib.request
import uuid


def request_json(url: str, payload: dict | None = None) -> dict:
    body = None if payload is None else json.dumps(payload).encode('utf-8')
    request = urllib.request.Request(
        url,
        data=body,
        headers={'Content-Type': 'application/json'} if body is not None else {},
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.load(response)


def workflow(video: str, fps: float, prefix: str, prompt: str, analysis: str) -> dict:
    if analysis == 'depth':
        return {
            '1': {
                'class_type': 'VHS_LoadVideo',
                'inputs': {
                    'video': video, 'force_rate': 0, 'custom_width': 0, 'custom_height': 0,
                    'frame_load_cap': 0, 'skip_first_frames': 0, 'select_every_nth': 1,
                    'format': 'AnimateDiff',
                },
            },
            '2': {
                'class_type': 'Sapiens2Loader',
                'inputs': {'checkpoint': 'sapiens2_0.4b_pointmap.safetensors'},
            },
            '3': {
                'class_type': 'Sapiens2PointmapViz',
                'inputs': {'image': ['1', 0], 'sapiens2_model': ['2', 0], 'frames_per_batch': 8},
            },
            '4': {'class_type': 'CreateVideo', 'inputs': {'images': ['3', 0], 'fps': fps, 'bit_depth': 8}},
            '5': {
                'class_type': 'SaveVideo',
                'inputs': {'video': ['4', 0], 'filename_prefix': prefix, 'format': 'mp4', 'codec': 'h264'},
            },
        }
    if analysis == 'pose':
        return {
            '1': {
                'class_type': 'VHS_LoadVideo',
                'inputs': {
                    'video': video, 'force_rate': 0, 'custom_width': 0, 'custom_height': 0,
                    'frame_load_cap': 0, 'skip_first_frames': 0, 'select_every_nth': 1,
                    'format': 'AnimateDiff',
                },
            },
            '2': {
                'class_type': 'CheckpointLoaderSimple',
                'inputs': {'ckpt_name': 'sam3.1_multiplex_fp16.safetensors'},
            },
            '3': {'class_type': 'CLIPTextEncode', 'inputs': {'text': 'person, human', 'clip': ['2', 1]}},
            '4': {
                'class_type': 'SAM3_Detect',
                'inputs': {
                    'model': ['2', 0], 'image': ['1', 0], 'conditioning': ['3', 0],
                    'threshold': 0.34, 'refine_iterations': 0, 'individual_masks': False,
                },
            },
            '5': {
                'class_type': 'Sapiens2Loader',
                'inputs': {'checkpoint': 'sapiens2_0.4b_pose.safetensors'},
            },
            '6': {
                'class_type': 'Sapiens2Pose',
                'inputs': {
                    'image': ['1', 0], 'sapiens2_model': ['5', 0], 'bboxes': ['4', 1],
                    'output_format': 'openpose', 'include_face': False, 'frames_per_batch': 8,
                },
            },
            '7': {
                'class_type': 'Sapiens2DrawPose',
                'inputs': {
                    'keypoints': ['6', 0], 'draw_skeleton': True, 'draw_points': True,
                    'draw_face': False, 'point_radius': 2, 'stick_width': 2,
                    'score_threshold': 0.25,
                },
            },
            '8': {'class_type': 'CreateVideo', 'inputs': {'images': ['7', 0], 'fps': fps, 'bit_depth': 8}},
            '9': {
                'class_type': 'SaveVideo',
                'inputs': {'video': ['8', 0], 'filename_prefix': prefix, 'format': 'mp4', 'codec': 'h264'},
            },
        }
    return {
        '1': {
            'class_type': 'CheckpointLoaderSimple',
            'inputs': {'ckpt_name': 'sam3.1_multiplex_fp16.safetensors'},
        },
        '2': {
            'class_type': 'VHS_LoadVideo',
            'inputs': {
                'video': video,
                'force_rate': 0,
                'custom_width': 0,
                'custom_height': 0,
                'frame_load_cap': 0,
                'skip_first_frames': 0,
                'select_every_nth': 1,
                'format': 'AnimateDiff',
            },
        },
        '3': {
            'class_type': 'CLIPTextEncode',
            'inputs': {'text': prompt, 'clip': ['1', 1]},
        },
        '4': {
            'class_type': 'SAM3_VideoTrack',
            'inputs': {
                'images': ['2', 0],
                'model': ['1', 0],
                'conditioning': ['3', 0],
                'detection_threshold': 0.34,
                'max_objects': 4,
                'detect_interval': 3,
            },
        },
        '5': {
            'class_type': 'SAM3_TrackToMask',
            'inputs': {'track_data': ['4', 0], 'object_indices': ''},
        },
        '6': {
            'class_type': 'MaskToImage',
            'inputs': {'mask': ['5', 0]},
        },
        '7': {
            'class_type': 'CreateVideo',
            'inputs': {'images': ['6', 0], 'fps': fps, 'bit_depth': 8},
        },
        '8': {
            'class_type': 'SaveVideo',
            'inputs': {
                'video': ['7', 0],
                'filename_prefix': prefix,
                'format': 'mp4',
                'codec': 'h264',
            },
        },
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('--server', default='http://127.0.0.1:8188')
    parser.add_argument('--video', required=True, help='Path relative to ComfyUI input')
    parser.add_argument('--fps', type=float, required=True)
    parser.add_argument('--prefix', required=True)
    parser.add_argument('--prompt', default='person, human')
    parser.add_argument('--analysis', choices=('sam3', 'depth', 'pose'), default='sam3')
    parser.add_argument(
        '--keypoints-output',
        type=Path,
        help='For pose jobs, save Sapiens/OpenPose keypoints even if the preview drawer fails.',
    )
    arguments = parser.parse_args()
    client_id = str(uuid.uuid4())
    queued = request_json(
        f'{arguments.server}/prompt',
        {
            'prompt': workflow(
                arguments.video,
                arguments.fps,
                arguments.prefix,
                arguments.prompt,
                arguments.analysis,
            ),
            'client_id': client_id,
        },
    )
    prompt_id = queued['prompt_id']
    print(f'queued {prompt_id}', flush=True)
    while True:
        history = request_json(f'{arguments.server}/history/{prompt_id}')
        if prompt_id in history:
            record = history[prompt_id]
            status = record.get('status', {})
            if status.get('status_str') == 'error':
                if arguments.analysis == 'pose' and arguments.keypoints_output:
                    for message_type, payload in reversed(status.get('messages', [])):
                        if message_type != 'execution_error':
                            continue
                        raw = payload.get('current_inputs', {}).get('keypoints')
                        if not raw:
                            continue
                        # Sapiens completed successfully; only ComfyUI's tqdm-based
                        # preview drawer failed on the Windows logger. Preserve the
                        # model output as portable JSON for the WSL compositor.
                        keypoints = ast.literal_eval(raw[0])
                        arguments.keypoints_output.parent.mkdir(parents=True, exist_ok=True)
                        arguments.keypoints_output.write_text(
                            json.dumps(keypoints, separators=(',', ':')),
                            encoding='utf-8',
                        )
                        print(json.dumps({
                            'prompt_id': prompt_id,
                            'keypoints_output': str(arguments.keypoints_output),
                            'frames': len(keypoints),
                        }, indent=2))
                        return 0
                raise RuntimeError(json.dumps(status, indent=2))
            outputs = record.get('outputs', {})
            print(json.dumps({'prompt_id': prompt_id, 'outputs': outputs}, indent=2))
            return 0
        time.sleep(2)


if __name__ == '__main__':
    raise SystemExit(main())
