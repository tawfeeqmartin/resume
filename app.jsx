const PRODUCTION_MEDIA_ORIGIN = "https://media.tawfeeqmartin.com";
const IS_LOCAL_PREVIEW = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname);
const IS_LAN_PREVIEW = IS_LOCAL_PREVIEW
  || /^10\./.test(window.location.hostname)
  || /^192\.168\./.test(window.location.hostname)
  || /^172\.(1[6-9]|2\d|3[01])\./.test(window.location.hostname);
const IS_CLOUDFLARE_PREVIEW = /\.pages\.dev$/i.test(window.location.hostname);
const COMPANION_GATE_ENABLED = (IS_LAN_PREVIEW || IS_CLOUDFLARE_PREVIEW)
  && new URLSearchParams(window.location.search).get('companion') === '1';
const MAC_WAIT_FOR_KEYBOARD = true;
if (typeof window !== 'undefined') {
  window.__resumeCompanionGateEnabled = COMPANION_GATE_ENABLED;
  window.__resumeMacWaitForKeyboard = MAC_WAIT_FOR_KEYBOARD;
}
const COMPANION_SESSION_STORAGE_KEY = 'resume.companion.session.v1';
const ENABLE_LOCAL_VOICE_OVER = IS_LOCAL_PREVIEW;
const isResumeForeground = () => {
  // The local browser harness deliberately runs in a background tab. Keep the
  // production visibility gate intact while allowing `desktopTest=1` to test
  // the real interaction/audio state machine deterministically.
  if (IS_LOCAL_PREVIEW
    && new URLSearchParams(window.location.search).get('desktopTest') === '1') {
    return true;
  }
  if (document.hidden) return false;
  return typeof window.__resumeIsPageActive === 'function'
    ? window.__resumeIsPageActive()
    : document.hasFocus();
};
const mediaUrl = (path) => {
  if (IS_LOCAL_PREVIEW) return path;
  return `${PRODUCTION_MEDIA_ORIGIN}/${path.replace(/^media\//, '')}`;
};
const sameOriginMediaUrl = (path) => path;
const withCacheKey = (url, key) => `${url}${url.includes('?') ? '&' : '?'}v=${key}`;
const TV_CLIP_CACHE_KEY = '20260522-bass-track-no-laugh';
const VOCAL_SAMPLE_CACHE_KEY = '20260522-vocal-rotation-no-laugh';
const SITE_MODE_STORAGE_KEY = 'resume.desktop.mode';
const RESUME_APP_VARIANT = (() => {
  const value = String(window.RESUME_APP_VARIANT || '').trim().toLowerCase();
  if (value === 'landing-v1' || value === 'landing-v2' || value === 'resume') return value;
  return 'legacy';
})();
try {
  document.documentElement.dataset.resumeVariant = RESUME_APP_VARIANT;
} catch (_) {}
const IS_MOBILE_MEDIA_TARGET = window.matchMedia('(max-width: 760px)').matches;
const helpMeshSource = (path) => ({
  videoUrl: sameOriginMediaUrl(path),
  projectionUrl: sameOriginMediaUrl(path),
  requireMesh: true,
});
const HELP_FULL_MESH_SOURCE = helpMeshSource("media/help_full.webm");
// HELP must either render through the decoded Google Spotlight MESH
// projection or fail closed. Showing the native encoded layout looks
// broken, so there is intentionally no MP4/raw inline fallback here.
const HELP_DESKTOP_SOURCES = [
  HELP_FULL_MESH_SOURCE,
];
const HELP_MOBILE_SOURCES = [
  HELP_FULL_MESH_SOURCE,
];
const HELP_VIDEO_URLS = IS_MOBILE_MEDIA_TARGET
  ? HELP_MOBILE_SOURCES
  : HELP_DESKTOP_SOURCES;
const BLACKBIRD_INNOVATION_VIDEO_URL = mediaUrl("media/blackbird-innovation.mp4");
const BLACKBIRD_VIDEO_URL = mediaUrl("media/blackbird.mp4");
const HAND_OF_GOD_DEMO_URL = sameOriginMediaUrl("media/interactive/hand-of-god.html");
const KISS_NEW_ERA_VIDEO_URL = sameOriginMediaUrl("media/kiss-a-new-era-720.mp4");
const KISS_NEW_ERA_POSTER_URL = sameOriginMediaUrl("media/kiss-a-new-era-poster.jpg");
const HUMAN_RACE_VIDEO_URL = mediaUrl("media/blackbird-original-16x9.mp4");
const HUMAN_RACE_POSTER_URL = mediaUrl("media/human-race-poster.jpg");
const CONNECTION_HINT = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
const PREFERS_REDUCED_VIDEO_BANDWIDTH = Boolean(
  CONNECTION_HINT?.saveData || /(^|-)2g$|3g/.test(String(CONNECTION_HINT?.effectiveType || ''))
);
const LOUIS_VUITTON_SS20_VIDEO_URL = mediaUrl(
  "media/louis-vuitton-ss20-720.mp4"
);
const LOUIS_VUITTON_SS20_POSTER_URL = mediaUrl("media/louis-vuitton-ss20-poster.jpg");

const CLEARED_TRAILER_GROUPS = [
  {
    slug: 'mandalorian-grogu',
    project: 'The Mandalorian and Grogu',
    takes: [
      31, 69, 70, 1, 10, 11, 12, 13, 14, 17, 18, 21, 25, 26, 27, 28, 29, 34, 38, 39,
      41, 47, 49, 51, 53, 54, 58, 59, 60, 61, 62, 63, 64, 65, 66,
      67, 68, 69,
    ],
    weight: 18,
    lanes: ['kick', 'snare', 'bass', 'lead', 'switch', 'angel', 'idle', 'init'],
  },
  {
    slug: 'mandalorian-s3',
    project: 'The Mandalorian Season 3',
    sourceUrl: 'https://www.youtube.com/watch?v=Znsa4Deavgg',
    takes: [5, 7, 8],
    weight: 5,
    lanes: ['kick', 'snare', 'bass', 'lead', 'lift', 'switch', 'angel', 'idle', 'init'],
  },
  {
    slug: 'obi-wan',
    project: 'Obi-Wan Kenobi',
    sourceUrl: 'https://www.youtube.com/watch?v=3Yh_6_zItPU',
    takes: [7],
    weight: 5,
    lanes: ['kick', 'snare', 'bass', 'lead', 'lift', 'build', 'ghost', 'idle', 'init'],
  },
  {
    slug: 'joker',
    project: 'Joker: Folie A Deux',
    takes: [5, 6, 7, 8, 9],
    reelGroup: 'guest',
    weight: 6,
    lanes: ['snare', 'lead', 'lift', 'ghost', 'idle'],
  },
  {
    slug: 'creator',
    project: 'The Creator',
    takes: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    reelGroup: 'guest',
    weight: 5,
    lanes: ['snare', 'bass', 'lead', 'lift', 'switch', 'angel', 'idle'],
  },
  {
    slug: 'andor-s2',
    project: 'Andor Season 2',
    sourceUrl: 'https://www.youtube.com/watch?v=QHAu5XHsDhQ',
    takes: [6],
    weight: 9,
    lanes: ['kick', 'snare', 'bass', 'lead', 'lift', 'build', 'ghost', 'idle', 'init'],
  },
  {
    slug: 'big-bold',
    project: 'A Big Bold Beautiful Journey',
    takes: [2, 4],
    reelGroup: 'guest',
    weight: 5,
    lanes: ['kick', 'snare', 'lead', 'lift', 'ghost', 'idle'],
  },
];
// Sources with more dead bars baked into the trailer file get an extra
// punch-in on the Mac so the cinematic content fills the CRT.
const CLEARED_TRAILER_PUNCH_IN = { creator: 1.34 };
const CLIP_GROUP_EDIT_TAGS = {
  'mandalorian-grogu': ['star-wars', 'iconic', 'action', 'epic', 'motion'],
  'mandalorian-s3': ['star-wars', 'action', 'saber', 'impact'],
  'obi-wan': ['star-wars', 'saber', 'character', 'impact'],
  joker: ['guest', 'noir', 'close', 'screen', 'shatter'],
  creator: ['guest', 'scale', 'wide', 'vehicle', 'action'],
  'andor-s2': ['star-wars', 'silhouette', 'character', 'atmosphere'],
  'big-bold': ['guest', 'warm', 'character', 'gesture'],
};
const CLIP_TAKE_EDIT_TAGS = {
  'mandalorian-grogu': {
    31: ['hero', 'creature', 'wide', 'scale'],
    69: ['hero', 'creature', 'wide', 'scale'],
    70: ['hero', 'creature', 'wide', 'impact'],
    1: ['establishing', 'wide'],
    10: ['saber', 'action', 'character'],
    11: ['saber', 'action', 'character'],
    12: ['saber', 'action', 'character'],
    13: ['saber', 'action', 'character'],
    14: ['saber', 'action', 'character'],
    17: ['saber', 'action', 'impact'],
    18: ['saber', 'action', 'impact'],
    21: ['saber', 'action', 'impact'],
    25: ['vehicle', 'wide', 'motion'],
    26: ['vehicle', 'wide', 'motion'],
    27: ['vehicle', 'wide', 'motion'],
    28: ['vehicle', 'wide', 'motion'],
    29: ['vehicle', 'wide', 'motion'],
    34: ['close', 'character', 'gesture'],
    38: ['close', 'character', 'gesture'],
    39: ['close', 'character', 'gesture'],
    41: ['close', 'character', 'gesture'],
    47: ['close', 'character', 'gesture'],
    49: ['close', 'character', 'gesture'],
    51: ['close', 'character', 'gesture'],
    53: ['creature', 'wide', 'scale'],
    54: ['creature', 'wide', 'scale'],
    58: ['vehicle', 'space', 'wide', 'motion'],
    59: ['vehicle', 'space', 'wide', 'motion'],
    60: ['vehicle', 'space', 'wide', 'motion'],
    61: ['vehicle', 'space', 'wide', 'motion'],
    62: ['vehicle', 'space', 'wide', 'motion'],
    63: ['vehicle', 'space', 'wide', 'motion'],
    64: ['vehicle', 'space', 'wide', 'motion'],
    65: ['vehicle', 'space', 'wide', 'motion'],
    66: ['vehicle', 'space', 'wide', 'motion'],
    67: ['vehicle', 'space', 'wide', 'motion'],
    68: ['vehicle', 'space', 'wide', 'motion'],
  },
  'mandalorian-s3': {
    5: ['action', 'impact', 'wide'],
    7: ['saber', 'character', 'impact'],
    8: ['vehicle', 'wide', 'motion'],
  },
  'obi-wan': {
    7: ['saber', 'character', 'impact'],
  },
  joker: {
    5: ['screen', 'close', 'noir'],
    6: ['shatter', 'impact', 'gesture'],
    7: ['silhouette', 'wide', 'noir'],
    8: ['close', 'character', 'noir'],
    9: ['impact', 'gesture', 'noir'],
  },
  creator: {
    5: ['wide', 'scale', 'impact'],
    6: ['vehicle', 'motion', 'wide'],
    7: ['object', 'tech', 'close'],
    8: ['wide', 'scale', 'silhouette'],
    9: ['vehicle', 'action', 'motion'],
    10: ['explosion', 'impact', 'wide'],
    11: ['vehicle', 'water', 'motion'],
    12: ['action', 'water', 'impact'],
    13: ['vehicle', 'wide', 'motion'],
    14: ['silhouette', 'explosion', 'impact'],
  },
  'andor-s2': {
    6: ['character', 'silhouette', 'atmosphere'],
  },
  'big-bold': {
    2: ['warm', 'character', 'gesture'],
    4: ['warm', 'wide', 'atmosphere'],
  },
};
const getClipEditTags = (group, takeId) => [
  ...(CLIP_GROUP_EDIT_TAGS[group.slug] || []),
  ...(CLIP_TAKE_EDIT_TAGS[group.slug]?.[takeId] || []),
];
const getClipShotSize = (tags) => {
  if (tags.includes('close')) return 'close';
  if (tags.includes('wide') || tags.includes('scale')) return 'wide';
  return 'medium';
};
const getClipEnergy = (tags) => {
  if (tags.includes('impact') || tags.includes('explosion')) return 5;
  if (tags.includes('action') || tags.includes('motion') || tags.includes('saber')) return 4;
  if (tags.includes('gesture') || tags.includes('screen') || tags.includes('vehicle')) return 3;
  if (tags.includes('atmosphere') || tags.includes('warm')) return 2;
  return 3;
};
const CLEARED_TRAILER_SOURCES = CLEARED_TRAILER_GROUPS.flatMap((group) => {
  const skipped = new Set(group.skip || []);
  const takes = Array.isArray(group.takes)
    ? group.takes
    : Array.from({ length: group.takes || 4 }, (_, index) => index + 1);
  return takes.map((takeId) => {
    if (skipped.has(takeId)) return null;
    const take = String(takeId).padStart(2, '0');
    const visualTags = getClipEditTags(group, takeId);
    return {
      url: withCacheKey(mediaUrl(`media/tv-clips/cleared-${group.slug}-${take}.mp4`), TV_CLIP_CACHE_KEY),
      kind: 'video',
      fit: 'contain',
      matteAspect: 2.39,
      punchIn: CLEARED_TRAILER_PUNCH_IN[group.slug] || 1,
      visualTags,
      shotSize: getClipShotSize(visualTags),
      energy: getClipEnergy(visualTags),
      optional: true,
      project: group.project,
      cue: `cleared trailer phrase ${take}`,
      sampleKey: `${group.slug}-trailer-${take}`,
      sourceUrl: group.sourceUrl || '',
      reelGroup: group.reelGroup || 'star-wars',
      weight: group.weight,
      lanes: group.lanes,
    };
  }).filter(Boolean);
});
const CURATED_VOCAL_LINES = [
  {
    file: 'vocal-mando-stand-for.m4a',
    project: 'The Mandalorian Season 3',
    cue: 'What do we stand for',
    sampleKey: 'vocal-mando-stand-for',
    responseSampleKey: 'vocal-mando-way-01',
    callPhrases: [
      { label: 'What do we stand for?', offset: 0, duration: 2.18, gain: 0.74 },
    ],
    callPattern: [
      { target: 'selected', beat: 0, mode: 'call', pan: -0.08 },
    ],
    phrase: { label: 'What do we stand for?', offset: 0, duration: 2.18, gain: 0.88 },
    chops: [
      { label: 'what do we stand for', offset: 0, duration: 2.18, gain: 0.56, rate: 0.98 },
    ],
  },
  {
    file: 'vocal-mando-way-01.m4a',
    project: 'The Mandalorian Season 3',
    cue: 'This is the way',
    sampleKey: 'vocal-mando-way-01',
    answerPhrases: [
      { label: 'This is the way.', offset: 0, duration: 1.3, gain: 0.78 },
    ],
    answerPattern: [
      { target: 'selected', beat: 0.25, mode: 'answer', pan: 0.08, rate: 0.98 },
    ],
    phrase: { label: 'This is the way.', offset: 0, duration: 1.3, gain: 0.9 },
    chops: [
      { label: 'this is the way', offset: 0, duration: 1.3, gain: 0.64, rate: 0.96 },
    ],
  },
  {
    file: 'vocal-obi-kenobi-gone.m4a',
    project: 'Obi-Wan Kenobi',
    cue: "Kenobi is gone",
    sampleKey: 'vocal-obi-kenobi-gone',
    answerPhrases: [
      { label: "It's gone.", offset: 0, duration: 2, gain: 0.5 },
    ],
    answerPattern: [
      { target: 'selected', beat: 0.25, mode: 'answer', pan: -0.1, texture: 'dust' },
    ],
    phrase: { label: "It's gone.", offset: 0, duration: 2, gain: 0.62 },
    chops: [
      { label: "it's gone", offset: 0, duration: 2, gain: 0.42, rate: 0.94 },
    ],
  },
  {
    file: 'vocal-obi-cant-run.m4a',
    project: 'Obi-Wan Kenobi',
    cue: "You can't run",
    sampleKey: 'vocal-obi-cant-run',
    answerPhrases: [
      { label: "You can't escape.", offset: 5.82, duration: 1.7, gain: 0.68 },
    ],
    answerPattern: [
      { target: 'selected', beat: 0.25, mode: 'answer', pan: 0.1, rate: 0.98 },
    ],
    phrase: { label: "You can't escape him.", offset: 5.82, duration: 1.7, gain: 0.8 },
    chops: [
      { label: "you can't escape", offset: 5.82, duration: 1.7, gain: 0.54, rate: 0.96 },
    ],
  },
  {
    file: 'vocal-andor-revolution.m4a',
    project: 'Andor Season 2',
    cue: 'Rebellion starts now',
    sampleKey: 'vocal-andor-revolution',
    responseSampleKey: 'vocal-andor-fight',
    phrase: { label: 'Rebellion starts now.', offset: 0, duration: 2.96, gain: 0.58 },
  },
  {
    file: 'vocal-andor-fight.m4a',
    project: 'Andor Season 2',
    cue: "You're ready to fight",
    sampleKey: 'vocal-andor-fight',
    answerPhrases: [
      { label: "You're here, and you're ready to fight.", offset: 5.32, duration: 2.5, gain: 0.66 },
      { label: 'Remember this moment.', offset: 0, duration: 1.36, gain: 0.58 },
    ],
    answerPattern: [
      { label: 'remember this moment', beat: 0, mode: 'chop', pan: -0.16, texture: 'ghost', gain: 0.78 },
      { label: "you're ready to fight", beat: 2.5, mode: 'chop', pan: 0.14, rate: 0.96 },
      { target: 'selected', beat: 4.25, mode: 'answer', pan: 0.02 },
    ],
    phrase: { label: "You're here, and you're ready to fight.", offset: 5.32, duration: 2.5, gain: 0.78 },
    chops: [
      { label: 'remember this moment', offset: 0, duration: 1.36, gain: 0.46, rate: 0.96 },
      { label: "you're ready to fight", offset: 7, duration: 0.84, gain: 0.56, rate: 0.94 },
    ],
  },
  {
    file: 'vocal-jobs-secrets-life-clean.m4a',
    project: 'Steve Jobs Secrets of Life',
    sourceUrl: 'https://www.youtube.com/watch?v=kYfNvmF0Bqw&t=39s',
    cue: 'Build your own things',
    sampleKey: 'vocal-jobs-secrets-life',
    volume: 0.88,
    priority: 4,
    breakdownModes: ['answer', 'rest', 'chop', 'rest'],
    callPhrases: [
      { label: 'Life can be much broader once you discover one simple fact.', offset: 2.72, duration: 3.44, gain: 0.68 },
      { label: 'Everything around you that you call life was made up by people that were no smarter than you.', offset: 7.2, duration: 6.18, gain: 0.72 },
      { label: 'You can change it. You can influence it.', offset: 14.02, duration: 2.42, gain: 0.7 },
      { label: 'Can poke life.', offset: 22.76, duration: 1.12, gain: 0.62 },
    ],
    callPattern: [
      { target: 'selected', beat: 0, mode: 'call', pan: -0.06 },
      { label: 'change it', beat: 5.5, mode: 'chop', pan: 0.18, texture: 'ghost', gain: 0.58, rate: 1.04 },
    ],
    answerPhrases: [
      { label: 'You can build your own things that other people can use.', offset: 16.7, duration: 3.32, gain: 0.84 },
      { label: 'Other people can use.', offset: 18.72, duration: 1.3, gain: 0.66 },
      { label: 'You can change it. You can mold it.', offset: 28.22, duration: 2.08, gain: 0.66 },
    ],
    answerPattern: [
      { label: 'made up by people', beat: 0, mode: 'chop', pan: -0.18, rate: 1.02 },
      { label: 'made up by people', beat: 1.25, mode: 'chop', pan: 0.16, rate: 1.08, texture: 'dust', gain: 0.72 },
      { label: 'no smarter than you', beat: 2.75, mode: 'chop', pan: -0.05, rate: 0.96 },
      { target: 'selected', beat: 4.5, mode: 'answer', pan: 0.04 },
    ],
    phrases: [
      { label: 'Everything around you that you call life was made up by people that were no smarter than you.', offset: 7.2, duration: 6.18, gain: 0.82 },
      { label: 'You can build your own things that other people can use.', offset: 16.7, duration: 3.32, gain: 0.92 },
      { label: 'You can change it. You can influence it.', offset: 14.02, duration: 2.42, gain: 0.82 },
      { label: 'Life can be much broader once you discover one simple fact.', offset: 2.72, duration: 3.44, gain: 0.76 },
      { label: 'Poke life, push in, and something can pop out the other side.', offset: 21.4, duration: 6.56, gain: 0.72 },
    ],
    phrase: { label: 'You can build your own things that other people can use.', offset: 16.7, duration: 3.32, gain: 0.92 },
    chopPattern: [
      { label: 'made up by people', beat: 0 },
      { label: 'made up by people', beat: 1 },
      { label: 'no smarter than you', beat: 2.5 },
      { label: 'change it', beat: 4.5 },
      { label: 'build your own things', beat: 6 },
      { label: 'other people can use', beat: 8 },
    ],
    chopLandingBeat: 10.5,
    chops: [
      { label: 'made up by people', offset: 10.0, duration: 1.28, gain: 0.52, rate: 1.0 },
      { label: 'no smarter than you', offset: 11.78, duration: 1.58, gain: 0.52, rate: 0.96 },
      { label: 'change it', offset: 14.64, duration: 0.72, gain: 0.5, rate: 1.04 },
      { label: 'build your own things', offset: 17.36, duration: 1.18, gain: 0.58, rate: 1.0 },
      { label: 'other people can use', offset: 18.72, duration: 1.3, gain: 0.5, rate: 0.92 },
    ],
  },
  {
    file: 'vocal-kanye-answers-sway-clean.m4a',
    project: 'Kanye West / Sway interview clip',
    sourceUrl: 'https://www.youtube.com/watch?v=2RcAzPMhdB0',
    cue: "You ain't got the answers",
    sampleKey: 'vocal-kanye-answers-sway',
    volume: 0.66,
    priority: 3,
    callPhrases: [
      { label: "You ain't got the answers.", offset: 8.72, duration: 1.12, gain: 0.58 },
    ],
    callPattern: [
      { target: 'selected', beat: 0, mode: 'call', pan: -0.12 },
      { label: "you ain't got the answer", beat: 2.25, mode: 'chop', pan: 0.14, texture: 'ghost', gain: 0.72, rate: 1.06 },
    ],
    answerPhrases: [
      { label: "I've been doing this more than you.", offset: 13.92, duration: 2.08, gain: 0.58 },
      { label: "You ain't been doing the education.", offset: 21.88, duration: 1.6, gain: 0.52 },
    ],
    answerPattern: [
      { label: "you ain't got the answer", beat: 0, mode: 'chop', pan: -0.2, rate: 1.04 },
      { label: 'got the answers', beat: 1.5, mode: 'chop', pan: 0.15, rate: 0.98 },
      { label: 'education', beat: 2.75, mode: 'chop', pan: -0.02, texture: 'dust', gain: 0.72, rate: 0.94 },
      { target: 'selected', beat: 4.25, mode: 'answer', pan: 0.08 },
    ],
    phrases: [
      { label: "You ain't got the answers, man.", offset: 6.96, duration: 1.46, gain: 0.66 },
      { label: "You ain't got the answers.", offset: 8.72, duration: 1.12, gain: 0.66 },
      { label: "I've been doing this more than you.", offset: 13.92, duration: 2.08, gain: 0.64 },
      { label: "You ain't been doing the education.", offset: 21.88, duration: 1.6, gain: 0.6 },
      { label: "You don't have the answers.", offset: 26.2, duration: 0.92, gain: 0.58 },
    ],
    phrase: { label: "I've been doing this more than you.", offset: 13.92, duration: 2.08, gain: 0.64 },
    chops: [
      { label: "you ain't got the answer", offset: 8.72, duration: 1.12, gain: 0.42, rate: 1.02 },
      { label: 'got the answers', offset: 10.66, duration: 0.96, gain: 0.4, rate: 0.96 },
      { label: 'education', offset: 22.4, duration: 1.08, gain: 0.38, rate: 0.92 },
    ],
  },
  {
    file: 'vocal-jobs-crazy-ones.m4a',
    project: 'Apple Think Different',
    sourceUrl: 'https://www.youtube.com/watch?v=-z4NS2zdrZc',
    cue: 'Change things',
    sampleKey: 'vocal-jobs-crazy-ones',
    volume: 0.78,
    priority: 3,
    callPhrases: [
      { label: 'Here is to the crazy ones.', offset: 3.96, duration: 2.62, gain: 0.62 },
      { label: 'The ones who see things differently.', offset: 15.94, duration: 2.24, gain: 0.68 },
      { label: 'The misfits, the rebels, the troublemakers.', offset: 6.78, duration: 5.38, gain: 0.58 },
      { label: 'The round pegs in the square holes.', offset: 12.36, duration: 3.2, gain: 0.58 },
      { label: 'You can quote them, disagree with them.', offset: 24.64, duration: 2.86, gain: 0.58 },
      { label: 'The only thing you cannot do is ignore them.', offset: 30.84, duration: 2.78, gain: 0.62 },
      { label: 'The people who are crazy enough to think they can change the world.', offset: 47.54, duration: 4.72, gain: 0.68 },
    ],
    callPattern: [
      { target: 'selected', beat: 0, mode: 'call', pan: -0.08 },
      { label: 'round pegs', beat: 4.25, mode: 'chop', pan: 0.16, texture: 'ghost', gain: 0.68, rate: 1.02 },
      { label: 'square holes', beat: 5.25, mode: 'chop', pan: -0.12, texture: 'dust', gain: 0.66, rate: 0.96 },
      { label: 'status quo', beat: 6.5, mode: 'chop', pan: 0.12, texture: 'ghost', gain: 0.58, rate: 1.04 },
    ],
    answerPhrases: [
      { label: 'Ignore them, because they change things.', offset: 32.72, duration: 3.28, gain: 0.72 },
      { label: 'Because they change things.', offset: 34.26, duration: 1.82, gain: 0.72 },
      { label: 'They push the human race forward.', offset: 36.62, duration: 3.84, gain: 0.7 },
      { label: 'We see genius.', offset: 44.32, duration: 3.05, gain: 0.62 },
      { label: 'They can change the world.', offset: 49.48, duration: 2.82, gain: 0.68 },
    ],
    answerPattern: [
      { label: 'ignore them', beat: 0, mode: 'chop', pan: -0.18, texture: 'ghost', gain: 0.72, rate: 1.02 },
      { label: 'change things', beat: 1.25, mode: 'chop', pan: 0.14, gain: 0.72, rate: 1.02 },
      { label: 'human race', beat: 2.5, mode: 'chop', pan: -0.08, texture: 'dust', gain: 0.68, rate: 0.96 },
      { label: 'genius', beat: 3.5, mode: 'chop', pan: 0.18, texture: 'ghost', gain: 0.58, rate: 1.08 },
      { target: 'selected', beat: 4.75, mode: 'answer', pan: 0.02 },
    ],
    phrases: [
      { label: 'Here is to the crazy ones.', offset: 3.96, duration: 2.62, gain: 0.72 },
      { label: 'The misfits, the rebels, the troublemakers.', offset: 6.78, duration: 5.38, gain: 0.68 },
      { label: 'The round pegs in the square holes.', offset: 12.36, duration: 3.2, gain: 0.68 },
      { label: 'The ones who see things differently.', offset: 15.94, duration: 2.24, gain: 0.78 },
      { label: 'They have no respect for the status quo.', offset: 20.84, duration: 3.2, gain: 0.66 },
      { label: 'You can quote them, disagree with them.', offset: 24.64, duration: 2.86, gain: 0.68 },
      { label: 'Glorify or vilify them.', offset: 27.58, duration: 1.78, gain: 0.64 },
      { label: 'The only thing you cannot do is ignore them.', offset: 30.84, duration: 2.78, gain: 0.72 },
      { label: 'Because they change things.', offset: 34.26, duration: 1.82, gain: 0.82 },
      { label: 'They push the human race forward.', offset: 36.62, duration: 3.84, gain: 0.8 },
      { label: 'We see genius.', offset: 44.32, duration: 3.05, gain: 0.7 },
      { label: 'The people who are crazy enough to think they can change the world.', offset: 47.54, duration: 4.72, gain: 0.78 },
      { label: 'They can change the world.', offset: 49.48, duration: 2.82, gain: 0.78 },
    ],
    phrase: { label: 'Because they change things.', offset: 34.26, duration: 1.82, gain: 0.82 },
    chopPattern: [
      { label: 'crazy ones', beat: 0, pan: -0.16, rate: 0.98 },
      { label: 'the misfits', beat: 0.75, pan: 0.14, texture: 'ghost', gain: 0.76, rate: 1.04 },
      { label: 'the rebels', beat: 1.5, pan: -0.08, rate: 0.98 },
      { label: 'the troublemakers', beat: 2.25, pan: 0.18, texture: 'dust', gain: 0.72, rate: 1.06 },
      { label: 'round pegs', beat: 3.5, pan: -0.12, rate: 1.0 },
      { label: 'square holes', beat: 4.25, pan: 0.12, texture: 'ghost', gain: 0.72, rate: 0.94 },
      { label: 'status quo', beat: 5.75, pan: -0.16, texture: 'dust', gain: 0.66, rate: 1.04 },
      { label: 'quote them', beat: 6.5, pan: 0.14, gain: 0.62, rate: 0.98 },
      { label: 'disagree with them', beat: 7.25, pan: -0.04, texture: 'ghost', gain: 0.62, rate: 1.02 },
      { label: 'glorify', beat: 8.25, pan: 0.16, gain: 0.58, rate: 1.08 },
      { label: 'vilify them', beat: 9, pan: -0.12, texture: 'dust', gain: 0.58, rate: 0.96 },
      { label: 'ignore them', beat: 10.25, pan: 0.08, gain: 0.68, rate: 1.0 },
      { label: 'change things', beat: 11.25, pan: -0.16, gain: 0.74, rate: 1.02 },
      { label: 'genius', beat: 12.5, pan: 0.18, texture: 'ghost', gain: 0.62, rate: 1.08 },
      { label: 'change the world', beat: 13.25, pan: 0.02, gain: 0.72, rate: 0.96 },
    ],
    chopLandingBeat: 14.75,
    chops: [
      { label: 'crazy ones', offset: 4.56, duration: 1.9, gain: 0.42, rate: 0.98 },
      { label: 'the misfits', offset: 6.78, duration: 0.92, gain: 0.48, rate: 1.03 },
      { label: 'the rebels', offset: 8.66, duration: 0.52, gain: 0.5, rate: 0.98 },
      { label: 'the troublemakers', offset: 10.4, duration: 0.9, gain: 0.46, rate: 1.08 },
      { label: 'round pegs', offset: 12.36, duration: 0.72, gain: 0.46, rate: 1.0 },
      { label: 'square holes', offset: 14.76, duration: 0.82, gain: 0.46, rate: 0.94 },
      { label: 'see things differently', offset: 16.54, duration: 1.64, gain: 0.48, rate: 0.92 },
      { label: 'not fond of rules', offset: 19.1, duration: 1.24, gain: 0.45, rate: 0.95 },
      { label: 'no respect', offset: 20.82, duration: 0.94, gain: 0.42, rate: 0.96 },
      { label: 'status quo', offset: 22.14, duration: 1.76, gain: 0.42, rate: 1.02 },
      { label: 'quote them', offset: 24.96, duration: 0.62, gain: 0.38, rate: 0.98 },
      { label: 'disagree with them', offset: 25.92, duration: 1.06, gain: 0.38, rate: 1.02 },
      { label: 'glorify', offset: 27.58, duration: 0.58, gain: 0.36, rate: 1.08 },
      { label: 'vilify them', offset: 28.48, duration: 0.82, gain: 0.36, rate: 0.96 },
      { label: 'ignore them', offset: 32.68, duration: 0.86, gain: 0.48, rate: 1.0 },
      { label: 'change things', offset: 35.02, duration: 1.02, gain: 0.54, rate: 1.02 },
      { label: 'human race', offset: 37.22, duration: 0.84, gain: 0.48, rate: 0.92 },
      { label: 'forward', offset: 39.52, duration: 0.72, gain: 0.38, rate: 0.92 },
      { label: 'some may see them', offset: 40.56, duration: 0.96, gain: 0.36, rate: 1.0 },
      { label: 'we see', offset: 44.32, duration: 0.86, gain: 0.36, rate: 1.04 },
      { label: 'genius', offset: 46.5, duration: 0.86, gain: 0.44, rate: 1.08 },
      { label: 'crazy enough', offset: 48.48, duration: 0.58, gain: 0.42, rate: 0.98 },
      { label: 'change the world', offset: 49.48, duration: 2.82, gain: 0.5, rate: 0.94 },
    ],
  },
];
const CURATED_VOCAL_SAMPLE_SOURCES = CURATED_VOCAL_LINES.map((line) => ({
  url: withCacheKey(mediaUrl(`media/audio/vocal-stems/${line.file}`), VOCAL_SAMPLE_CACHE_KEY),
  kind: 'audio',
  optional: true,
  pool: 'vocal-sample',
  volume: line.volume ?? 0.78,
  project: line.project,
  sourceUrl: line.sourceUrl || '',
  cue: line.cue,
  sampleKey: line.sampleKey,
  responseSampleKey: line.responseSampleKey,
  priority: line.priority || 1,
  breakdownModes: line.breakdownModes,
  chopPattern: line.chopPattern,
  chopLandingBeat: line.chopLandingBeat,
  callPattern: line.callPattern,
  answerPattern: line.answerPattern,
  callPhrases: line.callPhrases,
  answerPhrases: line.answerPhrases,
  phrases: line.phrases,
  phrase: line.phrase,
  chops: line.chops,
  weight: 1,
  lanes: ['vocal'],
}));
const ACTIVE_VOCAL_SAMPLE_SOURCES = ENABLE_LOCAL_VOICE_OVER
  ? CURATED_VOCAL_SAMPLE_SOURCES
  : [];
const TV_VIDEO_SOURCES = [
  ...CLEARED_TRAILER_SOURCES,
];
window.RESUME_TV_CLIP_POOLS = {
  visual: CLEARED_TRAILER_SOURCES,
  vocal: ACTIVE_VOCAL_SAMPLE_SOURCES,
};
const MOBILE_RESUME_QUERY = '(max-width: 760px)';

function useMobileResumeMode() {
  const getMatch = () => window.matchMedia(MOBILE_RESUME_QUERY).matches;
  const [mobile, setMobile] = useState(getMatch);
  useEffect(() => {
    const query = window.matchMedia(MOBILE_RESUME_QUERY);
    const update = () => setMobile(query.matches);
    update();
    if (query.addEventListener) query.addEventListener('change', update);
    else query.addListener?.(update);
    return () => {
      if (query.removeEventListener) query.removeEventListener('change', update);
      else query.removeListener?.(update);
    };
  }, []);
  return mobile;
}

function getStoredDesktopMode() {
  try {
    const stored = window.localStorage?.getItem(SITE_MODE_STORAGE_KEY);
    return stored === 'read-only' ? 'read-only' : 'more-than-words';
  } catch (_) {
    return 'more-than-words';
  }
}

function useDesktopMode() {
  const [mode, setModeState] = useState(getStoredDesktopMode);
  const setMode = React.useCallback((nextMode) => {
    const normalized = nextMode === 'read-only' ? 'read-only' : 'more-than-words';
    setModeState(normalized);
    try {
      window.localStorage?.setItem(SITE_MODE_STORAGE_KEY, normalized);
    } catch (_) {}
  }, []);
  return [mode, setMode];
}

function getHelpSourceUrl(candidate) {
  if (typeof candidate === 'string') return candidate;
  return candidate.videoUrl || candidate.src || candidate.url;
}

function canWarmHelpSource(candidate) {
  const clean = String(getHelpSourceUrl(candidate) || '').split('?')[0].toLowerCase();
  const probeVideo = document.createElement('video');
  if (clean.endsWith('.mp4')) return probeVideo.canPlayType('video/mp4') !== '';
  if (clean.endsWith('.webm')) {
    return probeVideo.canPlayType('video/webm; codecs="vp9, opus"') !== ''
      || probeVideo.canPlayType('video/webm') !== '';
  }
  return Boolean(clean);
}

function useHelpMediaWarmup(enabled) {
  useEffect(() => {
    if (!enabled) return undefined;
    let cancelled = false;
    const timerId = window.setTimeout(async () => {
      if (window.__resumeIsPageActive && !window.__resumeIsPageActive()) return;
      try {
        const source = HELP_VIDEO_URLS.find(canWarmHelpSource);
        if (!source || cancelled) return;
        const spotlightLoader = window.__loadSpotlightBundle || (() => window.__spotlightBundlePromise);
        const mod = await spotlightLoader();
        if (cancelled) return;
        await mod.preloadSpotlightSource?.(source);
      } catch (error) {
        console.warn('[help-player] page warm-up failed', error);
      }
    }, 300);
    return () => {
      cancelled = true;
      window.clearTimeout(timerId);
    };
  }, [enabled]);
}

function DesktopModeToggle({ mode, onModeChange }) {
  const switchMode = (nextMode) => {
    if (nextMode === mode || !onModeChange) return;
    onModeChange(nextMode);
  };
  return (
    <div className="site-mode-toggle mono" role="group" aria-label="Desktop site mode">
      <button
        type="button"
        className={mode === 'read-only' ? 'is-active' : ''}
        aria-pressed={mode === 'read-only'}
        onClick={() => switchMode('read-only')}
      >
        read-only
      </button>
      <button
        type="button"
        className={mode === 'more-than-words' ? 'is-active' : ''}
        aria-pressed={mode === 'more-than-words'}
        onClick={() => switchMode('more-than-words')}
      >
        more-than-words
      </button>
    </div>
  );
}

// Compact top strip for the current resume shell.
function TopStrip({ data, roleLabel }) {
  const label = roleLabel || data.roleLabel || 'Creative Technologist';
  return (
    <header className="identity">
      <div className="identity__top mono dim">
        <span>{label}</span>
        <span className="identity__top-dot identity__top-dot--circle" aria-hidden="true"></span>
        <span>{data.location}</span>
        <span className="identity__top-dot identity__top-dot--square" aria-hidden="true"></span>
        <a href={`mailto:${data.email}`}>Email</a>
        <span className="identity__top-dot identity__top-dot--circle" aria-hidden="true"></span>
        <a href={data.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
      </div>
    </header>
  );
}

// ────────────────────────────────────────────────────────────────────
//  Award stamps — mini Byrne plates per tier.
//  Triangle = gold (yellow), circle = silver (blue), square = honor (red)
//  with ink outlines and vertex dots, echoing the hero plate diagrams.
// ────────────────────────────────────────────────────────────────────
function AwardStamp({ tier, className = "award-stamp" }) {
  if (tier === "gold") {
    return (
      <svg className={className} viewBox="0 0 28 28" aria-hidden="true">
        <polygon className="award-stamp__fill--yellow" points="14,4 25,24 3,24" />
      </svg>
    );
  }
  if (tier === "silver") {
    return (
      <svg className={className} viewBox="0 0 28 28" aria-hidden="true">
        <circle className="award-stamp__fill--blue" cx="14" cy="14" r="10" />
      </svg>
    );
  }
  // honor
  return (
    <svg className={className} viewBox="0 0 28 28" aria-hidden="true">
      <rect className="award-stamp__fill--red" x="4" y="4" width="20" height="20" />
    </svg>
  );
}

// Awards: heavyweights (Engineering Emmys + Cannes Gold) get a hero
// treatment, everything else collapses into a tight list below. The
// override picks up here so the live-site rendering matches the design.
Awards = function Awards({
  items,
  id = 'awards',
  label = '06 · AWARDS & RECOGNITION',
}) {
  // Every gold gets hero treatment. Silver + honor compress into the list.
  const featured = items.filter((a) => a.tier === 'gold');
  const rest = items.filter((a) => a.tier !== 'gold');
  return (
    <Section id={id} label={label}>
      <ul className="awards-hero">
        {featured.map((a, i) => (
          <li key={i} className="award-hero">
            <div className="award-hero__stamp"><AwardStamp tier="gold" /></div>
            <div className="award-hero__org mono">{a.org}</div>
            <div className="award-hero__title">{a.title}</div>
            <div className="award-hero__project serif italic">{a.project}</div>
          </li>
        ))}
      </ul>
      <ul className="awards-list">
        {rest.map((a, i) => (
          <li key={i} className={`award-row award-row--${a.tier}`}>
            <span className={`award-row__tier award-row__tier--${a.tier} mono`}>
              <AwardStamp tier={a.tier} className="award-row__stamp" />
              {a.tier}
            </span>
            <span className="award-row__org mono">{a.org}</span>
            <span className="award-row__title">{a.title}</span>
            <span className="award-row__project serif italic">{a.project}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
};

function MobileResumeSection({ label, tone = 'yellow', children }) {
  return (
    <section className={`mobile-section mobile-section--${tone}`}>
      <header className="mobile-section__header">
        <span className="mobile-section__mark" aria-hidden="true" />
        <span className="mobile-section__label mono">{label}</span>
      </header>
      <div className="mobile-section__body">{children}</div>
    </section>
  );
}

function MobileExperience({ items }) {
  return (
    <MobileResumeSection label="Experience" tone="yellow">
      <ol className="mobile-jobs">
        {items.map((job) => (
          <li key={`${job.role}-${job.period}`} className="mobile-job">
            <div className="mobile-job__head">
              <h3>{job.role}</h3>
              {job.tag ? <span className="mobile-job__tag mono">{job.tag}</span> : null}
            </div>
            <div className="mobile-job__meta">
              <span>{job.org}</span>
              {job.where ? <span>{job.where}</span> : null}
              <span>{job.period}</span>
            </div>
            {job.description ? (
              <p className="mobile-job__description">{job.description}</p>
            ) : null}
            <ul className="mobile-job__bullets">
              {job.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
            </ul>
            {job.credits ? (
              <div className="mobile-job__credits">
                <div className="mobile-job__credits-label mono">Selected show credits</div>
                <ul>
                  {job.credits.map((credit) => <li key={credit}>{credit}</li>)}
                </ul>
              </div>
            ) : null}
          </li>
        ))}
      </ol>
    </MobileResumeSection>
  );
}

function MobileProjects({ project }) {
  const projects = [
    {
      name: "The Mill BLACKBIRD",
      meta: "Production tool",
      body: "Adjustable car rig and production system for photoreal CG automotive work. Co-inventor.",
      stack: ["Cannes Gold", "HPA Gold", "The Mill"],
    },
    {
      name: "Mill Stitch",
      meta: "On-set software",
      body: "Real-time 360-degree stitching and on-set review toolset built for Google ATAP's HELP. Inventor.",
      stack: ["Cannes Gold", "SXSW Gold", "Webby Technical Achievement"],
    },
    {
      name: "HELP - Google Spotlight Stories",
      meta: "Immersive film",
      body: "Hollywood-scale mobile VR film pipeline with Justin Lin, Google ATAP, and The Mill.",
      stack: ["Justin Lin", "Google ATAP", "The Mill"],
    },
    {
      name: "Mill Experience Reel",
      meta: "Experience practice",
      body: "Experiential, immersive, real-time, and product-facing creative technology work.",
      stack: ["Creative technology", "Product", "Real-time"],
    },
    {
      name: "Louis Vuitton Women’s Spring–Summer 2020",
      meta: "Live spectacle",
      body: "Fashion, spectacle, media systems, and live production at luxury scale.",
      stack: ["SOPHIE", "Es Devlin", "The Louvre"],
    },
    {
      name: "Industrial Light & Magic: 50 Years",
      meta: "Studio innovation",
      body: "ILM innovation context across StageCraft, virtual production, visual effects, and frontier storytelling.",
      stack: ["ILM", "StageCraft", "Virtual production"],
    },
    {
      name: "The Mandalorian and Grogu",
      meta: "Franchise storytelling",
      body: "Franchise-scale virtual production and cinematic innovation context - ILM StageCraft.",
      stack: ["ILM StageCraft", "Virtual production"],
    },
    {
      name: "KISS - A New Era Begins",
      meta: "Avatar performance",
      body: "ILM avatars and future-facing performance/IP experience work with KISS and Pophouse.",
      stack: ["Digital humans", "Performance capture", "Pophouse"],
    },
  ];
  return (
    <MobileResumeSection label="Selected projects" tone="blue">
      <ol className="mobile-projects">
        {projects.map((item) => (
          <li key={item.name} className="mobile-project">
            <div className="mobile-project__head">
              <h3>{item.name}</h3>
              <div className="mobile-project__meta mono">{item.meta}</div>
            </div>
            <p>{item.body}</p>
            <ul className="mobile-project__stack mono">
              {item.stack.map((tag) => <li key={tag}>{tag}</li>)}
            </ul>
          </li>
        ))}
      </ol>
    </MobileResumeSection>
  );
}

function MobileAwards({ items }) {
  return (
    <MobileResumeSection label="Awards & recognition" tone="red">
      <ul className="mobile-awards">
        {items.map((award) => (
          <li key={`${award.org}-${award.title}`} className="mobile-award">
            <AwardStamp tier={award.tier} className="mobile-award__stamp" />
            <div>
              <div className="mobile-award__org mono">{award.org}</div>
              <div className="mobile-award__title">{award.title}</div>
              <div className="mobile-award__project serif italic">{award.project}</div>
            </div>
          </li>
        ))}
      </ul>
    </MobileResumeSection>
  );
}

function MobileSkills({ groups }) {
  return (
    <MobileResumeSection label="Technical" tone="red">
      <div className="mobile-skills">
        {groups.map((group) => (
          <div key={group.group} className="mobile-skill">
            <h3 className="mono">{group.group}</h3>
            <p>{group.items.join(" · ")}</p>
          </div>
        ))}
      </div>
    </MobileResumeSection>
  );
}

function MobileEducation({ items }) {
  return (
    <MobileResumeSection label="Education" tone="red">
      <ul className="mobile-education">
        {items.map((item) => (
          <li key={item.school}>
            <div className="mobile-education__school serif">{item.school}</div>
            <div>{item.degree}</div>
          </li>
        ))}
      </ul>
    </MobileResumeSection>
  );
}

function MobileReferences({ items }) {
  return (
    <MobileResumeSection label="References" tone="red">
      <ul className="mobile-references">
        {items.map((item) => {
          const name = item.linkedin
            ? (
              <a className="mobile-reference__link" href={item.linkedin} target="_blank" rel="noreferrer">
                {item.name}
              </a>
            )
            : item.name;
          return (
          <li key={item.name} className="mobile-reference">
            <div>
              <div className="mobile-reference__name">{name}</div>
              <div className="mobile-reference__title mono">{item.title}</div>
              {item.sub && <div className="mobile-reference__sub mono">{item.sub}</div>}
              <blockquote className="mobile-reference__quote serif">{item.quote}</blockquote>
            </div>
          </li>
          );
        })}
      </ul>
    </MobileResumeSection>
  );
}

function MobileResume() {
  useEffect(() => {
    const engine = getResumeAudioEngine?.();
    if (engine?.enabled) engine.setEnabled(false).catch(() => {});
  }, []);

  return (
    <div className="page page--mobile-resume">
      <TopStrip data={RESUME} />
      <header className="mobile-resume-hero">
        <h1>Tawfeeq Martin.</h1>
        <p className="mobile-resume-hero__title mono">{RESUME.title}</p>
      </header>
      <MobileResumeSection label="Summary" tone="yellow">
        <p className="mobile-summary serif">{RESUME.summary}</p>
      </MobileResumeSection>
      <MobileExperience items={RESUME.experience} />
      <MobileProjects project={RESUME.project} />
      <MobileAwards items={RESUME.awards} />
      <MobileSkills groups={RESUME.skills} />
      <MobileEducation items={RESUME.education} />
      <MobileReferences items={RESUME.references} />
    </div>
  );
}

function ReadOnlyResume({ mode = 'read-only', onModeChange, showModeToggle = true, navSlot = null }) {
  useEffect(() => {
    const engine = getResumeAudioEngine?.();
    if (engine?.enabled) engine.setEnabled(false).catch(() => {});
  }, []);

  return (
    <div className="page page--read-only-resume">
      <TopStrip data={RESUME} />
      {showModeToggle ? (
        <div className="site-mode-toggle-row">
          <DesktopModeToggle mode={mode} onModeChange={onModeChange} />
        </div>
      ) : navSlot}
      <header className="read-only-hero">
        <h1>Tawfeeq Martin.</h1>
        <p className="read-only-hero__title mono">{RESUME.title}</p>
      </header>
      <MobileResumeSection label="Summary" tone="yellow">
        <p className="mobile-summary serif">{RESUME.summary}</p>
      </MobileResumeSection>
      <MobileExperience items={RESUME.experience} />
      <MobileProjects project={RESUME.project} />
      <MobileAwards items={RESUME.awards} />
      <MobileSkills groups={RESUME.skills} />
      <MobileEducation items={RESUME.education} />
      <MobileReferences items={RESUME.references} />
    </div>
  );
}

const LANDING_SUMMARY = 'Creative engineer and technical leader with 20+ years turning ambiguous ideas into working systems, award-winning tools, and new production capabilities.';
const LANDING_VARIANT_CSS = `
.version-route-nav {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.55rem;
  margin: -0.25rem 0 0;
  font-size: 0.66rem;
  letter-spacing: 0.08em;
}
.version-route-nav a {
  color: var(--ink-3);
  border: 1px solid color-mix(in oklch, var(--ink), transparent 82%);
  padding: 0.4rem 0.58rem;
  text-decoration: none;
  background: rgba(255,255,255,0.72);
}
.version-route-nav a:hover,
.version-route-nav a:focus-visible,
.version-route-nav a[aria-current="page"] {
  color: var(--ink);
  border-color: color-mix(in oklch, var(--ink), transparent 54%);
  outline: none;
}
.version-route-nav--resume {
  margin-top: 0.6rem;
}
.landing-v1-shell {
  position: relative;
  min-height: 100vh;
  overflow: clip;
  isolation: isolate;
  /* Trucknroll-flavored tokens: a near-black cinematic shell for the hero +
     CTA, the existing Byrne triad (red / blue / yellow) as accents, and Anton
     as the heavy poster face for display type. */
  --lv-dark: #0c0c0f;
  --lv-dark-2: #16161b;
  --lv-on-dark: #f6f5f2;
  --lv-on-dark-dim: #a9a8a4;
  --lv-line: rgba(246, 245, 242, 0.14);
  --lv-accent: #d42a20;
  --lv-accent-2: #0e638e;
  --lv-accent-3: #fac22b;
  --lv-display: 'Anton', 'Archivo', var(--sans);
  --lv-bleed: calc((100vw - min(100vw, var(--maxw))) / 2 + var(--pad));
  background: var(--paper);
}
/* In the CRT experience the page falls away to black so the lit Macintosh case
   reads as a single light source floating in the dark. */
.landing-v1-shell.is-crt {
  background: #000;
}
.landing-v1__page {
  position: relative;
  z-index: 2;
  padding-top: 0;
  padding-bottom: 0;
}
.landing-profile {
  position: relative;
  z-index: 12;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  min-height: max(100svh, 52rem);
  padding: clamp(5rem, 12vh, 8.5rem) var(--pad) clamp(4rem, 9vh, 7rem);
  color: var(--ink);
  background: var(--paper);
}
.landing-profile__content {
  position: relative;
  width: min(100%, var(--maxw));
  margin: 0 auto;
}
.landing-profile__name-row {
  display: grid;
  grid-template-columns: max-content minmax(10rem, 1fr);
  align-items: center;
  gap: clamp(2rem, 5vw, 6rem);
}
.landing-profile__name {
  margin: 0;
  font-family: var(--sans);
  font-size: clamp(3.25rem, 8vw, 8rem);
  font-weight: 700;
  line-height: 0.92;
  letter-spacing: -0.055em;
}
.landing-profile__name span {
  display: inline;
}
.landing-profile__name span + span {
  margin-left: 0.18em;
}
.landing-profile__story {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: center;
  gap: clamp(2.5rem, 6vw, 7rem);
  margin-top: clamp(2.75rem, 6vh, 4.75rem);
}
.landing-profile__bio {
  margin: 0;
  max-width: none;
  color: var(--ink-2);
  font-family: var(--serif);
  font-size: clamp(1.12rem, 1.7vw, 1.55rem);
  line-height: 1.55;
}
.landing-profile__links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem 1.8rem;
  margin-top: clamp(1.5rem, 3.5vh, 2.25rem);
  font-family: var(--mono);
  font-size: 0.78rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.landing-profile__links a {
  color: var(--ink);
  text-decoration: none;
  border-bottom: 1px solid currentColor;
  padding-bottom: 0.15em;
}
.landing-profile__links a:hover,
.landing-profile__links a:focus-visible {
  color: #245cff;
}
.landing-profile__instrument {
  position: relative;
  color: var(--ink);
  pointer-events: none;
  user-select: none;
  overflow: hidden;
}
.landing-profile__instrument--chips {
  justify-self: end;
  width: clamp(10rem, 20vw, 19rem);
  height: clamp(5.75rem, 9vw, 8.5rem);
}
.landing-profile__instrument--wheel {
  justify-self: stretch;
  width: 100%;
  height: clamp(20rem, 34vw, 31rem);
}
.landing-profile__instrument-canvas {
  display: block;
  width: 100%;
  height: 100%;
}
.landing-profile__instrument-link {
  position: absolute;
  inset: 0;
  z-index: 4;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
}
.landing-profile__instrument-link line,
.landing-profile__instrument-link path {
  fill: none;
  stroke: rgba(10,12,16,0.78);
  stroke-width: 1;
  stroke-dashoffset: 0;
  stroke-linecap: square;
  vector-effect: non-scaling-stroke;
  mix-blend-mode: multiply;
}
.landing-profile__instrument-link .landing-profile__connector-line {
  stroke: rgba(10,12,16,0.82);
  stroke-dasharray: 6 7;
  animation: landing-profile-connector-flow 920ms linear infinite;
}
.landing-profile__instrument-link circle {
  fill: rgba(10,12,16,0.86);
  mix-blend-mode: multiply;
}
.landing-profile__instrument-link circle:last-child {
  transform-box: fill-box;
  transform-origin: center;
  animation: landing-profile-connector-arrive 920ms linear infinite;
}
@keyframes landing-profile-connector-flow {
  from { stroke-dashoffset: 0; }
  to { stroke-dashoffset: -26; }
}
@keyframes landing-profile-connector-arrive {
  0%, 74% { opacity: 0.38; transform: scale(0.86); }
  86% { opacity: 1; transform: scale(1.26); }
  100% { opacity: 0.38; transform: scale(0.86); }
}
@media (prefers-reduced-motion: reduce) {
  .landing-profile__instrument-link line,
  .landing-profile__instrument-link path,
  .landing-profile__instrument-link circle:last-child {
    animation: none;
  }
}
@media (min-width: 761px) and (max-width: 1180px) {
  .landing-v1-shell {
    overflow-x: clip;
  }
  .landing-profile {
    min-height: auto;
    padding-top: clamp(4.5rem, 9svh, 7rem);
    padding-bottom: clamp(4rem, 8svh, 6.5rem);
  }
  .landing-profile__name-row {
    grid-template-columns: 1fr;
    gap: clamp(1.5rem, 4vw, 2.75rem);
  }
  .landing-profile__name {
    max-width: 11ch;
    font-size: clamp(4.2rem, 11vw, 7rem);
    line-height: 0.9;
  }
  .landing-profile__name span {
    display: block;
  }
  .landing-profile__name span + span {
    margin-left: 0;
  }
  .landing-profile__instrument--chips {
    justify-self: start;
    width: min(42vw, 19rem);
    height: clamp(5.75rem, 12vw, 8.5rem);
  }
  .landing-profile__story {
    grid-template-columns: 1fr;
    gap: clamp(2.25rem, 5vw, 4rem);
    margin-top: clamp(2.5rem, 5svh, 4rem);
  }
  .landing-profile__bio {
    max-width: 58ch;
    font-size: clamp(1.18rem, 2.2vw, 1.46rem);
  }
  .landing-profile__instrument--wheel {
    justify-self: start;
    width: min(72vw, 34rem);
    height: clamp(20rem, 48vw, 31rem);
  }
}
@media (max-width: 760px) {
  .landing-profile {
    min-height: 100svh;
    padding-top: clamp(3.5rem, 10vh, 5rem);
  }
  .landing-profile--summary-only {
    min-height: 0;
    padding-bottom: clamp(3.5rem, 12vw, 5rem);
  }
  .landing-mobile-summary .landing-cta {
    margin-top: 0;
  }
  .landing-profile__name-row {
    grid-template-columns: 1fr;
    gap: 1.75rem;
  }
  .landing-profile__instrument--chips {
    justify-self: start;
    width: min(58vw, 15rem);
    height: clamp(5rem, 22vw, 7rem);
  }
  .landing-profile__story {
    grid-template-columns: 1fr;
    gap: clamp(2.5rem, 8vh, 4rem);
    margin-top: clamp(2.5rem, 8vh, 4rem);
  }
  .landing-profile__instrument--wheel {
    width: min(100%, 31rem);
    height: min(92vw, 27rem);
    justify-self: center;
  }
}
/* ── CRT zoom: scroll "into" the real 3D Mac until the screen fills the
      viewport, then the page sections render inside the projected screen
      rectangle and scroll there, with a subtle scanline/vignette veil so they
      read as projected on the tube.

      Two layouts share this markup:
      · FLAT fallback (.landing-v1-shell without .is-crt) — reduced-motion,
        coarse pointer, or narrow viewport: a normal flowing page.
      · CRT mode (.is-crt, added by the scroll driver) — fixed full-viewport
        Mac + a fixed DOM "screen viewport" positioned to the projected glass. ── */
.crt-enter {
  position: relative;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  scroll-snap-align: start;
  scroll-snap-stop: normal;
}
.crt-enter__sticky {
  position: relative;
  z-index: 1;
}
/* Fade ALL the hero copy as the dolly docks — the intro block AND the
   AsciiName title (.landing-v1__title is a sibling of .landing-v1__intro, so it
   isn't covered by the intro's fade and would otherwise bleed over the docked
   CRT). Not .landing-v1__hero itself — that contains the fixed Mac canvas. */
.crt-enter__sticky .landing-v1__intro,
.crt-enter__sticky .landing-v1__title {
  opacity: var(--crt-introfade, 1);
  will-change: opacity;
}
.landing-v1-shell.is-crt .crt-enter__sticky .landing-v1__intro,
.landing-v1-shell.is-crt .crt-enter__sticky .landing-v1__title {
  pointer-events: none;
}
.crt-content {
  position: fixed;
  left: -100000px;
  top: 0;
  width: 960px;
  margin: 0;
  z-index: -1;
  opacity: 0.001;
  pointer-events: none;
  background: var(--paper);
}

/* ── FLAT fallback: keep the existing flowing landing page. ── */
.landing-v1-shell:not(.is-crt) .crt-frame { display: none; }

/* ── CRT mode ── */
/* Task 1: the Mac canvas becomes a fixed, viewport-sized, centered layer so the
   camera can actually put the screen at the viewport centre (the rest-state
   canvas is intentionally oversized/offset, which made centring impossible).
   Every transformed ancestor must be neutralised or it would become the fixed
   containing block. */
.landing-v1-shell.is-crt .landing-v1__demo {
  position: static;
  height: auto;
  min-height: 0;
  margin: 0;
  transform: none;
  overflow: visible;
}
.landing-v1-shell.is-crt .crt-enter__sticky {
  position: sticky;
  top: 0;
  height: 100svh;
  overflow: visible;
}
.landing-v1-shell.is-crt .crt-enter__sticky .landing-v1__hero {
  min-height: 100svh;
  height: 100svh;
  margin-top: 0;
}
/* In the CRT experience the hero falls to black, but with a soft directional
   wash that matches the Mac's key light (upper-left) and ramps to black toward
   the shadow side (lower-right) — so the room reads as lit from the same angle
   as the case, making the light direction obvious. */
.landing-v1-shell.is-crt .landing-v1__hero {
  /* Keep the stage identical before, during and after the CRT initializes so a
     refresh can never expose the old violet fallback or underlying sections. */
  background: #030305;
}
.landing-v1-shell.is-crt .landing-v1__demo .tv-hero,
.landing-v1-shell.is-crt .landing-v1__demo .tv-hero__canvas {
  position: fixed;
  inset: 0;
  top: 0;
  left: 0;
  right: auto;
  width: 100vw;
  height: 100svh;
  min-height: 0;
  margin: 0;
  transform: none;
  z-index: 0;
}
/* Before the Macintosh section reaches the viewport it participates in normal
   document flow. Only dock it to the viewport at the section boundary; this
   prevents the profile page from peeling away over an already-fixed stage. */
.landing-v1-shell.is-crt:not(.has-entered-mac) .landing-v1__demo {
  position: relative;
}
.landing-v1-shell.is-crt:not(.has-entered-mac) .landing-v1__demo .tv-hero,
.landing-v1-shell.is-crt:not(.has-entered-mac) .landing-v1__demo .tv-hero__canvas {
  position: absolute;
}
/* The Macintosh owns exactly one document section. Once that section leaves
   the viewport, remove its fixed WebGL surface instead of letting later work
   sections paint over a still-running machine. */
.landing-v1-shell.is-crt:not(.is-mac-section-active) .landing-v1__demo {
  visibility: hidden;
  pointer-events: none;
}
.landing-v1-shell.is-crt[data-companion-gate="loading-machine"] .landing-v1__demo,
.landing-v1-shell.is-crt[data-companion-gate="recovering-machine"] .landing-v1__demo {
  visibility: visible;
  pointer-events: none;
}
.landing-v1-shell.is-crt[data-companion-gate="loading-machine"] .landing-v1__hero,
.landing-v1-shell.is-crt[data-companion-gate="recovering-machine"] .landing-v1__hero,
.landing-v1-shell.is-crt[data-companion-gate="loading-machine"] ~ #blackbird,
.landing-v1-shell.is-crt[data-companion-gate="recovering-machine"] ~ #blackbird {
  background: #030305 !important;
}
/* Pages on the glass: .crt-content is NOT shown in the viewport. It is laid out
   offscreen at the projection width and rasterized into the screen texture, so
   the real sections appear ON the curved tube through the CRT shader (not as a
   DOM plane over it). Kept rendered (not display:none) so its videos keep
   producing frames to snapshot. */
.landing-v1-shell.is-crt .crt-content {
  position: fixed;
  left: -100000px;
  top: 0;
  width: 960px;
  margin: 0;
  z-index: -1;
  opacity: 0.001;
  pointer-events: none;
  background: var(--paper);
}
.landing-v1-shell.is-crt .crt-content__scroll {
  width: 960px;
  padding: 44px 60px 72px;
  background: var(--paper);
  color: var(--ink);
}
/* About-channel source: the full read-only résumé, always laid out offscreen at
   the projection width (in both CRT and flat modes) so it can be rasterized for
   the glass without ever showing as a DOM plane. */
.crt-about-src {
  position: fixed;
  left: -100000px;
  top: 0;
  width: 960px;
  margin: 0;
  z-index: -1;
  opacity: 0.001;
  pointer-events: none;
  background: var(--paper);
  color: var(--ink);
}
/* Full-bleed bands must bleed only to the projection width, not 100vw. */
.landing-v1-shell.is-crt .crt-content #help,
.landing-v1-shell.is-crt .crt-content #strudel,
.landing-v1-shell.is-crt .crt-content .help-intro-stage,
.landing-v1-shell.is-crt .crt-content .landing-cta,
.landing-v1-shell.is-crt .crt-content .section {
  width: 100%;
  max-width: 100%;
  margin-left: 0;
  margin-right: 0;
}
/* The landing sections are built as full-viewport immersive media blocks. On the
   small CRT page they must collapse to their natural content height, or they
   project as huge empty voids. Neutralize the viewport-height scaffolding. */
.landing-v1-shell.is-crt .crt-content #help,
.landing-v1-shell.is-crt .crt-content #blackbird,
.landing-v1-shell.is-crt .crt-content #strudel,
.landing-v1-shell.is-crt .crt-content .help-player,
.landing-v1-shell.is-crt .crt-content .help-feature__player-col,
.landing-v1-shell.is-crt .crt-content .video-slot {
  min-height: 0 !important;
  height: auto !important;
}
.landing-v1-shell.is-crt .crt-content .section {
  margin-top: 3.5rem;
}
.landing-v1-shell.is-crt .crt-content .hero-stack__flow::after { display: none; }
/* The shader supplies the CRT look on the glass, so the DOM veil is retired. */
.crt-frame { display: none; }
@media (prefers-reduced-motion: reduce) {
  .landing-v1__demo { transform: translateY(-40px); }
}

/* ── hero: full-bleed cinematic dark band, demo as the centerpiece ── */
.landing-v1__hero {
  position: relative;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  margin-top: 0;
  padding: 0;
  display: block;
  height: 100svh;
  min-height: 100svh;
  color: var(--lv-on-dark);
  background: #1118f2;
  overflow: visible;
  isolation: isolate;
  z-index: 5;
}
.vfx-marker-field {
  position: fixed;
  inset: 0;
  z-index: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, 1fr);
  align-items: center;
  justify-items: center;
  padding: 3.5vh 11.5vw 4.5vh;
  pointer-events: none;
  overflow: hidden;
}
.landing-v1-shell[data-overture-resolve="true"] .vfx-marker-field {
  opacity: 0;
}
.landing-v1-shell.has-3d-cyc .vfx-marker-field {
  opacity: 0;
}
.landing-v1-shell.has-3d-cyc .landing-v1__hero {
  background: #030305;
}
.landing-v1-shell.has-3d-cyc .crt-foreshadow {
  opacity: 0;
}
.crt-foreshadow__layer.crt-foreshadow__layer--resolve {
  inset: 0;
  z-index: 4;
  opacity: 0;
  transform: none;
  mix-blend-mode: normal;
  background: transparent;
}
.landing-v1-shell[data-overture-resolve="true"]
  .crt-foreshadow__layer--resolve {
  opacity: 1;
  animation: crt-resolve-calibration-hit 1500ms steps(1, end) both;
}
.crt-resolve-calibration__card {
  position: absolute;
  inset: 0;
  opacity: 0;
}
.landing-v1-shell[data-overture-resolve-card="bars"]
  .crt-resolve-calibration__card--bars {
  opacity: 1;
}
.crt-resolve-bars {
  display: grid;
  grid-template-rows: 68% 12% 20%;
  background: #101010;
  overflow: hidden;
}
.crt-resolve-bars__row {
  display: grid;
  min-width: 0;
  min-height: 0;
}
.crt-resolve-bars__row--upper,
.crt-resolve-bars__row--middle {
  grid-template-columns: repeat(7, minmax(0, 1fr));
}
.crt-resolve-bars__row--lower {
  grid-template-columns: 20fr 20fr 20fr 16fr 8fr 8fr 8fr;
}
.crt-resolve-bars__bar {
  min-width: 0;
  min-height: 0;
}
@keyframes crt-resolve-calibration-hit {
  0%, 15% { filter: none; }
  16% { filter: contrast(1.34) saturate(1.24); }
  24% { filter: contrast(0.94) saturate(0.86); }
  30% { filter: contrast(1.22) saturate(1.12); }
  50%, 100% { filter: none; }
}
.crt-foreshadow {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  background: #1118f2;
  --crt-glitch-envelope: 0;
}
@property --crt-glitch-envelope {
  syntax: "<number>";
  inherits: true;
  initial-value: 0;
}
.crt-foreshadow__layer {
  position: absolute;
  inset: -2.5%;
  overflow: hidden;
  opacity: 0;
  transform: scale(1.035);
  transform-origin: center;
  will-change: opacity, transform, clip-path;
  mix-blend-mode: screen;
}
.crt-foreshadow__layer::after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(0deg, transparent 0 7px, rgba(17, 24, 242, 0.68) 7px 10px),
    linear-gradient(90deg, rgba(255, 35, 103, 0.18), transparent 32%, transparent 68%, rgba(0, 216, 255, 0.2));
  mix-blend-mode: multiply;
  opacity: calc(0.08 + var(--crt-glitch-envelope, 0) * 0.92);
}
.crt-foreshadow__layer img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(1) contrast(1.55) brightness(0.92)
    drop-shadow(
      calc(var(--crt-glitch-max-separation, 0px) * var(--crt-glitch-envelope, 0))
      0 0 rgba(255, 35, 103, 0.78)
    )
    drop-shadow(
      calc(var(--crt-glitch-max-separation, 0px) * var(--crt-glitch-envelope, 0) * -1)
      0 0 rgba(0, 216, 255, 0.78)
    );
}
.crt-foreshadow__layer--design {
  opacity: calc(var(--crt-foreshadow-design, 0) * 0.78);
}
.crt-foreshadow__layer--design :is(img, video) {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 69%;
  object-fit: contain;
  object-position: 50% 0;
  transform: scale(1.015) rotate(-0.2deg);
  transform-origin: 50% 0;
  background: #f7f6ef;
  filter: grayscale(1) contrast(1.42) brightness(0.92)
    drop-shadow(
      calc(var(--crt-glitch-max-separation, 0px) * var(--crt-glitch-envelope, 0) * 0.72)
      0 0 rgba(255, 35, 103, 0.64)
    )
    drop-shadow(
      calc(var(--crt-glitch-max-separation, 0px) * var(--crt-glitch-envelope, 0) * -0.72)
      0 0 rgba(0, 216, 255, 0.68)
    );
}
.crt-foreshadow__art-frame {
  opacity: 0;
}
.crt-foreshadow__art-frame[data-art-frame="0"] {
  opacity: 1;
}
.crt-foreshadow__layer--make {
  opacity: calc(var(--crt-foreshadow-make, 0) * 0.92);
  background: #02030e;
}
.landing-v1-shell[data-source-code-handoff="true"] .crt-foreshadow__layer--make {
  opacity: 0.92;
}
.crt-foreshadow__code {
  margin: 0;
  min-width: 0;
  width: 100%;
  color: #f7f7ef;
  font: 700 clamp(0.46rem, 0.68vw, 0.7rem)/1.2 Monaco, "IBM Plex Mono", monospace;
  letter-spacing: -0.02em;
  white-space: pre-wrap;
  overflow: hidden;
  text-shadow:
    calc(var(--crt-glitch-max-separation, 0px) * var(--crt-glitch-envelope, 0))
      0 rgba(255, 35, 103, 0.78),
    calc(var(--crt-glitch-max-separation, 0px) * var(--crt-glitch-envelope, 0) * -1)
      0 rgba(0, 216, 255, 0.82);
}
.crt-foreshadow__code-page {
  position: absolute;
  inset: -9vh -4vw;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-rows: repeat(2, minmax(0, 1fr));
  gap: clamp(0.25rem, 0.75vw, 0.8rem);
  transform: rotate(-0.8deg) scale(1.045);
  transform-origin: center;
  opacity: 0;
  overflow: hidden;
}
.crt-foreshadow__code-page[data-code-frame="0"] {
  opacity: 1;
}
.crt-foreshadow__code:nth-child(3n + 2) { opacity: 0.68; }
.crt-foreshadow__code:nth-child(4n) { opacity: 0.5; }
.crt-foreshadow__code-label {
  position: absolute;
  right: 4vw;
  top: 5vh;
  color: #fff;
  font: 800 clamp(0.58rem, 0.86vw, 0.78rem)/1 Monaco, monospace;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.crt-foreshadow__layer--believe {
  opacity: calc(var(--crt-foreshadow-believe, 0) * 0.72);
}
.crt-foreshadow__believe-frame {
  position: absolute;
  inset: -4%;
  width: 108%;
  height: 108%;
  object-fit: cover;
  object-position: 50% 50%;
  transform: scale(1.1);
  transform-origin: center;
  opacity: 0;
  /* The analysis look is baked into duplicate masters on Hermes. Browser work
     is limited to the authored glitch displacement so playback stays cheap. */
  filter: drop-shadow(
      calc(var(--crt-glitch-max-separation, 0px) * var(--crt-glitch-envelope, 0))
      0 0 rgba(255, 35, 103, 0.72)
    )
    drop-shadow(
      calc(var(--crt-glitch-max-separation, 0px) * var(--crt-glitch-envelope, 0) * -1)
      0 0 rgba(0, 216, 255, 0.74)
    );
}
.crt-foreshadow__believe-frame[data-believe-frame="0"] {
  opacity: 1;
}
.landing-v1-shell[data-pool-rest]
  :is(.crt-foreshadow__art-frame, .crt-foreshadow__code-page),
.landing-v1-shell[data-believe-rest] .crt-foreshadow__believe-frame {
  opacity: 0;
}
.landing-v1-shell[data-pool-rest="0"]
  :is([data-art-frame="0"], [data-code-frame="0"]),
.landing-v1-shell[data-pool-rest="1"]
  :is([data-art-frame="1"], [data-code-frame="1"]),
.landing-v1-shell[data-pool-rest="2"]
  :is([data-art-frame="2"], [data-code-frame="2"]),
.landing-v1-shell[data-pool-rest="3"]
  :is([data-art-frame="3"], [data-code-frame="3"]),
.landing-v1-shell[data-pool-rest="4"]
  :is([data-art-frame="4"], [data-code-frame="4"]),
.landing-v1-shell[data-pool-rest="5"]
  :is([data-art-frame="5"], [data-code-frame="5"]),
.landing-v1-shell[data-pool-rest="6"] [data-art-frame="6"],
.landing-v1-shell[data-pool-rest="7"] [data-art-frame="7"],
.landing-v1-shell[data-believe-rest="0"] [data-believe-frame="0"],
.landing-v1-shell[data-believe-rest="1"] [data-believe-frame="1"],
.landing-v1-shell[data-believe-rest="2"] [data-believe-frame="2"],
.landing-v1-shell[data-believe-rest="3"] [data-believe-frame="3"],
.landing-v1-shell[data-believe-rest="4"] [data-believe-frame="4"],
.landing-v1-shell[data-believe-rest="5"] [data-believe-frame="5"],
.landing-v1-shell[data-believe-rest="6"] [data-believe-frame="6"],
.landing-v1-shell[data-believe-rest="7"] [data-believe-frame="7"],
.landing-v1-shell[data-believe-rest="8"] [data-believe-frame="8"],
.landing-v1-shell[data-believe-rest="9"] [data-believe-frame="9"],
.landing-v1-shell[data-believe-rest="10"] [data-believe-frame="10"],
.landing-v1-shell[data-believe-rest="11"] [data-believe-frame="11"],
.landing-v1-shell[data-believe-rest="12"] [data-believe-frame="12"],
.landing-v1-shell[data-believe-rest="13"] [data-believe-frame="13"],
.landing-v1-shell[data-believe-rest="14"] [data-believe-frame="14"] {
  opacity: 1;
}
.landing-v1-shell.has-parked-glitch:not(.is-reel-playing)
  :is(.crt-foreshadow__code-page, .crt-foreshadow__believe-frame)[data-code-frame="0"],
.landing-v1-shell.has-parked-glitch:not(.is-reel-playing)
  .crt-foreshadow__believe-frame[data-believe-frame="0"] {
  animation: crt-pool-frame-0 var(--crt-parked-duration, 360ms) steps(1, end) both;
}
.landing-v1-shell.has-parked-glitch:not(.is-reel-playing)
  .crt-foreshadow__code-page[data-code-frame="1"],
.landing-v1-shell.has-parked-glitch:not(.is-reel-playing)
  .crt-foreshadow__believe-frame[data-believe-frame="1"] {
  animation: crt-pool-frame-1 var(--crt-parked-duration, 360ms) steps(1, end) both;
}
.landing-v1-shell.has-parked-glitch:not(.is-reel-playing)
  .crt-foreshadow__code-page[data-code-frame="2"],
.landing-v1-shell.has-parked-glitch:not(.is-reel-playing)
  .crt-foreshadow__believe-frame[data-believe-frame="2"] {
  animation: crt-pool-frame-2 var(--crt-parked-duration, 360ms) steps(1, end) both;
}
.landing-v1-shell.has-parked-glitch:not(.is-reel-playing)
  .crt-foreshadow__code-page[data-code-frame="3"],
.landing-v1-shell.has-parked-glitch:not(.is-reel-playing)
  .crt-foreshadow__believe-frame[data-believe-frame="3"] {
  animation: crt-pool-frame-3 var(--crt-parked-duration, 360ms) steps(1, end) both;
}
.landing-v1-shell.has-parked-glitch:not(.is-reel-playing)
  .crt-foreshadow__code-page[data-code-frame="4"],
.landing-v1-shell.has-parked-glitch:not(.is-reel-playing)
  .crt-foreshadow__believe-frame[data-believe-frame="4"] {
  animation: crt-pool-frame-4 var(--crt-parked-duration, 360ms) steps(1, end) both;
}
.landing-v1-shell.has-parked-glitch:not(.is-reel-playing)
  .crt-foreshadow__code-page[data-code-frame="5"],
.landing-v1-shell.has-parked-glitch:not(.is-reel-playing)
  .crt-foreshadow__believe-frame[data-believe-frame="5"] {
  animation: crt-pool-frame-5 var(--crt-parked-duration, 360ms) steps(1, end) both;
}
@keyframes crt-pool-frame-0 {
  0%, 16.65% { opacity: 1; }
  16.66%, 100% { opacity: 0; }
}
@keyframes crt-pool-frame-1 {
  0%, 16.65%, 33.33%, 100% { opacity: 0; }
  16.66%, 33.32% { opacity: 1; }
}
@keyframes crt-pool-frame-2 {
  0%, 33.32%, 50%, 100% { opacity: 0; }
  33.33%, 49.99% { opacity: 1; }
}
@keyframes crt-pool-frame-3 {
  0%, 49.99%, 66.66%, 100% { opacity: 0; }
  50%, 66.65% { opacity: 1; }
}
@keyframes crt-pool-frame-4 {
  0%, 66.65%, 83.33%, 100% { opacity: 0; }
  66.66%, 83.32% { opacity: 1; }
}
@keyframes crt-pool-frame-5 {
  0%, 83.32% { opacity: 0; }
  83.33%, 100% { opacity: 1; }
}
.landing-v1-shell.is-reel-playing .crt-foreshadow__layer {
  opacity: 0 !important;
  animation-play-state: paused !important;
}
.landing-v1-shell.is-intro-paused *,
.landing-v1-shell.is-intro-paused *::before,
.landing-v1-shell.is-intro-paused *::after {
  animation-play-state: paused !important;
}
@keyframes crt-parked-world-pulse {
  0% {
    transform: translate3d(calc(var(--crt-glitch-shake, 0.8vw) * -0.55), 0, 0);
    filter: contrast(var(--crt-glitch-contrast, 1.22))
      saturate(var(--crt-glitch-saturation, 1.3));
  }
  18% {
    transform: translate3d(
      calc(var(--crt-glitch-shake, 0.8vw) * 0.42),
      0,
      0
    );
    filter: contrast(var(--crt-glitch-contrast, 1.22))
      saturate(var(--crt-glitch-saturation, 1.3));
  }
  42% {
    transform: translate3d(
      calc(var(--crt-glitch-shake, 0.8vw) * -0.28),
      0,
      0
    );
    filter: contrast(var(--crt-glitch-contrast, 1.22))
      saturate(var(--crt-glitch-saturation, 1.3));
  }
  72% {
    transform: translate3d(calc(var(--crt-glitch-shake, 0.8vw) * 0.16), 0, 0);
    filter: contrast(var(--crt-glitch-contrast, 1.22))
      saturate(var(--crt-glitch-saturation, 1.3));
  }
  86% {
    transform: translate3d(calc(var(--crt-glitch-shake, 0.8vw) * -0.06), 0, 0);
    filter: contrast(1.04) saturate(1.05);
  }
  100% { transform: translate3d(0, 0, 0); filter: none; }
}
@keyframes crt-glitch-audio-envelope {
  0%, 72% { --crt-glitch-envelope: 1; }
  82% { --crt-glitch-envelope: 0.36; }
  91% { --crt-glitch-envelope: 0.12; }
  100% { --crt-glitch-envelope: 0; }
}
.landing-v1-shell.has-parked-glitch:not(.is-reel-playing) .crt-foreshadow {
  animation: crt-glitch-audio-envelope var(--crt-parked-duration, 360ms) linear both;
}
.landing-v1-shell.has-parked-glitch:not(.is-reel-playing) .crt-foreshadow__layer {
  animation: crt-parked-world-pulse var(--crt-parked-duration, 360ms) steps(1, end) both !important;
}
.landing-v1-shell[data-channel-glitch-active="true"]
  .crt-foreshadow__layer--believe {
  opacity: 0.84 !important;
}
.landing-v1-shell.has-parked-glitch[data-parked-variant="0"] .crt-foreshadow__layer {
  clip-path: inset(0);
}
.landing-v1-shell.has-parked-glitch[data-parked-variant="1"] .crt-foreshadow__layer {
  clip-path: inset(0);
}
.landing-v1-shell.has-parked-glitch[data-parked-variant="2"] .crt-foreshadow__layer {
  clip-path: inset(0);
}
.landing-v1-shell[data-overture-resolve="true"].has-parked-glitch:not(.is-reel-playing)
  .crt-foreshadow__layer--resolve {
  animation: crt-resolve-calibration-hit 1500ms steps(1, end) both !important;
  clip-path: inset(0) !important;
  transform: none !important;
}
@keyframes crt-foreshadow-jump-a {
  0%, 71%, 100% { transform: translate3d(0, 0, 0) scale(1.035); clip-path: inset(0); }
  72% { transform: translate3d(1.4vw, 0, 0) scale(1.05); clip-path: inset(0); }
  76% { transform: translate3d(-0.8vw, 0, 0) scale(1.04); clip-path: inset(0); }
  80% { transform: translate3d(0, 0, 0) scale(1.035); clip-path: inset(0); }
}
@keyframes crt-foreshadow-jump-b {
  0%, 63%, 100% { transform: translate3d(0, 0, 0) scale(1.035); clip-path: inset(0); }
  64% { transform: translate3d(-1.8vw, 0, 0) scale(1.05); clip-path: inset(0); }
  69% { transform: translate3d(1vw, 0, 0) scale(1.04); clip-path: inset(0); }
  74% { transform: translate3d(0, 0, 0) scale(1.035); clip-path: inset(0); }
}
@media (prefers-reduced-motion: reduce) {
  .crt-foreshadow__layer { animation: none !important; }
}
.vfx-marker {
  position: relative;
  width: 34px;
  height: 34px;
  opacity: 0.94;
  filter: drop-shadow(0 0 2px rgba(255,255,255,0.28));
}
.vfx-marker::before,
.vfx-marker::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 30px;
  height: 4px;
  border-radius: 1px;
  background: #ffffff;
  transform: translate(-50%, -50%);
}
.vfx-marker::after { transform: translate(-50%, -50%) rotate(90deg); }
.vfx-marker:nth-child(odd) { justify-self: start; }
.vfx-marker:nth-child(even) { justify-self: end; }
.landing-v1__intro {
  max-width: 41rem;
  position: relative;
  z-index: 3;
  align-self: start;   /* top-align under the name instead of centering down the column */
  /* Clear the absolutely-positioned name above, then a tight gap to the eyebrow. */
  margin-top: clamp(4.5rem, 8vw, 7rem);
}
.landing-v1__eyebrow {
  margin: 0 0 clamp(1.1rem, 2vw, 1.6rem);
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  color: var(--lv-on-dark-dim);
  font-size: 0.64rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
}
.landing-v1__eyebrow::before {
  content: "";
  width: 1.7rem;
  height: 1px;
  background: var(--lv-accent);
}
.landing-v1__title {
  margin: 0;
  font-family: var(--lv-display);
  font-weight: 400;
  font-size: clamp(3.6rem, 7.6vw, 8.6rem);
  line-height: 0.85;
  letter-spacing: 0.01em;
  text-transform: uppercase;
  color: var(--lv-on-dark);
  text-wrap: balance;
}
.landing-v1__title-dot {
  color: var(--lv-accent);
}
/* FATFONT pixel-grid name: each letter is a <canvas> sized from --fat-h (the
   glyph height). 5 cols wide, 7 rows tall, so width = height * 5/7. The dot is a
   2-wide block; word gaps are a 3-cell spacer. Drawing happens in AsciiName. */
.landing-v1__title--fat {
  --fat-h: clamp(1.4rem, 2.7vw, 3rem);
  line-height: 1.04;
  letter-spacing: 0;
  white-space: nowrap;   /* keep the name single-file */
  /* Pulled out of the grid flow and pinned to the top of the hero, so it no
     longer creates a tall stretched row that pushes the summary down. The
     summary then sits in a predictable spot right beneath it. */
  position: absolute;
  top: clamp(1.6rem, 3vw, 2.8rem);
  left: var(--lv-bleed);
  z-index: 6;            /* keep the name above the Mac canvas where they meet */
}
.landing-v1__title--fat .lv-word {
  display: inline-flex;
  align-items: flex-end;
  white-space: nowrap;
  vertical-align: bottom;
}
.lv-fat {
  display: block;
  height: var(--fat-h);
  width: calc(var(--fat-h) * 5 / 7);
  margin-right: calc(var(--fat-h) / 12);
}
.lv-fat:last-child {
  margin-right: 0;
}
.lv-fat--dot {
  width: calc(var(--fat-h) * 2 / 7);
}
.lv-fat-space {
  display: inline-block;
  width: calc(var(--fat-h) * 3 / 7);
  vertical-align: bottom;
}
/* Per-letter ASCII flare: the glyph overlays via ::after so swaps never reflow
   the word; the base letter just goes transparent while a glyph is showing. */
.lv-word {
  display: inline-block;
  white-space: nowrap;
}
.lv-ch {
  position: relative;
  display: inline-block;
  transition: color 0.16s ease;
}
.lv-ch::after {
  content: attr(data-glyph);
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.16s ease;
}
.lv-ch.is-flare {
  color: transparent;
}
.lv-ch.is-flare::after {
  opacity: 1;
}
/* Scrolling chars: hollow / no-fill outline so they read distinctly against the
   solid name as they cycle. */
.lv-ch--shuffle::after {
  color: transparent;
  -webkit-text-stroke: 2px rgba(246, 245, 242, 0.92);
  text-stroke: 2px rgba(246, 245, 242, 0.92);
}
/* Pitched-lane color flashes recolor the real letter (no glyph swap). */
.lv-ch {
  transition: color 0.16s ease;
}
/* Keyboard key colors: W red, A yellow, S white, D blue. */
.lv-ch.is-color-red { color: #d42a20; }
.lv-ch.is-color-yellow { color: #fac22b; }
.lv-ch.is-color-white { color: #f4f0e6; }
.lv-ch.is-color-blue { color: #1c5f9f; }
/* When a tinted letter is mid-scroll, color the glyph outline instead. */
.lv-ch.is-flare.is-color-red::after { -webkit-text-stroke-color: #d42a20; text-stroke-color: #d42a20; }
.lv-ch.is-flare.is-color-yellow::after { -webkit-text-stroke-color: #fac22b; text-stroke-color: #fac22b; }
.lv-ch.is-flare.is-color-white::after { -webkit-text-stroke-color: #f4f0e6; text-stroke-color: #f4f0e6; }
.lv-ch.is-flare.is-color-blue::after { -webkit-text-stroke-color: #1c5f9f; text-stroke-color: #1c5f9f; }
.landing-v1__summary {
  margin: clamp(1.3rem, 2.6vw, 2rem) 0 0;
  max-width: 48ch;
  font-family: var(--serif);
  font-size: clamp(1.05rem, 1.5vw, 1.34rem);
  line-height: 1.46;
  color: rgba(246, 245, 242, 0.82);
}
.landing-v1__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  margin-top: clamp(1.6rem, 3vw, 2.4rem);
}
.landing-v1__action {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  min-height: 2.95rem;
  padding: 0 1.35rem;
  border: 1px solid rgba(246, 245, 242, 0.42);
  background: transparent;
  color: var(--lv-on-dark);
  font-size: 0.7rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  text-decoration: none;
  transition: background 0.16s ease, color 0.16s ease, border-color 0.16s ease, transform 0.16s ease;
}
.landing-v1__action::after {
  content: "\\2197";
  font-size: 1em;
  transform: translateY(-0.02em);
  transition: transform 0.16s ease;
}
.landing-v1__action:hover,
.landing-v1__action:focus-visible {
  transform: translateY(-2px);
  border-color: var(--lv-on-dark);
  outline: none;
}
.landing-v1__action:hover::after,
.landing-v1__action:focus-visible::after {
  transform: translate(0.12em, -0.14em);
}
.landing-v1__action--primary {
  background: var(--lv-accent);
  border-color: var(--lv-accent);
  color: #fff;
  font-weight: 600;
}
.landing-v1__action--primary:hover,
.landing-v1__action--primary:focus-visible {
  background: #e8392d;
  border-color: #e8392d;
}
.landing-v1__demo {
  --mac-canvas-top: 0px;
  --mac-canvas-extra-height: 0px;
  --mac-stage-drag-x: 0px;
  position: relative;
  z-index: 2;
  width: 100vw;
  height: 100svh;
  min-height: 100svh;
  margin: 0;
  overflow: visible;
  /* Nudged up at rest. The CRT zoom is now driven by the 3D camera (dollies
     onto the screen mesh), so no CSS scale here. */
  transform: none;
}
.landing-v1__demo::before {
  content: "LOADING THE MACHINE…";
  position: fixed;
  inset: 0;
  z-index: 2147483000;
  display: grid;
  place-items: center;
  pointer-events: none;
  color: rgba(255, 255, 255, 0.82);
  font: 500 0.7rem/1 var(--mono);
  letter-spacing: 0.22em;
  text-transform: uppercase;
  opacity: 1;
  transition: opacity 90ms linear;
  background: #030305;
}
.landing-v1__demo:has(.tv-hero.is-model-ready)::before,
.landing-v1__demo.is-machine-ready::before {
  opacity: 0;
}
.landing-v1__visual-stage {
  position: relative;
  min-height: clamp(28rem, 62vh, 48rem);
  overflow: visible;
}
.landing-v1__demo .tv-hero {
  position: relative;
  z-index: 4;
  width: 100%;
  height: 100%;
  margin: 0;
}
.landing-v1__demo .tv-hero__canvas {
  inset: 0;
  width: 100vw;
  height: 100svh;
  min-height: 100svh;
  transform: none;
  opacity: 0;
  transition: opacity 90ms linear;
}
.landing-v1__demo .tv-hero.is-model-ready .tv-hero__canvas,
.landing-v1__demo.is-machine-ready .tv-hero__canvas {
  opacity: 1;
}
.landing-v1__demo .tv-hero__controls {
  right: clamp(3rem, 13vw, 14rem);
  bottom: clamp(7rem, 16vh, 12rem);
}

/* ── light editorial body: numbered chapters ── */
.landing-v1__featured-demos {
  margin-top: 0;
}
.landing-v1__featured-demos #help {
  margin-top: 0;
}
.landing-v1__featured-demos #blackbird {
  margin-top: 0;
}
.landing-v1__featured-demos #strudel {
  margin-top: clamp(3rem, 6vw, 6rem);
}
.landing-v1-shell .section {
  margin-top: clamp(4rem, 9vw, 8rem);
}
.landing-v1-shell .section__header {
  display: block;
  margin: 0 0 clamp(1.6rem, 3vw, 2.6rem);
  padding-bottom: 1.05rem;
  border-bottom: 1px solid var(--rule);
}
.landing-v1-shell .section__label {
  display: flex;
  align-items: baseline;
  gap: clamp(0.85rem, 1.6vw, 1.3rem);
  font-family: var(--sans);
}
.landing-v1-shell .section__label-num {
  font-family: var(--lv-display);
  font-weight: 400;
  font-size: clamp(2.6rem, 5.2vw, 4.6rem);
  line-height: 0.78;
  letter-spacing: 0;
  color: var(--ink);
}
.landing-v1-shell .section__label-sep {
  display: none;
}
.landing-v1-shell .section__label-title {
  align-self: center;
  font-size: clamp(0.82rem, 1.3vw, 1.02rem);
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--ink);
}
.landing-v1-shell #help .section__label-num { color: var(--lv-accent); }
.landing-v1-shell #blackbird .section__label-num { color: var(--lv-accent-2); }
.landing-v1-shell #strudel .section__label-num { color: var(--lv-accent-3); }
.landing-v1-shell #landing-proof .section__label-num { color: var(--lv-accent); }
.landing-v1-shell #landing-awards .section__label-num { color: var(--lv-accent-2); }
.landing-v1-shell #landing-refs .section__label-num { color: var(--ink); }

/* The final Beautiful Game chapter mounts the original standalone export
   whole so its renderer, controls, and embedded assets stay unchanged. */
#hand-of-god.section {
  width: 100%;
  min-height: 100svh;
  margin-top: clamp(4rem, 8vw, 7rem);
  padding: 0;
  background: #020306;
  color: #f5f5f2;
  scroll-snap-align: start;
  scroll-snap-stop: always;
}
#hand-of-god .section__header {
  box-sizing: border-box;
  width: 100%;
  min-height: 4rem;
  margin: 0;
  padding: 1rem var(--pad);
  justify-content: center;
  border-bottom: 1px solid rgba(245, 245, 242, 0.14);
  background: #020306;
}
#hand-of-god .section__label,
#hand-of-god .section__label-num,
#hand-of-god .section__label-title {
  color: #f5f5f2;
}
#hand-of-god .section__body,
.hand-of-god-feature {
  width: 100%;
}
.hand-of-god-feature {
  display: grid;
  grid-template-columns: minmax(0, 1fr) clamp(19rem, 25vw, 25rem);
  height: calc(100svh - 4rem);
  min-height: 42rem;
  overflow: hidden;
  background: #020306;
}
.hand-of-god-feature__frame {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
  background: #020306;
}
.hand-of-god-feature__note {
  display: flex;
  align-items: center;
  padding: clamp(2rem, 4vw, 4rem);
  border-left: 1px solid rgba(245, 245, 242, 0.16);
  background: #020306;
}
.hand-of-god-feature__note p {
  max-width: 34ch;
  margin: 0;
  color: rgba(245, 245, 242, 0.86);
  font-family: var(--serif);
  font-size: clamp(1rem, 1.25vw, 1.22rem);
  line-height: 1.58;
  text-wrap: pretty;
}
@media (max-width: 900px) {
  .hand-of-god-feature {
    grid-template-columns: 1fr;
    grid-template-rows: minmax(0, 1fr) auto;
  }
  .hand-of-god-feature__note {
    padding: 1.25rem var(--pad) 1.5rem;
    border-top: 1px solid rgba(245, 245, 242, 0.16);
    border-left: 0;
  }
  .hand-of-god-feature__note p {
    max-width: 66ch;
    font-size: 0.95rem;
  }
}

/* HELP intro stage: a sticky two-panel scroll sequence that runs BEFORE the
   live-demo section. Panel A (crew on set) holds while you read; a horizontal
   side-swipe then reveals panel B (Justin Lin directing); continuing on scrolls
   into the #help demo, which pins fullscreen via its own existing logic. */
.help-intro-stage {
  position: relative;
  z-index: 0;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  height: 380svh;
  color: var(--lv-on-dark);
}
.help-intro-stage__sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  height: 100svh;
  overflow: hidden;
  background: #06060a;
}
/* Three side-sliding panels: A image (copy) -> B image (awards) -> live player.
   swipe1 reveals B over A; swipe2 reveals the fullscreen HELP player over B. */
.his-panel {
  position: absolute;
  inset: 0;
  overflow: hidden;
  will-change: opacity;
}
/* Feathered crossfade: B dissolves over A, then the player dissolves over B. */
.his-panel--a { opacity: 1; }
.his-panel--b { opacity: var(--b-op, 0); }
.his-panel--c {
  opacity: var(--c-op, 0);
  background: #06060a;
  pointer-events: none;
}
.help-intro-stage__sticky.is-live .his-panel--c { pointer-events: auto; }
.his-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}
.his-bg--a { background-image: url("media/demo/help-bts.webp"); }
.his-bg--b { background-image: url("media/demo/help-bts-2.webp"); }
.his-veil {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(8, 5, 13, 0.58) 0%, rgba(8, 5, 13, 0.5) 45%, rgba(6, 4, 10, 0.82) 100%);
}
.his-panel--c .help-player {
  width: 100%;
  height: 100%;
  min-height: 100%;
  border-radius: 0;
  box-shadow: none;
}
.help-intro-stage__label {
  position: absolute;
  top: clamp(1.5rem, 4vh, 2.6rem);
  left: var(--lv-bleed);
  right: var(--lv-bleed);
  z-index: 5;
  display: flex;
  align-items: baseline;
  gap: clamp(0.85rem, 1.6vw, 1.3rem);
  text-align: left;
  opacity: var(--help-label, 1);
  pointer-events: none;
}
.help-intro-stage__label-num {
  font-family: var(--lv-display);
  font-size: clamp(2.6rem, 5.2vw, 4.6rem);
  line-height: 0.78;
  color: var(--lv-accent);
}
.help-intro-stage__label-title {
  align-self: center;
  font-family: var(--mono);
  font-size: clamp(0.7rem, 1.1vw, 0.85rem);
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}
.help-intro-stage__copy,
.help-intro-stage__awards {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: clamp(3rem, 8vh, 6rem) var(--lv-bleed);
}
.help-intro-stage__copy {
  opacity: var(--help-copy, 1);
}
.help-intro-stage__awards {
  opacity: var(--help-awards, 0);
  align-items: flex-end;
  text-align: right;
}
.help-intro-stage__copy h3 {
  font-family: var(--serif);
  font-size: var(--type-help-head);
  font-weight: 500;
  line-height: 1.15;
  margin: 0 auto 1rem;
  max-width: 22ch;
  text-shadow: 0 2px 22px rgba(0, 0, 0, 0.55);
}
.help-intro-stage__copy p {
  margin: 0 auto 0.85rem;
  max-width: 62ch;
  color: rgba(246, 245, 242, 0.92);
  text-shadow: 0 2px 22px rgba(0, 0, 0, 0.6);
}
.help-intro-stage__awards-kicker {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  margin: 0 0 clamp(1rem, 2.5vh, 1.6rem);
  color: var(--lv-on-dark-dim);
  font-size: 0.62rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}
.help-intro-stage__awards-kicker::after {
  content: "";
  width: 1.7rem;
  height: 1px;
  background: var(--lv-accent-3);
}
.help-intro-stage__awards-head {
  margin: 0 0 clamp(1.4rem, 3.5vh, 2.4rem);
  font-family: var(--lv-display);
  font-weight: 400;
  font-size: clamp(2.6rem, 6vw, 5.2rem);
  line-height: 0.88;
  letter-spacing: 0.01em;
  text-transform: uppercase;
  text-shadow: 0 2px 26px rgba(0, 0, 0, 0.55);
}
.help-intro-stage__awards-list {
  list-style: none;
  margin: 0;
  padding: 0;
  width: min(100%, 28rem);
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(0.7rem, 1.8vh, 1.15rem);
  text-align: right;
}
.help-intro-stage__awards-list li {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.3rem;
  padding-top: 0.7rem;
  border-top: 1px solid rgba(246, 245, 242, 0.28);
}
.help-intro-stage__awards-org {
  font-family: var(--lv-display);
  font-weight: 400;
  font-size: clamp(1.5rem, 2.6vw, 2.3rem);
  line-height: 0.92;
  text-transform: uppercase;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.6);
}
.help-intro-stage__awards-desc {
  color: rgba(246, 245, 242, 0.86);
  font-size: 0.62rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  line-height: 1.4;
}
.help-intro-stage__cue {
  position: absolute;
  z-index: 5;
  bottom: clamp(1.2rem, 4vh, 2.6rem);
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
  font-size: 0.6rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--lv-on-dark-dim);
  white-space: nowrap;
  opacity: var(--help-cue, 1);
}

.landing-proof {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(0.75rem, 1.4vw, 1.1rem);
  background: transparent;
}
.landing-proof__item {
  position: relative;
  min-width: 0;
  display: flex;
  flex-direction: column;
  padding: clamp(1.25rem, 2vw, 1.85rem);
  background: #fff;
  border: 1px solid var(--rule);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.landing-proof__item::after {
  content: "";
  position: absolute;
  left: -1px;
  right: -1px;
  top: -1px;
  height: 3px;
  background: var(--lv-accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.22s ease;
}
.landing-proof__item:hover {
  transform: translateY(-5px);
  box-shadow: 0 22px 46px -30px rgba(0, 0, 0, 0.45);
  border-color: color-mix(in oklch, var(--ink), transparent 58%);
}
.landing-proof__item:hover::after {
  transform: scaleX(1);
}
.landing-proof__index {
  color: var(--lv-accent);
  font-size: 0.66rem;
  letter-spacing: 0.2em;
}
.landing-proof__meta {
  margin: 0.55rem 0 0.85rem;
  color: var(--ink-3);
  font-size: 0.6rem;
  line-height: 1.35;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.landing-proof__title {
  margin: 0;
  font-family: var(--serif);
  font-size: clamp(1.1rem, 1.7vw, 1.42rem);
  line-height: 1.12;
  color: var(--ink);
}
.landing-proof__text {
  margin: 0.7rem 0 0;
  color: var(--ink-2);
  font-size: 0.9rem;
  line-height: 1.5;
}
.landing-awards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(0.75rem, 1.4vw, 1.1rem);
  padding: 0;
  margin: 0;
  list-style: none;
  background: transparent;
}
.landing-award {
  min-width: 0;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 1rem;
  align-items: start;
  padding: clamp(1.1rem, 1.9vw, 1.55rem);
  background: #fff;
  border: 1px solid var(--rule);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.landing-award:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 42px -30px rgba(0, 0, 0, 0.42);
  border-color: color-mix(in oklch, var(--ink), transparent 58%);
}
.landing-award__stamp {
  width: 1.45rem;
  height: 1.45rem;
  margin-top: 0.18rem;
}
.landing-award__org {
  color: var(--ink-3);
  font-size: 0.58rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.landing-award__title {
  margin-top: 0.3rem;
  color: var(--ink);
  font-weight: 500;
  line-height: 1.26;
}
.landing-award__project {
  margin-top: 0.28rem;
  color: var(--ink-3);
  line-height: 1.3;
}
.landing-v1__references .refs {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(0.75rem, 1.4vw, 1.1rem);
}
.landing-v1__references .refs__message {
  background: #fff;
  border: 1px solid var(--rule);
}

/* ── closing dark CTA band ── */
.landing-cta {
  position: relative;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  margin-top: clamp(4.5rem, 10vw, 9rem);
  padding: clamp(3.6rem, 8vw, 7rem) var(--lv-bleed);
  color: var(--lv-on-dark);
  background:
    radial-gradient(100% 130% at 86% 8%, rgba(212, 42, 32, 0.20), transparent 54%),
    radial-gradient(80% 120% at 6% 100%, rgba(14, 99, 142, 0.16), transparent 60%),
    var(--lv-dark);
  overflow: hidden;
}
.landing-cta__inner {
  max-width: 62rem;
}
.landing-cta__headline-link {
  display: inline-block;
  color: inherit;
  text-decoration: none;
}
.landing-cta__headline-link:hover .landing-cta__title,
.landing-cta__headline-link:focus-visible .landing-cta__title {
  color: var(--lv-on-dark);
  text-decoration: underline;
  text-decoration-thickness: 0.055em;
  text-underline-offset: 0.11em;
}
.landing-cta__eyebrow {
  margin: 0 0 1.2rem;
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  color: var(--lv-on-dark-dim);
  font-size: 0.64rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
}
.landing-cta__eyebrow::before {
  content: "";
  width: 1.7rem;
  height: 1px;
  background: var(--lv-accent);
}
.landing-cta__title {
  margin: 0;
  max-width: 16ch;
  font-family: var(--lv-display);
  font-weight: 400;
  font-size: clamp(2.7rem, 6.4vw, 6.4rem);
  line-height: 0.88;
  letter-spacing: 0.01em;
  text-transform: uppercase;
}
.landing-cta__text {
  margin: clamp(1.1rem, 2vw, 1.6rem) 0 0;
  max-width: 48ch;
  font-family: var(--serif);
  font-size: clamp(1.02rem, 1.4vw, 1.28rem);
  line-height: 1.5;
  color: rgba(246, 245, 242, 0.82);
}
.landing-cta__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  margin-top: clamp(1.6rem, 3vw, 2.4rem);
}
.landing-v1-shell .page-footer,
.landing-v1-shell footer {
  margin-top: clamp(3rem, 6vw, 5rem);
}

/* ── closing proof chapter ── */
.landing-end-proof {
  position: relative;
  z-index: 12;
  width: 100%;
  padding: clamp(4.5rem, 9vw, 8rem) 0 0;
  color: var(--ink);
  background: var(--paper);
}
.landing-end-proof__inner,
.landing-end-proof__footer {
  box-sizing: border-box;
  width: min(100%, var(--maxw));
  margin: 0 auto;
  padding-right: var(--pad);
  padding-left: var(--pad);
}
.landing-end-proof #landing-end-awards {
  margin-top: 0;
}
.landing-end-proof #landing-end-endorsements {
  margin-top: clamp(5rem, 10vw, 9rem);
}
.landing-end-proof .landing-cta {
  margin-top: clamp(5rem, 11vw, 10rem);
}
.landing-end-proof__footer .page-footer {
  margin-top: 0;
}

@media (max-width: 980px) {
  .landing-v1__hero {
    grid-template-columns: 1fr;
    min-height: 0;
    padding-top: clamp(2.4rem, 8vw, 3.2rem);
    padding-bottom: clamp(2rem, 7vw, 3rem);
  }
  .landing-v1__title {
    font-size: clamp(3rem, 14vw, 5.2rem);
  }
  .landing-v1__demo {
    height: min(96vw, 34rem);
    min-height: 24rem;
    margin: clamp(1rem, 4vw, 2rem) calc(var(--lv-bleed) * -1) 0;
  }
  .landing-v1__visual-stage {
    min-height: min(70vw, 30rem);
  }
  .landing-v1__demo .tv-hero {
    transform: none;
  }
  .landing-v1__demo .tv-hero__canvas {
    top: -8rem;
    width: min(178vw, 62rem);
    min-height: 0;
  }
  .landing-proof,
  .landing-awards,
  .landing-v1__references .refs {
    grid-template-columns: 1fr;
  }
  .landing-v1-shell .section__label-num {
    font-size: clamp(2.2rem, 11vw, 3.4rem);
  }
  .hand-of-god-feature {
    min-height: 36rem;
  }
}
@media (min-width: 761px) and (max-width: 1180px) {
  .crt-enter {
    scroll-snap-align: none;
  }
  .landing-v1__hero {
    display: block;
    min-height: auto;
    height: auto;
    padding: 0;
  }
  .landing-v1__demo {
    height: clamp(38rem, 82svh, 54rem);
    min-height: 0;
    margin: 0 calc(50% - 50vw);
  }
  .landing-v1__demo .tv-hero,
  .landing-v1__demo .tv-hero__canvas {
    width: 100vw;
    height: 100%;
    min-height: 0;
  }
  .landing-v1__demo .tv-hero__canvas {
    top: 0;
    transform: none;
  }
  .landing-v1__featured-demos,
  .landing-v1-shell .section {
    margin-top: clamp(3rem, 7vw, 5.5rem);
  }
  .landing-v1-shell .section__label {
    gap: 0.85rem;
  }
  .landing-v1-shell .section__label-title {
    max-width: 46ch;
    line-height: 1.35;
  }
  .help-feature {
    grid-template-columns: 1fr;
    gap: clamp(1.4rem, 4vw, 2.4rem);
  }
  .help-feature__player-col,
  .help-feature__notes--match-stack {
    min-height: 0;
  }
  .help-feature__notes--match-stack {
    max-width: 66ch;
  }
  #blackbird {
    min-height: auto;
  }
  #hand-of-god.section {
    min-height: auto;
    scroll-snap-stop: normal;
  }
  .hand-of-god-feature {
    grid-template-columns: 1fr;
    grid-template-rows: minmax(34rem, 64svh) auto;
    height: auto;
    min-height: 0;
  }
  .hand-of-god-feature__note {
    border-left: 0;
    border-top: 1px solid rgba(245, 245, 242, 0.16);
  }
  .hand-of-god-feature__note p {
    max-width: 66ch;
  }
  #louis-vuitton-ss20-after-kiss .louis-vuitton-feature,
  #kiss-new-era .kiss-new-era__layout {
    grid-template-columns: 1fr;
    grid-template-areas:
      "intro"
      "player";
  }
  #louis-vuitton-ss20-after-kiss .help-hero__intro,
  #kiss-new-era .help-hero__intro,
  .help-hero__intro {
    max-width: 68ch;
    margin-inline: 0;
    text-align: left;
  }
  .landing-proof,
  .landing-awards,
  .landing-v1__references .refs {
    grid-template-columns: 1fr;
  }
}
`;

function VariantStyles() {
  return <style>{LANDING_VARIANT_CSS}</style>;
}

function VersionRouteNav({ current = 'legacy' }) {
  const links = [
    { id: 'current', href: 'Resume.html', label: 'current' },
    { id: 'landing-v1', href: 'landing-v1.html', label: 'landing-v1' },
    { id: 'resume', href: '/Resume.html', label: 'resume' },
  ];
  return (
    <nav className={`version-route-nav version-route-nav--${current} mono`} aria-label="Versioned site routes">
      {links.map((link) => (
        <a
          key={link.id}
          href={link.href}
          aria-current={current === link.id ? 'page' : undefined}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}

function LandingProofHighlights() {
  const items = [
    {
      meta: 'ILM StageCraft',
      title: 'Real-time production infrastructure',
      text: 'R&D and virtual production engineering across major feature and episodic LED volume work.',
    },
    {
      meta: 'Mill Stitch / HELP',
      title: 'Director-facing 360 preview',
      text: 'Co-invented the on-set toolset that helped Justin Lin direct live surround action.',
    },
    {
      meta: 'The Mill Blackbird',
      title: 'Product-shaped production R&D',
      text: 'Led technical product management across the adjustable car rig, workflow, and CG pipeline.',
    },
    {
      meta: 'Poetry in Proof',
      title: 'Browser-native generative system',
      text: 'Audio, code, MIDI, and motion tied to one live clock inside the page.',
    },
  ];
  return (
    <Section id="landing-proof" label="04 · STANDOUT WORK">
      <div className="landing-proof">
        {items.map((item, index) => (
          <article key={item.meta} className="landing-proof__item">
            <span className="landing-proof__index mono">{String(index + 1).padStart(2, '0')}</span>
            <p className="landing-proof__meta mono">{item.meta}</p>
            <h3 className="landing-proof__title">{item.title}</h3>
            <p className="landing-proof__text">{item.text}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}

function LandingAwards({ items }) {
  const featured = items.filter((award) => award.tier === 'gold').slice(0, 6);
  return (
    <Section id="landing-awards" label="05 · ACCOLADES">
      <ul className="landing-awards">
        {featured.map((award) => (
          <li key={`${award.org}-${award.title}`} className="landing-award">
            <AwardStamp tier={award.tier} className="landing-award__stamp" />
            <div>
              <div className="landing-award__org mono">{award.org}</div>
              <div className="landing-award__title">{award.title}</div>
              <div className="landing-award__project serif italic">{award.project}</div>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function LandingReferences({ items }) {
  const refShapes = ['triangle', 'circle', 'square'];
  return (
    <div className="landing-v1__references">
      <Section id="landing-refs" label="06 · REFERENCES">
        <ol className="refs">
          {items.slice(0, 3).map((item, index) => (
            <li key={item.name}>
              <ReferenceMessage item={item} index={index} shapes={refShapes} />
            </li>
          ))}
        </ol>
      </Section>
    </div>
  );
}

// HELP intro: a sticky two-panel scroll stage that side-swipes from the crew
// still (A) to Justin Lin directing (B) as you scroll, before the live demo.
function HelpIntroStage({ src }) {
  const ref = useRef(null);
  const [live, setLive] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let raf = 0;
    let wheelSync = 0;
    let isLive = false;
    const clamp01 = (v) => Math.min(Math.max(v, 0), 1);
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const range = el.offsetHeight - vh;
      const p = range > 0 ? clamp01(-rect.top / range) : 0;
      const ss = (t) => t * t * (3 - 2 * t);          // smoothstep = feathered ramp
      const swipe1 = ss(clamp01((p - 0.16) / 0.22));  // A -> B crossfade
      const swipe2 = ss(clamp01((p - 0.52) / 0.22));  // B -> player crossfade
      const copy = 1 - clamp01((p - 0.16) / 0.14);
      const awards = clamp01((p - 0.36) / 0.12);
      const cue = 1 - clamp01((p - 0.5) / 0.1);
      el.style.setProperty('--b-op', (swipe1 * (1 - swipe2)).toFixed(4));
      el.style.setProperty('--c-op', swipe2.toFixed(4));
      el.style.setProperty('--help-copy', copy.toFixed(4));
      el.style.setProperty('--help-awards', awards.toFixed(4));
      el.style.setProperty('--help-label', (1 - swipe2).toFixed(4));
      el.style.setProperty('--help-cue', cue.toFixed(4));
      const nowLive = swipe2 > 0.92;
      if (nowLive !== isLive) { isLive = nowLive; setLive(nowLive); }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <section className="help-intro-stage" id="help-intro" ref={ref} aria-label="HELP - Mill Stitch">
      <div className={`help-intro-stage__sticky ${live ? 'is-live' : ''}`}>
        <div className="his-panel his-panel--a">
          <div className="his-bg his-bg--a" aria-hidden="true" />
          <div className="his-veil" aria-hidden="true" />
          <div className="help-intro-stage__copy">
            <h3 className="serif">A Hollywood-scale immersive film, built for mobile.</h3>
            <p>
              <em>HELP</em> (dir. Justin Lin) was the first Hollywood-scale immersive cinematic
              experience built for mobile — a Google Spotlight Stories title produced more than
              ten years ahead of its time.
            </p>
            <p>
              As Creative Technology Director, I worked with our artists, engineers, and partners
              at Google, Derivative, and Keslow Camera from concept through a first-of-its-kind,
              award-winning deliverable powered by <strong>Mill Stitch&trade;</strong>.
            </p>
          </div>
        </div>
        <div className="his-panel his-panel--b">
          <div className="his-bg his-bg--b" aria-hidden="true" />
          <div className="his-veil" aria-hidden="true" />
          <div className="help-intro-stage__awards">
            <p className="help-intro-stage__awards-kicker mono">HELP &middot; Mill Stitch&trade; &mdash; Recognition</p>
            <h3 className="help-intro-stage__awards-head">Three golds<br />and a Webby.</h3>
            <ul className="help-intro-stage__awards-list">
              <li>
                <span className="help-intro-stage__awards-org">Cannes Lions</span>
                <span className="help-intro-stage__awards-desc mono">Gold &middot; Innovative Use of Technology</span>
              </li>
              <li>
                <span className="help-intro-stage__awards-org">Cannes Lions</span>
                <span className="help-intro-stage__awards-desc mono">Gold &middot; Virtual Reality</span>
              </li>
              <li>
                <span className="help-intro-stage__awards-org">SXSW</span>
                <span className="help-intro-stage__awards-desc mono">Gold &middot; AR/VR Breakthrough Innovation</span>
              </li>
              <li>
                <span className="help-intro-stage__awards-org">Webby Awards</span>
                <span className="help-intro-stage__awards-desc mono">Technical Achievement &middot; 20th Annual</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="his-panel his-panel--c">
          <HelpPlayer src={src} startOffset={2} />
        </div>
        <div className="help-intro-stage__label">
          <span className="help-intro-stage__label-num">01</span>
          <span className="help-intro-stage__label-title">Cinematic Innovation &middot; Mill Stitch&trade; / HELP</span>
        </div>
        <div className="help-intro-stage__cue mono">&darr; keep scrolling</div>
      </div>
    </section>
  );
}

// Hero name that reads as solid type at rest and flares ASCII/leet glyphs over
// individual letters in the Byrne triad as the music plays — bass swaps to
// filler glyphs (red), melody/harmony/chord light single letters (yellow/blue),
// and drum hits jitter the whole word. Glyphs overlay via ::after so swaps never
// reflow the layout. Falls silent (clean type) when no audio is playing.
// Uniform cap-height set (digits + uppercase) so the hi-hat shuffle never
// changes character size. Add ascii symbols here only if they match cap height.
const ASCII_NAME_SHUFFLE = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';

// 5x7 "FATFONT" bitmap — the hero name is drawn as literal square pixels on a
// grid (one <canvas> per letter), the classic Mac Font Editor look. '#' = filled
// cell. The '.' (period) glyph is a narrower 2-wide block. Covers A-Z + 0-9 so it
// serves both the name and the hi-hat scramble set (ASCII_NAME_SHUFFLE).
const FAT_FONT = {
  '0': ['.###.', '#...#', '#..##', '#.#.#', '##..#', '#...#', '.###.'],
  '1': ['..#..', '.##..', '..#..', '..#..', '..#..', '..#..', '.###.'],
  '2': ['.###.', '#...#', '....#', '..##.', '.#...', '#....', '#####'],
  '3': ['#####', '...#.', '..##.', '...#.', '....#', '#...#', '.###.'],
  '4': ['...#.', '..##.', '.#.#.', '#..#.', '#####', '...#.', '...#.'],
  '5': ['#####', '#....', '####.', '....#', '....#', '#...#', '.###.'],
  '6': ['..##.', '.#...', '#....', '####.', '#...#', '#...#', '.###.'],
  '7': ['#####', '....#', '...#.', '..#..', '.#...', '.#...', '.#...'],
  '8': ['.###.', '#...#', '#...#', '.###.', '#...#', '#...#', '.###.'],
  '9': ['.###.', '#...#', '#...#', '.####', '....#', '...#.', '.##..'],
  'A': ['.###.', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  'B': ['####.', '#...#', '#...#', '####.', '#...#', '#...#', '####.'],
  'C': ['.###.', '#...#', '#....', '#....', '#....', '#...#', '.###.'],
  'D': ['###..', '#..#.', '#...#', '#...#', '#...#', '#..#.', '###..'],
  'E': ['#####', '#....', '#....', '####.', '#....', '#....', '#####'],
  'F': ['#####', '#....', '#....', '####.', '#....', '#....', '#....'],
  'G': ['.###.', '#...#', '#....', '#.###', '#...#', '#...#', '.###.'],
  'H': ['#...#', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  'I': ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '#####'],
  'J': ['..###', '...#.', '...#.', '...#.', '#..#.', '#..#.', '.##..'],
  'K': ['#...#', '#..#.', '#.#..', '##...', '#.#..', '#..#.', '#...#'],
  'L': ['#....', '#....', '#....', '#....', '#....', '#....', '#####'],
  'M': ['#...#', '##.##', '#.#.#', '#.#.#', '#...#', '#...#', '#...#'],
  'N': ['#...#', '##..#', '#.#.#', '#.#.#', '#..##', '#...#', '#...#'],
  'O': ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  'P': ['####.', '#...#', '#...#', '####.', '#....', '#....', '#....'],
  'Q': ['.###.', '#...#', '#...#', '#...#', '#.#.#', '#..#.', '.##.#'],
  'R': ['####.', '#...#', '#...#', '####.', '#.#..', '#..#.', '#...#'],
  'S': ['.###.', '#...#', '#....', '.###.', '....#', '#...#', '.###.'],
  'T': ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..'],
  'U': ['#...#', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  'V': ['#...#', '#...#', '#...#', '#...#', '.#.#.', '.#.#.', '..#..'],
  'W': ['#...#', '#...#', '#...#', '#.#.#', '#.#.#', '##.##', '#...#'],
  'X': ['#...#', '#...#', '.#.#.', '..#..', '.#.#.', '#...#', '#...#'],
  'Y': ['#...#', '#...#', '.#.#.', '..#..', '..#..', '..#..', '..#..'],
  'Z': ['#####', '....#', '...#.', '..#..', '.#...', '#....', '#####'],
  '.': ['..', '..', '..', '..', '..', '##', '##'],
  // Lowercase forms for the name itself (x-height body in the lower rows,
  // ascenders on t/f reaching up, i's dot up top). The uppercase set above is
  // kept for reference; the name + its decode scramble now use these.
  't': ['..#..', '..#..', '.###.', '..#..', '..#..', '..#..', '..##.'],
  'a': ['.....', '.....', '.###.', '....#', '.####', '#...#', '.####'],
  'w': ['.....', '.....', '#...#', '#...#', '#.#.#', '#.#.#', '.#.#.'],
  'f': ['..##.', '.#...', '####.', '.#...', '.#...', '.#...', '.#...'],
  'e': ['.....', '.....', '.###.', '#...#', '#####', '#....', '.###.'],
  'q': ['.....', '.....', '.####', '#...#', '#...#', '.####', '....#'],
  'm': ['.....', '.....', '#####', '#.#.#', '#.#.#', '#.#.#', '#.#.#'],
  'r': ['.....', '.....', '#.##.', '##...', '#....', '#....', '#....'],
  'i': ['..#..', '.....', '..#..', '..#..', '..#..', '..#..', '..##.'],
  'n': ['.....', '.....', '#.##.', '##..#', '#...#', '#...#', '#...#'],
};

function AsciiName({ text }) {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    const all = Array.from(root.querySelectorAll('canvas[data-base]'));
    if (!all.length) return undefined;
    const letters = all.filter((cv) => cv.dataset.base !== '.');  // scramble/tint targets
    const dots = all.filter((cv) => cv.dataset.base === '.');
    const rand = (n) => (Math.random() * n) | 0;
    // Decode scramble cycles the name's own lowercase letters, so the hollow
    // glyphs keep the same x-height as the resolved name (no height jump).
    const NAME_SCRAMBLE = 'tawfeqmrin';
    const rollGlyph = () => NAME_SCRAMBLE[rand(NAME_SCRAMBLE.length)];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const styles = getComputedStyle(root);
    const baseColor = styles.getPropertyValue('--lv-on-dark').trim() || '#f6f5f2';
    const accent = styles.getPropertyValue('--lv-accent').trim() || '#ff4438';

    // Paint one glyph as square "pixels". Solid fills the cells; hollow strokes
    // their outline (the no-fill decode look that stands out mid-scroll).
    const drawGlyph = (cv, glyph, hollow, color) => {
      const ctx = cv.getContext('2d');
      const W = cv.width;
      const H = cv.height;
      if (!W || !H) return;
      ctx.clearRect(0, 0, W, H);
      const rows = FAT_FONT[glyph];
      if (!rows) return;
      const nCols = rows[0].length;
      const nRows = rows.length;
      const cw = W / nCols;
      const ch = H / nRows;
      const gap = Math.max(dpr, Math.min(cw, ch) * 0.14);   // grid spacing between pixels
      const lw = Math.max(dpr * 1.25, Math.min(cw, ch) * 0.16);
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = lw;
      for (let r = 0; r < nRows; r++) {
        const line = rows[r];
        for (let c = 0; c < nCols; c++) {
          if (line[c] !== '#') continue;
          const x = c * cw + gap / 2;
          const y = r * ch + gap / 2;
          const w = cw - gap;
          const h = ch - gap;
          if (hollow) ctx.strokeRect(x + lw / 2, y + lw / 2, Math.max(0, w - lw), Math.max(0, h - lw));
          else ctx.fillRect(x, y, w, h);
        }
      }
    };

    const sizeAll = () => {
      all.forEach((cv) => {
        const w = Math.round(cv.clientWidth * dpr);
        const h = Math.round(cv.clientHeight * dpr);
        if (w && cv.width !== w) cv.width = w;
        if (h && cv.height !== h) cv.height = h;
      });
    };
    const baseGlyph = (cv) => cv.dataset.base.toLowerCase();

    const until = new Array(letters.length).fill(0);      // scramble end time per letter
    const tintUntil = new Array(letters.length).fill(0);  // bass-color hold per letter
    const tintColor = new Array(letters.length).fill(baseColor);
    const sig = new Array(letters.length).fill('');       // last-drawn signature, skips redundant redraws
    let frozenUntil = 0;

    const redrawAll = () => {
      sizeAll();
      sig.fill('');
      dots.forEach((cv) => drawGlyph(cv, '.', false, accent));
    };
    redrawAll();
    // Layout/fonts may settle a frame late; redraw once more so canvases aren't blank.
    const initRAF = requestAnimationFrame(redrawAll);

    // Hi-hats scroll a FEW letters at a time as hollow pixels cycling the
    // cap-height set — a visible "decode" that stays easy to read. Every snare
    // lands all letters solid on the name and freezes for a beat. Bass tints one
    // settled letter in the keyboard triad (R/Y/B). Same logic as before, now
    // drawn as a literal pixel grid instead of swapped text glyphs.
    const loop = setInterval(() => {
      const now = performance.now();
      const frozen = now < frozenUntil;
      letters.forEach((cv, i) => {
        if (!frozen && now < until[i]) {
          drawGlyph(cv, rollGlyph(), true, baseColor);     // hollow random pixel glyph
          sig[i] = 'scramble';
        } else {
          const color = now < tintUntil[i] ? tintColor[i] : baseColor;
          const s = `solid:${color}`;
          if (sig[i] !== s) {
            drawGlyph(cv, baseGlyph(cv), false, color);
            sig[i] = s;
          }
        }
      });
    }, 50);

    const startScramble = (count) => {
      const now = performance.now();
      for (let i = 0; i < count; i++) until[rand(until.length)] = now + 150 + rand(150);
    };
    const BASS_KEY_COLORS = ['#ff453a', '#ffd60a', '#0a84ff'];   // R -> Y -> B
    let bassKeyIndex = 0;
    const onBass = (event) => {
      const color = BASS_KEY_COLORS[bassKeyIndex % BASS_KEY_COLORS.length];
      bassKeyIndex += 1;
      const now = performance.now();
      const idle = [];
      letters.forEach((_, i) => { if (!(now < until[i])) idle.push(i); });   // prefer settled letters
      const i = idle.length ? idle[rand(idle.length)] : rand(letters.length);
      tintColor[i] = color;
      tintUntil[i] = now + Math.max(160, Math.min(400, event.detail?.duration || 220));
    };
    const onDrum = (event) => {
      const lane = event.detail?.lane;
      if (lane === 'hat') {
        startScramble(1 + rand(2));                  // 1-2 letters scroll per hat
      } else if (lane === 'snare') {
        const dur = event.detail.duration || 180;
        frozenUntil = performance.now() + Math.max(190, Math.min(440, dur * 1.7));
        until.fill(0);                               // land on the name
      }
    };
    let resizeRAF = 0;
    const onResize = () => {
      if (resizeRAF) return;
      resizeRAF = requestAnimationFrame(() => { resizeRAF = 0; redrawAll(); });
    };
    window.addEventListener('resume-bass-hit', onBass);
    window.addEventListener('resume-drum-hit', onDrum);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resume-bass-hit', onBass);
      window.removeEventListener('resume-drum-hit', onDrum);
      window.removeEventListener('resize', onResize);
      clearInterval(loop);
      cancelAnimationFrame(initRAF);
      if (resizeRAF) cancelAnimationFrame(resizeRAF);
    };
  }, [text]);
  const words = text.split(' ');
  return (
    <h1 className="landing-v1__title landing-v1__title--fat" aria-label={text} ref={ref}>
      {words.map((word, wi) => (
        <React.Fragment key={wi}>
          {wi > 0 ? <span className="lv-fat-space" aria-hidden="true" /> : null}
          <span className="lv-word" aria-hidden="true">
            {Array.from(word).map((ch, i) => (
              ch === '.'
                ? <canvas key={i} className="lv-fat lv-fat--dot" data-base="." />
                : <canvas key={i} className="lv-fat" data-base={ch} />
            ))}
          </span>
        </React.Fragment>
      ))}
    </h1>
  );
}

// Tab title decode-scroll: the browser tab shows "TM" and scrolls those two
// characters through the same uniform cap-height glyph set as the hero name,
// driven by the same music events. Hi-hats scramble a slot for a short burst;
// every snare lands both slots back on "TM" and freezes for a beat. Plain text
// only (tabs can't render the hollow outline / Byrne tint), so this mirrors the
// scroll, not the color. Runs as a one-shot setup (no React tree) so it works on
// every page that loads the bundle, regardless of which App branch renders.
function setupTabTitle() {
  const BASE = 'TM';
  const slots = Array.from(BASE);
  const until = new Array(slots.length).fill(0);
  let frozenUntil = 0;
  let last = '';
  const rand = (n) => (Math.random() * n) | 0;
  const rollGlyph = () => ASCII_NAME_SHUFFLE[rand(ASCII_NAME_SHUFFLE.length)];
  const paint = (next) => { if (next !== last) { document.title = next; last = next; } };
  paint(BASE);
  setInterval(() => {
    const now = performance.now();
    const frozen = now < frozenUntil;
    let out = '';
    for (let i = 0; i < slots.length; i++) {
      out += (!frozen && now < until[i]) ? rollGlyph() : slots[i];
    }
    paint(out);
  }, 50);
  const startScramble = (count) => {
    const now = performance.now();
    for (let i = 0; i < count; i++) until[rand(until.length)] = now + 150 + rand(150);
  };
  window.addEventListener('resume-drum-hit', (event) => {
    const lane = event.detail?.lane;
    if (lane === 'hat') {
      startScramble(1 + rand(slots.length));          // 1-2 chars scroll per hat
    } else if (lane === 'snare') {
      const dur = event.detail.duration || 180;
      frozenUntil = performance.now() + Math.max(190, Math.min(440, dur * 1.7));
      until.fill(0);                                   // land on "TM"
    }
  });
}

function LandingClosingCta({ linkedInOnly = false } = {}) {
  return (
    <section className="landing-cta" aria-label="Contact Tawfeeq Martin">
      <div className="landing-cta__inner">
        <a className="landing-cta__headline-link" href="mailto:tawfeeqmartin@gmail.com">
          <p className="landing-cta__eyebrow mono">Say hello</p>
          <h2 className="landing-cta__title">Let&rsquo;s make something strange.</h2>
        </a>
        <p className="landing-cta__text">
          Have a hard problem, an impossible brief, or a half-formed idea? I&rsquo;d like to hear it.
        </p>
        <div className="landing-cta__actions mono">
          {!linkedInOnly && (
            <a className="landing-v1__action landing-v1__action--primary" href={`mailto:${RESUME.email}`}>email tawfeeq</a>
          )}
          <a
            className={`landing-v1__action${linkedInOnly ? ' landing-v1__action--primary' : ''}`}
            href="https://www.linkedin.com/in/tawfeeqmartin/"
            target="_blank"
            rel="noreferrer"
          >
            linkedin
          </a>
        </div>
      </div>
    </section>
  );
}

function LandingEndProof({ awards, references }) {
  return (
    <div className="landing-end-proof">
      <div className="landing-end-proof__inner">
        <Awards
          items={awards}
          id="landing-end-awards"
          label="07 · AWARDS & RECOGNITION"
        />
        <References
          items={references}
          id="landing-end-endorsements"
          label="08 · ENDORSEMENTS"
        />
      </div>
      <LandingClosingCta />
      <div className="landing-end-proof__footer">
        <Footer data={RESUME} />
      </div>
    </div>
  );
}

function VfxMarkerField() {
  return (
    <div className="vfx-marker-field" aria-hidden="true">
      {Array.from({ length: 6 }, (_, index) => <span className="vfx-marker" key={index} />)}
    </div>
  );
}

function CrtResolveCalibration() {
  const upper = ['#b4b4b4', '#b4b410', '#10b4b4', '#10b410', '#b410b4', '#b41010', '#1010b4'];
  const middle = ['#1010b4', '#101010', '#b410b4', '#101010', '#10b4b4', '#101010', '#b4b4b4'];
  const lower = ['#00214c', '#f2f2f2', '#32006a', '#101010', '#050505', '#101010', '#1b1b1b'];
  return (
    <div className="crt-foreshadow__layer crt-foreshadow__layer--resolve" aria-hidden="true">
      <div className="crt-resolve-calibration__card crt-resolve-calibration__card--bars crt-resolve-bars">
        <div className="crt-resolve-bars__row crt-resolve-bars__row--upper">
          {upper.map((color, index) => (
            <span className="crt-resolve-bars__bar" style={{ background: color }} key={`u-${index}`} />
          ))}
        </div>
        <div className="crt-resolve-bars__row crt-resolve-bars__row--middle">
          {middle.map((color, index) => (
            <span className="crt-resolve-bars__bar" style={{ background: color }} key={`m-${index}`} />
          ))}
        </div>
        <div className="crt-resolve-bars__row crt-resolve-bars__row--lower">
          {lower.map((color, index) => (
            <span className="crt-resolve-bars__bar" style={{ background: color }} key={`l-${index}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

const BEAUTIFUL_GAME_SHADER_FORESHADOW = `const particleMaterial = new THREE.ShaderMaterial({
  uniforms: { uTime, uMorph, uRevealTime, uFocusRadius },
  vertexShader: \`
    attribute vec3 aStart;
    attribute float aSeed;
    float reveal = smoothstep(aStartTime, aStartTime + .18, uRevealTime);
    vec3 resolvedPosition = mix(aStart, position, smoothstep(0., 1., uMorph));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(resolvedPosition, 1.);
  \`,
  fragmentShader: \`
    float edgeMask = 1. - smoothstep(.76, 1., dot(gl_PointCoord-.5, gl_PointCoord-.5)*4.);
    gl_FragColor = vec4(vColor, edgeMask * vOpacity);
  \`
});`;

const BEAUTIFUL_GAME_MATCH_FORESHADOW = `const matchLineMaterial = new THREE.ShaderMaterial({
  uniforms: { uMatchTime, uTime, uGridSeconds },
  vertexShader: \`
    attribute float aTime;
    attribute float aDash;
    float reveal = smoothstep(aTime, aTime + .16, uMatchTime);
    float head = 1. - smoothstep(0., .13, fract((uMatchTime-aTime)/uGridSeconds));
    vOpacity = reveal * max(head, .18);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
  \`,
  fragmentShader: \`
    float radiusSq = dot(gl_PointCoord-.5, gl_PointCoord-.5)*4.;
    float edgeMask = 1. - smoothstep(.74, 1., radiusSq);
    gl_FragColor = vec4(vColor, edgeMask * vOpacity);
  \`
});`;

const BEAUTIFUL_GAME_POINT_CLOUD_FORESHADOW = `function sampleCloud(vertices, normals, bounds, pointCount, seed) {
  const rng = createRng(seed);
  const positions = new Float32Array(pointCount * 3);
  const colors = new Float32Array(pointCount * 3);
  const seeds = new Float32Array(pointCount);
  const ballMask = new Float32Array(pointCount);
  const regions = new Float32Array(pointCount);
  const center = bounds.getCenter(new THREE.Vector3());
  const size = bounds.getSize(new THREE.Vector3());
  const scale = 5.25 / Math.max(size.x, size.y, size.z);
  const sourceCount = Math.max(1, vertices.length / 3);
  for (let i = 0; i < pointCount; i += 1) {
    const sourceVertex = Math.floor(rng() * sourceCount);
    const sourceIndex = sourceVertex * 3;
    positions[i * 3] = (vertices[sourceIndex] - center.x) * scale;
    positions[i * 3 + 1] = (vertices[sourceIndex + 1] - center.y) * scale;
    positions[i * 3 + 2] = (vertices[sourceIndex + 2] - center.z) * scale;
    seeds[i] = rng() * 10000 + i * 0.013;
  }
  return new THREE.BufferGeometry()
    .setAttribute("position", new THREE.BufferAttribute(positions, 3))
    .setAttribute("color", new THREE.BufferAttribute(colors, 3))
    .setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1))
    .setAttribute("aBall", new THREE.BufferAttribute(ballMask, 1))
    .setAttribute("aRegion", new THREE.BufferAttribute(regions, 1));
}`;

const BEAUTIFUL_GAME_WIRECLOUD_FORESHADOW = `def contact_detail_edges(vertices, edges, ball, bounds, labels, owners, project):
    ball_center = ball["center"]
    ball_radius = ball["radius"]
    cell_size = max(max(bounds_size(bounds)) / 58.0, 0.001)
    focus_radius = ball_radius * 4.8
    clusters = {}
    def cluster_key(point):
        return (
            round((point.x - bounds[0].x) / cell_size),
            round((point.y - bounds[0].y) / cell_size),
            round((point.z - bounds[0].z) / cell_size),
        )
    clustered_edges = set()
    for a, b in edges:
        start, end = vertices[a], vertices[b]
        mid = (start + end) * 0.5
        distance = (mid - ball_center).length
        if distance < ball_radius * 0.86 or distance > focus_radius:
            continue
        key_a, key_b = cluster_key(start), cluster_key(end)
        if key_a != key_b:
            owner = owner_for_vertex(labels, owners, a, "opponent")
            clustered_edges.add((*tuple(sorted((key_a, key_b))), owner))
    return project_contact_graph(clustered_edges, clusters)`;

const BEAUTIFUL_GAME_HOMOGRAPHY_FORESHADOW = `def estimate_homography_from_keypoints(keypoints, min_points=6):
    pitch = SoccerPitch()
    xy = keypoints.xy[0]
    mask = (xy[:, 0] > 1) & (xy[:, 1] > 1)
    if keypoints.confidence is not None:
        mask = mask & (keypoints.confidence[0] > 0.25)
    visible = int(mask.sum())
    if visible < min_points:
        return None
    source = xy[mask].astype(np.float32)
    target = np.array(pitch.vertices, dtype=np.float32)[mask]
    matrix, inliers = cv2.findHomography(
        source,
        target,
        method=cv2.RANSAC,
        ransacReprojThreshold=350,
    )
    projected = cv2.perspectiveTransform(
        source.reshape(-1, 1, 2), matrix
    ).reshape(-1, 2)
    distances = np.linalg.norm(projected - target, axis=1)
    error = float(distances[inliers.ravel() == 1].mean())
    return HomographySnapshot(matrix, visible, len(xy), error)`;

const BEAUTIFUL_GAME_PIPELINE_FORESHADOW = `def build_prompt(job, variant, style_name):
    template = json.loads(PROMPT_PATH.read_text())
    sequence = job["sequence"]
    width, height = sequence["crop_raster"]
    first_bbox = sequence["frames"][0]["player_bbox_in_crop_ltrb"]
    center_x = round((first_bbox[0] + first_bbox[2]) * 0.5)
    center_y = round((first_bbox[1] + first_bbox[3]) * 0.45)
    replacements = {
        "__SOURCE_SEQUENCE_DIRECTORY__": sequence["remote_frames"],
        "__IDENTITY_IMAGE__": sequence["frames"][0]["source_image"],
        "__STYLE_IMAGE__": style_name,
        "__FRAME_COUNT__": int(sequence["frame_count"]),
        "__CROP_WIDTH__": int(width),
        "__CROP_HEIGHT__": int(height),
        "__POSE_RESOLUTION__": max(64, ceil64(max(width, height))),
        "__POSITIVE_COORDS__": json.dumps([{"x": center_x, "y": center_y}]),
        "__POSITIVE_PROMPT__": variant["positive_prompt"],
        "__NEGATIVE_PROMPT__": variant["negative_prompt"],
        "__SEED__": int(variant["seed"]),
        "__FPS__": float(job["source"]["fps"]),
    }
    return replace_placeholders(template, replacements)`;

const CRT_CODE_GLITCH_PAGES = [
  BEAUTIFUL_GAME_SHADER_FORESHADOW,
  BEAUTIFUL_GAME_MATCH_FORESHADOW,
  BEAUTIFUL_GAME_POINT_CLOUD_FORESHADOW,
  BEAUTIFUL_GAME_WIRECLOUD_FORESHADOW,
  BEAUTIFUL_GAME_HOMOGRAPHY_FORESHADOW,
  BEAUTIFUL_GAME_PIPELINE_FORESHADOW,
];
const CRT_CODE_GLITCH_PAGE_IDS = [
  'particle-shader',
  'match-lines',
  'point-cloud',
  'wire-cloud',
  'homography',
  'prompt-pipeline',
];

const randomPoolIndex = (length) => {
  const size = Math.max(1, Math.floor(Number(length) || 1));
  if (window.crypto?.getRandomValues) {
    const value = new Uint32Array(1);
    const unbiasedLimit = 0x100000000 - (0x100000000 % size);
    do {
      window.crypto.getRandomValues(value);
    } while (value[0] >= unbiasedLimit);
    return value[0] % size;
  }
  return Math.floor(Math.random() * size);
};

const CRT_GLITCH_AUDIO_SOURCES = [
  'media/audio/glitches/dry/dry-glitch-058.wav',
  'media/audio/glitches/dry/dry-glitch-093.wav',
  'media/audio/glitches/dry/dry-glitch-105.wav',
  'media/audio/glitches/dry/dry-glitch-144.wav',
  'media/audio/glitches/dry/dry-glitch-050.wav',
  'media/audio/glitches/dry/dry-glitch-130.wav',
  'media/audio/glitches/dry/dry-glitch-122.wav',
  'media/audio/glitches/dry/dry-glitch-125.wav',
  'media/audio/glitches/dry/dry-glitch-057.wav',
  'media/audio/glitches/dry/dry-glitch-082.wav',
  'media/audio/glitches/dry/dry-glitch-103.wav',
  'media/audio/glitches/dry/dry-glitch-113.wav',
  'media/audio/glitches/dry/dry-glitch-070.wav',
  'media/audio/glitches/dry/dry-glitch-048.wav',
  'media/audio/glitches/dry/dry-glitch-090.wav',
  'media/audio/glitches/dry/dry-glitch-131.wav',
  'media/audio/glitches/dry/dry-glitch-001.wav',
  'media/audio/glitches/dry/dry-glitch-022.wav',
  'media/audio/glitches/dry/dry-glitch-025.wav',
  'media/audio/glitches/dry/dry-glitch-036.wav',
  'media/audio/glitches/dry/dry-glitch-040.wav',
  'media/audio/glitches/dry/dry-glitch-041.wav',
  'media/audio/glitches/dry/dry-glitch-046.wav',
  'media/audio/glitches/dry/dry-glitch-047.wav',
  'media/audio/glitches/dry/dry-glitch-051.wav',
  'media/audio/glitches/dry/dry-glitch-053.wav',
  'media/audio/glitches/dry/dry-glitch-060.wav',
  'media/audio/glitches/dry/dry-glitch-061.wav',
  'media/audio/glitches/dry/dry-glitch-062.wav',
  'media/audio/glitches/dry/dry-glitch-068.wav',
  'media/audio/glitches/dry/dry-glitch-071.wav',
  'media/audio/glitches/dry/dry-glitch-074.wav',
  'media/audio/glitches/dry/dry-glitch-002.wav',
  'media/audio/glitches/dry/dry-glitch-006.wav',
  'media/audio/glitches/dry/dry-glitch-009.wav',
  'media/audio/glitches/dry/dry-glitch-014.wav',
  'media/audio/glitches/dry/dry-glitch-018.wav',
  'media/audio/glitches/dry/dry-glitch-021.wav',
  'media/audio/glitches/dry/dry-glitch-028.wav',
  'media/audio/glitches/dry/dry-glitch-033.wav',
  'media/audio/glitches/dry/dry-glitch-039.wav',
  'media/audio/glitches/dry/dry-glitch-043.wav',
  'media/audio/glitches/dry/dry-glitch-049.wav',
  'media/audio/glitches/dry/dry-glitch-054.wav',
  'media/audio/glitches/dry/dry-glitch-055.wav',
  'media/audio/glitches/dry/dry-glitch-063.wav',
  'media/audio/glitches/dry/dry-glitch-065.wav',
  'media/audio/glitches/dry/dry-glitch-067.wav',
  'media/audio/glitches/dry/dry-glitch-069.wav',
  'media/audio/glitches/dry/dry-glitch-072.wav',
  'media/audio/glitches/dry/dry-glitch-076.wav',
  'media/audio/glitches/dry/dry-glitch-077.wav',
  'media/audio/glitches/dry/dry-glitch-080.wav',
  'media/audio/glitches/dry/dry-glitch-083.wav',
  'media/audio/glitches/dry/dry-glitch-087.wav',
  'media/audio/glitches/dry/dry-glitch-089.wav',
  'media/audio/glitches/dry/dry-glitch-094.wav',
  'media/audio/glitches/dry/dry-glitch-097.wav',
  'media/audio/glitches/dry/dry-glitch-100.wav',
  'media/audio/glitches/dry/dry-glitch-109.wav',
  'media/audio/glitches/dry/dry-glitch-114.wav',
  'media/audio/glitches/dry/dry-glitch-118.wav',
  'media/audio/glitches/dry/dry-glitch-133.wav',
  'media/audio/glitches/dry/dry-glitch-148.wav',
];
const CRT_RESOLVE_GLITCH_INDEX = CRT_GLITCH_AUDIO_SOURCES.indexOf(
  'media/audio/glitches/dry/dry-glitch-021.wav',
);
// Preserve the dry, hard-cut grammar while giving each non-reset glitch voice
// ten percent more decay before the next hit takes ownership.
const CRT_GLITCH_AUDIO_TAIL_SCALE = 1.10;
// Keep the broadcast reset intact while the melodic Sosumi wink is muted.
const CRT_SOSUMI_RESOLVE_ENABLED = false;
// Long enough to register as a broadcast calibration card, short enough to
// land as punctuation rather than a second ending.
const CRT_CALIBRATION_TONE_HOLD_MS = 1600;
const CRT_CALIBRATION_TONE_FADE_MS = 85;
const CRT_PHASE_NOTE_FREQUENCIES = {
  design: 329.63, // E4 — the question
  make: 293.66,   // D4 — the machine gathers force
  believe: 261.63, // C4 — the people bring it home
};
const crtPhaseForBeat = (beat = '') => {
  if (String(beat).startsWith('design-')) return 'design';
  if (String(beat).startsWith('make-')) return 'make';
  if (String(beat).startsWith('believe-')) return 'believe';
  return 'reset';
};
const crtVoiceRoleForEvent = (beat = '', kind = 'text', sequence = 0) => {
  const phase = crtPhaseForBeat(beat);
  if (kind === 'ratchet') return phase === 'make' ? 'spark' : 'chop';
  if (kind === 'idle') {
    if (phase === 'design') return sequence % 3 === 2 ? 'pull' : 'spark';
    if (phase === 'make') return sequence % 4 === 0 ? 'impact' : 'chop';
    if (phase === 'believe') return sequence % 2 === 0 ? 'human' : 'pull';
  }
  if (phase === 'design') return String(beat).endsWith('response') ? 'pull' : 'spark';
  if (phase === 'make') return String(beat).endsWith('response') ? 'chop' : 'impact';
  if (phase === 'believe') return String(beat).endsWith('response') ? 'human' : 'pull';
  return 'chop';
};
const CRT_ART_GLITCH_MEDIA = [
  // Exact one-bull-per-plate Taurus phase references, normalized to UHD on
  // Hermes so the LED wall never has to crop a contact sheet or enlarge a
  // sub-UHD source in the browser.
  ...Array.from({ length: 12 }, (_, index) => ({
    type: 'image',
    src: mediaUrl(`media/phase${String(index + 1).padStart(2, '0')}-clean-model-uhd.png`),
    additivePolarity: 'dark-on-light',
  })),
  {
    type: 'video',
    src: 'media/taurus-animalpose-walkcycle-48f.mp4',
    start: 0,
    end: 2,
    additivePolarity: 'dark-on-light',
  },
  {
    type: 'video',
    src: 'media/taurus-animalpose-colored-skeleton-48f.mp4',
    start: 0,
    end: 2,
    additivePolarity: 'light-on-dark',
  },
];
// DESIGN is an editorial transformation, not a random pool. Begin with the
// living walkcycle as one quick ratchet beat, move through the constructed
// still-image abstractions, give the animated pose skeleton a readable hold,
// then resolve on the constellation as the smallest surviving representation.
// A compact authored edit: quick source-to-abstraction splices, one readable
// animated-pose hold, then a short constellation punctuation before ./make.
// Keeping the final hold brief prevents DESIGN from feeling finished twice.
const CRT_DESIGN_STORY_STEPS = [
  {
    frame: 12,
    label: 'walking-bull',
    dwellMs: 620,
    vocalId: 'david-a',
    vocalGain: 0.34,
    vocalPan: -0.12,
  },
  ...[
    'observed',
    'faceted',
    'contour',
    'triangulated',
    'mechanical-rig',
    'machine-study-a',
    'machine-study-b',
    'robotic',
    'reduced-rig',
    'stick-rig',
    'minimal-rig',
  ].map((label, frame) => ({ frame, label, dwellMs: 45 })),
  { frame: 13, label: 'pose-skeleton-animated', dwellMs: 480 },
  { frame: 11, label: 'constellation', dwellMs: 220 },
];
const CRT_BELIEVE_VOCAL_STABS = Object.fromEntries(
  [
    'opening-prefix',
    'big',
    'bold',
    'beautiful',
    'journey',
    'david-a',
    'david-b',
    'what-about-you',
    'you',
    'intro-mando-full-theme-bed-v8',
    'mando-natural-bloop-never-touch-v4',
    'joker-singing',
    'still',
    'want-to',
    'go',
    'over-the-top',
    'um',
    'yes',
    'cool',
    'go-through-it',
    'do-you',
    'want',
    'anything',
    'run',
    'fight',
    'showtime',
    'strap-in',
    'share-this',
    'with-someone',
    'together',
    'waiting-for',
    'never-touch',
    'the-buttons',
    'touch-the-buttons',
    'this-isnt-real',
    'this-is-the-way',
  ].map((id) => [
    id,
    {
      id,
      src: withCacheKey(
        mediaUrl(`media/audio/believe-stabs-v2/${id}.wav`),
        '20260719-joker-singing-v5',
      ),
    },
  ]),
);
const CRT_MAKE_STORY_STEPS = [
  {
    frame: 0,
    label: 'warning-never-touch',
    display: 'NEVER TOUCH—',
    dwellMs: 660,
    continuousCue: true,
    codeVariant: 'lockout',
    codeCut: 'channel-tear',
    visualDurationMs: 118,
    camera: 'resist',
    cameraDurationMs: 340,
    cameraEasing: 'cinematic',
  },
  {
    frame: 2,
    label: 'warning-the-buttons',
    display: 'THE BUTTONS.',
    dwellMs: 520,
    continuousCue: true,
    codeVariant: 'point-scan',
    codeCut: 'scan-slice',
    crashFrame: 'nt-stop',
    visualDurationMs: 104,
    errorHoldMs: 92,
    camera: 'buttons',
    cameraDurationMs: 480,
    cameraEasing: 'snap',
  },
  {
    frame: 1,
    label: 'permission-try-it',
    display: 'TRY IT,',
    dwellMs: 440,
    systemVoiceText: 'Try it.',
    codeVariant: 'permission',
    codeCut: 'white-flash',
    crashFrame: 'win95-dialog',
    visualDurationMs: 132,
    errorHoldMs: 116,
    typeText: 'try it',
    typeDelayMs: 72,
    typeIntervalMs: 58,
  },
  {
    frame: 4,
    label: 'permission-touch-the-buttons',
    display: 'TOUCH THE BUTTONS.',
    dwellMs: 780,
    vocalId: 'touch-the-buttons',
    vocalGain: 0.39,
    vocalPan: -0.05,
    codeVariant: 'execute',
    codeCut: 'block-shift',
    crashFrame: 'modern-stop',
    visualDurationMs: 146,
    errorHoldMs: 112,
  },
  {
    frame: 3,
    label: 'prototype-this-isnt-real',
    display: "THIS ISN'T REAL.",
    dwellMs: 820,
    vocalId: 'this-isnt-real',
    vocalGain: 0.36,
    vocalPan: 0.08,
    codeVariant: 'wireframe',
    codeCut: 'line-collapse',
    visualDurationMs: 126,
    camera: 'design',
    cameraDurationMs: 380,
    cameraEasing: 'snap',
    clearTypedText: true,
  },
  {
    frame: 5,
    label: 'bridge-joker-singing',
    display: '',
    dwellMs: 720,
    codeVariant: 'pipeline',
    codeCut: 'terminal-roll',
    visualDurationMs: 112,
  },
];
const CRT_OPENING_VOCAL_STEPS = [
  {
    at: 0,
    display: 'DO YOU WANT TO GO ON A—',
    vocalId: 'opening-prefix',
    vocalGain: 0.32,
    vocalPan: -0.06,
    vocalGateMs: 1420,
    visualEmphasis: 0.54,
  },
  {
    at: 1420,
    display: 'BIG',
    vocalId: 'big',
    vocalGain: 0.33,
    vocalPan: -0.18,
    vocalGateMs: 340,
    visualEmphasis: 0.78,
  },
  {
    at: 1760,
    display: 'BIG',
    vocalId: 'big',
    vocalGain: 0.35,
    vocalRate: 1.06,
    vocalPan: 0.18,
    vocalGateMs: 300,
    visualEmphasis: 0.92,
  },
  {
    at: 2060,
    display: 'BOLD',
    vocalId: 'bold',
    vocalGain: 0.34,
    vocalPan: -0.13,
    vocalGateMs: 320,
    visualEmphasis: 0.82,
  },
  {
    at: 2380,
    display: 'BOLD',
    vocalId: 'bold',
    vocalGain: 0.36,
    vocalRate: 1.08,
    vocalPan: 0.14,
    vocalGateMs: 280,
    visualEmphasis: 0.96,
  },
  {
    at: 2660,
    display: 'BEAUTIFUL',
    vocalId: 'beautiful',
    vocalGain: 0.35,
    vocalPan: -0.04,
    vocalGateMs: 430,
    visualEmphasis: 0.72,
  },
  {
    at: 3090,
    display: 'JOURNEY?',
    vocalId: 'journey',
    vocalGain: 0.36,
    vocalPan: 0.04,
    vocalGateMs: 560,
    visualEmphasis: 0.88,
  },
];
// The final source word is 490ms long and begins at 3090ms. Preserve its full
// tail, then leave a deliberate 280ms landing before the terminal punctuation.
const CRT_OPENING_VOCAL_DURATION = 3860;
const CRT_NAME_TO_QUESTION_PAUSE_MS = 360;
// Keep the personalized voice prologue available behind the checkpointed flag,
// but launch the active experience directly into ./design.
const CRT_PERSONALIZED_PROLOGUE_ENABLED = false;
// The theme begins only after the sampled question is complete and remains its
// own continuous bed through MAKE's Return and hyperspace. Hyperspace's exit
// starts a second, untouched source clip containing the blooper and dialogue.
const CRT_INTRO_CUE_AT_MS = CRT_OPENING_VOCAL_DURATION + 420;
const CRT_INTRO_HYPERSPACE_DURATION_MS = 650;
const CRT_HYPERSPACE_CODE_GLITCH_MS = 170;
const CRT_MAKE_BLOOP_TO_NEVER_MS = 720;
const believeTreatedMedia = (filename, analysis) => ({
  // Treated masters intentionally stay remote in local preview too. Originals
  // remain untouched and no production media is copied back through the Mac.
  src: `${PRODUCTION_MEDIA_ORIGIN}/tv-clips/believe-solarized/${filename}`,
  analysis,
});
const CRT_BELIEVE_GLITCH_MEDIA = [
  // BELIEVE is a fast perception edit. The clips alternate around the
  // Macintosh while retaining the authored ultra-wide crop and scene-graph
  // treatment. The short observations fit inside the original phase.
  {
    type: 'video',
    ...believeTreatedMedia('cleared-joker-singing-58-67.mp4', 'box'),
    start: 0,
    end: 9,
    side: 'joker-left',
    hud: {
      id: 'SG_01',
      kind: 'PERFORMANCE',
      subject: 'ARTHUR FLECK',
      action: 'SINGING TO TELEVISION',
      relation: 'VOICE → BROADCAST IMAGE',
      confidence: '0.98',
      x: 0.362,
      y: 0.103,
      width: 0.102,
      height: 0.242,
      labelSide: 'stack',
    },
  },
  {
    type: 'video',
    // The swamp meditation begins after the rain-armored setup in this take.
    // Starting at 2s keeps the authored beat focused on Grogu.
    ...believeTreatedMedia('cleared-mandalorian-grogu-56.mp4', 'depth'),
    start: 2,
    side: 'mando-right',
    hud: {
      id: 'SG_02',
      kind: 'CHARACTER',
      subject: 'GROGU',
      action: 'MEDITATING IN SWAMP',
      relation: 'STILLNESS → LIVING WORLD',
      confidence: '0.97',
      x: 0.5315,
      y: 0.12,
      width: 0.1,
      height: 0.238,
      labelSide: 'stack',
    },
  },
  {
    type: 'video',
    ...believeTreatedMedia('cleared-joker-spotlight-82-84.mp4', 'depth'),
    side: 'joker-left',
    hud: {
      id: 'SG_03',
      kind: 'PERFORMANCE',
      subject: 'ARTHUR FLECK',
      action: 'BOWED UNDER SPOTLIGHT',
      relation: 'ISOLATED FIGURE → STAGE VOID',
      confidence: '0.97',
      x: 0.359,
      y: 0.35,
      width: 0.105,
      height: 0.248,
      labelSide: 'stack',
    },
  },
  {
    type: 'video',
    ...believeTreatedMedia('cleared-joker-dance-86-88.mp4', 'pose'),
    side: 'joker-left',
    hud: {
      id: 'SG_04',
      kind: 'PAIR',
      subject: 'ARTHUR + LEE',
      action: 'WALTZING IN EMBRACE',
      relation: 'PARTNER ↔ PARTNER',
      confidence: '0.98',
      x: 0.5315,
      y: 0.365,
      width: 0.105,
      height: 0.248,
      labelSide: 'stack',
    },
  },
  {
    type: 'video',
    ...believeTreatedMedia('cleared-joker-09.mp4', 'box'),
    side: 'joker-left',
    hud: {
      id: 'SG_05',
      kind: 'PERFORMANCE',
      subject: 'LEE QUINZEL',
      action: 'DANCING DOWN STAIRS',
      relation: 'PERFORMER → CROWD CORRIDOR',
      confidence: '0.98',
      x: 0.364,
      y: 0.562,
      width: 0.1,
      height: 0.228,
      labelSide: 'stack',
    },
  },
  {
    type: 'video',
    ...believeTreatedMedia('cleared-mandalorian-grogu-19.mp4', 'solar'),
    side: 'mando-right',
    hud: {
      id: 'SG_06',
      kind: 'VEHICLE POV',
      subject: 'STARSHIP COCKPIT',
      action: 'ENTERING HYPERSPACE',
      relation: 'VIEWER → LIGHT-SPEED VECTOR',
      confidence: '0.99',
      x: 0.5315,
      y: 0.57,
      width: 0.098,
      height: 0.226,
      labelSide: 'stack',
    },
  },
  {
    type: 'video',
    ...believeTreatedMedia('cleared-mandalorian-grogu-31.mp4', 'depth'),
    side: 'mando-right',
    hud: {
      id: 'SG_07',
      kind: 'CREATURE EVENT',
      subject: 'MUDHORN + DIN DJARIN',
      action: 'EMERGING FROM WATER',
      relation: 'CREATURE → HUMAN OBSERVER',
      confidence: '0.96',
      x: 0.364,
      y: 0.185,
      width: 0.1,
      height: 0.238,
      labelSide: 'stack',
    },
  },
  {
    type: 'video',
    ...believeTreatedMedia('cleared-mandalorian-grogu-27.mp4', 'depth'),
    side: 'mando-right',
    hud: {
      id: 'SG_08',
      kind: 'ENVIRONMENT',
      subject: 'SWAMP CREATURE',
      action: 'SUBMERGING BELOW SURFACE',
      relation: 'CREATURE → WATERLINE',
      confidence: '0.95',
      x: 0.5315,
      y: 0.205,
      width: 0.1,
      height: 0.238,
      labelSide: 'stack',
    },
  },
  {
    type: 'video',
    ...believeTreatedMedia('cleared-mandalorian-grogu-11.mp4', 'pose'),
    side: 'mando-right',
    hud: {
      id: 'SG_09',
      kind: 'CHARACTER',
      subject: 'DIN DJARIN',
      action: 'ADVANCING THROUGH SPARKS',
      relation: 'FIGURE → BURNING CORRIDOR',
      confidence: '0.97',
      x: 0.357,
      y: 0.47,
      width: 0.107,
      height: 0.254,
      labelSide: 'stack',
    },
  },
  {
    type: 'video',
    ...believeTreatedMedia('cleared-obi-wan-07.mp4', 'pose'),
    side: 'mando-right',
    hud: {
      id: 'SG_10',
      kind: 'FORMATION',
      subject: 'IMPERIAL INQUISITORS',
      action: 'ASSEMBLED IN CHAMBER',
      relation: 'FIGURES → REFLECTIVE AXIS',
      confidence: '0.96',
      x: 0.5315,
      y: 0.49,
      width: 0.107,
      height: 0.254,
      labelSide: 'stack',
    },
  },
  {
    type: 'video',
    ...believeTreatedMedia('cleared-mandalorian-grogu-58.mp4', 'depth'),
    side: 'mando-right',
    hud: {
      id: 'SG_11',
      kind: 'EVENT',
      subject: 'SETTLEMENT + CREATURE',
      action: 'EXPLOSION REVEALS THREAT',
      relation: 'BLAST → CREATURE ARRIVAL',
      confidence: '0.97',
      x: 0.362,
      y: 0.66,
      width: 0.102,
      height: 0.233,
      labelSide: 'stack',
    },
  },
  {
    type: 'video',
    ...believeTreatedMedia('cleared-big-bold-01.mp4', 'box'),
    side: 'mando-right',
    hud: {
      id: 'SG_12',
      kind: 'THRESHOLD',
      subject: 'SARAH',
      action: 'DISCOVERING OPEN FIELD',
      relation: 'INTERIOR → LANDSCAPE',
      confidence: '0.96',
      x: 0.5315,
      y: 0.675,
      width: 0.102,
      height: 0.233,
      labelSide: 'stack',
    },
  },
  {
    type: 'video',
    ...believeTreatedMedia('cleared-joker-05.mp4', 'box'),
    side: 'joker-left',
    hud: {
      id: 'SG_13',
      kind: 'MEDIATED IMAGE',
      subject: 'ARTHUR ON TELEVISION',
      action: 'BLOWING A KISS',
      relation: 'SCREEN IMAGE → STREET CROWD',
      confidence: '0.96',
      x: 0.362,
      y: 0.103,
      width: 0.102,
      height: 0.242,
      labelSide: 'stack',
    },
  },
  // Preserve the previous hero selects in the wider perception pool. The two
  // authored callback frames above now use the exact 1:22 and 1:26 trailer
  // shots without discarding earlier editorial choices.
  {
    type: 'video',
    ...believeTreatedMedia('cleared-joker-08.mp4', 'pose'),
    side: 'joker-left',
    hud: {
      id: 'SG_14',
      kind: 'PAIR',
      subject: 'ARTHUR + LEE',
      action: 'DESCENDING THROUGH CROWD',
      relation: 'PAIR → PUBLIC SPECTACLE',
      confidence: '0.96',
      x: 0.359,
      y: 0.35,
      width: 0.105,
      height: 0.248,
      labelSide: 'stack',
    },
  },
  {
    type: 'video',
    ...believeTreatedMedia('cleared-joker-07.mp4', 'box'),
    start: 2,
    side: 'joker-left',
    hud: {
      id: 'SG_15',
      kind: 'CONFLICT',
      subject: 'ARTHUR + GUARDS',
      action: 'RESTRAINED WHILE SHOUTING',
      relation: 'SUBJECT ↔ CONFINEMENT',
      confidence: '0.97',
      x: 0.5315,
      y: 0.365,
      width: 0.105,
      height: 0.248,
      labelSide: 'stack',
    },
  },
];
const CRT_BELIEVE_STORY_STEPS = [
  {
    frame: 0,
    label: 'callback-still',
    display: 'STILL—',
    side: 'joker-left',
    dwellMs: 320,
    vocalId: 'still',
    vocalGain: 0.34,
    vocalPan: -0.18,
  },
  {
    frame: 1,
    label: 'callback-want-to',
    display: 'WANT TO—',
    side: 'mando-right',
    dwellMs: 350,
    vocalId: 'want-to',
    vocalGain: 0.35,
    vocalPan: -0.04,
  },
  {
    frame: 5,
    label: 'star-wars-hyperspace-impact',
    display: '',
    side: 'mando-right',
    dwellMs: 360,
    kind: 'text',
    voiceRole: 'impact',
    sampleSalt: 37,
    visualDurationMs: 140,
    audioDurationMs: 320,
  },
  {
    frame: 2,
    label: 'callback-go',
    display: 'GO?',
    side: 'joker-left',
    dwellMs: 370,
    vocalId: 'go',
    vocalGain: 0.38,
    vocalPan: 0.14,
  },
  {
    frame: 6,
    label: 'star-wars-creature-emerge',
    display: '',
    side: 'mando-right',
    dwellMs: 300,
    kind: 'idle',
    sampleSalt: 11,
    visualDurationMs: 72,
    audioDurationMs: 170,
  },
  {
    frame: 7,
    label: 'star-wars-waterline-threat',
    display: '',
    side: 'mando-right',
    dwellMs: 300,
    kind: 'idle',
    sampleSalt: 19,
    visualDurationMs: 72,
    audioDurationMs: 170,
  },
  {
    frame: 3,
    side: 'mando-right',
    label: 'philosophy-together',
    display: 'TOGETHER.',
    dwellMs: 620,
    vocalId: 'together',
    vocalGain: 0.37,
    vocalPan: -0.05,
  },
  {
    frame: 8,
    label: 'star-wars-sparks-advance',
    display: '',
    side: 'mando-right',
    dwellMs: 300,
    kind: 'idle',
    sampleSalt: 23,
    visualDurationMs: 70,
    audioDurationMs: 160,
  },
  {
    frame: 9,
    label: 'star-wars-formation-snap',
    display: '',
    side: 'mando-right',
    dwellMs: 320,
    kind: 'idle',
    sampleSalt: 31,
    visualDurationMs: 74,
    audioDurationMs: 170,
  },
  {
    frame: 10,
    label: 'star-wars-explosion-threat',
    display: '',
    side: 'mando-right',
    dwellMs: 340,
    kind: 'text',
    voiceRole: 'impact',
    sampleSalt: 43,
    visualDurationMs: 116,
    audioDurationMs: 280,
  },
  {
    frame: 4,
    label: 'creed-this-is-the-way',
    display: 'THIS IS THE WAY.',
    side: 'mando-right',
    dwellMs: 1100,
    vocalId: 'this-is-the-way',
    vocalGain: 0.42,
    vocalPan: 0,
  },
  {
    frame: 5,
    label: 'star-wars-hyperspace-callback',
    display: '',
    side: 'mando-right',
    dwellMs: 320,
    kind: 'idle',
    sampleSalt: 53,
    visualDurationMs: 82,
    audioDurationMs: 190,
  },
  {
    frame: 10,
    label: 'challenge-what-are-you-waiting-for',
    display: 'WHAT ARE YOU WAITING FOR?',
    side: 'mando-right',
    dwellMs: 560,
    vocalId: 'waiting-for',
    vocalGain: 0.4,
    vocalPan: 0.08,
  },
];
// The opener is a directed story, not a slot machine. Each phase advances
// through an authored order while each short glitch can still expose adjacent
// frames for energy. Looping the intro repeats the same visual grammar.
const CRT_PHASE_STORY_FRAMES = {
  design: CRT_DESIGN_STORY_STEPS.map((step) => step.frame),
  make: CRT_MAKE_STORY_STEPS.map((step) => step.frame),
  believe: CRT_BELIEVE_STORY_STEPS.map((step) => step.frame),
};
const crtStoryFrameForEvent = (phase, beat = '', sequence = 0) => {
  const story = CRT_PHASE_STORY_FRAMES[phase] || [0];
  const beatOffset = String(beat).endsWith('response')
    ? 2
    : String(beat).startsWith('breather-')
      ? 1
      : 0;
  return story[(Math.max(0, Number(sequence) || 0) + beatOffset) % story.length];
};
const CRT_INITIAL_BELIEVE_FRAME = CRT_PHASE_STORY_FRAMES.believe[0];

function CrtGlitchVideo({
  className,
  src,
  start = 0,
  end = null,
  ...props
}) {
  const ref = useRef(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return undefined;
    const clipStart = Math.max(0, Number(start) || 0);
    const requestedEnd = Number(end);
    const clipEnd = Number.isFinite(requestedEnd) && requestedEnd > clipStart
      ? requestedEnd
      : Number.POSITIVE_INFINITY;
    const seekToStart = () => {
      if (!Number.isFinite(video.duration)) return;
      const safeStart = Math.min(clipStart, Math.max(0, video.duration - 0.05));
      try {
        if (typeof video.fastSeek === 'function') video.fastSeek(safeStart);
        else video.currentTime = safeStart;
      } catch (_) {}
      video.play().catch(() => {});
    };
    const enforceCleanRange = () => {
      if (video.currentTime < clipStart - 0.08 || video.currentTime >= clipEnd) {
        seekToStart();
      }
    };
    video.addEventListener('loadedmetadata', seekToStart);
    video.addEventListener('timeupdate', enforceCleanRange);
    video.addEventListener('ended', seekToStart);
    if (video.readyState >= 1) seekToStart();
    return () => {
      video.removeEventListener('loadedmetadata', seekToStart);
      video.removeEventListener('timeupdate', enforceCleanRange);
      video.removeEventListener('ended', seekToStart);
    };
  }, [start, end]);
  return (
    <video
      ref={ref}
      className={className}
      crossOrigin="anonymous"
      src={src}
      data-clip-start={start}
      data-clip-end={end ?? ''}
      autoPlay
      muted
      playsInline
      preload="metadata"
      {...props}
    />
  );
}

function CrtForeshadowField() {
  return (
    <div className="crt-foreshadow" aria-hidden="true">
      <div className="crt-foreshadow__layer crt-foreshadow__layer--design">
        {CRT_ART_GLITCH_MEDIA.map((media, index) => (
          media.type === 'video'
            ? (
              <CrtGlitchVideo
                className="crt-foreshadow__art-frame"
                src={media.src}
                key={media.src}
                start={media.start}
                end={media.end}
                preload="auto"
                data-art-frame={index}
                data-additive-polarity={media.additivePolarity}
              />
            )
            : (
              <img
                className="crt-foreshadow__art-frame"
                crossOrigin="anonymous"
                src={media.src}
                alt=""
                key={media.src}
                data-art-frame={index}
                data-additive-polarity={media.additivePolarity}
              />
            )
        ))}
      </div>
      <div className="crt-foreshadow__layer crt-foreshadow__layer--make">
        {CRT_CODE_GLITCH_PAGES.map((page, pageIndex) => (
          <div
            className="crt-foreshadow__code-page"
            data-code-frame={pageIndex}
            data-code-source={CRT_CODE_GLITCH_PAGE_IDS[pageIndex]}
            key={pageIndex}
          >
            {Array.from({ length: 4 }, (_, copyIndex) => (
              <pre className="crt-foreshadow__code" key={copyIndex}>{page}</pre>
            ))}
          </div>
        ))}
        <span className="crt-foreshadow__code-label">beautifulgame / live systems</span>
      </div>
      <div className="crt-foreshadow__layer crt-foreshadow__layer--believe">
        {CRT_BELIEVE_GLITCH_MEDIA.map((media, index) => (
          media.type === 'video'
            ? (
              <CrtGlitchVideo
                className="crt-foreshadow__believe-frame"
                src={media.src}
                key={media.src}
                start={media.start}
                end={media.end}
                data-believe-treatment="baked-solarized-analysis"
                data-believe-analysis={media.analysis}
                data-believe-frame={index}
                data-believe-side={media.side}
                data-believe-id={media.hud?.id}
                data-believe-kind={media.hud?.kind}
                data-believe-subject={media.hud?.subject}
                data-believe-action={media.hud?.action}
                data-believe-relation={media.hud?.relation}
                data-believe-confidence={media.hud?.confidence}
                data-believe-hud-x={media.hud?.x}
                data-believe-hud-y={media.hud?.y}
                data-believe-hud-width={media.hud?.width}
                data-believe-hud-height={media.hud?.height}
                data-believe-label-side={media.hud?.labelSide}
                preload="auto"
              />
            )
            : (
              <img
                className="crt-foreshadow__believe-frame"
                crossOrigin="anonymous"
                src={media.src}
                alt=""
                key={media.src}
                data-believe-treatment="baked-solarized-analysis"
                data-believe-analysis={media.analysis}
                data-believe-frame={index}
                data-believe-side={media.side}
                data-believe-id={media.hud?.id}
                data-believe-kind={media.hud?.kind}
                data-believe-subject={media.hud?.subject}
                data-believe-action={media.hud?.action}
                data-believe-relation={media.hud?.relation}
                data-believe-confidence={media.hud?.confidence}
                data-believe-hud-x={media.hud?.x}
                data-believe-hud-y={media.hud?.y}
                data-believe-hud-width={media.hud?.width}
                data-believe-hud-height={media.hud?.height}
                data-believe-label-side={media.hud?.labelSide}
              />
            )
        ))}
      </div>
      <CrtResolveCalibration />
    </div>
  );
}

function CrtForeshadowSync() {
  useEffect(() => {
    const shell = document.querySelector('.landing-v1-shell');
    if (!shell) return undefined;
    const forceDesktopTest = new URLSearchParams(window.location.search)
      .get('desktopTest') === '1';
    const touchTablet = navigator.maxTouchPoints > 0
      && window.matchMedia('(min-width: 761px)').matches;
    const enabled = (forceDesktopTest
      || window.matchMedia('(min-width: 900px)').matches
      || touchTablet)
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!enabled) return undefined;
    const clamp01 = (value) => Math.max(0, Math.min(1, value));
    const audioPlayers = CRT_GLITCH_AUDIO_SOURCES.map((src) => {
      const player = new Audio(src);
      player.preload = 'auto';
      player.playsInline = true;
      player.load();
      return player;
    });
    let primePromise = null;
    let lastAudioKey = '';
    let lastAudioAt = 0;
    let activeSource = null;
    let activeSharedSource = null;
    let activeSharedGain = null;
    let activeResolveGlitchSource = null;
    let activeResolveGlitchGain = null;
    let resolveGlitchSerial = 0;
    let activePhaseVoices = [];
    let activePhaseGain = null;
    let activeStartupVoices = [];
    let activeStartupGain = null;
    let activeCalibrationTone = null;
    let activeCalibrationToneGain = null;
    let calibrationToneStartTimer = 0;
    let calibrationToneTimer = 0;
    let pageAudioSuspendTimer = 0;
    let calibrationToneCompletedForResolve = false;
    let sharedPlaySerial = 0;
    let audioUnlocked = false;
    let pendingAudioProgress = null;
    shell.dataset.glitchAudio = 'locked';
    let sharedAudioContext = null;
    const sharedSampleBuffers = new Map();
    const sharedSamplePromises = new Map();
    const believeVocalBuffers = new Map();
    const believeVocalPromises = new Map();
    let activeBelieveVocalSource = null;
    let activeBelieveVocalGain = null;
    let activeBelieveVocalPanner = null;
    let activeIntroBedSource = null;
    let activeIntroBedGain = null;
    let activeIntroBedPanner = null;
    let activeIntroBloopSource = null;
    let activeIntroBloopGain = null;
    let activeIntroBloopPanner = null;
    let activeBelieveSingingVoices = [];
    let believeSingingCueSerial = 0;
    let believeSingingCuePending = false;
    let believeSingingFallbackTimer = 0;
    const getSharedAudioContext = () => {
      const context = window.__resumeMacKeyAudioContext;
      if (!context || context.state === 'closed') return null;
      if (sharedAudioContext !== context) {
        sharedAudioContext = context;
        sharedSampleBuffers.clear();
        sharedSamplePromises.clear();
        believeVocalBuffers.clear();
        believeVocalPromises.clear();
      }
      return context;
    };
    const prepareSharedSample = (sampleIndex) => {
      const context = getSharedAudioContext();
      if (!context || !Number.isInteger(sampleIndex)) return null;
      if (sharedSampleBuffers.has(sampleIndex)) return Promise.resolve(sharedSampleBuffers.get(sampleIndex));
      if (sharedSamplePromises.has(sampleIndex)) return sharedSamplePromises.get(sampleIndex);
      const src = CRT_GLITCH_AUDIO_SOURCES[sampleIndex];
      if (!src) return null;
      const promise = fetch(src)
        .then((response) => {
          if (!response.ok) throw new Error(`sample ${response.status}`);
          return response.arrayBuffer();
        })
        .then((bytes) => context.decodeAudioData(bytes))
        .then((buffer) => {
          sharedSampleBuffers.set(sampleIndex, buffer);
          return buffer;
        })
        .catch(() => null)
        .finally(() => sharedSamplePromises.delete(sampleIndex));
      sharedSamplePromises.set(sampleIndex, promise);
      return promise;
    };
    const prepareParkedSamples = () => {
      CRT_GLITCH_AUDIO_SOURCES.forEach((_, sampleIndex) => prepareSharedSample(sampleIndex));
    };
    const prepareBelieveVocal = (vocalId) => {
      const context = getSharedAudioContext();
      const vocal = CRT_BELIEVE_VOCAL_STABS[vocalId];
      if (!context || !vocal?.src) return null;
      if (believeVocalBuffers.has(vocalId)) {
        return Promise.resolve(believeVocalBuffers.get(vocalId));
      }
      if (believeVocalPromises.has(vocalId)) return believeVocalPromises.get(vocalId);
      const promise = fetch(vocal.src)
        .then((response) => {
          if (!response.ok) throw new Error(`vocal ${response.status}`);
          return response.arrayBuffer();
        })
        .then((bytes) => context.decodeAudioData(bytes))
        .then((buffer) => {
          believeVocalBuffers.set(vocalId, buffer);
          return buffer;
        })
        .catch(() => null)
        .finally(() => believeVocalPromises.delete(vocalId));
      believeVocalPromises.set(vocalId, promise);
      return promise;
    };
    const prepareBelieveVocals = () => {
      Object.keys(CRT_BELIEVE_VOCAL_STABS).forEach((vocalId) => {
        prepareBelieveVocal(vocalId);
      });
    };
    const cutActiveSharedSample = (context) => {
      if (!activeSharedSource) return;
      const stopAt = context.currentTime + 0.009;
      try {
        activeSharedGain?.gain.cancelScheduledValues(context.currentTime);
        activeSharedGain?.gain.setValueAtTime(
          Math.max(0.0001, activeSharedGain.gain.value || 0.0001),
          context.currentTime,
        );
        activeSharedGain?.gain.exponentialRampToValueAtTime(0.0001, stopAt);
        activeSharedSource.stop(stopAt + 0.003);
      } catch (_) {}
      activeSharedSource = null;
      activeSharedGain = null;
    };
    const cutActiveBelieveVocal = (context, fadeSeconds = 0.007) => {
      if (!activeBelieveVocalSource) return;
      const stopAt = context.currentTime + Math.max(0.004, fadeSeconds);
      try {
        activeBelieveVocalGain?.gain.cancelScheduledValues(context.currentTime);
        activeBelieveVocalGain?.gain.setValueAtTime(
          Math.max(0.0001, activeBelieveVocalGain.gain.value || 0.0001),
          context.currentTime,
        );
        activeBelieveVocalGain?.gain.exponentialRampToValueAtTime(0.0001, stopAt);
        activeBelieveVocalSource.stop(stopAt + 0.003);
      } catch (_) {}
      activeBelieveVocalSource = null;
      activeBelieveVocalGain = null;
      activeBelieveVocalPanner = null;
    };
    const cutActiveIntroBed = (context, fadeSeconds = 0.016) => {
      if (!activeIntroBedSource) return;
      const stopAt = context.currentTime + Math.max(0.008, fadeSeconds);
      try {
        activeIntroBedGain?.gain.cancelScheduledValues(context.currentTime);
        activeIntroBedGain?.gain.setValueAtTime(
          Math.max(0.0001, activeIntroBedGain.gain.value || 0.0001),
          context.currentTime,
        );
        activeIntroBedGain?.gain.exponentialRampToValueAtTime(0.0001, stopAt);
        activeIntroBedSource.stop(stopAt + 0.003);
      } catch (_) {}
      activeIntroBedSource = null;
      activeIntroBedGain = null;
      activeIntroBedPanner = null;
      shell.dataset.introBed = 'cut';
    };
    const cutActiveIntroBloop = (context, fadeSeconds = 0.012) => {
      if (!activeIntroBloopSource) return;
      const stopAt = context.currentTime + Math.max(0.006, fadeSeconds);
      try {
        activeIntroBloopGain?.gain.cancelScheduledValues(context.currentTime);
        activeIntroBloopGain?.gain.setValueAtTime(
          Math.max(0.0001, activeIntroBloopGain.gain.value || 0.0001),
          context.currentTime,
        );
        activeIntroBloopGain?.gain.exponentialRampToValueAtTime(0.0001, stopAt);
        activeIntroBloopSource.stop(stopAt + 0.003);
      } catch (_) {}
      activeIntroBloopSource = null;
      activeIntroBloopGain = null;
      activeIntroBloopPanner = null;
      shell.dataset.introBloopAudio = 'cut';
    };
    const playIntroBed = () => {
      if (!isResumeForeground()) return false;
      const context = getSharedAudioContext();
      if (!context || context.state !== 'running') return false;
      const requestedAt = performance.now();
      const decoded = believeVocalBuffers.get('intro-mando-full-theme-bed-v8');
      const pending = decoded
        ? Promise.resolve(decoded)
        : prepareBelieveVocal('intro-mando-full-theme-bed-v8');
      if (!pending) return false;
      pending.then((buffer) => {
        if (!buffer
          || context.state !== 'running'
          || !isResumeForeground()
          || performance.now() - requestedAt > 500) return;
        cutActiveIntroBed(context);
        const startAt = context.currentTime + 0.006;
        const duration = Math.min(7.2, buffer.duration);
        const source = context.createBufferSource();
        const gain = context.createGain();
        const panner = typeof context.createStereoPanner === 'function'
          ? context.createStereoPanner()
          : null;
        source.buffer = buffer;
        gain.gain.setValueAtTime(0.0001, startAt);
        gain.gain.exponentialRampToValueAtTime(0.17, startAt + 0.018);
        // This asset is theme only. It remains continuous through DESIGN,
        // MAKE typing, and the complete hyperspace passage.
        gain.gain.setValueAtTime(0.17, startAt + duration - 0.045);
        gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
        source.connect(gain);
        if (panner) {
          panner.pan.setValueAtTime(0, startAt);
          gain.connect(panner);
          panner.connect(getResumeMacAudioDestination(context));
        } else {
          gain.connect(getResumeMacAudioDestination(context));
        }
        activeIntroBedSource = source;
        activeIntroBedGain = gain;
        activeIntroBedPanner = panner;
        source.onended = () => {
          if (activeIntroBedSource !== source) return;
          activeIntroBedSource = null;
          activeIntroBedGain = null;
          activeIntroBedPanner = null;
          shell.dataset.introBed = 'complete';
          shell.dataset.introBedCompletedAt = String(Math.round(performance.now()));
          try { source.disconnect(); } catch (_) {}
          try { gain.disconnect(); } catch (_) {}
          try { panner?.disconnect(); } catch (_) {}
        };
        source.start(startAt, 0, duration);
        source.stop(startAt + duration + 0.01);
        shell.dataset.introBed = 'playing';
        shell.dataset.introBedSource = 'intro-mando-full-theme-bed-v8';
        shell.dataset.introBedDurationMs = String(Math.round(duration * 1000));
        shell.dataset.introBedStartedAt = String(Math.round(performance.now()));
      }).catch(() => {});
      return true;
    };
    const playIntroBloopDialogue = () => {
      if (!isResumeForeground()) return false;
      const context = getSharedAudioContext();
      if (!context || context.state !== 'running') return false;
      const requestedAt = performance.now();
      shell.dataset.introBloopAudio = 'requested';
      shell.dataset.introBloopAudioRequestedAt = String(Math.round(requestedAt));
      const decoded = believeVocalBuffers.get('mando-natural-bloop-never-touch-v4');
      const pending = decoded
        ? Promise.resolve(decoded)
        : prepareBelieveVocal('mando-natural-bloop-never-touch-v4');
      if (!pending) return false;
      pending.then((buffer) => {
        if (!buffer
          || context.state !== 'running'
          || !isResumeForeground()
          || performance.now() - requestedAt > 180) return;
        // The v8 bed carries 1.2 seconds of natural source headroom.
        // Starting it at the same question boundary pushes its existing phrase
        // and tail later under the blooper without moving any dialogue cues.
        cutActiveIntroBloop(context);
        const startAt = context.currentTime + 0.004;
        const duration = Math.min(2.16, buffer.duration);
        const source = context.createBufferSource();
        const gain = context.createGain();
        const panner = typeof context.createStereoPanner === 'function'
          ? context.createStereoPanner()
          : null;
        source.buffer = buffer;
        gain.gain.setValueAtTime(0.0001, startAt);
        gain.gain.exponentialRampToValueAtTime(0.29, startAt + 0.008);
        gain.gain.setValueAtTime(0.29, startAt + duration - 0.035);
        gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
        source.connect(gain);
        if (panner) {
          panner.pan.setValueAtTime(0, startAt);
          gain.connect(panner);
          panner.connect(getResumeMacAudioDestination(context));
        } else {
          gain.connect(getResumeMacAudioDestination(context));
        }
        activeIntroBloopSource = source;
        activeIntroBloopGain = gain;
        activeIntroBloopPanner = panner;
        source.onended = () => {
          if (activeIntroBloopSource !== source) return;
          activeIntroBloopSource = null;
          activeIntroBloopGain = null;
          activeIntroBloopPanner = null;
          shell.dataset.introBloopAudio = 'complete';
          try { source.disconnect(); } catch (_) {}
          try { gain.disconnect(); } catch (_) {}
          try { panner?.disconnect(); } catch (_) {}
        };
        source.start(startAt, 0, duration);
        source.stop(startAt + duration + 0.01);
        shell.dataset.introBloopAudio = 'playing';
        shell.dataset.introBloopAudioSource = 'mando-natural-bloop-never-touch-v4';
        shell.dataset.introBloopAudioStartedAt = String(Math.round(performance.now()));
      }).catch(() => {});
      return true;
    };
    const cancelPendingBelieveSinging = () => {
      believeSingingCueSerial += 1;
      believeSingingCuePending = false;
      window.clearTimeout(believeSingingFallbackTimer);
      believeSingingFallbackTimer = 0;
      if (shell.dataset.believeSinging === 'queued') {
        shell.dataset.believeSinging = 'cancelled';
      }
    };
    const cutActiveBelieveSinging = (
      context,
      fadeSeconds = 0.018,
      { cancelPending = true } = {},
    ) => {
      if (cancelPending) cancelPendingBelieveSinging();
      if (!activeBelieveSingingVoices.length) return;
      const now = context.currentTime;
      const stopAt = now + Math.max(0.008, fadeSeconds);
      activeBelieveSingingVoices.forEach(({ source, gain, panner }) => {
        try {
          gain.gain.cancelScheduledValues(now);
          gain.gain.setValueAtTime(
            Math.max(0.0001, gain.gain.value || 0.0001),
            now,
          );
          gain.gain.exponentialRampToValueAtTime(0.0001, stopAt);
          source.stop(stopAt + 0.003);
        } catch (_) {}
      });
      activeBelieveSingingVoices = [];
      shell.dataset.believeSinging = 'cut';
    };
    const playBelieveSingingMotif = () => {
      if (!isResumeForeground()) return false;
      const context = getSharedAudioContext();
      if (!context) return false;
      if (believeSingingCuePending || activeBelieveSingingVoices.length) return true;
      const cueSerial = ++believeSingingCueSerial;
      const requestedAt = performance.now();
      believeSingingCuePending = true;
      shell.dataset.believeSinging = 'queued';
      shell.dataset.believeSingingCueSerial = String(cueSerial);
      shell.dataset.believeSingingRequestedAt = requestedAt.toFixed(1);
      // A phone/remote start is not a user activation on this browser, so
      // AudioContext.resume() is allowed to remain pending indefinitely. Keep
      // the authored BELIEVE hold for the length of the missing passage, then
      // release it deterministically rather than deadlocking the intro.
      window.clearTimeout(believeSingingFallbackTimer);
      believeSingingFallbackTimer = window.setTimeout(() => {
        if (cueSerial !== believeSingingCueSerial
          || !believeSingingCuePending) return;
        believeSingingCueSerial += 1;
        believeSingingCuePending = false;
        believeSingingFallbackTimer = 0;
        shell.dataset.believeSinging = 'unavailable';
        shell.dataset.believeSingingFallback = 'autoplay-blocked';
        window.dispatchEvent(new CustomEvent('resume-believe-singing-complete', {
          detail: {
            source: 'joker-0058-0107',
            terminalPhrase: 'someone-who-needs-me',
            failed: true,
            autoplayBlocked: true,
          },
        }));
      }, 9600);
      const decoded = believeVocalBuffers.get('joker-singing');
      const pending = decoded
        ? Promise.resolve(decoded)
        : prepareBelieveVocal('joker-singing');
      if (!pending) {
        window.clearTimeout(believeSingingFallbackTimer);
        believeSingingFallbackTimer = 0;
        believeSingingCuePending = false;
        shell.dataset.believeSinging = 'failed';
        window.dispatchEvent(new CustomEvent('resume-believe-singing-complete', {
          detail: {
            source: 'joker-0058-0107',
            terminalPhrase: 'someone-who-needs-me',
            failed: true,
          },
        }));
        return false;
      }
      Promise.resolve(context.resume?.())
        .catch(() => false)
        .then(() => pending)
        .then((buffer) => {
        if (cueSerial !== believeSingingCueSerial) return;
        if (!buffer
          || context.state !== 'running'
          || !isResumeForeground()) {
          window.clearTimeout(believeSingingFallbackTimer);
          believeSingingFallbackTimer = 0;
          believeSingingCuePending = false;
          shell.dataset.believeSinging = 'failed';
          window.dispatchEvent(new CustomEvent('resume-believe-singing-complete', {
            detail: {
              source: 'joker-0058-0107',
              terminalPhrase: 'someone-who-needs-me',
              failed: true,
            },
          }));
          return;
        }
        window.clearTimeout(believeSingingFallbackTimer);
        believeSingingFallbackTimer = 0;
        cutActiveBelieveSinging(context, 0.008, { cancelPending: false });
        const startAt = context.currentTime + 0.006;
        const source = context.createBufferSource();
        const gain = context.createGain();
        const panner = typeof context.createStereoPanner === 'function'
          ? context.createStereoPanner()
          : null;
        // FEELS REAL used to occupy this edit. The uninterrupted passage now
        // enters on that exact cut and bridges MAKE into BELIEVE; the loop
        // breather owns the final stop so the song survives every callback.
        const duration = Math.min(9, buffer.duration);
        const releaseAt = Math.max(startAt + 0.1, startAt + duration - 0.09);
        source.buffer = buffer;
        gain.gain.setValueAtTime(0.0001, startAt);
        gain.gain.exponentialRampToValueAtTime(0.122, startAt + 0.032);
        gain.gain.setValueAtTime(0.122, releaseAt);
        gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
        source.connect(gain);
        if (panner) {
          panner.pan.setValueAtTime(0, startAt);
          gain.connect(panner);
          panner.connect(getResumeMacAudioDestination(context));
        } else {
          gain.connect(getResumeMacAudioDestination(context));
        }
        const voice = { source, gain, panner };
        activeBelieveSingingVoices = [voice];
        believeSingingCuePending = false;
        source.onended = () => {
          const completedNaturally = activeBelieveSingingVoices.includes(voice);
          activeBelieveSingingVoices = activeBelieveSingingVoices
            .filter((item) => item !== voice);
          try { source.disconnect(); } catch (_) {}
          try { gain.disconnect(); } catch (_) {}
          try { panner?.disconnect(); } catch (_) {}
          if (completedNaturally && !activeBelieveSingingVoices.length) {
            shell.dataset.believeSinging = 'complete';
            shell.dataset.believeSingingCompletedAt = performance.now().toFixed(1);
            window.dispatchEvent(new CustomEvent('resume-believe-singing-complete', {
              detail: {
                source: 'joker-0058-0107',
                terminalPhrase: 'someone-who-needs-me',
              },
            }));
          }
        };
        source.start(startAt, 0, duration);
        source.stop(startAt + duration + 0.01);
        shell.dataset.believeSinging = 'playing';
        shell.dataset.believeSingingSource = 'joker-0058-0107';
        shell.dataset.believeSingingSlices = 'continuous-0.00-9.00';
        shell.dataset.believeSingingStartedAt = performance.now().toFixed(1);
        shell.dataset.believeSingingStartLatencyMs = String(
          Math.round(performance.now() - requestedAt),
        );
        shell.dataset.believeSingingStartCount = String(
          (Number(shell.dataset.believeSingingStartCount) || 0) + 1,
        );
      }).catch(() => {
        if (cueSerial !== believeSingingCueSerial) return;
        window.clearTimeout(believeSingingFallbackTimer);
        believeSingingFallbackTimer = 0;
        believeSingingCuePending = false;
        shell.dataset.believeSinging = 'failed';
        window.dispatchEvent(new CustomEvent('resume-believe-singing-complete', {
          detail: {
            source: 'joker-0058-0107',
            terminalPhrase: 'someone-who-needs-me',
            failed: true,
          },
        }));
      });
      return true;
    };
    const cutActivePhaseNote = (context) => {
      if (!activePhaseVoices.length && !activePhaseGain) return;
      const stopAt = context.currentTime + 0.009;
      try {
        activePhaseGain?.gain.cancelScheduledValues(context.currentTime);
        activePhaseGain?.gain.setValueAtTime(
          Math.max(0.0001, activePhaseGain.gain.value || 0.0001),
          context.currentTime,
        );
        activePhaseGain?.gain.exponentialRampToValueAtTime(0.0001, stopAt);
      } catch (_) {}
      activePhaseVoices.forEach((voice) => {
        try { voice.stop(stopAt + 0.003); } catch (_) {}
      });
      activePhaseVoices = [];
      activePhaseGain = null;
    };
    const cutActiveResolveGlitch = (context) => {
      resolveGlitchSerial += 1;
      if (!activeResolveGlitchSource) return;
      try {
        activeResolveGlitchGain?.gain.cancelScheduledValues(context.currentTime);
        activeResolveGlitchGain?.gain.setValueAtTime(0.0001, context.currentTime);
        activeResolveGlitchSource.stop(context.currentTime + 0.003);
      } catch (_) {}
      activeResolveGlitchSource = null;
      activeResolveGlitchGain = null;
    };
    const cutActiveStartup = (context) => {
      if (!activeStartupVoices.length && !activeStartupGain) return;
      try {
        activeStartupGain?.gain.cancelScheduledValues(context.currentTime);
        activeStartupGain?.gain.setValueAtTime(0.0001, context.currentTime);
      } catch (_) {}
      activeStartupVoices.forEach(({ oscillator, gain, panner }) => {
        try { oscillator.stop(context.currentTime + 0.003); } catch (_) {}
        try { oscillator.disconnect(); } catch (_) {}
        try { gain.disconnect(); } catch (_) {}
        try { panner?.disconnect(); } catch (_) {}
      });
      try { activeStartupGain?.disconnect(); } catch (_) {}
      activeStartupVoices = [];
      activeStartupGain = null;
    };
    const cutActiveCalibrationTone = (context, fadeSeconds = 0.004) => {
      window.clearTimeout(calibrationToneStartTimer);
      calibrationToneStartTimer = 0;
      window.clearTimeout(calibrationToneTimer);
      calibrationToneTimer = 0;
      if (!activeCalibrationTone && !activeCalibrationToneGain) return;
      // Phase changes use a near-instant click-safe cut. The automatic
      // intermission timeout gets a slightly softer fade.
      const safeFade = Math.max(0.004, Math.min(0.18, Number(fadeSeconds) || 0.004));
      const stopAt = context.currentTime + safeFade;
      try {
        activeCalibrationToneGain?.gain.cancelScheduledValues(context.currentTime);
        activeCalibrationToneGain?.gain.setValueAtTime(
          Math.max(0.0001, activeCalibrationToneGain.gain.value || 0.018),
          context.currentTime,
        );
        activeCalibrationToneGain?.gain.exponentialRampToValueAtTime(0.0001, stopAt);
        activeCalibrationTone?.stop(stopAt + 0.002);
      } catch (_) {}
      try { activeCalibrationTone?.disconnect(); } catch (_) {}
      try { activeCalibrationToneGain?.disconnect(); } catch (_) {}
      activeCalibrationTone = null;
      activeCalibrationToneGain = null;
      shell.dataset.testTone = 'off';
    };
    const startCalibrationTone = (context) => {
      if (!context
        || context.state !== 'running'
        || !isResumeForeground()
        || activeCalibrationTone
        || activeCalibrationToneGain) return false;
      const startAt = context.currentTime + 0.004;
      const calibrationTone = context.createOscillator();
      const calibrationGain = context.createGain();
      calibrationTone.type = 'sine';
      calibrationTone.frequency.setValueAtTime(1000, startAt);
      calibrationGain.gain.setValueAtTime(0.0001, context.currentTime);
      calibrationGain.gain.exponentialRampToValueAtTime(0.018, startAt + 0.008);
      calibrationTone.connect(calibrationGain);
      calibrationGain.connect(getResumeMacAudioDestination(context));
      calibrationTone.start(startAt);
      activeCalibrationTone = calibrationTone;
      activeCalibrationToneGain = calibrationGain;
      shell.dataset.testTone = 'holding';
      shell.dataset.testToneStartedAt = performance.now().toFixed(1);
      shell.dataset.testToneDurationMs = String(CRT_CALIBRATION_TONE_HOLD_MS);
      calibrationToneTimer = window.setTimeout(() => {
        if (activeCalibrationTone !== calibrationTone) return;
        calibrationToneCompletedForResolve = true;
        shell.dataset.testTone = 'auto-fading';
        cutActiveCalibrationTone(context, CRT_CALIBRATION_TONE_FADE_MS / 1000);
        window.setTimeout(() => {
          window.dispatchEvent(new CustomEvent('resume-crt-calibration-tone-complete', {
            detail: {
              source: 'tone-auto-stop',
              durationMs: CRT_CALIBRATION_TONE_HOLD_MS,
            },
          }));
        }, CRT_CALIBRATION_TONE_FADE_MS + 8);
      }, CRT_CALIBRATION_TONE_HOLD_MS);
      return true;
    };
    const sharedGlitchStartAt = (context, scheduledAt, minimumLeadSeconds = 0.004) => {
      const requestedAt = Number(scheduledAt);
      const remainingSeconds = Number.isFinite(requestedAt)
        ? (requestedAt - performance.now()) / 1000
        : 0;
      return context.currentTime + Math.max(minimumLeadSeconds, remainingSeconds);
    };
    const markGlitchAudioScheduled = (eventId, scheduledAt) => {
      const id = String(eventId || '');
      if (!id) return;
      const syncState = window.__resumeCrtGlitchSync ||= {};
      syncState[id] = {
        ...(syncState[id] || {}),
        eventId: id,
        audioHandledAt: performance.now(),
        audioScheduledAt: Number(scheduledAt) || performance.now(),
      };
      shell.dataset.glitchAudioEvent = id;
      shell.dataset.glitchAudioScheduledAt = String(
        Number(scheduledAt) || performance.now(),
      );
    };
    const playBelieveVocal = (detail = {}) => {
      if (!isResumeForeground()) return false;
      const vocalId = String(detail.vocalId || '');
      const vocal = CRT_BELIEVE_VOCAL_STABS[vocalId];
      const context = getSharedAudioContext();
      if (!vocal || !context || context.state !== 'running') return false;
      const requestedAt = performance.now();
      const decoded = believeVocalBuffers.get(vocalId);
      const pending = decoded ? Promise.resolve(decoded) : prepareBelieveVocal(vocalId);
      if (!pending) return false;
      pending.then((buffer) => {
        if (!buffer
          || context.state !== 'running'
          || !isResumeForeground()
          || performance.now() - requestedAt > 500) return;
        cutActiveBelieveVocal(context);
        const source = context.createBufferSource();
        const gain = context.createGain();
        const panner = typeof context.createStereoPanner === 'function'
          ? context.createStereoPanner()
          : null;
        const startAt = sharedGlitchStartAt(context, detail.scheduledAt, 0.003);
        const playbackRate = Math.max(0.82, Math.min(1.18, Number(detail.vocalRate) || 1));
        const peak = Math.max(0.08, Math.min(0.42, Number(detail.vocalGain) || 0.3));
        const sourceDuration = buffer.duration / playbackRate;
        const requestedGate = Math.max(0.09, Number(detail.vocalGateMs) / 1000 || sourceDuration);
        const gateSeconds = Math.min(sourceDuration, requestedGate + 0.08);
        const attackEnd = startAt + 0.006;
        const releaseStart = Math.max(attackEnd + 0.012, startAt + gateSeconds - 0.018);
        source.buffer = buffer;
        source.playbackRate.setValueAtTime(playbackRate, startAt);
        gain.gain.setValueAtTime(0.0001, context.currentTime);
        gain.gain.setValueAtTime(0.0001, startAt);
        gain.gain.exponentialRampToValueAtTime(peak, attackEnd);
        gain.gain.setValueAtTime(peak, releaseStart);
        gain.gain.exponentialRampToValueAtTime(0.0001, startAt + gateSeconds);
        source.connect(gain);
        if (panner) {
          panner.pan.setValueAtTime(
            Math.max(-0.5, Math.min(0.5, Number(detail.vocalPan) || 0)),
            startAt,
          );
          gain.connect(panner);
          panner.connect(getResumeMacAudioDestination(context));
        } else {
          gain.connect(getResumeMacAudioDestination(context));
        }
        activeBelieveVocalSource = source;
        activeBelieveVocalGain = gain;
        activeBelieveVocalPanner = panner;
        source.onended = () => {
          if (activeBelieveVocalSource === source) {
            activeBelieveVocalSource = null;
            activeBelieveVocalGain = null;
            activeBelieveVocalPanner = null;
          }
          try { source.disconnect(); } catch (_) {}
          try { gain.disconnect(); } catch (_) {}
          try { panner?.disconnect(); } catch (_) {}
        };
        source.start(startAt);
        source.stop(startAt + gateSeconds + 0.01);
        shell.dataset.believeVocal = vocalId;
        shell.dataset.believeVocalStartedAt = performance.now().toFixed(1);
        shell.dataset.believeVocalRate = playbackRate.toFixed(3);
        const vocalTrace = window.__resumeBelieveVocalTrace ||= [];
        vocalTrace.push({
          id: vocalId,
          step: Number(detail.sequence) || 0,
          startedAt: Math.round(performance.now()),
          rate: Number(playbackRate.toFixed(3)),
          pan: Number(detail.vocalPan) || 0,
        });
        if (vocalTrace.length > 32) vocalTrace.splice(0, vocalTrace.length - 32);
        shell.dataset.believeVocalTrace = JSON.stringify(vocalTrace);
      }).catch(() => {});
      return true;
    };
    const playSharedSample = (
      sampleIndex,
      volume = 0.31,
      status = 'parked-playing',
      eventId = '',
      durationMs = 280,
      playbackRate = 1,
      options = {},
    ) => {
      if (!isResumeForeground()) return false;
      const context = getSharedAudioContext();
      if (!context || context.state !== 'running') return false;
      audioUnlocked = true;
      shell.dataset.glitchContext = 'running';
      const decodedBuffer = sharedSampleBuffers.get(sampleIndex);
      if (!decodedBuffer) {
        // Do not reserve the hit while its Web Audio buffer is still decoding.
        // The caller can use the already-unlocked HTMLAudio voice for this
        // exact visual frame; subsequent hits use the decoded dry buffer.
        prepareSharedSample(sampleIndex);
        shell.dataset.glitchAudio = 'buffering-fallback';
        return false;
      }
      const playSerial = ++sharedPlaySerial;
      const requestedAt = performance.now();
      Promise.resolve(decodedBuffer).then((buffer) => {
        if (!buffer
          || playSerial !== sharedPlaySerial
          || performance.now() - requestedAt > 360
          || context.state !== 'running'
          || !isResumeForeground()) return;
        cutActiveStartup(context);
        cutActiveCalibrationTone(context);
        cutActiveSharedSample(context);
        cutActiveResolveGlitch(context);
        try {
          activeSource?.pause?.();
          if (activeSource) activeSource.currentTime = 0;
        } catch (_) {}
        activeSource = null;
        const source = context.createBufferSource();
        const gain = context.createGain();
        const filter = context.createBiquadFilter();
        const panner = typeof context.createStereoPanner === 'function'
          ? context.createStereoPanner()
          : null;
        const startAt = sharedGlitchStartAt(context, options?.scheduledAt);
        const voiceRole = ['spark', 'chop', 'pull', 'impact', 'human'].includes(options?.voiceRole)
          ? options.voiceRole
          : 'chop';
        const phase = ['design', 'make', 'believe'].includes(options?.phase)
          ? options.phase
          : 'design';
        const safePlaybackRate = Math.max(0.88, Math.min(1.24, Number(playbackRate) || 1));
        const gateSeconds = Math.max(
          0.055,
          Math.min(buffer.duration, Math.max(60, Number(durationMs) || 280) / 1000),
        );
        const peak = Math.max(0.0002, volume);
        const roleProfile = {
          spark: {
            attack: 0.002,
            hold: 0.08,
            filterType: 'highpass',
            frequency: phase === 'design' ? 720 : 520,
            q: 0.7,
          },
          chop: {
            attack: 0.008,
            hold: 0.30,
            filterType: 'bandpass',
            frequency: phase === 'make' ? 1850 : 2300,
            q: phase === 'make' ? 0.85 : 0.65,
          },
          pull: {
            attack: Math.min(0.075, gateSeconds * 0.28),
            hold: 0.12,
            filterType: 'lowpass',
            frequency: phase === 'believe' ? 5200 : 6800,
            q: 0.45,
          },
          impact: {
            attack: 0.002,
            hold: 0.18,
            filterType: 'lowpass',
            frequency: 3300,
            q: 0.72,
          },
          human: {
            attack: Math.min(0.018, gateSeconds * 0.12),
            hold: 0.36,
            filterType: 'lowpass',
            frequency: 6100,
            q: 0.4,
          },
        }[voiceRole];
        const attackEnd = Math.min(
          startAt + gateSeconds * 0.42,
          startAt + roleProfile.attack,
        );
        const holdEnd = Math.min(
          startAt + gateSeconds * 0.76,
          attackEnd + gateSeconds * roleProfile.hold,
        );
        source.buffer = buffer;
        source.playbackRate.setValueAtTime(safePlaybackRate, startAt);
        gain.gain.setValueAtTime(0.0001, context.currentTime);
        gain.gain.setValueAtTime(0.0001, startAt);
        gain.gain.exponentialRampToValueAtTime(peak, Math.max(startAt + 0.001, attackEnd));
        gain.gain.setValueAtTime(
          voiceRole === 'impact' ? Math.max(0.0002, peak * 0.52) : peak,
          holdEnd,
        );
        gain.gain.exponentialRampToValueAtTime(0.0001, startAt + gateSeconds);
        filter.type = roleProfile.filterType;
        filter.frequency.setValueAtTime(roleProfile.frequency, startAt);
        filter.Q.setValueAtTime(roleProfile.q, startAt);
        source.connect(filter);
        filter.connect(gain);
        if (panner) {
          panner.pan.setValueAtTime(
            Math.max(-0.5, Math.min(0.5, Number(options?.pan) || 0)),
            startAt,
          );
          gain.connect(panner);
          panner.connect(getResumeMacAudioDestination(context));
        } else {
          gain.connect(getResumeMacAudioDestination(context));
        }
        activeSharedSource = source;
        activeSharedGain = gain;
        source.onended = () => {
          if (activeSharedSource === source) {
            activeSharedSource = null;
            activeSharedGain = null;
          }
          try { source.disconnect(); } catch (_) {}
          try { filter.disconnect(); } catch (_) {}
          try { gain.disconnect(); } catch (_) {}
          try { panner?.disconnect(); } catch (_) {}
        };
        source.start(startAt);
        source.stop(startAt + gateSeconds + 0.012);
        shell.dataset.glitchAudio = status;
        shell.dataset.glitchAudioEvent = String(eventId);
        shell.dataset.glitchAudioStartedAt = performance.now().toFixed(1);
        shell.dataset.glitchAudioRate = safePlaybackRate.toFixed(3);
        shell.dataset.glitchAudioRole = voiceRole;
        shell.dataset.glitchAudioPhase = phase;
        markGlitchAudioScheduled(eventId, options?.scheduledAt);
      }).catch(() => {});
      return true;
    };
    const playPhaseNote = (beat = '', kind = 'text', sequence = 0, scheduledAt = 0) => {
      if (!isResumeForeground() || kind === 'ratchet' || kind === 'idle') return false;
      const context = getSharedAudioContext();
      if (!context || context.state !== 'running') return false;
      const phase = crtPhaseForBeat(beat);
      const frequency = CRT_PHASE_NOTE_FREQUENCIES[phase];
      if (!frequency) return false;
      cutActivePhaseNote(context);
      // The 1 kHz reset owns the color-bar phase. The first authored note of
      // DESIGN is the explicit palette cut, never an arbitrary timer.
      cutActiveCalibrationTone(context);
      const startAt = sharedGlitchStartAt(context, scheduledAt);
      const duration = phase === 'design' ? 0.28 : phase === 'make' ? 0.22 : 0.42;
      const master = context.createGain();
      master.gain.setValueAtTime(0.0001, context.currentTime);
      master.gain.exponentialRampToValueAtTime(
        phase === 'make' ? 0.07 : 0.052,
        startAt + (phase === 'believe' ? 0.018 : 0.004),
      );
      master.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
      master.connect(getResumeMacAudioDestination(context));
      const voiceSpecs = phase === 'make'
        ? [
            { frequency: frequency / 4, type: 'sine', gain: 1, pan: 0 },
            { frequency, type: 'triangle', gain: 0.38, pan: 0.08 },
          ]
        : phase === 'believe'
          ? [
              { frequency, type: 'sine', gain: 0.74, pan: -0.2 },
              { frequency: frequency * 1.5, type: 'triangle', gain: 0.34, pan: 0.22 },
            ]
          : [
              { frequency: frequency * 2, type: 'triangle', gain: 0.72, pan: sequence % 2 ? 0.22 : -0.22 },
            ];
      const voices = voiceSpecs.map((spec) => {
        const oscillator = context.createOscillator();
        const voiceGain = context.createGain();
        const panner = typeof context.createStereoPanner === 'function'
          ? context.createStereoPanner()
          : null;
        oscillator.type = spec.type;
        oscillator.frequency.setValueAtTime(spec.frequency, startAt);
        voiceGain.gain.setValueAtTime(spec.gain, startAt);
        oscillator.connect(voiceGain);
        if (panner) {
          panner.pan.setValueAtTime(spec.pan, startAt);
          voiceGain.connect(panner);
          panner.connect(master);
        } else {
          voiceGain.connect(master);
        }
        oscillator.start(startAt);
        oscillator.stop(startAt + duration + 0.012);
        oscillator.onended = () => {
          try { oscillator.disconnect(); } catch (_) {}
          try { voiceGain.disconnect(); } catch (_) {}
          try { panner?.disconnect(); } catch (_) {}
        };
        return oscillator;
      });
      activePhaseVoices = voices;
      activePhaseGain = master;
      const finalVoice = voices[voices.length - 1];
      if (finalVoice) {
        finalVoice.addEventListener('ended', () => {
          if (activePhaseGain !== master) return;
          try { master.disconnect(); } catch (_) {}
          activePhaseVoices = [];
          activePhaseGain = null;
        }, { once: true });
      }
      shell.dataset.phaseNote = `${phase}:${frequency.toFixed(2)}`;
      return true;
    };
    const playResolveGlitch = (eventId = '', scheduledAt = 0, startOffsetMs = 180) => {
      if (!isResumeForeground() || CRT_RESOLVE_GLITCH_INDEX < 0) return false;
      const context = getSharedAudioContext();
      if (!context || context.state !== 'running') return false;
      const serial = ++resolveGlitchSerial;
      const requestedAt = performance.now();
      const prepared = prepareSharedSample(CRT_RESOLVE_GLITCH_INDEX);
      if (!prepared) return false;
      Promise.resolve(prepared).then((buffer) => {
        if (!buffer
          || serial !== resolveGlitchSerial
          || performance.now() - requestedAt > 360
          || context.state !== 'running'
          || !isResumeForeground()) return;
        const source = context.createBufferSource();
        const gain = context.createGain();
        const startAt = sharedGlitchStartAt(context, scheduledAt)
          + Math.max(0, Math.min(0.5, Number(startOffsetMs) / 1000 || 0));
        const gateSeconds = Math.min(0.16, buffer.duration);
        source.buffer = buffer;
        // This pack transient peaks near 1023 Hz; a 1.024 rate lands it on C6
        // beside the final mallet note instead of leaving an unrelated pitch.
        source.playbackRate.setValueAtTime(1.024, startAt);
        gain.gain.setValueAtTime(0.0001, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.34, startAt + 0.003);
        gain.gain.exponentialRampToValueAtTime(0.0001, startAt + gateSeconds);
        source.connect(gain);
        gain.connect(getResumeMacAudioDestination(context));
        activeResolveGlitchSource = source;
        activeResolveGlitchGain = gain;
        source.onended = () => {
          if (activeResolveGlitchSource === source) {
            activeResolveGlitchSource = null;
            activeResolveGlitchGain = null;
          }
          try { source.disconnect(); } catch (_) {}
          try { gain.disconnect(); } catch (_) {}
        };
        source.start(startAt);
        source.stop(startAt + gateSeconds + 0.012);
        shell.dataset.resolveGlitch = 'dry-glitch-021-c6';
        shell.dataset.resolveGlitchEvent = String(eventId);
      }).catch(() => {});
      return true;
    };
    const playStartupChime = (
      eventId = '',
      durationMs = 720,
      scheduledAt = 0,
      toneDelayMs = 0,
    ) => {
      if (!isResumeForeground()) return false;
      const context = getSharedAudioContext();
      if (!context || context.state !== 'running') return false;
      sharedPlaySerial += 1;
      cutActiveSharedSample(context);
      cutActiveBelieveVocal(context);
      cutActiveResolveGlitch(context);
      cutActivePhaseNote(context);
      cutActiveStartup(context);
      cutActiveCalibrationTone(context);
      const startAt = sharedGlitchStartAt(context, scheduledAt);
      const duration = Math.max(0.58, Math.min(0.9, Number(durationMs) / 1000 || 0.72));
      const master = context.createGain();
      master.gain.setValueAtTime(0.0001, context.currentTime);
      master.gain.exponentialRampToValueAtTime(0.22, startAt + 0.006);
      master.gain.setValueAtTime(0.22, startAt + 0.24);
      master.gain.exponentialRampToValueAtTime(0.12, startAt + duration * 0.62);
      master.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
      master.connect(getResumeMacAudioDestination(context));
      const createVoice = ({
        type,
        frequency,
        gainValue,
        pan = 0,
        offset = 0,
        voiceDuration = duration,
        percussive = false,
      }) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        const panner = typeof context.createStereoPanner === 'function'
          ? context.createStereoPanner()
          : null;
        const voiceStart = startAt + Math.max(0, offset);
        const voiceEnd = Math.min(
          startAt + duration,
          voiceStart + Math.max(0.06, voiceDuration),
        );
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, voiceStart);
        gain.gain.setValueAtTime(0.0001, startAt);
        gain.gain.setValueAtTime(0.0001, voiceStart);
        gain.gain.exponentialRampToValueAtTime(
          gainValue,
          voiceStart + (percussive ? 0.003 : 0.012),
        );
        if (!percussive) {
          gain.gain.exponentialRampToValueAtTime(
            Math.max(0.0001, gainValue * 0.58),
            voiceStart + (voiceEnd - voiceStart) * 0.34,
          );
        }
        gain.gain.exponentialRampToValueAtTime(0.0001, voiceEnd);
        oscillator.connect(gain);
        if (panner) {
          panner.pan.setValueAtTime(pan, voiceStart);
          gain.connect(panner);
          panner.connect(master);
        } else {
          gain.connect(master);
        }
        oscillator.start(voiceStart);
        oscillator.stop(voiceEnd + 0.012);
        return { oscillator, gain, panner };
      };
      // A dry Macintosh-family wink: three short mallet notes say
      // "so / sue / me", descending onto C, where the wide startup-style chord
      // appears underneath. This references the joke without shipping Apple's
      // original Sosumi sample or adding a reverb/delay tail.
      // Keep the broadcast test tone independent of the short resolve chord:
      // it sustains with the color-bar phase and the next overture beat cuts it.
      if (toneDelayMs > 0) {
        calibrationToneStartTimer = window.setTimeout(() => {
          calibrationToneStartTimer = 0;
          if (shell.dataset.overtureResolve === 'true'
            && shell.dataset.overtureResolveCard === 'bars') {
            startCalibrationTone(context);
          }
        }, Math.max(0, Math.min(500, Number(toneDelayMs) || 0)));
      } else {
        startCalibrationTone(context);
      }
      if (!CRT_SOSUMI_RESOLVE_ENABLED) {
        try { master.disconnect(); } catch (_) {}
        activeStartupVoices = [];
        activeStartupGain = null;
        shell.dataset.glitchAudio = 'resolve-test-tone-only';
        shell.dataset.glitchAudioEvent = String(eventId);
        shell.dataset.glitchAudioStartedAt = performance.now().toFixed(1);
        return true;
      }
      activeStartupVoices = [
        createVoice({
          type: 'triangle',
          frequency: 1318.51,
          gainValue: 0.58,
          pan: -0.18,
          voiceDuration: 0.12,
          percussive: true,
        }),
        createVoice({
          type: 'triangle',
          frequency: 1174.66,
          gainValue: 0.54,
          pan: 0.18,
          offset: 0.09,
          voiceDuration: 0.12,
          percussive: true,
        }),
        createVoice({
          type: 'triangle',
          frequency: 1046.50,
          gainValue: 0.50,
          offset: 0.18,
          voiceDuration: 0.14,
          percussive: true,
        }),
        createVoice({
          type: 'sine',
          frequency: 130.81,
          gainValue: 0.62,
          pan: -0.28,
          offset: 0.18,
          voiceDuration: duration - 0.18,
        }),
        createVoice({
          type: 'triangle',
          frequency: 196.00,
          gainValue: 0.28,
          pan: 0.26,
          offset: 0.18,
          voiceDuration: duration - 0.18,
        }),
        createVoice({
          type: 'sine',
          frequency: 261.63,
          gainValue: 0.38,
          pan: 0.18,
          offset: 0.18,
          voiceDuration: duration - 0.18,
        }),
        createVoice({
          type: 'triangle',
          frequency: 329.63,
          gainValue: 0.20,
          pan: -0.16,
          offset: 0.18,
          voiceDuration: duration - 0.18,
        }),
        createVoice({
          type: 'sine',
          frequency: 392.00,
          gainValue: 0.09,
          pan: 0.08,
          offset: 0.18,
          voiceDuration: duration - 0.18,
        }),
      ];
      activeStartupGain = master;
      const finalVoice = activeStartupVoices[activeStartupVoices.length - 1]?.oscillator;
      if (finalVoice) {
        finalVoice.onended = () => {
          if (activeStartupGain !== master) return;
          activeStartupVoices.forEach(({ oscillator, gain, panner }) => {
            try { oscillator.disconnect(); } catch (_) {}
            try { gain.disconnect(); } catch (_) {}
            try { panner?.disconnect(); } catch (_) {}
          });
          try { master.disconnect(); } catch (_) {}
          activeStartupVoices = [];
          activeStartupGain = null;
        };
      }
      shell.dataset.glitchAudio = 'sosumi-resolve-playing';
      shell.dataset.glitchAudioEvent = String(eventId);
      shell.dataset.glitchAudioStartedAt = performance.now().toFixed(1);
      return true;
    };
    const stageAtProgress = (progress) => {
      if (progress >= 0.18 && progress < 0.42) return { index: 0, start: 0.18, end: 0.42 };
      if (progress >= 0.42 && progress < 0.66) return { index: 1, start: 0.42, end: 0.66 };
      if (progress >= 0.66 && progress < 0.985) return { index: 2, start: 0.66, end: 0.985 };
      return null;
    };
    const triggerGlitchAudio = (
      progress,
      force = false,
      preferredIndex = null,
      playbackRate = 1,
      volumeScale = 1,
      gateMs = null,
    ) => {
      if (!isResumeForeground()) return false;
      const stage = stageAtProgress(progress);
      if (!stage) {
        lastAudioKey = '';
        return false;
      }
      const bucket = Math.max(0, Math.floor((progress - stage.start) / 0.052));
      const key = `${stage.index}:${bucket}`;
      const now = performance.now();
      if (!force && (key === lastAudioKey || now - lastAudioAt < 125)) return;
      lastAudioKey = key;
      lastAudioAt = now;
      const sampleIndex = Number.isInteger(preferredIndex)
        ? Math.max(0, Math.min(CRT_GLITCH_AUDIO_SOURCES.length - 1, preferredIndex))
        : (stage.index * 2 + bucket * 3) % CRT_GLITCH_AUDIO_SOURCES.length;
      const isParkedHit = Number.isInteger(preferredIndex);
      const player = audioPlayers[sampleIndex];
      if (!player) return false;
      try {
        activeSource?.pause?.();
        if (activeSource) activeSource.currentTime = 0;
      } catch (_) {}
      player.muted = false;
      const safeVolumeScale = Math.max(0.72, Math.min(1.12, Number(volumeScale) || 1));
      const baseVolume = isParkedHit ? 0.31 : 0.26 + ((sampleIndex + bucket) % 3) * 0.03;
      player.volume = Math.max(
        0.06,
        Math.min(0.68, baseVolume * safeVolumeScale * RESUME_MAC_MASTER_MAKEUP_GAIN),
      );
      player.playbackRate = isParkedHit
        ? Math.max(0.88, Math.min(1.24, Number(playbackRate) || 1))
        : 0.98 + ((stage.index + bucket) % 5) * 0.035;
      try { player.currentTime = 0; } catch (_) {}
      activeSource = player;
      const played = player.play();
      return Promise.resolve(played).then(() => {
        audioUnlocked = true;
        pendingAudioProgress = null;
        shell.dataset.glitchAudio = 'playing';
        const dryGateMs = Number.isFinite(Number(gateMs))
          ? Math.max(90, Math.min(360, Number(gateMs)))
          : isParkedHit ? 320 : 220;
        window.setTimeout(() => {
          if (activeSource !== player) return;
          try {
            player.pause();
            player.currentTime = 0;
          } catch (_) {}
        }, dryGateMs);
        return true;
      }).catch(() => {
        pendingAudioProgress = progress;
        lastAudioKey = '';
        shell.dataset.glitchAudio = 'locked';
        return false;
      });
    };
    const primeAudio = () => {
      if (!isResumeForeground()) return Promise.resolve(false);
      let macContext = null;
      try {
        macContext = window.__ensureResumeMacKeyAudioContext?.() || null;
      } catch (_) {}
      if (!macContext) {
        const existing = window.__resumeMacKeyAudioContext;
        if (existing && existing.state !== 'closed') {
          macContext = existing;
        } else {
          const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
          if (AudioContextCtor) {
            try {
              macContext = new AudioContextCtor();
              installResumeMacMasterBus(macContext);
              window.__resumeMacKeyAudioContext = macContext;
              window.dispatchEvent(new CustomEvent('resume-mac-audio-ready'));
            } catch (_) {}
          }
        }
      }
      if (audioUnlocked && (!macContext || macContext.state === 'running')) {
        if (macContext?.state === 'running') {
          prepareParkedSamples();
          prepareBelieveVocals();
        }
        shell.dataset.glitchAudio = 'ready';
        return Promise.resolve(true);
      }
      if (!audioPlayers.length && !macContext) {
        shell.dataset.glitchAudio = 'unsupported';
        return Promise.resolve(false);
      }
      if (primePromise) return primePromise;
      shell.dataset.glitchAudio = 'arming';
      const unlockHtmlFallback = () => {
        const player = audioPlayers[0];
        if (!player) return Promise.resolve(false);
        player.muted = true;
        player.volume = 0;
        try { player.currentTime = 0; } catch (_) {}
        return Promise.resolve(player.play()).then(() => {
          player.pause();
          try { player.currentTime = 0; } catch (_) {}
          player.muted = false;
          player.volume = 0.3;
          return true;
        }).catch(() => {
          player.muted = false;
          player.volume = 0.3;
          return false;
        });
      };
      let htmlReady = false;
      let readyEventDispatched = false;
      let contextStateListener = null;
      const commitAudioReady = (source = '') => {
        if (!isResumeForeground()) return false;
        const sharedReady = macContext?.state === 'running';
        if (!sharedReady && !htmlReady) return false;
        audioUnlocked = true;
        pendingAudioProgress = null;
        lastAudioKey = '';
        shell.dataset.glitchContext = macContext?.state || source || 'html-audio';
        shell.dataset.glitchAudio = 'ready';
        if (sharedReady) {
          prepareParkedSamples();
          prepareBelieveVocals();
        }
        if (contextStateListener && macContext?.removeEventListener) {
          macContext.removeEventListener('statechange', contextStateListener);
          contextStateListener = null;
        }
        if (!readyEventDispatched) {
          readyEventDispatched = true;
          window.dispatchEvent(new CustomEvent('resume-glitch-audio-ready', {
            detail: { context: macContext?.state || source || 'html-audio' },
          }));
        }
        return true;
      };
      if (macContext?.addEventListener && macContext.state !== 'running') {
        contextStateListener = () => { commitAudioReady('audio-context'); };
        macContext.addEventListener('statechange', contextStateListener);
      }
      const sharedUnlock = macContext
        ? Promise.resolve(macContext.resume?.())
          .then(() => commitAudioReady('audio-context'))
          .catch(() => false)
        : Promise.resolve(false);
      // Invoke both unlock mechanisms inside the original user gesture.
      // AudioContext.resume() is allowed to remain pending by some browsers,
      // so a short race keeps the site retryable instead of marooned in
      // "arming" for the rest of the phase.
      const htmlUnlock = unlockHtmlFallback().then((ready) => {
        htmlReady = ready;
        if (ready) commitAudioReady('html-audio');
        return ready;
      });
      const unlockDeadline = new Promise((resolve) => {
        window.setTimeout(resolve, 240);
      });
      primePromise = Promise.race([
        Promise.allSettled([sharedUnlock, htmlUnlock]),
        unlockDeadline,
      ]).then(() => {
        const sharedReady = macContext?.state === 'running';
        audioUnlocked = audioUnlocked || sharedReady || htmlReady;
        pendingAudioProgress = null;
        lastAudioKey = '';
        shell.dataset.glitchContext = macContext?.state || 'none';
        shell.dataset.glitchAudio = audioUnlocked ? 'ready' : 'blocked';
        if (audioUnlocked) commitAudioReady(htmlReady ? 'html-audio' : 'audio-context');
        return audioUnlocked;
      }).finally(() => {
        primePromise = null;
      });
      return primePromise;
    };
    const onParkedGlitch = (event) => {
      if (!isResumeForeground()) return;
      if (event.detail?.kind === 'startup') {
        // The 1 kHz tone and the color bars are one resolve cue. Never let a
        // late/stale startup hit play without its visual state.
        if (shell.dataset.overtureResolve !== 'true'
          || shell.dataset.overtureResolveCard !== 'bars') {
          shell.dataset.glitchAudio = 'resolve-visual-missing';
          return;
        }
        const eventId = event.detail?.eventId;
        const context = getSharedAudioContext();
        // The bars are a hard broadcast interruption. If another path reaches
        // this boundary while the bridge is still alive, stop it click-safely
        // before the oscillator starts instead of masking the cut with SFX.
        if (context?.state === 'running') {
          cutActiveBelieveSinging(context, 0.006);
          cutActiveResolveGlitch(context);
        }
        if (!playStartupChime(
          eventId,
          Number(event.detail?.durationMs) || 720,
          event.detail?.immediateTone === true
            ? 0
            : Number(event.detail?.scheduledAt) || 0,
          Number(event.detail?.toneDelayMs) || 0,
        )) {
          shell.dataset.glitchAudio = 'resolve-tone-pending';
        } else if (event.detail?.muteResolveGlitch !== true) {
          playResolveGlitch(
            eventId,
            Number(event.detail?.scheduledAt) || 0,
            Number.isFinite(Number(event.detail?.resolveGlitchOffsetMs))
              ? Number(event.detail?.resolveGlitchOffsetMs)
              : 180,
          );
        } else {
          shell.dataset.resolveGlitch = 'muted-clean-tone';
          shell.dataset.resolveGlitchEvent = String(eventId);
        }
        return;
      }
      const sampleIndex = Number(event.detail?.sampleIndex);
      const volumeScale = Math.max(0.72, Math.min(1.12, Number(event.detail?.volumeScale) || 1));
      const playbackRate = Math.max(0.88, Math.min(1.24, Number(event.detail?.playbackRate) || 1));
      const audioDurationMs = Number(event.detail?.audioDurationMs)
        || Number(event.detail?.durationMs)
        || 320;
      const phase = event.detail?.phase || crtPhaseForBeat(event.detail?.beat);
      const voiceRole = event.detail?.voiceRole
        || crtVoiceRoleForEvent(event.detail?.beat, event.detail?.kind, event.detail?.sequence);
      playPhaseNote(
        event.detail?.beat,
        event.detail?.kind || 'text',
        Number(event.detail?.sequence) || 0,
        Number(event.detail?.scheduledAt) || 0,
      );
      if (Number.isInteger(sampleIndex)
        && playSharedSample(
          sampleIndex,
          0.31 * volumeScale,
          'text-playing',
          event.detail?.eventId,
          audioDurationMs,
          playbackRate,
          {
            phase,
            voiceRole,
            pan: Number(event.detail?.pan) || 0,
            scheduledAt: Number(event.detail?.scheduledAt) || 0,
          },
        )) return;
      if (!audioUnlocked) {
        shell.dataset.glitchAudio = 'parked-pending';
        return;
      }
      const progress = clamp01(Number(event.detail?.progress) || 0);
      triggerGlitchAudio(
        progress,
        true,
        Number.isInteger(sampleIndex) ? sampleIndex : null,
        playbackRate,
        volumeScale,
        audioDurationMs,
      );
    };
    const onParkedIdle = (event) => {
      if (!isResumeForeground()) return;
      if (event.detail?.muteGlitchAudio === true) {
        shell.dataset.glitchAudio = 'continuous-source';
        return;
      }
      const sampleIndex = Number(event.detail?.sampleIndex);
      if (!Number.isInteger(sampleIndex)) return;
      const volumeScale = Math.max(0.72, Math.min(1.12, Number(event.detail?.volumeScale) || 1));
      const playbackRate = Math.max(0.88, Math.min(1.24, Number(event.detail?.playbackRate) || 1));
      const hasVocal = Boolean(event.detail?.vocalId);
      const volume = (
        hasVocal
          ? 0.075
          : event.detail?.kind === 'ratchet'
            ? 0.18
            : 0.15
      ) * volumeScale;
      const phase = event.detail?.phase || crtPhaseForBeat(event.detail?.beat);
      const voiceRole = event.detail?.voiceRole
        || crtVoiceRoleForEvent(event.detail?.beat, event.detail?.kind, event.detail?.sequence);
      playSharedSample(
        sampleIndex,
        volume,
        'idle-playing',
        event.detail?.eventId,
        Number(event.detail?.audioDurationMs) || Number(event.detail?.durationMs) || 220,
        playbackRate,
        {
          phase,
          voiceRole,
          pan: Number(event.detail?.pan) || 0,
          scheduledAt: Number(event.detail?.scheduledAt) || 0,
        },
      );
      if (hasVocal) playBelieveVocal(event.detail);
    };
    const onBelieveSingingMotif = () => {
      playBelieveSingingMotif();
    };
    const onIntroBedStart = () => {
      // Decode the later singing bridge while the opening bed is running.
      // The authored cue can then start immediately even on a cold cache.
      prepareBelieveVocal('joker-singing');
      playIntroBed();
    };
    const onIntroBloopDialogueStart = () => {
      playIntroBloopDialogue();
    };
    const onIntroBedStop = () => {
      const context = getSharedAudioContext();
      if (context) {
        cutActiveIntroBed(context);
        cutActiveIntroBloop(context);
        cutActiveBelieveSinging(context);
      } else {
        cancelPendingBelieveSinging();
      }
    };
    const onBreather = (event) => {
      sharedPlaySerial += 1;
      const context = getSharedAudioContext();
      if (context) {
        cutActiveSharedSample(context);
        cutActiveBelieveVocal(context);
        const preserveBelieveBridge = event.detail?.beat === 'breather-believe'
          && ['queued', 'playing'].includes(shell.dataset.believeSinging);
        if (!preserveBelieveBridge) cutActiveBelieveSinging(context);
        cutActiveResolveGlitch(context);
        cutActivePhaseNote(context);
        cutActiveStartup(context);
        const resolveIsHolding = event.detail?.beat === 'breather-design'
          && shell.dataset.overtureResolve === 'true';
        if (!resolveIsHolding) cutActiveCalibrationTone(context);
      }
      try {
        activeSource?.pause?.();
        if (activeSource) activeSource.currentTime = 0;
      } catch (_) {}
      shell.dataset.glitchAudio = 'breathing';
    };
    let resolveWasVisible = shell.dataset.overtureResolve === 'true';
    const onOvertureProgressAudio = (event) => {
      const resolveIsVisible = event.detail?.resolve === true;
      if (resolveIsVisible) {
        if (!resolveWasVisible) calibrationToneCompletedForResolve = false;
        resolveWasVisible = true;
        return;
      }
      // The progress event is emitted in the same update that removes the
      // color bars. Cut the 1 kHz oscillator here instead of waiting for the
      // next note, glitch, or breather to arrive.
      if (resolveWasVisible || activeCalibrationTone || activeCalibrationToneGain) {
        const context = getSharedAudioContext();
        if (context) cutActiveCalibrationTone(context);
      }
      resolveWasVisible = false;
    };
    const onPageActivityChange = () => {
      if (isResumeForeground()) {
        window.clearTimeout(pageAudioSuspendTimer);
        pageAudioSuspendTimer = 0;
        const context = getSharedAudioContext();
        const restoreForegroundAudio = () => {
          if (!isResumeForeground()) return;
          shell.dataset.glitchAudio = audioUnlocked ? 'ready' : 'locked';
          shell.dataset.glitchContext = context?.state || 'missing';
          const resolveIsHolding = shell.dataset.overtureResolve === 'true'
            && shell.dataset.overtureResolveCard === 'bars';
          if (audioUnlocked
            && resolveIsHolding
            && !calibrationToneCompletedForResolve
            && context?.state === 'running') {
            startCalibrationTone(context);
          }
        };
        if (context?.state === 'suspended' && audioUnlocked) {
          shell.dataset.glitchAudio = 'foreground-resuming';
          Promise.resolve(context.resume?.())
            .catch(() => false)
            .finally(restoreForegroundAudio);
        } else {
          restoreForegroundAudio();
        }
        return;
      }
      sharedPlaySerial += 1;
      const context = getSharedAudioContext();
      if (context) {
        // Short transient events are obsolete when the page returns. Preserve
        // the long-form theme, blooper dialogue, and singing bridge by freezing
        // the shared AudioContext instead of destroying their source nodes.
        cutActiveSharedSample(context);
        cutActiveBelieveVocal(context);
        cutActiveResolveGlitch(context);
        cutActivePhaseNote(context);
        cutActiveStartup(context);
        cutActiveCalibrationTone(context);
        window.clearTimeout(pageAudioSuspendTimer);
        pageAudioSuspendTimer = window.setTimeout(() => {
          pageAudioSuspendTimer = 0;
          if (isResumeForeground() || context.state !== 'running') return;
          Promise.resolve(context.suspend?.())
            .then(() => {
              if (!isResumeForeground()) {
                shell.dataset.glitchAudio = 'background-suspended';
                shell.dataset.glitchContext = context.state;
              }
            })
            .catch(() => {});
        }, 24);
      }
      try {
        activeSource?.pause?.();
        if (activeSource) activeSource.currentTime = 0;
      } catch (_) {}
      shell.dataset.glitchAudio = 'background-muted';
    };
    const onSharedAudioReady = () => {
      if (!isResumeForeground()) return;
      const context = getSharedAudioContext();
      if (context?.state === 'running') {
        audioUnlocked = true;
        shell.dataset.glitchAudio = 'ready';
        shell.dataset.glitchContext = 'running';
      }
      prepareParkedSamples();
      prepareBelieveVocals();
    };
    window.addEventListener('pointerdown', primeAudio, { passive: true, capture: true });
    window.addEventListener('click', primeAudio, { passive: true, capture: true });
    window.addEventListener('keydown', primeAudio, { passive: true, capture: true });
    window.addEventListener('touchstart', primeAudio, { passive: true, capture: true });
    if (CRT_SCROLL_INTERACTION_ENABLED) {
      window.addEventListener('wheel', primeAudio, { passive: true, capture: true });
    }
    window.__resumePrimeIntroAudio = primeAudio;
    window.addEventListener('resume-glitch-audio-unlock', primeAudio);
    window.addEventListener('resume-crt-parked-glitch', onParkedGlitch);
    window.addEventListener('resume-mac-audio-ready', onSharedAudioReady);
    window.addEventListener('resume-crt-parked-idle', onParkedIdle);
    window.addEventListener('resume-intro-bed-start', onIntroBedStart);
    window.addEventListener('resume-intro-bloop-dialogue-start', onIntroBloopDialogueStart);
    window.addEventListener('resume-intro-bed-stop', onIntroBedStop);
    window.addEventListener('resume-believe-singing-motif', onBelieveSingingMotif);
    window.addEventListener('resume-crt-breather', onBreather);
    window.addEventListener('resume-crt-overture-progress', onOvertureProgressAudio);
    document.addEventListener('visibilitychange', onPageActivityChange);
    window.addEventListener('resume-page-activity-change', onPageActivityChange);
    // Catch the case where the shared keyboard context was published before
    // this effect mounted.
    prepareParkedSamples();
    prepareBelieveVocals();
    shell.dataset.glitchAudio = 'locked';
    return () => {
      window.removeEventListener('pointerdown', primeAudio, true);
      window.removeEventListener('click', primeAudio, true);
      window.removeEventListener('keydown', primeAudio, true);
      window.removeEventListener('touchstart', primeAudio, true);
      if (CRT_SCROLL_INTERACTION_ENABLED) {
        window.removeEventListener('wheel', primeAudio, true);
      }
      if (window.__resumePrimeIntroAudio === primeAudio) {
        delete window.__resumePrimeIntroAudio;
      }
      window.removeEventListener('resume-glitch-audio-unlock', primeAudio);
      window.removeEventListener('resume-crt-parked-glitch', onParkedGlitch);
      window.removeEventListener('resume-mac-audio-ready', onSharedAudioReady);
      window.removeEventListener('resume-crt-parked-idle', onParkedIdle);
      window.removeEventListener('resume-intro-bed-start', onIntroBedStart);
      window.removeEventListener('resume-intro-bloop-dialogue-start', onIntroBloopDialogueStart);
      window.removeEventListener('resume-intro-bed-stop', onIntroBedStop);
      window.removeEventListener('resume-believe-singing-motif', onBelieveSingingMotif);
      window.removeEventListener('resume-crt-breather', onBreather);
      window.removeEventListener('resume-crt-overture-progress', onOvertureProgressAudio);
      document.removeEventListener('visibilitychange', onPageActivityChange);
      window.removeEventListener('resume-page-activity-change', onPageActivityChange);
      for (const player of audioPlayers) {
        try { player.pause(); player.src = ''; } catch (_) {}
      }
      window.clearTimeout(pageAudioSuspendTimer);
      window.clearTimeout(believeSingingFallbackTimer);
      believeSingingFallbackTimer = 0;
      sharedPlaySerial += 1;
      const context = getSharedAudioContext();
      if (context) {
        cutActiveSharedSample(context);
        cutActiveBelieveVocal(context);
        cutActiveIntroBed(context);
        cutActiveIntroBloop(context);
        cutActiveBelieveSinging(context);
        cutActiveResolveGlitch(context);
        cutActivePhaseNote(context);
        cutActiveStartup(context);
        cutActiveCalibrationTone(context);
      }
      delete shell.dataset.glitchAudio;
      delete shell.dataset.glitchContext;
      delete shell.dataset.testTone;
      delete shell.dataset.testToneStartedAt;
      delete shell.dataset.testToneDurationMs;
      delete shell.dataset.resolveGlitch;
      delete shell.dataset.resolveGlitchEvent;
      sharedSampleBuffers.clear();
      sharedSamplePromises.clear();
      believeVocalBuffers.clear();
      believeVocalPromises.clear();
    };
  }, []);
  return null;
}

// Drives "scroll into the CRT": the camera dollies onto the screen glass over a
// one-viewport runway (hero copy fading out), then locks. Channel changes are
// explicit menu actions now; window scroll no longer flips the reel away while
// media is playing.
const CRT_TEXT_RUNWAY_VH = 1.0; // text + physical floppy insertion; camera stays still
const CRT_REEL_HOLD_VH = 0.75;  // playback plateau: further intent is required to enter
const CRT_ZOOM_RUNWAY_VH = 1.0;
const CRT_RUNWAY_VH = CRT_TEXT_RUNWAY_VH + CRT_REEL_HOLD_VH + CRT_ZOOM_RUNWAY_VH;
const CRT_LOCK_P = 0.985;      // scroll progress at which the dock locks
const CRT_DOCK_HOLD_VH = 2.0;  // extra scroll room after docking, without tuning
const CRT_SCROLL_INTERACTION_ENABLED = false;
// The screen copy now runs as a self-playing title sequence. Scroll is reserved
// for the physical interaction: inserting the floppy, starting the reel, and
// eventually docking into the CRT.
const CRT_OVERTURE_BEATS = [
  { at: 0, label: 'intro', kind: 'startup', textSamples: [0, 8, 16, 24] },
  { at: 0.165, label: 'breather-design', kind: 'breather' },
  {
    at: 0.18,
    label: 'design-command',
    textSamples: [3, 11, 19, 27],
    idleSamples: [0, 8, 16, 24, 11, 19],
  },
  {
    at: 0.31,
    label: 'design-response',
    textSamples: [7, 15, 23, 31],
    idleSamples: [1, 9, 17, 25, 14, 22],
  },
  { at: 0.405, label: 'breather-make', kind: 'breather' },
  {
    at: 0.42,
    label: 'make-command',
    textSamples: [6, 14, 22, 30],
    idleSamples: [2, 10, 18, 26, 15, 23, 31],
  },
  {
    at: 0.55,
    label: 'make-response',
    textSamples: [2, 10, 18, 26],
    idleSamples: [3, 11, 19, 27, 5, 13, 21, 29],
  },
  { at: 0.645, label: 'breather-believe', kind: 'breather' },
  {
    at: 0.66,
    label: 'believe-command',
    textSamples: [4, 12, 20, 28],
    idleSamples: [4, 12, 20, 28, 6, 14, 22, 30],
  },
  {
    at: 0.84,
    label: 'believe-response',
    textSamples: [1, 9, 17, 25],
    idleSamples: [7, 15, 23, 31, 9, 17, 25, 29],
  },
  { at: 0.965, label: 'breather-loop', kind: 'breather' },
  { at: CRT_LOCK_P, label: 'reel-gate' },
];
const CRT_AUTOPLAY_KEYFRAMES = [
  { at: 0, progress: 0 },
  { at: 1200, progress: 0 },
  { at: 1201, progress: 0.165 },
  { at: 1230, progress: 0.165 },
  { at: 1231, progress: 0.18 },
  { at: 2451, progress: 0.31 },
  { at: 2731, progress: 0.31 },
  // Breather beats remain as synchronization edges, but no longer park the
  // experience. They give the Enter hit one rendered frame before the next
  // command begins.
  { at: 2732, progress: 0.405 },
  { at: 2750, progress: 0.405 },
  { at: 2751, progress: 0.42 },
  { at: 3971, progress: 0.55 },
  // MAKE owns a compact sampled argument: warning → disobedience → prototype
  // → proof. Preserve all six edits, but recover the extra runtime by removing
  // the former dead hold after BELIEVE's last line.
  { at: 8611, progress: 0.55 },
  { at: 8612, progress: 0.645 },
  { at: 8630, progress: 0.645 },
  { at: 8631, progress: 0.66 },
  { at: 9931, progress: 0.84 },
  // BELIEVE resolves 350ms after the final sampled challenge rather than
  // parking silently for multiple seconds.
  { at: 15481, progress: 0.84 },
  { at: 15482, progress: 0.965 },
  { at: 15682, progress: 0.965 },
  { at: 15683, progress: 0 },
];
const CRT_AUTOPLAY_DURATION = CRT_AUTOPLAY_KEYFRAMES[CRT_AUTOPLAY_KEYFRAMES.length - 1].at;
// The overture also serves as a compact virtual-production camera reel. Each
// meaningful beat owns one authored move, so the camera travels with the
// terminal program instead of changing independently of the typing/glitch hit.
const CRT_INTRO_CAMERA_ROUTE = {
  // Three-shot camera grammar for the whole overture:
  // 1) close waiting/typing frame, 2) medium DESIGN/MAKE/BELIEVE stage frame,
  // 3) close resolve frame. Everything between these boundaries holds still.
  'design-command': { preset: 'typing', duration: 300, easing: 'snap' },
  'design-response': { preset: 'design', duration: 330, easing: 'snap' },
  'breather-loop': { preset: 'typing', duration: 300, easing: 'snap' },
};
// A phone-triggered launch starts directly at an empty ./design command. Its
// first command phase is linear so the first key lands immediately; after that
// it rejoins the authored autonomous timeline at the design response.
const CRT_COMPANION_DIRECT_COMMAND_MS = 1220;
const CRT_COMPANION_TIMELINE_TRIM_MS = 1511;
const CRT_COMPANION_DESIGN_MONTAGE_MS = 2740;
const CRT_RESOLVE_PHASE_MS = 1500;
// The CRT becomes a little Mac you tune like a TV. Channel 0 is the 🍎/boot
// terminal; the rest are menu items. Film Reel = the live trailer pool; the demo
// + About channels are rasterized DOM; Doom is a boot card.
const CRT_CHANNELS = [
  { id: 'boot', label: 'System', type: 'boot' },
  { id: 'help', label: 'Help', type: 'page', sel: '#help' },
  {
    id: 'blackbird',
    label: 'Blackbird',
    type: 'clip',
    src: BLACKBIRD_INNOVATION_VIDEO_URL,
    start: 0,
    clips: [
      {
        id: 'blackbird',
        src: BLACKBIRD_INNOVATION_VIDEO_URL,
        start: 0,
      },
      {
        id: 'humanrace',
        src: HUMAN_RACE_VIDEO_URL,
        start: 0,
      },
    ],
  },
  {
    id: 'louisvuitton',
    label: 'Louis Vuitton',
    type: 'clip',
    src: LOUIS_VUITTON_SS20_VIDEO_URL,
    start: 628,
  },
  { id: 'handofgod', label: 'Hand of God', type: 'interactive' },
  { id: 'filmreel', label: 'Film Reel', type: 'video' },
  { id: 'audio', label: 'Audio', type: 'page', sel: '#strudel' },
  { id: 'doom', label: 'Doom', type: 'doom' },
  { id: 'about', label: 'About', type: 'page', sel: '#crt-about' },
];

function CompanionIntroGate() {
  const lastRevisionRef = useRef(0);

  useEffect(() => {
    if (!COMPANION_GATE_ENABLED) return undefined;
    let cancelled = false;
    let pollTimer = 0;
    let activeSessionId = '';
    let activeServerInstance = '';
    let activePollController = null;
    let lastStateUpdatedAt = 0;
    let publishedDisplayMode = '';
    let channelsUnlocked = false;
    const longPollSeconds = 25;
    const retryPollMs = 3000;

    const publishDisplayMode = (mode) => {
      const normalized = mode === 'channels' ? 'channels' : 'intro';
      if (!activeSessionId || normalized === publishedDisplayMode) return;
      publishedDisplayMode = normalized;
      fetch('/api/companion/display', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session: activeSessionId, mode: normalized }),
      }).catch(() => {});
    };
    const onResetToStart = () => {
      channelsUnlocked = false;
      publishedDisplayMode = 'intro';
      if (!activeSessionId) return;
      // Mirror the automatic end-of-show reset to the reusable phone link so
      // both screens return to the same first-load state.
      fetch('/api/companion/stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session: activeSessionId }),
      }).catch(() => {});
    };
    const onOvertureProgress = (event) => {
      if (event.detail?.resolve) {
        channelsUnlocked = true;
        publishDisplayMode('channels');
      } else if (!channelsUnlocked) {
        publishDisplayMode('intro');
      }
    };
    window.addEventListener('resume-crt-overture-progress', onOvertureProgress);
    window.addEventListener('resume-companion-reset-to-start', onResetToStart);

    const poll = async (id) => {
      if (cancelled) return;
      if (!isResumeForeground()) {
        // Background tabs are deliberately dormant. The shared page-activity
        // coordinator performs one immediate catch-up poll when foregrounded.
        activePollController?.abort();
        activePollController = null;
        pollTimer = 0;
        return;
      }
      let delayMs = 0;
      try {
        window.__resumeCompanionStatePolls = (window.__resumeCompanionStatePolls || 0) + 1;
        document.documentElement.dataset.companionStatePolls = String(window.__resumeCompanionStatePolls);
        activePollController?.abort();
        const controller = new AbortController();
        activePollController = controller;
        const response = await fetch(
          `/api/companion/state?session=${encodeURIComponent(id)}`
            + `&since=${encodeURIComponent(lastStateUpdatedAt)}`
            + `&wait=${longPollSeconds}`,
          { cache: 'no-store', signal: controller.signal },
        );
        if (activePollController === controller) activePollController = null;
        if (!response.ok) throw new Error(`state ${response.status}`);
        const payload = await response.json();
        lastStateUpdatedAt = Math.max(lastStateUpdatedAt, Number(payload.updatedAt) || 0);
        const serverInstance = String(payload.instanceId || '');
        if (serverInstance && activeServerInstance && serverInstance !== activeServerInstance) {
          // A restarted server may restore an older numeric revision. Reset the
          // comparison epoch so the current authoritative command is applied
          // immediately instead of being mistaken for stale state.
          lastRevisionRef.current = -1;
        }
        if (serverInstance) activeServerInstance = serverInstance;
        const revision = Number(payload.revision) || 0;
        if (revision > lastRevisionRef.current) {
          lastRevisionRef.current = revision;
          const command = payload.command === 'camera'
            ? 'camera'
            : payload.command === 'channel'
              ? 'channel'
              : payload.command === 'start'
                ? 'start'
                : 'stop';
          const eventName = command === 'stop'
            ? 'resume-companion-stop-intro'
            : command === 'camera'
              ? 'resume-companion-camera'
              : command === 'channel'
                ? 'resume-companion-channel'
                : 'resume-companion-start-intro';
          window.dispatchEvent(new CustomEvent(eventName, {
            detail: {
              session: id,
              revision,
              startedAt: Number(payload.startedAt) || Date.now(),
              channel: payload.activeChannel || '',
              camera: payload.activeCamera || 'hero',
              visitorName: String(payload.visitorName || '').trim().slice(0, 24),
            },
          }));
          if (command === 'stop') {
            channelsUnlocked = false;
            publishedDisplayMode = 'intro';
          }
        }
      } catch (error) {
        if (error?.name === 'AbortError') return;
        // Keep polling. The Macintosh pairing screen remains a useful,
        // deterministic idle state during a brief LAN interruption.
        delayMs = retryPollMs;
      }
      if (!cancelled && isResumeForeground()) {
        pollTimer = window.setTimeout(() => poll(id), delayMs);
      }
    };
    const onPageActivity = () => {
      if (!activeSessionId || cancelled) return;
      if (!isResumeForeground()) {
        activePollController?.abort();
        activePollController = null;
        window.clearTimeout(pollTimer);
        pollTimer = 0;
        return;
      }
      activePollController?.abort();
      activePollController = null;
      window.clearTimeout(pollTimer);
      pollTimer = 0;
      poll(activeSessionId);
    };

    const connect = async () => {
      try {
        let previousSession = '';
        try {
          previousSession = window.localStorage.getItem(COMPANION_SESSION_STORAGE_KEY)
            || window.sessionStorage.getItem(COMPANION_SESSION_STORAGE_KEY)
            || '';
        } catch (_) {}
        const response = await fetch('/api/companion/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session: previousSession }),
          cache: 'no-store',
        });
        if (!response.ok) throw new Error(`session ${response.status}`);
        const payload = await response.json();
        if (cancelled) return;
        activeSessionId = payload.session;
        activeServerInstance = String(payload.instanceId || '');
        lastStateUpdatedAt = Number(payload.updatedAt) || 0;
        try {
          window.localStorage.setItem(COMPANION_SESSION_STORAGE_KEY, payload.session);
          window.sessionStorage.setItem(COMPANION_SESSION_STORAGE_KEY, payload.session);
        } catch (_) {}
        let qrUrl = payload.qrUrl || '';
        if (!qrUrl
          && payload.companionUrl
          && typeof window.ResumeQRCode?.toDataURL === 'function') {
          try {
            qrUrl = await window.ResumeQRCode.toDataURL(payload.companionUrl, {
              errorCorrectionLevel: 'M',
              margin: 1,
              width: 512,
              color: { dark: '#000000', light: '#ffffff' },
            });
          } catch (_) {}
        }
        if (cancelled) return;
        window.__resumeCompanionSession = { ...payload, qrUrl };
        window.__resumeCompanionQrUrl = qrUrl;
        const shell = document.querySelector('.landing-v1-shell');
        if (shell) {
          shell.dataset.companionSession = payload.session || '';
          shell.dataset.companionUrl = payload.companionUrl || '';
          shell.dataset.companionQr = qrUrl ? 'ready' : 'missing';
        }
        window.dispatchEvent(new CustomEvent('resume-companion-qr-ready', {
          detail: {
            session: payload.session,
            qrUrl,
          },
        }));
        publishDisplayMode('intro');
        poll(payload.session);
      } catch (_) {}
    };

    connect();
    window.addEventListener('resume-page-activity-change', onPageActivity);
    document.addEventListener('visibilitychange', onPageActivity);
    return () => {
      cancelled = true;
      activePollController?.abort();
      activePollController = null;
      window.clearTimeout(pollTimer);
      window.removeEventListener('resume-crt-overture-progress', onOvertureProgress);
      window.removeEventListener('resume-companion-reset-to-start', onResetToStart);
      window.removeEventListener('resume-page-activity-change', onPageActivity);
      document.removeEventListener('visibilitychange', onPageActivity);
    };
  }, []);

  return null;
}

function CrtZoom() {
  useEffect(() => {
    const enter = document.querySelector('.crt-enter');
    const shell = document.querySelector('.landing-v1-shell');
    const profile = document.querySelector('.landing-profile');
    if (!enter || !shell) return undefined;

    // Only engage where it can be smooth — otherwise leave the flat flowing page.
    const forceDesktopTest = new URLSearchParams(window.location.search)
      .get('desktopTest') === '1';
    const touchTablet = navigator.maxTouchPoints > 0
      && window.matchMedia('(min-width: 761px)').matches;
    const enabled = (forceDesktopTest
      || (window.matchMedia('(min-width: 900px)').matches
        && window.matchMedia('(pointer: fine)').matches)
      || touchTablet)
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!enabled) return undefined;

    // Every load begins from the authored first frame. Browsers commonly
    // restore scroll on reload, which otherwise boots directly into a zoomed
    // camera with the disk already inserted and the reel still selected.
    window.scrollTo(0, 0);
    shell.classList.remove('has-entered-mac');
    window.__tvHeroStopReel?.();
    window.__resumeStrudelAudioEngine?.setEnabled?.(false);
    window.__tvHeroPageMode?.(false);
    window.__tvHeroFloppyProgress?.(0);
    window.dispatchEvent(new CustomEvent('resume-crt-overture-progress', {
      detail: { progress: 0, floppyProgress: 0, zoomProgress: 0 },
    }));
    shell.classList.add('is-crt');
    shell.dataset.crtInputTarget = touchTablet ? 'touch-tablet' : 'fine-pointer';
    shell.dataset.poolRest = '0';
    const root = document.documentElement;
    const previousRootSnapType = root.style.scrollSnapType;
    root.style.scrollSnapType = 'none';

    const clamp01 = (v) => Math.min(Math.max(v, 0), 1);
    const ss = (t) => t * t * (3 - 2 * t);
    const heroScrollTop = () => Math.max(0, Number(profile?.offsetHeight) || 0);
    const autoplayProgressAt = (elapsed, directCompanionStart = false) => {
      let timelineElapsed = elapsed;
      if (directCompanionStart) {
        const directElapsed = Math.max(0, elapsed);
        if (directElapsed < CRT_COMPANION_DIRECT_COMMAND_MS) {
          return 0.18 + 0.13 * clamp01(
            directElapsed / CRT_COMPANION_DIRECT_COMMAND_MS,
          );
        }
        const montageElapsed = directElapsed - CRT_COMPANION_DIRECT_COMMAND_MS;
        if (montageElapsed < CRT_COMPANION_DESIGN_MONTAGE_MS) {
          // Hold on the completed ./design command while the wall tells the
          // full authored bull-to-abstraction story.
          return 0.31;
        }
        timelineElapsed = directElapsed
          + CRT_COMPANION_TIMELINE_TRIM_MS
          - CRT_COMPANION_DESIGN_MONTAGE_MS;
      }
      const loopTime = ((timelineElapsed % CRT_AUTOPLAY_DURATION) + CRT_AUTOPLAY_DURATION)
        % CRT_AUTOPLAY_DURATION;
      let current = CRT_AUTOPLAY_KEYFRAMES[0];
      for (let index = 1; index < CRT_AUTOPLAY_KEYFRAMES.length; index += 1) {
        const next = CRT_AUTOPLAY_KEYFRAMES[index];
        if (loopTime <= next.at) {
          const span = Math.max(1, next.at - current.at);
          const local = ss(clamp01((loopTime - current.at) / span));
          return current.progress + (next.progress - current.progress) * local;
        }
        current = next;
      }
      return 0;
    };
    let raf = 0;
    let autoplayRaf = 0;
    let autoplayStartedAt = performance.now();
    let autoplayLastTickAt = autoplayStartedAt;
    let autoplayProgress = 0;
    let lastOvertureProgress = 0;
    let pageActive = isResumeForeground();
    let pagePausedAt = pageActive ? 0 : performance.now();
    let autoplayReady = false;
    let macOvertureReady = false;
    // Cloud deployments do not expose the LAN companion transport, but they
    // must still wait for an explicit visitor gesture. Treating a disabled
    // companion as an implicit Start made public/preview builds auto-run on
    // load and eventually appear to loop.
    let companionStartRequested = false;
    let companionStartReceived = false;
    let companionInsertComplete = false;
    let companionStartSequence = 0;
    let companionIntermissionHeld = false;
    let companionIntermissionCommitted = false;
    let companionIntermissionCommit = 0;
    let intermissionResolveFallbackTimer = 0;
    let introTransportPaused = false;
    let introTransportPausedAt = 0;
    let loopResolveStartedAt = 0;
    let loopResolveUntil = 0;
    let wheelSync = 0;
    let pendingTrustedAudioStart = null;
    let locked = false;
    let projecting = false;
    let projected = false;
    let withinRanges = CRT_CHANNELS.map(() => 0);  // px each channel scrolls within
    let activeChannel = 0;
    let channelWithin = 0;
    let projectRetry = 0;
    let userSelectedChannel = false;
    let reelStarted = false;
    let reelAudioStarting = false;
    let reelTransitionToken = 0;
    let parkedGlitchTimer = 0;
    let parkedIdleTimer = 0;
    let parkedVisualTimer = 0;
    let introHyperspaceTimer = 0;
    let introCodeHandoffTimer = 0;
    let introWallStageDeadline = 0;
    let introWallStageRemainingMs = 0;
    let introCodeHandoffDeadline = 0;
    let introCodeHandoffRemainingMs = 0;
    let designStoryTimer = 0;
    let designStoryActive = false;
    let designStoryIndex = 0;
    let designStoryBeat = null;
    let designStoryDeadline = 0;
    let designStoryRemainingMs = 0;
    let makeStoryTimer = 0;
    const makeStoryInteractionTimers = new Set();
    let makeStoryActive = false;
    let makeStoryIndex = 0;
    let makeStoryBeat = null;
    let makeStoryDeadline = 0;
    let makeStoryRemainingMs = 0;
    let believeStoryTimer = 0;
    let believeStoryActive = false;
    let believeStoryIndex = 0;
    let believeStoryBeat = null;
    let believeStoryDeadline = 0;
    let believeStoryRemainingMs = 0;
    let channelGlitchTimer = 0;
    let parkedIdleSequence = 0;
    const parkedRatchetTimers = new Set();
    let poolRestIndex = 0;
    let activeProgramStage = 0;
    let executedProgramStage = -1;
    let programLaunchTimer = 0;
    const openingVocalTimers = new Set();
    const phaseVocalTimers = new Set();
    let openingInvitationResolve = null;
    let activeNameUtterance = null;
    let activeNameUtteranceResolve = null;
    let pendingNameVoicePromise = null;
    let pendingNameVoiceName = '';
    let preludeRecoveryPending = false;
    let preludeRecoveryName = '';
    let preludeRecoveryTimer = 0;
    const recentGlitchSamples = [];
    const parkedVisitCounts = new Map();
    const textVisitCounts = new Map();
    const makeAudioLoopProfile = (previousSignature = '') => {
      const stepsOptions = [7, 8, 9, 11];
      const rateOptions = [1.00, 1.035, 1.07, 1.105, 1.14];
      const gateOptions = [0.58, 0.68, 0.78, 0.88];
      const stepMsOptions = [126, 138, 150, 164];
      const strideOptions = [5, 7, 11, 13];
      let profile = null;
      for (let attempt = 0; attempt < 12; attempt += 1) {
        const steps = stepsOptions[randomPoolIndex(stepsOptions.length)];
        const pulses = Math.max(3, Math.min(steps - 2, 3 + randomPoolIndex(4)));
        const baseRate = rateOptions[randomPoolIndex(rateOptions.length)];
        const gateScale = gateOptions[randomPoolIndex(gateOptions.length)];
        const stepMs = stepMsOptions[randomPoolIndex(stepMsOptions.length)];
        const rotation = randomPoolIndex(steps);
        const ratchetMode = 1 + randomPoolIndex(2);
        const ratchetModulo = 4 + randomPoolIndex(3);
        const ratchetDelay = 52 + randomPoolIndex(4) * 8;
        const sampleOffset = randomPoolIndex(CRT_GLITCH_AUDIO_SOURCES.length);
        const sampleStride = strideOptions[randomPoolIndex(strideOptions.length)];
        const volumeScale = 0.9 + randomPoolIndex(5) * 0.04;
        const visualScale = 0.9 + randomPoolIndex(5) * 0.04;
        const signature = [
          steps,
          pulses,
          rotation,
          stepMs,
          baseRate.toFixed(3),
          gateScale.toFixed(2),
          ratchetMode,
          ratchetModulo,
          sampleOffset,
          sampleStride,
        ].join('-');
        profile = {
          steps,
          pulses,
          rotation,
          stepMs,
          baseRate,
          gateScale,
          ratchetMode,
          ratchetModulo,
          ratchetDelay,
          sampleOffset,
          sampleStride,
          volumeScale,
          visualScale,
          signature,
        };
        if (signature !== previousSignature) break;
      }
      return profile;
    };
    let audioLoopIndex = 0;
    let audioLoopProfile = makeAudioLoopProfile();
    let audioSampleCursor = 0;
    const publishAudioLoopProfile = () => {
      shell.dataset.audioLoop = String(audioLoopIndex);
      shell.dataset.audioLoopProfile = audioLoopProfile.signature;
    };
    const advanceAudioLoopProfile = (nextIndex = audioLoopIndex + 1) => {
      audioLoopIndex = Math.max(0, Number(nextIndex) || 0);
      audioLoopProfile = makeAudioLoopProfile(audioLoopProfile.signature);
      audioSampleCursor = 0;
      publishAudioLoopProfile();
    };
    const selectEvolvingSample = (pool, salt = 0) => {
      const authoredCandidates = Array.isArray(pool) && pool.length
        ? pool
        : CRT_GLITCH_AUDIO_SOURCES.map((_, index) => index);
      // Most hits draw from the full 64-sample palette; every third hit returns
      // to its authored section family so DESIGN / MAKE / BELIEVE retain a
      // subtle fingerprint without repeating the same narrow sequence.
      const fullPalette = CRT_GLITCH_AUDIO_SOURCES.map((_, index) => index);
      const cursor = audioSampleCursor;
      audioSampleCursor += 1;
      const useFullPalette = authoredCandidates.length < fullPalette.length
        && (cursor + audioLoopIndex + Math.max(0, Number(salt) || 0)) % 3 !== 0;
      const candidates = useFullPalette ? fullPalette : authoredCandidates;
      const index = (
        audioLoopProfile.sampleOffset
        + cursor * audioLoopProfile.sampleStride
        + Math.max(0, Number(salt) || 0) * 3
      ) % candidates.length;
      return candidates[index];
    };
    publishAudioLoopProfile();
    let lastOvertureBeat = 'intro';
    const reelAudioPrepareTimer = window.setTimeout(() => {
      const engine = window.__resumeStrudelAudioEngine
        || window.__ensureResumeStrudelAudioEngine?.();
      engine?.prepare?.().catch?.(() => {});
    }, 300);
    const filmReelIndex = Math.max(0, CRT_CHANNELS.findIndex((channel) => channel.id === 'filmreel'));
    const handOfGodIndex = Math.max(0, CRT_CHANNELS.findIndex((channel) => channel.id === 'handofgod'));
    const clearParkedIdle = () => {
      window.clearTimeout(parkedIdleTimer);
      window.clearTimeout(parkedVisualTimer);
      parkedRatchetTimers.forEach((timer) => window.clearTimeout(timer));
      parkedRatchetTimers.clear();
      shell.classList.remove('has-parked-glitch');
      delete shell.dataset.parkedIdleActive;
      delete shell.dataset.parkedVariant;
    };
    const clearDesignStory = ({ reset = true } = {}) => {
      window.clearTimeout(designStoryTimer);
      designStoryTimer = 0;
      designStoryActive = false;
      if (reset) {
        designStoryIndex = 0;
        designStoryBeat = null;
        designStoryDeadline = 0;
        designStoryRemainingMs = 0;
      }
    };
    const clearMakeStory = ({ reset = true } = {}) => {
      window.clearTimeout(makeStoryTimer);
      makeStoryTimer = 0;
      makeStoryInteractionTimers.forEach((timer) => window.clearTimeout(timer));
      makeStoryInteractionTimers.clear();
      window.dispatchEvent(new CustomEvent('resume-mac-story-type', {
        detail: { action: 'clear', source: 'make-story-clear' },
      }));
      makeStoryActive = false;
      delete shell.dataset.makeStoryAwaitingDialogue;
      if (reset) {
        delete shell.dataset.makeKeyboardPhrase;
        delete shell.dataset.makeKeyboardPhraseState;
        makeStoryIndex = 0;
        makeStoryBeat = null;
        makeStoryDeadline = 0;
        makeStoryRemainingMs = 0;
      }
    };
    const clearBelieveStory = ({ reset = true } = {}) => {
      window.clearTimeout(believeStoryTimer);
      believeStoryTimer = 0;
      believeStoryActive = false;
      if (reset) {
        believeStoryIndex = 0;
        believeStoryBeat = null;
        believeStoryDeadline = 0;
        believeStoryRemainingMs = 0;
      }
    };
    const restoreCycPresentation = (phase = '') => {
      const normalizedPhase = ['design', 'hyperspace', 'make', 'believe', 'reset']
        .includes(phase)
        ? phase
        : '';
      const frameIndex = normalizedPhase === 'design'
        ? Number(shell.dataset.designStoryFrame)
        : normalizedPhase === 'make'
          ? Number(shell.dataset.makeStoryFrame)
          : normalizedPhase === 'believe'
            ? Number(shell.dataset.believeStoryFrame)
            : 0;
      window.dispatchEvent(new CustomEvent('resume-crt-foreground-restore', {
        detail: {
          phase: normalizedPhase,
          frameIndex: Number.isFinite(frameIndex) ? frameIndex : 0,
          // Holding at intermission does not mean the calibration card is
          // still live. Once the 1 kHz tone completes, foregrounding must
          // restore the blue/default wall instead of resurrecting the bars.
          resolve: shell.dataset.overtureResolve === 'true'
            && shell.dataset.overtureResolveCard === 'bars',
          codeStable: normalizedPhase === 'make',
          codeVariant: shell.dataset.makeStoryVariant || '',
          codeCut: shell.dataset.makeStoryCut || '',
          codeCrash: shell.dataset.makeStoryCrash || '',
          codeSequence: Number(shell.dataset.makeStoryStep) || 0,
          designSequence: Number(shell.dataset.designStoryStep) || 0,
          source: 'foreground-authoritative-restore',
        },
      }));
    };
    const clearOpeningInvitation = () => {
      openingVocalTimers.forEach((timer) => window.clearTimeout(timer));
      openingVocalTimers.clear();
      if (openingInvitationResolve) openingInvitationResolve(false);
      openingInvitationResolve = null;
      window.dispatchEvent(new CustomEvent('resume-opening-invitation-step', {
        detail: { index: -1, text: '', active: false },
      }));
      delete shell.dataset.openingInvitation;
      delete shell.dataset.openingInvitationStep;
    };
    const clearPhaseVocals = () => {
      phaseVocalTimers.forEach((timer) => window.clearTimeout(timer));
      phaseVocalTimers.clear();
    };
    const stopVisitorNameVoice = () => {
      const settle = activeNameUtteranceResolve;
      activeNameUtteranceResolve = null;
      if (activeNameUtterance && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      activeNameUtterance = null;
      settle?.(false);
      delete shell.dataset.visitorNameVoice;
      delete shell.dataset.systemPhraseVoice;
    };
    const speakVisitorName = (rawName, { repeat = 1 } = {}) => {
      const name = String(rawName || '').trim().slice(0, 24);
      if (!name || !window.speechSynthesis || typeof SpeechSynthesisUtterance === 'undefined') {
        return Promise.resolve(false);
      }
      stopVisitorNameVoice();
      const synth = window.speechSynthesis;
      const chooseVoice = () => {
        const voices = synth.getVoices?.() || [];
        const preferred = [
          'Samantha',
          'Ava',
          'Serena',
          'Victoria',
          'Karen',
          'Moira',
          'Tessa',
          'Zira',
        ];
        return preferred
          .map((candidate) => voices.find((voice) => voice.name.includes(candidate)))
          .find(Boolean)
          || voices.find((voice) => /^en[-_]/i.test(voice.lang) && /female|woman/i.test(voice.name))
          || voices.find((voice) => /^en[-_]/i.test(voice.lang))
          || null;
      };
      const spokenText = Array.from({ length: Math.max(1, Math.min(2, repeat)) }, () => name)
        .join('. ');
      return new Promise((resolve) => {
        const utterance = new SpeechSynthesisUtterance(spokenText);
        let timer = 0;
        activeNameUtterance = utterance;
        activeNameUtteranceResolve = resolve;
        utterance.voice = chooseVoice();
        utterance.lang = utterance.voice?.lang || 'en-US';
        utterance.rate = 0.82;
        utterance.pitch = 0.92;
        utterance.volume = 0.92;
        shell.dataset.visitorNameVoice = 'speaking';
        const finish = (result) => {
          if (activeNameUtterance !== utterance) return;
          window.clearTimeout(timer);
          phaseVocalTimers.delete(timer);
          activeNameUtterance = null;
          activeNameUtteranceResolve = null;
          shell.dataset.visitorNameVoice = result ? 'complete' : 'blocked';
          resolve(result);
        };
        utterance.onend = () => finish(true);
        utterance.onerror = () => finish(false);
        synth.speak(utterance);
        timer = window.setTimeout(() => {
          phaseVocalTimers.delete(timer);
          finish(false);
        }, 1800);
        phaseVocalTimers.add(timer);
      });
    };
    const speakSystemPhrase = (rawText) => {
      const text = String(rawText || '').trim().slice(0, 80);
      if (!text || !window.speechSynthesis || typeof SpeechSynthesisUtterance === 'undefined') {
        return false;
      }
      stopVisitorNameVoice();
      const synth = window.speechSynthesis;
      const voices = synth.getVoices?.() || [];
      const preferred = ['Samantha', 'Ava', 'Serena', 'Victoria', 'Karen', 'Moira', 'Tessa', 'Zira'];
      const voice = preferred
        .map((candidate) => voices.find((item) => item.name.includes(candidate)))
        .find(Boolean)
        || voices.find((item) => /^en[-_]/i.test(item.lang) && /female|woman/i.test(item.name))
        || voices.find((item) => /^en[-_]/i.test(item.lang))
        || null;
      const utterance = new SpeechSynthesisUtterance(text);
      activeNameUtterance = utterance;
      utterance.voice = voice;
      utterance.lang = voice?.lang || 'en-US';
      utterance.rate = 0.88;
      utterance.pitch = 0.94;
      utterance.volume = 0.96;
      shell.dataset.systemPhraseVoice = text;
      const finish = () => {
        if (activeNameUtterance !== utterance) return;
        activeNameUtterance = null;
        delete shell.dataset.systemPhraseVoice;
      };
      utterance.onend = finish;
      utterance.onerror = finish;
      synth.speak(utterance);
      return true;
    };
    const fireSynchronizedGlitch = (eventName, detail) => {
      if (!pageActive || !isResumeForeground()) return false;
      if ((reelStarted || locked) && !detail?.allowDuringChannel) return false;
      const phase = ['design', 'hyperspace', 'make', 'believe', 'reset'].includes(detail?.phase)
        ? detail.phase
        : crtPhaseForBeat(detail?.beat);
      const voiceRole = detail?.voiceRole || crtVoiceRoleForEvent(
          detail?.beat,
          detail?.kind,
          Number(detail?.sequence) || 0,
        );
      const requestedSampleIndex = detail?.kind === 'startup' && CRT_RESOLVE_GLITCH_INDEX >= 0
        ? CRT_RESOLVE_GLITCH_INDEX
        : Math.max(
        0,
        Math.min(CRT_GLITCH_AUDIO_SOURCES.length - 1, Number(detail?.sampleIndex) || 0),
      );
      let sampleIndex = requestedSampleIndex;
      if (recentGlitchSamples.includes(sampleIndex)) {
        const sequence = Math.max(0, Number(detail?.sequence) || 0);
        for (let step = 1; step < CRT_GLITCH_AUDIO_SOURCES.length; step += 1) {
          const candidate = (requestedSampleIndex + sequence + step * 5)
            % CRT_GLITCH_AUDIO_SOURCES.length;
          if (!recentGlitchSamples.includes(candidate)) {
            sampleIndex = candidate;
            break;
          }
        }
      }
      recentGlitchSamples.push(sampleIndex);
      while (recentGlitchSamples.length > 4) recentGlitchSamples.shift();
      const roleDurationMs = {
        spark: detail?.kind === 'ratchet' ? 96 : 150,
        chop: detail?.kind === 'ratchet' ? 108 : 230,
        pull: phase === 'believe' ? 460 : 390,
        impact: 210,
        human: 480,
      }[voiceRole] || 240;
      const requestedDurationMs = Number(detail?.durationMs);
      const durationMs = detail?.kind === 'startup'
        ? 720
        : Number.isFinite(requestedDurationMs) && requestedDurationMs > 0
          ? Math.max(90, Math.min(900, requestedDurationMs))
          : roleDurationMs;
      const requestedVisualDurationMs = Number(detail?.visualDurationMs);
      const visualDurationMs = Number.isFinite(requestedVisualDurationMs)
        && requestedVisualDurationMs > 0
        ? Math.max(24, Math.min(900, requestedVisualDurationMs))
        : durationMs;
      const baseGlitchStrength = detail?.kind === 'startup'
        ? 0.22
        : detail?.kind === 'text'
          ? 1
          : detail?.kind === 'ratchet'
            ? 0.82
            : 0.68;
      const glitchStrength = detail?.kind === 'startup'
        ? baseGlitchStrength
        : Math.max(0.5, Math.min(1.08, baseGlitchStrength * audioLoopProfile.visualScale));
      const sequence = Math.max(0, Number(detail?.sequence) || 0);
      const rateDrift = [-0.012, 0, 0.018, 0.032][
        (sequence + detail?.beat?.length + audioLoopIndex) % 4
      ];
      const phaseRateOffset = phase === 'design' ? 0.07 : phase === 'make' ? -0.045 : 0;
      const playbackRate = detail?.kind === 'startup'
        ? 1
        : Math.max(
          0.88,
          Math.min(1.24, audioLoopProfile.baseRate + phaseRateOffset + rateDrift),
        );
      const volumeScale = detail?.kind === 'startup'
        ? 1
        : Math.max(
          0.72,
          Math.min(
            1.12,
            audioLoopProfile.volumeScale * (detail?.kind === 'ratchet' ? 0.88 : 1),
          ),
        );
      const requestedAudioDurationMs = Number(detail?.audioDurationMs);
      const audioDurationMs = detail?.kind === 'startup'
        ? durationMs
        : Number.isFinite(requestedAudioDurationMs) && requestedAudioDurationMs > 0
          ? Math.max(72, Math.min(900, requestedAudioDurationMs))
          : Math.max(
            detail?.kind === 'ratchet' ? 72 : 96,
            Math.round(
              roleDurationMs
                * (0.86 + audioLoopProfile.gateScale * 0.22)
                * CRT_GLITCH_AUDIO_TAIL_SCALE,
            ),
          );
      const pan = phase === 'design'
        ? (sequence % 2 ? 0.34 : -0.34)
        : phase === 'make'
          ? (sequence % 3 - 1) * 0.08
          : (sequence % 2 ? 0.24 : -0.24);
      const variant = Math.max(0, Number(detail?.variant) || 0) % 3;
      const eventId = `${detail?.beat || 'text'}:${detail?.kind || 'hit'}:${detail?.sequence ?? 0}:${Math.round(performance.now())}`;
      const startedAt = performance.now();
      const scheduledAt = startedAt + 18;
      const mediaFrameIndex = Number.isInteger(Number(detail?.mediaFrameIndex))
        ? Math.max(0, Number(detail.mediaFrameIndex))
        : crtStoryFrameForEvent(phase, detail?.beat, sequence);
      poolRestIndex = (poolRestIndex + 1) % 6;
      const believeFrameIndex = mediaFrameIndex % Math.max(1, CRT_BELIEVE_GLITCH_MEDIA.length);
      shell.dataset.poolRest = String(mediaFrameIndex);
      shell.dataset.believeRest = String(believeFrameIndex);
      shell.dataset.parkedIdleActive = 'true';
      shell.dataset.parkedVariant = String(variant);
      shell.dataset.glitchSampleIndex = String(sampleIndex);
      shell.dataset.glitchVisualEvent = eventId;
      shell.dataset.glitchVisualStartedAt = startedAt.toFixed(1);
      const syncState = window.__resumeCrtGlitchSync ||= {};
      syncState[eventId] = {
        eventId,
        dispatchedAt: startedAt,
        scheduledAt,
        phase,
        mediaFrameIndex,
      };
      const syncIds = Object.keys(syncState);
      if (syncIds.length > 64) {
        syncIds.slice(0, syncIds.length - 64).forEach((id) => delete syncState[id]);
      }
      const trace = window.__resumeCrtGlitchTrace ||= [];
      trace.push({
        eventId,
        beat: detail?.beat || '',
        kind: detail?.kind || 'hit',
        sampleIndex,
        believeFrameIndex,
        glitchStrength,
        loopIndex: audioLoopIndex,
        profile: audioLoopProfile.signature,
        playbackRate,
        volumeScale,
        audioDurationMs,
        phase,
        voiceRole,
        pan,
        startedAt: Math.round(startedAt),
        scheduledAt: Math.round(scheduledAt),
        mediaFrameIndex,
        codeStable: detail?.codeStable === true,
        codeVariant: String(detail?.codeVariant || ''),
        codeCut: String(detail?.codeCut || ''),
        codeCrash: String(detail?.codeCrash || ''),
        codeLabel: String(detail?.codeLabel || ''),
      });
      if (trace.length > 48) trace.splice(0, trace.length - 48);
      shell.dataset.glitchTrace = JSON.stringify(trace.slice(-24));
      shell.style.setProperty('--crt-parked-duration', `${visualDurationMs}ms`);
      shell.style.setProperty(
        '--crt-glitch-max-separation',
        `${(4 + glitchStrength * 6).toFixed(2)}px`,
      );
      shell.style.setProperty(
        '--crt-glitch-shake',
        `${(0.34 + glitchStrength * 0.62).toFixed(3)}vw`,
      );
      shell.style.setProperty(
        '--crt-glitch-shake-y',
        '0vh',
      );
      shell.style.setProperty('--crt-glitch-contrast', (1 + glitchStrength * 0.24).toFixed(3));
      shell.style.setProperty('--crt-glitch-saturation', (1 + glitchStrength * 0.32).toFixed(3));
      shell.classList.remove('has-parked-glitch');
      // Restart the exact same CSS pulse that the audio event below describes.
      void shell.offsetWidth;
      shell.classList.add('has-parked-glitch');
      window.dispatchEvent(new CustomEvent(eventName, {
        detail: {
          ...detail,
          sampleIndex,
          variant,
          durationMs,
          visualDurationMs,
          audioDurationMs,
          playbackRate,
          volumeScale,
          phase,
          voiceRole,
          pan,
          loopIndex: audioLoopIndex,
          audioProfile: audioLoopProfile.signature,
          eventId,
          startedAt,
          scheduledAt,
          mediaFrameIndex,
        },
      }));
      window.clearTimeout(parkedVisualTimer);
      parkedVisualTimer = window.setTimeout(() => {
        if (shell.dataset.glitchVisualEvent !== eventId) return;
        shell.classList.remove('has-parked-glitch');
        delete shell.dataset.parkedIdleActive;
        delete shell.dataset.parkedVariant;
      }, visualDurationMs);
      return true;
    };
    const startMakeCodeHandoff = () => {
      if (!pageActive || !isResumeForeground() || reelStarted || locked) return;
      window.dispatchEvent(new CustomEvent('resume-intro-bloop-dialogue-start'));
      window.dispatchEvent(new CustomEvent('resume-intro-source-cue', {
        detail: {
          cue: 'bloop-code-handoff',
          offsetMs: (
            CRT_INTRO_HYPERSPACE_DURATION_MS
            + CRT_HYPERSPACE_CODE_GLITCH_MS
          ),
          source: 'make-hyperspace-hard-glitch-exit',
        },
      }));
    };
    const startMakeHardGlitch = (durationMs = CRT_HYPERSPACE_CODE_GLITCH_MS) => {
      if (!pageActive || !isResumeForeground() || reelStarted || locked) return;
      const duration = Math.max(24, Number(durationMs) || CRT_HYPERSPACE_CODE_GLITCH_MS);
      shell.dataset.introThemeStateAtHyperspaceExit = shell.dataset.introBed || 'missing';
      shell.dataset.introHyperspaceExitedAt = String(Math.round(performance.now()));
      shell.dataset.introHardGlitchStartedAt = String(Math.round(performance.now()));
      shell.dataset.introWallProgram = 'hard-glitch';
      shell.dataset.introWallTrace = `${shell.dataset.introWallTrace || 'make-enter>wall-hyperspace'}>hard-glitch`;
      fireSynchronizedGlitch('resume-crt-parked-glitch', {
        beat: 'make-hyperspace-hard-glitch',
        phase: 'hyperspace',
        kind: 'text',
        source: 'hyperspace-code-hard-glitch',
        sampleIndex: 2,
        sequence: 107,
        mediaFrameIndex: 0,
        durationMs: duration,
        visualDurationMs: duration,
        audioDurationMs: duration,
        voiceRole: 'impact',
        variant: 2,
      });
      introWallStageDeadline = performance.now() + duration;
      introHyperspaceTimer = window.setTimeout(() => {
        introHyperspaceTimer = 0;
        introWallStageDeadline = 0;
        startMakeCodeHandoff();
      }, duration);
    };
    const startMakeHyperspace = (durationMs = CRT_INTRO_HYPERSPACE_DURATION_MS) => {
      if (!pageActive || !isResumeForeground() || reelStarted || locked) return;
      const duration = Math.max(24, Number(durationMs) || CRT_INTRO_HYPERSPACE_DURATION_MS);
      window.clearTimeout(introHyperspaceTimer);
      shell.dataset.introWallProgram = 'hyperspace';
      shell.dataset.introSourceCue = 'make-hyperspace';
      if (!shell.dataset.introWallTrace) {
        shell.dataset.introWallTrace = 'make-enter>wall-hyperspace';
      }
      window.dispatchEvent(new CustomEvent('resume-crt-parked-idle', {
        detail: {
          beat: 'make-wall-hyperspace',
          phase: 'hyperspace',
          kind: 'transition',
          source: 'make-command-wall-hyperspace',
          eventId: `make-wall-hyperspace-${Math.round(performance.now())}`,
          sequence: 105,
          durationMs: duration,
          visualDurationMs: duration,
          muteGlitchAudio: true,
        },
      }));
      introWallStageDeadline = performance.now() + duration;
      introHyperspaceTimer = window.setTimeout(() => {
        introHyperspaceTimer = 0;
        introWallStageDeadline = 0;
        startMakeHardGlitch();
      }, duration);
    };
    const onIntroSourceCue = (event) => {
      if (!pageActive || !isResumeForeground() || reelStarted || locked) return;
      const cue = String(event.detail?.cue || '');
      if (cue === 'make-hyperspace') {
        const hyperspaceStartedAt = performance.now();
        shell.dataset.introThemeStateAtHyperspace = shell.dataset.introBed || 'missing';
        const introCueStartedAt = Number(shell.dataset.introBedStartedAt) || 0;
        if (introCueStartedAt) {
          shell.dataset.introHyperspaceOffsetMs = String(
            Math.round(hyperspaceStartedAt - introCueStartedAt),
          );
        }
        shell.dataset.introMakeDialogueTargetAt = String(
          Math.round(
            hyperspaceStartedAt
              + CRT_INTRO_HYPERSPACE_DURATION_MS
              + CRT_HYPERSPACE_CODE_GLITCH_MS
              + CRT_MAKE_BLOOP_TO_NEVER_MS,
          ),
        );
        shell.dataset.introWallTrace = 'make-enter>wall-hyperspace';
        startMakeHyperspace();
        return;
      }
      if (cue !== 'bloop-code-handoff') return;
      window.clearTimeout(introHyperspaceTimer);
      introHyperspaceTimer = 0;
      introWallStageDeadline = 0;
      shell.dataset.introSourceCue = cue;
      shell.dataset.introCodeHandoffAt = String(Math.round(performance.now()));
      shell.dataset.introWallProgram = 'code';
      shell.dataset.introWallTrace = `${shell.dataset.introWallTrace || 'make-enter'}>source-bloop>wall-code`;
      const introCueStartedAt = Number(shell.dataset.introBedStartedAt) || 0;
      if (introCueStartedAt) {
        shell.dataset.introBloopOffsetMs = String(
          Math.round(performance.now() - introCueStartedAt),
        );
      }
      shell.dataset.sourceCodeHandoff = 'true';
      window.clearTimeout(introCodeHandoffTimer);
      introCodeHandoffDeadline = performance.now() + 1245;
      introCodeHandoffTimer = window.setTimeout(() => {
        introCodeHandoffTimer = 0;
        introCodeHandoffDeadline = 0;
        delete shell.dataset.sourceCodeHandoff;
        if (shell.dataset.introWallProgram === 'code') {
          delete shell.dataset.introWallProgram;
        }
      }, 1245);
      // The separate untouched source clip supplies the authored blooper and
      // dialogue. Paint code on that same edge without another glitch sample.
      window.dispatchEvent(new CustomEvent('resume-crt-parked-idle', {
        detail: {
          beat: 'make-source-bloop',
          phase: 'make',
          kind: 'impact',
          source: 'mando-bloop-code-handoff',
          eventId: `mando-bloop-code-${Math.round(performance.now())}`,
          sequence: 106,
          mediaFrameIndex: 0,
          durationMs: 1245,
          visualDurationMs: 1245,
          muteGlitchAudio: true,
        },
      }));
    };
    const playOpeningInvitation = (launchSequence) => {
      clearOpeningInvitation();
      shell.dataset.openingInvitation = 'playing';
      return new Promise((resolve) => {
        openingInvitationResolve = resolve;
        CRT_OPENING_VOCAL_STEPS.forEach((step, stepIndex) => {
          const timer = window.setTimeout(() => {
            openingVocalTimers.delete(timer);
            if (launchSequence !== companionStartSequence
              || !companionStartRequested
              || !pageActive
              || !isResumeForeground()) return;
            shell.dataset.openingInvitationStep = String(stepIndex);
            window.dispatchEvent(new CustomEvent('resume-opening-invitation-step', {
              detail: {
                index: stepIndex,
                text: step.display || '',
                kind: 'invitation',
                gateMs: step.vocalGateMs,
                emphasis: step.visualEmphasis,
              },
            }));
            fireSynchronizedGlitch('resume-crt-parked-idle', {
              beat: 'opening-invitation',
              phase: 'reset',
              kind: stepIndex === 0 ? 'text' : 'ratchet',
              source: 'opening-vocal-callback-cut',
              sequence: stepIndex,
              sampleIndex: selectEvolvingSample(null, 91 + stepIndex * 7),
              durationMs: step.vocalGateMs,
              visualDurationMs: stepIndex === 0 ? 54 : 42,
              audioDurationMs: Math.min(190, Math.max(92, step.vocalGateMs * 0.24)),
              vocalId: step.vocalId,
              vocalGain: step.vocalGain,
              vocalRate: step.vocalRate,
              vocalPan: step.vocalPan,
              vocalGateMs: step.vocalGateMs,
            });
          }, step.at);
          openingVocalTimers.add(timer);
        });
        const introBedTimer = window.setTimeout(() => {
          openingVocalTimers.delete(introBedTimer);
          if (launchSequence !== companionStartSequence
            || !companionStartRequested
            || !pageActive
            || !isResumeForeground()) return;
          window.dispatchEvent(new CustomEvent('resume-intro-bed-start'));
        }, CRT_INTRO_CUE_AT_MS);
        openingVocalTimers.add(introBedTimer);
        const completionTimer = window.setTimeout(() => {
          openingVocalTimers.delete(completionTimer);
          if (openingInvitationResolve !== resolve) return;
          openingInvitationResolve = null;
          shell.dataset.openingInvitation = 'complete';
          window.dispatchEvent(new CustomEvent('resume-opening-invitation-step', {
            detail: { index: CRT_OPENING_VOCAL_STEPS.length, text: '', active: false },
          }));
          shell.dataset.openingQuestionGlitch = 'fired';
          // Punctuate the question, but leave the continuous trailer cue alive
          // underneath it; its original dialogue is still back-timed to MAKE.
          fireSynchronizedGlitch('resume-crt-parked-glitch', {
            beat: 'opening-question-complete',
            phase: 'reset',
            kind: 'impact',
            source: 'opening-question-terminal-glitch',
            sequence: 97,
            sampleIndex: selectEvolvingSample(null, 197),
            durationMs: 180,
            audioDurationMs: 180,
            visualDurationMs: 46,
            volumeScale: 0.92,
          });
          resolve(true);
        }, CRT_OPENING_VOCAL_DURATION);
        openingVocalTimers.add(completionTimer);
      });
    };
    const scheduleDirectIntroBed = (launchSequence) => {
      // Preserve the authored theme-to-typing relationship from the longer
      // prologue: the bed used to begin 420ms after the question completed,
      // while the machine prepared and the floppy entered.
      const delay = Math.max(0, CRT_INTRO_CUE_AT_MS - CRT_OPENING_VOCAL_DURATION);
      const timer = window.setTimeout(() => {
        openingVocalTimers.delete(timer);
        if (launchSequence !== companionStartSequence
          || !companionStartRequested
          || !pageActive
          || !isResumeForeground()) return;
        window.dispatchEvent(new CustomEvent('resume-intro-bed-start'));
      }, delay);
      openingVocalTimers.add(timer);
    };
    const onChannelGlitch = (event) => {
      if (!pageActive || !isResumeForeground()) return;
      const detail = event.detail || {};
      const sequence = Math.max(0, Number(detail.serial) || 0);
      const from = String(detail.from || 'channel');
      const to = String(detail.to || 'channel');
      const sampleIndex = selectEvolvingSample(
        null,
        sequence + from.length * 3 + to.length * 5,
      );
      const durationMs = Math.max(180, Number(detail.durationMs) || 340);
      shell.dataset.channelGlitchActive = 'true';
      shell.dataset.channelGlitch = `${from}:${to}`;
      shell.dataset.channelGlitchSerial = String(sequence);
      shell.dataset.channelGlitchSample = String(sampleIndex);
      shell.dataset.channelGlitchStartedAt = performance.now().toFixed(1);
      window.clearTimeout(channelGlitchTimer);
      const fired = fireSynchronizedGlitch('resume-crt-parked-glitch', {
        beat: 'make-channel-switch',
        kind: 'text',
        source: 'channel-transition',
        from,
        to,
        sequence,
        sampleIndex,
        variant: sampleIndex % 3,
        voiceRole: 'impact',
        durationMs,
        audioDurationMs: Number(detail.audioDurationMs) || 320,
        allowDuringChannel: true,
      });
      shell.dataset.channelGlitchFired = fired ? 'true' : 'false';
      channelGlitchTimer = window.setTimeout(() => {
        delete shell.dataset.channelGlitchActive;
      }, durationMs);
    };
    const euclideanPattern = (steps, pulses, rotation = 0) => {
      const safeSteps = Math.max(1, Math.round(steps));
      const safePulses = Math.max(0, Math.min(safeSteps, Math.round(pulses)));
      const base = Array.from(
        { length: safeSteps },
        (_, index) => ((index * safePulses) % safeSteps) < safePulses,
      );
      const shift = ((Math.round(rotation) % safeSteps) + safeSteps) % safeSteps;
      return base.map((_, index) => base[(index - shift + safeSteps) % safeSteps]);
    };
    const scheduleParkedIdle = (beat) => {
      clearParkedIdle();
      if (!Array.isArray(beat?.idleSamples) || !beat.idleSamples.length) return;
      const visit = (parkedVisitCounts.get(beat.label) || 0) + 1;
      parkedVisitCounts.set(beat.label, visit);
      parkedIdleSequence = 0;
      const profile = { ...audioLoopProfile };
      const phase = crtPhaseForBeat(beat.label);
      // DESIGN has a deliberately authored progression from observed bull to
      // abstract pose skeleton. Running the generic idle grammar in parallel
      // would overwrite that ordered visual narrative.
      if (phase === 'design'
        || phase === 'believe'
        || designStoryActive
        || believeStoryActive) return;
      const phaseGrammar = phase === 'design'
        ? {
            steps: 8,
            pulses: 2 + (visit % 2),
            stepMs: 205 + (audioLoopIndex % 2) * 14,
            ratchetMode: 0,
          }
        : phase === 'make'
          ? {
              steps: 8 + ((visit + audioLoopIndex) % 2),
              pulses: 4 + (visit % 2),
              stepMs: 132 + (audioLoopIndex % 3) * 7,
              ratchetMode: 1 + ((visit + audioLoopIndex) % 2),
            }
          : {
              steps: 7 + ((visit + audioLoopIndex) % 2),
              pulses: 3,
              stepMs: 178 + (audioLoopIndex % 3) * 11,
              ratchetMode: 0,
            };
      const steps = phaseGrammar.steps;
      const pulses = phaseGrammar.pulses;
      const pattern = euclideanPattern(
        steps,
        pulses,
        profile.rotation + visit + beat.label.length,
      );
      const stepMs = phaseGrammar.stepMs;
      let step = 0;
      let pulse = 0;
      const fireHit = (kind = 'idle', ratchetIndex = 0) => {
        if (!pageActive
          || !isResumeForeground()
          || shell.dataset.overtureBeat !== beat.label
          || reelStarted
          || locked) return;
        const variant = (visit + parkedIdleSequence) % 3;
        const sampleIndex = selectEvolvingSample(
          beat.idleSamples,
          visit + parkedIdleSequence + ratchetIndex * 2,
        );
        shell.dataset.parkedIdle = `${beat.label}:${kind}:${variant}:${parkedIdleSequence}`;
        fireSynchronizedGlitch('resume-crt-parked-idle', {
          beat: beat.label,
          kind,
          variant,
          sequence: parkedIdleSequence,
          sampleIndex,
        });
        parkedIdleSequence += 1;
      };
      const scheduleRatchet = (delay, ratchetIndex) => {
        const timer = window.setTimeout(() => {
          parkedRatchetTimers.delete(timer);
          fireHit('ratchet', ratchetIndex);
        }, delay);
        parkedRatchetTimers.add(timer);
      };
      const tick = () => {
        if (!pageActive
          || !isResumeForeground()
          || shell.dataset.overtureBeat !== beat.label
          || reelStarted
          || locked) return;
        if (pattern[step]) {
          fireHit('idle');
          const ratchetSlot = (
            pulse
            + visit
            + beat.label.length
            + profile.rotation
          ) % profile.ratchetModulo;
          if (phaseGrammar.ratchetMode > 0
            && (ratchetSlot === 1 || ratchetSlot === profile.ratchetModulo - 1)) {
            scheduleRatchet(profile.ratchetDelay, 1);
          }
          if (phaseGrammar.ratchetMode > 1
            && ratchetSlot === profile.ratchetModulo - 1) {
            scheduleRatchet(profile.ratchetDelay * 2, 2);
          }
          pulse += 1;
        }
        step = (step + 1) % steps;
        parkedIdleTimer = window.setTimeout(tick, stepMs);
      };
      parkedIdleTimer = window.setTimeout(
        tick,
        Math.max(84, profile.stepMs * 0.72 + (visit % 3) * 11),
      );
    };
    const scheduleDesignStory = (beat, { resume = false } = {}) => {
      clearParkedIdle();
      clearDesignStory({ reset: !resume });
      if (!resume || designStoryBeat !== beat) {
        designStoryIndex = 0;
        designStoryBeat = beat;
      }
      designStoryActive = true;
      const fireStep = () => {
        if (!pageActive
          || !isResumeForeground()
          || crtPhaseForBeat(shell.dataset.overtureBeat) !== 'design'
          || reelStarted
          || locked
          || designStoryIndex >= CRT_DESIGN_STORY_STEPS.length) {
          designStoryActive = false;
          designStoryTimer = 0;
          return;
        }
        const stepIndex = designStoryIndex;
        const step = CRT_DESIGN_STORY_STEPS[stepIndex];
        shell.dataset.designStoryStep = String(stepIndex);
        shell.dataset.designStoryFrame = String(step.frame);
        shell.dataset.designStoryLabel = step.label;
        const sampleIndex = selectEvolvingSample(
          beat.idleSamples,
          stepIndex + step.frame * 3,
        );
        fireSynchronizedGlitch('resume-crt-parked-idle', {
          beat: beat.label,
          phase: 'design',
          kind: stepIndex === 0 ? 'text' : 'idle',
          source: 'authored-design-story',
          variant: stepIndex % 3,
          sequence: stepIndex,
          sampleIndex,
          mediaFrameIndex: step.frame,
          durationMs: step.dwellMs,
          // Chromatic separation is the edit splice, not the bull's resting
          // grade. Audio retains its own longer envelope.
          visualDurationMs: 42,
          audioDurationMs: Math.min(240, Math.max(105, step.dwellMs * 0.55)),
          vocalId: shell.dataset.visitorName ? '' : step.vocalId,
          vocalGain: step.vocalGain,
          vocalRate: step.vocalRate,
          vocalPan: step.vocalPan,
          vocalGateMs: step.dwellMs,
        });
        designStoryIndex += 1;
        if (designStoryIndex < CRT_DESIGN_STORY_STEPS.length) {
          designStoryDeadline = performance.now() + step.dwellMs;
          designStoryTimer = window.setTimeout(fireStep, step.dwellMs);
        } else {
          designStoryActive = false;
          designStoryTimer = 0;
          designStoryDeadline = 0;
          designStoryRemainingMs = 0;
        }
      };
      if (resume && designStoryRemainingMs > 0) {
        const remainingMs = Math.max(24, designStoryRemainingMs);
        designStoryRemainingMs = 0;
        designStoryDeadline = performance.now() + remainingMs;
        restoreCycPresentation('design');
        designStoryTimer = window.setTimeout(fireStep, remainingMs);
        return;
      }
      fireStep();
    };
    const scheduleMakeStory = (beat, { resume = false } = {}) => {
      clearParkedIdle();
      clearMakeStory({ reset: !resume });
      if (!resume || makeStoryBeat !== beat) {
        makeStoryIndex = 0;
        makeStoryBeat = beat;
        window.__resumeMakeCodeCutTrace = [];
      }
      makeStoryActive = true;
      const scheduleMakeInteraction = (callback, delayMs) => {
        const timer = window.setTimeout(() => {
          makeStoryInteractionTimers.delete(timer);
          if (!pageActive
            || !isResumeForeground()
            || crtPhaseForBeat(shell.dataset.overtureBeat) !== 'make'
            || reelStarted
            || locked) return;
          callback();
        }, Math.max(0, Number(delayMs) || 0));
        makeStoryInteractionTimers.add(timer);
      };
      const runMakeCameraBeat = (step) => {
        if (step.clearTypedText) {
          window.dispatchEvent(new CustomEvent('resume-mac-story-type', {
            detail: { action: 'clear', source: step.label },
          }));
        }
        if (!step.camera) return;
        const duration = Math.max(240, Number(step.cameraDurationMs) || 360);
        const easing = String(step.cameraEasing || 'smooth');
        shell.dataset.introCameraBeat = step.label;
        shell.dataset.introCameraPreset = step.camera;
        shell.dataset.introCameraDuration = String(duration);
        shell.dataset.introCameraEasing = easing;
        invokeTvHeroControl(
          '__tvHeroCompanionCamera',
          [
            step.camera,
            {
              duration,
              easing,
              source: 'intro',
              beat: step.label,
            },
          ],
          0,
          () => !reelStarted
            && !locked
            && shell.dataset.makeStoryLabel === step.label,
        );
      };
      const typeMakePhraseOnKeyboard = (step) => {
        const phrase = String(step.typeText || '');
        if (!phrase) return;
        shell.dataset.makeKeyboardPhrase = phrase;
        shell.dataset.makeKeyboardPhraseState = 'typing';
        const intervalMs = Math.max(36, Number(step.typeIntervalMs) || 64);
        const delayMs = Math.max(0, Number(step.typeDelayMs) || 0);
        scheduleMakeInteraction(() => {
          window.dispatchEvent(new CustomEvent('resume-mac-story-type', {
            detail: {
              action: 'begin',
              phrase,
              source: step.label,
            },
          }));
        }, Math.max(0, delayMs - 24));
        [...phrase].forEach((char, index) => {
          scheduleMakeInteraction(() => {
            window.dispatchEvent(new CustomEvent('resume-mac-story-type', {
              detail: {
                action: 'type',
                char,
                phrase,
                phraseIndex: index,
                source: step.label,
              },
            }));
            window.dispatchEvent(new CustomEvent('resume-mac-screen-character', {
              detail: {
                action: 'type',
                char,
                stage: 1,
                story: 'make-button-struggle',
                phrase,
                phraseIndex: index,
                timestamp: performance.now(),
              },
            }));
            if (index === phrase.length - 1) {
              shell.dataset.makeKeyboardPhraseState = 'complete';
            }
          }, delayMs + index * intervalMs);
        });
      };
      const fireStep = () => {
        if (!pageActive
          || !isResumeForeground()
          || crtPhaseForBeat(shell.dataset.overtureBeat) !== 'make'
          || reelStarted
          || locked
          || makeStoryIndex >= CRT_MAKE_STORY_STEPS.length) {
          makeStoryActive = false;
          makeStoryTimer = 0;
          return;
        }
        const stepIndex = makeStoryIndex;
        const step = CRT_MAKE_STORY_STEPS[stepIndex];
        if (stepIndex === 0 && shell.dataset.introMakeDialogueTargetAt) {
          const targetAt = Number(shell.dataset.introMakeDialogueTargetAt) || 0;
          shell.dataset.introBedMakeBoundaryDeltaMs = String(
            Math.round(performance.now() - targetAt),
          );
          shell.dataset.introWallTrace = `${shell.dataset.introWallTrace || 'make-enter'}>dialogue-never-touch`;
        }
        shell.dataset.makeStoryStep = String(stepIndex);
        shell.dataset.makeStoryFrame = String(step.frame);
        shell.dataset.makeStoryLabel = step.label;
        shell.dataset.makeStoryText = step.display;
        shell.dataset.makeStoryVariant = step.codeVariant;
        shell.dataset.makeStoryCut = step.codeCut;
        if (step.crashFrame) shell.dataset.makeStoryCrash = step.crashFrame;
        else delete shell.dataset.makeStoryCrash;
        const makeCodeCutTrace = window.__resumeMakeCodeCutTrace ||= [];
        makeCodeCutTrace.push({
          step: stepIndex,
          label: step.label,
          frame: step.frame,
          variant: step.codeVariant,
          cut: step.codeCut,
          crash: step.crashFrame || '',
          startedAt: Math.round(performance.now()),
        });
        if (makeCodeCutTrace.length > CRT_MAKE_STORY_STEPS.length * 2) {
          makeCodeCutTrace.splice(
            0,
            makeCodeCutTrace.length - CRT_MAKE_STORY_STEPS.length * 2,
          );
        }
        shell.dataset.makeCodeCutTrace = JSON.stringify(
          makeCodeCutTrace.slice(-CRT_MAKE_STORY_STEPS.length),
        );
        if (step.systemVoiceText) {
          speakSystemPhrase(step.systemVoiceText);
        } else if (activeNameUtterance && shell.dataset.systemPhraseVoice) {
          stopVisitorNameVoice();
        }
        runMakeCameraBeat(step);
        typeMakePhraseOnKeyboard(step);
        if (step.startSinging) {
          window.dispatchEvent(new CustomEvent('resume-believe-singing-motif'));
        }
        const sampleIndex = selectEvolvingSample(
          beat.idleSamples,
          stepIndex + step.frame * 4,
        );
        fireSynchronizedGlitch('resume-crt-parked-idle', {
          beat: beat.label,
          phase: 'make',
          kind: stepIndex === 0 || step.systemVoiceText ? 'text' : 'idle',
          source: 'authored-make-story',
          variant: stepIndex % 3,
          sequence: stepIndex,
          sampleIndex,
          mediaFrameIndex: step.frame,
          codeStable: true,
          codeVariant: step.codeVariant,
          codeCut: step.codeCut,
          codeCrash: step.crashFrame,
          codeCrashHoldMs: step.errorHoldMs,
          codeLabel: step.label,
          durationMs: step.dwellMs,
          vocalId: step.vocalId,
          vocalGain: step.vocalGain,
          vocalRate: step.vocalRate,
          vocalPan: step.vocalPan,
          vocalGateMs: step.dwellMs,
          muteGlitchAudio: step.continuousCue === true,
          visualDurationMs: step.visualDurationMs,
          audioDurationMs: step.systemVoiceText
            ? 90
            : Math.min(270, Math.max(115, step.dwellMs * 0.55)),
        });
        makeStoryIndex += 1;
        if (makeStoryIndex < CRT_MAKE_STORY_STEPS.length) {
          makeStoryDeadline = performance.now() + step.dwellMs;
          makeStoryTimer = window.setTimeout(fireStep, step.dwellMs);
        } else {
          makeStoryActive = false;
          makeStoryTimer = 0;
          makeStoryDeadline = 0;
          makeStoryRemainingMs = 0;
        }
      };
      if (resume && makeStoryRemainingMs > 0) {
        const remainingMs = Math.max(24, makeStoryRemainingMs);
        makeStoryRemainingMs = 0;
        makeStoryDeadline = performance.now() + remainingMs;
        if (makeStoryIndex > 0) restoreCycPresentation('make');
        makeStoryTimer = window.setTimeout(() => {
          delete shell.dataset.makeStoryAwaitingDialogue;
          fireStep();
        }, remainingMs);
        return;
      }
      if (!resume && makeStoryIndex === 0 && shell.dataset.introMakeDialogueTargetAt) {
        const targetAt = Number(shell.dataset.introMakeDialogueTargetAt) || 0;
        const waitMs = Math.max(
          0,
          targetAt - performance.now(),
        );
        if (waitMs > 16) {
          shell.dataset.makeStoryAwaitingDialogue = 'true';
          makeStoryDeadline = performance.now() + waitMs;
          makeStoryTimer = window.setTimeout(() => {
            delete shell.dataset.makeStoryAwaitingDialogue;
            fireStep();
          }, waitMs);
          return;
        }
      }
      delete shell.dataset.makeStoryAwaitingDialogue;
      fireStep();
    };
    const scheduleBelieveStory = (beat, { resume = false } = {}) => {
      clearParkedIdle();
      clearBelieveStory({ reset: !resume });
      if (!resume || believeStoryBeat !== beat) {
        believeStoryIndex = 0;
        believeStoryBeat = beat;
      }
      believeStoryActive = true;
      const fireStep = () => {
        if (!pageActive
          || !isResumeForeground()
          || crtPhaseForBeat(shell.dataset.overtureBeat) !== 'believe'
          || reelStarted
          || locked
          || believeStoryIndex >= CRT_BELIEVE_STORY_STEPS.length) {
          believeStoryActive = false;
          believeStoryTimer = 0;
          return;
        }
        const stepIndex = believeStoryIndex;
        const step = CRT_BELIEVE_STORY_STEPS[stepIndex];
        shell.dataset.believeStoryStep = String(stepIndex);
        shell.dataset.believeStoryFrame = String(step.frame);
        shell.dataset.believeStoryLabel = step.label;
        shell.dataset.believeStorySide = step.side;
        shell.dataset.believeStoryText = step.display;
        if (step.systemVoiceText) {
          speakSystemPhrase(step.systemVoiceText);
        } else if (activeNameUtterance && shell.dataset.systemPhraseVoice) {
          stopVisitorNameVoice();
        }
        if (step.camera) {
          shell.dataset.introCameraBeat = 'believe-side-snap';
          shell.dataset.introCameraPreset = step.camera;
          shell.dataset.introCameraDuration = '260';
          shell.dataset.introCameraEasing = 'snap';
          invokeTvHeroControl(
            '__tvHeroCompanionCamera',
            [
              step.camera,
              {
                duration: 260,
                easing: 'snap',
                source: 'believe-side-snap',
                beat: step.label,
              },
            ],
            0,
            () => believeStoryActive
              && crtPhaseForBeat(shell.dataset.overtureBeat) === 'believe'
              && shell.dataset.believeStoryStep === String(stepIndex),
          );
        }
        const sampleIndex = selectEvolvingSample(
          beat.idleSamples,
          stepIndex + step.frame * 5 + (Number(step.sampleSalt) || 0),
        );
        fireSynchronizedGlitch('resume-crt-parked-idle', {
          beat: beat.label,
          phase: 'believe',
          kind: step.kind || (stepIndex === 0 || step.camera ? 'text' : 'idle'),
          voiceRole: step.voiceRole,
          source: 'authored-believe-story',
          variant: stepIndex % 3,
          sequence: stepIndex,
          sampleIndex,
          mediaFrameIndex: step.frame,
          durationMs: step.dwellMs,
          vocalId: step.vocalId,
          vocalGain: step.vocalGain,
          vocalRate: step.vocalRate,
          vocalPan: step.vocalPan,
          vocalGateMs: step.dwellMs,
          // The clip persists on its LED processor after this short splice.
          // Chromatic separation belongs to the edit, not the held image.
          visualDurationMs: Number(step.visualDurationMs) || 48,
          audioDurationMs: Number(step.audioDurationMs) || (step.systemVoiceText
            ? 90
            : Math.min(260, Math.max(110, step.dwellMs * 0.58))),
        });
        believeStoryIndex += 1;
        if (believeStoryIndex < CRT_BELIEVE_STORY_STEPS.length) {
          believeStoryDeadline = performance.now() + step.dwellMs;
          believeStoryTimer = window.setTimeout(fireStep, step.dwellMs);
        } else {
          believeStoryActive = false;
          believeStoryTimer = 0;
          believeStoryDeadline = 0;
          believeStoryRemainingMs = 0;
        }
      };
      if (resume && believeStoryRemainingMs > 0) {
        const remainingMs = Math.max(24, believeStoryRemainingMs);
        believeStoryRemainingMs = 0;
        believeStoryDeadline = performance.now() + remainingMs;
        restoreCycPresentation('believe');
        believeStoryTimer = window.setTimeout(fireStep, remainingMs);
        return;
      }
      fireStep();
    };
    const programBeatForStage = (stage) => {
      const labels = ['design-command', 'make-command', 'believe-command'];
      return CRT_OVERTURE_BEATS.find((beat) => beat.label === labels[stage]) || null;
    };
    const onMacProgramCharacter = (event) => {
      if (!pageActive
        || !isResumeForeground()
        || event.detail?.action !== 'enter'
        || reelStarted
        || locked) return;
      const stage = Math.max(0, Math.min(2, Number(event.detail?.stage) || 0));
      if (stage !== activeProgramStage
        || executedProgramStage === stage
        || programLaunchTimer) return;
      const beat = programBeatForStage(stage);
      if (!beat) return;
      const program = ['design', 'make', 'believe'][stage];
      shell.dataset.programLaunchPending = program;
      clearParkedIdle();
      window.clearTimeout(parkedGlitchTimer);
      if (stage === 1 && shell.dataset.introBedStartedAt) {
        const introCueStartedAt = Number(shell.dataset.introBedStartedAt) || 0;
        shell.dataset.introBedMakeEnterOffsetMs = String(
          Math.round(performance.now() - introCueStartedAt),
        );
        window.dispatchEvent(new CustomEvent('resume-intro-source-cue', {
          detail: {
            cue: 'make-hyperspace',
            offsetMs: Math.round(performance.now() - introCueStartedAt),
            source: 'make-enter-boundary',
          },
        }));
      }
      // Give the CRT just enough time to print the process acknowledgment.
      // The program's first stdout frame then drives the synchronized stage hit.
      programLaunchTimer = window.setTimeout(() => {
        programLaunchTimer = 0;
        delete shell.dataset.programLaunchPending;
        if (stage !== activeProgramStage
          || executedProgramStage === stage
          || reelStarted
          || locked) return;
        executedProgramStage = stage;
        shell.dataset.executedProgram = program;
        if (stage === 0) {
          scheduleDesignStory(beat);
        } else if (stage === 1) {
          scheduleMakeStory(beat);
        } else if (stage === 2) {
          scheduleBelieveStory(beat);
        }
      }, 90);
    };
    const invokeTvHeroControl = (name, args = [], attempt = 0, valid = () => true) => {
      if (!valid()) return Promise.resolve(false);
      const control = window[name];
      if (typeof control === 'function') {
        try { return Promise.resolve(control(...args)); } catch (_) { return Promise.resolve(false); }
      }
      // TvHero effects can briefly replace their window bindings during a
      // React update. A threshold transition is a one-shot event, so queue it
      // instead of losing it on that exact frame.
      if (attempt >= 40) return Promise.resolve(false);
      return new Promise((resolve) => {
        window.setTimeout(() => resolve(invokeTvHeroControl(name, args, attempt + 1, valid)), 50);
      });
    };
    const startReelAtLimit = () => {
      if (reelStarted || shell.classList.contains('is-reel-playing')) return false;
      reelStarted = true;
      const transitionToken = ++reelTransitionToken;
      shell.classList.add('is-reel-playing');
      activeChannel = handOfGodIndex;
      channelWithin = 0;
      window.__tvHeroSetChannelDefs?.(CRT_CHANNELS, { active: activeChannel });
      window.__tvHeroPageMode?.(false);
      invokeTvHeroControl(
        '__tvHeroStartHandOfGod',
        [],
        0,
        () => reelStarted && transitionToken === reelTransitionToken,
      );
      emitChannel();
      return true;
    };
    const stopReelAtLimit = (progress = 0) => {
      if (!reelStarted && !shell.classList.contains('is-reel-playing')) return false;
      reelStarted = false;
      const transitionToken = ++reelTransitionToken;
      activeChannel = 0;
      channelWithin = 0;
      window.__tvHeroSetChannelDefs?.(CRT_CHANNELS, { active: activeChannel });
      invokeTvHeroControl(
        '__tvHeroStopReel',
        [{ roll: true, eject: true }],
        0,
        () => !reelStarted && transitionToken === reelTransitionToken,
      ).then((stopped) => {
        // Last-resort visual cleanup if the Mac unmounted while the transition
        // was queued. The normal shared stop removes this after its roll/eject.
        if (stopped === false) shell.classList.remove('is-reel-playing');
      });
      window.__tvHeroPageMode?.(false);
      window.dispatchEvent(new CustomEvent('resume-crt-overture-progress', {
        detail: { progress, floppyProgress: progress },
      }));
      emitChannel();
      return true;
    };
    const requestReelAudio = async () => {
      if (!pageActive || !isResumeForeground()) return false;
      const filmReelChannelSelected = CRT_CHANNELS[activeChannel]?.type === 'video';
      if ((!reelStarted && !filmReelChannelSelected) || reelAudioStarting) return false;
      if (CRT_CHANNELS[activeChannel]?.type === 'interactive') return false;
      const engine = window.__resumeStrudelAudioEngine
        || window.__ensureResumeStrudelAudioEngine?.();
      if (!engine?.setEnabled) return false;
      // A scroll-triggered start may enable the engine while the browser is
      // still waiting for a trusted gesture. A later click/key must resume the
      // same engine instead of treating `enabled` as proof that it is audible.
      if (engine.enabled) {
        return engine.resume ? (await engine.resume()) !== false : true;
      }
      reelAudioStarting = true;
      try {
        return (await engine.setEnabled(true)) !== false;
      } catch (_) {
        return false;
      } finally {
        reelAudioStarting = false;
      }
    };

    const sizeRunway = () => {
      const vh = window.innerHeight || 1;
      enter.style.height = `${Math.round(vh)}px`;
    };
    const emitLock = () => {
      window.dispatchEvent(new CustomEvent('resume-crt-lock-change', {
        detail: { locked },
      }));
    };
    const emitChannel = () => {
      window.dispatchEvent(new CustomEvent('resume-crt-channel-change', {
        detail: { index: activeChannel, channel: CRT_CHANNELS[activeChannel] },
      }));
    };
    const tuneChannel = (index, withStatic = true) => {
      const next = Math.max(0, Math.min(CRT_CHANNELS.length - 1, Number(index) || 0));
      activeChannel = next;
      channelWithin = 0;
      window.__tvHeroSetChannelDefs?.(CRT_CHANNELS, { active: activeChannel });
      window.__tvHeroTune?.(next, withStatic);
      window.__tvHeroChannelWithin?.(0);
      emitChannel();
    };
    const isReelPlaying = () => reelStarted;
    const activeNeedsProjection = () => CRT_CHANNELS[activeChannel]?.type === 'page';
    const ensureReelChannelForPlayback = () => {
      if (!locked || !isReelPlaying()) return false;
      if (CRT_CHANNELS[activeChannel]?.id !== 'boot') return false;
      activeChannel = filmReelIndex;
      channelWithin = 0;
      window.__tvHeroSetChannelDefs?.(CRT_CHANNELS, { active: activeChannel });
      window.__tvHeroPageMode?.(true, { channels: CRT_CHANNELS, active: activeChannel });
      window.__tvHeroTune?.(activeChannel, false);
      window.__tvHeroChannelWithin?.(0);
      window.__tvHeroResumeVideoChannel?.();
      emitChannel();
      return true;
    };

    // Rasterize the page channels into per-channel textures (async, once).
    const project = (force = false) => {
      if (!pageActive || !isResumeForeground()) return;
      if (!locked && !force) return;
      if (projecting || projected) return;
      if (!window.__tvHeroProjectChannels) {
        window.clearTimeout(projectRetry);
        projectRetry = window.setTimeout(() => project(force), 120);
        return;
      }
      projecting = true;
      window.__tvHeroProjectChannels(CRT_CHANNELS, { active: activeChannel }).then((res) => {
        projecting = false;
        if (!locked && !force) return;
        if (res && res.ok) {
          projected = true;
          const info = window.__tvHeroChannelInfo?.();
          if (info?.within) withinRanges = info.within;
          sizeRunway();
          // Projection finishes asynchronously. If it resolves after the
          // overture has committed its intermission frame, tuning the boot
          // channel here would replace the color bars and final hero camera.
          // The phone's eventual channel choice owns the first tune instead.
          if (!companionIntermissionCommitted && !companionIntermissionHeld) {
            tuneChannel(activeChannel, false);
          }
        }
      }).catch(() => { projecting = false; });
    };

    const enterCompanionIntermission = ({
      progress = 0,
      floppyProgress = 1,
      zoomProgress = 0,
    } = {}) => {
      if (!companionStartReceived
        || companionIntermissionCommitted) return false;
      companionIntermissionCommitted = true;
      companionIntermissionHeld = true;
      autoplayReady = false;
      const commit = ++companionIntermissionCommit;
      const committedAt = performance.now();
      loopResolveStartedAt = committedAt;
      loopResolveUntil = Number.POSITIVE_INFINITY;
      window.clearTimeout(programLaunchTimer);
      programLaunchTimer = 0;
      window.clearTimeout(intermissionResolveFallbackTimer);
      intermissionResolveFallbackTimer = 0;
      window.clearTimeout(parkedGlitchTimer);
      parkedGlitchTimer = 0;
      window.clearTimeout(introHyperspaceTimer);
      introHyperspaceTimer = 0;
      window.clearTimeout(introCodeHandoffTimer);
      introCodeHandoffTimer = 0;
      introWallStageDeadline = 0;
      introWallStageRemainingMs = 0;
      introCodeHandoffDeadline = 0;
      introCodeHandoffRemainingMs = 0;
      clearParkedIdle();
      clearDesignStory();
      clearMakeStory();
      clearBelieveStory();
      delete shell.dataset.programLaunchPending;
      delete shell.dataset.parkedGlitch;
      delete shell.dataset.parkedIdle;
      shell.classList.remove('has-parked-glitch');
      delete shell.dataset.sourceCodeHandoff;
      delete shell.dataset.introWallProgram;
      shell.dataset.companionGate = 'channels';
      shell.dataset.overtureBeat = 'intermission';
      shell.dataset.overtureBreather = 'true';
      shell.dataset.overtureResolve = 'true';
      shell.dataset.overtureResolveProgress = '1.000';
      shell.dataset.overtureResolveCard = 'bars';
      shell.dataset.introCameraBeat = 'intermission';
      shell.dataset.introCameraPreset = 'typing';
      shell.dataset.introCameraDuration = '300';
      shell.dataset.introCameraEasing = 'snap';
      shell.dataset.introTransport = 'complete';
      shell.dataset.intermissionCommit = String(commit);
      shell.dataset.intermissionCommittedAt = committedAt.toFixed(1);
      shell.dataset.intermissionStatus = 'committed';
      shell.style.setProperty('--crt-foreshadow-design', '0');
      shell.style.setProperty('--crt-foreshadow-make', '0');
      shell.style.setProperty('--crt-foreshadow-believe', '0');
      shell.style.setProperty('--crt-overture-progress', Number(progress).toFixed(4));
      window.__tvHeroFloppyProgress?.(floppyProgress);
      // The resolve is an authoritative close shot, not merely a dataset
      // annotation. BELIEVE can finish on either side of the Mac, so command
      // the camera here or the last analysis shot can leak into intermission.
      invokeTvHeroControl(
        '__tvHeroCompanionCamera',
        ['typing', {
          duration: 300,
          easing: 'snap',
          source: 'intermission-commit',
          beat: 'intermission',
        }],
        0,
        () => companionIntermissionCommitted && companionIntermissionHeld,
      );
      // One authoritative event paints the LED color bars, CRT resolve card,
      // and starts the persistent calibration tone in the same frame.
      window.dispatchEvent(new CustomEvent('resume-crt-overture-progress', {
        detail: {
          progress,
          floppyProgress,
          zoomProgress,
          beat: 'intermission',
          breather: true,
          resolve: true,
          resolveProgress: 1,
          loopIndex: audioLoopIndex,
          intermissionCommit: commit,
        },
      }));
      // BELIEVE already owns the final close composition. Keep that camera
      // perfectly static through the color-bar handoff.
      advanceAudioLoopProfile();
      fireSynchronizedGlitch('resume-crt-parked-glitch', {
        beat: 'intermission',
        phase: 'reset',
        kind: 'startup',
        progress,
        sequence: commit,
        source: 'someone-needs-me-clean-cut-to-tone',
        muteResolveGlitch: true,
        immediateTone: true,
        toneDelayMs: 0,
      });
      // Audio owns the normal handoff. This fallback also clears the bars if
      // autoplay policy prevents the oscillator from starting at all.
      window.clearTimeout(intermissionResolveFallbackTimer);
      intermissionResolveFallbackTimer = window.setTimeout(() => {
        window.dispatchEvent(new CustomEvent('resume-crt-calibration-tone-complete', {
          detail: {
            source: 'visual-fallback',
            intermissionCommit: commit,
          },
        }));
      }, CRT_CALIBRATION_TONE_HOLD_MS + CRT_CALIBRATION_TONE_FADE_MS + 350);
      // Warm the page channels without allowing the async completion to retune
      // channel zero over this committed frame.
      project(true);
      return true;
    };
    const onCalibrationToneComplete = (event) => {
      if (!companionIntermissionCommitted || !companionIntermissionHeld) return;
      const eventCommit = Number(event.detail?.intermissionCommit) || 0;
      if (eventCommit && eventCommit !== companionIntermissionCommit) return;
      window.clearTimeout(intermissionResolveFallbackTimer);
      intermissionResolveFallbackTimer = 0;
      loopResolveUntil = 0;
      // End the loop on the exact same authoritative path as Stop / reset:
      // initial camera, floppy out, blank Macintosh, dark LED volume, blue
      // tracking-screen environment, and a reusable phone Start control.
      companionStartSequence += 1;
      autoplayReady = false;
      companionStartRequested = false;
      companionStartReceived = false;
      companionInsertComplete = false;
      companionIntermissionHeld = false;
      companionIntermissionCommitted = false;
      resetToStart();
      shell.dataset.companionGate = 'waiting';
      sizeRunway();
      window.dispatchEvent(new CustomEvent('resume-companion-reset-to-start', {
        detail: {
          source: event.detail?.source || 'calibration-tone-complete',
          intermissionCommit: companionIntermissionCommit,
        },
      }));
      window.dispatchEvent(new CustomEvent('resume-companion-stop-intro', {
        detail: {
          source: 'calibration-tone-complete',
          intermissionCommit: companionIntermissionCommit,
          localAlreadyReset: true,
        },
      }));
      window.dispatchEvent(new CustomEvent('resume-mac-ghostwriter-start', {
        detail: {
          source: 'calibration-tone-complete',
          intermissionCommit: companionIntermissionCommit,
        },
      }));
      window.dispatchEvent(new CustomEvent('resume-mac-try-it-prompt', {
        detail: {
          visible: true,
          source: 'calibration-tone-complete',
        },
      }));
    };
    const onBelieveSingingComplete = () => {
      if (!pageActive
        || !isResumeForeground()
        || !companionStartReceived
        || companionIntermissionCommitted
        || reelStarted
        || locked) return;
      shell.dataset.believeTerminalTransition = 'someone-needs-me-clean-cut-to-1khz';
      enterCompanionIntermission({
        progress: 0.965,
        floppyProgress: 1,
        zoomProgress: 0,
      });
    };

    const update = () => {
      raf = 0;
      if (!pageActive || !isResumeForeground()) return;
      // The completed intro is parked independently of scroll position. Keep
      // either its tone/bars or its post-tone blue reset authoritative until
      // the phone chooses a channel.
      if (companionIntermissionCommitted && companionIntermissionHeld) {
        window.__tvHeroFloppyProgress?.(1);
        return;
      }
      const vh = window.innerHeight || 1;
      // Page position never drives the Macintosh. Its screen, floppy, camera,
      // and authored playback can only change through their explicit controls.
      const insertionP = 0;
      const overtureP = autoplayProgress;
      const overtureWrapped = overtureP + 0.5 < lastOvertureProgress;
      lastOvertureProgress = overtureP;
      const programStage = overtureP >= 0.66 ? 2 : overtureP >= 0.42 ? 1 : 0;
      if (programStage !== activeProgramStage) {
        const previousProgramStage = activeProgramStage;
        window.clearTimeout(programLaunchTimer);
        programLaunchTimer = 0;
        clearPhaseVocals();
        delete shell.dataset.programLaunchPending;
        activeProgramStage = programStage;
        executedProgramStage = -1;
        delete shell.dataset.executedProgram;
        clearParkedIdle();
        if (programStage !== 0) clearDesignStory();
        if (programStage !== 1) clearMakeStory();
        if (programStage !== 2) clearBelieveStory();
        // MAKE's last story timer can lose a race with this phase boundary
        // after a long frame. The singing bridge belongs to the boundary—not
        // to an optional timer—so it is impossible to skip and impossible to
        // double-fire.
        if (previousProgramStage === 1 && programStage === 2) {
          shell.dataset.believeSingingCue = 'make-to-believe-boundary';
          window.dispatchEvent(new CustomEvent('resume-believe-singing-motif'));
        }
      }
      // The Macintosh is a complete second section, not a portal. Keep the
      // camera at its authored wide composition and let page scroll continue
      // directly into the visible HELP section.
      const zoomP = 0;
      const zoomProgress = 0;
      const floppyProgress = companionStartReceived && !reelStarted
        ? 1
        : insertionP;
      let activeBeat = CRT_OVERTURE_BEATS[0];
      for (const beat of CRT_OVERTURE_BEATS) {
        if (overtureP >= beat.at - 0.001) activeBeat = beat;
      }
      shell.dataset.overtureBeat = activeBeat.label;
      shell.dataset.overtureMode = 'autoplay';
      const isBreather = activeBeat.kind === 'breather';
      shell.dataset.overtureBreather = isBreather ? 'true' : 'false';
      shell.dataset.insertionProgress = insertionP.toFixed(3);
      shell.dataset.floppyProgress = floppyProgress.toFixed(3);
      if (activeBeat.label !== lastOvertureBeat) {
        const previousOvertureBeat = lastOvertureBeat;
        if (activeBeat.label === 'make-command' && shell.dataset.introBedStartedAt) {
          const introCueStartedAt = Number(shell.dataset.introBedStartedAt) || 0;
          shell.dataset.introBedMakeCommandOffsetMs = String(
            Math.round(performance.now() - introCueStartedAt),
          );
        }
        if (activeBeat.label === 'intro'
          && (previousOvertureBeat === 'breather-loop' || overtureWrapped)
          && enterCompanionIntermission({
            progress: overtureP,
            floppyProgress,
            zoomProgress,
          })) {
          lastOvertureBeat = 'intermission';
          return;
        }
        // The visual typing renderer is frame-quantized. On a fast machine—or
        // after a brief capture/render stall—the overture can cross from a
        // command beat into its response before the single weighted Return
        // frame is ever painted. Treat the authored command→response boundary
        // as the authoritative Return edge so the executable always launches
        // and the LED wall cannot remain half-powered while the cameras move.
        const completedCommandStage = {
          'design-response': 0,
          'make-response': 1,
          'believe-response': 2,
        }[activeBeat.label];
        if (Number.isInteger(completedCommandStage)
          && previousOvertureBeat === ['design-command', 'make-command', 'believe-command'][completedCommandStage]
          && completedCommandStage === activeProgramStage
          && executedProgramStage !== completedCommandStage
          && !programLaunchTimer) {
          window.dispatchEvent(new CustomEvent('resume-mac-screen-character', {
            detail: {
              action: 'enter',
              char: '',
              stage: completedCommandStage,
              synthetic: true,
              source: 'command-response-boundary',
              timestamp: performance.now(),
            },
          }));
        }
        const cameraStep = CRT_INTRO_CAMERA_ROUTE[activeBeat.label];
        if (cameraStep && !reelStarted && !locked) {
          shell.dataset.introCameraBeat = activeBeat.label;
          shell.dataset.introCameraPreset = cameraStep.preset;
          shell.dataset.introCameraDuration = String(cameraStep.duration);
          shell.dataset.introCameraEasing = cameraStep.easing;
          invokeTvHeroControl(
            '__tvHeroCompanionCamera',
            [
              cameraStep.preset,
              {
                duration: cameraStep.duration,
                easing: cameraStep.easing,
                source: 'intro',
                beat: activeBeat.label,
              },
            ],
            0,
            () => !reelStarted && !locked && shell.dataset.overtureBeat === activeBeat.label,
          );
        }
        if (activeBeat.label === 'intro'
          && (previousOvertureBeat === 'breather-loop' || overtureWrapped)) {
          advanceAudioLoopProfile();
          loopResolveStartedAt = performance.now();
          loopResolveUntil = Number.POSITIVE_INFINITY;
        }
        lastOvertureBeat = activeBeat.label;
        window.clearTimeout(parkedGlitchTimer);
        clearParkedIdle();
        if (crtPhaseForBeat(previousOvertureBeat) === 'design'
          && crtPhaseForBeat(activeBeat.label) !== 'design') {
          clearDesignStory();
        }
        if (crtPhaseForBeat(previousOvertureBeat) === 'make'
          && crtPhaseForBeat(activeBeat.label) !== 'make') {
          clearMakeStory();
        }
        if (crtPhaseForBeat(previousOvertureBeat) === 'believe'
          && crtPhaseForBeat(activeBeat.label) !== 'believe') {
          clearBelieveStory();
        }
        delete shell.dataset.parkedIdle;
        // Intermission owns the loop boundary only. End it as soon as the next
        // ./design command phase begins; this must not depend on the deferred
        // Enter-triggered glitch callback.
        if (activeBeat.label === 'design-command'
          && shell.dataset.overtureResolve === 'true') {
          loopResolveUntil = 0;
          shell.dataset.overtureResolve = 'false';
          shell.dataset.overtureResolveProgress = '0.000';
          shell.dataset.overtureResolveCard = 'none';
        }
        if (isBreather) {
          window.dispatchEvent(new CustomEvent('resume-crt-breather', {
            detail: { beat: activeBeat.label },
          }));
          const incomingPhase = activeBeat.label === 'breather-make'
            ? 'make'
            : activeBeat.label === 'breather-believe'
              ? 'believe'
              : '';
          if (incomingPhase) {
            parkedGlitchTimer = window.setTimeout(() => {
              if (shell.dataset.overtureBeat !== activeBeat.label) return;
              fireSynchronizedGlitch('resume-crt-parked-glitch', {
                beat: activeBeat.label,
                phase: incomingPhase,
                kind: 'transition',
                progress: activeBeat.at,
                sampleIndex: incomingPhase === 'make' ? 13 : 21,
                variant: incomingPhase === 'make' ? 1 : 2,
                durationMs: 190,
                audioDurationMs: 175,
                sequence: audioLoopIndex,
              });
            }, 72);
          }
        }
        const textSamples = Array.isArray(activeBeat.textSamples)
          ? activeBeat.textSamples
          : Number.isInteger(activeBeat.textSample)
            ? [activeBeat.textSample]
            : [];
        const programManagedBeat = /-(command|response)$/.test(activeBeat.label);
        if (textSamples.length && !programManagedBeat) {
          parkedGlitchTimer = window.setTimeout(() => {
            if (shell.dataset.overtureBeat !== activeBeat.label) return;
            const textVisit = textVisitCounts.get(activeBeat.label) || 0;
            textVisitCounts.set(activeBeat.label, textVisit + 1);
            const textSample = selectEvolvingSample(
              textSamples,
              textVisit + activeBeat.label.length,
            );
            shell.dataset.parkedGlitch = activeBeat.label;
            fireSynchronizedGlitch('resume-crt-parked-glitch', {
              beat: activeBeat.label,
              kind: activeBeat.kind || 'text',
              progress: activeBeat.at,
              sampleIndex: textSample,
              variant: textSample % 3,
              sequence: textVisit,
            });
          }, 24);
        }
        if (Array.isArray(activeBeat.idleSamples)
          && (!programManagedBeat || executedProgramStage === programStage)) {
          scheduleParkedIdle(activeBeat);
        }
      }
      const resolveNow = performance.now();
      const isResolve = resolveNow < loopResolveUntil;
      const resolveProgress = isResolve
        ? clamp01((resolveNow - loopResolveStartedAt) / CRT_RESOLVE_PHASE_MS)
        : 0;
      shell.dataset.overtureResolve = isResolve ? 'true' : 'false';
      shell.dataset.overtureResolveProgress = resolveProgress.toFixed(3);
      shell.dataset.overtureResolveCard = isResolve ? 'bars' : 'none';
      shell.style.setProperty(
        '--crt-foreshadow-design',
        !isBreather && !isResolve && executedProgramStage === 0 ? '1' : '0',
      );
      shell.style.setProperty(
        '--crt-foreshadow-make',
        !isBreather && !isResolve && executedProgramStage === 1 ? '1' : '0',
      );
      shell.style.setProperty(
        '--crt-foreshadow-believe',
        !isBreather && !isResolve && executedProgramStage === 2 ? '1' : '0',
      );
      window.__tvHeroFloppyProgress?.(floppyProgress);
      shell.style.setProperty('--crt-overture-progress', overtureP.toFixed(4));
      window.dispatchEvent(new CustomEvent('resume-crt-overture-progress', {
        detail: {
          progress: overtureP,
          floppyProgress,
          zoomProgress,
          beat: activeBeat.label,
          breather: isBreather,
          resolve: isResolve,
          resolveProgress,
          loopIndex: audioLoopIndex,
        },
      }));
      shell.style.setProperty('--crt-introfade', (1 - clamp01(insertionP / 0.35)).toFixed(4));

      // The companion/scroll-authored intro owns the handoff once it starts.
      // Do not let legacy page distance bypass the sequence into Hand of God.
      if (!companionStartReceived && insertionP >= 0.985) startReelAtLimit();
      const companionOwnsChannel = String(shell.dataset.companionGate || '').startsWith('channel-');
      if (insertionP <= 0.02 && !locked && !companionOwnsChannel) {
        stopReelAtLimit(insertionP);
      }

      if (zoomP >= CRT_LOCK_P) {
        if (!locked) {
          locked = true;
          // If the reel is already playing before the Mac docks, keep that
          // screen content as the active channel. After the visitor explicitly
          // chooses a menu item, never retune during later dock transitions.
          if (!userSelectedChannel && activeChannel === 0 && isReelPlaying()) {
            activeChannel = filmReelIndex;
          }
          window.__tvHeroSetChannelDefs?.(CRT_CHANNELS, { active: activeChannel });
          shell.classList.add('is-crt-locked');
          emitLock();
          emitChannel();
          window.__tvHeroPageMode?.(true, { channels: CRT_CHANNELS, active: activeChannel });
          if (CRT_CHANNELS[activeChannel]?.type === 'video') {
            window.__tvHeroResumeVideoChannel?.();
          }
          if (activeNeedsProjection()) project();
        }
      } else if (locked) {
        locked = false;
        channelWithin = 0;
        shell.classList.remove('is-crt-locked');
        emitLock();
        window.__tvHeroPageMode?.(false);
      }
    };

    const tickAutoplay = (now) => {
      const tickDelta = Math.max(0, now - autoplayLastTickAt);
      autoplayLastTickAt = now;
      if (pageActive && autoplayReady && !reelStarted && !locked) {
        const nextAutoplayProgress = autoplayProgressAt(
          now - autoplayStartedAt,
          companionStartReceived,
        );
        // The song is the bridge and BELIEVE is its picture. If browser/audio
        // scheduling makes the nine-second passage run longer than the static
        // edit, freeze on BELIEVE's final frame rather than entering the loop
        // breather early. Advancing `autoplayStartedAt` by the frame delta
        // pauses the authored clock without creating a second timing system.
        if (nextAutoplayProgress > 0.84
          && ['queued', 'playing'].includes(shell.dataset.believeSinging)) {
          autoplayStartedAt += tickDelta;
          autoplayProgress = 0.84;
          shell.dataset.believeSingingHold = 'true';
        } else {
          autoplayProgress = nextAutoplayProgress;
          delete shell.dataset.believeSingingHold;
        }
        update();
      }
      autoplayRaf = requestAnimationFrame(tickAutoplay);
    };
    const readMacOvertureReady = () => {
      const readiness = window.__tvHeroCompanionIntroReady;
      const prepare = window.__tvHeroPrepareCompanionIntro;
      if (typeof readiness !== 'function' || typeof prepare !== 'function') return false;
      try {
        if (!readiness()) return false;
        window.__resumeMacOvertureReady = true;
        return true;
      } catch (_) {
        return false;
      }
    };
    const waitForMacOvertureReady = async (sequence) => {
      const startedAt = performance.now();
      shell.dataset.companionMachineWaitStartedAt = String(Math.round(startedAt));
      shell.dataset.companionMachineReadySource = 'waiting-for-live-binding';
      let attempt = 0;
      while (sequence === companionStartSequence
        && companionStartRequested
        && pageActive
        && isResumeForeground()) {
        if (readMacOvertureReady()) {
          let prepared = false;
          try {
            prepared = window.__tvHeroPrepareCompanionIntro() === true;
          } catch (_) {
            prepared = false;
          }
          if (prepared) {
            macOvertureReady = true;
            shell.dataset.companionMachineWaitMs = String(
              Math.round(performance.now() - startedAt),
            );
            shell.dataset.companionMachineReadySource = attempt === 0
              ? 'live-binding'
              : 'live-binding-retry';
            return true;
          }
        }
        attempt += 1;
        // A normal mount resolves on the first pass. If React is replacing the
        // TvHero binding during a cached reload, keep the visitor informed
        // without ever losing the launch request to a one-shot event.
        if (attempt === 40) shell.dataset.companionGate = 'recovering-machine';
        if (performance.now() - startedAt >= 12000) {
          shell.dataset.companionMachineTimeout = 'true';
          window.setTimeout(() => {
            window.dispatchEvent(new CustomEvent('resume-companion-stop-intro', {
              detail: { source: 'machine-ready-watchdog' },
            }));
          }, 0);
          return false;
        }
        await new Promise((resolve) => window.setTimeout(resolve, 50));
      }
      return false;
    };
    const beginAutoplay = () => {
      if (!pageActive
        || !isResumeForeground()
        || autoplayReady
        || companionIntermissionCommitted
        || companionIntermissionHeld
        || !macOvertureReady
        || !companionInsertComplete
        || !companionStartRequested) return false;
      window.clearTimeout(programLaunchTimer);
      programLaunchTimer = 0;
      delete shell.dataset.programLaunchPending;
      autoplayReady = true;
      autoplayStartedAt = performance.now();
      autoplayLastTickAt = autoplayStartedAt;
      autoplayProgress = autoplayProgressAt(0, companionStartReceived);
      lastOvertureProgress = autoplayProgress;
      activeProgramStage = 0;
      executedProgramStage = -1;
      lastOvertureBeat = 'intro';
      companionIntermissionCommitted = false;
      companionIntermissionHeld = false;
      delete shell.dataset.intermissionStatus;
      shell.dataset.overtureBoot = 'false';
      shell.dataset.companionGate = 'started';
      shell.dataset.introTransport = 'playing';
      update();
      return true;
    };
    const onMacOvertureReady = () => {
      macOvertureReady = readMacOvertureReady();
      shell.dataset.companionGate = companionStartRequested
        ? (companionInsertComplete ? 'starting' : 'machine-ready')
        : 'waiting';
      if (companionInsertComplete) beginAutoplay();
    };
    const onCompanionStart = async (event) => {
      if (!pageActive || !isResumeForeground()) return;
      const requestedSource = String(event?.detail?.source || '');
      const trustedKeyboardStart = requestedSource === 'keyboard' || requestedSource === 'mac-pointer';
      const audioIsReady = ['ready', 'playing', 'idle-playing', 'text-playing']
        .includes(String(shell.dataset.glitchAudio || ''));
      if (!IS_LOCAL_PREVIEW
        && !audioIsReady
        && event?.detail?.audioUnlocked !== true
        && !trustedKeyboardStart) {
        pendingTrustedAudioStart = { ...(event?.detail || {}) };
        shell.dataset.audioStartGate = 'awaiting-gesture';
        shell.dataset.introTransport = 'waiting-for-sound';
        return;
      }
      pendingTrustedAudioStart = null;
      delete shell.dataset.audioStartGate;
      window.dispatchEvent(new CustomEvent('resume-mac-ghostwriter-stop', {
        detail: { source: event?.detail?.source || 'companion-start' },
      }));
      window.dispatchEvent(new CustomEvent('resume-mac-try-it-prompt', {
        detail: { visible: false, source: event?.detail?.source || 'companion-start' },
      }));
      window.clearTimeout(preludeRecoveryTimer);
      preludeRecoveryTimer = 0;
      preludeRecoveryPending = false;
      preludeRecoveryName = '';
      delete shell.dataset.introPreludeRecovery;
      const requestedIntroSource = requestedSource;
      const introTrigger = ['scroll', 'keyboard', 'mac-pointer'].includes(requestedIntroSource)
        ? requestedIntroSource
        : 'companion';
      const suppliedName = CRT_PERSONALIZED_PROLOGUE_ENABLED
        ? String(event?.detail?.visitorName || '').trim().slice(0, 24)
        : '';
      if (suppliedName) shell.dataset.visitorName = suppliedName;
      else if (introTrigger !== 'scroll') delete shell.dataset.visitorName;
      window.dispatchEvent(new CustomEvent('resume-visitor-name-change', {
        detail: {
          name: shell.dataset.visitorName || '',
          prompt: false,
          // Preserve the voice instrument face between the Enter key event
          // and the first spoken name frame; otherwise this synchronous state
          // handoff can paint a one-frame terminal flash.
          opening: CRT_PERSONALIZED_PROLOGUE_ENABLED && Boolean(shell.dataset.visitorName),
          source: introTrigger,
        },
      }));
      const sequence = ++companionStartSequence;
      companionStartRequested = true;
      companionStartReceived = true;
      companionInsertComplete = false;
      companionIntermissionCommitted = false;
      companionIntermissionHeld = false;
      delete shell.dataset.intermissionStatus;
      shell.dataset.introTrigger = introTrigger;
      if (CRT_PERSONALIZED_PROLOGUE_ENABLED && shell.dataset.visitorName) {
        window.dispatchEvent(new CustomEvent('resume-opening-invitation-step', {
          detail: {
            index: -1,
            text: shell.dataset.visitorName.toUpperCase(),
            kind: 'name',
            gateMs: 1800,
            emphasis: 0.68,
          },
        }));
        shell.dataset.companionGate = 'addressing';
        if (pendingNameVoicePromise
          && pendingNameVoiceName === shell.dataset.visitorName) {
          await pendingNameVoicePromise;
        } else {
          await speakVisitorName(shell.dataset.visitorName);
        }
        pendingNameVoicePromise = null;
        pendingNameVoiceName = '';
        if (sequence !== companionStartSequence
          || !companionStartRequested
          || !pageActive
          || !isResumeForeground()) return;
        shell.dataset.nameQuestionPause = 'playing';
        shell.dataset.nameQuestionPauseMs = String(CRT_NAME_TO_QUESTION_PAUSE_MS);
        await new Promise((resolve) => {
          window.setTimeout(resolve, CRT_NAME_TO_QUESTION_PAUSE_MS);
        });
        if (sequence !== companionStartSequence
          || !companionStartRequested
          || !pageActive
          || !isResumeForeground()) return;
        shell.dataset.nameQuestionPause = 'complete';
      }
      if (CRT_PERSONALIZED_PROLOGUE_ENABLED) {
        shell.dataset.companionGate = 'invitation';
        const invitationCompleted = await playOpeningInvitation(sequence);
        if (!invitationCompleted
          || sequence !== companionStartSequence
          || !companionStartRequested
          || !pageActive
          || !isResumeForeground()) return;
      } else {
        shell.dataset.companionGate = 'direct-design';
        scheduleDirectIntroBed(sequence);
      }
      // The trailer theme is already running. Its instrumental lead-in is
      // expanded while the dialogue cadence remains untouched. MAKE's actual
      // Return edge starts hyperspace on the LED wall; the source bloop exits
      // hyperspace into code, and only then does “never” land.
      // A new launch always owns a fresh hardware boot. Without this explicit
      // reset, restarting after a completed loop could inherit the previous
      // fully-powered wall and silently skip the scattered cabinet wake-up.
      window.dispatchEvent(new CustomEvent('resume-crt-wall-power-reset'));
      // Blank the CRT immediately, then let the disk make the physical handoff
      // before the first ./design keystroke. The wall remains black until the
      // character events begin waking individual LED cabinets.
      macOvertureReady = false;
      shell.dataset.companionGate = 'loading-machine';
      const machineReady = await waitForMacOvertureReady(sequence);
      if (!machineReady
        || sequence !== companionStartSequence
        || !companionStartRequested
        || !pageActive
        || !isResumeForeground()) return;
      shell.dataset.companionGate = 'inserting';
      await invokeTvHeroControl(
        '__tvHeroInsertFloppy',
        [],
        0,
        () => sequence === companionStartSequence
          && companionStartRequested
          && !reelStarted
          && !locked,
      );
      if (sequence !== companionStartSequence || !companionStartRequested) {
        window.__tvHeroFloppyProgress?.(0);
        return;
      }
      companionInsertComplete = true;
      shell.dataset.companionGate = 'starting';
      beginAutoplay();
    };
    const onVisitorNameSubmit = async (event) => {
      if (!CRT_PERSONALIZED_PROLOGUE_ENABLED) return;
      if (!pageActive
        || !isResumeForeground()
        || companionStartRequested
        || autoplayReady
        || reelStarted
        || locked) return;
      const visitorName = String(event.detail?.name || '').trim().slice(0, 24);
      if (!visitorName) return;
      shell.dataset.visitorName = visitorName;
      shell.dataset.introTrigger = 'name-enter';
      window.dispatchEvent(new CustomEvent('resume-opening-invitation-step', {
        detail: {
          index: -1,
          text: visitorName.toUpperCase(),
          kind: 'name',
          gateMs: 1800,
          emphasis: 0.68,
        },
      }));
      pendingNameVoiceName = visitorName;
      pendingNameVoicePromise = speakVisitorName(visitorName);
      const session = shell.dataset.companionSession || '';
      if (session) {
        try {
          const response = await fetch('/api/companion/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session, visitorName }),
          });
          if (response.ok) return;
        } catch (_) {}
      }
      void onCompanionStart({
        detail: {
          source: 'keyboard',
          visitorName,
        },
      });
    };

    const onChannelSelect = (event) => {
      if (!pageActive || !isResumeForeground()) return;
      if (!locked) return;
      userSelectedChannel = true;
      const next = Math.max(0, Math.min(CRT_CHANNELS.length - 1, Number(event.detail?.index) || 0));
      tuneChannel(next, true);
      if (CRT_CHANNELS[next]?.type === 'page' && !projected) project();
    };
    const onAudioChange = () => {
      if (!pageActive || !isResumeForeground()) return;
      ensureReelChannelForPlayback();
    };
    const setIntroTransportPaused = (next) => {
      const canPauseIntro = autoplayReady
        && companionStartReceived
        && !companionIntermissionCommitted
        && !companionIntermissionHeld
        && !reelStarted
        && !locked;
      if (!canPauseIntro && next !== false) return false;
      const paused = Boolean(next);
      if (paused === introTransportPaused) return canPauseIntro;
      introTransportPaused = paused;
      window.__resumeIntroTransportPaused = paused;
      shell.classList.toggle('is-intro-paused', paused);
      shell.dataset.introTransport = paused ? 'paused' : 'playing';
      if (paused) {
        introTransportPausedAt = performance.now();
        window.dispatchEvent(new CustomEvent('resume-page-activity-change', {
          detail: { active: false, reason: 'intro-space-pause' },
        }));
      } else {
        introTransportPausedAt = 0;
        window.dispatchEvent(new CustomEvent('resume-page-activity-change', {
          detail: { active: true, reason: 'intro-space-resume' },
        }));
      }
      window.dispatchEvent(new CustomEvent('resume-intro-transport-change', {
        detail: {
          paused,
          progress: autoplayProgress,
          beat: shell.dataset.overtureBeat || 'intro',
        },
      }));
      return true;
    };
    const toggleIntroTransport = () => (
      setIntroTransportPaused(!introTransportPaused)
    );
    const onWheel = (event) => {
      if (!CRT_SCROLL_INTERACTION_ENABLED) return;
      if (introTransportPaused) {
        event.preventDefault();
        return;
      }
      if (!pageActive || !isResumeForeground()) return;
      if (!locked) {
        const heroTop = heroScrollTop();
        const scrollOffset = window.scrollY || root.scrollTop || document.body.scrollTop || 0;
        // The editorial profile is a real first viewport. Let normal scrolling
        // reveal the Macintosh; only take over once that viewport is reached.
        if (event.deltaY > 0 && scrollOffset < heroTop - 2) return;
        // The keyboard is now the intentional desktop Start gesture: it arms
        // audio and lets the Macintosh ghostwrite ./design. Trackpad momentum
        // stays parked at the landing cursor instead of silently starting.
        if (COMPANION_GATE_ENABLED
          && event.deltaY > 0
          && !companionStartRequested
          && !autoplayReady
          && !reelStarted
          && !companionIntermissionCommitted) {
          event.preventDefault();
          window.scrollTo(0, heroTop);
          root.scrollTop = heroTop;
          document.body.scrollTop = heroTop;
          shell.dataset.introTransport = 'waiting-for-key';
          return;
        }
        // Discard trackpad momentum while the intro state machine is running
        // (and while it is parked on color bars) so a gesture cannot build up
        // hidden page distance and fire the legacy demo threshold afterward.
        if (COMPANION_GATE_ENABLED
          && companionStartReceived
          && (!companionIntermissionCommitted || companionIntermissionHeld)) {
          event.preventDefault();
          window.scrollTo(0, heroTop);
          root.scrollTop = heroTop;
          document.body.scrollTop = heroTop;
          return;
        }
        const vh = window.innerHeight || 1;
        const currentInsertion = clamp01(
          Math.max(0, (window.scrollY || 0) - heroTop) / (CRT_TEXT_RUNWAY_VH * vh),
        );
        if (reelStarted && event.deltaY <= -2) {
          stopReelAtLimit(currentInsertion);
          autoplayStartedAt = performance.now();
          autoplayProgress = 0;
          lastOvertureProgress = 0;
          return;
        }
        // Text is time-based now. Wheel/trackpad input has one physical job:
        // move the disk through the slot, then continue into the existing dock.
        if (reelStarted) {
          requestReelAudio();
        }
        window.clearTimeout(wheelSync);
        wheelSync = window.setTimeout(onScroll, 16);
        return;
      }
      if (!event.target?.closest?.('.tv-hero')) return;
      const channel = CRT_CHANNELS[activeChannel];
      if (channel?.type !== 'page') return;
      const max = withinRanges[activeChannel] || 0;
      if (max <= 0) return;
      event.preventDefault();
      channelWithin = Math.max(0, Math.min(max, channelWithin + event.deltaY));
      window.__tvHeroChannelWithin?.(channelWithin);
    };

    // Boot Doom from its channel.
    const onKey = (e) => {
      if ((e.code === 'Space' || e.key === ' ')
        && !e.repeat
        && !e.metaKey
        && !e.ctrlKey
        && !e.altKey
        && !e.target?.closest?.('input, textarea, select, [contenteditable="true"]')
        && toggleIntroTransport()) {
        e.preventDefault();
        return;
      }
      if (!pageActive || !isResumeForeground()) return;
      window.__tvHeroEnableReelAudio?.();
      if (reelStarted || CRT_CHANNELS[activeChannel]?.type === 'video') {
        requestReelAudio();
      }
      if (!locked) return;
      if ((e.key === 'Enter' || e.key === ' ') && CRT_CHANNELS[activeChannel]?.type === 'doom') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('resume-launch-doom'));
      }
    };
    const onPointerDown = () => {
      if (!pageActive || !isResumeForeground()) return;
      window.__tvHeroEnableReelAudio?.();
      if (reelStarted || CRT_CHANNELS[activeChannel]?.type === 'video') {
        requestReelAudio();
      }
    };
    const onTrustedAudioReady = () => {
      if (!pendingTrustedAudioStart
        || !pageActive
        || !isResumeForeground()
        || companionStartRequested
        || autoplayReady) return;
      const detail = pendingTrustedAudioStart;
      pendingTrustedAudioStart = null;
      delete shell.dataset.audioStartGate;
      void onCompanionStart({ detail: { ...detail, audioUnlocked: true } });
    };

    const syncMacSectionOwnership = () => {
      const bounds = enter.getBoundingClientRect();
      const viewportHeight = window.innerHeight || root.clientHeight || 1;
      shell.classList.toggle(
        'is-mac-section-active',
        bounds.bottom > 0 && bounds.top < viewportHeight,
      );
    };

    const onScroll = () => {
      if (!pageActive || !isResumeForeground()) return;
      if (!CRT_SCROLL_INTERACTION_ENABLED) {
        shell.classList.remove('has-entered-mac', 'is-crt-locked');
        return;
      }
      const scrollOffset = window.scrollY || root.scrollTop || document.body.scrollTop || 0;
      const heroTop = heroScrollTop();
      shell.classList.toggle('has-entered-mac', scrollOffset >= heroTop - 1);
      if (COMPANION_GATE_ENABLED
        && scrollOffset >= heroTop - 1
        && !companionStartRequested
        && !autoplayReady
        && !reelStarted
        && !companionIntermissionCommitted) {
        window.scrollTo(0, heroTop);
        root.scrollTop = heroTop;
        document.body.scrollTop = heroTop;
        shell.dataset.introTransport = 'waiting-for-key';
        return;
      }
      if (COMPANION_GATE_ENABLED
        && companionStartReceived
        && (!companionIntermissionCommitted || companionIntermissionHeld)) {
        if (Math.abs(scrollOffset - heroTop) > 1) {
          window.scrollTo(0, heroTop);
          root.scrollTop = heroTop;
          document.body.scrollTop = heroTop;
        }
        return;
      }
      if (!raf) raf = requestAnimationFrame(update);
    };
    const resetToStart = () => {
      if (introTransportPaused) setIntroTransportPaused(false);
      window.clearTimeout(preludeRecoveryTimer);
      preludeRecoveryTimer = 0;
      preludeRecoveryPending = false;
      preludeRecoveryName = '';
      window.dispatchEvent(new CustomEvent('resume-intro-bed-stop'));
      window.clearTimeout(programLaunchTimer);
      programLaunchTimer = 0;
      window.clearTimeout(intermissionResolveFallbackTimer);
      intermissionResolveFallbackTimer = 0;
      delete shell.dataset.programLaunchPending;
      window.clearTimeout(parkedGlitchTimer);
      window.clearTimeout(introHyperspaceTimer);
      introHyperspaceTimer = 0;
      window.clearTimeout(introCodeHandoffTimer);
      introCodeHandoffTimer = 0;
      introWallStageDeadline = 0;
      introWallStageRemainingMs = 0;
      introCodeHandoffDeadline = 0;
      introCodeHandoffRemainingMs = 0;
      clearParkedIdle();
      clearDesignStory();
      clearMakeStory();
      clearBelieveStory();
      clearOpeningInvitation();
      clearPhaseVocals();
      stopVisitorNameVoice();
      lastOvertureBeat = 'intro';
      userSelectedChannel = false;
      activeChannel = 0;
      channelWithin = 0;
      reelStarted = false;
      reelAudioStarting = false;
      locked = false;
      autoplayStartedAt = performance.now();
      autoplayLastTickAt = autoplayStartedAt;
      autoplayProgress = 0;
      lastOvertureProgress = 0;
      companionIntermissionHeld = false;
      companionIntermissionCommitted = false;
      loopResolveStartedAt = 0;
      loopResolveUntil = 0;
      poolRestIndex = 0;
      advanceAudioLoopProfile(0);
      root.style.scrollSnapType = 'none';
      shell.classList.remove('is-crt-locked');
      shell.classList.remove('is-reel-playing');
      window.__tvHeroStopReel?.();
      window.__tvHeroResetChannelPlayback?.();
      window.__resumeStrudelAudioEngine?.setEnabled?.(false);
      window.__tvHeroPageMode?.(false);
      // Reset to the same close waiting composition used on first load.
      // ./design Return owns the later release into the wide volume.
      window.__tvHeroChannelCamera?.('camera:typing', {
        instant: true,
        duration: 0,
        easing: 'snap',
        source: 'reset-to-start',
      });
      window.__tvHeroFloppyProgress?.(0);
      window.dispatchEvent(new CustomEvent('resume-crt-wall-power-reset'));
      shell.style.setProperty('--crt-overture-progress', '0');
      shell.style.setProperty('--crt-introfade', '1');
      shell.style.setProperty('--crt-foreshadow-design', '0');
      shell.style.setProperty('--crt-foreshadow-make', '0');
      shell.style.setProperty('--crt-foreshadow-believe', '0');
      shell.dataset.overtureBeat = 'intro';
      shell.dataset.overtureMode = 'autoplay';
      shell.dataset.introTransport = 'waiting';
      pendingTrustedAudioStart = null;
      delete shell.dataset.audioStartGate;
      shell.dataset.overtureBreather = 'false';
      shell.dataset.overtureResolve = 'false';
      shell.dataset.overtureResolveProgress = '0.000';
      shell.dataset.overtureResolveCard = 'none';
      shell.dataset.insertionProgress = '0.000';
      shell.dataset.floppyProgress = '0.000';
      shell.dataset.poolRest = '0';
      delete shell.dataset.parkedGlitch;
      delete shell.dataset.parkedIdle;
      delete shell.dataset.designStoryStep;
      delete shell.dataset.designStoryFrame;
      delete shell.dataset.designStoryLabel;
      delete shell.dataset.makeStoryStep;
      delete shell.dataset.makeStoryFrame;
      delete shell.dataset.makeStoryLabel;
      delete shell.dataset.makeStoryText;
      delete shell.dataset.makeStoryVariant;
      delete shell.dataset.makeStoryCut;
      delete shell.dataset.makeStoryCrash;
      delete shell.dataset.makeCodeCutTrace;
      delete shell.dataset.believeStoryStep;
      delete shell.dataset.believeStoryFrame;
      delete shell.dataset.believeStoryLabel;
      delete shell.dataset.believeStorySide;
      delete shell.dataset.believeStoryText;
      delete shell.dataset.believeVocal;
      delete shell.dataset.believeVocalStartedAt;
      delete shell.dataset.believeVocalRate;
      delete shell.dataset.believeVocalTrace;
      delete shell.dataset.introBed;
      delete shell.dataset.introBedSource;
      delete shell.dataset.introBedDurationMs;
      delete shell.dataset.introBedStartedAt;
      delete shell.dataset.introBedCompletedAt;
      delete shell.dataset.nameQuestionPause;
      delete shell.dataset.nameQuestionPauseMs;
      delete shell.dataset.introBedMakeBoundaryDeltaMs;
      delete shell.dataset.introBedMakeCommandOffsetMs;
      delete shell.dataset.introBedMakeEnterOffsetMs;
      delete shell.dataset.introHyperspaceOffsetMs;
      delete shell.dataset.introBloopOffsetMs;
      delete shell.dataset.introMakeDialogueTargetAt;
      delete shell.dataset.introBloopAudio;
      delete shell.dataset.introBloopAudioSource;
      delete shell.dataset.introBloopAudioStartedAt;
      delete shell.dataset.introBloopAudioRequestedAt;
      delete shell.dataset.introThemeStateAtHyperspace;
      delete shell.dataset.introThemeStateAtHyperspaceExit;
      delete shell.dataset.introHyperspaceExitedAt;
      delete shell.dataset.introHardGlitchStartedAt;
      delete shell.dataset.introCodeHandoffAt;
      delete shell.dataset.makeStoryAwaitingDialogue;
      delete shell.dataset.believeTerminalTransition;
      delete shell.dataset.believeSinging;
      delete shell.dataset.believeSingingCue;
      delete shell.dataset.believeSingingCompletedAt;
      delete shell.dataset.believeSingingCueSerial;
      delete shell.dataset.believeSingingRequestedAt;
      delete shell.dataset.believeSingingStartedAt;
      delete shell.dataset.believeSingingStartLatencyMs;
      delete shell.dataset.believeSingingStartCount;
      delete shell.dataset.introSourceCue;
      delete shell.dataset.sourceCodeHandoff;
      delete shell.dataset.introWallProgram;
      delete shell.dataset.introWallTrace;
      delete shell.dataset.openingQuestionGlitch;
      delete shell.dataset.introPreludeRecovery;
      delete shell.dataset.believeSingingHold;
      window.__resumeBelieveVocalTrace = [];
      delete shell.dataset.introCameraBeat;
      delete shell.dataset.introCameraPreset;
      delete shell.dataset.introCameraDuration;
      delete shell.dataset.introCameraEasing;
      delete shell.dataset.introTrigger;
      delete shell.dataset.visitorName;
      delete shell.dataset.intermissionCommit;
      delete shell.dataset.intermissionCommittedAt;
      delete shell.dataset.intermissionStatus;
      delete shell.dataset.testToneStartedAt;
      delete shell.dataset.resolveGlitch;
      delete shell.dataset.resolveGlitchEvent;
      window.dispatchEvent(new CustomEvent('resume-crt-overture-progress', {
        detail: {
          progress: 0,
          floppyProgress: 0,
          zoomProgress: 0,
          beat: 'intro',
          breather: false,
          resolve: false,
          resolveProgress: 0,
        },
      }));
      window.dispatchEvent(new CustomEvent('resume-visitor-name-change', {
        detail: {
          name: '',
          prompt: CRT_PERSONALIZED_PROLOGUE_ENABLED,
          source: 'reset',
        },
      }));
      emitLock();
      emitChannel();
      const body = document.body;
      const previousRootBehavior = root.style.scrollBehavior;
      const previousBodyBehavior = body.style.scrollBehavior;
      root.style.scrollBehavior = 'auto';
      body.style.scrollBehavior = 'auto';
      const resetScrollTop = heroScrollTop();
      shell.classList.add('has-entered-mac');
      window.scrollTo(0, resetScrollTop);
      root.scrollTop = resetScrollTop;
      body.scrollTop = resetScrollTop;
      requestAnimationFrame(() => {
        window.scrollTo(0, resetScrollTop);
        root.scrollTop = resetScrollTop;
        body.scrollTop = resetScrollTop;
        update();
        root.style.scrollBehavior = previousRootBehavior;
        body.style.scrollBehavior = previousBodyBehavior;
      });
    };
    const onCompanionStop = (event) => {
      if (introTransportPaused) setIntroTransportPaused(false);
      // Tone completion already ran the authoritative reset even if the page
      // was backgrounded. Keep this local visual broadcast idempotent.
      if (event?.detail?.localAlreadyReset === true) return;
      if (!pageActive || !isResumeForeground()) return;
      // A reusable phone session may reconnect with an old STOP revision on a
      // fresh page load. The machine is already reset; replaying that command
      // would unnecessarily skip the new editorial profile viewport.
      if (!companionStartRequested && !companionStartReceived && !autoplayReady) {
        shell.dataset.companionGate = 'waiting';
        return;
      }
      companionStartSequence += 1;
      autoplayReady = false;
      companionStartRequested = false;
      companionStartReceived = false;
      companionInsertComplete = false;
      companionIntermissionHeld = false;
      companionIntermissionCommitted = false;
      resetToStart();
      shell.dataset.companionGate = 'waiting';
    };
    const onCompanionChannel = (event) => {
      if (!pageActive || !isResumeForeground()) return;
      const channelModeActive = companionIntermissionHeld
        || String(shell.dataset.companionGate || '').startsWith('channel-');
      if (!channelModeActive) return;
      const channelId = String(event.detail?.channel || '').trim().toLowerCase();
      const next = CRT_CHANNELS.findIndex((channel) => channel.id === channelId);
      if (next < 0) return;

      companionIntermissionHeld = false;
      window.clearTimeout(intermissionResolveFallbackTimer);
      intermissionResolveFallbackTimer = 0;
      loopResolveUntil = 0;
      shell.dataset.companionGate = `channel-${channelId}`;
      activeChannel = next;
      channelWithin = 0;
      userSelectedChannel = true;
      clearParkedIdle();
      clearDesignStory();
      clearMakeStory();
      clearBelieveStory();
      clearOpeningInvitation();
      clearPhaseVocals();
      shell.dataset.overtureBeat = 'channel';
      shell.dataset.overtureBreather = 'false';
      shell.dataset.overtureResolve = 'false';
      shell.dataset.overtureResolveProgress = '0.000';
      shell.dataset.overtureResolveCard = 'none';
      shell.dataset.intermissionStatus = 'channel-selected';
      window.dispatchEvent(new CustomEvent('resume-crt-overture-progress', {
        detail: {
          progress: autoplayProgress,
          floppyProgress: 1,
          zoomProgress: 0,
          beat: 'channel',
          breather: false,
          resolve: false,
          resolveProgress: 0,
          intermissionCommit: companionIntermissionCommit,
        },
      }));

      window.__tvHeroSetChannelDefs?.(CRT_CHANNELS, { active: activeChannel });
      window.__tvHeroPageMode?.(true, { channels: CRT_CHANNELS, active: activeChannel });
      tuneChannel(activeChannel, true);
      if (CRT_CHANNELS[activeChannel]?.type === 'page' && !projected) project(true);
    };
    const onCompanionCamera = (event) => {
      if (!pageActive || !isResumeForeground()) return;
      const preset = String(event.detail?.camera || 'hero').trim().toLowerCase();
      const allowed = new Set(['wide', 'hero', 'typing', 'floor', 'left', 'right', 'crane']);
      if (!allowed.has(preset)) return;
      shell.dataset.companionCamera = preset;
      window.__tvHeroCompanionCamera?.(preset);
    };
    const onPageActivity = (event) => {
      const foreground = event?.detail?.active === true && isResumeForeground();
      if (!foreground) {
        if (!pageActive) return;
        pageActive = false;
        pagePausedAt = performance.now();
        shell.dataset.pageActivity = 'background-idle';
        window.clearTimeout(preludeRecoveryTimer);
        preludeRecoveryTimer = 0;
        if (companionStartRequested
          && !autoplayReady
          && !companionIntermissionCommitted
          && !companionIntermissionHeld) {
          preludeRecoveryPending = true;
          preludeRecoveryName = String(shell.dataset.visitorName || '').trim().slice(0, 24);
          companionStartSequence += 1;
          clearOpeningInvitation();
          clearPhaseVocals();
          stopVisitorNameVoice();
          pendingNameVoicePromise = null;
          pendingNameVoiceName = '';
          shell.dataset.companionGate = 'background-paused';
          shell.dataset.introPreludeRecovery = 'pending';
        }
        window.clearTimeout(programLaunchTimer);
        programLaunchTimer = 0;
        window.clearTimeout(parkedGlitchTimer);
        parkedGlitchTimer = 0;
        window.clearTimeout(channelGlitchTimer);
        channelGlitchTimer = 0;
        clearParkedIdle();
        const pausedAt = performance.now();
        if (introHyperspaceTimer && introWallStageDeadline > 0) {
          introWallStageRemainingMs = Math.max(24, introWallStageDeadline - pausedAt);
          window.clearTimeout(introHyperspaceTimer);
          introHyperspaceTimer = 0;
        }
        if (introCodeHandoffTimer && introCodeHandoffDeadline > 0) {
          introCodeHandoffRemainingMs = Math.max(
            24,
            introCodeHandoffDeadline - pausedAt,
          );
          window.clearTimeout(introCodeHandoffTimer);
          introCodeHandoffTimer = 0;
        }
        if (designStoryActive && designStoryDeadline > 0) {
          designStoryRemainingMs = Math.max(24, designStoryDeadline - pausedAt);
        }
        if (makeStoryActive && makeStoryDeadline > 0) {
          makeStoryRemainingMs = Math.max(24, makeStoryDeadline - pausedAt);
        }
        if (believeStoryActive && believeStoryDeadline > 0) {
          believeStoryRemainingMs = Math.max(24, believeStoryDeadline - pausedAt);
        }
        clearDesignStory({ reset: false });
        clearMakeStory({ reset: false });
        clearBelieveStory({ reset: false });
        shell.classList.remove('has-parked-glitch');
        delete shell.dataset.channelGlitchActive;
        return;
      }
      if (pageActive) return;
      const resumedAt = performance.now();
      const pausedFor = pagePausedAt > 0 ? Math.max(0, resumedAt - pagePausedAt) : 0;
      pageActive = true;
      pagePausedAt = 0;
      if (autoplayReady) autoplayStartedAt += pausedFor;
      if (loopResolveStartedAt > 0) loopResolveStartedAt += pausedFor;
      if (Number.isFinite(loopResolveUntil) && loopResolveUntil > 0) {
        loopResolveUntil += pausedFor;
      }
      if (shell.dataset.introMakeDialogueTargetAt) {
        const dialogueTargetAt = Number(shell.dataset.introMakeDialogueTargetAt);
        if (Number.isFinite(dialogueTargetAt) && dialogueTargetAt > 0) {
          shell.dataset.introMakeDialogueTargetAt = String(
            Math.round(dialogueTargetAt + pausedFor),
          );
        }
      }
      shell.dataset.pageActivity = 'foreground-resumed';
      if (preludeRecoveryPending) {
        shell.dataset.introPreludeRecovery = 'waiting-for-companion-state';
        window.clearTimeout(preludeRecoveryTimer);
        preludeRecoveryTimer = window.setTimeout(() => {
          preludeRecoveryTimer = 0;
          if (!pageActive
            || !isResumeForeground()
            || !preludeRecoveryPending
            || !companionStartRequested) return;
          const visitorName = preludeRecoveryName;
          shell.dataset.introPreludeRecovery = 'restarting';
          void onCompanionStart({
            detail: {
              source: 'foreground-recovery',
              visitorName,
            },
          });
        }, 180);
        return;
      }
      if (companionIntermissionCommitted) {
        // A foreground transition must restore the terminal intermission,
        // never restart the completed intro or revive its last camera route.
        if (companionIntermissionHeld) {
          const resolveIsHolding = shell.dataset.overtureResolve === 'true'
            && shell.dataset.overtureResolveCard === 'bars';
          shell.dataset.overtureBeat = 'intermission';
          shell.dataset.overtureResolve = resolveIsHolding ? 'true' : 'false';
          shell.dataset.overtureResolveProgress = resolveIsHolding ? '1.000' : '0.000';
          shell.dataset.overtureResolveCard = resolveIsHolding ? 'bars' : 'none';
          window.dispatchEvent(new CustomEvent('resume-crt-overture-progress', {
            detail: {
              progress: autoplayProgress,
              floppyProgress: 1,
              zoomProgress: 0,
              beat: resolveIsHolding ? 'intermission' : 'intermission-ready',
              breather: false,
              resolve: resolveIsHolding,
              resolveProgress: resolveIsHolding ? 1 : 0,
              blankScreen: !resolveIsHolding,
              resetChannel: resolveIsHolding ? 0 : 1,
              intermissionCommit: companionIntermissionCommit,
            },
          }));
        }
      } else {
        update();
        if (!autoplayReady && companionStartRequested) beginAutoplay();
      }

      const currentBeat = CRT_OVERTURE_BEATS.find(
        (beat) => beat.label === shell.dataset.overtureBeat,
      );
      const currentPhase = crtPhaseForBeat(currentBeat?.label);
      const wallProgram = String(shell.dataset.introWallProgram || '');
      restoreCycPresentation(
        wallProgram === 'hyperspace' || wallProgram === 'hard-glitch'
          ? 'hyperspace'
          : wallProgram === 'code'
            ? 'make'
            : currentPhase,
      );
      if (introWallStageRemainingMs > 0) {
        const remainingMs = introWallStageRemainingMs;
        introWallStageRemainingMs = 0;
        if (wallProgram === 'hard-glitch') startMakeHardGlitch(remainingMs);
        else if (wallProgram === 'hyperspace') startMakeHyperspace(remainingMs);
      }
      if (introCodeHandoffRemainingMs > 0 && wallProgram === 'code') {
        const remainingMs = introCodeHandoffRemainingMs;
        introCodeHandoffRemainingMs = 0;
        introCodeHandoffDeadline = performance.now() + remainingMs;
        introCodeHandoffTimer = window.setTimeout(() => {
          introCodeHandoffTimer = 0;
          introCodeHandoffDeadline = 0;
          delete shell.dataset.sourceCodeHandoff;
          if (shell.dataset.introWallProgram === 'code') {
            delete shell.dataset.introWallProgram;
          }
        }, remainingMs);
      }

      const pendingProgram = shell.dataset.programLaunchPending;
      if (pendingProgram && executedProgramStage !== activeProgramStage) {
        onMacProgramCharacter({
          detail: { action: 'enter', stage: activeProgramStage },
        });
      } else {
        const programManagedBeat = /-(command|response)$/.test(currentBeat?.label || '');
        if (crtPhaseForBeat(currentBeat?.label) === 'design'
          && executedProgramStage === 0
          && designStoryIndex < CRT_DESIGN_STORY_STEPS.length) {
          scheduleDesignStory(designStoryBeat || currentBeat, { resume: true });
        } else if (crtPhaseForBeat(currentBeat?.label) === 'make'
          && executedProgramStage === 1
          && makeStoryIndex < CRT_MAKE_STORY_STEPS.length) {
          scheduleMakeStory(makeStoryBeat || currentBeat, { resume: true });
        } else if (crtPhaseForBeat(currentBeat?.label) === 'believe'
          && executedProgramStage === 2
          && believeStoryIndex < CRT_BELIEVE_STORY_STEPS.length) {
          scheduleBelieveStory(believeStoryBeat || currentBeat, { resume: true });
        } else if (Array.isArray(currentBeat?.idleSamples)
          && (!programManagedBeat || executedProgramStage === activeProgramStage)) {
          scheduleParkedIdle(currentBeat);
        }
      }

      if (!reelStarted && !locked) {
        const companionChannelActive = String(shell.dataset.companionGate || '').startsWith('channel-');
        const preset = companionIntermissionHeld
          ? 'typing'
          : companionChannelActive
            ? shell.dataset.companionCamera
            : shell.dataset.introCameraPreset;
        if (preset) {
          invokeTvHeroControl(
            '__tvHeroCompanionCamera',
            [preset, {
              instant: true,
              duration: 0,
              easing: 'snap',
              source: 'foreground-resume',
              beat: shell.dataset.overtureBeat || '',
            }],
            0,
            () => pageActive && !reelStarted && !locked,
          );
        }
      }
    };
    const lifecycleTestEnabled = forceDesktopTest
      && new URLSearchParams(window.location.search).get('activityTest') === '1';
    const onLifecycleTestKey = (event) => {
      if (!lifecycleTestEnabled) return;
      if (event.code === 'F8') {
        event.preventDefault();
        onPageActivity({ detail: { active: false, reason: 'browser-lifecycle-test' } });
      } else if (event.code === 'F9') {
        event.preventDefault();
        onPageActivity({ detail: { active: true, reason: 'browser-lifecycle-test' } });
      }
    };
    window.__resumeCrtReset = resetToStart;
    let reproj = 0;
    const onResize = () => {
      sizeRunway();
      syncMacSectionOwnership();
      clearTimeout(reproj);
      reproj = setTimeout(() => {
        projected = false;
        if (locked) {
          window.__tvHeroPageMode?.(true, { channels: CRT_CHANNELS, active: activeChannel });
          if (CRT_CHANNELS[activeChannel]?.type === 'video') window.__tvHeroResumeVideoChannel?.();
          if (activeNeedsProjection()) project();
        }
      }, 250);
      onScroll();
    };

    sizeRunway();
    shell.dataset.overtureBoot = 'true';
    shell.dataset.companionGate = COMPANION_GATE_ENABLED ? 'waiting' : 'disabled';
    shell.dataset.introTrigger = 'waiting';
    shell.dataset.introTransport = 'waiting';
    shell.dataset.pageActivity = pageActive ? 'foreground' : 'background-idle';
    window.__resumeToggleIntroTransport = toggleIntroTransport;
    update();
    syncMacSectionOwnership();
    autoplayRaf = requestAnimationFrame(tickAutoplay);
    window.addEventListener('scroll', syncMacSectionOwnership, { passive: true });
    if (CRT_SCROLL_INTERACTION_ENABLED) {
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('wheel', onWheel, { passive: false, capture: true });
    }
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('resume-crt-channel-select', onChannelSelect);
    window.addEventListener('resume-audio-change', onAudioChange);
    window.addEventListener('tvhero:controlsready', onScroll);
    window.addEventListener('tvhero:screenbox', onScroll);
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('resume-glitch-audio-ready', onTrustedAudioReady);
    window.addEventListener('resume-keyboard-start-intro', onCompanionStart);
    window.addEventListener('resume-mac-screen-character', onMacProgramCharacter);
    window.addEventListener('resume-mac-overture-ready', onMacOvertureReady);
    window.addEventListener('resume-companion-start-intro', onCompanionStart);
    window.addEventListener('resume-visitor-name-submit', onVisitorNameSubmit);
    window.addEventListener('resume-companion-stop-intro', onCompanionStop);
    window.addEventListener('resume-companion-channel', onCompanionChannel);
    window.addEventListener('resume-companion-camera', onCompanionCamera);
    window.addEventListener('resume-crt-channel-glitch', onChannelGlitch);
    window.addEventListener('resume-intro-source-cue', onIntroSourceCue);
    window.addEventListener('resume-believe-singing-complete', onBelieveSingingComplete);
    window.addEventListener('resume-crt-calibration-tone-complete', onCalibrationToneComplete);
    window.addEventListener('resume-page-activity-change', onPageActivity);
    window.addEventListener('keydown', onLifecycleTestKey);
    return () => {
      window.removeEventListener('scroll', syncMacSectionOwnership);
      if (CRT_SCROLL_INTERACTION_ENABLED) {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('wheel', onWheel, true);
      }
      window.removeEventListener('resize', onResize);
      window.removeEventListener('resume-crt-channel-select', onChannelSelect);
      window.removeEventListener('resume-audio-change', onAudioChange);
      window.removeEventListener('tvhero:controlsready', onScroll);
      window.removeEventListener('tvhero:screenbox', onScroll);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('resume-glitch-audio-ready', onTrustedAudioReady);
      window.removeEventListener('resume-keyboard-start-intro', onCompanionStart);
      window.removeEventListener('resume-mac-screen-character', onMacProgramCharacter);
      window.removeEventListener('resume-mac-overture-ready', onMacOvertureReady);
      window.removeEventListener('resume-companion-start-intro', onCompanionStart);
      window.removeEventListener('resume-visitor-name-submit', onVisitorNameSubmit);
      window.removeEventListener('resume-companion-stop-intro', onCompanionStop);
      window.removeEventListener('resume-companion-channel', onCompanionChannel);
      window.removeEventListener('resume-companion-camera', onCompanionCamera);
      window.removeEventListener('resume-crt-channel-glitch', onChannelGlitch);
      window.removeEventListener('resume-intro-source-cue', onIntroSourceCue);
      window.removeEventListener('resume-believe-singing-complete', onBelieveSingingComplete);
      window.removeEventListener('resume-crt-calibration-tone-complete', onCalibrationToneComplete);
      window.removeEventListener('resume-page-activity-change', onPageActivity);
      window.removeEventListener('keydown', onLifecycleTestKey);
      clearTimeout(reproj);
      clearTimeout(projectRetry);
      clearTimeout(wheelSync);
      clearTimeout(programLaunchTimer);
      clearTimeout(parkedGlitchTimer);
      clearTimeout(channelGlitchTimer);
      clearTimeout(introHyperspaceTimer);
      clearTimeout(introCodeHandoffTimer);
      clearTimeout(preludeRecoveryTimer);
      clearTimeout(intermissionResolveFallbackTimer);
      clearParkedIdle();
      clearDesignStory();
      clearMakeStory();
      clearBelieveStory();
      clearOpeningInvitation();
      clearPhaseVocals();
      stopVisitorNameVoice();
      clearTimeout(reelAudioPrepareTimer);
      if (raf) cancelAnimationFrame(raf);
      if (autoplayRaf) cancelAnimationFrame(autoplayRaf);
      if (window.__resumeToggleIntroTransport === toggleIntroTransport) {
        delete window.__resumeToggleIntroTransport;
      }
      window.__resumeIntroTransportPaused = false;
      shell.classList.remove('is-intro-paused');
      delete shell.dataset.introTransport;
      if (window.__resumeCrtReset === resetToStart) delete window.__resumeCrtReset;
      locked = false;
      emitLock();
      window.__tvHeroPageMode?.(false);
      shell.classList.remove('is-crt', 'is-crt-locked', 'is-reel-playing');
      shell.classList.remove('has-entered-mac');
      shell.classList.remove('is-mac-section-active');
      delete shell.dataset.crtInputTarget;
      root.style.scrollSnapType = previousRootSnapType;
      enter.style.height = '';
    };
  }, []);
  return null;
}

function mountProfileSamplerPart(host, THREE, part) {
  if (!host || !THREE) return () => {};
  const source = createMatchSculptureInstrumentSource(THREE);
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.className = 'landing-profile__instrument-canvas';
  host.replaceChildren(renderer.domElement);

  const scene = new THREE.Scene();
  const root = new THREE.Group();
  scene.add(root);
  const camera = new THREE.OrthographicCamera(-80, 80, 80, -80, 0.1, 100);
  camera.position.set(0, 0, 10);

  const fieldUnit = { x: 0.5, y: 0.5 };
  let wheel = null;
  let chipTexture = null;
  let chipContext = null;
  let lastChipCell = '';
  const profileContent = host.closest('.landing-profile__content');
  const samplerStore = window.__resumeProfileSamplerStore || {
    listeners: new Set(),
    last: null,
  };
  window.__resumeProfileSamplerStore = samplerStore;

  if (part === 'wheel') {
    wheel = source.drawMatchSculptureColorWheelDisk(
      { selectorRoot: root },
      root,
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0, 1, 0),
      66,
      NaN,
      {
        fieldUnit,
        centerColor: source.matchSculptureCieDisplayColorForFieldUnit(fieldUnit),
        opacity: 1,
        segments: 96,
      },
    );
  } else {
    const chipCanvas = document.createElement('canvas');
    chipCanvas.width = 124;
    chipCanvas.height = 82;
    chipContext = chipCanvas.getContext('2d');
    chipTexture = new THREE.CanvasTexture(chipCanvas);
    chipTexture.minFilter = THREE.NearestFilter;
    chipTexture.magFilter = THREE.NearestFilter;
    chipTexture.generateMipmaps = false;
    chipTexture.colorSpace = THREE.SRGBColorSpace;
    const chipMaterial = new THREE.SpriteMaterial({
      map: chipTexture,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    });
    const chipSprite = new THREE.Sprite(chipMaterial);
    chipSprite.scale.set(124, 82, 1);
    root.add(chipSprite);
  }

  const resize = () => {
    const rect = host.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);
    const aspect = width / height;
    const contentWidth = part === 'wheel' ? 150 : 144;
    const contentHeight = part === 'wheel' ? 150 : 96;
    const viewHeight = Math.max(contentHeight, contentWidth / aspect);
    const viewWidth = viewHeight * aspect;
    camera.left = viewWidth / -2;
    camera.right = viewWidth / 2;
    camera.top = viewHeight / 2;
    camera.bottom = viewHeight / -2;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  };
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();

  const applyChipSample = (sample) => {
    if (!chipContext || !chipTexture || !sample?.color) return;
    const nextCell = sample.cell || '';
    const paletteKey = sample.paletteKey || nextCell;
    if (paletteKey !== lastChipCell) {
      lastChipCell = paletteKey;
      source.drawMatchSculptureSamplesTexture(chipContext, {
        field: [sample.fieldUnit.x * 120, sample.fieldUnit.y * 80],
      }, false, { goalId: `match-${sample.shuffleTick || 0}` });
    }
    // The fixed lower-center swatch samples the wheel's untouched center color.
    chipContext.fillStyle = sample.color;
    chipContext.fillRect(46, 42, 31, 27);
    chipTexture.needsUpdate = true;
    host.dataset.samplerFrame = String(sample.frame);
    host.dataset.samplerCell = nextCell;
    host.dataset.samplerColor = sample.color;
    host.dataset.samplerPaletteKey = paletteKey;
    renderer.render(scene, camera);
  };
  if (!wheel) {
    samplerStore.listeners.add(applyChipSample);
    applyChipSample(samplerStore.last);
  }

  let frame = 0;
  let pausedAt = 0;
  if (!Number.isFinite(window.__resumeProfileSamplerStartedAt)) {
    window.__resumeProfileSamplerStartedAt = performance.now();
  }
  let startedAt = window.__resumeProfileSamplerStartedAt;
  const render = (now) => {
    const time = (now - startedAt) / 1000;
    fieldUnit.x = Math.max(0, Math.min(1, 0.5 + Math.cos(time * 1.08) * 0.34));
    fieldUnit.y = Math.max(0, Math.min(1, 0.5 + Math.sin(time * 0.82) * 0.32));
    const cell = `${Math.round(fieldUnit.x * 6) / 6}:${Math.round(fieldUnit.y * 5) / 5}`;
    const shuffleTick = Math.floor(time * 12);
    host.dataset.samplerFrame = String(Math.floor(time * 24));
    host.dataset.samplerCell = cell;

    if (wheel) {
      const centerColor = source.matchSculptureCieDisplayColorForFieldUnit(fieldUnit);
      const centerColorStyle = centerColor.getStyle();
      wheel.material.uniforms.uFieldUnit.value.set(fieldUnit.x, fieldUnit.y);
      wheel.material.uniforms.uCenterColor.value.copy(centerColor);
      host.dataset.samplerColor = centerColorStyle;
      profileContent?.style.setProperty(
        '--landing-profile-sampler-color',
        centerColorStyle,
      );
      samplerStore.last = {
        cell,
        color: centerColorStyle,
        fieldUnit: { x: fieldUnit.x, y: fieldUnit.y },
        frame: Math.floor(time * 24),
        paletteKey: `${cell}:${shuffleTick}`,
        shuffleTick,
      };
      samplerStore.listeners.forEach((listener) => listener(samplerStore.last));
    }

    renderer.render(scene, camera);
    frame = requestAnimationFrame(render);
  };
  frame = requestAnimationFrame(render);

  const onVisibility = () => {
    if (document.hidden) {
      pausedAt = performance.now();
      cancelAnimationFrame(frame);
      frame = 0;
    } else if (!frame) {
      startedAt += performance.now() - pausedAt;
      frame = requestAnimationFrame(render);
    }
  };
  document.addEventListener('visibilitychange', onVisibility);

  return () => {
    cancelAnimationFrame(frame);
    document.removeEventListener('visibilitychange', onVisibility);
    samplerStore.listeners.delete(applyChipSample);
    observer.disconnect();
    scene.traverse((object) => {
      object.geometry?.dispose?.();
      if (Array.isArray(object.material)) {
        object.material.forEach((material) => material.dispose?.());
      } else {
        object.material?.dispose?.();
      }
    });
    chipTexture?.dispose?.();
    renderer.dispose();
    host.replaceChildren();
  };
}

function LandingProfileInstrumentLink() {
  const svgRef = useRef(null);
  const lineRef = useRef(null);
  const startDotRef = useRef(null);
  const endDotRef = useRef(null);

  useEffect(() => {
    const svg = svgRef.current;
    const line = lineRef.current;
    const startDot = startDotRef.current;
    const endDot = endDotRef.current;
    const content = svg?.closest('.landing-profile__content');
    const chips = content?.querySelector('.landing-profile__instrument--chips');
    const wheel = content?.querySelector('.landing-profile__instrument--wheel');
    if (!svg || !line || !startDot || !endDot || !content || !chips || !wheel) return undefined;

    let frame = 0;
    const update = () => {
      frame = 0;
      const contentRect = content.getBoundingClientRect();
      const chipRect = chips.getBoundingClientRect();
      const wheelRect = wheel.getBoundingClientRect();
      const chipAspect = chipRect.width / Math.max(1, chipRect.height);
      const chipViewHeight = Math.max(96, 144 / chipAspect);
      const chipScale = chipRect.height / chipViewHeight;
      const x1 = wheelRect.left + wheelRect.width * 0.5 - contentRect.left;
      const y1 = wheelRect.top + wheelRect.height * 0.5 - contentRect.top;
      // In the 3x2 sample grid, slot 4 is the fixed current-color patch.
      // Its canvas-space center is (61.5, 55.5) inside the 124x82 sprite.
      const x2 = chipRect.left + chipRect.width * 0.5 - 0.5 * chipScale - contentRect.left;
      const y2 = chipRect.top + chipRect.height * 0.5 + 14.5 * chipScale - contentRect.top;
      line.setAttribute('x1', x1.toFixed(2));
      line.setAttribute('y1', y1.toFixed(2));
      line.setAttribute('x2', x2.toFixed(2));
      line.setAttribute('y2', y2.toFixed(2));
      startDot.setAttribute('cx', x1.toFixed(2));
      startDot.setAttribute('cy', y1.toFixed(2));
      endDot.setAttribute('cx', x2.toFixed(2));
      endDot.setAttribute('cy', y2.toFixed(2));
      svg.dataset.connectorStart = `${x1.toFixed(2)},${y1.toFixed(2)}`;
      svg.dataset.connectorEnd = `${x2.toFixed(2)},${y2.toFixed(2)}`;
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(content);
    observer.observe(chips);
    observer.observe(wheel);
    window.addEventListener('resize', schedule, { passive: true });
    document.fonts?.ready?.then(schedule).catch(() => {});
    schedule();
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', schedule);
    };
  }, []);

  return (
    <svg className="landing-profile__instrument-link" aria-hidden="true" ref={svgRef}>
      <line className="landing-profile__connector-line" ref={lineRef} />
      <circle ref={startDotRef} r="1.5" />
      <circle ref={endDotRef} r="1.5" />
    </svg>
  );
}

function BeautifulGameLoadingSummaryInstrument({ part }) {
  const hostRef = useRef(null);

  useEffect(() => {
    let dispose = () => {};
    let cancelled = false;
    const threeLoader = window.__loadThreeBundle || (() => window.__threePromise);
    Promise.resolve(threeLoader?.()).then((bundle) => {
      if (cancelled || !hostRef.current || !bundle?.THREE) return;
      dispose = mountProfileSamplerPart(hostRef.current, bundle.THREE, part);
    }).catch((error) => {
      console.error('[loading-summary] Beautiful Game sampler failed', error);
    });
    return () => {
      cancelled = true;
      dispose();
    };
  }, [part]);

  return (
    <div
      className={`landing-profile__instrument landing-profile__instrument--${part}`}
      data-instrument-part={part}
      aria-hidden="true"
      ref={hostRef}
    />
  );
}

function LandingProfileSection({ summaryOnly = false } = {}) {
  return (
    <section
      className={`landing-profile${summaryOnly ? ' landing-profile--summary-only' : ''}`}
      aria-labelledby="landing-profile-name"
    >
      <div className="landing-profile__content">
        {!summaryOnly && <LandingProfileInstrumentLink />}
        <div className="landing-profile__name-row">
          <h1
            className="landing-profile__name"
            id="landing-profile-name"
            aria-label="Tawfeeq Martin"
          >
            <span>Tawfeeq</span>
            <span>Martin</span>
          </h1>
          {!summaryOnly && <BeautifulGameLoadingSummaryInstrument part="chips" />}
        </div>
        <div className="landing-profile__story">
          <div className="landing-profile__copy">
            <p className="landing-profile__bio">
              Award-winning creative technologist with 20+ years defining and shipping
              products at the intersection of emerging technology and cinematic storytelling.
              Research and Development / StageCraft team at Industrial Light &amp; Magic.
              Previously Head of Creative Engineering / Creative Technology Director at The
              Mill, where I led 0-to-1 product
              development on landmark projects including Google Spotlight Stories ‘HELP’ (dir.
              Justin Lin) — a double Gold Cannes Lion–winning immersive 360° film — and was one
              of the inventors of Mill Stitch™ and the Mill Blackbird car rig. Independent
              developer of AI tools and generative creative systems.
            </p>
            {!summaryOnly && (
              <nav className="landing-profile__links" aria-label="Profile links">
                <a href={`mailto:${RESUME.email}`}>Email</a>
                <a href={RESUME.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
              </nav>
            )}
          </div>
          {!summaryOnly && <BeautifulGameLoadingSummaryInstrument part="wheel" />}
        </div>
      </div>
    </section>
  );
}

function LandingPageV1({ mobile = false }) {
  if (mobile) {
    return (
      <>
        <VariantStyles />
        <div className="landing-v1-shell landing-mobile-summary" data-mobile-summary="true">
          <div className="page landing-v1__page">
            <main>
              <LandingProfileSection summaryOnly />
              <LandingClosingCta linkedInOnly />
            </main>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <VariantStyles />
      <ScrollAudioLayers />
      <DoomOverlay />
      <div
        className="landing-v1-shell"
        data-believe-rest={CRT_INITIAL_BELIEVE_FRAME}
        data-overture-beat="boot"
        data-overture-breather="true"
        data-overture-resolve="false"
        data-overture-resolve-card="none"
        data-overture-boot="true"
      >
        <CrtZoom />
        <CompanionIntroGate />
        <CrtForeshadowSync />
        <div className="crt-frame" aria-hidden="true">
          <div className="crt-frame__screen" />
        </div>
        <div className="page landing-v1__page">
          <main>
            <LandingProfileSection />
            <section className="crt-enter">
              <div className="crt-enter__sticky">
                <section className="landing-v1__hero" aria-label="Interactive portfolio demo">
                  <CrtForeshadowField />
                  <VfxMarkerField />
                  <div className="landing-v1__demo">
                    <TvHero sources={TV_VIDEO_SOURCES} vocalSamples={ACTIVE_VOCAL_SAMPLE_SOURCES} />
                  </div>
                </section>
              </div>
              <div className="crt-content">
                <div className="crt-content__scroll">
                  <div className="landing-v1__featured-demos">
                    <HumanRaceFeature src={HUMAN_RACE_VIDEO_URL} poster={HUMAN_RACE_POSTER_URL} label="03 · SELECTED WORK · CHEVROLET THE HUMAN RACE" />
                    <LouisVuittonFeature src={LOUIS_VUITTON_SS20_VIDEO_URL} poster={LOUIS_VUITTON_SS20_POSTER_URL} label="04 · SELECTED WORK · LOUIS VUITTON SS20" />
                    <StrudelReplFeature label="05 · INTERACTIVE LAB · POETRY IN PROOF" />
                  </div>
                  <LandingProofHighlights />
                  <LandingAwards items={RESUME.awards} />
                  <LandingReferences items={RESUME.references} />
                  <LandingClosingCta />
                  <Footer data={RESUME} />
                </div>
              </div>
              {/* Offscreen source for the "About" channel: the full read-only
                  résumé, rasterized onto the glass and scrolled within the CRT. */}
              <div id="crt-about" className="crt-about-src" aria-hidden="true">
                <ReadOnlyResume mode="read-only" showModeToggle={false} />
              </div>
            </section>
          </main>
        </div>
      </div>
      <HelpFeature src={HELP_VIDEO_URLS} />
      <BlackbirdFeature
        innovationSrc={BLACKBIRD_INNOVATION_VIDEO_URL}
        behindScenesSrc={BLACKBIRD_VIDEO_URL}
      />
      <HandOfGodFeature src={HAND_OF_GOD_DEMO_URL} />
      <KissNewEraFeature src={KISS_NEW_ERA_VIDEO_URL} poster={KISS_NEW_ERA_POSTER_URL} />
      <LouisVuittonFeature
        id="louis-vuitton-ss20-after-kiss"
        src={LOUIS_VUITTON_SS20_VIDEO_URL}
        poster={LOUIS_VUITTON_SS20_POSTER_URL}
        label="07 · SELECTED WORK · LOUIS VUITTON SS20"
        mediaFirst
      />
      <LandingEndProof awards={RESUME.awards} references={RESUME.references} />
    </>
  );
}

// ── landing-v2: warm editorial dossier ──────────────────────────────
// The landing-v1 Macintosh (tabletop + CRT zoom) stays the main attraction,
// but the page around it becomes the DESIGN.md "Impossible to Repeatable"
// system — warm paper, Signal Blue mono kickers, serif display — and carries
// the complete Resume.html content below the hero. Structural class names
// (.landing-v1-shell, .crt-enter, .crt-frame, .crt-content) are kept so the
// CrtZoom driver and its CSS machinery work unchanged; .landing-v2-shell and
// .landing-v2__* hooks re-theme it from the landing-v2.html shell stylesheet.
function LandingPageV2() {
  return (
    <>
      <VariantStyles />
      <ScrollAudioLayers />
      <DoomOverlay />
      <div className="landing-v1-shell landing-v2-shell">
        <CrtZoom />
        <CompanionIntroGate />
        <div className="crt-frame" aria-hidden="true">
          <div className="crt-frame__screen" />
        </div>
        <div className="page landing-v1__page">
          <main>
            <section className="crt-enter">
              <div className="crt-enter__sticky">
                <section className="landing-v1__hero landing-v2__hero" aria-label="Interactive portfolio demo">
                  <header className="landing-v2__masthead">
                    <p className="landing-v2__kicker mono">Impossible to Repeatable</p>
                    <h1 className="landing-v2__name serif">
                      Tawfeeq Martin<span className="landing-v2__name-dot">.</span>
                    </h1>
                    <div className="landing-v2__meta mono" aria-label="Dossier metadata">
                      <span>Technical dossier &middot; v2</span>
                      <span>ILM &middot; The Mill &middot; Google ATAP</span>
                      <span>Creative technology &amp; AI</span>
                    </div>
                    <p className="landing-v2__summary serif">{LANDING_SUMMARY}</p>
                    <p className="landing-v2__cue mono" aria-hidden="true">Scroll into the Macintosh &darr;</p>
                  </header>
                  <div className="landing-v1__demo">
                    <TvHero sources={TV_VIDEO_SOURCES} vocalSamples={ACTIVE_VOCAL_SAMPLE_SOURCES} />
                  </div>
                </section>
              </div>
              <div className="crt-content">
                <div className="crt-content__scroll landing-v2__flow">
                  <Summary text={RESUME.summary} />
                  <Experience items={RESUME.experience} />
                  <div className="landing-v1__featured-demos landing-v2__demos">
                    <HelpIntroStage src={HELP_VIDEO_URLS} />
                    <BlackbirdFeature innovationSrc={BLACKBIRD_INNOVATION_VIDEO_URL} behindScenesSrc={BLACKBIRD_VIDEO_URL} label="03 · SELECTED WORK · THE MILL BLACKBIRD" />
                    <HumanRaceFeature src={HUMAN_RACE_VIDEO_URL} poster={HUMAN_RACE_POSTER_URL} label="04 · SELECTED WORK · CHEVROLET THE HUMAN RACE" />
                    <LouisVuittonFeature src={LOUIS_VUITTON_SS20_VIDEO_URL} poster={LOUIS_VUITTON_SS20_POSTER_URL} label="05 · SELECTED WORK · LOUIS VUITTON SS20" />
                    <StrudelReplFeature label="06 · LIVE SYSTEM · POETRY IN PROOF" />
                  </div>
                  <ProjectCard data={RESUME.project} />
                  <Awards items={RESUME.awards} />
                  <Skills groups={RESUME.skills} />
                  <Education items={RESUME.education} />
                  <References items={RESUME.references} />
                  <Footer data={RESUME} />
                </div>
              </div>
              {/* Offscreen source for the "About" channel: the full read-only
                  résumé, rasterized onto the glass and scrolled within the CRT. */}
              <div id="crt-about" className="crt-about-src" aria-hidden="true">
                <ReadOnlyResume mode="read-only" showModeToggle={false} />
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
}

function App() {
  const mobileResume = useMobileResumeMode();
  const [desktopMode, setDesktopMode] = useDesktopMode();
  const landingRoute = RESUME_APP_VARIANT === 'landing-v1';
  const landingV2Route = RESUME_APP_VARIANT === 'landing-v2';
  const resumeRoute = RESUME_APP_VARIANT === 'resume';
  const interactiveMode = ((landingRoute || landingV2Route) && !mobileResume)
    || (!resumeRoute && !mobileResume && desktopMode !== 'read-only');
  useHelpMediaWarmup(interactiveMode);

  useEffect(() => {
    const switchToPrintResume = () => {
      if (mobileResume) return;
      const apply = () => setDesktopMode('read-only');
      if (ReactDOM.flushSync) ReactDOM.flushSync(apply);
      else apply();
    };
    window.addEventListener('beforeprint', switchToPrintResume);
    return () => window.removeEventListener('beforeprint', switchToPrintResume);
  }, [mobileResume, setDesktopMode]);

  if (resumeRoute) {
    if (mobileResume) return <MobileResume />;
    return (
      <>
        <VariantStyles />
        <ReadOnlyResume
          mode="read-only"
          showModeToggle={false}
          navSlot={<VersionRouteNav current="resume" />}
        />
      </>
    );
  }

  if (landingRoute) return <LandingPageV1 mobile={mobileResume} />;
  if (landingV2Route) return <LandingPageV2 />;

  if (mobileResume) return <MobileResume />;
  if (desktopMode === 'read-only') {
    return <ReadOnlyResume mode={desktopMode} onModeChange={setDesktopMode} />;
  }

  return (
    <>
      <ScrollAudioLayers />
      <DoomOverlay />
      <div className="page">
        <TopStrip data={RESUME} />
        <div className="site-mode-toggle-row">
          <DesktopModeToggle mode={desktopMode} onModeChange={setDesktopMode} />
        </div>
        <div className="hero-stack">
          <div className="hero-stack__intro">
            <h1 className="hero-lead">
              <span className="hero-lead__name">Tawfeeq Martin.</span>
            </h1>
          </div>
          <aside className="hero-stack__sticky">
            <TvHero sources={TV_VIDEO_SOURCES} vocalSamples={ACTIVE_VOCAL_SAMPLE_SOURCES} />
          </aside>
          <div className="hero-stack__flow">
            <Summary text={RESUME.summary} />
            <Experience items={RESUME.experience} />
          </div>
        </div>
        <HelpFeature src={HELP_VIDEO_URLS} />
        <BlackbirdFeature innovationSrc={BLACKBIRD_INNOVATION_VIDEO_URL} behindScenesSrc={BLACKBIRD_VIDEO_URL} />
        <HumanRaceFeature src={HUMAN_RACE_VIDEO_URL} poster={HUMAN_RACE_POSTER_URL} />
        <LouisVuittonFeature src={LOUIS_VUITTON_SS20_VIDEO_URL} poster={LOUIS_VUITTON_SS20_POSTER_URL} />
        <StrudelReplFeature />
        <ProjectCard data={RESUME.project} />
        <Awards items={RESUME.awards} />
        <Skills groups={RESUME.skills} />
        <Education items={RESUME.education} />
        <References items={RESUME.references} />
        <Footer data={RESUME} />
      </div>
    </>
  );
}

setupTabTitle();
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
