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
const POETRY_IN_PROOF_SOURCE = `// "Poetry in Proof" — 153 BPM halftime trap
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
  [4,  intro],
  [8, chorus],
  [8,  verse],
  [4,  preChorus],
  [8, chorus],
  [8,  breakdown]
)`;

const POETRY_IN_PROOF_STORAGE_VERSION = 'v3-intro-lead';
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
  let midiOutputEnabled = false;
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
        const fallbackResult = await evaluateCurrent({ resetTransport: true, recovery: true });
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

  // Suspend the Strudel audio context when the tab is hidden so phones
  // don't keep burning CPU in the background. Resume + fresh pattern
  // evaluation on return so accumulated scheduling state gets reset.
  let wasPlayingBeforeHidden = false;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      wasPlayingBeforeHidden = enabled && !videoDucked;
      if (wasPlayingBeforeHidden) {
        [...liveChordVoices.keys()].forEach((key) => releaseLiveChord(key));
        hushCurrent(true);
      }
    } else if (wasPlayingBeforeHidden) {
      wasPlayingBeforeHidden = false;
      if (enabled && !videoDucked) {
        playCurrent({ resetTransport: true });
      }
    }
  });

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
      midiInput = inputs.find((input) => input.id === inputIdOrName || input.name === inputIdOrName) || inputs[0] || null;
      if (!midiInput) return { enabled: false, name: '' };
      midiInput.onmidimessage = (message) => {
        const [status, note, velocity = 0] = message.data;
        const command = status & 0xf0;
        const channel = (status & 0x0f) + 1;
        const type = command === 0x90 && velocity > 0 ? 'noteon' : command === 0x80 || (command === 0x90 && velocity === 0) ? 'noteoff' : 'control';
        const laneEntry = Object.entries(SCENE_MIDI_MAP).find(([, value]) => value.channel === channel && value.note === note)
          || Object.entries(SCENE_MIDI_MAP).find(([, value]) => value.group === 'drums' && value.note === note);
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
      songPresets[0].composition = source;
      savePoetryInProofDraftSource(source);
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
          window.__resumeActiveSource = source;
          window.__resumeActiveRawSource = source;
          window.dispatchEvent(new CustomEvent('resume-pattern-ready', {
            detail: { pattern: window.__resumeActivePattern || null, source, rawSource: source, songIndex },
          }));
        }
      }
      if (result?.ok && !result?.skipped) rememberGoodComposition(source);
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
  const [shouldLoad, setShouldLoad] = useState(false);
  const rendererRef = useRef(null);
  const audibleRef = useRef(false);
  const mutedRef = useRef(true);
  const pausedRef = useRef(true);
  const userPausedRef = useRef(false);
  const wasPlayingBeforeHiddenRef = useRef(false);
  const keyboardStartPendingRef = useRef(false);
  const resizeTimerRef = useRef(null);

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
	    if ('requestIdleCallback' in window) {
	      idleId = window.requestIdleCallback(warm, { timeout: 1400 });
	    } else {
	      timerId = window.setTimeout(warm, 900);
	    }
	    return () => {
	      cancelled = true;
	      if (idleId) window.cancelIdleCallback?.(idleId);
	      if (timerId) window.clearTimeout(timerId);
	    };
	  }, [src, canPlaySource]);

	  useEffect(() => {
	    const host = hostRef.current;
    const slot = host?.closest('.help-player');
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
	      { rootMargin: '1600px 0px', threshold: 0.01 }
	    );
    observer.observe(slot);
    return () => observer.disconnect();
  }, []);

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
          // HEAD probe first so a missing file fails fast and the
          // placeholder shows immediately instead of stalling.
          const head = await fetch(getVideoUrl(candidate), { method: 'HEAD' }).catch(() => null);
          if (!head?.ok) {
            errors.push(new Error(`HELP source unavailable: ${getVideoUrl(candidate)}`));
            continue;
          }
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
      if (rendererRef.current) { rendererRef.current.dispose(); rendererRef.current = null; }
      if (resizeTimerRef.current) {
        window.clearTimeout(resizeTimerRef.current);
        resizeTimerRef.current = null;
      }
    };
	  }, [src, shouldLoad, forceRendererResize, canPlaySource, getVideoUrl]);

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
    const observer = new IntersectionObserver(
      ([entry]) => {
        const renderer = rendererRef.current;
        if (!renderer) return;
        if (!entry.isIntersecting || entry.intersectionRatio < 0.16) {
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
          return;
        }
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
    return () => observer.disconnect();
  }, [status, forceRendererResize]);

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
    const onVisibilityChange = () => {
      if (document.visibilityState !== 'hidden') return;
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
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [status]);

  const hideHint = () => setShowHint(false);
  const resetHint = () => setShowHint(true);
  const stopPlayback = React.useCallback(() => {
    userPausedRef.current = true;
    wasPlayingBeforeHiddenRef.current = false;
    audibleRef.current = false;
    pausedRef.current = true;
    mutedRef.current = true;
    setPaused(true);
    setMuted(true);
    rendererRef.current?.pauseAndMute?.();
    window.dispatchEvent(new CustomEvent('resume-video-audio-state', {
      detail: { id: 'help-player', active: false },
    }));
  }, []);

  useEffect(() => {
    const onFullscreenExit = (event) => {
      const slot = hostRef.current?.closest('.help-player');
      if (!slot || event.detail?.slot !== slot) return;
      stopPlayback();
      forceRendererResize();
    };
    window.addEventListener('resume-video-fullscreen-exit', onFullscreenExit);
    return () => window.removeEventListener('resume-video-fullscreen-exit', onFullscreenExit);
  }, [stopPlayback, forceRendererResize]);

  const togglePlayback = () => {
    if (!rendererRef.current) return;
    if (paused) {
      userPausedRef.current = false;
      wasPlayingBeforeHiddenRef.current = false;
      window.dispatchEvent(new CustomEvent('resume-video-audio-state', {
        detail: { id: 'help-player', active: true },
      }));
      rendererRef.current.replayWithSound();
    } else {
      stopPlayback();
    }
  };
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
    setShouldLoad(true);
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
    userPausedRef.current = false;
    wasPlayingBeforeHiddenRef.current = false;
    window.dispatchEvent(new CustomEvent('resume-video-audio-state', {
      detail: { id: 'help-player', active: true },
    }));
    const playPromise = renderer.playWithSound
      ? renderer.playWithSound({ restart: false })
      : (() => {
          const video = renderer.current?.loaded?.video;
          if (!video) return renderer.play?.();
          video.muted = false;
          return video.play?.();
        })();
    if (playPromise?.catch) {
      playPromise.catch(() => {
        window.dispatchEvent(new CustomEvent('resume-video-audio-state', {
          detail: { id: 'help-player', active: false },
        }));
      });
    }
  }, []);

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
            <button className="video-control video-control--primary mono" onClick={togglePlayback} aria-label={paused ? 'Play video' : 'Pause video'}>
              <span className={`video-control__icon ${paused ? 'video-control__icon--play' : 'video-control__icon--stop'}`} aria-hidden="true" />
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
    const onVisibilityChange = () => {
      if (document.visibilityState !== 'hidden') return;
      userHeldPlaybackRef.current = true;
      if (window.__resumeHeldVideoSlot === slotIdRef.current) window.__resumeHeldVideoSlot = null;
      video.muted = true;
      if (!video.paused) video.pause();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
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
  { org: "Cannes Lions", award: "Gold · Innovative Use of Tech", diagram: "circles", lane: "kick", midiChannel: 1, midiNote: 36 },
  { org: "Cannes Lions", award: "Gold · Virtual Reality", diagram: "sphere", lane: "snare", midiChannel: 2, midiNote: 38 },
  { org: "SXSW", award: "Gold · AR/VR Breakthrough", diagram: "axis", lane: "hat", midiChannel: 3, midiNote: 42 },
  { org: "Webby", award: "Technical Achievement", diagram: "triangle", lane: "perc", midiChannel: 4, midiNote: 39 },
];

