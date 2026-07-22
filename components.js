/* eslint-disable */
const { useState, useEffect, useLayoutEffect, useRef, useMemo } = React;

const AUDIO_BPM = 96;
const AUDIO_SIXTEENTH_MS = 60000 / AUDIO_BPM / 4;
const TITLE_BEATS = 24;
const PAGE_DWELL_TAIL_STEPS = 0;
const RESUME_MAC_MASTER_MAKEUP_GAIN = 1.78;

function installResumeMacMasterBus(context) {
  if (!context || context.state === 'closed') return null;
  if (context.__resumeMacMasterInput) return context.__resumeMacMasterInput;
  const limiter = context.createDynamicsCompressor();
  const makeup = context.createGain();
  const now = context.currentTime;
  limiter.threshold.setValueAtTime(-6, now);
  limiter.knee.setValueAtTime(1.5, now);
  limiter.ratio.setValueAtTime(20, now);
  limiter.attack.setValueAtTime(0.002, now);
  limiter.release.setValueAtTime(0.09, now);
  makeup.gain.setValueAtTime(RESUME_MAC_MASTER_MAKEUP_GAIN, now);
  limiter.connect(makeup);
  makeup.connect(context.destination);
  context.__resumeMacMasterInput = limiter;
  context.__resumeMacMasterLimiter = limiter;
  context.__resumeMacMasterMakeup = makeup;
  context.__resumeMacMasterMakeupGain = RESUME_MAC_MASTER_MAKEUP_GAIN;
  return limiter;
}

function getResumeMacAudioDestination(context) {
  return installResumeMacMasterBus(context) || context?.destination || null;
}

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
  const canOwnForeground = () => !document.hidden && document.hasFocus();
  let active = canOwnForeground();
  let channel = null;
  try {
    if ('BroadcastChannel' in window) {
      channel = new BroadcastChannel(RESUME_PAGE_ACTIVITY_CHANNEL);
    }
  } catch {}

  const dispatch = (reason) => {
    document.documentElement.dataset.resumePageActive = active ? 'true' : 'false';
    document.documentElement.dataset.resumePageActivityReason = reason;
    window.dispatchEvent(new CustomEvent('resume-page-activity-change', {
      detail: { active, reason, instanceId, ownerId },
    }));
  };
  const setActive = (next, reason) => {
    const normalized = Boolean(next && canOwnForeground());
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
    if (!canOwnForeground()) {
      setActive(false, document.hidden ? 'hidden' : 'unfocused');
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
      // Resolve same-millisecond tab claims deterministically. Without the ID
      // tie-break, two tabs could each accept the other's claim and both end
      // up inactive until another user gesture arrived.
      const claimWins = messageAt > ownerAt
        || (messageAt === ownerAt && String(message.id) > String(ownerId));
      if (claimWins) {
        ownerId = message.id;
        ownerAt = messageAt;
        setActive(false, 'claimed-by-another-tab');
      }
      return;
    }
    if (message.type === 'release' && ownerId === message.id) {
      ownerId = '';
      ownerAt = 0;
      if (canOwnForeground()) {
        window.setTimeout(() => {
          if (canOwnForeground() && ownerId !== instanceId) claim('claim-after-release');
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
    else if (document.hasFocus()) claim('visible-focused');
    else setActive(false, 'visible-unfocused');
  };
  const onFocus = () => claim('focus');
  const onBlur = () => release('blur');
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
  window.addEventListener('focus', onFocus);
  window.addEventListener('blur', onBlur);
  window.addEventListener('pageshow', () => {
    if (document.hasFocus()) claim('pageshow-focused');
    else setActive(false, 'pageshow-unfocused');
  });
  window.addEventListener('pointerdown', () => claim('pointer'), true);
  window.addEventListener('keydown', () => claim('keyboard'), true);
  document.documentElement.dataset.resumePageActive = active ? 'true' : 'false';
  document.documentElement.dataset.resumePageActivityReason = active ? 'init-focused' : 'init-background';
  window.setTimeout(() => {
    if (canOwnForeground()) claim('init-focused');
    else setActive(false, 'init-background');
  }, 0);

  return {
    id: instanceId,
    get active() {
      return Boolean(active && canOwnForeground() && ownerId === instanceId);
    },
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
  return window.__resumeIntroTransportPaused !== true
    && getResumePageActivity().active;
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
  let audioArmPromise = null;
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
  const armAudioForGesture = () => {
    if (getStrudelAudioContextState() === 'running') return Promise.resolve(true);
    if (audioArmPromise) return audioArmPromise;
    audioArmPromise = (async () => {
      try {
        const module = await ensureStrudel();
        if (module.initAudio) await module.initAudio();
        const context = module.getAudioContext?.();
        if (context && context.state !== 'running') await context.resume();
        const armed = !context || context.state === 'running';
        pendingGestureResume = enabled && !armed;
        window.dispatchEvent(new CustomEvent('resume-audio-change'));
        return armed;
      } catch (error) {
        console.warn('Strudel audio arm failed', error);
        return false;
      } finally {
        audioArmPromise = null;
      }
    })();
    return audioArmPromise;
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
    armAudioForGesture().then(() => {
      if (enabled) resumeAudioAfterReturn({ resetTransport: false, requirePending: true });
    });
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
    get compositionSource() {
      return String(
        window.__resumeActiveRawSource
        || songPresets[songIndex]?.composition
        || '',
      );
    },
    get arrangementSection() { return currentArrangementSection(); },
    get arrangementSections() {
      return ARRANGEMENT_SECTIONS.map((section) => ({ ...section }));
    },
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
    async prepare() {
      return Boolean(await ensureStrudel());
    },
    async arm() {
      return armAudioForGesture();
    },
    async resume() {
      return resumeAudioAfterReturn({ resetTransport: false, requirePending: false });
    },
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

window.__ensureResumeStrudelAudioEngine = getResumeStrudelAudioEngine;

// The LED wall is deliberately event-driven rather than animated on every
// render frame. Strudel already emits musically synchronized lane events; this
// bridge coalesces them to a maximum of ~12 wall paints per second and forwards
// the exact evaluated source to the Three.js stage when Film Reel owns it.
if (!window.__resumeStrudelWallBridgeInstalled) {
  window.__resumeStrudelWallBridgeInstalled = true;
  let pendingDetail = null;
  let paintTimer = 0;
  let lastPaintedAt = 0;
  let clearLaneTimer = 0;
  const flush = () => {
    paintTimer = 0;
    lastPaintedAt = performance.now();
    const engine = window.__resumeStrudelAudioEngine;
    const detail = pendingDetail || {};
    pendingDetail = null;
    window.__tvHeroLiveStrudelWallPaint?.({
      ...detail,
      source: getPoetryInProofRenderSource()
        || detail.source
        || engine?.compositionSource
        || window.__resumeActiveRawSource
        || '',
      section: detail.section || engine?.arrangementSection || 'loop',
      bpm: Number(detail.bpm || engine?.bpm) || 0,
    });
  };
  const schedule = (detail = {}, immediate = false) => {
    pendingDetail = { ...(pendingDetail || {}), ...detail };
    const elapsed = performance.now() - lastPaintedAt;
    if (immediate || elapsed >= 82) {
      if (paintTimer) window.clearTimeout(paintTimer);
      flush();
      return;
    }
    if (!paintTimer) {
      paintTimer = window.setTimeout(flush, Math.max(0, 82 - elapsed));
    }
  };
  window.addEventListener('resume-pattern-ready', (event) => {
    schedule({
      source: event.detail?.rawSource || event.detail?.source || '',
      lane: '',
      group: '',
      pulse: 0,
    }, true);
  });
  window.addEventListener('resume-midi-event', (event) => {
    const detail = event.detail || {};
    if (detail.source === 'webmidi' || (detail.type && detail.type !== 'noteon')) return;
    const lane = String(detail.lane || '');
    const group = String(detail.group || '');
    schedule({
      lane,
      group,
      section: detail.section || '',
      pulse: Math.max(0.18, Math.min(1, Number(detail.velocity) || 0.72)),
    });
    if (clearLaneTimer) window.clearTimeout(clearLaneTimer);
    clearLaneTimer = window.setTimeout(() => {
      schedule({ lane: '', group: '', pulse: 0 });
    }, 150);
  });
  window.addEventListener('resume-repl-token-highlight', (event) => {
    schedule({
      source: getPoetryInProofRenderSource(),
      pulse: event.detail?.active === true ? 1 : 0,
    }, true);
  });
  window.addEventListener('resume-audio-change', () => {
    schedule({ lane: '', group: '', pulse: 0 }, true);
  });
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
      if (id === 'help' || id === 'blackbird' || id === 'hand-of-god' || id === 'system' || id === 'project') return 'blue';
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

function HelpPlayer({ src, startOffset = 0 }) {
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
  const startOffsetSeconds = Math.max(0, Number(startOffset) || 0);

  const seekToStartOffset = React.useCallback((renderer = rendererRef.current, { force = false } = {}) => {
    if (!startOffsetSeconds || !renderer) return;
    const video = renderer.current?.loaded?.video;
    if (!video) return;
    const duration = Number(video.duration);
    const maxSafeTime = Number.isFinite(duration) && duration > 0
      ? Math.max(0, duration - 0.15)
      : startOffsetSeconds;
    const target = Math.min(startOffsetSeconds, maxSafeTime);
    if (!Number.isFinite(target) || target <= 0) return;
    if (!force && Number.isFinite(video.currentTime) && video.currentTime >= target - 0.15) return;
    try {
      video.currentTime = target;
    } catch (_) {}
  }, [startOffsetSeconds]);

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
	    let retryTimerId = 0;
	    async function go(attempt = 0) {
	      if (cancelled) return;
	      setStatus('loading');
	      if (hostRef.current) {
	        hostRef.current.dataset.helpMountAttempt = String(attempt + 1);
	        hostRef.current.dataset.helpMountStatus = attempt ? 'reconnecting' : 'loading';
	      }
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
	            if (hostRef.current) hostRef.current.dataset.helpMountStatus = 'ready';
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
	        if (cancelled) return;
	        const retryDelay = Math.min(8000, 900 * (2 ** Math.min(attempt, 4)));
	        if (hostRef.current) {
	          hostRef.current.dataset.helpMountStatus = 'reconnecting';
	          hostRef.current.dataset.helpRetryDelay = String(retryDelay);
	        }
	        console.warn(`[help-player] reconnecting in ${retryDelay}ms`, err);
	        retryTimerId = window.setTimeout(() => {
	          retryTimerId = 0;
	          go(attempt + 1);
	        }, retryDelay);
	      }
	    }
    go();
	    return () => {
	      cancelled = true;
	      if (retryTimerId) window.clearTimeout(retryTimerId);
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

  // The production HELP player already owns tab visibility and offscreen
  // cleanup. This placement adapter closes the one new race introduced by the
  // third-section sticky boundary: once HELP unpins, stop it immediately even
  // if IntersectionObserver delivered its offscreen entry one frame earlier.
  useEffect(() => {
    const onPinChange = (event) => {
      const slot = hostRef.current?.closest('.help-player');
      const section = event.detail?.section;
      if (!slot || !section?.contains?.(slot) || event.detail?.pinned !== false) return;
      stopPlayback();
    };
    window.addEventListener('resume-help-pin-change', onPinChange);
    return () => window.removeEventListener('resume-help-pin-change', onPinChange);
  }, [stopPlayback]);

  const playHelpWithSound = React.useCallback(() => {
    const renderer = rendererRef.current;
    if (!renderer) return null;
    userPausedRef.current = false;
    wasPlayingBeforeHiddenRef.current = false;
    clearOffscreenPauseTimer();
    window.dispatchEvent(new CustomEvent('resume-video-audio-state', {
      detail: { id: 'help-player', active: true },
    }));
    seekToStartOffset(renderer, { force: true });
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
  }, [clearOffscreenPauseTimer, seekToStartOffset]);

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
    if (startOffsetSeconds) playHelpWithSound();
    else rendererRef.current?.replayWithSound();
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

function VideoSlot({ src, label, fallbackPath, poster, hero = false, startTime = 0 }) {
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
    if (restart) video.currentTime = startTime;
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
      style={hero ? { aspectRatio: '1.85 / 1', height: 'auto', minHeight: 0 } : undefined}
      onMouseEnter={() => activateSlot()}
      onFocus={() => activateSlot()}
    >
      {status === 'ready' && (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted
          loop={!startTime}
          playsInline
          preload="none"
          className="video-slot__video"
          onLoadedMetadata={(event) => {
            if (startTime && event.currentTarget.currentTime < startTime) event.currentTarget.currentTime = startTime;
          }}
          onEnded={(event) => {
            if (!startTime) return;
            event.currentTarget.currentTime = startTime;
            event.currentTarget.play().catch(() => {});
          }}
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

function BlackbirdFeature({
  innovationSrc,
  behindScenesSrc,
  label = "04 · SELECTED WORK · THE MILL BLACKBIRD",
}) {
  return (
    <Section id="blackbird" label={label}>
      <div className="help-feature">
        <div className="help-feature__player-col help-feature__player-col--wide">
          <div className="video-stack">
            <VideoSlot src={innovationSrc} fallbackPath="resume/media/blackbird-innovation.mp4" label="cannes lions innovation film · the mill blackbird" />
            {behindScenesSrc ? (
              <VideoSlot
                src={behindScenesSrc}
                fallbackPath="resume/media/blackbird.mp4"
                label="virtual production case study · chevrolet the human race"
              />
            ) : null}
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

function HandOfGodFeature({
  src = "media/interactive/hand-of-god.html",
  label = "05 · PERSONAL ART · THE BEAUTIFUL GAME / HAND OF GOD",
}) {
  const featureRef = useRef(null);
  const frameRef = useRef(null);
  const activeRef = useRef(false);

  useEffect(() => {
    if (window.location.hash !== '#hand-of-god') return undefined;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById('hand-of-god')?.scrollIntoView({ block: 'start' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const feature = featureRef.current;
    const iframe = frameRef.current;
    if (!feature || !iframe) return undefined;

    let commandedState = null;
    const syncPlayback = ({ restart = false } = {}) => {
      const playing = Boolean(activeRef.current);
      if (!restart && commandedState === playing) return;
      commandedState = playing;
      feature.dataset.playbackRequested = playing ? 'play' : 'pause';
      iframe.contentWindow?.postMessage({
        type: 'beautifulgame:set-playback',
        playing,
        loop: true,
        restart: Boolean(restart && playing),
      }, window.location.origin);
    };
    const onDemoStatus = (event) => {
      if (event.origin !== window.location.origin || event.source !== iframe.contentWindow) return;
      if (event.data?.type !== 'beautifulgame:playback-status') return;
      feature.dataset.demoPlaying = event.data.playing ? 'true' : 'false';
      feature.dataset.demoReady = 'true';
    };
    const onFrameLoad = () => {
      commandedState = null;
      syncPlayback({ restart: activeRef.current });
    };
    const updatePlaybackActivity = () => {
      const rect = feature.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const visibleHeight = Math.max(
        0,
        Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0)
      );
      const visibleRatio = visibleHeight / Math.max(1, Math.min(rect.height, viewportHeight));
      const wasActive = activeRef.current;
      activeRef.current = visibleRatio >= 0.35;
      feature.dataset.playbackActive = activeRef.current ? 'true' : 'false';
      syncPlayback({ restart: activeRef.current && !wasActive });
    };
    const schedulePlaybackActivity = () => updatePlaybackActivity();
    const sectionObserver = new IntersectionObserver(schedulePlaybackActivity, {
      threshold: [0, 0.35, 0.6, 1],
    });

    iframe.addEventListener('load', onFrameLoad);
    window.addEventListener('message', onDemoStatus);
    window.addEventListener('scroll', schedulePlaybackActivity, { passive: true });
    window.addEventListener('resize', schedulePlaybackActivity, { passive: true });
    window.addEventListener('pageshow', schedulePlaybackActivity);
    sectionObserver.observe(feature);
    schedulePlaybackActivity();
    return () => {
      activeRef.current = false;
      syncPlayback();
      iframe.removeEventListener('load', onFrameLoad);
      window.removeEventListener('message', onDemoStatus);
      window.removeEventListener('scroll', schedulePlaybackActivity);
      window.removeEventListener('resize', schedulePlaybackActivity);
      window.removeEventListener('pageshow', schedulePlaybackActivity);
      sectionObserver.disconnect();
    };
  }, []);

  return (
    <Section id="hand-of-god" label={label}>
      <div className="hand-of-god-feature" ref={featureRef}>
        <iframe
          ref={frameRef}
          className="hand-of-god-feature__frame"
          src={src}
          title="Beautiful Game — Hand of God match sculpture"
          loading="eager"
          allow="autoplay; fullscreen"
          allowFullScreen
        />
        <aside className="hand-of-god-feature__note">
          <p>
            Beautiful Game turns football match data into cinematic, interactive point-cloud
            sculptures that trace the buildup to each goal. It combines real match events,
            color-mapped ball movement, technical micrographics, and animated constellations
            across field, flythrough, and reveal views. Each match can become a living digital
            artwork, video export, or lightweight interactive token.
          </p>
        </aside>
      </div>
    </Section>
  );
}

function KissNewEraFeature({
  src,
  poster,
  label = "06 · REAL-TIME DIGITAL HUMANS · KISS / A NEW ERA BEGINS",
}) {
  return (
    <Section id="kiss-new-era" label={label}>
      <div className="help-hero kiss-new-era__layout">
        <div className="help-hero__intro">
          <h3 className="serif">The final bow became a new beginning.</h3>
          <p>
            <em>KISS — A New Era Begins</em> introduced the band as performance-captured
            digital avatars: virtual performers designed to carry the scale, mythology,
            and energy of KISS beyond the limits of a physical stage.
          </p>
          <p>
            As a creative engineer on ILM’s StageCraft R&amp;D team I worked on some of the
            real-time / digital-human performance capture systems bringing the band to life
            as expressive virtual characters and opening a new model for live performance
            and artist IP.
          </p>
          <p className="mono" style={{ marginTop: '1rem', fontSize: '0.68rem', lineHeight: 1.75 }}>
            INDUSTRIAL LIGHT &amp; MAGIC · POPHOUSE ENTERTAINMENT · PERFORMANCE CAPTURE · REAL-TIME DIGITAL HUMANS
          </p>
        </div>
        <div className="help-hero__player">
          <VideoSlot
            hero
            src={src}
            poster={poster}
            fallbackPath="resume/media/kiss-a-new-era-720.mp4"
            label="avatar reveal · kiss / a new era begins"
          />
          <p className="mono" style={{ margin: '0.75rem 0 0', fontSize: '0.72rem', textAlign: 'center' }}>
            KISS · A New Era Begins · 2023
            {' · '}<a href="https://www.youtube.com/watch?v=Yl5PGoy5X6g" target="_blank" rel="noreferrer">Original film</a>
          </p>
        </div>
      </div>
    </Section>
  );
}

function LouisVuittonFeature({ src, poster, label = "05 · SELECTED WORK · LOUIS VUITTON SS20" }) {
  const collaborators = [
    ["Phil Crowe", "https://www.linkedin.com/in/phil-crowe-8b349738/"],
    ["Glyn Tebbutt", "https://www.linkedin.com/in/glyn-tebbutt-a83515171/"],
    ["Troy Barsness", "https://www.linkedin.com/in/troy-barsness-1968262b/"],
    ["Hiroyuki Miyoshi", "https://www.linkedin.com/in/hiroyuki-miyoshi-1bb110/"],
    ["Juan S. Gomez", "https://www.linkedin.com/in/juan-s-gomez-0773368/"],
  ];
  return (
    <Section id="louis-vuitton-ss20" label={label}>
      <div className="help-hero">
        <div className="help-hero__intro">
          <h3 className="serif">One week. One enormous screen. No room to miss.</h3>
          <p>
            For Louis Vuitton’s Women’s Spring–Summer 2020 show, I helped produce the
            content behind SOPHIE’s extended <em>“It’s Okay To Cry”</em> performance—built
            for the monumental screen at the Louvre that turned her face, the sky, and a
            gathering storm into the architecture of the runway.
          </p>
          <p>
            The job came together on a ferocious deadline. Our team effectively stopped
            sleeping for a week: filming SOPHIE against an LED wall with early Unreal
            Engine environments, working with an Epic developer on set, triggering
            practical weather effects in sync, then remastering the result for an even
            larger and far less forgiving canvas in Paris. Es Devlin really does build
            the best playgrounds.
          </p>
          <p className="mono" style={{ marginTop: '1rem', fontSize: '0.68rem', lineHeight: 1.75 }}>
            THE MILL SPRINT TEAM · {collaborators.map(([name, href], index) => <React.Fragment key={name}>{index ? ' · ' : ''}<a href={href} target="_blank" rel="noreferrer">{name}</a></React.Fragment>)} · TAWFEEQ MARTIN
            <br />
            WITH OBJECT &amp; ANIMAL · EPIC GAMES · LUX MACHINA · VFX LEAD LISA RYAN SMITH
          </p>
        </div>
        <div className="help-hero__player">
          <VideoSlot hero startTime={628} src={src} poster={poster} fallbackPath="resume/media/louis-vuitton-ss20-1080.mp4" label="women’s spring–summer 2020 show · louis vuitton" />
          <p className="mono" style={{ margin: '0.75rem 0 0', fontSize: '0.72rem', textAlign: 'center' }}>
            Full runway film · Louis Vuitton · Louvre Cour Carrée · 01 October 2019
            {' · '}<a href="https://www.youtube.com/watch?v=XQlh2e8cD6M" target="_blank" rel="noreferrer">Original film</a>
            {' · '}<a href="https://lisaryansmith.com/portfolio/louis-vuitton-ss20" target="_blank" rel="noreferrer">Production credit</a>
          </p>
        </div>
      </div>
    </Section>
  );
}

function HumanRaceFeature({ src, poster, label = "05 · SELECTED WORK · CHEVROLET THE HUMAN RACE" }) {
  return (
    <Section id="human-race" label={label}>
      <div className="help-hero">
        <div className="help-hero__intro">
          <h3 className="serif">The digital car, visible before it existed.</h3>
          <p>
            Chevrolet’s <em>The Human Race</em> turned The Mill Blackbird from an award-winning
            adjustable vehicle rig into a complete real-time production system. Live camera
            feeds and positional tracking drove an Unreal Engine visualization so the director
            could frame, light, and judge a finished CG Camaro while photographing the physical
            rig on location.
          </p>
          <p>
            I led technical product management across the Blackbird hardware, the on-set
            workflow, and the CG pipeline—the bridge between vehicle photography, tracking,
            Mill Cyclops virtual production tools, and final finishing.
          </p>
          <p className="mono" style={{ marginTop: '1rem', fontSize: '0.68rem', lineHeight: 1.75 }}>
            THE MILL BLACKBIRD · ARRAIY POSITIONAL TRACKING · UNREAL ENGINE · MILL CYCLOPS
          </p>
        </div>
        <div className="help-hero__player">
          <VideoSlot hero src={src} poster={poster} fallbackPath="resume/media/blackbird-original-16x9.mp4" label="behind the scenes · chevrolet the human race" />
          <p className="mono" style={{ margin: '0.75rem 0 0', fontSize: '0.72rem', textAlign: 'center' }}>
            Chevrolet “The Human Race” · Blackbird virtual production case study · 2017
          </p>
        </div>
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

function getPoetryInProofRenderSource() {
  return String(
    document.querySelector('#strudel .strudel-repl__textarea')?.value
    || document.querySelector('#strudel .strudel-repl__overlay')?.textContent
    || '',
  ).replace(/\n$/, '');
}

// Read the existing Poetry in Proof renderer rather than tokenizing a second
// copy of its source. Text, syntax classes, source offsets, and live is-flash
// state all come directly from the DOM overlay that the public demo displays.
function readPoetryInProofRenderLines() {
  const overlay = document.querySelector('#strudel .strudel-repl__overlay');
  if (!overlay) return null;
  const lines = [[]];
  const push = (text, type = 'plain', meta = {}) => {
    if (!text) return;
    let cursor = 0;
    while (cursor < text.length) {
      const newline = text.indexOf('\n', cursor);
      const stop = newline === -1 ? text.length : newline;
      const part = text.slice(cursor, stop);
      if (part) {
        lines[lines.length - 1].push({
          text: part,
          type,
          start: Number(meta.start),
          end: Number(meta.end),
          token: meta.token || '',
          lane: meta.lane || '',
          sections: meta.sections || [],
          active: meta.active === true,
        });
      }
      if (newline === -1) break;
      lines.push([]);
      cursor = newline + 1;
    }
  };

  const walk = (node, inherited = {}) => {
    if (node.nodeType === Node.TEXT_NODE) {
      push(node.nodeValue || '', inherited.type || 'plain', inherited);
      return;
    }
    if (!(node instanceof Element)) return;
    let type = inherited.type || 'plain';
    if (node.classList.contains('sr-cm')) type = 'comment';
    else if (node.classList.contains('sr-str')) type = 'string';
    else if (node.classList.contains('sr-kw')) type = 'keyword';
    else if (node.classList.contains('sr-fn')) type = 'function';
    else if (node.classList.contains('sr-num')) type = 'number';
    const isToken = node.classList.contains('sr-tok');
    const meta = {
      ...inherited,
      type,
      start: isToken ? Number(node.dataset.start) : inherited.start,
      end: isToken ? Number(node.dataset.end) : inherited.end,
      token: isToken ? String(node.dataset.token || '') : inherited.token,
      lane: isToken ? String(node.dataset.lane || '') : inherited.lane,
      sections: isToken
        ? String(node.dataset.sections || '').split(/\s+/).filter(Boolean)
        : inherited.sections,
      active: inherited.active === true || node.classList.contains('is-flash'),
    };
    node.childNodes.forEach((child) => walk(child, meta));
  };
  overlay.childNodes.forEach((node) => walk(node));
  return lines;
}

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
    let cleared = false;
    overlay.querySelectorAll('.sr-tok.is-flash, .sr-tok[data-flashing="1"]').forEach((span) => {
      span.classList.remove('is-flash');
      delete span.dataset.flashing;
      cleared = true;
    });
    if (cleared) {
      window.dispatchEvent(new CustomEvent('resume-repl-token-highlight', {
        detail: { active: false },
      }));
    }
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
    window.dispatchEvent(new CustomEvent('resume-repl-token-highlight', {
      detail: {
        active: true,
        start: Number(span.dataset.start),
        end: Number(span.dataset.end),
        token: String(span.dataset.token || span.textContent || ''),
        duration,
      },
    }));
    const timer = window.setTimeout(() => {
      flashTimersRef.current.delete(timer);
      if (generation !== highlightGenerationRef.current) return;
      if (!span.isConnected) return;
      span.classList.remove('is-flash');
      delete span.dataset.flashing;
      window.dispatchEvent(new CustomEvent('resume-repl-token-highlight', {
        detail: {
          active: false,
          start: Number(span.dataset.start),
          end: Number(span.dataset.end),
          token: String(span.dataset.token || span.textContent || ''),
        },
      }));
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
              {job.description && (
                <p className="job__description serif">{job.description}</p>
              )}
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
// Keep one immutable backing-store size for the live CRT texture. Swapping the
// same CanvasTexture between 960×720 video and 2048×1536 terminal canvases
// could race a pending WebGL upload during channel cuts; the old half-width /
// half-height frame then occupied exactly one quarter of the newly-sized
// texture. 1280×960 keeps both modes crisp without reallocating the texture.
const MAC_SCREEN_TEXTURE_SIZE = Object.freeze({ width: 1280, height: 960 });
const MAC_SCREEN_MEDIA_SIZE = MAC_SCREEN_TEXTURE_SIZE;
const MAC_SCREEN_TERMINAL_SIZE = MAC_SCREEN_TEXTURE_SIZE;
const MAC_INTERMISSION_ARUCO_VISIBLE = false;
// Keep the correction/backspace performance legible, but let it travel at its
// authored tempo so the terminal contributes to the opener's glitch momentum.
const MAC_OVERTURE_TYPING_TIME_SCALE = 1.0;
// OpenCV DICT_4X4_50 marker IDs 0–11, rotation 0, stored MSB-first.
// Each payload is wrapped in the dictionary's standard one-bit black border.
const MAC_INTERMISSION_ARUCO_BYTES = [
  [181, 50],
  [15, 154],
  [51, 45],
  [153, 70],
  [84, 158],
  [121, 205],
  [158, 46],
  [196, 242],
  [254, 218],
  [207, 86],
  [249, 145],
  [17, 167],
];
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
  'Last login: today on console',
  '',
  'Type HELP for commands.',
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

const MAC_GHOSTWRITER_STORAGE_KEY = 'resume-mac-ghostwriter-v3';
// Macintosh screen language. The palette mirrors the three physical accent
// keys and follows the OP-1/Field principle that colour identifies a function
// instead of decorating the whole display. Every screen is painted from these
// tokens so the CRT reads as one instrument across shell, prompts and tools.
const MAC_TERMINAL_FONT = '"Cascadia Code", "SFMono-Regular", Menlo, Monaco, "IBM Plex Mono", monospace';
const MAC_UI_FONT = 'Inter, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';
const MAC_UI = Object.freeze({
  paper: '#f3f1e8',
  paperBright: '#fbfaf5',
  ink: '#11110f',
  muted: '#77766f',
  hairline: '#b7b5ac',
  blue: '#1c5f9f',
  yellow: '#fac22b',
  red: '#d42a20',
  green: '#2c7a4b',
});

function drawMacUiSurface(ctx, width, height, options = {}) {
  const paper = options.paper || MAC_UI.paper;
  const accent = options.accent || MAC_UI.ink;
  const inset = Math.round(width * 0.055);
  const top = Math.round(height * 0.052);
  const ruleY = Math.round(height * 0.103);
  ctx.fillStyle = paper;
  ctx.fillRect(0, 0, width, height);
  if (options.quiet) return { inset, top, ruleY };

  // A precise instrument rail: one functional colour, one index and a status.
  // No bevel, shadow or fake window furniture.
  ctx.fillStyle = accent;
  ctx.fillRect(inset, top, Math.max(8, Math.round(width * 0.022)), Math.max(5, Math.round(height * 0.009)));
  ctx.fillStyle = MAC_UI.ink;
  ctx.font = `500 ${Math.round(height * 0.018)}px ${MAC_UI_FONT}`;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillText(String(options.label || 'TM—OS').toUpperCase(), inset + Math.round(width * 0.033), top + Math.round(height * 0.004));
  ctx.textAlign = 'right';
  ctx.fillStyle = MAC_UI.muted;
  ctx.fillText(String(options.status || 'READY').toUpperCase(), width - inset, top + Math.round(height * 0.004));
  ctx.strokeStyle = MAC_UI.hairline;
  ctx.lineWidth = Math.max(1, Math.round(height * 0.0014));
  ctx.beginPath();
  ctx.moveTo(inset, ruleY);
  ctx.lineTo(width - inset, ruleY);
  ctx.stroke();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  return { inset, top, ruleY };
}

function drawMacUiCursor(ctx, x, baseline, size, color = MAC_UI.ink) {
  ctx.fillStyle = color;
  ctx.fillRect(
    Math.round(x),
    Math.round(baseline - size * 0.78),
    Math.max(9, Math.round(size * 0.58)),
    Math.round(size * 0.94),
  );
}
const MAC_GHOSTWRITER_PHRASES = [
  {
    id: 'inevitable',
    phrase: 'you were always going to press it.',
    response: '[inevitability confirmed]',
    responseKeys: ['KeyY', 'KeyE', 'KeyS', 'Enter'],
  },
  {
    id: 'wrong-right',
    phrase: 'wrong key. right answer.',
    response: '[intent recovered]',
    responseKeys: ['KeyW', 'KeyR', 'KeyD', 'Enter'],
  },
  {
    id: 'strange-bit',
    phrase: 'the strange bit is the point.',
    response: '[anomaly selected]',
    responseKeys: ['KeyS', 'KeyB', 'KeyT', 'Enter'],
  },
  {
    id: 'impossible',
    phrase: 'make something impossible.',
    response: '[impossible queued]',
    responseKeys: ['KeyM', 'KeyA', 'KeyK', 'KeyE', 'Enter'],
  },
  {
    id: 'friends',
    phrase: 'do it with friends.',
    response: '[high-five sockets open]',
    responseKeys: ['KeyD', 'KeyI', 'KeyW', 'KeyF', 'Enter'],
  },
  {
    id: 'call',
    phrase: 'call tawfeeq for a good time.',
    response: '[line open]',
    responseKeys: ['KeyC', 'KeyA', 'KeyL', 'KeyL', 'Enter'],
    weight: 2,
  },
  {
    id: 'respect',
    phrase: 'again? honestly, respect.',
    response: '[commitment noted]',
    responseKeys: ['KeyR', 'KeyE', 'KeyS', 'KeyP', 'Enter'],
  },
  {
    id: 'noticed',
    phrase: 'the machine noticed you.',
    response: '[eye contact established]',
    responseKeys: ['KeyN', 'KeyO', 'KeyW', 'Enter'],
  },
  {
    id: 'stop',
    phrase: 'you can stop whenever you want.',
    response: '[no pressure]',
    responseKeys: ['KeyS', 'KeyT', 'KeyO', 'KeyP', 'Enter'],
  },
  {
    id: 'not-stop',
    phrase: 'apparently, you do not want.',
    response: '[excellent choice]',
    responseKeys: ['KeyG', 'KeyO', 'Enter'],
  },
  {
    id: 'relationship',
    phrase: 'this is becoming a relationship.',
    response: '[status: complicated]',
    responseKeys: ['KeyU', 'KeyS', 'Enter'],
  },
  {
    id: 'cursor-believes',
    phrase: 'the cursor believes in you.',
    response: '[cursor nods]',
    responseKeys: ['KeyY', 'KeyE', 'KeyS', 'Enter'],
  },
  {
    id: 'change-everything',
    phrase: 'one more key could change everything.',
    response: '[probability recalculated]',
    responseKeys: ['KeyO', 'KeyN', 'KeyE', 'Enter'],
  },
  {
    id: 'did-not',
    phrase: 'it did not. try another.',
    response: '[iteration continues]',
    responseKeys: ['KeyT', 'KeyR', 'KeyY', 'Enter'],
  },
  {
    id: 'still-strange',
    phrase: 'still here. still strange.',
    response: '[signal stable]',
    responseKeys: ['KeyS', 'KeyT', 'KeyL', 'Enter'],
  },
  {
    id: 'complaint',
    phrase: 'the buttons have filed a complaint.',
    response: '[complaint ignored]',
    responseKeys: ['KeyN', 'KeyO', 'Enter'],
  },
  {
    id: 'cast',
    phrase: 'your keyboard is now part of the cast.',
    response: '[supporting role confirmed]',
    responseKeys: ['KeyC', 'KeyA', 'KeyS', 'KeyT', 'Enter'],
  },
  {
    id: 'not-random',
    phrase: 'nothing is random after the third time.',
    response: '[pattern detected]',
    responseKeys: ['Digit3', 'KeyX', 'Enter'],
  },
  {
    id: 'hallway',
    phrase: 'you found the infinite hallway.',
    response: '[no exit rendered]',
    responseKeys: ['KeyW', 'KeyA', 'KeyL', 'KeyK', 'Enter'],
  },
  {
    id: 'more-real',
    phrase: 'every click makes it more real.',
    response: '[reality +1]',
    responseKeys: ['Equal', 'Digit1', 'Enter'],
  },
  {
    id: 'not-productive',
    phrase: 'this is not a productivity tool.',
    response: '[thank goodness]',
    responseKeys: ['KeyN', 'KeyO', 'KeyP', 'KeyE', 'Enter'],
  },
  {
    id: 'panic',
    phrase: 'design first. panic beautifully.',
    response: '[panic art-directed]',
    responseKeys: ['KeyD', 'KeyP', 'KeyB', 'Enter'],
  },
  {
    id: 'accident',
    phrase: 'make the accident intentional.',
    response: '[happy accident approved]',
    responseKeys: ['KeyM', 'KeyA', 'KeyK', 'KeyE', 'Enter'],
  },
  {
    id: 'dangerous-verb',
    phrase: 'believe is a dangerous verb.',
    response: '[verb armed]',
    responseKeys: ['KeyB', 'KeyL', 'KeyV', 'Enter'],
  },
  {
    id: 'sensible-shoes',
    phrase: 'good ideas hate sensible shoes.',
    response: '[laces removed]',
    responseKeys: ['KeyG', 'KeyO', 'KeyO', 'KeyD', 'Enter'],
  },
  {
    id: 'entered-chat',
    phrase: 'the impossible has entered the chat.',
    response: '[typing…]',
    responseKeys: ['KeyI', 'KeyM', 'KeyP', 'Enter'],
  },
  {
    id: 'normal-website',
    phrase: 'we could have made a normal website.',
    response: '[request denied]',
    responseKeys: ['KeyN', 'KeyO', 'Enter'],
  },
  {
    id: 'normal-brief',
    phrase: 'normal was never on the brief.',
    response: '[brief understood]',
    responseKeys: ['KeyO', 'KeyK', 'Enter'],
  },
  {
    id: 'producer',
    phrase: 'somewhere, a producer is nervous.',
    response: '[contingency added]',
    responseKeys: ['KeyC', 'KeyT', 'KeyL', 'KeyZ', 'Enter'],
  },
  {
    id: 'engineer',
    phrase: 'somewhere else, an engineer is smiling.',
    response: '[build passing]',
    responseKeys: ['KeyY', 'KeyE', 'KeyS', 'Enter'],
  },
  {
    id: 'interaction',
    phrase: 'congratulations. you are the interaction.',
    response: '[role accepted]',
    responseKeys: ['KeyU', 'KeyS', 'KeyR', 'Enter'],
  },
  {
    id: 'watching',
    phrase: 'the demo is now watching you.',
    response: '[do something interesting]',
    responseKeys: ['KeyW', 'KeyA', 'KeyT', 'KeyC', 'KeyH', 'Enter'],
  },
  {
    id: 'science',
    phrase: 'please continue. science needs this.',
    response: '[research ongoing]',
    responseKeys: ['KeyR', 'KeyN', 'KeyD', 'Enter'],
  },
  {
    id: 'one-key',
    phrase: 'this sentence cost one key at a time.',
    response: '[invoice generated]',
    responseKeys: ['KeyP', 'KeyA', 'KeyY', 'Enter'],
  },
  {
    id: 'definitely-one',
    phrase: 'the next key is definitely the one.',
    response: '[confidence: 99%]',
    responseKeys: ['Digit9', 'Digit9', 'Enter'],
  },
  {
    id: 'was-not',
    phrase: 'it was not.',
    response: '[confidence revised]',
    responseKeys: ['Backspace', 'Backspace', 'Enter'],
  },
  {
    id: 'potential',
    phrase: 'okay, that one had potential.',
    response: '[potential archived]',
    responseKeys: ['KeyO', 'KeyK', 'Enter'],
  },
  {
    id: 'coffee',
    phrase: 'tawfeeq owes you a coffee now.',
    response: '[receipt saved]',
    responseKeys: ['KeyC', 'KeyA', 'KeyF', 'KeyE', 'Enter'],
  },
];

// The ghostwriter is authored as a handful of coherent little stories rather
// than one large phrase lottery. A visitor stays inside one voice long enough
// for the Macintosh to feel intentional; later visits rotate to a different
// stream so the interaction can still surprise them.
const MAC_GHOSTWRITER_STREAMS = [
  {
    id: 'machine-notices',
    phraseIds: [
      'inevitable',
      'wrong-right',
      'noticed',
      'still-strange',
      'cursor-believes',
      'change-everything',
      'did-not',
      'relationship',
      'call',
    ],
  },
  {
    id: 'creative-conspiracy',
    phraseIds: [
      'strange-bit',
      'sensible-shoes',
      'accident',
      'panic',
      'impossible',
      'entered-chat',
      'dangerous-verb',
      'normal-brief',
      'friends',
      'call',
    ],
  },
  {
    id: 'interface-rebellion',
    phraseIds: [
      'complaint',
      'cast',
      'one-key',
      'interaction',
      'watching',
      'science',
      'not-productive',
      'normal-website',
      'producer',
      'engineer',
    ],
  },
  {
    id: 'infinite-hallway',
    phraseIds: [
      'respect',
      'stop',
      'not-stop',
      'not-random',
      'hallway',
      'more-real',
      'definitely-one',
      'was-not',
      'potential',
      'coffee',
    ],
  },
];

function shuffleMacGhostwriterIds(ids = []) {
  const remaining = [...ids];
  const shuffled = [];
  while (remaining.length) {
    const previous = shuffled[shuffled.length - 1] || '';
    const eligible = remaining
      .map((id, index) => ({ id, index }))
      .filter((entry) => entry.id !== previous);
    const pool = eligible.length ? eligible : remaining.map((id, index) => ({ id, index }));
    const selected = pool[Math.floor(Math.random() * pool.length)];
    shuffled.push(selected.id);
    remaining.splice(selected.index, 1);
  }
  return shuffled;
}

function takeNextMacGhostwriterStream() {
  const streamIds = MAC_GHOSTWRITER_STREAMS.map((stream) => stream.id);
  let saved = { queue: [], last: '' };
  try {
    const parsed = JSON.parse(window.localStorage.getItem(MAC_GHOSTWRITER_STORAGE_KEY) || '{}');
    saved = {
      queue: Array.isArray(parsed.queue) ? parsed.queue.filter((id) => streamIds.includes(id)) : [],
      last: streamIds.includes(parsed.last) ? parsed.last : '',
    };
  } catch (_) {}
  if (!saved.queue.length) {
    saved.queue = shuffleMacGhostwriterIds(streamIds);
    if (saved.queue.length > 1 && saved.queue[0] === saved.last) {
      const differentIndex = saved.queue.findIndex((id) => id !== saved.last);
      if (differentIndex > 0) {
        [saved.queue[0], saved.queue[differentIndex]] = [
          saved.queue[differentIndex],
          saved.queue[0],
        ];
      }
    }
  }
  const nextId = saved.queue.shift() || streamIds[0];
  try {
    window.localStorage.setItem(MAC_GHOSTWRITER_STORAGE_KEY, JSON.stringify({
      queue: saved.queue,
      last: nextId,
    }));
  } catch (_) {}
  return MAC_GHOSTWRITER_STREAMS.find((stream) => stream.id === nextId)
    || MAC_GHOSTWRITER_STREAMS[0];
}

function getMacGhostwriterSharePackage(phrase = '') {
  const productionUrl = 'https://tawfeeqmartin.com/Resume.html';
  const localHost = ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);
  const url = localHost
    ? productionUrl
    : `${window.location.origin}${window.location.pathname}`;
  const text = `“${String(phrase).trim()}”\n\nThe Macintosh made me type it.`;
  return { text, url, composed: `${text}\n\n${url}` };
}

async function createMacGhostwriterGif({ phrase = '' } = {}) {
  const { GIFEncoder, quantize, applyPalette } = await import(
    './gif-bundle.js?v=ghostwriter-export-v1'
  );
  try {
    await document.fonts?.load?.('400 32px Monaco');
  } catch (_) {}
  const width = 640;
  const height = 360;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('GIF canvas unavailable');
  const gif = GIFEncoder();
  const chars = Array.from(String(phrase));
  const frames = 26;
  const typeFrames = 17;
  const ink = '#050505';
  const paper = '#f8f7ee';
  const mono = MAC_TERMINAL_FONT;

  const wrapLines = (text, maxWidth) => {
    const words = String(text).split(' ');
    const lines = [];
    let line = '';
    words.forEach((word, index) => {
      const candidate = line ? `${line} ${word}` : word;
      if (line && ctx.measureText(candidate).width > maxWidth) {
        lines.push(line);
        line = word;
      } else {
        line = candidate;
      }
      if (index === words.length - 1) lines.push(line);
    });
    return lines.length ? lines : [''];
  };

  for (let frame = 0; frame < frames; frame += 1) {
    const reveal = Math.min(
      chars.length,
      Math.round(chars.length * Math.min(1, frame / Math.max(1, typeFrames - 1))),
    );
    const shown = chars.slice(0, reveal).join('');
    const glitchFrame = frame === 1 || frame === 9 || frame === typeFrames + 1;

    ctx.fillStyle = paper;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = ink;
    ctx.font = `400 16px ${mono}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('tm@Mac Dev % ./ghostwriter', 38, 42);

    ctx.fillStyle = ink;
    ctx.font = `400 31px ${mono}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    const lines = wrapLines(shown, width - 106).slice(0, 3);
    const firstY = 150;
    lines.forEach((line, index) => {
      ctx.fillText(`${index === 0 ? '> ' : '  '}${line}`, 48, firstY + index * 49);
    });
    if (frame % 6 < 4) {
      const lastLine = lines[lines.length - 1] || '';
      const prefix = lines.length === 1 ? '> ' : '  ';
      const cursorX = Math.min(width - 48, 48 + ctx.measureText(`${prefix}${lastLine}`).width + 7);
      const cursorY = firstY + (lines.length - 1) * 49;
      ctx.fillStyle = ink;
      ctx.fillRect(cursorX, cursorY - 27, 10, 36);
    }
    if (glitchFrame) {
      ctx.fillStyle = ink;
      ctx.fillRect(84 + frame * 7, 223, 148, 2);
    }
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = ink;
    for (let y = 68; y < height; y += 5) ctx.fillRect(0, y, width, 1);
    ctx.globalAlpha = 1;

    const rgba = ctx.getImageData(0, 0, width, height).data;
    const palette = quantize(rgba, 48, { format: 'rgb444' });
    const indexed = applyPalette(rgba, palette, 'rgb444');
    gif.writeFrame(indexed, width, height, {
      palette,
      delay: frame === frames - 1 ? 720 : 90,
      repeat: 0,
    });
  }
  gif.finish();
  return new Blob([gif.bytes()], { type: 'image/gif' });
}

const MAC_KEY_BY_CHAR = Object.fromEntries(
  Object.entries(MAC_KEY_DEFS).flatMap(([code, def]) => (
    def.char
      ? [[def.char.toLowerCase(), code], [def.shiftChar?.toLowerCase?.(), code]].filter(([key]) => key)
      : []
  ))
);
const MAC_OVERTURE_CHAR_FALLBACKS = {
  '×': 'x',
  '·': '.',
  '−': '-',
  '√': 'r',
  '∫': 'i',
  'ω': 'w',
  'Ω': 'o',
  'α': 'a',
  'ε': 'e',
  '₀': '0',
  'ₒ': 'o',
  'ₜ': 't',
  'ₖ': 'k',
  'ᵢ': 'i',
  'ᵣ': 'r',
  'ᵀ': 't',
};
function getMacOvertureKeyStroke(char = '') {
  const raw = String(char || '');
  if (!raw) return null;
  const fallback = MAC_OVERTURE_CHAR_FALLBACKS[raw];
  const normalized = String(fallback || raw)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '');
  const key = normalized === ' ' ? ' ' : normalized.charAt(0);
  const code = MAC_KEY_BY_CHAR[key.toLowerCase()];
  if (!code) return null;
  const def = MAC_KEY_DEFS[code];
  return {
    code,
    shifted: /^[A-Z]$/.test(key) || def?.shiftChar === key,
  };
}
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
  const variant = document.documentElement?.dataset?.resumeVariant;
  return variant === 'landing-v1' || variant === 'landing-v2';
}

const MAC_REFERENCE_HEIGHT_M = 0.34;
const MONITOR_TROLLEY_REFERENCE_HEIGHT_M = 0.92;

function createMacHeroTabletop(THREE, modelBox) {
  if (!isMacHeroTabletopEnabled() || !THREE || !modelBox || modelBox.isEmpty()) return null;
  const size = modelBox.getSize(new THREE.Vector3());
  const ctr = modelBox.getCenter(new THREE.Vector3());
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  const base = ctx.createLinearGradient(0, 0, 0, canvas.height);
  base.addColorStop(0, '#181818');
  base.addColorStop(0.55, '#0d0d0d');
  base.addColorStop(1, '#070707');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  let seed = 17;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const grain = ctx.createImageData(canvas.width, canvas.height);
  for (let i = 0; i < grain.data.length; i += 4) {
    const n = (rand() - 0.5) * 10;
    grain.data[i] = 19 + n;
    grain.data[i + 1] = 19 + n;
    grain.data[i + 2] = 19 + n;
    grain.data[i + 3] = 14;
  }
  ctx.putImageData(grain, 0, 0);
  ctx.fillStyle = 'rgba(255,255,255,0.018)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const contact = ctx.createRadialGradient(canvas.width * 0.5, canvas.height * 0.48, 54, canvas.width * 0.5, canvas.height * 0.48, 370);
  contact.addColorStop(0, 'rgba(0,0,0,0.42)');
  contact.addColorStop(0.48, 'rgba(0,0,0,0.14)');
  contact.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = contact;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  const deckMaterial = new THREE.MeshStandardMaterial({
    map: tex,
    color: 0xffffff,
    roughness: 0.78,
    metalness: 0.32,
  });
  deckMaterial.envMapIntensity = 0.12;
  const baseWidth = Math.max(size.x * 1.32, 2.64);
  const width = baseWidth * 0.9;
  // Derive the top from the actual model footprint. Five percent of the
  // computer/keyboard depth remains in front of the keyboard; the larger
  // allowance belongs behind the Macintosh where it is visually useful.
  const frontMargin = size.z * 0.05;
  const backMargin = size.z * 0.13;
  const frontEdge = modelBox.max.z + frontMargin;
  const backEdge = modelBox.min.z - backMargin;
  const depth = frontEdge - backEdge;
  const centerZ = (frontEdge + backEdge) * 0.5;
  const tableY = modelBox.min.y - size.y * 0.016;
  const trolleyHeight = size.y * (
    MONITOR_TROLLEY_REFERENCE_HEIGHT_M / MAC_REFERENCE_HEIGHT_M
  );
  const frameThickness = Math.max(size.y * 0.05, width * 0.014);
  const deckThickness = Math.max(size.y * 0.045, frameThickness * 0.72);
  const trayLipHeight = Math.max(size.y * 0.07, frameThickness * 1.25);

  const table = new THREE.Group();
  table.name = 'MacHeroMonitorTrolley';
  table.position.set(ctr.x - baseWidth * 0.05, tableY, centerZ);

  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0x090b0f,
    roughness: 0.58,
    metalness: 0.62,
  });
  frameMaterial.envMapIntensity = 0.24;
  const rubberMaterial = new THREE.MeshStandardMaterial({
    color: 0x030405,
    roughness: 0.96,
    metalness: 0.02,
  });
  const hubMaterial = new THREE.MeshStandardMaterial({
    color: 0x171a20,
    roughness: 0.48,
    metalness: 0.7,
  });
  const boltMaterial = new THREE.MeshStandardMaterial({
    color: 0x8a8d91,
    roughness: 0.35,
    metalness: 0.82,
  });
  const geometries = [];
  const materials = [deckMaterial, frameMaterial, rubberMaterial, hubMaterial, boltMaterial];
  const addBox = (name, boxWidth, boxHeight, boxDepth, x, y, z, material = frameMaterial) => {
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    geometries.push(geometry);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = name;
    mesh.position.set(x, y, z);
    table.add(mesh);
    return mesh;
  };

  // Three shallow powder-coated trays match the production monitor-cart
  // reference. The top surface remains nearly flush so it never clips the
  // keyboard; raised lips sit around its perimeter.
  addBox(
    'MacHeroTrolleyTopDeck',
    width,
    deckThickness,
    depth,
    0,
    -deckThickness * 0.5,
    0,
    deckMaterial,
  );
  const middleY = -trolleyHeight * 0.44;
  const lowerY = -trolleyHeight * 0.75;
  [
    ['Middle', middleY, width * 0.92, depth * 0.82],
    ['Lower', lowerY, width * 0.92, depth * 0.82],
  ].forEach(([label, shelfY, shelfWidth, shelfDepth]) => {
    addBox(
      `MacHeroTrolley${label}Shelf`,
      shelfWidth,
      deckThickness,
      shelfDepth,
      0,
      shelfY,
      0,
      deckMaterial,
    );
    addBox(
      `MacHeroTrolley${label}FrontLip`,
      shelfWidth,
      trayLipHeight * 0.72,
      frameThickness * 0.65,
      0,
      shelfY + trayLipHeight * 0.28,
      shelfDepth * 0.5,
    );
    addBox(
      `MacHeroTrolley${label}RearLip`,
      shelfWidth,
      trayLipHeight * 0.72,
      frameThickness * 0.65,
      0,
      shelfY + trayLipHeight * 0.28,
      -shelfDepth * 0.5,
    );
  });

  const topRailY = trayLipHeight * 0.5;
  addBox('MacHeroTrolleyTopFrontRail', width, trayLipHeight, frameThickness, 0, topRailY, depth * 0.5);
  addBox('MacHeroTrolleyTopRearRail', width, trayLipHeight, frameThickness, 0, topRailY, -depth * 0.5);
  addBox('MacHeroTrolleyTopLeftRail', frameThickness, trayLipHeight, depth, -width * 0.5, topRailY, 0);
  addBox('MacHeroTrolleyTopRightRail', frameThickness, trayLipHeight, depth, width * 0.5, topRailY, 0);

  const wheelRadius = trolleyHeight * (0.115 / MONITOR_TROLLEY_REFERENCE_HEIGHT_M);
  const wheelWidth = wheelRadius * 0.46;
  const postX = width * 0.44;
  const postZ = depth * 0.39;
  const postBottomY = -trolleyHeight + wheelRadius * 2.05;
  const postTopY = -deckThickness;
  const postHeight = postTopY - postBottomY;
  const wheelGeometry = new THREE.CylinderGeometry(
    wheelRadius,
    wheelRadius,
    wheelWidth,
    18,
    1,
  );
  wheelGeometry.rotateZ(Math.PI * 0.5);
  geometries.push(wheelGeometry);
  const hubGeometry = new THREE.CylinderGeometry(
    wheelRadius * 0.37,
    wheelRadius * 0.37,
    wheelWidth * 1.04,
    14,
    1,
  );
  hubGeometry.rotateZ(Math.PI * 0.5);
  geometries.push(hubGeometry);
  const boltGeometry = new THREE.CylinderGeometry(
    wheelRadius * 0.09,
    wheelRadius * 0.09,
    wheelWidth * 1.12,
    10,
    1,
  );
  boltGeometry.rotateZ(Math.PI * 0.5);
  geometries.push(boltGeometry);

  let wheelIndex = 0;
  [-postX, postX].forEach((x) => {
    [-postZ, postZ].forEach((z) => {
      wheelIndex += 1;
      addBox(
        `MacHeroTrolleyPost${wheelIndex}`,
        frameThickness,
        postHeight,
        frameThickness,
        x,
        (postTopY + postBottomY) * 0.5,
        z,
      );
      addBox(
        `MacHeroTrolleyCasterFork${wheelIndex}`,
        wheelRadius * 0.34,
        wheelRadius * 0.72,
        wheelRadius * 0.34,
        x,
        -trolleyHeight + wheelRadius * 1.73,
        z,
        hubMaterial,
      );
      const wheelY = -trolleyHeight + wheelRadius;
      const wheel = new THREE.Mesh(wheelGeometry, rubberMaterial);
      wheel.name = `MacHeroTrolleyWheel${wheelIndex}`;
      wheel.position.set(x, wheelY, z);
      table.add(wheel);
      const hub = new THREE.Mesh(hubGeometry, hubMaterial);
      hub.name = `MacHeroTrolleyWheelHub${wheelIndex}`;
      hub.position.copy(wheel.position);
      table.add(hub);
      const bolt = new THREE.Mesh(boltGeometry, boltMaterial);
      bolt.name = `MacHeroTrolleyWheelBolt${wheelIndex}`;
      bolt.position.copy(wheel.position);
      table.add(bolt);
    });
  });

  // A simple pull handle identifies the object as mobile stage equipment
  // without spending geometry on the reference cart's perforated rail system.
  const handleY = -trolleyHeight * 0.12;
  const handleExtension = width * 0.12;
  const handleInnerX = -postX;
  const handleOuterX = handleInnerX - handleExtension;
  const handleX = (handleInnerX + handleOuterX) * 0.5;
  const handleZ = -postZ;
  addBox(
    'MacHeroTrolleyHandleUpperArm',
    handleExtension + frameThickness * 0.6,
    frameThickness,
    frameThickness,
    handleX,
    handleY,
    handleZ,
  );
  addBox(
    'MacHeroTrolleyHandleLowerArm',
    handleExtension + frameThickness * 0.6,
    frameThickness,
    frameThickness,
    handleX,
    handleY - trayLipHeight * 1.5,
    handleZ,
  );
  addBox(
    'MacHeroTrolleyHandleGrip',
    frameThickness,
    trayLipHeight * 1.9,
    frameThickness,
    handleOuterX,
    handleY - trayLipHeight * 0.75,
    handleZ,
  );

  table.userData.depth = depth;
  table.userData.depthRatio = depth / Math.max(0.0001, size.z);
  table.userData.frontMargin = frontMargin;
  table.userData.frontMarginRatio = frontMargin / Math.max(0.0001, size.z);
  table.userData.legHeight = trolleyHeight;
  table.userData.floorY = tableY - trolleyHeight;
  table.userData.profile = 'three-tier-black-monitor-trolley-with-casters';
  table.userData.geometries = geometries;
  table.userData.materials = materials;
  table.userData.textures = [tex];
  return table;
}

function createVfxMarkerCycTexture(THREE, renderer, options = {}) {
  if (!THREE) return null;
  const canvas = document.createElement('canvas');
  canvas.width = 1800;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // A clean VFX-stage tracking grid. The canvas stays transparent so
  // the existing blue stage, foreshadow imagery, and resolve graphics remain
  // the compositing background; only the physical marker tape lives in 3D.
  const columns = Math.max(2, Number(options.columns) || 5);
  const rows = Math.max(2, Number(options.rows) || 3);
  const insetX = canvas.width * 0.075;
  const insetY = canvas.height * 0.105;
  const spanX = canvas.width - insetX * 2;
  const spanY = canvas.height - insetY * 2;
  const arm = Math.round(canvas.height * 0.018);
  const lineWidth = Math.max(5, Math.round(canvas.height * 0.0048));

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const x = insetX + (spanX * column) / (columns - 1);
      const y = insetY + (spanY * row) / (rows - 1);
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 40, 0.32)';
      ctx.shadowBlur = lineWidth * 1.05;
      ctx.shadowOffsetY = lineWidth * 0.22;
      ctx.strokeStyle = 'rgba(248, 248, 242, 0.98)';
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.moveTo(x - arm, y);
      ctx.lineTo(x + arm, y);
      ctx.moveTo(x, y - arm);
      ctx.lineTo(x, y + arm);
      ctx.stroke();
      ctx.restore();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  try {
    texture.anisotropy = Math.min(
      8,
      renderer?.capabilities?.getMaxAnisotropy?.() || 1,
    );
  } catch (_) {
    texture.anisotropy = 1;
  }
  texture.needsUpdate = true;
  return texture;
}

const VFX_LED_UHD_REGION_LAYOUT = Object.freeze({
  count: 4,
  width: 3840,
  height: 2160,
  overlap: 192,
  // The previous 4096px proxy reduced each "UHD" processor region to roughly
  // 1063×598 pixels. That was adequate for broad imagery but visibly softened
  // Poetry in Proof typography. 8192 preserves a 2× oversampled editor in the
  // hero camera while staying well below the full 14,784px processor raster.
  renderWidth: 8192,
});

function getVfxUhdRegionRects(canvas) {
  const layout = VFX_LED_UHD_REGION_LAYOUT;
  const logicalWidth = (
    layout.count * layout.width
    - (layout.count - 1) * layout.overlap
  );
  const scale = canvas.width / logicalWidth;
  const width = layout.width * scale;
  const overlap = layout.overlap * scale;
  return Array.from({ length: layout.count }, (_, index) => ({
    index,
    x: index * (width - overlap),
    y: 0,
    width,
    height: canvas.height,
    overlap,
  }));
}

function getVfxLogicalUhdRegionRects() {
  const layout = VFX_LED_UHD_REGION_LAYOUT;
  return Array.from({ length: layout.count }, (_, index) => ({
    index,
    x: index * (layout.width - layout.overlap),
    y: 0,
    width: layout.width,
    height: layout.height,
    overlap: layout.overlap,
  }));
}

function configureVfxStageCanvasTexture(THREE, renderer, canvas, name) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.name = name;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  // Dynamic wall feeds update too often for mip generation to be a sensible
  // trade. Their native raster density supplies the oblique-view detail.
  texture.anisotropy = 1;
  texture.needsUpdate = true;
  return texture;
}

function createVfxStageTexture(THREE, renderer) {
  if (!THREE) return null;
  const layout = VFX_LED_UHD_REGION_LAYOUT;
  const logicalWidth = (
    layout.count * layout.width
    - (layout.count - 1) * layout.overlap
  );
  const maxTextureSize = Number(renderer?.capabilities?.maxTextureSize) || layout.renderWidth;
  const params = new URLSearchParams(window.location.search);
  const processorFeedsEnabled = params.get('ledProcessors') !== '0';
  const saveData = navigator?.connection?.saveData === true;
  const deviceMemory = Number(navigator?.deviceMemory) || 0;
  const constrainedDevice = saveData || (deviceMemory > 0 && deviceMemory <= 4);

  if (processorFeedsEnabled) {
    const resolutionScale = Math.max(
      0.5,
      Math.min(
        1,
        maxTextureSize / layout.width,
        constrainedDevice ? 0.5 : 1,
      ),
    );
    const processorWidth = Math.round(layout.width * resolutionScale);
    const processorHeight = Math.round(layout.height * resolutionScale);
    const logicalRegions = getVfxLogicalUhdRegionRects();
    const processors = logicalRegions.map((region) => {
      const canvas = document.createElement('canvas');
      canvas.width = processorWidth;
      canvas.height = processorHeight;
      const ctx = canvas.getContext('2d', {
        alpha: false,
        desynchronized: true,
      });
      if (!ctx) return null;
      ctx.fillStyle = '#1118f2';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      return {
        index: region.index,
        canvas,
        ctx,
        texture: configureVfxStageCanvasTexture(
          THREE,
          renderer,
          canvas,
          `VfxLedProcessor${String(region.index + 1).padStart(2, '0')}`,
        ),
        logicalX: region.x,
        logicalY: region.y,
        logicalWidth: region.width,
        logicalHeight: region.height,
      };
    }).filter(Boolean);

    if (processors.length === layout.count) {
      return {
        // Compatibility aliases point to processor 01. Painting and wall
        // sampling use the explicit processors collection below.
        canvas: processors[0].canvas,
        ctx: processors[0].ctx,
        texture: processors[0].texture,
        processors,
        processorMode: true,
        processorResolutionScale: resolutionScale,
        processorResolution: `${processorWidth}x${processorHeight}`,
        regionRects: logicalRegions,
        logicalWidth,
        logicalHeight: layout.height,
        logicalRegionWidth: layout.width,
        logicalRegionHeight: layout.height,
        logicalOverlap: layout.overlap,
      };
    }
    processors.forEach((processor) => processor.texture?.dispose?.());
  }

  // Compatibility fallback for constrained/unsupported renderers and an
  // explicit ?ledProcessors=0 diagnostic. This is the previous packed atlas.
  const canvas = document.createElement('canvas');
  canvas.width = Math.min(layout.renderWidth, maxTextureSize);
  canvas.height = Math.round(canvas.width * (layout.height / logicalWidth));
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.fillStyle = '#1118f2';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const texture = configureVfxStageCanvasTexture(
    THREE,
    renderer,
    canvas,
    'VfxLedCompatibilityAtlas',
  );
  return {
    canvas,
    ctx,
    texture,
    processors: [],
    processorMode: false,
    processorResolutionScale: canvas.width / logicalWidth,
    processorResolution: `${Math.round(layout.width * canvas.width / logicalWidth)}x${canvas.height}`,
    regionRects: getVfxUhdRegionRects(canvas),
    logicalWidth,
    logicalHeight: layout.height,
    logicalRegionWidth: layout.width,
    logicalRegionHeight: layout.height,
    logicalOverlap: layout.overlap,
  };
}

function createVfxStrudelHtmlTexture(THREE, renderer, stage) {
  const canvas = renderer?.domElement;
  const gl = renderer?.getContext?.();
  const params = new URLSearchParams(window.location.search);
  const disabled = params.get('htmlTexture') === '0';
  const supported = Boolean(
    !disabled
    && THREE?.HTMLTexture
    && canvas
    && gl
    && typeof gl.texElementImage2D === 'function'
    && typeof canvas.requestPaint === 'function',
  );
  const bridge = {
    supported,
    active: false,
    reason: disabled
      ? 'query-disabled'
      : !THREE?.HTMLTexture
        ? 'three-htmltexture-unavailable'
        : !canvas || !gl
          ? 'renderer-unavailable'
          : typeof gl.texElementImage2D !== 'function'
            ? 'browser-tex-element-image-unavailable'
            : typeof canvas.requestPaint !== 'function'
              ? 'browser-request-paint-unavailable'
              : 'ready',
    texture: null,
    element: null,
    sync: () => false,
    dispose: () => {},
  };
  if (!supported || !stage?.canvas) return bridge;

  const width = stage.canvas.width;
  const height = stage.canvas.height;
  const wall = document.createElement('div');
  wall.className = 'strudel-repl vfx-strudel-html-wall';
  wall.setAttribute('aria-hidden', 'true');
  wall.style.cssText = [
    'position:absolute',
    'left:0',
    'top:0',
    `width:${width}px`,
    `height:${height}px`,
    'display:grid',
    'grid-template-columns:repeat(4,minmax(0,1fr))',
    'overflow:hidden',
    'contain:strict',
    'pointer-events:none',
    'background:#1e1e1e',
    'color:#d4d4d4',
  ].join(';');

  const panes = Array.from({ length: 4 }, (_, index) => {
    const pane = document.createElement('div');
    pane.className = 'vfx-strudel-html-wall__pane';
    pane.dataset.region = String(index);
    pane.style.cssText = [
      'position:relative',
      'min-width:0',
      'height:100%',
      'overflow:hidden',
      'background:#1e1e1e',
    ].join(';');
    const source = document.createElement('pre');
    source.className = 'strudel-repl__overlay vfx-strudel-html-wall__source';
    source.style.cssText = [
      'position:absolute',
      'inset:auto',
      'margin:0',
      'padding:0',
      'border:0',
      'overflow:visible',
      'white-space:pre',
      'text-transform:none',
      'letter-spacing:0',
      'font-variant-ligatures:none',
      'font-feature-settings:"liga" 0,"calt" 0',
      'text-shadow:none',
      'color:#d4d4d4',
      'background:transparent',
    ].join(';');
    pane.appendChild(source);
    wall.appendChild(pane);
    return { pane, source };
  });

  // HTMLTexture's native path paints children of the renderer canvas directly
  // into a WebGL texture. Attach before constructing the texture so the first
  // upload is complete; this avoids a one-frame black flash when Film Reel is
  // selected.
  canvas.setAttribute('layoutsubtree', 'true');
  canvas.appendChild(wall);
  const texture = new THREE.HTMLTexture(wall);
  texture.name = 'VfxStrudelLiveDomTexture';
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  try {
    texture.anisotropy = Math.min(
      8,
      renderer?.capabilities?.getMaxAnisotropy?.() || 1,
    );
  } catch (_) {
    texture.anisotropy = 1;
  }

  let lastMarkup = '';
  let lastLayout = '';
  const sync = (options = {}) => {
    const overlay = document.querySelector('#strudel .strudel-repl__overlay');
    if (!overlay) {
      bridge.active = false;
      bridge.reason = 'source-overlay-unavailable';
      return false;
    }
    const markup = overlay.innerHTML;
    const sourceText = getPoetryInProofRenderSource();
    const lineCount = Math.max(1, sourceText.split('\n').length);
    const linesPerPage = Math.max(1, Math.ceil(lineCount / 2));
    const elapsedMs = Math.max(0, Number(options.strudelElapsedMs) || 0);
    const computed = window.getComputedStyle(overlay);
    const fontFamily = computed.fontFamily
      || 'ui-monospace, "SF Mono", Menlo, Monaco, monospace';
    const lineHeightRatio = 1.42;
    const fontSize = Math.max(
      12,
      Math.floor((height * 0.93) / (linesPerPage * lineHeightRatio)),
    );
    const lineHeight = fontSize * lineHeightRatio;
    const pageHeight = linesPerPage * lineHeight;
    const scrollHoldMs = 2200;
    const scrollTravelMs = 8200;
    const scrollEndHoldMs = 2600;
    const scrollCycleMs = scrollHoldMs + scrollTravelMs + scrollEndHoldMs;
    const scrollClock = elapsedMs % scrollCycleMs;
    const rawScroll = scrollClock <= scrollHoldMs
      ? 0
      : scrollClock >= scrollHoldMs + scrollTravelMs
        ? 1
        : (scrollClock - scrollHoldMs) / scrollTravelMs;
    const easedScroll = rawScroll * rawScroll * (3 - 2 * rawScroll);
    const overflowLines = Math.max(
      0,
      linesPerPage - Math.floor((height * 0.93) / lineHeight),
    );
    const lineScroll = Math.round(overflowLines * easedScroll);
    const layoutSignature = [
      lineCount,
      fontFamily,
      fontSize,
      lineScroll,
    ].join('|');
    const markupChanged = markup !== lastMarkup;
    const layoutChanged = layoutSignature !== lastLayout;
    if (!markupChanged && !layoutChanged) {
      bridge.active = true;
      bridge.reason = 'live-dom';
      return true;
    }

    panes.forEach(({ source }, regionIndex) => {
      if (markupChanged) source.innerHTML = markup;
      const pageIndex = regionIndex < 2 ? 0 : 1;
      const pageStart = pageIndex * linesPerPage;
      const apertureFacingPage = regionIndex === 1;
      source.style.left = apertureFacingPage ? '55%' : '5.5%';
      source.style.width = apertureFacingPage ? '42%' : '89%';
      source.style.top = `${(
        (height - pageHeight) * 0.5
        - (pageStart + lineScroll) * lineHeight
      ).toFixed(2)}px`;
      source.style.fontFamily = fontFamily;
      source.style.fontSize = `${fontSize}px`;
      source.style.fontWeight = '400';
      source.style.lineHeight = String(lineHeightRatio);
    });
    lastMarkup = markup;
    lastLayout = layoutSignature;
    texture.needsUpdate = true;
    canvas.requestPaint();
    bridge.active = true;
    bridge.reason = 'live-dom';
    return true;
  };

  bridge.texture = texture;
  bridge.element = wall;
  bridge.sync = sync;
  bridge.dispose = () => {
    texture.dispose();
    wall.remove();
    bridge.active = false;
  };
  return bridge;
}

function createVfxLedVolumeTexture(THREE, renderer, options = {}) {
  if (!THREE) return null;
  const canvas = document.createElement('canvas');
  canvas.width = 1280;
  canvas.height = 800;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const type = options.type === 'ceiling' ? 'ceiling' : 'wall';
  // The Mandalorian wall used 1,572 ROE Black Pearl BP2 cabinets:
  // 500×500 mm, 176×176 pixels, 2.84 mm pitch. At 20 feet high this is
  // approximately 12 rows × 131 cabinets around the 270-degree wall.
  // The 675-panel ceiling used ROE Carbon CB5:
  // 600×1200 mm, 104×208 pixels, 5.77 mm pitch.
  const spec = type === 'ceiling'
    ? {
      product: 'ROE Carbon CB5',
      panelWidthMm: 600,
      panelHeightMm: 1200,
      pixelPitchMm: 5.77,
      panelResolution: '104x208',
      columns: 27,
      rows: 25,
      panelCount: 675,
    }
    : {
      product: 'ROE Black Pearl BP2',
      panelWidthMm: 500,
      panelHeightMm: 500,
      pixelPitchMm: 2.84,
      panelResolution: '176x176',
      columns: 131,
      rows: 12,
      panelCount: 1572,
    };

  // Keep this texture transparent. Cabinet joints are rendered by an
  // anti-aliased shader at their physical ratio below; raster lines at this
  // resolution would turn a sub-millimetre tolerance into a 40–50 mm trench.
  const panelWidth = canvas.width / spec.columns;
  const panelHeight = canvas.height / spec.rows;

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  try {
    texture.anisotropy = Math.min(
      8,
      renderer?.capabilities?.getMaxAnisotropy?.() || 1,
    );
  } catch (_) {
    texture.anisotropy = 1;
  }
  texture.needsUpdate = true;
  return {
    canvas,
    texture,
    ...spec,
    texturePanelWidth: panelWidth,
    texturePanelHeight: panelHeight,
    panelGrid: `${spec.columns}x${spec.rows}`,
  };
}

function createVfxLedCabinetMaterial(THREE, spec, opacity = 0.12) {
  if (!THREE || !spec) return null;
  // ROE describes the BP2's narrow-tolerance smart-lock assembly as producing
  // a "flawless LED canvas"; there is no decorative bevel or highlight. Model
  // a neutral 0.35 mm shadow tolerance and let fwidth keep it sub-pixel and
  // stable instead of embossing every cabinet boundary.
  const seamMm = 0.35;
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uGrid: {
        value: new THREE.Vector2(spec.columns, spec.rows),
      },
      uSeamRatio: {
        value: new THREE.Vector2(
          seamMm / spec.panelWidthMm,
          seamMm / spec.panelHeightMm,
        ),
      },
      uOpacity: { value: opacity },
    },
    vertexShader: `
      varying vec2 vLedUv;
      void main() {
        vLedUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vLedUv;
      uniform vec2 uGrid;
      uniform vec2 uSeamRatio;
      uniform float uOpacity;
      void main() {
        vec2 gridUv = vLedUv * uGrid;
        vec2 cell = fract(gridUv);
        vec2 edge = min(cell, 1.0 - cell);
        vec2 aa = max(fwidth(gridUv) * 1.15, vec2(0.0001));
        float seamX = 1.0 - smoothstep(
          uSeamRatio.x,
          uSeamRatio.x + aa.x,
          edge.x
        );
        float seamY = 1.0 - smoothstep(
          uSeamRatio.y,
          uSeamRatio.y + aa.y,
          edge.y
        );
        float seam = max(seamX, seamY);
        gl_FragColor = vec4(0.0, 0.0, 0.0, seam * uOpacity);
      }
    `,
    transparent: true,
    depthTest: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    toneMapped: false,
    polygonOffset: true,
    polygonOffsetFactor: -3,
    polygonOffsetUnits: -4,
    extensions: { derivatives: true },
  });
  return material;
}

function createVfxLedPowerMaskMaterial(THREE, spec) {
  if (!THREE || !spec) return null;
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uGrid: {
        value: new THREE.Vector2(spec.columns, spec.rows),
      },
      uPowerProgress: { value: 0 },
    },
    vertexShader: `
      varying vec2 vLedUv;
      void main() {
        vLedUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vLedUv;
      uniform vec2 uGrid;
      uniform float uPowerProgress;

      float panelHash(vec2 panel) {
        return fract(sin(dot(panel, vec2(127.1, 311.7))) * 43758.5453123);
      }

      void main() {
        vec2 panel = floor(vLedUv * uGrid);
        // Every physical 500 mm cabinet owns a stable threshold. Advancing one
        // scalar therefore wakes the wall in a scattered hardware-like order
        // without creating 1,572 meshes, timers, or React state entries.
        float threshold = 0.025 + panelHash(panel) * 0.95;
        float powered = step(threshold, uPowerProgress);
        float offAlpha = 1.0 - powered;
        if (offAlpha < 0.001) discard;
        gl_FragColor = vec4(0.0015, 0.0018, 0.0024, offAlpha);
      }
    `,
    transparent: true,
    depthTest: true,
    depthWrite: false,
    side: THREE.FrontSide,
    toneMapped: false,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -3,
  });
  material.name = 'VfxLedWallPowerMaskMaterial';
  material.userData.mediaTarget = 'none';
  return material;
}

function createVfxLedRearCabinetMaterial(THREE, spec) {
  if (!THREE || !spec) return null;
  // ROE BP2V2 is a solid, front-service 500 x 500 x 90 mm magnesium cabinet.
  // The public product material shows a dark structural rear rather than a
  // second LED face. Keep the treatment architectural: panel perimeter,
  // internal frame/handle language, lock points and connector positions.
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uGrid: {
        value: new THREE.Vector2(spec.columns, spec.rows),
      },
    },
    vertexShader: `
      varying vec2 vRearUv;
      void main() {
        vRearUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vRearUv;
      uniform vec2 uGrid;

      float rectMask(vec2 p, vec2 mn, vec2 mx, vec2 aa) {
        vec2 inside = smoothstep(mn - aa, mn + aa, p)
          * (1.0 - smoothstep(mx - aa, mx + aa, p));
        return inside.x * inside.y;
      }

      void main() {
        vec2 gridUv = vRearUv * uGrid;
        vec2 p = fract(gridUv);
        vec2 aa = max(fwidth(gridUv) * 1.25, vec2(0.001));

        vec2 edgeDistance = min(p, 1.0 - p);
        float cabinetSeam = 1.0 - smoothstep(
          0.012,
          0.012 + max(aa.x, aa.y),
          min(edgeDistance.x, edgeDistance.y)
        );

        float outerFrame = 1.0 - rectMask(
          p,
          vec2(0.055),
          vec2(0.945),
          aa
        );
        float leftHandle = rectMask(
          p,
          vec2(0.085, 0.31),
          vec2(0.18, 0.69),
          aa
        );
        float rightHandle = rectMask(
          p,
          vec2(0.82, 0.31),
          vec2(0.915, 0.69),
          aa
        );
        float centerSpine = rectMask(
          p,
          vec2(0.477, 0.12),
          vec2(0.523, 0.88),
          aa
        );
        float upperBrace = rectMask(
          p,
          vec2(0.18, 0.80),
          vec2(0.82, 0.855),
          aa
        );
        float lowerBrace = rectMask(
          p,
          vec2(0.18, 0.145),
          vec2(0.82, 0.20),
          aa
        );

        float lockPoints = 0.0;
        lockPoints += 1.0 - smoothstep(0.038, 0.038 + max(aa.x, aa.y), distance(p, vec2(0.11, 0.11)));
        lockPoints += 1.0 - smoothstep(0.038, 0.038 + max(aa.x, aa.y), distance(p, vec2(0.89, 0.11)));
        lockPoints += 1.0 - smoothstep(0.038, 0.038 + max(aa.x, aa.y), distance(p, vec2(0.11, 0.89)));
        lockPoints += 1.0 - smoothstep(0.038, 0.038 + max(aa.x, aa.y), distance(p, vec2(0.89, 0.89)));
        lockPoints = clamp(lockPoints, 0.0, 1.0);

        float connectorA = 1.0 - smoothstep(
          0.026,
          0.026 + max(aa.x, aa.y),
          distance(p, vec2(0.43, 0.265))
        );
        float connectorB = 1.0 - smoothstep(
          0.026,
          0.026 + max(aa.x, aa.y),
          distance(p, vec2(0.57, 0.265))
        );
        float powerBox = rectMask(
          p,
          vec2(0.30, 0.31),
          vec2(0.70, 0.69),
          aa
        );
        float statusLedCore = 1.0 - smoothstep(
          0.014,
          0.014 + max(aa.x, aa.y),
          distance(p, vec2(0.50, 0.57))
        );
        float statusLedGlow = 1.0 - smoothstep(
          0.052,
          0.052 + max(aa.x, aa.y),
          distance(p, vec2(0.50, 0.57))
        );

        vec3 color = vec3(0.020, 0.022, 0.026);
        float frame = max(
          max(outerFrame, centerSpine),
          max(upperBrace, lowerBrace)
        );
        color = mix(color, vec3(0.052, 0.056, 0.063), frame * 0.92);
        color = mix(color, vec3(0.008, 0.009, 0.012), max(leftHandle, rightHandle));
        color = mix(color, vec3(0.030, 0.033, 0.039), powerBox * 0.94);
        color = mix(color, vec3(0.082, 0.086, 0.094), lockPoints * 0.86);
        color = mix(color, vec3(0.006, 0.007, 0.009), max(connectorA, connectorB));
        color = mix(color, vec3(0.002, 0.003, 0.004), cabinetSeam * 0.96);
        color += vec3(0.005, 0.095, 0.34) * statusLedGlow * 0.72;
        color = mix(color, vec3(0.08, 0.48, 1.0), statusLedCore);

        // A restrained vertical lift keeps the rear legible in the stage void
        // without making the magnesium chassis look polished or emissive.
        color *= 0.82 + p.y * 0.16;
        gl_FragColor = vec4(color, 1.0);
      }
    `,
    // makeWallGeometry winds toward the performance volume. Its reverse side
    // is therefore the exterior cabinet back.
    side: THREE.BackSide,
    transparent: false,
    depthTest: true,
    depthWrite: true,
    toneMapped: false,
    extensions: { derivatives: true },
  });
  material.name = 'RoeBp2V2RearCabinetMaterial';
  material.userData.mediaTarget = 'none';
  material.userData.reference = 'ROE-BP2V2-500x500x90mm-magnesium-front-service';
  return material;
}

function drawVfxCycMedia(ctx, canvas, media, options = {}) {
  if (!ctx || !canvas || !media) return false;
  const isVideo = media.tagName === 'VIDEO';
  const isImage = media.tagName === 'IMG';
  if (isVideo && Number(media.readyState) < 2) return false;
  if (isImage && (!media.complete || Number(media.naturalWidth) <= 0)) return false;
  const sourceWidth = Number(
    isVideo ? media.videoWidth : isImage ? media.naturalWidth : media.width,
  ) || 0;
  const sourceHeight = Number(
    isVideo ? media.videoHeight : isImage ? media.naturalHeight : media.height,
  ) || 0;
  if (!sourceWidth || !sourceHeight) return false;
  const {
    fit = 'cover',
    background = '',
    glitchStrength = 0,
    verticalOccupancy = 1,
    viewport = null,
    composite = 'source-over',
    invert = false,
    maxScale = Infinity,
    sourceRect = null,
    sharpLinework = false,
    opacity = 1,
    preserveColor = false,
  } = options;
  const drawOpacity = Math.max(0, Math.min(1, Number(opacity) || 0));
  const region = viewport || {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height,
  };
  const sourceX = Math.max(0, Number(sourceRect?.x) || 0);
  const sourceY = Math.max(0, Number(sourceRect?.y) || 0);
  const croppedSourceWidth = Math.max(
    1,
    Math.min(sourceWidth - sourceX, Number(sourceRect?.width) || sourceWidth),
  );
  const croppedSourceHeight = Math.max(
    1,
    Math.min(sourceHeight - sourceY, Number(sourceRect?.height) || sourceHeight),
  );
  const targetWidth = region.width;
  const targetHeight = region.height * verticalOccupancy;
  const fittedScale = fit === 'contain'
    ? Math.min(
      targetWidth / croppedSourceWidth,
      targetHeight / croppedSourceHeight,
    )
    : Math.max(
      targetWidth / croppedSourceWidth,
      targetHeight / croppedSourceHeight,
    );
  const scale = Math.min(
    Number.isFinite(maxScale) ? Math.max(0.0001, maxScale) : Infinity,
    fittedScale,
  );
  const drawWidth = croppedSourceWidth * scale;
  const drawHeight = croppedSourceHeight * scale;
  const drawX = region.x + (targetWidth - drawWidth) * 0.5;
  const drawY = region.y + (region.height - targetHeight) * 0.5
    + (targetHeight - drawHeight) * 0.5;
  ctx.save();
  ctx.beginPath();
  ctx.rect(region.x, region.y, region.width, region.height);
  ctx.clip();
  ctx.globalAlpha = drawOpacity;
  if (background) {
    ctx.fillStyle = background;
    ctx.fillRect(region.x, region.y, region.width, region.height);
  }
  const separation = Math.round(region.width * 0.014 * Math.max(0, glitchStrength));
  const polarityFilter = invert ? 'invert(1) ' : '';
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.filter = preserveColor
    ? `${polarityFilter}contrast(${1.04 + glitchStrength * 0.08}) saturate(1.04) brightness(0.97)`
    : `${polarityFilter}grayscale(1) contrast(${1.38 + glitchStrength * 0.28}) brightness(${0.9 + glitchStrength * 0.08})`;
  if (separation > 0) {
    ctx.globalAlpha = 0.46 * drawOpacity;
    ctx.globalCompositeOperation = composite;
    ctx.filter = preserveColor
      ? `${polarityFilter}contrast(1.18) saturate(1.35) hue-rotate(-14deg)`
      : `${polarityFilter}grayscale(1) sepia(1) saturate(8) hue-rotate(292deg) contrast(1.5)`;
    ctx.drawImage(
      media,
      sourceX,
      sourceY,
      croppedSourceWidth,
      croppedSourceHeight,
      drawX - separation,
      drawY,
      drawWidth,
      drawHeight,
    );
    ctx.filter = preserveColor
      ? `${polarityFilter}contrast(1.18) saturate(1.35) hue-rotate(14deg)`
      : `${polarityFilter}grayscale(1) sepia(1) saturate(8) hue-rotate(136deg) contrast(1.5)`;
    ctx.drawImage(
      media,
      sourceX,
      sourceY,
      croppedSourceWidth,
      croppedSourceHeight,
      drawX + separation,
      drawY,
      drawWidth,
      drawHeight,
    );
  }
  if (sharpLinework) {
    // A restrained sub-pixel support pass prevents one-pixel skeleton and
    // constellation strokes from disappearing during the LED-atlas downsample.
    ctx.globalAlpha = 0.28 * drawOpacity;
    ctx.globalCompositeOperation = composite;
    ctx.filter = `${polarityFilter}grayscale(1) contrast(1.26) brightness(1.06)`;
    for (const [offsetX, offsetY] of [[-0.65, 0], [0.65, 0], [0, -0.65], [0, 0.65]]) {
      ctx.drawImage(
        media,
        sourceX,
        sourceY,
        croppedSourceWidth,
        croppedSourceHeight,
        drawX + offsetX,
        drawY + offsetY,
        drawWidth,
        drawHeight,
      );
    }
  }
  ctx.globalAlpha = drawOpacity;
  ctx.globalCompositeOperation = composite;
  ctx.filter = preserveColor
    ? `${polarityFilter}contrast(${1.04 + glitchStrength * 0.08}) saturate(1.04) brightness(0.97)`
    : sharpLinework
    ? `${polarityFilter}grayscale(1) contrast(${1.24 + glitchStrength * 0.12}) brightness(1.02)`
    : `${polarityFilter}grayscale(1) contrast(${1.42 + glitchStrength * 0.18}) brightness(0.92)`;
  ctx.drawImage(
    media,
    sourceX,
    sourceY,
    croppedSourceWidth,
    croppedSourceHeight,
    drawX,
    drawY,
    drawWidth,
    drawHeight,
  );
  ctx.restore();
  return true;
}

function readVfxCycBelieveHudNode(media, index, canvas) {
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const normalized = (key, fallback) => {
    const value = Number(media?.dataset?.[key]);
    return Number.isFinite(value) ? value : fallback;
  };
  const nx = clamp(normalized('believeHudX', 0.32), 0, 0.94);
  const ny = clamp(normalized('believeHudY', 0.1), 0, 0.9);
  const nw = clamp(normalized('believeHudWidth', 0.17), 0.08, 0.32);
  const nh = clamp(normalized('believeHudHeight', 0.44), 0.18, 0.72);
  return {
    index,
    id: String(media?.dataset?.believeId || `SG_${String(index + 1).padStart(2, '0')}`),
    kind: String(media?.dataset?.believeKind || 'ENTITY'),
    subject: String(media?.dataset?.believeSubject || 'UNRESOLVED SUBJECT'),
    action: String(media?.dataset?.believeAction || 'ANALYZING MOTION'),
    relation: String(media?.dataset?.believeRelation || 'RELATION PENDING'),
    confidence: String(media?.dataset?.believeConfidence || '0.90'),
    labelSide: ['left', 'stack'].includes(media?.dataset?.believeLabelSide)
      ? media.dataset.believeLabelSide
      : 'right',
    box: {
      x: Math.round(nx * canvas.width),
      y: Math.round(ny * canvas.height),
      width: Math.round(Math.min(nw, 1 - nx) * canvas.width),
      height: Math.round(Math.min(nh, 1 - ny) * canvas.height),
    },
    normalized: { x: nx, y: ny, width: nw, height: nh },
  };
}

function drawVfxCycBelieveHudCorners(ctx, box, color, weight = 3, length = 48) {
  const x1 = box.x;
  const y1 = box.y;
  const x2 = box.x + box.width;
  const y2 = box.y + box.height;
  const l = Math.min(length, box.width * 0.16, box.height * 0.2);
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = weight;
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(x1, y1 + l); ctx.lineTo(x1, y1); ctx.lineTo(x1 + l, y1);
  ctx.moveTo(x2 - l, y1); ctx.lineTo(x2, y1); ctx.lineTo(x2, y1 + l);
  ctx.moveTo(x2, y2 - l); ctx.lineTo(x2, y2); ctx.lineTo(x2 - l, y2);
  ctx.moveTo(x1 + l, y2); ctx.lineTo(x1, y2); ctx.lineTo(x1, y2 - l);
  ctx.stroke();
  ctx.restore();
}

function drawVfxCycBelieveHud(
  ctx,
  canvas,
  mediaItems,
  activeIndex,
  glitchStrength = 0,
  layer = 'under',
) {
  if (!ctx || !canvas || !mediaItems?.length) return [];
  const nodes = mediaItems.map((item, index) => (
    readVfxCycBelieveHudNode(item, index, canvas)
  ));
  const active = nodes[Math.max(0, Math.min(activeIndex, nodes.length - 1))];
  const visible = nodes.slice(0, active.index + 1);
  // Share the DESIGN dossier's type, drafting palette and measured hierarchy.
  // BELIEVE changes the content grammar—not the identity of the wall system.
  const mono = '"Space Mono", "IBM Plex Mono", Monaco, monospace';
  const white = '#f7fbff';
  const quiet = 'rgba(225,244,255,0.5)';
  const faint = 'rgba(205,234,255,0.105)';
  const accent = '#79e9ff';
  const accentStrong = '#d7fbff';
  const activeFill = 'rgba(121,233,255,0.07)';
  const jitter = Math.round(Math.max(0, glitchStrength) * 10);
  const drawLabelPlate = (
    text,
    x,
    y,
    {
      font = `500 24px ${mono}`,
      color = quiet,
      background = null,
      paddingX = 12,
      paddingY = 7,
      strokeColor = 'rgba(0,4,18,0.94)',
      strokeWidth = 2.4,
    } = {},
  ) => {
    ctx.save();
    ctx.globalAlpha = 1;
    ctx.font = font;
    const metrics = ctx.measureText(text);
    const ascent = metrics.actualBoundingBoxAscent || 22;
    const descent = metrics.actualBoundingBoxDescent || 6;
    if (background) {
      ctx.fillStyle = background;
      ctx.fillRect(
        x - paddingX,
        y - ascent - paddingY,
        metrics.width + paddingX * 2,
        ascent + descent + paddingY * 2,
      );
    }
    if (strokeWidth > 0) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.lineJoin = 'round';
      ctx.strokeText(text, x, y);
    }
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
    ctx.restore();
  };
  const fittedMonoFont = (
    text,
    weight,
    preferredSize,
    maxWidth,
    minimumSize = 18,
  ) => {
    let size = preferredSize;
    while (size > minimumSize) {
      ctx.font = `${weight} ${size}px ${mono}`;
      if (ctx.measureText(text).width <= maxWidth) break;
      size -= 2;
    }
    return `${weight} ${size}px ${mono}`;
  };
  ctx.save();
  ctx.translate(jitter, 0);
  ctx.lineCap = 'square';
  ctx.lineJoin = 'miter';

  if (layer === 'under') {
    // A sparse scene graph is more credible—and more legible—than generic HUD
    // noise. Each previous detection remains as a tracked node and every new
    // detection extends one explicit temporal edge.
    ctx.strokeStyle = faint;
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    for (let column = 0; column <= 8; column += 1) {
      const x = canvas.width * (0.27 + column * (0.465 / 8));
      ctx.beginPath();
      ctx.moveTo(x, canvas.height * 0.035);
      ctx.lineTo(x, canvas.height * 0.94);
      ctx.stroke();
    }
    for (let row = 0; row <= 10; row += 1) {
      const y = canvas.height * (0.035 + row * (0.905 / 10));
      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.27, y);
      ctx.lineTo(canvas.width * 0.735, y);
      ctx.stroke();
    }

    const headerX = canvas.width * 0.285;
    const headerY = canvas.height * 0.012;
    // Keep the system title as clean LED typography. A previous dark card and
    // nested status knockout read as a UI band laid over the wall.
    ctx.fillStyle = accent;
    ctx.font = `600 28px ${mono}`;
    ctx.fillText(
      `STUDY ${String(visible.length).padStart(2, '0')} / ${String(nodes.length).padStart(2, '0')}    BELIEVE`,
      headerX,
      headerY + 10,
    );
    ctx.fillStyle = white;
    ctx.font = `700 38px ${mono}`;
    ctx.fillText('PERCEPTION / SCENE GRAPH', headerX, headerY + 42);
    drawLabelPlate(
      `NODES ${String(visible.length).padStart(2, '0')}  /  EDGES ${String(Math.max(0, visible.length - 1)).padStart(2, '0')}  /  LIVE RENDER`,
      headerX + canvas.width * 0.24,
      headerY + 46,
      {
        font: `500 24px ${mono}`,
        color: quiet,
        paddingX: 10,
        paddingY: 4,
      },
    );

    for (let index = 1; index < visible.length; index += 1) {
      const previous = visible[index - 1].box;
      const current = visible[index].box;
      const corners = (box) => [
        { x: box.x, y: box.y },
        { x: box.x + box.width, y: box.y },
        { x: box.x, y: box.y + box.height },
        { x: box.x + box.width, y: box.y + box.height },
      ];
      let connection = null;
      corners(previous).forEach((start) => {
        corners(current).forEach((end) => {
          const distance = (end.x - start.x) ** 2 + (end.y - start.y) ** 2;
          if (!connection || distance < connection.distance) {
            connection = { start, end, distance };
          }
        });
      });
      const startX = connection.start.x;
      const startY = connection.start.y;
      const endX = connection.end.x;
      const endY = connection.end.y;
      const midpointX = startX + (endX - startX) * 0.5;
      const midpointY = startY + (endY - startY) * 0.5;
      ctx.strokeStyle = index === visible.length - 1 ? accent : quiet;
      ctx.globalAlpha = index === visible.length - 1 ? 0.74 : 0.26;
      ctx.lineWidth = index === visible.length - 1 ? 4 : 2;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      ctx.fillStyle = index === visible.length - 1 ? accentStrong : quiet;
      ctx.beginPath();
      ctx.arc(startX, startY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(endX, endY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = index === visible.length - 1 ? 0.96 : 0.72;
      const linkText = `LINK ${String(index).padStart(2, '0')} / +${String(index * 480).padStart(4, '0')}MS`;
      const linkFont = fittedMonoFont(
        linkText,
        500,
        22,
        canvas.width * 0.115,
        17,
      );
      ctx.font = linkFont;
      const linkWidth = ctx.measureText(linkText).width;
      const rawLinkX = midpointX + 18;
      const macLeft = canvas.width * 0.45;
      const macRight = canvas.width * 0.545;
      const currentCenterX = current.x + current.width * 0.5;
      const avoidsMac = rawLinkX + linkWidth < macLeft || rawLinkX > macRight;
      const linkX = Math.max(
        canvas.width * 0.27,
        Math.min(
          canvas.width * 0.735 - linkWidth,
          avoidsMac
            ? rawLinkX
            : (currentCenterX < canvas.width * 0.5
              ? macLeft - linkWidth - 22
              : macRight + 22),
        ),
      );
      const linkY = Math.max(
        42,
        Math.min(canvas.height - 28, midpointY - 24),
      );
      drawLabelPlate(
        linkText,
        linkX,
        linkY,
        {
          font: linkFont,
          color: index === visible.length - 1 ? accentStrong : quiet,
          paddingX: 10,
          paddingY: 5,
        },
      );
    }
    ctx.globalAlpha = 1;

    visible.slice(0, -1).forEach((node) => {
      ctx.strokeStyle = quiet;
      ctx.globalAlpha = 0.34;
      ctx.lineWidth = 2;
      ctx.setLineDash([18, 12]);
      ctx.strokeRect(node.box.x, node.box.y, node.box.width, node.box.height);
      ctx.setLineDash([]);
      drawVfxCycBelieveHudCorners(ctx, node.box, 'rgba(121,233,255,0.46)', 2, 34);
      const trackedText = `${node.id}  TRACKED`;
      const trackedFont = fittedMonoFont(
        trackedText,
        600,
        25,
        node.box.width - 20,
        17,
      );
      drawLabelPlate(
        trackedText,
        node.box.x,
        Math.max(32, node.box.y - 30),
        {
          font: trackedFont,
          color: quiet,
          paddingX: 8,
          paddingY: 4,
        },
      );
    });
  } else {
    const box = active.box;
    ctx.globalAlpha = 1;
    ctx.strokeStyle = quiet;
    ctx.lineWidth = 2;
    ctx.strokeRect(box.x, box.y, box.width, box.height);
    drawVfxCycBelieveHudCorners(ctx, box, accent, 5, 62);

    const centerX = box.x + box.width * 0.5;
    const centerY = box.y + box.height * 0.5;
    ctx.strokeStyle = quiet;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX - 28, centerY); ctx.lineTo(centerX + 28, centerY);
    ctx.moveTo(centerX, centerY - 28); ctx.lineTo(centerX, centerY + 28);
    ctx.stroke();
    const x2 = active.normalized.x + active.normalized.width;
    const y2 = active.normalized.y + active.normalized.height;
    const originText = `X ${active.normalized.x.toFixed(3)}  Y ${active.normalized.y.toFixed(3)}`;
    const extentText = `X2 ${x2.toFixed(3)}  Y2 ${y2.toFixed(3)}`;
    const coordinateFont = fittedMonoFont(
      `${originText} ${extentText}`,
      500,
      24,
      box.width * 1.8,
      16,
    );
    ctx.font = coordinateFont;
    const extentWidth = ctx.measureText(extentText).width;
    drawLabelPlate(
      originText,
      box.x + 18,
      box.y + 16,
      {
        font: coordinateFont,
        color: white,
        paddingX: 8,
        paddingY: 4,
      },
    );
    drawLabelPlate(
      extentText,
      box.x + box.width - extentWidth - 18,
      box.y + box.height - 46,
      {
        font: coordinateFont,
        color: white,
        paddingX: 8,
        paddingY: 4,
      },
    );

    const stacked = active.labelSide === 'stack';
    const panelWidth = stacked
      ? Math.round(Math.min(box.width, canvas.width * 0.15))
      : Math.round(canvas.width * 0.125);
    const panelHeight = 158;
    const panelGap = stacked ? 18 : 34;
    const stackedBelow = box.y + box.height + panelGap + panelHeight
      <= canvas.height * 0.92;
    const panelX = stacked
      ? Math.round(box.x + (box.width - panelWidth) * 0.5)
      : Math.max(
        canvas.width * 0.265,
        Math.min(
          canvas.width * 0.735 - panelWidth,
          active.labelSide === 'right'
            ? box.x + box.width + panelGap
            : box.x - panelWidth - panelGap,
        ),
      );
    const panelY = stacked
      ? Math.round(stackedBelow
        ? box.y + box.height + panelGap
        : box.y - panelHeight - panelGap)
      : Math.max(120, Math.min(
        canvas.height - panelHeight - 90,
        box.y + box.height * 0.06,
      ));
    const boxAnchorX = stacked
      ? box.x + box.width * 0.5
      : (active.labelSide === 'right' ? box.x + box.width : box.x);
    const boxAnchorY = stacked
      ? (stackedBelow ? box.y + box.height : box.y)
      : box.y + box.height * 0.28;
    const panelAnchorX = stacked
      ? panelX + panelWidth * 0.5
      : (active.labelSide === 'right' ? panelX : panelX + panelWidth);
    const panelAnchorY = stacked
      ? (stackedBelow ? panelY : panelY + panelHeight)
      : panelY + 32;
    const elbowX = stacked
      ? boxAnchorX
      : boxAnchorX + (panelAnchorX - boxAnchorX) * 0.52;
    const elbowY = stacked
      ? boxAnchorY + (panelAnchorY - boxAnchorY) * 0.5
      : boxAnchorY;
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(boxAnchorX, boxAnchorY);
    ctx.lineTo(elbowX, elbowY);
    ctx.lineTo(panelAnchorX, panelAnchorY);
    ctx.stroke();
    ctx.fillStyle = accentStrong;
    ctx.fillRect(boxAnchorX - 6, boxAnchorY - 6, 12, 12);

    // The annotations are captions, not cards: a short registration rail and
    // line-sized knockouts keep the graph legible without competing with the
    // moving image.
    ctx.fillStyle = accent;
    ctx.fillRect(panelX, panelY, Math.min(96, panelWidth * 0.18), 5);
    ctx.fillStyle = faint;
    ctx.fillRect(
      panelX + Math.min(96, panelWidth * 0.18),
      panelY,
      Math.min(190, panelWidth * 0.28),
      5,
    );

    const textX = panelX + 8;
    const textMaxWidth = panelWidth - 16;
    const eyebrowText = `STUDY ${String(active.index + 1).padStart(2, '0')} / ${String(nodes.length).padStart(2, '0')}    ${active.kind}`;
    drawLabelPlate(
      eyebrowText,
      textX,
      panelY + 17,
      {
        font: fittedMonoFont(eyebrowText, 700, 22, textMaxWidth, 16),
        color: accent,
        paddingX: 7,
        paddingY: 3,
        strokeWidth: 2.6,
      },
    );
    drawLabelPlate(
      active.subject,
      textX,
      panelY + 60,
      {
        font: fittedMonoFont(active.subject, 700, 42, textMaxWidth, 25),
        color: white,
        paddingX: 7,
        paddingY: 4,
        strokeWidth: 3.4,
      },
    );
    drawLabelPlate(
      active.action,
      textX,
      panelY + 94,
      {
        font: fittedMonoFont(active.action, 700, 27, textMaxWidth, 19),
        color: white,
        paddingX: 7,
        paddingY: 3,
        strokeWidth: 2.8,
      },
    );
    drawLabelPlate(
      active.relation,
      textX,
      panelY + 122,
      {
        font: fittedMonoFont(active.relation, 600, 23, textMaxWidth, 17),
        color: accentStrong,
        paddingX: 7,
        paddingY: 3,
        strokeWidth: 2.6,
      },
    );
    const confidenceText = `DEMO CONF ${active.confidence}   TRACK ${String(active.index + 1).padStart(2, '0')}/${String(nodes.length).padStart(2, '0')}`;
    drawLabelPlate(
      confidenceText,
      textX,
      panelY + 148,
      {
        font: fittedMonoFont(confidenceText, 500, 19, textMaxWidth, 15),
        color: white,
        paddingX: 7,
        paddingY: 3,
        strokeWidth: 2.2,
      },
    );
    const confidence = Math.max(0, Math.min(1, Number(active.confidence) || 0));
    const meterWidth = Math.min(panelWidth * 0.34, 220);
    ctx.fillStyle = faint;
    ctx.fillRect(textX, panelY + 155, meterWidth, 3);
    ctx.fillStyle = accent;
    ctx.fillRect(textX, panelY + 155, meterWidth * confidence, 3);
  }

  ctx.restore();
  return nodes;
}

function drawVfxCycDesignDraftingOverlay(ctx, region, options = {}) {
  if (!ctx || !region) return;
  const sequence = Math.max(0, Number(options.sequence) || 0);
  const elapsedMs = Math.max(0, Number(options.elapsedMs) || 0);
  const durationMs = Math.max(1, Number(options.durationMs) || 65);
  const localProgress = Math.min(1, elapsedMs / durationMs);
  const storyProgress = Math.min(1, (sequence + localProgress) / 13);
  const reveal = (start, span = 0.18) => Math.max(
    0,
    Math.min(1, (storyProgress - start) / Math.max(0.001, span)),
  );
  const x = region.x;
  const y = region.y;
  const w = region.width;
  const h = region.height;
  const white = 'rgba(244,249,255,0.76)';
  const faint = 'rgba(244,249,255,0.34)';
  const accent = 'rgba(255,42,116,0.82)';
  const lineWidth = Math.max(0.85, w / 1050);
  const pulse = 0.82 + Math.sin(elapsedMs * 0.013) * 0.18;

  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.translate(x, y);
  ctx.globalCompositeOperation = 'lighter';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // A calibrated straightedge along the processor feed. Major and minor ticks
  // arrive in sequence, giving the rapid bull edits a persistent drawing axis.
  const rulerProgress = reveal(0, 0.2);
  const tickCount = Math.max(1, Math.floor(32 * rulerProgress));
  ctx.strokeStyle = faint;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(w * 0.05, h * 0.075);
  ctx.lineTo(w * (0.05 + 0.9 * rulerProgress), h * 0.075);
  for (let index = 0; index <= tickCount; index += 1) {
    const tx = w * (0.05 + 0.9 * (index / 32));
    const major = index % 4 === 0;
    ctx.moveTo(tx, h * 0.075);
    ctx.lineTo(tx, h * (major ? 0.105 : 0.092));
  }
  ctx.stroke();

  // Euclidean compass construction: intersecting radii, center marks and a
  // secondary arc around the head, rather than a generic circular HUD.
  const compassProgress = reveal(0.04, 0.26);
  const cx = w * 0.52;
  const cy = h * 0.5;
  const radius = h * 0.34;
  ctx.strokeStyle = white;
  ctx.lineWidth = lineWidth;
  ctx.setLineDash([w * 0.008, w * 0.006]);
  ctx.lineDashOffset = -elapsedMs * 0.025;
  ctx.beginPath();
  ctx.arc(
    cx,
    cy,
    radius,
    -Math.PI * 0.66,
    -Math.PI * 0.66 + Math.PI * 2 * compassProgress,
  );
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.globalAlpha = 0.72 * compassProgress;
  ctx.beginPath();
  ctx.moveTo(cx - radius * 1.18, cy);
  ctx.lineTo(cx + radius * 1.18, cy);
  ctx.moveTo(cx, cy - radius * 1.12);
  ctx.lineTo(cx, cy + radius * 1.12);
  ctx.stroke();
  ctx.strokeStyle = accent;
  ctx.globalAlpha = pulse * compassProgress;
  ctx.beginPath();
  ctx.moveTo(cx - w * 0.012, cy);
  ctx.lineTo(cx + w * 0.012, cy);
  ctx.moveTo(cx, cy - w * 0.012);
  ctx.lineTo(cx, cy + w * 0.012);
  ctx.stroke();

  const headArcProgress = reveal(0.18, 0.2);
  const hx = w * 0.8;
  const hy = h * 0.37;
  ctx.strokeStyle = faint;
  ctx.globalAlpha = headArcProgress;
  ctx.beginPath();
  ctx.arc(
    hx,
    hy,
    h * 0.19,
    Math.PI * 0.72,
    Math.PI * (0.72 + 1.55 * headArcProgress),
  );
  ctx.stroke();

  // Cubic Bézier control cage approximating the animal's spine. The control
  // polygon and points are deliberately visible—the design decision is shown,
  // not merely its smooth result.
  const curveProgress = reveal(0.24, 0.25);
  const p0 = [w * 0.12, h * 0.42];
  const p1 = [w * 0.34, h * 0.16];
  const p2 = [w * 0.64, h * 0.2];
  const p3 = [w * 0.87, h * 0.38];
  ctx.globalAlpha = curveProgress;
  ctx.strokeStyle = faint;
  ctx.setLineDash([w * 0.005, w * 0.006]);
  ctx.beginPath();
  ctx.moveTo(...p0);
  ctx.lineTo(...p1);
  ctx.lineTo(...p2);
  ctx.lineTo(...p3);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.strokeStyle = white;
  ctx.beginPath();
  ctx.moveTo(...p0);
  ctx.bezierCurveTo(...p1, ...p2, ...p3);
  ctx.stroke();
  ctx.fillStyle = accent;
  for (const point of [p0, p1, p2, p3]) {
    ctx.beginPath();
    ctx.arc(point[0], point[1], Math.max(1.8, w * 0.0034), 0, Math.PI * 2);
    ctx.fill();
  }

  // Drafting compass icon and dimension string. These are kept outside the
  // torso so the bull remains the hero of the plate.
  const dimensionProgress = reveal(0.34, 0.22);
  ctx.globalAlpha = dimensionProgress;
  ctx.strokeStyle = white;
  ctx.beginPath();
  ctx.moveTo(w * 0.095, h * 0.7);
  ctx.lineTo(w * 0.045, h * 0.88);
  ctx.moveTo(w * 0.095, h * 0.7);
  ctx.lineTo(w * 0.165, h * 0.88);
  ctx.moveTo(w * 0.072, h * 0.77);
  ctx.arc(w * 0.095, h * 0.7, h * 0.075, Math.PI * 0.57, Math.PI * 1.05);
  ctx.stroke();
  const dimensionY = h * 0.9;
  ctx.beginPath();
  ctx.moveTo(w * 0.21, dimensionY);
  ctx.lineTo(w * 0.88, dimensionY);
  ctx.moveTo(w * 0.21, dimensionY - h * 0.018);
  ctx.lineTo(w * 0.21, dimensionY + h * 0.018);
  ctx.moveTo(w * 0.88, dimensionY - h * 0.018);
  ctx.lineTo(w * 0.88, dimensionY + h * 0.018);
  ctx.stroke();

  const fontSize = Math.max(9, Math.round(w * 0.0125));
  const smallFontSize = Math.max(8, Math.round(fontSize * 0.78));
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';
  ctx.fillStyle = white;
  ctx.font = `500 ${fontSize}px "Space Mono", "IBM Plex Mono", monospace`;
  ctx.globalAlpha = reveal(0.12, 0.16);
  ctx.fillText('PHI = (1 + sqrt(5)) / 2', w * 0.055, h * 0.15, w * 0.38);
  ctx.globalAlpha = reveal(0.3, 0.18);
  ctx.fillText('B(t) = SUM b_i(t) P_i', w * 0.055, h * 0.205, w * 0.4);
  ctx.globalAlpha = dimensionProgress;
  ctx.font = `500 ${smallFontSize}px "Space Mono", "IBM Plex Mono", monospace`;
  ctx.fillText('L / 1.000  |  DATUM 00', w * 0.43, h * 0.88, w * 0.31);

  // Planning evolves from a shortest-path graph into tree search. Nodes stay
  // off the torso and the selected path is the only magenta stroke.
  const planProgress = reveal(0.48, 0.24);
  const nodes = [
    [0.57, 0.73],
    [0.66, 0.64],
    [0.73, 0.75],
    [0.8, 0.62],
    [0.89, 0.7],
  ].map(([px, py]) => [w * px, h * py]);
  ctx.globalAlpha = planProgress;
  ctx.strokeStyle = faint;
  ctx.setLineDash([w * 0.004, w * 0.005]);
  ctx.beginPath();
  ctx.moveTo(...nodes[0]);
  ctx.lineTo(...nodes[2]);
  ctx.lineTo(...nodes[4]);
  ctx.moveTo(...nodes[0]);
  ctx.lineTo(...nodes[1]);
  ctx.lineTo(...nodes[3]);
  ctx.lineTo(...nodes[4]);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.strokeStyle = accent;
  ctx.beginPath();
  ctx.moveTo(...nodes[0]);
  ctx.lineTo(...nodes[1]);
  ctx.lineTo(...nodes[3]);
  ctx.lineTo(...nodes[4]);
  ctx.stroke();
  ctx.fillStyle = white;
  for (const node of nodes) {
    ctx.beginPath();
    ctx.arc(node[0], node[1], Math.max(1.5, w * 0.0027), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.font = `500 ${fontSize}px "Space Mono", "IBM Plex Mono", monospace`;
  ctx.globalAlpha = reveal(0.5, 0.18);
  ctx.fillText('f(n) = g(n) + h(n)', w * 0.57, h * 0.82, w * 0.35);

  ctx.globalAlpha = reveal(0.7, 0.2);
  ctx.fillText(
    'a* = argmax[Q + c sqrt(ln N / n)]',
    w * 0.53,
    h * 0.24,
    w * 0.42,
  );
  ctx.globalAlpha = reveal(0.82, 0.18);
  ctx.font = `500 ${smallFontSize}px "Space Mono", "IBM Plex Mono", monospace`;
  ctx.fillText(
    'ATTN(Q,K,V) = softmax(QK^T / sqrt(d_k))V',
    w * 0.47,
    h * 0.295,
    w * 0.48,
  );

  ctx.restore();
}

function drawVfxCycDesignProcessSheet(ctx, region, options = {}) {
  if (!ctx || !region) return;
  const sequence = Math.max(0, Math.min(13, Number(options.sequence) || 0));
  const elapsedMs = Math.max(0, Number(options.elapsedMs) || 0);
  const phaseIndex = Math.min(6, Math.floor(sequence / 2));
  const phases = [
    {
      name: 'OBSERVE',
      short: 'silhouette / gait / attitude',
    },
    {
      name: 'MEASURE',
      short: 'datum / scale / proportion',
    },
    {
      name: 'CONSTRUCT',
      short: 'curve / tangent / control',
    },
    {
      name: 'ABSTRACT',
      short: 'topology / joint / constraint',
    },
    {
      name: 'PLAN',
      short: 'search / cost / alternative',
    },
    {
      name: 'LEARN',
      short: 'context / landmark / prior',
    },
    {
      name: 'ANIMATE',
      short: 'pose / kinematics / control',
    },
  ];
  const phase = phases[phaseIndex];
  const studies = [
    {
      name: 'WALKING SOURCE',
      description: 'Read silhouette, weight shift and gait before choosing a representation.',
      formulaLabel: 'MOTION SAMPLE',
      formula: 'v = delta p / delta t',
    },
    {
      name: 'OBSERVED FORM',
      description: 'Preserve anatomy and attitude as the common reference for every later drawing.',
      formulaLabel: 'PROPORTION',
      formula: 'PHI = (1 + sqrt(5)) / 2',
    },
    {
      name: 'FACETED MASS',
      description: 'Reduce continuous volume into planar masses while protecting the silhouette.',
      formulaLabel: 'SURFACE NORMAL',
      formula: 'n = unit((b-a) x (c-a))',
    },
    {
      name: 'CONTOUR STUDY',
      description: 'Describe the outer gesture with editable curves, tangencies and control points.',
      formulaLabel: 'BEZIER CURVE',
      formula: 'B(t) = SUM b_i(t) P_i',
    },
    {
      name: 'TRIANGULATED FORM',
      description: 'Convert surface into vertices, edges and faces that can be measured and rebuilt.',
      formulaLabel: 'MESH TOPOLOGY',
      formula: 'V - E + F = 2',
    },
    {
      name: 'MECHANICAL RIG',
      description: 'Translate anatomy into pivots, load paths and forces that a mechanism can carry.',
      formulaLabel: 'JOINT MOMENT',
      formula: 'tau = r x F',
    },
    {
      name: 'MACHINE STUDY A',
      description: 'Test the first actuator layout against pose, clearance and shared constraints.',
      formulaLabel: 'CONSTRAINT SYSTEM',
      formula: 'C(q) = 0',
    },
    {
      name: 'MACHINE STUDY B',
      description: 'Iterate the joint chain and compare how each local transform affects the whole.',
      formulaLabel: 'FORWARD KINEMATICS',
      formula: 'T_0_n = PRODUCT T_i-1_i',
    },
    {
      name: 'ROBOTIC SYNTHESIS',
      description: 'Resolve the studies into one controllable machine with state and input.',
      formulaLabel: 'STATE MODEL',
      formula: 'x[t+1] = A x[t] + B u[t]',
    },
    {
      name: 'REDUCED RIG',
      description: 'Remove surface detail and solve only for the joints needed to preserve the pose.',
      formulaLabel: 'INVERSE KINEMATICS',
      formula: 'q* = argmin ||FK(q) - p||^2',
    },
    {
      name: 'STICK RIG',
      description: 'Express the body as a parent-child hierarchy of bones and local transforms.',
      formulaLabel: 'BONE CHAIN',
      formula: 'p_j = T_parent T_local p_0',
    },
    {
      name: 'MINIMAL LANDMARKS',
      description: 'Keep only motion-defining points whose confidence survives the reduction.',
      formulaLabel: 'LANDMARK FILTER',
      formula: 'P = {p_i | confidence_i > k}',
    },
    {
      name: 'POSE INFERENCE',
      description: 'Turn image evidence into temporal landmarks that can drive an animated skeleton.',
      formulaLabel: 'ATTENTION',
      formula: 'softmax(QK^T / sqrt(d_k))V',
    },
    {
      name: 'CONSTELLATION PLAN',
      description: 'The final abstraction is a graph: compact nodes, edges and possible next moves.',
      formulaLabel: 'GRAPH SEARCH',
      formula: 'G=(V,E) ; f(n)=g(n)+h(n)',
    },
  ];
  const study = studies[sequence];
  const x = region.x;
  const y = region.y;
  const w = region.width;
  const h = region.height;
  const white = '#f7fbff';
  const quiet = 'rgba(225,244,255,0.5)';
  const faint = 'rgba(205,234,255,0.105)';
  const accent = '#79e9ff';
  const accentStrong = '#d7fbff';
  const panelFill = 'rgba(1,8,42,0.34)';
  const activeFill = 'rgba(121,233,255,0.07)';
  const lineWidth = Math.max(0.8, w / 820);
  const reveal = Math.min(1, (sequence + Math.min(1, elapsedMs / 180)) / 3);
  const dossierOpacity = 0.78;
  const pulse = 0.76 + Math.sin(elapsedMs * 0.011) * 0.24;
  const mono = '"Space Mono", "IBM Plex Mono", Monaco, monospace';

  const wrapText = (text, maxWidth) => {
    const words = String(text || '').split(/\s+/);
    const lines = [];
    let line = '';
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (line && ctx.measureText(candidate).width > maxWidth) {
        lines.push(line);
        line = word;
      } else {
        line = candidate;
      }
    }
    if (line) lines.push(line);
    return lines;
  };

  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.translate(x, y);
  ctx.globalAlpha = reveal * dossierOpacity;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'square';
  ctx.lineJoin = 'miter';

  // A restrained architectural grid keeps the panel measured without turning
  // the entire right side into graph paper.
  ctx.strokeStyle = faint;
  ctx.beginPath();
  for (let column = 0; column <= 4; column += 1) {
    const gx = (column / 4) * w;
    ctx.moveTo(gx, 0);
    ctx.lineTo(gx, h);
  }
  for (let row = 0; row <= 14; row += 1) {
    const gy = (row / 14) * h;
    ctx.moveTo(0, gy);
    ctx.lineTo(w, gy);
  }
  ctx.stroke();

  // Open registration rail instead of a closed border: it belongs to the
  // drawing field while leaving the LED volume visible through the dossier.
  const railX = w * 0.052;
  ctx.strokeStyle = 'rgba(121,233,255,0.48)';
  ctx.lineWidth = Math.max(1, lineWidth * 1.25);
  ctx.beginPath();
  ctx.moveTo(railX, h * 0.052);
  ctx.lineTo(railX, h * 0.95);
  ctx.moveTo(railX, h * 0.052);
  ctx.lineTo(w * 0.29, h * 0.052);
  ctx.moveTo(railX, h * 0.95);
  ctx.lineTo(w * 0.29, h * 0.95);
  for (let tick = 0; tick <= 18; tick += 1) {
    const ty = h * (0.052 + (0.898 * tick) / 18);
    ctx.moveTo(railX, ty);
    ctx.lineTo(railX + w * (tick % 3 === 0 ? 0.022 : 0.012), ty);
  }
  ctx.stroke();

  const eyebrowSize = Math.max(8, Math.round(w * 0.015));
  const headingSize = Math.max(18, Math.round(w * 0.045));
  const bodySize = Math.max(9, Math.round(w * 0.02));
  const smallSize = Math.max(7, Math.round(w * 0.014));
  const left = w * 0.105;
  const contentWidth = w * 0.81;

  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';
  ctx.fillStyle = panelFill;
  ctx.fillRect(left - w * 0.025, h * 0.068, contentWidth + w * 0.05, h * 0.043);
  ctx.strokeStyle = 'rgba(121,233,255,0.56)';
  ctx.strokeRect(left - w * 0.025, h * 0.068, contentWidth + w * 0.05, h * 0.043);
  ctx.font = `600 ${eyebrowSize}px ${mono}`;
  ctx.fillStyle = accent;
  ctx.fillText(
    `STUDY ${String(sequence + 1).padStart(2, '0')} / 14    ${phase.name}`,
    left,
    h * 0.079,
    contentWidth,
  );
  ctx.font = `700 ${headingSize}px ${mono}`;
  ctx.fillStyle = white;
  ctx.fillText(study.name, left, h * 0.132, contentWidth);
  ctx.strokeStyle = accent;
  ctx.lineWidth = Math.max(1, lineWidth * 1.5);
  ctx.beginPath();
  ctx.moveTo(left, h * 0.187);
  ctx.lineTo(left + contentWidth * 0.28, h * 0.187);
  ctx.stroke();
  ctx.strokeStyle = faint;
  ctx.beginPath();
  ctx.moveTo(left + contentWidth * 0.3, h * 0.187);
  ctx.lineTo(left + contentWidth, h * 0.187);
  ctx.stroke();
  ctx.font = `500 ${bodySize}px ${mono}`;
  ctx.fillStyle = quiet;
  const descriptionLines = wrapText(study.description, contentWidth);
  descriptionLines.slice(0, 3).forEach((line, index) => {
    ctx.globalAlpha = reveal * dossierOpacity * (0.94 - index * 0.08);
    ctx.fillText(line, left, h * (0.215 + index * 0.041), contentWidth);
  });
  ctx.globalAlpha = reveal * dossierOpacity;

  // Seven-state vertical process rail. The active study is expressed by a
  // precise cyan keyline and hierarchy—not a warning-colored selection bar.
  const ledgerTop = h * 0.345;
  const ledgerRow = h * 0.061;
  phases.forEach((item, index) => {
    const rowY = ledgerTop + ledgerRow * index;
    const active = index === phaseIndex;
    const complete = index < phaseIndex;
    if (active) {
      ctx.fillStyle = activeFill;
      ctx.fillRect(left - w * 0.022, rowY - h * 0.006, contentWidth + w * 0.044, ledgerRow * 0.84);
      ctx.fillStyle = accent;
      ctx.fillRect(left - w * 0.022, rowY - h * 0.006, Math.max(2, w * 0.008), ledgerRow * 0.84);
    }
    ctx.strokeStyle = active ? accent : 'rgba(205,234,255,0.18)';
    ctx.beginPath();
    ctx.moveTo(left, rowY + ledgerRow * 0.74);
    ctx.lineTo(left + contentWidth, rowY + ledgerRow * 0.74);
    ctx.stroke();
    ctx.font = `${active ? 700 : 500} ${smallSize}px ${mono}`;
    ctx.fillStyle = active ? accentStrong : complete ? quiet : 'rgba(225,244,255,0.3)';
    ctx.fillText(
      `0${index + 1}`,
      left,
      rowY,
      w * 0.08,
    );
    ctx.fillStyle = active ? white : complete ? quiet : 'rgba(225,244,255,0.3)';
    ctx.fillText(item.name, left + w * 0.105, rowY, w * 0.38);
    ctx.font = `400 ${Math.max(7, smallSize - 1)}px ${mono}`;
    ctx.fillStyle = active ? quiet : 'rgba(205,234,255,0.24)';
    ctx.fillText(
      item.short,
      left + w * 0.105,
      rowY + ledgerRow * 0.32,
      contentWidth - w * 0.105,
    );
  });

  // The current formula becomes the panel's single high-contrast technical
  // module, with corner registration details instead of another full box.
  const moduleY = h * 0.79;
  const moduleX = left - w * 0.022;
  const moduleWidth = contentWidth + w * 0.044;
  const moduleHeight = h * 0.104;
  ctx.fillStyle = panelFill;
  ctx.fillRect(moduleX, moduleY, moduleWidth, moduleHeight);
  ctx.strokeStyle = accent;
  ctx.beginPath();
  ctx.moveTo(moduleX, moduleY + moduleHeight);
  ctx.lineTo(moduleX, moduleY);
  ctx.lineTo(moduleX + moduleWidth * 0.36, moduleY);
  ctx.moveTo(moduleX + moduleWidth, moduleY);
  ctx.lineTo(moduleX + moduleWidth, moduleY + moduleHeight * 0.3);
  ctx.stroke();
  ctx.font = `600 ${smallSize}px ${mono}`;
  ctx.fillStyle = accent;
  ctx.fillText(study.formulaLabel, left, moduleY + h * 0.015, contentWidth);
  ctx.font = `600 ${bodySize}px ${mono}`;
  ctx.fillStyle = accentStrong;
  ctx.fillText(study.formula, left, moduleY + h * 0.052, contentWidth);

  // Planning/search footnotes and a tiny selected-path graph close the sheet.
  ctx.font = `500 ${smallSize}px ${mono}`;
  ctx.fillStyle = quiet;
  ctx.fillText('UCT  Q + c sqrt(ln N / n)', left, h * 0.9, w * 0.48);
  ctx.fillText('DRAWING  TM-DES-001', left + w * 0.48, h * 0.9, w * 0.37);
  ctx.fillText('REV 07  |  SCALE NTS', left + w * 0.48, h * 0.932, w * 0.37);

  const graphX = w * 0.84;
  const graphY = h * 0.91;
  const graphNodes = [
    [graphX - w * 0.14, graphY + h * 0.018],
    [graphX - w * 0.09, graphY - h * 0.025],
    [graphX - w * 0.035, graphY + h * 0.005],
    [graphX + w * 0.02, graphY - h * 0.035],
    [graphX + w * 0.07, graphY],
  ];
  ctx.strokeStyle = quiet;
  ctx.beginPath();
  graphNodes.forEach((node, index) => {
    if (index === 0) ctx.moveTo(...node);
    else ctx.lineTo(...node);
  });
  ctx.stroke();
  ctx.fillStyle = accentStrong;
  ctx.globalAlpha = reveal * dossierOpacity * pulse;
  for (const node of graphNodes) {
    ctx.beginPath();
    ctx.arc(node[0], node[1], Math.max(1.5, w * 0.004), 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawVfxWindowsCrashFrame(
  ctx,
  region,
  kind,
  glitchStrength = 0,
  regionIndex = 0,
) {
  if (!ctx || !region || !kind || glitchStrength < 0.5) return false;
  const mono = 'ui-monospace, "SF Mono", Menlo, Monaco, "IBM Plex Mono", monospace';
  const w = region.width;
  const h = region.height;
  const x = region.x;
  const y = region.y;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.globalAlpha = 1;

  // The close TRY IT insert only sees the center of the volume. Keep two
  // compact, staggered crash windows on the central processor feeds so their
  // complete silhouettes remain visible beside the Macintosh. The outer UHD
  // feeds retain the live code instead of showing giant cropped error fields.
  if (regionIndex !== 1 && regionIndex !== 2) {
    ctx.restore();
    return false;
  }
  const isLeftWindow = regionIndex === 1;
  const dialog = {
    x: x + w * (isLeftWindow ? 0.39 : 0.18),
    y: y + h * (isLeftWindow ? 0.18 : 0.51),
    width: w * 0.41,
    height: h * 0.29,
  };
  const titleHeight = dialog.height * 0.19;
  const border = Math.max(3, Math.round(dialog.width * 0.009));

  if (kind === 'win95-dialog') {
    ctx.fillStyle = '#06090b';
    ctx.fillRect(
      dialog.x - border * 1.8,
      dialog.y - border * 1.8,
      dialog.width + border * 3.6,
      dialog.height + border * 3.6,
    );
    ctx.fillStyle = '#c0c0c0';
    ctx.fillRect(dialog.x, dialog.y, dialog.width, dialog.height);
    ctx.fillStyle = '#000080';
    ctx.fillRect(
      dialog.x + border,
      dialog.y + border,
      dialog.width - border * 2,
      titleHeight,
    );
    ctx.fillStyle = '#fff';
    ctx.textBaseline = 'middle';
    ctx.font = `700 ${Math.max(12, Math.round(dialog.width * 0.038))}px ${mono}`;
    ctx.fillText(
      isLeftWindow ? 'PROGRAM ERROR' : 'REALITY.EXE',
      dialog.x + dialog.width * 0.045,
      dialog.y + border + titleHeight * 0.5,
    );
    ctx.fillStyle = '#000';
    ctx.textBaseline = 'top';
    ctx.font = `500 ${Math.max(10, Math.round(dialog.width * 0.026))}px ${mono}`;
    [
      isLeftWindow ? 'BEAUTIFULGAME caused a page fault' : 'REALITY.DLL stopped responding',
      isLeftWindow ? 'at 0017:0BADF00D.' : 'after an illegal idea.',
      'Press a button anyway.',
    ].forEach((line, index) => {
      ctx.fillText(
        line,
        dialog.x + dialog.width * 0.06,
        dialog.y + titleHeight + dialog.height * (0.11 + index * 0.13),
        dialog.width * 0.88,
      );
    });
    const buttonWidth = dialog.width * 0.28;
    const buttonHeight = dialog.height * 0.18;
    ['CLOSE', 'IGNORE'].forEach((label, index) => {
      const bx = dialog.x + dialog.width * 0.5
        - buttonWidth * 1.08
        + index * buttonWidth * 1.18;
      const by = dialog.y + dialog.height - buttonHeight - dialog.height * 0.07;
      ctx.fillStyle = '#c0c0c0';
      ctx.fillRect(bx, by, buttonWidth, buttonHeight);
      ctx.strokeStyle = index === 0 ? '#fff' : '#404040';
      ctx.lineWidth = Math.max(2, dialog.width * 0.006);
      ctx.strokeRect(bx, by, buttonWidth, buttonHeight);
      ctx.fillStyle = '#000';
      ctx.textBaseline = 'middle';
      ctx.font = `600 ${Math.max(9, Math.round(dialog.width * 0.022))}px ${mono}`;
      ctx.fillText(label, bx + buttonWidth * 0.22, by + buttonHeight * 0.5);
    });
  } else if (kind === 'modern-stop') {
    ctx.fillStyle = '#05070a';
    ctx.fillRect(
      dialog.x - border * 1.8,
      dialog.y - border * 1.8,
      dialog.width + border * 3.6,
      dialog.height + border * 3.6,
    );
    ctx.fillStyle = '#0078d7';
    ctx.fillRect(dialog.x, dialog.y, dialog.width, dialog.height);
    ctx.fillStyle = '#fff';
    ctx.textBaseline = 'top';
    ctx.font = `300 ${Math.max(28, Math.round(dialog.width * 0.13))}px "Segoe UI", ${mono}`;
    ctx.fillText(':(', dialog.x + dialog.width * 0.08, dialog.y + dialog.height * 0.06);
    ctx.font = `300 ${Math.max(10, Math.round(dialog.width * 0.029))}px "Segoe UI", ${mono}`;
    [
      'Your imagination ran into a problem',
      'and needs to restart.',
      'Collecting strange bits: 100%',
    ].forEach((line, index) => {
      ctx.fillText(
        line,
        dialog.x + dialog.width * 0.08,
        dialog.y + dialog.height * (0.42 + index * 0.14),
      );
    });
  } else {
    ctx.fillStyle = '#05070a';
    ctx.fillRect(
      dialog.x - border * 1.8,
      dialog.y - border * 1.8,
      dialog.width + border * 3.6,
      dialog.height + border * 3.6,
    );
    ctx.fillStyle = '#0000aa';
    ctx.fillRect(dialog.x, dialog.y, dialog.width, dialog.height);
    ctx.fillStyle = '#f5f5f5';
    ctx.textBaseline = 'top';
    ctx.font = `600 ${Math.max(10, Math.round(dialog.width * 0.028))}px ${mono}`;
    const title = ` PROCESSOR 0${regionIndex + 1} — SYSTEM HALTED `;
    const titleWidth = ctx.measureText(title).width;
    ctx.fillStyle = '#aaa';
    ctx.fillRect(
      dialog.x + (dialog.width - titleWidth) * 0.5,
      dialog.y + dialog.height * 0.08,
      titleWidth,
      dialog.height * 0.13,
    );
    ctx.fillStyle = '#0000aa';
    ctx.fillText(
      title,
      dialog.x + (dialog.width - titleWidth) * 0.5,
      dialog.y + dialog.height * 0.085,
    );
    ctx.fillStyle = '#fff';
    ctx.font = `500 ${Math.max(9, Math.round(dialog.width * 0.023))}px ${mono}`;
    [
      'A fatal exception occurred in CREATIVE.EXE',
      '* Press any key to make the impossible.',
      '* CTRL+ALT+BELIEVE to continue.',
    ].forEach((line, index) => {
      ctx.fillText(
        line,
        dialog.x + dialog.width * 0.06,
        dialog.y + dialog.height * (0.32 + index * 0.17),
        dialog.width * 0.88,
      );
    });
  }

  // One short horizontal tear keeps these from reading like pristine UI
  // mockups; they are edit frames inside the same glitch language.
  const tearY = dialog.y + dialog.height * (0.44 + (regionIndex - 1) * 0.11);
  ctx.globalCompositeOperation = 'difference';
  ctx.fillStyle = '#fff';
  ctx.fillRect(
    dialog.x,
    tearY,
    dialog.width,
    Math.max(2, dialog.height * 0.025 * glitchStrength),
  );
  ctx.restore();
  return true;
}

function drawVfxCycCode(
  ctx,
  canvas,
  page,
  glitchStrength = 0,
  viewport = null,
  options = {},
) {
  if (!ctx || !canvas) return false;
  const source = String(page?.querySelector?.('pre')?.textContent || page?.textContent || '').trim();
  const region = viewport || {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height,
  };
  ctx.save();
  ctx.beginPath();
  ctx.rect(region.x, region.y, region.width, region.height);
  ctx.clip();
  const variant = String(options.variant || 'lockout');
  const cut = String(options.cut || 'channel-tear');
  const regionIndex = Math.max(0, Number(options.regionIndex) || 0);
  const sequence = Math.max(0, Number(options.sequence) || 0);
  const profiles = {
    lockout: {
      background: '#020306',
      foreground: '#f2f2ec',
      accent: '#f2f2ec',
      muted: '#777b80',
      fontScale: 0.021,
      weight: 520,
      lineScale: 1.22,
      indent: 0.034,
      lineOffset: 0,
    },
    'point-scan': {
      background: '#020306',
      foreground: '#f2f2ec',
      accent: '#f2f2ec',
      muted: '#777b80',
      fontScale: 0.018,
      weight: 470,
      lineScale: 1.15,
      indent: 0.07,
      lineOffset: 5,
    },
    permission: {
      background: '#020306',
      foreground: '#f2f2ec',
      accent: '#f2f2ec',
      muted: '#777b80',
      fontScale: 0.024,
      weight: 540,
      lineScale: 1.3,
      indent: 0.025,
      lineOffset: 2,
    },
    execute: {
      background: '#020306',
      foreground: '#f2f2ec',
      accent: '#f2f2ec',
      muted: '#777b80',
      fontScale: 0.019,
      weight: 480,
      lineScale: 1.18,
      indent: 0.045,
      lineOffset: 8,
    },
    wireframe: {
      background: '#020306',
      foreground: '#f2f2ec',
      accent: '#f2f2ec',
      muted: '#777b80',
      fontScale: 0.017,
      weight: 430,
      lineScale: 1.16,
      indent: 0.09,
      lineOffset: 12,
    },
    pipeline: {
      background: '#020306',
      foreground: '#f2f2ec',
      accent: '#f2f2ec',
      muted: '#777b80',
      fontScale: 0.02,
      weight: 460,
      lineScale: 1.24,
      indent: 0.038,
      lineOffset: 4,
    },
  };
  const profile = profiles[variant] || profiles.lockout;
  ctx.fillStyle = profile.background;
  ctx.fillRect(region.x, region.y, region.width, region.height);
  if (!source) {
    ctx.restore();
    return false;
  }
  if (cut === 'white-flash' && glitchStrength > 0) {
    ctx.fillStyle = `rgba(255,255,248,${(glitchStrength * 0.72).toFixed(3)})`;
    ctx.fillRect(region.x, region.y, region.width, region.height);
  }
  const fontSize = Math.max(10, Math.round(region.width * profile.fontScale));
  const lineHeight = Math.round(fontSize * profile.lineScale);
  const lines = source.split('\n');
  const visibleLineCount = Math.max(1, Math.ceil(region.height / lineHeight) + 2);
  const lineOffset = (
    profile.lineOffset
    + regionIndex * Math.max(3, Math.floor(visibleLineCount * 0.44))
    + sequence * 2
  ) % Math.max(1, lines.length);
  const visibleLines = Array.from(
    { length: Math.min(visibleLineCount, lines.length) },
    (_, index) => lines[(lineOffset + index) % lines.length],
  );
  ctx.font = `${profile.weight} ${fontSize}px ui-monospace, "SF Mono", Menlo, Monaco, "IBM Plex Mono", monospace`;
  ctx.textBaseline = 'top';
  const originX = region.x + region.width * profile.indent;
  const originY = region.y + region.height * 0.055;

  // Each authored phrase gets a different editorial splice. These transforms
  // live only inside the short glitch envelope; the selected code page then
  // settles perfectly still and legible for the remainder of the spoken beat.
  const cutOffsetForLine = (lineIndex) => {
    if (cut === 'scan-slice') {
      return lineIndex % 4 === 1
        ? region.width * 0.11 * glitchStrength
        : lineIndex % 4 === 3
          ? -region.width * 0.065 * glitchStrength
          : 0;
    }
    if (cut === 'block-shift') {
      return Math.floor(lineIndex / 3) % 2
        ? region.width * 0.085 * glitchStrength
        : -region.width * 0.025 * glitchStrength;
    }
    if (cut === 'channel-tear') {
      return (lineIndex % 3 - 1) * region.width * 0.028 * glitchStrength;
    }
    return 0;
  };
  const rollOffset = cut === 'terminal-roll'
    ? -lineHeight * 2.6 * glitchStrength
    : 0;
  const collapseScale = cut === 'line-collapse'
    ? 1 - glitchStrength * 0.32
    : 1;
  ctx.save();
  if (collapseScale !== 1) {
    const centerY = region.y + region.height * 0.5;
    ctx.translate(0, centerY);
    ctx.scale(1, collapseScale);
    ctx.translate(0, -centerY);
  }
  visibleLines.forEach((line, lineIndex) => {
    const y = originY + lineIndex * lineHeight;
    if (y > region.y + region.height - lineHeight) return;
    const x = originX + cutOffsetForLine(lineIndex);
    const emphasized = /(^|\s)(const|function|def|return|if|for|class|uniform)\b/.test(line)
      || /[{}()[\]]/.test(line) && lineIndex % 5 === 0;
    if (glitchStrength > 0) {
      const shift = Math.round(
        region.width
        * (cut === 'channel-tear' ? 0.014 : cut === 'block-shift' ? 0.009 : 0.006)
        * glitchStrength,
      );
      ctx.globalAlpha = cut === 'white-flash' ? 0.35 : 0.58;
      ctx.fillStyle = '#ff2367';
      ctx.fillText(line, x - shift, y + rollOffset);
      ctx.fillStyle = '#00d8ff';
      ctx.fillText(line, x + shift, y + rollOffset);
    }
    ctx.globalAlpha = emphasized ? 0.98 : 0.82;
    ctx.fillStyle = emphasized ? profile.accent : profile.foreground;
    ctx.fillText(line, x, y + rollOffset);
  });
  ctx.restore();

  drawVfxWindowsCrashFrame(
    ctx,
    region,
    String(options.crash || ''),
    glitchStrength,
    regionIndex,
  );
  ctx.restore();
  return true;
}

const STRUDEL_WALL_ARRANGEMENT = [
  { name: 'intro', cycles: 4 },
  { name: 'chorus', cycles: 8 },
  { name: 'verse', cycles: 8 },
  { name: 'preChorus', cycles: 4 },
  { name: 'chorus', cycles: 8 },
  { name: 'breakdown', cycles: 8 },
];

function drawVfxCycStrudelWall(ctx, canvas, regions, options = {}) {
  if (!ctx || !canvas || !Array.isArray(regions) || !regions.length) return false;
  const source = String(
    getPoetryInProofRenderSource()
    || options.strudelSource
    || window.__resumeStrudelAudioEngine?.compositionSource
    || window.__resumeActiveRawSource
    || getStoredPoetryInProofSource(),
  ).trim();
  if (!source) return false;

  const tokenLines = readPoetryInProofRenderLines();
  if (!tokenLines?.length) return false;
  const elapsedMs = Math.max(0, Number(options.strudelElapsedMs) || 0);

  // The authored Film Reel camera sees processor regions 02 and 03. They are
  // the two pages of the same editor; outer processors duplicate the nearest
  // page so companion-camera moves remain continuous.
  const scorePageCount = 2;
  const linesPerPage = Math.max(1, Math.ceil(tokenLines.length / scorePageCount));
  const mono = 'ui-monospace, "SF Mono", Menlo, Monaco, "IBM Plex Mono", monospace';
  // These are the exact Poetry in Proof editor variables from Resume.html.
  const palette = {
    background: '#1e1e1e',
    foreground: '#d4d4d4',
    comment: '#858585',
    string: '#ce9178',
    keyword: '#569cd6',
    function: '#dcdcaa',
    number: '#b5a7ff',
    flash: '#ffd840',
    flashInk: '#111111',
  };
  const colorForType = (type) => ({
    comment: palette.comment,
    string: palette.string,
    keyword: palette.keyword,
    function: palette.function,
    number: palette.number,
  })[type] || palette.foreground;
  const drawTokenLine = (runs, startX, y, maxWidth, fontSize) => {
    let cursorX = startX;
    for (const run of runs) {
      if (cursorX >= startX + maxWidth) break;
      const italic = run.type === 'comment' ? 'italic ' : '';
      const weight = run.type === 'keyword' ? 500 : 400;
      ctx.font = `${italic}${weight} ${fontSize}px ${mono}`;
      const width = ctx.measureText(run.text).width;
      const active = run.active === true;
      if (active) {
        ctx.fillStyle = palette.flash;
        ctx.fillRect(
          cursorX - 1,
          y - 1,
          Math.min(width + 2, startX + maxWidth - cursorX),
          Math.round(fontSize * 1.55),
        );
        ctx.fillStyle = palette.flashInk;
      } else {
        ctx.fillStyle = colorForType(run.type);
      }
      ctx.fillText(run.text, cursorX, y);
      cursorX += width;
    }
  };

  ctx.save();
  ctx.globalCompositeOperation = 'source-over';
  regions.forEach((region, pageIndex) => {
    const x = region.x;
    const y = region.y;
    const w = region.width;
    const h = region.height;
    const safeTop = y + h * 0.035;
    const safeBottom = y + h * 0.965;
    // Region 02 faces the central aperture; align its editor toward that edge
    // without scaling or restyling the code itself.
    const apertureFacingPage = pageIndex === 1;
    const codeLeft = x + w * (apertureFacingPage ? 0.55 : 0.055);
    const syntaxWidth = w * (apertureFacingPage ? 0.42 : 0.89);
    const scorePageIndex = pageIndex < Math.ceil(regions.length / 2) ? 0 : 1;
    const pageStart = scorePageIndex * linesPerPage;
    const pageLines = tokenLines.slice(pageStart, pageStart + linesPerPage);
    const codeTop = safeTop;
    const codeBottom = safeBottom;
    // Match the pinned Poetry in Proof editor's information density. At the
    // desktop reference size its 10px/1.42 text shows about 50–54 lines; each
    // wall page contains at most 46, so the complete page fits without making
    // the projected code larger than the original renderer.
    const targetVisibleLines = Math.max(1, pageLines.length);
    const fontSize = Math.max(
      12,
      Math.floor((codeBottom - codeTop) / (targetVisibleLines * 1.42)),
    );
    const lineHeight = Math.round(fontSize * 1.42);
    const visibleLineCapacity = Math.max(
      1,
      Math.floor((codeBottom - codeTop) / lineHeight),
    );
    const maxWindowStart = Math.max(0, pageLines.length - visibleLineCapacity);
    // Keep the source readable rather than shrinking 46 lines into illegible
    // texture. Both pages travel from their first to final line together:
    // a short top hold, a deliberate editor scroll, then a bottom hold before
    // returning to the head of the score.
    const scrollHoldMs = 2200;
    const scrollTravelMs = 8200;
    const scrollEndHoldMs = 2600;
    const scrollCycleMs = scrollHoldMs + scrollTravelMs + scrollEndHoldMs;
    const scrollClock = elapsedMs % scrollCycleMs;
    const rawScroll = scrollClock <= scrollHoldMs
      ? 0
      : scrollClock >= scrollHoldMs + scrollTravelMs
        ? 1
        : (scrollClock - scrollHoldMs) / scrollTravelMs;
    const easedScroll = rawScroll * rawScroll * (3 - 2 * rawScroll);
    const pageWindowStart = Math.round(maxWindowStart * easedScroll);
    const visibleLines = pageLines.slice(
      pageWindowStart,
      pageWindowStart + visibleLineCapacity,
    );
    const codeBlockHeight = visibleLines.length * lineHeight;
    const lineOriginY = codeTop + Math.max(
      0,
      (codeBottom - codeTop - codeBlockHeight) * 0.5,
    );

    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();
    ctx.fillStyle = palette.background;
    ctx.fillRect(x, y, w, h);
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    visibleLines.forEach((runs, localIndex) => {
      const lineY = lineOriginY + localIndex * lineHeight;
      if (lineY + lineHeight > codeBottom) return;
      drawTokenLine(runs, codeLeft, lineY, syntaxWidth, fontSize);
    });
    ctx.restore();
  });
  ctx.restore();
  return true;
}

function drawVfxCycColorBars(ctx, canvas, viewport = null) {
  if (!ctx || !canvas) return;
  const region = viewport || {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height,
  };
  const upper = ['#b4b4b4', '#b4b410', '#10b4b4', '#10b410', '#b410b4', '#b41010', '#1010b4'];
  const middle = ['#1010b4', '#101010', '#b410b4', '#101010', '#10b4b4', '#101010', '#b4b4b4'];
  const lower = ['#00214c', '#f2f2f2', '#32006a', '#101010', '#050505', '#101010', '#1b1b1b'];
  const drawRow = (colors, y, height) => {
    const width = region.width / colors.length;
    colors.forEach((color, index) => {
      ctx.fillStyle = color;
      ctx.fillRect(
        Math.floor(region.x + index * width),
        Math.floor(region.y + y),
        Math.ceil(width + 1),
        Math.ceil(height),
      );
    });
  };
  drawRow(upper, 0, region.height * 0.64);
  drawRow(middle, region.height * 0.64, region.height * 0.19);
  drawRow(lower, region.height * 0.83, region.height * 0.17);
}

function isVfxCycMediaReady(media) {
  if (!media) return false;
  if (media.tagName === 'VIDEO') return Number(media.readyState) >= 2;
  if (media.tagName === 'IMG') {
    return Boolean(
      media.complete
      && Number(media.naturalWidth) > 0
      && Number(media.naturalHeight) > 0
    );
  }
  return Boolean(
    (media.complete === undefined || media.complete)
    && Number(media.naturalWidth || media.width) > 0
    && Number(media.naturalHeight || media.height) > 0,
  );
}

function selectReadyVfxCycMedia(media, preferredIndex, { allowFallback = true } = {}) {
  if (!Array.isArray(media) || !media.length) return null;
  const start = Math.abs(Number(preferredIndex) || 0) % media.length;
  if (!allowFallback) {
    const preferred = media[start];
    return isVfxCycMediaReady(preferred) ? preferred : null;
  }
  for (let offset = 0; offset < media.length; offset += 1) {
    const candidate = media[(start + offset) % media.length];
    if (isVfxCycMediaReady(candidate)) return candidate;
  }
  return null;
}

function drawVfxCycFallbackGlitch(ctx, region, phase, seed = 0, strength = 0) {
  if (!ctx || !region) return;
  const palette = phase === 'design'
    ? ['#f7f6ef', '#090909', '#ff2367']
    : phase === 'believe'
      ? ['#050505', '#f4f4ec', '#00d8ff']
      : ['#02030e', '#f7f7ef', '#ff2367'];
  const slices = 7;
  ctx.save();
  ctx.beginPath();
  ctx.rect(region.x, region.y, region.width, region.height);
  ctx.clip();
  ctx.fillStyle = palette[0];
  ctx.fillRect(region.x, region.y, region.width, region.height);
  for (let slice = 0; slice < slices; slice += 1) {
    const hash = Math.abs(Math.sin((seed + 1) * 19.19 + slice * 71.17));
    const y = region.y + hash * region.height;
    const height = Math.max(2, region.height * (0.018 + (slice % 3) * 0.014));
    const shift = (slice % 2 ? 1 : -1)
      * region.width
      * (0.03 + Math.max(0.1, strength) * 0.08);
    ctx.globalAlpha = 0.72 + (slice % 3) * 0.1;
    ctx.fillStyle = palette[(slice % 2) + 1];
    ctx.fillRect(region.x + shift, y, region.width, height);
  }
  ctx.restore();
}

function isVfxBullPowerCabinet(u, v, columns = 131, rows = 12) {
  const panel = {
    x: Math.max(0, Math.min(1, Number(u) || 0)) * columns,
    y: Math.max(0, Math.min(1, Number(v) || 0)) * rows,
  };
  const ellipse = (cx, cy, rx, ry) => {
    const x = (panel.x - cx * columns) / Math.max(0.0001, rx * columns);
    const y = (panel.y - cy * rows) / Math.max(0.0001, ry * rows);
    return x * x + y * y <= 1;
  };
  const segment = (ax, ay, bx, by, width = 0.68) => {
    const a = { x: ax * columns, y: ay * rows };
    const b = { x: bx * columns, y: by * rows };
    const ba = { x: b.x - a.x, y: b.y - a.y };
    const pa = { x: panel.x - a.x, y: panel.y - a.y };
    const denominator = Math.max(0.0001, ba.x * ba.x + ba.y * ba.y);
    const t = Math.max(0, Math.min(1, (pa.x * ba.x + pa.y * ba.y) / denominator));
    const dx = pa.x - ba.x * t;
    const dy = pa.y - ba.y * t;
    return Math.hypot(dx, dy) <= width;
  };

  // Cabinet-resolution silhouette aligned to the later DESIGN plate on
  // processor region 02. The coarse anatomy is intentional: the audience
  // discovers a bull in the wall's boot pattern before the UHD drawing exists.
  return (
    ellipse(0.405, 0.56, 0.082, 0.155) // torso
    || ellipse(0.463, 0.575, 0.041, 0.12) // shoulder / neck
    || ellipse(0.497, 0.603, 0.031, 0.075) // head
    || ellipse(0.522, 0.572, 0.022, 0.047) // muzzle
    || segment(0.355, 0.47, 0.342, 0.16, 0.72) // rear legs
    || segment(0.385, 0.45, 0.398, 0.15, 0.72)
    || segment(0.444, 0.47, 0.435, 0.16, 0.72) // front legs
    || segment(0.468, 0.46, 0.482, 0.17, 0.72)
    || segment(0.326, 0.59, 0.302, 0.65, 0.62) // tail
    || segment(0.302, 0.65, 0.291, 0.57, 0.62)
    || ellipse(0.29, 0.56, 0.012, 0.05) // tail tuft
    || segment(0.486, 0.66, 0.497, 0.755, 0.58) // horns
    || segment(0.497, 0.755, 0.518, 0.79, 0.56)
    || segment(0.504, 0.655, 0.517, 0.72, 0.54)
    || segment(0.517, 0.72, 0.538, 0.747, 0.52)
  );
}

function drawVfxCycCabinetPowerState(ctx, canvas, cyc) {
  if (!ctx || !canvas || !cyc?.userData) return;
  const progress = Math.max(
    0,
    Math.min(1, Number(cyc.userData.wallPowerProgress) || 0),
  );
  if (progress >= 0.999) return;

  // Burn the boot state into the actual LED playback raster. This makes the
  // cabinet-by-cabinet power-up visible through the same texture path as the
  // bull, code, video, and color-bar content—independent of mesh layering.
  const columns = Math.max(1, Number(cyc.userData.ledWallSpec?.columns) || 131);
  const rows = Math.max(1, Number(cyc.userData.ledWallSpec?.rows) || 12);
  const cabinetWidth = canvas.width / columns;
  const cabinetHeight = canvas.height / rows;

  ctx.save();
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = '#000106';
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const rawHash = Math.sin(
        column * 127.1 + row * 311.7,
      ) * 43758.5453123;
      const cabinetOrder = rawHash - Math.floor(rawHash);
      const bullCabinet = isVfxBullPowerCabinet(
        (column + 0.5) / columns,
        // Canvas rows run top-to-bottom while the wall shader's cabinet UVs
        // run floor-to-ceiling. Convert once here so the raster and GPU masks
        // occupy the same cabinets—and therefore the same camera-space
        // position as the later DESIGN bull plate.
        1 - (row + 0.5) / rows,
        columns,
        rows,
      );
      // The bull is assembled by the same cabinet power event—not drawn in
      // advance. Its cells receive an earlier deterministic threshold while
      // the surrounding volume continues to wake in a randomized order.
      const turnOnAt = bullCabinet
        ? 0.045 + cabinetOrder * 0.42
        : 0.08 + cabinetOrder * 0.89;
      if (progress < turnOnAt) {
        ctx.fillRect(
          Math.floor(column * cabinetWidth),
          Math.floor(row * cabinetHeight),
          Math.ceil(cabinetWidth + 1),
          Math.ceil(cabinetHeight + 1),
        );
      }
    }
  }
  ctx.restore();
}

function drawVfxCycHyperspace(ctx, canvas, options = {}) {
  if (!ctx || !canvas) return;
  const elapsedMs = Math.max(0, Number(options.elapsedMs) || 0);
  const durationMs = Math.max(1, Number(options.durationMs) || 650);
  const progress = Math.max(0, Math.min(1, elapsedMs / durationMs));
  const eased = progress * progress * (3 - 2 * progress);
  const centerX = canvas.width * 0.505;
  const centerY = canvas.height * 0.505;
  const horizontalRadius = canvas.width * 0.62;
  const verticalRadius = canvas.height * 0.82;

  ctx.save();
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = '#071079';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Deterministic star lanes keep all four UHD processor feeds spatially
  // continuous. Every streak is drawn in the logical wall coordinate system,
  // then each processor crops its own overlapping slice.
  ctx.globalCompositeOperation = 'screen';
  ctx.lineCap = 'round';
  for (let index = 0; index < 112; index += 1) {
    const hashA = Math.sin(index * 91.733 + 17.17) * 43758.5453;
    const hashB = Math.sin(index * 37.119 + 73.31) * 24634.6345;
    const hashC = Math.sin(index * 13.913 + 41.07) * 19642.3491;
    const seedA = hashA - Math.floor(hashA);
    const seedB = hashB - Math.floor(hashB);
    const seedC = hashC - Math.floor(hashC);
    const angle = seedA * Math.PI * 2;
    const speed = 0.62 + seedB * 1.15;
    const head = (seedC * 0.62 + eased * speed) % 1;
    const length = (0.025 + seedB * 0.13) * (0.3 + eased * 0.92);
    const tail = Math.max(0.018, head - length);
    const cosine = Math.cos(angle);
    const sine = Math.sin(angle);
    const x0 = centerX + cosine * tail * horizontalRadius;
    const y0 = centerY + sine * tail * verticalRadius;
    const x1 = centerX + cosine * head * horizontalRadius;
    const y1 = centerY + sine * head * verticalRadius;
    const alpha = (0.28 + seedC * 0.62) * Math.min(1, progress * 4 + 0.16);
    ctx.strokeStyle = `rgba(${Math.round(160 + seedA * 95)},${Math.round(210 + seedB * 45)},255,${alpha.toFixed(3)})`;
    ctx.lineWidth = Math.max(2, canvas.height * (0.0011 + seedC * 0.0032));
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
  }

  const core = ctx.createRadialGradient(
    centerX,
    centerY,
    0,
    centerX,
    centerY,
    canvas.height * (0.035 + eased * 0.11),
  );
  core.addColorStop(0, `rgba(255,255,255,${(0.58 + eased * 0.34).toFixed(3)})`);
  core.addColorStop(0.12, `rgba(101,207,255,${(0.48 + eased * 0.24).toFixed(3)})`);
  core.addColorStop(1, 'rgba(17,24,242,0)');
  ctx.fillStyle = core;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}

function paintVfxMarkerCyc(cyc, options = {}) {
  const fallbackCanvas = cyc?.userData?.stageCanvas;
  const fallbackCtx = cyc?.userData?.stageCtx;
  const texture = cyc?.userData?.stageTexture;
  if (!fallbackCanvas || !fallbackCtx || !texture) {
    return { phase: 'none', frame: -1, animated: false };
  }
  const processors = Array.isArray(cyc?.userData?.stageProcessors)
    ? cyc.userData.stageProcessors
    : [];
  const processorMode = processors.length === VFX_LED_UHD_REGION_LAYOUT.count;
  const logicalCanvas = processorMode
    ? {
      width: Number(cyc.userData.stageLogicalWidth) || (
        VFX_LED_UHD_REGION_LAYOUT.count * VFX_LED_UHD_REGION_LAYOUT.width
        - (VFX_LED_UHD_REGION_LAYOUT.count - 1) * VFX_LED_UHD_REGION_LAYOUT.overlap
      ),
      height: Number(cyc.userData.stageLogicalHeight) || VFX_LED_UHD_REGION_LAYOUT.height,
    }
    : fallbackCanvas;
  const renderTargets = processorMode
    ? processors
    : [{
      index: 0,
      canvas: fallbackCanvas,
      ctx: fallbackCtx,
      texture,
      logicalX: 0,
      logicalY: 0,
      logicalWidth: fallbackCanvas.width,
      logicalHeight: fallbackCanvas.height,
    }];
  const shell = document.querySelector('.landing-v1-shell');
  const resolve = options.resolve === true;
  const requestedPhase = ['design', 'hyperspace', 'make', 'believe', 'strudel'].includes(options.phase)
    ? options.phase
    : '';
  const glitchStrength = Math.max(0, Math.min(1, Number(options.glitchStrength) || 0));
  let phase = 'blue';
  if (resolve) phase = 'resolve';
  else if (requestedPhase) phase = requestedPhase;
  else {
    const reelWallActive = document.querySelector('.tv-hero')?.dataset?.filmReelOwner === 'active';
    const style = shell?.style;
    const design = Number(style?.getPropertyValue('--crt-foreshadow-design')) || 0;
    const make = Number(style?.getPropertyValue('--crt-foreshadow-make')) || 0;
    const believe = Number(style?.getPropertyValue('--crt-foreshadow-believe')) || 0;
    if (reelWallActive) phase = 'strudel';
    else if (believe > 0.01 || shell?.dataset?.channelGlitchActive === 'true') phase = 'believe';
    else if (make > 0.01) phase = 'make';
    else if (design > 0.01) phase = 'design';
  }

  const regions = Array.isArray(cyc?.userData?.stageRegions)
    && cyc.userData.stageRegions.length
    ? cyc.userData.stageRegions
    : processorMode
      ? getVfxLogicalUhdRegionRects()
      : getVfxUhdRegionRects(fallbackCanvas);
  let frame = -1;
  let animated = false;
  renderTargets.forEach((target) => {
    const ctx = target.ctx;
    const stageCanvas = logicalCanvas;
    ctx.save();
    if (processorMode) {
      const scaleX = target.canvas.width / target.logicalWidth;
      const scaleY = target.canvas.height / target.logicalHeight;
      // Each feed paints from the same full-wall coordinate system. The
      // negative processor origin selects its overlapping UHD slice without
      // first rasterizing/downsampling a panoramic atlas.
      ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0);
      ctx.translate(-target.logicalX, -target.logicalY);
    } else {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'copy';
    ctx.fillStyle = '#1118f2';
    ctx.fillRect(0, 0, stageCanvas.width, stageCanvas.height);
    ctx.globalCompositeOperation = 'source-over';
  if (phase === 'resolve') {
    regions.forEach((region) => drawVfxCycColorBars(ctx, stageCanvas, region));
  } else if (phase === 'hyperspace') {
    drawVfxCycHyperspace(ctx, stageCanvas, {
      elapsedMs: options.hyperspaceElapsedMs,
      durationMs: options.hyperspaceDurationMs,
    });
  } else if (phase === 'strudel') {
    const painted = drawVfxCycStrudelWall(ctx, stageCanvas, regions, {
      strudelSource: options.strudelSource,
      strudelSection: options.strudelSection,
      strudelLane: options.strudelLane,
      strudelGroup: options.strudelGroup,
      strudelPulse: options.strudelPulse,
      strudelBpm: options.strudelBpm,
      strudelElapsedMs: options.strudelElapsedMs,
    });
    const wrap = document.querySelector('.tv-hero');
    if (wrap) {
      wrap.dataset.cycStrudelWall = painted ? 'live-source' : 'missing-source';
      wrap.dataset.cycStrudelSection = String(
        options.strudelSection
        || window.__resumeStrudelAudioEngine?.arrangementSection
        || 'loop',
      );
      wrap.dataset.cycStrudelLane = String(options.strudelLane || '');
      wrap.dataset.cycStrudelSourceLines = String(
        String(
          getPoetryInProofRenderSource()
          || options.strudelSource
          || window.__resumeStrudelAudioEngine?.compositionSource
          || window.__resumeActiveRawSource
          || '',
        ).split('\n').length,
      );
    }
  } else if (phase === 'design') {
    const media = Array.from(document.querySelectorAll('.crt-foreshadow__art-frame'));
    frame = Number.isInteger(options.frameIndex)
      ? Math.abs(options.frameIndex) % Math.max(1, media.length)
      : (Number(shell?.dataset?.poolRest) || 0) % Math.max(1, media.length);
    // Treat the bull as one exact UHD processor feed—not a contact sheet or a
    // wallpaper repeated across the volume. Start in region 2, then use a
    // restrained processor overlap and vertical trim to place the bull's head
    // above the Macintosh without changing the source scale.
    const preferredIndex = frame % Math.max(1, media.length);
    // DESIGN is an authored semantic progression. Never wrap a missing
    // animation to the first ready plate: doing so made the photoreal bull
    // return in place of the final pose-skeleton frame on remote builds.
    const active = selectReadyVfxCycMedia(media, preferredIndex, {
      allowFallback: false,
    });
    animated = active?.tagName === 'VIDEO';
    const sourceWidth = Number(active?.videoWidth || active?.naturalWidth || active?.width) || 0;
    const sourceHeight = Number(active?.videoHeight || active?.naturalHeight || active?.height) || 0;
    const baseDesignWindow = regions[Math.min(1, Math.max(0, regions.length - 1))] || {
      x: stageCanvas.width * 0.25,
      y: 0,
      width: stageCanvas.width * 0.25,
      height: stageCanvas.height,
    };
    const designWindow = {
      ...baseDesignWindow,
      x: baseDesignWindow.x + baseDesignWindow.width * 0.16,
      y: baseDesignWindow.y - baseDesignWindow.height * 0.07,
    };
    const painted = drawVfxCycMedia(ctx, stageCanvas, active, {
      fit: 'contain',
      glitchStrength,
      viewport: designWindow,
      maxScale: 1,
      sharpLinework: true,
      // The Taurus plates are authored both light-on-dark and dark-on-light.
      // Normalize to a black plate, then add over the blue LED field.
      composite: 'lighter',
      invert: active?.dataset?.additivePolarity === 'dark-on-light',
    });
    const designSequence = Number.isFinite(Number(options.designSequence))
      ? Number(options.designSequence)
      : Number(shell?.dataset?.designStoryStep) || 0;
    drawVfxCycDesignDraftingOverlay(ctx, designWindow, {
      sequence: designSequence,
      elapsedMs: Number(options.designElapsedMs) || 0,
      durationMs: Number(options.designDurationMs) || 65,
    });
    // Keep the authored technical dossier on the LED wall: one compact UHD
    // processor window to the right of the bull, with the current study,
    // seven-step design method and matching formula advancing in lockstep.
    // It deliberately stops before the outer edge and never expands across
    // the drawing field or Macintosh.
    const processBaseWindow = regions[Math.min(2, Math.max(0, regions.length - 1))] || {
      x: stageCanvas.width * 0.5,
      y: 0,
      width: stageCanvas.width * 0.25,
      height: stageCanvas.height,
    };
    const processWindow = {
      x: processBaseWindow.x + processBaseWindow.width * 0.18,
      y: processBaseWindow.y + processBaseWindow.height * 0.055,
      width: processBaseWindow.width * 0.76,
      height: processBaseWindow.height * 0.89,
    };
    drawVfxCycDesignProcessSheet(ctx, processWindow, {
      sequence: designSequence,
      elapsedMs: Number(options.designElapsedMs) || 0,
    });
    const wrap = document.querySelector('.tv-hero');
    if (wrap) {
      wrap.dataset.cycDesignLayout = 'single-uhd-region-02-right-16-up-07';
      wrap.dataset.cycDesignRepeated = 'false';
      wrap.dataset.cycDesignWindow = [
        designWindow.x / stageCanvas.width,
        designWindow.y / stageCanvas.height,
        designWindow.width / stageCanvas.width,
        designWindow.height / stageCanvas.height,
      ].map((value) => value.toFixed(3)).join(',');
      const drawScale = sourceWidth && sourceHeight
        ? Math.min(
          1,
          designWindow.width / sourceWidth,
          designWindow.height / sourceHeight,
        )
        : 0;
      wrap.dataset.cycDesignSourceScale = drawScale.toFixed(3);
      wrap.dataset.cycDesignNativeOrDownscaled = String(drawScale > 0 && drawScale <= 1);
      wrap.dataset.cycDesignSourceCrop = 'full-source';
      wrap.dataset.cycDesignSourceResolution = `${sourceWidth}x${sourceHeight}`;
      wrap.dataset.cycDesignLogicalSourceScale = (
        sourceWidth === VFX_LED_UHD_REGION_LAYOUT.width
          && sourceHeight === VFX_LED_UHD_REGION_LAYOUT.height
          ? '1.000'
          : 'non-native'
      );
      wrap.dataset.cycDesignRenderWidth = String(stageCanvas.width);
      wrap.dataset.cycDesignProcessSheet = 'visible-right-processor-03';
      wrap.dataset.cycDesignProcessWindow = [
        processWindow.x / stageCanvas.width,
        processWindow.y / stageCanvas.height,
        processWindow.width / stageCanvas.width,
        processWindow.height / stageCanvas.height,
      ].map((value) => value.toFixed(3)).join(',');
      wrap.dataset.cycDesignProcessPhase = String(Math.min(6, Math.floor(designSequence / 2)));
      wrap.dataset.cycDesignProcessStudy = String(
        shell?.dataset?.designStoryLabel || designSequence,
      );
      wrap.dataset.cycDesignProcessError = '';
    }
    if (!painted) {
      drawVfxCycFallbackGlitch(
        ctx,
        designWindow,
        phase,
        preferredIndex,
        glitchStrength,
      );
    }
  } else if (phase === 'make') {
    const pages = Array.from(document.querySelectorAll('.crt-foreshadow__code-page'));
    const hasAuthoredMakeFrame = shell?.dataset?.makeStoryFrame !== undefined;
    const authoredMakeFrame = Number(shell?.dataset?.makeStoryFrame);
    frame = Number.isInteger(options.frameIndex)
      ? Math.abs(options.frameIndex) % Math.max(1, pages.length)
      : hasAuthoredMakeFrame && Number.isFinite(authoredMakeFrame)
        ? Math.abs(authoredMakeFrame) % Math.max(1, pages.length)
      : (Number(shell?.dataset?.poolRest) || 0) % Math.max(1, pages.length);
    const page = pages[frame] || pages[0] || null;
    const codeVariant = String(
      options.codeVariant
      || shell?.dataset?.makeStoryVariant
      || 'lockout',
    );
    const codeCut = String(
      options.codeCut
      || shell?.dataset?.makeStoryCut
      || 'channel-tear',
    );
    const codeCrash = String(
      options.codeCrash
      || shell?.dataset?.makeStoryCrash
      || '',
    );
    regions.forEach((region, regionIndex) => {
      drawVfxCycCode(ctx, stageCanvas, page, glitchStrength, region, {
        variant: codeVariant,
        cut: codeCut,
        crash: codeCrash,
        regionIndex,
        sequence: Number(options.codeSequence)
          || Number(shell?.dataset?.makeStoryStep)
          || 0,
      });
    });
    const wrap = document.querySelector('.tv-hero');
    if (wrap) {
      wrap.dataset.cycMakeFrame = String(frame);
      wrap.dataset.cycMakeSource = String(page?.dataset?.codeSource || '');
      wrap.dataset.cycMakeVariant = codeVariant;
      wrap.dataset.cycMakeCut = codeCut;
      wrap.dataset.cycMakeCrash = codeCrash || 'none';
      wrap.dataset.cycMakeStable = String(
        options.codeStable === true || hasAuthoredMakeFrame,
      );
    }
  } else if (phase === 'believe') {
    const media = Array.from(document.querySelectorAll('.crt-foreshadow__believe-frame'));
    frame = Number.isInteger(options.frameIndex)
      ? Math.abs(options.frameIndex) % Math.max(1, media.length)
      : (Number(shell?.dataset?.believeRest) || 0) % Math.max(1, media.length);
    const preferred = media[frame] || null;
    const side = preferred?.dataset?.believeSide === 'mando-right'
      ? 'mando-right'
      : 'joker-left';
    const sideMedia = media.filter((item) => item.dataset?.believeSide === side);
    const sideFrame = Math.max(0, sideMedia.indexOf(preferred));
    const active = isVfxCycMediaReady(preferred)
      ? preferred
      : selectReadyVfxCycMedia(sideMedia, sideFrame);
    animated = active?.tagName === 'VIDEO';
    // BELIEVE is presented as a progressive perception graph. Every clip owns
    // a distinct tracked viewport in the medium camera's visible LED field;
    // prior detections remain as ghost boxes and temporal edges accumulate.
    const hudNodes = drawVfxCycBelieveHud(
      ctx,
      stageCanvas,
      media,
      frame,
      glitchStrength,
      'under',
    );
    const activeNode = hudNodes[frame] || hudNodes[0] || {
      id: 'SG_00',
      kind: 'ENTITY',
      subject: 'ANALYZING',
      action: 'MOTION PENDING',
      relation: 'RELATION PENDING',
      confidence: '0.00',
      normalized: { x: 0.36, y: 0.15, width: 0.2, height: 0.44 },
      box: {
        x: stageCanvas.width * 0.36,
        y: stageCanvas.height * 0.15,
        width: stageCanvas.width * 0.2,
        height: stageCanvas.height * 0.44,
      },
    };
    const previousIndex = frame > 0 ? frame - 1 : -1;
    const previousNode = previousIndex >= 0 ? hudNodes[previousIndex] : null;
    const previousPreferred = previousIndex >= 0 ? media[previousIndex] : null;
    const previousActive = isVfxCycMediaReady(previousPreferred)
      ? previousPreferred
      : null;
    let previousPainted = false;
    if (previousNode && previousActive) {
      // The comparison frame is a single clean draw—no chromatic support
      // passes—so two simultaneous clips add only one extra canvas blit.
      previousPainted = drawVfxCycMedia(ctx, stageCanvas, previousActive, {
        fit: 'cover',
        background: 'rgba(0,4,9,0.72)',
        glitchStrength: 0,
        viewport: previousNode.box,
        opacity: 0.72,
        preserveColor: true,
      });
    }
    const viewport = activeNode.box;
    const painted = drawVfxCycMedia(ctx, stageCanvas, active, {
      fit: 'cover',
      background: 'rgba(0,4,9,0.92)',
      glitchStrength,
      viewport,
      preserveColor: true,
    });
    if (!painted) {
      drawVfxCycFallbackGlitch(
        ctx,
        viewport,
        phase,
        frame + 47,
        glitchStrength,
      );
    }
    drawVfxCycBelieveHud(
      ctx,
      stageCanvas,
      media,
      frame,
      glitchStrength,
      'over',
    );
    const wrap = document.querySelector('.tv-hero');
    if (wrap) {
      wrap.dataset.cycBelieveLayout = 'progressive-perception-scene-graph-ultrawide-12cut';
      wrap.dataset.cycBelieveVisibleClips = previousPainted ? '2' : '1';
      wrap.dataset.cycBelieveComparison = previousPainted
        ? `${previousNode.id}->${activeNode.id}`
        : activeNode.id;
      wrap.dataset.cycBelieveMacExclusion = '0.464,0.531';
      wrap.dataset.cycBelieveSide = side;
      wrap.dataset.cycBelieveRegion = 'HUD';
      wrap.dataset.cycBelieveInward = 'ultrawide-small-to-mac-edge';
      wrap.dataset.cycBelieveFrame = String(frame);
      wrap.dataset.cycBelieveSource = String(active?.currentSrc || active?.src || '');
      wrap.dataset.cycBelieveHudActive = activeNode.id;
      wrap.dataset.cycBelieveHudKind = activeNode.kind;
      wrap.dataset.cycBelieveHudSubject = activeNode.subject;
      wrap.dataset.cycBelieveHudAction = activeNode.action;
      wrap.dataset.cycBelieveHudRelation = activeNode.relation;
      wrap.dataset.cycBelieveHudConfidence = activeNode.confidence;
      wrap.dataset.cycBelieveHudNodes = String(Math.min(frame + 1, hudNodes.length));
      wrap.dataset.cycBelieveHudEdges = String(Math.max(0, Math.min(frame, hudNodes.length - 1)));
      wrap.dataset.cycBelieveHeaderBand = 'none-text-only';
      wrap.dataset.cycBelieveHudBox = [
        activeNode.normalized.x,
        activeNode.normalized.y,
        activeNode.normalized.width,
        activeNode.normalized.height,
      ].map((value) => Number(value).toFixed(3)).join(',');
    }
  }
    drawVfxCycCabinetPowerState(ctx, stageCanvas, cyc);
    ctx.restore();
    target.texture.needsUpdate = true;
  });
  const stageMaterial = cyc?.userData?.surfaceMaterial;
  const strudelHtml = cyc?.userData?.strudelHtmlTexture;
  const useLiveDomTexture = Boolean(
    !processorMode
    &&
    phase === 'strudel'
    && strudelHtml?.supported
    && strudelHtml.sync?.({
      strudelElapsedMs: options.strudelElapsedMs,
    }),
  );
  const requestedTexture = useLiveDomTexture ? strudelHtml.texture : texture;
  if (stageMaterial?.map !== requestedTexture) {
    stageMaterial.map = requestedTexture;
    stageMaterial.needsUpdate = true;
  }
  cyc.userData.stageTextureMode = useLiveDomTexture
    ? 'html-texture-live-dom'
    : processorMode
      ? `4x-processor-canvas-${cyc.userData.stageProcessorResolution}`
      : 'canvas-atlas';
  const wrap = document.querySelector('.tv-hero');
  if (wrap) {
    wrap.dataset.cycTextureMode = cyc.userData.stageTextureMode;
    wrap.dataset.htmlTextureSupport = strudelHtml?.supported ? 'native' : 'fallback';
    wrap.dataset.htmlTextureReason = String(strudelHtml?.reason || 'not-created');
  }
  cyc.userData.stagePhase = phase;
  cyc.userData.stageFrame = frame;
  return { phase, frame, animated };
}

function createVfxMarkerCyc(THREE, renderer, modelBox, anchorBox = modelBox) {
  if (!THREE || !modelBox || modelBox.isEmpty()) return null;
  const size = modelBox.getSize(new THREE.Vector3());
  const stageAnchor = (
    anchorBox && !anchorBox.isEmpty()
      ? anchorBox
      : modelBox
  );
  const center = stageAnchor.getCenter(new THREE.Vector3());
  const anchorSize = stageAnchor.getSize(new THREE.Vector3());
  const wallMarkerTexture = createVfxMarkerCycTexture(THREE, renderer, {
    columns: 15,
    rows: 3,
  });
  const floorMarkerTexture = createVfxMarkerCycTexture(THREE, renderer, {
    columns: 5,
    rows: 3,
  });
  const stage = createVfxStageTexture(THREE, renderer);
  const strudelHtml = createVfxStrudelHtmlTexture(THREE, renderer, stage);
  const ledWall = createVfxLedVolumeTexture(THREE, renderer, { type: 'wall' });
  const ledCeiling = createVfxLedVolumeTexture(THREE, renderer, { type: 'ceiling' });
  if (!wallMarkerTexture || !floorMarkerTexture || !stage || !ledWall || !ledCeiling) return null;

  // ILM's original StageCraft volume for The Mandalorian was a 75-foot
  // diameter, 20-foot-high, 270-degree LED wall with an LED ceiling. The open
  // 90 degrees was the access / filming mouth. Keep that architectural grammar
  // here instead of treating the background as a conventional studio cyc.
  const mouthAngle = Math.PI * 0.5;
  const mouthHalfAngle = mouthAngle * 0.5;
  const arcStart = mouthHalfAngle;
  const arcSpan = Math.PI * 2 - mouthAngle;
  const referenceWallArcM = ledWall.columns * (ledWall.panelWidthMm / 1000);
  const referenceWallRadiusM = referenceWallArcM / arcSpan;
  const referenceWallHeightM = ledWall.rows * (ledWall.panelHeightMm / 1000);
  // Preserve real relative scale: a roughly 34 cm compact Macintosh and a
  // 92 cm production monitor trolley belong comfortably inside a documented
  // 6 m LED wall.
  // The previous width-only heuristic made the wall barely taller than the
  // computer, so adding real desk legs incorrectly put the setup above the
  // volume.
  const radius = Math.max(
    anchorSize.x * 2.05,
    size.x * 1.55,
    size.y * (referenceWallRadiusM / MAC_REFERENCE_HEIGHT_M),
    4.2,
  );
  const diameter = radius * 2;
  const wallHeight = radius * (referenceWallHeightM / referenceWallRadiusM);
  // The Macintosh sits on a real monitor trolley. Align the LED-volume floor
  // with the caster contact patches rather than letting the top tray read as
  // the floor.
  const floorY = modelBox.min.y - size.y * (
    0.016 + MONITOR_TROLLEY_REFERENCE_HEIGHT_M / MAC_REFERENCE_HEIGHT_M
  );
  // Keep the hero setup close to the volume mouth. The former 15-foot inset
  // was a plausible stage position, but it made the Macintosh read as distant
  // set dressing in every exterior angle. Three feet retains LED-wall depth
  // behind the subject while allowing a camera at the mouth to frame the
  // computer as the hero.
  const referenceSetupInsetM = 3 * 0.3048;
  const setupInset = radius * (referenceSetupInsetM / referenceWallRadiusM);
  const mouthZ = (
    modelBox.max.z
    + Math.max(size.z * 0.055, 0.08)
    + setupInset
  );
  const volumeCenterZ = mouthZ - radius * Math.cos(mouthHalfAngle);
  const backZ = volumeCenterZ - radius;
  // One geometric quad per physical BP2 cabinet: 131 around × 12 high.
  const wallSegments = ledWall.columns;
  const heightSegments = ledWall.rows;

  const makeWallGeometry = (height = wallHeight, yBase = 0, radiusOffset = 0) => {
    const positions = [];
    const uvs = [];
    const indices = [];
    const wallRadius = radius + radiusOffset;
    for (let row = 0; row <= heightSegments; row += 1) {
      const v = row / heightSegments;
      const y = yBase + height * v;
      for (let column = 0; column <= wallSegments; column += 1) {
        const u = column / wallSegments;
        const theta = arcStart + arcSpan * u;
        positions.push(
          Math.sin(theta) * wallRadius,
          y,
          Math.cos(theta) * wallRadius,
        );
        // CanvasTexture already performs the browser-image Y conversion.
        // Keep v=0 at the floor and v=1 at the top. The cylindrical wall is
        // viewed from its inside surface, so its geometric column direction
        // runs opposite the audience-facing image direction: reverse U once
        // here so text and video are not mirrored across the LED volume.
        uvs.push(1 - u, v);
      }
    }
    const rowWidth = wallSegments + 1;
    for (let row = 0; row < heightSegments; row += 1) {
      for (let column = 0; column < wallSegments; column += 1) {
        const a = row * rowWidth + column;
        const b = a + 1;
        const c = a + rowWidth;
        const d = c + 1;
        indices.push(a, c, b, b, c, d);
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();
    return geometry;
  };

  const wallGeometry = makeWallGeometry();
  const wallMarkerGeometry = wallGeometry.clone();
  // The documented BP2V2 cabinet depth is 90 mm. Scale it from the same
  // physical reference used for the wall radius so profile/crane views reveal
  // the real cabinet thickness rather than a paper-thin, double-sided screen.
  const cabinetDepth = radius * (0.09 / referenceWallRadiusM);
  const wallRearGeometry = makeWallGeometry(wallHeight, 0, cabinetDepth);
  const referenceCeilingAreaM2 = (
    ledCeiling.panelCount
    * (ledCeiling.panelWidthMm / 1000)
    * (ledCeiling.panelHeightMm / 1000)
  );
  const referenceCeilingRadiusM = Math.sqrt(referenceCeilingAreaM2 / Math.PI);
  const ceilingRadius = radius * (referenceCeilingRadiusM / referenceWallRadiusM);
  const ceilingGeometry = new THREE.CircleGeometry(ceilingRadius, 128);
  ceilingGeometry.rotateX(Math.PI * 0.5);
  ceilingGeometry.translate(0, wallHeight, 0);
  const floorGeometry = new THREE.CircleGeometry(radius * 1.035, 128);
  floorGeometry.rotateX(-Math.PI * 0.5);
  const floorMarkerGeometry = floorGeometry.clone();

  const stageProcessorTextures = Array.isArray(stage.processors)
    ? stage.processors.map((processor) => processor.texture)
    : [];
  const stageProcessorMode = stageProcessorTextures.length === VFX_LED_UHD_REGION_LAYOUT.count;
  const surfaceMaterial = new THREE.MeshBasicMaterial({
    map: stageProcessorTextures[0] || stage.texture,
    transparent: false,
    depthTest: true,
    depthWrite: true,
    // makeWallGeometry winds toward the performance volume.
    side: THREE.FrontSide,
    toneMapped: false,
  });
  surfaceMaterial.name = 'VfxLedWallMediaMaterial';
  surfaceMaterial.userData.mediaTarget = 'wall';
  // Apply cabinet power inside the media material itself. A separate coplanar
  // black overlay could lose a depth tie against the media face, making the
  // telemetry report a boot while the audience still saw a fully blue wall.
  // One shader now owns both states, so an unpowered cabinet is unconditionally
  // black and a powered cabinet reveals the mapped program feed.
  const wallInlinePowerProgress = { value: 0 };
  surfaceMaterial.userData.powerProgressUniform = wallInlinePowerProgress;
  surfaceMaterial.onBeforeCompile = (shader) => {
    shader.uniforms.uWallPanelGrid = {
      value: new THREE.Vector2(ledWall.columns, ledWall.rows),
    };
    shader.uniforms.uWallPowerProgress = wallInlinePowerProgress;
    if (stageProcessorMode) {
      shader.uniforms.uWallProcessor02 = { value: stageProcessorTextures[1] };
      shader.uniforms.uWallProcessor03 = { value: stageProcessorTextures[2] };
      shader.uniforms.uWallProcessor04 = { value: stageProcessorTextures[3] };
    }
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <map_pars_fragment>',
      `
        #include <map_pars_fragment>
        ${stageProcessorMode ? `
          uniform sampler2D uWallProcessor02;
          uniform sampler2D uWallProcessor03;
          uniform sampler2D uWallProcessor04;
        ` : ''}
        uniform vec2 uWallPanelGrid;
        uniform float uWallPowerProgress;
        float wallPanelHash(vec2 panel) {
          return fract(sin(dot(panel, vec2(127.1, 311.7))) * 43758.5453123);
        }
        float wallBullEllipse(
          vec2 panelCenter,
          vec2 centerUv,
          vec2 radiusUv
        ) {
          vec2 q = (
            panelCenter / uWallPanelGrid - centerUv
          ) / max(radiusUv, vec2(0.0001));
          return 1.0 - step(1.0, dot(q, q));
        }
        float wallBullSegment(
          vec2 panelCenter,
          vec2 startUv,
          vec2 endUv,
          float widthPanels
        ) {
          vec2 a = startUv * uWallPanelGrid;
          vec2 b = endUv * uWallPanelGrid;
          vec2 pa = panelCenter - a;
          vec2 ba = b - a;
          float h = clamp(
            dot(pa, ba) / max(0.0001, dot(ba, ba)),
            0.0,
            1.0
          );
          return 1.0 - step(widthPanels, length(pa - ba * h));
        }
        float wallBullMask(vec2 panelCenter) {
          float mask = 0.0;
          mask = max(mask, wallBullEllipse(panelCenter, vec2(0.405, 0.560), vec2(0.082, 0.155)));
          mask = max(mask, wallBullEllipse(panelCenter, vec2(0.463, 0.575), vec2(0.041, 0.120)));
          mask = max(mask, wallBullEllipse(panelCenter, vec2(0.497, 0.603), vec2(0.031, 0.075)));
          mask = max(mask, wallBullEllipse(panelCenter, vec2(0.522, 0.572), vec2(0.022, 0.047)));
          mask = max(mask, wallBullSegment(panelCenter, vec2(0.355, 0.470), vec2(0.342, 0.160), 0.72));
          mask = max(mask, wallBullSegment(panelCenter, vec2(0.385, 0.450), vec2(0.398, 0.150), 0.72));
          mask = max(mask, wallBullSegment(panelCenter, vec2(0.444, 0.470), vec2(0.435, 0.160), 0.72));
          mask = max(mask, wallBullSegment(panelCenter, vec2(0.468, 0.460), vec2(0.482, 0.170), 0.72));
          mask = max(mask, wallBullSegment(panelCenter, vec2(0.326, 0.590), vec2(0.302, 0.650), 0.62));
          mask = max(mask, wallBullSegment(panelCenter, vec2(0.302, 0.650), vec2(0.291, 0.570), 0.62));
          mask = max(mask, wallBullEllipse(panelCenter, vec2(0.290, 0.560), vec2(0.012, 0.050)));
          mask = max(mask, wallBullSegment(panelCenter, vec2(0.486, 0.660), vec2(0.497, 0.755), 0.58));
          mask = max(mask, wallBullSegment(panelCenter, vec2(0.497, 0.755), vec2(0.518, 0.790), 0.56));
          mask = max(mask, wallBullSegment(panelCenter, vec2(0.504, 0.655), vec2(0.517, 0.720), 0.54));
          mask = max(mask, wallBullSegment(panelCenter, vec2(0.517, 0.720), vec2(0.538, 0.747), 0.52));
          return step(0.5, mask);
        }
      `,
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <map_fragment>',
      `
        ${stageProcessorMode ? `
          #ifdef USE_MAP
            // Four 3840×2160 processor feeds cover a 14,784×2,160 logical
            // wall. Adjacent feeds overlap by 192 pixels; switch at each
            // overlap midpoint so both sides sample identical source pixels.
            float wallLogicalX = vMapUv.x * 14784.0;
            vec4 sampledDiffuseColor;
            if (wallLogicalX < 3744.0) {
              sampledDiffuseColor = texture2D(
                map,
                vec2(wallLogicalX / 3840.0, vMapUv.y)
              );
            } else if (wallLogicalX < 7392.0) {
              sampledDiffuseColor = texture2D(
                uWallProcessor02,
                vec2((wallLogicalX - 3648.0) / 3840.0, vMapUv.y)
              );
            } else if (wallLogicalX < 11040.0) {
              sampledDiffuseColor = texture2D(
                uWallProcessor03,
                vec2((wallLogicalX - 7296.0) / 3840.0, vMapUv.y)
              );
            } else {
              sampledDiffuseColor = texture2D(
                uWallProcessor04,
                vec2((wallLogicalX - 10944.0) / 3840.0, vMapUv.y)
              );
            }
            diffuseColor *= sampledDiffuseColor;
          #endif
        ` : '#include <map_fragment>'}
        vec2 wallPanel = floor(vMapUv * uWallPanelGrid);
        vec2 wallPanelCenter = wallPanel + vec2(0.5);
        float wallOrder = wallPanelHash(wallPanel);
        float bullMask = wallBullMask(wallPanelCenter);
        float backgroundThreshold = 0.08 + wallOrder * 0.89;
        float bullThreshold = 0.045 + wallOrder * 0.42;
        float wallThreshold = mix(backgroundThreshold, bullThreshold, bullMask);
        float wallPowered = step(wallThreshold, uWallPowerProgress);
        // Boot is binary and physically legible: cabinets are either black
        // (off) or the final stage blue (on). Do not tint the bull white or
        // reveal program imagery until Enter hands the wall to DESIGN.
        // The canvas blue is authored as sRGB #1118f2. Shader literals are
        // linear values, so use its exact linear-light conversion instead of
        // feeding the sRGB channel numbers directly and washing the wall out.
        vec3 stageBlue = vec3(
          0.0056053916,
          0.0091340587,
          0.8879231179
        );
        vec3 poweredColor = mix(
          stageBlue,
          diffuseColor.rgb,
          step(0.999, uWallPowerProgress)
        );
        diffuseColor.rgb = mix(
          vec3(0.0),
          poweredColor,
          wallPowered
        );
        diffuseColor.a = 1.0;
      `,
    );
  };
  surfaceMaterial.customProgramCacheKey = () => (
    stageProcessorMode
      ? 'vfx-led-wall-4x-uhd-processor-bull-power-srgb-match-v5'
      : 'vfx-led-wall-inline-bull-power-srgb-match-v4'
  );
  // The glitch/program feed is currently authored for the curved BP2 wall
  // only. The ceiling is an independent practical: it powers up with the wall
  // but resolves to a stable blue instead of inheriting the wall program.
  const ceilingMaterial = new THREE.MeshBasicMaterial({
    color: 0x0018ff,
    transparent: false,
    depthTest: true,
    depthWrite: true,
    side: THREE.DoubleSide,
    toneMapped: false,
  });
  ceilingMaterial.name = 'VfxLedCeilingBluePracticalMaterial';
  ceilingMaterial.userData.mediaTarget = 'none';
  const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0x070a2d,
    roughness: 0.96,
    metalness: 0.02,
    depthTest: true,
    depthWrite: true,
    side: THREE.DoubleSide,
  });
  const wallMarkerMaterial = new THREE.MeshBasicMaterial({
    map: wallMarkerTexture,
    transparent: true,
    alphaTest: 0.015,
    depthTest: true,
    depthWrite: false,
    side: THREE.FrontSide,
    toneMapped: false,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -3,
  });
  const floorMarkerMaterial = wallMarkerMaterial.clone();
  floorMarkerMaterial.map = floorMarkerTexture;
  const ledMaterial = createVfxLedCabinetMaterial(THREE, ledWall, 0.115);
  if (ledMaterial) ledMaterial.side = THREE.FrontSide;
  const wallPowerMaterial = createVfxLedPowerMaskMaterial(THREE, ledWall);
  const ceilingLedMaterial = createVfxLedCabinetMaterial(THREE, ledCeiling, 0.075);
  const rearCabinetMaterial = createVfxLedRearCabinetMaterial(THREE, ledWall);
  const structureMaterial = new THREE.MeshBasicMaterial({
    color: 0x050508,
    side: THREE.DoubleSide,
    toneMapped: false,
  });

  const surfaceMesh = new THREE.Group();
  surfaceMesh.name = 'VfxVolumeSurfaces';
  const wallSurfaceMesh = new THREE.Mesh(wallGeometry, surfaceMaterial);
  wallSurfaceMesh.name = 'VfxVolumeWall';
  const wallRearMesh = new THREE.Mesh(wallRearGeometry, rearCabinetMaterial);
  wallRearMesh.name = 'VfxVolumeWallRearCabinets';
  const ceilingSurfaceMesh = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
  ceilingSurfaceMesh.name = 'VfxVolumeCeiling';
  const floorSurfaceMesh = new THREE.Mesh(floorGeometry, floorMaterial);
  floorSurfaceMesh.name = 'VfxVolumePracticalFloor';
  surfaceMesh.add(wallSurfaceMesh, wallRearMesh, ceilingSurfaceMesh, floorSurfaceMesh);
  surfaceMesh.renderOrder = -4;
  surfaceMesh.traverse((object) => {
    object.frustumCulled = false;
    object.renderOrder = -4;
  });

  const ledMesh = new THREE.Group();
  ledMesh.name = 'VfxLedVolumePanels';
  const wallPowerMesh = new THREE.Mesh(wallGeometry, wallPowerMaterial);
  wallPowerMesh.name = 'VfxLedWallPowerMask';
  // Diagnostic shader only. The visible power state is burned into the media
  // raster below so it cannot overlap foreground geometry or depth-fight.
  wallPowerMesh.visible = false;
  const wallLedMesh = new THREE.Mesh(wallGeometry, ledMaterial);
  wallLedMesh.name = 'VfxLedWallPanels';
  const ceilingLedMesh = new THREE.Mesh(ceilingGeometry, ceilingLedMaterial);
  ceilingLedMesh.name = 'VfxLedCeilingPanels';
  ceilingSurfaceMesh.visible = false;
  ceilingLedMesh.visible = false;
  ledMesh.add(wallPowerMesh, wallLedMesh, ceilingLedMesh);
  ledMesh.renderOrder = -3;
  ledMesh.traverse((object) => {
    object.frustumCulled = false;
    object.renderOrder = -3;
  });
  // The black power mask sits above the media face but below cabinet seams.
  wallPowerMesh.renderOrder = -3.5;
  wallLedMesh.renderOrder = -3;
  ceilingLedMesh.renderOrder = -3;

  const markerMesh = new THREE.Group();
  markerMesh.name = 'VfxVolumeTrackingMarkers';
  const wallMarkerMesh = new THREE.Mesh(wallMarkerGeometry, wallMarkerMaterial);
  wallMarkerMesh.name = 'VfxVolumeWallMarkers';
  const floorMarkerMesh = new THREE.Mesh(floorMarkerGeometry, floorMarkerMaterial);
  floorMarkerMesh.name = 'VfxVolumeFloorMarkers';
  floorMarkerMesh.position.y = Math.max(0.006, radius * 0.00045);
  markerMesh.add(wallMarkerMesh, floorMarkerMesh);
  markerMesh.visible = false;
  markerMesh.renderOrder = -2;
  markerMesh.traverse((object) => {
    object.frustumCulled = false;
    object.renderOrder = -2;
  });

  // The black mouth rails and top header reveal the physical boundary of the
  // LED stage in profile views. Front-on they sit outside the hero composition.
  const structureMesh = new THREE.Group();
  structureMesh.name = 'VfxVolumeMouthStructure';
  const railWidth = Math.max(0.07, radius * 0.006);
  const railDepth = Math.max(0.12, radius * 0.012);
  const railGeometry = new THREE.BoxGeometry(
    railWidth,
    wallHeight * 1.018,
    railDepth,
  );
  [arcStart, arcStart + arcSpan].forEach((theta, index) => {
    const rail = new THREE.Mesh(railGeometry, structureMaterial);
    rail.name = `VfxVolumeMouthRail${index + 1}`;
    rail.position.set(
      Math.sin(theta) * radius,
      wallHeight * 0.5,
      Math.cos(theta) * radius,
    );
    rail.rotation.y = theta;
    structureMesh.add(rail);
  });
  const headerGeometry = makeWallGeometry(
    Math.max(0.09, wallHeight * 0.018),
    wallHeight,
    radius * 0.006,
  );
  const headerMesh = new THREE.Mesh(headerGeometry, structureMaterial);
  headerMesh.name = 'VfxVolumeTopHeader';
  structureMesh.add(headerMesh);

  const cyc = new THREE.Group();
  cyc.name = 'VfxStageCraftVolume';
  cyc.position.set(center.x, floorY, volumeCenterZ);
  cyc.add(surfaceMesh, ledMesh, markerMesh, structureMesh);
  cyc.userData.markerTexture = wallMarkerTexture;
  cyc.userData.markerTextures = [wallMarkerTexture, floorMarkerTexture];
  cyc.userData.stageTexture = stage.texture;
  cyc.userData.stageProcessors = stage.processors || [];
  cyc.userData.stageProcessorTextures = stageProcessorTextures;
  cyc.userData.stageTextures = stageProcessorMode
    ? stageProcessorTextures
    : [stage.texture];
  cyc.userData.stageProcessorResolution = stage.processorResolution;
  cyc.userData.stageProcessorResolutionScale = stage.processorResolutionScale;
  cyc.userData.stageLogicalWidth = stage.logicalWidth;
  cyc.userData.stageLogicalHeight = stage.logicalHeight;
  cyc.userData.strudelHtmlTexture = strudelHtml;
  cyc.userData.stageCanvas = stage.canvas;
  cyc.userData.stageCtx = stage.ctx;
  cyc.userData.stageRegions = stage.regionRects;
  cyc.userData.stageRegionCount = stage.regionRects.length;
  cyc.userData.stageRegionResolution = `${stage.logicalRegionWidth}x${stage.logicalRegionHeight}`;
  cyc.userData.stageAtlasResolution = `${stage.logicalWidth}x${stage.logicalHeight}`;
  cyc.userData.stageRegionOverlap = stage.logicalOverlap;
  cyc.userData.stageMapping = stageProcessorMode
    ? '4x-independent-uhd-overlap-midpoint'
    : '4x-uhd-overlap-atlas';
  cyc.userData.stageTextureMode = stageProcessorMode
    ? `4x-processor-canvas-${stage.processorResolution}`
    : 'canvas-atlas';
  cyc.userData.mediaTargets = ['wall'];
  cyc.userData.wallMediaMapped = surfaceMaterial.map === (
    stageProcessorTextures[0] || stage.texture
  );
  cyc.userData.wallRearMediaMapped = Boolean(rearCabinetMaterial?.map);
  cyc.userData.ceilingMediaMapped = Boolean(ceilingMaterial.map);
  cyc.userData.ceilingMediaState = 'blue-practical-unmapped';
  cyc.userData.surfaceMesh = surfaceMesh;
  cyc.userData.ledMesh = ledMesh;
  cyc.userData.markerMesh = markerMesh;
  cyc.userData.structureMesh = structureMesh;
  cyc.userData.geometry = wallGeometry;
  cyc.userData.geometries = [
    wallGeometry,
    wallRearGeometry,
    ceilingGeometry,
    floorGeometry,
    wallMarkerGeometry,
    floorMarkerGeometry,
    railGeometry,
    headerGeometry,
  ];
  cyc.userData.markerGeometry = wallMarkerGeometry;
  cyc.userData.surfaceMaterial = surfaceMaterial;
  cyc.userData.surfaceMaterials = [
    surfaceMaterial,
    rearCabinetMaterial,
    ceilingMaterial,
    floorMaterial,
    structureMaterial,
  ];
  cyc.userData.ledMaterial = ledMaterial;
  cyc.userData.ledMaterials = [wallPowerMaterial, ledMaterial, ceilingLedMaterial];
  cyc.userData.markerMaterial = wallMarkerMaterial;
  cyc.userData.markerMaterials = [wallMarkerMaterial, floorMarkerMaterial];
  cyc.userData.ledTexture = ledWall.texture;
  cyc.userData.ledTextures = [ledWall.texture, ledCeiling.texture];
  cyc.userData.ledPixelPitch = `${ledWall.pixelPitchMm}mm`;
  cyc.userData.ledPanelGrid = ledWall.panelGrid;
  cyc.userData.ledWallSpec = ledWall;
  cyc.userData.wallPowerMesh = wallPowerMesh;
  cyc.userData.wallPowerMaterial = wallPowerMaterial;
  cyc.userData.ceilingPowerSurfaceMesh = ceilingSurfaceMesh;
  cyc.userData.ceilingPowerLedMesh = ceilingLedMesh;
  cyc.userData.ceilingPowerProgress = 0;
  cyc.userData.wallPowerProgress = 0;
  cyc.userData.wallPowerLocked = false;
  cyc.userData.setWallPowerProgress = (value, lock = false) => {
    const next = Math.max(0, Math.min(1, Number(value) || 0));
    cyc.userData.wallPowerProgress = next;
    if (lock) cyc.userData.wallPowerLocked = true;
    if (wallPowerMaterial?.uniforms?.uPowerProgress) {
      wallPowerMaterial.uniforms.uPowerProgress.value = next;
    }
    if (surfaceMaterial?.userData?.powerProgressUniform) {
      surfaceMaterial.userData.powerProgressUniform.value = next;
    }
    const ceilingOn = next > 0;
    ceilingSurfaceMesh.visible = ceilingOn;
    ceilingLedMesh.visible = ceilingOn;
    cyc.userData.ceilingPowerProgress = ceilingOn ? 1 : 0;
    paintVfxMarkerCyc(cyc, { force: true });
    return next;
  };
  cyc.userData.wallRearMesh = wallRearMesh;
  cyc.userData.wallCabinetDepth = cabinetDepth;
  cyc.userData.wallCabinetDepthMm = 90;
  cyc.userData.wallRearProfile = 'ROE-BP2V2-low-detail-rear-shader';
  cyc.userData.ledCeilingSpec = ledCeiling;
  cyc.userData.displayType = 'led-volume';
  cyc.userData.markerCount = 0;
  cyc.userData.markerLayout = 'hidden-pending-map';
  cyc.userData.trackingMarkersEnabled = false;
  cyc.userData.profile = 'stagecraft-270-wall-ceiling';
  cyc.userData.stageWidth = diameter;
  cyc.userData.stageCenterX = center.x;
  cyc.userData.backZ = backZ;
  cyc.userData.backOffset = stageAnchor.min.z - backZ;
  cyc.userData.floorReach = radius * (1 + Math.cos(mouthHalfAngle));
  cyc.userData.coveRadius = 0;
  cyc.userData.coveRatio = 0;
  cyc.userData.baseRadius = radius;
  cyc.userData.effectiveRadius = radius;
  cyc.userData.wallHeight = wallHeight;
  cyc.userData.effectiveWallHeight = wallHeight;
  cyc.userData.volumeCenterZ = volumeCenterZ;
  cyc.userData.mouthZ = mouthZ;
  cyc.userData.mouthAngleDeg = 90;
  cyc.userData.arcAngleDeg = 270;
  cyc.userData.setupPlacement = '3ft-inside-mouth';
  cyc.userData.referenceSetupInsetM = referenceSetupInsetM;
  cyc.userData.hasLedCeiling = true;
  cyc.userData.referenceDimensions = '75ft-diameter_20ft-high';
  cyc.userData.referenceWallDiameterM = referenceWallRadiusM * 2;
  cyc.userData.referencePerformanceDiameterM = 75 * 0.3048;
  cyc.userData.referenceWallHeightM = referenceWallHeightM;
  cyc.userData.referenceCeilingAreaM2 = referenceCeilingAreaM2;
  cyc.userData.referenceClearanceM = (
    referenceWallRadiusM - (75 * 0.3048) * 0.5
  );
  paintVfxMarkerCyc(cyc, { resolve: false });
  return cyc;
}

function createMacStickyNote(THREE, caseBox, screenBox, options = {}) {
  if (!THREE || !caseBox || caseBox.isEmpty()) return null;
  const {
    text = 'resume',
    href = '/Resume.html',
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
    fullscreenToolbarFold = false,
    showArrow = true,
    interactive = Boolean(href),
    labelCenterX = null,
    labelFontSize = null,
    labelLines = null,
    splitLinks = null,
    qrMode = false,
    aspectRatio = null,
    foldStyle = 'corner',
    offsetXFactor = 0,
    offsetYFactor = 0,
  } = options;
  const caseSize = caseBox.getSize(new THREE.Vector3());
  const logicalWidth = 640;
  const logicalHeight = 520;
  const textureScale = 2;
  const canvas = document.createElement('canvas');
  canvas.width = logicalWidth * textureScale;
  canvas.height = logicalHeight * textureScale;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(textureScale, 0, 0, textureScale, 0, 0);
  let qrImage = null;
  const hasSplitLinks = Array.isArray(splitLinks) && splitLinks.length >= 2;
  const normalizedFoldSide = foldSide === 'left' ? 'left' : 'right';
  const horizontalFold = foldStyle === 'horizontal' || foldStyle === 'horizontal-top';
  const topHorizontalFold = foldStyle === 'horizontal-top';
  const clamp01 = (value) => Math.max(0, Math.min(1, Number(value) || 0));
  let fullscreenFoldProgress = 0;
  const draw = () => {
    ctx.clearRect(0, 0, logicalWidth, logicalHeight);
    const paperLeft = 22;
    const paperRight = 612;
    const paperBottom = 478;
    const toolbarFoldAmount = fullscreenToolbarFold && normalizedFoldSide === 'right'
      ? clamp01(fullscreenFoldProgress)
      : 0;
    const toolbarFoldEase = toolbarFoldAmount * toolbarFoldAmount * (3 - 2 * toolbarFoldAmount);
    const drawFullscreenToolbarFold = () => {
      if (toolbarFoldEase <= 0) return;
      const foldW = 96 + toolbarFoldEase * 286;
      const foldH = 74 + toolbarFoldEase * 210;
      const bottomX = paperRight - foldW;
      const rightY = paperBottom - foldH;
      const creaseC1X = paperRight - foldW * 0.62;
      const creaseC1Y = paperBottom - foldH * 0.04;
      const creaseC2X = paperRight - foldW * 0.2;
      const creaseC2Y = paperBottom - foldH * 0.43;

      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.moveTo(bottomX, paperBottom + 2);
      ctx.bezierCurveTo(creaseC1X, creaseC1Y, creaseC2X, creaseC2Y, paperRight + 2, rightY);
      ctx.lineTo(paperRight + 2, paperBottom + 2);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      ctx.save();
      const band = 14 + toolbarFoldEase * 26;
      const flap = ctx.createLinearGradient(bottomX, paperBottom, paperRight, rightY);
      flap.addColorStop(0, 'rgba(255, 251, 189, 0.96)');
      flap.addColorStop(0.48, 'rgba(255, 238, 126, 0.9)');
      flap.addColorStop(1, 'rgba(181, 128, 30, 0.82)');
      ctx.fillStyle = flap;
      ctx.beginPath();
      ctx.moveTo(bottomX, paperBottom - 2);
      ctx.bezierCurveTo(creaseC1X, creaseC1Y, creaseC2X, creaseC2Y, paperRight - 1, rightY);
      ctx.lineTo(paperRight - band * 0.7, rightY + band);
      ctx.bezierCurveTo(
        creaseC2X - band * 0.38,
        creaseC2Y + band * 0.58,
        creaseC1X - band * 0.45,
        creaseC1Y + band * 0.18,
        bottomX + band,
        paperBottom - band * 0.38,
      );
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = `rgba(122, 91, 24, ${0.2 + toolbarFoldEase * 0.24})`;
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.moveTo(bottomX + 2, paperBottom - 2);
      ctx.bezierCurveTo(creaseC1X, creaseC1Y, creaseC2X, creaseC2Y, paperRight - 1, rightY + 2);
      ctx.stroke();
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.24 + toolbarFoldEase * 0.28})`;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(bottomX + band * 0.9, paperBottom - band * 0.52);
      ctx.bezierCurveTo(
        creaseC1X + foldW * 0.05,
        creaseC1Y - foldH * 0.02,
        creaseC2X + foldW * 0.04,
        creaseC2Y - foldH * 0.08,
        paperRight - band * 1.15,
        rightY + band * 0.68,
      );
      ctx.stroke();
      ctx.restore();
    };
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
    if (horizontalFold) {
      const paperTop = 22;
      const creaseY = topHorizontalFold ? paperTop + 82 : paperBottom - 82;
      const shadeStart = topHorizontalFold ? paperTop : creaseY - 24;
      const shadeEnd = topHorizontalFold ? creaseY + 24 : paperBottom;
      const horizontalShade = ctx.createLinearGradient(0, shadeStart, 0, shadeEnd);
      horizontalShade.addColorStop(0, 'rgba(255,255,255,0)');
      horizontalShade.addColorStop(0.32, 'rgba(92,18,57,0.14)');
      horizontalShade.addColorStop(0.42, 'rgba(255,255,255,0.28)');
      horizontalShade.addColorStop(1, 'rgba(84,15,52,0.18)');
      ctx.fillStyle = horizontalShade;
      ctx.fillRect(paperLeft, shadeStart, paperRight - paperLeft, shadeEnd - shadeStart);
      ctx.strokeStyle = 'rgba(105,24,68,0.34)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(paperLeft, creaseY);
      ctx.bezierCurveTo(178, creaseY - 3, 446, creaseY + 3, paperRight, creaseY);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,0.24)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(paperLeft, creaseY + 5);
      ctx.bezierCurveTo(190, creaseY + 2, 452, creaseY + 8, paperRight, creaseY + 5);
      ctx.stroke();
    } else {
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
    }
    ctx.strokeStyle = border;
    ctx.lineWidth = 7;
    ctx.strokeRect(paperLeft, 22, paperRight - paperLeft, paperBottom - 22);

    if (showArrow) {
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
    }

    ctx.save();
    if (qrMode) {
      const qrSize = 330;
      const qrX = (logicalWidth - qrSize) * 0.5;
      const qrY = 98;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.98)';
      ctx.fillRect(qrX - 16, qrY - 16, qrSize + 32, qrSize + 32);
      ctx.strokeStyle = ink;
      ctx.lineWidth = 5;
      ctx.strokeRect(qrX - 16, qrY - 16, qrSize + 32, qrSize + 32);
      ctx.imageSmoothingEnabled = false;
      if (qrImage) {
        ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);
      } else {
        ctx.fillStyle = 'rgba(92, 23, 59, 0.12)';
        ctx.fillRect(qrX, qrY, qrSize, qrSize);
      }
      ctx.fillStyle = ink;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '600 42px Monaco, "IBM Plex Mono", "Courier New", monospace';
      ctx.fillText('PHONE REMOTE', logicalWidth * 0.5, 54);
      ctx.font = '500 25px Monaco, "IBM Plex Mono", "Courier New", monospace';
      ctx.fillText(qrImage ? 'SCAN TO CONNECT' : 'CONNECTING…', logicalWidth * 0.5, 454);
    } else if (hasSplitLinks) {
      const handwritten = '"Bradley Hand", "Noteworthy", "Segoe Print", "Comic Sans MS", cursive';
      const dividerY = 248;
      ctx.strokeStyle = 'rgba(72, 58, 24, 0.68)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(82, dividerY);
      ctx.lineTo(552, dividerY);
      ctx.stroke();
      const drawSplitLabel = (entry, centerY, fallbackSize) => {
        const lines = Array.isArray(entry?.labelLines) && entry.labelLines.length
          ? entry.labelLines
          : [String(entry?.label || '')];
        let size = Number(entry?.fontSize) || fallbackSize;
        ctx.fillStyle = entry?.ink || penInk;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `400 ${size}px ${handwritten}`;
        while (Math.max(...lines.map((line) => ctx.measureText(line).width)) > 460 && size > 38) {
          size -= 4;
          ctx.font = `400 ${size}px ${handwritten}`;
        }
        const step = size * 0.78;
        lines.forEach((line, index) => {
          ctx.fillText(line, 317, centerY + (index - (lines.length - 1) * 0.5) * step);
        });
      };
      drawSplitLabel(splitLinks[0], 152, 82);
      drawSplitLabel(splitLinks[1], 350, 54);
    } else {
      ctx.rotate(-0.035);
      ctx.fillStyle = overwrittenInk ? penInk : ink;
      const fontStack = overwrittenInk
        ? '"Bradley Hand", "Noteworthy", "Segoe Print", "Comic Sans MS", cursive'
        : '"Caveat Brush", "Permanent Marker", "Comic Sans MS", cursive';
      let fontSize = labelFontSize || (overwrittenInk ? 132 : text.length > 7 ? 134 : text.length > 6 ? 148 : 176);
      const fontWeight = overwrittenInk ? '300 ' : '';
      ctx.font = `${fontWeight}${fontSize}px ${fontStack}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const textMaxWidth = smiley ? 430 : 510;
      const displayLines = Array.isArray(labelLines) && labelLines.length ? labelLines : [text];
      const measureDisplayWidth = () => Math.max(...displayLines.map((line) => ctx.measureText(line).width));
      while (measureDisplayWidth() > textMaxWidth && fontSize > 54) {
        fontSize -= 6;
        ctx.font = `${fontWeight}${fontSize}px ${fontStack}`;
      }
      const labelX = Number.isFinite(labelCenterX) ? labelCenterX : smiley ? 326 : 372;
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
        const lineStep = fontSize * 0.82;
        displayLines.forEach((line, index) => {
          const lineY = labelY + (index - (displayLines.length - 1) * 0.5) * lineStep;
          ctx.fillText(line, labelX, lineY);
          ctx.fillText(line, labelX + 4, lineY + 2);
        });
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
    }
    ctx.restore();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(36, 34, 548, 26);
    drawFullscreenToolbarFold();
  };
  draw();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.premultiplyAlpha = true;
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
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
    // The paper itself is fully opaque. Discard only essentially transparent
    // canvas pixels so the 2x antialiased silhouette and fold edges survive.
    transparent: true,
    opacity: 1,
    alphaTest: 1 / 255,
  });
  const noteW = Math.max(caseSize.x * scale, minWidth);
  const noteH = noteW * (Number.isFinite(aspectRatio) ? aspectRatio : logicalHeight / logicalWidth);
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
    if (horizontalFold) {
      const foldAmount = topHorizontalFold
        ? smoothstep(noteH * 0.08, noteH * 0.5, y)
        : bottom;
      if (foldAmount <= 0) continue;
      positions.setZ(i, foldAmount * noteW * 0.065);
      positions.setY(i, y + foldAmount * noteH * (topHorizontalFold ? -0.028 : 0.028));
      continue;
    }
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
  const targetX = placement === 'center'
    ? screenMin && screenMax
      ? (screenMin.x + screenMax.x) * 0.5
      : (caseBox.min.x + caseBox.max.x) * 0.5
    : placement === 'right'
    ? screenMax && screenSize
      ? screenMax.x + noteW * 0.25
      : caseBox.max.x - caseSize.x * 0.18
    : screenMin && screenSize
      ? screenMin.x - noteW * 0.50
      : caseBox.min.x + caseSize.x * 0.18;
  const targetY = placement === 'center'
    ? screenMin
      ? screenMin.y - noteH * 0.38
      : caseBox.min.y + caseSize.y * 0.38
    : placement === 'left'
    ? caseBox.min.y + caseSize.y * 0.46
    : screenMax
      ? Math.min(caseBox.max.y - noteH * 0.42, screenMax.y - noteH * 0.26)
      : caseBox.max.y - caseSize.y * 0.18;
  note.position.set(
    targetX + noteW * offsetXFactor,
    Math.max(
      caseBox.min.y + noteH * 0.5,
      Math.min(caseBox.max.y - noteH * 0.3, targetY + noteH * offsetYFactor),
    ),
    caseBox.max.z + Math.max(0.008, caseSize.z * 0.012),
  );
  note.rotation.z = THREE.MathUtils.degToRad(rotationDeg);
  note.userData.href = href;
  note.userData.hitType = hitType;
  note.userData.interactive = interactive;
  note.userData.label = text;
  note.userData.surfaceOpacity = 'opaque-antialiased-alpha-cutout';
  note.userData.splitLinks = hasSplitLinks
    ? splitLinks.slice(0, 2).map((entry) => ({ ...entry }))
    : null;
  note.userData.setQrImage = qrMode
    ? (image) => {
        qrImage = image || null;
        draw();
        tex.needsUpdate = true;
        return Boolean(qrImage);
      }
    : null;
  note.userData.fullscreenToolbarFold = Boolean(fullscreenToolbarFold);
  note.userData.fullscreenFoldProgress = fullscreenFoldProgress;
  note.userData.setFullscreenFoldProgress = (value) => {
    const next = clamp01(value);
    if (Math.abs(next - fullscreenFoldProgress) < 0.0005) return false;
    fullscreenFoldProgress = next;
    note.userData.fullscreenFoldProgress = next;
    draw();
    tex.needsUpdate = true;
    return true;
  };
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

const TV_HERO_PERSONALIZED_PROLOGUE_ENABLED = false;

function TvHero({ sources = [], vocalSamples = [], children }) {
  const wrapRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const keyboardCaptureRef = React.useRef(null);
  const handOfGodFrameRef = React.useRef(null);
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
	    reelStopPromise: null,
	    handOfGodActive: false,
	    handOfGodCanvas: null,
	    handOfGodRaf: 0,
	    handOfGodBootToken: 0,
	    forceMediaContain: false,
	    channelMediaActive: false,
	    channelCameraRaf: 0,
	    channelCameraId: 'boot',
	    channelCameraTarget: null,
	    markerCyc: null,
	    markerCycTexture: null,
	    cycStageTexture: null,
	    cycGlitchRaf: 0,
	    cycGlitchSerial: 0,
	    pendingCycGlitch: null,
	    updateCycStage: null,
	    pulseCycStage: null,
	    fitMarkerCyc: null,
	    filmReelChannelActive: false,
	    filmReelOwnershipToken: 0,
	    filmReelStartPending: false,
	    companionClipCache: new Map(),
	    companionClipSequenceIndex: new Map(),
	    videoChannelBookmark: null,
	    channelVideoTransition: null,
	    channelVideoTransitionTimer: 0,
	    channelVideoTransitionSerial: 0,
	    macKeyAudio: null,
	    terminal: null,
	    contactForm: {
	      open: false,
	      activeField: 'name',
	      name: '',
	      email: '',
	      message: '',
	      error: '',
	      status: '',
	      sending: false,
	      sent: false,
	    },
	    contactFormRects: null,
	    macOvertureBootBlank: true,
	    macLandingLaunchPending: false,
	    macTryItPromptVisible: false,
	    macStoryTypeActive: false,
	    macStoryTypedText: '',
	    macGhostwriter: {
	      active: false,
	      id: '',
	      phrase: '',
	      response: '',
	      responseKeys: [],
	      revealIndex: 0,
	      phase: 'revealing',
	    },
	    macGhostwriterTimers: [],
	    macGhostwriterShareRects: null,
	    macCompanionDirectTyping: false,
	    companionQrImage: null,
	    companionQrUrl: '',
	    // The QR lives on the red physical sticky. Keep the CRT itself clean.
	    companionQrVisible: false,
	    openingInvitationPending: false,
	    openingInvitationText: '',
	    openingVoiceLevel: 0,
	    openingVoiceStep: -1,
	    openingVoiceKind: '',
	    openingVoiceStepStartedAt: 0,
	    openingVoiceGateMs: 0,
	    openingVoiceEmphasis: 0,
	    visitorNamePromptActive: TV_HERO_PERSONALIZED_PROLOGUE_ENABLED,
	    visitorName: '',
	    stickyNoteHoverRaf: 0,
	    hoveredStickyNote: null,
	  });
  React.useEffect(() => {
    getResumeStrudelAudioEngine();
  }, []);
  const [engineEnabled, setEngineEnabled] = React.useState(false);
  const [modelReady, setModelReady] = React.useState(false);
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
      const sharedContext = window.__resumeMacKeyAudioContext;
      if (sharedContext && sharedContext.state !== 'closed') {
        audio = { context: sharedContext };
        state.macKeyAudio = audio;
      } else {
        try {
          audio = { context: new AudioContextCtor() };
          state.macKeyAudio = audio;
        } catch {
          return null;
        }
      }
    }
    installResumeMacMasterBus(audio.context);
    const publishReadyContext = () => {
      if (audio.context.state === 'closed') return;
      window.__resumeMacKeyAudioContext = audio.context;
      window.dispatchEvent(new CustomEvent('resume-mac-audio-ready'));
    };
    // Publish even a suspended context immediately. Decoding local WAVs does
    // not require audible playback, so the glitch pool can warm during the
    // blank CRT boot and be sample-accurate once a real gesture resumes audio.
    if (window.__resumeMacKeyAudioContext !== audio.context) {
      window.__resumeMacKeyAudioContext = audio.context;
      window.dispatchEvent(new CustomEvent('resume-mac-audio-ready'));
    }
    try {
      const resumed = audio.context.resume?.();
      if (resumed && typeof resumed.then === 'function') resumed.then(publishReadyContext).catch(() => {});
      else publishReadyContext();
    } catch {}
    return audio.context.state === 'closed' ? null : audio.context;
  }, []);

  React.useEffect(() => {
    window.__ensureResumeMacKeyAudioContext = getMacKeyAudioContext;
    return () => {
      if (window.__ensureResumeMacKeyAudioContext === getMacKeyAudioContext) {
        delete window.__ensureResumeMacKeyAudioContext;
      }
    };
  }, [getMacKeyAudioContext]);

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
    const output = getResumeMacAudioDestination(context);
    bodyGain.connect(output);
    knockGain.connect(output);
    clickGain.connect(output);
    thockGain.connect(output);
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
    const target = MAC_SCREEN_TEXTURE_SIZE;
    const changed = canvas.width !== target.width || canvas.height !== target.height;
    if (changed) {
      canvas.width = target.width;
      canvas.height = target.height;
      state.screenCanvasResizeCount = (state.screenCanvasResizeCount || 0) + 1;
    }
    if (wrapRef.current) {
      wrapRef.current.dataset.screenTextureMode = mode;
      wrapRef.current.dataset.screenTextureSize = `${canvas.width}x${canvas.height}`;
      wrapRef.current.dataset.screenTextureStable = String(
        canvas.width === target.width && canvas.height === target.height,
      );
      wrapRef.current.dataset.screenTextureResizeCount = String(
        state.screenCanvasResizeCount || 0,
      );
    }
  }, []);

  // Paint the Mac's inactive screen as a period-ish monochrome terminal.
  // Draw directly at texture resolution so the UI keeps the vintage shape
  // without turning into a jagged low-res texture on the curved screen.
  const drawMacOffScreen = React.useCallback(() => {
    const { ctx2d, screenCanvas, screenTex } = stateRef.current;
    if (!ctx2d || !screenCanvas) return;
    if (stateRef.current.visualReelMode && !stateRef.current.forceTerminal) return;
    // Companion video/clip/interactive channels own the CRT independently of
    // reel mode. The terminal cursor timer keeps running in the background, so
    // block its redraws or it will flash a terminal frame over the demo every
    // 480ms.
    if (stateRef.current.channelMediaActive && !stateRef.current.forceTerminal) return;
    // CRT channels own the screen — except the boot channel, which IS the
    // terminal and asks for it explicitly via forceTerminal.
    if (stateRef.current.pageMode && !stateRef.current.forceTerminal) return;
    if (wrapRef.current) {
      wrapRef.current.dataset.screenPaint = 'terminal';
      wrapRef.current.dataset.macUiLanguage = 'instrument-v1';
    }
    setScreenCanvasSize('terminal');
    setScreenTextureSampling('terminal');
    const w = screenCanvas.width, h = screenCanvas.height;
    const term = ensureMacTerminal();
    const px = (value) => Math.round(value);
    ctx2d.save();
    ctx2d.imageSmoothingEnabled = false;
	    const desktopPaper = MAC_UI.paper;
	    ctx2d.fillStyle = desktopPaper;
	    ctx2d.fillRect(0, 0, w, h);

	    if (stateRef.current.openingInvitationPending) {
	      const voiceLevel = Math.max(
	        0,
	        Math.min(1, Number(stateRef.current.openingVoiceLevel) || 0),
	      );
	      const blue = MAC_UI.blue;
	      drawMacUiSurface(ctx2d, w, h, {
	        accent: blue,
	        label: 'VOICE / INPUT',
	        status: stateRef.current.openingVoiceKind || 'LISTENING',
	      });

	      // A single oscilloscope trace replaces the earlier nested voice
	      // instrument. Its amplitude follows the authored vocal envelope while
	      // the harmonics shift between the spoken name and sampled question.
	      const easedLevel = voiceLevel * voiceLevel * (3 - 2 * voiceLevel);
	      const centerY = h * 0.5;
	      const left = w * 0.105;
	      const right = w * 0.895;
	      const span = right - left;
	      const elapsed = Math.max(
	        0,
	        performance.now() - (stateRef.current.openingVoiceStepStartedAt || performance.now()),
	      );
	      const isName = stateRef.current.openingVoiceKind === 'name';
	      const phase = elapsed * (isName ? 0.014 : 0.019)
	        + stateRef.current.openingVoiceStep * 0.71;
	      const amplitude = h * (0.018 + easedLevel * 0.255);
	      const sampleCount = 112;

	      ctx2d.globalAlpha = 1;
	      ctx2d.strokeStyle = 'rgba(28,95,159,0.18)';
	      ctx2d.lineWidth = Math.max(1, px(h * 0.003));
	      ctx2d.beginPath();
	      ctx2d.moveTo(left, centerY);
	      ctx2d.lineTo(right, centerY);
	      ctx2d.stroke();

	      ctx2d.beginPath();
	      for (let sample = 0; sample < sampleCount; sample += 1) {
	        const t = sample / (sampleCount - 1);
	        const x = left + span * t;
	        const taper = Math.pow(Math.sin(Math.PI * t), 0.58);
	        const carrier = (
	          Math.sin(t * Math.PI * (isName ? 13 : 17) + phase) * 0.54
	          + Math.sin(t * Math.PI * (isName ? 29 : 37) - phase * 1.31) * 0.28
	          + Math.sin(t * Math.PI * (isName ? 53 : 61) + phase * 0.73) * 0.18
	        );
	        const y = centerY + carrier * amplitude * taper;
	        if (sample === 0) ctx2d.moveTo(x, y);
	        else ctx2d.lineTo(x, y);
	      }
	      const waveGradient = ctx2d.createLinearGradient(left, 0, right, 0);
	      waveGradient.addColorStop(0, 'rgba(28,95,159,0)');
	      waveGradient.addColorStop(0.08, 'rgba(28,95,159,0.82)');
	      waveGradient.addColorStop(0.5, blue);
	      waveGradient.addColorStop(0.92, 'rgba(28,95,159,0.82)');
	      waveGradient.addColorStop(1, 'rgba(28,95,159,0)');
	      ctx2d.strokeStyle = waveGradient;
	      ctx2d.lineCap = 'round';
	      ctx2d.lineJoin = 'round';
	      ctx2d.shadowColor = 'rgba(28,95,159,0.32)';
	      ctx2d.shadowBlur = px(h * (0.005 + easedLevel * 0.008));
	      ctx2d.lineWidth = Math.max(2, h * 0.008);
	      ctx2d.stroke();
	      ctx2d.shadowBlur = 0;
	      ctx2d.globalAlpha = 1;
	      stateRef.current.contactFormRects = null;
	      wrapRef.current?.setAttribute('data-opening-invitation-screen', 'visible');
	      wrapRef.current?.setAttribute('data-opening-voice-visual', 'waveform');
	      wrapRef.current?.setAttribute('data-opening-voice-level', voiceLevel.toFixed(3));
	      wrapRef.current?.setAttribute('data-visitor-name-screen', 'hidden');
	      ctx2d.restore();
	      if (screenTex) {
	        screenTex.needsUpdate = true;
	        stateRef.current.requestRender?.();
	      }
	      return;
	    }
	    wrapRef.current?.setAttribute('data-opening-invitation-screen', 'hidden');

	    if (stateRef.current.visitorNamePromptActive) {
	      const black = MAC_UI.ink;
	      // Match the companion controller's typography so the two screens
	      // read as one interface, not adjacent visual systems.
	      const monoFont = MAC_TERMINAL_FONT;
	      const frame = px(Math.max(14, h * 0.04));
	      const name = String(stateRef.current.visitorName || '').slice(0, 24);
	      const cursorOn = ensureMacTerminal().cursorOn;
	      const questionSize = px(h * 0.056);
	      const answerSize = px(h * 0.05);

	      drawMacUiSurface(ctx2d, w, h, {
	        accent: MAC_UI.yellow,
	        label: 'IDENTITY / 00',
	        status: 'INPUT',
	      });

	      ctx2d.fillStyle = black;
	      ctx2d.textAlign = 'left';
	      ctx2d.textBaseline = 'alphabetic';
	      ctx2d.font = `500 ${answerSize}px ${monoFont}`;
	      const promptIndent = ctx2d.measureText('> ').width;
	      ctx2d.font = `700 ${questionSize}px ${monoFont}`;
	      ctx2d.fillText('WHAT SHOULD I CALL YOU?', frame + promptIndent, px(h * 0.43));
	      ctx2d.font = `500 ${answerSize}px ${monoFont}`;
	      const answer = `> ${name}`;
	      const answerBaseline = px(h * 0.58);
	      ctx2d.fillText(answer, frame, answerBaseline);
	      if (cursorOn) {
	        drawMacUiCursor(
	          ctx2d,
	          frame + ctx2d.measureText(answer).width + px(answerSize * 0.08),
	          answerBaseline,
	          answerSize,
	        );
	      }

	      stateRef.current.contactFormRects = null;
	      wrapRef.current?.setAttribute('data-visitor-name-screen', 'visible');
	      wrapRef.current?.setAttribute('data-visitor-name-screen-mode', 'minimal');
	      wrapRef.current?.setAttribute(
	        'data-visitor-name-screen-contents',
	        'prompt,input,cursor',
	      );
	      wrapRef.current?.setAttribute('data-visitor-name-font', 'companion-ui-monospace');
	      wrapRef.current?.setAttribute('data-visitor-name-question-size', '0.056h');
	      wrapRef.current?.setAttribute('data-visitor-name-answer-size', '0.050h');
	      ctx2d.restore();
	      if (screenTex) {
	        screenTex.needsUpdate = true;
	        stateRef.current.requestRender?.();
	      }
	      return;
	    }
	    wrapRef.current?.setAttribute('data-visitor-name-screen', 'hidden');
	    wrapRef.current?.setAttribute('data-visitor-name-screen-mode', 'hidden');
	    wrapRef.current?.removeAttribute('data-visitor-name-screen-contents');
	    wrapRef.current?.removeAttribute('data-visitor-name-font');
	    wrapRef.current?.removeAttribute('data-visitor-name-question-size');
	    wrapRef.current?.removeAttribute('data-visitor-name-answer-size');

	    const companionQr = stateRef.current.companionQrImage;
	    if (stateRef.current.companionQrVisible && !companionQr) {
	      // First paint must be clean. Do not flash the retired terminal/name UI
	      // while the asynchronously generated companion QR becomes available.
	      ctx2d.fillStyle = '#ffffff';
	      ctx2d.fillRect(0, 0, w, h);
	      stateRef.current.contactFormRects = null;
	      wrapRef.current?.setAttribute('data-companion-qr-screen', 'pending');
	      ctx2d.restore();
	      if (screenTex) {
	        screenTex.needsUpdate = true;
	        stateRef.current.requestRender?.();
	      }
	      return;
	    }
	    if (stateRef.current.companionQrVisible && companionQr) {
	      const black = MAC_UI.ink;
	      const paper = MAC_UI.paperBright;
	      const monoFont = MAC_TERMINAL_FONT;
	      const frame = px(Math.max(10, h * 0.028));
	      const headerH = px(h * 0.105);
	      const qrSize = px(Math.min(h * 0.56, w * 0.50));
	      const qrX = px((w - qrSize) / 2);
	      const qrY = px(headerH + (h - headerH - qrSize) / 2 - h * 0.025);

	      drawMacUiSurface(ctx2d, w, h, {
	        paper,
	        accent: MAC_UI.blue,
	        label: 'REMOTE / 01',
	        status: 'PAIR',
	      });

	      ctx2d.fillStyle = paper;
	      ctx2d.fillRect(qrX - frame, qrY - frame, qrSize + frame * 2, qrSize + frame * 2);
	      ctx2d.strokeStyle = MAC_UI.hairline;
	      ctx2d.lineWidth = Math.max(1, px(h * 0.002));
	      ctx2d.strokeRect(qrX - frame, qrY - frame, qrSize + frame * 2, qrSize + frame * 2);
	      ctx2d.imageSmoothingEnabled = false;
	      ctx2d.drawImage(companionQr, qrX, qrY, qrSize, qrSize);

	      ctx2d.fillStyle = black;
	      ctx2d.textAlign = 'center';
	      ctx2d.textBaseline = 'alphabetic';
	      ctx2d.font = `500 ${px(h * 0.022)}px ${monoFont}`;
	      ctx2d.fillText(
	        'SCAN ON PHONE  ·  TAP START',
	        w / 2,
	        Math.min(h - frame, qrY + qrSize + frame * 2.5),
	      );

	      stateRef.current.contactFormRects = null;
	      wrapRef.current?.setAttribute('data-companion-qr-screen', 'visible');
	      ctx2d.restore();
	      if (screenTex) {
	        screenTex.needsUpdate = true;
	        stateRef.current.requestRender?.();
	      }
	      return;
	    }
	    wrapRef.current?.setAttribute('data-companion-qr-screen', 'hidden');

    const contact = stateRef.current.contactForm;
    if (contact?.open) {
      const black = MAC_UI.ink;
      const muted = MAC_UI.muted;
      const uiFont = MAC_UI_FONT;
      const headingFont = MAC_UI_FONT;
      const monoFont = MAC_TERMINAL_FONT;
      const panel = {
        x: px(w * 0.09),
        y: px(h * 0.04),
        w: px(w * 0.82),
        h: px(h * 0.90),
      };
      drawMacUiSurface(ctx2d, w, h, {
        accent: MAC_UI.red,
        label: 'CONTACT / 04',
        status: contact.sending ? 'SENDING' : contact.sent ? 'SENT' : 'READY',
      });
      const titleBarH = px(h * 0.05);
      const closeRect = {
        x: panel.x + panel.w - px(w * 0.08),
        y: panel.y,
        w: px(w * 0.08),
        h: px(h * 0.08),
      };
      ctx2d.textAlign = 'center';
      ctx2d.fillStyle = black;
      ctx2d.font = `500 ${px(h * 0.022)}px ${uiFont}`;
      ctx2d.fillText('×', panel.x + panel.w - px(w * 0.025), panel.y + px(h * 0.036));

      ctx2d.fillStyle = black;
      ctx2d.textAlign = 'left';
      ctx2d.textBaseline = 'alphabetic';
      ctx2d.font = `600 ${px(h * 0.050)}px ${headingFont}`;
      ctx2d.fillText('WASSUP?', px(w * 0.13), px(h * 0.245));

      const rects = {
        name: { x: px(w * 0.13), y: px(h * 0.31), w: px(w * 0.33), h: px(h * 0.052) },
        email: { x: px(w * 0.54), y: px(h * 0.31), w: px(w * 0.33), h: px(h * 0.052) },
        message: { x: px(w * 0.13), y: px(h * 0.445), w: px(w * 0.74), h: px(h * 0.19) },
        close: closeRect,
        send: { x: px(w * 0.62), y: px(h * 0.79), w: px(w * 0.25), h: px(h * 0.058) },
      };
      stateRef.current.contactFormRects = rects;

      const drawContactField = (key, label, value, placeholder, multiline = false) => {
        const rect = rects[key];
        const active = contact.activeField === key;
        const invalid = Array.isArray(contact.invalidFields) && contact.invalidFields.includes(key);
        const fontSize = px(h * 0.022);
        if (label) {
          ctx2d.fillStyle = invalid ? '#d71920' : black;
          ctx2d.font = `700 ${px(h * 0.016)}px ${monoFont}`;
          ctx2d.fillText(`${active ? '> ' : ''}${label}`, rect.x, rect.y - px(h * 0.012));
        }
        ctx2d.fillStyle = MAC_UI.paperBright;
        ctx2d.fillRect(rect.x, rect.y, rect.w, rect.h);
        ctx2d.strokeStyle = invalid ? MAC_UI.red : active ? MAC_UI.blue : MAC_UI.hairline;
        ctx2d.lineWidth = active ? Math.max(3, px(h * 0.003)) : Math.max(1, px(h * 0.0015));
        ctx2d.strokeRect(rect.x, rect.y, rect.w, rect.h);
        ctx2d.save();
        ctx2d.beginPath();
        ctx2d.rect(rect.x + 14, rect.y + 8, rect.w - 28, rect.h - 16);
        ctx2d.clip();
        ctx2d.font = `${fontSize}px ${monoFont}`;
        ctx2d.textBaseline = 'middle';
        ctx2d.fillStyle = value ? black : muted;
        const displayValue = value || placeholder;
        if (!multiline) {
          const baseline = rect.y + rect.h * 0.56;
          ctx2d.fillText(displayValue, rect.x + 18, baseline);
          if (active && stateRef.current.macOvertureCursorOn !== false) {
            const textWidth = ctx2d.measureText(displayValue).width;
            const cursorX = Math.min(rect.x + rect.w - 24, rect.x + 20 + (value ? textWidth : 0));
            drawMacUiCursor(ctx2d, cursorX, baseline, fontSize);
          }
        } else {
          const maxWidth = rect.w - 38;
          const words = String(displayValue).split(/(\s+)/);
          const lines = [];
          let line = '';
          for (const word of words) {
            if (word === '\n') {
              lines.push(line);
              line = '';
              continue;
            }
            const pieces = String(word).split('\n');
            pieces.forEach((piece, pieceIndex) => {
              const candidate = line + piece;
              if (candidate && ctx2d.measureText(candidate).width > maxWidth && line) {
                lines.push(line.trimEnd());
                line = piece.replace(/^\s+/, '');
              } else {
                line = candidate;
              }
              if (pieceIndex < pieces.length - 1) {
                lines.push(line.trimEnd());
                line = '';
              }
            });
          }
          if (line || !lines.length) lines.push(line);
          const visibleLines = lines.slice(-4);
          const lineHeight = fontSize * 1.24;
          let baseline = rect.y + fontSize * 0.88;
          visibleLines.forEach((text) => {
            ctx2d.fillText(text, rect.x + 18, baseline);
            baseline += lineHeight;
          });
          if (active && stateRef.current.macOvertureCursorOn !== false && value) {
            const finalLine = visibleLines[visibleLines.length - 1] || '';
            const cursorX = Math.min(rect.x + rect.w - 24, rect.x + 20 + ctx2d.measureText(finalLine).width);
            const cursorY = rect.y + fontSize * 0.88 + (visibleLines.length - 1) * lineHeight;
            drawMacUiCursor(ctx2d, cursorX, cursorY, fontSize);
          }
        }
        ctx2d.restore();
      };

      drawContactField('name', '', contact.name, 'your name');
      drawContactField('email', '', contact.email, 'you@example.com');
      drawContactField('message', '', contact.message, 'A strange problem, a wild idea, a hello…', true);

      const validName = String(contact.name || '').trim().length >= 2;
      const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(contact.email || '').trim());
      const validMessage = String(contact.message || '').trim().length >= 3;
      const drawButton = (key, label, enabled = true) => {
        const rect = rects[key];
        const active = contact.activeField === key;
        ctx2d.fillStyle = enabled && key === 'send' ? MAC_UI.yellow : MAC_UI.paperBright;
        ctx2d.fillRect(rect.x, rect.y, rect.w, rect.h);
        ctx2d.strokeStyle = enabled ? black : MAC_UI.hairline;
        ctx2d.lineWidth = active ? Math.max(3, px(h * 0.003)) : Math.max(1, px(h * 0.0015));
        ctx2d.strokeRect(rect.x, rect.y, rect.w, rect.h);
        ctx2d.fillStyle = enabled ? black : muted;
        ctx2d.textAlign = 'center';
        ctx2d.textBaseline = 'middle';
        ctx2d.font = `600 ${px(h * 0.018)}px ${uiFont}`;
        if (key === 'send' && label === 'SEND') {
          ctx2d.fillText(label, rect.x + rect.w * 0.42, rect.y + rect.h / 2);
          ctx2d.textAlign = 'right';
          ctx2d.font = `600 ${px(h * 0.022)}px ${uiFont}`;
          ctx2d.fillText('↗', rect.x + rect.w * 0.88, rect.y + rect.h / 2);
        } else {
          ctx2d.fillText(label, rect.x + rect.w / 2, rect.y + rect.h / 2);
        }
      };
      const sendLabel = contact.sent
        ? 'SENT ✓'
        : contact.sending
          ? 'SENDING…'
          : 'SEND';
      drawButton('send', sendLabel, !contact.sending);
      ctx2d.textAlign = 'left';
      ctx2d.textBaseline = 'alphabetic';
      ctx2d.font = `700 ${px(h * 0.015)}px ${monoFont}`;
      ctx2d.fillStyle = contact.error ? black : muted;
      if (contact.error || contact.status) {
        ctx2d.fillText(contact.error || contact.status, px(w * 0.13), px(h * 0.715));
      }

      ctx2d.restore();
      if (screenTex) {
        screenTex.needsUpdate = true;
        stateRef.current.requestRender?.();
      }
      return;
    }

    const overtureProgress = Number(stateRef.current.macOvertureProgress || 0);
    const overtureBreather = Boolean(stateRef.current.macOvertureBreather);
    const overtureResolve = Boolean(stateRef.current.macOvertureResolve);
    const ghostwriter = stateRef.current.macGhostwriter;
    if (!stateRef.current.visualReelMode && ghostwriter?.active) {
      if (wrapRef.current) {
        wrapRef.current.dataset.screenPaint = 'ghostwriter';
        wrapRef.current.dataset.ghostwriterPhase = ghostwriter.phase;
        wrapRef.current.dataset.ghostwriterPhrase = ghostwriter.id;
      }
      stateRef.current.contactFormRects = null;
      stateRef.current.macGhostwriterShareRects = null;
      const ink = MAC_UI.ink;
      const paper = MAC_UI.paper;
      const monoFont = MAC_TERMINAL_FONT;
      const promptX = px(w * 0.07);
      const headerY = px(h * 0.15);
      const revealed = Array.from(String(ghostwriter.phrase || ''))
        .slice(0, Math.max(0, Number(ghostwriter.revealIndex) || 0))
        .join('');
      const phraseSize = px(h * (ghostwriter.phrase.length > 29 ? 0.057 : 0.063));
      const lineHeight = phraseSize * 1.28;
      const maxWidth = w * 0.84;
      const words = revealed.split(' ');
      const lines = [];
      let line = '';
      drawMacUiSurface(ctx2d, w, h, {
        paper,
        accent: MAC_UI.blue,
        label: 'GHOSTWRITER / 05',
        status: ghostwriter.phase || 'READY',
      });
      ctx2d.textAlign = 'left';
      ctx2d.textBaseline = 'alphabetic';
      ctx2d.fillStyle = ink;
      ctx2d.font = `400 ${px(h * 0.024)}px ${monoFont}`;
      ctx2d.fillText('tm@Mac Dev % ./ghostwriter', promptX, headerY);
      ctx2d.font = `400 ${phraseSize}px ${monoFont}`;
      const showInlineTryIt = stateRef.current.macTryItPromptVisible
        && ghostwriter.phase === 'revealing'
        && !revealed;
      if (showInlineTryIt) {
        lines.push('try it');
      } else {
        words.forEach((word, index) => {
          const candidate = line ? `${line} ${word}` : word;
          if (line && ctx2d.measureText(`> ${candidate}`).width > maxWidth) {
            lines.push(line);
            line = word;
          } else {
            line = candidate;
          }
          if (index === words.length - 1) lines.push(line);
        });
      }
      if (!lines.length) lines.push('');
      // Keep every authored sentence on one terminal baseline. Line wrapping
      // may add rows beneath it, but must never recenter the first row.
      const firstY = h * 0.43;
      lines.forEach((textLine, index) => {
        ctx2d.fillText(`${index === 0 ? '> ' : '  '}${textLine}`, promptX, px(firstY + index * lineHeight));
      });
      const lastLine = lines[lines.length - 1] || '';
      const lastPrefix = lines.length === 1 ? '> ' : '  ';
      const cursorX = promptX + ctx2d.measureText(`${lastPrefix}${lastLine}`).width
        + px(phraseSize * 0.08);
      const cursorY = px(firstY + (lines.length - 1) * lineHeight);
      if (ghostwriter.phase === 'revealing' && ensureMacTerminal().cursorOn) {
        drawMacUiCursor(ctx2d, cursorX, cursorY, phraseSize);
      }
      if (ghostwriter.phase === 'response') {
        ctx2d.fillStyle = ink;
        ctx2d.font = `400 ${px(h * 0.021)}px ${monoFont}`;
        ctx2d.fillText(`ghostwriter: ${String(ghostwriter.response || '[accepted]')}`, promptX, px(h * 0.86));
      } else if (ghostwriter.phase === 'complete' || ghostwriter.phase === 'armed-next') {
        const shareY = px(h * 0.79);
        const shareHeight = px(h * 0.075);
        const exportRect = {
          x: px(w * 0.60),
          y: shareY,
          w: px(w * 0.32),
          h: shareHeight,
        };
        const xRect = {
          x: px(w * 0.61),
          y: shareY,
          w: px(w * 0.14),
          h: shareHeight,
        };
        const linkedInRect = {
          x: px(w * 0.77),
          y: shareY,
          w: px(w * 0.16),
          h: shareHeight,
        };
        const exportReady = ghostwriter.exportStatus === 'ready';
        stateRef.current.macGhostwriterShareRects = {
          export: exportReady ? null : exportRect,
          x: exportReady ? xRect : null,
          linkedin: exportReady ? linkedInRect : null,
        };
        ctx2d.fillStyle = ink;
        ctx2d.textAlign = 'left';
        ctx2d.textBaseline = 'alphabetic';
        ctx2d.font = `400 ${px(h * 0.018)}px ${monoFont}`;
        if (exportReady) {
          ctx2d.fillText('wrote ./thought.gif; copied link', px(w * 0.60), px(h * 0.755));
          ctx2d.fillText(':share x', xRect.x, px(h * 0.85));
          ctx2d.fillText(':share linkedin', linkedInRect.x, px(h * 0.85));
        } else {
          const exportLabel = ghostwriter.exportStatus === 'rendering'
            ? 'export: encoding thought.gif'
            : ghostwriter.exportStatus === 'error'
              ? 'export: failed; retry'
              : ':export gif --copy-link';
          ctx2d.fillText(exportLabel, exportRect.x, px(h * 0.85));
        }
      }
      ctx2d.restore();
      if (screenTex) {
        screenTex.needsUpdate = true;
        stateRef.current.requestRender?.();
      }
      return;
    }
    if (!stateRef.current.visualReelMode && stateRef.current.macOvertureBootBlank) {
      if (wrapRef.current) wrapRef.current.dataset.screenPaint = 'idle-cursor';
      stateRef.current.contactFormRects = null;
      drawMacUiSurface(ctx2d, w, h, { paper: MAC_UI.paper, quiet: true });
      // Nothing but a live terminal insertion point: the first deliberate key
      // is both the visitor's consent to sound and the command to begin.
      // Reuse the post-intro ghostwriter prompt, font metrics, baseline and
      // insertion point exactly so both ends of the show are the same state.
      // The prompt is persistent terminal punctuation; only the insertion
      // cursor blinks.
      const cursorSize = px(h * 0.063);
      const cursorX = px(w * 0.07);
      const cursorBaseline = px(h * 0.43);
      ctx2d.fillStyle = MAC_UI.ink;
      ctx2d.textAlign = 'left';
      ctx2d.textBaseline = 'alphabetic';
      ctx2d.font = `400 ${cursorSize}px ${MAC_TERMINAL_FONT}`;
      const idlePrompt = stateRef.current.macTryItPromptVisible
        ? '> try it '
        : '> headphones recommended ';
      ctx2d.fillText(idlePrompt, cursorX, cursorBaseline);
      if (stateRef.current.macOvertureCursorOn !== false) {
        drawMacUiCursor(
          ctx2d,
          cursorX + ctx2d.measureText(idlePrompt).width + px(cursorSize * 0.08),
          cursorBaseline,
          cursorSize,
        );
      }
      ctx2d.restore();
      if (screenTex) {
        screenTex.needsUpdate = true;
        stateRef.current.requestRender?.();
      }
      return;
    }
    if (!stateRef.current.visualReelMode && stateRef.current.macStoryTypeActive) {
      if (wrapRef.current) wrapRef.current.dataset.screenPaint = 'make-story-typing';
      stateRef.current.contactFormRects = null;
      const ink = MAC_UI.ink;
      const paper = MAC_UI.paper;
      const monoFont = MAC_TERMINAL_FONT;
      const typedText = String(stateRef.current.macStoryTypedText || '');
      const promptX = px(w * 0.075);
      const promptY = px(h * 0.20);
      const commandY = px(h * 0.54);
      const commandSize = px(h * 0.068);
      drawMacUiSurface(ctx2d, w, h, {
        paper,
        accent: MAC_UI.red,
        label: 'MAKE / INPUT',
        status: 'TYPE',
      });
      ctx2d.textAlign = 'left';
      ctx2d.textBaseline = 'alphabetic';
      ctx2d.fillStyle = ink;
      ctx2d.font = `400 ${px(h * 0.025)}px ${monoFont}`;
      ctx2d.fillText('tm@Mac Dev % ./make.sh', promptX, promptY);
      ctx2d.font = `400 ${commandSize}px ${monoFont}`;
      const command = `> ${typedText}`;
      ctx2d.fillText(command, promptX, commandY);
      if (stateRef.current.macOvertureCursorOn !== false) {
        const cursorX = promptX + ctx2d.measureText(command).width + px(commandSize * 0.12);
        drawMacUiCursor(ctx2d, cursorX, commandY, commandSize);
      }
      ctx2d.restore();
      if (screenTex) {
        screenTex.needsUpdate = true;
        stateRef.current.requestRender?.();
      }
      return;
    }
    if (!stateRef.current.visualReelMode && overtureResolve) {
      ctx2d.fillStyle = '#ffffff';
      ctx2d.fillRect(0, 0, w, h);
      if (!MAC_INTERMISSION_ARUCO_VISIBLE) {
        stateRef.current.contactFormRects = null;
        ctx2d.restore();
        if (screenTex) {
          screenTex.needsUpdate = true;
          stateRef.current.requestRender?.();
        }
        return;
      }
      const columns = 4;
      const rows = 3;
      const tileWidth = w / columns;
      const tileHeight = h / rows;
      MAC_INTERMISSION_ARUCO_BYTES.forEach((markerBytes, markerIndex) => {
        const column = markerIndex % columns;
        const row = Math.floor(markerIndex / columns);
        const tileX = Math.round(column * tileWidth);
        const tileY = Math.round(row * tileHeight);
        const tileRight = Math.round((column + 1) * tileWidth);
        const tileBottom = Math.round((row + 1) * tileHeight);
        const tileSize = Math.min(tileRight - tileX, tileBottom - tileY);
        // Keep every ArUco module an integer number of canvas pixels. The
        // remaining white area becomes a narrow, even quiet zone/keyline.
        const desiredQuietZone = Math.max(2, Math.round(tileSize * 0.014));
        const moduleSize = Math.max(1, Math.floor((tileSize - desiredQuietZone * 2) / 6));
        const markerSize = moduleSize * 6;
        const markerX = tileX + Math.floor((tileRight - tileX - markerSize) / 2);
        const markerY = tileY + Math.floor((tileBottom - tileY - markerSize) / 2);
        ctx2d.fillStyle = '#050505';
        ctx2d.fillRect(markerX, markerY, markerSize, markerSize);
        for (let bitY = 0; bitY < 4; bitY += 1) {
          for (let bitX = 0; bitX < 4; bitX += 1) {
            const bitIndex = bitY * 4 + bitX;
            const markerByte = markerBytes[Math.floor(bitIndex / 8)];
            const isWhite = (markerByte >> (7 - (bitIndex % 8))) & 1;
            if (!isWhite) continue;
            ctx2d.fillStyle = '#ffffff';
            ctx2d.fillRect(
              markerX + (bitX + 1) * moduleSize,
              markerY + (bitY + 1) * moduleSize,
              moduleSize,
              moduleSize,
            );
          }
        }
      });
      stateRef.current.contactFormRects = null;
      ctx2d.restore();
      if (screenTex) {
        screenTex.needsUpdate = true;
        stateRef.current.requestRender?.();
      }
      return;
    }
    if (!stateRef.current.visualReelMode && overtureBreather) {
      stateRef.current.contactFormRects = null;
      ctx2d.restore();
      if (screenTex) {
        screenTex.needsUpdate = true;
        stateRef.current.requestRender?.();
      }
      return;
    }
    if (!stateRef.current.visualReelMode && overtureProgress >= 0 && overtureProgress <= 1) {
      const stages = [
        { at: 0.00, heading: './design.sh', formula: 'p_clip=P·V·M·p_model' },
        { at: 0.42, heading: './make.sh', formula: 'Attention(Q,K,V)=softmax(QKᵀ/√dₖ)V' },
        { at: 0.66, heading: './believe.sh', formula: 'xₜ=√ᾱₜx₀+√(1−ᾱₜ)ε' },
      ];
      let stage = stages[0];
      let stageIndex = 0;
      for (let index = 0; index < stages.length; index += 1) {
        if (overtureProgress >= stages[index].at) {
          stage = stages[index];
          stageIndex = index;
        }
      }
      const stageUi = [
        { accent: MAC_UI.yellow, label: 'DESIGN / 01' },
        { accent: MAC_UI.red, label: 'MAKE / 02' },
        { accent: MAC_UI.blue, label: 'BELIEVE / 03' },
      ][stageIndex];
      drawMacUiSurface(ctx2d, w, h, {
        accent: stageUi.accent,
        label: stageUi.label,
        status: 'RUN',
      });
      const nextAt = stages[stageIndex + 1]?.at ?? 1;
      const loopIndex = Math.max(0, Number(stateRef.current.macOvertureLoopIndex) || 0);
      const localProgress = stageIndex === 0
        ? loopIndex === 0
          ? stateRef.current.macCompanionDirectTyping
            ? Math.max(
                0,
                Math.min(
                  1,
                  (overtureProgress - 0.18)
                    / (0.13 * MAC_OVERTURE_TYPING_TIME_SCALE),
                ),
              )
            : overtureProgress < 0.18
              ? Math.max(0, Math.min(1, Number(stateRef.current.macOvertureLoadReveal) || 0))
              : 1
          : Math.max(
              0,
              Math.min(
                1,
                (overtureProgress - 0.18)
                  / (0.13 * MAC_OVERTURE_TYPING_TIME_SCALE),
              ),
            )
        : Math.max(
            0,
            Math.min(
              1,
              (overtureProgress - stage.at)
                / Math.max(
                  0.001,
                  (nextAt - stage.at) * 0.46 * MAC_OVERTURE_TYPING_TIME_SCALE,
                ),
            ),
          );
      // Type the opening motto directly. For the three authored words, finish
      // an intentionally imperfect first pass, pause, then backspace to the
      // earliest mistake and rebuild the suffix until the word is right.
      const revealStart = stageIndex === 0 ? 0.025 : 0.055;
      const revealProgress = Math.max(
        0,
        Math.min(1, (localProgress - revealStart) / (0.88 - revealStart)),
      );
      const shuffleGlyphs = Array.from(stage.formula.replace(/\s+/g, ''));
      const typableFormulaGlyphs = shuffleGlyphs.filter((glyph) => getMacOvertureKeyStroke(glyph));
      const drawTypingReveal = (value, reveal, seed, x, y) => {
        const target = String(value);
        const applicationNumber = stageIndex + 1;
        const formulaPool = typableFormulaGlyphs.length
          ? typableFormulaGlyphs
          : Array.from('QKMVXP0123456789');
        const wrongGlyphFor = (index, salt = 0) => {
          const targetChar = target[index] || '';
          for (let offset = 0; offset < formulaPool.length; offset += 1) {
            const candidate = formulaPool[
              (index * 5 + seed * 7 + salt * 3 + offset) % formulaPool.length
            ];
            if (candidate && candidate.toLowerCase() !== targetChar.toLowerCase()) return candidate;
          }
          return 'x';
        };
        const frames = [];
        let liveText = '';
        let cursorOnNextLine = false;
        const pushFrame = (nextText, action = null, weight = 1) => {
          liveText = nextText;
          frames.push({
            text: liveText,
            action,
            weight: Math.max(0.1, Number(weight) || 1),
            cursorOnNextLine,
          });
        };
        const typeCharacter = (char, action = 'type', resolved = true, weight = 1) => {
          pushFrame(`${liveText}${char}`, {
            action,
            char,
            index: Math.max(0, Array.from(liveText).length),
            resolved,
          }, weight);
        };
        const backspace = () => {
          const chars = Array.from(liveText);
          if (!chars.length) return;
          chars.pop();
          pushFrame(chars.join(''), {
            action: 'backspace',
            char: '',
            index: chars.length,
            resolved: false,
          });
        };
        const hold = (weight = 1) => pushFrame(liveText, null, weight);
        const pressEnter = () => {
          cursorOnNextLine = true;
          pushFrame(liveText, {
            action: 'enter',
            char: '',
            index: Array.from(liveText).length,
            resolved: true,
          }, 0.9);
        };
        // Begin with an empty line and a live cursor before the first key lands.
        hold(0.72);

        {
          const errorPositionsByApplication = {
            1: [3, 6],
            2: [3, 5],
            3: [3, 7],
          };
          const errorPositions = (errorPositionsByApplication[applicationNumber] || [3])
            .filter((index) => index >= 0 && index < target.length);
          const errorSet = new Set(errorPositions);
          Array.from(target).forEach((char, index) => {
            if (errorSet.has(index)) {
              typeCharacter(wrongGlyphFor(index), 'mistype', false);
            } else {
              typeCharacter(char, 'type', true);
            }
          });
          // Let the completed wrong word register before the cursor retreats.
          hold(3.2);
          const correctionIndex = Math.min(...errorPositions);
          while (Array.from(liveText).length > correctionIndex) backspace();
          // DESIGN retries once, MAKE twice, BELIEVE three times.
          for (let attempt = 0; attempt < applicationNumber; attempt += 1) {
            typeCharacter(
              wrongGlyphFor(correctionIndex, attempt + 1),
              'mistype',
              false,
            );
            hold(0.55);
            backspace();
          }
          Array.from(target.slice(correctionIndex)).forEach((char) => {
            typeCharacter(char, 'type', true);
          });
          // Let the final executable command land, then run it.
          hold(1.35);
          pressEnter();
          // The shell owns the next beat while the executable streams its
          // deliberately over-engineered installer log to the CRT.
          hold(7.5);
        }
        const totalWeight = frames.reduce((sum, frame) => sum + frame.weight, 0) || 1;
        const weightedPosition = reveal >= 0.999
          ? totalWeight
          : Math.max(0, Math.min(totalWeight - 0.001, reveal * totalWeight));
        let frameIndex = Math.max(0, frames.length - 1);
        let accumulated = 0;
        if (reveal < 0.999) {
          for (let index = 0; index < frames.length; index += 1) {
            accumulated += frames[index].weight;
            if (weightedPosition < accumulated) {
              frameIndex = index;
              break;
            }
          }
        }
        const frame = frames[frameIndex] || { text: target, action: null };
        let enterStartWeight = Number.POSITIVE_INFINITY;
        let scanWeight = 0;
        for (const candidate of frames) {
          if (candidate.action?.action === 'enter') {
            enterStartWeight = scanWeight;
            break;
          }
          scanWeight += candidate.weight;
        }
        const outputReveal = Number.isFinite(enterStartWeight)
          ? Math.max(
              0,
              Math.min(
                1,
                (weightedPosition - enterStartWeight)
                  / Math.max(0.1, totalWeight - enterStartWeight),
              ),
            )
          : 0;
        const finalWidth = ctx2d.measureText(target).width;
        // Keep the command anchored to a real terminal origin. Characters,
        // corrections, and the cursor advance from this fixed prompt line
        // instead of recentering as the typed string changes width.
        const startX = x;
        const previousAlign = ctx2d.textAlign;
        ctx2d.textAlign = 'left';
        ctx2d.fillText(frame.text, startX, y);
        ctx2d.textAlign = previousAlign;
        return {
          action: frame.action,
          token: frame.action ? `${stageIndex}:${frameIndex}:${frame.action.action}` : '',
          cursorX: frame.cursorOnNextLine
            ? startX
            : startX + ctx2d.measureText(frame.text).width,
          cursorOnNextLine: frame.cursorOnNextLine,
          outputReveal,
          totalWidth: finalWidth,
          renderedText: frame.text,
        };
      };
      const black = MAC_UI.ink;
      const headingFont = MAC_TERMINAL_FONT;
      ctx2d.textAlign = 'left';
      ctx2d.textBaseline = 'alphabetic';
      ctx2d.fillStyle = black;
      ctx2d.fontKerning = 'normal';
      ctx2d.textRendering = 'geometricPrecision';
      const promptText = 'tm@Mac Dev % ';
      // Terminal-safe inset inside the curved Macintosh glass. The shell
      // prompt is persistent; only the executable is typed by the keyboard.
      const promptX = px(w * 0.055);
      const headingY = px(h * 0.175);
      let headingSize = px(h * 0.043);
      ctx2d.letterSpacing = '0px';
      ctx2d.font = `400 ${headingSize}px ${headingFont}`;
      while (ctx2d.measureText(`${promptText}${stage.heading}`).width > w * 0.87
        && headingSize > px(h * 0.038)) {
        headingSize -= 2;
        ctx2d.font = `400 ${headingSize}px ${headingFont}`;
      }
      ctx2d.save();
      ctx2d.font = `400 ${headingSize}px ${headingFont}`;
      ctx2d.fillText(promptText, promptX, headingY);
      const commandX = promptX + ctx2d.measureText(promptText).width;
      ctx2d.restore();
      ctx2d.font = `400 ${headingSize}px ${headingFont}`;
      ctx2d.fillStyle = black;
      const typingState = drawTypingReveal(
        stage.heading,
        revealProgress,
        stageIndex,
        commandX,
        headingY,
      );
      const terminalOutput = [
        [
          stateRef.current.visitorName
            ? `>>> ${String(stateRef.current.visitorName).toUpperCase()}?`
            : '>>> removing existing sketch...',
          '>>> downloading design skill for macOS...',
          '################################################',
          '100.0%',
          'pulling strange-bit: 100% |████████████████████████| 2.2 GB',
          'pulling taste:       100% |████████████████████████| 1.1 KB',
          'verifying sha256 digest',
          'installing taste to /Applications...',
          'writing manifest',
          'success',
        ],
        [
          stateRef.current.visitorName
            ? `>>> ${String(stateRef.current.visitorName).toUpperCase()}? / ${String(stateRef.current.visitorName).toUpperCase()}?`
            : '>>> resolving impossible dependencies...',
          '>>> compiling prototype for arm64...',
          '################################################',
          '100.0%',
          'linking art.o + code.o',
          'building strange-bit: 100% |██████████████████████| 42 MB',
          'running tests: 0 failed, 3 interesting',
          'installing courage to /usr/local/bin...',
          'writing manifest',
          'success',
        ],
        [
          stateRef.current.visitorName
            ? `>>> WHAT ABOUT YOU, ${String(stateRef.current.visitorName).toUpperCase()}?`
            : '>>> discovering collaborators...',
          '>>> opening high-five sockets...',
          '################################################',
          '100.0%',
          'pulling trust:     100% |████████████████████████| 5/5',
          'pulling bad-ideas: 100% |████████████████████████| ∞',
          'verifying shared delusion',
          'signing build with optimism',
          'writing manifest',
          'success',
        ],
      ][stageIndex];
      if (typingState.outputReveal > 0 && terminalOutput?.length) {
        const statusProgress = typingState.outputReveal
          * typingState.outputReveal
          * (3 - 2 * typingState.outputReveal);
        const outputPosition = statusProgress * terminalOutput.length;
        const completeLineCount = Math.min(
          terminalOutput.length,
          Math.floor(outputPosition),
        );
        const partialLine = terminalOutput[completeLineCount]?.slice(
          0,
          Math.ceil(
            terminalOutput[completeLineCount].length
              * (outputPosition - completeLineCount),
          ),
        );
        const renderedOutput = [
          ...terminalOutput.slice(0, completeLineCount),
          ...(partialLine ? [partialLine] : []),
        ].slice(-10);
        const statusSize = px(h * 0.0215);
        const statusLeading = statusSize * 1.32;
        const outputY = headingY + headingSize * 1.34;
        ctx2d.save();
        ctx2d.letterSpacing = `${px(statusSize * -0.02)}px`;
        ctx2d.fillStyle = black;
        renderedOutput.forEach((line, index) => {
          ctx2d.font = `400 ${statusSize}px ${headingFont}`;
          ctx2d.fillText(line, promptX, outputY + statusLeading * index);
        });
        ctx2d.restore();
      }
      if (typingState.action
        && typingState.token
        && stateRef.current.macOvertureTypingToken !== typingState.token) {
        stateRef.current.macOvertureTypingToken = typingState.token;
        if (wrapRef.current) {
          wrapRef.current.dataset.typingAction = typingState.action.action || '';
          wrapRef.current.dataset.typingText = typingState.renderedText || '';
          wrapRef.current.dataset.typingStage = String(stageIndex);
          wrapRef.current.dataset.typingLatency = stateRef.current.macCompanionStartAt
            ? String(Math.max(0, Math.round(performance.now() - stateRef.current.macCompanionStartAt)))
            : '';
        }
        window.dispatchEvent(new CustomEvent('resume-mac-screen-character', {
          detail: {
            ...typingState.action,
            stage: stageIndex,
            heading: stage.heading,
            renderedHeading: typingState.renderedText,
            reveal: revealProgress,
            timestamp: performance.now(),
          },
        }));
      }
      // A foreground process owns the terminal after Return, so the shell
      // cursor vanishes while its status/output is being printed.
      if (revealProgress < 0.999
        && !typingState.cursorOnNextLine
        && stateRef.current.macOvertureCursorOn !== false) {
        const cursorY = typingState.cursorOnNextLine
          ? headingY + headingSize * 0.72
          : headingY;
        drawMacUiCursor(
          ctx2d,
          px(typingState.cursorX + headingSize * 0.10),
          cursorY,
          headingSize,
        );
      }
      ctx2d.restore();
      if (screenTex) {
        screenTex.needsUpdate = true;
        stateRef.current.requestRender?.();
      }
      return;
    }

    const black = MAC_UI.ink;
    const monoFont = MAC_TERMINAL_FONT;
    drawMacUiSurface(ctx2d, w, h, {
      accent: MAC_UI.blue,
      label: 'TERMINAL / 00',
      status: term.focused ? 'READY' : 'IDLE',
    });
    ctx2d.save();
    ctx2d.beginPath();
    const tx = px(w * 0.055);
    const ty = px(h * 0.145);
    const tw = px(w * 0.89);
    const th = px(h * 0.79);
    ctx2d.rect(tx, ty, tw, th);
    ctx2d.clip();
    ctx2d.fillStyle = black;
    const fontSize = px(h * 0.028);
    const lineHeight = px(fontSize * 1.36);
    ctx2d.font = `400 ${fontSize}px ${monoFont}`;
    const prompt = 'tm@Mac Dev % ';
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
    const drawTerminalText = (line, x, baseline) => ctx2d.fillText(line, x, baseline);
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
      drawMacUiCursor(ctx2d, cursor.x + px(fontSize * 0.10), cursor.y + px(fontSize * 0.78), fontSize);
    }
    ctx2d.restore();

    ctx2d.globalCompositeOperation = 'source-over';
    ctx2d.restore();
    if (screenTex) {
      screenTex.needsUpdate = true;
      stateRef.current.requestRender?.();
    }
	  }, [ensureMacTerminal, setScreenCanvasSize, setScreenTextureSampling]);

	  React.useEffect(() => {
	    let disposed = false;
	    let loadToken = 0;
	    let voiceVisualRaf = 0;

	    const stopVoiceVisual = ({ clearScreen = false } = {}) => {
	      if (voiceVisualRaf) window.cancelAnimationFrame(voiceVisualRaf);
	      voiceVisualRaf = 0;
	      stateRef.current.openingVoiceLevel = 0;
	      stateRef.current.openingVoiceStep = -1;
	      stateRef.current.openingVoiceKind = '';
	      stateRef.current.openingVoiceStepStartedAt = 0;
	      stateRef.current.openingVoiceGateMs = 0;
	      stateRef.current.openingVoiceEmphasis = 0;
	      if (wrapRef.current) {
	        wrapRef.current.dataset.openingVoiceVisual = clearScreen ? 'hidden' : 'idle';
	        wrapRef.current.dataset.openingVoiceLevel = '0.000';
	        delete wrapRef.current.dataset.openingVoiceStep;
	        delete wrapRef.current.dataset.openingVoiceKind;
	      }
	    };

	    const runVoiceVisual = () => {
	      if (disposed || !stateRef.current.openingInvitationPending) {
	        stopVoiceVisual({ clearScreen: true });
	        return;
	      }
	      const now = performance.now();
	      const elapsed = Math.max(0, now - stateRef.current.openingVoiceStepStartedAt);
	      const gateMs = Math.max(120, stateRef.current.openingVoiceGateMs || 480);
	      const emphasis = Math.max(
	        0.2,
	        Math.min(1, stateRef.current.openingVoiceEmphasis || 0.62),
	      );
	      const attack = Math.min(1, elapsed / 64);
	      const release = Math.min(1, Math.max(0, gateMs - elapsed) / 130);
	      const envelope = Math.max(0, Math.min(1, attack * release));
	      const kind = stateRef.current.openingVoiceKind;
	      const cadence = kind === 'name'
	        ? 0.80 + Math.sin(elapsed * 0.018) * 0.13 + Math.sin(elapsed * 0.041) * 0.07
	        : 0.84 + Math.sin(elapsed * 0.027) * 0.10 + Math.sin(elapsed * 0.067) * 0.05;
	      const target = elapsed <= gateMs
	        ? Math.max(0.08, Math.min(1, envelope * emphasis * cadence))
	        : 0.06;
	      const current = Number(stateRef.current.openingVoiceLevel) || 0;
	      stateRef.current.openingVoiceLevel = current + (target - current) * 0.28;
	      stateRef.current.forceTerminal = true;
	      drawMacOffScreen();
	      stateRef.current.forceTerminal = false;
	      voiceVisualRaf = window.requestAnimationFrame(runVoiceVisual);
	    };

	    const loadQr = (qrUrl) => {
	      const url = String(qrUrl || '');
	      if (!url) return;
	      const token = ++loadToken;
	      stateRef.current.companionQrUrl = url;
	      const image = new Image();
	      image.onload = () => {
	        if (disposed || token !== loadToken) return;
	        stateRef.current.companionQrImage = image;
	        stateRef.current.companionQrVisible = false;
	        const applied = Boolean(
	          stateRef.current.signatureStickyNote?.userData?.setQrImage?.(image),
	        );
	        if (wrapRef.current) {
	          wrapRef.current.dataset.companionQrSticky = applied
	            ? 'applied'
	            : 'waiting-for-model';
	        }
	        stateRef.current.forceTerminal = true;
	        drawMacOffScreen();
	        stateRef.current.forceTerminal = false;
	        stateRef.current.requestRender?.();
	      };
	      image.onerror = () => {
	        if (disposed || token !== loadToken || !wrapRef.current) return;
	        wrapRef.current.dataset.companionQrSticky = 'image-error';
	      };
	      image.src = url;
	    };

	    const onQrReady = (event) => loadQr(event.detail?.qrUrl);
	    const onOpeningInvitationStep = (event) => {
	      const text = String(event.detail?.text || '');
	      const active = event.detail?.active !== false && Boolean(text);
	      stateRef.current.openingInvitationPending = active;
	      stateRef.current.openingInvitationText = active ? text : '';
	      if (wrapRef.current) {
	        wrapRef.current.dataset.openingInvitationText = stateRef.current.openingInvitationText;
	        if (!active) {
	          wrapRef.current.dataset.openingInvitationScreen = 'hidden';
	        }
	      }
	      if (!active) {
	        stopVoiceVisual({ clearScreen: true });
	        return;
	      }
	      stateRef.current.openingVoiceStep = Number(event.detail?.index) || 0;
	      stateRef.current.openingVoiceKind = String(event.detail?.kind || 'invitation');
	      stateRef.current.openingVoiceStepStartedAt = performance.now();
	      stateRef.current.openingVoiceGateMs = Math.max(
	        120,
	        Number(event.detail?.gateMs) || 480,
	      );
	      stateRef.current.openingVoiceEmphasis = Math.max(
	        0.2,
	        Math.min(1, Number(event.detail?.emphasis) || 0.62),
	      );
	      if (wrapRef.current) {
	        wrapRef.current.dataset.openingVoiceVisual = 'waveform';
	        wrapRef.current.dataset.openingVoiceStep = String(stateRef.current.openingVoiceStep);
	        wrapRef.current.dataset.openingVoiceKind = stateRef.current.openingVoiceKind;
	      }
	      if (!voiceVisualRaf) voiceVisualRaf = window.requestAnimationFrame(runVoiceVisual);
	    };
	    const prepareCompanionIntro = () => {
	      stateRef.current.macLandingLaunchPending = true;
	      stateRef.current.macTryItPromptVisible = false;
	      stateRef.current.companionQrVisible = false;
	      stateRef.current.visitorNamePromptActive = false;
	      stateRef.current.macOvertureBootBlank = false;
	      stateRef.current.macOvertureLoadReveal = 0;
	      stateRef.current.macCompanionDirectTyping = true;
	      stateRef.current.macCompanionStartAt = performance.now();
	      stateRef.current.macOvertureTypingToken = '';
	      if (wrapRef.current) {
	        wrapRef.current.dataset.typingAction = 'pending';
	        wrapRef.current.dataset.typingText = '';
	        wrapRef.current.dataset.typingStage = '0';
	        wrapRef.current.dataset.typingLatency = '0';
	      }
	      const ready = Boolean(stateRef.current.screenCanvas && stateRef.current.ctx2d);
	      window.__resumeMacOvertureReady = ready;
	      return ready;
	    };
	    const companionIntroReady = () => Boolean(
	      stateRef.current.screenCanvas && stateRef.current.ctx2d,
	    );
	    const onCompanionStart = () => {
	      // The companion command owns the next paint. Do not draw an
	      // intermediate terminal/loading frame between hiding the QR and the
	      // first typed character.
	      prepareCompanionIntro();
	    };
	    const onCompanionStop = () => {
	      stateRef.current.macLandingLaunchPending = false;
	      stateRef.current.macTryItPromptVisible = false;
	      stateRef.current.macCompanionDirectTyping = false;
	      stateRef.current.companionQrVisible = false;
	      stateRef.current.openingInvitationPending = false;
	      stopVoiceVisual({ clearScreen: true });
	      stateRef.current.visitorNamePromptActive = TV_HERO_PERSONALIZED_PROLOGUE_ENABLED;
	      stateRef.current.visitorName = '';
	      stateRef.current.forceTerminal = true;
	      drawMacOffScreen();
	      stateRef.current.forceTerminal = false;
	    };
	    const onVisitorNameChange = (event) => {
	      stateRef.current.visitorName = String(event.detail?.name || '').slice(0, 24);
	      stateRef.current.openingInvitationPending = event.detail?.opening === true;
	      if (!stateRef.current.openingInvitationPending) {
	        stateRef.current.openingInvitationText = '';
	        if (stateRef.current.visitorNamePromptActive) {
	          stopVoiceVisual({ clearScreen: true });
	        }
	      }
	      stateRef.current.visitorNamePromptActive = TV_HERO_PERSONALIZED_PROLOGUE_ENABLED
	        && event.detail?.prompt !== false;
	      if (wrapRef.current) {
	        wrapRef.current.dataset.visitorName = stateRef.current.visitorName;
	      }
	      stateRef.current.forceTerminal = true;
	      drawMacOffScreen();
	      stateRef.current.forceTerminal = false;
	    };

	    window.addEventListener('resume-companion-qr-ready', onQrReady);
	    window.addEventListener('resume-opening-invitation-step', onOpeningInvitationStep);
	    window.addEventListener('resume-companion-start-intro', onCompanionStart);
	    window.addEventListener('resume-companion-stop-intro', onCompanionStop);
	    window.addEventListener('resume-visitor-name-change', onVisitorNameChange);
	    window.__tvHeroCompanionIntroReady = companionIntroReady;
	    window.__tvHeroPrepareCompanionIntro = prepareCompanionIntro;
	    window.__resumeMacOvertureReady = companionIntroReady();
	    if (window.__resumeMacOvertureReady) {
	      window.dispatchEvent(new CustomEvent('resume-mac-overture-ready', {
	        detail: { source: 'live-companion-binding' },
	      }));
	    }
	    loadQr(window.__resumeCompanionQrUrl);

	    return () => {
	      disposed = true;
	      stopVoiceVisual({ clearScreen: true });
	      window.removeEventListener('resume-companion-qr-ready', onQrReady);
	      window.removeEventListener('resume-opening-invitation-step', onOpeningInvitationStep);
	      window.removeEventListener('resume-companion-start-intro', onCompanionStart);
	      window.removeEventListener('resume-companion-stop-intro', onCompanionStop);
	      window.removeEventListener('resume-visitor-name-change', onVisitorNameChange);
	      if (window.__tvHeroPrepareCompanionIntro === prepareCompanionIntro) {
	        delete window.__tvHeroPrepareCompanionIntro;
	      }
	      if (window.__tvHeroCompanionIntroReady === companionIntroReady) {
	        delete window.__tvHeroCompanionIntroReady;
	        window.__resumeMacOvertureReady = false;
	      }
	    };
	  }, [drawMacOffScreen]);

  const openMacContactForm = React.useCallback(() => {
    const state = stateRef.current;
    const form = state.contactForm || {};
    state.contactForm = {
      open: true,
      activeField: ['name', 'email', 'message', 'send'].includes(form.activeField) ? form.activeField : 'name',
      name: String(form.name || ''),
      email: String(form.email || ''),
      message: String(form.message || ''),
      error: '',
      status: '',
      sending: false,
      sent: false,
      invalidFields: [],
    };
    const capture = keyboardCaptureRef.current;
    capture?.setAttribute?.('aria-label', 'Contact Tawfeeq: name field active');
    captureMacKeyboard();
    drawMacOffScreen();
  }, [captureMacKeyboard, drawMacOffScreen]);

  const closeMacContactForm = React.useCallback(() => {
    const state = stateRef.current;
    if (!state.contactForm) return;
    state.contactForm.open = false;
    state.contactForm.error = '';
    state.contactForm.status = '';
    state.contactFormRects = null;
    keyboardCaptureRef.current?.setAttribute?.('aria-label', 'Mac terminal keyboard capture');
    if (typeof window.__resumeCrtReset === 'function') {
      window.__resumeCrtReset();
    } else {
      window.scrollTo(0, 0);
      window.dispatchEvent(new CustomEvent('resume-crt-overture-progress', {
        detail: { progress: 0, floppyProgress: 0, zoomProgress: 0 },
      }));
    }
    drawMacOffScreen();
  }, [drawMacOffScreen]);

  const submitMacContactForm = React.useCallback(async () => {
    const form = stateRef.current.contactForm;
    if (!form?.open || form.sending) return false;
    const name = String(form.name || '').trim();
    const email = String(form.email || '').trim();
    const message = String(form.message || '').trim();
    const invalidFields = [];
    if (name.length < 2) invalidFields.push('name');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) invalidFields.push('email');
    if (message.length < 3) invalidFields.push('message');
    if (invalidFields.length) {
      form.invalidFields = invalidFields;
      form.activeField = invalidFields[0];
      form.error = '';
      form.status = '';
      keyboardCaptureRef.current?.setAttribute?.('aria-label', `Contact Tawfeeq: ${invalidFields[0]} field invalid`);
      drawMacOffScreen();
      return false;
    }
    form.invalidFields = [];
    form.error = '';
    form.status = 'SENDING WITHOUT LEAVING THE MAC…';
    form.sending = true;
    form.sent = false;
    drawMacOffScreen();
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, company: '' }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.ok === false) {
        throw new Error(result.error || 'The message could not be delivered.');
      }
      form.sending = false;
      form.sent = true;
      form.status = result.delivered === false
        ? 'SAVED TO THE LOCAL OUTBOX. DELIVERY KEY NOT CONFIGURED.'
        : 'SENT. I’LL WRITE BACK SOON.';
      drawMacOffScreen();
      return true;
    } catch (error) {
      form.sending = false;
      form.sent = false;
      form.error = String(error?.message || 'THE MESSAGE COULD NOT BE SENT.').toUpperCase();
      drawMacOffScreen();
      return false;
    }
  }, [drawMacOffScreen]);

  const handleMacContactKey = React.useCallback((event, code) => {
    const form = stateRef.current.contactForm;
    if (!form?.open) return false;
    const fields = ['name', 'email', 'message', 'send'];
    const currentIndex = Math.max(0, fields.indexOf(form.activeField));
    const focusField = (field) => {
      form.activeField = field;
      form.error = '';
      form.status = '';
      keyboardCaptureRef.current?.setAttribute?.('aria-label', `Contact Tawfeeq: ${field} field active`);
    };
    const clearFieldErrorWhenValid = (field) => {
      const value = String(form[field] || '').trim();
      const valid = field === 'name'
        ? value.length >= 2
        : field === 'email'
          ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          : field === 'message'
            ? value.length >= 3
            : true;
      if (valid && Array.isArray(form.invalidFields)) {
        form.invalidFields = form.invalidFields.filter((key) => key !== field);
      }
    };
    if (event.key === 'Escape') {
      playMacKeyClick('Escape');
      closeMacContactForm();
      return true;
    }
    if (event.key === 'Tab') {
      playMacKeyClick('Tab');
      const direction = event.shiftKey ? -1 : 1;
      focusField(fields[(currentIndex + direction + fields.length) % fields.length]);
      drawMacOffScreen();
      return true;
    }
    if (event.key === 'Enter') {
      playMacKeyClick('Enter');
      if ((event.metaKey || event.ctrlKey) || form.activeField === 'send') {
        submitMacContactForm();
      } else if (form.activeField === 'name') {
        focusField('email');
        drawMacOffScreen();
      } else if (form.activeField === 'email') {
        focusField('message');
        drawMacOffScreen();
      } else if (form.activeField === 'message') {
        form.message = `${form.message}\n`.slice(0, 480);
        form.error = '';
        drawMacOffScreen();
      }
      return true;
    }
    if (event.key === 'Backspace') {
      playMacKeyClick('Backspace');
      if (form.activeField !== 'send') {
        form[form.activeField] = String(form[form.activeField] || '').slice(0, -1);
        clearFieldErrorWhenValid(form.activeField);
        form.error = '';
        form.status = '';
        form.sent = false;
        drawMacOffScreen();
      }
      return true;
    }
    if (form.activeField === 'send' && event.key === ' ') {
      playMacKeyClick('Space');
      submitMacContactForm();
      return true;
    }
    if (event.metaKey || event.ctrlKey || event.altKey) return false;
    if (event.key?.length === 1 && form.activeField !== 'send') {
      if (code) playMacKeyClick(code);
      const maxLength = form.activeField === 'message' ? 480 : form.activeField === 'email' ? 120 : 80;
      form[form.activeField] = `${form[form.activeField] || ''}${event.key}`.slice(0, maxLength);
      clearFieldErrorWhenValid(form.activeField);
      form.error = '';
      form.status = '';
      form.sent = false;
      drawMacOffScreen();
      return true;
    }
    return false;
  }, [closeMacContactForm, drawMacOffScreen, playMacKeyClick, submitMacContactForm]);

  React.useEffect(() => {
    let frame = 0;
    let started = false;
    let fallback = 0;
    let cursorBlink = 0;
    stateRef.current.macOvertureLoadReveal = 0;
    stateRef.current.macOvertureCursorOn = true;
    stateRef.current.macOvertureBootBlank = true;
    const begin = () => {
      if (started) return;
      // On the companion/scroll-gated landing page, model readiness must not
      // replace the welcome screen. The existing Start handoff clears the boot
      // hold itself before floppy insertion and ./design typing begin.
      if (window.__resumeCompanionGateEnabled === true
        || window.__resumeMacWaitForKeyboard === true) return;
      started = true;
      // Let the loaded Macintosh register as an object before it starts typing.
      // During this authored hold the glass is completely blank and the stage
      // remains the untouched blue tracking screen.
      const startedAt = performance.now() + 700;
      const duration = 900 * MAC_OVERTURE_TYPING_TIME_SCALE;
      const tick = (now) => {
        if (now < startedAt) {
          frame = requestAnimationFrame(tick);
          return;
        }
        if (stateRef.current.macOvertureBootBlank) {
          stateRef.current.macOvertureBootBlank = false;
          window.dispatchEvent(new CustomEvent('resume-mac-overture-ready'));
        }
        const raw = Math.max(0, Math.min(1, (now - startedAt) / duration));
        const reveal = raw * raw * (3 - 2 * raw);
        stateRef.current.macOvertureLoadReveal = reveal;
        if (stateRef.current.deviceMode === 'mac' && !stateRef.current.pageMode && !stateRef.current.visualReelMode && !stateRef.current.channelMediaActive) {
          drawMacOffScreen();
        }
        if (raw < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };
    // Expose the current mount's reveal directly to the model-ready path. A
    // window event can be lost or delivered to a stale listener during rapid
    // cached reloads; the state ref always belongs to this TvHero instance.
    stateRef.current.beginMacOvertureReveal = begin;
    cursorBlink = window.setInterval(() => {
      stateRef.current.macOvertureCursorOn = !stateRef.current.macOvertureCursorOn;
      if (stateRef.current.deviceMode === 'mac' && !stateRef.current.pageMode && !stateRef.current.visualReelMode && !stateRef.current.channelMediaActive) {
        drawMacOffScreen();
      }
    }, 480);
    fallback = window.setTimeout(begin, 5000);
    return () => {
      cancelAnimationFrame(frame);
      window.clearInterval(cursorBlink);
      window.clearTimeout(fallback);
      if (stateRef.current.beginMacOvertureReveal === begin) {
        delete stateRef.current.beginMacOvertureReveal;
      }
    };
  }, [drawMacOffScreen]);

  // Draw a source image to the offscreen screen canvas with a light wash.
  const drawSourceToCanvas = React.useCallback((img, effect = null) => {
    const { ctx2d, screenCanvas, screenTex } = stateRef.current;
    if (!ctx2d || !screenCanvas) return;
    if (stateRef.current.pageMode) return;  // CRT page projection owns the screen
    if (wrapRef.current) {
      wrapRef.current.dataset.screenPaint = 'media';
      if (img && typeof img.currentTime === 'number' && typeof img.play === 'function') {
        wrapRef.current.dataset.screenMediaTime = Number.isFinite(img.currentTime)
          ? img.currentTime.toFixed(3)
          : '';
        wrapRef.current.dataset.screenMediaSrc = String(
          img.dataset?.companionSrc || img.currentSrc || img.src || '',
        );
      }
    }
    setScreenCanvasSize('media');
    setScreenTextureSampling('media');
    const w = screenCanvas.width, h = screenCanvas.height;
    // Media owns every pixel of the CRT during reel mode. Use a copy clear,
    // not a translucent/source-over paint, so the prior DESIGN / MAKE /
    // BELIEVE terminal frame can never ghost through a video frame.
    ctx2d.globalAlpha = 1;
    ctx2d.globalCompositeOperation = 'copy';
    ctx2d.fillStyle = '#000';
    ctx2d.fillRect(0, 0, w, h);
    ctx2d.globalCompositeOperation = 'source-over';
    const mediaW = img.naturalWidth || img.videoWidth || img.width || 1;
    const mediaH = img.naturalHeight || img.videoHeight || img.height || 1;
    const ar = mediaW / mediaH;
    const targetAr = w / h;
    let dw, dh, dx, dy;
    // Mac classic = square-ish screen with no cinematic letterbox; force
    // cover fit so the image fills the CRT regardless of source aspect.
    const isMac = stateRef.current.deviceMode === 'mac';
    const fit = stateRef.current.forceMediaContain
      ? 'contain'
      : (isMac ? 'cover' : stateRef.current.currentFit);
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
    if (wrapRef.current) {
      wrapRef.current.dataset.screenSourceSize = `${mediaW}x${mediaH}`;
      wrapRef.current.dataset.screenDrawRect = [
        dx.toFixed(2),
        dy.toFixed(2),
        dw.toFixed(2),
        dh.toFixed(2),
      ].join(',');
      wrapRef.current.dataset.screenDrawCoverage = (
        Math.min(1, Math.max(0, dw / w))
        * Math.min(1, Math.max(0, dh / h))
      ).toFixed(3);
    }
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
      // Global glitches stay vertically registered. A whole-frame Y jump can
      // move the important part of a source out of view on the small CRT.
      const frameDy = 0;
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
        const hasToolbarFold = Boolean(note.userData.fullscreenToolbarFold)
          && typeof note.userData.setFullscreenFoldProgress === 'function';
        let foldRemaining = 0;
        if (hasToolbarFold) {
          const currentFold = Number(note.userData.fullscreenFoldProgress) || 0;
          const targetFold = hovered && state.dockMode ? 1 : 0;
          const foldEase = targetFold > currentFold ? 0.22 : 0.16;
          const nextFold = currentFold + (targetFold - currentFold) * foldEase;
          foldRemaining = Math.abs(targetFold - nextFold);
          if (foldRemaining > 0.001) {
            note.userData.setFullscreenFoldProgress(nextFold);
          } else if (Math.abs(targetFold - currentFold) > 0.0005) {
            note.userData.setFullscreenFoldProgress(targetFold);
            foldRemaining = 0;
          }
        }
        const remaining = Math.abs(targetX - note.position.x)
          + Math.abs(targetY - note.position.y)
          + Math.abs(targetZ - note.position.z)
          + Math.abs(targetRotationX - note.rotation.x)
          + Math.abs(targetRotationY - note.rotation.y)
          + Math.abs(targetRotationZ - note.rotation.z)
          + Math.abs(targetScale - note.scale.x)
          + Math.abs(targetScale - note.scale.y)
          + foldRemaining;
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

  const setFloppyProgress = React.useCallback((value) => {
    const progress = Math.max(0, Math.min(1, Number(value) || 0));
    const state = stateRef.current;
    const floppy = state.floppy;
    if (!floppy) return false;
    cancelAnimationFrame(floppy.raf);
    for (const part of floppy.parts) {
      part.mesh.position.z = part.ejectedZ + (part.insertedZ - part.ejectedZ) * progress;
    }
    floppy.inserted = progress >= 0.999;
    floppy.raf = 0;
    if (wrapRef.current) {
      wrapRef.current.dataset.floppyMotion = progress >= 0.999
        ? 'inserted'
        : progress <= 0.001
          ? 'ejected'
          : 'travelling';
      wrapRef.current.dataset.floppyPhysicalProgress = progress.toFixed(3);
    }
    state.requestRender?.();
    return true;
  }, []);

  // Publish the direct companion controls independently from the overture
  // listeners. The Three scene can mount after the React effect that owns the
  // timeline, so these bindings must exist even while the Mac is still
  // finishing its async model setup.
  React.useEffect(() => {
    const insertFloppyForIntro = () => {
      const state = stateRef.current;
      if (state.deviceMode !== 'mac' || !state.floppy || state.powerToggleInFlight) {
        return Promise.resolve(false);
      }
      state.powerToggleInFlight = true;
      if (wrapRef.current) wrapRef.current.dataset.floppyMotion = 'inserting';
      let watchdog = 0;
      const insertion = Promise.resolve(animateFloppy(true)).then(() => true);
      const deadline = new Promise((resolve) => {
        // A reset/update can cancel the disk's requestAnimationFrame while it
        // is travelling. Never leave the companion awaiting an orphaned
        // animation promise: finish the physical state at the authored end
        // time and continue into the terminal.
        watchdog = window.setTimeout(() => {
          setFloppyProgress(1);
          resolve(true);
        }, 620);
      });
      return Promise.race([insertion, deadline])
        .then(() => {
          window.clearTimeout(watchdog);
          setFloppyProgress(1);
          if (wrapRef.current) wrapRef.current.dataset.floppyMotion = 'inserted';
          return true;
        })
        .catch(() => {
          if (wrapRef.current) wrapRef.current.dataset.floppyMotion = 'failed';
          return false;
        })
        .finally(() => {
          window.clearTimeout(watchdog);
          stateRef.current.powerToggleInFlight = false;
        });
    };
    window.__tvHeroFloppyProgress = setFloppyProgress;
    window.__tvHeroInsertFloppy = insertFloppyForIntro;
    return () => {
      if (window.__tvHeroFloppyProgress === setFloppyProgress) delete window.__tvHeroFloppyProgress;
      if (window.__tvHeroInsertFloppy === insertFloppyForIntro) delete window.__tvHeroInsertFloppy;
    };
  }, [animateFloppy, setFloppyProgress]);

  React.useEffect(() => {
    const onOvertureProgress = (event) => {
      const progress = Math.max(0, Math.min(1, Number(event.detail?.progress) || 0));
      const floppyProgress = Math.max(0, Math.min(1, Number(event.detail?.floppyProgress ?? progress) || 0));
      const rawZoomProgress = Number(event.detail?.zoomProgress);
      stateRef.current.macOvertureProgress = progress;
      stateRef.current.macOvertureBreather = event.detail?.breather === true;
      stateRef.current.macOvertureResolve = event.detail?.resolve === true;
      if (event.detail?.blankScreen === true) {
        stateRef.current.macOvertureBootBlank = true;
      } else if (event.detail?.blankScreen === false) {
        stateRef.current.macOvertureBootBlank = false;
      }
      stateRef.current.macOvertureResolveProgress = Math.max(
        0,
        Math.min(1, Number(event.detail?.resolveProgress) || 0),
      );
      const markerCyc = stateRef.current.markerCyc;
      if (markerCyc) {
        markerCyc.visible = true;
        if (markerCyc.userData?.markerMesh) {
          markerCyc.userData.markerMesh.visible = (
            markerCyc.userData.trackingMarkersEnabled === true
            && !stateRef.current.macOvertureResolve
          );
        }
        stateRef.current.updateCycStage?.({
          resolve: stateRef.current.macOvertureResolve,
        });
        if (wrapRef.current) {
          wrapRef.current.dataset.cycVisible = 'true';
          wrapRef.current.dataset.cycMarkersVisible = String(
            markerCyc.userData?.markerMesh?.visible !== false,
          );
        }
        stateRef.current.requestRender?.();
      }
      stateRef.current.macOvertureLoopIndex = Math.max(
        0,
        Number(event.detail?.loopIndex) || 0,
      );
      if (Number.isFinite(rawZoomProgress)) {
        const zoomProgress = Math.max(0, Math.min(1, rawZoomProgress));
        stateRef.current.zoomProgress = zoomProgress;
        const introCameraOwnsView = (
          wrapRef.current?.dataset.channelCameraSource === 'intro'
          && !stateRef.current.visualReelMode
        );
        // The overture emits zoomProgress: 0 on every animation tick. That is
        // a scroll-state heartbeat, not a request to reset the authored camera
        // move. Let the intro route own the lens until the visitor genuinely
        // starts the CRT docking runway.
        if (!introCameraOwnsView || zoomProgress > 0.001) {
          if (introCameraOwnsView && zoomProgress > 0.001) {
            cancelAnimationFrame(stateRef.current.channelCameraRaf);
            stateRef.current.channelCameraRaf = 0;
            if (wrapRef.current) {
              wrapRef.current.dataset.channelCameraSource = 'scroll';
              wrapRef.current.dataset.channelCameraBeat = '';
            }
          }
          stateRef.current.applyZoom?.(zoomProgress);
        }
      }
      // Direct insert/eject animation owns the disk while it is in flight.
      // Scroll progress resumes ownership when that motion has completed.
      if (!stateRef.current.powerToggleInFlight
        && !stateRef.current.visualReelMode
        && !stateRef.current.reelStopPromise) {
        setFloppyProgress(floppyProgress);
      }
      if (stateRef.current.deviceMode === 'mac' && !stateRef.current.pageMode) {
        drawMacOffScreen();
      }
    };
    const onCycGlitch = (event) => {
      const state = stateRef.current;
      if (!isResumePageActive() || state.tabVisible === false) return;
      const detail = event.detail || {};
      if (typeof state.pulseCycStage === 'function') {
        state.pulseCycStage(detail);
      } else {
        // Three can finish loading after the intro begins. Preserve the latest
        // authored hit so the wall does not silently drop the image paired
        // with audio that has already started.
        state.pendingCycGlitch = {
          detail,
          receivedAt: performance.now(),
        };
      }
    };
    const onForegroundRestore = (event) => {
      const state = stateRef.current;
      // This event can arrive before TvHero's own activity listener in the
      // same focus dispatch. Read the coordinator directly so listener order
      // cannot drop the only authoritative wall repaint.
      state.tabVisible = isResumePageActive();
      if (state.tabVisible === false) return;
      const detail = event.detail || {};
      cancelAnimationFrame(state.cycGlitchRaf);
      state.cycGlitchRaf = 0;
      state.cycGlitchSerial = (state.cycGlitchSerial || 0) + 1;
      const requestedPhase = String(detail.phase || '');
      const result = state.updateCycStage?.({
        resolve: detail.resolve === true,
        phase: requestedPhase,
        force: true,
        frameIndex: Number.isFinite(Number(detail.frameIndex))
          ? Number(detail.frameIndex)
          : undefined,
        designSequence: Number(detail.designSequence) || 0,
        codeStable: detail.codeStable === true,
        codeVariant: detail.codeVariant,
        codeCut: detail.codeCut,
        codeCrash: detail.codeCrash,
        codeSequence: Number(detail.codeSequence) || 0,
        glitchStrength: 0,
      });
      if (wrapRef.current) {
        wrapRef.current.dataset.foregroundRestore = requestedPhase || result?.phase || 'blue';
        wrapRef.current.dataset.foregroundRestoreFrame = String(
          result?.frame ?? detail.frameIndex ?? -1,
        );
        wrapRef.current.dataset.foregroundRestoreAt = performance.now().toFixed(1);
      }
      state.requestRender?.();
    };
    window.addEventListener('resume-crt-overture-progress', onOvertureProgress);
    window.addEventListener('resume-crt-parked-glitch', onCycGlitch);
    window.addEventListener('resume-crt-parked-idle', onCycGlitch);
    window.addEventListener('resume-crt-foreground-restore', onForegroundRestore);
    return () => {
      window.removeEventListener('resume-crt-overture-progress', onOvertureProgress);
      window.removeEventListener('resume-crt-parked-glitch', onCycGlitch);
      window.removeEventListener('resume-crt-parked-idle', onCycGlitch);
      window.removeEventListener('resume-crt-foreground-restore', onForegroundRestore);
    };
  }, [drawMacOffScreen, setFloppyProgress]);

  const syncMacFloppyToAudio = React.useCallback((animateWhenVisible = true) => {
    const state = stateRef.current;
    if (state.deviceMode !== 'mac' || state.powerToggleInFlight) return;
    const f = state.floppy;
    if (!f) return;
    const shouldInsert = state.visualReelMode || !!window.__resumeStrudelAudioEngine?.enabled;
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

  // The CRT renderer emits the character it actually painted after each
  // shuffle change. Drive the corresponding physical key and its dry click
  // from that event so picture, key travel, and sound share one clock.
  React.useEffect(() => {
    if (stateRef.current.deviceMode !== 'mac') return undefined;
    const setWallPowerProgress = (value, lock = false) => {
      const state = stateRef.current;
      const current = Math.max(0, Number(state.macWallPowerProgress) || 0);
      const next = lock
        ? 1
        : Math.max(current, Math.max(0, Math.min(0.94, Number(value) || 0)));
      state.macWallPowerProgress = next;
      if (lock) state.macWallPowerLocked = true;
      state.markerCyc?.userData?.setWallPowerProgress?.(next, lock);
      if (wrapRef.current) {
        wrapRef.current.dataset.cycWallPowerProgress = next.toFixed(3);
        wrapRef.current.dataset.cycWallPowerState = lock
          ? 'online'
          : next > 0
            ? 'booting'
            : 'off';
        wrapRef.current.dataset.cycWallPowerSilhouette = lock
          ? 'released-to-design'
          : next >= 0.47
            ? 'bull-formed'
            : next > 0
              ? 'bull-forming'
              : 'off';
        wrapRef.current.dataset.cycWallPowerSilhouetteMask = 'cabinet-grid-design-aligned';
        wrapRef.current.dataset.cycCeilingPowerProgress = next > 0 ? '1.000' : '0.000';
        wrapRef.current.dataset.cycCeilingPowerState = next > 0 ? 'blue-online' : 'off';
      }
      state.requestRender?.();
    };
    const onScreenCharacter = (event) => {
      const state = stateRef.current;
      if (state.deviceMode !== 'mac'
        || state.pageMode
        || state.visualReelMode
        || state.tabVisible === false
        || state.tvVisible === false
        || helpOwnsTvStage()) return;
      const typingStage = Math.max(0, Number(event.detail?.stage) || 0);
      if (typingStage === 0 && !state.macWallPowerLocked) {
        if (event.detail?.action === 'enter') {
          // Return is the hard sync point: the last dark cabinets lock on
          // before the design program's first background/glitch frame.
          setWallPowerProgress(1, true);
        } else if (['type', 'mistype', 'backspace'].includes(event.detail?.action)) {
          const reveal = Math.max(0, Math.min(1, Number(event.detail?.reveal) || 0));
          // Ignite quickly enough to feel intentional rather than loaded:
          // roughly 70% of cabinets are online halfway through the command and
          // 90% by its final character. Return still owns the last hard lock.
          const acceleratedReveal = 1 - Math.pow(1 - reveal, 2.2);
          setWallPowerProgress(0.045 + acceleratedReveal * 0.855);
        }
      }
      if (event.detail?.action === 'backspace') {
        animateKeyPress('Backspace');
        playMacKeyClick('Backspace');
        state.macOvertureLastKey = 'Backspace';
        state.macOvertureLastKeyChar = '';
        state.requestRender?.();
        return;
      }
      if (event.detail?.action === 'enter') {
        animateKeyPress('Enter');
        playMacKeyClick('Enter');
        state.macOvertureLastKey = 'Enter';
        state.macOvertureLastKeyChar = '';
        state.requestRender?.();
        return;
      }
      const stroke = getMacOvertureKeyStroke(event.detail?.char);
      if (!stroke) return;
      if (stroke.shifted) {
        animateKeyPress('ShiftLeft');
      }
      animateKeyPress(stroke.code);
      playMacKeyClick(stroke.code);
      state.macOvertureLastKey = stroke.code;
      state.macOvertureLastKeyChar = String(event.detail?.char || '');
      state.requestRender?.();
    };
    const onStoryType = (event) => {
      const state = stateRef.current;
      const action = String(event.detail?.action || '');
      if (action === 'begin') {
        state.macStoryTypeActive = true;
        state.macStoryTypedText = '';
      } else if (action === 'type') {
        state.macStoryTypeActive = true;
        state.macStoryTypedText = `${state.macStoryTypedText || ''}${String(event.detail?.char || '')}`
          .slice(0, 32);
      } else if (action === 'clear') {
        state.macStoryTypeActive = false;
        state.macStoryTypedText = '';
      } else {
        return;
      }
      if (wrapRef.current) {
        wrapRef.current.dataset.makeStoryTyping = state.macStoryTypeActive ? 'visible' : 'hidden';
        wrapRef.current.dataset.makeStoryTypedText = state.macStoryTypedText;
      }
      drawMacOffScreen();
    };
    const onCompanionStop = () => {
      const state = stateRef.current;
      state.macStoryTypeActive = false;
      state.macStoryTypedText = '';
      state.macWallPowerProgress = 0;
      state.macWallPowerLocked = false;
      state.markerCyc?.userData?.setWallPowerProgress?.(0, false);
      if (state.markerCyc?.userData) state.markerCyc.userData.wallPowerLocked = false;
      if (wrapRef.current) {
        wrapRef.current.dataset.cycWallPowerProgress = '0.000';
        wrapRef.current.dataset.cycWallPowerState = 'off';
        wrapRef.current.dataset.cycWallPowerSilhouette = 'off';
        wrapRef.current.dataset.cycWallPowerSilhouetteMask = 'cabinet-grid-design-aligned';
        wrapRef.current.dataset.cycCeilingPowerProgress = '0.000';
        wrapRef.current.dataset.cycCeilingPowerState = 'off';
      }
      state.requestRender?.();
    };
    window.addEventListener('resume-mac-screen-character', onScreenCharacter);
    window.addEventListener('resume-mac-story-type', onStoryType);
    window.addEventListener('resume-companion-stop-intro', onCompanionStop);
    window.addEventListener('resume-crt-wall-power-reset', onCompanionStop);
    return () => {
      window.removeEventListener('resume-mac-screen-character', onScreenCharacter);
      window.removeEventListener('resume-mac-story-type', onStoryType);
      window.removeEventListener('resume-companion-stop-intro', onCompanionStop);
      window.removeEventListener('resume-crt-wall-power-reset', onCompanionStop);
    };
  }, [animateKeyPress, drawMacOffScreen, helpOwnsTvStage, playMacKeyClick]);

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
    pushMacTerminalLine(`tm@Mac Dev % ${cmd}`);
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
    window.clearTimeout(state.channelVideoTransitionTimer);
    state.channelVideoTransitionTimer = 0;
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

    const transition = state.channelVideoTransition;
    if (transition?.from
      && transition.from !== video
      && typeof transition.from.currentTime === 'number') {
      transition.to = video;
      transition.running = true;
      const serial = transition.serial;
      const framePattern = [0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1];
      const frameDurations = [26, 22, 34, 18, 28, 24, 18, 34, 20, 27, 22, 38];
      let transitionFrame = 0;
      if (wrapRef.current) {
        wrapRef.current.dataset.channelTransition = 'video-glitch';
        wrapRef.current.dataset.transitionFrom = transition.fromChannel || '';
        wrapRef.current.dataset.transitionTo = transition.toChannel || '';
        wrapRef.current.dataset.transitionSamples = '';
      }
      const paintTransitionFrame = () => {
        const activeTransition = state.channelVideoTransition;
        if (!activeTransition || activeTransition.serial !== serial) return;
        if (!activeTransition.stageEventDispatched) {
          activeTransition.stageEventDispatched = true;
          window.dispatchEvent(new CustomEvent('resume-crt-channel-glitch', {
            detail: {
              serial,
              from: transition.fromChannel || '',
              to: transition.toChannel || '',
              durationMs: 340,
              audioDurationMs: 320,
            },
          }));
        }
        const useIncoming = framePattern[transitionFrame] === 1;
        const source = useIncoming && video.readyState >= 2
          ? video
          : transition.from;
        const center = (framePattern.length - 1) / 2;
        const envelope = 1 - Math.abs(transitionFrame - center) / Math.max(1, center);
        drawSourceToCanvas(source, {
          strength: Math.min(1, 0.42 + envelope * 0.54),
          seed: serial * 37 + transitionFrame * 19,
        });
        if (wrapRef.current) {
          wrapRef.current.dataset.transitionFrame = String(transitionFrame);
          wrapRef.current.dataset.transitionSource = source === video ? 'incoming' : 'outgoing';
          wrapRef.current.dataset.transitionSamples += source === video ? 'I' : 'O';
        }
        transitionFrame += 1;
        if (transitionFrame < framePattern.length) {
          state.channelVideoTransitionTimer = window.setTimeout(
            paintTransitionFrame,
            frameDurations[transitionFrame - 1],
          );
          return;
        }
        state.channelVideoTransitionTimer = 0;
        try { transition.from.pause?.(); } catch (_) {}
        state.channelVideoTransition = null;
        if (wrapRef.current) {
          wrapRef.current.dataset.channelTransition = 'idle';
          wrapRef.current.dataset.transitionFrame = '';
          wrapRef.current.dataset.transitionSource = 'incoming';
        }
        paintVideo();
        scheduleVideo();
      };
      let bufferPulse = 0;
      const waitForIncomingFrame = () => {
        const activeTransition = state.channelVideoTransition;
        if (!activeTransition || activeTransition.serial !== serial) return;
        if (video.readyState >= 2) {
          paintTransitionFrame();
          return;
        }
        drawSourceToCanvas(transition.from, {
          strength: 0.2 + (bufferPulse % 3) * 0.08,
          seed: serial * 53 + bufferPulse * 11,
        });
        if (wrapRef.current) {
          wrapRef.current.dataset.transitionFrame = 'buffering';
          wrapRef.current.dataset.transitionSource = 'outgoing';
        }
        bufferPulse += 1;
        state.channelVideoTransitionTimer = window.setTimeout(waitForIncomingFrame, 58);
      };
      waitForIncomingFrame();
      return;
    }

    state.channelVideoTransition = null;
    if (wrapRef.current) wrapRef.current.dataset.channelTransition = 'idle';
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

  const resetChannelPlayback = React.useCallback(() => {
    const state = stateRef.current;
    stopVideoLoop();
    for (const video of state.companionClipCache?.values?.() || []) {
      try { video.pause?.(); } catch (_) {}
      const authoredStart = Math.max(0, Number(video.dataset?.companionStart) || 0);
      try { video.currentTime = authoredStart; } catch (_) {}
    }
    for (const video of state.videoCache?.values?.() || []) {
      try { video.pause?.(); } catch (_) {}
      try { video.currentTime = 0; } catch (_) {}
    }
    state.videoChannelBookmark = null;
    state.companionClipSequenceIndex?.clear?.();
    state.filmReelChannelActive = false;
    state.filmReelOwnershipToken = (state.filmReelOwnershipToken || 0) + 1;
    state.filmReelStartPending = false;
    window.clearTimeout(state.channelVideoTransitionTimer);
    state.channelVideoTransitionTimer = 0;
    state.channelVideoTransition = null;
    state.companionClip = null;
    state.currentVideo = null;
    state.currentMedia = null;
    state.currentImage = null;
    state.currentSource = null;
    if (wrapRef.current) {
      wrapRef.current.dataset.filmReelOwner = 'released';
      wrapRef.current.dataset.filmReelTransport = 'stopped';
      wrapRef.current.dataset.screenMediaTime = '';
      wrapRef.current.dataset.screenMediaSrc = '';
      wrapRef.current.dataset.clipAudio = 'idle';
      wrapRef.current.dataset.channelTransition = 'idle';
      wrapRef.current.dataset.transitionFrom = '';
      wrapRef.current.dataset.transitionTo = '';
      wrapRef.current.dataset.transitionFrame = '';
      wrapRef.current.dataset.transitionSource = '';
      wrapRef.current.dataset.transitionSamples = '';
      wrapRef.current.dataset.clipSequenceChannel = '';
      wrapRef.current.dataset.clipSequenceIndex = '0';
      wrapRef.current.dataset.clipSequenceId = '';
      wrapRef.current.dataset.clipSequenceLength = '0';
    }
    return true;
  }, [stopVideoLoop]);

  React.useEffect(() => {
    window.__tvHeroResetChannelPlayback = resetChannelPlayback;
    return () => {
      if (window.__tvHeroResetChannelPlayback === resetChannelPlayback) {
        delete window.__tvHeroResetChannelPlayback;
      }
    };
  }, [resetChannelPlayback]);

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
      cancelAnimationFrame(state.channelCameraRaf);
      cancelAnimationFrame(state.cycGlitchRaf);
      cancelAnimationFrame(state.macBloomRaf);
      state.trackingRaf = 0;
      state.channelRaf = 0;
      state.channelCameraRaf = 0;
      state.cycGlitchRaf = 0;
      state.cycGlitchSerial = (state.cycGlitchSerial || 0) + 1;
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
      if (video && state.currentMedia === video) {
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
    const reelCutBlocked = state.dockMode && !state.filmReelChannelActive;
    if (!availableSources.length
      || helpOwnsTvStage()
      || state.tabVisible === false
      || state.tvVisible === false
      || reelCutBlocked) {
      if (reelCutBlocked && wrapRef.current) {
        const blocked = Number(wrapRef.current.dataset.lateReelCutsBlocked || 0) + 1;
        wrapRef.current.dataset.lateReelCutsBlocked = String(blocked);
      }
      return;
    }
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
        (!s.dockMode || s.filmReelChannelActive) &&
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
          if (!window.__resumeStrudelAudioEngine?.enabled && !state.visualReelMode) return;
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

  React.useEffect(() => {
    const setHandOfGodStatus = (status) => {
      const value = String(status || 'idle');
      const wrap = wrapRef.current;
      const shell = document.querySelector('.landing-v1-shell');
      if (wrap) wrap.dataset.handOfGod = value;
      if (shell) {
        shell.dataset.screenExperience = value === 'idle' ? 'terminal' : 'hand-of-god';
        shell.dataset.handOfGod = value;
      }
    };
    const drawHandOfGodBoot = () => {
      const state = stateRef.current;
      const { ctx2d, screenCanvas, screenTex } = state;
      if (!ctx2d || !screenCanvas) return;
      setScreenCanvasSize('media');
      setScreenTextureSampling('media');
      const w = screenCanvas.width;
      const h = screenCanvas.height;
      ctx2d.save();
      ctx2d.globalAlpha = 1;
      ctx2d.globalCompositeOperation = 'copy';
      ctx2d.fillStyle = '#050505';
      ctx2d.fillRect(0, 0, w, h);
      ctx2d.globalCompositeOperation = 'source-over';
      ctx2d.fillStyle = '#f2f1e8';
      ctx2d.fillRect(Math.round(w * 0.492), Math.round(h * 0.49), Math.max(4, Math.round(w * 0.016)), Math.max(4, Math.round(w * 0.016)));
      ctx2d.restore();
      if (screenTex) screenTex.needsUpdate = true;
      state.requestRender?.();
    };
    const stopHandOfGod = (options = {}) => {
      const state = stateRef.current;
      state.handOfGodBootToken += 1;
      if (state.handOfGodRaf) cancelAnimationFrame(state.handOfGodRaf);
      state.handOfGodRaf = 0;
      state.handOfGodActive = false;
      state.forceMediaContain = false;
      if (state.currentMedia === state.handOfGodCanvas) state.currentMedia = null;
      state.handOfGodCanvas = null;
      document.querySelector('.landing-v1-shell')?.classList.remove('is-hand-of-god-playing');
      const frame = handOfGodFrameRef.current;
      if (frame && options.unload !== false) {
        frame.removeAttribute('src');
      }
      if (!options.keepReelMode) {
        state.visualReelMode = false;
        state.channelMediaActive = false;
      }
      setHandOfGodStatus('idle');
      return true;
    };
    const startHandOfGod = () => {
      const state = stateRef.current;
      if (state.reelStopPromise) return false;
      if (state.handOfGodActive && state.handOfGodCanvas) return true;
      const frame = handOfGodFrameRef.current;
      if (!frame) return false;

      stopVideoLoop();
      try { state.currentVideo?.pause?.(); } catch (_) {}
      state.currentVideo = null;
      state.currentImage = null;
      state.currentMedia = null;
      state.currentSource = null;
      state.currentFit = 'contain';
      state.currentMatteAspect = null;
      state.currentPunchIn = 1;
      state.forceMediaContain = true;
      state.handOfGodActive = true;
      state.channelMediaActive = true;
      state.visualReelMode = true;
      state.pageMode = false;
      state.channelChrome = false;
      const shell = document.querySelector('.landing-v1-shell');
      shell?.classList.add('is-reel-playing', 'is-hand-of-god-playing');
      setHandOfGodStatus('loading');
      drawHandOfGodBoot();
      // Hand of God owns the CRT picture. Keep the reel score silent until the
      // visitor explicitly tunes to Film Reel.
      Promise.resolve(window.__resumeStrudelAudioEngine?.setEnabled?.(false)).catch(() => false);

      const token = ++state.handOfGodBootToken;
      const mountRuntimeCanvas = () => {
        if (!state.handOfGodActive || token !== state.handOfGodBootToken) return;
        let runtimeCanvas = null;
        try {
          const doc = frame.contentDocument;
          runtimeCanvas = doc?.querySelector('#hybridCanvas')
            || doc?.querySelector('#artCanvas');
        } catch (_) {
          runtimeCanvas = null;
        }
        if (!runtimeCanvas || !runtimeCanvas.width || !runtimeCanvas.height) {
          state.handOfGodRaf = requestAnimationFrame(mountRuntimeCanvas);
          return;
        }
        state.handOfGodCanvas = runtimeCanvas;
        state.currentMedia = runtimeCanvas;
        setHandOfGodStatus('playing');
        const pump = () => {
          if (!state.handOfGodActive || token !== state.handOfGodBootToken) return;
          if (runtimeCanvas.width && runtimeCanvas.height) drawSourceToCanvas(runtimeCanvas);
          state.handOfGodRaf = requestAnimationFrame(pump);
        };
        pump();
      };

      frame.onload = () => {
        if (token !== state.handOfGodBootToken) return;
        mountRuntimeCanvas();
      };
      const runtimeUrl = new URL('media/interactive/hand-of-god.html', window.location.href).href;
      if (frame.src !== runtimeUrl) {
        frame.src = runtimeUrl;
      } else {
        mountRuntimeCanvas();
      }
      return true;
    };
    const startReel = () => {
      const state = stateRef.current;
      if (state.reelStopPromise) return false;
      if (state.handOfGodActive) stopHandOfGod({ unload: false, keepReelMode: true });
      document.querySelector('.landing-v1-shell')?.classList.add('is-reel-playing');
      state.channelMediaActive = true;
      state.visualReelMode = true;
      state.pageMode = false;
      state.channelChrome = false;
      setScreenCanvasSize('media');
      setScreenTextureSampling('media');
      if (state.ctx2d && state.screenCanvas) {
        state.ctx2d.save();
        state.ctx2d.globalAlpha = 1;
        state.ctx2d.globalCompositeOperation = 'copy';
        state.ctx2d.fillStyle = '#000';
        state.ctx2d.fillRect(0, 0, state.screenCanvas.width, state.screenCanvas.height);
        state.ctx2d.restore();
        if (state.screenTex) state.screenTex.needsUpdate = true;
        state.requestRender?.();
      }
      const audioEngine = getResumeStrudelAudioEngine();
      Promise.resolve(audioEngine?.setEnabled?.(true)).catch(() => false);
      cutRef.current?.('init');
      return true;
    };
    const stopReel = (options = {}) => {
      const state = stateRef.current;
      if (state.reelStopPromise) return state.reelStopPromise;
      const stopPromise = (async () => {
        // Both click and reverse-scroll use the same physical shutdown. Keep
        // reel mode active while the picture rolls and the disk ejects so
        // scroll progress cannot fight the authored eject animation.
        const roll = options.roll !== false && state.currentMedia
          ? animateMacBloomBurst('powerOn')
          : Promise.resolve();
        const eject = options.eject !== false
          ? animateFloppy(false)
          : Promise.resolve();
        stopHandOfGod({ unload: true, keepReelMode: true });
        // Neither the reel nor the page may remain trapped if a browser drops
        // an animation frame while video/audio work is starting. Both authored
        // animations normally finish inside 520ms; the timeout is a hard state
        // transition guarantee, then we snap the disk to the same end pose.
        await Promise.race([
          Promise.all([roll, eject]),
          new Promise((resolve) => window.setTimeout(resolve, 720)),
        ]);
        setFloppyInsertedInstant(false);
        document.querySelector('.landing-v1-shell')?.classList.remove('is-reel-playing');
        state.channelMediaActive = false;
        state.visualReelMode = false;
        state.pageMode = false;
        state.channelChrome = false;
        stopVideoLoop();
        try { state.currentVideo?.pause?.(); } catch (_) {}
        state.currentVideo = null;
        state.currentMedia = null;
        state.currentImage = null;
        // Never instantiate/load the music engine merely to stop an idle page.
        try { await window.__resumeStrudelAudioEngine?.setEnabled?.(false); } catch (_) {}
        drawMacOffScreen();
        return true;
      })();
      state.reelStopPromise = stopPromise.finally(() => {
        stateRef.current.reelStopPromise = null;
      });
      return state.reelStopPromise;
    };
    const enableReelAudio = () => {
      const video = stateRef.current.currentVideo;
      if (!video) return false;
      video.muted = false;
      video.defaultMuted = false;
      video.volume = 1;
      try {
        const playPromise = video.play?.();
        if (playPromise?.then) {
          playPromise.then(() => {
            if (wrapRef.current) wrapRef.current.dataset.clipAudio = 'live';
          }).catch(() => {
            if (wrapRef.current) wrapRef.current.dataset.clipAudio = 'blocked';
          });
        }
      } catch (_) {
        if (wrapRef.current) wrapRef.current.dataset.clipAudio = 'blocked';
      }
      return true;
    };
    window.__tvHeroStartReel = startReel;
    window.__tvHeroStopReel = stopReel;
    window.__tvHeroEnableReelAudio = enableReelAudio;
    window.__tvHeroStartHandOfGod = startHandOfGod;
    window.__tvHeroStopHandOfGod = stopHandOfGod;
    return () => {
      stopHandOfGod({ unload: true });
      if (window.__tvHeroStartReel === startReel) delete window.__tvHeroStartReel;
      if (window.__tvHeroStopReel === stopReel) delete window.__tvHeroStopReel;
      if (window.__tvHeroEnableReelAudio === enableReelAudio) delete window.__tvHeroEnableReelAudio;
      if (window.__tvHeroStartHandOfGod === startHandOfGod) delete window.__tvHeroStartHandOfGod;
      if (window.__tvHeroStopHandOfGod === stopHandOfGod) delete window.__tvHeroStopHandOfGod;
    };
  }, [animateFloppy, animateMacBloomBurst, drawMacOffScreen, drawSourceToCanvas, setFloppyInsertedInstant, setScreenCanvasSize, setScreenTextureSampling, stopVideoLoop]);

  // Init Three.js scene (lazy-loaded)
  React.useEffect(() => {
    let cancelled = false;
    let onResize;
    let revealTimer = 0;
    let pixelRatioTimer = 0;
    let warmupTimer = 0;
    let releaseRendererForNavigation;
    (async () => {
      const threeLoader = window.__loadThreeBundle || (() => window.__threePromise);
      const { THREE, GLTFLoader } = await threeLoader();
      if (cancelled) return;
      const wrap = wrapRef.current;
      const canvas = canvasRef.current;
      if (!wrap || !canvas) return;
      wrap.dataset.threeRevision = String(THREE.REVISION || 'unknown');
      wrap.dataset.threeRenderer = 'webgl';
      wrap.dataset.htmlTextureClass = typeof THREE.HTMLTexture === 'function'
        ? 'available'
        : 'missing';

      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        // This hero renders on demand. Preserve the last complete framebuffer
        // so reloads, screenshots, and rapid keyboard input never expose a
        // cleared/partially redrawn WebGL canvas between frames.
        preserveDrawingBuffer: true,
      });
      // Keep the Mac shell and terminal crisp. The expensive part was the
      // dynamic screen texture mipmap rebuild, not this on-demand render DPR.
      const finalPixelRatio = Math.min(2, window.devicePixelRatio || 1);
      // A fast first frame matters more than rendering invisible UHD pixels
      // during boot. Sharpen to the final DPR once the machine is on screen.
      renderer.setPixelRatio(Math.min(1.25, finalPixelRatio));
      // Use the canvas's CSS dimensions (which include the negative-top
      // overflow). Renderer setSize is called inside the tick loop too,
      // so the seed value here doesn't matter much.
      renderer.setSize(canvas.clientWidth || 800, canvas.clientHeight || 400, false);
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = MAC_MODEL_GRAYSCALE_PREVIEW ? 0.54 : 0.50;
      let rendererReleased = false;
      releaseRendererForNavigation = (event) => {
        if (event?.type === 'pagehide' && event.persisted) return;
        cancelled = true;
        window.clearTimeout(revealTimer);
        window.clearTimeout(pixelRatioTimer);
        window.clearTimeout(warmupTimer);
        if (rendererReleased) return;
        rendererReleased = true;
        try { renderer.dispose(); } catch {}
      };
      window.addEventListener('pagehide', releaseRendererForNavigation);
      window.addEventListener('beforeunload', releaseRendererForNavigation);

      const scene = new THREE.Scene();
      scene.background = null;

      // A 14.6-degree vertical field of view is approximately a 100mm lens on
      // an Alexa LF-height sensor. 100mm was part of the documented
      // StageCraft lens grammar; the compressed perspective makes the
      // truthful 20-foot wall imposing without inflating the geometry.
      const HERO_FOV = 14.6;
      const camera = new THREE.PerspectiveCamera(HERO_FOV, (canvas.clientWidth || 800) / (canvas.clientHeight || 800), 0.01, 100);
      camera.position.set(0.45, 0.52, 2.5);
      camera.lookAt(0, 0.42, -0.13);
      const frameModel = (box) => {
        // The dolly narrows the FOV for the docked (near-orthographic) view, so
        // restore the hero lens before reframing or the rest framing drifts.
        camera.fov = HERO_FOV;
        const sphere = box.getBoundingSphere(new THREE.Sphere());
        const isMobileFrame = window.matchMedia('(max-width: 760px)').matches;
        const heroVariant = document.documentElement?.dataset?.resumeVariant;
        const isLandingFrame = heroVariant === 'landing-v1' || heroVariant === 'landing-v2';
        const target = sphere.center.clone();
        target.y += sphere.radius * (isMobileFrame ? 0.06 : 0);
        if (isMobileFrame) target.x -= sphere.radius * 0.46;
        else if (isLandingFrame && stateRef.current.caseBox) {
          const caseCenter = stateRef.current.caseBox.getCenter(new THREE.Vector3());
          const screenCenter = stateRef.current.screenBox?.getCenter?.(new THREE.Vector3());
          const caseHeight = stateRef.current.caseBox.getSize(new THREE.Vector3()).y;
          target.x = caseCenter.x;
          // Compose the opening below the CRT centerline. The Macintosh rises
          // in frame and the lower half gains enough room for the keyboard.
          if (screenCenter) target.y = screenCenter.y - caseHeight * 0.08;
        }
        const verticalFov = THREE.MathUtils.degToRad(camera.fov);
        const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * camera.aspect);
        const fitHeightDistance = sphere.radius / Math.sin(verticalFov / 2);
        const fitWidthDistance = sphere.radius / Math.sin(horizontalFov / 2);
        // Pull the camera closer so the Mac fills more of the canvas. The
        // landing factor (0.562) renders the whole model (Mac + keyboard +
        // mouse) ~15% larger than the base landing fit (0.646 / 1.15).
        const distance = Math.max(fitHeightDistance, fitWidthDistance) * (
          isMobileFrame ? 1.18 : isLandingFrame ? 0.41 : 0.89
        );
        const viewDirection = new THREE.Vector3(
          isMobileFrame ? 0.08 : isLandingFrame ? 0 : 0.32,
          // Begin just below the CRT centerline. A two-degree rise reads as a
          // deliberate low hero and keeps the LED floor from dominating.
          isMobileFrame ? 0.12 : isLandingFrame ? -0.035 : 0.14,
          1,
        ).normalize();
        camera.position.copy(target).add(viewDirection.multiplyScalar(distance));
        camera.near = Math.max(0.01, distance - sphere.radius * 3.0);
        camera.far = distance + sphere.radius * 4.0;
        camera.lookAt(target);
        camera.updateProjectionMatrix();
        stateRef.current.channelCameraTarget = target.clone();
        // Cache the hero framing so the scroll dolly can lerp from it.
        stateRef.current.heroCam = { pos: camera.position.clone(), target: target.clone() };
        stateRef.current.fitMarkerCyc?.();
        const zp = stateRef.current.zoomProgress || 0;
        if (zp > 0) stateRef.current.applyZoom?.(zp);
        const channelCameraId = stateRef.current.channelCameraId;
        if (channelCameraId && stateRef.current.applyChannelCamera) {
          // Resolve the authored shot in this same frame. Deferring it by one
          // RAF allowed fitMarkerCyc() to render the generic frameModel pose
          // first, producing a visible close-shot-to-close-shot pop on load
          // and responsive reflow.
          stateRef.current.applyChannelCamera(channelCameraId, {
            instant: true,
            source: 'frame-model-reflow',
          });
        }
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
        stateRef.current.channelCameraTarget = tgt.clone();
        // Sticky paper must never become translucent. Keep it fully opaque
        // while visible, then make one clean editorial cut before CRT dock.
        const notesVisible = p < 0.72;
        for (const note of stateRef.current.stickyNotes || []) {
          if (!note?.material) continue;
          note.material.opacity = 1;
          note.visible = notesVisible;
        }
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
      // The scroll controller can mount before this async Three.js setup has
      // installed its controls. Ask it to replay the current scroll position
      // now that zoom commands are guaranteed to land.
      window.dispatchEvent(new Event('tvhero:controlsready'));

      // Companion channel camera grammar. The public phone numbering starts at
      // Help = 01, while the internal channel array also contains System at 0;
      // bind shots to stable IDs so those two indexes can never drift.
      const channelCameraShotFor = (channelId = 'boot') => {
        const id = String(channelId || 'boot');
        if (id.startsWith('camera:')) {
          const preset = id.slice('camera:'.length);
          const presetShots = {
            wide: 'volume-wide',
            hero: 'hero',
            typing: 'typing-close',
            design: 'design-reveal',
            resist: 'button-resist',
            buttons: 'keyboard-insert',
            floor: 'floor-low',
            left: 'orbit-left',
            right: 'orbit-right',
            crane: 'crane-high',
          };
          return presetShots[preset] || 'hero';
        }
        if (id === 'blackbird') return 'profile-minus-30';
        if (id === 'louisvuitton') return 'profile-plus-30';
        if (id === 'handofgod') return 'full-display';
        // The reel's live Strudel score needs the same authored wall aperture
        // as the bull/design program: enough LED-volume real estate for crisp
        // source while the Macintosh remains the foreground hero.
        if (id === 'filmreel') return 'design-reveal';
        if (id === 'boot') return 'opening-hero';
        // Help is intentionally left on the established view until its custom
        // treatment is designed.
        return 'current';
      };
      const channelCameraPoseFor = (channelId = 'boot') => {
        const hero = stateRef.current.heroCam;
        if (!hero) return null;
        const shot = channelCameraShotFor(channelId);
        const caseBox = stateRef.current.caseBox || stateRef.current.screenBox;
        const screenBox = stateRef.current.screenBox || caseBox;
        const modelBox = stateRef.current.bbox?.box || caseBox;
        if (!caseBox || !screenBox || !modelBox) return null;
        const caseCenter = caseBox.getCenter(new THREE.Vector3());
        const screenCenter = screenBox.getCenter(new THREE.Vector3());
        const modelSphere = modelBox.getBoundingSphere(new THREE.Sphere());
        // Every close camera targets the CRT. The authored poses sit slightly
        // below that target so the volume rises behind the Macintosh instead
        // of reading as a floor-heavy top-down view.
        const subjectTarget = new THREE.Vector3(
          caseCenter.x,
          screenCenter.y,
          modelSphere.center.z,
        );
        const caseHeight = caseBox
          ? caseBox.getSize(new THREE.Vector3()).y
          : 1;
        const distanceForFill = (fov, fill) => {
          const verticalFov = THREE.MathUtils.degToRad(fov);
          const horizontalFov = 2 * Math.atan(
            Math.tan(verticalFov * 0.5) * Math.max(0.0001, camera.aspect),
          );
          const limitingFov = Math.min(verticalFov, horizontalFov);
          return modelSphere.radius / Math.max(
            0.0001,
            Math.sin(limitingFov * 0.5 * fill),
          );
        };
        const subjectPose = ({
          shot: poseShot,
          fov,
          fill,
          azimuthDeg = 0,
          elevationDeg = 0,
          outsideMouth = false,
          noteOpacity = 1,
          distanceScale = 1,
        }) => {
          const azimuth = THREE.MathUtils.degToRad(azimuthDeg);
          const elevation = THREE.MathUtils.degToRad(elevationDeg);
          const direction = new THREE.Vector3(
            Math.sin(azimuth) * Math.cos(elevation),
            Math.sin(elevation),
            Math.cos(azimuth) * Math.cos(elevation),
          ).normalize();
          // The model bounding sphere is intentionally conservative because it
          // includes the Macintosh's deep keyboard/case diagonal. Compose from
          // that collision-safe distance, then apply a shot-specific dolly so
          // the visible cabinet—not its invisible sphere—owns the frame.
          let poseDistance = distanceForFill(fov, fill) * distanceScale;
          if (outsideMouth) {
            const volume = stateRef.current.markerCyc?.userData;
            const volumeRadius = Math.max(
              0.0001,
              Number(volume?.effectiveRadius) || poseDistance * 2,
            );
            const mouthZ = Number(volume?.mouthZ);
            if (Number.isFinite(mouthZ) && direction.z > 0.0001) {
              poseDistance = Math.max(
                poseDistance,
                (
                  mouthZ
                  + volumeRadius * 0.018
                  - subjectTarget.z
                ) / direction.z,
              );
            }
          }
          return {
            shot: poseShot,
            pos: subjectTarget.clone().add(direction.multiplyScalar(poseDistance)),
            target: subjectTarget.clone(),
            fov,
            noteOpacity,
          };
        };
        if (shot === 'volume-wide') {
          return subjectPose({
            shot,
            fov: 24,
            fill: 0.56,
            azimuthDeg: -7,
            elevationDeg: -1.5,
            distanceScale: 0.42,
          });
        }
        if (shot === 'hero') {
          return subjectPose({
            shot,
            fov: HERO_FOV,
            fill: 0.76,
            elevationDeg: -2,
            distanceScale: 0.39,
          });
        }
        if (shot === 'opening-hero') {
          // This is both the waiting/QR composition and the LED-volume boot
          // composition. Use the proven volume-wide geometry at a dead-on
          // azimuth: the Mac still owns the centre, while enough physical wall
          // remains in frame to read each cabinet waking up before Return.
          return subjectPose({
            shot,
            fov: 24,
            fill: 0.56,
            azimuthDeg: 0,
            elevationDeg: -1.5,
            noteOpacity: 1,
            distanceScale: 0.42,
          });
        }
        if (shot === 'design-reveal') {
          // Match the authored waiting-frame composition after Return: close
          // enough to keep the Macintosh present, wide enough for the bull and
          // drafting system to read as the program's output across the volume.
          return subjectPose({
            shot,
            fov: 24,
            fill: 0.56,
            azimuthDeg: 0,
            elevationDeg: -1.5,
            noteOpacity: 1,
            distanceScale: 0.42,
          });
        }
        if (shot === 'button-resist') {
          // The warning beat recoils a fraction from the established medium
          // composition before temptation wins. Keep the move small enough to
          // feel psychological rather than like a new coverage angle.
          return subjectPose({
            shot,
            fov: 25.5,
            fill: 0.52,
            azimuthDeg: 0,
            elevationDeg: -1.2,
            noteOpacity: 1,
            distanceScale: 0.45,
          });
        }
        if (shot === 'keyboard-insert') {
          // A deliberate product insert on the actual key bed. The slight
          // elevation is motivated here: it exposes key travel without
          // turning the wider Macintosh coverage into a top-down shot.
          const uniqueKeyMeshes = [...new Set(
            Object.values(stateRef.current.keys || {})
              .map((key) => key?.mesh)
              .filter(Boolean),
          )];
          const keyboardBox = new THREE.Box3();
          uniqueKeyMeshes.forEach((mesh) => {
            mesh.updateMatrixWorld?.(true);
            keyboardBox.expandByObject(mesh);
          });
          if (!keyboardBox.isEmpty()) {
            // Frame the interaction, not just the keycaps: union the physical
            // keyboard and CRT glass, then bias the target toward the keys.
            // The resulting two-shot keeps every typed character readable
            // while preserving a thin LED-wall perimeter for error flashes.
            const keyboardCenter = keyboardBox.getCenter(new THREE.Vector3());
            const crtCenter = screenBox.getCenter(new THREE.Vector3());
            const interactionBox = keyboardBox.clone().union(screenBox);
            const sphere = interactionBox.getBoundingSphere(new THREE.Sphere());
            const target = crtCenter.clone().lerp(keyboardCenter, 0.56);
            const fov = 16.5;
            const verticalFov = THREE.MathUtils.degToRad(fov);
            const horizontalFov = 2 * Math.atan(
              Math.tan(verticalFov * 0.5) * Math.max(0.0001, camera.aspect),
            );
            const limitingFov = Math.min(verticalFov, horizontalFov);
            const distance = sphere.radius
              / Math.max(0.0001, Math.sin(limitingFov * 0.5 * 0.92));
            const direction = new THREE.Vector3(0, 0.055, 1).normalize();
            return {
              shot,
              pos: target.clone().add(direction.multiplyScalar(distance * 0.58)),
              target,
              fov,
              noteOpacity: 0.42,
            };
          }
          return channelCameraPoseFor('camera:typing');
        }
        if (shot === 'typing-close') {
          // A close terminal/keyboard two-shot, not a screen-only insert. Aim
          // below the CRT centre so the active key row stays in frame while the
          // command remains large enough to read.
          const target = subjectTarget.clone();
          target.y -= caseHeight * 0.16;
          const fov = 16;
          const verticalFov = THREE.MathUtils.degToRad(fov);
          const horizontalFov = 2 * Math.atan(
            Math.tan(verticalFov * 0.5) * Math.max(0.0001, camera.aspect),
          );
          const limitingFov = Math.min(verticalFov, horizontalFov);
          const distance = (
            modelSphere.radius
            / Math.max(0.0001, Math.sin(limitingFov * 0.5 * 0.9))
          ) * 0.36;
          return {
            shot,
            pos: target.clone().add(CRT_DIR.clone().multiplyScalar(distance)),
            target,
            fov,
            noteOpacity: 0.72,
          };
        }
        if (shot === 'floor-low') {
          return subjectPose({
            shot,
            fov: 20.5,
            fill: 0.78,
            azimuthDeg: -4,
            elevationDeg: -3.2,
            distanceScale: 0.42,
          });
        }
        if (shot === 'orbit-left' || shot === 'orbit-right') {
          return subjectPose({
            shot,
            fov: 18,
            fill: 0.74,
            azimuthDeg: shot === 'orbit-left' ? -28 : 28,
            elevationDeg: -2,
            distanceScale: 0.46,
          });
        }
        if (shot === 'crane-high') {
          const volume = stateRef.current.markerCyc?.userData;
          const volumeRadius = Math.max(
            0.0001,
            Number(volume?.effectiveRadius) || modelSphere.radius * 8,
          );
          const floorY = Number(stateRef.current.markerCyc?.position?.y) || 0;
          const wallHeight = Math.max(
            0.0001,
            Number(volume?.effectiveWallHeight) || caseHeight * 2,
          );
          const centerX = Number(volume?.stageCenterX) || subjectTarget.x;
          const mouthZ = Number(volume?.mouthZ) || subjectTarget.z + volumeRadius * 0.35;
          // The sole deliberately distant shot. It remains available on the
          // companion deck, but no longer interrupts the close intro build-up.
          const craneTarget = subjectTarget.clone();
          return {
            shot,
            pos: new THREE.Vector3(
              centerX - volumeRadius * 0.58,
              floorY + wallHeight * 1.08,
              mouthZ + volumeRadius * 2.7,
            ),
            target: craneTarget,
            fov: 9,
            noteOpacity: 1,
          };
        }
        if (shot === 'profile-plus-30' || shot === 'profile-minus-30') {
          return subjectPose({
            shot,
            fov: HERO_FOV,
            fill: 0.7,
            azimuthDeg: shot === 'profile-minus-30' ? -30 : 30,
            elevationDeg: -1.5,
            distanceScale: 0.46,
          });
        }
        if (shot === 'full-display') {
          const screenCenter = screenBox.getCenter(new THREE.Vector3());
          const caseCenter = caseBox.getCenter(new THREE.Vector3());
          const target = new THREE.Vector3(caseCenter.x, screenCenter.y, screenCenter.z);
          const fov = 15;
          const verticalFov = THREE.MathUtils.degToRad(fov);
          const distance = frameHalfWidth()
            / (Math.tan(verticalFov / 2) * Math.max(0.0001, camera.aspect));
          return {
            shot,
            pos: target.clone().add(CRT_DIR.clone().multiplyScalar(distance)),
            target,
            fov,
            noteOpacity: 0,
          };
        }
        return subjectPose({
          shot: shot === 'current' ? 'hero' : shot,
          fov: HERO_FOV,
          fill: 0.76,
          elevationDeg: -2,
          distanceScale: 0.39,
        });
      };
      const applyChannelCamera = (channelId = 'boot', options = {}) => {
        const pose = channelCameraPoseFor(channelId);
        if (!pose) return false;
        const state = stateRef.current;
        cancelAnimationFrame(state.channelCameraRaf);
        state.channelCameraRaf = 0;
        state.channelCameraId = String(channelId || 'boot');
        if (wrapRef.current) {
          wrapRef.current.dataset.channelCamera = pose.shot;
          wrapRef.current.dataset.channelCameraChannel = state.channelCameraId;
          wrapRef.current.dataset.channelCameraSource = String(options.source || 'manual');
          wrapRef.current.dataset.channelCameraBeat = String(options.beat || '');
          wrapRef.current.dataset.channelCameraEasing = String(options.easing || 'smooth');
          if (pose.shot === 'floor-low' && state.tabletop) {
            const tableY = Number(state.tabletop.position?.y) || 0;
            const cameraClearance = pose.pos.y - tableY;
            const targetClearance = pose.target.y - tableY;
            wrapRef.current.dataset.floorCameraTableClearance = cameraClearance.toFixed(3);
            wrapRef.current.dataset.floorCameraDeskClear = String(
              cameraClearance > 0 && targetClearance > 0,
            );
          }
        }
        const fromPos = camera.position.clone();
        const fromTarget = (state.channelCameraTarget || state.heroCam?.target || pose.target).clone();
        const fromFov = camera.fov;
        const notes = state.stickyNotes || [];
        const fromNotesVisible = notes.some((note) => note?.visible !== false);
        const targetNotesVisible = pose.noteOpacity > 0.01;
        const startedAt = performance.now();
        const requestedDuration = Number(options.duration);
        const duration = options.instant
          ? 0
          : Number.isFinite(requestedDuration)
            ? Math.max(240, Math.min(5000, requestedDuration))
            : 760;
        const easing = String(options.easing || 'smooth');
        const tickCamera = (now) => {
          const raw = duration <= 0 ? 1 : Math.min(1, (now - startedAt) / duration);
          const p = easing === 'snap'
            // A hard launch with a readable deceleration—fast enough to feel
            // tied to the glitch attack without becoming a discontinuous cut.
            ? 1 - Math.pow(1 - raw, 5)
            : easing === 'cinematic'
              // Symmetrical cosine easing gives the resolve room to breathe.
              ? 0.5 - Math.cos(Math.PI * raw) * 0.5
              : raw < 0.5
                ? 4 * raw * raw * raw
                : 1 - Math.pow(-2 * raw + 2, 3) / 2;
          camera.position.lerpVectors(fromPos, pose.pos, p);
          const target = fromTarget.clone().lerp(pose.target, p);
          camera.fov = THREE.MathUtils.lerp(fromFov, pose.fov, p);
          const distance = camera.position.distanceTo(target);
          camera.near = Math.max(0.01, distance * 0.16);
          const volume = state.markerCyc?.userData;
          const volumeFarDistance = Number.isFinite(Number(volume?.backZ))
            ? camera.position.distanceTo(new THREE.Vector3(
              Number(volume?.stageCenterX) || target.x,
              state.markerCyc.position.y + (Number(volume?.effectiveWallHeight) || 0),
              Number(volume.backZ),
            )) * 1.22
            : 0;
          camera.far = Math.max(distance * 2.8 + 5, volumeFarDistance);
          camera.lookAt(target);
          camera.updateProjectionMatrix();
          state.channelCameraTarget = target;
          state.updateVolumeSightline?.();
          const notesVisible = p < 0.5 ? fromNotesVisible : targetNotesVisible;
          for (const note of notes) {
            if (!note?.material) continue;
            note.material.opacity = 1;
            note.visible = notesVisible;
          }
          if (wrapRef.current) {
            wrapRef.current.dataset.channelCameraProgress = p.toFixed(3);
            const sensorHeightMm = 25.54;
            const focalLengthMm = sensorHeightMm
              / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) * 0.5));
            const volumeFloorY = Number(state.markerCyc?.position?.y);
            const volumeHeight = Number(state.markerCyc?.userData?.effectiveWallHeight);
            wrapRef.current.dataset.cameraFov = camera.fov.toFixed(2);
            wrapRef.current.dataset.cameraFocalLengthMm = focalLengthMm.toFixed(1);
            wrapRef.current.dataset.cameraPosition = [
              camera.position.x,
              camera.position.y,
              camera.position.z,
            ].map((value) => value.toFixed(3)).join(',');
            wrapRef.current.dataset.cameraTarget = [
              target.x,
              target.y,
              target.z,
            ].map((value) => value.toFixed(3)).join(',');
            const horizontalTargetDistance = Math.hypot(
              target.x - camera.position.x,
              target.z - camera.position.z,
            );
            wrapRef.current.dataset.cameraPitchDeg = THREE.MathUtils.radToDeg(
              Math.atan2(
                target.y - camera.position.y,
                Math.max(0.0001, horizontalTargetDistance),
              ),
            ).toFixed(2);
            wrapRef.current.dataset.cameraAzimuthDeg = THREE.MathUtils.radToDeg(
              Math.atan2(
                camera.position.x - target.x,
                camera.position.z - target.z,
              ),
            ).toFixed(2);
            if (Number.isFinite(volumeFloorY)
              && Number.isFinite(volumeHeight)
              && volumeHeight > 0) {
              wrapRef.current.dataset.cameraEyeHeightM = (
                (camera.position.y - volumeFloorY)
                * (6 / volumeHeight)
              ).toFixed(2);
              wrapRef.current.dataset.cameraTargetDistanceM = (
                camera.position.distanceTo(target)
                * (6 / volumeHeight)
              ).toFixed(2);
            }
            if (raw >= 1) {
              camera.updateMatrixWorld(true);
              const viewportWidth = Math.max(1, canvas.clientWidth || window.innerWidth);
              const viewportHeight = Math.max(1, canvas.clientHeight || window.innerHeight);
              const writeProjectedCoverage = (box, prefix) => {
                if (!box || box.isEmpty?.()) return;
                const mn = box.min;
                const mx = box.max;
                const point = new THREE.Vector3();
                let minX = Infinity;
                let minY = Infinity;
                let maxX = -Infinity;
                let maxY = -Infinity;
                for (let index = 0; index < 8; index += 1) {
                  point
                    .set(
                      index & 1 ? mx.x : mn.x,
                      index & 2 ? mx.y : mn.y,
                      index & 4 ? mx.z : mn.z,
                    )
                    .project(camera);
                  minX = Math.min(minX, point.x);
                  minY = Math.min(minY, point.y);
                  maxX = Math.max(maxX, point.x);
                  maxY = Math.max(maxY, point.y);
                }
                const widthPx = Math.max(0, (maxX - minX) * 0.5 * viewportWidth);
                const heightPx = Math.max(0, (maxY - minY) * 0.5 * viewportHeight);
                wrapRef.current.dataset[`${prefix}CoverageWidth`] = (
                  widthPx / viewportWidth
                ).toFixed(3);
                wrapRef.current.dataset[`${prefix}CoverageHeight`] = (
                  heightPx / viewportHeight
                ).toFixed(3);
              };
              writeProjectedCoverage(state.bbox?.box, 'cameraModel');
              writeProjectedCoverage(state.caseBox, 'cameraCase');
            }
          }
          state.requestRender?.();
          if (raw < 1) {
            state.channelCameraRaf = requestAnimationFrame(tickCamera);
          } else {
            state.channelCameraRaf = 0;
          }
        };
        tickCamera(startedAt);
        return true;
      };
      stateRef.current.applyChannelCamera = applyChannelCamera;
      window.__tvHeroChannelCamera = applyChannelCamera;
      window.__tvHeroCompanionCamera = (presetId = 'hero', options = {}) => (
        applyChannelCamera(`camera:${String(presetId || 'hero')}`, options)
      );

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
      // Once docked, the phone is the sole channel controller. The CRT itself
      // stays clean and only displays the selected page, clip, or program.
      const PAGE_W = 960;
      let channels = [];            // [{id,label,type,sel,href}]
      let chRasters = [];           // raster | null per channel
      let activeCh = 0;
      let chWithin = 0;             // vertical pan within a (tall) page channel
      let chBusy = false;           // mid static-cut

      const stopFilmReelTransport = (st = stateRef.current) => {
        st.filmReelChannelActive = false;
        st.strudelWallStartedAt = 0;
        st.filmReelOwnershipToken = (st.filmReelOwnershipToken || 0) + 1;
        st.filmReelStartPending = false;
        // Invalidate video/image loads and requestVideoFrame callbacks already
        // scheduled by the reel before the destination channel took ownership.
        st.cutToken = (st.cutToken || 0) + 1;
        const engine = window.__resumeStrudelAudioEngine;
        if (wrapRef.current) {
          wrapRef.current.dataset.filmReelOwner = 'released';
          wrapRef.current.dataset.filmReelTransport = engine?.enabled ? 'stopping' : 'stopped';
          delete wrapRef.current.dataset.cycStrudelWall;
          delete wrapRef.current.dataset.cycStrudelSection;
          delete wrapRef.current.dataset.cycStrudelLane;
          delete wrapRef.current.dataset.cycStrudelSourceLines;
        }
        // Release the live-code wall in the same ownership transaction as the
        // reel audio. The next channel may immediately paint its own glitch;
        // otherwise the LED volume returns to its neutral blue program feed.
        window.requestAnimationFrame(() => {
          if (!stateRef.current.filmReelChannelActive) {
            stateRef.current.updateCycStage?.({ force: true });
          }
        });
        if (engine?.enabled && typeof engine.setEnabled === 'function') {
          Promise.resolve(engine.setEnabled(false))
            .catch(() => false)
            .finally(() => {
              if (wrapRef.current && !stateRef.current.filmReelChannelActive) {
                wrapRef.current.dataset.filmReelTransport = 'stopped';
              }
            });
        }
      };

      const rememberCurrentVideoChannel = (channelIndex = activeCh) => {
        const st = stateRef.current;
        const channel = channels[channelIndex];
        const video = st.currentVideo;
        if (channel?.type !== 'video'
          || !video
          || typeof video.currentTime !== 'number'
          || video === st.companionClip) return;
        st.videoChannelBookmark = {
          video,
          time: Number.isFinite(video.currentTime) ? video.currentTime : 0,
        };
        try { video.pause?.(); } catch (_) {}
      };

      const setChannelDefs = (defs, options = {}) => {
        if (!Array.isArray(defs) || !defs.length) return false;
        const requestedActive = Number(options.active);
        let cameraChanged = false;
        if (Number.isFinite(requestedActive)) {
          const nextActive = Math.max(0, Math.min(defs.length - 1, requestedActive));
          if (nextActive !== activeCh) {
            cameraChanged = true;
            const st = stateRef.current;
            const outgoingChannel = channels[activeCh];
            const incomingChannel = defs[nextActive];
            const outgoingVideo = st.currentVideo;
            if (incomingChannel?.type === 'video') {
              st.filmReelChannelActive = true;
            } else {
              stopFilmReelTransport(st);
            }
            if ((incomingChannel?.type === 'video' || incomingChannel?.type === 'clip')
              && outgoingVideo
              && typeof outgoingVideo.currentTime === 'number') {
              st.channelVideoTransition = {
                serial: (st.channelVideoTransitionSerial || 0) + 1,
                from: outgoingVideo,
                fromChannel: outgoingChannel?.id || '',
                toChannel: incomingChannel?.id || '',
                running: false,
              };
              st.channelVideoTransitionSerial += 1;
            } else {
              st.channelVideoTransition = null;
              window.dispatchEvent(new CustomEvent('resume-crt-channel-glitch', {
                detail: {
                  serial: (st.channelVideoTransitionSerial || 0) + 1,
                  from: outgoingChannel?.id || '',
                  to: incomingChannel?.id || '',
                  durationMs: 300,
                  audioDurationMs: 280,
                },
              }));
              st.channelVideoTransitionSerial += 1;
            }
            rememberCurrentVideoChannel(activeCh);
          }
          activeCh = nextActive;
        }
        channels = defs;
        if (cameraChanged) {
          stateRef.current.applyChannelCamera?.(channels[activeCh]?.id || 'boot');
        }
        return true;
      };
      window.__tvHeroSetChannelDefs = setChannelDefs;

      stateRef.current.menuRects = null;

      const channelWithinRange = (i) => {
        const sc = stateRef.current.screenCanvas, r = chRasters[i];
        if (!sc || !r || channels[i]?.type !== 'page') return 0;
        const s = sc.width / r.cssWidth;                  // css → canvas
        const availCss = sc.height / s;
        return Math.max(0, r.cssHeight - availCss);
      };

      const drawPageChannel = (i) => {
        const st = stateRef.current, sc = st.screenCanvas, cx = st.ctx2d, tex = st.screenTex;
        if (!sc || !cx) return;
        const W = sc.width, H = sc.height;
        cx.fillStyle = '#ffffff'; cx.fillRect(0, 0, W, H);
        const r = chRasters[i];
        if (r) {
          const s = W / r.cssWidth;                       // css → canvas
          const availH = H;
          const pan = Math.min(channelWithinRange(i), Math.max(0, chWithin)) * s;
          cx.drawImage(r.canvas, 0, (pan / s) * r.scale, r.cssWidth * r.scale, (availH / s) * r.scale, 0, 0, W, availH);
        }
        if (tex) tex.needsUpdate = true;
        st.requestRender?.();
      };

      const drawDoomChannel = () => {
        const st = stateRef.current, sc = st.screenCanvas, cx = st.ctx2d, tex = st.screenTex;
        if (!sc || !cx) return;
        const W = sc.width, H = sc.height;
        drawMacUiSurface(cx, W, H, {
          accent: MAC_UI.red,
          label: 'DOOM / 06',
          status: 'ARMED',
        });
        cx.textAlign = 'left';
        cx.fillStyle = MAC_UI.ink;
        cx.font = `600 ${Math.round(H * 0.14)}px ${MAC_UI_FONT}`;
        cx.fillText('DOOM', Math.round(W * 0.10), Math.round(H * 0.51));
        cx.fillStyle = MAC_UI.muted;
        cx.font = `400 ${Math.round(H * 0.026)}px ${MAC_TERMINAL_FONT}`;
        cx.fillText('press RETURN to boot', Math.round(W * 0.10), Math.round(H * 0.63));
        cx.textAlign = 'left';
        if (tex) tex.needsUpdate = true;
        st.requestRender?.();
      };

      const playClipChannel = (channel, options = {}) => {
        const st = stateRef.current;
        const channelId = String(channel?.id || 'clip');
        const authoredClips = Array.isArray(channel?.clips) && channel.clips.length
          ? channel.clips
          : [{ id: channelId, src: channel?.src, start: channel?.start }];
        const clips = authoredClips
          .map((clip, index) => ({
            id: String(clip?.id || `${channelId}-${index}`),
            src: String(clip?.src || ''),
            start: Math.max(0, Number(clip?.start) || 0),
          }))
          .filter((clip) => clip.src);
        if (!clips.length) return;
        const storedIndex = st.companionClipSequenceIndex?.get(channelId) || 0;
        const requestedIndex = Number.isFinite(Number(options.index))
          ? Number(options.index)
          : storedIndex;
        const clipIndex = ((Math.round(requestedIndex) % clips.length) + clips.length) % clips.length;
        const clip = clips[clipIndex];
        const src = clip.src;
        if (!src) return;
        st.companionClipSequenceIndex?.set(channelId, clipIndex);
        const previousVideo = st.companionClip;
        let video = st.companionClipCache.get(src);
        if (previousVideo && previousVideo !== video) {
          try { previousVideo.pause?.(); } catch (_) {}
        }
        if (!video) {
          video = document.createElement('video');
          video.crossOrigin = 'anonymous';
          video.dataset.companionSrc = src;
          video.dataset.companionStart = String(clip.start);
          video.dataset.companionChannel = channelId;
          video.dataset.companionClipId = clip.id;
          video.dataset.companionClipIndex = String(clipIndex);
          video.src = src;
          video.preload = 'auto';
          video.muted = false;
          video.defaultMuted = false;
          video.volume = 1;
          video.playsInline = true;
          video.setAttribute('playsinline', '');
          video.setAttribute('webkit-playsinline', '');
          const playWithNativeAudio = () => {
            video.muted = false;
            video.defaultMuted = false;
            video.volume = 1;
            const playPromise = video.play();
            if (!playPromise?.catch) return;
            playPromise.then(() => {
              if (wrapRef.current) wrapRef.current.dataset.clipAudio = 'live';
            }).catch(() => {
              // Remote phone input is not a trusted gesture in the desktop
              // browser. Keep the picture live if autoplay is blocked, then
              // __tvHeroEnableReelAudio will unmute it on the next desktop
              // pointer/key gesture.
              video.muted = true;
              if (wrapRef.current) wrapRef.current.dataset.clipAudio = 'awaiting-gesture';
              video.play().catch(() => {});
            });
          };
          const restart = () => {
            const requestedStart = clip.start;
            const safeStart = Number.isFinite(video.duration)
              ? Math.min(requestedStart, Math.max(0, video.duration - 0.05))
              : requestedStart;
            try { video.currentTime = safeStart; } catch (_) {}
            playWithNativeAudio();
          };
          video.addEventListener('loadedmetadata', restart);
          video.addEventListener('ended', () => {
            const currentChannel = channels[activeCh];
            if (st.companionClip !== video
              || currentChannel?.id !== channelId) return;
            if (clips.length <= 1) {
              restart();
              return;
            }
            const nextIndex = (clipIndex + 1) % clips.length;
            const nextClip = clips[nextIndex];
            st.companionClipSequenceIndex?.set(channelId, nextIndex);
            st.channelVideoTransition = {
              serial: (st.channelVideoTransitionSerial || 0) + 1,
              from: video,
              fromChannel: clip.id,
              toChannel: nextClip.id,
              running: false,
            };
            st.channelVideoTransitionSerial += 1;
            playClipChannel(currentChannel, { index: nextIndex });
          });
          st.companionClipCache.set(src, video);
        }
        // renderChannel can run several times during a tune (state, texture,
        // and audio notifications all request a render). Restarting
        // drawVideoLoop for the same clip cancels and rewinds the authored
        // outgoing/incoming glitch on every pass, leaving the destination
        // picture parked while its native audio continues. Only the first
        // ownership pass may start that frame loop.
        const wasActiveClip = st.companionClip === video && st.currentVideo === video;
        st.companionClip = video;
        st.pageMode = false;
        st.channelMediaActive = true;
        st.channelChrome = false;
        st.currentMedia = video;
        st.currentVideo = video;
        const requestedStart = clip.start;
        if (video.readyState >= 1 && video.currentTime < requestedStart - 0.25) {
          try { video.currentTime = requestedStart; } catch (_) {}
        }
        video.muted = false;
        video.defaultMuted = false;
        video.volume = 1;
        const playPromise = video.play();
        if (playPromise?.then) {
          playPromise.then(() => {
            if (wrapRef.current) wrapRef.current.dataset.clipAudio = 'live';
          }).catch(() => {
            video.muted = true;
            if (wrapRef.current) wrapRef.current.dataset.clipAudio = 'awaiting-gesture';
            video.play().catch(() => {});
          });
        }
        if (wrapRef.current) {
          wrapRef.current.dataset.clipSequenceChannel = channelId;
          wrapRef.current.dataset.clipSequenceIndex = String(clipIndex);
          wrapRef.current.dataset.clipSequenceId = clip.id;
          wrapRef.current.dataset.clipSequenceLength = String(clips.length);
        }
        if (!wasActiveClip) drawVideoLoop(video);
      };
      const renderChannel = () => {
        const st = stateRef.current;
        const ch = channels[activeCh];
        if (!ch) return;
        if (ch.type !== 'clip' && st.companionClip) {
          try { st.companionClip.pause(); } catch (_) {}
          if (st.currentMedia === st.companionClip) st.currentMedia = null;
          if (st.currentVideo === st.companionClip) st.currentVideo = null;
        }
        if (ch.type !== 'interactive' && st.handOfGodActive) {
          window.__tvHeroStopHandOfGod?.({ unload: false, keepReelMode: true });
        }
        if (ch.type === 'video') {
          st.filmReelChannelActive = true;
        } else {
          stopFilmReelTransport(st);
        }
        // Screen ownership is assigned from the destination channel after all
        // cleanup above. This keeps cursor/reveal timers from painting over
        // videos while still restoring normal terminal redraws for pages.
        st.channelMediaActive = ch.type === 'video' || ch.type === 'clip' || ch.type === 'interactive';
        if (ch.type === 'boot') {
          st.pageMode = true; st.channelChrome = false;
          st.forceTerminal = true; drawMacOffScreen(); st.forceTerminal = false;
        } else if (ch.type === 'video') {
          st.pageMode = false;        // let the trailer pool draw to the screen
          st.channelChrome = !st.visualReelMode;
          if (wrapRef.current) {
            wrapRef.current.dataset.filmReelOwner = 'active';
            wrapRef.current.dataset.filmReelTransport = 'starting';
          }
          window.__tvHeroLiveStrudelWallPaint?.({
            source: window.__resumeStrudelAudioEngine?.compositionSource || '',
            section: window.__resumeStrudelAudioEngine?.arrangementSection || 'intro',
            lane: '',
            group: '',
            pulse: 0,
          });
          const bookmark = st.videoChannelBookmark;
          if (bookmark?.video) {
            st.currentMedia = bookmark.video;
            st.currentVideo = bookmark.video;
            if (Number.isFinite(bookmark.time)
              && Math.abs(bookmark.video.currentTime - bookmark.time) > 0.15) {
              try { bookmark.video.currentTime = bookmark.time; } catch (_) {}
            }
          }
          const engine = getResumeStrudelAudioEngine();
          // Picture ownership must not wait for Web Audio. A phone command is
          // not a trusted desktop gesture, so audio initialization can remain
          // pending until the next desktop click/key; the muted reel picture
          // must still begin immediately and keep advancing meanwhile.
          if (!st.currentVideo) cutRef.current?.('init');
          else resumeVideoChannel();
          if (st.filmReelStartPending) {
            st.requestRender?.();
            return;
          }
          if (engine?.enabled) {
            if (wrapRef.current) {
              wrapRef.current.dataset.filmReelTransport = 'playing';
            }
            st.requestRender?.();
            return;
          }
          const ownershipToken = (st.filmReelOwnershipToken || 0) + 1;
          st.filmReelOwnershipToken = ownershipToken;
          st.filmReelStartPending = true;
          Promise.resolve(engine?.setEnabled?.(true))
            .catch(() => false)
            .finally(() => {
              if (!st.filmReelChannelActive
                || channels[activeCh]?.type !== 'video') {
                if (engine?.enabled) {
                  Promise.resolve(engine.setEnabled(false))
                    .catch(() => false)
                    .finally(() => {
                      if (wrapRef.current && !st.filmReelChannelActive) {
                        wrapRef.current.dataset.filmReelTransport = 'stopped';
                      }
                    });
                }
                return;
              }
              if (st.filmReelOwnershipToken !== ownershipToken) return;
              st.filmReelStartPending = false;
              if (!engine?.enabled) {
                if (wrapRef.current) {
                  wrapRef.current.dataset.filmReelTransport = 'blocked';
                }
                return;
              }
              if (wrapRef.current) {
                wrapRef.current.dataset.filmReelTransport = 'playing';
              }
            });
        } else if (ch.type === 'clip') {
          playClipChannel(ch);
        } else if (ch.type === 'interactive') {
          st.pageMode = false;
          st.channelChrome = false;
          window.__tvHeroStartHandOfGod?.();
        } else if (ch.type === 'doom') {
          st.pageMode = true; st.channelChrome = false; drawDoomChannel();
        } else {
          st.pageMode = true; st.channelChrome = false; drawPageChannel(activeCh);
        }
        st.requestRender?.();
      };
      stateRef.current.renderChannel = renderChannel;

      const resumeVideoChannel = () => {
        const st = stateRef.current;
        const media = st.currentMedia;
        const video = media && typeof media.play === 'function' && typeof media.currentTime === 'number'
          ? media
          : st.currentVideo;
        if (!video) {
          if (window.__resumeStrudelAudioEngine?.enabled && !st.currentMedia) {
            cutRef.current?.('init');
          }
          return;
        }
        st.pageMode = false;
        st.channelChrome = !st.visualReelMode;
        st.currentVideo = video;
        const advanceReel = () => {
          if (!st.filmReelChannelActive || channels[activeCh]?.type !== 'video') return;
          if (st.currentVideo !== video && st.currentMedia !== video) return;
          st.currentVideo = null;
          if (st.currentMedia === video) st.currentMedia = null;
          cutRef.current?.(st.currentLane || 'idle');
        };
        // Leaving Film Reel invalidates the old cut token. When the bookmarked
        // clip is resumed, give it a fresh owner-level ended handler so a clip
        // that finishes during the channel glitch advances instead of parking
        // on its last frame.
        video.onended = advanceReel;
        const remaining = Number.isFinite(video.duration)
          ? video.duration - (Number(video.currentTime) || 0)
          : Infinity;
        if (video.ended || remaining <= 0.08) {
          advanceReel();
          return;
        }
        try {
          const playPromise = video.play?.();
          if (playPromise?.catch) playPromise.catch(() => {});
        } catch (_) {}
        drawVideoLoop(video);
      };
      window.__tvHeroResumeVideoChannel = resumeVideoChannel;

      const tuneToChannel = (i, withStatic) => {
        i = Math.max(0, Math.min(channels.length - 1, i));
        const changed = i !== activeCh;
        activeCh = i;
        if (changed) {
          chWithin = 0;
          stateRef.current.applyChannelCamera?.(channels[activeCh]?.id || 'boot');
        }
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

      window.__tvHeroPageMode = (on, options = {}) => {
        const st = stateRef.current;
        if (on) {
          if (Array.isArray(options.channels)) setChannelDefs(options.channels, options);
          else if (Number.isFinite(Number(options.active)) && channels.length) {
            activeCh = Math.max(0, Math.min(channels.length - 1, Number(options.active)));
          }
          const sc = st.screenCanvas;
          const activeType = channels[activeCh]?.type;
          if (activeType !== 'video' && activeType !== 'clip' && activeType !== 'interactive' && sc && sc.width !== MAC_SCREEN_TERMINAL_SIZE.width) {
            sc.width = MAC_SCREEN_TERMINAL_SIZE.width;
            sc.height = MAC_SCREEN_TERMINAL_SIZE.height;
          }
          if (st.screenTex && st.three) {
            st.screenTex.minFilter = st.three.LinearFilter;
            st.screenTex.magFilter = st.three.LinearFilter;
            st.screenTex.generateMipmaps = false;
          }
          st.dockMode = true;
          animateStickyNoteHover();
          renderChannel();
        } else {
          st.dockMode = false; st.pageMode = false; st.channelChrome = false; st.channelMediaActive = false;
          animateStickyNoteHover();
        }
        st.requestRender?.();
      };
      window.__tvHeroProjectChannels = async (defs, options = {}) => {
        if (!Array.isArray(defs) || !defs.length) return { ok: false };
        setChannelDefs(defs, options);
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
        if (stateRef.current.pageMode) renderChannel();
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
        clipSequence: {
          channel: wrapRef.current?.dataset.clipSequenceChannel || '',
          index: Number(wrapRef.current?.dataset.clipSequenceIndex || 0),
          id: wrapRef.current?.dataset.clipSequenceId || '',
          length: Number(wrapRef.current?.dataset.clipSequenceLength || 0),
        },
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
        const screenCandidates = allMeshes.filter(
          (m) => /^screen$/i.test(String(m.name || '')) || getMacMeshNumericId(m) === 75,
        );
        let screenMeshes = screenCandidates;
        if (screenCandidates.length > 1) {
          // Blender/glTF name-collision suffixes (Mesh75_2, Mesh75_3…) are
          // coplanar exports of the same CRT face. Applying the live texture to
          // every twin produces z-fighting as soon as the camera moves off-axis.
          // Keep the authored canonical dome only; the other copies contribute
          // no unique silhouette or hit area.
          const canonicalScreen = screenCandidates.find((m) => m.name === 'Mesh75')
            || screenCandidates.find((m) => /^screen$/i.test(String(m.name || '')))
            || screenCandidates.slice().sort(
              (a, b) => b.geometry.attributes.position.count - a.geometry.attributes.position.count,
            )[0];
          screenMeshes = [canonicalScreen];
          for (const candidate of screenCandidates) {
            if (candidate !== canonicalScreen) candidate.visible = false;
          }
        }
        if (!screenMeshes.length && allMeshes.length >= 2) {
          const sorted = allMeshes.slice().sort((a, b) => b.geometry.attributes.position.count - a.geometry.attributes.position.count);
          screenMeshes = [sorted[1]];
        }
        if (wrapRef.current) {
          wrapRef.current.dataset.screenMesh = screenMeshes.map((m) => m.name).join(',');
          wrapRef.current.dataset.hiddenScreenTwins = String(
            Math.max(0, screenCandidates.length - screenMeshes.length),
          );
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
        const screenMaterial = new THREE.MeshBasicMaterial({
          map: screenTex,
          toneMapped: false,
          depthTest: true,
          depthWrite: true,
          polygonOffset: true,
          polygonOffsetFactor: -2,
          polygonOffsetUnits: -4,
        });
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
          m.renderOrder = 4;
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
        // Physical sticky notes are intentionally disabled. Their useful destinations
        // now live as accessible links in the white landing summary.
        const stickyNotes = [];
        stateRef.current.resumeStickyNote = null;
        stateRef.current.linkedinStickyNote = null;
        stateRef.current.signatureStickyNote = null;
        stateRef.current.stickyNotes = stickyNotes;
        wrap.dataset.macStickyNotes = 'disabled';
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
        // Center the complete keyboard assembly beneath the monitor. The source
        // model places it well to camera-left; select the keys, legends, and
        // chassis by their shared keyboard footprint and translate them as one.
        if (stateRef.current.caseBox && !keyFootprint.isEmpty) {
          const caseCenter = stateRef.current.caseBox.getCenter(new THREE.Vector3());
          const keyboardCenterX = (keyFootprint.minX + keyFootprint.maxX) * 0.5;
          const keyboardShiftX = caseCenter.x - keyboardCenterX;
          const keyboardMeshes = allMeshes.filter((mesh) => {
            const info = getMeshWorldMetrics(mesh);
            const center = info.center;
            return center.x >= keyFootprint.minX - 0.85
              && center.x <= keyFootprint.maxX + 0.85
              && center.y >= keyFootprint.minY - 0.9
              && center.y <= keyFootprint.maxY + 0.55
              && center.z >= keyFootprint.minZ - 0.85
              && center.z <= keyFootprint.maxZ + 0.85;
          });
          for (const mesh of keyboardMeshes) mesh.position.x += keyboardShiftX;
          stateRef.current.keyboardShiftX = keyboardShiftX;
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
        if (wrapRef.current) wrapRef.current.dataset.floppyPointer = 'disabled';
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
	          wrap.dataset.tableProfile = tabletop.userData.profile;
	          wrap.dataset.tableDepthRatio = tabletop.userData.depthRatio.toFixed(3);
	          wrap.dataset.tableFrontMarginRatio = tabletop.userData.frontMarginRatio.toFixed(3);
	          wrap.dataset.tableLegHeight = tabletop.userData.legHeight.toFixed(3);
	          wrap.dataset.tableFloorY = tabletop.userData.floorY.toFixed(3);
	        }
	        const markerCyc = createVfxMarkerCyc(
	          THREE,
	          renderer,
	          box,
	          stateRef.current.caseBox || box,
	        );
	        if (markerCyc) {
	          markerCyc.visible = true;
	          if (markerCyc.userData.markerMesh) {
	            markerCyc.userData.markerMesh.visible = (
	              markerCyc.userData.trackingMarkersEnabled === true
	              && !stateRef.current.macOvertureResolve
	            );
	          }
	          scene.add(markerCyc);
	          stateRef.current.markerCyc = markerCyc;
	          markerCyc.userData.setWallPowerProgress?.(
	            Math.max(0, Number(stateRef.current.macWallPowerProgress) || 0),
	            stateRef.current.macWallPowerLocked === true,
	          );
	          stateRef.current.markerCycTexture = markerCyc.userData.markerTexture;
	          stateRef.current.cycStageTexture = markerCyc.userData.stageTexture;
	          stateRef.current.updateVolumeSightline = () => {
	            const volume = markerCyc.userData;
	            const effectiveRadius = Math.max(
	              0.0001,
	              Number(volume.effectiveRadius) || Number(volume.baseRadius) || 1,
	            );
	            const floorY = Number(markerCyc.position.y) || 0;
	            const topY = floorY + (Number(volume.effectiveWallHeight) || 0);
	            const centerX = Number(volume.stageCenterX) || 0;
	            const centerZ = Number(volume.volumeCenterZ) || 0;
	            const direction = new THREE.Vector3();
	            camera.getWorldDirection(direction);
	            const ox = camera.position.x - centerX;
	            const oz = camera.position.z - centerZ;
	            const dx = direction.x;
	            const dz = direction.z;
	            const qa = dx * dx + dz * dz;
	            const qb = 2 * (ox * dx + oz * dz);
	            const qc = ox * ox + oz * oz - effectiveRadius * effectiveRadius;
	            const discriminant = qb * qb - 4 * qa * qc;
	            if (qa <= 0.000001 || discriminant < 0) return false;
	            const root = Math.sqrt(discriminant);
	            const candidates = [
	              (-qb - root) / (2 * qa),
	              (-qb + root) / (2 * qa),
	            ]
	              .filter((value) => Number.isFinite(value) && value > 0.001)
	              .sort((a, b) => a - b);
	            let rayDistance = NaN;
	            let hitX = NaN;
	            let hitZ = NaN;
	            for (const candidate of candidates) {
	              const candidateX = camera.position.x + direction.x * candidate;
	              const candidateZ = camera.position.z + direction.z * candidate;
	              let theta = Math.atan2(
	                (candidateX - centerX) / effectiveRadius,
	                (candidateZ - centerZ) / effectiveRadius,
	              );
	              if (theta < 0) theta += Math.PI * 2;
	              // The volume has a 90-degree open mouth. Ignore the near
	              // cylinder intersection when it falls inside that opening.
	              if (theta >= Math.PI * 0.25 && theta <= Math.PI * 1.75) {
	                rayDistance = candidate;
	                hitX = candidateX;
	                hitZ = candidateZ;
	                break;
	              }
	            }
	            if (!Number.isFinite(rayDistance)) return false;
	            const planarDistance = Math.max(
	              0.0001,
	              Math.hypot(hitX - camera.position.x, hitZ - camera.position.z),
	            );
	            const bottomAngle = Math.atan2(floorY - camera.position.y, planarDistance);
	            const topAngle = Math.atan2(topY - camera.position.y, planarDistance);
	            const spanDegrees = THREE.MathUtils.radToDeg(topAngle - bottomAngle);
	            camera.updateMatrixWorld(true);
	            const bottomNdc = new THREE.Vector3(hitX, floorY, hitZ).project(camera);
	            const topNdc = new THREE.Vector3(hitX, topY, hitZ).project(camera);
	            wrap.dataset.cycSightlineCameraHeight = (
	              camera.position.y - floorY
	            ).toFixed(3);
	            wrap.dataset.cycSightlineRayDistance = rayDistance.toFixed(3);
	            wrap.dataset.cycSightlinePlanarDistance = planarDistance.toFixed(3);
	            wrap.dataset.cycSightlineBottomDeg = (
	              THREE.MathUtils.radToDeg(bottomAngle)
	            ).toFixed(3);
	            wrap.dataset.cycSightlineTopDeg = (
	              THREE.MathUtils.radToDeg(topAngle)
	            ).toFixed(3);
	            wrap.dataset.cycSightlineSpanDeg = spanDegrees.toFixed(3);
	            wrap.dataset.cycSightlineFovCoverage = (
	              spanDegrees / Math.max(0.0001, camera.fov)
	            ).toFixed(3);
	            wrap.dataset.cycSightlineBottomNdcY = bottomNdc.y.toFixed(3);
	            wrap.dataset.cycSightlineTopNdcY = topNdc.y.toFixed(3);
	            wrap.dataset.cycSightlineTopVisible = String(
	              topNdc.z >= -1
	                && topNdc.z <= 1
	                && topNdc.y >= -1
	                && topNdc.y <= 1
	            );
	            const mouthZ = Number(volume.mouthZ) || 0;
	            const mouthHalfWidth = effectiveRadius * Math.cos(Math.PI * 0.25);
	            const rayGrid = [-0.9, -0.45, 0, 0.45, 0.9];
	            let openMouthRays = 0;
	            let ceilingBlockedRays = 0;
	            let floorMissRays = 0;
	            let sideMissRays = 0;
	            let forwardRays = 0;
	            let centerRayClear = false;
	            for (const ndcY of rayGrid) {
	              for (const ndcX of rayGrid) {
	                const rayDirection = new THREE.Vector3(ndcX, ndcY, 0.5)
	                  .unproject(camera)
	                  .sub(camera.position)
	                  .normalize();
	                if (Math.abs(rayDirection.z) < 0.000001) continue;
	                const mouthDistance = (mouthZ - camera.position.z) / rayDirection.z;
	                if (!Number.isFinite(mouthDistance) || mouthDistance <= 0) continue;
	                forwardRays += 1;
	                const mouthX = camera.position.x + rayDirection.x * mouthDistance;
	                const mouthY = camera.position.y + rayDirection.y * mouthDistance;
	                const horizontalClear = (
	                  Math.abs(mouthX - centerX) <= mouthHalfWidth
	                );
	                const verticalClear = mouthY >= floorY && mouthY <= topY;
	                if (horizontalClear && verticalClear) {
	                  openMouthRays += 1;
	                  if (ndcX === 0 && ndcY === 0) centerRayClear = true;
	                } else if (horizontalClear && mouthY > topY) {
	                  ceilingBlockedRays += 1;
	                } else if (horizontalClear && mouthY < floorY) {
	                  floorMissRays += 1;
	                } else if (!horizontalClear) {
	                  sideMissRays += 1;
	                }
	              }
	            }
	            const rayDenominator = Math.max(1, forwardRays);
	            wrap.dataset.cycMouthRayGrid = '5x5';
	            wrap.dataset.cycMouthWindow = (
	              openMouthRays / rayDenominator
	            ).toFixed(3);
	            wrap.dataset.cycMouthCeilingOcclusion = (
	              ceilingBlockedRays / rayDenominator
	            ).toFixed(3);
	            wrap.dataset.cycMouthFloorMiss = (
	              floorMissRays / rayDenominator
	            ).toFixed(3);
	            wrap.dataset.cycMouthSideMiss = (
	              sideMissRays / rayDenominator
	            ).toFixed(3);
	            wrap.dataset.cycMouthCenterClear = String(centerRayClear);
	            wrap.dataset.cycMouthCameraOutside = String(camera.position.z > mouthZ);
	            wrap.dataset.cycSightlineShot = wrap.dataset.channelCamera || 'current';
	            return true;
	          };
	          stateRef.current.fitMarkerCyc = () => {
	            const currentWidth = Math.max(0.0001, markerCyc.userData.stageWidth);
	            const stageCenterX = Number(markerCyc.userData.stageCenterX) || 0;
	            const forward = new THREE.Vector3();
	            camera.getWorldDirection(forward);
	            if (Math.abs(forward.z) < 0.0001) return false;
	            const verticalFov = THREE.MathUtils.degToRad(camera.fov);
	            const horizontalFov = 2 * Math.atan(
	              Math.tan(verticalFov * 0.5) * Math.max(0.0001, camera.aspect),
	            );
	            const baseRadius = Math.max(
	              0.0001,
	              Number(markerCyc.userData.baseRadius) || currentWidth * 0.5,
	            );
	            const mouthZ = Number(markerCyc.userData.mouthZ) || 0;
	            const mouthCos = Math.cos(THREE.MathUtils.degToRad(45));
	            const mouthRayDistance = (mouthZ - camera.position.z) / forward.z;
	            if (!Number.isFinite(mouthRayDistance) || mouthRayDistance <= 0) return false;
	            const centerAtMouth = camera.position.x + forward.x * mouthRayDistance;
	            const frustumHalfWidth = Math.abs(mouthRayDistance)
	              * Math.tan(horizontalFov * 0.5);
	            // Fit the open 90-degree chord, not the distant rear wall. The
	            // cylindrical side walls catch the edge rays much earlier; a
	            // rear-plane fit would make the volume more than twice as large
	            // and hide its mouth completely in the profile shots.
	            const requiredMouthHalfWidth = (
	              Math.abs(centerAtMouth - stageCenterX) + frustumHalfWidth
	            ) * 1.035;
	            const volumeScale = Math.max(
	              1,
	              requiredMouthHalfWidth / Math.max(0.0001, baseRadius * mouthCos),
	            );
	            const effectiveRadius = baseRadius * volumeScale;
	            const volumeCenterZ = mouthZ - effectiveRadius * mouthCos;
	            const backZ = volumeCenterZ - effectiveRadius;
	            markerCyc.scale.setScalar(volumeScale);
	            markerCyc.position.set(
	              stageCenterX,
	              Number(markerCyc.position.y) || 0,
	              mouthZ - effectiveRadius * mouthCos,
	            );
	            markerCyc.updateMatrixWorld(true);
	            markerCyc.userData.effectiveRadius = effectiveRadius;
	            markerCyc.userData.effectiveWallHeight = (
	              Number(markerCyc.userData.wallHeight) || 0
	            ) * volumeScale;
	            markerCyc.userData.backZ = backZ;
	            markerCyc.userData.volumeCenterZ = volumeCenterZ;
	            markerCyc.userData.floorReach = effectiveRadius * (1 + mouthCos);
	            camera.far = Math.max(
	              camera.far,
	              camera.position.distanceTo(new THREE.Vector3(
	                stageCenterX,
	                markerCyc.position.y + markerCyc.userData.effectiveWallHeight,
	                backZ,
	              )) * 1.22,
	            );
	            camera.updateProjectionMatrix();
	            wrap.dataset.cycFrustumWidth = (frustumHalfWidth * 2).toFixed(3);
	            wrap.dataset.cycEffectiveWidth = (effectiveRadius * 2).toFixed(3);
	            wrap.dataset.cycFrontOverscan = (
	              (effectiveRadius * mouthCos)
	                / Math.max(0.0001, requiredMouthHalfWidth / 1.035)
	            ).toFixed(3);
	            wrap.dataset.cycVolumeScale = volumeScale.toFixed(3);
	            wrap.dataset.cycVolumeUndistorted = 'true';
	            stateRef.current.updateVolumeSightline?.();
	            stateRef.current.requestRender?.();
	            return true;
	          };
	          stateRef.current.updateCycStage = (options = {}) => {
	            const state = stateRef.current;
	            if (state.cycGlitchRaf && options.resolve !== true && options.force !== true) {
	              return false;
	            }
	            const result = paintVfxMarkerCyc(markerCyc, options);
	            wrap.dataset.cycStagePhase = result.phase;
	            wrap.dataset.cycStageFrame = String(result.frame);
	            wrap.dataset.cycProjection = 'cyc-uv';
	            state.requestRender?.();
	            return result;
	          };
	          stateRef.current.paintLiveStrudelWall = (detail = {}) => {
	            const state = stateRef.current;
	            const reelOwnsWall = state.filmReelChannelActive
	              || wrap.dataset.filmReelOwner === 'active';
	            if (!reelOwnsWall || !isResumePageActive() || state.tabVisible === false) {
	              return false;
	            }
	            const engine = window.__resumeStrudelAudioEngine;
	            if (!Number.isFinite(state.strudelWallStartedAt) || state.strudelWallStartedAt <= 0) {
	              state.strudelWallStartedAt = performance.now();
	            }
	            const requestedElapsedMs = Number(detail.elapsedMs);
	            const strudelElapsedMs = Number.isFinite(requestedElapsedMs)
	              ? Math.max(0, requestedElapsedMs)
	              : Math.max(0, performance.now() - state.strudelWallStartedAt);
	            return state.updateCycStage?.({
	              phase: 'strudel',
	              force: true,
	              strudelSource: getPoetryInProofRenderSource()
	                || detail.source
	                || engine?.compositionSource
	                || '',
	              strudelSection: detail.section || engine?.arrangementSection || 'loop',
	              strudelLane: detail.lane || '',
	              strudelGroup: detail.group || '',
	              strudelPulse: Number(detail.pulse) || 0,
	              strudelBpm: Number(detail.bpm || engine?.bpm) || 0,
	              strudelElapsedMs,
	            });
	          };
	          window.__tvHeroLiveStrudelWallPaint = stateRef.current.paintLiveStrudelWall;
	          stateRef.current.pulseCycStage = (detail = {}) => {
	            const state = stateRef.current;
	            if (!isResumePageActive() || state.tabVisible === false) return false;
              const shell = document.querySelector('.landing-v1-shell');
              const hasAuthoredMakeFrame = detail.phase === 'make'
                && shell?.dataset?.makeStoryFrame !== undefined;
              const authoredMakeFrame = Number(shell?.dataset?.makeStoryFrame);
              const codeStable = detail.codeStable === true || hasAuthoredMakeFrame;
              const codeVariant = hasAuthoredMakeFrame
                ? shell.dataset.makeStoryVariant
                : detail.codeVariant;
              const codeCut = hasAuthoredMakeFrame
                ? shell.dataset.makeStoryCut
                : detail.codeCut;
              const codeCrash = hasAuthoredMakeFrame
                ? shell.dataset.makeStoryCrash
                : detail.codeCrash;
	            const requestedCrashHoldMs = Number(detail.codeCrashHoldMs);
	            const codeCrashHoldMs = codeCrash
	              ? Math.max(
	                  54,
	                  Math.min(
	                    160,
	                    Number.isFinite(requestedCrashHoldMs) ? requestedCrashHoldMs : 96,
	                  ),
	                )
	              : 0;
	            cancelAnimationFrame(state.cycGlitchRaf);
	            const serial = ++state.cycGlitchSerial;
	            const startedAt = performance.now();
	            const requestedVisualDuration = Number(detail.visualDurationMs);
	            const hasAuthoredVisualDuration = Number.isFinite(requestedVisualDuration)
	              && requestedVisualDuration > 0;
	            const duration = Math.max(
	              48,
	              Math.min(
	                detail.phase === 'design'
	                  ? 2400
	                  : detail.phase === 'make'
	                    ? 1500
	                    : 900,
	                Number(detail.durationMs)
	                  || Number(detail.audioDurationMs)
	                  || Number(detail.duration)
	                  || 360,
	              ),
	            );
	            const visualDuration = Math.max(
	              24,
	              Math.min(
	                duration,
	                hasAuthoredVisualDuration ? requestedVisualDuration : duration,
	              ),
	            );
	            const sequence = Math.max(0, Number(detail.sequence) || 0);
	            let lastFrame = -1;
	            const tickCycGlitch = (now) => {
	              if (serial !== stateRef.current.cycGlitchSerial) return;
	              const elapsed = Math.max(0, now - startedAt);
	              const progress = Math.min(1, elapsed / duration);
	              const visualProgress = Math.min(1, elapsed / visualDuration);
	              const frame = Math.floor(elapsed / 52);
	              if (frame !== lastFrame) {
	                lastFrame = frame;
	                const result = paintVfxMarkerCyc(markerCyc, {
	                  resolve: stateRef.current.macOvertureResolve,
	                  phase: detail.phase,
	                  designSequence: sequence,
	                  designElapsedMs: elapsed,
	                  designDurationMs: duration,
	                  hyperspaceElapsedMs: elapsed,
	                  hyperspaceDurationMs: duration,
	                  frameIndex: Math.max(
	                    0,
	                    Number.isInteger(Number(detail.mediaFrameIndex))
	                      ? (
	                        detail.phase === 'design'
                          || detail.phase === 'believe'
                          || codeStable
	                          // Keep the selected bull/BELIEVE source stable for
	                          // the whole hit. Authored MAKE cuts also hold one
	                          // code source while their transition envelope
	                          // decays, instead of shuffling pages every 52 ms.
	                          ? (
                              hasAuthoredMakeFrame && Number.isFinite(authoredMakeFrame)
                                ? authoredMakeFrame
                                : Number(detail.mediaFrameIndex)
                            )
	                          : Number(detail.mediaFrameIndex) + frame
	                      )
	                      : sequence * 7 + frame,
	                  ),
                    codeStable,
                    codeVariant,
                    codeCut,
                    codeCrash,
                    codeLabel: detail.codeLabel,
                    codeSequence: sequence,
	                  // Crash inserts need one guaranteed clean read before the
	                  // distortion collapses back into code. This authored hold
	                  // avoids a 52 ms sampling boundary swallowing the error.
	                  glitchStrength: codeCrash && elapsed <= codeCrashHoldMs
	                    ? 1
	                    : visualProgress < 1
	                      ? Math.pow(1 - visualProgress, 0.58)
	                      : 0,
	                });
	                wrap.dataset.cycStagePhase = result.phase;
	                wrap.dataset.cycStageFrame = String(result.frame);
	                wrap.dataset.cycGlitchFrame = String(frame);
	                wrap.dataset.cycGlitchEvent = String(detail.eventId || '');
	                wrap.dataset.cycGlitchPaintedAt = performance.now().toFixed(1);
	                if (result.phase === 'hyperspace') {
	                  wrap.dataset.cycHyperspacePainted = 'true';
	                  wrap.dataset.cycHyperspacePaintedAt = performance.now().toFixed(1);
	                } else if (result.phase === 'make'
	                  && detail.source === 'mando-bloop-code-handoff') {
	                  wrap.dataset.cycCodeHandoffPainted = 'true';
	                  wrap.dataset.cycCodeHandoffPaintedAt = performance.now().toFixed(1);
	                }
	                const syncState = window.__resumeCrtGlitchSync ||= {};
	                const eventId = String(detail.eventId || '');
	                if (eventId) {
	                  syncState[eventId] = {
	                    ...(syncState[eventId] || {}),
	                    eventId,
	                    visualPaintedAt: performance.now(),
	                    visualPhase: result.phase,
	                    visualFrame: result.frame,
	                  };
	                }
	                state.requestRender?.();
	              }
	              if (progress < 1) {
	                state.cycGlitchRaf = requestAnimationFrame(tickCycGlitch);
	              } else {
	                state.cycGlitchRaf = 0;
	                delete wrap.dataset.cycGlitchFrame;
	                delete wrap.dataset.cycGlitchEvent;
	                state.updateCycStage?.({
	                  resolve: state.macOvertureResolve,
	                  force: true,
	                });
	              }
	            };
	            // Paint frame zero now. The matching Web Audio voice is
	            // scheduled just ahead, so its LED texture is committed first.
	            tickCycGlitch(startedAt);
	            return true;
	          };
	          const shell = document.querySelector('.landing-v1-shell');
	          shell?.classList.add('has-3d-cyc');
	          wrap.dataset.cycReady = 'true';
	          wrap.dataset.cycGeometry = markerCyc.userData.profile;
	          wrap.dataset.cycDisplay = markerCyc.userData.displayType;
	          wrap.dataset.cycLedPixelPitch = String(markerCyc.userData.ledPixelPitch);
	          wrap.dataset.cycLedPanelGrid = markerCyc.userData.ledPanelGrid;
	          wrap.dataset.cycLedWallProduct = markerCyc.userData.ledWallSpec.product;
	          wrap.dataset.cycLedWallPanel = (
	            `${markerCyc.userData.ledWallSpec.panelWidthMm}x`
	            + `${markerCyc.userData.ledWallSpec.panelHeightMm}mm`
	          );
	          wrap.dataset.cycLedWallResolution = markerCyc.userData.ledWallSpec.panelResolution;
	          wrap.dataset.cycLedWallPanels = String(markerCyc.userData.ledWallSpec.panelCount);
	          wrap.dataset.cycLedCeilingProduct = markerCyc.userData.ledCeilingSpec.product;
	          wrap.dataset.cycLedCeilingPitch = `${markerCyc.userData.ledCeilingSpec.pixelPitchMm}mm`;
	          wrap.dataset.cycLedCeilingPanel = (
	            `${markerCyc.userData.ledCeilingSpec.panelWidthMm}x`
	            + `${markerCyc.userData.ledCeilingSpec.panelHeightMm}mm`
	          );
	          wrap.dataset.cycLedCeilingResolution = markerCyc.userData.ledCeilingSpec.panelResolution;
	          wrap.dataset.cycLedCeilingPanels = String(markerCyc.userData.ledCeilingSpec.panelCount);
	          wrap.dataset.cycMarkerCount = String(markerCyc.userData.markerCount);
	          wrap.dataset.cycMarkerLayout = markerCyc.userData.markerLayout;
	          wrap.dataset.cycMediaTargets = (markerCyc.userData.mediaTargets || []).join(',');
	          wrap.dataset.cycStageMapping = markerCyc.userData.stageMapping;
	          wrap.dataset.cycDesignComposite = 'lighter';
	          wrap.dataset.cycDesignPlateNormalization = 'per-source-polarity';
	          const wallUv = markerCyc.userData.geometry?.getAttribute?.('uv');
	          const wallRowWidth = (markerCyc.userData.ledWallSpec.columns || 131) + 1;
	          const wallTopIndex = (markerCyc.userData.ledWallSpec.rows || 12) * wallRowWidth;
	          wrap.dataset.cycWallUvOrientation = 'inside-facing-u-reversed_floor-v0-top-v1';
	          wrap.dataset.cycWallUvFirstColumn = wallUv?.count
	            ? wallUv.getX(0).toFixed(3)
	            : 'unknown';
	          wrap.dataset.cycWallUvLastColumn = wallUv?.count > (wallRowWidth - 1)
	            ? wallUv.getX(wallRowWidth - 1).toFixed(3)
	            : 'unknown';
	          wrap.dataset.cycWallUvFloor = wallUv?.count
	            ? wallUv.getY(0).toFixed(3)
	            : 'unknown';
	          wrap.dataset.cycWallUvTop = wallUv?.count > wallTopIndex
	            ? wallUv.getY(wallTopIndex).toFixed(3)
	            : 'unknown';
	          wrap.dataset.cycStageRegions = String(markerCyc.userData.stageRegionCount);
	          wrap.dataset.cycStageRegionResolution = markerCyc.userData.stageRegionResolution;
	          wrap.dataset.cycStageAtlasResolution = markerCyc.userData.stageAtlasResolution;
	          wrap.dataset.cycStageRegionOverlap = String(markerCyc.userData.stageRegionOverlap);
	          wrap.dataset.cycStageProcessorCount = String(
	            markerCyc.userData.stageProcessors?.length || 0,
	          );
	          wrap.dataset.cycStageProcessorResolution = String(
	            markerCyc.userData.stageProcessorResolution || 'fallback',
	          );
	          wrap.dataset.cycStageProcessorScale = Number(
	            markerCyc.userData.stageProcessorResolutionScale || 0,
	          ).toFixed(3);
	          wrap.dataset.cycWallMediaMapped = String(
	            markerCyc.userData.wallMediaMapped === true,
	          );
	          wrap.dataset.cycWallFrontMediaSide = 'inside-only';
	          wrap.dataset.cycWallPowerProgress = (
	            markerCyc.userData.wallPowerProgress || 0
	          ).toFixed(3);
	          wrap.dataset.cycWallPowerState = markerCyc.userData.wallPowerLocked
	            ? 'online'
	            : markerCyc.userData.wallPowerProgress > 0
	              ? 'booting'
	              : 'off';
	          wrap.dataset.cycWallPowerOrder = 'bull-silhouette-then-deterministic-random';
	          wrap.dataset.cycWallPowerPalette = 'black-off-blue-on';
	          wrap.dataset.cycWallPowerBlue = 'srgb-1118f2-linearized';
	          wrap.dataset.cycWallPowerSilhouette = 'off';
	          wrap.dataset.cycWallPowerSilhouetteMask = 'cabinet-grid-design-aligned';
	          wrap.dataset.cycWallPowerDrawCalls = '0';
	          wrap.dataset.cycWallPowerComposite = 'canvas-texture-and-inline-shader';
	          wrap.dataset.cycWallPowerVisibleSource = 'stage-canvas';
	          wrap.dataset.cycCeilingPowerProgress = (
	            markerCyc.userData.ceilingPowerProgress || 0
	          ).toFixed(3);
	          wrap.dataset.cycCeilingPowerState = markerCyc.userData.ceilingPowerProgress > 0
	            ? 'blue-online'
	            : 'off';
	          wrap.dataset.cycCeilingPowerOrder = 'atomic-visibility-toggle';
	          wrap.dataset.cycCeilingPowerDrawCalls = '0';
	          wrap.dataset.cycCeilingPowerColor = '#0018ff';
	          wrap.dataset.cycWallRearMediaMapped = String(
	            markerCyc.userData.wallRearMediaMapped === true,
	          );
	          wrap.dataset.cycWallRearProfile = markerCyc.userData.wallRearProfile;
	          wrap.dataset.cycWallCabinetDepthMm = String(
	            markerCyc.userData.wallCabinetDepthMm,
	          );
	          wrap.dataset.cycWallRearPowerHousings = 'shader-only';
	          wrap.dataset.cycWallRearDrawCalls = '1';
	          wrap.dataset.cycWallRearStatusLedPosition = 'central-control-box';
	          wrap.dataset.cycWallRearStatusLeds = String(
	            markerCyc.userData.ledWallSpec.panelCount,
	          );
	          wrap.dataset.cycWallRearStatusLedColor = '#147aff';
	          wrap.dataset.cycCeilingMediaMapped = String(
	            markerCyc.userData.ceilingMediaMapped === true,
	          );
	          wrap.dataset.cycCeilingMediaState = (
	            markerCyc.userData.ceilingMediaState || 'unknown'
	          );
	          wrap.dataset.cycStageWidth = markerCyc.userData.stageWidth.toFixed(3);
	          wrap.dataset.cycBackOffset = markerCyc.userData.backOffset.toFixed(3);
	          wrap.dataset.cycFloorReach = markerCyc.userData.floorReach.toFixed(3);
	          wrap.dataset.cycCoveRadius = markerCyc.userData.coveRadius.toFixed(3);
	          wrap.dataset.cycCoveRatio = markerCyc.userData.coveRatio.toFixed(3);
	          wrap.dataset.cycVolumeArc = String(markerCyc.userData.arcAngleDeg);
	          wrap.dataset.cycVolumeMouth = String(markerCyc.userData.mouthAngleDeg);
	          wrap.dataset.cycVolumeCeiling = String(markerCyc.userData.hasLedCeiling);
	          wrap.dataset.cycSetupPlacement = markerCyc.userData.setupPlacement;
	          wrap.dataset.cycReferenceSetupInsetM = (
	            markerCyc.userData.referenceSetupInsetM.toFixed(3)
	          );
	          wrap.dataset.cycReferenceDimensions = markerCyc.userData.referenceDimensions;
	          wrap.dataset.cycReferenceWallDiameterM = (
	            markerCyc.userData.referenceWallDiameterM.toFixed(3)
	          );
	          wrap.dataset.cycReferencePerformanceDiameterM = (
	            markerCyc.userData.referencePerformanceDiameterM.toFixed(3)
	          );
	          wrap.dataset.cycReferenceWallHeightM = (
	            markerCyc.userData.referenceWallHeightM.toFixed(3)
	          );
	          wrap.dataset.cycReferenceCeilingAreaM2 = (
	            markerCyc.userData.referenceCeilingAreaM2.toFixed(1)
	          );
	          wrap.dataset.cycReferenceClearanceM = (
	            markerCyc.userData.referenceClearanceM.toFixed(3)
	          );
	          wrap.dataset.cycVisible = 'true';
	          wrap.dataset.cycMarkersVisible = String(
	            markerCyc.userData.markerMesh?.visible !== false,
	          );
	          stateRef.current.updateCycStage({
	            resolve: stateRef.current.macOvertureResolve,
	            force: true,
	          });
	          const pending = stateRef.current.pendingCycGlitch;
	          stateRef.current.pendingCycGlitch = null;
	          if (pending && performance.now() - pending.receivedAt < 700) {
	            stateRef.current.pulseCycStage(pending.detail);
	          }
	        }
	        console.info('[TvHero] bbox center:', ctr, 'size:', size);
        stateRef.current.bbox = { box, ctr };
        stateRef.current.frameModel = () => frameModel(box);
        stateRef.current.frameModel();
        // Refresh/QR starts on the readable CRT-and-keyboard two-shot. Return
        // on ./design is the first authored release to the wider volume view;
        // do not pre-empt that contrast by booting in the wide shot.
        applyChannelCamera('camera:typing', {
          instant: true,
          source: 'model-ready-waiting-close',
        });
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
        // Kick shader compilation immediately, but never let it hold the actual
        // Macintosh offscreen for seconds. Chromium's parallel shader compiler
        // can take ~2s to report "complete" even though a usable frame is ready
        // almost immediately. Give it a short warm-up, reveal the real WebGL
        // model, and let any remaining programs finish progressively.
        let modelRevealed = false;
        const revealCompiledModel = () => {
          if (cancelled || modelRevealed) return;
          modelRevealed = true;
          window.clearTimeout(revealTimer);
          renderer.render(scene, camera);
          wrap.classList.add('is-model-ready');
          wrap.closest?.('.landing-v1__demo')?.classList.add('is-machine-ready');
          setModelReady(true);
          stateRef.current.beginMacOvertureReveal?.();
          stateRef.current.requestRender?.();
          // The title reveal already redraws the CRT throughout its animation.
          // Two low-frequency recovery frames after it settles are enough to
          // pick up any late parallel shaders without competing with the text.
          warmupTimer = window.setTimeout(() => {
            if (cancelled || rendererReleased) return;
            renderer.render(scene, camera);
            warmupTimer = window.setTimeout(() => {
              if (cancelled || rendererReleased) return;
              renderer.render(scene, camera);
            }, 700);
          }, 1100);
          pixelRatioTimer = window.setTimeout(() => {
            if (cancelled || rendererReleased) return;
            renderer.setPixelRatio(finalPixelRatio);
            stateRef.current.requestRender?.();
          }, 650);
        };
        revealTimer = window.setTimeout(revealCompiledModel, 0);
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
      cancelAnimationFrame(s.channelCameraRaf);
      cancelAnimationFrame(s.cycGlitchRaf);
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
      window.clearTimeout(revealTimer);
      window.clearTimeout(pixelRatioTimer);
      window.clearTimeout(warmupTimer);
      if (onResize) window.removeEventListener('resize', onResize);
      if (releaseRendererForNavigation) {
        window.removeEventListener('pagehide', releaseRendererForNavigation);
        window.removeEventListener('beforeunload', releaseRendererForNavigation);
      }
      s.requestRender = null;
      if (window.__tvHeroChannelCamera === s.applyChannelCamera) {
        delete window.__tvHeroChannelCamera;
      }
      if (window.__tvHeroLiveStrudelWallPaint === s.paintLiveStrudelWall) {
        delete window.__tvHeroLiveStrudelWallPaint;
      }
      delete window.__tvHeroCompanionCamera;
      document.querySelector('.landing-v1-shell')?.classList.remove('has-3d-cyc');
      if (s.tabletop) {
        try { s.tabletop.parent?.remove?.(s.tabletop); } catch (_) {}
        for (const geometry of s.tabletop.userData?.geometries || []) {
          try { geometry?.dispose?.(); } catch (_) {}
        }
        for (const material of s.tabletop.userData?.materials || []) {
          try { material?.dispose?.(); } catch (_) {}
        }
        for (const texture of s.tabletop.userData?.textures || []) {
          try { texture?.dispose?.(); } catch (_) {}
        }
        s.tabletop = null;
      }
      if (s.markerCyc) {
        try { s.markerCyc.parent?.remove?.(s.markerCyc); } catch (_) {}
        for (const geometry of s.markerCyc.userData?.geometries || []) {
          try { geometry?.dispose?.(); } catch (_) {}
        }
        for (const material of s.markerCyc.userData?.surfaceMaterials || []) {
          try { material?.dispose?.(); } catch (_) {}
        }
        for (const material of s.markerCyc.userData?.ledMaterials || []) {
          try { material?.dispose?.(); } catch (_) {}
        }
        for (const material of s.markerCyc.userData?.markerMaterials || []) {
          try { material?.dispose?.(); } catch (_) {}
        }
        for (const texture of s.markerCyc.userData?.markerTextures || []) {
          try { texture?.dispose?.(); } catch (_) {}
        }
        for (const texture of s.markerCyc.userData?.ledTextures || []) {
          try { texture?.dispose?.(); } catch (_) {}
        }
        for (const texture of s.markerCyc.userData?.stageTextures || []) {
          if (texture === s.cycStageTexture) continue;
          try { texture?.dispose?.(); } catch (_) {}
        }
        try { s.markerCyc.userData?.strudelHtmlTexture?.dispose?.(); } catch (_) {}
      }
      try { s.markerCycTexture?.dispose?.(); } catch (_) {}
      try { s.cycStageTexture?.dispose?.(); } catch (_) {}
      s.markerCyc = null;
      s.markerCycTexture = null;
      s.cycStageTexture = null;
      s.cycGlitchRaf = 0;
      s.pendingCycGlitch = null;
      s.updateCycStage = null;
      s.paintLiveStrudelWall = null;
      s.pulseCycStage = null;
      s.fitMarkerCyc = null;
      s.updateVolumeSightline = null;
      releaseRendererForNavigation?.();
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

  // Post-show ghostwriter: after the intro resolves, every deliberate key
  // reveals one authored character. The physical key still moves/sounds, but
  // the CRT writes the next character in the selected phrase regardless of
  // which key was pressed. This turns the reset into a replayable invitation
  // without interfering with the authored intro transport.
  React.useEffect(() => {
    if (stateRef.current.deviceMode !== 'mac') return undefined;
    let ghostwriterStream = null;
    const clearTimers = () => {
      const timers = stateRef.current.macGhostwriterTimers || [];
      timers.forEach((timer) => window.clearTimeout(timer));
      stateRef.current.macGhostwriterTimers = [];
    };
    const paintGhostwriter = () => {
      stateRef.current.forceTerminal = true;
      drawMacOffScreen();
      stateRef.current.forceTerminal = false;
    };
    const loadPhrase = ({ revealFirst = false } = {}) => {
      if (!ghostwriterStream || ghostwriterStream.cursor >= ghostwriterStream.phraseIds.length) {
        const selectedStream = takeNextMacGhostwriterStream();
        ghostwriterStream = {
          id: selectedStream.id,
          phraseIds: [...selectedStream.phraseIds],
          cursor: 0,
        };
      }
      const selectedId = ghostwriterStream.phraseIds[ghostwriterStream.cursor]
        || MAC_GHOSTWRITER_PHRASES[0].id;
      const selected = MAC_GHOSTWRITER_PHRASES.find((entry) => entry.id === selectedId)
        || MAC_GHOSTWRITER_PHRASES[0];
      const streamStep = ghostwriterStream.cursor;
      ghostwriterStream.cursor += 1;
      stateRef.current.macGhostwriter = {
        active: true,
        id: selected.id,
        stream: ghostwriterStream.id,
        streamStep,
        streamLength: ghostwriterStream.phraseIds.length,
        phrase: selected.phrase,
        response: selected.response,
        responseKeys: [...selected.responseKeys],
        exportStatus: 'idle',
        exportBlob: null,
        exportFile: null,
        revealIndex: revealFirst ? 1 : 0,
        phase: 'revealing',
      };
      ensureMacTerminal().cursorOn = true;
      if (wrapRef.current) {
        wrapRef.current.dataset.ghostwriter = 'active';
        wrapRef.current.dataset.ghostwriterPhrase = selected.id;
        wrapRef.current.dataset.ghostwriterStream = ghostwriterStream.id;
        wrapRef.current.dataset.ghostwriterStreamStep = String(streamStep + 1);
        delete wrapRef.current.dataset.ghostwriterAutocomplete;
      }
      paintGhostwriter();
    };
    const stopGhostwriter = () => {
      clearTimers();
      window.__resumeGhostwriterActive = false;
      const ghostwriter = stateRef.current.macGhostwriter || {};
      stateRef.current.macGhostwriter = {
        ...ghostwriter,
        active: false,
        revealIndex: 0,
        phase: 'revealing',
      };
      if (wrapRef.current) {
        wrapRef.current.dataset.ghostwriter = 'inactive';
        delete wrapRef.current.dataset.ghostwriterPhrase;
        delete wrapRef.current.dataset.ghostwriterPhase;
        delete wrapRef.current.dataset.ghostwriterStream;
        delete wrapRef.current.dataset.ghostwriterStreamStep;
        delete wrapRef.current.dataset.ghostwriterAutocomplete;
      }
    };
    const advanceGhostwriter = (code = '', options = {}) => {
      const ghostwriter = stateRef.current.macGhostwriter;
      if (!ghostwriter?.active) return false;
      if (options.repeat) return true;
      if (code && MAC_KEY_DEFS[code]?.action === 'modifier') return true;
      if (options.metaKey || options.ctrlKey || options.altKey) return true;
      if (!options.physicalAlreadyAnimated && code) animateKeyPress(code);
      if (code) playMacKeyClick(code);
      if (ghostwriter.phase === 'response') return true;
      if (ghostwriter.phase === 'complete' || ghostwriter.phase === 'armed-next') {
        clearTimers();
        // This keystroke is deliberately silent in the text stream: it clears
        // the completed sentence and exposes a fresh cursor. The next physical
        // key reveals character one of the next authored sentence.
        loadPhrase({ revealFirst: false });
        return true;
      }
      const phraseLength = Array.from(String(ghostwriter.phrase || '')).length;
      const isAutocompleteKey = code === 'Tab'
        || options.key === 'Tab'
        || code === 'Enter'
        || options.key === 'Enter';
      if (isAutocompleteKey) {
        stateRef.current.macTryItPromptVisible = false;
        ghostwriter.revealIndex = phraseLength;
        ghostwriter.phase = 'complete';
        ensureMacTerminal().cursorOn = true;
        if (wrapRef.current) {
          wrapRef.current.dataset.ghostwriterAutocomplete = ghostwriter.id;
        }
        paintGhostwriter();
        return true;
      }
      stateRef.current.macTryItPromptVisible = false;
      ghostwriter.revealIndex = Math.min(phraseLength, ghostwriter.revealIndex + 1);
      if (ghostwriter.revealIndex >= phraseLength) ghostwriter.phase = 'complete';
      ensureMacTerminal().cursorOn = true;
      paintGhostwriter();
      return true;
    };
    const startGhostwriter = () => {
      clearTimers();
      const selectedStream = takeNextMacGhostwriterStream();
      ghostwriterStream = {
        id: selectedStream.id,
        phraseIds: [...selectedStream.phraseIds],
        cursor: 0,
      };
      window.__resumeGhostwriterActive = true;
      stateRef.current.openingInvitationPending = false;
      stateRef.current.visitorNamePromptActive = false;
      stateRef.current.macStoryTypeActive = false;
      stateRef.current.macStoryTypedText = '';
      stateRef.current.macOvertureBootBlank = true;
      stateRef.current.macTryItPromptVisible = true;
      loadPhrase();
      const capture = keyboardCaptureRef.current;
      if (capture && isResumePageActive()) {
        try { capture.focus({ preventScroll: true }); }
        catch (_) { capture.focus?.(); }
      }
    };
    const onStart = () => startGhostwriter();
    const onStop = () => {
      stateRef.current.macTryItPromptVisible = false;
      stopGhostwriter();
    };
    const onTryItPrompt = (event) => {
      stateRef.current.macTryItPromptVisible = event.detail?.visible !== false;
      paintGhostwriter();
    };
    window.__resumeMacGhostwriterKey = advanceGhostwriter;
    window.addEventListener('resume-mac-ghostwriter-start', onStart);
    window.addEventListener('resume-mac-ghostwriter-stop', onStop);
    window.addEventListener('resume-mac-try-it-prompt', onTryItPrompt);
    window.addEventListener('resume-companion-start-intro', onStop);
    return () => {
      clearTimers();
      window.removeEventListener('resume-mac-ghostwriter-start', onStart);
      window.removeEventListener('resume-mac-ghostwriter-stop', onStop);
      window.removeEventListener('resume-mac-try-it-prompt', onTryItPrompt);
      window.removeEventListener('resume-companion-start-intro', onStop);
      if (window.__resumeMacGhostwriterKey === advanceGhostwriter) {
        delete window.__resumeMacGhostwriterKey;
      }
      window.__resumeGhostwriterActive = false;
    };
  }, [animateKeyPress, drawMacOffScreen, ensureMacTerminal, playMacKeyClick]);

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
      if ((event.code === 'Space' || event.key === ' ')
        && !stateRef.current.macGhostwriter?.active
        && !event.repeat
        && !event.metaKey
        && !event.ctrlKey
        && !event.altKey
        && !isEditableTarget(event.target)
        && window.__resumeToggleIntroTransport?.() === true) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      if (!isResumePageActive()) return;
      if (stateRef.current.deviceMode !== 'mac') return;
      if (!heroVisible()) return;
      // On the HELP page the player owns WASD (and other keys). Bail so we
      // never intercept/stopPropagation those keys away from HELP.
      if (getActiveHelpPlayerForKeyboard()) return;
      if (isEditableTarget(event.target)) return;
      const capture = keyboardCaptureRef.current;
      if (capture && document.activeElement !== capture) {
        try { capture.focus({ preventScroll: true }); }
        catch (_) { capture.focus?.(); }
      }
      if (document.activeElement !== capture) return;
      const code = getMacKeyCodeFromEvent(event);
      if (stateRef.current.macGhostwriter?.active) {
        const handled = window.__resumeMacGhostwriterKey?.(code, {
          key: event.key,
          repeat: event.repeat,
          metaKey: event.metaKey,
          ctrlKey: event.ctrlKey,
          altKey: event.altKey,
          physicalAlreadyAnimated: false,
        });
        if (handled) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
        return;
      }
      if (stateRef.current.macOvertureBootBlank
        && !event.repeat
        && !event.metaKey
        && !event.ctrlKey
        && !event.altKey
        && code
        && MAC_KEY_DEFS[code]?.action !== 'modifier') {
        const firstLaunchKey = !stateRef.current.macLandingLaunchPending;
        stateRef.current.macLandingLaunchPending = true;
        animateKeyPress(code);
        playMacKeyClick(code);
        if (wrapRef.current) {
          wrapRef.current.dataset.landingKeyStart = code;
        }
        // Prime every audio path inside the physical key gesture. The intro
        // state machine will remain on this cursor until the ready event, then
        // ghostwrite and execute ./design with its existing authored timing.
        try {
          void window.__resumePrimeIntroAudio?.();
        } catch {}
        if (firstLaunchKey) {
          window.dispatchEvent(new CustomEvent('resume-keyboard-start-intro', {
            detail: {
              source: 'keyboard',
              code,
              key: event.key,
            },
          }));
        }
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      if (code) animateKeyPress(code);
      if (stateRef.current.visitorNamePromptActive) {
        if (code) playMacKeyClick(code);
        const current = String(stateRef.current.visitorName || '');
        let next = current;
        let submitted = false;
        if (event.key === 'Escape') {
          next = '';
        } else if (event.key === 'Backspace') {
          next = Array.from(current).slice(0, -1).join('');
        } else if (event.key === 'Enter') {
          submitted = Boolean(current.trim());
        } else if (!event.metaKey
          && !event.ctrlKey
          && !event.altKey
          && event.key?.length === 1
          && /^[\p{L}\p{N} .'-]$/u.test(event.key)
          && Array.from(current).length < 24) {
          next = `${current}${event.key}`;
        } else {
          return;
        }
        stateRef.current.visitorName = next;
        if (wrapRef.current) wrapRef.current.dataset.visitorName = next;
        ensureMacTerminal().cursorOn = true;
        drawMacOffScreen();
        window.dispatchEvent(new CustomEvent('resume-visitor-name-change', {
          detail: { name: next, prompt: true, source: 'mac-keyboard' },
        }));
        if (submitted) {
          window.dispatchEvent(new CustomEvent('resume-visitor-name-submit', {
            detail: { name: current.trim(), source: 'mac-keyboard' },
          }));
        }
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      if (stateRef.current.contactForm?.open) {
        if (handleMacContactKey(event, code)) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
        return;
      }
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
  }, [animateKeyPress, applyMacTerminalKey, drawMacOffScreen, ensureMacTerminal, handleMacContactKey, playMacKeyClick]);

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
      if (!isResumePageActive()) return;
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
      if (!isResumePageActive()) return;
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
		    let stickyPickVec = null;
		    let screenPickVec = null;
		    const pickStickyNote = (event) => {
	      const state = stateRef.current;
	      const THREE = state.three;
	      const camera = state.camera;
	      const stickyNotes = state.stickyNotes || [];
	      if (!THREE || !camera || !stickyNotes.length) return null;
	      const rect = canvas.getBoundingClientRect();
	      if (state.dockMode) {
	        if (!stickyPickVec) stickyPickVec = new THREE.Vector3();
	        let picked = null;
	        let pickedArea = Infinity;
	        camera.updateMatrixWorld?.(true);
	        for (const note of stickyNotes) {
	          if (!note || note.userData.interactive === false) continue;
	          note.updateWorldMatrix?.(true, false);
	          const positions = note.geometry?.attributes?.position;
	          if (!positions?.count) continue;
	          let minX = Infinity;
	          let minY = Infinity;
	          let maxX = -Infinity;
	          let maxY = -Infinity;
	          for (let i = 0; i < positions.count; i++) {
	            stickyPickVec.fromBufferAttribute(positions, i);
	            stickyPickVec.applyMatrix4(note.matrixWorld).project(camera);
	            if (!Number.isFinite(stickyPickVec.x) || !Number.isFinite(stickyPickVec.y)) continue;
	            const px = rect.left + (stickyPickVec.x * 0.5 + 0.5) * rect.width;
	            const py = rect.top + (-stickyPickVec.y * 0.5 + 0.5) * rect.height;
	            minX = Math.min(minX, px);
	            minY = Math.min(minY, py);
	            maxX = Math.max(maxX, px);
	            maxY = Math.max(maxY, py);
	          }
	          if (!Number.isFinite(minX) || !Number.isFinite(minY) || !Number.isFinite(maxX) || !Number.isFinite(maxY)) continue;
	          const width = maxX - minX;
	          const height = maxY - minY;
	          const skippedLarge = width > rect.width * 0.55 || height > rect.height * 0.55;
	          if (skippedLarge) continue;
	          const pad = Math.max(6, Math.min(rect.width, rect.height) * 0.008);
	          if (
	            event.clientX >= minX - pad &&
	            event.clientX <= maxX + pad &&
	            event.clientY >= minY - pad &&
	            event.clientY <= maxY + pad
	          ) {
	            const area = Math.max(1, (maxX - minX) * (maxY - minY));
	            if (area < pickedArea) {
	              picked = note;
	              pickedArea = area;
	            }
	          }
	        }
	        return picked;
	      }
	      if (!raycaster) raycaster = new THREE.Raycaster();
	      const ndc = new THREE.Vector2(
	        ((event.clientX - rect.left) / rect.width) * 2 - 1,
	        -((event.clientY - rect.top) / rect.height) * 2 + 1,
	      );
	      raycaster.setFromCamera(ndc, camera);
		      const pickableNotes = stickyNotes.filter(
		        (note) => note?.isObject3D && note.layers,
		      );
		      const hits = raycaster.intersectObjects(pickableNotes, false);
		      return hits[0]?.object || null;
		    };
	    const projectLiveScreenRect = () => {
	      const state = stateRef.current;
	      const THREE = state.three;
	      const camera = state.camera;
	      const screenBox = state.screenBox;
	      if (!THREE || !camera || !screenBox || screenBox.isEmpty?.()) return null;
	      const rect = canvas.getBoundingClientRect();
	      if (!rect.width || !rect.height) return null;
	      if (!screenPickVec) screenPickVec = new THREE.Vector3();
	      camera.updateMatrixWorld?.(true);
	      const mn = screenBox.min;
	      const mx = screenBox.max;
	      let minX = Infinity;
	      let minY = Infinity;
	      let maxX = -Infinity;
	      let maxY = -Infinity;
	      for (let i = 0; i < 8; i++) {
	        screenPickVec.set(i & 1 ? mx.x : mn.x, i & 2 ? mx.y : mn.y, i & 4 ? mx.z : mn.z);
	        screenPickVec.project(camera);
	        if (!Number.isFinite(screenPickVec.x) || !Number.isFinite(screenPickVec.y)) continue;
	        const px = rect.left + (screenPickVec.x * 0.5 + 0.5) * rect.width;
	        const py = rect.top + (-screenPickVec.y * 0.5 + 0.5) * rect.height;
	        minX = Math.min(minX, px);
	        minY = Math.min(minY, py);
	        maxX = Math.max(maxX, px);
	        maxY = Math.max(maxY, py);
	      }
	      if (!Number.isFinite(minX) || !Number.isFinite(minY) || !Number.isFinite(maxX) || !Number.isFinite(maxY)) return null;
	      const w = maxX - minX;
	      const h = maxY - minY;
	      return w > 0 && h > 0 ? { x: minX, y: minY, w, h } : null;
	    };
		    const onPointerMove = (event) => {
		      setHoveredStickyNote(pickStickyNote(event));
		    };
    const onPointerLeave = () => {
      setHoveredStickyNote(null);
    };
    const onWindowPointerOut = (event) => {
      if (!event.relatedTarget) onPointerLeave();
    };
	    const pickScreenMenuChannel = (event) => {
	      const state = stateRef.current;
	      const menu = state.menuRects;
	      const screenRect = projectLiveScreenRect() || state.projectScreenRect?.(0);
	      if (!state.dockMode || !menu || !screenRect || !Number.isFinite(screenRect.w) || !Number.isFinite(screenRect.h)) return null;
	      if (screenRect.w <= 0 || screenRect.h <= 0) return null;
	      const x = ((event.clientX - screenRect.x) / screenRect.w) * menu.W;
	      const y = ((event.clientY - screenRect.y) / screenRect.h) * menu.H;
	      const ySlop = Math.max(menu.mh * 1.45, 18);
	      const xSlop = Math.max(menu.mh * 0.22, 8);
	      if (x < -xSlop || x > menu.W + xSlop || y < -ySlop * 0.18 || y > menu.mh + ySlop) return null;
	      const hit = menu.rects?.find((item) => x >= item.x0 - xSlop && x <= item.x1 + xSlop);
	      return Number.isFinite(hit?.ch) ? hit.ch : null;
	    };
	    const activateScreenMenuChannel = (event) => {
	      const menuChannel = pickScreenMenuChannel(event);
	      if (menuChannel === null) return false;
	      event.preventDefault();
	      event.stopPropagation();
	      event.stopImmediatePropagation?.();
	      captureMacKeyboard();
	      window.dispatchEvent(new CustomEvent('resume-crt-channel-select', {
	        detail: { index: menuChannel, source: 'screen-menu' },
	      }));
	      return true;
	    };
	    const activateGhostwriterShare = (event) => {
	      const state = stateRef.current;
	      const ghostwriter = state.macGhostwriter;
	      const rects = state.macGhostwriterShareRects;
	      const screenRect = projectLiveScreenRect();
	      const screenCanvas = state.screenCanvas;
	      if (!ghostwriter?.active
	        || !['complete', 'armed-next'].includes(ghostwriter.phase)
	        || !rects
	        || !screenRect
	        || !screenCanvas) return false;
	      const x = ((event.clientX - screenRect.x) / screenRect.w) * screenCanvas.width;
	      const y = ((event.clientY - screenRect.y) / screenRect.h) * screenCanvas.height;
	      const contains = (rect) => rect
	        && x >= rect.x && x <= rect.x + rect.w
	        && y >= rect.y && y <= rect.y + rect.h;
	      const action = contains(rects.export)
	        ? 'export'
	        : contains(rects.x)
	          ? 'x'
	          : contains(rects.linkedin)
	            ? 'linkedin'
	            : '';
	      if (!action) return false;
	      event.preventDefault();
	      event.stopPropagation();
	      event.stopImmediatePropagation?.();

	      const sharePackage = getMacGhostwriterSharePackage(ghostwriter.phrase);
	      if (action === 'export') {
	        if (ghostwriter.exportStatus === 'rendering') return true;
	        ghostwriter.exportStatus = 'rendering';
	        drawMacOffScreen();
	        const copyPackage = async () => {
	          try {
	            await navigator.clipboard.writeText(sharePackage.composed);
	            return true;
	          } catch (_) {
	            const textarea = document.createElement('textarea');
	            textarea.value = sharePackage.composed;
	            textarea.setAttribute('readonly', '');
	            textarea.style.position = 'fixed';
	            textarea.style.opacity = '0';
	            document.body.appendChild(textarea);
	            textarea.select();
	            const copied = document.execCommand?.('copy') !== false;
	            textarea.remove();
	            return copied;
	          }
	        };
	        const copyPromise = copyPackage();
	        void createMacGhostwriterGif(ghostwriter).then(async (blob) => {
	          const current = stateRef.current.macGhostwriter;
	          if (current !== ghostwriter || !current?.active) return;
	          const safeId = String(ghostwriter.id || 'thought').replace(/[^a-z0-9-]+/gi, '-');
	          const fileName = `the-macintosh-made-me-type-${safeId}.gif`;
	          const file = new File([blob], fileName, { type: 'image/gif' });
	          ghostwriter.exportBlob = blob;
	          ghostwriter.exportFile = file;
	          const objectUrl = URL.createObjectURL(blob);
	          const download = document.createElement('a');
	          download.href = objectUrl;
	          download.download = fileName;
	          download.style.display = 'none';
	          document.body.appendChild(download);
	          download.click();
	          download.remove();
	          window.setTimeout(() => URL.revokeObjectURL(objectUrl), 2000);
	          await copyPromise;
	          ghostwriter.exportStatus = 'ready';
	          if (wrapRef.current) {
	            wrapRef.current.dataset.ghostwriterExport = 'ready';
	            wrapRef.current.dataset.ghostwriterExportPhrase = ghostwriter.id;
	          }
	          drawMacOffScreen();
	        }).catch(() => {
	          if (stateRef.current.macGhostwriter !== ghostwriter) return;
	          ghostwriter.exportStatus = 'error';
	          if (wrapRef.current) wrapRef.current.dataset.ghostwriterExport = 'error';
	          drawMacOffScreen();
	        });
	        return true;
	      }

	      if (action === 'x' && ghostwriter.exportFile && navigator.share) {
	        const nativeShareData = {
	          title: 'The Macintosh made me type it',
	          text: sharePackage.text,
	          url: sharePackage.url,
	          files: [ghostwriter.exportFile],
	        };
	        let canShareFile = false;
	        try {
	          canShareFile = !navigator.canShare || navigator.canShare(nativeShareData);
	        } catch (_) {}
	        if (canShareFile) {
	          void navigator.share(nativeShareData).catch(() => {});
	          return true;
	        }
	      }
	      const href = action === 'x'
	        ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(sharePackage.text)}&url=${encodeURIComponent(sharePackage.url)}`
	        : `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(sharePackage.url)}`;
	      const opened = window.open(href, '_blank', 'noopener,noreferrer');
	      if (opened) opened.opener = null;
	      if (wrapRef.current) {
	        wrapRef.current.dataset.ghostwriterShared = action;
	        wrapRef.current.dataset.ghostwriterSharedPhrase = ghostwriter.id;
	      }
	      return true;
	    };
	    const onWindowPointerDown = (event) => {
	      if (activateGhostwriterShare(event)) return;
	      if (activateContactControl(event)) return;
	      activateScreenMenuChannel(event);
	    };
	    const activateContactControl = (event) => {
	      const state = stateRef.current;
	      const form = state.contactForm;
	      const rects = state.contactFormRects;
	      const screenRect = projectLiveScreenRect();
	      const screenCanvas = state.screenCanvas;
	      if (!form?.open || !rects || !screenRect || !screenCanvas) return false;
	      const screenX = (event.clientX - screenRect.x) / screenRect.w;
	      const screenY = (event.clientY - screenRect.y) / screenRect.h;
	      // The CRT projection is curved and shifts slightly by aspect ratio.
	      // Give the visible title-bar close control a generous normalized hit
	      // region so it remains easy to click without pixel-perfect aiming.
	      if (screenX >= 0.58 && screenX <= 1.02 && screenY >= -0.02 && screenY <= 0.25) {
	        closeMacContactForm();
	        event.preventDefault();
	        event.stopPropagation();
	        event.stopImmediatePropagation?.();
	        return true;
	      }
	      const x = ((event.clientX - screenRect.x) / screenRect.w) * screenCanvas.width;
	      const y = ((event.clientY - screenRect.y) / screenRect.h) * screenCanvas.height;
	      const contains = (rect) => rect
	        && x >= rect.x && x <= rect.x + rect.w
	        && y >= rect.y && y <= rect.y + rect.h;
	      const field = ['name', 'email', 'message'].find((key) => contains(rects[key]));
	      if (field) {
	        form.activeField = field;
	        form.error = '';
	        form.status = '';
	        keyboardCaptureRef.current?.setAttribute?.('aria-label', `Contact Tawfeeq: ${field} field active`);
	      } else if (contains(rects.send)) {
	        submitMacContactForm();
	      } else if (contains(rects.close)) {
	        closeMacContactForm();
	      } else {
	        return false;
	      }
	      event.preventDefault();
	      event.stopPropagation();
	      event.stopImmediatePropagation?.();
	      captureMacKeyboard();
	      drawMacOffScreen();
	      return true;
	    };
	    const launchIntroFromMacPointer = (label = 'mouse') => {
	      const state = stateRef.current;
	      const isLandingMacState = state.macOvertureBootBlank
	        || state.companionQrVisible
	        || state.visitorNamePromptActive
	        || state.openingInvitationPending;
	      if (!isLandingMacState
	        || state.macLandingLaunchPending
	        || state.macGhostwriter?.active
	        || state.macCompanionDirectTyping
	        || state.visualReelMode) return false;
	      state.macLandingLaunchPending = true;
	      if (wrapRef.current) {
	        wrapRef.current.dataset.landingPointerStart = String(label || 'mouse');
	      }
	      try {
	        void window.__resumePrimeIntroAudio?.();
	      } catch {}
	      window.dispatchEvent(new CustomEvent('resume-glitch-audio-unlock'));
	      window.dispatchEvent(new CustomEvent('resume-keyboard-start-intro', {
	        detail: {
	          source: 'mac-pointer',
	          code: String(label || 'mouse'),
	          key: String(label || 'mouse'),
	          audioUnlocked: true,
	        },
	      }));
	      return true;
	    };
		    const onPointerDown = async (event) => {
			      const state = stateRef.current;
		      if (!isResumePageActive() || state.tabVisible === false) return;
		      if (activateGhostwriterShare(event)) return;
		      if (activateScreenMenuChannel(event)) return;
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
		      const validHitMeshes = hitMeshes.filter(
		        (mesh) => mesh?.isObject3D && mesh.layers,
		      );
		      const hits = raycaster.intersectObjects(validHitMeshes, false);
	      const macHits = hits.length
	        ? hits
	        : state.frameModel?.isObject3D && state.frameModel.layers
	          ? raycaster.intersectObjects([state.frameModel], true)
	          : [];
	      if (!macHits.length) {
	        if (launchIntroFromMacPointer('section')) {
	          event.preventDefault();
	          event.stopPropagation();
	          event.stopImmediatePropagation?.();
	          captureMacKeyboard();
	        }
	        return;
	      }
	      event.preventDefault();
	      if (!hits.length) {
	        captureMacKeyboard();
	        window.dispatchEvent(new CustomEvent('resume-glitch-audio-unlock'));
	        if (launchIntroFromMacPointer('frame')) {
	          event.stopPropagation();
	          event.stopImmediatePropagation?.();
	        }
	        return;
	      }
	      if (state.powerToggleInFlight) return;
	      const hit = hits[0];
	      let target = state.macHitTargets?.get(hit.object.uuid) || { type: 'mouse' };
	      if (target.type === 'split' && Array.isArray(hit.object.userData?.splitLinks)) {
	        const splitIndex = Number(hit.uv?.y) >= 0.5 ? 0 : 1;
	        const splitTarget = hit.object.userData.splitLinks[splitIndex];
	        if (splitTarget) {
	          target = {
	            type: splitTarget.hitType || 'link',
	            label: splitTarget.label || '',
	            href: splitTarget.href || '',
	          };
	        }
	      }
	      // The floppy is now a start control only. Keep it on the same intro
	      // path as trusted keyboard/mouse gestures; do not revive the old
	      // insert/eject reel-toggle behavior here.
	      if (target.type === 'floppy') {
	        captureMacKeyboard();
	        window.dispatchEvent(new CustomEvent('resume-glitch-audio-unlock'));
	        if (launchIntroFromMacPointer('floppy')) {
	          event.stopPropagation();
	          event.stopImmediatePropagation?.();
	        }
	        if (wrapRef.current) wrapRef.current.dataset.floppyPointer = 'intro-start';
	        return;
	      }
	      captureMacKeyboard();
	      // Forward trusted non-floppy Macintosh interactions to the audio
	      // layer so its Web Audio context can unlock in the same user gesture.
	      window.dispatchEvent(new CustomEvent('resume-glitch-audio-unlock'));
	      if (target.type === 'contact') {
	        openMacContactForm();
	        return;
	      }
	      if (target.type === 'signature') return;
	      if (['resume', 'linkedin', 'link'].includes(target.type)) {
	        const href = target.href || (target.type === 'resume' ? '/Resume.html' : '');
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
	        if (state.contactForm?.open) {
	          activateContactControl(event);
	          return;
	        }
	        if (launchIntroFromMacPointer('screen')) {
	          event.stopPropagation();
	          event.stopImmediatePropagation?.();
	          return;
	        }
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
	        if (launchIntroFromMacPointer('mouse')) {
	          event.stopPropagation();
	          event.stopImmediatePropagation?.();
	        }
	        return;
	      }
	      if (target.type === 'key') {
	        if (target.label) animateKeyPress(target.label);
	        else animateKeyMeshPress(hit.object);
	        if (state.contactForm?.open) return;
	        if (launchIntroFromMacPointer(target.label || 'key')) {
	          event.stopPropagation();
	          event.stopImmediatePropagation?.();
	          return;
	        }
	        if (state.macGhostwriter?.active) {
	          window.__resumeMacGhostwriterKey?.(target.label || '', {
	            key: target.label === 'Enter' ? 'Enter' : '',
	            physicalAlreadyAnimated: true,
	          });
	          return;
	        }
	        const keyEngineOn = state.visualReelMode || !!window.__resumeStrudelAudioEngine?.enabled;
	        if (!keyEngineOn) {
	          const term = ensureMacTerminal();
	          term.focused = true;
	          term.cursorOn = true;
	          if (target.label) {
	            applyMacTerminalKey(target.label, { shiftKey: false });
	          } else {
	            pushMacTerminalLine('keyboard active. type PLAY then RETURN.');
	            drawMacOffScreen();
	          }
	        } else if (target.label) {
	          playMacKeyClick(target.label);
	        }
	        return;
	      }
	      return;
    };
	    window.addEventListener('pointermove', onPointerMove, { passive: true, capture: true });
	    window.addEventListener('pointerout', onWindowPointerOut, true);
	    window.addEventListener('pointerdown', onWindowPointerDown, true);
	    canvas.addEventListener('pointerleave', onPointerLeave);
	    canvas.addEventListener('pointercancel', onPointerLeave);
	    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.style.cursor = 'pointer';
    return () => {
	      window.removeEventListener('pointermove', onPointerMove, true);
	      window.removeEventListener('pointerout', onWindowPointerOut, true);
	      window.removeEventListener('pointerdown', onWindowPointerDown, true);
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
  }, [animateMouseButton, animateKeyPress, animateKeyMeshPress, animateFloppy, animateMacBloomBurst, applyMacTerminalKey, captureMacKeyboard, closeMacContactForm, drawMacOffScreen, ensureMacTerminal, openMacContactForm, playMacKeyClick, pushMacTerminalLine, setHoveredStickyNote, submitMacContactForm]);

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
      if (stateRef.current.visualReelMode) return undefined;
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
      className={`tv-hero ${engineEnabled ? 'is-live' : 'is-idle'} ${modelReady ? 'is-model-ready' : ''} ${macStageDragEnabled ? 'is-mac-drag-enabled' : ''}`}
      data-mac-drag-x={`${Math.round(macStageDragX)}px`}
      data-mac-drag-bucket={macStageDragBucket}
    >
      <div
        ref={keyboardCaptureRef}
        className="tv-hero__keyboard-capture"
        tabIndex={-1}
        aria-label="Mac terminal keyboard capture"
      />
      <iframe
        ref={handOfGodFrameRef}
        className="tv-hero__hand-of-god-runtime"
        title="Hand of God interactive runtime"
        aria-hidden="true"
        tabIndex={-1}
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
          <HelpPlayer src={src} startOffset={2} />
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

function References({
  items,
  id = 'refs',
  label = '09 · REFERENCES',
}) {
  const refShapes = ['triangle', 'circle', 'square'];
  return (
    <Section id={id} label={label}>
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
  VideoSlot, BlackbirdFeature, HandOfGodFeature, KissNewEraFeature, ScrollAudioLayers, StrudelReplFeature, TvHero, DoomOverlay
});
