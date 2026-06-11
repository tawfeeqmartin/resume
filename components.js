/* eslint-disable */
const { useState, useEffect, useLayoutEffect, useRef, useMemo } = React;

const AUDIO_BPM = 96;
const AUDIO_SIXTEENTH_MS = 60000 / AUDIO_BPM / 4;
const TITLE_BEATS = 24;
const PAGE_DWELL_TAIL_STEPS = 0;

// Default song source — shared verbatim between the audio engine (which
// evaluates it through Strudel) and the live-code REPL panel (which
// displays + highlights it). Keeping the strings identical lets the
// REPL map hap source-positions directly to display positions for the
// strudel.cc-style active-token highlights.
const POETRY_IN_PROOF_SOURCE = `// "Poetry in Proof"
setcpm(153 / 4);
const T = globalThis.__resumeLaneTriggers;

const padChorus = note("<[f4 d4 a3 f4 d4 a3 f4 d4] [e4 c4 a3 e4 c4 a3 e4 c4]>")
  .s("sawtooth").vibrato(7, 0.45).lpf(850)
  .room(0.85).sz(0.95).gain(0.35)
  .onTrigger(T.harmonyChord, false);

const leadIntro = note("<[~ d5 ~ d5 ~ g5 ~ ~] [~ e5 ~ ~ ~ a5 g5 ~]>")
  .s("triangle").legato(1.7).vibrato(6, 0.35)
  .lpf(sine.range(1100, 2500).slow(4))
  .room(0.85).sz(0.95).gain(0.72)
  .onTrigger(T.melodyLead, false);

const leadChorus = note("<[~ f5 ~ d5 ~ g5 ~ ~] [~ e5 ~ c5 ~ a5 g5 ~]>")
  .s("triangle").legato(1.7).vibrato(6, 0.35)
  .lpf(sine.range(1100, 2500).slow(4))
  .room(0.85).sz(0.95).gain(0.72)
  .onTrigger(T.melodyLead, false);

const leadVerse = note("<[~ ~ ~ f5 ~ d5 ~ g5] [~ ~ ~ e5 ~ c5 ~ a5]>")
  .s("triangle").legato(1.7).vibrato(5, 0.3)
  .lpf(sine.range(1200, 2300).slow(4))
  .room(0.85).sz(0.95).gain(0.65)
  .onTrigger(T.melodyLead, false);

const leadPreChorus = note("<[~ ~ ~ f5 ~ d5 ~ g5] [~ ~ ~ e5 ~ c5 ~ a5]>")
  .s("triangle").legato(1.6).vibrato(5, 0.25).lpf(1800)
  .room(0.85).sz(0.95).gain(0.68)
  .onTrigger(T.melodyLead, false);

const padPreChorus = note("<[f4 d4 a3 f4 d4 a3 f4 d4] [e4 c4 a3 e4 c4 a3 e4 c4]>")
  .s("sawtooth").vibrato(7, 0.45)
  .lpf("<400 600 800 1200>")
  .room(0.85).sz(0.95).gain(0.38)
  .onTrigger(T.harmonyChord, false);

const padBreak = note("<[f4 d4 a3 f4 d4 a3 f4 d4] [e4 c4 a3 e4 c4 a3 e4 c4]>")
  .s("sawtooth").vibrato(7, 0.4).lpf(550)
  .room(0.9).sz(0.95).gain(0.25)
  .onTrigger(T.harmonyChord, false);

const leadBreak = note("<[d3 ~ a3 ~] [a2 ~ e3 ~]>")
  .s("triangle").vibrato(4, 0.3).legato(2.0)
  .delay(0.125).lpf(800).room(0.9).sz(0.95).gain(0.55)
  .onTrigger(T.melodyLead, false);

const subBass = note("<[d1 ~ ~ d1 ~ d1 ~ ~] [c1 ~ ~ c1 ~ ~ ~ c2]>")
  .s("sawtooth").legato(1.8).slide(2.2)
  .adsr(0.01, 1.2, 0.95, 0.5).distort(0.4).lpf(130).gain(1.3)
  .onTrigger(T.bassBass, false);

const outroBass = note("<d1 a0>").s("sine")
  .adsr(0.4, 1.0, 0.8, 0.4).lpf(90).gain(0.95)
  .onTrigger(T.bassBass, false);

const kick = s("<[bd ~ ~ bd ~ bd ~ ~] [bd ~ ~ bd ~ ~ ~ ~]>")
  .bank("RolandTR808").gain(0.95)
  .onTrigger(T.drumKick, false);

const clapChorus = s("~ ~ ~ ~ cp ~ ~ ~")
  .bank("RolandTR808").coarse(2).gain(1.45)
  .onTrigger(T.drumSnare, false);

const clapVerse = s("~ ~ ~ ~ cp ~ ~ ~")
  .bank("RolandTR808").coarse(2).gain(1.1)
  .onTrigger(T.drumSnare, false);

const hatChorus = s("<[hh hh hh [hh*3] hh hh [hh*2] hh] [hh [hh*3] hh hh hh hh hh*4 ~]>")
  .bank("RolandTR808").fast(2).lpf(4500)
  .gain("<0.45 0.25 0.5 0.35>")
  .onTrigger(T.drumHat, false);

const hatVerse = s("hh hh hh hh")
  .bank("RolandTR808").fast(2).lpf(4000).gain(0.3)
  .onTrigger(T.drumHat, false);

const intro      = stack(padChorus, leadIntro);
const chorus     = stack(padChorus, leadChorus, subBass, kick, clapChorus, hatChorus);
const verse      = stack(padChorus, leadVerse, subBass, clapVerse, hatVerse);
const preChorus  = stack(padPreChorus, leadPreChorus);
const breakdown  = stack(padBreak, leadBreak, outroBass);

arrange(
  [4, intro],
  [8, chorus],
  [8,  verse],
  [4,  preChorus],
  [8, chorus],
  [8,  breakdown]
)._scope()`;

const POETRY_IN_PROOF_STORAGE_VERSION = 'v8-mac-live-cuts';
const POETRY_IN_PROOF_SOURCE_STORAGE_KEY = `resume.poetryInProofSource.${POETRY_IN_PROOF_STORAGE_VERSION}`;
const POETRY_IN_PROOF_DRAFT_STORAGE_KEY = `resume.poetryInProofDraft.${POETRY_IN_PROOF_STORAGE_VERSION}`;
const POETRY_IN_PROOF_LAST_GOOD_STORAGE_KEY = `resume.poetryInProofLastGood.${POETRY_IN_PROOF_STORAGE_VERSION}`;

function readStoredPoetryInProofSource(key) {
  try {
    const stored = window.localStorage?.getItem(key);
    return stored && stored.trim() ? stored : '';
  } catch {
    return '';
  }
}

function getStoredPoetryInProofSource() {
  return readStoredPoetryInProofSource(POETRY_IN_PROOF_SOURCE_STORAGE_KEY)
    || readStoredPoetryInProofSource(POETRY_IN_PROOF_LAST_GOOD_STORAGE_KEY)
    || POETRY_IN_PROOF_SOURCE;
}

function getStoredPoetryInProofDraftSource() {
  return readStoredPoetryInProofSource(POETRY_IN_PROOF_DRAFT_STORAGE_KEY)
    || getStoredPoetryInProofSource();
}

function getStoredPoetryInProofLastGoodSource() {
  return readStoredPoetryInProofSource(POETRY_IN_PROOF_LAST_GOOD_STORAGE_KEY)
    || POETRY_IN_PROOF_SOURCE;
}

function writePoetryInProofStorage(key, source, label) {
  try {
    window.localStorage?.setItem(key, source);
  } catch (error) {
    console.warn(`Unable to save Strudel ${label}`, error);
  }
}

function savePoetryInProofSource(source) {
  writePoetryInProofStorage(POETRY_IN_PROOF_SOURCE_STORAGE_KEY, source, 'source');
}

function savePoetryInProofDraftSource(source) {
  writePoetryInProofStorage(POETRY_IN_PROOF_DRAFT_STORAGE_KEY, source, 'draft');
}

function savePoetryInProofLastGoodSource(source) {
  writePoetryInProofStorage(POETRY_IN_PROOF_LAST_GOOD_STORAGE_KEY, source, 'last-good source');
}

function resetStoredPoetryInProofSource() {
  try {
    window.localStorage?.removeItem(POETRY_IN_PROOF_SOURCE_STORAGE_KEY);
    window.localStorage?.removeItem(POETRY_IN_PROOF_DRAFT_STORAGE_KEY);
    window.localStorage?.removeItem(POETRY_IN_PROOF_LAST_GOOD_STORAGE_KEY);
  } catch {}
}

const RESUME_PAGE_ACTIVITY_CHANNEL = 'resume-page-activity-v1';
const RESUME_PAGE_ACTIVITY_STORAGE_KEY = 'resume.page.activeOwner.v1';

function createResumePageActivityCoordinator() {
  const instanceId = `resume-page-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  let ownerId = instanceId;
  let ownerAt = 0;
  let active = !document.hidden;
  let channel = null;
  try {
    if ('BroadcastChannel' in window) {
      channel = new BroadcastChannel(RESUME_PAGE_ACTIVITY_CHANNEL);
    }
  } catch {}

  const dispatch = (reason) => {
    window.dispatchEvent(new CustomEvent('resume-page-activity-change', {
      detail: { active, reason, instanceId, ownerId },
    }));
  };
  const setActive = (next, reason) => {
    const normalized = Boolean(next && !document.hidden);
    if (active === normalized) return;
    active = normalized;
    dispatch(reason);
  };
  const broadcast = (message) => {
    const payload = { ...message, source: 'resume-page-activity', nonce: Math.random() };
    try { channel?.postMessage(payload); } catch {}
    try { window.localStorage?.setItem(RESUME_PAGE_ACTIVITY_STORAGE_KEY, JSON.stringify(payload)); } catch {}
  };
  const claim = (reason = 'claim') => {
    if (document.hidden) {
      setActive(false, 'hidden');
      return;
    }
    ownerId = instanceId;
    ownerAt = Date.now();
    setActive(true, reason);
    broadcast({ type: 'claim', id: instanceId, at: ownerAt, reason });
  };
  const release = (reason = 'release') => {
    if (ownerId === instanceId) {
      broadcast({ type: 'release', id: instanceId, at: Date.now(), reason });
    }
    setActive(false, reason);
  };
  const handleMessage = (message) => {
    if (!message || message.source !== 'resume-page-activity') return;
    if (message.id === instanceId) return;
    if (message.type === 'claim') {
      const messageAt = Number(message.at) || Date.now();
      if (messageAt >= ownerAt) {
        ownerId = message.id;
        ownerAt = messageAt;
        setActive(false, 'claimed-by-another-tab');
      }
      return;
    }
    if (message.type === 'release' && ownerId === message.id) {
      ownerId = '';
      ownerAt = 0;
      if (!document.hidden) {
        window.setTimeout(() => {
          if (!document.hidden && ownerId !== instanceId) claim('claim-after-release');
        }, 140);
      }
    }
  };
  const onStorage = (event) => {
    if (event.key !== RESUME_PAGE_ACTIVITY_STORAGE_KEY || !event.newValue) return;
    try { handleMessage(JSON.parse(event.newValue)); } catch {}
  };
  const onVisibility = () => {
    if (document.hidden) release('hidden');
    else claim('visible');
  };
  const onPageHide = () => release('pagehide');

  if (channel?.addEventListener) {
    channel.addEventListener('message', (event) => handleMessage(event.data));
  } else if (channel) {
    channel.onmessage = (event) => handleMessage(event.data);
  }
  window.addEventListener('storage', onStorage);
  document.addEventListener('visibilitychange', onVisibility);
  document.addEventListener('freeze', onPageHide);
  window.addEventListener('pagehide', onPageHide);
  window.addEventListener('focus', () => claim('focus'));
  window.addEventListener('pageshow', () => claim('pageshow'));
  window.addEventListener('pointerdown', () => claim('pointer'), true);
  window.addEventListener('keydown', () => claim('keyboard'), true);
  window.setTimeout(() => claim('init'), 0);

  return {
    id: instanceId,
    get active() { return Boolean(active && !document.hidden && ownerId === instanceId); },
    claim,
    release,
  };
}

function getResumePageActivity() {
  if (!window.__resumePageActivity) {
    window.__resumePageActivity = createResumePageActivityCoordinator();
  }
  return window.__resumePageActivity;
}

function isResumePageActive() {
  return getResumePageActivity().active;
}

window.__resumeIsPageActive = isResumePageActive;

function getResumeStrudelAudioEngine() {
  if (window.__resumeStrudelAudioEngine) return window.__resumeStrudelAudioEngine;

  let strudel = null;
  let initPromise = null;
  let enabled = false;
  let keyboardBound = false;
  let songIndex = 0;
  let activeWASD = '';
  let activeChordKey = '';
  let currentAutoplayChordKey = '';
  let chordReturnTimer = null;
  let playGeneration = 0;
  let arrangementStartedAtMs = 0;
  let bassTriggerId = 0;
  let melodyTriggerId = 0;
  let drumTriggerId = 0;
  let harmonyTriggerId = 0;
  let videoDucked = false;
  let videoDuckedWasEnabled = false;
  let videoResumeTimer = null;
  const activeVideoAudioIds = new Set();
  let scrollTransitionToken = 0;
  let scrollTransitionTimers = [];
  let midiAccess = null;
  let midiOutput = null;
  let midiInput = null;
  let midiInputName = '';
  let midiOutputEnabled = false;
  const midiInputStats = {
    accepted: 0,
    dropped: 0,
    systemDropped: 0,
    unmappedDropped: 0,
    floodDropped: 0,
    windowStartedAt: 0,
    windowCount: 0,
  };
  const liveChordVoices = new Map();
  const stemMutes = { drums: false, harmony: false, melody: false };
  const mixSettings = {
    master: 1.4,
    kick: 1.14,
    snare: 0.58,
    hats: 0.39,
    perc: 0.51,
    chords: 1.04,
    bass: 1.42,
    lead: 0.7,
    sidechain: 1.8,
  };
  const mixChannelState = {
    mute: {},
    solo: {},
  };
  const scrollLayerState = {
    drums: 1,
    harmony: 1,
    melody: 1,
  };
  const mixChannels = ['kick', 'snare', 'hats', 'perc', 'chords', 'bass', 'lead'];
  // Per-lane mixer state for composition songs (where the audio source is
  // a fixed Strudel string instead of going through makePattern). The
  // REPL panel reads/writes these to drive mute/solo/level. The lane ids
  // mirror SCENE_MIDI_MAP keys so the UI can address them by the same
  // name everywhere.
  const composeLanes = ['chord', 'lead', 'bass', 'kick', 'snare', 'hat'];
  // Map a lane id to the trigger name the composition uses on its
  // .onTrigger(T.X, false) call, so the gain rewriter can find each
  // lane's stage in the source.
  const COMPOSE_LANE_TRIGGERS = {
    chord: 'harmonyChord',
    lead: 'melodyLead',
    bass: 'bassBass',
    kick: 'drumKick',
    snare: 'drumSnare',
    hat: 'drumHat',
  };
  const composeMix = {
    levels: Object.fromEntries(composeLanes.map((l) => [l, 1])),
    mutes:  Object.fromEntries(composeLanes.map((l) => [l, false])),
    solos:  Object.fromEntries(composeLanes.map((l) => [l, false])),
  };
  const VISUAL_SYNC_AHEAD_MS = 36;
  const ARRANGEMENT_SECTIONS = [
    { name: 'intro', cycles: 4 },
    { name: 'chorus', cycles: 8 },
    { name: 'verse', cycles: 8 },
    { name: 'preChorus', cycles: 4 },
    { name: 'chorus', cycles: 8 },
    { name: 'breakdown', cycles: 8 },
  ];
  const ARRANGEMENT_TOTAL_CYCLES = ARRANGEMENT_SECTIONS.reduce((sum, section) => sum + section.cycles, 0);
  const clearScrollTransitionTimers = () => {
    scrollTransitionTimers.forEach((timer) => window.clearTimeout(timer));
    scrollTransitionTimers = [];
  };
  const MIX_STORAGE_KEY = 'resume.audioMix.v1';
  const persistMixState = () => {
    try {
      window.localStorage?.setItem(MIX_STORAGE_KEY, JSON.stringify({
        mix: mixSettings,
        channels: mixChannelState,
      }));
    } catch (error) {
      console.warn('Unable to save audio mix state', error);
    }
  };
  const hydrateMixState = () => {
    try {
      const raw = window.localStorage?.getItem(MIX_STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved?.mix && typeof saved.mix === 'object') {
        Object.keys(mixSettings).forEach((key) => {
          if (saved.mix[key] !== undefined) mixSettings[key] = Math.max(0, Math.min(2, Number(saved.mix[key]) || 0));
        });
      }
      if (saved?.channels?.mute && typeof saved.channels.mute === 'object') {
        mixChannelState.mute = { ...saved.channels.mute };
      }
      if (saved?.channels?.solo && typeof saved.channels.solo === 'object') {
        mixChannelState.solo = { ...saved.channels.solo };
      }
    } catch (error) {
      console.warn('Unable to load audio mix state', error);
    }
  };
  hydrateMixState();
  const WASD_RELEASE_REST = '__wasd_release_rest__';
  const SCENE_MIDI_MAP = {
    kick: { channel: 1, note: 36, group: 'drums', label: 'kick' },
    snare: { channel: 2, note: 38, group: 'drums', label: 'snare' },
    hat: { channel: 3, note: 42, group: 'drums', label: 'closed hat' },
    perc: { channel: 4, note: 39, group: 'drums', label: 'perc' },
    bass: { channel: 5, note: 36, group: 'bass', label: 'bass' },
    chord: { channel: 6, note: 48, group: 'harmony', label: 'autochord' },
    wasdChord: { channel: 7, note: 52, group: 'harmony', label: 'wasd chord' },
    chop: { channel: 8, note: 72, group: 'melody', label: 'chop' },
    lead: { channel: 9, note: 76, group: 'melody', label: 'lead' },
    lift: { channel: 10, note: 79, group: 'melody', label: 'lift' },
    angel: { channel: 11, note: 84, group: 'melody', label: 'angel' },
    build: { channel: 12, note: 67, group: 'melody', label: 'build' },
    switch: { channel: 13, note: 71, group: 'melody', label: 'switch' },
    ghost: { channel: 14, note: 74, group: 'melody', label: 'ghost' },
    dust: { channel: 15, note: 96, group: 'melody', label: 'dust' },
    vocal: { channel: 16, note: 60, group: 'vocal', label: 'vocal chop' },
  };
  const phraseSteps = 32;
  const songPresets = [
    {
      name: 'halftime trap',
      bpm: 153,
      root: { name: 'Dm / Am — halftime trap' },
      // WASD labels kept so chord-key dispatch + label inference don't
      // throw; the actual audio is fixed by `composition`, so disableWasd
      // skips the re-evaluate path on key presses.
      wasd: ['Dm', 'Am', 'Dm', 'Am'],
      disableWasd: true,
      // Full Strudel source. Bypasses makePattern: evaluated directly so
      // the user's intro/chorus arrangement plays as written. onTrigger
      // hooks attach the lane handlers the hero choreography reads from.
      composition: getStoredPoetryInProofSource(),
      visual: {
        typeSteps: 1,
        cursorSteps: 1.5,
        wordSteps: 2,
        lineSteps: 2,
        drawSteps: 8,
        pageSteps: 32,
        stemPulseSteps: 4,
      },
    },
    {
      name: 'rain garage',
      bpm: 126,
      root: { name: 'F minor' },
      wasd: ['[f3,ab3,c4,eb4,g4]', '[db3,f3,ab3,c4]', '[ab2,c3,eb3,g3]', '[eb3,ab3,bb3,db4]'],
      kick: '[f1 ~ ~ f1] [~ ~ f1 ~]',
      clap: '~ ab3 ~ ab3',
      hats: 'white*16',
      perc: '~ pink ~ [pink white] ~ pink ~ [pink ~]',
      bass: 'f1 ~ [f1 c2] ~ db2 ~ ~ c2 ab1 ~ [c2 eb2] ~ eb2 ~ c2 ~',
      chord: '[[f3,ab3,c4,eb4,g4] ~ ~ [f3,ab3,c4,eb4,g4]] [~ [db3,f3,ab3,c4] ~ ~] [[ab2,c3,eb3,g3] ~ [eb3,ab3,bb3,db4] ~] [~ ~ [eb3,ab3,bb3,db4] ~]',
      chop: '[~ c5 eb5 f5] [ab5 ~ eb5 c5] [~ f5 f5 ab5] [c6 ~ bb5 ab5]',
      lift: '[~ ~ ab5 c6] [bb5 ab5 f5 ~] [~ eb5 f5 ab5] [c6 eb6 ~ bb5]',
      bassGain: 0.1,
      chordGain: 0.13,
      chordLpf: 1550,
      chopGain: 0.075,
      liftGain: 0.05,
      kickVoice: 'sine").gain(1.28).attack(0.001).decay(0.13).sustain(0).release(0.025).lpf(140).distort(0.08',
      clapVoice: 'pink").gain(0.62).attack(0.002).decay(0.065).sustain(0).release(0.05).hpf(1200).lpf(6200).room(0.22',
      hatVoice: 'white").gain(0.32).attack(0.001).decay(0.02).sustain(0).release(0.01).hpf(7200',
      percVoice: 'pink").gain(0.26).attack(0.001).decay(0.035).sustain(0).release(0.018).hpf(2600).lpf(7200).room(0.12',
      bassVoice: 'sine").gain(0.16).attack(0.004).decay(0.15).sustain(0).release(0.08).lpf(160).distort(0.18',
      chordVoice: 'supersaw").attack(0.035).decay(0.34).sustain(0.2).release(0.42).unison(5).spread(0.42).detune(0.04).room(0.38).shape(0.08',
      chopVoice: 'triangle").attack(0.003).decay(0.07).sustain(0).release(0.055).hpf(520).lpf(2300).delay(0.1).delaytime(0.1875).delayfeedback(0.18).vowel("a"',
      liftVoice: 'sine").attack(0.03).decay(0.22).sustain(0.05).release(0.28).hpf(650).lpf(3600).room(0.22).vib(4).vibmod(0.06',
      visual: {
        typeSteps: 1,
        cursorSteps: 2,
        wordSteps: 3,
        lineSteps: 2,
        drawSteps: 10,
        pageSteps: 40,
        stemPulseSteps: 4,
      },
    },
    {
      name: 'trap cathedral',
      bpm: 72,
      root: { name: 'C minor' },
      wasd: ['Ab^7', 'Fm9', 'Gm7', 'Cm9'],
      kick: 'c1 ~ ~ ~ c1 ~ c1 ~ c1 ~ ~ ~ c1 ~ ~ c1',
      clap: '~ g3 ~ g3',
      hats: 'white ~ white [white white] ~ white ~ white white ~ white ~ [white white] ~ white ~',
      perc: '~ ~ brown ~ [~ pink] ~ ~ white ~ ~ brown ~ ~ ~ pink ~',
      kick808: 'bd ~ ~ ~ bd ~ bd ~ bd ~ ~ ~ bd ~ ~ bd',
      snare808: '~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~',
      hats808: 'hh ~ hh [hh hh] ~ hh ~ hh hh ~ hh ~ [hh hh] ~ hh ~',
      perc808: '~ ~ ~ cp ~ ~ ~ ~ ~ cp ~ ~ ~ ~ ~ ~',
      bass: 'ab1 ~ ab1 ~ f1 ~ f1 ~ g1 ~ g1 ~ c2 ~ c2 ~ ab1 ~ c2 ~ f1 ~ ab1 ~ g1 ~ bb1 ~ c2 ~ g1 ~',
      chord: '<Ab^7 Fm9 Gm7 Cm9 Ab^7 Fm9 Gm7 Cm9>',
      chop: '~',
      lift: 'c5 ~ ~ ~ bb4 ~ ~ ~ ab4 ~ g4 ~ ~ eb5 ~ ~ c5 ~ ~ ~ d5 ~ ~ ~ eb5 ~ d5 ~ ~ c5 ~ ~',
      halo: 'c5 ~ eb5 ~ g5 ~ bb5 ~ ab5 ~ g5 ~ eb5 ~ d5 ~',
      angel: '~ ~ ~ ~ ~ ~ ~ ~ g6 ~ ~ ~ f6 ~ eb6 ~ ~ ~ ~ ~ ~ ~ ~ ~ bb6 ~ ab6 ~ g6 ~ ~ ~',
      build: '~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ eb5 ~ ~ g5 ~ bb5 ~ ~ c6 ~ bb5 ~ g5 ~ ~ ~',
      switch: '~ ~ ~ ~ ~ ~ ~ ~ c6 ~ bb5 ~ ab5 ~ g5 ~ ~ ~ eb5 ~ f5 ~ g5 ~ ~ c6 ~ bb5 ~ g5 ~ ~ ~',
      ghost: '~ ~ ~ ~ c6 ~ ~ ~ ~ bb5 ~ ~ ~ ab5 ~ g5 ~ ~ ~ ~ ~ ~ eb5 ~ ~ ~ f5 ~ g5 ~ ~ ~',
      dust: '~ c7 ~ ~ ~ ~ bb6 ~ ~ ~ ~ ~ ab6 ~ ~ ~ ~ g6 ~ ~ ~ ~ eb6 ~ ~ ~ ~ ~ f6 ~ ~ ~',
      bassGain: 0.07,
      chordGain: 0.065,
      chordLpf: 1250,
      chopGain: 0.012,
      liftGain: 0.092,
      wasdGain: 0.052,
      wasdLpf: 1350,
      kickVoice: 'sine").gain(1.42).attack(0.001).decay(0.2).sustain(0).release(0.04).lpf(115).distort(0.18',
      clapVoice: 'white").gain(0.82).attack(0.001).decay(0.11).sustain(0).release(0.08).hpf(760).lpf(4300).room(0.3)',
      hatVoice: 'white").gain(0.22).attack(0.001).decay(0.018).sustain(0).release(0.01).hpf(6900',
      percVoice: 'brown").gain(0.18).attack(0.002).decay(0.07).sustain(0).release(0.035).hpf(1500).lpf(5200).room(0.18',
      bassVoice: 'square").gain(0.22).attack(0.006).decay(0.32).sustain(0.08).release(0.12).lpf(180).distort(0.28',
      chordVoice: 'supersaw").attack(0.12).decay(0.45).sustain(0.24).release(0.85).unison(6).spread(0.5).detune(0.035).room(0.55).shape(0.04',
      chopVoice: 'triangle").attack(0.012).decay(0.18).sustain(0).release(0.18).hpf(420).lpf(1700).room(0.16',
      liftVoice: 'supersaw").attack(0.08).decay(0.34).sustain(0.09).release(0.48).hpf(620).lpf(2600).unison(3).spread(0.25).room(0.38',
      visual: {
        typeSteps: 1,
        cursorSteps: 1.5,
        wordSteps: 2,
        lineSteps: 2,
        drawSteps: 8,
        pageSteps: 32,
        stemPulseSteps: 4,
      },
    },
    {
      name: 'midi-llm voiced',
      bpm: 74,
      root: { name: 'D minor / generated MIDI' },
      wasd: ['Dm9', 'Fmaj7', 'Cadd9', 'Gm9'],
      midiLlm: true,
      kick: 'bd ~ ~ ~ ~ ~ bd ~ bd ~ ~ ~ ~ ~ bd ~',
      clap: '~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~',
      hats: 'hh ~ hh [hh hh] ~ hh ~ hh hh ~ hh ~ [hh hh] ~ hh ~',
      perc: '~ ~ ~ cp ~ ~ ~ ~ ~ cp ~ ~ ~ ~ cp ~',
      bass: 'd1 ~ ~ ~ d1 ~ g1 ~ a1 ~ ~ ~ c2 ~ d2 ~ d1 ~ ~ ~ f1 ~ g1 ~ a1 ~ c2 ~ d2 ~ ~ ~',
      chord: '<Dm9 Fmaj7 Cadd9 Gm9 Dm9 Fmaj7 Am7 Gm9>',
      lift: '~ ~ ~ [a3,a4] ~ ~ [g4,g3] ~ ~ ~ ~ ~ ~ [f4,f3] ~ ~ ~ ~ ~ ~ ~ ~ ~ [c4,c3] [a3,a4] ~ [d4,d3] ~ ~ ~ ~ ~ [d4,d3,a4] ~ ~ ~ ~ ~ ~ [a3,a4] ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ [d3,d4] [f3,f4] ~ [d3,d4] [c4,c5] ~ ~ ~ [d2,d3] [d3,d4] ~ [a3,a4] ~ ~ ~ ~',
      chop: '[a5,d6] ~ ~ ~ ~ ~ [d5,a5,d6] ~ ~ ~ ~ ~ ~ [d6,a5,d5] ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ [d5,a5,d6] ~ ~ ~ ~ ~ ~ [a5,d5,d6] ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~',
      bassGain: 0.105,
      chordGain: 0.115,
      chordLpf: 1600,
      chopGain: 0.026,
      liftGain: 0.074,
      wasdGain: 0.11,
      wasdLpf: 1250,
      visual: {
        typeSteps: 1,
        cursorSteps: 2,
        wordSteps: 3,
        lineSteps: 2,
        drawSteps: 9,
        pageSteps: 36,
        stemPulseSteps: 4,
      },
    },
    {
      name: 'neon stutter',
      bpm: 136,
      root: { name: 'A minor' },
      wasd: ['[a3,c4,e4,g4,b4]', '[f3,a3,c4,e4]', '[c3,e3,g3,b3]', '[g3,c4,d4,f4]'],
      kick: 'a1*4',
      clap: '~ e3 ~ e3',
      hats: 'white*16',
      perc: '[pink ~] ~ [white pink] ~ pink ~ [pink white] ~',
      bass: 'a1 ~ [a1 e2] ~ f2 ~ e2 ~ c2 ~ [e2 g2] ~ g1 ~ ~ e2',
      chord: '[[a3,c4,e4,g4,b4] ~] [~ [f3,a3,c4,e4]] [~ [c3,e3,g3,b3]] [[g3,c4,d4,f4] ~]',
      chop: '[~ e5 g5 a5] [c6 a5 g5 ~] [~ e5 e5 g5] [b5 ~ a5 g5]',
      lift: '[c6 b5 a5 g5] [e5 ~ g5 a5] [~ a5 c6 e6] [g6 e6 c6 ~]',
      bassGain: 0.12,
      chordGain: 0.1,
      chordLpf: 1750,
      chopGain: 0.1,
      liftGain: 0.05,
      kickVoice: 'sine").gain(1.3).attack(0.001).decay(0.105).sustain(0).release(0.022).lpf(155).distort(0.1',
      clapVoice: 'white").gain(0.72).attack(0.001).decay(0.055).sustain(0).release(0.04).hpf(1200).lpf(5600).room(0.12',
      hatVoice: 'white").gain(0.38).attack(0.001).decay(0.016).sustain(0).release(0.008).hpf(7600',
      percVoice: 'pink").gain(0.34).attack(0.001).decay(0.026).sustain(0).release(0.014).hpf(3000).lpf(8200',
      bassVoice: 'square").gain(0.15).attack(0.003).decay(0.08).sustain(0).release(0.035).lpf(260).distort(0.22).krush(2',
      chordVoice: 'supersaw").attack(0.01).decay(0.16).sustain(0.07).release(0.14).unison(3).spread(0.28).detune(0.08).room(0.22).shape(0.12',
      chopVoice: 'z_sawtooth").attack(0.002).decay(0.055).sustain(0).release(0.045).hpf(620).lpf(2600).zcrush(0.2).delay(0.08).delaytime(0.125).delayfeedback(0.12',
      liftVoice: 'triangle").attack(0.006).decay(0.11).sustain(0).release(0.1).hpf(760).lpf(3900).vib(5).vibmod(0.08',
      visual: {
        typeSteps: 1,
        cursorSteps: 2,
        wordSteps: 2,
        lineSteps: 1,
        drawSteps: 6,
        pageSteps: 48,
        stemPulseSteps: 4,
      },
    },
  ];
  let lastKnownGoodComposition = getStoredPoetryInProofLastGoodSource();
  const rememberGoodComposition = (source) => {
    if (typeof source !== 'string' || !source.trim()) return;
    lastKnownGoodComposition = source;
    savePoetryInProofSource(source);
    savePoetryInProofLastGoodSource(source);
  };
  const getRecoveryComposition = (failedSource = '') => {
    const candidates = [
      lastKnownGoodComposition,
      getStoredPoetryInProofLastGoodSource(),
      POETRY_IN_PROOF_SOURCE,
    ];
    return candidates.find((source) => source && source.trim() && source !== failedSource)
      || POETRY_IN_PROOF_SOURCE;
  };

  const escapePattern = (value) => String(value).replace(/\\/g, '\\\\').replace(/`/g, '\\`');
  const laneTriggerKey = (group, lane) => `${group}${lane.charAt(0).toUpperCase()}${lane.slice(1)}`;
  const laneTriggerRef = (group, lane) => `globalThis.__resumeLaneTriggers.${laneTriggerKey(group, lane)}`;
  const bassTrigger = (lane) => `.onTrigger(${laneTriggerRef('bass', lane)}, false)`;
  const melodyTrigger = (lane) => `.onTrigger(${laneTriggerRef('melody', lane)}, false)`;
  const drumTrigger = (lane) => `.onTrigger(${laneTriggerRef('drum', lane)}, false)`;
  const harmonyTrigger = (lane) => `.onTrigger(${laneTriggerRef('harmony', lane)}, false)`;
  const installLaneTriggerHandlers = () => {
    window.__resumeLaneTriggers = {
      bassBass: (time, hap) => window.__resumeBassHit?.('bass', time, hap?.value),
      harmonyChord: (time, hap) => window.__resumeHarmonyHit?.('chord', time, hap?.value),
      harmonyWasdChord: (time, hap) => window.__resumeHarmonyHit?.('wasdChord', time, hap?.value),
      drumKick: (time, hap) => window.__resumeDrumHit?.('kick', time, hap?.value),
      drumSnare: (time, hap) => window.__resumeDrumHit?.('snare', time, hap?.value),
      drumHat: (time, hap) => window.__resumeDrumHit?.('hat', time, hap?.value),
      drumPerc: (time, hap) => window.__resumeDrumHit?.('perc', time, hap?.value),
      melodyChop: (time, hap) => window.__resumeMelodyNote?.('chop', time, hap?.value),
      melodyLead: (time, hap) => window.__resumeMelodyNote?.('lead', time, hap?.value),
      melodyLift: (time, hap) => window.__resumeMelodyNote?.('lift', time, hap?.value),
      melodyAngel: (time, hap) => window.__resumeMelodyNote?.('angel', time, hap?.value),
      melodyBuild: (time, hap) => window.__resumeMelodyNote?.('build', time, hap?.value),
      melodySwitch: (time, hap) => window.__resumeMelodyNote?.('switch', time, hap?.value),
      melodyGhost: (time, hap) => window.__resumeMelodyNote?.('ghost', time, hap?.value),
      melodyDust: (time, hap) => window.__resumeMelodyNote?.('dust', time, hap?.value),
    };
  };
  const makePattern = (song, wasd = '') => {
    const wasdRest = wasd === WASD_RELEASE_REST;
    const cpm = (song.bpm / 4).toFixed(3);
    const kick = escapePattern(song.kick);
    const clap = escapePattern(song.clap);
    const hats = escapePattern(song.hats);
    const perc = escapePattern(song.perc);
    const kick808 = escapePattern(song.kick808 || '');
    const snare808 = escapePattern(song.snare808 || '');
    const hats808 = escapePattern(song.hats808 || '');
    const perc808 = escapePattern(song.perc808 || '');
    const bass = escapePattern(song.bass);
    const chord = escapePattern(wasdRest ? '~' : (wasd || song.chord));
    const chop = escapePattern(song.chop);
    const lift = escapePattern(song.lift);
    const halo = escapePattern(song.halo || '');
    const angel = escapePattern(song.angel || '');
    const build = escapePattern(song.build || '');
    const switchUp = escapePattern(song.switch || '');
    const ghost = escapePattern(song.ghost || '');
    const dust = escapePattern(song.dust || '');
    const masterGain = mixSettings.master;
    const soloActive = mixChannels.some((channel) => mixChannelState.solo[channel]);
    const channelLevel = (channel) => {
      if (mixChannelState.mute[channel]) return 0;
      if (soloActive && !mixChannelState.solo[channel]) return 0;
      const layer = {
        kick: 'drums',
        snare: 'drums',
        hats: 'drums',
        perc: 'drums',
        chords: 'harmony',
        bass: 'harmony',
        lead: 'melody',
      }[channel];
      return (mixSettings[channel] ?? 1) * (scrollLayerState[layer] ?? 1);
    };
    const bassGain = (song.bassGain ?? 0.11) * channelLevel('bass') * masterGain;
    const chordGain = (wasd ? (song.wasdGain ?? 0.18) : (song.chordGain ?? 0.12)) * channelLevel('chords') * masterGain;
    const chordLpf = wasd ? (song.wasdLpf ?? 1650) : (song.chordLpf ?? 1450);
    const chopGain = (song.chopGain ?? 0.07) * channelLevel('lead') * masterGain;
    const liftGain = (song.liftGain ?? 0.045) * channelLevel('lead') * masterGain;
    const kickGain = channelLevel('kick') * masterGain;
    const snareGain = channelLevel('snare') * masterGain;
    const hatsGain = channelLevel('hats') * masterGain;
    const percGain = channelLevel('perc') * masterGain;
    const isTrap = song.name === 'trap cathedral';
    const isNeon = song.name === 'neon stutter';
    const harmonyLane = wasd ? 'wasdChord' : 'chord';
    const drumMute = stemMutes.drums ? '.gain(0)' : '';
    const harmonyMute = stemMutes.harmony ? '.gain(0)' : '';
    const melodyMute = stemMutes.melody ? '.gain(0)' : '';
    if (song.midiLlm) {
      const midiChordLane = wasdRest
        ? `note("~").s("sine").gain(0)`
        : wasd
        ? `chord("${chord}").voicing().s("sawtooth").gain(${song.wasdGain ?? 0.11}).attack(0.16).decay(0.42).sustain(0.48).release(0.78).legato(1.12).unison(4).spread(0.36).hpf(150).lpf(${song.wasdLpf ?? 1250}).lpq(3.2).room(0.32).sz(0.56).distort(0.16)`
        : `chord("${chord}").voicing().s("sawtooth").gain(${song.chordGain ?? 0.115}).attack(0.2).decay(0.52).sustain(0.48).release(0.92).legato(1.15).unison(5).spread(0.44).detune(sine.range(-2.4, 2.4).slow(9)).hpf(145).lpf(sine.range(540, 980).slow(7)).lpq(3.4).distort(0.18).room(0.34).sz(0.58).delay(0.045).delaytime(0.375).delayfb(0.075).pan(0.08)`;
      const midiBassLane = wasd
        ? `note("~").s("sine").gain(0)`
        : `note("${bass}").layer(
    x => x.s("sine").gain(1),
    x => x.s("sawtooth").gain(0.18).detune(sine.range(-1.2, 1.2).slow(8)).lpf(260)
  ).gain(${song.bassGain ?? 0.105}).attack(0.028).decay(0.34).sustain(0.42).release(0.24).legato(1.22).slide(0.06).hpf(42).lpf(sine.range(135, 230).slow(4)).lpq(2).distort(0.16).room(0.006)`;
      return `stack(
  s("${kick}").bank("RolandTR808").gain(1.05).lpf(185).distort(0.16)${drumTrigger('kick')}${drumMute},
  s("${clap}").bank("RolandTR808").gain(0.98).hpf(380).lpf(5600).room(0.04)${drumTrigger('snare')}${drumMute},
  s("${hats}").bank("RolandTR808").gain(0.58).hpf(6600)${drumTrigger('hat')}${drumMute},
  s("${perc}").bank("RolandTR808").gain(0.42).hpf(1300).room(0.035)${drumTrigger('perc')}${drumMute},
  ${midiBassLane}${bassTrigger('bass')}${harmonyMute},
  ${midiChordLane}${harmonyTrigger(harmonyLane)}${harmonyMute},
  note("${lift}").s("square").gain(${song.liftGain ?? 0.074}).attack(0.035).decay(0.28).sustain(0.32).release(0.5).legato(1.02).slide(0.045).hpf(520).lpf(sine.range(1200, 3000).slow(6)).lpq(2.6).distort(0.12).shape(0.006).room(0.16).sz(0.34).vib(3.8).vibmod(0.011).delay(0.035).delaytime(0.25).delayfb(0.045).pan(-0.14)${melodyTrigger('lift')}${melodyMute},
  note("${chop}").s("sine").gain(${song.chopGain ?? 0.026}).attack(0.008).decay(0.24).sustain(0.08).release(0.58).legato(0.86).hpf(1700).lpf(sine.range(3600, 7000).slow(5)).room(0.46).sz(0.62).delay(0.04).delaytime(0.375).delayfb(0.08).pan(0.26)${melodyTrigger('chop')}${melodyMute}
).cpm(${cpm})`;
    }
    const kickFx = isTrap
      ? 'gain(0.78).attack(0.001).decay(0.065).sustain(0).release(0.014).hpf(72).lpf(360).distort(0.025)'
      : isNeon
        ? 'gain(1.3).attack(0.001).decay(0.105).sustain(0).release(0.022).lpf(155).distort(0.1)'
        : 'gain(1.28).attack(0.001).decay(0.13).sustain(0).release(0.025).lpf(140).distort(0.08)';
    const clapSound = isTrap ? 'white' : 'pink';
    const clapFx = isTrap
      ? 'gain(1.4).attack(0.001).decay(0.09).sustain(0).release(0.05).hpf(680).lpf(5200).room(0.02)'
      : isNeon
        ? 'gain(0.72).attack(0.001).decay(0.055).sustain(0).release(0.04).hpf(1200).lpf(5600).room(0.12)'
        : 'gain(0.62).attack(0.002).decay(0.065).sustain(0).release(0.05).hpf(1200).lpf(6200).room(0.22)';
    const hatFx = isTrap
      ? 'gain(0.62).attack(0.001).decay(0.018).sustain(0).release(0.01).hpf(6600)'
      : isNeon
        ? 'gain(0.38).attack(0.001).decay(0.016).sustain(0).release(0.008).hpf(7600)'
        : 'gain(0.32).attack(0.001).decay(0.02).sustain(0).release(0.01).hpf(7200)';
    const percSound = isTrap ? 'brown' : 'pink';
    const percFx = isTrap
      ? 'gain(0.54).attack(0.002).decay(0.065).sustain(0).release(0.03).hpf(1450).lpf(5600).room(0.018)'
      : isNeon
        ? 'gain(0.34).attack(0.001).decay(0.026).sustain(0).release(0.014).hpf(3000).lpf(8200)'
        : 'gain(0.26).attack(0.001).decay(0.035).sustain(0).release(0.018).hpf(2600).lpf(7200).room(0.12)';
    const bassSound = isTrap ? 'sine' : (isNeon ? 'square' : 'sine');
    const bassFx = isTrap
      ? 'attack(0.018).decay(0.38).sustain(0.62).release(0.36).legato(1.24).slide(0.07).hpf(34).lpf(sine.range(180, 760).slow(2)).lpq(sine.range(1.1, 4.2).slow(4)).distort(0.16).shape(0.014).room(0.002)'
      : isNeon
        ? 'attack(0.003).decay(0.08).sustain(0).release(0.035).lpf(260).distort(0.22).krush(2)'
        : 'attack(0.004).decay(0.15).sustain(0).release(0.08).lpf(160).distort(0.18)';
    const chordFx = isTrap
      ? 'attack(0.42).decay(0.64).sustain(0.5).release(0.82).legato(1.16).unison(4).spread(0.52).detune(sine.range(-2.6, 2.6).slow(9)).hpf(220).lpf(sine.range(620, 1150).slow(7)).lpq(0.85).vib(3.2).vibmod(0.018).distort(0.025).room(0.32).sz(0.54).roomlp(3600).shape(0.001).delay(0.045).delaytime(0.375).delayfb(0.035)'
      : isNeon
        ? 'attack(0.01).decay(0.16).sustain(0.07).release(0.14).unison(3).spread(0.28).detune(0.08).room(0.22).shape(0.12)'
        : 'attack(0.035).decay(0.34).sustain(0.2).release(0.42).unison(5).spread(0.42).detune(0.04).room(0.38).shape(0.08)';
    const chopSound = isNeon ? 'z_sawtooth' : 'triangle';
    const chopFx = isTrap
      ? 'attack(0.012).decay(0.18).sustain(0).release(0.18).hpf(420).lpf(1700).room(0.16)'
      : isNeon
        ? 'attack(0.002).decay(0.055).sustain(0).release(0.045).hpf(620).lpf(2600).zcrush(0.2).delay(0.08).delaytime(0.125).delayfeedback(0.12)'
        : 'attack(0.003).decay(0.07).sustain(0).release(0.055).hpf(520).lpf(2300).delay(0.1).delaytime(0.1875).delayfeedback(0.18).vowel("a")';
    const liftSound = isTrap ? 'square' : 'triangle';
    const liftFx = isTrap
      ? 'attack(0.026).decay(0.28).sustain(0.4).release(0.48).legato(0.98).slide(0.04).hpf(520).bpf(sine.range(1050, 2700).slow(4)).bpq(2.4).lpf(4200).distort(0.09).shape(0.003).phaser(0.045).phaserrate(0.14).phaserdepth(0.1).room(0.1).sz(0.26).vib(2.4).vibmod(0.006).pan(-0.18).delay(0.026).delaytime(0.25).delayfb(0.03)'
      : isNeon
        ? 'attack(0.006).decay(0.11).sustain(0).release(0.1).hpf(760).lpf(3900).vib(5).vibmod(0.08)'
        : 'attack(0.03).decay(0.22).sustain(0.05).release(0.28).hpf(650).lpf(3600).room(0.22).vib(4).vibmod(0.06)';
    const liftRate = isTrap ? '' : '.slow(2)';
    const drumForm = isTrap ? '.mask("<0 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1>")' : '';
    const bassForm = isTrap ? '.mask("<0 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1>")' : '';
    const leadForm = isTrap ? '.mask("<0 1 0 1 0 1 0 0 0 1 0 1 0 0 1 0>")' : '';
    const angelForm = isTrap ? '.mask("<0 0 1 0 0 0 1 0 0 0 1 0 0 1 0 0>")' : '';
    const buildForm = isTrap ? '.mask("<0 0 0 1 0 0 1 1 0 0 0 1 0 1 1 1>")' : '';
    const switchForm = isTrap ? '.mask("<0 0 0 0 1 1 1 1 0 0 1 1 1 1 1 1>")' : '';
    const ghostForm = isTrap ? '.mask("<0 0 0 0 0 1 0 0 0 0 0 1 0 0 1 0>")' : '';
    const dustForm = isTrap ? '.mask("<1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1>")' : '';
    const sidechainKeyOrbit = isTrap ? '.orbit(11)' : '';
    const sidechainTargetOrbit = isTrap ? '.orbit(12)' : '';
    const melodicSpaceDuck = '';
    const leadSupportDuck = '';
    const trapDrumLanes = isTrap ? `
  s("${kick808}").bank("RolandTR808").gain(${(1.05 * kickGain).toFixed(3)}).hpf(76).lpf(440).distort(0.025)${sidechainKeyOrbit}${drumTrigger('kick')}${drumMute},
  s("${snare808}").bank("RolandTR808").gain(${(2.24 * snareGain).toFixed(3)}).hpf(360).lpf(6400).room(0.01)${drumForm}${drumTrigger('snare')}${drumMute},
  s("${hats808}").bank("RolandTR808").gain(${(1.34 * hatsGain).toFixed(3)}).hpf(6400)${drumForm}${drumTrigger('hat')}${drumMute},
  s("${perc808}").bank("RolandTR808").gain(${(1.14 * percGain).toFixed(3)}).hpf(1100).room(0.008)${drumForm}${drumTrigger('perc')}${drumMute},
  s("~ hh ~ [hh hh] ~ hh [hh hh] ~ ~ hh ~ hh [hh hh] ~ hh ~").bank("RolandTR808").gain(${(0.66 * hatsGain).toFixed(3)}).hpf(7200)${switchForm}${drumTrigger('hat')}${drumMute},
  s("~ ~ ~ cp ~ ~ cp ~ ~ cp ~ ~ ~ ~ cp ~").bank("RolandTR808").gain(${(0.62 * percGain).toFixed(3)}).hpf(1400).room(0.008)${switchForm}${drumTrigger('perc')}${drumMute},` : '';
    const trapHaloLane = '';
    const chordLane = wasdRest
      ? `note("~").s("sine").gain(0)`
      : isTrap
      ? `chord("${chord}").voicing().s("sawtooth").gain(${chordGain}).${chordFx}${sidechainTargetOrbit}`
      : `note("${chord}").s("supersaw").gain(${chordGain}).lpf(${chordLpf}).${chordFx}`;
    const bassLane = isTrap
      ? (wasd ? `note("~").s("sine").gain(0)` : `note("${bass}").layer(
    x => x.s("sine").pan(0).gain(1),
    x => x.s("triangle").detune(sine.range(-0.8, 0.8).slow(8)).pan(0).gain(0.22).lpf(sine.range(260, 560).slow(2)),
    x => x.add(12).s("sawtooth").pan(0).gain(0.22).hpf(120).lpf(sine.range(420, 1200).slow(2)).lpq(2.2).distort(0.2).shape(0.012)
  ).gain(${bassGain}).${bassFx}${sidechainTargetOrbit}`)
      + bassForm
      : `note("${bass}").s("${bassSound}").gain(${bassGain}).${bassFx}`;
    const leadLane = isTrap
      ? `note("${lift}").s("${liftSound}").gain(${liftGain}).${liftFx}`
      + leadForm
      : `note("${lift}").s("${liftSound}").gain(${liftGain}).${liftFx}${liftRate}`;
    const angelLane = isTrap
      ? `note("${angel}").layer(
    x => x.s("sine").gain(1).comb(0.12),
    x => x.add(12).s("sine").gain(0.04).pan(0.22),
    x => x.s("sawtooth").gain(0.022).hpf(3200).lpf(5200)
  ).gain(${(0.024 * channelLevel('lead') * masterGain).toFixed(4)}).attack(0.026).decay(0.28).sustain(0.046).release(0.52).legato(0.82).hpf(1250).lpf(sine.range(2400, 4400).slow(5)).lpq(0.7).vib(3.4).vibmod(0.004).room(0.28).sz(0.48).delay(0.05).delaytime(0.25).delayfb(0.05).pan(0.24)`
      + leadSupportDuck + angelForm
      : '';
    const buildLane = isTrap
      ? `note("${build}").s("sawtooth").gain(${(0.028 * channelLevel('lead') * masterGain).toFixed(4)}).attack(0.1).decay(0.3).sustain(0.2).release(0.46).legato(1.04).hpf(660).lpf(sine.range(1200, 2500).slow(8)).lpq(2.6).distort(0.1).room(0.18).sz(0.34).delay(0.03).delaytime(0.375).delayfb(0.025).slow(2)${melodicSpaceDuck}`
      + buildForm
      : '';
    const switchLane = isTrap
      ? `note("${switchUp}").s("sine").gain(${(0.025 * channelLevel('lead') * masterGain).toFixed(4)}).attack(0.032).decay(0.22).sustain(0.11).release(0.34).legato(0.76).hpf(860).lpf(sine.range(1700, 3400).slow(6)).lpq(1.8).vib(3.4).vibmod(0.007).room(0.14).sz(0.28).delay(0.022).delaytime(0.25).delayfb(0.02).pan(-0.08)${melodicSpaceDuck}${switchForm}`
      : '';
    const ghostLane = isTrap
      ? `note("${ghost}").s("triangle").gain(${(0.021 * channelLevel('lead') * masterGain).toFixed(4)}).attack(0.052).decay(0.26).sustain(0.08).release(0.38).legato(0.9).hpf(800).lpf(sine.range(1800, 3600).slow(10)).lpq(1.6).room(0.14).sz(0.28).delay(0.03).delaytime(0.375).delayfb(0.024).pan(0.18)${melodicSpaceDuck}${ghostForm}`
      : '';
    const dustLane = isTrap
      ? `note("${dust}").s("sine").gain(${(0.004 * channelLevel('lead') * masterGain).toFixed(4)}).attack(0.018).decay(0.15).sustain(0.025).release(0.34).legato(0.72).hpf(1900).lpf(sine.range(2800, 4700).slow(12)).room(0.22).sz(0.42).delay(0.045).delaytime(0.375).delayfb(0.04).pan(sine.slow(8))${melodicSpaceDuck}${dustForm}`
      : '';
    return `stack(${trapDrumLanes}${trapHaloLane}
  note("${kick}").s("sine").${kickFx}.gain(${kickGain.toFixed(3)})${sidechainKeyOrbit}${drumTrigger('kick')}${drumMute},
  note("${clap}").s("${clapSound}").${clapFx}.gain(${snareGain.toFixed(3)})${drumTrigger('snare')}${drumMute},
  s("${hats}").s("white").${hatFx}.gain(${hatsGain.toFixed(3)})${drumTrigger('hat')}${drumMute},
  s("${perc}").s("${percSound}").${percFx}.gain(${percGain.toFixed(3)})${drumTrigger('perc')}${drumMute},
  ${bassLane}${bassTrigger('bass')}${harmonyMute},
  ${chordLane}${harmonyTrigger(harmonyLane)}${harmonyMute},
  note("${chop}").s("${chopSound}").gain(${chopGain}).${chopFx}${melodyTrigger('chop')}${melodyMute},
  ${leadLane}${melodyTrigger('lead')}${melodyMute}${isTrap ? `,\n  ${angelLane}${melodyTrigger('angel')}${melodyMute},\n  ${buildLane}${melodyTrigger('build')}${melodyMute},\n  ${switchLane}${melodyTrigger('switch')}${melodyMute},\n  ${ghostLane}${melodyTrigger('ghost')}${melodyMute},\n  ${dustLane}${melodyTrigger('dust')}${melodyMute}` : ''}
).cpm(${cpm})`;
  };

  const deriveMelodyAccent = (lane, value = {}) => {
    const laneBase = { chop: 0, lead: 1, lift: 1, angel: 2, build: 3, switch: 4, ghost: 5, dust: 2 }[lane] || 0;
    const source = value.note ?? value.n ?? value.midinote ?? value.freq ?? '';
    const text = Array.isArray(source) ? source.join('') : String(source);
    const noteOffset = text
      ? [...text].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 6
      : 0;
    return (laneBase + noteOffset) % 6;
  };

  const chordKeyOrder = ['W', 'A', 'S', 'D'];

  const chordKeyFromScheduledTime = (scheduledTime) => {
    if (!Number.isFinite(scheduledTime)) return currentAutoplayChordKey || 'W';
    const song = songPresets[songIndex];
    const measureSeconds = Math.max(0.001, 60 / song.bpm * 4);
    const index = Math.floor((scheduledTime + measureSeconds * 0.02) / measureSeconds) % chordKeyOrder.length;
    return chordKeyOrder[index];
  };

  const quantizedLayerDelayMs = (gridBeats = 0.25, maxDelayMs = 130) => {
    try {
      const context = strudel?.getAudioContext?.() || window.__resumeStrudelModule?.getAudioContext?.();
      if (!context) return 0;
      const beatSeconds = (60 / songPresets[songIndex].bpm) * gridBeats;
      const now = context.currentTime;
      const nextBeat = Math.ceil((now + 0.035) / beatSeconds) * beatSeconds;
      return Math.min(maxDelayMs, Math.max(0, (nextBeat - now) * 1000));
    } catch (error) {
      return 0;
    }
  };

  const applyScrollLayers = (normalized) => {
    const changed = Object.keys(scrollLayerState).some((key) => scrollLayerState[key] !== normalized[key]);
    if (!changed) return false;
    Object.assign(scrollLayerState, normalized);
    // Songs with a fixed `composition` ignore scroll-layer-driven gains —
    // re-evaluating would restart the arrangement back at the intro on
    // every scroll. Just update state and emit the event.
    if (!songPresets[songIndex].composition) {
      playCurrent({ resetTransport: false });
    }
    window.dispatchEvent(new CustomEvent('resume-scroll-layers-change', { detail: { layers: { ...scrollLayerState } } }));
    return true;
  };

  const chordLabelForKey = (key) => {
    const index = chordKeyOrder.indexOf(key);
    return index >= 0 ? songPresets[songIndex].wasd[index] : '';
  };

  const LIVE_CHORD_NOTES = {
    'Ab^7': [207.65, 261.63, 311.13, 392],
    Fm9: [174.61, 207.65, 261.63, 311.13, 392],
    Gm7: [196, 233.08, 293.66, 349.23],
    Cm9: [196, 261.63, 311.13, 392, 466.16],
  };

  const releaseLiveChord = (key = '') => {
    const voice = liveChordVoices.get(key);
    if (!voice) return;
    const now = voice.context.currentTime;
    voice.output.gain.cancelScheduledValues(now);
    voice.output.gain.setTargetAtTime(0.0001, now, 0.16);
    voice.nodes.forEach((node) => {
      try {
        node.stop(now + 0.75);
      } catch {}
    });
    window.setTimeout(() => {
      voice.nodes.forEach((node) => node.disconnect?.());
      voice.output.disconnect?.();
    }, 950);
    liveChordVoices.delete(key);
  };

  // The WASD chord is now produced entirely by Strudel's chord lane —
  // when a WASD key is pressed, evaluateCurrent re-renders the pattern
  // with that chord active so it uses the exact same voice as the
  // automatic chord progression. No parallel local oscillator synth.
  const triggerLiveChord = async (/* key, chordName */) => {};

  const dispatchChordKey = (key, detail = {}) => {
    const normalizedKey = key && chordKeyOrder.includes(key) ? key : '';
    window.dispatchEvent(new CustomEvent('resume-chord-key', {
      detail: {
        key: normalizedKey,
        chord: normalizedKey ? chordLabelForKey(normalizedKey) : '',
        song: songPresets[songIndex].name,
        override: Boolean(activeChordKey),
        ...detail,
      },
    }));
  };

  const syncedDelayMs = (scheduledTime) => {
    try {
      const context = strudel?.getAudioContext?.() || window.__resumeStrudelModule?.getAudioContext?.();
      if (context && Number.isFinite(scheduledTime)) {
        return Math.max(0, (scheduledTime - context.currentTime) * 1000);
      }
    } catch (error) {
      return 0;
    }
    return 0;
  };

  const currentArrangementSection = (nowMs = performance.now()) => {
    const song = songPresets[songIndex] || {};
    if (!song.composition || !arrangementStartedAtMs) return 'loop';
    const cycleMs = 60000 / Math.max(1, song.bpm / 4);
    const arrangementMs = cycleMs * ARRANGEMENT_TOTAL_CYCLES;
    const elapsed = ((nowMs - arrangementStartedAtMs) % arrangementMs + arrangementMs) % arrangementMs;
    let cursor = 0;
    for (const section of ARRANGEMENT_SECTIONS) {
      cursor += section.cycles * cycleMs;
      if (elapsed < cursor) return section.name;
    }
    return 'loop';
  };

  const dispatchSyncedMusicEvent = (eventName, detail) => {
    const delayMs = Math.max(0, syncedDelayMs(detail.scheduledTime) - VISUAL_SYNC_AHEAD_MS);
    window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent(eventName, {
        detail: {
          ...detail,
          section: detail.section || currentArrangementSection(),
        },
      }));
    }, delayMs);
  };

  const normalizedTriggerVelocity = (value = {}, fallback = 1) => {
    if (typeof value === 'number') return Math.max(0, Math.min(1.6, value));
    const candidates = [
      value?.velocity,
      value?.vel,
      value?.amp,
      value?.amplitude,
      value?.gain,
      value?.sustain,
      value?.volume,
    ];
    for (const candidate of candidates) {
      const numeric = Number(candidate?.valueOf?.() ?? candidate);
      if (Number.isFinite(numeric)) return Math.max(0, Math.min(1.6, numeric));
    }
    return fallback;
  };

  const sendMidiOut = (detail) => {
    if (!midiOutputEnabled || !midiOutput || detail.type !== 'noteon' || !Number.isFinite(detail.note)) return;
    const channel = Math.max(1, Math.min(16, detail.channel || 10)) - 1;
    const velocity = Math.max(1, Math.min(127, Math.round((detail.velocity ?? 1) * 127)));
    const startMs = performance.now() + syncedDelayMs(detail.scheduledTime);
    const duration = Math.max(24, detail.duration || 120);
    midiOutput.send([0x90 + channel, detail.note, velocity], startMs);
    midiOutput.send([0x80 + channel, detail.note, 0], startMs + duration);
  };

  const dispatchResumeMidiEvent = (detail) => {
    const laneConfig = SCENE_MIDI_MAP[detail.lane] || {};
    const midiDetail = {
      source: 'strudel',
      type: 'noteon',
      channel: detail.channel ?? laneConfig.channel ?? 16,
      group: detail.group || laneConfig.group || 'scene',
      lane: detail.lane,
      note: detail.note ?? laneConfig.note,
      noteName: detail.noteName || laneConfig.label,
      velocity: detail.velocity ?? detail.strength ?? 1,
      id: detail.id,
      scheduledTime: detail.scheduledTime,
      duration: detail.duration,
      raw: detail.raw,
    };
    sendMidiOut(midiDetail);
    dispatchSyncedMusicEvent('resume-midi-event', midiDetail);
  };

  const dispatchLaneMidiEvent = (lane, detail = {}) => {
    const midi = SCENE_MIDI_MAP[lane];
    if (!midi) return;
    dispatchResumeMidiEvent({
      lane,
      group: midi.group,
      channel: midi.channel,
      note: midi.note,
      noteName: midi.label,
      velocity: detail.velocity ?? detail.strength ?? 0.8,
      id: detail.id,
      scheduledTime: detail.scheduledTime,
      duration: detail.duration,
      raw: detail.raw,
    });
  };

  window.__resumeMelodyNote = (lane, scheduledTime, value = {}) => {
    if (!enabled || stemMutes.melody) return;
    const timing = visualTimingFor();
    const id = ++melodyTriggerId;
    const duration = Math.max(170, timing.stepMs * 1.05);
    dispatchLaneMidiEvent(lane, {
      id,
      scheduledTime,
      duration,
      raw: value,
      velocity: 0.72,
    });
    dispatchSyncedMusicEvent('resume-melody-note', {
      id,
      lane,
      scheduledTime,
      accent: deriveMelodyAccent(lane, value),
      duration,
    });
  };

  window.__resumeBassHit = (lane, scheduledTime, value = {}) => {
    if (!enabled || stemMutes.harmony) return;
    const timing = visualTimingFor();
    const id = ++bassTriggerId;
    const duration = Math.max(120, timing.stepMs * 1.35);
    const soloActive = mixChannels.some((channel) => mixChannelState.solo[channel]);
    const bassFader = mixChannelState.mute.bass || (soloActive && !mixChannelState.solo.bass)
      ? 0
      : (mixSettings.bass ?? 1);
    // Keep visual response tied to the audible bass fader/master, but do
    // not let scroll-layer fades fully suppress the CRT hit. Otherwise the
    // bass lane can still be playing while the screen gets no event at all.
    const bassLayer = Math.max(0.42, Math.min(1, scrollLayerState.harmony ?? 1));
    const masterLevel = mixSettings.master ?? 1;
    const triggerVelocity = normalizedTriggerVelocity(value, 1);
    const audibleBassLevel = Math.max(0, bassFader * bassLayer * masterLevel);
    if (bassFader * masterLevel <= 0.01) return;
    const volumeDrive = Math.pow(Math.max(0.18, Math.min(3.0, audibleBassLevel)) / 1.35, 0.74);
    const visualStrength = Math.max(0.68, Math.min(1.9, volumeDrive * triggerVelocity));
    dispatchLaneMidiEvent(lane, {
      id,
      scheduledTime,
      duration,
      raw: value,
      velocity: Math.max(0.05, Math.min(1, visualStrength / 1.7)),
    });
    dispatchSyncedMusicEvent('resume-bass-hit', {
      id,
      lane,
      scheduledTime,
      duration,
      strength: visualStrength,
      bassLevel: audibleBassLevel,
    });
  };

  window.__resumeDrumHit = (lane, scheduledTime, value = {}) => {
    if (!enabled || stemMutes.drums) return;
    const timing = visualTimingFor();
    const strength = { kick: 1, snare: 0.82, hat: 0.46, perc: 0.58 }[lane] || 0.5;
    const id = ++drumTriggerId;
    const duration = Math.max(80, timing.stepMs * (lane === 'hat' ? 0.85 : 1.3));
    const midi = SCENE_MIDI_MAP[lane] || { channel: 10, note: 35, group: 'drums', label: lane };
    window.__resumeLastDrumHit = { lane, id, scheduledTime, value, receivedAt: performance.now(), midi };
    const detail = {
      id,
      lane,
      scheduledTime,
      strength,
      duration,
      midiNote: midi.note,
      midiChannel: midi.channel,
    };
    dispatchResumeMidiEvent({
      ...detail,
      group: midi.group || 'drums',
      channel: midi.channel || 10,
      note: midi.note,
      noteName: midi.label,
      velocity: strength,
      raw: value,
    });
    dispatchSyncedMusicEvent('resume-drum-hit', detail);
  };

  window.__resumeHarmonyHit = (lane, scheduledTime, value = {}) => {
    if (!enabled || stemMutes.harmony) return;
    const timing = visualTimingFor();
    const id = ++harmonyTriggerId;
    const duration = Math.max(140, timing.stepMs * 1.6);
    const chordKey = lane === 'wasdChord'
      ? activeChordKey
      : chordKeyFromScheduledTime(scheduledTime);
    if (lane === 'chord') currentAutoplayChordKey = chordKey;
    dispatchLaneMidiEvent(lane, {
      id,
      scheduledTime,
      duration,
      raw: value,
      velocity: lane === 'wasdChord' ? 0.86 : 0.68,
    });
    dispatchSyncedMusicEvent('resume-chord-key', {
      id,
      lane,
      scheduledTime,
      duration,
      key: chordKey,
      chord: chordLabelForKey(chordKey),
      song: songPresets[songIndex].name,
      override: lane === 'wasdChord',
    });
    dispatchSyncedMusicEvent('resume-harmony-hit', {
      id,
      lane,
      scheduledTime,
      duration,
      chordKey,
    });
  };

  const installMasterBus = (context) => {
    if (!context || context.__resumeMasterBusInstalled) return;
    context.__resumeMasterBusInstalled = true;
    const now = context.currentTime;

    // Unified compressor + makeup gain on both desktop and mobile. The
    // CPU concern that drove the mobile bypass was the CORS texture
    // leak, now resolved. The limiter clamps peaks so we can boost
    // makeup gain for perceived loudness without clipping.
    const limiter = context.createDynamicsCompressor();
    limiter.threshold.setValueAtTime(-12, now);
    limiter.knee.setValueAtTime(8, now);
    limiter.ratio.setValueAtTime(20, now);
    limiter.attack.setValueAtTime(0.002, now);
    limiter.release.setValueAtTime(0.14, now);
    const makeup = context.createGain();
    makeup.gain.setValueAtTime(1.55, now);
    limiter.connect(makeup);
    makeup.connect(context.destination);
    const busInput = limiter;

    // Redirect any subsequent connect(..., destination) on this context through the bus input.
    // Other AudioContexts are untouched thanks to the this.context === context guard.
    const origConnect = AudioNode.prototype.connect;
    AudioNode.prototype.connect = function (target, ...rest) {
      if (target === context.destination
          && this.context === context
          && this !== busInput) {
        return origConnect.call(this, busInput, ...rest);
      }
      return origConnect.call(this, target, ...rest);
    };
  };

  const installStrudelCompat = (module) => {
    const proto = module?.Pattern?.prototype;
    if (!proto) return;
    const takeInlineWidgetContext = (kind, options = {}) => {
      const requestedId = options?.id == null ? '' : String(options.id);
      const queue = window.__resumeStrudelWidgetQueue;
      if (Array.isArray(queue)) {
        const index = queue.findIndex((entry) => (
          entry
          && !entry.used
          && entry.kind === kind
          && (!requestedId || entry.userId === requestedId)
          && entry.ctx
        ));
        if (index !== -1) {
          queue[index].used = true;
          return {
            ctx: queue[index].ctx,
            id: queue[index].drawId,
          };
        }
      }
      const ctx = window.__resumeStrudelScopeContexts?.get?.(`${kind}:${requestedId || 1}`)
        || window.__resumeStrudelScopeContexts?.get?.(requestedId || '1')
        || window.__resumeStrudelScopeContext;
      return ctx ? { ctx, id: options?.id ?? (requestedId || 1) } : null;
    };
    const widgetDefaults = (kind, options = {}) => {
      if (options.ctx) return options;
      const widgetContext = takeInlineWidgetContext(kind, options);
      if (!widgetContext?.ctx) return options;
      return {
        id: widgetContext.id,
        color: '#ffd840',
        active: '#ffd840',
        inactive: 'rgba(255, 216, 64, 0.24)',
        playheadColor: '#ffffff',
        thickness: 1.5,
        scale: 0.48,
        pos: 0.5,
        smear: 0.12,
        ...options,
        id: widgetContext.id,
        ctx: widgetContext.ctx,
      };
    };
    const normalizeScopeOptions = (idOrOptions = {}, maybeOptions = {}) => {
      if (idOrOptions && typeof idOrOptions === 'object' && !Array.isArray(idOrOptions)) {
        return idOrOptions;
      }
      return { ...maybeOptions, id: idOrOptions == null ? maybeOptions.id : idOrOptions };
    };
    for (const name of ['scope', 'tscope', 'fscope', 'spectrum', 'pianoroll']) {
      const original = proto[name];
      if (typeof original !== 'function' || original.__resumeWrapped) continue;
      proto[name] = function resumeScopedWidget(idOrOptions = {}, maybeOptions = {}) {
        return original.call(this, widgetDefaults(name, normalizeScopeOptions(idOrOptions, maybeOptions)));
      };
      proto[name].__resumeWrapped = true;
    }
    if (typeof proto.punchcard === 'function' && !proto.punchcard.__resumeWrapped) {
      const originalPunchcard = proto.punchcard;
      proto.punchcard = function resumePunchcardWidget(idOrOptions = {}, maybeOptions = {}) {
        const options = widgetDefaults('punchcard', normalizeScopeOptions(idOrOptions, maybeOptions));
        if (options.ctx && typeof this.pianoroll === 'function') {
          return this.pianoroll({
            cycles: 4,
            vertical: 1,
            labels: 1,
            stroke: 0,
            fillActive: 1,
            active: '#ffd840',
            inactive: 'rgba(255, 216, 64, 0.24)',
            ...options,
          });
        }
        return originalPunchcard.call(this, options);
      };
      proto.punchcard.__resumeWrapped = true;
    }
    const inlineWidgetAliases = {
      _scope: 'scope',
      _tscope: 'tscope',
      _fscope: 'fscope',
      _spectrum: 'spectrum',
      _pianoroll: 'pianoroll',
      _punchcard: 'punchcard',
    };
    for (const [alias, target] of Object.entries(inlineWidgetAliases)) {
      if (typeof proto[alias] === 'function' || typeof proto[target] !== 'function') continue;
      proto[alias] = function strudelInlineWidgetAlias(idOrOptions = {}, maybeOptions = {}) {
        const kind = target === 'tscope' ? 'tscope' : target;
        const options = widgetDefaults(kind, normalizeScopeOptions(idOrOptions, maybeOptions));
        if (options.ctx && typeof this.tag === 'function') {
          return this.tag(options.id)[target](options);
        }
        return this[target](options);
      };
    }
    const widgetAliases = {
      _wordfall: 'wordfall',
      _spiral: 'spiral',
      _pitchwheel: 'pitchwheel',
    };
    for (const [alias, target] of Object.entries(widgetAliases)) {
      if (typeof proto[alias] === 'function' || typeof proto[target] !== 'function') continue;
      proto[alias] = function strudelWidgetAlias(idOrOptions = {}, maybeOptions = {}) {
        return this[target](normalizeScopeOptions(idOrOptions, maybeOptions));
      };
    }
  };

  const ensureStrudel = async () => {
    if (strudel) return strudel;
    if (!initPromise) {
      initPromise = window.__loadStrudelModule
        ? window.__loadStrudelModule()
        : window.__resumeStrudelReady
        ? window.__resumeStrudelReady
        : import('./vendor/strudel-web.mjs').then(async (module) => {
            await module.initStrudel();
            return module;
          });
      initPromise = initPromise.then((module) => {
        strudel = module;
        installStrudelCompat(module);
        try {
          installMasterBus(module.getAudioContext?.());
        } catch (error) {
          console.warn('Master bus install failed', error);
        }
        return module;
      });
    }
    return initPromise;
  };

  // Rewrite a composition's source so each lane's gain reflects the
  // current mute/solo/level state. Each lane is identified by its
  // `.onTrigger(T.X, false)` marker; we walk backwards from that marker
  // to find the lane's most-recent `.gain(...)` and either zero it (mute
  // or non-solo when another lane is soloed) or scale it. Numeric and
  // pattern gains are both handled — for patterns like
  // `"<0.45 0.25 0.5 0.35>"` each value is scaled in place.
  const applyComposeLaneMix = (source) => {
    const anySolo = composeLanes.some((l) => composeMix.solos[l]);
    const neutral = !anySolo && composeLanes.every((lane) => (
      !composeMix.mutes[lane] && Math.abs((composeMix.levels[lane] ?? 1) - 1) < 0.0001
    ));
    if (neutral) return source;
    let out = source;
    for (const lane of composeLanes) {
      const trigger = COMPOSE_LANE_TRIGGERS[lane];
      if (!trigger) continue;
      const muted = composeMix.mutes[lane] || (anySolo && !composeMix.solos[lane]);
      const level = composeMix.levels[lane] ?? 1;
      const scale = muted ? 0 : level;
      // Find every (gain block, onTrigger) pair for this lane.
      const triggerRe = new RegExp(`\\.onTrigger\\(\\s*T\\.${trigger}\\s*,\\s*false\\s*\\)`, 'g');
      const matches = [];
      let m;
      while ((m = triggerRe.exec(source)) !== null) matches.push({ idx: m.index });
      // Walk back from each trigger to find the matching .gain(...) for
      // that block. The block boundary is the previous `;` (statement
      // separator) so we stop at the prior semicolon.
      const edits = [];
      for (const { idx } of matches) {
        const prevSemi = source.lastIndexOf(';', idx);
        const blockStart = prevSemi === -1 ? 0 : prevSemi + 1;
        const blockEnd = idx;
        const block = source.slice(blockStart, blockEnd);
        const gainRe = /\.gain\(\s*([^)]+?)\s*\)/g;
        let lastGain = null;
        let g;
        while ((g = gainRe.exec(block)) !== null) lastGain = g;
        if (!lastGain) continue;
        const value = lastGain[1].trim();
        const absStart = blockStart + lastGain.index;
        const absEnd = absStart + lastGain[0].length;
        // Scalar: bare number
        const numMatch = value.match(/^-?\d+(?:\.\d+)?$/);
        if (numMatch) {
          const scaled = (Number(value) * scale).toFixed(4);
          edits.push({ start: absStart, end: absEnd, replacement: `.gain(${scaled})` });
          continue;
        }
        // Pattern string: "<a b c d>" or "a b c" etc.
        const strMatch = value.match(/^"([^"]*)"$/);
        if (strMatch) {
          const patBody = strMatch[1];
          const scaledBody = patBody.replace(/(-?\d+(?:\.\d+)?)/g, (n) => (Number(n) * scale).toFixed(4));
          edits.push({ start: absStart, end: absEnd, replacement: `.gain("${scaledBody}")` });
          continue;
        }
        // Anything else (signal etc.): wrap in a multiplier we can't safely
        // edit. Append a final `.gain(0)` to honour mute at least.
        if (scale === 0) {
          edits.push({ start: absEnd, end: absEnd, replacement: '.gain(0)' });
        }
      }
      // Apply edits right-to-left so offsets stay valid.
      edits.sort((a, b) => b.start - a.start);
      for (const { start, end, replacement } of edits) {
        out = out.slice(0, start) + replacement + out.slice(end);
      }
      // The next lane iterates against the original `source` index space;
      // updates are accumulated in `out`. To keep things simple, sync
      // both — re-run the trigger regex against `out` for the next lane.
      source = out;
    }
    return out;
  };

  const evaluateCurrent = async ({ resetTransport = false, recovery = false } = {}) => {
    const token = ++playGeneration;
    if (!enabled) return { ok: false, skipped: 'disabled' };
    if (videoDucked) return { ok: false, skipped: 'video-ducked' };
    const module = await ensureStrudel();
    if (!enabled) return { ok: false, skipped: 'disabled' };
    if (videoDucked) return { ok: false, skipped: 'video-ducked' };
    if (resetTransport) {
      try {
        module.stop?.();
        module.hush?.();
        module.resetGlobalEffects?.();
      } catch (error) {
        console.warn('Strudel prestart reset failed', error);
      }
    }
    try {
      const context = module.getAudioContext?.();
      if (context?.state === 'suspended') await context.resume();
    } catch (error) {
      console.warn('Strudel audio resume failed', error);
    }
    if (resetTransport) {
      await new Promise((resolve) => window.setTimeout(resolve, 36));
      if (token !== playGeneration) return { ok: false, skipped: 'superseded' };
    }
    if (!enabled || videoDucked) return { ok: false, skipped: enabled ? 'video-ducked' : 'disabled' };
    const song = songPresets[songIndex];
    const rawComposition = song.composition || '';
    try {
      const isMobileTarget = typeof window !== 'undefined'
        && window.matchMedia('(max-width: 700px), (pointer: coarse)').matches;
      module.resumeSetMasterGate?.(1);
      window.__resumeStrudelSidechain = isMobileTarget
        ? { enabled: false }
        : {
            enabled: true,
            keyOrbits: [11],
            targetOrbits: [12],
            floor: 1 - (1 - 0.965) * mixSettings.sidechain,
            attack: 0.018,
            release: 0.24,
          };
      console.info('Strudel play', song.name, song.bpm);
      installLaneTriggerHandlers();
      // Songs with a `composition` field provide their own Strudel
      // source (arrangement, mix, gains all baked in). Bypass
      // makePattern for those — just inject the master gate gain.
      let pattern = rawComposition
        ? applyComposeLaneMix(rawComposition)
        : makePattern(song, activeWASD);
      if (isMobileTarget) {
        // Strip the most CPU-heavy effects from the pattern so mobile
        // audio threads stop missing buffer deadlines (the popping/
        // dragging symptom). Reverb (room/sz), distort, and large
        // unison counts are the dominant cost per beat.
        pattern = pattern
          .replace(/\.room\([^)]*\)/g, '')
          .replace(/\.sz\([^)]*\)/g, '')
          .replace(/\.distort\([^)]*\)/g, '')
          .replace(/\.delay\([^)]*\)/g, '')
          .replace(/\.delaytime\([^)]*\)/g, '')
          .replace(/\.delayfb\([^)]*\)/g, '')
          .replace(/\.unison\(\s*[3-9]\d*\s*\)/g, '.unison(2)')
          .replace(/\.lpf\(\s*sine\.range\([^)]*\)\.slow\([^)]*\)\s*\)/g, '.lpf(900)')
          .replace(/\.detune\(\s*sine\.range\([^)]*\)\.slow\([^)]*\)\s*\)/g, '');
      }
      const evaluatedPattern = await module.evaluate(pattern, true);
      if (resetTransport || !arrangementStartedAtMs) arrangementStartedAtMs = performance.now();
      // Expose the active pattern + source for the live-code REPL feature.
      // It uses pattern.draw(...) to highlight currently-playing tokens
      // and aligns flashes to its overlay using the evaluated source.
      const rawSource = rawComposition || pattern;
      window.__resumeActivePattern = evaluatedPattern;
      window.__resumeActiveSource = pattern;
      window.__resumeActiveRawSource = rawSource;
      if (rawComposition && songIndex === 0) rememberGoodComposition(rawComposition);
      window.dispatchEvent(new CustomEvent('resume-pattern-ready', {
        detail: { pattern: evaluatedPattern, source: pattern, rawSource, songIndex },
      }));
      return { ok: true, source: rawSource, evaluatedSource: pattern, songIndex };
    } catch (error) {
      console.warn('Strudel pattern failed', error);
      window.dispatchEvent(new CustomEvent('resume-pattern-error', {
        detail: { error, source: rawComposition, songIndex, recovery },
      }));
      if (!recovery && songIndex === 0 && rawComposition) {
        const fallbackSource = getRecoveryComposition(rawComposition);
        songPresets[0].composition = fallbackSource;
        savePoetryInProofSource(fallbackSource);
        const fallbackResult = await evaluateCurrent({ resetTransport, recovery: true });
        return {
          ok: false,
          recovered: Boolean(fallbackResult?.ok),
          error,
          failedSource: rawComposition,
          fallbackSource,
          fallbackResult,
        };
      }
      return { ok: false, error, source: rawComposition, songIndex };
    }
  };

  const playCurrent = (options) => {
    return evaluateCurrent(options);
  };

  const clearChordReturnTimer = () => {
    if (!chordReturnTimer) return;
    window.clearTimeout(chordReturnTimer);
    chordReturnTimer = null;
  };

  const clearChordOverride = () => {
    if (!activeWASD) return;
    activeWASD = '';
    activeChordKey = '';
    console.info('Strudel chord override returned to autoplay');
    playCurrent();
    dispatchChordKey(currentAutoplayChordKey || 'W', { override: false, lane: 'chord' });
    window.dispatchEvent(new CustomEvent('resume-audio-change'));
  };

  const scheduleChordReturn = (releasedKey) => {
    if (!activeWASD || activeWASD === WASD_RELEASE_REST || releasedKey.toUpperCase() !== activeChordKey) return;
    clearChordReturnTimer();
    const song = songPresets[songIndex];
    const measureMs = Math.max(1200, (60000 / song.bpm) * 4);
    activeWASD = WASD_RELEASE_REST;
    activeChordKey = '';
    console.info('Strudel chord override released for one-measure rest');
    playCurrent();
    dispatchChordKey('', { override: false, lane: 'wasdRest' });
    window.dispatchEvent(new CustomEvent('resume-audio-change'));
    chordReturnTimer = window.setTimeout(() => {
      chordReturnTimer = null;
      clearChordOverride();
    }, measureMs);
  };

  const bindKeyboard = () => {
    if (keyboardBound) return;
    keyboardBound = true;
    window.addEventListener('keydown', (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey || event.repeat) return;
      const target = event.target;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
      const key = event.key.toLowerCase();
      if ((key === 'w' || key === 'a' || key === 's' || key === 'd') && getActiveHelpPlayerForKeyboard()) return;
      const song = songPresets[songIndex];
      const map = {
        w: song.wasd[0],
        a: song.wasd[1],
        s: song.wasd[2],
        d: song.wasd[3],
      };
      if (event.key === 'Escape' && activeWASD) {
        event.preventDefault();
        clearChordReturnTimer();
        clearChordOverride();
        return;
      }
      if (Object.prototype.hasOwnProperty.call(map, key)) {
        event.preventDefault();
        clearChordReturnTimer();
        activeWASD = map[key];
        activeChordKey = key.toUpperCase();
        console.info('Strudel chord override', activeChordKey, activeWASD);
        // For `disableWasd` presets (composition songs), fire the
        // chord-key event for visual choreography but skip the audio
        // re-eval — the composition is fixed.
        if (song.disableWasd) {
          dispatchChordKey(activeChordKey, { override: true, lane: 'wasdChord' });
        } else {
          dispatchChordKey(activeChordKey, { override: true, lane: 'wasdChord' });
          triggerLiveChord(activeChordKey, activeWASD);
          playCurrent();
        }
        window.dispatchEvent(new CustomEvent('resume-audio-change'));
      }
    }, true);
    window.addEventListener('keyup', (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
      const key = event.key.toLowerCase();
      if ((key === 'w' || key === 'a' || key === 's' || key === 'd') && getActiveHelpPlayerForKeyboard()) return;
      if (key === 'w' || key === 'a' || key === 's' || key === 'd') {
        releaseLiveChord(key.toUpperCase());
        scheduleChordReturn(key);
      }
    }, true);
  };

  const hushCurrent = async (hard = false) => {
    if (hard) playGeneration += 1;
    const suspendContext = async (module) => {
      if (!hard) return;
      try {
        const context = module?.getAudioContext?.();
        if (context?.state === 'running') {
          await context.suspend();
        }
      } catch (error) {
        console.warn('Strudel audio suspend failed', error);
      }
    };
    if (strudel) {
      if (hard) {
        strudel.resumeSetMasterGate?.(0);
        try {
          await strudel.evaluate('stack(note("~").s("sine").gain(0)).cpm(1)', true);
        } catch (error) {
          console.warn('Strudel silence pattern failed', error);
        }
      }
      strudel.stop?.();
      strudel.hush();
      strudel.resetGlobalEffects?.();
      await suspendContext(strudel);
    } else if (initPromise) {
      await initPromise.then(async (module) => {
        if (hard) {
          module.resumeSetMasterGate?.(0);
          try {
            await module.evaluate('stack(note("~").s("sine").gain(0)).cpm(1)', true);
          } catch (error) {
            console.warn('Strudel silence pattern failed', error);
          }
        }
        module.stop?.();
        module.hush();
        module.resetGlobalEffects?.();
        await suspendContext(module);
      }).catch((error) => console.warn('Strudel stop failed', error));
    }
  };

  const setVideoDucked = (active, id = '__video__') => {
    if (videoResumeTimer) {
      window.clearTimeout(videoResumeTimer);
      videoResumeTimer = null;
    }
    if (active) {
      activeVideoAudioIds.add(id);
      if (!videoDucked) videoDuckedWasEnabled = enabled;
      [...liveChordVoices.keys()].forEach((key) => releaseLiveChord(key));
      if (enabled) hushCurrent(true);
      videoDucked = true;
      window.dispatchEvent(new CustomEvent('resume-audio-change'));
      return;
    }
    activeVideoAudioIds.delete(id);
    if (activeVideoAudioIds.size) return;
    if (!videoDucked) return;
    const shouldResume = videoDuckedWasEnabled && enabled;
    videoResumeTimer = window.setTimeout(() => {
      videoResumeTimer = null;
      videoDucked = false;
      videoDuckedWasEnabled = false;
      if (shouldResume) playCurrent({ resetTransport: true });
      window.dispatchEvent(new CustomEvent('resume-audio-change'));
    }, 850);
  };

  window.addEventListener('resume-video-audio-state', (event) => {
    setVideoDucked(Boolean(event.detail?.active), event.detail?.id || '__video__');
  });

  // Suspend the Strudel audio context when this page is no longer the
  // active tab/window so multiple open resume tabs do not compete for
  // decode, scheduling, and audio CPU. Resume + fresh pattern evaluation
  // on return so accumulated scheduling state gets reset.
  let wasPlayingBeforeHidden = false;
  let pendingGestureResume = false;
  const getStrudelAudioContextState = () => {
    try {
      const context = strudel?.getAudioContext?.();
      return context?.state || '';
    } catch {
      return '';
    }
  };
  const audioContextNeedsResume = () => {
    const state = getStrudelAudioContextState();
    return Boolean(state && state !== 'running');
  };
  const resumeAudioAfterReturn = async ({ resetTransport = false, requirePending = false } = {}) => {
    if (!enabled || videoDucked) return false;
    if (requirePending && !pendingGestureResume && !audioContextNeedsResume()) return true;
    pendingGestureResume = false;
    try {
      const module = await ensureStrudel();
      if (module.initAudio) await module.initAudio();
      const context = module.getAudioContext?.();
      if (context && context.state !== 'running') await context.resume();
      const result = await playCurrent({ resetTransport });
      const resumedState = module.getAudioContext?.()?.state || '';
      if (resumedState && resumedState !== 'running') pendingGestureResume = true;
      window.dispatchEvent(new CustomEvent('resume-audio-change'));
      return Boolean(result?.ok !== false && !pendingGestureResume);
    } catch (error) {
      pendingGestureResume = true;
      console.warn('Strudel resume failed', error);
      return false;
    }
  };
  const resumeAfterUserGesture = () => {
    resumeAudioAfterReturn({ resetTransport: false, requirePending: true });
  };
  const suspendForInactivePage = () => {
    wasPlayingBeforeHidden = enabled && !videoDucked;
    pendingGestureResume = wasPlayingBeforeHidden;
    if (wasPlayingBeforeHidden) {
      [...liveChordVoices.keys()].forEach((key) => releaseLiveChord(key));
      hushCurrent(true);
    }
  };
  const resumeAfterPageReturn = () => {
    if (!isResumePageActive()) return;
    if (!wasPlayingBeforeHidden && !pendingGestureResume && !(enabled && audioContextNeedsResume())) return;
    wasPlayingBeforeHidden = false;
    pendingGestureResume = true;
    resumeAudioAfterReturn({ resetTransport: true });
  };
  const syncPageAudioActivity = () => {
    if (isResumePageActive()) resumeAfterPageReturn();
    else suspendForInactivePage();
  };
  document.addEventListener('visibilitychange', syncPageAudioActivity);
  window.addEventListener('resume-page-activity-change', syncPageAudioActivity);
  window.addEventListener('focus', resumeAfterPageReturn);
  window.addEventListener('pageshow', resumeAfterPageReturn);
  window.addEventListener('pointerdown', resumeAfterUserGesture, true);
  window.addEventListener('keydown', resumeAfterUserGesture, true);

  // (Removed the periodic 90s soft reset — verified via CDP harness that
  // it was leaking ~8MB/min on mobile while desktop stayed flat. The
  // reset's stop/hush/resetGlobalEffects sequence does not fully release
  // Strudel's internal allocations on the mobile-stripped pattern.)

  const visualTimingFor = () => {
    const song = songPresets[songIndex];
    const visual = song.visual || {};
    const stepMs = 60000 / song.bpm / 4;
    return {
      stepMs,
      typeMs: stepMs * (visual.typeSteps ?? 1),
      cursorMs: stepMs * (visual.cursorSteps ?? 2),
      wordMs: stepMs * (visual.wordSteps ?? 3),
      lineMs: stepMs * (visual.lineSteps ?? 2),
      drawMs: stepMs * (visual.drawSteps ?? 8),
      pageMs: stepMs * (visual.pageSteps ?? phraseSteps),
      stemPulseMs: stepMs * (visual.stemPulseSteps ?? 4),
    };
  };

  window.__resumeStrudelAudioEngine = {
    get bpm() { return songPresets[songIndex].bpm; },
    get stepMs() { return 60000 / songPresets[songIndex].bpm / 4; },
    get phraseMs() { return (60000 / songPresets[songIndex].bpm / 4) * phraseSteps; },
    get visualTiming() { return visualTimingFor(); },
    get session() { return songPresets[songIndex]; },
    get songIndex() { return songIndex; },
    get songCount() { return songPresets.length; },
    get chordOverride() { return activeChordKey; },
    get currentChordKey() { return activeWASD === WASD_RELEASE_REST ? '' : (activeChordKey || currentAutoplayChordKey); },
    get currentChordLabel() { return activeWASD === WASD_RELEASE_REST ? '' : chordLabelForKey(activeChordKey || currentAutoplayChordKey); },
    get videoDucked() { return videoDucked; },
    get stemMutes() { return { ...stemMutes }; },
    get mixSettings() { return { ...mixSettings }; },
    get mixChannelState() {
      return {
        mute: { ...mixChannelState.mute },
        solo: { ...mixChannelState.solo },
      };
    },
    get scrollLayers() { return { ...scrollLayerState }; },
    get sceneMidiMap() { return { ...SCENE_MIDI_MAP }; },
    get drumMidiMap() {
      return Object.fromEntries(Object.entries(SCENE_MIDI_MAP).filter(([, value]) => value.group === 'drums'));
    },
    emitSceneLane(lane, detail = {}) {
      dispatchLaneMidiEvent(lane, detail);
    },
    get midiOutputEnabled() { return midiOutputEnabled; },
    get midiOutputId() { return midiOutput?.id || ''; },
    get midiOutputName() { return midiOutput?.name || ''; },
    get midiInputEnabled() { return Boolean(midiInput); },
    get midiInputName() { return midiInputName; },
    get midiInputStats() { return { ...midiInputStats }; },
    async requestMidiAccess() {
      if (!navigator.requestMIDIAccess) {
        throw new Error('Web MIDI is not available in this browser.');
      }
      if (!midiAccess) {
        midiAccess = await navigator.requestMIDIAccess({ sysex: false });
      }
      return midiAccess;
    },
    async listMidiOutputs() {
      const access = await this.requestMidiAccess();
      return Array.from(access.outputs.values()).map((output) => ({
        id: output.id,
        name: output.name,
        manufacturer: output.manufacturer,
      }));
    },
    async enableMidiOut(outputIdOrName = '') {
      const access = await this.requestMidiAccess();
      const outputs = Array.from(access.outputs.values());
      midiOutput = outputs.find((output) => output.id === outputIdOrName || output.name === outputIdOrName) || outputs[0] || null;
      midiOutputEnabled = Boolean(midiOutput);
      window.dispatchEvent(new CustomEvent('resume-midi-output-change', {
        detail: { enabled: midiOutputEnabled, id: midiOutput?.id || '', name: midiOutput?.name || '' },
      }));
      return { enabled: midiOutputEnabled, id: midiOutput?.id || '', name: midiOutput?.name || '' };
    },
    disableMidiOut() {
      midiOutputEnabled = false;
      midiOutput = null;
      window.dispatchEvent(new CustomEvent('resume-midi-output-change', {
        detail: { enabled: false, id: '', name: '' },
      }));
    },
    async enableMidiIn(inputIdOrName = '') {
      const access = await this.requestMidiAccess();
      const inputs = Array.from(access.inputs.values());
      if (midiInput) midiInput.onmidimessage = null;
      midiInput = inputs.find((input) => input.id === inputIdOrName || input.name === inputIdOrName) || inputs[0] || null;
      midiInputName = midiInput?.name || '';
      if (!midiInput) return { enabled: false, name: '' };
      midiInput.onmidimessage = (message) => {
        const [status, note, velocity = 0] = message.data || [];
        if (!Number.isFinite(status)) {
          midiInputStats.dropped += 1;
          return;
        }
        // `sysex: false` should suppress real SysEx payloads, but Push/DAW
        // hardware can still send dense system realtime/common bytes
        // (clock, start/stop, active sensing). Those are not scene input.
        if (status >= 0xf0) {
          midiInputStats.dropped += 1;
          midiInputStats.systemDropped += 1;
          return;
        }
        const command = status & 0xf0;
        if (command !== 0x90) {
          midiInputStats.dropped += 1;
          return;
        }
        if (velocity <= 0) {
          midiInputStats.dropped += 1;
          return;
        }
        const now = performance.now();
        if (now - midiInputStats.windowStartedAt > 1000) {
          midiInputStats.windowStartedAt = now;
          midiInputStats.windowCount = 0;
        }
        midiInputStats.windowCount += 1;
        if (midiInputStats.windowCount > 48) {
          midiInputStats.dropped += 1;
          midiInputStats.floodDropped += 1;
          return;
        }
        const channel = (status & 0x0f) + 1;
        const type = 'noteon';
        const laneEntry = Object.entries(SCENE_MIDI_MAP).find(([, value]) => value.channel === channel && value.note === note)
          || Object.entries(SCENE_MIDI_MAP).find(([, value]) => value.group === 'drums' && value.note === note);
        if (!laneEntry) {
          midiInputStats.dropped += 1;
          midiInputStats.unmappedDropped += 1;
          return;
        }
        midiInputStats.accepted += 1;
        const lane = laneEntry?.[0];
        const laneConfig = laneEntry?.[1];
        window.dispatchEvent(new CustomEvent('resume-midi-event', {
          detail: {
            source: 'webmidi',
            type,
            channel,
            group: laneConfig?.group || 'external',
            lane,
            note,
            velocity: velocity / 127,
            id: Date.now(),
            receivedAt: performance.now(),
            raw: Array.from(message.data),
          },
        }));
      };
      return { enabled: true, name: midiInput.name || '' };
    },
    disableMidiIn() {
      if (midiInput) midiInput.onmidimessage = null;
      midiInput = null;
      midiInputName = '';
    },
    toggleStemMute(stem) {
      if (!Object.prototype.hasOwnProperty.call(stemMutes, stem)) return { ...stemMutes };
      stemMutes[stem] = !stemMutes[stem];
      playCurrent({ resetTransport: false });
      window.dispatchEvent(new CustomEvent('resume-audio-change'));
      return { ...stemMutes };
    },
    setMixSetting(name, value) {
      if (!Object.prototype.hasOwnProperty.call(mixSettings, name)) return { ...mixSettings };
      mixSettings[name] = Math.max(0, Math.min(2, Number(value) || 0));
      persistMixState();
      playCurrent({ resetTransport: false });
      window.dispatchEvent(new CustomEvent('resume-mix-change', { detail: { mix: { ...mixSettings } } }));
      window.dispatchEvent(new CustomEvent('resume-audio-change'));
      return { ...mixSettings };
    },
    toggleMixMute(name) {
      if (!mixChannels.includes(name)) return this.mixChannelState;
      mixChannelState.mute[name] = !mixChannelState.mute[name];
      persistMixState();
      playCurrent({ resetTransport: false });
      window.dispatchEvent(new CustomEvent('resume-mix-change', { detail: { mix: { ...mixSettings }, channels: this.mixChannelState } }));
      window.dispatchEvent(new CustomEvent('resume-audio-change'));
      return this.mixChannelState;
    },
    get composeLanes() { return [...composeLanes]; },
    get composeMix() {
      return {
        levels: { ...composeMix.levels },
        mutes:  { ...composeMix.mutes  },
        solos:  { ...composeMix.solos  },
      };
    },
    async setCompositionSource(source, options = {}) {
      if (typeof source !== 'string' || !source.trim()) {
        return { ok: false, error: new Error('Empty source.') };
      }
      const sourceForEval = reserveReplWidgetSpacing(source).source;
      songPresets[0].composition = sourceForEval;
      savePoetryInProofDraftSource(sourceForEval);
      let result = { ok: true, skipped: !enabled && !options.start };
      if (songIndex === 0) {
        if (options.start && !enabled) {
          enabled = true;
          bindKeyboard();
          const module = await ensureStrudel();
          if (module.initAudio) await module.initAudio();
          result = await playCurrent({ resetTransport: true });
          if (result?.ok === false && !result?.recovered && !result?.skipped) {
            enabled = false;
            await hushCurrent(true);
          }
          window.dispatchEvent(new CustomEvent('resume-audio-change'));
        } else if (enabled) {
          result = await playCurrent({ resetTransport: Boolean(options.resetTransport) });
        } else {
          window.__resumeActiveSource = sourceForEval;
          window.__resumeActiveRawSource = sourceForEval;
          window.dispatchEvent(new CustomEvent('resume-pattern-ready', {
            detail: { pattern: window.__resumeActivePattern || null, source: sourceForEval, rawSource: sourceForEval, songIndex },
          }));
        }
      }
      if (result?.ok && !result?.skipped) rememberGoodComposition(sourceForEval);
      return result;
    },
    resetCompositionSource(options = {}) {
      resetStoredPoetryInProofSource();
      songPresets[0].composition = POETRY_IN_PROOF_SOURCE;
      rememberGoodComposition(POETRY_IN_PROOF_SOURCE);
      if (songIndex === 0) {
        if (enabled) playCurrent({ resetTransport: Boolean(options.resetTransport) });
        else {
          window.__resumeActiveSource = POETRY_IN_PROOF_SOURCE;
          window.__resumeActiveRawSource = POETRY_IN_PROOF_SOURCE;
          window.dispatchEvent(new CustomEvent('resume-pattern-ready', {
            detail: {
              pattern: window.__resumeActivePattern || null,
              source: POETRY_IN_PROOF_SOURCE,
              rawSource: POETRY_IN_PROOF_SOURCE,
              songIndex,
            },
          }));
        }
      }
      return POETRY_IN_PROOF_SOURCE;
    },
    setComposeLaneLevel(lane, value) {
      if (!composeLanes.includes(lane)) return this.composeMix;
      composeMix.levels[lane] = Math.max(0, Math.min(2, Number(value) || 0));
      if (songPresets[songIndex].composition) playCurrent({ resetTransport: false });
      window.dispatchEvent(new CustomEvent('resume-compose-mix-change', { detail: this.composeMix }));
      return this.composeMix;
    },
    toggleComposeLaneMute(lane) {
      if (!composeLanes.includes(lane)) return this.composeMix;
      composeMix.mutes[lane] = !composeMix.mutes[lane];
      if (songPresets[songIndex].composition) playCurrent({ resetTransport: false });
      window.dispatchEvent(new CustomEvent('resume-compose-mix-change', { detail: this.composeMix }));
      return this.composeMix;
    },
    toggleComposeLaneSolo(lane) {
      if (!composeLanes.includes(lane)) return this.composeMix;
      composeMix.solos[lane] = !composeMix.solos[lane];
      if (songPresets[songIndex].composition) playCurrent({ resetTransport: false });
      window.dispatchEvent(new CustomEvent('resume-compose-mix-change', { detail: this.composeMix }));
      return this.composeMix;
    },
    toggleMixSolo(name) {
      if (!mixChannels.includes(name)) return this.mixChannelState;
      mixChannelState.solo[name] = !mixChannelState.solo[name];
      persistMixState();
      playCurrent({ resetTransport: false });
      window.dispatchEvent(new CustomEvent('resume-mix-change', { detail: { mix: { ...mixSettings }, channels: this.mixChannelState } }));
      window.dispatchEvent(new CustomEvent('resume-audio-change'));
      return this.mixChannelState;
    },
    setScrollLayers(next = {}, options = {}) {
      const normalized = {
        drums: Number(next.drums ?? scrollLayerState.drums),
        harmony: Number(next.harmony ?? scrollLayerState.harmony),
        melody: Number(next.melody ?? scrollLayerState.melody),
      };
      clearScrollTransitionTimers();
      if (!options.quantized || !enabled) {
        applyScrollLayers(normalized);
        return { ...scrollLayerState };
      }
      const token = ++scrollTransitionToken;
      const firstDelay = quantizedLayerDelayMs(options.gridBeats ?? 0.25, options.maxDelayMs ?? 130);
      const timer = window.setTimeout(() => {
        if (token !== scrollTransitionToken || videoDucked) return;
        applyScrollLayers(normalized);
      }, firstDelay);
      scrollTransitionTimers.push(timer);
      return { ...scrollLayerState };
    },
    setSong(delta) {
      songIndex = (songIndex + delta + songPresets.length) % songPresets.length;
      clearChordReturnTimer();
      activeWASD = '';
      activeChordKey = '';
      currentAutoplayChordKey = '';
      playCurrent();
      dispatchChordKey('', { override: false });
      return songIndex;
    },
    get enabled() { return enabled; },
    async setEnabled(next) {
      enabled = next;
      if (enabled) {
        bindKeyboard();
        const module = await ensureStrudel();
        if (module.initAudio) await module.initAudio();
        const result = await playCurrent({ resetTransport: true });
        if (result?.ok === false && !result?.recovered && !result?.skipped) {
          enabled = false;
          await hushCurrent(true);
          window.dispatchEvent(new CustomEvent('resume-audio-change'));
          throw result.error || new Error('Strudel source failed to evaluate.');
        }
      } else {
        clearChordReturnTimer();
        clearScrollTransitionTimers();
        [...liveChordVoices.keys()].forEach((key) => releaseLiveChord(key));
        activeWASD = '';
        activeChordKey = '';
        currentAutoplayChordKey = '';
        arrangementStartedAtMs = 0;
        videoDucked = false;
        videoDuckedWasEnabled = false;
        activeVideoAudioIds.clear();
        if (videoResumeTimer) {
          window.clearTimeout(videoResumeTimer);
          videoResumeTimer = null;
        }
        await hushCurrent(true);
        dispatchChordKey('', { override: false });
      }
      window.dispatchEvent(new CustomEvent('resume-audio-change'));
      return enabled;
    },
    triggerTyping() {},
    hooks: {
      bass() {},
      melody() {},
      pageTransition() {},
    },
  };

  return window.__resumeStrudelAudioEngine;
}

function getResumeAudioEngine() {
  return getResumeStrudelAudioEngine();
}
function MusicStation() {
  const engine = getResumeAudioEngine();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const refresh = () => setEnabled(engine.enabled);
    window.addEventListener('resume-audio-change', refresh);
    return () => window.removeEventListener('resume-audio-change', refresh);
  }, [engine]);

  const toggle = async () => {
    const requested = !engine.enabled;
    if (requested) {
      // Audio is off and the user clicked the oscillator / gap — they're
      // asking for the full mix. Unmute any stems that were muted from
      // a previous solo before starting playback.
      ['drums', 'harmony', 'melody'].forEach((s) => {
        if (engine.stemMutes[s]) engine.toggleStemMute(s);
      });
    }
    setEnabled(requested);
    try {
      const next = await engine.setEnabled(requested);
      setEnabled(next);
      if (next) window.dispatchEvent(new CustomEvent('resume-song-change'));
    } catch (error) {
      console.warn('Audio toggle failed', error);
      setEnabled(engine.enabled);
    }
  };

  const handleOuterClick = (event) => {
    // Don't toggle master when the click came from a stem-mute button.
    if (event.target.closest('.stem-mute')) return;
    toggle();
  };

  return (
    <div
      className={`music-station ${enabled ? 'is-on' : 'is-muted'}`}
      onClick={handleOuterClick}
      role="button"
      tabIndex={0}
      aria-pressed={enabled}
      aria-label={enabled ? 'Pause site music' : 'Play site music'}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      }}
    >
      <StemMuteControls />
      <AudioScope enabled={enabled} />
    </div>
  );
}

function AudioScope({ enabled }) {
  const canvasRef = useRef(null);
  const pulseRef = useRef({ drum: 0, harmony: 0, melody: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    let raf = 0;
    let phase = 0;
    let last = performance.now();
    let lastPaint = 0;
    const dpr = Math.max(1, window.devicePixelRatio || 1);

    const resize = () => {
      const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== width) canvas.width = width;
      if (canvas.height !== height) canvas.height = height;
    };

    const tick = (now) => {
      const minFrameMs = enabled ? 1000 / 30 : 1000 / 20;
      if (now - lastPaint < minFrameMs) {
        raf = window.requestAnimationFrame(tick);
        return;
      }
      lastPaint = now;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      if (!enabled) {
        // Audio off — filled pointer-cursor arrow that bumps against
        // the left edge of the scope. Two-phase ease: cubic
        // acceleration in, damped-sine oscillation back to rest. The
        // filled arrowhead reads as a cursor pointing at the stem
        // buttons rather than a HUD chevron.
        const period = 880;
        const t = ((now % period) + period) % period / period;
        const jabDistance = 9 * dpr;
        const restHeadX = 4 * dpr;
        const phase1 = 0.16;
        let offset, alpha;
        if (t < phase1) {
          const r = t / phase1;
          const e = r * r * r;
          offset = -jabDistance * e;
          alpha = 0.32 + 0.68 * e;
        } else {
          const r = (t - phase1) / (1 - phase1);
          const decay = Math.exp(-r * 3.4);
          const wobble = Math.cos(r * Math.PI * 2.2);
          offset = -jabDistance * decay * wobble;
          alpha = 1.0 - 0.68 * r;
        }
        ctx.fillStyle = '#111';
        ctx.globalAlpha = alpha;
        const headX = restHeadX + offset;
        const headLen = Math.min(h * 0.55, w * 0.18);  // length of the arrowhead
        const headH  = Math.min(h * 0.34, w * 0.12);   // half-height of the back of the head
        const shaftH = Math.max(1.4 * dpr, headH * 0.30); // half-height of the shaft
        const cy = h / 2;
        // Arrowhead: filled triangle pointing left.
        ctx.beginPath();
        ctx.moveTo(headX,           cy);
        ctx.lineTo(headX + headLen, cy - headH);
        ctx.lineTo(headX + headLen, cy + headH);
        ctx.closePath();
        ctx.fill();
        // Shaft: thin filled rectangle from the back of the head out
        // to the right edge of the canvas.
        const shaftStart = headX + headLen;
        const shaftEnd   = w - 6 * dpr;
        if (shaftEnd > shaftStart) {
          ctx.fillRect(shaftStart, cy - shaftH, shaftEnd - shaftStart, shaftH * 2);
        }
        ctx.globalAlpha = 1;
        raf = window.requestAnimationFrame(tick);
        return;
      }

      ctx.lineWidth = 1 * dpr;
      ctx.strokeStyle = 'rgba(26, 24, 20, 0.18)';
      ctx.beginPath();
      for (let x = 0; x <= w; x += 12 * dpr) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();

      pulseRef.current.drum *= 0.88;
      pulseRef.current.harmony *= 0.94;
      pulseRef.current.melody *= 0.91;
      phase += dt * 5.8;
      const amp = 0.18 + pulseRef.current.drum * 0.34 + pulseRef.current.harmony * 0.26 + pulseRef.current.melody * 0.22;
      const frequency = 2.4 + pulseRef.current.melody * 2.2;

      ctx.strokeStyle = '#111';
      ctx.lineWidth = 1.25 * dpr;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 1.5 * dpr) {
        const t = x / w;
        const carrier = Math.sin((t * frequency + phase) * Math.PI * 2);
        const overtone = Math.sin((t * (frequency * 2.07) - phase * 0.7) * Math.PI * 2) * 0.28;
        const envelope = 0.52 + Math.sin(t * Math.PI) * 0.48;
        const y = h / 2 + (carrier + overtone) * amp * envelope * h * 0.42;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      raf = window.requestAnimationFrame(tick);
    };

    const onDrum = (event) => {
      pulseRef.current.drum = Math.min(1, pulseRef.current.drum + 0.55 * (event.detail?.strength || 1));
    };
    const onHarmony = () => {
      pulseRef.current.harmony = 1;
    };
    const onMelody = () => {
      pulseRef.current.melody = Math.min(1, pulseRef.current.melody + 0.48);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('resume-drum-hit', onDrum);
    window.addEventListener('resume-harmony-hit', onHarmony);
    window.addEventListener('resume-melody-note', onMelody);
    raf = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('resume-drum-hit', onDrum);
      window.removeEventListener('resume-harmony-hit', onHarmony);
      window.removeEventListener('resume-melody-note', onMelody);
    };
  }, [enabled]);

  return <canvas ref={canvasRef} className="review-toggle__scope" aria-hidden="true" />;
}

function ScrollAudioLayers() {
  useEffect(() => {
    const engine = getResumeAudioEngine();
    let raf = null;
    let lastKey = '';
    let pendingKey = '';
    let stableTimer = null;
    const states = {
      hero: { drums: 1, harmony: 1, melody: 1 },
      yellow: { drums: 1, harmony: 0, melody: 0 },
      blue: { drums: 1, harmony: 1, melody: 0 },
      red: { drums: 1, harmony: 1, melody: 1 },
    };
    const sectionState = (id) => {
      if (id === 'summary' || id === 'experience') return 'yellow';
      if (id === 'help' || id === 'blackbird' || id === 'system' || id === 'project') return 'blue';
      if (id === 'awards' || id === 'skills' || id === 'edu' || id === 'refs') return 'red';
      return 'hero';
    };
    const update = () => {
      raf = null;
      const viewportCenter = window.innerHeight * 0.5;
      const identity = document.querySelector('.identity');
      const identityBox = identity?.getBoundingClientRect();
      let key = identityBox && identityBox.bottom > viewportCenter * 0.72 ? 'hero' : 'yellow';
      document.querySelectorAll('.section[id]').forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= viewportCenter && rect.bottom > viewportCenter) {
          key = sectionState(section.id);
        }
      });
      if (key === lastKey) {
        pendingKey = '';
        if (stableTimer) {
          window.clearTimeout(stableTimer);
          stableTimer = null;
        }
        return;
      }
      if (key === pendingKey) return;
      pendingKey = key;
      if (stableTimer) window.clearTimeout(stableTimer);
      stableTimer = window.setTimeout(() => {
        if (pendingKey === lastKey) return;
        lastKey = pendingKey;
        pendingKey = '';
        engine.setScrollLayers(states[lastKey], { quantized: true, gridBeats: 0.25, maxDelayMs: 120 });
      }, 28);
    };
    const schedule = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      if (stableTimer) window.clearTimeout(stableTimer);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);
  return null;
}

function StemMuteControls() {
  const engine = getResumeAudioEngine();
  const [state, setState] = useState({
    enabled: engine.enabled,
    mutes: engine.stemMutes,
    visual: engine.visualTiming,
    scrollLayers: engine.scrollLayers,
  });
  const stems = [
    { id: 'drums', label: 'Drums', shape: 'triangle' },
    { id: 'harmony', label: 'Chords / Pads / Bass', shape: 'circle' },
    { id: 'melody', label: 'Melodies / Textures', shape: 'square' },
  ];

  useEffect(() => {
    const refresh = () => setState({
      enabled: engine.enabled,
      mutes: engine.stemMutes,
      visual: engine.visualTiming,
      scrollLayers: engine.scrollLayers,
    });
    window.addEventListener('resume-audio-change', refresh);
    window.addEventListener('resume-song-change', refresh);
    window.addEventListener('resume-scroll-layers-change', refresh);
    return () => {
      window.removeEventListener('resume-audio-change', refresh);
      window.removeEventListener('resume-song-change', refresh);
      window.removeEventListener('resume-scroll-layers-change', refresh);
    };
  }, [engine]);

  const toggle = (stem) => {
    // Audio off → solo this stem. Mute the other two so the user hears
    // just the section they tapped on. Audio on → normal per-stem toggle.
    if (!engine.enabled) {
      ['drums', 'harmony', 'melody'].forEach((s) => {
        const shouldMute = s !== stem;
        if (Boolean(engine.stemMutes[s]) !== shouldMute) {
          engine.toggleStemMute(s);
        }
      });
      engine.setEnabled(true).catch(() => {});
      return;
    }
    const mutes = engine.toggleStemMute(stem);
    setState((prev) => ({
      ...prev,
      enabled: engine.enabled,
      mutes,
      visual: engine.visualTiming,
    }));
  };

  return (
    <div
      className={`stem-mutes ${state.enabled ? 'is-audio-on' : ''}`}
      aria-label="Music stem mutes"
      style={{ '--stem-pulse-ms': `${state.visual.stemPulseMs}ms` }}
    >
      {stems.map((stem) => {
        const userMuted = Boolean(state.mutes[stem.id]);
        const scrollLevel = state.scrollLayers?.[stem.id] ?? 1;
        const scrollSilenced = !userMuted && scrollLevel <= 0.01;
        let modifier;
        if (!state.enabled) modifier = 'is-muted';
        else if (userMuted) modifier = 'is-muted';
        else if (scrollSilenced) modifier = 'is-scroll-muted';
        else modifier = 'is-on';
        const title = !state.enabled
          ? `Solo ${stem.label} (starts music with just this layer)`
          : userMuted
            ? `Unmute ${stem.label}`
            : scrollSilenced
              ? `${stem.label} — quieted by current section (click to mute manually)`
              : `Mute ${stem.label}`;
        return (
          <button
            key={stem.id}
            type="button"
            className={`stem-mute stem-mute--${stem.shape} ${modifier}`}
            onClick={() => toggle(stem.id)}
            aria-pressed={!userMuted}
            aria-label={title}
            title={title}
          >
            <span className="stem-mute__shape" aria-hidden="true" />
            <span className="stem-mute__label mono">{stem.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function ByrneTitle({ children }) {
  return (
    <g className="diagram-title-block">
      <text className="diagram-label diagram-label--byrne" x="56" y="34">{children}</text>
    </g>
  );
}

// ────────────────────────────────────────────────────────────────────
//  HelpPlayer — embedded MESH-projection 360° video
// ────────────────────────────────────────────────────────────────────

function isMobileFullscreenTarget() {
  return window.matchMedia('(max-width: 900px), (pointer: coarse)').matches;
}

// Web fullscreen was briefly bound to the Mac reel. Keep it behind a flag so the
// floppy/video startup path can still call the helper without forcing browser
// fullscreen.
const MAC_REEL_FULLSCREEN_ENABLED = false;
let reelFullscreenActive = false;
function reelEnterFullscreen() {
  if (!MAC_REEL_FULLSCREEN_ENABLED) return;
  if (typeof document === 'undefined') return;
  if (document.fullscreenElement || document.webkitFullscreenElement) { reelFullscreenActive = true; return; }
  const el = document.documentElement;
  const req = el.requestFullscreen || el.webkitRequestFullscreen;
  if (!req) return;                       // iOS Safari et al: no element fullscreen
  reelFullscreenActive = true;
  try {
    const p = req.call(el);
    if (p && typeof p.catch === 'function') p.catch(() => { reelFullscreenActive = false; });
  } catch (_) { reelFullscreenActive = false; }
}
function reelExitFullscreen() {
  if (!MAC_REEL_FULLSCREEN_ENABLED) {
    reelFullscreenActive = false;
    return;
  }
  if (typeof document === 'undefined' || !reelFullscreenActive) return;
  reelFullscreenActive = false;
  if (!(document.fullscreenElement || document.webkitFullscreenElement)) return;
  const exit = document.exitFullscreen || document.webkitExitFullscreen;
  if (exit) { try { exit.call(document); } catch (_) {} }
}
// Keep our flag honest when the user leaves fullscreen on their own (Esc), so a
// later eject doesn't try to exit a fullscreen we're no longer in.
if (MAC_REEL_FULLSCREEN_ENABLED && typeof document !== 'undefined' && !document.__reelFullscreenHooked) {
  document.__reelFullscreenHooked = true;
  const onReelFsChange = () => {
    if (!(document.fullscreenElement || document.webkitFullscreenElement)) reelFullscreenActive = false;
  };
  document.addEventListener('fullscreenchange', onReelFsChange);
  document.addEventListener('webkitfullscreenchange', onReelFsChange);
}

function enterPseudoFullscreen(slot, afterEnter) {
  slot.classList.add('is-pseudo-fullscreen');
  document.documentElement.classList.add('has-pseudo-fullscreen');
  requestAnimationFrame(() => {
    afterEnter?.();
    setTimeout(() => afterEnter?.(), 180);
  });
}

function exitPseudoFullscreen(slot) {
  slot.classList.remove('is-pseudo-fullscreen');
  document.documentElement.classList.remove('has-pseudo-fullscreen');
}

function getVideoFullscreenSlot(element) {
  if (!element) return null;
  if (element.matches?.('.help-player, .video-slot')) return element;
  return element.closest?.('.help-player, .video-slot') || null;
}

function getActiveHelpPlayerForKeyboard() {
  const fullscreenSlot = getVideoFullscreenSlot(document.fullscreenElement);
  if (fullscreenSlot?.classList?.contains('help-player')) return fullscreenSlot;
  const pseudo = document.querySelector('.help-player.is-pseudo-fullscreen');
  if (pseudo) return pseudo;
  const pinned = document.querySelector('#help.is-help-pinned .help-player');
  if (pinned) return pinned;
  const focused = document.activeElement?.closest?.('.help-player');
  if (focused) return focused;
  return document.querySelector('.help-player:hover');
}

function notifyVideoFullscreenExit(slot) {
  if (!slot) return;
  window.dispatchEvent(new CustomEvent('resume-video-fullscreen-exit', {
    detail: { slot },
  }));
}

function exitActiveVideoFullscreen() {
  const pseudo = document.querySelector('.help-player.is-pseudo-fullscreen, .video-slot.is-pseudo-fullscreen');
  if (pseudo) {
    exitPseudoFullscreen(pseudo);
    notifyVideoFullscreenExit(pseudo);
    return true;
  }
  const nativeSlot = getVideoFullscreenSlot(document.fullscreenElement);
  if (nativeSlot) {
    document.exitFullscreen?.().catch(() => {});
    return true;
  }
  if (document.fullscreenElement) {
    document.exitFullscreen?.().catch(() => {});
    return true;
  }
  return false;
}

function exitScrollPinnedFullscreen() {
  const section = document.querySelector('#help.is-help-pinned, #strudel.is-strudel-pinned');
  if (!section) return false;
  const viewportH = window.innerHeight || document.documentElement.clientHeight || 0;
  const top = section.getBoundingClientRect().top + window.scrollY;
  const target = Math.max(0, top + section.offsetHeight - viewportH + 2);
  if (document.activeElement?.blur) document.activeElement.blur();
  window.scrollTo({ top: target, behavior: 'auto' });
  section.classList.remove('is-help-pinned', 'is-strudel-pinned');
  return true;
}

function installVideoFullscreenEscapeHandler() {
  if (window.__resumeVideoFullscreenEscapeHandlerInstalled) return;
  window.__resumeVideoFullscreenEscapeHandlerInstalled = true;
  let nativeFullscreenSlot = null;
  document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
      nativeFullscreenSlot = getVideoFullscreenSlot(document.fullscreenElement);
      return;
    }
    if (!nativeFullscreenSlot) return;
    const slot = nativeFullscreenSlot;
    nativeFullscreenSlot = null;
    notifyVideoFullscreenExit(slot);
  });
  window.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (!exitActiveVideoFullscreen() && !exitScrollPinnedFullscreen()) return;
    event.preventDefault();
    event.stopPropagation();
  }, true);
}

installVideoFullscreenEscapeHandler();

function HelpPlayer({ src }) {
  const hostRef = useRef(null);
  const [status, setStatus] = useState('loading'); // loading | ready | missing | error
  const [projection, setProjection] = useState(null);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(true);
  const [showHint, setShowHint] = useState(true);
  const [activeChordKey, setActiveChordKey] = useState('');
  const shouldLoad = true;
  const rendererRef = useRef(null);
  const audibleRef = useRef(false);
  const mutedRef = useRef(true);
  const pausedRef = useRef(true);
  const userPausedRef = useRef(false);
  const wasPlayingBeforeHiddenRef = useRef(false);
  const keyboardStartPendingRef = useRef(false);
  const resizeTimerRef = useRef(null);
  const offscreenPauseTimerRef = useRef(null);

	  const forceRendererResize = React.useCallback(() => {
	    const renderer = rendererRef.current;
	    if (!renderer?.resize) return;
    renderer.resize();
    requestAnimationFrame(() => {
      rendererRef.current?.resize?.();
      requestAnimationFrame(() => rendererRef.current?.resize?.());
    });
    if (resizeTimerRef.current) window.clearTimeout(resizeTimerRef.current);
    resizeTimerRef.current = window.setTimeout(() => {
      resizeTimerRef.current = null;
      rendererRef.current?.resize?.();
	    }, 260);
	  }, []);

  const clearOffscreenPauseTimer = React.useCallback(() => {
    if (!offscreenPauseTimerRef.current) return;
    window.clearTimeout(offscreenPauseTimerRef.current);
    offscreenPauseTimerRef.current = null;
  }, []);

  const emitHelpImmersiveState = React.useCallback((active, reason = 'help') => {
    window.dispatchEvent(new CustomEvent('resume-help-immersive-state', {
      detail: { active: Boolean(active), reason },
    }));
  }, []);

	  const getVideoUrl = React.useCallback((candidate) => {
	    if (typeof candidate === 'string') return candidate;
	    return candidate.videoUrl || candidate.src || candidate.url;
	  }, []);

	  const canPlaySource = React.useCallback((candidate) => {
	    const clean = String(getVideoUrl(candidate)).split('?')[0].toLowerCase();
	    const probeVideo = document.createElement('video');
	    if (clean.endsWith('.mp4')) return probeVideo.canPlayType('video/mp4') !== '';
	    if (clean.endsWith('.webm')) {
	      return probeVideo.canPlayType('video/webm; codecs="vp9, opus"') !== ''
	        || probeVideo.canPlayType('video/webm') !== '';
	    }
	    return true;
	  }, [getVideoUrl]);

	  useEffect(() => {
	    let cancelled = false;
	    let idleId = 0;
	    let timerId = 0;
	    const sources = Array.isArray(src) ? src : [src];
	    const warm = async () => {
	      if (!isResumePageActive()) return;
	      try {
	        const candidate = sources.find(canPlaySource);
	        if (!candidate) return;
	        const spotlightLoader = window.__loadSpotlightBundle || (() => window.__spotlightBundlePromise);
	        const mod = await spotlightLoader();
	        if (cancelled) return;
	        await mod.preloadSpotlightSource?.(candidate);
	      } catch (error) {
	        console.warn('[help-player] preload failed', error);
	      }
	    };
	    timerId = window.setTimeout(warm, 350);
	    return () => {
	      cancelled = true;
	      if (idleId) window.cancelIdleCallback?.(idleId);
	      if (timerId) window.clearTimeout(timerId);
	    };
	  }, [src, canPlaySource]);

	  useEffect(() => {
	    if (!shouldLoad) return undefined;
	    let cancelled = false;
    async function go() {
      try {
        const sources = Array.isArray(src) ? src : [src];
        const spotlightLoader = window.__loadSpotlightBundle || (() => window.__spotlightBundlePromise);
        const mod = await spotlightLoader();
        if (cancelled) return;
        const errors = [];
        let sawPlayableSource = false;
        for (const candidate of sources) {
          if (!canPlaySource(candidate)) continue;
          sawPlayableSource = true;
          try {
            const result = await mod.mountSpotlight(hostRef.current, candidate);
            if (cancelled) { result.renderer.dispose(); return; }
            rendererRef.current = result.renderer;
            result.renderer.setStateCallback((state) => {
              mutedRef.current = state.muted;
              pausedRef.current = state.paused;
              setMuted(state.muted);
              setPaused(state.paused);
              const active = !state.muted && !state.paused;
              if (active !== audibleRef.current) {
                audibleRef.current = active;
                window.dispatchEvent(new CustomEvent('resume-video-audio-state', {
                  detail: { id: 'help-player', active },
                }));
              }
            });
            setProjection(result.projection);
            setStatus('ready');
            return;
          } catch (err) {
            errors.push(err);
            console.warn('[help-player] source failed, trying next HELP source', getVideoUrl(candidate), err);
          }
        }
        if (!sawPlayableSource) { if (!cancelled) setStatus('missing'); return; }
        throw errors[errors.length - 1] || new Error('No HELP source mounted.');
      } catch (err) {
        console.error('[help-player]', err);
        if (!cancelled) setStatus('error');
      }
    }
    go();
    return () => {
      cancelled = true;
      audibleRef.current = false;
      window.dispatchEvent(new CustomEvent('resume-video-audio-state', {
        detail: { id: 'help-player', active: false },
      }));
      emitHelpImmersiveState(false, 'unmount');
      if (rendererRef.current) { rendererRef.current.dispose(); rendererRef.current = null; }
      clearOffscreenPauseTimer();
      if (resizeTimerRef.current) {
        window.clearTimeout(resizeTimerRef.current);
        resizeTimerRef.current = null;
      }
    };
	  }, [src, shouldLoad, forceRendererResize, canPlaySource, getVideoUrl, clearOffscreenPauseTimer, emitHelpImmersiveState]);

  useEffect(() => {
    const onKey = (e) => {
      const key = e.key.toLowerCase();
      if (key === 'w' || key === 'a' || key === 's' || key === 'd') setShowHint(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Mirror the Mac keyboard's WASD response: round-robin W → A → S → D
  // on each lead/melody MIDI note, flash for ~175ms (matches the Mac
  // key down 45ms + spring-back 130ms), then release.
  useEffect(() => {
    const sequence = ['W', 'A', 'S', 'D'];
    let idx = 0;
    let clearTimer = null;
    const refreshFromEngine = () => {
      const engine = getResumeAudioEngine();
      if (!engine.enabled) { idx = 0; setActiveChordKey(''); }
    };
    const onMelody = () => {
      const key = sequence[idx % sequence.length];
      idx++;
      setActiveChordKey(key);
      clearTimeout(clearTimer);
      clearTimer = setTimeout(() => setActiveChordKey(''), 175);
    };
    window.addEventListener('resume-melody-note', onMelody);
    window.addEventListener('resume-audio-change', refreshFromEngine);
    refreshFromEngine();
    return () => {
      window.removeEventListener('resume-melody-note', onMelody);
      window.removeEventListener('resume-audio-change', refreshFromEngine);
      clearTimeout(clearTimer);
    };
  }, []);

  useEffect(() => {
    if (status !== 'ready' || typeof IntersectionObserver === 'undefined') return undefined;
    const slot = hostRef.current?.closest('.help-player');
    if (!slot) return undefined;
    const isImmersive = () => (
      Boolean(slot.closest('#help')?.classList.contains('is-help-pinned')) ||
      slot.classList.contains('is-pseudo-fullscreen') ||
      getVideoFullscreenSlot(document.fullscreenElement) === slot
    );
    const pauseWhenStablyOffscreen = () => {
      if (offscreenPauseTimerRef.current || isImmersive()) return;
      offscreenPauseTimerRef.current = window.setTimeout(() => {
        offscreenPauseTimerRef.current = null;
        if (isImmersive()) return;
        const renderer = rendererRef.current;
        if (!renderer) return;
        wasPlayingBeforeHiddenRef.current = !pausedRef.current;
        if (!pausedRef.current) {
          pausedRef.current = true;
          setPaused(true);
          renderer.pause();
          if (!mutedRef.current) {
            audibleRef.current = false;
            window.dispatchEvent(new CustomEvent('resume-video-audio-state', {
              detail: { id: 'help-player', active: false },
            }));
          }
        }
      }, 650);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        const renderer = rendererRef.current;
        if (!renderer) return;
        if ((!entry.isIntersecting || entry.intersectionRatio < 0.16) && !isImmersive()) {
          pauseWhenStablyOffscreen();
          return;
        }
        clearOffscreenPauseTimer();
        forceRendererResize();
        if (
          entry.intersectionRatio >= 0.48 &&
          wasPlayingBeforeHiddenRef.current &&
          !userPausedRef.current
        ) {
          wasPlayingBeforeHiddenRef.current = false;
          renderer.play();
        }
      },
      { threshold: [0, 0.16, 0.48, 1] }
    );
    observer.observe(slot);
    return () => {
      clearOffscreenPauseTimer();
      observer.disconnect();
    };
  }, [status, forceRendererResize, clearOffscreenPauseTimer]);

  useEffect(() => {
    if (status !== 'ready') return undefined;
    forceRendererResize();
    const slot = hostRef.current?.closest('.help-player');
    const onLayoutChange = (event) => {
      if (event.type === 'resume-help-pin-change') {
        const player = event.detail?.section?.querySelector?.('.help-player');
        if (player && player !== slot) return;
      }
      forceRendererResize();
    };
    window.addEventListener('resize', onLayoutChange);
    window.addEventListener('orientationchange', onLayoutChange);
    window.addEventListener('resume-help-pin-change', onLayoutChange);
    document.addEventListener('fullscreenchange', onLayoutChange);
    return () => {
      window.removeEventListener('resize', onLayoutChange);
      window.removeEventListener('orientationchange', onLayoutChange);
      window.removeEventListener('resume-help-pin-change', onLayoutChange);
      document.removeEventListener('fullscreenchange', onLayoutChange);
    };
  }, [status, forceRendererResize]);

  useEffect(() => {
    if (status !== 'ready') return undefined;
    const pauseForInactivePage = () => {
      if (isResumePageActive()) return;
      const renderer = rendererRef.current;
      if (!renderer) return;
      wasPlayingBeforeHiddenRef.current = false;
      userPausedRef.current = true;
      if (!pausedRef.current) {
        pausedRef.current = true;
        mutedRef.current = true;
        setPaused(true);
        setMuted(true);
        renderer.pauseAndMute();
      }
      renderer.setPowerActive?.(false);
    };
    const onPageActivityChange = () => {
      const renderer = rendererRef.current;
      if (!renderer) return;
      if (isResumePageActive()) {
        renderer.setPowerActive?.(true);
        forceRendererResize();
      } else {
        pauseForInactivePage();
      }
    };
    document.addEventListener('visibilitychange', pauseForInactivePage);
    window.addEventListener('resume-page-activity-change', onPageActivityChange);
    onPageActivityChange();
    return () => {
      document.removeEventListener('visibilitychange', pauseForInactivePage);
      window.removeEventListener('resume-page-activity-change', onPageActivityChange);
    };
  }, [status, forceRendererResize]);

  const hideHint = () => setShowHint(false);
  const resetHint = () => setShowHint(true);
  const stopPlayback = React.useCallback(() => {
    userPausedRef.current = true;
    wasPlayingBeforeHiddenRef.current = false;
    clearOffscreenPauseTimer();
    audibleRef.current = false;
    pausedRef.current = true;
    mutedRef.current = true;
    setPaused(true);
    setMuted(true);
    rendererRef.current?.pauseAndMute?.();
    window.dispatchEvent(new CustomEvent('resume-video-audio-state', {
      detail: { id: 'help-player', active: false },
    }));
  }, [clearOffscreenPauseTimer]);

  useEffect(() => {
    const onFullscreenExit = (event) => {
      const slot = hostRef.current?.closest('.help-player');
      if (!slot || event.detail?.slot !== slot) return;
      emitHelpImmersiveState(false, 'fullscreen');
      stopPlayback();
      forceRendererResize();
    };
    window.addEventListener('resume-video-fullscreen-exit', onFullscreenExit);
    return () => window.removeEventListener('resume-video-fullscreen-exit', onFullscreenExit);
  }, [stopPlayback, forceRendererResize, emitHelpImmersiveState]);

  const playHelpWithSound = React.useCallback(() => {
    const renderer = rendererRef.current;
    if (!renderer) return null;
    userPausedRef.current = false;
    wasPlayingBeforeHiddenRef.current = false;
    clearOffscreenPauseTimer();
    window.dispatchEvent(new CustomEvent('resume-video-audio-state', {
      detail: { id: 'help-player', active: true },
    }));
    const playPromise = renderer.playWithSound
      ? renderer.playWithSound({ restart: false })
      : (() => {
          const video = renderer.current?.loaded?.video;
          if (video) video.muted = false;
          return renderer.play?.();
        })();
    if (playPromise?.catch) {
      playPromise.catch(() => {
        window.dispatchEvent(new CustomEvent('resume-video-audio-state', {
          detail: { id: 'help-player', active: false },
        }));
      });
    }
    return playPromise;
  }, [clearOffscreenPauseTimer]);

  const togglePlayback = () => {
    const renderer = rendererRef.current;
    if (!renderer) return;
    const rendererState = renderer.getState?.();
    const isPaused = rendererState?.paused ?? pausedRef.current;
    const isMuted = rendererState?.muted ?? mutedRef.current;
    if (isPaused || isMuted) {
      playHelpWithSound();
    } else {
      stopPlayback();
    }
  };
  const isAudiblePlaying = !paused && !muted;
  const replayWithSound = () => {
    hideHint();
    userPausedRef.current = false;
    wasPlayingBeforeHiddenRef.current = false;
    window.dispatchEvent(new CustomEvent('resume-video-audio-state', {
      detail: { id: 'help-player', active: true },
    }));
    rendererRef.current?.replayWithSound();
  };
  const startFromKeyboard = React.useCallback(() => {
    setShowHint(false);
    const renderer = rendererRef.current;
    if (!renderer) {
      keyboardStartPendingRef.current = true;
      return;
    }
    const rendererState = renderer.getState?.();
    const isPaused = rendererState?.paused ?? pausedRef.current;
    const isMuted = rendererState?.muted ?? mutedRef.current;
    if (!isPaused && !isMuted) return;
    keyboardStartPendingRef.current = false;
    playHelpWithSound();
  }, [playHelpWithSound]);

  useEffect(() => {
    const onKey = (event) => {
      const key = event.key.toLowerCase();
      if (key !== 'w' && key !== 'a' && key !== 's' && key !== 'd') return;
      const slot = hostRef.current?.closest('.help-player');
      if (!slot || getActiveHelpPlayerForKeyboard() !== slot) return;
      startFromKeyboard();
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [startFromKeyboard]);

  useEffect(() => {
    if (status !== 'ready' || !keyboardStartPendingRef.current) return;
    startFromKeyboard();
  }, [status, startFromKeyboard]);

  const toggleFullscreen = () => {
    hideHint();
    const slot = hostRef.current?.closest('.help-player');
    if (!slot) return;
    if (slot.classList.contains('is-pseudo-fullscreen')) {
      exitPseudoFullscreen(slot);
      notifyVideoFullscreenExit(slot);
      forceRendererResize();
      return;
    }
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
      return;
    }
    emitHelpImmersiveState(true, 'fullscreen');
    playHelpWithSound();
    if (isMobileFullscreenTarget()) {
      if (rendererRef.current?.enterNativeVideoFullscreen?.()) return;
      enterPseudoFullscreen(slot, forceRendererResize);
      return;
    }
    if (slot.requestFullscreen) {
      slot.requestFullscreen().catch(() => {
        enterPseudoFullscreen(slot, forceRendererResize);
      });
      return;
    }
    enterPseudoFullscreen(slot, forceRendererResize);
  };

  return (
    <div
      className={`help-player ${muted ? 'is-muted' : ''} ${paused ? 'is-paused' : ''} ${showHint ? 'show-nav-hint' : ''}`}
      onPointerDown={hideHint}
      onMouseEnter={resetHint}
      onFocus={resetHint}
    >
      <div ref={hostRef} className="help-player__canvas" />
      {status === 'loading' && (
        <div className="help-player__overlay help-player__overlay--loading" aria-label="Loading HELP video">
          <div className="help-player__placeholder-grid" />
        </div>
      )}
      {status === 'missing' && (
        <div className="help-player__overlay help-player__overlay--missing">
          <div className="help-player__placeholder-grid" />
          <div className="help-player__missing">
            <div className="mono small dim">Asset not found</div>
            <div className="serif large">place <span className="mono">help_full.webm</span></div>
            <div className="serif large">at <span className="mono">resume/media/</span></div>
            <div className="mono small dim" style={{marginTop:'1em'}}>video unavailable</div>
          </div>
        </div>
      )}
      {status === 'error' && (
        <div className="help-player__overlay">
          <div className="help-player__placeholder-grid" />
          <div className="help-player__missing">
            <div className="mono small">Video unavailable</div>
          </div>
        </div>
      )}
      {status === 'ready' && (
        <>
          <div className="help-player__hud">
            <div className="hud-pill mono">
              <span className="hud-dot" /> projection · {projection || 'mesh'}
            </div>
            <div className="hud-pill mono dim">drag / swipe / wasd</div>
          </div>
          <div className="wasd-hint" aria-hidden="true">
            <div className="wasd-hint__grid mono">
              <span />
              <span className={`wasd-key ${activeChordKey === 'W' ? 'is-active' : ''}`} data-key="W"><b>W</b><i>↑</i></span>
              <span />
              <span className={`wasd-key ${activeChordKey === 'A' ? 'is-active' : ''}`} data-key="A"><b>A</b><i>←</i></span>
              <span className={`wasd-key wasd-key--center ${activeChordKey === 'S' ? 'is-active' : ''}`} data-key="S"><b>S</b><i>↓</i></span>
              <span className={`wasd-key ${activeChordKey === 'D' ? 'is-active' : ''}`} data-key="D"><b>D</b><i>→</i></span>
            </div>
            <div className="swipe-hint">
              <span className="swipe-hint__track"><i /></span>
            </div>
          </div>
          <div className="video-controls video-controls--help" aria-label="HELP video controls">
            <button className="video-control video-control--primary mono" onClick={togglePlayback} aria-label={isAudiblePlaying ? 'Pause video' : 'Play video with sound'}>
              <span className={`video-control__icon ${isAudiblePlaying ? 'video-control__icon--stop' : 'video-control__icon--play'}`} aria-hidden="true" />
            </button>
            <button className="video-control mono" onClick={replayWithSound} aria-label="Replay from beginning with sound">
              <span className="video-control__icon video-control__icon--replay" aria-hidden="true" />
            </button>
          </div>
          <button className="video-fullscreen-corner" onClick={toggleFullscreen} aria-label="Enter fullscreen" />
        </>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────
//  VideoSlot — flat-video placeholder w/ auto-fill when asset present
// ────────────────────────────────────────────────────────────────────

function VideoSlot({ src, label, fallbackPath }) {
  const slotRef = useRef(null);
  const videoRef = useRef(null);
  const slotIdRef = useRef(`video-slot-${Math.random().toString(36).slice(2)}`);
  const userHeldPlaybackRef = useRef(false);
  const [status, setStatus] = useState('loading'); // loading | ready | missing
  const [shouldLoad, setShouldLoad] = useState(false);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(true);

  const emitVideoAudioState = () => {
    const video = videoRef.current;
    window.dispatchEvent(new CustomEvent('resume-video-audio-state', {
      detail: {
        id: slotIdRef.current,
        active: Boolean(video && !video.muted && !video.paused && !video.ended),
      },
    }));
  };

  useEffect(() => {
    const slot = slotRef.current;
    if (!slot || typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin: '560px 0px', threshold: 0.01 }
    );
    observer.observe(slot);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoad) return undefined;
    let cancelled = false;
    async function probe() {
      setStatus('loading');
      if (/^https?:\/\//.test(src)) {
        setStatus('ready');
        return;
      }
      const res = await fetch(src, { method: 'HEAD' }).catch(() => null);
      if (cancelled) return;
      if (res && res.ok) setStatus('ready'); else setStatus('missing');
    }
    probe();
    return () => { cancelled = true; };
  }, [src, shouldLoad]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || status !== 'ready') return undefined;
    const syncAudio = () => {
      setMuted(video.muted);
      emitVideoAudioState();
    };
    const syncPlayback = () => {
      setPaused(video.paused);
      emitVideoAudioState();
    };
    const pauseOtherSlots = (event) => {
      if (event.detail?.id === slotIdRef.current) return;
      if (!event.detail?.userInitiated && userHeldPlaybackRef.current) return;
      userHeldPlaybackRef.current = false;
      if (window.__resumeHeldVideoSlot === slotIdRef.current) window.__resumeHeldVideoSlot = null;
      video.muted = true;
      video.pause();
    };
    video.addEventListener('volumechange', syncAudio);
    video.addEventListener('play', syncPlayback);
    video.addEventListener('pause', syncPlayback);
    video.addEventListener('ended', syncPlayback);
    window.addEventListener('resume-video-slot-active', pauseOtherSlots);
    syncAudio();
    syncPlayback();
    return () => {
      video.removeEventListener('volumechange', syncAudio);
      video.removeEventListener('play', syncPlayback);
      video.removeEventListener('pause', syncPlayback);
      video.removeEventListener('ended', syncPlayback);
      window.dispatchEvent(new CustomEvent('resume-video-audio-state', {
        detail: { id: slotIdRef.current, active: false },
      }));
      window.removeEventListener('resume-video-slot-active', pauseOtherSlots);
    };
  }, [status]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || status !== 'ready' || typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.62 && video.paused) {
          activateSlot();
        } else if (!entry.isIntersecting || entry.intersectionRatio < 0.2) {
          if (!userHeldPlaybackRef.current) {
            video.muted = true;
            video.pause();
          }
        }
      },
      { threshold: [0, 0.2, 0.62, 1] }
    );
    const slot = video.closest('.video-slot');
    if (slot) observer.observe(slot);
    return () => observer.disconnect();
  }, [status]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || status !== 'ready') return undefined;
    const pauseForInactivePage = () => {
      if (isResumePageActive()) return;
      userHeldPlaybackRef.current = false;
      if (window.__resumeHeldVideoSlot === slotIdRef.current) window.__resumeHeldVideoSlot = null;
      video.muted = true;
      if (!video.paused) video.pause();
      emitVideoAudioState();
    };
    document.addEventListener('visibilitychange', pauseForInactivePage);
    window.addEventListener('resume-page-activity-change', pauseForInactivePage);
    return () => {
      document.removeEventListener('visibilitychange', pauseForInactivePage);
      window.removeEventListener('resume-page-activity-change', pauseForInactivePage);
    };
  }, [status]);

  const stopPlayback = React.useCallback(() => {
    const video = videoRef.current;
    userHeldPlaybackRef.current = false;
    if (window.__resumeHeldVideoSlot === slotIdRef.current) window.__resumeHeldVideoSlot = null;
    if (video) {
      video.muted = true;
      if (!video.paused) video.pause();
    }
    window.dispatchEvent(new CustomEvent('resume-video-audio-state', {
      detail: { id: slotIdRef.current, active: false },
    }));
  }, []);

  useEffect(() => {
    const pauseForHelp = (event) => {
      if (event.type === 'resume-video-audio-state') {
        if (event.detail?.id !== 'help-player' || !event.detail?.active) return;
      } else if (!event.detail?.active && !event.detail?.pinned) {
        return;
      }
      stopPlayback();
    };
    window.addEventListener('resume-video-audio-state', pauseForHelp);
    window.addEventListener('resume-help-pin-change', pauseForHelp);
    window.addEventListener('resume-help-immersive-state', pauseForHelp);
    return () => {
      window.removeEventListener('resume-video-audio-state', pauseForHelp);
      window.removeEventListener('resume-help-pin-change', pauseForHelp);
      window.removeEventListener('resume-help-immersive-state', pauseForHelp);
    };
  }, [stopPlayback]);

  useEffect(() => {
    if (status !== 'ready') return undefined;
    const video = videoRef.current;
    const onFullscreenExit = (event) => {
      const slot = slotRef.current;
      if (!slot || event.detail?.slot !== slot) return;
      stopPlayback();
    };
    window.addEventListener('resume-video-fullscreen-exit', onFullscreenExit);
    video?.addEventListener?.('webkitendfullscreen', stopPlayback);
    return () => {
      window.removeEventListener('resume-video-fullscreen-exit', onFullscreenExit);
      video?.removeEventListener?.('webkitendfullscreen', stopPlayback);
    };
  }, [status, stopPlayback]);

  function activateSlot({ withSound = false, restart = false, userInitiated = false } = {}) {
    const video = videoRef.current;
    if (!video) return;
    if (!userInitiated && window.__resumeHeldVideoSlot && window.__resumeHeldVideoSlot !== slotIdRef.current) return;
    window.dispatchEvent(new CustomEvent('resume-video-slot-active', {
      detail: { id: slotIdRef.current, userInitiated }
    }));
    if (restart) video.currentTime = 0;
    video.muted = !withSound;
    if (userInitiated && !video.muted) {
      userHeldPlaybackRef.current = true;
      window.__resumeHeldVideoSlot = slotIdRef.current;
      window.dispatchEvent(new CustomEvent('resume-video-audio-state', {
        detail: { id: slotIdRef.current, active: true },
      }));
    }
    video.play().catch(() => {});
  }

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      activateSlot({ withSound: true, restart: true, userInitiated: true });
    } else {
      stopPlayback();
    }
  };

  const replayWithSound = () => activateSlot({ withSound: true, restart: true, userInitiated: true });

  const toggleFullscreen = () => {
    const slot = videoRef.current?.closest('.video-slot');
    if (!slot) return;
    if (slot.classList.contains('is-pseudo-fullscreen')) {
      exitPseudoFullscreen(slot);
      notifyVideoFullscreenExit(slot);
      return;
    }
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
      return;
    }
    if (isMobileFullscreenTarget()) {
      const video = videoRef.current;
      const enterNative = video?.webkitEnterFullscreen || video?.webkitEnterFullScreen || video?.requestFullscreen;
      if (enterNative) {
        try {
          enterNative.call(video);
          return;
        } catch (_) {}
      }
      enterPseudoFullscreen(slot);
      return;
    }
    if (slot.requestFullscreen) {
      slot.requestFullscreen().catch(() => {
        enterPseudoFullscreen(slot);
      });
      return;
    }
    enterPseudoFullscreen(slot);
  };

  return (
    <div
      ref={slotRef}
      className={`video-slot ${muted ? 'is-muted' : ''} ${paused ? 'is-paused' : ''}`}
      onMouseEnter={() => activateSlot()}
      onFocus={() => activateSlot()}
    >
      {status === 'ready' && (
        <video
          ref={videoRef}
          src={src}
          muted
          loop
          playsInline
          preload="none"
          className="video-slot__video"
          onError={() => setStatus('missing')}
        />
      )}
      {status === 'loading' && (
        <div className="video-slot__overlay">
          <div className="help-player__placeholder-grid" />
          <div className="help-player__label">
            <span className="mono">[ probing asset ]</span>
          </div>
        </div>
      )}
      {status === 'missing' && (
        <div className="video-slot__overlay video-slot__overlay--missing">
          <div className="help-player__placeholder-grid" />
          <div className="help-player__missing">
            <div className="mono small dim">Asset not found</div>
            <div className="serif large">place <span className="mono">{fallbackPath.split('/').pop()}</span></div>
            <div className="serif large">at <span className="mono">{fallbackPath.replace(/\/[^/]+$/, '/')}</span></div>
            <div className="mono small dim" style={{marginTop:'1em'}}>
              the slot will auto-mount the clip on next reload
            </div>
          </div>
        </div>
      )}
      {label && (
        <div className="help-player__hud">
          <div className="hud-pill mono">
            <span className="hud-dot" /> {label}
          </div>
        </div>
      )}
      {status === 'ready' && (
        <div className="video-controls" aria-label="Video controls">
          <button className="video-control video-control--primary mono" onClick={togglePlayback} aria-label={paused ? 'Play video' : 'Pause video'}>
            <span className={`video-control__icon ${paused ? 'video-control__icon--play' : 'video-control__icon--stop'}`} aria-hidden="true" />
          </button>
          <button className="video-control mono" onClick={replayWithSound} aria-label="Replay from beginning with sound">
            <span className="video-control__icon video-control__icon--replay" aria-hidden="true" />
          </button>
        </div>
      )}
      {status === 'ready' && (
        <button className="video-fullscreen-corner" onClick={toggleFullscreen} aria-label="Enter fullscreen" />
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────
//  BlackbirdFeature — flat video + context (parallel to HELP)
// ────────────────────────────────────────────────────────────────────

const HELP_AWARD_STAMPS = [
  { org: "Cannes Lions", award: "Gold · Innovative Use of Tech", diagram: "circles", lane: "chord", midiChannel: 6, midiNote: 48 },
  { org: "Cannes Lions", award: "Gold · Virtual Reality", diagram: "sphere", lane: "lead", midiChannel: 9, midiNote: 76 },
  { org: "SXSW", award: "Gold · AR/VR Breakthrough", diagram: "axis", lane: "bass", midiChannel: 5, midiNote: 36 },
  { org: "Webby", award: "Technical Achievement", diagram: "triangle", lane: "snare", midiChannel: 2, midiNote: 38 },
];

const BLACKBIRD_AWARD_STAMPS = [
  { org: "HPA", award: "Judges Award · Creativity + Innovation", diagram: "axis", lane: "kick", midiChannel: 1, midiNote: 36 },
  { org: "Cannes Lions", award: "Gold · Innovative Use of Tech", diagram: "triangle", lane: "bass", midiChannel: 5, midiNote: 36 },
  { org: "CLIO Awards", award: "2016 · Production Innovation", diagram: "circles", lane: "lead", midiChannel: 9, midiNote: 76 },
];

const PROOF_STAMP_LANES = ["kick", "snare", "hat", "perc", "chord", "bass", "lead"];
const PROOF_STAMP_MIDI = {
  "1:36": "kick",
  "2:38": "snare",
  "3:42": "hat",
  "4:39": "perc",
  "5:36": "bass",
  "6:48": "chord",
  "9:76": "lead",
};

function useProofStampPulses() {
  const [pulses, setPulses] = useState({});
  const timersRef = useRef({});
  useEffect(() => {
    const emitPulse = (lane, detail = {}) => {
      if (!PROOF_STAMP_LANES.includes(lane)) return;
      const duration = Math.max(220, detail.duration || 640);
      setPulses((current) => {
        const seq = (current[lane]?.seq || 0) + 1;
        window.clearTimeout(timersRef.current[lane]);
        timersRef.current[lane] = window.setTimeout(() => {
          setPulses((latest) => (
            latest[lane]?.seq === seq
              ? { ...latest, [lane]: { ...latest[lane], active: false } }
              : latest
          ));
        }, duration);
        return {
          ...current,
          [lane]: {
          id: detail.id || Date.now(),
          seq,
          lane,
          active: true,
          strength: detail.strength ?? detail.velocity ?? 1,
          duration,
          midiNote: detail.midiNote ?? detail.note,
          channel: detail.channel,
        },
        };
      });
    };
    const onMidiEvent = (event) => {
      const detail = event.detail || {};
      if (detail.type !== "noteon") return;
      const lane = detail.lane || PROOF_STAMP_MIDI[`${detail.channel}:${detail.note}`];
      emitPulse(lane, {
        id: detail.id,
        strength: detail.velocity,
        duration: detail.duration,
        midiNote: detail.note,
        channel: detail.channel,
      });
    };
    window.addEventListener("resume-midi-event", onMidiEvent);
    window.__resumeProofStampPulse = (lane = "kick") => {
      const midiKey = Object.keys(PROOF_STAMP_MIDI).find((key) => PROOF_STAMP_MIDI[key] === lane) || "1:36";
      const [channel, note] = midiKey.split(":").map(Number);
      window.dispatchEvent(new CustomEvent("resume-midi-event", {
        detail: {
          source: "manual",
          type: "noteon",
          group: "drums",
          lane,
          note,
          channel,
          velocity: 1,
          duration: 640,
          id: Date.now(),
        },
      }));
    };
    return () => {
      Object.values(timersRef.current).forEach((timer) => window.clearTimeout(timer));
      timersRef.current = {};
      window.removeEventListener("resume-midi-event", onMidiEvent);
      if (window.__resumeProofStampPulse) delete window.__resumeProofStampPulse;
    };
  }, []);
  return pulses;
}

function ProofDiagram({ type }) {
  if (type === "sphere") {
    return (
      <svg viewBox="0 0 88 52" aria-hidden="true" focusable="false">
        <path className="proof-stamp__area proof-stamp__area--blue" d="M44 9 A17 17 0 0 1 61 26 A17 17 0 0 1 44 43 Z" />
        <path className="proof-stamp__area proof-stamp__area--yellow" d="M44 9 A17 17 0 0 0 27 26 H44 Z" />
        <path className="proof-stamp__area proof-stamp__area--red" d="M27 26 A17 17 0 0 0 44 43 V26 Z" />
        <circle className="proof-stamp__line" cx="44" cy="26" r="17" />
      </svg>
    );
  }
  if (type === "axis") {
    return (
      <svg viewBox="0 0 88 52" aria-hidden="true" focusable="false">
        <rect className="proof-stamp__area proof-stamp__area--yellow" x="20" y="25" width="18" height="18" />
        <path className="proof-stamp__area proof-stamp__area--blue" d="M38 43 H68 L68 25 Z" />
        <path className="proof-stamp__area proof-stamp__area--red" d="M38 43 L68 25 H38 Z" />
        <path className="proof-stamp__line" d="M20 43 H68 V25 H38 V43 H20 Z" />
      </svg>
    );
  }
  if (type === "triangle") {
    return (
      <svg viewBox="0 0 88 52" aria-hidden="true" focusable="false">
        <path className="proof-stamp__area proof-stamp__area--yellow" d="M18 39 L44 12 L44 39 Z" />
        <path className="proof-stamp__area proof-stamp__area--blue" d="M44 12 L70 39 H44 Z" />
        <path className="proof-stamp__area proof-stamp__area--red" d="M28 39 L44 23 L60 39 Z" />
        <path className="proof-stamp__line" d="M18 39 H70 L44 12 Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 88 52" aria-hidden="true" focusable="false">
      <circle className="proof-stamp__area proof-stamp__area--yellow" cx="32" cy="27" r="15" />
      <circle className="proof-stamp__area proof-stamp__area--blue" cx="56" cy="27" r="15" />
      <path className="proof-stamp__area proof-stamp__area--red" d="M44 14 A15 15 0 0 1 44 40 A15 15 0 0 1 44 14" />
      <circle className="proof-stamp__line" cx="32" cy="27" r="15" />
      <circle className="proof-stamp__line" cx="56" cy="27" r="15" />
    </svg>
  );
}

function ProofStamp({ item, pulse }) {
  const strength = Math.max(0.5, Math.min(1.35, pulse?.strength || 1));
  const duration = Math.max(220, pulse?.duration || 640);

  return (
    <li
      className={`proof-stamp proof-stamp--${item.lane} ${pulse?.active ? "is-midi-on" : ""}`}
      style={{
        "--proof-midi-pulse-ms": `${duration}ms`,
        "--proof-midi-strength": strength,
        "--proof-midi-fill-peak": 1 + 0.08 * strength,
        "--proof-midi-fill-sustain": 1 + 0.035 * strength,
      }}
    >
      <span className="proof-stamp__org mono">{item.org}</span>
      <span className="proof-stamp__diagram">
        <ProofDiagram type={item.diagram} />
      </span>
      <span className="proof-stamp__award">{item.award}</span>
    </li>
  );
}

function ProofStampRow({ items, compact, className = "" }) {
  const pulses = useProofStampPulses();
  return (
    <ul className={`proof-stamps ${compact ? "proof-stamps--compact" : ""} ${className}`}>
      {items.map((item, index) => (
        <ProofStamp
          key={`${item.org}-${index}`}
          item={item}
          pulse={pulses[item.lane]}
        />
      ))}
    </ul>
  );
}

function BlackbirdFeature({ innovationSrc, behindScenesSrc, label = "04 · SELECTED WORK · THE MILL BLACKBIRD" }) {
  return (
    <Section id="blackbird" label={label}>
      <div className="help-feature">
        <div className="help-feature__player-col help-feature__player-col--wide">
          <div className="video-stack">
            <VideoSlot src={innovationSrc} fallbackPath="resume/media/blackbird-innovation.mp4" label="cannes lions innovation film · the mill blackbird" />
            <VideoSlot src={behindScenesSrc} fallbackPath="resume/media/blackbird.mp4" label="behind the scenes · chevrolet the human race" />
          </div>
        </div>
        <aside className="help-feature__notes help-feature__notes--match-stack">
          <h3 className="serif">The adjustable car. A three-year product arc.</h3>
          <ProofStampRow items={BLACKBIRD_AWARD_STAMPS} compact className="proof-stamps--no-rails proof-stamps--under-heading" />
          <p>
            <strong>The Mill Blackbird</strong> began as an unmet need in automotive advertising:
            shoot the spot before the car exists, or the trim is undecided, or the model isn't
            even painted yet. We answered it with a fully adjustable, drivable rig that maps to
            any production CG car body in post.
          </p>
          <p>
            As Technical Innovations Manager, I led the technical product management on
            this project across hardware, on-set workflow, and the CG pipeline. The rig
            went on to win the HPA Judges Award and a Cannes Gold Lion.
          </p>
          <p>
            The system later powered Chevrolet <em>The Human Race</em>, combining live video
            feeds, Arraiy positional tracking, Unreal Engine, and The Mill's Mill Cyclops
            virtual production toolkit so directors could see the Camaro rendered and
            composited into the shot in real time.
          </p>
          <dl className="blackbird-facts">
            <div>
              <dt className="mono">Physical rig</dt>
              <dd>Adjustable wheelbase, track width, suspension, and driving characteristics for multiple CG car bodies.</dd>
            </div>
            <div>
              <dt className="mono">Realtime view</dt>
              <dd>Live camera feeds and positional data pushed into Unreal for on-set composition decisions.</dd>
            </div>
            <div>
              <dt className="mono">Production bridge</dt>
              <dd>A practical platform connecting vehicle photography, tracking, virtual production, and final CG finishing.</dd>
            </div>
          </dl>
        </aside>
      </div>
    </Section>
  );
}

// ────────────────────────────────────────────────────────────────────
//  StrudelReplFeature — live-code panel running the halftime trap
//  composition. Edit, hit play, hear it run through the same Strudel
//  scheduler the hero uses (it pauses the hero audio while playing so
//  the two patterns don't fight each other).
// ────────────────────────────────────────────────────────────────────

const STRUDEL_REPL_INITIAL_CODE = POETRY_IN_PROOF_SOURCE;
const REPL_WIDGET_LIMIT = 8;
const REPL_WIDGET_TYPES = {
  scope: { lineSpan: 4, reserveLines: 0, sticky: true },
  tscope: { lineSpan: 4, reserveLines: 0, sticky: true },
  fscope: { lineSpan: 4, reserveLines: 0, sticky: true },
  spectrum: { lineSpan: 4, reserveLines: 0, sticky: true },
  pianoroll: { lineSpan: 10 },
  punchcard: { lineSpan: 10 },
};
const REPL_WIDGET_CALL_RE = /\.(_?(scope|tscope|fscope|spectrum|pianoroll|punchcard))\s*\(([^)]*)\)/g;

function normalizeReplWidgetKind(kind = '') {
  return String(kind || '').replace(/^_/, '');
}

function getReplWidgetId(args = '') {
  const objectId = args.match(/\bid\s*:\s*['"]?([A-Za-z0-9_-]+)['"]?/)?.[1];
  if (objectId) return String(objectId);
  const firstArg = args.match(/^\s*['"]?([A-Za-z0-9_-]+)['"]?\s*(?:,|$)/)?.[1];
  return firstArg ? String(firstArg) : '1';
}

function parseReplWidgets(source) {
  const text = String(source || '');
  const lines = text.split('\n');
  const widgets = [];
  let sourceOffset = 0;
  lines.forEach((line, lineIndex) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('//')) {
      REPL_WIDGET_CALL_RE.lastIndex = 0;
      let match;
      let lineOffset = 0;
      while ((match = REPL_WIDGET_CALL_RE.exec(line)) !== null) {
        const kind = normalizeReplWidgetKind(match[2]);
        const config = REPL_WIDGET_TYPES[kind];
        if (!config) continue;
        const id = getReplWidgetId(match[3] || '');
        const reserveLines = config.reserveLines ?? config.lineSpan;
        const start = sourceOffset + match.index;
        const end = start + match[0].length;
        widgets.push({
          kind,
          id,
          key: `${lineIndex}-${match.index}-${kind}-${id}`,
          lineIndex,
          visualLineIndex: lineIndex + lineOffset,
          lineSpan: config.lineSpan,
          reserveLines,
          sticky: Boolean(config.sticky),
          start,
          end,
        });
        lineOffset += reserveLines;
      }
    }
    sourceOffset += line.length + (lineIndex < lines.length - 1 ? 1 : 0);
  });
  return widgets;
}

function reserveReplWidgetSpacing(source, selectionStart = null, selectionEnd = selectionStart) {
  const lines = String(source || '').split('\n');
  const out = [];
  let changed = false;
  let sourceOffset = 0;
  let nextStart = Number.isFinite(selectionStart) ? selectionStart : null;
  let nextEnd = Number.isFinite(selectionEnd) ? selectionEnd : nextStart;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineStart = sourceOffset;
    const lineEnd = lineStart + line.length;
    out.push(line);
    sourceOffset = lineEnd + (i < lines.length - 1 ? 1 : 0);

    const widgets = parseReplWidgets(line);
    const lineSpan = widgets.length
      ? widgets.reduce((sum, widget) => sum + (widget.reserveLines ?? widget.lineSpan), 0)
      : 0;
    if (!lineSpan) continue;

    let blankCount = 0;
    for (let j = i + 1; j < lines.length && blankCount < lineSpan; j++) {
      if (lines[j].trim()) break;
      blankCount++;
    }
    const missing = lineSpan - blankCount;
    if (missing <= 0) continue;

    changed = true;
    for (let j = 0; j < missing; j++) out.push('');
    if (nextStart !== null && selectionStart >= lineEnd) nextStart += missing;
    if (nextEnd !== null && selectionEnd >= lineEnd) nextEnd += missing;
  }

  return {
    source: changed ? out.join('\n') : source,
    selectionStart: nextStart,
    selectionEnd: nextEnd,
  };
}

// Lanes shown in the MIDI bus monitor below the editor. The `lane` value
// matches the lane id from SCENE_MIDI_MAP in the audio engine, which is
// what every `resume-midi-event` carries. `group` controls the chip
// accent colour. Channel/note come from the engine at runtime so we
// don't have to keep the constants in sync here.
const REPL_MIDI_LANES = [
  { lane: 'chord',     short: 'pad',     group: 'harmony' },
  { lane: 'lead',      short: 'lead',    group: 'melody'  },
  { lane: 'bass',      short: 'sub',     group: 'bass'    },
  { lane: 'kick',      short: 'kick',    group: 'drums'   },
  { lane: 'snare',     short: 'snare',   group: 'drums'   },
  { lane: 'hat',       short: 'hat',     group: 'drums'   },
];

function MidiBusMonitor({ compact = false } = {}) {
  const chipRefs = React.useRef({});
  const [laneMeta, setLaneMeta] = React.useState({});
  // Composition mix (mute/solo/level per lane) — mirrors the engine.
  const [mix, setMix] = React.useState(() => ({
    levels: {}, mutes: {}, solos: {},
  }));

  // Pull each lane's channel + note from the engine on mount and whenever
  // it announces a state change (so a song-change keeps us honest).
  React.useEffect(() => {
    const onMixChange = (e) => setMix(e.detail);
    const refresh = () => {
      const engine = window.__resumeStrudelAudioEngine;
      const map = engine?.sceneMidiMap;
      if (map) {
        const next = {};
        for (const { lane } of REPL_MIDI_LANES) {
          if (map[lane]) next[lane] = { channel: map[lane].channel, note: map[lane].note };
        }
        setLaneMeta(next);
      }
      if (engine?.composeMix) setMix(engine.composeMix);
    };
    refresh();
    window.addEventListener('resume-audio-change', refresh);
    window.addEventListener('resume-compose-mix-change', onMixChange);
    return () => {
      window.removeEventListener('resume-audio-change', refresh);
      window.removeEventListener('resume-compose-mix-change', onMixChange);
    };
  }, []);

  // Map MIDI lane id → compose-lane id. The composition uses `chord` for
  // the pad pattern's lane label; SCENE_MIDI_MAP keys it as `chord` too.
  // The other ids line up 1:1.
  const composeLaneFor = (laneId) => {
    if (laneId === 'wasdChord') return 'chord';
    return laneId;
  };

  const onLevel = (laneId, value) => {
    const cl = composeLaneFor(laneId);
    window.__resumeStrudelAudioEngine?.setComposeLaneLevel?.(cl, value);
  };
  const onToggleMute = (laneId) => {
    window.__resumeStrudelAudioEngine?.toggleComposeLaneMute?.(composeLaneFor(laneId));
  };
  const onToggleSolo = (laneId) => {
    window.__resumeStrudelAudioEngine?.toggleComposeLaneSolo?.(composeLaneFor(laneId));
  };

  // Flash a chip every time its lane fires. Direct DOM toggling avoids
  // re-rendering the whole row 30+ times per second. The live cell shows
  // the actual played note/sample (from `raw`, the hap value) rather than
  // the lane's static default — that's where the change-per-fire comes
  // from.
  React.useEffect(() => {
    const onMidi = (e) => {
      if (e.detail?.type && e.detail.type !== 'noteon') return;
      const lane = e.detail?.lane;
      if (!lane) return;
      const chip = chipRefs.current[lane];
      if (!chip) return;
      const raw = e.detail?.raw || {};
      // Note-based lanes (chord, lead, bass) carry raw.note as a string
      // like "f4". Drum lanes carry raw.s as a sample name like "bd".
      const token = raw.note != null
        ? String(raw.note)
        : raw.s != null
          // Strudel resolves bank("RolandTR808") into a "RolandTR808_bd"
          // sample id — strip the bank prefix so chips show the original
          // mini-notation token (bd / cp / hh).
          ? String(raw.s).replace(/^RolandTR\d+_/i, '')
          : `n${e.detail?.note}`;
      const vel = Math.round((e.detail?.velocity ?? 0.8) * 127);
      const liveText = chip.querySelector('.midi-mon__live');
      if (liveText) liveText.textContent = `${token} v${vel}`;
      chip.classList.add('is-hit');
      window.setTimeout(() => chip.classList.remove('is-hit'), 140);
    };
    window.addEventListener('resume-midi-event', onMidi);
    return () => window.removeEventListener('resume-midi-event', onMidi);
  }, []);

  return (
    <div className={`midi-mon mono ${compact ? 'midi-mon--compact' : ''}`} aria-label="MIDI bus monitor">
      <span className="midi-mon__title dim">MIDI BUS</span>
      <div className="midi-mon__chips">
        {REPL_MIDI_LANES.map(({ lane, short, group }) => {
          const meta = laneMeta[lane] || {};
          const cl = composeLaneFor(lane);
          const muted = !!mix.mutes?.[cl];
          const soloed = !!mix.solos?.[cl];
          const level = mix.levels?.[cl] ?? 1;
          return (
            <div
              key={lane}
              ref={(el) => { chipRefs.current[lane] = el; }}
              className={`midi-mon__chip midi-mon__chip--${group} ${muted ? 'is-muted' : ''} ${soloed ? 'is-soloed' : ''}`}
            >
              <span className="midi-mon__led" aria-hidden="true" />
              <span className="midi-mon__name">{short}</span>
              <div className="midi-mon__info">
                <span className="midi-mon__meta">ch {meta.channel ?? '–'}</span>
                <span className="midi-mon__live">{meta.note != null ? `n${meta.note}` : ''}</span>
              </div>
              {compact ? (
                <div className="midi-mon__meter" style={{ '--meter-level': Math.max(0, Math.min(1, level / 1.5)) }} aria-hidden="true">
                  <span />
                </div>
              ) : (
                <div className="midi-mon__controls">
                  <div className="midi-mon__btn-stack">
                    <button
                      type="button"
                      className={`midi-mon__btn ${soloed ? 'is-on' : ''}`}
                      onClick={() => onToggleSolo(lane)}
                      aria-label={`solo ${short}`}
                      aria-pressed={soloed}
                      title="solo"
                    >S</button>
                    <button
                      type="button"
                      className={`midi-mon__btn midi-mon__btn--mute ${muted ? 'is-on' : ''}`}
                      onClick={() => onToggleMute(lane)}
                      aria-label={`mute ${short}`}
                      aria-pressed={muted}
                      title="mute"
                    >M</button>
                  </div>
                  <input
                    type="range"
                    className="midi-mon__slider"
                    min="0"
                    max="1.5"
                    step="0.01"
                    orient="vertical"
                    value={level}
                    onChange={(e) => onLevel(lane, e.target.value)}
                    aria-label={`${short} level`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const MIDI_OUT_PREF_STORAGE_KEY = 'resume-midi-out-preference-v1';

function readMidiOutputPreference() {
  try {
    return window.localStorage?.getItem(MIDI_OUT_PREF_STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

function writeMidiOutputPreference(value) {
  try {
    if (value) window.localStorage?.setItem(MIDI_OUT_PREF_STORAGE_KEY, value);
  } catch {}
}

function MidiOutputPanel({ compact = false } = {}) {
  const [supported, setSupported] = React.useState(() => (
    typeof navigator !== 'undefined' && typeof navigator.requestMIDIAccess === 'function'
  ));
  const [outputs, setOutputs] = React.useState([]);
  const [selectedId, setSelectedId] = React.useState(() => readMidiOutputPreference());
  const [enabled, setEnabled] = React.useState(() => Boolean(window.__resumeStrudelAudioEngine?.midiOutputEnabled));
  const [outputName, setOutputName] = React.useState(() => window.__resumeStrudelAudioEngine?.midiOutputName || '');
  const [status, setStatus] = React.useState(() => (supported ? 'off' : 'unsupported'));
  const [error, setError] = React.useState('');

  const preferOutput = React.useCallback((list) => {
    const stored = readMidiOutputPreference();
    return list.find((output) => output.id === selectedId)
      || list.find((output) => output.id === stored)
      || list.find((output) => /iac/i.test(output.name || ''))
      || list.find((output) => /network|session/i.test(output.name || ''))
      || list[0]
      || null;
  }, [selectedId]);

  const loadOutputs = React.useCallback(async () => {
    setError('');
    const engine = getResumeAudioEngine();
    if (!supported || !engine?.listMidiOutputs) {
      setSupported(false);
      setStatus('unsupported');
      return [];
    }
    setStatus('scanning');
    try {
      const list = await engine.listMidiOutputs();
      setOutputs(list);
      const preferred = preferOutput(list);
      if (preferred) {
        setSelectedId((current) => current || preferred.id);
        writeMidiOutputPreference(preferred.id);
      }
      setStatus(list.length ? (engine.midiOutputEnabled ? 'on' : 'ready') : 'none');
      return list;
    } catch (err) {
      setStatus('error');
      setError(err?.message || String(err));
      return [];
    }
  }, [preferOutput, supported]);

  React.useEffect(() => {
    const onOutputChange = (event) => {
      const nextEnabled = Boolean(event.detail?.enabled);
      const nextId = event.detail?.id || '';
      setEnabled(nextEnabled);
      setOutputName(event.detail?.name || '');
      if (nextId) {
        setSelectedId(nextId);
        writeMidiOutputPreference(nextId);
      }
      setStatus(nextEnabled ? 'on' : 'off');
    };
    const engine = window.__resumeStrudelAudioEngine;
    setEnabled(Boolean(engine?.midiOutputEnabled));
    setOutputName(engine?.midiOutputName || '');
    if (engine?.midiOutputId) setSelectedId(engine.midiOutputId);
    window.addEventListener('resume-midi-output-change', onOutputChange);
    return () => window.removeEventListener('resume-midi-output-change', onOutputChange);
  }, []);

  const enable = React.useCallback(async () => {
    setError('');
    const engine = getResumeAudioEngine();
    const list = outputs.length ? outputs : await loadOutputs();
    const preferred = preferOutput(list);
    if (!preferred) {
      setStatus('none');
      setError('No MIDI outputs found. Enable IAC Driver or a Network MIDI session in Audio MIDI Setup, then scan again.');
      return;
    }
    setStatus('enabling');
    try {
      const result = await engine.enableMidiOut(preferred.id);
      setEnabled(Boolean(result.enabled));
      setOutputName(result.name || '');
      setSelectedId(result.id || preferred.id);
      writeMidiOutputPreference(result.id || preferred.id);
      setStatus(result.enabled ? 'on' : 'none');
    } catch (err) {
      setStatus('error');
      setError(err?.message || String(err));
    }
  }, [loadOutputs, outputs, preferOutput]);

  const disable = React.useCallback(() => {
    window.__resumeStrudelAudioEngine?.disableMidiOut?.();
    setEnabled(false);
    setOutputName('');
    setStatus('off');
  }, []);

  const onToggle = React.useCallback(() => {
    if (enabled) disable();
    else enable();
  }, [disable, enable, enabled]);

  const onSelect = React.useCallback(async (event) => {
    const id = event.target.value;
    setSelectedId(id);
    writeMidiOutputPreference(id);
    if (!id || !enabled) return;
    try {
      setStatus('enabling');
      const result = await getResumeAudioEngine().enableMidiOut(id);
      setOutputName(result.name || '');
      setEnabled(Boolean(result.enabled));
      setStatus(result.enabled ? 'on' : 'none');
    } catch (err) {
      setStatus('error');
      setError(err?.message || String(err));
    }
  }, [enabled]);

  const statusText = !supported
    ? 'Web MIDI unavailable'
    : enabled
      ? `sending ${outputName || 'MIDI'}`
      : status === 'none'
        ? 'no outputs found'
        : status === 'scanning'
          ? 'scanning outputs'
          : status === 'enabling'
            ? 'opening output'
            : 'select IAC / network';

  return (
    <div className={`midi-out mono ${compact ? 'midi-out--compact' : ''}`} aria-label="MIDI output">
      <div className="midi-out__head">
        <span>MIDI OUT</span>
        <button
          type="button"
          className={`midi-out__toggle ${enabled ? 'is-on' : ''}`}
          onClick={onToggle}
          aria-pressed={enabled}
          disabled={!supported}
        >
          {enabled ? 'ON' : 'OFF'}
        </button>
      </div>
      <div className="midi-out__row">
        <select
          className="midi-out__select"
          value={selectedId}
          onFocus={loadOutputs}
          onMouseDown={loadOutputs}
          onChange={onSelect}
          disabled={!supported}
          aria-label="MIDI output destination"
        >
          <option value="">{outputs.length ? 'Select output' : 'Scan outputs'}</option>
          {selectedId && !outputs.some((output) => output.id === selectedId) ? (
            <option value={selectedId}>Saved output</option>
          ) : null}
          {outputs.map((output) => (
            <option key={output.id} value={output.id}>
              {output.name || output.manufacturer || output.id}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="midi-out__scan"
          onClick={loadOutputs}
          disabled={!supported}
        >
          scan
        </button>
      </div>
      <div className={`midi-out__status midi-out__status--${status}`}>{statusText}</div>
      {error ? <div className="midi-out__error">{error}</div> : null}
    </div>
  );
}

function StrudelCheatSheet({ onApply, onReset, onHush, status = 'ready', compact = false } = {}) {
  const rows = [
    {
      shortcut: 'Ctrl+Enter',
      what: 'Evaluate - run all your code',
      when: 'After writing or changing any code.',
    },
    {
      shortcut: 'Ctrl+.',
      what: 'Hush - stop all sound immediately',
      when: 'When something sounds wrong, or to stop.',
    },
  ];
  return (
    <div className={`strudel-cheats mono ${compact ? 'strudel-cheats--compact' : ''}`} aria-label="Strudel editing cheat sheet">
      <div className="strudel-cheats__head">
        <span>EDIT SONG</span>
        <span className={`strudel-cheats__status strudel-cheats__status--${status}`}>{status}</span>
      </div>
      <dl className="strudel-cheats__grid">
        {rows.map((row) => (
          <div key={row.shortcut}>
            <dt>{row.shortcut}</dt>
            <dd>
              <strong>{row.what}</strong>
              <span>{row.when}</span>
            </dd>
          </div>
        ))}
      </dl>
      <div className="strudel-cheats__actions">
        <button type="button" onClick={onApply}>Apply</button>
        <button type="button" onClick={onHush}>Hush</button>
        <button type="button" onClick={onReset}>Reset</button>
      </div>
    </div>
  );
}

const STRUDEL_REPL_LINE_PATTERNS = [
  { re: /(\/\/[^\n]*)/g, cls: 'sr-cm' },               // comments
  { re: /"[^"]*"/g, cls: 'sr-str' },                   // strings
  { re: /\b(setcpm|stack|note|s|sine|arrange|const)\b/g, cls: 'sr-kw' },
  { re: /\b(\d+(?:\.\d+)?)\b/g, cls: 'sr-num' },
];

function StrudelReplFeature({ label = "05 · LIVE SYSTEM · POETRY IN PROOF" } = {}) {
  const textareaRef = React.useRef(null);
  const overlayRef = React.useRef(null);
  const scopeLayerRef = React.useRef(null);
  const tokenCursorRef = React.useRef({});
  const highlightGenerationRef = React.useRef(0);
  const activeHighlightSourceRef = React.useRef('');
  const codeRef = React.useRef('');
  const highlightErrorLoggedRef = React.useRef(false);
  const lastReplDrawFlashAtRef = React.useRef(0);
  const flashTimersRef = React.useRef(new Set());
  const evalFlashTimerRef = React.useRef(null);
  const [status, setStatus] = React.useState('idle'); // idle | loading | playing | error
  const [editStatus, setEditStatus] = React.useState('ready');
  const [errorMsg, setErrorMsg] = React.useState('');
  const [code, setCode] = React.useState(() => (
    reserveReplWidgetSpacing(getStoredPoetryInProofDraftSource()).source
  ));
  codeRef.current = code;
  // Source string the engine actually evaluated. Drives the highlight
  // overlay: hap locations refer to positions in this string, not the
  // user-editable textarea.
  const [engineSource, setEngineSource] = React.useState(null);

  React.useEffect(() => {
    savePoetryInProofDraftSource(codeRef.current || code);
  }, []);

  const scopeWidgets = React.useMemo(() => {
    return parseReplWidgets(code).slice(0, REPL_WIDGET_LIMIT);
  }, [code]);
  const hasStickyScopeWidget = scopeWidgets.some((widget) => widget.sticky);

  const positionScopeWidgets = React.useCallback(() => {
    const ta = textareaRef.current;
    const layer = scopeLayerRef.current;
    if (!ta || !layer) return;
    const editor = layer.parentElement;
    const style = window.getComputedStyle(ta);
    const fontSize = parseFloat(style.fontSize) || 12;
    const lineHeight = parseFloat(style.lineHeight) || fontSize * 1.42;
    const padTop = parseFloat(style.paddingTop) || 0;
    const padLeft = parseFloat(style.paddingLeft) || 0;
    const padRight = parseFloat(style.paddingRight) || 0;
    const layerWidth = layer.clientWidth || ta.clientWidth;
    const width = Math.max(1, layerWidth - padLeft - padRight);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const canvases = [...layer.querySelectorAll('.strudel-repl__scope-widget')];
    const stickyCanvases = canvases.filter((canvas) => canvas.dataset.sticky === '1');
    const stickyGap = stickyCanvases.length ? 6 : 0;
    const stickyHeight = stickyCanvases.length
      ? Math.max(32, Math.round(lineHeight * 4 - 4))
      : 0;
    const stickyBlock = stickyCanvases.length
      ? stickyCanvases.length * stickyHeight + Math.max(0, stickyCanvases.length - 1) * stickyGap + stickyGap * 2
      : 0;
    if (editor) {
      editor.style.setProperty('--repl-sticky-widget-height', `${stickyHeight}px`);
      editor.style.setProperty('--repl-sticky-widget-gap', `${stickyGap}px`);
      editor.style.setProperty('--repl-sticky-widget-block', `${stickyBlock}px`);
    }
    canvases.forEach((canvas) => {
      const lineIndex = Number(canvas.dataset.visualLine || canvas.dataset.line || 0);
      const lineSpan = Math.max(1, Number(canvas.dataset.lineSpan || 4));
      const stickyIndex = stickyCanvases.indexOf(canvas);
      const isSticky = stickyIndex !== -1;
      const widgetHeight = isSticky
        ? stickyHeight
        : Math.max(28, Math.round(lineHeight * lineSpan - 5));
      if (isSticky) {
        canvas.style.left = `${padLeft}px`;
        canvas.style.right = 'auto';
        canvas.style.width = `${width}px`;
        canvas.style.top = 'auto';
        canvas.style.bottom = `${stickyGap + (stickyCanvases.length - stickyIndex - 1) * (stickyHeight + stickyGap)}px`;
      } else {
        canvas.style.left = `${padLeft - ta.scrollLeft}px`;
        canvas.style.right = 'auto';
        canvas.style.width = `${width}px`;
        const top = padTop + (lineIndex + 1) * lineHeight - ta.scrollTop + 3;
        canvas.style.top = `${top}px`;
        canvas.style.bottom = 'auto';
      }
      canvas.style.height = `${widgetHeight}px`;
      const height = Math.max(1, widgetHeight);
      const pxWidth = Math.max(1, Math.round(width * dpr));
      const pxHeight = Math.max(1, Math.round(height * dpr));
      if (canvas.width !== pxWidth) canvas.width = pxWidth;
      if (canvas.height !== pxHeight) canvas.height = pxHeight;
      const ctx = canvas.getContext('2d');
      if (ctx && canvas.dataset.scopePrimed !== '1') {
        canvas.dataset.scopePrimed = '1';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'rgba(255, 216, 64, 0.62)';
        ctx.lineWidth = Math.max(1, dpr);
        ctx.beginPath();
        ctx.moveTo(0, canvas.height * 0.5);
        ctx.lineTo(canvas.width, canvas.height * 0.5);
        ctx.stroke();
      }
    });
  }, []);

  const prepareReplWidgetQueue = React.useCallback((source) => {
    const layer = scopeLayerRef.current;
    if (!layer) return [];
    positionScopeWidgets();
    const widgets = parseReplWidgets(source).slice(0, REPL_WIDGET_LIMIT);
    const canvases = [...layer.querySelectorAll('.strudel-repl__scope-widget')];
    const canvasByKey = new Map(canvases.map((canvas) => [canvas.dataset.widgetKey, canvas]));
    const usedCanvases = new Set();
    const contexts = new Map();
    const queue = widgets.map((widget, index) => {
      let canvas = canvasByKey.get(widget.key);
      if (!canvas || usedCanvases.has(canvas)) {
        canvas = canvases.find((candidate) => !usedCanvases.has(candidate)) || null;
      }
      if (canvas) usedCanvases.add(canvas);
      const ctx = canvas?.getContext?.('2d', { willReadFrequently: true }) || canvas?.getContext?.('2d') || null;
      const userId = String(widget.id || '1');
      const drawId = userId === '1' ? `resume-${widget.kind}-${index + 1}` : userId;
      if (ctx) {
        contexts.set(`${widget.kind}:${userId}`, ctx);
        contexts.set(`${widget.kind}:${drawId}`, ctx);
        if (!contexts.has(userId)) contexts.set(userId, ctx);
        contexts.set(drawId, ctx);
      }
      return {
        kind: widget.kind,
        userId,
        drawId,
        ctx,
      };
    });
    window.__resumeStrudelWidgetQueue = queue;
    window.__resumeStrudelScopeContexts = contexts;
    window.__resumeStrudelScopeContext = queue.find((entry) => entry.ctx)?.ctx || null;
    return queue;
  }, [positionScopeWidgets]);

  const syncScroll = React.useCallback(() => {
    const ta = textareaRef.current;
    const ov = overlayRef.current;
    if (ta && ov) {
      ov.scrollTop = ta.scrollTop;
      ov.scrollLeft = ta.scrollLeft;
    }
    positionScopeWidgets();
  }, [positionScopeWidgets]);

  const scrollReplWidgetIntoView = React.useCallback((targetOffset = null) => {
    const ta = textareaRef.current;
    const layer = scopeLayerRef.current;
    if (!ta || !layer) return;
    positionScopeWidgets();
    const canvases = [...layer.querySelectorAll('.strudel-repl__scope-widget')];
    if (!canvases.length) return;
    if (canvases.some((canvas) => canvas.dataset.sticky === '1')) return;
    const viewportBottom = ta.clientHeight;
    const finiteTarget = Number.isFinite(targetOffset) ? Number(targetOffset) : null;
    let target = canvases[0];
    if (finiteTarget !== null) {
      let bestDistance = Infinity;
      for (const canvas of canvases) {
        const start = Number(canvas.dataset.start);
        const end = Number(canvas.dataset.end);
        if (!Number.isFinite(start) || !Number.isFinite(end)) continue;
        const point = start <= finiteTarget && finiteTarget <= end
          ? finiteTarget
          : finiteTarget >= end
          ? end
          : start;
        const distance = Math.abs(finiteTarget - point);
        if (distance < bestDistance) {
          bestDistance = distance;
          target = canvas;
        }
      }
    }
    const targetTop = parseFloat(target.style.top || '0');
    const targetHeight = parseFloat(target.style.height || `${target.clientHeight || 0}`);
    if (targetTop >= 8 && targetTop + targetHeight <= viewportBottom - 8) return;
    const style = window.getComputedStyle(ta);
    const fontSize = parseFloat(style.fontSize) || 12;
    const lineHeight = parseFloat(style.lineHeight) || fontSize * 1.42;
    const padTop = parseFloat(style.paddingTop) || 0;
    const visualLine = Number(target.dataset.visualLine || target.dataset.line || 0);
    ta.scrollTop = Math.max(0, padTop + visualLine * lineHeight - ta.clientHeight * 0.34);
    syncScroll();
  }, [positionScopeWidgets, syncScroll]);

	  React.useLayoutEffect(() => {
	    const layer = scopeLayerRef.current;
	    if (!layer) return undefined;
	    const editor = layer.parentElement;
	    const ta = textareaRef.current;
	    let frame = 0;
	    const update = () => {
	      frame = 0;
	      positionScopeWidgets();
      const contexts = new Map();
      layer.querySelectorAll('.strudel-repl__scope-widget').forEach((canvas) => {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const kind = String(canvas.dataset.widgetKind || 'scope');
        const id = String(canvas.dataset.scopeId || '1');
        contexts.set(`${kind}:${id}`, ctx);
        if (!contexts.has(id)) contexts.set(id, ctx);
      });
      window.__resumeStrudelScopeContexts = contexts;
      window.__resumeStrudelScopeContext = contexts.get('1') || contexts.values().next().value || null;
    };
	    const queueUpdate = () => {
	      if (frame) return;
	      frame = window.requestAnimationFrame(update);
	    };
	    update();
	    queueUpdate();
	    window.requestAnimationFrame(() => window.requestAnimationFrame(queueUpdate));
	    const observer = typeof ResizeObserver === 'function'
	      ? new ResizeObserver(queueUpdate)
	      : null;
	    observer?.observe(layer);
	    if (editor) observer?.observe(editor);
	    if (ta) observer?.observe(ta);
	    window.addEventListener('resize', queueUpdate);
	    return () => {
	      if (frame) window.cancelAnimationFrame(frame);
	      observer?.disconnect();
	      window.removeEventListener('resize', queueUpdate);
	      window.__resumeStrudelScopeContexts = new Map();
	      window.__resumeStrudelScopeContext = null;
    };
  }, [scopeWidgets, positionScopeWidgets]);

  const pulseReplEvaluate = React.useCallback(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    if (evalFlashTimerRef.current) window.clearTimeout(evalFlashTimerRef.current);
    overlay.classList.remove('is-evaluating');
    // Force the class change to restart the animation on repeated Ctrl+Enter.
    void overlay.offsetWidth;
    overlay.classList.add('is-evaluating');
    evalFlashTimerRef.current = window.setTimeout(() => {
      evalFlashTimerRef.current = null;
      if (overlay.isConnected) overlay.classList.remove('is-evaluating');
    }, 210);
  }, []);

  React.useEffect(() => () => {
    if (evalFlashTimerRef.current) window.clearTimeout(evalFlashTimerRef.current);
  }, []);

  const applyCode = React.useCallback(async () => {
    setErrorMsg('');
    const engine = getResumeAudioEngine();
    if (!engine?.setCompositionSource) {
      setStatus('error');
      setEditStatus('error');
      setErrorMsg('Audio engine not ready.');
      return;
    }
    try {
      setStatus('loading');
      pulseReplEvaluate();
      let sourceToEvaluate = codeRef.current || code;
      const textarea = textareaRef.current;
      const rawSelectionStart = Number.isFinite(textarea?.selectionStart) ? textarea.selectionStart : null;
      const rawSelectionEnd = Number.isFinite(textarea?.selectionEnd) ? textarea.selectionEnd : rawSelectionStart;
      const spaced = reserveReplWidgetSpacing(
        textarea?.value ?? sourceToEvaluate,
        rawSelectionStart,
        rawSelectionEnd
      );
      sourceToEvaluate = spaced.source;
      if (sourceToEvaluate !== codeRef.current) {
        setCode(sourceToEvaluate);
        savePoetryInProofDraftSource(sourceToEvaluate);
        codeRef.current = sourceToEvaluate;
        if (textarea && spaced.selectionStart !== null) {
          window.requestAnimationFrame(() => {
            if (document.activeElement !== textarea) return;
            textarea.setSelectionRange(spaced.selectionStart, spaced.selectionEnd ?? spaced.selectionStart);
          });
        }
      }
      await new Promise((resolve) => window.requestAnimationFrame(() => window.requestAnimationFrame(resolve)));
      const targetWidgetOffset = rawSelectionStart ?? spaced.selectionStart ?? sourceToEvaluate.length;
      scrollReplWidgetIntoView(targetWidgetOffset);
      prepareReplWidgetQueue(sourceToEvaluate);
      // Match Strudel REPL semantics: evaluating while the transport is
      // running swaps the pattern in-place instead of restarting from 0.
      const result = await engine.setCompositionSource(sourceToEvaluate, {
        resetTransport: false,
        start: true,
      });
      if (!result?.ok) {
        const message = result?.error?.message || result?.error || 'Strudel could not evaluate that source.';
        setStatus(result?.recovered ? 'playing' : 'error');
        setEditStatus('error');
        setErrorMsg(
          `${message} Your edit is saved as a draft; audio recovered to the last working version.`
        );
        if (result?.fallbackSource) setEngineSource(result.fallbackSource);
        return;
      }
      setEngineSource(sourceToEvaluate);
      setEditStatus('applied');
      setStatus('playing');
    } catch (error) {
      setStatus('error');
      setEditStatus('error');
      setErrorMsg((error && error.message) || String(error));
    }
  }, [code, prepareReplWidgetQueue, pulseReplEvaluate, scrollReplWidgetIntoView]);

  const resetCode = React.useCallback(() => {
    setErrorMsg('');
    const engine = getResumeAudioEngine();
    const source = engine?.resetCompositionSource
      ? engine.resetCompositionSource({ resetTransport: false })
      : STRUDEL_REPL_INITIAL_CODE;
    setCode(source);
    setEngineSource(source);
    setEditStatus('reset');
    setStatus((s) => (s === 'error' ? (engine?.enabled ? 'playing' : 'idle') : s));
  }, []);

  const hushCode = React.useCallback(async () => {
    setErrorMsg('');
    const engine = window.__resumeStrudelAudioEngine;
    if (!engine?.setEnabled) return;
    try {
      await engine.setEnabled(false);
      setEditStatus('ready');
      setStatus('idle');
    } catch (error) {
      setStatus('error');
      setEditStatus('error');
      setErrorMsg((error && error.message) || String(error));
    }
  }, []);

  const clearReplTokenFlashes = React.useCallback(() => {
    for (const timer of flashTimersRef.current) window.clearTimeout(timer);
    flashTimersRef.current.clear();
    const overlay = overlayRef.current;
    if (!overlay) return;
    overlay.querySelectorAll('.sr-tok.is-flash, .sr-tok[data-flashing="1"]').forEach((span) => {
      span.classList.remove('is-flash');
      delete span.dataset.flashing;
    });
  }, []);

  const resetReplHighlighter = React.useCallback((source = '') => {
    highlightGenerationRef.current += 1;
    activeHighlightSourceRef.current = source || '';
    highlightErrorLoggedRef.current = false;
    lastReplDrawFlashAtRef.current = 0;
    tokenCursorRef.current = {};
    clearReplTokenFlashes();
  }, [clearReplTokenFlashes]);

  const handleCodeChange = React.useCallback((event) => {
    const rawNext = event.target.value;
    const spaced = reserveReplWidgetSpacing(
      rawNext,
      event.target.selectionStart,
      event.target.selectionEnd
    );
    const next = spaced.source;
    setCode(next);
    savePoetryInProofDraftSource(next);
    setEditStatus('dirty');
    if (next !== rawNext && spaced.selectionStart !== null) {
      window.requestAnimationFrame(() => {
        const textarea = textareaRef.current;
        if (!textarea || document.activeElement !== textarea) return;
        textarea.setSelectionRange(spaced.selectionStart, spaced.selectionEnd ?? spaced.selectionStart);
        syncScroll();
      });
    }
  }, [syncScroll]);

  const handleEditorKeyDown = React.useCallback((event) => {
    if (event.key === 'Escape') {
      event.currentTarget.blur();
    }
  }, []);

  const flashReplTokenSpan = React.useCallback((span, duration = 150, generation = highlightGenerationRef.current) => {
    if (!span) return false;
    if (generation !== highlightGenerationRef.current) return false;
    if (span.dataset.flashing === '1') return true;
    span.dataset.flashing = '1';
    span.classList.add('is-flash');
    const timer = window.setTimeout(() => {
      flashTimersRef.current.delete(timer);
      if (generation !== highlightGenerationRef.current) return;
      if (!span.isConnected) return;
      span.classList.remove('is-flash');
      delete span.dataset.flashing;
    }, Math.max(80, Math.min(260, duration)));
    flashTimersRef.current.add(timer);
    return true;
  }, []);

  const findTokenSpanForLocation = React.useCallback((overlay, loc) => {
    if (!overlay || !loc || typeof loc.start !== 'number') return null;
    const isDenseStringToken = (span) => (
      span?.classList?.contains('sr-tok--string')
      && /[\s<>\[\]()*~,!?]/.test(span.dataset.token || span.textContent || '')
    );
    const exact = overlay.querySelector(`[data-start="${loc.start}"]`);
    if (exact && !isDenseStringToken(exact)) return exact;
    const allowContainedTokens = !(exact && isDenseStringToken(exact));
    const locStart = loc.start;
    const locEnd = typeof loc.end === 'number' ? loc.end : locStart + 1;
    const tokens = overlay.querySelectorAll('.sr-tok[data-start][data-end]');
    let best = null;
    let bestSize = Infinity;
    for (const span of tokens) {
      const start = Number(span.dataset.start);
      const end = Number(span.dataset.end);
      if (!Number.isFinite(start) || !Number.isFinite(end)) continue;
      if (isDenseStringToken(span)) continue;
      const startInsideToken = start <= locStart && locStart < end;
      const tokenInsideLocation = allowContainedTokens && locStart <= start && start < locEnd;
      if (!startInsideToken && !tokenInsideLocation) continue;
      const size = end - start;
      if (size < bestSize) {
        best = span;
        bestSize = size;
      }
    }
    return best;
  }, []);

  const mapLocationToCurrentCode = React.useCallback((loc, fromSource = '', toSource = '') => {
    if (!loc || typeof loc.start !== 'number') return null;
    if (!fromSource || !toSource || fromSource === toSource) return loc;
    const start = loc.start;
    const end = typeof loc.end === 'number' ? loc.end : start + 1;
    let prefix = 0;
    const minLen = Math.min(fromSource.length, toSource.length);
    while (prefix < minLen && fromSource[prefix] === toSource[prefix]) prefix++;
    let oldSuffix = fromSource.length;
    let newSuffix = toSource.length;
    while (
      oldSuffix > prefix
      && newSuffix > prefix
      && fromSource[oldSuffix - 1] === toSource[newSuffix - 1]
    ) {
      oldSuffix--;
      newSuffix--;
    }
    if (end <= prefix) return loc;
    const delta = newSuffix - oldSuffix;
    if (start >= oldSuffix) {
      return { ...loc, start: Math.max(0, start + delta), end: Math.max(0, end + delta) };
    }
    const text = fromSource.slice(start, end);
    if (!text || text.length > 180) return null;
    const expected = Math.max(0, Math.min(toSource.length - text.length, start + delta));
    let best = -1;
    let bestDistance = Infinity;
    let index = toSource.indexOf(text);
    while (index !== -1) {
      const distance = Math.abs(index - expected);
      if (distance < bestDistance) {
        best = index;
        bestDistance = distance;
      }
      index = toSource.indexOf(text, index + 1);
    }
    if (best === -1) return null;
    return { ...loc, start: best, end: best + text.length };
  }, []);

  const normalizeReplToken = React.useCallback((value) => (
    String(value ?? '')
      .replace(/^RolandTR\d+_/i, '')
      .trim()
      .toLowerCase()
  ), []);

  const getMidiDetailTokens = React.useCallback((detail = {}) => {
    const raw = detail.raw || {};
    const sources = [
      raw.note,
      raw.n,
      raw.midinote,
      raw.s,
      raw.value,
      raw.region,
      raw.cue,
      raw.sampleKey,
      raw.mode,
    ].filter((value) => value != null && value !== '');
    const values = sources.flatMap((source) => (
      Array.isArray(source) ? source : [source]
    ));
    const tokens = new Set();
    for (const value of values) {
      const normalized = normalizeReplToken(value);
      if (normalized) tokens.add(normalized);
      String(value)
        .split(/[^A-Za-z0-9#./-]+/)
        .map(normalizeReplToken)
        .filter(Boolean)
        .forEach((token) => tokens.add(token));
    }
    return [...tokens];
  }, [normalizeReplToken]);

  const flashMidiTokenFallback = React.useCallback((detail = {}) => {
    const overlay = overlayRef.current;
    if (!overlay) return false;
    const laneAliases = { wasdChord: 'chord', snare: 'snare', hat: 'hat', kick: 'kick' };
    const lane = laneAliases[detail.lane] || detail.lane || '';
    if (!lane) return false;
    const eventTokens = getMidiDetailTokens(detail);
    const laneTokens = [...overlay.querySelectorAll(`.sr-tok[data-lane="${lane}"]`)];
    if (!laneTokens.length) return false;
    let candidates = eventTokens.length
      ? laneTokens.filter((span) => eventTokens.includes(span.dataset.token || ''))
      : [];
    if (!candidates.length) candidates = laneTokens;
    const section = String(detail.section || '').trim();
    if (section) {
      const sectionCandidates = candidates.filter((span) => (
        String(span.dataset.sections || '').split(/\s+/).includes(section)
      ));
      if (sectionCandidates.length) candidates = sectionCandidates;
    }
    const key = `${lane}:${eventTokens.join('|') || '*'}`;
    const cursor = tokenCursorRef.current[key] || 0;
    const span = candidates[cursor % candidates.length];
    tokenCursorRef.current[key] = cursor + 1;
    return flashReplTokenSpan(span, detail.duration ? Math.min(220, detail.duration) : 145);
  }, [flashReplTokenSpan, getMidiDetailTokens]);

  React.useEffect(() => {
    const inReplShortcutScope = () => {
      const section = document.getElementById('strudel');
      if (!section) return false;
      if (section.contains(document.activeElement)) return true;
      if (section.classList.contains('is-strudel-pinned')) return true;
      const rect = section.getBoundingClientRect();
      const viewportH = window.innerHeight || document.documentElement.clientHeight || 0;
      return rect.top < viewportH * 0.65 && rect.bottom > viewportH * 0.2;
    };
    const onShortcut = (event) => {
      const hasEvalModifier = event.ctrlKey || event.metaKey || event.altKey;
      if (!hasEvalModifier) return;
      const key = event.key.toLowerCase();
      if (event.key !== 'Enter' && key !== '.') return;
      if (!inReplShortcutScope()) return;
      event.preventDefault();
      event.stopPropagation();
      if (event.key === 'Enter') applyCode();
      else hushCode();
    };
    window.addEventListener('keydown', onShortcut, true);
    return () => window.removeEventListener('keydown', onShortcut, true);
  }, [applyCode, hushCode]);

  // Mirror hero audio state. The REPL play button toggles the same audio
  // engine the hero speaker drives, so clicking either control updates
  // the pill below.
  React.useEffect(() => {
    const sync = () => {
      const engine = window.__resumeStrudelAudioEngine;
      if (!engine) return;
      setStatus((s) => {
        if (s === 'loading' || s === 'error') return s;
        return engine.enabled ? 'playing' : 'idle';
      });
    };
    sync();
    window.addEventListener('resume-audio-change', sync);
    return () => window.removeEventListener('resume-audio-change', sync);
  }, []);

  // When the engine evaluates a pattern, capture its source so the
  // highlight overlay knows which characters to flash.
  React.useEffect(() => {
    const onReady = (e) => {
      const rawSource = e.detail?.rawSource ?? e.detail?.source ?? '';
      const locationSource = e.detail?.source ?? rawSource;
      setEngineSource(rawSource || null);
      resetReplHighlighter(locationSource || '');
    };
    const initialSource = window.__resumeActiveSource || window.__resumeActiveRawSource || '';
    if (initialSource) {
      setEngineSource(initialSource);
      resetReplHighlighter(initialSource);
    }
    window.addEventListener('resume-pattern-ready', onReady);
    return () => window.removeEventListener('resume-pattern-ready', onReady);
  }, [resetReplHighlighter]);

  React.useEffect(() => {
    const onError = (event) => {
      const error = event.detail?.error;
      const message = error?.message || String(error || 'Strudel could not evaluate that source.');
      setEditStatus('error');
      setErrorMsg(`${message} Your edit is saved as a draft; audio recovered to the last working version.`);
    };
    window.addEventListener('resume-pattern-error', onError);
    return () => window.removeEventListener('resume-pattern-error', onError);
  }, []);

  // Strudel-style active-token highlights. Each hap carries source
  // locations; like Strudel's CodeMirror highlighter, we consider every
  // active location on the hap, not only the innermost mini token.
  React.useEffect(() => {
    let cancelled = false;
    const setup = (readyPattern = null) => {
      const pattern = readyPattern || window.__resumeActivePattern;
      if (!pattern || typeof pattern.draw !== 'function') return;
      const generation = highlightGenerationRef.current;
      const locationSource = activeHighlightSourceRef.current
        || window.__resumeActiveSource
        || codeRef.current;
      // Replace any previous draw registration with same id.
      try {
        pattern.draw((haps, time) => {
          try {
            if (cancelled) return;
            if (generation !== highlightGenerationRef.current) return;
            const overlay = overlayRef.current;
            if (!overlay) return;
            const visibleSource = codeRef.current;
            const flashed = new Set();
            const activeHaps = Array.isArray(haps) ? haps : [];
            for (const hap of activeHaps) {
              // Active during this frame? whole.{begin,end} are Fractions of cycles.
              const beg = hap.whole?.begin?.valueOf?.();
              const end = hap.whole?.end?.valueOf?.();
              if (!Number.isFinite(beg) || !Number.isFinite(end)) continue;
              if (time < beg || time >= end) continue;
              const locs = Array.isArray(hap.context?.locations) ? hap.context.locations : [];
              const dur = Math.max(80, Math.min(220, (end - beg) * 1000 * 0.8));
              for (const loc of locs) {
                if (!loc || typeof loc.start !== 'number') continue;
                const key = `${loc.start}:${loc.end ?? ''}`;
                if (flashed.has(key)) continue;
                flashed.add(key);
                const mappedLoc = mapLocationToCurrentCode(loc, locationSource, visibleSource);
                if (!mappedLoc) continue;
                const span = findTokenSpanForLocation(overlay, mappedLoc);
                if (flashReplTokenSpan(span, dur, generation)) {
                  lastReplDrawFlashAtRef.current = performance.now();
                }
              }
            }
          } catch (err) {
            if (!highlightErrorLoggedRef.current) {
              highlightErrorLoggedRef.current = true;
              console.warn('REPL token highlight failed; audio playback preserved.', err);
            }
          }
        }, { id: 'strudel-repl-flash', lookahead: 0.02, lookbehind: 0 });
      } catch (err) {
        // Pattern may have been detached between events — silent.
      }
    };
    const onReady = (event) => setup(event.detail?.pattern);
    window.addEventListener('resume-pattern-ready', onReady);
    if (window.__resumeActivePattern) setup();
    return () => {
      cancelled = true;
      window.removeEventListener('resume-pattern-ready', onReady);
    };
  }, [findTokenSpanForLocation, flashReplTokenSpan, mapLocationToCurrentCode]);

  React.useEffect(() => {
    const onMidi = (event) => {
      const detail = event.detail || {};
      if (detail.source === 'webmidi') return;
      if (!activeHighlightSourceRef.current) return;
      // Normal Strudel audio should be highlighted from hap source
      // locations above. If those source locations stop mapping after a
      // live edit, fall back to MIDI lane events so the REPL never goes dark.
      const drawIsLive = performance.now() - lastReplDrawFlashAtRef.current < 360;
      if (drawIsLive && detail.lane !== 'vocal' && detail.group !== 'vocal') return;
      flashMidiTokenFallback(detail);
    };
    window.addEventListener('resume-midi-event', onMidi);
    return () => window.removeEventListener('resume-midi-event', onMidi);
  }, [code, flashMidiTokenFallback]);

  const handlePlay = React.useCallback(async () => {
    setErrorMsg('');
    const engine = window.__resumeStrudelAudioEngine;
    if (!engine?.setEnabled) {
      setStatus('error');
      setErrorMsg('Audio engine not ready.');
      return;
    }
    setStatus('loading');
    try {
      await engine.setEnabled(true);
      // status will flip to 'playing' via the resume-audio-change listener
    } catch (error) {
      setStatus('error');
      setErrorMsg((error && error.message) || String(error));
    }
  }, []);

  const handleStop = React.useCallback(async () => {
    const engine = window.__resumeStrudelAudioEngine;
    if (!engine?.setEnabled) return;
    try {
      await engine.setEnabled(false);
    } catch {}
    // status flips via the resume-audio-change listener
  }, []);

  // Syntax-highlighted overlay rendered from current code state.
  // Walks the source classifying regions as comment / string / code so the
  // keyword/number regex never runs over the inside of a comment or string.
  // Inside quoted string literals, individual mini-notation tokens (bd, hh, f4,
  // c1, ~, etc.) get their own <span class="sr-tok" data-start="N"> so the
  // pattern-draw loop can flash exactly the token that's sounding.
  const highlighted = React.useMemo(() => {
    const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;' })[c]);
    const escAttr = (s) => esc(String(s)).replace(/"/g, '&quot;');
    const triggerToLane = {
      harmonyChord: 'chord',
      harmonyWasdChord: 'chord',
      bassBass: 'bass',
      drumKick: 'kick',
      drumSnare: 'snare',
      drumHat: 'hat',
      drumPerc: 'perc',
      melodyLead: 'lead',
      melodyLift: 'lead',
      melodyChop: 'lead',
      melodyAngel: 'lead',
      melodyBuild: 'lead',
      melodySwitch: 'lead',
      melodyGhost: 'lead',
      melodyDust: 'lead',
    };
    const laneForStringAt = (src, offset) => {
      const prevSemi = src.lastIndexOf(';', offset);
      const nextSemi = src.indexOf(';', offset);
      const block = src.slice(prevSemi === -1 ? 0 : prevSemi + 1, nextSemi === -1 ? src.length : nextSemi + 1);
      const constName = block.match(/\bconst\s+([A-Za-z0-9_]+)/)?.[1] || '';
      if (/^vocal/i.test(constName)) return 'vocal';
      const trigger = block.match(/\.onTrigger\(\s*T\.([A-Za-z0-9_]+)\s*,\s*false\s*\)/)?.[1];
      return triggerToLane[trigger] || '';
    };
    const sectionsForStringAt = (src, offset) => {
      const prevSemi = src.lastIndexOf(';', offset);
      const nextSemi = src.indexOf(';', offset);
      const block = src.slice(prevSemi === -1 ? 0 : prevSemi + 1, nextSemi === -1 ? src.length : nextSemi + 1);
      const constName = block.match(/\bconst\s+([A-Za-z0-9_]+)/)?.[1] || '';
      if (/vocalCall/i.test(constName)) return ['preChorus'];
      if (/vocal(Answer|Chops)/i.test(constName)) return ['breakdown'];
      if (/preChorus/i.test(constName)) return ['preChorus'];
      if (/Chorus/.test(constName)) return ['intro', 'chorus'];
      if (/Verse/.test(constName)) return ['verse'];
      if (/Break|outro/i.test(constName)) return ['breakdown'];
      if (constName === 'subBass') return ['chorus', 'verse'];
      if (/^kick$/.test(constName)) return ['chorus'];
      return [];
    };
    const attrsForToken = (start, end, token, lane = '', sections = []) => ([
      `data-start="${start}"`,
      `data-end="${end}"`,
      `data-token="${escAttr(normalizeReplToken(token))}"`,
      lane ? `data-lane="${escAttr(lane)}"` : '',
      sections.length ? `data-sections="${escAttr(sections.join(' '))}"` : '',
    ].filter(Boolean).join(' '));
    const highlightCode = (txt, baseOffset = 0) => {
      const re = /(\.)([A-Za-z_][A-Za-z0-9_]*)(?=\s*\()|\b(setcpm|stack|note|s|arrange|sine)\b(?=\s*\()|\b(const|globalThis)\b|(-?\d+(?:\.\d+)?)/g;
      let out = '';
      let last = 0;
      let match;
      while ((match = re.exec(txt)) !== null) {
        const index = match.index;
        out += esc(txt.slice(last, index));
        const abs = baseOffset + index;
        const lane = laneForStringAt(src, abs);
        const sections = sectionsForStringAt(src, abs);
        if (match[1]) {
          const dot = match[1];
          const fn = match[2];
          const start = abs + dot.length;
          out += `${dot}<span class="sr-fn sr-tok" ${attrsForToken(start, start + fn.length, fn, lane, sections)}>${esc(fn)}</span>`;
        } else if (match[3]) {
          const word = match[3];
          out += `<span class="sr-kw sr-tok" ${attrsForToken(abs, abs + word.length, word, lane, sections)}>${esc(word)}</span>`;
        } else if (match[4]) {
          out += `<span class="sr-kw">${esc(match[4])}</span>`;
        } else {
          const num = match[5];
          out += `<span class="sr-num sr-tok" ${attrsForToken(abs, abs + num.length, num, lane, sections)}>${esc(num)}</span>`;
        }
        last = index + match[0].length;
      }
      out += esc(txt.slice(last));
      return out;
    };
    // Wrap individual mini-notation tokens inside "..." so they can be
    // targeted by hap source-positions during playback. Each `data-start`
    // attribute carries the absolute character offset in `code`.
    const tokeniseString = (lit, baseOffset, lane = '', sections = []) => {
      // lit includes the surrounding quotes
      const body = lit.slice(1, -1);
      let out = `<span class="sr-str sr-tok sr-tok--string" ${attrsForToken(baseOffset, baseOffset + lit.length, body, lane, sections)}>${esc(lit[0])}`;
      let k = 1; // skip opening quote
      while (k < lit.length - 1) {
        const c = lit[k];
        // Skip whitespace, brackets, modifiers — render verbatim
        if (/[\s<>\[\]()*~,!?]/.test(c)) {
          out += esc(c);
          k++;
          continue;
        }
        // Read run of token characters (letters, digits, decimal points, sharps/flats markers, slashes)
        let m = k;
        while (m < lit.length - 1 && /[A-Za-z0-9#.:_\/\-]/.test(lit[m])) m++;
        if (m > k) {
          const tok = lit.slice(k, m);
          const start = baseOffset + k;
          const attrs = attrsForToken(start, baseOffset + m, tok, lane, sections);
          out += `<span class="sr-tok" ${attrs}>${esc(tok)}</span>`;
          k = m;
        } else {
          out += esc(c);
          k++;
        }
      }
      out += `${esc(lit[lit.length - 1] || '')}</span>`;
      return out;
    };
    let out = '';
    let i = 0;
    const src = code;
    while (i < src.length) {
      const ch = src[i];
      const next = src[i + 1];
      if (ch === '/' && next === '/') {
        const end = src.indexOf('\n', i);
        const stop = end === -1 ? src.length : end;
        out += '<span class="sr-cm">' + esc(src.slice(i, stop)) + '</span>';
        i = stop;
      } else if (ch === '"' || ch === "'") {
        const quote = ch;
        let j = i + 1;
        while (j < src.length && src[j] !== quote && src[j] !== '\n') {
          if (src[j] === '\\') j += 2;
          else j++;
        }
        const stop = j < src.length && src[j] === quote ? j + 1 : j;
        out += tokeniseString(src.slice(i, stop), i, laneForStringAt(src, i), sectionsForStringAt(src, i));
        i = stop;
      } else {
        let j = i;
        while (j < src.length) {
          if (src[j] === '"' || src[j] === "'") break;
          if (src[j] === '/' && src[j + 1] === '/') break;
          j++;
        }
        out += highlightCode(src.slice(i, j), i);
        i = j;
      }
    }
    return out + '\n';
  }, [code, normalizeReplToken]);

  useEffect(() => {
    const section = document.getElementById('strudel');
    if (!section) return undefined;
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const viewportH = window.innerHeight || document.documentElement.clientHeight || 0;
      const shouldPin = rect.top <= 1 && rect.bottom > viewportH + 1;
      section.classList.toggle('is-strudel-pinned', shouldPin);
    };

    const queueUpdate = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', queueUpdate, { passive: true });
    window.addEventListener('resize', queueUpdate);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      section.classList.remove('is-strudel-pinned');
      window.removeEventListener('scroll', queueUpdate);
      window.removeEventListener('resize', queueUpdate);
    };
  }, []);

  return (
    <Section id="strudel" label={label}>
      <aside className="help-feature__notes help-feature__notes--match-stack strudel-repl__intro">
        <h3 className="serif">A browser-based music and interactive visuals demo.</h3>
        <p>
          <strong>Poetry in Proof</strong> is a browser-based music and
          interactive visuals demo. I enjoy interactive art and the process of
          extracting poetry from technical proof, so of course I could not
          resist bringing my resume to life with a retro-feeling audio-visual
          system. I composed the music with Strudel and custom code that
          produces MIDI lane triggers for real-time reel edits, page animations,
          text and code highlights, the MIDI monitor, and Mac screen reactions.
          The code editor below is live, so the composition can be changed while
          the page is running. When MIDI OUT is enabled, those same triggers can
          be sent to an external MIDI destination such as IAC Driver or a
          network MIDI session. Web MIDI is bound to every lane, so sections,
          chords, and drums are all addressable from external hardware or remote
          rigs.
        </p>
      </aside>
      <div className="help-feature strudel-repl">
        <div className="help-feature__player-col help-feature__player-col--wide">
          <div className="strudel-repl__macbook">
            <div className="strudel-repl__panel">
              <div className={`strudel-repl__editor ${hasStickyScopeWidget ? 'has-sticky-scope' : ''}`}>
                <pre
                  className="strudel-repl__overlay"
                  ref={overlayRef}
                  aria-hidden="true"
                  dangerouslySetInnerHTML={{ __html: highlighted }}
                />
                <div ref={scopeLayerRef} className="strudel-repl__scope-layer" aria-hidden="true">
                  {scopeWidgets.map((widget) => (
                    <canvas
                      key={widget.key}
                      className="strudel-repl__scope-widget"
                      data-widget-key={widget.key}
                      data-widget-kind={widget.kind}
                      data-scope-id={widget.id}
                      data-line={widget.lineIndex}
                      data-visual-line={widget.visualLineIndex}
                      data-line-span={widget.lineSpan}
                      data-reserve-lines={widget.reserveLines}
                      data-sticky={widget.sticky ? '1' : '0'}
                      data-start={widget.start}
                      data-end={widget.end}
                    />
                  ))}
                </div>
                <textarea
                  ref={textareaRef}
                  className="strudel-repl__textarea"
                  value={code}
	                  spellCheck={false}
	                  wrap="off"
	                  onChange={handleCodeChange}
	                  onKeyDown={handleEditorKeyDown}
	                  onScroll={syncScroll}
	                  aria-label="Strudel composition source"
	                />
              </div>
              {errorMsg ? (
                <div className="strudel-repl__error mono">{errorMsg}</div>
              ) : null}
              <div className="strudel-repl__screen-dock">
                <MidiBusMonitor compact />
                <MidiOutputPanel compact />
                <StrudelCheatSheet compact status={editStatus} onApply={applyCode} onHush={hushCode} onReset={resetCode} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

// ────────────────────────────────────────────────────────────────────
//  Section primitives
// ────────────────────────────────────────────────────────────────────

function getSectionShape(id) {
  if (['summary', 'experience'].includes(id)) return 'triangle';
  if (['help', 'blackbird', 'system', 'project'].includes(id)) return 'circle';
  if (id === 'strudel') return 'circle';
  return 'square';
}

function Section({ id, label, children, dense }) {
  const shape = getSectionShape(id);
  // Split labels like "02 · EXPERIENCE" into a coloured number prefix and
  // a neutral title so each section reads at-a-glance from its key colour.
  const numberMatch = typeof label === 'string' ? label.match(/^(\d+)\s*·\s*(.*)$/) : null;
  return (
    <section id={id} className={`section section--${shape} ${dense ? 'section--dense' : ''}`}>
      {label ? (
        <header className="section__header">
          <span className="section__mark" aria-hidden="true" />
          <span className="section__rule" />
          <span className="section__label mono">
            {numberMatch ? (
              <>
                <span className="section__label-num">{numberMatch[1]}</span>
                <span className="section__label-sep" aria-hidden="true"> · </span>
                <span className="section__label-title">{numberMatch[2]}</span>
              </>
            ) : (
              label
            )}
          </span>
        </header>
      ) : null}
      <div className="section__body">{children}</div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────
//  Summary
// ────────────────────────────────────────────────────────────────────

function Summary({ text }) {
  return (
    <Section id="summary" label="01 · SUMMARY">
      <p className="summary serif">{text}</p>
    </Section>
  );
}

// ────────────────────────────────────────────────────────────────────
//  Experience
// ────────────────────────────────────────────────────────────────────

function Experience({ items }) {
  return (
    <Section id="experience" label="02 · EXPERIENCE">
      <ol className="experience">
        {items.map((job, i) => (
          <li key={i} className="job">
            <div className="job__rail">
              <span className="job__rail-dot" />
              <span className="job__rail-line" />
            </div>
            <div className="job__head">
              <div className="job__head-row">
                <h3 className="job__role serif">{job.role}</h3>
                {job.tag && <span className="job__tag mono">{job.tag}</span>}
              </div>
              <div className="job__meta">
                <span className="job__org">{job.org}</span>
                {job.where && <><span className="job__sep">·</span><span>{job.where}</span></>}
                <span className="job__sep">·</span>
                <span className="mono dim">{job.period}</span>
              </div>
            </div>
            <div className="job__body">
              <div className="job__proofs" aria-label={`${job.role} highlights`}>
                {job.bullets.map((b, j) => (
                  <p key={j} className="job__proof">
                    <span className="job__proof-index mono">{String(j + 1).padStart(2, '0')}</span>
                    <span>{b}</span>
                  </p>
                ))}
              </div>
              {job.credits && (
                <div className="job__credits">
                  <div className="job__credits-label mono">Selected show credits</div>
                  <ul className="job__credits-list">
                    {job.credits.map((credit) => (
                      <li key={credit}>{credit}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

// ────────────────────────────────────────────────────────────────────
//  HELP feature panel — wraps the player + context
// ────────────────────────────────────────────────────────────────────

// ────────────────────────────────────────────────────────────────────
//  TvHero — Apple Macintosh 3D model with the trailer cut pool playing
//  on its screen. Three.js scene, lazy-loaded; burst/hold cut timing is
//  drawn into a CanvasTexture mapped onto the model's screen mesh.
// ────────────────────────────────────────────────────────────────────

const TV_MODEL_URL = 'media/3d/apple_macintosh.glb';
const MAC_MODEL_GRAYSCALE_PREVIEW = (() => {
  try {
    const params = new URLSearchParams(window.location.search);
    return !(params.has('mac-model-color') || params.get('mac-model') === 'color');
  } catch (_) {
    return true;
  }
})();
const MAC_MODEL_GRAY_STEPS = [
  0x000000,
  0x191919,
  0x333333,
  0x555555,
  0x777777,
  0x999999,
  0xc9c9c9,
  0xf2f2f2,
];
const MAC_MODEL_PRIMARY_KEY_COLORS = {
  KeyR: 0xd42a20,
  KeyY: 0xfac22b,
  KeyB: 0x1c5f9f,
};
const MAC_STAGE_DRAG_STORAGE_KEY = 'resume.macStageDragX';
const MAC_STAGE_DRAG_DEFAULTS = {
  mobile: 0,
  macbook: 70,
  wide: -53,
};
const DOOM_TERMINAL_COMMANDS = new Set(['doom', 'doom.exe', './doom', 'run doom', 'launch doom', 'open doom']);
const MAC_SCREEN_MEDIA_SIZE = { width: 960, height: 720 };
const MAC_SCREEN_TERMINAL_SIZE = { width: 2048, height: 1536 };
const MAC_ASCII_BASS_FILTER_ENABLED = (() => {
  // The ASCII bass filter now lives on the hero name (AsciiName), not the Mac.
  // Off by default; opt back in on the Mac with ?mac-ascii=on / 1 / true.
  try {
    const params = new URLSearchParams(window.location.search);
    const value = String(params.get('mac-ascii') || '').toLowerCase();
    return value === '1' || value === 'on' || value === 'true';
  } catch (_) {
    return false;
  }
})();
const MAC_ASCII_BASS_CHARS = '.,:;-=+xX80S#@';
const MAC_ASCII_NAMED_COLORS = Object.freeze({
  red: '#ff453a',
  yellow: '#ffd60a',
  blue: '#0a84ff',
  cyan: '#64d2ff',
  green: '#32d74b',
  magenta: '#ff375f',
  orange: '#ff9f0a',
  purple: '#bf5af2',
  white: '#ffffff',
});
const MAC_ASCII_BASS_KEY_SEQUENCE = Object.freeze([
  { label: 'R', code: 'KeyR', char: '@', color: '#ff453a' },
  { label: 'Y', code: 'KeyY', char: '#', color: '#ffd60a' },
  { label: 'B', code: 'KeyB', char: 'S', color: '#0a84ff' },
]);
const MAC_ASCII_BASS_MAX_ACCENT_GLYPHS = 10;
const MAC_ASCII_BASS_CONFIG_DEFAULTS = Object.freeze({
  enabled: MAC_ASCII_BASS_FILTER_ENABLED,
  chars: MAC_ASCII_BASS_CHARS,
  charColors: {
    S: '#0a84ff',
    '#': '#ffd60a',
    '@': '#ff453a',
  },
  tileSize: 23,
  minFrameMs: 48,
  fontScale: 1.02,
  brightness: 1,
  contrast: 2.54,
  threshold: 0.73,
  coverage: 1,
  density: 1,
  edgeEmphasis: 0,
  backgroundBlur: 40,
  backgroundOpacity: 0.35,
  opacity: 1.35,
  darken: 0.36,
  jitter: 1.35,
  scanline: 0.28,
});
const MAC_TERMINAL_COMMAND_LINES = [
  'play     play interactive reel',
  'doom     boot fullscreen Doom',
  'status   print audio engine state',
  'reset    restore last-good source',
  'clear    clear terminal',
  'about    describe this system',
];
const MAC_TERMINAL_BOOT_LINES = [
  'MacTerminal 1.1',
  'System 1 Finder session',
  '',
  'commands',
  ...MAC_TERMINAL_COMMAND_LINES,
];

function getDoomIframeUrl() {
  return new URL('doom.html', window.location.href).href;
}

function isMacStageDragEnabled() {
  try {
    return new URLSearchParams(window.location.search).has('mac-drag');
  } catch (_) {
    return false;
  }
}

function getMacStageDragBucket(width = (typeof window !== 'undefined' ? window.innerWidth : 0)) {
  if (width <= 760) return 'mobile';
  if (width <= 1900) return 'macbook';
  return 'wide';
}

function getMacStageDragStorageKey(bucket = getMacStageDragBucket()) {
  return `${MAC_STAGE_DRAG_STORAGE_KEY}.${bucket}`;
}

function getMacStageDragDefault(bucket = getMacStageDragBucket()) {
  return MAC_STAGE_DRAG_DEFAULTS[bucket] ?? 0;
}

function readMacStageDragX(bucket = getMacStageDragBucket()) {
  try {
    const stored = window.localStorage?.getItem(getMacStageDragStorageKey(bucket));
    if (stored == null || stored === '') return getMacStageDragDefault(bucket);
    const value = Number(stored);
    return Number.isFinite(value) ? value : getMacStageDragDefault(bucket);
  } catch (_) {
    return getMacStageDragDefault(bucket);
  }
}

function writeMacStageDragX(value, bucket = getMacStageDragBucket()) {
  try {
    window.localStorage?.setItem(getMacStageDragStorageKey(bucket), String(Math.round(value)));
  } catch (_) {}
}

function clampMacAsciiNumber(value, fallback, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, number));
}

function parseMacAsciiBoolean(value, fallback) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
    if (['0', 'false', 'no', 'off'].includes(normalized)) return false;
  }
  return fallback;
}

function normalizeMacAsciiColor(value) {
  const raw = String(value ?? '').trim().toLowerCase();
  if (!raw) return '';
  if (MAC_ASCII_NAMED_COLORS[raw]) return MAC_ASCII_NAMED_COLORS[raw];
  const hex = raw.replace(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i, '#$1');
  if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex)) return '';
  if (hex.length === 4) {
    return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`.toLowerCase();
  }
  return hex.toLowerCase();
}

function normalizeMacAsciiCharColors(input, fallback = {}) {
  const source = input && typeof input === 'object' && !Array.isArray(input) ? input : fallback;
  const colors = {};
  for (const [key, value] of Object.entries(source || {}).slice(0, 96)) {
    const char = Array.from(String(key ?? ''))[0];
    const color = normalizeMacAsciiColor(value);
    if (char && color) colors[char] = color;
  }
  return colors;
}

function macAsciiColorToRgb(color) {
  const normalized = normalizeMacAsciiColor(color);
  if (!normalized) return null;
  const hex = normalized.slice(1);
  return [
    Number.parseInt(hex.slice(0, 2), 16),
    Number.parseInt(hex.slice(2, 4), 16),
    Number.parseInt(hex.slice(4, 6), 16),
  ];
}

function normalizeMacAsciiConfig(input = {}, fallback = MAC_ASCII_BASS_CONFIG_DEFAULTS) {
  const base = fallback || MAC_ASCII_BASS_CONFIG_DEFAULTS;
  const rawChars = input.chars ?? base.chars;
  const chars = String(rawChars ?? '').slice(0, 96);
  return {
    enabled: parseMacAsciiBoolean(input.enabled, base.enabled),
    chars: chars.trim() ? chars : base.chars,
    charColors: normalizeMacAsciiCharColors(input.charColors ?? base.charColors, base.charColors),
    tileSize: clampMacAsciiNumber(input.tileSize, base.tileSize, 6, 36),
    minFrameMs: clampMacAsciiNumber(input.minFrameMs, base.minFrameMs, 16, 180),
    fontScale: clampMacAsciiNumber(input.fontScale, base.fontScale, 0.55, 1.8),
    brightness: clampMacAsciiNumber(input.brightness, base.brightness, -1, 1),
    contrast: clampMacAsciiNumber(input.contrast, base.contrast, 0.1, 3),
    threshold: clampMacAsciiNumber(input.threshold, base.threshold, 0, 0.95),
    coverage: clampMacAsciiNumber(input.coverage, base.coverage, 0, 1),
    density: clampMacAsciiNumber(input.density, base.density, 0.2, 2.5),
    edgeEmphasis: clampMacAsciiNumber(input.edgeEmphasis, base.edgeEmphasis, 0, 2),
    backgroundBlur: clampMacAsciiNumber(input.backgroundBlur, base.backgroundBlur, 0, 40),
    backgroundOpacity: clampMacAsciiNumber(input.backgroundOpacity, base.backgroundOpacity, 0, 1),
    opacity: clampMacAsciiNumber(input.opacity, base.opacity, 0, 1.35),
    darken: clampMacAsciiNumber(input.darken, base.darken, 0, 0.85),
    jitter: clampMacAsciiNumber(input.jitter, base.jitter, 0, 4),
    scanline: clampMacAsciiNumber(input.scanline, base.scanline, 0, 0.75),
  };
}

function getMacAsciiInitialConfig() {
  let config = normalizeMacAsciiConfig();
  try {
    const params = new URLSearchParams(window.location.search);
    const overrides = {};
    if (params.has('mac-ascii-chars')) overrides.chars = params.get('mac-ascii-chars');
    if (params.has('mac-ascii-tile')) overrides.tileSize = params.get('mac-ascii-tile');
    if (params.has('mac-ascii-min-frame')) overrides.minFrameMs = params.get('mac-ascii-min-frame');
    if (params.has('mac-ascii-font')) overrides.fontScale = params.get('mac-ascii-font');
    if (params.has('mac-ascii-brightness')) overrides.brightness = params.get('mac-ascii-brightness');
    if (params.has('mac-ascii-contrast')) overrides.contrast = params.get('mac-ascii-contrast');
    if (params.has('mac-ascii-threshold')) overrides.threshold = params.get('mac-ascii-threshold');
    if (params.has('mac-ascii-coverage')) overrides.coverage = params.get('mac-ascii-coverage');
    if (params.has('mac-ascii-density')) overrides.density = params.get('mac-ascii-density');
    if (params.has('mac-ascii-edge')) overrides.edgeEmphasis = params.get('mac-ascii-edge');
    if (params.has('mac-ascii-bg-blur')) overrides.backgroundBlur = params.get('mac-ascii-bg-blur');
    if (params.has('mac-ascii-bg-opacity')) overrides.backgroundOpacity = params.get('mac-ascii-bg-opacity');
    if (params.has('mac-ascii-opacity')) overrides.opacity = params.get('mac-ascii-opacity');
    if (params.has('mac-ascii-darken')) overrides.darken = params.get('mac-ascii-darken');
    if (params.has('mac-ascii-jitter')) overrides.jitter = params.get('mac-ascii-jitter');
    if (params.has('mac-ascii-scanline')) overrides.scanline = params.get('mac-ascii-scanline');
    config = normalizeMacAsciiConfig(overrides, config);
  } catch (_) {}
  return config;
}

function isMacAsciiControlHost() {
  try {
    const host = window.location.hostname;
    return host === 'localhost' || host === '127.0.0.1' || host === '::1';
  } catch (_) {
    return false;
  }
}

const MAC_KEY_DEFS = {
  Backquote:    { mesh: 'Mesh285', char: '`', shiftChar: '~' },
  Digit1:       { mesh: 'Mesh286', char: '1', shiftChar: '!' },
  Digit2:       { mesh: 'Mesh287', char: '2', shiftChar: '@' },
  Digit3:       { mesh: 'Mesh288', char: '3', shiftChar: '#' },
  Digit4:       { mesh: 'Mesh289', char: '4', shiftChar: '$' },
  Digit5:       { mesh: 'Mesh290', char: '5', shiftChar: '%' },
  Digit6:       { mesh: 'Mesh291', char: '6', shiftChar: '^' },
  Digit7:       { mesh: 'Mesh292', char: '7', shiftChar: '&' },
  Digit8:       { mesh: 'Mesh293', char: '8', shiftChar: '*' },
  Digit9:       { mesh: 'Mesh294', char: '9', shiftChar: '(' },
  Digit0:       { mesh: 'Mesh295', char: '0', shiftChar: ')' },
  Minus:        { mesh: 'Mesh296', char: '-', shiftChar: '_' },
  Equal:        { mesh: 'Mesh297', char: '=', shiftChar: '+' },
  Backspace:    { mesh: 'Mesh298', action: 'backspace' },

  Tab:          { mesh: 'Mesh299', char: '  ' },
  KeyQ:         { mesh: 'Mesh300', char: 'q', shiftChar: 'Q' },
  KeyW:         { mesh: 'Mesh301', char: 'w', shiftChar: 'W' },
  KeyE:         { mesh: 'Mesh302', char: 'e', shiftChar: 'E' },
  KeyR:         { mesh: 'Mesh303', char: 'r', shiftChar: 'R' },
  KeyT:         { mesh: 'Mesh304', char: 't', shiftChar: 'T' },
  KeyY:         { mesh: 'Mesh305', char: 'y', shiftChar: 'Y' },
  KeyU:         { mesh: 'Mesh306', char: 'u', shiftChar: 'U' },
  KeyI:         { mesh: 'Mesh307', char: 'i', shiftChar: 'I' },
  KeyO:         { mesh: 'Mesh308', char: 'o', shiftChar: 'O' },
  KeyP:         { mesh: 'Mesh309', char: 'p', shiftChar: 'P' },
  BracketLeft:  { mesh: 'Mesh310', char: '[', shiftChar: '{' },
  BracketRight: { mesh: 'Mesh311', char: ']', shiftChar: '}' },
  Backslash:    { mesh: 'Mesh312', char: '\\', shiftChar: '|' },

  CapsLock:     { mesh: 'Mesh325', action: 'modifier' },
  KeyA:         { mesh: 'Mesh324', char: 'a', shiftChar: 'A' },
  KeyS:         { mesh: 'Mesh323', char: 's', shiftChar: 'S' },
  KeyD:         { mesh: 'Mesh322', char: 'd', shiftChar: 'D' },
  KeyF:         { mesh: 'Mesh321', char: 'f', shiftChar: 'F' },
  KeyG:         { mesh: 'Mesh320', char: 'g', shiftChar: 'G' },
  KeyH:         { mesh: 'Mesh319', char: 'h', shiftChar: 'H' },
  KeyJ:         { mesh: 'Mesh318', char: 'j', shiftChar: 'J' },
  KeyK:         { mesh: 'Mesh317', char: 'k', shiftChar: 'K' },
  KeyL:         { mesh: 'Mesh316', char: 'l', shiftChar: 'L' },
  Semicolon:    { mesh: 'Mesh315', char: ';', shiftChar: ':' },
  Quote:        { mesh: 'Mesh314', char: "'", shiftChar: '"' },
  Enter:        { mesh: 'Mesh313', action: 'enter' },

  ShiftLeft:    { mesh: 'Mesh326', action: 'modifier' },
  KeyZ:         { mesh: 'Mesh327', char: 'z', shiftChar: 'Z' },
  KeyX:         { mesh: 'Mesh328', char: 'x', shiftChar: 'X' },
  KeyC:         { mesh: 'Mesh329', char: 'c', shiftChar: 'C' },
  KeyV:         { mesh: 'Mesh330', char: 'v', shiftChar: 'V' },
  KeyB:         { mesh: 'Mesh331', char: 'b', shiftChar: 'B' },
  KeyN:         { mesh: 'Mesh332', char: 'n', shiftChar: 'N' },
  KeyM:         { mesh: 'Mesh333', char: 'm', shiftChar: 'M' },
  Comma:        { mesh: 'Mesh334', char: ',', shiftChar: '<' },
  Period:       { mesh: 'Mesh335', char: '.', shiftChar: '>' },
  Slash:        { mesh: 'Mesh336', char: '/', shiftChar: '?' },
  ShiftRight:   { mesh: 'Mesh337', action: 'modifier' },

  AltLeft:      { mesh: 'Mesh339', action: 'modifier' },
  MetaLeft:     { mesh: 'Mesh338', action: 'modifier' },
  Space:        { mesh: '3DGeom_15', char: ' ' },
  MetaRight:    { mesh: 'Mesh340', action: 'modifier' },
  AltRight:     { mesh: 'Mesh341', action: 'modifier' },
};

const MAC_KEY_ALIASES = {
  W: 'KeyW',
  A: 'KeyA',
  S: 'KeyS',
  D: 'KeyD',
  R: 'KeyR',
  Y: 'KeyY',
  B: 'KeyB',
  space: 'Space',
};

const MAC_KEY_BY_CHAR = Object.fromEntries(
  Object.entries(MAC_KEY_DEFS).flatMap(([code, def]) => (
    def.char
      ? [[def.char.toLowerCase(), code], [def.shiftChar?.toLowerCase?.(), code]].filter(([key]) => key)
      : []
  ))
);
const MAC_KEY_CODE_BY_MESH = new Map(
  Object.entries(MAC_KEY_DEFS).map(([code, def]) => [def.mesh, code])
);
const MAC_MODEL_KEY_EASTER_EGG = 'hello world';
const MAC_MODEL_EASTER_EGG_KEYS = new Set(
  [...MAC_MODEL_KEY_EASTER_EGG]
    .map((char) => MAC_KEY_BY_CHAR[char])
    .filter((code) => code && code !== 'Space')
);

function getMacKeyCodeFromEvent(event) {
  if (MAC_KEY_DEFS[event.code]) return event.code;
  const key = event.key === ' ' ? ' ' : String(event.key || '').toLowerCase();
  return MAC_KEY_BY_CHAR[key] || '';
}

function getMacTerminalCharacter(code, shiftKey = false) {
  const def = MAC_KEY_DEFS[code];
  if (!def || !def.char) return '';
  return shiftKey && def.shiftChar ? def.shiftChar : def.char;
}

function getMacMeshNumericId(mesh) {
  // The GLB ships a few stacked body shells exported as name-collision
  // twins (Mesh01_2, Mesh79_2/_3, Mesh80_2/_3). They sit at the same place
  // as their numeric twin, so they must resolve to the SAME id — otherwise
  // they pick up a different grayscale step and the two coplanar shells
  // z-fight as a two-tone broken patch across the front of the case.
  const match = String(mesh?.name || '').match(/^Mesh0*(\d+)(?:_\d+)?$/);
  return match ? Number(match[1]) : null;
}

// Accent/badge shells around the floppy bezel whose faces are coincident with
// the case but which the front-accent / badge-stripe rules below would paint a
// different gray — so they z-fight as a two-tone patch. (The case-shell range
// itself is already pinned to one uniform gray below; these ids sit in earlier
// id ranges so they need pinning explicitly.) Genuine recessed detail that is
// meant to differ — the floppy label (84), floppy tray (273), ports (121) — is
// deliberately NOT listed. Derived from scripts/blender/find_coincident_faces.py
// (run with ALLFACES=1) — re-run it if the model changes.
const MAC_COINCIDENT_CASE_IDS = new Set([76, 79, 81, 83, 85, 86, 87, 88, 90, 93]);

function getMacGrayMaterialSpec(mesh) {
  const name = String(mesh?.name || '');
  if (!name || name === 'MacScreenTextureProxy' || /^screen$|^mesh75$/i.test(name)) return null;
  if (name === 'MacSideProductionSticker') return null;
  if (name === '3DGeom_10') return { key: 'logo-plate-black', step: 0, roughness: 0.94 };
  if (name === '3DGeom_15') return { key: 'spacebar-word-break', step: 3, roughness: 0.9 };
  if (/^Cube/.test(name)) return { key: 'deep-void-black', step: 0, roughness: 0.98 };

  const id = getMacMeshNumericId(mesh);
  if (id == null) return { key: 'case-default-highlight', step: 7, roughness: 0.88 };
  if (MAC_COINCIDENT_CASE_IDS.has(id)) return { key: 'case-shell-6', step: 6, roughness: 0.9 };
  if (id === 74) return { key: 'screen-surround-black', step: 0, roughness: 0.98 };
  if (id >= 285 && id <= 341) {
    const code = MAC_KEY_CODE_BY_MESH.get(name);
    if (MAC_MODEL_PRIMARY_KEY_COLORS[code]) {
      return {
        key: `primary-key-${code}`,
        step: 7,
        color: MAC_MODEL_PRIMARY_KEY_COLORS[code],
        roughness: 0.82,
      };
    }
    if (MAC_MODEL_EASTER_EGG_KEYS.has(code)) {
      return { key: 'keycap-hello-world', step: 7, roughness: 0.82 };
    }
    if (code && MAC_KEY_DEFS[code]?.action === 'modifier') {
      return { key: 'keycap-modifier-dark', step: 3, roughness: 0.9 };
    }
    return { key: 'keycap-field', step: 5, roughness: 0.88 };
  }
  if (id >= 134 && id <= 272) return { key: 'key-legend-black', step: 2, roughness: 1 };
  if (id === 284) return { key: 'mouse-button-accent', step: 2, roughness: 0.86 };
  if (id >= 69 && id <= 72) return { key: 'mouse-body', step: 5, roughness: 0.88 };
  if (id === 273) return { key: 'floppy-tray-black', step: 0, roughness: 0.94 };
  if (id === 84) return { key: 'floppy-label-bright', step: 7, roughness: 0.88 };
  if ([76, 77, 78, 79, 80, 81, 82, 83].includes(id)) {
    const step = id % 2 === 0 ? 0 : 1;
    return { key: `front-accent-${step}`, step, roughness: 0.9 };
  }
  if (id >= 76 && id <= 94) {
    const step = 1 + ((id - 76) % 6);
    return { key: `badge-stripe-${step}`, step, roughness: 0.82 };
  }
  if (id >= 95 && id <= 114) {
    const step = id % 4 === 0 ? 7 : id % 3 === 0 ? 6 : 5;
    return { key: `case-panel-${step}`, step, roughness: 0.88 };
  }
  if (id >= 115 && id <= 133) return { key: 'port-detail-black', step: 0, roughness: 0.96 };
  if (id >= 342 && id <= 344) return { key: 'rear-dark-detail-black', step: 0, roughness: 0.94 };
  if (id >= 1 && id <= 83) {
    // Uniform case gray. The model splits the shell into many overlapping,
    // often-coincident sub-meshes, so any per-id step variance shows up as
    // z-fighting where they coplanar-overlap. A single step keeps the whole
    // case body consistent and fight-free. See find_coincident_faces.py.
    return { key: 'case-shell-6', step: 6, roughness: 0.9 };
  }
  return { key: 'misc-gray', step: 5, roughness: 0.9 };
}

function applyMacModelGrayscalePreview(THREE, model) {
  if (!MAC_MODEL_GRAYSCALE_PREVIEW || !THREE || !model) return;
  const cache = new Map();
  const materialFor = (spec) => {
    const step = Math.max(0, Math.min(MAC_MODEL_GRAY_STEPS.length - 1, spec.step));
    const key = `${spec.key}:${step}:${spec.roughness}`;
    if (!cache.has(key)) {
      // Key legends sit flush on the keycap tops, so they z-fight with the
      // cap surface and render as broken/smudged labels. A negative polygon
      // offset pulls the legend slightly toward the camera so it always wins
      // the depth test and sits cleanly on the key.
      const isLegend = spec.key === 'key-legend-black';
      cache.set(key, new THREE.MeshStandardMaterial({
        color: spec.color ?? MAC_MODEL_GRAY_STEPS[step],
        roughness: spec.roughness ?? 0.9,
        metalness: 0,
        polygonOffset: isLegend,
        polygonOffsetFactor: isLegend ? -1 : 0,
        polygonOffsetUnits: isLegend ? -2 : 0,
      }));
    }
    return cache.get(key);
  };
  let applied = 0;
  model.traverse((mesh) => {
    if (!mesh.isMesh) return;
    const spec = getMacGrayMaterialSpec(mesh);
    if (!spec) return;
    mesh.material = materialFor(spec);
    applied += 1;
  });
  console.info('[TvHero] Mac model 8-bit grayscale preview applied:', applied, 'meshes');
}

function isMacHeroTabletopEnabled() {
  try {
    const params = new URLSearchParams(window.location.search);
    const value = String(params.get('mac-table') || '').toLowerCase();
    if (value === 'off' || value === '0' || value === 'false') return false;
    if (value === 'on' || value === '1' || value === 'true') return true;
  } catch (_) {}
  return document.documentElement?.dataset?.resumeVariant === 'landing-v1';
}

function createMacHeroTabletop(THREE, modelBox) {
  if (!isMacHeroTabletopEnabled() || !THREE || !modelBox || modelBox.isEmpty()) return null;
  const size = modelBox.getSize(new THREE.Vector3());
  const ctr = modelBox.getCenter(new THREE.Vector3());
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  const base = ctx.createLinearGradient(0, 0, 0, canvas.height);
  base.addColorStop(0, '#f1ece3');
  base.addColorStop(0.55, '#e7e0d5');
  base.addColorStop(1, '#dcd2c4');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  let seed = 17;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const grain = ctx.createImageData(canvas.width, canvas.height);
  for (let i = 0; i < grain.data.length; i += 4) {
    const n = (rand() - 0.5) * 4;
    grain.data[i] = 230 + n;
    grain.data[i + 1] = 224 + n;
    grain.data[i + 2] = 214 + n;
    grain.data[i + 3] = 7;
  }
  ctx.putImageData(grain, 0, 0);
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const contact = ctx.createRadialGradient(canvas.width * 0.5, canvas.height * 0.48, 54, canvas.width * 0.5, canvas.height * 0.48, 370);
  contact.addColorStop(0, 'rgba(68,48,32,0.16)');
  contact.addColorStop(0.48, 'rgba(68,48,32,0.052)');
  contact.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = contact;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  const material = new THREE.MeshStandardMaterial({
    map: tex,
    color: 0xffffff,
    roughness: 0.92,
    metalness: 0,
  });
  const baseWidth = Math.max(size.x * 1.32, 2.64);
  const width = baseWidth * 0.9;
  const depth = Math.max(size.z * 1.45, 2.2);
  const table = new THREE.Mesh(new THREE.PlaneGeometry(width, depth, 1, 1), material);
  table.name = 'MacHeroTabletop';
  table.rotation.x = -Math.PI / 2;
  table.position.set(ctr.x - baseWidth * 0.05, modelBox.min.y - size.y * 0.016, ctr.z + size.z * 0.14);
  return table;
}

function createMacStickyNote(THREE, caseBox, screenBox, options = {}) {
  if (!THREE || !caseBox || caseBox.isEmpty()) return null;
  const {
    text = 'resume',
    href = 'resume-readonly.html',
    hitType = 'resume',
    placement = 'left',
    rotationDeg = placement === 'right' ? 4 : -5,
    scale = placement === 'right' ? 0.255 : 0.285,
    minWidth = placement === 'right' ? 0.22 : 0.25,
    paperStops = ['#fff8b6', '#ffec74', '#f4d34d'],
    ink = '#2e2b22',
    arrowInk = '#3d3425',
    border = 'rgba(122, 91, 24, 0.28)',
    shadow = 'rgba(112, 86, 24, 0.16)',
    emissive = 0xffdc58,
    emissiveIntensity = 0.18,
    overwrittenInk = false,
    smiley = false,
    penInk = 'rgba(0, 0, 28, 1)',
    foldSide = placement === 'right' ? 'left' : 'right',
    hoverMotion = null,
  } = options;
  const caseSize = caseBox.getSize(new THREE.Vector3());
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 520;
  const ctx = canvas.getContext('2d');
  const normalizedFoldSide = foldSide === 'left' ? 'left' : 'right';
  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const paperLeft = 22;
    const paperRight = 612;
    const paperBottom = 478;
    const paper = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    paper.addColorStop(0, paperStops[0]);
    paper.addColorStop(0.52, paperStops[1]);
    paper.addColorStop(1, paperStops[2]);
    ctx.fillStyle = paper;
    ctx.fillRect(paperLeft, 22, paperRight - paperLeft, paperBottom - 22);
    const fold = normalizedFoldSide === 'left'
      ? {
          shadowBack: 88,
          shadowTipY: 386,
          curveStart: 128,
          c1: 82,
          c1y: 462,
          c2: 34,
          c2y: 424,
          tipY: 381,
          strokeStart: 96,
          strokeC1: 62,
          strokeC1Y: 458,
          strokeC2: 24,
          strokeC2Y: 424,
          strokeTip: 2,
          strokeTipY: 392,
          gradientBack: 116,
          gradientTopY: 366,
          gradientOutside: 10,
          gradientBottomY: 500,
        }
      : {
          shadowBack: 112,
          shadowTipY: 366,
          curveStart: 150,
          c1: 88,
          c1y: 458,
          c2: 34,
          c2y: 410,
          tipY: 350,
          strokeStart: 118,
          strokeC1: 72,
          strokeC1Y: 452,
          strokeC2: 26,
          strokeC2Y: 408,
          strokeTip: 1,
          strokeTipY: 360,
          gradientBack: 128,
          gradientTopY: 348,
          gradientOutside: 8,
          gradientBottomY: 496,
        };
    const foldX = (offset) => (
      normalizedFoldSide === 'left'
        ? paperLeft + offset
        : paperRight - offset
    );
    ctx.fillStyle = shadow;
    ctx.beginPath();
    ctx.moveTo(foldX(fold.shadowBack), paperBottom);
    ctx.lineTo(foldX(0), fold.shadowTipY);
    ctx.lineTo(foldX(0), paperBottom);
    ctx.closePath();
    ctx.fill();
    const curlShade = ctx.createLinearGradient(
      foldX(fold.gradientBack),
      fold.gradientTopY,
      foldX(-fold.gradientOutside),
      fold.gradientBottomY,
    );
    curlShade.addColorStop(0, 'rgba(255,255,255,0)');
    curlShade.addColorStop(0.48, 'rgba(255,255,255,0.28)');
    curlShade.addColorStop(1, 'rgba(106,76,18,0.34)');
    ctx.fillStyle = curlShade;
    ctx.beginPath();
    ctx.moveTo(foldX(fold.curveStart), paperBottom);
    ctx.bezierCurveTo(foldX(fold.c1), fold.c1y, foldX(fold.c2), fold.c2y, foldX(0), fold.tipY);
    ctx.lineTo(foldX(0), paperBottom);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(122, 91, 24, 0.28)';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(foldX(fold.strokeStart), paperBottom - 4);
    ctx.bezierCurveTo(
      foldX(fold.strokeC1),
      fold.strokeC1Y,
      foldX(fold.strokeC2),
      fold.strokeC2Y,
      foldX(fold.strokeTip),
      fold.strokeTipY,
    );
    ctx.stroke();
    ctx.strokeStyle = border;
    ctx.lineWidth = 7;
    ctx.strokeRect(paperLeft, 22, paperRight - paperLeft, paperBottom - 22);

    ctx.save();
    const arrow = placement === 'right'
      ? {
          translateY: -2,
          lineWidth: 11,
          penWidth: 2.8,
          start: [520, 334],
          c1: [486, 301],
          c2: [444, 266],
          end: [390, 231],
          headA: [431, 229],
          headB: [414, 269],
        }
      : {
          translateY: 8,
          lineWidth: 14,
          penWidth: 3,
          start: [92, 348],
          c1: [158, 306],
          c2: [206, 278],
          end: [258, 240],
          headA: [214, 242],
          headB: [234, 278],
        };
    ctx.translate(0, arrow.translateY);
    ctx.strokeStyle = overwrittenInk ? penInk : arrowInk;
    ctx.fillStyle = overwrittenInk ? penInk : arrowInk;
    ctx.globalAlpha = overwrittenInk ? 0.86 : 1;
    ctx.lineWidth = overwrittenInk ? arrow.penWidth : arrow.lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(...arrow.start);
    ctx.bezierCurveTo(...arrow.c1, ...arrow.c2, ...arrow.end);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(...arrow.end);
    ctx.lineTo(...arrow.headA);
    ctx.moveTo(...arrow.end);
    ctx.lineTo(...arrow.headB);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.rotate(-0.035);
    ctx.fillStyle = overwrittenInk ? penInk : ink;
    const fontStack = overwrittenInk
      ? '"Bradley Hand", "Noteworthy", "Segoe Print", "Comic Sans MS", cursive'
      : '"Caveat Brush", "Permanent Marker", "Comic Sans MS", cursive';
    let fontSize = overwrittenInk ? 132 : text.length > 7 ? 134 : text.length > 6 ? 148 : 176;
    const fontWeight = overwrittenInk ? '300 ' : '';
    ctx.font = `${fontWeight}${fontSize}px ${fontStack}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const textMaxWidth = smiley ? 430 : 510;
    while (ctx.measureText(text).width > textMaxWidth && fontSize > 88) {
      fontSize -= 6;
      ctx.font = `${fontWeight}${fontSize}px ${fontStack}`;
    }
    const labelX = smiley ? 326 : 372;
    const labelY = 214;
    if (overwrittenInk) {
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      const rand = (seed) => {
        const n = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
        return n - Math.floor(n);
      };
      const passes = [
        [-0.6, -0.35, -0.006, 0.32],
        [0, 0, 0.002, 1],
        [0.6, 0.35, -0.003, 0.28],
        [0.28, -0.62, 0.006, 0.18],
      ];
      const drawOverwrittenLabel = () => {
        passes.forEach(([x, y, rotate, alpha]) => {
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.fillStyle = penInk;
          ctx.translate(labelX, labelY);
          ctx.rotate(rotate);
          ctx.fillText(text, x, y);
          ctx.restore();
        });
      };
      drawOverwrittenLabel();
      if (text === 'resume') {
        const resumeTraceStrokeWidth = 3.2;
        const traceCommands = [
          ['M', 134, 238],
          ['C', 136, 222, 141, 208, 151, 207],
          ['C', 160, 207, 166, 212, 170, 220],
          ['M', 189, 226],
          ['C', 214, 215, 224, 206, 229, 217],
          ['C', 235, 231, 196, 232, 191, 231],
          ['C', 187, 245, 215, 249, 234, 237],
          ['M', 328, 214],
          ['C', 319, 250, 353, 253, 365, 232],
          ['C', 369, 224, 370, 217, 371, 212],
          ['M', 397, 244],
          ['C', 398, 218, 407, 212, 417, 215],
          ['C', 426, 218, 428, 230, 428, 244],
          ['M', 428, 244],
          ['C', 430, 219, 441, 212, 451, 215],
          ['C', 463, 219, 465, 232, 465, 245],
          ['M', 493, 226],
          ['C', 518, 215, 529, 206, 533, 217],
          ['C', 539, 231, 501, 232, 496, 231],
          ['C', 492, 245, 519, 249, 538, 237],
        ];
        const jitter = (value, seed, amount) => value + (rand(seed) - 0.5) * amount;
        const drawResumeTrace = (dx, dy, alpha, noise, passIndex) => {
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = penInk;
          ctx.lineWidth = resumeTraceStrokeWidth;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.translate(dx, dy);
          ctx.beginPath();
          traceCommands.forEach((cmd, index) => {
            if (cmd[0] === 'M') {
              ctx.moveTo(
                jitter(cmd[1], passIndex * 37 + index * 3 + 1, noise),
                jitter(cmd[2], passIndex * 37 + index * 3 + 2, noise),
              );
            } else {
              ctx.bezierCurveTo(
                jitter(cmd[1], passIndex * 37 + index * 7 + 1, noise),
                jitter(cmd[2], passIndex * 37 + index * 7 + 2, noise),
                jitter(cmd[3], passIndex * 37 + index * 7 + 3, noise),
                jitter(cmd[4], passIndex * 37 + index * 7 + 4, noise),
                jitter(cmd[5], passIndex * 37 + index * 7 + 5, noise),
                jitter(cmd[6], passIndex * 37 + index * 7 + 6, noise),
              );
            }
          });
          ctx.stroke();
          ctx.restore();
        };
        [
          [0, 0, 1, 0.16],
          [1.2, -0.85, 0.72, 0.8],
          [-1, 0.75, 0.55, 0.7],
          [0.45, 0.35, 0.38, 0.55],
        ].forEach(([x, y, alpha, noise], index) => {
          drawResumeTrace(x, y, alpha, noise, index + 1);
        });
        ctx.save();
        ctx.strokeStyle = penInk;
        ctx.lineCap = 'round';
        for (let i = 0; i < 18; i++) {
          const x1 = 142 + rand(i * 5 + 1) * 382;
          const y1 = 166 + rand(i * 5 + 2) * 104;
          const length = 18 + rand(i * 5 + 3) * 62;
          const drift = -5 + rand(i * 5 + 4) * 10;
          ctx.globalAlpha = 0.035 + rand(i * 5 + 5) * 0.055;
          ctx.lineWidth = 0.24 + rand(i * 5 + 6) * 0.32;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.quadraticCurveTo(x1 + length * 0.52, y1 + drift, x1 + length, y1 + drift * 0.35);
          ctx.stroke();
        }
        ctx.restore();
        ctx.save();
        ctx.globalAlpha = 0.09;
        ctx.strokeStyle = 'rgba(255, 240, 126, 0.45)';
        ctx.lineWidth = 0.55;
        ctx.lineCap = 'round';
        [
          [162, 188, 298, 181],
          [222, 214, 372, 205],
          [270, 237, 448, 226],
        ].forEach(([x1, y1, x2, y2]) => {
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        });
        ctx.restore();
      }
    } else {
      ctx.fillText(text, labelX, labelY);
      ctx.fillText(text, labelX + 4, labelY + 2);
    }
    if (smiley) {
      const sx = 552;
      const sy = 88;
      const drawSmiley = (x, y, alpha) => {
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.ellipse(x, y, 29, 27, -0.12, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x - 10, y - 6, 2.5, 0, Math.PI * 2);
        ctx.arc(x + 9, y - 7, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y + 1, 15, 0.18, Math.PI - 0.08);
        ctx.stroke();
      };
      ctx.strokeStyle = overwrittenInk ? penInk : ink;
      ctx.fillStyle = overwrittenInk ? penInk : ink;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = overwrittenInk ? 1.8 : 7;
      if (overwrittenInk) {
        drawSmiley(sx - 0.9, sy, 0.78);
        drawSmiley(sx + 0.8, sy + 0.6, 0.38);
        drawSmiley(sx, sy - 0.8, 0.24);
      } else {
        drawSmiley(sx, sy, 0.9);
      }
    }
    ctx.restore();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(36, 34, 548, 26);
  };
  draw();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => {
      draw();
      tex.needsUpdate = true;
    }).catch(() => {});
  }

  const material = new THREE.MeshStandardMaterial({
    map: tex,
    color: 0xffffff,
    roughness: 0.78,
    metalness: 0,
    emissive,
    emissiveIntensity,
    side: THREE.DoubleSide,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
    transparent: true,
    alphaTest: 0.02,
  });
  const noteW = Math.max(caseSize.x * scale, minWidth);
  const noteH = noteW * (canvas.height / canvas.width);
  const geometry = new THREE.PlaneGeometry(noteW, noteH, 18, 14);
  const positions = geometry.attributes.position;
  const curlDepth = normalizedFoldSide === 'left' ? 0.086 : 0.12;
  const curlTuck = normalizedFoldSide === 'left' ? 0.032 : 0.045;
  const curlLift = normalizedFoldSide === 'left' ? 0.021 : 0.03;
  const curlDirection = normalizedFoldSide === 'left' ? 1 : -1;
  const smoothstep = (edge0, edge1, x) => {
    const t = Math.max(0, Math.min(1, (x - edge0) / Math.max(0.0001, edge1 - edge0)));
    return t * t * (3 - 2 * t);
  };
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    const horizontal = normalizedFoldSide === 'left'
      ? smoothstep(noteW * 0.2, noteW * 0.5, -x)
      : smoothstep(noteW * 0.18, noteW * 0.5, x);
    const bottom = smoothstep(noteH * 0.08, noteH * 0.5, -y);
    const curl = horizontal * bottom;
    if (curl <= 0) continue;
    positions.setZ(i, curl * noteW * curlDepth);
    positions.setX(i, x + curl * noteW * curlTuck * curlDirection);
    positions.setY(i, y + curl * noteH * curlLift);
  }
  positions.needsUpdate = true;
  geometry.computeVertexNormals();
  const note = new THREE.Mesh(geometry, material);
  note.name = `Mac${text.replace(/[^a-z0-9]/gi, '') || 'Link'}StickyNote`;
  const screenSize = screenBox && !screenBox.isEmpty() ? screenBox.getSize(new THREE.Vector3()) : null;
  const screenMin = screenBox && !screenBox.isEmpty() ? screenBox.min : null;
  const screenMax = screenBox && !screenBox.isEmpty() ? screenBox.max : null;
  const targetX = placement === 'right'
    ? screenMax && screenSize
      ? screenMax.x + noteW * 0.24
      : caseBox.max.x - caseSize.x * 0.24
    : screenMin && screenSize
      ? screenMin.x - noteW * 0.22
      : caseBox.min.x + caseSize.x * 0.24;
  const targetY = screenMax
    ? Math.min(caseBox.max.y - noteH * 0.42, screenMax.y + noteH * (placement === 'right' ? 0.62 : 0.78))
    : caseBox.max.y - caseSize.y * 0.18;
  note.position.set(
    Math.max(caseBox.min.x + noteW * 0.56, Math.min(caseBox.max.x - noteW * 0.5, targetX)),
    Math.max(caseBox.min.y + noteH * 0.5, Math.min(caseBox.max.y - noteH * 0.3, targetY)),
    caseBox.max.z + Math.max(0.008, caseSize.z * 0.012),
  );
  note.rotation.z = THREE.MathUtils.degToRad(rotationDeg);
  note.userData.href = href;
  note.userData.hitType = hitType;
  note.userData.label = text;
  note.userData.hoverHome = {
    x: note.position.x,
    y: note.position.y,
    z: note.position.z,
    rotationX: note.rotation.x,
    rotationY: note.rotation.y,
    rotationZ: note.rotation.z,
    scale: 1,
    emissiveIntensity,
  };
  const defaultHoverMotion = placement === 'right'
    ? {
        x: noteW * 0.026,
        y: -noteH * 0.022,
        z: Math.max(0.01, noteW * 0.032),
        rotationX: THREE.MathUtils.degToRad(-1.65),
        rotationY: THREE.MathUtils.degToRad(2.35),
        rotationZ: THREE.MathUtils.degToRad(-1.35),
        scale: 1.024,
        emissiveIntensity: emissiveIntensity + 0.065,
        easeIn: 0.16,
        easeOut: 0.105,
      }
    : {
        x: noteW * 0.016,
        y: noteH * 0.064,
        z: Math.max(0.014, noteW * 0.052),
        rotationX: THREE.MathUtils.degToRad(1.15),
        rotationY: THREE.MathUtils.degToRad(-1.25),
        rotationZ: THREE.MathUtils.degToRad(2.35),
        scale: 1.044,
        emissiveIntensity: emissiveIntensity + 0.095,
        easeIn: 0.24,
        easeOut: 0.15,
      };
  note.userData.hoverOffset = {
    ...defaultHoverMotion,
    ...(hoverMotion || {}),
  };
  note.userData.hovered = false;
  return note;
}

const TV_HERO_VIDEO_CACHE_LIMIT = 12;

const TV_EDIT_SECTION_PROFILES = {
  idle: { prefer: ['hero', 'iconic', 'establishing', 'wide'], avoid: ['guest'], energy: 3 },
  intro: { prefer: ['hero', 'iconic', 'establishing', 'wide', 'silhouette'], avoid: ['guest', 'explosion'], energy: 2.8 },
  chorus: { prefer: ['action', 'impact', 'saber', 'vehicle', 'creature', 'epic'], energy: 4.5 },
  verse: { prefer: ['character', 'close', 'gesture', 'object', 'screen'], energy: 3 },
  preChorus: { prefer: ['silhouette', 'screen', 'shatter', 'motion', 'wide'], energy: 3.6 },
  breakdown: { prefer: ['close', 'screen', 'gesture', 'noir', 'warm', 'silhouette'], energy: 3.1 },
};
const TV_EDIT_LANE_PROFILES = {
  init: { prefer: ['hero', 'iconic', 'wide'] },
  idle: { prefer: ['hero', 'iconic', 'wide', 'establishing'] },
  snare: { prefer: ['impact', 'action', 'saber', 'shatter', 'explosion'] },
  bass: { prefer: ['wide', 'scale', 'vehicle', 'creature', 'motion'] },
  lead: { prefer: ['close', 'character', 'gesture', 'silhouette'] },
  angel: { prefer: ['wide', 'silhouette', 'warm', 'atmosphere'] },
  build: { prefer: ['motion', 'saber', 'vehicle', 'screen'] },
  switch: { prefer: ['impact', 'vehicle', 'motion', 'shatter'] },
  ghost: { prefer: ['silhouette', 'noir', 'atmosphere'] },
  vocal: { prefer: ['close', 'gesture', 'screen'] },
};
const TV_EDIT_MATCH_TAGS = [
  'wide', 'close', 'character', 'gesture', 'screen', 'saber',
  'vehicle', 'creature', 'silhouette', 'impact', 'motion', 'noir',
];

function uniqueEditTags(tags) {
  return [...new Set((tags || []).filter(Boolean))];
}

function getSourceEditTags(source) {
  return uniqueEditTags(source?.visualTags || source?.tags || []);
}

function makeTvEditProfile(section = 'idle', lane = 'idle', mode = 'normal') {
  const sectionProfile = TV_EDIT_SECTION_PROFILES[section] || TV_EDIT_SECTION_PROFILES.idle;
  const laneProfile = TV_EDIT_LANE_PROFILES[lane] || TV_EDIT_LANE_PROFILES.idle;
  return {
    section,
    lane,
    mode,
    prefer: uniqueEditTags([...(sectionProfile.prefer || []), ...(laneProfile.prefer || [])]),
    avoid: uniqueEditTags([...(sectionProfile.avoid || []), ...(laneProfile.avoid || [])]),
    energy: laneProfile.energy ?? sectionProfile.energy ?? 3,
  };
}

function scoreTvEditCandidate(source, profile, previousSource) {
  if (!source || !profile) return 0;
  const tags = getSourceEditTags(source);
  const tagSet = new Set(tags);
  let score = Math.log2(Math.max(1, source.weight || 1));
  for (const tag of profile.prefer) {
    if (tagSet.has(tag)) score += 2.6;
  }
  for (const tag of profile.avoid) {
    if (tagSet.has(tag)) score -= 3.2;
  }
  if (Number.isFinite(source.energy) && Number.isFinite(profile.energy)) {
    score -= Math.abs(source.energy - profile.energy) * 0.9;
  }
  if (previousSource) {
    const previousTags = new Set(getSourceEditTags(previousSource));
    for (const tag of TV_EDIT_MATCH_TAGS) {
      if (tagSet.has(tag) && previousTags.has(tag)) score += 0.8;
    }
    if (source.shotSize && source.shotSize === previousSource.shotSize) score += 0.7;
    if (source.project && source.project === previousSource.project && profile.lane === 'snare') score += 0.6;
  }
  if (profile.mode === 'sparse' && tagSet.has('impact')) score -= 1.4;
  return score;
}

function rankTvEditCandidates(candidates, profile, previousSource) {
  if (!candidates.length || !profile) return candidates;
  const scored = candidates
    .map((entry) => ({ ...entry, editScore: scoreTvEditCandidate(entry.s, profile, previousSource) }))
    .sort((a, b) => b.editScore - a.editScore || a.i - b.i);
  const best = scored[0]?.editScore ?? 0;
  const windowSize = profile.mode === 'sparse' ? 2.1 : 3.4;
  const shortlist = scored.filter((entry) => entry.editScore >= best - windowSize);
  return shortlist.length ? shortlist : scored;
}

// ── DOM → texture rasterization ──────────────────────────────────────────
// To project the real page sections onto the CRT glass (sampled by the same
// shader as the videos), the DOM must become pixels in the screen canvas. That
// means rasterizing it, and the raster must stay origin-clean or WebGL refuses
// the upload. So every external resource is inlined as a data URL first.
const _macFontCss = { promise: null };

const blobToDataURL = (blob) => new Promise((resolve, reject) => {
  const fr = new FileReader();
  fr.onload = () => resolve(fr.result);
  fr.onerror = reject;
  fr.readAsDataURL(blob);
});

// Inline every same-origin url() in a CSS string as a data URL (background
// images, masks, the HELP behind-the-scenes stills) so they survive into the
// isolated SVG render instead of being stripped for the taint guard.
async function inlineCssUrls(cssText) {
  const urls = [...new Set(
    [...cssText.matchAll(/url\(\s*(['"]?)([^)'"]+)\1\s*\)/gi)].map((m) => m[2].trim()),
  )].filter((u) => u && !u.toLowerCase().startsWith('data:'));
  const map = new Map();
  await Promise.all(urls.map(async (u) => {
    try {
      const abs = new URL(u, document.baseURI);
      if (abs.origin !== location.origin) return;   // cross-origin → leave (gets stripped)
      const d = await blobToDataURL(await (await fetch(abs.href, { cache: 'force-cache' })).blob());
      map.set(u, d);
    } catch {}
  }));
  let out = cssText;
  for (const [u, d] of map) out = out.split(u).join(d);
  return out;
}

// Fetch the Google-Fonts stylesheets + their font files once and return a block
// of @font-face rules with the binaries inlined, so display faces (Anton, etc.)
// survive into the isolated SVG render. Cached for the session.
async function getInlinedFontCss() {
  if (_macFontCss.promise) return _macFontCss.promise;
  _macFontCss.promise = (async () => {
    const links = [...document.querySelectorAll('link[rel="stylesheet"][href*="fonts.googleapis.com"]')];
    const blocks = await Promise.all(links.map(async (l) => {
      try {
        let css = await (await fetch(l.href, { cache: 'force-cache' })).text();
        const urls = [...new Set([...css.matchAll(/url\(([^)]+)\)/g)].map((m) => m[1].replace(/["']/g, '')))];
        await Promise.all(urls.map(async (u) => {
          try {
            const d = await blobToDataURL(await (await fetch(u, { cache: 'force-cache' })).blob());
            css = css.split(u).join(d);
          } catch {}
        }));
        return css;
      } catch { return ''; }
    }));
    return blocks.join('\n');
  })();
  return _macFontCss.promise;
}

// Snapshot a live <video>/<canvas> to a still data URL (clones are blank, so we
// must read the live element), then return a same-sized <img> to swap in.
function snapshotMediaToImg(live, cloneEl) {
  try {
    const cw = live.clientWidth || live.videoWidth || live.width || 0;
    const ch = live.clientHeight || live.videoHeight || live.height || 0;
    let data = null;
    if (live.tagName === 'CANVAS') {
      data = live.toDataURL('image/png');
    } else if (live.tagName === 'VIDEO' && (live.videoWidth || 0) > 0) {
      const c = document.createElement('canvas');
      c.width = live.videoWidth; c.height = live.videoHeight;
      c.getContext('2d').drawImage(live, 0, 0, c.width, c.height);
      data = c.toDataURL('image/jpeg', 0.82);
    }
    const img = document.createElement('img');
    if (data) img.src = data;
    img.style.cssText = cloneEl.getAttribute('style') || '';
    if (cw) img.style.width = `${cw}px`;
    if (ch) img.style.height = `${ch}px`;
    img.style.objectFit = 'cover';
    return img;
  } catch {
    const ph = document.createElement('div');
    ph.style.cssText = (cloneEl.getAttribute('style') || '') + ';background:#0a0908;';
    return ph;
  }
}

// Build an origin-clean, high-DPR raster of `sourceEl` laid out at `width`.
async function rasterizePage(sourceEl, { width = 1280, scale = 1.5, fontCss = '' } = {}) {
  // Collect readable (same-origin) CSS so the clone is styled inside the SVG,
  // then inline its same-origin url() assets (background stills, masks) as data
  // URLs so they render instead of being stripped by the taint guard.
  let css = '';
  for (const ss of document.styleSheets) {
    try { for (const r of ss.cssRules) css += r.cssText + '\n'; } catch {}
  }
  css = await inlineCssUrls(css);
  // The whole design is driven by CSS custom properties (--paper, --ink, --sans,
  // …) defined on :root. Inside the isolated SVG the cloned subtree is NOT a
  // descendant of that :root, so every var() resolves to its initial value
  // (black text, transparent backgrounds). getComputedStyle does NOT enumerate
  // custom properties, so harvest their names from the collected CSS and resolve
  // each against :root, then pin them on the clone root to restore the cascade.
  let rootVars = '';
  try {
    const names = new Set((css.match(/--[\w-]+/g) || []));
    const rootCS = getComputedStyle(document.documentElement);
    const bodyCS = getComputedStyle(document.body);
    for (const name of names) {
      const v = (rootCS.getPropertyValue(name) || bodyCS.getPropertyValue(name)).trim();
      if (v) rootVars += `${name}:${v};`;
    }
  } catch {}

  const clone = sourceEl.cloneNode(true);
  clone.setAttribute('style', `${rootVars}transform:none;position:static;width:${width}px;height:auto;max-height:none;background:#ffffff;color:var(--ink);`);

  // Swap live media (video/2d-canvas) → still <img> by DOM order. WebGL canvases
  // (the HELP player) can't be read back via toDataURL — they'd snapshot to black
  // and cover the cinematic still behind them — so drop them and let the
  // behind-the-scenes background show through.
  const liveMedia = [...sourceEl.querySelectorAll('video, canvas')];
  const cloneMedia = [...clone.querySelectorAll('video, canvas')];
  cloneMedia.forEach((el, i) => {
    const live = liveMedia[i];
    if (!live) return;
    if (live.tagName === 'CANVAS') {
      let webgl = false;
      try { webgl = !!(live.getContext('webgl') || live.getContext('webgl2')); } catch {}
      if (webgl || live.clientHeight === 0) { el.remove(); return; }
    }
    el.replaceWith(snapshotMediaToImg(live, el));
  });

  // Inline same-origin <img> sources as data URLs (clone keeps the same src).
  await Promise.all([...clone.querySelectorAll('img')].map(async (img) => {
    const src = img.getAttribute('src');
    if (!src || src.startsWith('data:')) return;
    try {
      const abs = new URL(src, document.baseURI).href;
      const d = await blobToDataURL(await (await fetch(abs, { cache: 'force-cache' })).blob());
      img.setAttribute('src', d);
      img.removeAttribute('srcset');
    } catch { img.remove(); }
  }));

  // Measure the laid-out height by mounting offscreen briefly.
  const stage = document.createElement('div');
  stage.style.cssText = `position:fixed;left:-99999px;top:0;width:${width}px;pointer-events:none;opacity:0;`;
  stage.appendChild(clone);
  document.body.appendChild(stage);
  // force webfonts/layout
  if (document.fonts?.ready) { try { await document.fonts.ready; } catch {} }
  // Pinned/interactive components (e.g. the HELP side-swipe stage) use fixed /
  // sticky / large-translate positioning to pin to the viewport. Cloned into a
  // static raster, those escape and paint full-page overlays that hide every
  // section below. Flatten all positioning to the document flow so the page
  // rasterizes as a normal scrolling document.
  const vpH = window.innerHeight || 800;
  clone.querySelectorAll('*').forEach((el) => {
    const cs = getComputedStyle(el);
    const h = el.getBoundingClientRect().height;
    // Pinned scaffolding (fixed/sticky) → relative, so it still anchors its
    // absolutely-positioned layers (the HELP crossfade stills) but no longer
    // escapes to the viewport. Keep `absolute` intact — that's what the layered
    // backgrounds and players rely on.
    if (cs.position === 'fixed' || cs.position === 'sticky') el.style.position = 'relative';
    // Pinned-scroll RUNWAYS are much taller than the viewport (e.g. the HELP
    // stage is ~3.8× tall to drive its pin). Collapse those to their pinned
    // view so they don't project as huge empty voids. Leave ~viewport-height
    // stage cards (and their dark cinematic grounds) intact.
    if (h > vpH * 1.4) {
      el.style.height = 'auto';
      el.style.minHeight = '0';
      el.style.maxHeight = 'none';
      el.style.overflow = 'visible';
    } else if (h >= vpH * 0.8) {
      // A ~viewport-height stage card (the pinned HELP view). Pin it to a FIXED
      // height so its absolute inset:0 background layers (the cinematic stills)
      // fill the whole frame instead of collapsing to the short text height.
      const fixed = Math.round(Math.min(h, vpH));
      el.style.height = `${fixed}px`;
      el.style.minHeight = `${fixed}px`;
      el.style.maxHeight = `${fixed}px`;
      el.style.overflow = 'hidden';
    }
  });
  const height = Math.max(1, clone.scrollHeight);
  document.body.removeChild(stage);

  const holder = document.createElement('div');
  holder.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
  holder.style.cssText = `width:${width}px;height:${height}px;background:#ffffff;`;
  holder.innerHTML = `<style>${fontCss}\n${css}</style>`;
  holder.appendChild(clone);

  // An SVG that references ANY external URL taints the output canvas and blocks
  // the WebGL upload. Replace every non-data url() (masks, background textures,
  // font files that failed to inline) with a transparent pixel so the raster
  // stays origin-clean. data: urls (inlined images/fonts) are preserved.
  const TRANSPARENT = "url('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')";
  const stripExternalUrls = (s) => s.replace(/url\(\s*(['"]?)([^)]*?)\1\s*\)/gi,
    (m, _q, u) => (u.trim().toLowerCase().startsWith('data:') ? m : TRANSPARENT));

  const svg = stripExternalUrls(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">`
    + `<foreignObject x="0" y="0" width="100%" height="100%">`
    + new XMLSerializer().serializeToString(holder)
    + `</foreignObject></svg>`);
  // IMPORTANT: load via a data: URL, NOT URL.createObjectURL(blob). Chrome taints
  // the canvas when an SVG that contains a <foreignObject> is loaded from a blob:
  // URL, which would block the WebGL upload; the same SVG from a data: URL stays
  // origin-clean.
  const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  const img = await new Promise((resolve, reject) => {
    const im = new Image();
    im.onload = () => resolve(im);
    im.onerror = () => reject(new Error('svg raster failed'));
    im.src = url;
  });
  const cnv = document.createElement('canvas');
  cnv.width = Math.round(width * scale);
  cnv.height = Math.round(height * scale);
  const cx = cnv.getContext('2d');
  cx.fillStyle = '#ffffff';
  cx.fillRect(0, 0, cnv.width, cnv.height);
  cx.scale(scale, scale);
  cx.drawImage(img, 0, 0, width, height);
  return { canvas: cnv, cssWidth: width, cssHeight: height, scale };
}

function TvHero({ sources = [], vocalSamples = [], children }) {
  const wrapRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const keyboardCaptureRef = React.useRef(null);
  const macStageDragEnabled = React.useMemo(isMacStageDragEnabled, []);
  const [macStageDragBucket, setMacStageDragBucket] = React.useState(() => getMacStageDragBucket());
  const [macStageDragX, setMacStageDragX] = React.useState(() => readMacStageDragX());
  const macStageDragXRef = React.useRef(macStageDragX);
  const stateRef = React.useRef({
    three: null,
    renderer: null,
    scene: null,
    camera: null,
    frameModel: null,
    screenTex: null,
    screenCanvas: null,
    ctx2d: null,
    currentImage: null,
    currentMedia: null,
    currentVideo: null,
    currentSource: null,
    currentLane: 'idle',
    currentCutMode: 'normal',
    lastVideoFrameTime: -1,
    currentFit: 'cover',
    currentMatteAspect: null,
    currentContentRect: null,
    currentActiveRect: null,
    videoCache: new Map(),
    vocalSampleCache: new Map(),
    vocalSampleNodes: new Set(),
    vocalSampleCursor: 0,
    vocalSampleRecent: [],
    vocalSampleLoop: -1,
    vocalSampleSection: '',
    lastVocalCallKey: '',
    vocalSampleSlots: new Set(),
    vocalRegionCursors: new Map(),
    videoRaf: 0,
    videoFrameRequest: 0,
    tracking: { activeUntil: 0, seed: 0, strength: 0 },
    trackingRaf: 0,
    channelRaf: 0,
    channelCutTimer: 0,
    channelFlipping: false,
    staticCanvas: null,
    staticCtx: null,
    imageCache: new Map(),
    recent: [],
    recentProjects: [],
    laneCursors: new Map(),
    songStartedAt: 0,
    rhythmCutCount: 0,
    lastCutAt: 0,
    lastRhythmCutAt: 0,
    lastSparseCutAt: 0,
    lastHatTrackingPulseAt: 0,
    lastVocalPunchAt: 0,
    sparseMotif: null,
    liveEdit: { punchUntil: 0, punchScale: 1 },
    liveEditTimer: 0,
    cutToken: 0,
    raf: 0,
    bbox: null,
    screenMode: TV_MODEL_URL.includes('macintosh') ? 'grayscale' : 'color',
    deviceMode: TV_MODEL_URL.includes('macintosh') ? 'mac' : 'tv',
    macBloom: { activeUntil: 0, strength: 0, kind: 'bass' },
    asciiBurst: null,
    asciiConfig: getMacAsciiInitialConfig(),
    bassKeyIndex: 0,
	    macBloomRaf: 0,
	    tvVisible: true,
	    tabVisible: typeof document === 'undefined' ? true : isResumePageActive(),
	    helpPlayerActive: false,
	    helpPinned: false,
	    helpImmersive: false,
	    requestRender: null,
	    powerPausedVideo: null,
	    powerToggleInFlight: false,
	    macKeyAudio: null,
	    terminal: null,
	    stickyNoteHoverRaf: 0,
	    hoveredStickyNote: null,
	  });
  const [engineEnabled, setEngineEnabled] = React.useState(false);
  const [availableSources, setAvailableSources] = React.useState(() => sources);
  const [phase, setPhase] = React.useState('burst');
  const phaseRef = React.useRef('burst');
  const lastCutRef = React.useRef(0);
  const lastChordKeyRef = React.useRef(null);
  const currentIdxRef = React.useRef(-1);

  const helpOwnsTvStage = React.useCallback(() => {
    const state = stateRef.current;
    return Boolean(state.helpPlayerActive || state.helpPinned || state.helpImmersive);
  }, []);

  React.useEffect(() => { phaseRef.current = phase; }, [phase]);

  React.useEffect(() => {
    setAvailableSources(sources);
  }, [sources]);

  React.useEffect(() => {
    macStageDragXRef.current = macStageDragX;
  }, [macStageDragX]);

  React.useEffect(() => {
    const syncMacStageDrag = () => {
      const bucket = getMacStageDragBucket();
      setMacStageDragBucket(bucket);
      setMacStageDragX(readMacStageDragX(bucket));
    };
    syncMacStageDrag();
    window.addEventListener('resize', syncMacStageDrag);
    return () => window.removeEventListener('resize', syncMacStageDrag);
  }, []);

  React.useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const roundedX = Math.round(macStageDragX);
    wrap.style.setProperty('--mac-stage-drag-x', `${roundedX}px`);
    wrap.dataset.macDragX = `${roundedX}px`;
    wrap.dataset.macDragBucket = macStageDragBucket;
    window.__resumeMacStagePlacement = () => ({
      bucket: getMacStageDragBucket(),
      x: readMacStageDragX(getMacStageDragBucket()),
      key: getMacStageDragStorageKey(getMacStageDragBucket()),
    });
  }, [macStageDragBucket, macStageDragX]);

  React.useEffect(() => {
    if (!macStageDragEnabled) return undefined;
    const wrap = wrapRef.current;
    if (!wrap) return undefined;
    const clampDragX = (value) => Math.max(-900, Math.min(900, Math.round(value)));
    const applyDragX = (value) => {
      const bucket = getMacStageDragBucket();
      const next = clampDragX(value);
      macStageDragXRef.current = next;
      writeMacStageDragX(next, bucket);
      setMacStageDragBucket(bucket);
      setMacStageDragX(next);
    };
    let activePointerId = null;
    let startClientX = 0;
    let startDragX = 0;
    const interactiveSelector = '.tv-hero__controls, button, a, input, textarea, select, [contenteditable="true"]';
    const onPointerDown = (event) => {
      if (event.button !== 0) return;
      if (event.target?.closest?.(interactiveSelector)) return;
      event.preventDefault();
      activePointerId = event.pointerId;
      startClientX = event.clientX;
      startDragX = macStageDragXRef.current;
      wrap.setPointerCapture?.(event.pointerId);
      document.body.style.userSelect = 'none';
    };
    const onPointerMove = (event) => {
      if (activePointerId !== event.pointerId) return;
      applyDragX(startDragX + event.clientX - startClientX);
    };
    const endPointerDrag = (event) => {
      if (activePointerId !== event.pointerId) return;
      activePointerId = null;
      try { wrap.releasePointerCapture?.(event.pointerId); } catch (_) {}
      document.body.style.userSelect = '';
    };
    const onKeyDown = (event) => {
      const target = event.target;
      const tag = target?.tagName?.toLowerCase?.();
      if (tag === 'input' || tag === 'textarea' || target?.isContentEditable) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        const amount = event.shiftKey ? 24 : 6;
        applyDragX(macStageDragXRef.current + (event.key === 'ArrowLeft' ? -amount : amount));
      } else if (event.key === '0') {
        event.preventDefault();
        applyDragX(0);
      }
    };
    wrap.addEventListener('pointerdown', onPointerDown);
    wrap.addEventListener('pointermove', onPointerMove);
    wrap.addEventListener('pointerup', endPointerDrag);
    wrap.addEventListener('pointercancel', endPointerDrag);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      wrap.removeEventListener('pointerdown', onPointerDown);
      wrap.removeEventListener('pointermove', onPointerMove);
      wrap.removeEventListener('pointerup', endPointerDrag);
      wrap.removeEventListener('pointercancel', endPointerDrag);
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.userSelect = '';
    };
  }, [macStageDragEnabled]);

  const RECENT_WINDOW = 28;
  const RECENT_PROJECT_WINDOW = 3;
  const VOCAL_HOOK_VOLUME = 0.78;
  const ARRANGEMENT_CYCLES = 40;
  const PRECHORUS_START_CYCLES = 20;
  const PRECHORUS_END_CYCLES = 24;
  const BREAKDOWN_START_CYCLES = 32;
  const BREAKDOWN_END_CYCLES = 40;
  const ARRANGEMENT_CYCLE_MS = 60000 / (153 / 4);
  const ARRANGEMENT_MS = ARRANGEMENT_CYCLE_MS * ARRANGEMENT_CYCLES;
  const PRECHORUS_START_MS = ARRANGEMENT_CYCLE_MS * PRECHORUS_START_CYCLES;
  const PRECHORUS_END_MS = ARRANGEMENT_CYCLE_MS * PRECHORUS_END_CYCLES;
  const BREAKDOWN_START_MS = ARRANGEMENT_CYCLE_MS * BREAKDOWN_START_CYCLES;
  const BREAKDOWN_END_MS = ARRANGEMENT_CYCLE_MS * BREAKDOWN_END_CYCLES;

  const getEditSection = React.useCallback((now = performance.now()) => {
    const state = stateRef.current;
    if (!state.songStartedAt || !ARRANGEMENT_MS) return 'idle';
    const elapsed = Math.max(0, now - state.songStartedAt);
    const loopMs = ((elapsed % ARRANGEMENT_MS) + ARRANGEMENT_MS) % ARRANGEMENT_MS;
    if (loopMs < ARRANGEMENT_CYCLE_MS * 4) return 'intro';
    if (loopMs < ARRANGEMENT_CYCLE_MS * 12) return 'chorus';
    if (loopMs < ARRANGEMENT_CYCLE_MS * 20) return 'verse';
    if (loopMs < PRECHORUS_END_MS) return 'preChorus';
    if (loopMs < BREAKDOWN_START_MS) return 'chorus';
    if (loopMs < BREAKDOWN_END_MS) return 'breakdown';
    return 'idle';
  }, [ARRANGEMENT_CYCLE_MS, ARRANGEMENT_MS, BREAKDOWN_END_MS, BREAKDOWN_START_MS, PRECHORUS_END_MS]);

  const pickIndex = React.useCallback((lane, options = {}) => {
    if (!availableSources.length) return 0;
    const profile = makeTvEditProfile(getEditSection(), lane || 'idle', options.mode || 'normal');
    const chooseFresh = (pickLane, blockedIndexes = new Set(), blockedProjects = new Set(), cursorKey = pickLane) => {
      const activeBlockedIndexes = new Set(blockedIndexes);
      if (currentIdxRef.current >= 0) activeBlockedIndexes.add(currentIdxRef.current);
      const laneEligible = availableSources
        .map((s, i) => ({ s, i }))
        .filter(({ s, i }) => (!s.lanes || s.lanes.includes(pickLane)) && !activeBlockedIndexes.has(i));
      let eligible = laneEligible.length
        ? laneEligible
        : availableSources
            .map((s, i) => ({ s, i }))
            .filter(({ s }) => !s.lanes || s.lanes.includes(pickLane));
      if (!eligible.length) return currentIdxRef.current >= 0 ? currentIdxRef.current : 0;
      const state = stateRef.current;
      let activeReelMode = 'open';
      if ((state.guestReelRemaining || 0) > 0) {
        const guestEligible = eligible.filter(({ s }) => s.reelGroup === 'guest');
        if (guestEligible.length) {
          eligible = guestEligible;
          activeReelMode = 'guest-block';
          state.guestReelRemaining = Math.max(0, (state.guestReelRemaining || 0) - 1);
        } else {
          state.guestReelRemaining = 0;
        }
      } else if ((state.guestReelCooldown || 0) > 0) {
        const starWarsEligible = eligible.filter(({ s }) => (s.reelGroup || 'star-wars') !== 'guest');
        if (starWarsEligible.length) {
          eligible = starWarsEligible;
          activeReelMode = 'star-wars-cooldown';
          state.guestReelCooldown = Math.max(0, (state.guestReelCooldown || 0) - 1);
        } else {
          state.guestReelCooldown = 0;
        }
      }
      const recent = new Set(state.recent);
      const recentProjects = new Set([
        ...(state.recentProjects || []).slice(-RECENT_PROJECT_WINDOW),
        ...blockedProjects,
      ]);
      const fresh = eligible.filter(({ i }) => !recent.has(i));
      const projectFresh = fresh.filter(({ s }) => !recentProjects.has(s.project || ''));
      const pool = projectFresh.length
        ? projectFresh
        : fresh.length
          ? fresh
          : eligible.filter(({ i }) => i !== currentIdxRef.current);
      const finalPool = rankTvEditCandidates(
        pool.length ? pool : eligible,
        profile,
        state.currentSource,
      );
      const cursor = (state.laneCursors.get(cursorKey) || 0) % finalPool.length;
      const picked = finalPool[cursor].i;
      state.laneCursors.set(cursorKey, (cursor + 1) % Math.max(1, finalPool.length));
      const project = availableSources[picked]?.project || '';
      const reelGroup = availableSources[picked]?.reelGroup || 'star-wars';
      state.recent = [...state.recent, picked].slice(-RECENT_WINDOW);
      if (project) state.recentProjects = [...(state.recentProjects || []), project].slice(-RECENT_PROJECT_WINDOW);
      if (reelGroup === 'guest') {
        if (activeReelMode === 'guest-block') {
          if (!(state.guestReelRemaining > 0)) state.guestReelCooldown = 4;
        } else {
          state.guestReelRemaining = 1;
        }
      } else if (activeReelMode !== 'guest-block') {
        state.guestReelRemaining = 0;
      }
      return picked;
    };

    if (options.mode === 'sparse') {
      const state = stateRef.current;
      const now = performance.now();
      const motifLane = options.vocal ? 'vocal' : lane === 'bass' ? 'bass' : 'lead';
      let motif = state.sparseMotif;
      const stale = !motif
        || motif.lane !== motifLane
        || motif.expiresAt <= now
        || !motif.indexes?.length
        || motif.cutsRemaining <= 0;
      if (stale) {
        const blockedIndexes = new Set();
        if (currentIdxRef.current >= 0) blockedIndexes.add(currentIdxRef.current);
        const blockedProjects = new Set();
        const indexes = [];
        for (let slot = 0; slot < 2; slot++) {
          const picked = chooseFresh(motifLane, blockedIndexes, blockedProjects, `${motifLane}:sparse`);
          if (!indexes.includes(picked)) indexes.push(picked);
          blockedIndexes.add(picked);
          const project = availableSources[picked]?.project || '';
          if (project) blockedProjects.add(project);
        }
        motif = {
          lane: motifLane,
          indexes,
          cursor: 0,
          cutsRemaining: Math.max(3, indexes.length * 3),
          expiresAt: now + 11000,
        };
        state.sparseMotif = motif;
      }
      const picked = motif.indexes[motif.cursor % motif.indexes.length];
      motif.cursor += 1;
      motif.cutsRemaining -= 1;
      return picked;
    }

    return chooseFresh(lane || 'idle');
  }, [availableSources, getEditSection]);

  const disposeCachedVideo = React.useCallback((video) => {
    if (!video) return;
    try { video.pause(); } catch {}
    try {
      video.removeAttribute('src');
      video.load?.();
    } catch {}
  }, []);

  const pauseAllCachedVideos = React.useCallback(() => {
    for (const video of stateRef.current.videoCache.values()) {
      try { video.pause(); } catch {}
    }
  }, []);

  const getMusicAudioContext = React.useCallback(() => (
    window.__resumeStrudelModule?.getAudioContext?.() || null
  ), []);

  const stopVocalSamples = React.useCallback((fadeMs = 28) => {
    const state = stateRef.current;
    const context = getMusicAudioContext();
    const now = context?.currentTime || 0;
    for (const voice of state.vocalSampleNodes || []) {
      try {
        if (context && voice.gain?.gain) {
          voice.gain.gain.cancelScheduledValues(now);
          voice.gain.gain.setTargetAtTime(0.0001, now, Math.max(0.006, fadeMs / 3000));
        }
        voice.source?.stop?.(context ? now + fadeMs / 1000 + 0.018 : 0);
      } catch {}
      window.setTimeout(() => {
        try { voice.source?.disconnect?.(); } catch {}
        try { voice.highpass?.disconnect?.(); } catch {}
        try { voice.lowpass?.disconnect?.(); } catch {}
        try { voice.pan?.disconnect?.(); } catch {}
        try { voice.gain?.disconnect?.(); } catch {}
        state.vocalSampleNodes.delete(voice);
      }, fadeMs + 90);
    }
  }, [getMusicAudioContext]);

  const loadVocalSampleBuffer = React.useCallback(async (sample) => {
    const context = getMusicAudioContext();
    if (!context || !sample?.url) return null;
    const cache = stateRef.current.vocalSampleCache;
    const cached = cache.get(sample.url);
    if (cached?.buffer) return cached.buffer;
    if (cached?.promise) return cached.promise;
    const promise = fetch(sample.url)
      .then((response) => {
        if (!response.ok) throw new Error(`Unable to load vocal sample: ${sample.url}`);
        return response.arrayBuffer();
      })
      .then((arrayBuffer) => context.decodeAudioData(arrayBuffer.slice(0)))
      .then((buffer) => {
        cache.set(sample.url, { buffer });
        return buffer;
      })
      .catch((error) => {
        cache.delete(sample.url);
        console.warn('Vocal sample load failed', error);
        return null;
      });
    cache.set(sample.url, { promise });
    return promise;
  }, [getMusicAudioContext]);

  const pickVocalSample = React.useCallback((mode = 'phrase') => {
    if (!vocalSamples.length) return null;
    const state = stateRef.current;
    if (mode === 'answer' && state.lastVocalCallKey) {
      const callSample = vocalSamples.find((sample) => sample.sampleKey === state.lastVocalCallKey);
      const responseKey = callSample?.responseSampleKey || callSample?.sampleKey;
      const paired = vocalSamples.find((sample) => sample.sampleKey === responseKey && sample.answerPhrases?.length);
      if (paired) return paired;
    }
    const craftPool = vocalSamples.filter((sample) => (sample.priority || 1) >= 3);
    const modePool = mode === 'call'
      ? vocalSamples.filter((sample) => sample.callPhrases?.length)
      : mode === 'answer'
        ? vocalSamples.filter((sample) => sample.answerPhrases?.length)
        : null;
    const strongKeys = new Set([
      'vocal-jobs-secrets-life',
      'vocal-mando-way-01',
      'vocal-mando-stand-for',
      'vocal-obi-cant-run',
      'vocal-andor-fight',
    ]);
    const preferred = modePool
      ? modePool
      : mode === 'phrase'
      ? (craftPool.length ? craftPool : vocalSamples.filter((sample) => strongKeys.has(sample.sampleKey)))
      : (craftPool.length ? craftPool : vocalSamples);
    const pool = preferred.length
      ? preferred
      : vocalSamples;
    const recent = new Set(state.vocalSampleRecent || []);
    const fresh = pool.filter((sample) => !recent.has(sample.sampleKey));
    const finalPool = fresh.length ? fresh : pool;
    const picked = finalPool[(state.vocalSampleCursor || 0) % finalPool.length];
    state.vocalSampleCursor = (state.vocalSampleCursor || 0) + 1;
    if (picked?.sampleKey) {
      state.vocalSampleRecent = [...(state.vocalSampleRecent || []), picked.sampleKey].slice(-4);
    }
    return picked;
  }, [vocalSamples]);

  const pickVocalRegion = React.useCallback((sample, mode = 'phrase') => {
    if (!sample) return null;
    const regions = mode === 'call'
      ? (sample.callPhrases?.length ? sample.callPhrases : sample.phrases || [sample.phrase].filter(Boolean))
      : mode === 'answer'
        ? (sample.answerPhrases?.length ? sample.answerPhrases : sample.phrases || [sample.phrase].filter(Boolean))
        : mode === 'phrase'
          ? (sample.phrases?.length ? sample.phrases : [sample.phrase].filter(Boolean))
          : (sample.chops?.length ? sample.chops : sample.phrases || [sample.phrase].filter(Boolean));
    if (!regions.length) return null;
    const key = `${sample.sampleKey || sample.url}:${mode}`;
    const cursors = stateRef.current.vocalRegionCursors;
    const cursor = cursors.get(key) || 0;
    cursors.set(key, (cursor + 1) % regions.length);
    return regions[((cursor % regions.length) + regions.length) % regions.length];
  }, []);

  const emitVocalMidi = React.useCallback((sample, detail = {}) => {
    const engine = window.__resumeStrudelAudioEngine;
    engine?.emitSceneLane?.('vocal', {
      scheduledTime: detail.scheduledTime,
      duration: detail.duration,
      velocity: detail.velocity ?? 0.7,
      raw: {
        sampleKey: sample?.sampleKey || '',
        cue: sample?.cue || '',
        region: detail.region || '',
        mode: detail.mode || 'phrase',
      },
    });
  }, []);

  const playVocalRegion = React.useCallback(async (sample, region = {}, detail = {}) => {
    if (!sample || stateRef.current.tabVisible === false || stateRef.current.tvVisible === false || helpOwnsTvStage()) return;
    if (!window.__resumeStrudelAudioEngine?.enabled) return;
    const context = getMusicAudioContext();
    if (!context) return;
    try { await context.resume?.(); } catch {}
    const buffer = await loadVocalSampleBuffer(sample);
    if (!buffer) return;
    const mode = detail.mode || 'phrase';
    const phraseLike = mode === 'phrase' || mode === 'call' || mode === 'answer';
    const now = context.currentTime;
    const scheduled = Number.isFinite(detail.scheduledTime) ? detail.scheduledTime + (detail.delaySec || 0) : now + 0.018;
    const when = Math.max(now + 0.012, scheduled);
    const offset = Math.max(0, Math.min(buffer.duration - 0.02, region.offset || 0));
    const duration = Math.max(0.06, Math.min(region.duration || 0.4, buffer.duration - offset));
    const source = context.createBufferSource();
    const highpass = context.createBiquadFilter();
    const lowpass = context.createBiquadFilter();
    const gain = context.createGain();
    const pan = context.createStereoPanner ? context.createStereoPanner() : null;
    const texture = detail.texture || region.texture || '';
    const textureGain = texture === 'ghost' ? 0.48 : texture === 'dust' ? 0.7 : 1;
    const level = Math.max(0, Math.min(1, (sample.volume ?? VOCAL_HOOK_VOLUME) * (region.gain ?? 1) * (detail.gain ?? 1) * textureGain * (phraseLike ? 0.78 : 0.58)));
    const attackSec = phraseLike ? 0.018 : 0.012;
    const releaseSec = phraseLike ? 0.09 : 0.045;
    const eventScheduledTime = Number.isFinite(detail.scheduledTime)
      ? detail.scheduledTime + (detail.delaySec || 0)
      : undefined;
    source.buffer = buffer;
    source.playbackRate.setValueAtTime(region.rate || detail.rate || 1, when);
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(texture === 'dust' ? 240 : phraseLike ? 115 : 180, when);
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(texture === 'ghost' ? 4300 : texture === 'dust' ? 5600 : phraseLike ? 9800 : 6200, when);
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, level), when + attackSec);
    gain.gain.setValueAtTime(Math.max(0.0002, level), Math.max(when + attackSec, when + duration - releaseSec));
    gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
    source.connect(highpass);
    highpass.connect(lowpass);
    lowpass.connect(gain);
    if (pan) {
      pan.pan.setValueAtTime(detail.pan ?? 0, when);
      gain.connect(pan);
      pan.connect(context.destination);
    } else {
      gain.connect(context.destination);
    }
    const voice = { source, highpass, lowpass, gain, pan };
    stateRef.current.vocalSampleNodes.add(voice);
    source.onended = () => {
      try { source.disconnect(); } catch {}
      try { highpass.disconnect(); } catch {}
      try { lowpass.disconnect(); } catch {}
      try { gain.disconnect(); } catch {}
      try { pan?.disconnect?.(); } catch {}
      stateRef.current.vocalSampleNodes.delete(voice);
    };
    source.start(when, offset, duration);
    source.stop(when + duration + 0.02);
    emitVocalMidi(sample, {
      scheduledTime: eventScheduledTime,
      duration: duration * 1000,
      velocity: level,
      mode,
      region: region.label || '',
    });
    window.dispatchEvent(new CustomEvent('resume-vocal-sample-cue', {
      detail: {
        mode,
        sampleKey: sample.sampleKey || '',
        cue: sample.cue || '',
        project: sample.project || '',
        region: region.label || '',
        offset,
        duration,
        scheduledTime: eventScheduledTime,
        texture,
      },
    }));
  }, [VOCAL_HOOK_VOLUME, emitVocalMidi, getMusicAudioContext, helpOwnsTvStage, loadVocalSampleBuffer]);

  const playVocalMoment = React.useCallback((sample, mode, scheduledTime, slotIndex = 0) => {
    if (!sample) return;
    const beatSec = 60 / 153;
    const dillaNudges = [0.034, -0.018, 0.046, -0.029, 0.021, 0.039, -0.011, 0.027, -0.024, 0.014];
    const getPocketDelay = (beat = 0, index = 0, intensity = 1) => Math.max(
      0,
      (beat * beatSec) + (dillaNudges[index % dillaNudges.length] * intensity)
    );
    const buildRegionMap = () => {
      const pairs = [
        ...(sample.callPhrases || []),
        ...(sample.answerPhrases || []),
        ...(sample.phrases || []),
        sample.phrase,
        ...(sample.chops || []),
      ].filter(Boolean).filter((region) => region.label);
      return new Map(pairs.map((region) => [region.label, region]));
    };
    const phraseLike = mode === 'phrase' || mode === 'call' || mode === 'answer';
    if (mode === 'call' && sample.sampleKey) {
      stateRef.current.lastVocalCallKey = sample.sampleKey;
    }
    const phrasePattern = mode === 'call'
      ? sample.callPattern
      : mode === 'answer'
        ? sample.answerPattern
        : null;
    if (phraseLike && phrasePattern?.length) {
      stopVocalSamples(18);
      const selectedRegion = pickVocalRegion(sample, mode) || {};
      const regionsByLabel = buildRegionMap();
      phrasePattern.forEach((entry, index) => {
        const entryMode = entry.mode || (entry.target === 'selected' ? mode : 'chop');
        const region = entry.target === 'selected'
          ? selectedRegion
          : entry.label && regionsByLabel.has(entry.label)
            ? regionsByLabel.get(entry.label)
            : pickVocalRegion(sample, entryMode);
        if (!region) return;
        playVocalRegion(sample, region, {
          mode: entryMode,
          scheduledTime,
          delaySec: getPocketDelay(entry.beat ?? 0, index, entry.pocket ?? (entryMode === 'chop' ? 1 : 0.65)),
          pan: entry.pan ?? [-0.12, 0.1, -0.04, 0.16][index % 4],
          rate: entry.rate,
          gain: entry.gain,
          texture: entry.texture,
        });
      });
      return;
    }
    if (phraseLike) {
      stopVocalSamples(18);
      playVocalRegion(sample, pickVocalRegion(sample, mode) || {}, {
        mode,
        scheduledTime,
        delaySec: getPocketDelay(0, slotIndex, mode === 'call' ? 0.75 : 0.55),
        pan: slotIndex % 2 ? 0.08 : -0.06,
      });
      return;
    }
    const regionsByLabel = new Map((sample.chops || []).map((region) => [region.label, region]));
    const pattern = sample.chopPattern?.length
      ? sample.chopPattern
      : [0, 1, 2, 3, 4, 5, 6, 7].map((beat) => ({ beat }));
    pattern.forEach((entry, index) => {
      const region = entry.label && regionsByLabel.has(entry.label)
        ? regionsByLabel.get(entry.label)
        : pickVocalRegion(sample, mode);
      playVocalRegion(sample, region, {
        mode,
        scheduledTime,
        delaySec: getPocketDelay(entry.beat ?? index, index, entry.pocket ?? 1),
        pan: [-0.18, 0.12, -0.05, 0.2][index % 4],
        rate: entry.rate,
        gain: entry.gain,
        texture: entry.texture,
      });
    });
    if (sample.chopLandingBeat !== undefined && sample.phrase) {
      playVocalRegion(sample, sample.phrase, {
        mode: 'phrase',
        scheduledTime,
        delaySec: getPocketDelay(sample.chopLandingBeat, pattern.length, 0.45),
        pan: 0.04,
      });
    }
  }, [pickVocalRegion, playVocalRegion, stopVocalSamples]);

  const getBreakdownPosition = React.useCallback((now = performance.now()) => {
    const state = stateRef.current;
    if (!state.songStartedAt || !ARRANGEMENT_MS) return { active: false };
    const elapsed = Math.max(0, now - state.songStartedAt);
    const loopIndex = Math.floor(elapsed / ARRANGEMENT_MS);
    const loopMs = ((elapsed % ARRANGEMENT_MS) + ARRANGEMENT_MS) % ARRANGEMENT_MS;
    const active = loopMs >= BREAKDOWN_START_MS && loopMs < BREAKDOWN_END_MS;
    const breakdownMs = active ? loopMs - BREAKDOWN_START_MS : -1;
    return {
      active,
      elapsed,
      loopIndex,
      loopMs,
      breakdownMs,
      cycleIndex: active ? Math.floor(breakdownMs / ARRANGEMENT_CYCLE_MS) : -1,
      slotIndex: active ? Math.floor(breakdownMs / (ARRANGEMENT_CYCLE_MS * 2)) : -1,
    };
  }, [ARRANGEMENT_CYCLE_MS, ARRANGEMENT_MS, BREAKDOWN_END_MS, BREAKDOWN_START_MS]);

  const getVocalSectionPosition = React.useCallback((now = performance.now()) => {
    const state = stateRef.current;
    if (!state.songStartedAt || !ARRANGEMENT_MS) return { active: false };
    const elapsed = Math.max(0, now - state.songStartedAt);
    const loopIndex = Math.floor(elapsed / ARRANGEMENT_MS);
    const loopMs = ((elapsed % ARRANGEMENT_MS) + ARRANGEMENT_MS) % ARRANGEMENT_MS;
    const inPreChorus = loopMs >= PRECHORUS_START_MS && loopMs < PRECHORUS_END_MS;
    const inBreakdown = loopMs >= BREAKDOWN_START_MS && loopMs < BREAKDOWN_END_MS;
    if (!inPreChorus && !inBreakdown) return { active: false, elapsed, loopIndex, loopMs };
    const section = inPreChorus ? 'preChorus' : 'breakdown';
    const sectionStart = inPreChorus ? PRECHORUS_START_MS : BREAKDOWN_START_MS;
    const sectionMs = loopMs - sectionStart;
    return {
      active: true,
      section,
      elapsed,
      loopIndex,
      loopMs,
      sectionMs,
      cycleIndex: Math.floor(sectionMs / ARRANGEMENT_CYCLE_MS),
      slotIndex: Math.floor(sectionMs / (ARRANGEMENT_CYCLE_MS * 2)),
    };
  }, [ARRANGEMENT_CYCLE_MS, ARRANGEMENT_MS, BREAKDOWN_END_MS, BREAKDOWN_START_MS, PRECHORUS_END_MS, PRECHORUS_START_MS]);

  const triggerSectionVocal = React.useCallback((lane, event) => {
    if (!engineEnabled || !vocalSamples.length) return;
    const position = getVocalSectionPosition();
    if (!position.active) return;
    const state = stateRef.current;
    const sectionKey = `${position.loopIndex}:${position.section}`;
    if (state.vocalSampleLoop !== position.loopIndex || state.vocalSampleSection !== sectionKey) {
      state.vocalSampleLoop = position.loopIndex;
      state.vocalSampleSection = sectionKey;
      state.vocalSampleSlots.clear();
    }
    const slotIndex = Math.max(0, Math.min(position.section === 'preChorus' ? 1 : 3, position.slotIndex));
    if (position.section === 'preChorus') {
      if (!['lead', 'angel', 'build', 'switch', 'ghost'].includes(lane)) return;
      const key = `${position.loopIndex}:preChorus:${slotIndex}:call`;
      if (state.vocalSampleSlots.has(key)) return;
      state.vocalSampleSlots.add(key);
      const sample = pickVocalSample('call');
      playVocalMoment(sample, 'call', event.detail?.scheduledTime, slotIndex);
      return;
    }
    const storySample = vocalSamples.find((sample) => (sample.priority || 1) >= 3 && sample.breakdownModes?.length);
    const mode = storySample?.breakdownModes?.[slotIndex] || (slotIndex === 0 ? 'answer' : slotIndex === 2 ? 'chop' : 'rest');
    if (mode === 'rest') {
      state.vocalSampleSlots.add(`${position.loopIndex}:${slotIndex}:rest`);
      return;
    }
    const phraseLike = mode === 'phrase' || mode === 'answer';
    const canLeadPhrase = phraseLike && slotIndex >= 3 && ['lead', 'angel', 'build', 'switch', 'ghost'].includes(lane);
    if (phraseLike && lane !== 'bass' && !canLeadPhrase) return;
    if (mode === 'chop' && !['bass', 'lead', 'angel', 'build', 'switch', 'ghost'].includes(lane)) return;
    const key = `${position.loopIndex}:${slotIndex}:${mode}`;
    if (state.vocalSampleSlots.has(key)) return;
    state.vocalSampleSlots.add(key);
    const sample = pickVocalSample(mode);
    playVocalMoment(sample, mode, event.detail?.scheduledTime, slotIndex);
  }, [engineEnabled, getVocalSectionPosition, pickVocalSample, playVocalMoment, vocalSamples]);

  const trimVideoCache = React.useCallback((keepSrc = '') => {
    const state = stateRef.current;
    for (const [cachedSrc, video] of [...state.videoCache]) {
      if (state.videoCache.size <= TV_HERO_VIDEO_CACHE_LIMIT) break;
      if (cachedSrc === keepSrc || video === state.currentVideo || video === state.powerPausedVideo) continue;
      state.videoCache.delete(cachedSrc);
      disposeCachedVideo(video);
    }
  }, [disposeCachedVideo]);

  const emitSourceChange = React.useCallback((source, detail = {}) => {
    try {
      const state = stateRef.current;
      window.dispatchEvent(new CustomEvent('resume-tv-source-change', {
        detail: {
          lane: detail.lane || state.currentLane || source?.lanes?.[0] || 'idle',
          mode: detail.mode || state.currentCutMode || 'normal',
          url: detail.url || source?.url || '',
          project: source?.project || '',
          cue: source?.cue || '',
          sampleKey: source?.sampleKey || '',
          index: Number.isFinite(detail.index) ? detail.index : -1,
          kind: source?.kind || '',
          frameCanvas: state.screenCanvas || null,
          source,
          timestamp: performance.now(),
        },
      }));
    } catch (_) {}
  }, []);

  const ensureMacTerminal = React.useCallback(() => {
    const state = stateRef.current;
    if (!state.terminal) {
      state.terminal = {
        input: '',
        cursorOn: true,
        focused: true,
        lines: [...MAC_TERMINAL_BOOT_LINES],
      };
    }
    return state.terminal;
  }, []);

  const pushMacTerminalLine = React.useCallback((line = '') => {
    const term = ensureMacTerminal();
    term.lines = [...term.lines, line].slice(-12);
  }, [ensureMacTerminal]);

  const getMacKeyAudioContext = React.useCallback(() => {
    if (stateRef.current.deviceMode !== 'mac') return null;
    const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextCtor) return null;
    const state = stateRef.current;
    let audio = state.macKeyAudio;
    if (!audio?.context || audio.context.state === 'closed') {
      try {
        audio = { context: new AudioContextCtor() };
        state.macKeyAudio = audio;
      } catch {
        return null;
      }
    }
    try { audio.context.resume?.(); } catch {}
    return audio.context.state === 'closed' ? null : audio.context;
  }, []);

  const captureMacKeyboard = React.useCallback(() => {
    if (stateRef.current.deviceMode !== 'mac') return;
    const term = ensureMacTerminal();
    term.focused = true;
    term.cursorOn = true;
    getMacKeyAudioContext();
    const active = document.activeElement;
    if (active && active !== keyboardCaptureRef.current && active !== document.body) {
      try { active.blur?.(); } catch {}
    }
    const capture = keyboardCaptureRef.current;
    if (capture) {
      try { capture.focus({ preventScroll: true }); }
      catch { capture.focus?.(); }
    }
  }, [ensureMacTerminal, getMacKeyAudioContext]);

  const playMacKeyClick = React.useCallback((code = '') => {
    const context = getMacKeyAudioContext();
    if (!context) return;
    const now = context.currentTime + 0.001;
    const isLargeKey = code === 'Space' || code === 'Enter' || code === 'Backspace';
    const duration = isLargeKey ? 0.078 : 0.058;
    const length = Math.max(1, Math.floor(context.sampleRate * duration));
    const buffer = context.createBuffer(1, length, context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      const t = i / Math.max(1, length - 1);
      const bodyEnv = Math.pow(1 - t, 2.05);
      const tapEnv = Math.pow(1 - t, 8.5);
      data[i] = (Math.random() * 2 - 1) * (bodyEnv * 0.82 + tapEnv * 0.55);
    }

    const noise = context.createBufferSource();
    const lowBody = context.createBiquadFilter();
    const midKnock = context.createBiquadFilter();
    const highClick = context.createBiquadFilter();
    const thock = context.createOscillator();
    const bodyGain = context.createGain();
    const knockGain = context.createGain();
    const clickGain = context.createGain();
    const thockGain = context.createGain();
    lowBody.type = 'bandpass';
    lowBody.frequency.setValueAtTime(isLargeKey ? 270 : 330, now);
    lowBody.Q.setValueAtTime(0.68, now);
    midKnock.type = 'bandpass';
    midKnock.frequency.setValueAtTime(isLargeKey ? 760 : 920, now);
    midKnock.Q.setValueAtTime(1.05, now);
    highClick.type = 'bandpass';
    highClick.frequency.setValueAtTime(isLargeKey ? 1850 : 2400, now);
    highClick.Q.setValueAtTime(0.82, now);
    thock.type = 'triangle';
    thock.frequency.setValueAtTime(isLargeKey ? 128 : 176, now);
    thock.frequency.exponentialRampToValueAtTime(isLargeKey ? 88 : 118, now + (isLargeKey ? 0.044 : 0.032));
    bodyGain.gain.setValueAtTime(0.0001, now);
    bodyGain.gain.exponentialRampToValueAtTime(isLargeKey ? 0.28 : 0.21, now + 0.004);
    bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + (isLargeKey ? 0.074 : 0.055));
    knockGain.gain.setValueAtTime(0.0001, now);
    knockGain.gain.exponentialRampToValueAtTime(isLargeKey ? 0.18 : 0.145, now + 0.0025);
    knockGain.gain.exponentialRampToValueAtTime(0.0001, now + (isLargeKey ? 0.03 : 0.023));
    clickGain.gain.setValueAtTime(0.0001, now);
    clickGain.gain.exponentialRampToValueAtTime(isLargeKey ? 0.08 : 0.065, now + 0.0015);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, now + (isLargeKey ? 0.014 : 0.011));
    thockGain.gain.setValueAtTime(0.0001, now);
    thockGain.gain.exponentialRampToValueAtTime(isLargeKey ? 0.135 : 0.09, now + 0.003);
    thockGain.gain.exponentialRampToValueAtTime(0.0001, now + (isLargeKey ? 0.042 : 0.03));
    noise.buffer = buffer;
    noise.connect(lowBody);
    noise.connect(midKnock);
    noise.connect(highClick);
    lowBody.connect(bodyGain);
    midKnock.connect(knockGain);
    highClick.connect(clickGain);
    thock.connect(thockGain);
    bodyGain.connect(context.destination);
    knockGain.connect(context.destination);
    clickGain.connect(context.destination);
    thockGain.connect(context.destination);
    noise.start(now);
    thock.start(now);
    noise.stop(now + duration + 0.006);
    thock.stop(now + duration + 0.006);
    noise.onended = () => {
      try { noise.disconnect(); } catch {}
      try { lowBody.disconnect(); } catch {}
      try { midKnock.disconnect(); } catch {}
      try { highClick.disconnect(); } catch {}
      try { thock.disconnect(); } catch {}
      try { bodyGain.disconnect(); } catch {}
      try { knockGain.disconnect(); } catch {}
      try { clickGain.disconnect(); } catch {}
      try { thockGain.disconnect(); } catch {}
    };
  }, [getMacKeyAudioContext]);

  const setScreenTextureSampling = React.useCallback((mode = 'media') => {
    const state = stateRef.current;
    const THREE = state.three;
    const tex = state.screenTex;
    if (!THREE || !tex) return;
    const terminal = mode === 'terminal';
    const minFilter = terminal && state.renderer?.capabilities?.isWebGL2
      ? THREE.LinearMipmapLinearFilter
      : THREE.LinearFilter;
    const magFilter = THREE.LinearFilter;
    const generateMipmaps = terminal && !!state.renderer?.capabilities?.isWebGL2;
    if (tex.minFilter !== minFilter || tex.magFilter !== magFilter || tex.generateMipmaps !== generateMipmaps) {
      tex.minFilter = minFilter;
      tex.magFilter = magFilter;
      tex.generateMipmaps = generateMipmaps;
      tex.needsUpdate = true;
    }
  }, []);

  const setScreenCanvasSize = React.useCallback((mode = 'media') => {
    const state = stateRef.current;
    const canvas = state.screenCanvas;
    if (!canvas) return;
    const target = mode === 'terminal' ? MAC_SCREEN_TERMINAL_SIZE : MAC_SCREEN_MEDIA_SIZE;
    if (canvas.width !== target.width) canvas.width = target.width;
    if (canvas.height !== target.height) canvas.height = target.height;
  }, []);

  // Paint the Mac's inactive screen as a period-ish monochrome terminal.
  // Draw directly at texture resolution so the UI keeps the vintage shape
  // without turning into a jagged low-res texture on the curved screen.
  const drawMacOffScreen = React.useCallback(() => {
    const { ctx2d, screenCanvas, screenTex } = stateRef.current;
    if (!ctx2d || !screenCanvas) return;
    // CRT channels own the screen — except the boot channel, which IS the
    // terminal and asks for it explicitly via forceTerminal.
    if (stateRef.current.pageMode && !stateRef.current.forceTerminal) return;
    setScreenCanvasSize('terminal');
    setScreenTextureSampling('terminal');
    const w = screenCanvas.width, h = screenCanvas.height;
    const term = ensureMacTerminal();
    const px = (value) => Math.round(value);
    ctx2d.save();
    ctx2d.imageSmoothingEnabled = false;
    const desktopPaper = '#f8f7ee';
    ctx2d.fillStyle = desktopPaper;
    ctx2d.fillRect(0, 0, w, h);

    const black = '#000000';
    const paper = '#f8f7ee';
    const menuH = px(h * 0.052);
    // UI chrome (menu bar, window title) keeps the original clean Mac system
    // stack. Body stays Monaco (authentic on macOS) with VT323 as a retro mono
    // fallback so non-Mac devices still get a period look instead of Courier.
    const uiFont = '"Chicago", Geneva, "Lucida Grande", Arial, sans-serif';
    const monoFont = 'Monaco, "VT323", "IBM Plex Mono", "Courier New", monospace';

    ctx2d.fillStyle = desktopPaper;
    ctx2d.fillRect(0, 0, w, menuH);
    ctx2d.fillStyle = black;
    ctx2d.fillRect(0, menuH - 2, w, 2);
    const uiTextOffset = Math.max(1, px(h * 0.0005));
    const drawUiText = (text, x, baseline) => {
      ctx2d.fillText(text, x, baseline);
      ctx2d.fillText(text, x + uiTextOffset, baseline);
    };
    ctx2d.font = `bold ${px(h * 0.023)}px ${uiFont}`;
    drawUiText('▣', px(w * 0.025), px(menuH * 0.69));
    ctx2d.font = `${px(h * 0.022)}px ${uiFont}`;
    drawUiText('MacTerminal   File   Edit   Session   Window', px(w * 0.073), px(menuH * 0.69));

    // A compact classic-Mac window: white field, black hairlines, title-bar
    // stripes, close box, and a small scroll bar. The original display was
    // 1-bit, so this stays black/white instead of a modern dark terminal.
    const terminalWindowScale = 0.8;
    const baseWx = w * 0.085;
    const baseWy = menuH + h * 0.058;
    const baseWw = w * 0.83;
    const baseWh = h * 0.71;
    const wx = px(baseWx + baseWw * (1 - terminalWindowScale) * 0.5);
    const wy = px(baseWy + baseWh * (1 - terminalWindowScale) * 0.5);
    const ww = px(baseWw * terminalWindowScale);
    const wh = px(baseWh * terminalWindowScale);
    const titleH = px(h * 0.048 * terminalWindowScale);
    ctx2d.fillStyle = paper;
    ctx2d.fillRect(wx, wy, ww, wh);
    ctx2d.strokeStyle = black;
    ctx2d.lineWidth = 2;
    ctx2d.strokeRect(wx, wy, ww, wh);
    ctx2d.lineWidth = 2;
    const innerInset = px(5 * terminalWindowScale);
    ctx2d.strokeRect(wx + innerInset, wy + innerInset, ww - innerInset * 2, wh - innerInset * 2);

    const titleY = wy + px(6 * terminalWindowScale);
    const titleText = 'MacTerminal';
    ctx2d.save();
    ctx2d.beginPath();
    const windowInset = px(8 * terminalWindowScale);
    ctx2d.rect(wx + windowInset, titleY, ww - windowInset * 2, titleH - windowInset);
    ctx2d.clip();
    ctx2d.strokeStyle = black;
    ctx2d.lineWidth = 2;
    for (let y = titleY + px(4 * terminalWindowScale); y < titleY + titleH - windowInset; y += px(8 * terminalWindowScale)) {
      ctx2d.beginPath();
      ctx2d.moveTo(wx + px(12 * terminalWindowScale), y);
      ctx2d.lineTo(wx + ww - px(12 * terminalWindowScale), y);
      ctx2d.stroke();
    }
    ctx2d.restore();
    ctx2d.fillStyle = paper;
    const titleW = px(w * 0.17 * terminalWindowScale);
    const titleX = px(wx + ww / 2 - titleW / 2);
    ctx2d.fillRect(titleX, wy + px(6 * terminalWindowScale), titleW, titleH - windowInset);
    ctx2d.font = `bold ${px(h * 0.021 * terminalWindowScale)}px ${uiFont}`;
    ctx2d.fillStyle = black;
    ctx2d.textAlign = 'center';
    ctx2d.fillText(titleText, wx + ww / 2, wy + px(titleH * 0.68));
    ctx2d.fillText(titleText, wx + ww / 2 + uiTextOffset, wy + px(titleH * 0.68));
    ctx2d.textAlign = 'left';

    const closeSize = px(h * 0.024 * terminalWindowScale);
    const scrollW = px(w * 0.015 * terminalWindowScale);
    const scrollX = wx + ww - px(w * 0.034 * terminalWindowScale);
    ctx2d.strokeRect(wx + px(w * 0.018 * terminalWindowScale), wy + px(h * 0.015 * terminalWindowScale), closeSize, closeSize);
    ctx2d.strokeRect(scrollX, wy + titleH + px(4 * terminalWindowScale), scrollW, wh - titleH - px(h * 0.043 * terminalWindowScale));
    ctx2d.fillRect(scrollX, wy + titleH + px(4 * terminalWindowScale), scrollW, 2);
    ctx2d.fillRect(scrollX, wy + wh - px(h * 0.04 * terminalWindowScale), scrollW, 2);

    ctx2d.save();
    ctx2d.beginPath();
    const tx = wx + px(w * 0.034 * terminalWindowScale);
    const ty = wy + titleH + px(h * 0.034 * terminalWindowScale);
    const tw = ww - px(w * 0.088 * terminalWindowScale);
    const th = wh - titleH - px(h * 0.072 * terminalWindowScale);
    ctx2d.rect(tx, ty, tw, th);
    ctx2d.clip();
    ctx2d.fillStyle = black;
    const fontSize = px(h * 0.0335 * terminalWindowScale);
    const lineHeight = px(fontSize * 1.42);
    ctx2d.font = `${fontSize}px ${monoFont}`;
    const prompt = 'tawfeeq$ ';
    const maxTextWidth = tw - px(fontSize * 0.7);
    const continuation = ' '.repeat(prompt.length);
    const wrapText = (value, width) => {
      const text = String(value ?? '');
      if (!text) return [''];
      const rows = [];
      let remaining = text;
      while (remaining.length) {
        let take = remaining.length;
        while (take > 1 && ctx2d.measureText(remaining.slice(0, take)).width > width) take--;
        if (take < remaining.length) {
          const space = remaining.lastIndexOf(' ', take);
          if (space > 0 && ctx2d.measureText(remaining.slice(0, space)).width <= width) {
            take = space + 1;
          }
        }
        rows.push(remaining.slice(0, take).replace(/\s+$/g, ''));
        remaining = remaining.slice(take).replace(/^\s+/g, '');
      }
      return rows.length ? rows : [''];
    };
    const wrapPromptInput = () => {
      const input = String(term.input ?? '');
      const firstWidth = Math.max(fontSize * 2, maxTextWidth - ctx2d.measureText(prompt).width);
      const nextWidth = Math.max(fontSize * 2, maxTextWidth - ctx2d.measureText(continuation).width);
      const chunks = [];
      let remaining = input;
      let width = firstWidth;
      if (!remaining) return [{ text: prompt, cursor: true }];
      while (remaining.length) {
        let take = remaining.length;
        while (take > 1 && ctx2d.measureText(remaining.slice(0, take)).width > width) take--;
        chunks.push(remaining.slice(0, take));
        remaining = remaining.slice(take);
        width = nextWidth;
      }
      return chunks.map((chunk, index) => ({
        text: `${index === 0 ? prompt : continuation}${chunk}`,
        cursor: index === chunks.length - 1,
      }));
    };
    const allLines = [
      ...term.lines.flatMap((line) => wrapText(line, maxTextWidth).map((text) => ({ text }))),
      ...wrapPromptInput(),
    ];
    const visibleCount = Math.max(6, Math.floor(th / lineHeight));
    const visible = allLines.slice(-visibleCount);
    const textX = tx;
    const drawTerminalText = (line, x, baseline) => {
      ctx2d.fillText(line, x, baseline);
      ctx2d.fillText(line, x + Math.max(1, px(fontSize * 0.018)), baseline);
    };
    let y = ty + fontSize;
    let cursor = null;
    for (const row of visible) {
      drawTerminalText(row.text, textX, y);
      if (row.cursor) {
        cursor = {
          x: textX + Math.min(maxTextWidth, ctx2d.measureText(row.text).width),
          y: y - px(fontSize * 0.78),
        };
      }
      y += lineHeight;
    }
    if (term.cursorOn && cursor) {
      ctx2d.fillStyle = black;
      ctx2d.fillRect(cursor.x + 2, cursor.y, px(fontSize * 0.58), px(fontSize * 1.05));
    }
    ctx2d.restore();

    ctx2d.globalCompositeOperation = 'source-over';
    ctx2d.restore();
    if (screenTex) {
      screenTex.needsUpdate = true;
      stateRef.current.requestRender?.();
    }
  }, [ensureMacTerminal, setScreenCanvasSize, setScreenTextureSampling]);

  // Draw a source image to the offscreen screen canvas with a light wash.
  const drawSourceToCanvas = React.useCallback((img, effect = null) => {
    const { ctx2d, screenCanvas, screenTex } = stateRef.current;
    if (!ctx2d || !screenCanvas) return;
    if (stateRef.current.pageMode) return;  // CRT page projection owns the screen
    setScreenCanvasSize('media');
    setScreenTextureSampling('media');
    const w = screenCanvas.width, h = screenCanvas.height;
    ctx2d.fillStyle = '#000';
    ctx2d.fillRect(0, 0, w, h);
    const mediaW = img.naturalWidth || img.videoWidth || img.width || 1;
    const mediaH = img.naturalHeight || img.videoHeight || img.height || 1;
    const ar = mediaW / mediaH;
    const targetAr = w / h;
    let dw, dh, dx, dy;
    // Mac classic = square-ish screen with no cinematic letterbox; force
    // cover fit so the image fills the CRT regardless of source aspect.
    const isMac = stateRef.current.deviceMode === 'mac';
    const fit = isMac ? 'cover' : stateRef.current.currentFit;
    if (fit === 'contain') {
      if (ar > targetAr) {
        dw = w; dh = w / ar; dx = 0; dy = (h - dh) / 2;
      } else {
        dh = h; dw = h * ar; dx = (w - dw) / 2; dy = 0;
      }
    } else if (ar > targetAr) {
      dh = h; dw = h * ar; dx = (w - dw) / 2; dy = 0;
    } else {
      dw = w; dh = w / ar; dx = 0; dy = (h - dh) / 2;
    }
    // Per-source punch-in zoom (for sources with baked-in letterboxing
    // like The Creator's 2.39 content inside a 16:9 file). Scales the
    // drawn image up from the canvas centre to crop the dead bars.
    const sourcePunchIn = stateRef.current.currentPunchIn || 1;
    const sourceMatteAspect = stateRef.current.currentMatteAspect;
    // The trailer derivatives are 2.39 images inside a 16:9 file. On the
    // rounded Mac CRT, those baked bars create straight top/bottom edges
    // inside the glass. Crop them out for the Mac path and let the screen
    // mesh be the mask.
    const macMattePunchIn = isMac && sourceMatteAspect
      ? Math.max(1, sourceMatteAspect / ar)
      : 1;
    const liveEdit = stateRef.current.liveEdit;
    const livePunch = liveEdit && performance.now() < liveEdit.punchUntil
      ? liveEdit.punchScale || 1
      : 1;
    const punchIn = Math.max(sourcePunchIn, macMattePunchIn) * livePunch;
    if (punchIn !== 1) {
      const cx = w / 2, cy = h / 2;
      dx = cx - (cx - dx) * punchIn;
      dy = cy - (cy - dy) * punchIn;
      dw *= punchIn;
      dh *= punchIn;
    }
    const contentRect = { x: dx, y: dy, w: dw, h: dh };
    const matteAspect = isMac ? null : stateRef.current.currentMatteAspect;
    let activeRect = contentRect;
    if (matteAspect && matteAspect > 0) {
      const contentAr = dw / dh;
      if (matteAspect > contentAr) {
        const ah = dw / matteAspect;
        activeRect = { x: dx, y: dy + (dh - ah) / 2, w: dw, h: ah };
      } else {
        const aw = dh * matteAspect;
        activeRect = { x: dx + (dw - aw) / 2, y: dy, w: aw, h: dh };
      }
    }
    stateRef.current.currentContentRect = contentRect;
    stateRef.current.currentActiveRect = activeRect;
    ctx2d.drawImage(img, dx, dy, dw, dh);
    if (isMac) {
      // Keep the Mac screen clean. Patterned overlays alias badly once
      // mapped onto the curved screen mesh.
      ctx2d.globalCompositeOperation = 'source-over';
      ctx2d.fillStyle = 'rgba(255, 244, 214, 0.035)';
      ctx2d.fillRect(0, 0, w, h);
    } else {
      // Warm wash
      ctx2d.globalCompositeOperation = 'overlay';
      const grad = ctx2d.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0,  'rgba(255, 200, 110, 0.10)');
      grad.addColorStop(0.5,'rgba(20, 14, 8, 0.06)');
      grad.addColorStop(1,  'rgba(0, 0, 0, 0.18)');
      ctx2d.fillStyle = grad;
      ctx2d.fillRect(0, 0, w, h);
      // Vignette
      ctx2d.globalCompositeOperation = 'source-over';
      const vg = ctx2d.createRadialGradient(w/2, h/2, w*0.30, w/2, h/2, w*0.62);
      vg.addColorStop(0, 'rgba(0,0,0,0)');
      vg.addColorStop(1, 'rgba(0,0,0,0.35)');
      ctx2d.fillStyle = vg;
      ctx2d.fillRect(0, 0, w, h);
    }
    ctx2d.globalCompositeOperation = 'source-over';

    if (effect?.strength > 0) {
      const strength = Math.max(0, Math.min(1.35, effect.strength));
      const seed = effect.seed || 1;
      const noiseLines = 18 + Math.floor(strength * 24);
      const rand = (i) => {
        const x = Math.sin(seed * 12.9898 + i * 78.233) * 43758.5453;
        return x - Math.floor(x);
      };
      const frameDx = Math.floor((rand(240) - 0.5) * w * 0.13 * strength);
      const frameDy = Math.floor((rand(241) - 0.5) * h * 0.035 * strength);
      if (frameDx || frameDy) {
        ctx2d.save();
        ctx2d.globalCompositeOperation = 'source-over';
        ctx2d.drawImage(screenCanvas, 0, 0, w, h, frameDx, frameDy, w, h);
        ctx2d.globalCompositeOperation = 'multiply';
        ctx2d.fillStyle = `rgba(0,0,0,${0.10 * strength})`;
        if (frameDx > 0) ctx2d.fillRect(0, 0, frameDx, h);
        if (frameDx < 0) ctx2d.fillRect(w + frameDx, 0, -frameDx, h);
        if (frameDy > 0) ctx2d.fillRect(0, 0, w, frameDy);
        if (frameDy < 0) ctx2d.fillRect(0, h + frameDy, w, -frameDy);
        ctx2d.restore();
      }

      // Horizontal tracking tears: copy narrow bands sideways, like the
      // TV briefly lost sync on a low-frequency hit.
      for (let i = 0; i < 10; i++) {
        const y = Math.floor(rand(i) * h);
        const bandH = Math.floor((18 + rand(i + 10) * 58) * strength);
        const dx = Math.floor((rand(i + 20) - 0.5) * w * 0.42 * strength);
        if (bandH > 2 && dx !== 0) {
          ctx2d.drawImage(screenCanvas, 0, y, w, bandH, dx, y, w, bandH);
        }
      }

      // High-frequency static flecks and sync bars. Kept monochrome so
      // it reads CRT/tracking, not digital glitch.
      ctx2d.save();
      ctx2d.globalCompositeOperation = 'screen';
      const flecks = Math.floor(190 * strength);
      for (let i = 0; i < flecks; i++) {
        const x = Math.floor(rand(i + 260) * w);
        const y = Math.floor(rand(i + 620) * h);
        const s = 1 + Math.floor(rand(i + 980) * 3 * strength);
        const a = (0.055 + rand(i + 1340) * 0.14) * strength;
        ctx2d.fillStyle = `rgba(255,255,255,${a})`;
        ctx2d.fillRect(x, y, s, s);
      }
      for (let i = 0; i < noiseLines; i++) {
        const y = Math.floor(rand(i + 40) * h);
        const x = Math.floor(rand(i + 70) * w * 0.22);
        const lineW = Math.floor(w * (0.45 + rand(i + 90) * 0.75));
        const lineH = Math.max(2, Math.floor((2 + rand(i + 100) * 8) * strength));
        ctx2d.fillStyle = `rgba(255,255,255,${(0.055 + rand(i + 110) * 0.18) * strength})`;
        ctx2d.fillRect(x, y, lineW, lineH);
      }
      ctx2d.globalCompositeOperation = 'multiply';
      for (let i = 0; i < 7; i++) {
        const y = Math.floor(rand(i + 130) * h);
        ctx2d.fillStyle = `rgba(0,0,0,${(0.12 + rand(i + 140) * 0.28) * strength})`;
        ctx2d.fillRect(0, y, w, Math.max(6, Math.floor(30 * strength)));
      }
      ctx2d.restore();
    }

    // Screen mode: clips are pre-baked grayscale (saved upstream in
    // /media/tv-clips/), so the only mode that still does per-frame work
    // is 1-bit Bayer dither for the stylized Shift+3 toggle.
    const mode = stateRef.current.screenMode;
    if (mode === '1bit') {
      const imageData = ctx2d.getImageData(0, 0, w, h);
      const d = imageData.data;
      // 8x8 Bayer ordered dither, thresholds scaled to 0–255.
      const BAYER = [
          0, 32,  8, 40,  2, 34, 10, 42,
         48, 16, 56, 24, 50, 18, 58, 26,
         12, 44,  4, 36, 14, 46,  6, 38,
         60, 28, 52, 20, 62, 30, 54, 22,
          3, 35, 11, 43,  1, 33,  9, 41,
         51, 19, 59, 27, 49, 17, 57, 25,
         15, 47,  7, 39, 13, 45,  5, 37,
         63, 31, 55, 23, 61, 29, 53, 21
      ].map((v) => (v + 0.5) * (255 / 64));
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = (y * w + x) * 4;
          const g = d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114;
          const t = BAYER[(y & 7) * 8 + (x & 7)];
          const bit = g > t ? 255 : 0;
          d[i] = d[i + 1] = d[i + 2] = bit;
        }
      }
      ctx2d.putImageData(imageData, 0, 0);
    }

    // Boot channel: overlay the channel menu bar on the terminal once docked.
    if (stateRef.current.dockMode) {
      stateRef.current.drawMenuBar?.(ctx2d, screenCanvas.width, screenCanvas.height);
    }
    if (screenTex) {
      screenTex.needsUpdate = true;
      stateRef.current.requestRender?.();
    }
  }, [setScreenCanvasSize, setScreenTextureSampling]);

  const animateTrackingBurst = React.useCallback(() => {
    cancelAnimationFrame(stateRef.current.trackingRaf);
    const tickTracking = () => {
      const now = performance.now();
      const tracking = stateRef.current.tracking;
      const media = stateRef.current.currentMedia || stateRef.current.currentImage;
      if (!media || now >= tracking.activeUntil) {
        stateRef.current.trackingRaf = 0;
        if (media) drawSourceToCanvas(media);
        return;
      }
      const remaining = Math.max(0, (tracking.activeUntil - now) / 260);
      const strength = Math.min(1, tracking.strength * remaining);
      drawSourceToCanvas(media, {
        strength,
        seed: tracking.seed + Math.floor(now / 22),
      });
      stateRef.current.trackingRaf = requestAnimationFrame(tickTracking);
    };
    tickTracking();
  }, [drawSourceToCanvas]);

  const drawMacAsciiBassOverlay = React.useCallback((strength = 1, hitT = 0) => {
    const state = stateRef.current;
    if (state.deviceMode !== 'mac' || state.macBloom?.ascii === false) return;
    const config = state.asciiConfig || MAC_ASCII_BASS_CONFIG_DEFAULTS;
    if (!config.enabled) return;
    const { ctx2d, screenCanvas } = state;
    if (!ctx2d || !screenCanvas) return;
    const w = screenCanvas.width, h = screenCanvas.height;
    const amount = Math.max(0, Math.min(1, strength / 1.08));
    if (amount <= 0.045) return;

    const now = performance.now();
    const tileSize = Math.max(6, config.tileSize || MAC_ASCII_BASS_CONFIG_DEFAULTS.tileSize);
    const cols = Math.max(12, Math.min(160, Math.round(w / tileSize)));
    const rows = Math.max(9, Math.min(120, Math.round(h / tileSize)));
    const cellW = w / cols;
    const cellH = h / rows;
    if (!state.asciiBurst) state.asciiBurst = {};
    const ascii = state.asciiBurst;
    if (!ascii.canvas) {
      ascii.canvas = document.createElement('canvas');
      ascii.ctx = ascii.canvas.getContext('2d');
      ascii.sampleCanvas = document.createElement('canvas');
      ascii.sampleCtx = ascii.sampleCanvas.getContext('2d');
      ascii.backgroundCanvas = document.createElement('canvas');
      ascii.backgroundCtx = ascii.backgroundCanvas.getContext('2d');
    }
    if (ascii.canvas.width !== w || ascii.canvas.height !== h) {
      ascii.canvas.width = w;
      ascii.canvas.height = h;
      ascii.ready = false;
    }
    if (ascii.sampleCanvas.width !== cols || ascii.sampleCanvas.height !== rows) {
      ascii.sampleCanvas.width = cols;
      ascii.sampleCanvas.height = rows;
      ascii.ready = false;
    }
    const bgScale = 4;
    const bgW = Math.max(1, Math.round(w / bgScale));
    const bgH = Math.max(1, Math.round(h / bgScale));
    if (ascii.backgroundCanvas.width !== bgW || ascii.backgroundCanvas.height !== bgH) {
      ascii.backgroundCanvas.width = bgW;
      ascii.backgroundCanvas.height = bgH;
    }

    const seed = state.macBloom?.shakeSeed || 1;
    const chars = String(config.chars || MAC_ASCII_BASS_CHARS);
    const charColors = config.charColors || {};
    const colorKey = JSON.stringify(charColors);
    const accent = state.macBloom?.asciiAccent || null;
    const accentColor = accent ? accent.color : '';
    const accentKey = accent ? `${accent.label}:${accent.char}:${accentColor}` : '';
    const key = `${w}x${h}:${cols}x${rows}:${seed}:${chars}:${colorKey}:${accentKey}:${config.fontScale}:${config.jitter}:${config.brightness}:${config.contrast}:${config.threshold}:${config.coverage}:${config.density}:${config.edgeEmphasis}`;
    const videoActive = state.currentVideo && state.currentMedia === state.currentVideo && !state.currentVideo.paused;
    const minFrameMs = videoActive
      ? Math.max(72, config.minFrameMs || MAC_ASCII_BASS_CONFIG_DEFAULTS.minFrameMs)
      : (config.minFrameMs || MAC_ASCII_BASS_CONFIG_DEFAULTS.minFrameMs);
    const shouldBuild = !ascii.ready
      || ascii.key !== key
      || now - (ascii.lastBuiltAt || 0) >= minFrameMs;

    if (shouldBuild) {
      const sampleCtx = ascii.sampleCtx;
      const outCtx = ascii.ctx;
      sampleCtx.save();
      sampleCtx.imageSmoothingEnabled = true;
      sampleCtx.clearRect(0, 0, cols, rows);
      sampleCtx.drawImage(screenCanvas, 0, 0, cols, rows);
      sampleCtx.restore();

      const pixels = sampleCtx.getImageData(0, 0, cols, rows).data;
      const phase = Math.floor(now / 64);
      const jitterAmount = config.jitter ?? MAC_ASCII_BASS_CONFIG_DEFAULTS.jitter;
      const brightness = config.brightness ?? 0;
      const contrast = config.contrast ?? 1;
      const threshold = config.threshold ?? 0;
      const coverage = config.coverage ?? 1;
      const density = config.density ?? 1;
      const edgeEmphasis = config.edgeEmphasis ?? 0;
      const charColorRgb = {};
      for (const [char, color] of Object.entries(charColors)) {
        const rgb = macAsciiColorToRgb(color);
        if (rgb) charColorRgb[char] = rgb;
      }
      const accentRgb = macAsciiColorToRgb(accentColor);
      const rand = (i) => {
        const x = Math.sin(seed * 17.17 + phase * 5.31 + i * 41.89) * 9371.13;
        return x - Math.floor(x);
      };
      const clamp01 = (value) => Math.max(0, Math.min(1, value));
      const lumAt = (x, y) => {
        const xx = Math.max(0, Math.min(cols - 1, x));
        const yy = Math.max(0, Math.min(rows - 1, y));
        const idx = (yy * cols + xx) * 4;
        return (pixels[idx] * 0.299 + pixels[idx + 1] * 0.587 + pixels[idx + 2] * 0.114) / 255;
      };

      outCtx.clearRect(0, 0, w, h);
      outCtx.textAlign = 'center';
      outCtx.textBaseline = 'middle';
      outCtx.font = `700 ${Math.max(8, Math.round(cellH * (config.fontScale || 1)))}px Monaco, "Courier New", monospace`;
      const peakIndex = Math.max(0, chars.length - 1);
      const accentCandidates = [];
      const accentBandH = Math.max(54, Math.floor(h * 0.15));
      const accentSpan = h + accentBandH * 2;
      const accentY = accentRgb
        ? ((((state.macBloom?.rollPhase || 0) % accentSpan) + accentSpan) % accentSpan) - accentBandH
        : 0;
      const addAccentCandidate = (candidate) => {
        if (accentCandidates.length < MAC_ASCII_BASS_MAX_ACCENT_GLYPHS) {
          accentCandidates.push(candidate);
          return;
        }
        let weakestIndex = 0;
        let weakestScore = accentCandidates[0].score;
        for (let i = 1; i < accentCandidates.length; i++) {
          if (accentCandidates[i].score < weakestScore) {
            weakestIndex = i;
            weakestScore = accentCandidates[i].score;
          }
        }
        if (candidate.score > weakestScore) accentCandidates[weakestIndex] = candidate;
      };
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = (y * cols + x) * 4;
          const sourceLum = (pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114) / 255;
          const edge = edgeEmphasis > 0
            ? Math.max(Math.abs(lumAt(x + 1, y) - lumAt(x - 1, y)), Math.abs(lumAt(x, y + 1) - lumAt(x, y - 1)))
            : 0;
          let lum = (sourceLum - 0.5) * contrast + 0.5 + brightness + edge * edgeEmphasis * 0.85;
          lum = clamp01(lum * density);
          if (threshold > 0 && lum < threshold) continue;
          if (threshold > 0) lum = clamp01((lum - threshold) / Math.max(0.001, 1 - threshold));
          if (coverage < 1) {
            const coverageGate = coverage * (0.35 + lum * 0.65);
            if (rand(i + 2203) > coverageGate) continue;
          }
          const jitter = (rand(i) - 0.5) * jitterAmount;
          const index = Math.max(0, Math.min(chars.length - 1, Math.round(lum * (chars.length - 1) + jitter)));
          const char = chars[index];
          if (char === ' ') continue;
          const tone = Math.round(172 + lum * 74);
          let alpha = Math.max(0.22, Math.min(0.96, 0.18 + lum * 0.86));
          const mappedRgb = accentRgb ? null : charColorRgb[char];
          let rgb = mappedRgb || [tone, tone, Math.max(165, tone - 12)];
          const drawX = x * cellW + cellW * 0.5;
          const drawY = y * cellH + cellH * 0.55;
          if (accentRgb && index === peakIndex) {
            const actionBias = 1 - Math.min(1, Math.abs(drawY - accentY) / Math.max(1, h * 0.48));
            addAccentCandidate({
              alpha,
              char,
              score: lum * 1.25 + actionBias * 0.95 + rand(i + 7319) * 0.72,
              x: drawX,
              y: drawY,
            });
          }
          outCtx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`;
          outCtx.fillText(char, drawX, drawY);
        }
      }
      if (accentRgb) {
        for (const candidate of accentCandidates) {
          const alpha = Math.min(1, candidate.alpha * 1.3 + 0.1);
          outCtx.fillStyle = `rgba(${accentRgb[0]},${accentRgb[1]},${accentRgb[2]},${alpha})`;
          outCtx.fillText(candidate.char, candidate.x, candidate.y);
        }
      }
      ascii.ready = true;
      ascii.key = key;
      ascii.lastBuiltAt = now;
    }

    const attackLift = Math.max(0, 1 - hitT * 0.28);
    const alpha = Math.max(0, Math.min(1, amount * attackLift));
    const backgroundOpacity = Math.max(0, Math.min(1, config.backgroundOpacity ?? 0));
    const backgroundBlur = Math.max(0, config.backgroundBlur ?? 0);
    ctx2d.save();
    ctx2d.globalCompositeOperation = 'source-over';
    if (backgroundOpacity > 0.001) {
      const bgCtx = ascii.backgroundCtx;
      bgCtx.save();
      bgCtx.imageSmoothingEnabled = true;
      bgCtx.clearRect(0, 0, bgW, bgH);
      if (backgroundBlur > 0 && 'filter' in bgCtx) {
        bgCtx.filter = `blur(${Math.max(0, backgroundBlur / bgScale)}px)`;
      }
      bgCtx.drawImage(screenCanvas, 0, 0, bgW, bgH);
      bgCtx.restore();
      ctx2d.globalAlpha = Math.min(1, backgroundOpacity * (0.6 + alpha * 0.4));
      ctx2d.imageSmoothingEnabled = true;
      ctx2d.drawImage(ascii.backgroundCanvas, 0, 0, w, h);
      ctx2d.globalAlpha = 1;
    }
    ctx2d.fillStyle = `rgba(0,0,0,${0.12 + alpha * (config.darken ?? 0.36)})`;
    ctx2d.fillRect(0, 0, w, h);
    ctx2d.globalCompositeOperation = 'screen';
    ctx2d.globalAlpha = Math.min(1, (0.46 + alpha * 0.5) * (config.opacity ?? 1));
    ctx2d.drawImage(ascii.canvas, 0, 0, w, h);
    ctx2d.globalCompositeOperation = 'multiply';
    ctx2d.globalAlpha = Math.min(0.5, alpha * (config.scanline ?? 0.28));
    ctx2d.fillStyle = '#000';
    const scanStep = Math.max(8, Math.round(cellH * 0.86));
    for (let y = 0; y < h; y += scanStep) ctx2d.fillRect(0, y, w, 1);
    ctx2d.restore();
  }, []);

  // Mac-specific CRT response: heavy phosphor bloom + brief ghost echo
  // instead of TV-style sync tear / channel static. Reads as a hot CRT
  // pulse on bass and a hard white-out flash on claps.
  const drawMacBloom = React.useCallback((media, strength, kind) => {
    const state = stateRef.current;
    const { ctx2d, screenCanvas, screenTex } = state;
    if (!ctx2d || !screenCanvas || !media) return;
    const w = screenCanvas.width, h = screenCanvas.height;
    // Base frame via the normal pipeline (warm wash, vignette, screen mode).
    drawSourceToCanvas(media);
    const s = Math.max(0, Math.min(1.4, strength));
    if (s <= 0.01) return;
    // Bass: a fast-sweeping under-exposed (dim) band plus a small image
    // shake. The roll phase is advanced by bass events, so the bar reads as
    // locked to the bassline rather than as a free-running CRT artifact.
    if (kind === 'bass') {
      const rollPhase = state.macBloom?.rollPhase ?? 0;
      const bandH = Math.max(54, Math.floor(h * 0.15));
      const span = h + bandH * 2;
      const yCenter = (((rollPhase % span) + span) % span) - bandH;
      const yTop = yCenter - bandH / 2;
      const yBottom = yCenter + bandH / 2;
      const elapsed = Math.max(0, performance.now() - (state.macBloom?.started || performance.now()));
      const duration = Math.max(1, state.macBloom?.duration || 180);
      const hitT = Math.min(1, elapsed / duration);
      const shakeCurve = Math.pow(1 - hitT, 2.2);
      const seed = state.macBloom?.shakeSeed || 1;
      const hitStrength = Math.max(0.82, Math.min(2.35, state.macBloom?.hitStrength || s));
      const horizontalShake = (0.034 + hitStrength * 0.036) * 1.1;
      const verticalShake = 0.0016 + hitStrength * 0.001;
      const slipSign = Math.sin(seed * 9.173) >= 0 ? 1 : -1;
      const trackingSlip = slipSign * w * (0.012 + hitStrength * 0.018) * s * Math.pow(1 - hitT, 3.2);
      const shakeX = Math.round((
        Math.sin(seed * 0.71 + elapsed * 0.095) * 0.72 +
        Math.sin(seed * 1.37 + elapsed * 0.173) * 0.28
      ) * w * horizontalShake * s * shakeCurve + trackingSlip);
      const shakeY = Math.round(Math.sin(seed * 0.53 + elapsed * 0.12) * h * verticalShake * s * shakeCurve);
      if (shakeX || shakeY) {
        if (!state.rollBuffer) state.rollBuffer = document.createElement('canvas');
        if (state.rollBuffer.width !== w || state.rollBuffer.height !== h) {
          state.rollBuffer.width = w;
          state.rollBuffer.height = h;
        }
        const rctx = state.rollBuffer.getContext('2d');
        rctx.clearRect(0, 0, w, h);
        rctx.drawImage(screenCanvas, 0, 0, w, h);
        ctx2d.save();
        ctx2d.clearRect(0, 0, w, h);
        ctx2d.fillStyle = '#050505';
        ctx2d.fillRect(0, 0, w, h);
        ctx2d.drawImage(state.rollBuffer, shakeX, shakeY, w, h);
        ctx2d.save();
        ctx2d.beginPath();
        ctx2d.rect(0, 0, w, h);
        ctx2d.clip();
        for (let i = 0; i < 3; i++) {
          const bandSeed = seed * (i + 3.7);
          const bandY = Math.round((((Math.sin(bandSeed) * 0.5 + 0.5) * h) + elapsed * (0.24 + i * 0.05)) % h);
          const tearH = Math.max(6, Math.round(h * (0.018 + i * 0.006) * s));
          const tearX = Math.round(slipSign * (w * (0.018 + i * 0.014) * s * Math.pow(1 - hitT, 2.8)));
          if (tearX) ctx2d.drawImage(state.rollBuffer, 0, bandY, w, tearH, tearX, bandY, w, tearH);
        }
        ctx2d.restore();
        ctx2d.restore();
      }
      if (yBottom > 0 && yTop < h) {
        ctx2d.save();
        const grad = ctx2d.createLinearGradient(0, yTop, 0, yBottom);
        ctx2d.globalCompositeOperation = 'multiply';
        // Peak alpha pushed harder so the dim band lands prominently
        // on the bass attack, then drops off with the strength curve.
        const peak = Math.min(0.96, 0.62 + s * 0.36);
        grad.addColorStop(0,   `rgba(0, 0, 0, 0)`);
        grad.addColorStop(0.5, `rgba(0, 0, 0, ${peak})`);
        grad.addColorStop(1,   `rgba(0, 0, 0, 0)`);
        ctx2d.fillStyle = grad;
        ctx2d.fillRect(0, yTop, w, bandH);
        ctx2d.globalCompositeOperation = 'source-over';
        ctx2d.fillStyle = `rgba(255,255,255,${0.06 * s})`;
        ctx2d.fillRect(0, Math.round(yCenter - 1), w, 1);
        ctx2d.restore();
      }
      drawMacAsciiBassOverlay(s, hitT);
    }
    // Clap or power-on: vertical roll drift — full image scrolls vertically
    // with wrap-around plus a dark sync bar at the seam.
    if (kind === 'clap' || kind === 'powerOn') {
      const rollPhase = state.macBloom?.rollPhase ?? 0;
      const yOff = Math.floor(((rollPhase % h) + h) % h);
      if (yOff > 0) {
        if (!state.rollBuffer) state.rollBuffer = document.createElement('canvas');
        if (state.rollBuffer.width !== w || state.rollBuffer.height !== h) {
          state.rollBuffer.width = w;
          state.rollBuffer.height = h;
        }
        const rctx = state.rollBuffer.getContext('2d');
        rctx.clearRect(0, 0, w, h);
        rctx.drawImage(screenCanvas, 0, 0, w, h);
        ctx2d.clearRect(0, 0, w, h);
        ctx2d.drawImage(state.rollBuffer, 0, h - yOff, w, yOff, 0, 0, w, yOff);
        ctx2d.drawImage(state.rollBuffer, 0, 0, w, h - yOff, 0, yOff, w, h - yOff);
        const barH = Math.max(8, Math.floor(18 * s));
        ctx2d.save();
        ctx2d.fillStyle = `rgba(0, 0, 0, ${Math.min(0.92, 0.6 + s * 0.35)})`;
        ctx2d.fillRect(0, yOff - Math.floor(barH * 0.4), w, barH);
        ctx2d.restore();
      }
    }
    if (screenTex) {
      screenTex.needsUpdate = true;
      stateRef.current.requestRender?.();
    }
  }, [drawSourceToCanvas, drawMacAsciiBassOverlay]);

  // Mouse button press (Mesh284) — quick down/up.
  const animateMouseButton = React.useCallback(() => {
    const state = stateRef.current;
    const b = state.mouseButton;
    if (!b) return;
    cancelAnimationFrame(b.raf);
    const start = performance.now();
    const downMs = 70;
    const upMs = 160;
    const tick = () => {
      const t = performance.now() - start;
      if (t < downMs) {
        const u = t / downMs;
        b.mesh.position.y = b.homeY - b.depth * (1 - Math.pow(1 - u, 2));
      } else if (t < downMs + upMs) {
        const u = (t - downMs) / upMs;
        b.mesh.position.y = b.homeY - b.depth * (1 - u) * (1 - u);
      } else {
        b.mesh.position.y = b.homeY;
        b.raf = 0;
        stateRef.current.requestRender?.();
        return;
      }
      stateRef.current.requestRender?.();
      b.raf = requestAnimationFrame(tick);
    };
    tick();
  }, []);

  const animateStickyNoteHover = React.useCallback(() => {
    const state = stateRef.current;
    if (state.stickyNoteHoverRaf) return;
    const settle = 0.0008;
    const tick = () => {
      state.stickyNoteHoverRaf = 0;
      let active = false;
      for (const note of state.stickyNotes || []) {
        const home = note?.userData?.hoverHome;
        const offset = note?.userData?.hoverOffset;
        if (!note || !home || !offset) continue;
        const hovered = Boolean(note.userData.hovered);
        const targetX = home.x + (hovered ? offset.x : 0);
        const targetY = home.y + (hovered ? offset.y : 0);
        const targetZ = home.z + (hovered ? offset.z : 0);
        const targetRotationX = home.rotationX + (hovered ? (offset.rotationX || 0) : 0);
        const targetRotationY = home.rotationY + (hovered ? (offset.rotationY || 0) : 0);
        const targetRotationZ = home.rotationZ + (hovered ? offset.rotationZ : 0);
        const targetScale = hovered ? offset.scale : home.scale;
        const targetEmissive = hovered ? offset.emissiveIntensity : home.emissiveIntensity;
        const ease = hovered ? (offset.easeIn ?? 0.22) : (offset.easeOut ?? 0.16);
        note.position.x += (targetX - note.position.x) * ease;
        note.position.y += (targetY - note.position.y) * ease;
        note.position.z += (targetZ - note.position.z) * ease;
        note.rotation.x += (targetRotationX - note.rotation.x) * ease;
        note.rotation.y += (targetRotationY - note.rotation.y) * ease;
        note.rotation.z += (targetRotationZ - note.rotation.z) * ease;
        note.scale.x += (targetScale - note.scale.x) * ease;
        note.scale.y += (targetScale - note.scale.y) * ease;
        note.scale.z += (targetScale - note.scale.z) * ease;
        if (note.material && Number.isFinite(note.material.emissiveIntensity)) {
          note.material.emissiveIntensity += (targetEmissive - note.material.emissiveIntensity) * ease;
        }
        const remaining = Math.abs(targetX - note.position.x)
          + Math.abs(targetY - note.position.y)
          + Math.abs(targetZ - note.position.z)
          + Math.abs(targetRotationX - note.rotation.x)
          + Math.abs(targetRotationY - note.rotation.y)
          + Math.abs(targetRotationZ - note.rotation.z)
          + Math.abs(targetScale - note.scale.x)
          + Math.abs(targetScale - note.scale.y);
        if (remaining > settle) {
          active = true;
        } else {
          note.position.set(targetX, targetY, targetZ);
          note.rotation.x = targetRotationX;
          note.rotation.y = targetRotationY;
          note.rotation.z = targetRotationZ;
          note.scale.setScalar(targetScale);
          if (note.material && Number.isFinite(note.material.emissiveIntensity)) {
            note.material.emissiveIntensity = targetEmissive;
          }
        }
      }
      state.requestRender?.();
      if (active) state.stickyNoteHoverRaf = requestAnimationFrame(tick);
    };
    state.stickyNoteHoverRaf = requestAnimationFrame(tick);
  }, []);

  const setHoveredStickyNote = React.useCallback((nextNote) => {
    const state = stateRef.current;
    const normalizedNote = nextNote || null;
    if (state.hoveredStickyNote === normalizedNote) return;
    state.hoveredStickyNote = normalizedNote;
    for (const note of state.stickyNotes || []) {
      if (note?.userData) note.userData.hovered = note === normalizedNote;
    }
    animateStickyNoteHover();
  }, [animateStickyNoteHover]);

  // Floppy slide in/out. Returns a promise that resolves when the slide
  // completes so callers can sequence (e.g., wait for insert before audio).
  const animateFloppy = React.useCallback((inserted) => {
    // Fullscreen is disabled by MAC_REEL_FULLSCREEN_ENABLED; keep the calls in
    // place so the binding can be restored without touching every trigger path.
    if (inserted) reelEnterFullscreen();
    else reelExitFullscreen();
    const state = stateRef.current;
    const f = state.floppy;
    if (!f) return Promise.resolve();
    cancelAnimationFrame(f.raf);
    const start = performance.now();
    const duration = 520;
    const snapshot = f.parts.map((p) => ({
      part: p,
      fromZ: p.mesh.position.z,
      toZ: inserted ? p.insertedZ : p.ejectedZ,
    }));
    return new Promise((resolve) => {
      const tick = () => {
        const t = Math.min(1, (performance.now() - start) / duration);
        const eased = t < 0.5
          ? 2 * t * t
          : 1 - Math.pow(-2 * t + 2, 2) / 2;
        for (const s of snapshot) {
          s.part.mesh.position.z = s.fromZ + (s.toZ - s.fromZ) * eased;
        }
        stateRef.current.requestRender?.();
        if (t < 1) {
          f.raf = requestAnimationFrame(tick);
        } else {
          for (const s of snapshot) s.part.mesh.position.z = s.toZ;
          f.inserted = inserted;
          f.raf = 0;
          stateRef.current.requestRender?.();
          resolve();
        }
      };
      tick();
    });
  }, []);

  const setFloppyInsertedInstant = React.useCallback((inserted, render = true) => {
    // Mirror the eject → exit-fullscreen binding for the instant (non-animated) path.
    if (!inserted) reelExitFullscreen();
    const state = stateRef.current;
    const f = state.floppy;
    if (!f) return false;
    cancelAnimationFrame(f.raf);
    for (const part of f.parts) {
      part.mesh.position.z = inserted ? part.insertedZ : part.ejectedZ;
    }
    f.inserted = inserted;
    f.raf = 0;
    if (render) state.requestRender?.();
    return true;
  }, []);

  const syncMacFloppyToAudio = React.useCallback((animateWhenVisible = true) => {
    const state = stateRef.current;
    if (state.deviceMode !== 'mac' || state.powerToggleInFlight) return;
    const f = state.floppy;
    if (!f) return;
    const shouldInsert = !!window.__resumeStrudelAudioEngine?.enabled;
    if (f.inserted === shouldInsert) return;
    const visible = state.tabVisible !== false && state.tvVisible !== false;
    if (animateWhenVisible && visible) animateFloppy(shouldInsert);
    else setFloppyInsertedInstant(shouldInsert, visible);
  }, [animateFloppy, setFloppyInsertedInstant]);

  const setKeyPressOffset = (keyState, offset) => {
    const parts = keyState.parts?.length
      ? keyState.parts
      : [{ mesh: keyState.mesh, homeY: keyState.homeY }];
    for (const part of parts) {
      if (part?.mesh) part.mesh.position.y = part.homeY + offset;
    }
  };

  // Press a Mac keyboard key (by label: 'space' | 'W' | 'A' | 'S' | 'D')
  // briefly. Each key has its own raf so multiple keys can animate at once.
	  const animateKeyPress = React.useCallback((label) => {
	    const state = stateRef.current;
	    const k = state.keys?.[label];
	    if (!k) return;
    const downMs = 45;
    const upMs = 130;
    const start = performance.now();
    cancelAnimationFrame(k.raf);
    const tick = () => {
      const now = performance.now();
      const t = now - start;
      if (t < downMs) {
        const u = t / downMs;
        setKeyPressOffset(k, -k.depth * (1 - Math.pow(1 - u, 2)));
      } else if (t < downMs + upMs) {
        const u = (t - downMs) / upMs;
        setKeyPressOffset(k, -k.depth * (1 - u) * (1 - u));
      } else {
        setKeyPressOffset(k, 0);
        k.raf = 0;
        stateRef.current.requestRender?.();
        return;
      }
      stateRef.current.requestRender?.();
      k.raf = requestAnimationFrame(tick);
    };
	    tick();
	  }, []);

	  const animateKeyMeshPress = React.useCallback((mesh) => {
	    if (!mesh?.geometry) return;
	    const state = stateRef.current;
	    if (!state.genericKeyPresses) state.genericKeyPresses = new Map();
	    let k = state.genericKeyPresses.get(mesh.uuid);
	    if (!k) {
	      mesh.geometry.computeBoundingBox();
	      const mb = mesh.geometry.boundingBox;
	      k = {
	        mesh,
	        homeY: mesh.position.y,
	        depth: Math.max(0.002, (mb.max.y - mb.min.y) * 1.15),
	        raf: 0,
	      };
	      state.genericKeyPresses.set(mesh.uuid, k);
	    }
	    const downMs = 45;
	    const upMs = 130;
	    const start = performance.now();
	    cancelAnimationFrame(k.raf);
	    const tick = () => {
	      const t = performance.now() - start;
	      if (t < downMs) {
	        const u = t / downMs;
	        k.mesh.position.y = k.homeY - k.depth * (1 - Math.pow(1 - u, 2));
	      } else if (t < downMs + upMs) {
	        const u = (t - downMs) / upMs;
	        k.mesh.position.y = k.homeY - k.depth * (1 - u) * (1 - u);
	      } else {
	        k.mesh.position.y = k.homeY;
	        k.raf = 0;
	        stateRef.current.requestRender?.();
	        return;
	      }
	      stateRef.current.requestRender?.();
	      k.raf = requestAnimationFrame(tick);
	    };
	    tick();
	  }, []);

	  const animateMacBloomBurst = React.useCallback((kind = 'bass', options = {}) => {
	    const state = stateRef.current;
	    cancelAnimationFrame(state.macBloomRaf);
	    const asciiBurst = kind === 'bass' && options.ascii !== false;
	    const asciiAccent = asciiBurst
	      ? MAC_ASCII_BASS_KEY_SEQUENCE[(state.bassKeyIndex || 0) % MAC_ASCII_BASS_KEY_SEQUENCE.length]
	      : null;
	    if (asciiAccent) {
	      state.bassKeyIndex = ((state.bassKeyIndex || 0) + 1) % MAC_ASCII_BASS_KEY_SEQUENCE.length;
	      animateKeyPress(asciiAccent.label);
	    }
	    const bassHitStrength = Math.max(0.82, Math.min(2.35, Number(options.strength) || 1));
	    const bassDuration = Math.max(130, Math.min(260, (options.duration || 180) * 0.82));
	    const duration = kind === 'clap' ? 180 : kind === 'powerOn' ? 220 : bassDuration;
	    const screenH = state.screenCanvas?.height || 1536;
	    const bassSpan = screenH * 1.32;
	    const bassCurrent = Number.isFinite(state.bassRollPhase) ? state.bassRollPhase : -screenH * 0.18;
	    const bassStep = screenH * (0.24 + Math.min(0.12, duration / 1200));
	    const bassStart = bassCurrent;
	    const bassEnd = bassCurrent + bassStep;
	    state.bassRollPhase = ((bassEnd % bassSpan) + bassSpan) % bassSpan - screenH * 0.18;
	    const clapRollDir = state.lastClapRollDir === 1 ? -1 : 1;
	    state.lastClapRollDir = clapRollDir;
    const clapStart = 0;
    const clapEnd   = screenH * 1.1 * clapRollDir;
    // Power-on / power-off roll: a single fast sweep through one screen
    // height — the signal locks/unlocks in one quick roll.
    const powerOnStart = 0;
    const powerOnEnd   = screenH * 1.05;
    let start, end;
    if (kind === 'clap') { start = clapStart; end = clapEnd; }
    else if (kind === 'powerOn') { start = powerOnStart; end = powerOnEnd; }
    else { start = bassStart; end = bassEnd; }
    state.macBloom = {
      activeUntil: performance.now() + duration,
	      strength: kind === 'clap' ? 1.35 : kind === 'powerOn' ? 1.0 : Math.min(1.75, bassHitStrength),
      kind,
	      duration,
	      started: performance.now(),
	      bandStart: start,
	      bandEnd: end,
	      bandPolarity: 'dim',
	      rollPhase: start,
	      hitStrength: bassHitStrength,
	      bassLevel: options.bassLevel,
	      ascii: asciiBurst,
	      asciiAccent,
	      shakeSeed: options.id || Math.floor(performance.now()),
	    };
    if (state.currentVideo && state.currentMedia === state.currentVideo) {
      return new Promise((resolve) => window.setTimeout(resolve, duration));
    }
    return new Promise((resolve) => {
      const tick = () => {
        const now = performance.now();
        const media = state.currentMedia || state.currentImage;
        if (!media || now >= state.macBloom.activeUntil) {
          state.macBloomRaf = 0;
          if (media) drawSourceToCanvas(media);
          resolve();
          return;
        }
        const elapsed = now - state.macBloom.started;
        const t01 = Math.min(1, elapsed / state.macBloom.duration);
        const eased = 1 - Math.pow(1 - t01, 2.4);
        state.macBloom.rollPhase = state.macBloom.bandStart + (state.macBloom.bandEnd - state.macBloom.bandStart) * eased;
        const remaining = Math.max(0, (state.macBloom.activeUntil - now) / state.macBloom.duration);
        const curve = kind === 'clap' ? Math.pow(remaining, 1.6)
                    : kind === 'powerOn' ? Math.pow(remaining, 0.9)
                    : Math.pow(remaining, 2.0);
        drawMacBloom(media, state.macBloom.strength * curve, kind);
        state.macBloomRaf = requestAnimationFrame(tick);
      };
      tick();
    });
  }, [animateKeyPress, drawMacBloom, drawSourceToCanvas]);

  const applyMacAsciiControlConfig = React.useCallback((input = {}) => {
    const state = stateRef.current;
    const next = normalizeMacAsciiConfig(input, state.asciiConfig || MAC_ASCII_BASS_CONFIG_DEFAULTS);
    const previous = state.asciiConfig || {};
    const changed = JSON.stringify(next) !== JSON.stringify(previous);
    state.asciiConfig = next;
    if (changed && state.asciiBurst) {
      state.asciiBurst.ready = false;
      state.asciiBurst.key = '';
    }
    return next;
  }, []);

  React.useEffect(() => {
    if (stateRef.current.deviceMode !== 'mac' || !isMacAsciiControlHost()) return undefined;
    let disposed = false;
    let timer = 0;
    let lastRevision = '';
    let channel = null;

    const applyPayload = (payload = {}) => {
      const config = payload.config || payload;
      if (!config || typeof config !== 'object') return;
      const revision = String(payload.revision ?? JSON.stringify(config));
      if (revision === lastRevision) return;
      lastRevision = revision;
      applyMacAsciiControlConfig(config);
    };

    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/mac-ascii-config', { cache: 'no-store' });
        if (!response.ok) return;
        applyPayload(await response.json());
      } catch (_) {}
    };

    const pulse = (detail = {}) => {
      const state = stateRef.current;
      if (state.tabVisible === false || state.tvVisible === false || helpOwnsTvStage()) return;
      const media = state.currentMedia || state.currentImage;
      if (!media) return;
      animateMacBloomBurst('bass', {
        id: detail.id || Math.floor(performance.now()),
        duration: detail.duration || 190,
        strength: detail.strength || 1.28,
      });
    };

    if ('BroadcastChannel' in window) {
      try {
        channel = new BroadcastChannel('resume-mac-ascii-control-v1');
        channel.onmessage = (event) => {
          const message = event.data || {};
          if (message.type === 'config') applyPayload(message.payload || message);
          if (message.type === 'pulse') pulse(message);
        };
      } catch (_) {
        channel = null;
      }
    }

    window.__resumeMacAsciiEffect = {
      get: () => ({ ...(stateRef.current.asciiConfig || MAC_ASCII_BASS_CONFIG_DEFAULTS) }),
      set: (config) => applyMacAsciiControlConfig(config),
      reset: () => applyMacAsciiControlConfig(MAC_ASCII_BASS_CONFIG_DEFAULTS),
      pulse,
    };

    fetchConfig();
    timer = window.setInterval(() => {
      if (!disposed) fetchConfig();
    }, 500);

    return () => {
      disposed = true;
      window.clearInterval(timer);
      try { channel?.close?.(); } catch (_) {}
      if (window.__resumeMacAsciiEffect?.get) {
        try { delete window.__resumeMacAsciiEffect; } catch (_) { window.__resumeMacAsciiEffect = null; }
      }
    };
  }, [animateMacBloomBurst, applyMacAsciiControlConfig, helpOwnsTvStage]);

  const runMacTerminalCommand = React.useCallback(async (rawCommand) => {
    const cmd = String(rawCommand || '').trim();
    const lower = cmd.toLowerCase();
    const state = stateRef.current;
    const engine = window.__resumeStrudelAudioEngine;
    pushMacTerminalLine(`tawfeeq$ ${cmd}`);
    if (!lower) {
      drawMacOffScreen();
      return;
    }
    if (lower === 'help' || lower === '?') {
      pushMacTerminalLine('commands');
      MAC_TERMINAL_COMMAND_LINES.forEach(pushMacTerminalLine);
      drawMacOffScreen();
      return;
    }
    if (lower === 'clear' || lower === 'cls') {
      const term = ensureMacTerminal();
      term.lines = [...MAC_TERMINAL_BOOT_LINES];
      drawMacOffScreen();
      return;
    }
    if (lower === 'about') {
      pushMacTerminalLine('Poetry in Proof: browser-native');
      pushMacTerminalLine('live audio + MIDI + picture');
      pushMacTerminalLine('one clock drives sound and image.');
      drawMacOffScreen();
      return;
    }
    if (lower === 'status') {
      pushMacTerminalLine(`audio: ${engine?.enabled ? 'online' : 'offline'}`);
      pushMacTerminalLine(`song: ${engine?.session?.name || 'halftime trap'}`);
      pushMacTerminalLine('source guard: last-good fallback armed');
      drawMacOffScreen();
      return;
    }
    if (lower === 'reset') {
      if (engine?.resetCompositionSource) {
        engine.resetCompositionSource({ resetTransport: false });
        pushMacTerminalLine('last-good source restored.');
      } else {
        pushMacTerminalLine('audio engine not ready.');
      }
      drawMacOffScreen();
      return;
    }
    if (DOOM_TERMINAL_COMMANDS.has(lower)) {
      if (state.powerToggleInFlight) return;
      state.powerToggleInFlight = true;
      pushMacTerminalLine('loading doom.exe...');
      pushMacTerminalLine('halting site audio...');
      drawMacOffScreen();
      try {
        if (engine?.enabled) await engine.setEnabled(false);
        await animateFloppy(true);
        await animateMacBloomBurst('powerOn');
        pushMacTerminalLine('doom handoff armed.');
        drawMacOffScreen();
        window.dispatchEvent(new CustomEvent('resume-launch-doom'));
      } catch (error) {
        pushMacTerminalLine(`doom failed: ${error?.message || String(error)}`);
        drawMacOffScreen();
      } finally {
        stateRef.current.powerToggleInFlight = false;
      }
      return;
    }
    if (['play', 'run', 'start', './poetry', './proof'].includes(lower)) {
      if (state.powerToggleInFlight) return;
      state.powerToggleInFlight = true;
      pushMacTerminalLine('inserting disk...');
      drawMacOffScreen();
      try {
        await animateFloppy(true);
        cutRef.current?.('init');
        await animateMacBloomBurst('powerOn');
        const nextEngine = window.__resumeStrudelAudioEngine;
        const result = await nextEngine?.setEnabled(true);
        if (result === false) {
          pushMacTerminalLine('audio failed; use reset then play.');
          drawMacOffScreen();
        }
      } catch (error) {
        pushMacTerminalLine(`error: ${error?.message || String(error)}`);
        drawMacOffScreen();
      } finally {
        stateRef.current.powerToggleInFlight = false;
      }
      return;
    }
    pushMacTerminalLine(`${cmd}: command not found`);
    pushMacTerminalLine('Type HELP for commands.');
    drawMacOffScreen();
  }, [animateFloppy, animateMacBloomBurst, drawMacOffScreen, ensureMacTerminal, pushMacTerminalLine]);

  const applyMacTerminalKey = React.useCallback((code, options = {}) => {
    const { shiftKey = false, charOverride = '' } = options;
    const term = ensureMacTerminal();
    const def = MAC_KEY_DEFS[code];
    if (!def) return false;
    if (def.action === 'enter') {
      playMacKeyClick(code);
      const cmd = term.input;
      term.input = '';
      runMacTerminalCommand(cmd);
      return true;
    }
    if (def.action === 'backspace') {
      playMacKeyClick(code);
      term.input = term.input.slice(0, -1);
      term.cursorOn = true;
      drawMacOffScreen();
      return true;
    }
    if (def.action === 'modifier') {
      return false;
    }
    const nextChar = charOverride.length === 1
      ? charOverride
      : getMacTerminalCharacter(code, shiftKey);
    if (!nextChar) return false;
    playMacKeyClick(code);
    term.input = (term.input + nextChar).slice(-160);
    term.cursorOn = true;
    drawMacOffScreen();
    return true;
  }, [drawMacOffScreen, ensureMacTerminal, playMacKeyClick, runMacTerminalCommand]);

  // Canvas text only adopts a webfont once it's actually loaded, so the terminal
  // would draw with a fallback on first paint. Redraw the Mac screen after the
  // period faces (Silkscreen / VT323) are ready.
  React.useEffect(() => {
    if (!document.fonts?.load) return undefined;
    let cancelled = false;
    Promise.all([
      document.fonts.load('16px "VT323"'),
    ]).catch(() => {}).then(() => {
      if (cancelled) return;
      if (stateRef.current.deviceMode === 'mac' && !stateRef.current.pageMode) drawMacOffScreen();
    });
    return () => { cancelled = true; };
  }, [drawMacOffScreen]);

  const drawChannelStatic = React.useCallback((seed = 1, strength = 1) => {
    const state = stateRef.current;
    const { ctx2d, screenCanvas, screenTex } = state;
    if (!ctx2d || !screenCanvas) return;
    const w = screenCanvas.width, h = screenCanvas.height;
    const sw = 256, sh = 192;
    if (!state.staticCanvas) {
      state.staticCanvas = document.createElement('canvas');
      state.staticCanvas.width = sw;
      state.staticCanvas.height = sh;
      state.staticCtx = state.staticCanvas.getContext('2d');
    }
    const rand = (i) => {
      const x = Math.sin(seed * 23.437 + i * 91.733) * 19753.913;
      return x - Math.floor(x);
    };
    const image = state.staticCtx.createImageData(sw, sh);
    const data = image.data;
    const s = Math.max(0, Math.min(1, strength));
    for (let i = 0; i < sw * sh; i++) {
      const v = rand(i);
      const grain = v < 0.48 ? 0 : v < 0.78 ? 85 : v < 0.94 ? 180 : 255;
      const idx = i * 4;
      data[idx] = data[idx + 1] = data[idx + 2] = grain;
      data[idx + 3] = Math.floor(235 * s);
    }
    state.staticCtx.putImageData(image, 0, 0);

    ctx2d.save();
    ctx2d.fillStyle = '#030303';
    ctx2d.fillRect(0, 0, w, h);
    ctx2d.imageSmoothingEnabled = false;
    ctx2d.globalAlpha = 0.92;
    const rect = state.currentActiveRect || state.currentContentRect || { x: 0, y: 0, w, h };
    const rx = Math.max(0, rect.x);
    const ry = Math.max(0, rect.y);
    const rw = Math.min(w - rx, rect.w);
    const rh = Math.min(h - ry, rect.h);
    ctx2d.beginPath();
    ctx2d.rect(rx, ry, rw, rh);
    ctx2d.clip();
    const jumpX = Math.floor((rand(400) - 0.5) * rw * 0.18 * s);
    const jumpY = Math.floor((rand(401) - 0.5) * rh * 0.05 * s);
    ctx2d.drawImage(state.staticCanvas, rx + jumpX, ry + jumpY, rw, rh);
    ctx2d.globalAlpha = 1;

    ctx2d.globalCompositeOperation = 'screen';
    for (let i = 0; i < 16; i++) {
      const y = ry + Math.floor(rand(500 + i) * rh);
      const hh = Math.max(3, Math.floor((5 + rand(540 + i) * 28) * s));
      ctx2d.fillStyle = `rgba(255,255,255,${(0.10 + rand(580 + i) * 0.28) * s})`;
      ctx2d.fillRect(rx, y, rw, hh);
    }
    ctx2d.globalCompositeOperation = 'multiply';
    for (let y = ry; y < ry + rh; y += 5) {
      ctx2d.fillStyle = `rgba(0,0,0,${0.38 * s})`;
      ctx2d.fillRect(rx, y, rw, 2);
    }
    ctx2d.restore();

    // Keep the matte bars stable, but let them catch a faint raster
    // flicker so the cut still reads as a TV signal instead of a flat
    // graphic overlay.
    ctx2d.save();
    ctx2d.globalCompositeOperation = 'screen';
    ctx2d.fillStyle = `rgba(255,255,255,${0.028 * s})`;
    for (let y = 0; y < h; y += 7) ctx2d.fillRect(0, y, w, 1);
    ctx2d.globalCompositeOperation = 'multiply';
    ctx2d.fillStyle = `rgba(0,0,0,${0.10 * s})`;
    ctx2d.fillRect(0, 0, w, Math.max(0, ry));
    ctx2d.fillRect(0, ry + rh, w, Math.max(0, h - (ry + rh)));
    ctx2d.restore();
    if (screenTex) {
      screenTex.needsUpdate = true;
      stateRef.current.requestRender?.();
    }
  }, []);

  const drawVideoLoop = React.useCallback((video) => {
    const state = stateRef.current;
    cancelAnimationFrame(state.videoRaf);
    if (state.videoFrameRequest && state.currentVideo?.cancelVideoFrameCallback) {
      try { state.currentVideo.cancelVideoFrameCallback(state.videoFrameRequest); } catch {}
    }
    state.videoFrameRequest = 0;
    state.currentVideo = video;
    state.lastVideoFrameTime = -1;

    const paintVideo = () => {
      if (state.currentVideo !== video) return;
      if (!state.channelFlipping && video.readyState >= 2) {
        const now = performance.now();
        const macBurstActive = state.deviceMode === 'mac' && state.macBloom && now < state.macBloom.activeUntil;
        const trackingActive = now < state.tracking.activeUntil;
        // Mac mode: if a bloom/roll burst is active, route through drawMacBloom
        // so the vertical roll + ghost + bloom layer onto the live video frame.
        if (macBurstActive) {
          const m = state.macBloom;
          const remaining = Math.max(0, (m.activeUntil - now) / Math.max(1, m.duration));
          const curve = m.kind === 'clap'
            ? Math.pow(remaining, 1.6)
            : m.kind === 'powerOn'
              ? Math.pow(remaining, 0.9)
              : Math.pow(remaining, 2.0);
          const elapsed = now - (m.started || (m.activeUntil - m.duration));
          const t01 = Math.min(1, elapsed / Math.max(1, m.duration));
          const eased = 1 - Math.pow(1 - t01, 2.4);
          if (m.bandStart !== undefined) {
            m.rollPhase = m.bandStart + (m.bandEnd - m.bandStart) * eased;
          }
          drawMacBloom(video, m.strength * curve, m.kind);
        } else {
          const tracking = state.tracking;
          let effect = null;
          if (trackingActive) {
            const remaining = Math.max(0, (tracking.activeUntil - now) / 260);
            effect = {
              strength: Math.min(1, tracking.strength * remaining),
              seed: tracking.seed + Math.floor(now / 22),
            };
          }
          drawSourceToCanvas(video, effect);
        }
      }
    };

    const scheduleVideo = () => {
      if (state.currentVideo !== video) return;
      if (typeof video.requestVideoFrameCallback === 'function') {
        state.videoFrameRequest = video.requestVideoFrameCallback(() => {
          state.videoFrameRequest = 0;
          paintVideo();
          scheduleVideo();
        });
        return;
      }
      state.videoRaf = requestAnimationFrame(() => {
        if (state.currentVideo !== video) return;
        const now = performance.now();
        const macBurstActive = state.deviceMode === 'mac' && state.macBloom && now < state.macBloom.activeUntil;
        const trackingActive = now < state.tracking.activeUntil;
        const frameIndex = Math.floor((video.currentTime || 0) * 24);
        if (macBurstActive || trackingActive || frameIndex !== state.lastVideoFrameTime) {
          state.lastVideoFrameTime = frameIndex;
          paintVideo();
        }
        scheduleVideo();
      });
    };

    paintVideo();
    scheduleVideo();
  }, [drawSourceToCanvas, drawMacBloom]);

  const stopVideoLoop = React.useCallback(() => {
    const state = stateRef.current;
    cancelAnimationFrame(state.videoRaf);
    state.videoRaf = 0;
    if (state.videoFrameRequest && state.currentVideo?.cancelVideoFrameCallback) {
      try { state.currentVideo.cancelVideoFrameCallback(state.videoFrameRequest); } catch {}
    }
    state.videoFrameRequest = 0;
    if (state.currentVideo) {
      try { state.currentVideo.pause(); } catch {}
    }
    state.currentVideo = null;
  }, []);

  const triggerEditPunch = React.useCallback((scale = 1.035, duration = 160) => {
    const state = stateRef.current;
    window.clearTimeout(state.liveEditTimer);
    state.liveEdit = {
      punchUntil: performance.now() + duration,
      punchScale: scale,
    };
    const media = state.currentMedia || state.currentImage;
    if (media && !state.currentVideo) drawSourceToCanvas(media);
    state.liveEditTimer = window.setTimeout(() => {
      state.liveEdit = { punchUntil: 0, punchScale: 1 };
      const current = state.currentMedia || state.currentImage;
      if (current && !state.currentVideo) drawSourceToCanvas(current);
    }, duration + 24);
  }, [drawSourceToCanvas]);

  // Realtime edit FX must never pause, seek, or throttle the active clip.
  // They redraw the current video frame through canvas overlays while the
  // underlying HTMLVideoElement keeps playing.
  const applyHatTrackingPulse = React.useCallback((detail = {}) => {
    const state = stateRef.current;
    if (state.tabVisible === false || state.tvVisible === false || helpOwnsTvStage()) return;
    if (state.channelFlipping || !state.currentVideo || state.currentVideo.paused) return;
    const now = performance.now();
    if (now - state.lastHatTrackingPulseAt < 1450) return;
    if ((detail.id || 0) % 4 !== 1) return;
    state.lastHatTrackingPulseAt = now;
    const pulseMs = Math.max(38, Math.min(58, (detail.duration || 90) * 0.45));
    if (state.deviceMode === 'mac') {
      animateMacBloomBurst('bass', {
        id: detail.id,
        duration: pulseMs,
        strength: 0.42,
        ascii: false,
      });
      return;
    }
    state.tracking = {
      activeUntil: now + pulseMs,
      seed: (detail.id || 1) * 191,
      strength: 0.34,
    };
    if (!state.currentVideo) animateTrackingBurst();
  }, [animateMacBloomBurst, animateTrackingBurst, helpOwnsTvStage]);

  React.useEffect(() => {
    const state = stateRef.current;
    const cancelVideoCallbacks = () => {
      cancelAnimationFrame(state.videoRaf);
      state.videoRaf = 0;
      if (state.videoFrameRequest && state.currentVideo?.cancelVideoFrameCallback) {
        try { state.currentVideo.cancelVideoFrameCallback(state.videoFrameRequest); } catch {}
      }
      state.videoFrameRequest = 0;
    };
    const pauseTvWork = () => {
      state.cutToken = (state.cutToken || 0) + 1;
      cancelAnimationFrame(state.raf);
      state.raf = 0;
      cancelVideoCallbacks();
      cancelAnimationFrame(state.trackingRaf);
      cancelAnimationFrame(state.channelRaf);
      cancelAnimationFrame(state.macBloomRaf);
      state.trackingRaf = 0;
      state.channelRaf = 0;
      state.macBloomRaf = 0;
      state.channelFlipping = false;
      window.clearTimeout(state.channelCutTimer);
      stopVocalSamples(12);
      if (state.currentVideo) {
        state.powerPausedVideo = state.currentVideo;
        try { state.currentVideo.pause(); } catch {}
        state.currentVideo = null;
      }
      pauseAllCachedVideos();
    };
    const resumeTvWork = () => {
      state.requestRender?.();
      const video = state.powerPausedVideo;
      if (engineEnabled && video && state.currentMedia === video) {
        state.powerPausedVideo = null;
        try {
          const playPromise = video.play?.();
          if (playPromise?.catch) playPromise.catch(() => {});
        } catch {}
        drawVideoLoop(video);
      } else if (engineEnabled && !state.currentMedia) {
        cutRef.current?.('init');
      }
    };
    const syncPowerState = () => {
      const active = state.tabVisible !== false && state.tvVisible !== false && !helpOwnsTvStage();
      if (active) resumeTvWork();
      else pauseTvWork();
    };
    const onPageActivity = () => {
      state.tabVisible = isResumePageActive();
      syncPowerState();
    };
    const onHelpAudioState = (event) => {
      if (event.detail?.id !== 'help-player') return;
      state.helpPlayerActive = Boolean(event.detail?.active);
      syncPowerState();
    };
    const onHelpPinChange = (event) => {
      state.helpPinned = Boolean(event.detail?.pinned);
      syncPowerState();
    };
    const onHelpImmersiveState = (event) => {
      state.helpImmersive = Boolean(event.detail?.active);
      syncPowerState();
    };
    document.addEventListener('visibilitychange', onPageActivity);
    window.addEventListener('resume-page-activity-change', onPageActivity);
    window.addEventListener('resume-video-audio-state', onHelpAudioState);
    window.addEventListener('resume-help-pin-change', onHelpPinChange);
    window.addEventListener('resume-help-immersive-state', onHelpImmersiveState);
    let observer = null;
    if (typeof IntersectionObserver !== 'undefined' && wrapRef.current) {
      observer = new IntersectionObserver((entries) => {
        state.tvVisible = entries.some((entry) => entry.isIntersecting);
        syncPowerState();
      }, { rootMargin: '640px 0px' });
      observer.observe(wrapRef.current);
    }
    state.helpPinned = Boolean(document.querySelector('#help.is-help-pinned'));
    state.helpImmersive = Boolean(
      document.querySelector('.help-player.is-pseudo-fullscreen') ||
      getVideoFullscreenSlot(document.fullscreenElement)?.classList?.contains('help-player')
    );
    onPageActivity();
    return () => {
      document.removeEventListener('visibilitychange', onPageActivity);
      window.removeEventListener('resume-page-activity-change', onPageActivity);
      window.removeEventListener('resume-video-audio-state', onHelpAudioState);
      window.removeEventListener('resume-help-pin-change', onHelpPinChange);
      window.removeEventListener('resume-help-immersive-state', onHelpImmersiveState);
      observer?.disconnect();
    };
  }, [drawVideoLoop, engineEnabled, helpOwnsTvStage, pauseAllCachedVideos, stopVocalSamples]);

  const animateChannelFlip = React.useCallback((detail = {}) => {
    const state = stateRef.current;
    cancelAnimationFrame(state.channelRaf);
    window.clearTimeout(state.channelCutTimer);
    const seed = (detail.id || 1) * 311;
    const started = performance.now();
    const duration = 180;
    let didCut = false;
    state.channelFlipping = true;

    const tickChannel = () => {
      const now = performance.now();
      const t = Math.min(1, (now - started) / duration);
      if (!didCut && t >= 0.46) {
        didCut = true;
        cutRef.current?.('snare');
      }
      const media = state.currentMedia || state.currentImage;
      const peak = 1 - Math.abs(t - 0.48) / 0.48;
      const strength = 0.42 + Math.max(0, peak) * 0.93;
      if (media) {
        drawSourceToCanvas(media, {
          strength,
          seed: seed + Math.floor(t * 15),
        });
      } else {
        drawChannelStatic(seed + Math.floor(t * 9), 0.38 + strength * 0.24);
      }
      if (t < 1) {
        state.channelRaf = requestAnimationFrame(tickChannel);
      } else {
        state.channelRaf = 0;
        state.channelFlipping = false;
        if (state.currentVideo) {
          drawVideoLoop(state.currentVideo);
        } else if (state.currentMedia || state.currentImage) {
          drawSourceToCanvas(state.currentMedia || state.currentImage);
        }
      }
    };
    tickChannel();
  }, [drawChannelStatic, drawSourceToCanvas, drawVideoLoop]);

  const cutRef = React.useRef(null);
  const cut = React.useCallback((lane, options = {}) => {
    const state = stateRef.current;
    if (!availableSources.length || helpOwnsTvStage() || state.tabVisible === false || state.tvVisible === false) return;
    const idx = pickIndex(lane, options);
    currentIdxRef.current = idx;
    const source = availableSources[idx];
    const src = source.url;
    const now = performance.now();
    state.currentLane = lane || source.lanes?.[0] || 'idle';
    state.currentCutMode = options.mode || 'normal';
    state.lastCutAt = now;
    if (lane === 'snare') state.lastRhythmCutAt = now;
    const cutToken = (state.cutToken || 0) + 1;
    state.cutToken = cutToken;
    const canCommitCut = () => {
      const s = stateRef.current;
      return (
        s.cutToken === cutToken &&
        s.tabVisible !== false &&
        s.tvVisible !== false &&
        !helpOwnsTvStage()
      );
    };
    if (source.kind === 'video') {
      const cache = stateRef.current.videoCache;
      let video = cache.get(src);
      if (!video) {
        video = document.createElement('video');
        video.crossOrigin = 'anonymous';
        video.muted = true;
        video.defaultMuted = true;
        video.playsInline = true;
        video.loop = false;
        video.preload = 'metadata';
        video.src = src;
        cache.set(src, video);
        trimVideoCache(src);
      } else {
        cache.delete(src);
        cache.set(src, video);
      }
      const mountVideo = () => {
        if (!canCommitCut()) {
          if (stateRef.current.currentVideo !== video) {
            try { video.pause(); } catch {}
          }
          return;
        }
        video.loop = false;
        video.muted = true;
        video.defaultMuted = true;
        video.volume = 0;
        video.onended = () => {
          const state = stateRef.current;
          if (state.cutToken !== cutToken) return;
          if (state.currentVideo !== video || state.currentMedia !== video) return;
          if (state.tabVisible === false || state.tvVisible === false) return;
          if (!window.__resumeStrudelAudioEngine?.enabled) return;
          cutRef.current?.(state.currentLane || lane || 'idle', {
            mode: state.currentCutMode === 'sparse' ? 'sparse' : 'normal',
          });
        };
        try { video.currentTime = source.start ?? 0; } catch {}
        if (!canCommitCut()) {
          try { video.pause(); } catch {}
          return;
        }
        const playPromise = video.play?.();
        if (playPromise?.catch) {
          playPromise.catch(() => {});
        }
        let committed = false;
        let fallbackTimer = 0;
        const cleanupReadyListeners = () => {
          video.removeEventListener('loadeddata', onReady);
          video.removeEventListener('canplay', onReady);
          video.removeEventListener('playing', onReady);
          video.removeEventListener('seeked', onReady);
          window.clearTimeout(fallbackTimer);
        };
        const commitVideo = () => {
          if (committed) return;
          if (!canCommitCut()) {
            cleanupReadyListeners();
            if (stateRef.current.currentVideo !== video) {
              try { video.pause(); } catch {}
            }
            return;
          }
          committed = true;
          cleanupReadyListeners();
          const previousVideo = stateRef.current.currentVideo;
          stateRef.current.currentImage = null;
          stateRef.current.currentMedia = video;
          stateRef.current.currentSource = source;
          stateRef.current.currentFit = source.fit || 'contain';
          stateRef.current.currentMatteAspect = source.matteAspect || null;
          stateRef.current.currentPunchIn = source.punchIn || 1;
          drawVideoLoop(video);
          if (previousVideo && previousVideo !== video) {
            previousVideo.muted = true;
            try { previousVideo.pause(); } catch {}
          }
          window.dispatchEvent(new CustomEvent('resume-tv-clip-cue', {
            detail: {
              lane,
              url: src,
              project: source.project || '',
              cue: source.cue || '',
              sampleKey: source.sampleKey || '',
              pool: source.pool || '',
              hasAudio: false,
              muted: video.muted,
              volume: video.volume,
              index: idx,
            },
          }));
          emitSourceChange(source, {
            lane,
            mode: stateRef.current.currentCutMode,
            url: src,
            index: idx,
          });
        };
        const onReady = () => {
          if (committed) return;
          if (!canCommitCut()) {
            cleanupReadyListeners();
            if (stateRef.current.currentVideo !== video) {
              try { video.pause(); } catch {}
            }
            return;
          }
          if (video.readyState < 2) return;
          if (typeof video.requestVideoFrameCallback === 'function') {
            let frameCommitted = false;
            const frameFallback = window.setTimeout(() => {
              if (!frameCommitted) commitVideo();
            }, 140);
            video.requestVideoFrameCallback(() => {
              frameCommitted = true;
              window.clearTimeout(frameFallback);
              commitVideo();
            });
            return;
          }
          commitVideo();
        };
        video.addEventListener('loadeddata', onReady);
        video.addEventListener('canplay', onReady);
        video.addEventListener('playing', onReady);
        video.addEventListener('seeked', onReady);
        fallbackTimer = window.setTimeout(onReady, stateRef.current.currentVideo ? 700 : 180);
        onReady();
      };
      if (video.readyState >= 2) {
        mountVideo();
      } else {
        video.addEventListener('loadeddata', mountVideo, { once: true });
        video.load?.();
      }
      return;
    }

    stopVideoLoop();
    const cache = stateRef.current.imageCache;
    let img = cache.get(src);
    if (!img) {
      img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = src;
      cache.set(src, img);
    }
    if (img.complete && img.naturalWidth > 0) {
      if (!canCommitCut()) return;
      stateRef.current.currentImage = img;
      stateRef.current.currentMedia = img;
      stateRef.current.currentSource = source;
      stateRef.current.currentFit = source.fit || 'cover';
      stateRef.current.currentMatteAspect = source.matteAspect || null;
      stateRef.current.currentPunchIn = source.punchIn || 1;
      drawSourceToCanvas(img);
      emitSourceChange(source, {
        lane,
        mode: stateRef.current.currentCutMode,
        url: src,
        index: idx,
      });
    } else {
      img.onload = () => {
        if (!canCommitCut()) return;
        stateRef.current.currentImage = img;
        stateRef.current.currentMedia = img;
        stateRef.current.currentSource = source;
        stateRef.current.currentFit = source.fit || 'cover';
        stateRef.current.currentMatteAspect = source.matteAspect || null;
        stateRef.current.currentPunchIn = source.punchIn || 1;
        drawSourceToCanvas(img);
        emitSourceChange(source, {
          lane,
          mode: stateRef.current.currentCutMode,
          url: src,
          index: idx,
        });
      };
    }
  }, [availableSources, pickIndex, drawSourceToCanvas, drawVideoLoop, emitSourceChange, helpOwnsTvStage, stopVideoLoop, trimVideoCache]);
  React.useEffect(() => { cutRef.current = cut; }, [cut]);

  // Init Three.js scene (lazy-loaded)
  React.useEffect(() => {
    let cancelled = false;
    let onResize;
    (async () => {
      const threeLoader = window.__loadThreeBundle || (() => window.__threePromise);
      const { THREE, GLTFLoader } = await threeLoader();
      if (cancelled) return;
      const wrap = wrapRef.current;
      const canvas = canvasRef.current;
      if (!wrap || !canvas) return;

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      // Keep the Mac shell and terminal crisp. The expensive part was the
      // dynamic screen texture mipmap rebuild, not this on-demand render DPR.
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
      // Use the canvas's CSS dimensions (which include the negative-top
      // overflow). Renderer setSize is called inside the tick loop too,
      // so the seed value here doesn't matter much.
      renderer.setSize(canvas.clientWidth || 800, canvas.clientHeight || 400, false);
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = MAC_MODEL_GRAYSCALE_PREVIEW ? 0.54 : 0.50;

      const scene = new THREE.Scene();
      scene.background = null;

      const HERO_FOV = 34;
      const camera = new THREE.PerspectiveCamera(HERO_FOV, (canvas.clientWidth || 800) / (canvas.clientHeight || 800), 0.01, 100);
      camera.position.set(0.45, 0.52, 2.5);
      camera.lookAt(0, 0.42, -0.13);
      const frameModel = (box) => {
        // The dolly narrows the FOV for the docked (near-orthographic) view, so
        // restore the hero lens before reframing or the rest framing drifts.
        camera.fov = HERO_FOV;
        const sphere = box.getBoundingSphere(new THREE.Sphere());
        const isMobileFrame = window.matchMedia('(max-width: 760px)').matches;
        const isLandingFrame = document.documentElement?.dataset?.resumeVariant === 'landing-v1';
        const target = sphere.center.clone();
        target.y += sphere.radius * (isMobileFrame ? 0.06 : 0.02);
        if (isMobileFrame) target.x -= sphere.radius * 0.46;
        else if (isLandingFrame) target.x -= sphere.radius * 0.12;
        const verticalFov = THREE.MathUtils.degToRad(camera.fov);
        const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * camera.aspect);
        const fitHeightDistance = sphere.radius / Math.sin(verticalFov / 2);
        const fitWidthDistance = sphere.radius / Math.sin(horizontalFov / 2);
        // Pull the camera closer so the Mac fills more of the canvas. The
        // landing factor (0.562) renders the whole model (Mac + keyboard +
        // mouse) ~15% larger than the base landing fit (0.646 / 1.15).
        const distance = Math.max(fitHeightDistance, fitWidthDistance) * (isMobileFrame ? 1.18 : isLandingFrame ? 0.562 : 0.89);
        const viewDirection = new THREE.Vector3(
          isMobileFrame ? 0.08 : isLandingFrame ? 0 : 0.32,
          isMobileFrame ? 0.12 : isLandingFrame ? 0.095 : 0.14,
          1,
        ).normalize();
        camera.position.copy(target).add(viewDirection.multiplyScalar(distance));
        camera.near = Math.max(0.01, distance - sphere.radius * 3.0);
        camera.far = distance + sphere.radius * 4.0;
        camera.lookAt(target);
        camera.updateProjectionMatrix();
        // Cache the hero framing so the scroll dolly can lerp from it.
        stateRef.current.heroCam = { pos: camera.position.clone(), target: target.clone() };
        const zp = stateRef.current.zoomProgress || 0;
        if (zp > 0) stateRef.current.applyZoom?.(zp);
      };
      // Scroll-driven dolly: lerp the camera from the hero framing onto the CRT
      // glass until the screen fills the viewport (CRT_FILL < 1 keeps the case
      // sides in frame). Renders on demand.
      // Fraction of the viewport HEIGHT the screen fills at full dock. < 1 leaves
      // an equal sliver of case above and below the centered screen.
      // Fraction of the viewport WIDTH the monitor case fills at full dock.
      // 1.0 = the case's side edges sit exactly on the viewport's side edges.
      const CRT_FILL = 1.0;
      // Dock perfectly head-on so the case is square-on and centered (no
      // keystoning, equal margins).
      const CRT_DIR = new THREE.Vector3(0, 0, 1).normalize();
      // Telephoto lens through the dolly, then a true orthographic projection at
      // the dock so the docked view is perfectly orthogonal (zero perspective).
      const CRT_FOV = 12;
      const _zv = new THREE.Vector3();
      // Half the world width to frame to the viewport: the monitor case width, so
      // its side edges meet the viewport sides. Centered on the screen (vertically
      // too) so the page stays centred.
      const frameHalfWidth = () => {
        const box = stateRef.current.caseBox || stateRef.current.screenBox;
        return (box.getSize(_zv).x * 0.5) / CRT_FILL;
      };
      // The locked camera pose. Horizontally centered on the CASE (so its side
      // edges are equidistant from the viewport sides — no left/right gap), but
      // vertically centered on the SCREEN so the page stays in view. Distance set
      // so the case width fills the viewport width at the current lens.
      const computeScreenPose = () => {
        const sBox = stateRef.current.screenBox;
        const cBox = stateRef.current.caseBox || sBox;
        if (!sBox) return null;
        const sCtr = sBox.getCenter(new THREE.Vector3());
        const cCtr = cBox.getCenter(new THREE.Vector3());
        const target = new THREE.Vector3(cCtr.x, sCtr.y, sCtr.z);
        const vFov = THREE.MathUtils.degToRad(camera.fov);
        const dist = frameHalfWidth() / (Math.tan(vFov / 2) * Math.max(0.0001, camera.aspect));
        const pos = target.clone().add(CRT_DIR.clone().multiplyScalar(dist));
        return { pos, target };
      };
      const _perspM = new THREE.Matrix4();
      const _orthoM = new THREE.Matrix4();
      const applyZoom = (p) => {
        const hero = stateRef.current.heroCam;
        const sBox = stateRef.current.screenBox;
        if (!hero || !sBox) return;
        // Narrow the lens as we dock (perspective → near-orthographic). Set the
        // FOV first so computeScreenPose fits the screen at the docked lens.
        camera.fov = HERO_FOV + (CRT_FOV - HERO_FOV) * p;
        camera.updateProjectionMatrix();
        const pose = computeScreenPose();
        if (!pose) return;
        camera.position.lerpVectors(hero.pos, pose.pos, p);
        const tgt = hero.target.clone().lerp(pose.target, p);
        // The long lens pushes the camera far back; widen near/far so the Mac
        // stays inside the frustum instead of getting clipped.
        const dist = camera.position.distanceTo(tgt);
        camera.near = Math.max(0.01, dist * 0.2);
        camera.far = dist * 2.4 + 5;
        camera.lookAt(tgt);
        camera.updateProjectionMatrix();
        // Dramatize the case lighting as we dock: keep the upper-left key, but
        // cut the right-side fill toward zero and drop the even hemisphere fill,
        // so the case has a strong left-bright / right-dark falloff against the
        // black room instead of reading flat / bright on the right.
        const dl = THREE.MathUtils.smoothstep(p, 0.35, 1.0);
        const kl = stateRef.current.keyLight;
        if (kl) kl.intensity = (kl.userData.baseIntensity || 0) * (1 + dl * 0.2);
        const fl = stateRef.current.fillLight;
        if (fl) fl.intensity = (fl.userData.baseIntensity || 0) * (1 - dl * 0.95);
        const hemi = stateRef.current.hemiLight;
        if (hemi) hemi.intensity = (hemi.userData.baseIntensity || 0) * (1 - dl * 0.8);
        // Blend the projection to a TRUE orthographic one as we dock, framed to
        // the same screen height — so the docked view is perfectly orthogonal.
        const ob = THREE.MathUtils.smoothstep(p, 0.55, 1.0);
        if (ob > 0) {
          const halfW = frameHalfWidth();
          const halfH = halfW / Math.max(0.0001, camera.aspect);
          _orthoM.makeOrthographic(-halfW, halfW, halfH, -halfH, camera.near, camera.far);
          _perspM.copy(camera.projectionMatrix);
          const e = camera.projectionMatrix.elements;
          const a = _perspM.elements;
          const o = _orthoM.elements;
          for (let i = 0; i < 16; i++) e[i] = a[i] * (1 - ob) + o[i] * ob;
          camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
        }
        stateRef.current.requestRender?.();
      };
      stateRef.current.applyZoom = applyZoom;
      window.__tvHeroZoom = (p) => {
        stateRef.current.zoomProgress = p;
        applyZoom(p);
      };
      // Project the screen-glass AABB to viewport pixels at the *locked* camera
      // pose (independent of the live dolly), so the DOM "screen viewport" can be
      // positioned to the real projected rect. Canvas is the full viewport in
      // CRT mode, so client px == viewport px. Returns null until the model loads.
      const _projCam = new THREE.PerspectiveCamera();
      const _projV = new THREE.Vector3();
      const projectScreenRect = (inset = 0) => {
        const sBox = stateRef.current.screenBox;
        const pose = computeScreenPose();
        if (!sBox || !pose) return null;
        const w = canvas.clientWidth || window.innerWidth;
        const h = canvas.clientHeight || window.innerHeight;
        _projCam.fov = camera.fov;
        _projCam.aspect = camera.aspect;
        _projCam.near = camera.near;
        _projCam.far = camera.far;
        _projCam.position.copy(pose.pos);
        _projCam.up.copy(camera.up);
        _projCam.lookAt(pose.target);
        _projCam.updateMatrixWorld(true);
        _projCam.updateProjectionMatrix();
        const mn = sBox.min, mx = sBox.max;
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (let i = 0; i < 8; i++) {
          _projV.set(i & 1 ? mx.x : mn.x, i & 2 ? mx.y : mn.y, i & 4 ? mx.z : mn.z);
          _projV.project(_projCam);
          const px = (_projV.x * 0.5 + 0.5) * w;
          const py = (-_projV.y * 0.5 + 0.5) * h;
          if (px < minX) minX = px;
          if (px > maxX) maxX = px;
          if (py < minY) minY = py;
          if (py > maxY) maxY = py;
        }
        const rw = maxX - minX, rh = maxY - minY;
        const ix = rw * inset, iy = rh * inset;
        return { x: minX + ix, y: minY + iy, w: rw - ix * 2, h: rh - iy * 2 };
      };
      stateRef.current.projectScreenRect = projectScreenRect;
      window.__tvHeroScreenRect = projectScreenRect;

      // ── CRT channels ──────────────────────────────────────────────────────
      // Once docked, the glass becomes a little Macintosh you tune like a TV: a
      // persistent menu bar lists the channels (Film Reel / Help / Blackbird /
      // Audio / Doom), scrolling flips between them with a static cut, and the
      // 🍎 is the boot/terminal. "About" links out to the read-only résumé. Page
      // channels are rasterized DOM; Film Reel is the live trailer pool; Doom is
      // a boot card.
      const PAGE_W = 960;
      const MENU_FRAC = 0.05;       // menu-bar height as a fraction of the screen
      let channels = [];            // [{id,label,type,sel,href}]
      let chRasters = [];           // raster | null per channel
      let activeCh = 0;
      let chWithin = 0;             // vertical pan within a (tall) page channel
      let chBusy = false;           // mid static-cut

      const drawMenuBar = (cx, W, H) => {
        const mh = Math.max(2, Math.round(H * MENU_FRAC));
        cx.imageSmoothingEnabled = true;
        cx.fillStyle = '#f6f5ef'; cx.fillRect(0, 0, W, mh);
        cx.fillStyle = '#111'; cx.fillRect(0, mh - 2, W, 2);
        const fs = Math.round(mh * 0.5);
        cx.font = `${fs}px "Chicago", Geneva, "Lucida Grande", Arial, sans-serif`;
        cx.textBaseline = 'middle';
        const cy = Math.round(mh * 0.5);
        const rects = [];
        let x = Math.round(W * 0.016);
        // 🍎 = the boot/terminal channel (0)
        if (activeCh === 0) { cx.fillStyle = '#111'; cx.fillRect(x - fs * 0.4, 3, fs * 1.5, mh - 7); cx.fillStyle = '#f6f5ef'; }
        else cx.fillStyle = '#111';
        cx.beginPath(); cx.arc(x + fs * 0.35, cy, fs * 0.42, 0, Math.PI * 2); cx.fill();
        rects.push({ ch: 0, x0: x - fs * 0.4, x1: x + fs * 1.1 });
        x += fs * 1.7;
        // Channels 1..N-2 flow from the left; the last channel (About) is pinned
        // to the right like a classic Mac menu.
        const lastIsRight = channels.length > 1;
        const leftEnd = lastIsRight ? channels.length - 1 : channels.length;
        for (let i = 1; i < leftEnd; i++) {
          const lbl = channels[i].label;
          const tw = cx.measureText(lbl).width;
          const padX = Math.round(fs * 0.45);
          if (i === activeCh) { cx.fillStyle = '#111'; cx.fillRect(x - padX, 3, tw + padX * 2, mh - 7); cx.fillStyle = '#f6f5ef'; }
          else cx.fillStyle = '#111';
          cx.fillText(lbl, x, cy);
          rects.push({ ch: i, x0: x - padX, x1: x + tw + padX });
          x += tw + Math.round(fs * 1.0);
        }
        if (lastIsRight) {
          const li = channels.length - 1;
          const lbl = channels[li].label;
          const aw = cx.measureText(lbl).width;
          const padX = Math.round(fs * 0.45);
          const ax = W - aw - Math.round(W * 0.022);
          if (li === activeCh) { cx.fillStyle = '#111'; cx.fillRect(ax - padX, 3, aw + padX * 2, mh - 7); cx.fillStyle = '#f6f5ef'; }
          else cx.fillStyle = '#111';
          cx.fillText(lbl, ax, cy);
          rects.push({ ch: li, x0: ax - padX, x1: ax + aw + padX });
        }
        cx.textBaseline = 'alphabetic';
        stateRef.current.menuRects = { mh, rects, W, H };
        return mh;
      };
      stateRef.current.drawMenuBar = drawMenuBar;

      const channelWithinRange = (i) => {
        const sc = stateRef.current.screenCanvas, r = chRasters[i];
        if (!sc || !r || channels[i]?.type !== 'page') return 0;
        const s = sc.width / r.cssWidth;                  // css → canvas
        const availCss = (sc.height - Math.round(sc.height * MENU_FRAC)) / s;
        return Math.max(0, r.cssHeight - availCss);
      };

      const drawPageChannel = (i) => {
        const st = stateRef.current, sc = st.screenCanvas, cx = st.ctx2d, tex = st.screenTex;
        if (!sc || !cx) return;
        const W = sc.width, H = sc.height, mh = Math.round(H * MENU_FRAC);
        cx.fillStyle = '#ffffff'; cx.fillRect(0, 0, W, H);
        const r = chRasters[i];
        if (r) {
          const s = W / r.cssWidth;                       // css → canvas
          const availH = H - mh;
          const pan = Math.min(channelWithinRange(i), Math.max(0, chWithin)) * s;
          cx.drawImage(r.canvas, 0, (pan / s) * r.scale, r.cssWidth * r.scale, (availH / s) * r.scale, 0, mh, W, availH);
        }
        drawMenuBar(cx, W, H);
        if (tex) tex.needsUpdate = true;
        st.requestRender?.();
      };

      const drawDoomChannel = () => {
        const st = stateRef.current, sc = st.screenCanvas, cx = st.ctx2d, tex = st.screenTex;
        if (!sc || !cx) return;
        const W = sc.width, H = sc.height;
        cx.fillStyle = '#080807'; cx.fillRect(0, 0, W, H);
        cx.textAlign = 'center';
        cx.fillStyle = '#b1140e';
        cx.font = `${Math.round(H * 0.17)}px "Anton", Impact, system-ui, sans-serif`;
        cx.fillText('DOOM', W / 2, H * 0.5);
        cx.fillStyle = '#9a8f86';
        cx.font = `${Math.round(H * 0.028)}px "VT323", Monaco, monospace`;
        cx.fillText('press  RETURN  to boot', W / 2, H * 0.64);
        cx.textAlign = 'left';
        drawMenuBar(cx, W, H);
        if (tex) tex.needsUpdate = true;
        st.requestRender?.();
      };

      const renderChannel = () => {
        const st = stateRef.current;
        const ch = channels[activeCh];
        if (!ch) return;
        if (ch.type === 'boot') {
          st.pageMode = true; st.channelChrome = false;
          st.forceTerminal = true; drawMacOffScreen(); st.forceTerminal = false;
          const sc = st.screenCanvas, cx = st.ctx2d;
          if (sc && cx) { drawMenuBar(cx, sc.width, sc.height); if (st.screenTex) st.screenTex.needsUpdate = true; }
        } else if (ch.type === 'video') {
          st.pageMode = false;        // let the trailer pool draw to the screen
          st.channelChrome = true;    // composite the menu bar after each video frame
        } else if (ch.type === 'doom') {
          st.pageMode = true; st.channelChrome = false; drawDoomChannel();
        } else {
          st.pageMode = true; st.channelChrome = false; drawPageChannel(activeCh);
        }
        st.requestRender?.();
      };
      stateRef.current.renderChannel = renderChannel;

      const tuneToChannel = (i, withStatic) => {
        i = Math.max(0, Math.min(channels.length - 1, i));
        const changed = i !== activeCh;
        activeCh = i;
        if (changed) chWithin = 0;
        if (!withStatic || !changed) { if (!chBusy) renderChannel(); return; }
        // brief CRT static burst, then cut to the new channel
        chBusy = true;
        const st = stateRef.current;
        st.pageMode = true; st.channelChrome = false;
        let n = 0;
        const step = () => {
          if (n < 4) { drawChannelStatic((n + 1) * 7.3, 1.15); n += 1; window.setTimeout(step, 36); }
          else { chBusy = false; renderChannel(); }
        };
        step();
      };

      window.__tvHeroPageMode = (on) => {
        const st = stateRef.current;
        if (on) {
          const sc = st.screenCanvas;
          if (sc && sc.width !== MAC_SCREEN_TERMINAL_SIZE.width) {
            sc.width = MAC_SCREEN_TERMINAL_SIZE.width;
            sc.height = MAC_SCREEN_TERMINAL_SIZE.height;
          }
          if (st.screenTex && st.three) {
            st.screenTex.minFilter = st.three.LinearFilter;
            st.screenTex.magFilter = st.three.LinearFilter;
            st.screenTex.generateMipmaps = false;
          }
          st.dockMode = true;
          renderChannel();
        } else {
          st.dockMode = false; st.pageMode = false; st.channelChrome = false;
        }
        st.requestRender?.();
      };
      window.__tvHeroProjectChannels = async (defs) => {
        if (!Array.isArray(defs) || !defs.length) return { ok: false };
        channels = defs;
        chRasters = new Array(defs.length).fill(null);
        const fontCss = await getInlinedFontCss();
        for (let i = 0; i < defs.length; i++) {
          if (defs[i].type !== 'page') continue;
          const el = document.querySelector(defs[i].sel);
          if (!el) continue;
          try {
            const raster = await rasterizePage(el, { width: PAGE_W, scale: 2, fontCss });
            let tainted = false;
            try { raster.canvas.getContext('2d').getImageData(0, 0, 1, 1); } catch { tainted = true; }
            if (!tainted) chRasters[i] = raster;
          } catch (e) { console.warn('[TvHero] channel raster failed', defs[i].id, e); }
        }
        if (stateRef.current.pageMode || activeCh === 0) renderChannel();
        return { ok: true, count: defs.length };
      };
      window.__tvHeroTune = (i, withStatic = true) => tuneToChannel(i, withStatic);
      window.__tvHeroChannelWithin = (px) => {
        chWithin = px || 0;
        if (channels[activeCh]?.type === 'page' && !chBusy) drawPageChannel(activeCh);
      };
      window.__tvHeroChannelInfo = () => ({
        active: activeCh,
        count: channels.length,
        within: channels.map((c, i) => channelWithinRange(i)),
      });

      // Strong, raking key from upper-left to sculpt the bezel + lid; low fill
      // and hemisphere so the shadow side stays deep — more form, less flat.
      const key = new THREE.DirectionalLight(MAC_MODEL_GRAYSCALE_PREVIEW ? 0xffffff : 0xfff7e8, MAC_MODEL_GRAYSCALE_PREVIEW ? 2.55 : 2.75);
      key.position.set(-2.7, 2.25, 0.85);
      scene.add(key);
      key.userData.baseIntensity = key.intensity;
      stateRef.current.keyLight = key;
      const fill = new THREE.DirectionalLight(MAC_MODEL_GRAYSCALE_PREVIEW ? 0xffffff : 0xe8eef7, MAC_MODEL_GRAYSCALE_PREVIEW ? 0.08 : 0.06);
      fill.position.set(2.0, 0.45, 1.45);
      scene.add(fill);
      // At rest the key light from the upper-left is dramatic, but once docked
      // head-on it leaves the case's right edge in shadow — it blends into the
      // dark background and reads as a gap. Ramp the right-side fill up as we dock
      // so both case edges are evenly lit and clearly framed.
      fill.userData.baseIntensity = fill.intensity;
      stateRef.current.fillLight = fill;
      const rim = new THREE.DirectionalLight(MAC_MODEL_GRAYSCALE_PREVIEW ? 0xffffff : 0xffe6bd, MAC_MODEL_GRAYSCALE_PREVIEW ? 1.35 : 1.55);
      rim.position.set(-0.65, 2.05, -1.8);
      scene.add(rim);
      const keyboardGrazing = new THREE.DirectionalLight(MAC_MODEL_GRAYSCALE_PREVIEW ? 0xffffff : 0xffd6a6, MAC_MODEL_GRAYSCALE_PREVIEW ? 0.24 : 0.30);
      keyboardGrazing.position.set(1.2, -0.65, 1.6);
      scene.add(keyboardGrazing);
      // Keep global fill low so the front face and keyboard hold shape.
      const hemi = new THREE.HemisphereLight(
        MAC_MODEL_GRAYSCALE_PREVIEW ? 0xffffff : 0xfff0d8,
        MAC_MODEL_GRAYSCALE_PREVIEW ? 0x101010 : 0x0c0a08,
        MAC_MODEL_GRAYSCALE_PREVIEW ? 0.07 : 0.06,
      );
      scene.add(hemi);
      hemi.userData.baseIntensity = hemi.intensity;
      stateRef.current.hemiLight = hemi;
      scene.add(new THREE.AmbientLight(0xffffff, 0.006));

      // Offscreen canvas for the screen content
      const screenCanvas = document.createElement('canvas');
      // Video uses the lighter media size. The inactive terminal can
      // temporarily switch to a larger static texture for cleaner UI lines.
      screenCanvas.width = MAC_SCREEN_MEDIA_SIZE.width;
      screenCanvas.height = MAC_SCREEN_MEDIA_SIZE.height;
      const ctx2d = screenCanvas.getContext('2d');
      ctx2d.fillStyle = '#f8f7ee';
      ctx2d.fillRect(0, 0, screenCanvas.width, screenCanvas.height);
      const screenTex = new THREE.CanvasTexture(screenCanvas);
      screenTex.colorSpace = THREE.SRGBColorSpace;
      screenTex.flipY = false;
      screenTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      screenTex.wrapS = THREE.ClampToEdgeWrapping;
      screenTex.wrapT = THREE.ClampToEdgeWrapping;
      // This texture changes on video frames, bass rolls, and terminal
      // redraws. Mipmap generation on each upload was a major GPU cost.
      screenTex.minFilter = THREE.LinearFilter;
      screenTex.magFilter = THREE.LinearFilter;
      screenTex.generateMipmaps = false;

      stateRef.current.three = THREE;
      stateRef.current.renderer = renderer;
      stateRef.current.scene = scene;
      stateRef.current.camera = camera;
      stateRef.current.screenTex = screenTex;
      stateRef.current.screenCanvas = screenCanvas;
      stateRef.current.ctx2d = ctx2d;

      // Load model
      const loader = new GLTFLoader();
      console.info('[TvHero] loading', TV_MODEL_URL);
      loader.load(TV_MODEL_URL, (gltf) => {
        if (cancelled) return;
        console.info('[TvHero] model loaded');
        const model = gltf.scene;
        scene.add(model);
        const allMeshes = [];
        model.traverse((c) => { if (c.isMesh) allMeshes.push(c); });
        console.info('[TvHero] meshes:', allMeshes.map(m => `${m.name} (${m.geometry.attributes.position.count}v)`));
        // The GLB ships redundant duplicate body shells: the same case surface
        // modelled twice with different triangulation (Mesh01 vs Mesh01_2 share
        // 1037 coincident front-face cells; Mesh79/80 likewise). Two coincident
        // surfaces z-fight as a shimmering broken patch across the front no
        // matter how they're coloured. Hide the duplicate twin so only one
        // surface renders. See scripts/blender/find_coincident_faces.py.
        const MAC_DUPLICATE_SHELLS = new Set(['Mesh01_2', 'Mesh79_2', 'Mesh79_3', 'Mesh80_2', 'Mesh80_3']);
        for (const m of allMeshes) {
          if (MAC_DUPLICATE_SHELLS.has(m.name)) m.visible = false;
        }
        // 'Screen' = Trinitron's separated curved glass mesh.
        // 'Mesh75' = Apple Macintosh classic screen.
        let screenMeshes = allMeshes.filter((m) => /^screen$/i.test(String(m.name || '')) || getMacMeshNumericId(m) === 75);
        if (!screenMeshes.length && allMeshes.length >= 2) {
          const sorted = allMeshes.slice().sort((a, b) => b.geometry.attributes.position.count - a.geometry.attributes.position.count);
          screenMeshes = sorted.slice(1);
        }
        // Project the HELP video straight onto the screen's own geometry —
        // no flat billboard. For the Mac that geometry is the domed CRT
        // glass (Mesh75, rebuilt as a high-res spherical dome with clean
        // (0,0)->(1,1) UVs in scripts/blender/dome_mac_screen.py); for the
        // Trinitron it's the separated 'Screen' glass. An unlit basic
        // material makes the canvas read as an emissive picture tube, and
        // the curved mesh sits in real 3D so the video follows the bulge.
        // CRT picture-tube shader: barrel-warp the UVs so the image bulges
        // like a tube (with black rounded-corner falloff), plus scanlines, an
        // edge vignette, and a hair of chromatic aberration. Injected into a
        // MeshBasicMaterial via onBeforeCompile so three's sRGB texture decode
        // and output color management stay intact; toneMapped:false keeps the
        // screen reading as an emissive phosphor.
        const screenMaterial = new THREE.MeshBasicMaterial({ map: screenTex, toneMapped: false });
        screenMaterial.onBeforeCompile = (shader) => {
          shader.uniforms.uCurve = { value: 0.11 };     // barrel amount
          shader.uniforms.uScan = { value: 0.09 };      // scanline depth
          shader.uniforms.uLines = { value: 220.0 };    // scanline count
          shader.uniforms.uVignette = { value: 0.20 };  // corner darkening
          shader.uniforms.uAber = { value: 0.0013 };    // chromatic aberration
          shader.uniforms.uFeather = { value: 0.075 };  // soft edge falloff width
          shader.uniforms.uProjectionScale = { value: 0.93 }; // 7% smaller picture frustum on the CRT
          shader.fragmentShader = shader.fragmentShader
            .replace('#include <common>', `#include <common>
              uniform float uCurve; uniform float uScan; uniform float uLines;
              uniform float uVignette; uniform float uAber; uniform float uFeather;
              uniform float uProjectionScale;
              vec2 crtCurve(vec2 uv) {
                vec2 c = uv * 2.0 - 1.0;
                c *= 1.0 + uCurve * dot(c, c);
                return c * 0.5 + 0.5;
              }`)
            .replace('#include <map_fragment>', `
              #ifdef USE_MAP
                vec2 cuv = crtCurve(vMapUv);
                // Make only the source image projected onto the CRT slightly
                // smaller, leaving the physical glass/camera framing unchanged.
                // This keeps content out of the most warped edge of the curved
                // mesh so the vignette can absorb that area.
                vec2 puv = (cuv - 0.5) / max(uProjectionScale, 0.001) + 0.5;
                vec4 sampledDiffuseColor = vec4(
                  texture2D(map, clamp(puv + vec2(uAber, 0.0), vec2(0.0), vec2(1.0))).r,
                  texture2D(map, clamp(puv, vec2(0.0), vec2(1.0))).g,
                  texture2D(map, clamp(puv - vec2(uAber, 0.0), vec2(0.0), vec2(1.0))).b,
                  1.0
                );
                float scan = mix(1.0 - uScan, 1.0, 0.5 + 0.5 * cos(cuv.y * uLines * 6.2831853));
                sampledDiffuseColor.rgb *= scan;
                vec2 vc = puv * 2.0 - 1.0;
                sampledDiffuseColor.rgb *= clamp(1.0 - uVignette * dot(vc, vc), 0.0, 1.0);
                // Feathered edge: smooth falloff into the bezel instead of a hard
                // clip — fades to black across uFeather on every side (and beyond).
                vec2 fade = smoothstep(vec2(0.0), vec2(uFeather), puv)
                          * smoothstep(vec2(0.0), vec2(uFeather), 1.0 - puv);
                sampledDiffuseColor.rgb *= fade.x * fade.y;
                diffuseColor *= sampledDiffuseColor;
              #endif
            `);
          screenMaterial.userData.crtShader = shader;
        };
        for (const m of screenMeshes) {
          m.material = screenMaterial;
          m.visible = true;
        }
        // World-space box of the CRT glass — used to dolly the camera onto the
        // screen for the "zoom into the CRT" scroll effect.
        {
          const sBox = new THREE.Box3();
          for (const m of screenMeshes) sBox.expandByObject(m);
          if (!sBox.isEmpty()) {
            stateRef.current.screenBox = sBox;
            // Monitor-case box (housing around the glass): every mesh that isn't
            // well in front of the screen plane — i.e. drop the keyboard & mouse,
            // which sit forward (toward the camera) of the tube. Used to dock
            // until the case edges meet the viewport sides.
            const sCtr = sBox.getCenter(new THREE.Vector3());
            const sSize = sBox.getSize(new THREE.Vector3());
            const caseBox = new THREE.Box3();
            const _tb = new THREE.Box3();
            const _tc = new THREE.Vector3();
            for (const m of allMeshes) {
              _tb.setFromObject(m);
              _tb.getCenter(_tc);
              // Keep the monitor tower (at/around the screen); drop the keyboard &
              // mouse, which sit well below it.
              if (_tc.y >= sCtr.y - sSize.y * 1.0 && Math.abs(_tc.x - sCtr.x) < sSize.x * 2.2) {
                caseBox.union(_tb);
              }
            }
            if (!caseBox.isEmpty()) stateRef.current.caseBox = caseBox;
            // Let the CRT scroll driver know the projected screen rect is now
            // computable so it can lay out the DOM "screen viewport".
            try { window.dispatchEvent(new Event('tvhero:screenbox')); } catch {}
          }
        }
        const resumeStickyNote = createMacStickyNote(THREE, stateRef.current.caseBox, stateRef.current.screenBox, {
          text: 'resume',
          href: 'resume-readonly.html',
          hitType: 'resume',
          placement: 'left',
          overwrittenInk: true,
          smiley: true,
        });
        const linkedinStickyNote = createMacStickyNote(THREE, stateRef.current.caseBox, stateRef.current.screenBox, {
          text: 'linkedin',
          href: 'https://www.linkedin.com/in/tawfeeq-martin-82991a14/',
          hitType: 'linkedin',
          placement: 'right',
          paperStops: ['#dff4ff', '#8bd8ff', '#50aee4'],
          ink: '#17314a',
          arrowInk: '#183a5a',
          border: 'rgba(24, 72, 114, 0.26)',
          shadow: 'rgba(22, 70, 108, 0.16)',
          emissive: 0x6ec9ff,
          emissiveIntensity: 0.13,
        });
        const stickyNotes = [resumeStickyNote, linkedinStickyNote].filter(Boolean);
        for (const stickyNote of stickyNotes) {
          scene.add(stickyNote);
        }
        stateRef.current.resumeStickyNote = resumeStickyNote;
        stateRef.current.linkedinStickyNote = linkedinStickyNote;
        stateRef.current.stickyNotes = stickyNotes;
        const isKeycapMesh = (mesh) => {
          if (mesh.name === '3DGeom_15') return true;
          const match = mesh.name.match(/^Mesh(\d+)$/);
          if (!match) return false;
          const id = Number(match[1]);
          return id >= 285 && id <= 341;
        };
        const keycapMeshes = allMeshes.filter(isKeycapMesh);
        const keycapBounds = keycapMeshes.reduce((acc, mesh) => ({
          minX: Math.min(acc.minX, mesh.position.x),
          maxX: Math.max(acc.maxX, mesh.position.x),
          minZ: Math.min(acc.minZ, mesh.position.z),
          maxZ: Math.max(acc.maxZ, mesh.position.z),
        }), { minX: Infinity, maxX: -Infinity, minZ: Infinity, maxZ: -Infinity });
        const normalizeKeycapAxis = (value, min, max) => (max > min ? (value - min) / (max - min) : 0.5);
        const keycapRand = (seed, salt = 0) => {
          const x = Math.sin(seed * 12.9898 + salt * 78.233) * 43758.5453;
          return x - Math.floor(x);
        };
        const keycapSeed = (mesh) => {
          if (mesh.name === '3DGeom_15') return 15;
          const match = mesh.name.match(/^Mesh(\d+)$/);
          return match ? Number(match[1]) : mesh.id;
        };
        const makeKeycapMaterial = (mesh) => {
          const seed = keycapSeed(mesh);
          const xBias = normalizeKeycapAxis(mesh.position.x, keycapBounds.minX, keycapBounds.maxX);
          const zBias = normalizeKeycapAxis(mesh.position.z, keycapBounds.minZ, keycapBounds.maxZ);
          const color = new THREE.Color(0xb8ae94);
          const darker = keycapRand(seed, 1) > 0.72 ? 0.06 + keycapRand(seed, 2) * 0.08 : keycapRand(seed, 3) * 0.025;
          const faded = keycapRand(seed, 4) > 0.5 ? 0.06 + keycapRand(seed, 5) * 0.13 : 0;
          const wornTop = keycapRand(seed, 9) > 0.74 ? 0.12 + keycapRand(seed, 10) * 0.12 : 0;
          const amber = keycapRand(seed, 6) > 0.46 ? 0.02 + keycapRand(seed, 7) * 0.045 : 0;
          const positionalShade = Math.max(0, (zBias - 0.45) * 0.045) + Math.max(0, (0.28 - xBias) * 0.035);
          color.lerp(new THREE.Color(0x8b7658), darker + positionalShade);
          color.lerp(new THREE.Color(0xc9c0aa), faded);
          color.lerp(new THREE.Color(0xd6ceb8), wornTop);
          color.lerp(new THREE.Color(0xb49363), amber);
          if (mesh.name === '3DGeom_15') {
            color.lerp(new THREE.Color(0x9c8564), 0.14);
          }
          return new THREE.MeshStandardMaterial({
            color,
            roughness: 0.78 + keycapRand(seed, 8) * 0.18,
            metalness: 0,
          });
        };
        for (const m of keycapMeshes) {
          m.material = makeKeycapMaterial(m);
        }
        const getMeshWorldMetrics = (mesh) => {
          mesh.updateWorldMatrix(true, false);
          const box = new THREE.Box3().setFromObject(mesh);
          return {
            mesh,
            box,
            center: box.getCenter(new THREE.Vector3()),
            size: box.getSize(new THREE.Vector3()),
          };
        };
        const keycapInfos = keycapMeshes.map(getMeshWorldMetrics);
        const keyFootprint = keycapInfos.reduce((acc, info) => ({
          minX: Math.min(acc.minX, info.box.min.x),
          maxX: Math.max(acc.maxX, info.box.max.x),
          minY: Math.min(acc.minY, info.box.min.y),
          maxY: Math.max(acc.maxY, info.box.max.y),
          minZ: Math.min(acc.minZ, info.box.min.z),
          maxZ: Math.max(acc.maxZ, info.box.max.z),
        }), { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity, minZ: Infinity, maxZ: -Infinity });
        const isKeyLegendMesh = (mesh) => {
          const match = mesh.name.match(/^Mesh(\d+)$/);
          if (!match) return false;
          const id = Number(match[1]);
          return id >= 134 && id <= 272;
        };
        const keyPartsByName = new Map(keycapMeshes.map((mesh) => ([
          mesh.name,
          [{ mesh, homeY: mesh.position.y }],
        ])));
        let groupedLegendCount = 0;
        for (const legend of allMeshes.filter(isKeyLegendMesh)) {
          const legendInfo = getMeshWorldMetrics(legend);
          const { center, size } = legendInfo;
          const inKeyboardFootprint = center.x >= keyFootprint.minX - 0.35
            && center.x <= keyFootprint.maxX + 0.35
            && center.z >= keyFootprint.minZ - 0.35
            && center.z <= keyFootprint.maxZ + 0.35
            && center.y >= keyFootprint.minY - 0.08
            && center.y <= keyFootprint.maxY + 0.85
            && size.x < 1.15
            && size.z < 0.8;
          if (!inKeyboardFootprint) continue;
          let best = null;
          for (const key of keycapInfos) {
            const dx = Math.abs(center.x - key.center.x);
            const dz = Math.abs(center.z - key.center.z);
            const xLimit = Math.max(0.18, key.size.x * 0.82);
            const zLimit = Math.max(0.16, key.size.z * 0.92);
            if (dx > xLimit || dz > zLimit) continue;
            const score = dx / xLimit + dz / zLimit;
            if (!best || score < best.score) best = { key, score };
          }
          const parts = best ? keyPartsByName.get(best.key.mesh.name) : null;
          if (!parts) continue;
          parts.push({ mesh: legend, homeY: legend.position.y });
          groupedLegendCount += 1;
        }
        // Capture the full keyboard. Mesh names are laid out in QWERTY
        // order in the GLB, so physical KeyboardEvent.code values and
        // onscreen clicks can drive the same key travel animation.
        stateRef.current.keys = {};
        for (const [code, def] of Object.entries(MAC_KEY_DEFS)) {
          const mesh = allMeshes.find((m) => m.name === def.mesh);
          if (!mesh) {
            console.warn('[TvHero] key mesh not found:', code, def.mesh);
            continue;
          }
          mesh.geometry.computeBoundingBox();
          const gb = mesh.geometry.boundingBox;
          const depthScale = code === 'Space' ? 0.38 : def.action === 'modifier' ? 0.78 : 0.95;
          stateRef.current.keys[code] = {
            mesh,
            parts: keyPartsByName.get(mesh.name) || [{ mesh, homeY: mesh.position.y }],
            homeY: mesh.position.y,
            depth: (gb.max.y - gb.min.y) * depthScale,
            raf: 0,
          };
        }
        for (const [alias, code] of Object.entries(MAC_KEY_ALIASES)) {
          if (stateRef.current.keys[code]) stateRef.current.keys[alias] = stateRef.current.keys[code];
        }
        console.info('[TvHero] keys ready:', Object.keys(stateRef.current.keys), 'legend parts:', groupedLegendCount);
        // Floppy disk = Mesh84 (front label sliver) + Mesh273 (disk body
        // inside the case). Both translate together so the whole disk
        // ejects/inserts as one unit.
        const FLOPPY_MESHES = ['Mesh84', 'Mesh273'];
        const floppyParts = FLOPPY_MESHES
          .map((n) => allMeshes.find((m) => m.name === n))
          .filter(Boolean);
        const mouseBody = allMeshes.find((m) => m.name === 'Mesh70');
        const mouseButton = allMeshes.find((m) => m.name === 'Mesh284');
        if (floppyParts.length) {
          // Use the front mesh (Mesh84) to size the eject distance.
          const front = floppyParts[0];
          front.material = new THREE.MeshStandardMaterial({
            color: 0xd9be2f,
            roughness: 0.86,
            metalness: 0,
          });
          front.geometry.computeBoundingBox();
          const fb = front.geometry.boundingBox;
          // Eject only ~75% of disk depth so a sliver stays in the slot.
          const ejectAmount = (fb.max.z - fb.min.z) * 0.75;
          stateRef.current.floppy = {
            parts: floppyParts.map((m) => ({
              mesh: m,
              insertedZ: m.position.z,
              ejectedZ: m.position.z + ejectAmount,
            })),
            ejectAmount,
            inserted: false,
            raf: 0,
          };
          // Start ejected — translate every part forward.
          for (const p of stateRef.current.floppy.parts) {
            p.mesh.position.z = p.ejectedZ;
          }
          if (window.__resumeStrudelAudioEngine?.enabled) {
            setFloppyInsertedInstant(true, false);
          }
        }
        if (mouseButton) {
          mouseButton.geometry.computeBoundingBox();
          const mb = mouseButton.geometry.boundingBox;
          stateRef.current.mouseButton = {
            mesh: mouseButton,
            homeY: mouseButton.position.y,
            depth: (mb.max.y - mb.min.y) * 0.9,
            raf: 0,
          };
        }
        const hitTargets = new Map();
        const addHitTarget = (mesh, type, label = '', href = '') => {
          if (!mesh) return;
          hitTargets.set(mesh.uuid, { type, label, href });
        };
        stickyNotes.forEach((stickyNote) => {
          addHitTarget(
            stickyNote,
            stickyNote.userData.hitType || 'link',
            stickyNote.userData.label || '',
            stickyNote.userData.href || '',
          );
        });
        [mouseBody, mouseButton].forEach((m) => addHitTarget(m, 'mouse'));
        screenMeshes.forEach((m) => addHitTarget(m, 'screen'));
        floppyParts.forEach((m) => addHitTarget(m, 'floppy'));
        keycapMeshes.forEach((m) => addHitTarget(m, 'key'));
        for (const code of Object.keys(MAC_KEY_DEFS)) {
          const key = stateRef.current.keys?.[code];
          if (key) {
            const parts = key.parts?.length ? key.parts : [{ mesh: key.mesh }];
            parts.forEach((part) => addHitTarget(part.mesh, 'key', code));
          }
        }
        const hitMeshPool = [...allMeshes, ...screenMeshes, ...stickyNotes].filter(Boolean);
        stateRef.current.macHitMeshes = Array.from(hitTargets.keys())
          .map((uuid) => hitMeshPool.find((m) => m.uuid === uuid))
          .filter(Boolean);
        stateRef.current.macHitTargets = hitTargets;
        stateRef.current.mouseHitMeshes = [mouseBody, mouseButton].filter(Boolean);
	        const box = new THREE.Box3().setFromObject(model);
	        const ctr = box.getCenter(new THREE.Vector3());
	        const size = box.getSize(new THREE.Vector3());
	        applyMacModelGrayscalePreview(THREE, model);
	        const tabletop = createMacHeroTabletop(THREE, box);
	        if (tabletop) {
	          scene.add(tabletop);
	          stateRef.current.tabletop = tabletop;
	        }
	        console.info('[TvHero] bbox center:', ctr, 'size:', size);
	        stateRef.current.bbox = { box, ctr };
        stateRef.current.frameModel = () => frameModel(box);
        stateRef.current.frameModel();
        // Initial state: Mac boots powered-off with the "click to start"
        // prompt. TV mode boots with a starter cut.
        if (stateRef.current.deviceMode === 'mac') {
          if (window.__resumeStrudelAudioEngine?.enabled && !helpOwnsTvStage()) {
            cutRef.current?.('init');
          } else {
            drawMacOffScreen();
          }
        } else {
          if (!helpOwnsTvStage()) cutRef.current?.('init');
        }
      }, (progress) => {
        if (progress.total) console.info(`[TvHero] loading ${(progress.loaded / progress.total * 100).toFixed(0)}%`);
      }, (err) => {
        console.warn('[TvHero] GLTF load failed', err);
      });

      // Render loop
      const tick = () => {
        if (cancelled) return;
        const wrap = wrapRef.current;
        if (wrap) {
          const w = canvas.clientWidth, h = canvas.clientHeight;
          if (canvas.width !== w * renderer.getPixelRatio() || canvas.height !== h * renderer.getPixelRatio()) {
            renderer.setSize(w, h, false);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            stateRef.current.frameModel?.();
          }
          // No idle camera motion — TV stays locked in place.
        }
        if (stateRef.current.tabVisible !== false && stateRef.current.tvVisible !== false) {
          renderer.render(scene, camera);
        }
        stateRef.current.raf = 0;
      };
      stateRef.current.requestRender = () => {
        if (cancelled || stateRef.current.raf) return;
        stateRef.current.raf = requestAnimationFrame(tick);
      };
      onResize = () => stateRef.current.requestRender?.();
      window.addEventListener('resize', onResize);
      stateRef.current.requestRender();
    })().catch((err) => console.warn('TvHero init failed', err));

    return () => {
      cancelled = true;
      const s = stateRef.current;
      cancelAnimationFrame(s.raf);
      cancelAnimationFrame(s.videoRaf);
      if (s.videoFrameRequest && s.currentVideo?.cancelVideoFrameCallback) {
        try { s.currentVideo.cancelVideoFrameCallback(s.videoFrameRequest); } catch {}
      }
      s.videoFrameRequest = 0;
      cancelAnimationFrame(s.trackingRaf);
      cancelAnimationFrame(s.channelRaf);
      cancelAnimationFrame(s.macBloomRaf);
      cancelAnimationFrame(s.stickyNoteHoverRaf);
      for (const k of Object.values(s.keys || {})) cancelAnimationFrame(k.raf);
      for (const k of (s.genericKeyPresses?.values?.() || [])) cancelAnimationFrame(k.raf);
      for (const video of s.videoCache.values()) {
        try { video.pause(); } catch {}
        try {
          video.removeAttribute('src');
          video.load?.();
        } catch {}
      }
      s.videoCache.clear();
      stopVocalSamples(1);
      s.vocalSampleCache.clear();
      window.clearTimeout(s.channelCutTimer);
      window.clearTimeout(s.liveEditTimer);
      if (onResize) window.removeEventListener('resize', onResize);
      s.requestRender = null;
      try { s.renderer?.dispose(); } catch {}
    };
    // Initialise the Three.js scene ONCE per mount. The audio-driven
    // behaviour (cuts, phase) is handled by separate effects that
    // operate via refs without re-creating the renderer.
  }, []);

  // Track audio engine state
  React.useEffect(() => {
    const sync = () => setEngineEnabled(!!window.__resumeStrudelAudioEngine?.enabled);
    sync();
    window.addEventListener('resume-audio-change', sync);
    return () => window.removeEventListener('resume-audio-change', sync);
  }, []);

  React.useEffect(() => {
    if (stateRef.current.deviceMode !== 'mac') return undefined;
    const sync = () => syncMacFloppyToAudio(true);
    sync();
    window.addEventListener('resume-audio-change', sync);
    return () => window.removeEventListener('resume-audio-change', sync);
  }, [syncMacFloppyToAudio]);

  React.useEffect(() => {
    if (!engineEnabled || !vocalSamples.length) {
      stopVocalSamples(10);
      return undefined;
    }
    vocalSamples.forEach((sample) => {
      loadVocalSampleBuffer(sample);
    });
    return undefined;
  }, [engineEnabled, loadVocalSampleBuffer, stopVocalSamples, vocalSamples]);

  // Inactive Mac screen terminal: when the music is off and the hero is in
  // view, normal keyboard input goes to the monochrome terminal on the CRT.
  React.useEffect(() => {
    if (stateRef.current.deviceMode !== 'mac') return undefined;
    const isEditableTarget = (target) => {
      const tag = target?.tagName?.toLowerCase?.();
      return tag === 'input' || tag === 'textarea' || target?.isContentEditable;
    };
    const heroVisible = () => {
      const el = wrapRef.current;
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight || 0;
      return rect.bottom > 0 && rect.top < vh;
    };
    const onKey = (event) => {
      if (stateRef.current.deviceMode !== 'mac') return;
      if (!heroVisible()) return;
      // On the HELP page the player owns WASD (and other keys). Bail so we
      // never intercept/stopPropagation those keys away from HELP.
      if (getActiveHelpPlayerForKeyboard()) return;
      if (isEditableTarget(event.target)) return;
      if (document.activeElement !== keyboardCaptureRef.current) return;
      const code = getMacKeyCodeFromEvent(event);
      if (code) animateKeyPress(code);
      if (window.__resumeStrudelAudioEngine?.enabled) {
        if (code) playMacKeyClick(code);
        return;
      }
      if (event.shiftKey && ['Digit1', 'Digit2', 'Digit3'].includes(event.code)) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const term = ensureMacTerminal();
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopImmediatePropagation();
        term.input = '';
        term.cursorOn = true;
        drawMacOffScreen();
        return;
      }
      if (code && applyMacTerminalKey(code, {
        shiftKey: event.shiftKey,
        charOverride: event.key && event.key.length === 1 ? event.key : '',
      })) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [animateKeyPress, applyMacTerminalKey, drawMacOffScreen, ensureMacTerminal, playMacKeyClick]);

  // Auto-capture: on the Mac hero the CRT terminal should take keyboard input
  // immediately — no click on the screen required. Focus the hidden capture
  // target whenever the hero is on screen (and re-focus when it scrolls back
  // into view), but never steal focus from a real text field the user is
  // typing in. preventScroll keeps the page from jumping.
  React.useEffect(() => {
    if (stateRef.current.deviceMode !== 'mac') return undefined;
    const el = wrapRef.current;
    if (!el) return undefined;
    const isEditableActive = () => {
      const a = document.activeElement;
      const tag = a?.tagName?.toLowerCase?.();
      return tag === 'input' || tag === 'textarea' || a?.isContentEditable;
    };
    const focusCapture = () => {
      const capture = keyboardCaptureRef.current;
      if (!capture || isEditableActive()) return;
      // Don't grab focus when the HELP player is active — it owns the keyboard.
      if (getActiveHelpPlayerForKeyboard()) return;
      if (document.activeElement === capture) return;
      try { capture.focus({ preventScroll: true }); }
      catch { capture.focus?.(); }
      const term = ensureMacTerminal();
      term.focused = true;
      term.cursorOn = true;
      drawMacOffScreen();
    };
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) focusCapture();
    }, { threshold: 0.35 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [drawMacOffScreen, ensureMacTerminal]);

  React.useEffect(() => {
    if (stateRef.current.deviceMode !== 'mac') return undefined;
    const tick = () => {
      if (window.__resumeStrudelAudioEngine?.enabled) return;
      const state = stateRef.current;
      if (state.tabVisible === false || state.tvVisible === false) return;
      const term = ensureMacTerminal();
      term.cursorOn = !term.cursorOn;
      drawMacOffScreen();
    };
    const timer = window.setInterval(tick, 470);
    return () => window.clearInterval(timer);
  }, [drawMacOffScreen, ensureMacTerminal]);

  // Shift+1/2/3 — toggle screen mode (color | grayscale | 1bit) so the user
  // can preview the period-correct B&W and pick a default.
  React.useEffect(() => {
    const onKey = (event) => {
      if (!event.shiftKey || event.metaKey || event.ctrlKey || event.altKey) return;
      let mode = null;
      if (event.code === 'Digit1' || event.key === '!') mode = 'color';
      else if (event.code === 'Digit2' || event.key === '@') mode = 'grayscale';
      else if (event.code === 'Digit3' || event.key === '#') mode = '1bit';
      if (!mode) return;
      stateRef.current.screenMode = mode;
      console.info('[TvHero] screen mode →', mode);
      const media = stateRef.current.currentMedia || stateRef.current.currentImage;
      if (media) drawSourceToCanvas(media);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawSourceToCanvas]);

  // Sub/bass hits briefly dirty the CRT texture with analog tracking
  // noise. This runs on the same scheduled event bus as the rest of the
  // music-reactive visuals, so future songs only need to fire the bass
  // lane and the TV follows automatically.
  React.useEffect(() => {
    const onBassHit = (event) => {
      if (event.detail?.lane && event.detail.lane !== 'bass') return;
      if (stateRef.current.tabVisible === false || stateRef.current.tvVisible === false || helpOwnsTvStage()) return;
      const media = stateRef.current.currentMedia || stateRef.current.currentImage;
      if (!media) return;
      if (stateRef.current.deviceMode === 'mac') {
        // Mac path: heavy phosphor bloom + vertical rolling hum.
        // Works during video playback too — the video tick reads
        // state.macBloom and routes through drawMacBloom.
        animateMacBloomBurst('bass', {
          id: event.detail?.id,
          duration: event.detail?.duration,
          strength: event.detail?.strength,
          bassLevel: event.detail?.bassLevel,
        });
        return;
      }
      const duration = Math.max(95, Math.min(165, event.detail?.duration || 120));
      stateRef.current.tracking = {
        activeUntil: performance.now() + duration,
        seed: (event.detail?.id || 1) * 97,
        strength: Math.min(1.7, (event.detail?.strength ?? 1.15) * 1.35),
      };
      if (!stateRef.current.currentVideo) animateTrackingBurst();
    };
    window.addEventListener('resume-bass-hit', onBassHit);
    return () => window.removeEventListener('resume-bass-hit', onBassHit);
  }, [animateTrackingBurst, animateMacBloomBurst, helpOwnsTvStage]);

  React.useEffect(() => {
    const onDrumHit = (event) => {
      if (helpOwnsTvStage()) return;
      if (event.detail?.lane === 'hat') {
        applyHatTrackingPulse(event.detail);
        return;
      }
      if (event.detail?.lane !== 'snare') return;
      if (stateRef.current.tabVisible === false || stateRef.current.tvVisible === false || helpOwnsTvStage()) return;
      stateRef.current.lastRhythmCutAt = performance.now();
      stateRef.current.rhythmCutCount = (stateRef.current.rhythmCutCount || 0) + 1;
      stateRef.current.sparseMotif = null;
      if (stateRef.current.deviceMode === 'mac') {
        // Mac path: hard bloom flash + spacebar press + clean cut.
        animateMacBloomBurst('clap');
        animateKeyPress('space');
        cutRef.current?.('snare');
        return;
      }
      animateChannelFlip(event.detail);
    };
    window.addEventListener('resume-drum-hit', onDrumHit);
    return () => window.removeEventListener('resume-drum-hit', onDrumHit);
  }, [animateChannelFlip, animateMacBloomBurst, animateKeyPress, applyHatTrackingPulse, helpOwnsTvStage]);

  React.useEffect(() => {
    const onVocalCue = (event) => {
      if (stateRef.current.tabVisible === false || stateRef.current.tvVisible === false || helpOwnsTvStage()) return;
      const now = performance.now();
      if (now - stateRef.current.lastVocalPunchAt < 420) return;
      stateRef.current.lastVocalPunchAt = now;
      triggerEditPunch(event.detail?.mode === 'chop' ? 1.055 : 1.035, 210);
    };
    window.addEventListener('resume-vocal-sample-cue', onVocalCue);
    return () => window.removeEventListener('resume-vocal-sample-cue', onVocalCue);
  }, [helpOwnsTvStage, triggerEditPunch]);

  // Intro + breakdown have no clap/snare lane, so without a secondary
  // cue the short trailer clips loop visibly. Let sparse melody/bass
  // hits trigger occasional fresh cuts, while staying out of the way
  // once the snare-driven channel cuts are active.
  React.useEffect(() => {
    if (!engineEnabled || !availableSources.length) return undefined;
    const trySparseCut = (lane) => {
      const state = stateRef.current;
      if (state.tabVisible === false || state.tvVisible === false || helpOwnsTvStage()) return;
      const now = performance.now();
      if (now - state.lastRhythmCutAt < 1700) return;
      if (now - state.lastCutAt < 2200) return;
      const breakdownActive = getBreakdownPosition(now).active;
      if (now - state.lastSparseCutAt < (breakdownActive ? 3300 : 2600)) return;
      state.lastSparseCutAt = now;
      cutRef.current?.(lane, { mode: 'sparse' });
    };
    const onMelody = (event) => {
      if (event.detail?.lane === 'lead') {
        triggerSectionVocal(event.detail.lane, event);
        trySparseCut('lead');
      } else if (['angel', 'build', 'switch', 'ghost'].includes(event.detail?.lane)) {
        triggerSectionVocal(event.detail.lane, event);
      }
    };
    const onBass = (event) => {
      if (event.detail?.lane === 'bass') {
        triggerSectionVocal('bass', event);
        trySparseCut('bass');
      }
    };
    window.addEventListener('resume-melody-note', onMelody);
    window.addEventListener('resume-bass-hit', onBass);
    return () => {
      window.removeEventListener('resume-melody-note', onMelody);
      window.removeEventListener('resume-bass-hit', onBass);
    };
  }, [engineEnabled, availableSources, getBreakdownPosition, helpOwnsTvStage, triggerSectionVocal]);

	  // Click the Mac's physical controls to slide the floppy and toggle
	  // audio + picture. Any Mac hit also captures keyboard focus so the
	  // REPL textarea never receives terminal typing by accident.
	  React.useEffect(() => {
	    if (stateRef.current.deviceMode !== 'mac') return;
	    const canvas = canvasRef.current;
	    if (!canvas) return;
    let raycaster = null;
    const pickStickyNote = (event) => {
      const state = stateRef.current;
      const THREE = state.three;
      const camera = state.camera;
      const stickyNotes = state.stickyNotes || [];
      if (!THREE || !camera || !stickyNotes.length) return null;
      if (!raycaster) raycaster = new THREE.Raycaster();
      const rect = canvas.getBoundingClientRect();
      const ndc = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(ndc, camera);
      const hits = raycaster.intersectObjects(stickyNotes, false);
      return hits[0]?.object || null;
    };
    const onPointerMove = (event) => {
      setHoveredStickyNote(pickStickyNote(event));
    };
    const onPointerLeave = () => {
      setHoveredStickyNote(null);
    };
    const onPointerDown = async (event) => {
	      const state = stateRef.current;
	      const THREE = state.three;
	      const camera = state.camera;
	      const hitMeshes = state.macHitMeshes || state.mouseHitMeshes;
	      if (!THREE || !camera || !hitMeshes || !hitMeshes.length) return;
	      if (!raycaster) raycaster = new THREE.Raycaster();
	      const rect = canvas.getBoundingClientRect();
      const ndc = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
      );
	      raycaster.setFromCamera(ndc, camera);
	      const hits = raycaster.intersectObjects(hitMeshes, false);
	      const macHits = hits.length
	        ? hits
	        : state.frameModel
	          ? raycaster.intersectObjects([state.frameModel], true)
	          : [];
	      if (!macHits.length) return;
	      event.preventDefault();
	      captureMacKeyboard();
	      if (!hits.length) return;
	      if (state.powerToggleInFlight) return;
	      const hit = hits[0];
	      const target = state.macHitTargets?.get(hit.object.uuid) || { type: 'mouse' };
	      if (['resume', 'linkedin', 'link'].includes(target.type)) {
	        const href = target.href || (target.type === 'resume' ? 'resume-readonly.html' : '');
	        if (!href) return;
	        if (/^https?:\/\//i.test(href)) {
	          const opened = window.open(href, '_blank', 'noopener,noreferrer');
	          if (opened) opened.opener = null;
	        } else {
	          window.location.href = href;
	        }
	        return;
	      }
	      if (target.type === 'screen') {
	        if (!window.__resumeStrudelAudioEngine?.enabled) {
	          const term = ensureMacTerminal();
	          term.focused = true;
	          term.cursorOn = true;
	          drawMacOffScreen();
	        }
	        return;
	      }
	      if (target.type === 'mouse') {
	        animateMouseButton();
	      } else if (target.type === 'key') {
	        if (target.label) animateKeyPress(target.label);
	        else animateKeyMeshPress(hit.object);
	      }
	      const engine = window.__resumeStrudelAudioEngine;
	      const isOn = !!engine?.enabled;
	      if (!isOn && target.type === 'key') {
	        const term = ensureMacTerminal();
	        term.focused = true;
	        term.cursorOn = true;
	        if (target.label) {
	          applyMacTerminalKey(target.label, { shiftKey: false });
	        } else {
	          pushMacTerminalLine('keyboard active. type PLAY then RETURN.');
	          drawMacOffScreen();
	        }
	        return;
	      }
	      state.powerToggleInFlight = true;
	      try {
	        if (isOn) {
	          // Power off: fast picture roll on the current frame, THEN blank +
	          // eject + stop audio. The roll plays out while the current media
	          // refs are still set so drawMacBloom has something to scroll.
	          const powerRoll = animateMacBloomBurst('powerOn');
	          const ejectFloppy = animateFloppy(false);
	          await powerRoll;
	          const s = stateRef.current;
	          cancelAnimationFrame(s.videoRaf);
	          if (s.videoFrameRequest && s.currentVideo?.cancelVideoFrameCallback) {
	            try { s.currentVideo.cancelVideoFrameCallback(s.videoFrameRequest); } catch {}
	          }
	          s.videoFrameRequest = 0;
	          s.currentVideo = null;
	          s.currentMedia = null;
	          s.currentImage = null;
	          drawMacOffScreen();
	          await ejectFloppy;
	          try { await engine.setEnabled(false); } catch (_) {}
	        } else {
	          // Power on: slide floppy in, fire the init cut, run the CRT power-on
	          // picture roll, then start audio. Picture rolls a few times as the
	          // signal locks in.
	          await animateFloppy(true);
	          cutRef.current?.('init');
	          await animateMacBloomBurst('powerOn');
	          try { await engine?.setEnabled(true); } catch (_) {}
	        }
	      } finally {
	        stateRef.current.powerToggleInFlight = false;
	      }
	    };
	    canvas.addEventListener('pointermove', onPointerMove, { passive: true });
	    canvas.addEventListener('pointerleave', onPointerLeave);
	    canvas.addEventListener('pointercancel', onPointerLeave);
	    canvas.addEventListener('pointerdown', onPointerDown);
	    canvas.style.cursor = 'pointer';
    return () => {
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      canvas.removeEventListener('pointercancel', onPointerLeave);
      canvas.removeEventListener('pointerdown', onPointerDown);
      stateRef.current.hoveredStickyNote = null;
      for (const stickyNote of stateRef.current.stickyNotes || []) {
        if (stickyNote?.userData) stickyNote.userData.hovered = false;
      }
      cancelAnimationFrame(stateRef.current.stickyNoteHoverRaf);
      stateRef.current.stickyNoteHoverRaf = 0;
      canvas.style.cursor = '';
    };
  }, [animateMouseButton, animateKeyPress, animateKeyMeshPress, animateFloppy, animateMacBloomBurst, applyMacTerminalKey, captureMacKeyboard, drawMacOffScreen, ensureMacTerminal, pushMacTerminalLine, setHoveredStickyNote]);

  React.useEffect(() => {
    if (stateRef.current.deviceMode !== 'mac') return;
    const onDoomClosed = async () => {
      if (stateRef.current.powerToggleInFlight) return;
      stateRef.current.powerToggleInFlight = true;
      pushMacTerminalLine('doom session ended.');
      drawMacOffScreen();
      try {
        await animateFloppy(false);
      } finally {
        stateRef.current.powerToggleInFlight = false;
      }
    };
    window.addEventListener('resume-doom-closed', onDoomClosed);
    return () => window.removeEventListener('resume-doom-closed', onDoomClosed);
  }, [animateFloppy, drawMacOffScreen, pushMacTerminalLine]);

  // Lead/melody notes → round-robin W → A → S → D on the Mac keyboard.
  React.useEffect(() => {
    if (stateRef.current.deviceMode !== 'mac') return;
    const sequence = ['W', 'A', 'S', 'D'];
    let idx = 0;
    const onMelody = () => {
      if (stateRef.current.tabVisible === false || stateRef.current.tvVisible === false || helpOwnsTvStage()) return;
      animateKeyPress(sequence[idx % sequence.length]);
      idx++;
    };
    window.addEventListener('resume-melody-note', onMelody);
    return () => window.removeEventListener('resume-melody-note', onMelody);
  }, [animateKeyPress, helpOwnsTvStage]);

  // Audio-on setup. Clip changes are intentionally handled by the
  // dedicated snare/clap listener above; cutting on every kick/lead note
  // makes the TV read as video stutter instead of music sync.
  React.useEffect(() => {
    if (!engineEnabled || !availableSources.length) return;
    setPhase('hold');
    stateRef.current.recent = [];
    stateRef.current.recentProjects = [];
    stateRef.current.laneCursors.clear();
    stateRef.current.songStartedAt = performance.now();
    stateRef.current.rhythmCutCount = 0;
    stateRef.current.lastCutAt = 0;
    stateRef.current.lastRhythmCutAt = 0;
    stateRef.current.lastSparseCutAt = 0;
    stateRef.current.lastHatTrackingPulseAt = 0;
    stateRef.current.lastVocalPunchAt = 0;
    stateRef.current.sparseMotif = null;
    stateRef.current.vocalSampleLoop = -1;
    stateRef.current.vocalSampleSlots.clear();
    if (!stateRef.current.currentMedia && !helpOwnsTvStage()) cutRef.current?.('init');
  }, [engineEnabled, availableSources, helpOwnsTvStage]);

  // Idle cut cycle when audio is off — keeps something on the screen
  React.useEffect(() => {
    if (engineEnabled || !availableSources.length) return;
    // Mac mode: screen is OFF when audio engine is off (floppy ejected).
    // Blank the canvas; do NOT cycle idle cuts.
    if (stateRef.current.deviceMode === 'mac') {
      cancelAnimationFrame(stateRef.current.videoRaf);
      if (stateRef.current.videoFrameRequest && stateRef.current.currentVideo?.cancelVideoFrameCallback) {
        try { stateRef.current.currentVideo.cancelVideoFrameCallback(stateRef.current.videoFrameRequest); } catch {}
      }
      stateRef.current.videoFrameRequest = 0;
      pauseAllCachedVideos();
      stopVocalSamples(10);
      stateRef.current.currentVideo = null;
      stateRef.current.currentMedia = null;
      stateRef.current.currentImage = null;
      stateRef.current.powerPausedVideo = null;
      drawMacOffScreen();
      return;
    }
    if (helpOwnsTvStage()) return undefined;
    cutRef.current?.('idle');
    const t = setInterval(() => cutRef.current?.('idle'), 3500);
    return () => clearInterval(t);
  }, [engineEnabled, availableSources, drawMacOffScreen, helpOwnsTvStage, pauseAllCachedVideos, stopVocalSamples]);

  return (
    <div
      ref={wrapRef}
      className={`tv-hero ${engineEnabled ? 'is-live' : 'is-idle'} ${macStageDragEnabled ? 'is-mac-drag-enabled' : ''}`}
      data-mac-drag-x={`${Math.round(macStageDragX)}px`}
      data-mac-drag-bucket={macStageDragBucket}
    >
      <div
        ref={keyboardCaptureRef}
        className="tv-hero__keyboard-capture"
        tabIndex={-1}
        aria-label="Mac terminal keyboard capture"
      />
      <canvas ref={canvasRef} className="tv-hero__canvas" />
      {children ? (
        <div className="tv-hero__controls">
          {children}
        </div>
      ) : null}
    </div>
  );
}

function HelpFeature({ src, label = "03 · SELECTED WORK · MILL STITCH™ / HELP", showIntro = true }) {
  useEffect(() => {
    const section = document.getElementById('help');
    if (!section) return undefined;
    let frame = 0;
    let pinned = false;

    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const viewportH = window.innerHeight || document.documentElement.clientHeight || 0;
      const shouldPin = rect.top <= 1 && rect.bottom > viewportH + 1;
      section.classList.toggle('is-help-pinned', shouldPin);
      if (shouldPin !== pinned) {
        pinned = shouldPin;
        window.dispatchEvent(new CustomEvent('resume-help-pin-change', {
          detail: { pinned, section },
        }));
      }
    };

    const queueUpdate = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', queueUpdate, { passive: true });
    window.addEventListener('resize', queueUpdate);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      section.classList.remove('is-help-pinned');
      if (pinned) {
        window.dispatchEvent(new CustomEvent('resume-help-pin-change', {
          detail: { pinned: false, section },
        }));
      }
      window.removeEventListener('scroll', queueUpdate);
      window.removeEventListener('resize', queueUpdate);
    };
  }, []);

  return (
    <Section id="help" label={label}>
      <div className="help-hero">
        {showIntro ? (
        <div className="help-hero__intro">
          <h3 className="serif">A 360° film, served from its native projection.</h3>
          <ProofStampRow items={HELP_AWARD_STAMPS} className="proof-stamps--no-rails proof-stamps--under-heading proof-stamps--help-title" />
          <p>
            <em>HELP</em> (dir. Justin Lin) was the first Hollywood-scale immersive cinematic
            experience built for mobile — a Google Spotlight Stories title delivered in a
            custom MESH projection rather than equirectangular video.
          </p>
          <p>
            As Technical Innovations Manager and Product Manager, I worked with our artists,
            engineers, and partners at Google, Derivative, and Keslow Camera to produce the
            360° camera rig, <strong>Mill Stitch™</strong>, and the on-set and post-production
            technology that enabled this first-of-its-kind deliverable. Mill Stitch was the
            real-time 360° pipeline that let the director see the surround action live during
            principal photography in the LA River basin. Use <span className="mono">W / A / S / D</span>{' '}
            keys or drag to look around.
          </p>
        </div>
        ) : null}
        <div className="help-hero__player">
          <HelpPlayer src={src} />
        </div>
      </div>
    </Section>
  );
}

// ────────────────────────────────────────────────────────────────────
//  Live system — Poetry in Proof
// ────────────────────────────────────────────────────────────────────

function FourChordsFigure() {
  const engine = getResumeAudioEngine();
  const [active, setActive] = useState('');
  const [audioOn, setAudioOn] = useState(engine.enabled);

  useEffect(() => {
    const onChord = (event) => setActive((event.detail?.key || '').toUpperCase());
    const onAudio = () => setAudioOn(engine.enabled);
    window.addEventListener('resume-chord-key', onChord);
    window.addEventListener('resume-audio-change', onAudio);
    return () => {
      window.removeEventListener('resume-chord-key', onChord);
      window.removeEventListener('resume-audio-change', onAudio);
    };
  }, [engine]);

  const dispatchKey = (type, key) =>
    window.dispatchEvent(new KeyboardEvent(type, { key: key.toLowerCase(), bubbles: true }));
  const press = (key) => (e) => {
    e.preventDefault();
    if (!audioOn) engine.setEnabled(true).catch(() => {});
    dispatchKey('keydown', key);
  };
  const release = (key) => (e) => {
    e.preventDefault();
    dispatchKey('keyup', key);
  };

  // Four stations along the baseline. The Byrne shape/colour convention
  // only covers three (triangle yellow, circle blue, square red); the
  // fourth station closes the cycle with an inverted triangle in red.
  const stations = [
    { id: 'W', x: 220, shape: 'triangle', color: 'yellow' },
    { id: 'A', x: 420, shape: 'circle',   color: 'blue'   },
    { id: 'S', x: 620, shape: 'square',   color: 'red'    },
    { id: 'D', x: 820, shape: 'tri-inv',  color: 'red'    },
  ];
  const baselineY = 296;
  const shapeY = 168;
  const r = 36; // visual radius for hit area + shapes

  const renderShape = (s) => {
    const fillClass = `system-jam-figure__fill system-jam-figure__fill--${s.color}`;
    if (s.shape === 'circle') {
      return <circle className={fillClass} cx={s.x} cy={shapeY} r={r - 2} />;
    }
    if (s.shape === 'square') {
      return (
        <rect
          className={fillClass}
          x={s.x - (r - 4)}
          y={shapeY - (r - 4)}
          width={(r - 4) * 2}
          height={(r - 4) * 2}
        />
      );
    }
    if (s.shape === 'tri-inv') {
      return (
        <polygon
          className={fillClass}
          points={`${s.x - r},${shapeY - (r - 4)} ${s.x + r},${shapeY - (r - 4)} ${s.x},${shapeY + (r - 2)}`}
        />
      );
    }
    // upward triangle
    return (
      <polygon
        className={fillClass}
        points={`${s.x},${shapeY - (r - 2)} ${s.x + r},${shapeY + (r - 4)} ${s.x - r},${shapeY + (r - 4)}`}
      />
    );
  };

  return (
    <svg
      className="system-jam-figure"
      viewBox="0 20 1000 385"
      role="group"
      aria-label="Four-chord pad — click any chord to override the progression"
    >
      <ByrneTitle>FOUR CHORDS ON A LINE</ByrneTitle>
      {/* Baseline — strong black */}
      <line className="diagram-line diagram-line--strong" x1="120" y1={baselineY} x2="880" y2={baselineY} />
      {/* End ticks on the baseline */}
      <path className="diagram-line diagram-line--thin" d={`M120 ${baselineY - 8} V${baselineY + 8} M880 ${baselineY - 8} V${baselineY + 8}`} />
      {/* Cycle-return arc above — dotted, going D → W (right to left) */}
      <path
        className="diagram-line diagram-line--dotted"
        d="M820 130 Q 520 32 220 130"
      />
      <path
        className="diagram-line diagram-line--thin"
        d="M232 124 L220 132 L228 144"
      />
      {/* Four stations */}
      {stations.map((s) => {
        const isOn = active === s.id;
        return (
          <g
            key={s.id}
            className={`system-jam-figure__station ${isOn ? 'is-active' : ''}`}
            onMouseDown={press(s.id)}
            onMouseUp={release(s.id)}
            onMouseLeave={release(s.id)}
            onTouchStart={press(s.id)}
            onTouchEnd={release(s.id)}
            tabIndex={0}
            role="button"
            aria-pressed={isOn}
            aria-label={`Chord ${s.id}`}
          >
            {/* Dotted construction line from baseline up to the shape */}
            <line
              className="diagram-line diagram-line--dotted"
              x1={s.x}
              y1={baselineY}
              x2={s.x}
              y2={shapeY + (r - 4)}
            />
            {renderShape(s)}
            {/* Station marker dot on the baseline */}
            <circle className="diagram-dot" cx={s.x} cy={baselineY} r="6" />
            {/* Letter label below the baseline */}
            <text className="diagram-text diagram-text--byrne-label" x={s.x} y={baselineY + 28} textAnchor="middle">
              {s.id}
            </text>
            {/* Generous transparent click target */}
            <rect
              x={s.x - 70}
              y={shapeY - 60}
              width={140}
              height={baselineY - shapeY + 100}
              fill="transparent"
              style={{ cursor: 'pointer' }}
            />
          </g>
        );
      })}
    </svg>
  );
}

function LiveSystemFeature() {
  return (
    <Section id="system" label="05 · LIVE SYSTEM · POETRY IN PROOF">
      <div className="system-section">
        <p className="system-section__lede serif">
          The page is the demo. A proof-figure interface in the Byrne / Euclid
          idiom, paired with a real-time generative music engine — sixteen
          plates, four chords, three stem layers that fold in and out as you
          scroll.
        </p>
        <FourChordsFigure />
        <p className="system-section__detail mono">
          Click any chord above to override the progression. Press <b>W A S D</b>
          to do the same from the keyboard. Scroll the page to fold instrument
          layers in and out. Click any plate at the top to cycle the figures.
        </p>
      </div>
    </Section>
  );
}

// ────────────────────────────────────────────────────────────────────
//  Project (agiftoftime)
// ────────────────────────────────────────────────────────────────────

function ProjectCard({ data }) {
  return (
    <Section id="project" label="05 · INDEPENDENT · 2025">
      <div className="project">
        <div className="project__head">
          <h3 className="serif">{data.name}</h3>
          <div className="project__sub mono dim">{data.sub}</div>
        </div>
        <p className="project__body">{data.body}</p>
        <ul className="project__stack mono">
          {data.stack.map((s,i) => (<li key={i}>{s}</li>))}
        </ul>
      </div>
    </Section>
  );
}

// ────────────────────────────────────────────────────────────────────
//  Awards — filterable
// ────────────────────────────────────────────────────────────────────

function Awards({ items }) {
  // Heavyweights get a hero treatment: the two Engineering Emmys
  // (Television Academy + NATAS) and the three Cannes Gold Lions.
  // Everything else collapses into a tight list below.
  const isFeature = (a) =>
    /television academy|^natas$|^cannes lions$/i.test(a.org) && a.tier === 'gold';
  const featured = items.filter(isFeature);
  const rest = items.filter((a) => !isFeature(a));
  return (
    <Section id="awards" label="06 · AWARDS & RECOGNITION">
      <ul className="awards-hero">
        {featured.map((a, i) => (
          <li key={i} className="award-hero">
            <div className="award-hero__org mono">{a.org}</div>
            <div className="award-hero__title">{a.title}</div>
            <div className="award-hero__project serif italic">{a.project}</div>
          </li>
        ))}
      </ul>
      <ul className="awards-list">
        {rest.map((a, i) => (
          <li key={i} className={`award-row award-row--${a.tier}`}>
            <span className={`award-row__tier award-row__tier--${a.tier} mono`}>{a.tier}</span>
            <span className="award-row__org mono">{a.org}</span>
            <span className="award-row__title">{a.title}</span>
            <span className="award-row__project serif italic">{a.project}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

// ────────────────────────────────────────────────────────────────────
//  Skills
// ────────────────────────────────────────────────────────────────────

function Skills({ groups }) {
  return (
    <Section id="skills" label="07 · TECHNICAL">
      <div className="skills">
        {groups.map((g,i) => (
          <div key={i} className="skill-group">
            <div className="skill-group__name mono">{g.group}</div>
            <ul className="skill-group__items">
              {g.items.map((it,j) => <li key={j}>{it}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}

function DoomOverlay() {
  const [active, setActive] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [src, setSrc] = React.useState('');
  const closeRef = React.useRef(null);

  const close = React.useCallback(() => {
    setActive(false);
    setLoading(false);
    setSrc('');
    document.documentElement.classList.remove('has-doom-overlay');
    window.dispatchEvent(new CustomEvent('resume-doom-closed'));
  }, []);

  closeRef.current = close;

  React.useEffect(() => {
    const launch = async () => {
      const engine = window.__resumeStrudelAudioEngine;
      try {
        if (engine?.enabled) await engine.setEnabled(false);
      } catch (_) {}
      setSrc(getDoomIframeUrl());
      setLoading(true);
      setActive(true);
      document.documentElement.classList.add('has-doom-overlay');
    };
    window.addEventListener('resume-launch-doom', launch);
    return () => window.removeEventListener('resume-launch-doom', launch);
  }, []);

  React.useEffect(() => {
    if (!active) return undefined;
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopPropagation();
      close();
    };
    const onMessage = (event) => {
      if (event.data?.type === 'resume-doom-exit') closeRef.current?.();
    };
    window.addEventListener('keydown', onKeyDown, true);
    window.addEventListener('message', onMessage);
    return () => {
      window.removeEventListener('keydown', onKeyDown, true);
      window.removeEventListener('message', onMessage);
    };
  }, [active, close]);

  if (!active) return null;

  return (
    <div className="doom-overlay" role="dialog" aria-label="Doom fullscreen player">
      <iframe
        className="doom-overlay__frame"
        src={src}
        title="Doom"
        allow="autoplay; fullscreen; gamepad"
        allowFullScreen
        tabIndex={-1}
        onLoad={(event) => {
          setLoading(false);
          try { event.currentTarget.focus({ preventScroll: true }); } catch (_) {}
        }}
      />
      <div className="doom-overlay__bar mono">
        <span>DOOM.EXE</span>
        <button type="button" className="doom-overlay__close" onClick={close}>ESC EXIT</button>
      </div>
      {loading && (
        <div className="doom-overlay__loading mono">
          <span>loading executable</span>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────
//  Education
// ────────────────────────────────────────────────────────────────────

function Education({ items }) {
  return (
    <Section id="edu" label="08 · EDUCATION">
      <ul className="edu">
        {items.map((e,i) => (
          <li key={i} className="edu__row">
            <div className="edu__school serif">{e.school}</div>
            <div className="edu__degree">{e.degree}</div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

// ────────────────────────────────────────────────────────────────────
//  References — message thread
// ────────────────────────────────────────────────────────────────────

function getInitials(name = '') {
  return name
    .replace(/[‘’']/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function ReferenceAvatar({ item, index, shapes }) {
  const [failed, setFailed] = useState(false);
  const shape = shapes[index % shapes.length];
  const src = item.avatar && !failed ? item.avatar : '';
  return (
    <span className={`refs__avatar refs__avatar--${shape}`} aria-hidden="true">
      {src ? (
        <img src={src} alt="" loading="eager" decoding="async" onError={() => setFailed(true)} />
      ) : (
        <span>{getInitials(item.name)}</span>
      )}
    </span>
  );
}

function ReferenceMessage({ item, index, shapes }) {
  return (
    <article className="refs__message">
      <ReferenceAvatar item={item} index={index} shapes={shapes} />
      <div className="refs__message-stack">
        <div className="refs__sender">{item.name}</div>
        <div className="refs__credential">
          <div className="refs__title mono">{item.title}</div>
          {item.sub && <div className="refs__sub mono dim">{item.sub}</div>}
        </div>
        <blockquote className="refs__text serif">
          {item.quote}
        </blockquote>
      </div>
    </article>
  );
}

function References({ items }) {
  const refShapes = ['triangle', 'circle', 'square'];
  return (
    <Section id="refs" label="09 · REFERENCES">
      <ol className="refs">
        {items.map((item, index) => (
          <li key={item.name}>
            <ReferenceMessage item={item} index={index} shapes={refShapes} />
          </li>
        ))}
      </ol>
    </Section>
  );
}

// ────────────────────────────────────────────────────────────────────
//  Footer
// ────────────────────────────────────────────────────────────────────

function Footer({ data }) {
  return (
    <footer className="page-footer mono dim">
      <p className="page-footer__media-note">
        Selected footage and trademarks &copy; respective studios and rights holders. Shown for portfolio context only.
      </p>
    </footer>
  );
}

Object.assign(window, {
  HelpPlayer, HelpFeature, Summary,
  Experience, ProjectCard, LiveSystemFeature, Awards, Skills, Education, References, Footer,
  VideoSlot, BlackbirdFeature, ScrollAudioLayers, StrudelReplFeature, TvHero, DoomOverlay
});