const BLACKBIRD_AWARD_STAMPS = [
  { org: "HPA", award: "Judges Award · Creativity + Innovation", diagram: "axis", lane: "kick", midiChannel: 1, midiNote: 36 },
  { org: "Cannes Lions", award: "Gold · Innovative Use of Tech", diagram: "triangle", lane: "snare", midiChannel: 2, midiNote: 38 },
  { org: "CLIO Awards", award: "2016 · Production Innovation", diagram: "circles", lane: "hat", midiChannel: 3, midiNote: 42 },
];

const DRUM_STAMP_LANES = ["kick", "snare", "hat", "perc"];
const DRUM_STAMP_MIDI = {
  "1:36": "kick",
  "2:38": "snare",
  "3:42": "hat",
  "4:39": "perc",
};

function useDrumLanePulses() {
  const [pulses, setPulses] = useState({});
  const timersRef = useRef({});
  useEffect(() => {
    const emitPulse = (lane, detail = {}) => {
      if (!DRUM_STAMP_LANES.includes(lane)) return;
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
      if (detail.type !== "noteon" || detail.group !== "drums") return;
      const lane = detail.lane || DRUM_STAMP_MIDI[`${detail.channel}:${detail.note}`];
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
      const midiKey = Object.keys(DRUM_STAMP_MIDI).find((key) => DRUM_STAMP_MIDI[key] === lane) || "1:36";
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
  const pulses = useDrumLanePulses();
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

function BlackbirdFeature({ innovationSrc, behindScenesSrc }) {
  return (
    <Section id="blackbird" label="04 · LIVE · THE MILL BLACKBIRD">
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

function StrudelReplFeature() {
  const textareaRef = React.useRef(null);
  const overlayRef = React.useRef(null);
  const tokenCursorRef = React.useRef({});
  const highlightGenerationRef = React.useRef(0);
  const activeHighlightSourceRef = React.useRef('');
  const flashTimersRef = React.useRef(new Set());
  const [status, setStatus] = React.useState('idle'); // idle | loading | playing | error
  const [editStatus, setEditStatus] = React.useState('ready');
  const [errorMsg, setErrorMsg] = React.useState('');
  const [code, setCode] = React.useState(() => getStoredPoetryInProofDraftSource());
  // Source string the engine actually evaluated. Drives the highlight
  // overlay: hap locations refer to positions in this string, not the
  // user-editable textarea.
  const [engineSource, setEngineSource] = React.useState(null);

  const syncScroll = React.useCallback(() => {
    const ta = textareaRef.current;
    const ov = overlayRef.current;
    if (ta && ov) {
      ov.scrollTop = ta.scrollTop;
      ov.scrollLeft = ta.scrollLeft;
    }
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
      const result = await engine.setCompositionSource(code, {
        resetTransport: engine.enabled,
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
      setEngineSource(code);
      setEditStatus('applied');
      setStatus('playing');
    } catch (error) {
      setStatus('error');
      setEditStatus('error');
      setErrorMsg((error && error.message) || String(error));
    }
  }, [code]);

  const resetCode = React.useCallback(() => {
    setErrorMsg('');
    const engine = getResumeAudioEngine();
    const source = engine?.resetCompositionSource
      ? engine.resetCompositionSource({ resetTransport: engine.enabled })
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
    tokenCursorRef.current = {};
    clearReplTokenFlashes();
  }, [clearReplTokenFlashes]);

  const handleCodeChange = React.useCallback((event) => {
    const next = event.target.value;
    setCode(next);
    savePoetryInProofDraftSource(next);
    setEditStatus('dirty');
    resetReplHighlighter('');
  }, [resetReplHighlighter]);

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
    const exact = overlay.querySelector(`[data-start="${loc.start}"]`);
    if (exact) return exact;
    const locStart = loc.start;
    const locEnd = typeof loc.end === 'number' ? loc.end : locStart + 1;
    const tokens = overlay.querySelectorAll('.sr-tok[data-start][data-end]');
    for (const span of tokens) {
      const start = Number(span.dataset.start);
      const end = Number(span.dataset.end);
      if (!Number.isFinite(start) || !Number.isFinite(end)) continue;
      const startInsideToken = start <= locStart && locStart < end;
      const tokenInsideLocation = locStart <= start && start < locEnd;
      if (startInsideToken || tokenInsideLocation) return span;
    }
    return null;
  }, []);

  const normalizeReplToken = React.useCallback((value) => (
    String(value ?? '')
      .replace(/^RolandTR\d+_/i, '')
      .trim()
      .toLowerCase()
  ), []);

  const getMidiDetailTokens = React.useCallback((detail = {}) => {
    const raw = detail.raw || {};
    const source = raw.note ?? raw.n ?? raw.midinote ?? raw.s ?? raw.value ?? '';
    const values = Array.isArray(source) ? source : [source];
    return values.map(normalizeReplToken).filter(Boolean);
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
      if (!(event.ctrlKey || event.metaKey) || event.altKey) return;
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
      const nextSource = e.detail?.rawSource ?? e.detail?.source ?? '';
      setEngineSource(nextSource || null);
      resetReplHighlighter(nextSource || '');
    };
    const initialSource = window.__resumeActiveRawSource || window.__resumeActiveSource || '';
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
  // locations; we look up the matching span in the overlay (tagged with
  // data-start) and add an `is-flash` class for a brief moment.
  React.useEffect(() => {
    let cancelled = false;
    const setup = () => {
      const pattern = window.__resumeActivePattern;
      if (!pattern || typeof pattern.draw !== 'function') return;
      // The engine can rewrite the evaluated source to apply mixer gains.
      // When that happens, Strudel location offsets no longer line up with
      // the visible editor text; let the MIDI-event fallback drive token
      // flashes instead so we do not highlight the wrong note.
      if (window.__resumeActiveSource && window.__resumeActiveSource !== code) return;
      const generation = highlightGenerationRef.current;
      const visibleSource = code;
      // Replace any previous draw registration with same id.
      try {
        pattern.draw((haps, time) => {
          if (cancelled) return;
          if (generation !== highlightGenerationRef.current) return;
          if (activeHighlightSourceRef.current !== visibleSource) return;
          const overlay = overlayRef.current;
          if (!overlay) return;
          for (const hap of haps) {
            // Active during this frame? whole.{begin,end} are Fractions of cycles.
            const beg = hap.whole?.begin?.valueOf?.();
            const end = hap.whole?.end?.valueOf?.();
            if (beg == null || end == null) continue;
            if (time < beg || time >= end) continue;
            const locs = hap.context?.locations || [];
            // Innermost location is the most specific (individual token).
            const loc = locs[locs.length - 1];
            if (!loc || typeof loc.start !== 'number') continue;
            const span = findTokenSpanForLocation(overlay, loc);
            const dur = Math.max(80, Math.min(220, (end - beg) * 1000 * 0.8));
            flashReplTokenSpan(span, dur, generation);
          }
        }, { id: 'strudel-repl-flash', lookahead: 0.02, lookbehind: 0 });
      } catch (err) {
        // Pattern may have been detached between events — silent.
      }
    };
    const onReady = () => setup();
    window.addEventListener('resume-pattern-ready', onReady);
    if (window.__resumeActivePattern) setup();
    return () => {
      cancelled = true;
      window.removeEventListener('resume-pattern-ready', onReady);
    };
  }, [code, findTokenSpanForLocation, flashReplTokenSpan]);

  React.useEffect(() => {
    const onMidi = (event) => {
      const detail = event.detail || {};
      if (detail.source === 'webmidi') return;
      if (activeHighlightSourceRef.current !== code) return;
      // If the evaluated Strudel source matches the editor, pattern.draw
      // has exact source locations. Do not also run the approximate MIDI
      // fallback, because repeated notes across sections can flash the
      // wrong block.
      if (window.__resumeActiveSource === code) return;
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
  // Inside string literals, individual mini-notation tokens (bd, hh, f4,
  // c1, ~, etc.) get their own <span class="sr-tok" data-start="N"> so the
  // pattern-draw loop can flash exactly the token that's sounding.
  const highlighted = React.useMemo(() => {
    const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;' })[c]);
    const highlightCode = (txt) => {
      let h = esc(txt);
      h = h.replace(/\b(setcpm|stack|note|arrange|const|sine)\b/g, '<span class="sr-kw">$1</span>');
      h = h.replace(/\.([a-zA-Z][a-zA-Z0-9]*)(?=\()/g, '.<span class="sr-fn">$1</span>');
      h = h.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="sr-num">$1</span>');
      return h;
    };
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
      const trigger = block.match(/\.onTrigger\(\s*T\.([A-Za-z0-9_]+)\s*,\s*false\s*\)/)?.[1];
      return triggerToLane[trigger] || '';
    };
    const sectionsForStringAt = (src, offset) => {
      const prevSemi = src.lastIndexOf(';', offset);
      const nextSemi = src.indexOf(';', offset);
      const block = src.slice(prevSemi === -1 ? 0 : prevSemi + 1, nextSemi === -1 ? src.length : nextSemi + 1);
      const constName = block.match(/\bconst\s+([A-Za-z0-9_]+)/)?.[1] || '';
      if (/preChorus/i.test(constName)) return ['preChorus'];
      if (/Chorus/.test(constName)) return ['intro', 'chorus'];
      if (/Verse/.test(constName)) return ['verse'];
      if (/Break|outro/i.test(constName)) return ['breakdown'];
      if (constName === 'subBass') return ['chorus', 'verse'];
      if (/^kick$/.test(constName)) return ['chorus'];
      return [];
    };
    // Wrap individual mini-notation tokens inside "..." so they can be
    // targeted by hap source-positions during playback. Each `data-start`
    // attribute carries the absolute character offset in `code`.
    const tokeniseString = (lit, baseOffset, lane = '', sections = []) => {
      // lit includes the surrounding double-quotes
      let out = '<span class="sr-str">"';
      let k = 1; // skip opening quote
      while (k < lit.length - 1) {
        const c = lit[k];
        // Skip whitespace, brackets, modifiers — render verbatim
        if (/[\s<>\[\]()*~,!?:]/.test(c)) {
          out += esc(c);
          k++;
          continue;
        }
        // Read run of token characters (letters, digits, decimal points, sharps/flats markers, slashes)
        let m = k;
        while (m < lit.length - 1 && /[A-Za-z0-9#.\/\-]/.test(lit[m])) m++;
        if (m > k) {
          const tok = lit.slice(k, m);
          const start = baseOffset + k;
          const attrs = [
            `data-start="${start}"`,
            `data-end="${baseOffset + m}"`,
            `data-token="${normalizeReplToken(tok)}"`,
            lane ? `data-lane="${lane}"` : '',
            sections.length ? `data-sections="${sections.join(' ')}"` : '',
          ].filter(Boolean).join(' ');
          out += `<span class="sr-tok" ${attrs}>${esc(tok)}</span>`;
          k = m;
        } else {
          out += esc(c);
          k++;
        }
      }
      out += '"</span>';
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
      } else if (ch === '"') {
        let j = i + 1;
        while (j < src.length && src[j] !== '"' && src[j] !== '\n') j++;
        const stop = j < src.length && src[j] === '"' ? j + 1 : j;
        out += tokeniseString(src.slice(i, stop), i, laneForStringAt(src, i), sectionsForStringAt(src, i));
        i = stop;
      } else {
        let j = i;
        while (j < src.length) {
          if (src[j] === '"') break;
          if (src[j] === '/' && src[j + 1] === '/') break;
          j++;
        }
        out += highlightCode(src.slice(i, j));
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
    <Section id="strudel" label="05 · LIVE CODE · POETRY IN PROOF">
      <aside className="help-feature__notes help-feature__notes--match-stack strudel-repl__intro">
        <h3 className="serif">A browser-based music and interactive visuals demo.</h3>
        <p>
          <strong>Poetry in Proof</strong> is a browser-based music and
          interactive visuals demo running on this website. The music is
          composed in Strudel, with custom code producing MIDI triggers that
          drive real-time page animations, text and code highlights, the MIDI
          monitor, and Mac screen reactions. The code editor is live, so the
          composition can be changed while the page is running. When MIDI OUT is
          enabled, those same triggers can be sent to an external MIDI
          destination such as IAC Driver or a network MIDI session. Web MIDI is
          bound to every lane, so sections, chords, and drums are all
          addressable from external hardware or remote rigs.
        </p>
      </aside>
      <div className="help-feature strudel-repl">
        <div className="help-feature__player-col help-feature__player-col--wide">
          <div className="strudel-repl__macbook">
            <div className="strudel-repl__panel">
              <div className="strudel-repl__editor">
                <pre
                  className="strudel-repl__overlay"
                  ref={overlayRef}
                  aria-hidden="true"
                  dangerouslySetInnerHTML={{ __html: highlighted }}
                />
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
              <ul className="job__bullets">
                {job.bullets.map((b, j) => (<li key={j}>{b}</li>))}
              </ul>
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
const DOOM_TERMINAL_COMMANDS = new Set(['doom', 'doom.exe', './doom', 'run doom', 'launch doom', 'open doom']);

function getDoomIframeUrl() {
  return new URL('doom.html', window.location.href).href;
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
  space: 'Space',
};

const MAC_KEY_BY_CHAR = Object.fromEntries(
  Object.entries(MAC_KEY_DEFS).flatMap(([code, def]) => (
    def.char
      ? [[def.char.toLowerCase(), code], [def.shiftChar?.toLowerCase?.(), code]].filter(([key]) => key)
      : []
  ))
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

function TvHero({ sources = [], vocalSamples = [], children }) {
  const wrapRef = React.useRef(null);
  const canvasRef = React.useRef(null);
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
    lastHatStutterAt: 0,
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
	    macBloomRaf: 0,
	    tvVisible: true,
	    tabVisible: typeof document === 'undefined' ? true : !document.hidden,
	    requestRender: null,
	    powerPausedVideo: null,
	    powerToggleInFlight: false,
	    terminal: null,
	  });
  const [engineEnabled, setEngineEnabled] = React.useState(false);
  const [availableSources, setAvailableSources] = React.useState(() => sources);
  const [phase, setPhase] = React.useState('burst');
  const phaseRef = React.useRef('burst');
  const lastCutRef = React.useRef(0);
  const lastChordKeyRef = React.useRef(null);
  const currentIdxRef = React.useRef(-1);

  React.useEffect(() => { phaseRef.current = phase; }, [phase]);

  React.useEffect(() => {
    setAvailableSources(sources);
  }, [sources]);

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
        mode: detail.mode || 'phrase',
      },
    });
  }, []);

  const playVocalRegion = React.useCallback(async (sample, region = {}, detail = {}) => {
    if (!sample || stateRef.current.tabVisible === false || stateRef.current.tvVisible === false) return;
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
  }, [VOCAL_HOOK_VOLUME, emitVocalMidi, getMusicAudioContext, loadVocalSampleBuffer]);

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

  const ensureMacTerminal = React.useCallback(() => {
    const state = stateRef.current;
    if (!state.terminal) {
      state.terminal = {
        input: '',
        cursorOn: true,
        focused: true,
        lines: [
          'MacTerminal 1.1',
          'System 1 Finder session',
          '',
          'Type HELP for commands.',
        ],
      };
    }
    return state.terminal;
  }, []);

  const pushMacTerminalLine = React.useCallback((line = '') => {
    const term = ensureMacTerminal();
    term.lines = [...term.lines, line].slice(-12);
  }, [ensureMacTerminal]);

  // Paint the Mac's inactive screen as a period-ish monochrome terminal.
  // Draw directly at texture resolution so the UI keeps the vintage shape
  // without turning into a jagged low-res texture on the curved screen.
  const drawMacOffScreen = React.useCallback(() => {
    const { ctx2d, screenCanvas, screenTex } = stateRef.current;
    if (!ctx2d || !screenCanvas) return;
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
    const uiFont = '"Chicago", Geneva, "Lucida Grande", Arial, sans-serif';
    const monoFont = 'Monaco, "Courier New", monospace';

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
    const wx = px(w * 0.085);
    const wy = menuH + px(h * 0.058);
    const ww = px(w * 0.83);
    const wh = px(h * 0.71);
    const titleH = px(h * 0.048);
    ctx2d.fillStyle = paper;
    ctx2d.fillRect(wx, wy, ww, wh);
    ctx2d.strokeStyle = black;
    ctx2d.lineWidth = 3;
    ctx2d.strokeRect(wx, wy, ww, wh);
    ctx2d.lineWidth = 2;
    ctx2d.strokeRect(wx + 5, wy + 5, ww - 10, wh - 10);

    const titleY = wy + 6;
    const titleText = 'MacTerminal';
    ctx2d.save();
    ctx2d.beginPath();
    ctx2d.rect(wx + 8, titleY, ww - 16, titleH - 8);
    ctx2d.clip();
    ctx2d.strokeStyle = black;
    ctx2d.lineWidth = 2;
    for (let y = titleY + 4; y < titleY + titleH - 8; y += 8) {
      ctx2d.beginPath();
      ctx2d.moveTo(wx + 12, y);
      ctx2d.lineTo(wx + ww - 12, y);
      ctx2d.stroke();
    }
    ctx2d.restore();
    ctx2d.fillStyle = paper;
    const titleW = px(w * 0.17);
    const titleX = px(wx + ww / 2 - titleW / 2);
    ctx2d.fillRect(titleX, wy + 6, titleW, titleH - 8);
    ctx2d.font = `bold ${px(h * 0.021)}px ${uiFont}`;
    ctx2d.fillStyle = black;
    ctx2d.textAlign = 'center';
    ctx2d.fillText(titleText, wx + ww / 2, wy + px(titleH * 0.68));
    ctx2d.fillText(titleText, wx + ww / 2 + uiTextOffset, wy + px(titleH * 0.68));
    ctx2d.textAlign = 'left';

    const closeSize = px(h * 0.024);
    ctx2d.strokeRect(wx + px(w * 0.018), wy + px(h * 0.015), closeSize, closeSize);
    ctx2d.strokeRect(wx + ww - px(w * 0.034), wy + titleH + 4, px(w * 0.015), wh - titleH - px(h * 0.043));
    ctx2d.fillRect(wx + ww - px(w * 0.034), wy + titleH + 4, px(w * 0.015), 2);
    ctx2d.fillRect(wx + ww - px(w * 0.034), wy + wh - px(h * 0.04), px(w * 0.015), 2);

    ctx2d.save();
    ctx2d.beginPath();
    const tx = wx + px(w * 0.034);
    const ty = wy + titleH + px(h * 0.034);
    const tw = ww - px(w * 0.088);
    const th = wh - titleH - px(h * 0.072);
    ctx2d.rect(tx, ty, tw, th);
    ctx2d.clip();
    ctx2d.fillStyle = black;
    const fontSize = px(h * 0.038);
    const lineHeight = px(fontSize * 1.42);
    ctx2d.font = `${fontSize}px ${monoFont}`;
    const prompt = 'tawfeeq$ ';
    const allLines = [
      ...term.lines,
      `${prompt}${term.input}`,
    ];
    const visibleCount = Math.max(6, Math.floor(th / lineHeight));
    const visible = allLines.slice(-visibleCount);
    const textX = tx;
    const drawTerminalText = (line, x, baseline) => {
      ctx2d.fillText(line, x, baseline);
      ctx2d.fillText(line, x + Math.max(1, px(fontSize * 0.018)), baseline);
    };
    let y = ty + fontSize;
    for (const line of visible) {
      drawTerminalText(line, textX, y);
      y += lineHeight;
    }
    if (term.cursorOn) {
      const current = `${prompt}${term.input}`;
      const cursorX = textX + Math.min(tw - px(w * 0.04), ctx2d.measureText(current).width);
      const cursorY = y - lineHeight - px(fontSize * 0.78);
      ctx2d.fillStyle = black;
      ctx2d.fillRect(cursorX + 2, cursorY, px(fontSize * 0.58), px(fontSize * 1.05));
    }
    ctx2d.restore();

    ctx2d.globalCompositeOperation = 'source-over';
    const vg = ctx2d.createRadialGradient(w / 2, h / 2, w * 0.28, w / 2, h / 2, w * 0.68);
    vg.addColorStop(0, 'rgba(255,255,255,0.015)');
    vg.addColorStop(1, 'rgba(0,0,0,0.08)');
    ctx2d.fillStyle = vg;
    ctx2d.fillRect(0, 0, w, h);
    ctx2d.globalCompositeOperation = 'source-over';
    ctx2d.restore();
    if (screenTex) {
      screenTex.needsUpdate = true;
      stateRef.current.requestRender?.();
    }
  }, [ensureMacTerminal]);

  // Draw a source image to the offscreen screen canvas with a light wash.
  const drawSourceToCanvas = React.useCallback((img, effect = null) => {
    const { ctx2d, screenCanvas, screenTex } = stateRef.current;
    if (!ctx2d || !screenCanvas) return;
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

    if (screenTex) {
      screenTex.needsUpdate = true;
      stateRef.current.requestRender?.();
    }
  }, []);

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
    }
    // Clap or power-on: vertical-hold drift — full image scrolls vertically
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
  }, [drawSourceToCanvas]);

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

  // Floppy slide in/out. Returns a promise that resolves when the slide
  // completes so callers can sequence (e.g., wait for insert before audio).
  const animateFloppy = React.useCallback((inserted) => {
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
  }, [drawMacBloom, drawSourceToCanvas]);

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
      pushMacTerminalLine('PLAY     insert disk and run song');
      pushMacTerminalLine('DOOM     boot fullscreen Doom');
      pushMacTerminalLine('STATUS   print audio engine state');
      pushMacTerminalLine('RESET    restore last-good source');
      pushMacTerminalLine('CLEAR    clear terminal');
      pushMacTerminalLine('ABOUT    describe this system');
      drawMacOffScreen();
      return;
    }
    if (lower === 'clear' || lower === 'cls') {
      const term = ensureMacTerminal();
      term.lines = ['MacTerminal 1.1', 'System 1 Finder session', '', 'Type HELP for commands.'];
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
      pushMacTerminalLine('loading DOOM.EXE...');
      pushMacTerminalLine('halting site audio...');
      drawMacOffScreen();
      try {
        if (engine?.enabled) await engine.setEnabled(false);
        await animateFloppy(true);
        await animateMacBloomBurst('powerOn');
        pushMacTerminalLine('fullscreen handoff armed.');
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
          pushMacTerminalLine('audio failed; use RESET then PLAY.');
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
      const cmd = term.input;
      term.input = '';
      runMacTerminalCommand(cmd);
      return true;
    }
    if (def.action === 'backspace') {
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
    term.input = (term.input + nextChar).slice(-64);
    term.cursorOn = true;
    drawMacOffScreen();
    return true;
  }, [drawMacOffScreen, ensureMacTerminal, runMacTerminalCommand]);

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
          const remaining = Math.max(0, (m.activeUntil - now) / m.duration);
          const curve = m.kind === 'clap' ? Math.pow(remaining, 1.6) : Math.pow(remaining, 1.1);
          // Band phase sweeps from bandStart to bandEnd over the burst.
          const elapsed = now - (m.started || (m.activeUntil - m.duration));
          const t01 = Math.min(1, elapsed / m.duration);
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

  const applyHatStutter = React.useCallback((detail = {}) => {
    const state = stateRef.current;
    if (state.tabVisible === false || state.tvVisible === false) return;
    if (state.channelFlipping || !state.currentVideo || state.currentVideo.paused) return;
    const now = performance.now();
    if (now - state.lastHatStutterAt < 1450) return;
    if ((detail.id || 0) % 4 !== 1) return;
    state.lastHatStutterAt = now;
    const video = state.currentVideo;
    const holdMs = Math.max(38, Math.min(58, (detail.duration || 90) * 0.45));
    try { video.pause(); } catch {}
    window.setTimeout(() => {
      if (state.currentVideo !== video || state.tabVisible === false || state.tvVisible === false) return;
      if (!window.__resumeStrudelAudioEngine?.enabled) return;
      try {
        const playPromise = video.play?.();
        if (playPromise?.catch) playPromise.catch(() => {});
      } catch {}
    }, holdMs);
  }, []);

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
      cancelAnimationFrame(state.raf);
      state.raf = 0;
      cancelVideoCallbacks();
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
      const active = state.tabVisible !== false && state.tvVisible !== false;
      if (active) resumeTvWork();
      else pauseTvWork();
    };
    const onVisibility = () => {
      state.tabVisible = !document.hidden;
      syncPowerState();
    };
    document.addEventListener('visibilitychange', onVisibility);
    let observer = null;
    if (typeof IntersectionObserver !== 'undefined' && wrapRef.current) {
      observer = new IntersectionObserver((entries) => {
        state.tvVisible = entries.some((entry) => entry.isIntersecting);
        syncPowerState();
      }, { rootMargin: '640px 0px' });
      observer.observe(wrapRef.current);
    }
    onVisibility();
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      observer?.disconnect();
    };
  }, [drawVideoLoop, engineEnabled, pauseAllCachedVideos, stopVocalSamples]);

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
    if (!availableSources.length) return;
    const idx = pickIndex(lane, options);
    currentIdxRef.current = idx;
    const source = availableSources[idx];
    const src = source.url;
    const now = performance.now();
    stateRef.current.currentLane = lane || source.lanes?.[0] || 'idle';
    stateRef.current.currentCutMode = options.mode || 'normal';
    stateRef.current.lastCutAt = now;
    if (lane === 'snare') stateRef.current.lastRhythmCutAt = now;
    const cutToken = (stateRef.current.cutToken || 0) + 1;
    stateRef.current.cutToken = cutToken;
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
        if (stateRef.current.cutToken !== cutToken) {
          if (stateRef.current.currentVideo !== video) {
            try { video.pause(); } catch {}
          }
          return;
        }
        const previousVideo = stateRef.current.currentVideo;
        if (previousVideo && previousVideo !== video) {
          previousVideo.muted = true;
          try { previousVideo.pause(); } catch {}
        }
        stateRef.current.currentImage = null;
        stateRef.current.currentMedia = video;
        stateRef.current.currentSource = source;
        stateRef.current.currentFit = source.fit || 'contain';
        stateRef.current.currentMatteAspect = source.matteAspect || null;
        stateRef.current.currentPunchIn = source.punchIn || 1;
        video.loop = false;
        video.muted = true;
        video.defaultMuted = true;
        video.volume = 0;
        video.onended = () => {
          const state = stateRef.current;
          if (state.currentVideo !== video || state.currentMedia !== video) return;
          if (state.tabVisible === false || state.tvVisible === false) return;
          if (!window.__resumeStrudelAudioEngine?.enabled) return;
          cutRef.current?.(state.currentLane || lane || 'idle', {
            mode: state.currentCutMode === 'sparse' ? 'sparse' : 'normal',
          });
        };
        try { video.currentTime = source.start ?? 0; } catch {}
        const playPromise = video.play?.();
        if (playPromise?.catch) {
          playPromise.catch(() => {});
        }
        drawVideoLoop(video);
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
      if (stateRef.current.cutToken !== cutToken) return;
      stateRef.current.currentImage = img;
      stateRef.current.currentMedia = img;
      stateRef.current.currentSource = source;
      stateRef.current.currentFit = source.fit || 'cover';
      stateRef.current.currentMatteAspect = source.matteAspect || null;
      drawSourceToCanvas(img);
    } else {
      img.onload = () => {
        if (stateRef.current.cutToken !== cutToken) return;
        stateRef.current.currentImage = img;
        stateRef.current.currentMedia = img;
        stateRef.current.currentSource = source;
        stateRef.current.currentFit = source.fit || 'cover';
        stateRef.current.currentMatteAspect = source.matteAspect || null;
      stateRef.current.currentPunchIn = source.punchIn || 1;
        drawSourceToCanvas(img);
      };
    }
  }, [availableSources, pickIndex, drawSourceToCanvas, drawVideoLoop, stopVideoLoop, trimVideoCache]);
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
      renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio || 1));
      // Use the canvas's CSS dimensions (which include the negative-top
      // overflow). Renderer setSize is called inside the tick loop too,
      // so the seed value here doesn't matter much.
      renderer.setSize(canvas.clientWidth || 800, canvas.clientHeight || 400, false);
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.62;

      const scene = new THREE.Scene();
      scene.background = null;

      const camera = new THREE.PerspectiveCamera(34, (canvas.clientWidth || 800) / (canvas.clientHeight || 800), 0.01, 100);
      camera.position.set(0.45, 0.52, 2.5);
      camera.lookAt(0, 0.42, -0.13);

      const frameModel = (box) => {
        const sphere = box.getBoundingSphere(new THREE.Sphere());
        const isMobileFrame = window.matchMedia('(max-width: 760px)').matches;
        const target = sphere.center.clone();
        target.y += sphere.radius * (isMobileFrame ? 0.06 : 0.02);
        if (isMobileFrame) target.x -= sphere.radius * 0.46;
        const verticalFov = THREE.MathUtils.degToRad(camera.fov);
        const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * camera.aspect);
        const fitHeightDistance = sphere.radius / Math.sin(verticalFov / 2);
        const fitWidthDistance = sphere.radius / Math.sin(horizontalFov / 2);
        // Pull camera ~30% closer so the Mac fills more of the canvas.
        const distance = Math.max(fitHeightDistance, fitWidthDistance) * (isMobileFrame ? 1.18 : 0.89);
        const viewDirection = new THREE.Vector3(
          isMobileFrame ? 0.08 : 0.32,
          isMobileFrame ? 0.12 : 0.14,
          1,
        ).normalize();
        camera.position.copy(target).add(viewDirection.multiplyScalar(distance));
        camera.near = Math.max(0.01, distance - sphere.radius * 3.0);
        camera.far = distance + sphere.radius * 4.0;
        camera.lookAt(target);
        camera.updateProjectionMatrix();
      };

      const key = new THREE.DirectionalLight(0xfff7e8, 2.35);
      key.position.set(-2.15, 1.85, 1.05);
      scene.add(key);
      const fill = new THREE.DirectionalLight(0xe8eef7, 0.14);
      fill.position.set(2.0, 0.45, 1.45);
      scene.add(fill);
      const rim = new THREE.DirectionalLight(0xffe6bd, 1.15);
      rim.position.set(-0.65, 2.05, -1.8);
      scene.add(rim);
      const keyboardGrazing = new THREE.DirectionalLight(0xffd6a6, 0.36);
      keyboardGrazing.position.set(1.2, -0.65, 1.6);
      scene.add(keyboardGrazing);
      // Keep global fill low so the front face and keyboard hold shape.
      scene.add(new THREE.HemisphereLight(0xfff0d8, 0x0c0a08, 0.13));
      scene.add(new THREE.AmbientLight(0xffffff, 0.012));

      // Offscreen canvas for the screen content
      const screenCanvas = document.createElement('canvas');
      // Keep the CRT texture high enough for text, but below the previous
      // 2048x1536 path that made video uploads expensive.
      screenCanvas.width = 1536; screenCanvas.height = 1152;
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
        // 'Screen' = Trinitron's separated curved glass mesh.
        // 'Mesh75' = Apple Macintosh classic screen.
        let screenMeshes = allMeshes.filter((m) => /^screen$|^mesh75$/i.test(m.name));
        if (!screenMeshes.length && allMeshes.length >= 2) {
          const sorted = allMeshes.slice().sort((a, b) => b.geometry.attributes.position.count - a.geometry.attributes.position.count);
          screenMeshes = sorted.slice(1);
        }
        const makeMacScreenProxy = () => {
          const screenMesh = screenMeshes[0];
          if (!screenMesh?.geometry) return null;
          screenMesh.geometry.computeBoundingBox();
          const bb = screenMesh.geometry.boundingBox;
          const center = bb.getCenter(new THREE.Vector3()).add(screenMesh.position);
          const size = bb.getSize(new THREE.Vector3());
          const width = size.x * 0.965;
          const height = size.y * 0.955;
          const positions = screenMesh.geometry.attributes.position;
          let sumY = 0, sumZ = 0, sumYY = 0, sumYZ = 0;
          for (let i = 0; i < positions.count; i++) {
            const y = positions.getY(i);
            const z = positions.getZ(i);
            sumY += y;
            sumZ += z;
            sumYY += y * y;
            sumYZ += y * z;
          }
          const denom = positions.count * sumYY - sumY * sumY;
          const tiltZPerY = Math.abs(denom) > 1e-6
            ? (positions.count * sumYZ - sumY * sumZ) / denom
            : 0;
          const interceptZ = positions.count
            ? (sumZ - tiltZPerY * sumY) / positions.count
            : center.z;
          const fittedCenterZ = tiltZPerY * (center.y - screenMesh.position.y) + interceptZ + screenMesh.position.z;
          const geo = new THREE.PlaneGeometry(width, height, 1, 1);
          const pos = geo.attributes.position;
          for (let i = 0; i < pos.count; i++) {
            pos.setZ(i, tiltZPerY * pos.getY(i));
          }
          pos.needsUpdate = true;
          const uv = geo.attributes.uv;
          for (let i = 0; i < uv.count; i++) uv.setY(i, 1 - uv.getY(i));
          uv.needsUpdate = true;
          geo.computeVertexNormals();
          const proxy = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
            map: screenTex,
            toneMapped: false,
            side: THREE.FrontSide,
          }));
          proxy.name = 'MacScreenTextureProxy';
          proxy.position.set(center.x, center.y, fittedCenterZ + 0.035);
          model.add(proxy);
          return proxy;
        };
        if (stateRef.current.deviceMode === 'mac') {
          const originalScreenMeshes = [...screenMeshes];
          const proxy = makeMacScreenProxy();
          if (proxy) {
            originalScreenMeshes.forEach((m) => { m.visible = false; });
            screenMeshes = [proxy];
          } else {
            for (const m of screenMeshes) {
              m.material = new THREE.MeshBasicMaterial({ map: screenTex, toneMapped: false });
            }
          }
        } else {
          for (const m of screenMeshes) {
            m.material = new THREE.MeshBasicMaterial({ map: screenTex, toneMapped: false });
          }
        }
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
            homeY: mesh.position.y,
            depth: (gb.max.y - gb.min.y) * depthScale,
            raf: 0,
          };
        }
        for (const [alias, code] of Object.entries(MAC_KEY_ALIASES)) {
          if (stateRef.current.keys[code]) stateRef.current.keys[alias] = stateRef.current.keys[code];
        }
        console.info('[TvHero] keys ready:', Object.keys(stateRef.current.keys));
        // Floppy disk = Mesh84 (front label sliver) + Mesh273 (disk body
        // inside the case). Both translate together so the whole disk
        // ejects/inserts as one unit.
        const FLOPPY_MESHES = ['Mesh84', 'Mesh273'];
        const floppyParts = FLOPPY_MESHES
          .map((n) => allMeshes.find((m) => m.name === n))
          .filter(Boolean);
        const mouseBody = allMeshes.find((m) => m.name === 'Mesh70');
        const mouseButton = allMeshes.find((m) => m.name === 'Mesh284');
        const makeStickerTexture = (draw) => {
          const c = document.createElement('canvas');
          c.width = 256;
          c.height = 96;
          const cx = c.getContext('2d');
          draw(cx, c.width, c.height);
          const texture = new THREE.CanvasTexture(c);
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
          texture.minFilter = renderer.capabilities.isWebGL2 ? THREE.LinearMipmapLinearFilter : THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.generateMipmaps = !!renderer.capabilities.isWebGL2;
          return texture;
        };
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
        const addHitTarget = (mesh, type, label = '') => {
          if (!mesh) return;
          hitTargets.set(mesh.uuid, { type, label });
        };
        [mouseBody, mouseButton].forEach((m) => addHitTarget(m, 'mouse'));
        screenMeshes.forEach((m) => addHitTarget(m, 'screen'));
        floppyParts.forEach((m) => addHitTarget(m, 'floppy'));
        keycapMeshes.forEach((m) => addHitTarget(m, 'key'));
        for (const code of Object.keys(MAC_KEY_DEFS)) {
          const key = stateRef.current.keys?.[code];
          if (key) addHitTarget(key.mesh, 'key', code);
        }
        const hitMeshPool = [...allMeshes, ...screenMeshes];
        stateRef.current.macHitMeshes = Array.from(hitTargets.keys())
          .map((uuid) => hitMeshPool.find((m) => m.uuid === uuid))
          .filter(Boolean);
        stateRef.current.macHitTargets = hitTargets;
        stateRef.current.mouseHitMeshes = [mouseBody, mouseButton].filter(Boolean);
        const box = new THREE.Box3().setFromObject(model);
        const ctr = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        if (stateRef.current.deviceMode === 'mac') {
          const sideTexture = makeStickerTexture((cx, w, h) => {
            cx.fillStyle = '#e9e5d5';
            cx.fillRect(0, 0, w, h);
            cx.fillStyle = '#d9251d';
            cx.fillRect(0, 0, Math.floor(w * 0.2), h);
            cx.fillStyle = '#2157a4';
            cx.fillRect(Math.floor(w * 0.2), 0, Math.floor(w * 0.18), h);
            cx.fillStyle = '#111';
            cx.globalAlpha = 0.52;
            cx.fillRect(Math.floor(w * 0.48), Math.floor(h * 0.28), Math.floor(w * 0.38), 5);
            cx.fillRect(Math.floor(w * 0.48), Math.floor(h * 0.48), Math.floor(w * 0.28), 5);
            cx.globalAlpha = 0.18;
            cx.fillRect(0, h - 5, w, 5);
            cx.globalAlpha = 1;
          });
          const sideSticker = new THREE.Mesh(
            new THREE.PlaneGeometry(size.z * 0.18, size.y * 0.052),
            new THREE.MeshBasicMaterial({
              map: sideTexture,
              toneMapped: false,
              side: THREE.DoubleSide,
            })
          );
          sideSticker.name = 'MacSideProductionSticker';
          sideSticker.position.set(box.max.x + size.x * 0.006, ctr.y - size.y * 0.04, ctr.z + size.z * 0.18);
          sideSticker.rotation.set(0, Math.PI / 2, -0.035);
          model.add(sideSticker);
        }
        console.info('[TvHero] bbox center:', ctr, 'size:', size);
        stateRef.current.bbox = { box, ctr };
        stateRef.current.frameModel = () => frameModel(box);
        stateRef.current.frameModel();
        // Initial state: Mac boots powered-off with the "click to start"
        // prompt. TV mode boots with a starter cut.
        if (stateRef.current.deviceMode === 'mac') {
          if (window.__resumeStrudelAudioEngine?.enabled) {
            cutRef.current?.('init');
          } else {
            drawMacOffScreen();
          }
        } else {
          cutRef.current?.('init');
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
      if (isEditableTarget(event.target)) return;
      const code = getMacKeyCodeFromEvent(event);
      if (code) animateKeyPress(code);
      if (window.__resumeStrudelAudioEngine?.enabled) return;
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
  }, [animateKeyPress, applyMacTerminalKey, drawMacOffScreen, ensureMacTerminal]);

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
      if (stateRef.current.tabVisible === false || stateRef.current.tvVisible === false) return;
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
  }, [animateTrackingBurst, animateMacBloomBurst]);

  React.useEffect(() => {
    const onDrumHit = (event) => {
      if (event.detail?.lane === 'hat') {
        applyHatStutter(event.detail);
        return;
      }
      if (event.detail?.lane !== 'snare') return;
      if (stateRef.current.tabVisible === false || stateRef.current.tvVisible === false) return;
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
  }, [animateChannelFlip, animateMacBloomBurst, animateKeyPress, applyHatStutter]);

  React.useEffect(() => {
    const onVocalCue = (event) => {
      if (stateRef.current.tabVisible === false || stateRef.current.tvVisible === false) return;
      const now = performance.now();
      if (now - stateRef.current.lastVocalPunchAt < 420) return;
      stateRef.current.lastVocalPunchAt = now;
      triggerEditPunch(event.detail?.mode === 'chop' ? 1.055 : 1.035, 210);
    };
    window.addEventListener('resume-vocal-sample-cue', onVocalCue);
    return () => window.removeEventListener('resume-vocal-sample-cue', onVocalCue);
  }, [triggerEditPunch]);

  // Intro + breakdown have no clap/snare lane, so without a secondary
  // cue the short trailer clips loop visibly. Let sparse melody/bass
  // hits trigger occasional fresh cuts, while staying out of the way
  // once the snare-driven channel cuts are active.
  React.useEffect(() => {
    if (!engineEnabled || !availableSources.length) return undefined;
    const trySparseCut = (lane) => {
      const state = stateRef.current;
      if (state.tabVisible === false || state.tvVisible === false) return;
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
  }, [engineEnabled, availableSources, getBreakdownPosition, triggerSectionVocal]);

	  // Click the Mac's physical controls to slide the floppy and toggle
	  // audio + picture. The screen itself is display-only.
	  React.useEffect(() => {
	    if (stateRef.current.deviceMode !== 'mac') return;
	    const canvas = canvasRef.current;
	    if (!canvas) return;
    let raycaster = null;
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
	      if (!hits.length) return;
	      event.preventDefault();
	      if (state.powerToggleInFlight) return;
	      const hit = hits[0];
	      const target = state.macHitTargets?.get(hit.object.uuid) || { type: 'mouse' };
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
	    canvas.addEventListener('pointerdown', onPointerDown);
	    canvas.style.cursor = 'pointer';
    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.style.cursor = '';
    };
  }, [animateMouseButton, animateKeyPress, animateKeyMeshPress, animateFloppy, animateMacBloomBurst, applyMacTerminalKey, drawMacOffScreen, ensureMacTerminal, pushMacTerminalLine]);

  React.useEffect(() => {
    if (stateRef.current.deviceMode !== 'mac') return;
    const onDoomClosed = async () => {
      if (stateRef.current.powerToggleInFlight) return;
      stateRef.current.powerToggleInFlight = true;
      pushMacTerminalLine('DOOM session ended.');
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
      if (stateRef.current.tabVisible === false || stateRef.current.tvVisible === false) return;
      animateKeyPress(sequence[idx % sequence.length]);
      idx++;
    };
    window.addEventListener('resume-melody-note', onMelody);
    return () => window.removeEventListener('resume-melody-note', onMelody);
  }, [animateKeyPress]);

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
    stateRef.current.lastHatStutterAt = 0;
    stateRef.current.lastVocalPunchAt = 0;
    stateRef.current.sparseMotif = null;
    stateRef.current.vocalSampleLoop = -1;
    stateRef.current.vocalSampleSlots.clear();
    if (!stateRef.current.currentMedia) cutRef.current?.('init');
  }, [engineEnabled, availableSources]);

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
    cutRef.current?.('idle');
    const t = setInterval(() => cutRef.current?.('idle'), 3500);
    return () => clearInterval(t);
  }, [engineEnabled, availableSources, drawMacOffScreen, pauseAllCachedVideos, stopVocalSamples]);

  return (
    <div ref={wrapRef} className={`tv-hero ${engineEnabled ? 'is-live' : 'is-idle'}`}>
      <canvas ref={canvasRef} className="tv-hero__canvas" />
      {children ? (
        <div className="tv-hero__controls">
          {children}
        </div>
      ) : null}
    </div>
  );
}

function HelpFeature({ src }) {
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
    <Section id="help" label="03 · LIVE · MILL STITCH ™ ON HELP">
      <div className="help-hero">
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
            principal photography in the LA River basin. Use <span className="mono">W A S D</span>
            or drag to look around.
          </p>
        </div>
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
    <Section id="system" label="05 · LIVE · POETRY IN PROOF">
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
