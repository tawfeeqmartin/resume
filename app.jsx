const PRODUCTION_MEDIA_ORIGIN = "https://media.tawfeeqmartin.com";
const IS_LOCAL_PREVIEW = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname);
const ENABLE_LOCAL_VOICE_OVER = IS_LOCAL_PREVIEW;
const mediaUrl = (path) => {
  if (IS_LOCAL_PREVIEW) return path;
  return `${PRODUCTION_MEDIA_ORIGIN}/${path.replace(/^media\//, '')}`;
};
const sameOriginMediaUrl = (path) => path;
const withCacheKey = (url, key) => `${url}${url.includes('?') ? '&' : '?'}v=${key}`;
const TV_CLIP_CACHE_KEY = '20260522-bass-track-no-laugh';
const VOCAL_SAMPLE_CACHE_KEY = '20260522-vocal-rotation-no-laugh';
const SITE_MODE_STORAGE_KEY = 'resume.desktop.mode';
const IS_MOBILE_MEDIA_TARGET = window.matchMedia('(max-width: 900px), (pointer: coarse)').matches;
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
const MOBILE_RESUME_QUERY = '(max-width: 760px), (pointer: coarse)';

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
function TopStrip({ data }) {
  return (
    <header className="identity">
      <div className="identity__top mono dim">
        <span>Creative Technologist</span>
        <span className="identity__top-dot identity__top-dot--circle" aria-hidden="true"></span>
        <span>{data.location}</span>
        <span className="identity__top-dot identity__top-dot--square" aria-hidden="true"></span>
        <a href="https://www.linkedin.com/in/tawfeeq-martin-82991a14/" target="_blank" rel="noreferrer">LinkedIn</a>
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
Awards = function Awards({ items }) {
  // Every gold gets hero treatment. Silver + honor compress into the list.
  const featured = items.filter((a) => a.tier === 'gold');
  const rest = items.filter((a) => a.tier !== 'gold');
  return (
    <Section id="awards" label="06 · AWARDS & RECOGNITION">
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
      name: "Google Spotlight Stories 'HELP'",
      meta: "Mill Stitch™ · immersive 360° production",
      body: "Co-invented and led the on-set technology for a real-time 360° preview pipeline that let Justin Lin direct surround action live during principal photography.",
      stack: ["Cannes Gold", "SXSW Gold", "Webby Technical Achievement"],
    },
    {
      name: "The Mill Blackbird",
      meta: "technical product management · production innovation",
      body: "Led technical product management across hardware, on-set workflow, and CG pipeline for an adjustable vehicle rig that could represent multiple production cars in post.",
      stack: ["HPA Judges Award", "Cannes Gold", "CLIO Production Innovation"],
    },
    {
      name: "Poetry in Proof",
      meta: "browser audio-visual system · Web MIDI",
      body: "A live-code and interaction prototype where Strudel audio events drive page motion, source-code highlights, MIDI lanes, and reactive visual states from one shared clock.",
      stack: ["Strudel", "Web MIDI", "React", "Three.js"],
    },
    {
      name: project.name,
      meta: project.sub,
      body: project.body,
      stack: project.stack,
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
        {items.map((item) => (
          <li key={item.name} className="mobile-reference">
            <div>
              <div className="mobile-reference__name">{item.name}</div>
              <div className="mobile-reference__title mono">{item.title}</div>
              {item.sub && <div className="mobile-reference__sub mono">{item.sub}</div>}
              <blockquote className="mobile-reference__quote serif">{item.quote}</blockquote>
            </div>
          </li>
        ))}
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

function ReadOnlyResume({ mode, onModeChange }) {
  useEffect(() => {
    const engine = getResumeAudioEngine?.();
    if (engine?.enabled) engine.setEnabled(false).catch(() => {});
  }, []);

  return (
    <div className="page page--read-only-resume">
      <TopStrip data={RESUME} />
      <div className="site-mode-toggle-row">
        <DesktopModeToggle mode={mode} onModeChange={onModeChange} />
      </div>
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

function App() {
  const mobileResume = useMobileResumeMode();
  const [desktopMode, setDesktopMode] = useDesktopMode();
  const interactiveMode = !mobileResume && desktopMode !== 'read-only';
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

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
