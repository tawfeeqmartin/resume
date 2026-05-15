/* eslint-disable */
const { useState, useEffect, useLayoutEffect, useRef, useMemo } = React;

const THEME_OPTIONS = [
  { label: 'Frontier White', className: 'theme-frontier-white' },
  { label: 'Warm Editorial', className: '' },
  { label: 'Cool Frontier', className: 'theme-frontier' },
  { label: 'StageCraft Green', className: 'theme-stagecraft' },
  { label: 'Projection Noir', className: 'theme-noir' },
];

const FONT_OPTIONS = [
  { label: 'Newsreader + Plex', className: '' },
  { label: 'Instrument + Inter', className: 'font-modern-editorial' },
  { label: 'Technical Plex', className: 'font-technical-exec' },
  { label: 'Cascadia Signal', className: 'font-cascadia-signal' },
  { label: 'Cinematic Archive', className: 'font-cinematic-archive' },
];

const AUDIO_BPM = 96;
const AUDIO_SIXTEENTH_MS = 60000 / AUDIO_BPM / 4;
const TITLE_BEATS = 24;
const PAGE_DWELL_TAIL_STEPS = 0;

function getResumeStrudelAudioEngine() {
  if (window.__resumeStrudelAudioEngine) return window.__resumeStrudelAudioEngine;

  let strudel = null;
  let initPromise = null;
  let enabled = false;
  let keyboardBound = false;
  let songIndex = 1;
  let activeWASD = '';
  let activeChordKey = '';
  let currentAutoplayChordKey = '';
  let chordReturnTimer = null;
  let playGeneration = 0;
  let bassTriggerId = 0;
  let melodyTriggerId = 0;
  let drumTriggerId = 0;
  let harmonyTriggerId = 0;
  let videoDucked = false;
  let videoResumeTimer = null;
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
  const VISUAL_SYNC_AHEAD_MS = 36;
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
  };
  const phraseSteps = 32;
  const songPresets = [
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
    playCurrent({ resetTransport: false });
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

  const dispatchSyncedMusicEvent = (eventName, detail) => {
    const delayMs = Math.max(0, syncedDelayMs(detail.scheduledTime) - VISUAL_SYNC_AHEAD_MS);
    window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent(eventName, { detail }));
    }, delayMs);
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
    dispatchLaneMidiEvent(lane, {
      id,
      scheduledTime,
      duration,
      raw: value,
      velocity: 0.78,
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
      initPromise = window.__resumeStrudelReady
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

  const evaluateCurrent = async ({ resetTransport = false } = {}) => {
    const token = ++playGeneration;
    if (!enabled) return;
    if (videoDucked) return;
    const module = await ensureStrudel();
    if (!enabled) return;
    if (videoDucked) return;
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
      if (token !== playGeneration) return;
    }
    if (!enabled || videoDucked) return;
    const song = songPresets[songIndex];
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
      let pattern = makePattern(song, activeWASD);
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
      await module.evaluate(pattern, true);
    } catch (error) {
      console.warn('Strudel pattern failed', error);
    }
  };

  const playCurrent = (options) => {
    evaluateCurrent(options);
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
      const song = songPresets[songIndex];
      const map = {
        w: song.wasd[0],
        a: song.wasd[1],
        s: song.wasd[2],
        d: song.wasd[3],
      };
      const key = event.key.toLowerCase();
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
        dispatchChordKey(activeChordKey, { override: true, lane: 'wasdChord' });
        triggerLiveChord(activeChordKey, activeWASD);
        playCurrent();
        window.dispatchEvent(new CustomEvent('resume-audio-change'));
      }
    }, true);
    window.addEventListener('keyup', (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
      const key = event.key.toLowerCase();
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

  const setVideoDucked = (active) => {
    if (videoResumeTimer) {
      window.clearTimeout(videoResumeTimer);
      videoResumeTimer = null;
    }
    if (active) {
      [...liveChordVoices.keys()].forEach((key) => releaseLiveChord(key));
      if (enabled) hushCurrent(true);
      videoDucked = true;
      window.dispatchEvent(new CustomEvent('resume-audio-change'));
      return;
    }
    if (!videoDucked) return;
    videoResumeTimer = window.setTimeout(() => {
      videoResumeTimer = null;
      videoDucked = false;
      if (enabled) playCurrent();
      window.dispatchEvent(new CustomEvent('resume-audio-change'));
    }, 7000);
  };

  window.addEventListener('resume-video-audio-state', (event) => {
    setVideoDucked(Boolean(event.detail?.active));
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
    get midiOutputEnabled() { return midiOutputEnabled; },
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
        detail: { enabled: midiOutputEnabled, name: midiOutput?.name || '' },
      }));
      return { enabled: midiOutputEnabled, name: midiOutput?.name || '' };
    },
    disableMidiOut() {
      midiOutputEnabled = false;
      midiOutput = null;
      window.dispatchEvent(new CustomEvent('resume-midi-output-change', {
        detail: { enabled: false, name: '' },
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
        playCurrent({ resetTransport: true });
      } else {
        clearChordReturnTimer();
        clearScrollTransitionTimers();
        [...liveChordVoices.keys()].forEach((key) => releaseLiveChord(key));
        activeWASD = '';
        activeChordKey = '';
        currentAutoplayChordKey = '';
        videoDucked = false;
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

  ensureStrudel().catch((error) => console.warn('Strudel preload failed', error));

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
    const dpr = Math.max(1, window.devicePixelRatio || 1);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
    };

    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      resize();
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      if (!enabled) {
        // Audio off — render a single static "click here" arrow pointing
        // at the stem icons (which sit to the left of this canvas).
        // Opacity breathes on a 1.6s sine for attention; no horizontal
        // motion, which read as "escaping the frame" in the moving
        // version. iOS-style anchored pointer.
        const period = 1600;
        const t = ((now % period) + period) % period / period;
        const pulse = 0.5 + 0.5 * Math.sin(t * Math.PI * 2);
        const baseAlpha = 0.42 + 0.45 * pulse;
        ctx.strokeStyle = '#111';
        ctx.lineWidth = 2 * dpr;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalAlpha = baseAlpha;
        const headX = w * 0.16;
        const headSize = Math.min(h * 0.38, w * 0.08);
        // Chevron head pointing left
        ctx.beginPath();
        ctx.moveTo(headX + headSize, h / 2 - headSize);
        ctx.lineTo(headX,             h / 2);
        ctx.lineTo(headX + headSize, h / 2 + headSize);
        ctx.stroke();
        // Horizontal tail extending rightward — the shaft of the arrow.
        ctx.beginPath();
        ctx.moveTo(headX,            h / 2);
        ctx.lineTo(w - 4 * dpr,      h / 2);
        ctx.stroke();
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

function ReviewToggle({ kind, options, classScope }) {
  const [themeIndex, setThemeIndex] = useState(0);

  useEffect(() => {
    document.body.classList.remove(...options.map(t => t.className).filter(Boolean));
    const theme = options[themeIndex];
    if (theme.className) document.body.classList.add(theme.className);
  }, [themeIndex, options, classScope]);

  const cycle = (delta) => {
    setThemeIndex((idx) => (idx + delta + options.length) % options.length);
  };

  return (
    <div className="review-toggle" aria-label={`${kind} review`}>
      <button className="review-toggle__button" onClick={() => cycle(-1)} aria-label={`Previous ${kind}`}>‹</button>
      <span className="review-toggle__kind mono">{kind}</span>
      <span className="review-toggle__label mono">{options[themeIndex].label}</span>
      <button className="review-toggle__button" onClick={() => cycle(1)} aria-label={`Next ${kind}`}>›</button>
    </div>
  );
}

function ReviewControls() {
  return (
    <div className="review-controls">
      <MusicStation />
    </div>
  );
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

function MixFaders() {
  const engine = getResumeAudioEngine();
  const [mix, setMix] = useState(engine.mixSettings);
  const [channels, setChannels] = useState(engine.mixChannelState);
  const faders = [
    { id: 'master', label: 'master', min: 0.25, max: 1.4, step: 0.01 },
    { id: 'kick', label: 'kick', min: 0.45, max: 1.8, step: 0.01 },
    { id: 'snare', label: 'snare', min: 0.45, max: 1.8, step: 0.01 },
    { id: 'hats', label: 'hats', min: 0.25, max: 1.8, step: 0.01 },
    { id: 'perc', label: 'perc', min: 0.25, max: 1.8, step: 0.01 },
    { id: 'chords', label: 'chords', min: 0.2, max: 1.8, step: 0.01 },
    { id: 'bass', label: 'bass', min: 0.3, max: 1.7, step: 0.01 },
    { id: 'lead', label: 'lead', min: 0.35, max: 1.8, step: 0.01 },
    { id: 'sidechain', label: 'duck', min: 0, max: 1.8, step: 0.01 },
  ];

  useEffect(() => {
    const refresh = () => {
      setMix(engine.mixSettings);
      setChannels(engine.mixChannelState);
    };
    window.addEventListener('resume-audio-change', refresh);
    window.addEventListener('resume-mix-change', refresh);
    return () => {
      window.removeEventListener('resume-audio-change', refresh);
      window.removeEventListener('resume-mix-change', refresh);
    };
  }, [engine]);

  const update = (id, value) => {
    const next = engine.setMixSetting(id, value);
    setMix(next);
  };
  const toggleMute = (id) => {
    setChannels(engine.toggleMixMute(id));
  };
  const toggleSolo = (id) => {
    setChannels(engine.toggleMixSolo(id));
  };

  return (
    <div className="mix-faders" aria-label="Music mix faders">
      {faders.map((fader) => (
        <div className="mix-fader mono" key={fader.id}>
          <span className="mix-fader__name">{fader.label}</span>
          <input
            type="range"
            min={fader.min}
            max={fader.max}
            step={fader.step}
            value={mix[fader.id]}
            onChange={(event) => update(fader.id, event.target.value)}
            aria-label={`${fader.label} level`}
          />
          <output>{Number(mix[fader.id]).toFixed(2)}</output>
          {fader.id !== 'master' && fader.id !== 'sidechain' ? (
            <span className="mix-fader__buttons">
              <button
                type="button"
                className={channels.mute[fader.id] ? 'is-active' : ''}
                onClick={() => toggleMute(fader.id)}
                aria-pressed={Boolean(channels.mute[fader.id])}
              >M</button>
              <button
                type="button"
                className={channels.solo[fader.id] ? 'is-active' : ''}
                onClick={() => toggleSolo(fader.id)}
                aria-pressed={Boolean(channels.solo[fader.id])}
              >S</button>
            </span>
          ) : <span />}
        </div>
      ))}
    </div>
  );
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

const VECTOR_GLYPHS = {
  A: [[[0,6],[0,2],[2,0],[4,2],[4,6]], [[0,3],[4,3]]],
  E: [[[4,0],[0,0],[0,6],[4,6]], [[0,3],[3,3]]],
  F: [[[0,6],[0,0],[4,0]], [[0,3],[3,3]]],
  I: [[[0,0],[4,0]], [[2,0],[2,6]], [[0,6],[4,6]]],
  M: [[[0,6],[0,0],[2,3],[4,0],[4,6]]],
  N: [[[0,6],[0,0],[4,6],[4,0]]],
  Q: [[[1,0],[3,0],[4,1],[4,5],[3,6],[1,6],[0,5],[0,1],[1,0]], [[2.6,4.6],[4.2,6.2]]],
  R: [[[0,6],[0,0],[3,0],[4,1],[4,2.5],[3,3],[0,3]], [[2.2,3],[4,6]]],
  T: [[[0,0],[4,0]], [[2,0],[2,6]]],
  W: [[[0,0],[0.7,6],[2,3.4],[3.3,6],[4,0]]],
};

function VectorNameCanvas({ text }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let raf = 0;
    let start = performance.now();
    let dpr = window.devicePixelRatio || 1;
    let w = 0;
    let h = 0;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      dpr = window.devicePixelRatio || 1;
      w = Math.max(320, Math.floor(rect.width));
      h = Math.max(96, Math.floor(rect.height));
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const glyphWidth = 5;
    const glyphHeight = 7;
    const gap = 1.35;
    const chars = text.toUpperCase().split('');
    const totalUnits = chars.reduce((sum, ch) => sum + (ch === ' ' ? 3 : glyphWidth) + gap, -gap);

    const project = (x, y, elapsed) => {
      const centered = x - totalUnits / 2;
      const radius = totalUnits * 0.95;
      const theta = centered / radius;
      const curveX = Math.sin(theta) * radius;
      const depth = Math.cos(theta);
      const tilt = 0.34;
      const breathe = Math.sin(elapsed * 0.0016 + x * 0.2) * 0.035;
      return {
        x: w / 2 + curveX * scale,
        y: h / 2 + (y - glyphHeight / 2) * scale + (1 - depth) * scale * glyphHeight * tilt + breathe * scale,
        depth,
      };
    };

    let scale = 1;
    const drawLine = (a, b, drawT, elapsed) => {
      if (drawT <= 0) return;
      const clamped = Math.min(1, drawT);
      const bx = a[0] + (b[0] - a[0]) * clamped;
      const by = a[1] + (b[1] - a[1]) * clamped;
      const p0 = project(a[0], a[1], elapsed);
      const p1 = project(bx, by, elapsed);
      const alpha = 0.52 + p0.depth * 0.38;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.stroke();
    };

    const draw = (now) => {
      if (!inView || !tabVisible) {
        raf = 0;
        return;
      }
      const elapsed = now - start;
      ctx.clearRect(0, 0, w, h);
      scale = Math.min(w / (totalUnits + 1), h / 8.3);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#65bfc7';
      ctx.lineWidth = Math.max(1.25, scale * 0.1);
      ctx.shadowColor = ctx.strokeStyle;
      ctx.shadowBlur = Math.max(0, scale * 0.055);

      const scan = Math.min(1, elapsed / 1700);
      let cursor = 0;
      let glyphIndex = 0;
      for (const ch of chars) {
        if (ch === ' ') {
          cursor += 3 + gap;
          glyphIndex++;
          continue;
        }
        const glyph = VECTOR_GLYPHS[ch];
        if (!glyph) {
          ctx.save();
          ctx.globalAlpha = scan;
          ctx.shadowBlur = 0;
          ctx.fillStyle = ctx.strokeStyle;
          ctx.font = `${scale * 7}px "Cascadia Code", "IBM Plex Mono", monospace`;
          ctx.fillText(ch, w / 2 + (cursor - totalUnits / 2) * scale, h / 2 + scale * 2.2);
          ctx.restore();
          cursor += glyphWidth + gap;
          glyphIndex++;
          continue;
        }

        const letterStart = glyphIndex / chars.length;
        const letterT = Math.max(0, Math.min(1, (scan - letterStart * 0.72) / 0.22));
        const glitch = Math.sin(elapsed * 0.018 + glyphIndex * 7) > 0.985 ? 0.1 : 0;
        ctx.save();
        if (glitch) ctx.translate(glitch * scale, 0);
        for (const poly of glyph) {
          for (let i = 0; i < poly.length - 1; i++) {
            const segmentT = letterT * poly.length - i;
            const a = [cursor + poly[i][0], poly[i][1]];
            const b = [cursor + poly[i + 1][0], poly[i + 1][1]];
            drawLine(a, b, segmentT, elapsed);
          }
        }
        ctx.restore();
        cursor += glyphWidth + gap;
        glyphIndex++;
      }

      ctx.shadowBlur = 0;
      const cursorX = Math.min(totalUnits, totalUnits * scan);
      const p0 = project(cursorX, -0.2, elapsed);
      const p1 = project(cursorX, glyphHeight + 0.2, elapsed);
      ctx.globalAlpha = 0.25 + 0.45 * (0.5 + 0.5 * Math.sin(elapsed * 0.006));
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.stroke();

      raf = requestAnimationFrame(draw);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    // Only run the canvas rAF when the element is on-screen AND the tab
    // is visible. Background canvas drawing burns CPU/battery and steals
    // time from the audio thread on mobile.
    let inView = true;
    let tabVisible = !document.hidden;
    const startLoop = () => {
      if (raf) return;
      if (!inView || !tabVisible) return;
      raf = requestAnimationFrame(draw);
    };
    const stopLoop = () => {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const observer = typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(
          ([entry]) => {
            inView = entry.isIntersecting;
            if (inView && tabVisible) startLoop();
            else stopLoop();
          },
          { threshold: 0 }
        )
      : null;
    if (observer) observer.observe(wrap);
    const onVisibility = () => {
      tabVisible = !document.hidden;
      if (tabVisible && inView) startLoop();
      else stopLoop();
    };
    document.addEventListener('visibilitychange', onVisibility);
    startLoop();

    return () => {
      stopLoop();
      ro.disconnect();
      if (observer) observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [text]);

  return (
    <div ref={wrapRef} className="identity__vector-name" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}

const BLACKOUT_PAGES = [
  {
    diagram: "euclid",
    layout: "plate",
    mark: "highlight",
    phrase: {
      label: "find poetry in proof",
      words: ["find", "poetry", "in", "proof"],
      bridges: [
        { kind: "ref", column: 0, text: "find the usable route through definitions constraints and construction" },
        { kind: "ref", column: 1, text: "poetry appears when the apparatus teaches without explaining itself twice" },
        { kind: "ref", column: 2, text: "proof becomes cinematic when certainty can be staged as an image" },
      ],
    },
    lines: [
      { kind: "book", text: "euclid begins with definitions postulates common notions and the discipline of seeing what must be true" },
      { kind: "spec", text: "book I proposition 1: on a finite straight line construct an equilateral triangle" },
      { kind: "ref", text: "diagram one: order is drawn before it is explained" },
      { kind: "code", text: "construct(triangle).bisect(angle).repeat until proof becomes image" },
      { kind: "code", text: "circleA = circle(center:A, radius:distance(A,B)); circleB = circle(B, AB)" },
      { kind: "book", text: "the page teaches by making thought visible as geometry" },
      { kind: "ref", text: "find poetry where proof becomes apparatus and apparatus becomes trust" },
      { kind: "ref", text: "form follows function when the proof is useful before it is beautiful" },
      { kind: "diff add", text: "+ make believe is an old technology for moving an idea into the world" },
      { kind: "terminal", text: "$ draw --compass --straightedge --constraint --wonder" },
      { kind: "ref", text: "the proof is not decoration; it is a user interface for certainty" },
      { kind: "spec", text: "point line circle angle parallel surface axiom proof" },
    ],
  },
  {
    diagram: "pythagoras",
    layout: "proof",
    mark: "underline",
    phrase: { label: "measure becomes form", words: ["measure", "becomes", "form"] },
    lines: [
      { kind: "book", text: "pythagoras gives distance a memorable form: a^2 plus b^2 equals c^2" },
      { kind: "ref", text: "ratio becomes music; measure becomes architecture; number becomes imagination" },
      { kind: "spec", text: "right angle hypotenuse square proof proportion harmony" },
      { kind: "diff remove", text: "- intuition without a ruler" },
      { kind: "diff add", text: "+ intuition with a visible structure" },
      { kind: "code", text: "const diagonal = sqrt(width * width + height * height)" },
      { kind: "code", text: "normalize(v){ return v / sqrt(dot(v,v)) }" },
      { kind: "terminal", text: "$ solve frame --grid --lens --distance --scale" },
      { kind: "book", text: "classical proportion is the ancestor of composition layout rigging and spatial trust" },
      { kind: "ref", text: "craft begins where measure becomes touch and touch becomes repeatable form" },
      { kind: "ref", text: "a square on a side becomes a way to reason about the unseen diagonal" },
    ],
  },
  {
    diagram: "calculus",
    layout: "formula",
    mark: "connect",
    phrase: { label: "form follows function", words: ["form", "follows", "function"] },
    lines: [
      { kind: "book", text: "calculus studies change by slicing motion into limits derivatives and integrals" },
      { kind: "spec", text: "d/dx position gives velocity; integral velocity gives distance" },
      { kind: "ref", text: "curves become commands and motion becomes language" },
      { kind: "code", text: "next = current + velocity * deltaTime" },
      { kind: "code", text: "velocity = (position[t] - position[t-1]) / deltaTime" },
      { kind: "code", text: "area += sample(curve, x) * dx" },
      { kind: "diff add", text: "+ a live image is only convincing when time behaves" },
      { kind: "terminal", text: "$ sample motion --frame 24 --substep 8 --error small" },
      { kind: "book", text: "a derivative is a close look at what the system is about to do" },
      { kind: "ref", text: "integration is accumulation with memory; animation is calculus made visible" },
      { kind: "ref", text: "form follows function when motion has to remain true across time" },
      { kind: "spec", text: "function form limit operation purpose curve continuity" },
      { kind: "spec", text: "limit tangent slope area continuity velocity acceleration" },
    ],
  },
  {
    diagram: "light",
    layout: "lab",
    mark: "circle",
    phrase: { label: "shape light into signal", words: ["shape", "light", "into", "signal"] },
    lines: [
      { kind: "book", text: "optics turns a ray into a rule for vision reflection refraction shadow and lens" },
      { kind: "ref", text: "camera obscura: the outside world writes itself inside a dark room with light" },
      { kind: "spec", text: "aperture focal length exposure latitude sensor response color temperature" },
      { kind: "code", text: "radiance = material * light * visibility" },
      { kind: "code", text: "refractDir = refract(ray.direction, normal, eta)" },
      { kind: "code", text: "exposure = pow(2, ev) * shutter * apertureArea" },
      { kind: "diff add", text: "+ write the scene with light before asking pixels to explain it" },
      { kind: "terminal", text: "$ meter --key --fill --edge --practical --screen" },
      { kind: "book", text: "cinema is optical science taught to dream in sequence" },
      { kind: "ref", text: "newton separates white light through a prism and turns color into experiment" },
      { kind: "book", text: "art and apparatus meet where light stops being symbol and starts doing work" },
      { kind: "spec", text: "ray spectrum incidence reflection refraction dispersion image plane" },
    ],
  },
  {
    diagram: "perspective",
    layout: "margin",
    mark: "underline",
    phrase: { label: "total work of art", words: ["total", "work", "of", "art"] },
    lines: [
      { kind: "book", text: "perspective turns space into a picture plane with vanishing points and ruled convergence" },
      { kind: "ref", text: "alberti treats the frame as a window; the camera inherits the contract" },
      { kind: "spec", text: "eye point horizon orthogonal total projection plane", targetWords: ["total"] },
      { kind: "code", text: "screen = project(world * view * lens)" },
      { kind: "code", text: "clip = projection * view * model * vec4(position, 1)" },
      { kind: "diff add", text: "+ picture plane means the world can be staged for one exact observer" },
      { kind: "terminal", text: "$ align frustum --horizon --vanishing-point --lens" },
      { kind: "book", text: "virtual production is perspective theory with a live renderer behind the wall" },
      { kind: "ref", text: "the picture plane makes the work legible before the lens begins to move", targetWords: ["work"] },
      { kind: "ref", text: "the illusion holds when geometry optics and viewer position agree" },
      { kind: "ref", text: "projection becomes one part of art when space timing and observer position agree", targetWords: ["of", "art"] },
    ],
  },
  {
    diagram: "computation",
    layout: "terminal",
    mark: "highlight",
    phrase: { label: "hello world", words: ["hello", "world"] },
    lines: [
      { kind: "book", text: "turing asks what a machine can do when symbols rules memory and time are enough" },
      { kind: "ref", text: "shannon measures information and makes uncertainty available for engineering" },
      { kind: "code", text: "print hello world" },
      { kind: "code", text: "machine[state][symbol] = { write, move, nextState }" },
      { kind: "code", text: "bits = ceil(-log2(probability))" },
      { kind: "terminal", text: "$ boot imagination --logic --memory --feedback" },
      { kind: "spec", text: "state transition tape channel entropy noise correction" },
      { kind: "diff add", text: "+ hello world is a tiny spell for entering a computational world" },
      { kind: "book", text: "intelligence first appears as a procedure that can be repeated" },
      { kind: "spec", text: "school workshop machine instruction form function repeat" },
      { kind: "ref", text: "a universal machine makes every formal process into something one machine can imitate" },
      { kind: "spec", text: "symbol rule memory instruction address table universal machine" },
    ],
  },
  {
    diagram: "network",
    layout: "network",
    mark: "connect",
    phrase: { label: "feedback returns while thought is still forming", words: ["feedback", "returns", "while", "thought", "is", "still", "forming"] },
    lines: [
      { kind: "book", text: "licklider imagines human machine symbiosis as a partnership for thinking faster than either alone" },
      { kind: "ref", text: "the useful computer becomes less calculator and more collaborator workspace library and instrument" },
      { kind: "spec", text: "time sharing memory organization graphical input interactive display networked knowledge" },
      { kind: "code", text: "while humanJudges machineSearches and machineSuggests humanDirects" },
      { kind: "code", text: "ui.onInput = event => model.update(event).render()" },
      { kind: "diff remove", text: "- batch processing as a wall between question and answer" },
      { kind: "diff add", text: "+ interactive computing as a live conversation with the problem" },
      { kind: "terminal", text: "$ connect thinking-center --artist --engineer --archive --tool" },
      { kind: "book", text: "the interface becomes the place where imagination negotiates with computation" },
      { kind: "ref", text: "a tool is honest when its form teaches the hand what the function knows" },
    ],
  },
  {
    diagram: "graphics",
    layout: "render",
    mark: "circle",
    phrase: { label: "physics meets performance", words: ["physics", "meets", "performance"] },
    lines: [
      { kind: "book", text: "computer graphics turns geometry light material camera and time into a synthetic image" },
      { kind: "ref", text: "the rendering equation formalizes light transport as emitted light plus reflected incoming radiance" },
      { kind: "code", text: "for each frame update camera simulate scene shade pixels present realtime" },
      { kind: "code", text: "Lo = Le + integrateHemisphere(brdf * Li * cosTheta)" },
      { kind: "code", text: "color = toneMap(aces(pathTrace(ray, samples)))" },
      { kind: "spec", text: "raster ray path brdf texture normal depth color transform" },
      { kind: "diff add", text: "+ cinematic systems become realtime when feedback is faster than doubt" },
      { kind: "terminal", text: "$ profile renderer --gpu --latency --vblank --budget 16ms" },
      { kind: "book", text: "the believable image is a treaty between physics and performance" },
      { kind: "ref", text: "technology becomes craft when feedback changes the next gesture" },
      { kind: "ref", text: "distributed ray tracing makes soft shadows motion blur and depth of field into sampled dimensions" },
      { kind: "spec", text: "visibility radiance reflectance sampling variance denoise display transform" },
    ],
  },
  {
    diagram: "lightfield",
    layout: "atlas",
    mark: "connect",
    phrase: { label: "sample possible views", words: ["sample", "possible", "views"] },
    lines: [
      { kind: "book", text: "light field rendering treats photographs as slices through a four dimensional flow of light" },
      { kind: "ref", text: "view synthesis becomes less about rebuilding geometry and more about resampling possible rays" },
      { kind: "spec", text: "plenoptic function uv st aperture baseline interpolation compression" },
      { kind: "code", text: "view = resample(lightField, cameraPosition, rayDirection)" },
      { kind: "code", text: "rgb = neuralField(position, direction).integrateAlong(ray)" },
      { kind: "diff add", text: "+ sample the possible before the viewer asks to stand there" },
      { kind: "terminal", text: "$ capture array --baseline --view-grid --novel-view" },
      { kind: "book", text: "the camera array is a memory palace for light" },
      { kind: "ref", text: "many views become one useful form when the function is to move through seeing" },
      { kind: "ref", text: "neural radiance fields later compress scene appearance into a continuous learned volume" },
    ],
  },
  {
    diagram: "interface",
    layout: "manual",
    mark: "underline",
    phrase: { label: "the diagram learned to listen", words: ["the", "diagram", "learned", "to", "listen"] },
    lines: [
      { kind: "book", text: "a diagram becomes an instrument when the hand can test the idea" },
      { kind: "ref", text: "interactive illustrations teach by letting relationships move instead of merely sit" },
      { kind: "code", text: "onPointerMove update model then redraw explanation" },
      { kind: "code", text: "state = reducer(state, gesture); draw(diagram(state))" },
      { kind: "spec", text: "input affordance feedback continuity reversibility delight" },
      { kind: "diff remove", text: "- static explanation that asks the viewer to imagine motion" },
      { kind: "diff add", text: "+ live explanation that lets motion answer" },
      { kind: "terminal", text: "$ bind gesture --drag --gyro --wasd --spacebar" },
      { kind: "book", text: "the best interface feels like a diagram that has learned to listen" },
      { kind: "ref", text: "craft is the discipline of making function visible without explaining itself twice" },
      { kind: "ref", text: "an explanation gains credibility when the observer can disturb it and it remains coherent" },
    ],
  },
  {
    diagram: "stage",
    layout: "cue",
    mark: "highlight",
    phrase: { label: "use technology to tell tales", words: ["use", "technology", "to", "tell", "tales"] },
    lines: [
      { kind: "book", text: "stagecraft has always used technology to tell tales: rope mirror lens lamp screen sensor" },
      { kind: "ref", text: "the trick is not the machine but the moment when the audience stops seeing the machine" },
      { kind: "spec", text: "cue timing illusion sightline choreography control narrative" },
      { kind: "code", text: "if audienceBelieves then hideTechnology else simplify" },
      { kind: "code", text: "cue.fire(timecode).then(light).then(media).then(camera)" },
      { kind: "diff add", text: "+ use technology to tell tales without making the technology the tale" },
      { kind: "terminal", text: "$ cue scene --light --camera --sound --display --performer" },
      { kind: "book", text: "make believe becomes a production system when timing is shared" },
      { kind: "ref", text: "art enters through story craft enters through rehearsal technology enters through cue" },
      { kind: "ref", text: "pepper mirror back projection motion control and led volumes are one lineage of engineered illusion" },
      { kind: "spec", text: "apparatus rehearsal cue operator performer audience belief" },
    ],
  },
  {
    diagram: "volume",
    layout: "schematic",
    mark: "connect",
    phrase: { label: "attention belongs on performance", words: ["attention", "belongs", "on", "performance"] },
    lines: [
      { kind: "book", text: "virtual production joins camera tracking realtime rendering LED display and practical light" },
      { kind: "ref", text: "the engineer builds the invisible agreement between lens stage renderer and crew" },
      { kind: "spec", text: "frustum genlock color pipeline ndisplay mesh calibration media server" },
      { kind: "code", text: "sync(camera, volume, renderer, color, timecode)" },
      { kind: "code", text: "wallFrustum = trackedCamera.toFrustum(lens, ledWall)" },
      { kind: "code", text: "delta = displayTime - cameraTime; assert(abs(delta) < frame)" },
      { kind: "diff add", text: "+ production becomes virtual when the world can answer back on set" },
      { kind: "terminal", text: "$ calibrate volume --tracking --frustum --sync --take ready" },
      { kind: "book", text: "a good system disappears into the director's confidence" },
      { kind: "ref", text: "form follows function on set when the tool protects attention instead of demanding it" },
      { kind: "ref", text: "the volume is part camera department part stage department part render farm part instrument" },
      { kind: "spec", text: "latency lens metadata mocap color management wall processor operator workflow" },
    ],
  },
  {
    diagram: "prototype",
    layout: "diff",
    mark: "underline",
    phrase: { label: "test the riskiest assumption", words: ["test", "the", "riskiest", "assumption"] },
    lines: [
      { kind: "book", text: "a creative technologist turns desire into a testable production question" },
      { kind: "ref", text: "the work sits between art direction engineering research and production reality" },
      { kind: "spec", text: "prototype evaluate refine integrate document handoff" },
      { kind: "code", text: "while unknownsRemain build smaller experiment" },
      { kind: "code", text: "experiment = test(riskiestAssumption(concept))" },
      { kind: "code", text: "risk.sort(byImpact).slice(0,3).map(buildTest)" },
      { kind: "diff remove", text: "- wait until the concept is safe enough to test" },
      { kind: "diff add", text: "+ test until the concept becomes safe enough to make" },
      { kind: "terminal", text: "$ ship prototype --useful --legible --crew-safe --story-first" },
      { kind: "book", text: "the prototype is research with handles; it lets a team argue with evidence" },
      { kind: "ref", text: "a good prototype makes the riskiest assumption visible before the full system exists" },
      { kind: "ref", text: "the workshop method survives as prototype: art asks craft tests technology answers" },
      { kind: "ref", text: "creative technology is credible when invention survives handoff to production" },
    ],
  },
  {
    diagram: "neural",
    layout: "matrix",
    mark: "circle",
    phrase: { label: "representation emerging from correction", words: ["representation", "emerging", "from", "correction"] },
    lines: [
      { kind: "book", text: "back propagation adjusts internal weights until hidden units learn representations of the task" },
      { kind: "ref", text: "the model does not receive a drawing of the feature; it discovers useful structure through error" },
      { kind: "spec", text: "input hidden output loss gradient descent weight update generalization" },
      { kind: "code", text: "loss.backward(); optimizer.step(); repeat until representation holds" },
      { kind: "code", text: "hidden = activation(weights * input + bias)" },
      { kind: "code", text: "gradient = transpose(input) * error" },
      { kind: "diff remove", text: "- hand write every rule for perception" },
      { kind: "diff add", text: "+ learn representations from examples and correction" },
      { kind: "terminal", text: "$ train network --features latent --errors visible --patience" },
      { kind: "book", text: "intelligence becomes a surface shaped by data feedback and objective" },
      { kind: "ref", text: "a useful representation is learned through repeated correction" },
    ],
  },
  {
    diagram: "ai",
    layout: "attention",
    mark: "connect",
    phrase: { label: "attention becomes interface", words: ["attention", "becomes", "interface"] },
    lines: [
      { kind: "book", text: "transformers make attention the primary operation for relating tokens across context" },
      { kind: "ref", text: "attention becomes interface when a model can point its computation at the right part of the prompt" },
      { kind: "spec", text: "tokens embeddings positional encoding self attention feed forward layers context window" },
      { kind: "code", text: "context attends to question; answer attends to evidence; tool attends to intent" },
      { kind: "code", text: "scores = softmax((Q @ K.T) / sqrt(d_model))" },
      { kind: "code", text: "answer = model.generate(prompt + retrievedContext + toolResults)" },
      { kind: "diff remove", text: "- automate the artist out of the process" },
      { kind: "diff add", text: "+ extend attention across context memory action and taste" },
      { kind: "terminal", text: "$ ask model --with-context --with-tools --keep-human-in-loop" },
      { kind: "book", text: "large language models make text feel less like storage and more like an operating surface" },
      { kind: "ref", text: "attention is a workshop rule: choose the material that changes the next move" },
      { kind: "ref", text: "agentic systems plan search call tools observe and revise under human direction" },
    ],
  },
  {
    diagram: "story",
    layout: "poem",
    mark: "highlight",
    phrase: { label: "why didn't i think of that", words: ["why", "didnt", "i", "think", "of", "that"] },
    lines: [
      { kind: "book", text: "the sequence of intelligence is not a ladder but a set of tools for impossible shots" },
      { kind: "ref", text: "geometry measures the world optics catches it computation simulates it AI negotiates it" },
      { kind: "spec", text: "story first system second interface third spectacle last" },
      { kind: "code", text: "return makeBelieve.with(light, math, code, crew, model)" },
      { kind: "code", text: "shot = story.need().solveWith(geometry, optics, compute, ai)" },
      { kind: "diff add", text: "+ order hides inside chaos when every reference points back to story" },
      { kind: "terminal", text: "$ render tale --human --machine --camera --wonder" },
      { kind: "book", text: "use technology to tell tales and let the tale decide which technology survives" },
      { kind: "ref", text: "the cleanest proof makes another maker think: why didn't i think of that" },
      { kind: "ref", text: "the useful form is not a slogan; it is the path left after function removes ornament" },
    ],
  },
];

const BLACKOUT_MICRO_LINES = [
  { kind: "ref", text: "a workshop joins art craft and technology when the useful form proves its function" },
  { kind: "spec", text: "material hand machine purpose form function production school" },
  { kind: "spec", text: "lemma observation construction proof apparatus calibration inference" },
  { kind: "ref", text: "notes in the margin become instructions when the system is live" },
  { kind: "code", text: "const belief = image + timing + context + trust" },
  { kind: "terminal", text: "$ compare reference --paper --stage --model --take" },
  { kind: "book", text: "every technical diagram is also a promise about what can be controlled" },
  { kind: "spec", text: "angle signal sample transform display feedback memory" },
  { kind: "diff add", text: "+ make the hidden structure visible enough to use" },
  { kind: "ref", text: "a tool earns attention when it changes what the crew can attempt" },
  { kind: "code", text: "observe(); model(); render(); revise();" },
  { kind: "terminal", text: "$ trace path --from theorem --through lens --to story" },
  { kind: "book", text: "the intelligent page contains both disorder and a route through disorder" },
  { kind: "spec", text: "coordinate frame pipeline operator objective constraint" },
  { kind: "diff remove", text: "- spectacle without system" },
  { kind: "diff add", text: "+ wonder with engineering behind it" },
  { kind: "ref", text: "the best reference material rewards a second and third look" },
  { kind: "code", text: "story = technology.filter(meaningful).compose()" },
  { kind: "terminal", text: "$ annotate chaos --find-order --keep-motion" },
  { kind: "book", text: "progress looks accidental until the lineage is drawn" },
  { kind: "code", text: "function project(p){ return [f*p.x/p.z, f*p.y/p.z] }" },
  { kind: "code", text: "dx = (f(x + h) - f(x - h)) / (2 * h)" },
  { kind: "code", text: "radiance += brdf * incoming * max(0, dot(n,l))" },
  { kind: "code", text: "entropy = -sum(p.map(x => x * log2(x)))" },
  { kind: "code", text: "attention = softmax((Q * K.T) / sqrt(d)) * V" },
  { kind: "code", text: "weights -= learningRate * gradient(loss, weights)" },
  { kind: "code", text: "frustum = lensProjection(focalLength, sensor, trackerPose)" },
  { kind: "code", text: "if latency > frameBudget then reduceQuality() else preserveIntent()" },
  { kind: "code", text: "agent.observe(context).plan(goal).act(tools).revise()" },
  { kind: "terminal", text: "$ ffmpeg -i plate.mov -vf colorspace,scale,format output.exr" },
  { kind: "terminal", text: "$ python render.py --samples 64 --denoise --aces --slate" },
  { kind: "spec", text: "implementation note: theorem becomes algorithm becomes interface becomes shot" },
];

const totalWorkPageIndex = BLACKOUT_PAGES.findIndex((page) => page.phrase.label === "total work of art");
if (totalWorkPageIndex > 1) {
  const [totalWorkPage] = BLACKOUT_PAGES.splice(totalWorkPageIndex, 1);
  BLACKOUT_PAGES.splice(1, 0, totalWorkPage);
}

const PHRASE_BRIDGES = {
  "measure becomes form": [
    { kind: "ref", column: 0, text: "measure begins as a rule the crew can share across scale" },
    { kind: "ref", column: 1, text: "becomes reliable when proportion survives lens distance and motion" },
    { kind: "ref", column: 2, text: "form is the visible contract between math and feeling" },
  ],
  "form follows function": [
    { kind: "ref", column: 0, text: "form is earned when motion reveals the purpose of the system" },
    { kind: "ref", column: 1, text: "follows the curve of use rather than the habit of decoration" },
    { kind: "ref", column: 2, text: "function gives the image its timing edge and restraint" },
  ],
  "shape light into signal": [
    { kind: "ref", column: 0, text: "shape the scene through exposure reflection and controlled shadow" },
    { kind: "ref", column: 1, text: "light is material before it becomes a sampled value" },
    { kind: "ref", column: 2, text: "signal quality depends on lens sensor and illumination agreeing" },
  ],
  "art craft technology": [
    { kind: "ref", column: 0, text: "art frames the question before the machine starts answering" },
    { kind: "ref", column: 1, text: "craft keeps the answer usable under pressure and repetition" },
    { kind: "ref", column: 2, text: "technology extends the hand without replacing judgment" },
  ],
  "hello world": [
    { kind: "code", column: 0, text: "hello is the first signal that the machine is listening" },
    { kind: "ref", column: 2, text: "world arrives when symbols become a place to work" },
  ],
  "form teaches function": [
    { kind: "ref", column: 0, text: "form teaches the operator before a manual has time to explain" },
    { kind: "ref", column: 1, text: "teaches by making the next correct action feel available" },
    { kind: "ref", column: 2, text: "function becomes legible when the interface respects attention" },
  ],
  "physics meets performance": [
    { kind: "ref", column: 0, text: "physics gives the renderer a constraint worth respecting" },
    { kind: "ref", column: 1, text: "meets the frame budget only after sampling becomes selective" },
    { kind: "ref", column: 2, text: "performance decides which approximation can survive realtime" },
  ],
  "sample the possible": [
    { kind: "code", column: 0, text: "sample from the field before the camera asks for certainty" },
    { kind: "ref", column: 2, text: "possible views become useful when interpolation respects light" },
  ],
  "the diagram learned to listen": [
    { kind: "ref", column: 1, text: "the diagram learned to listen when input changed the explanation" },
  ],
  "use technology to tell tales": [
    { kind: "ref", column: 0, text: "use the machine only where the story needs a new hand" },
    { kind: "ref", column: 1, text: "technology earns its place when the trick disappears into timing" },
    { kind: "ref", column: 2, text: "tell the audience less about tools and more about consequence" },
    { kind: "ref", column: 2, text: "tales survive when systems serve belief instead of spectacle" },
  ],
  "tool protects attention": [
    { kind: "ref", column: 0, text: "tool design begins by removing demands from the operator" },
    { kind: "ref", column: 1, text: "protects the take when calibration sync and color disappear" },
    { kind: "ref", column: 2, text: "attention stays with the shot when the system behaves" },
  ],
  "test the riskiest assumption": [
    { kind: "ref", column: 0, text: "test only the part that can actually change the decision" },
    { kind: "ref", column: 1, text: "riskiest constraints should be visible before the system scales" },
    { kind: "ref", column: 2, text: "assumption becomes evidence when the result survives handoff" },
  ],
  "learn through correction": [
    { kind: "ref", column: 0, text: "learned features are not drawn by hand in advance" },
    { kind: "ref", column: 1, text: "through repeated error the hidden layer changes shape" },
    { kind: "ref", column: 2, text: "correction is the signal that makes representation useful" },
  ],
  "attention becomes interface": [
    { kind: "ref", column: 0, text: "attention selects context before language turns it into action" },
    { kind: "ref", column: 1, text: "becomes practical when tools memory and taste remain in loop" },
    { kind: "ref", column: 2, text: "interface is the surface where intent can steer computation" },
  ],
  "tools for impossible shots": [
    { kind: "ref", column: 0, text: "tools collect theory into something a crew can trust" },
    { kind: "ref", column: 1, text: "impossible is often a workflow problem wearing a mythical mask" },
    { kind: "ref", column: 2, text: "shots become possible when math light code and story agree" },
  ],
  "why didn't i think of that": [
    { kind: "ref", column: 0, text: "why the solution works should be visible without becoming the subject" },
    { kind: "ref", column: 1, text: "didn't means the trick feels obvious only after someone shows the proof" },
    { kind: "ref", column: 1, text: "i keep the mechanism visible enough to trust but quiet enough to disappear" },
    { kind: "ref", column: 2, text: "think follows the evidence when the form has removed the noise" },
    { kind: "ref", column: 2, text: "of all the layers available only the useful ones should remain" },
    { kind: "ref", column: 2, text: "that is the moment where craft looks inevitable after it exists" },
  ],
};

const EMPTY_BLACKOUT_BRIDGES = [];

const RESEARCH_BLACKOUT_LINES = {
  euclid: [
    { kind: "book", text: "Euclid I.1 begins with a given finite straight line and asks for an equilateral triangle on that line." },
    { kind: "book", text: "To find the third point, draw two circles with equal radius and use their intersection as the construction result.", targetWords: ["find"] },
    { kind: "spec", text: "given segment, equal radius, compass construction, circle intersection, common notion." },
    { kind: "code", text: "const r = distance(A, B); C = intersect(circle(A, r), circle(B, r))[0];" },
    { kind: "book", text: "Because every point on a circle is the same distance from its center, AC and BC both equal AB." },
    { kind: "ref", text: "The poetry is not decoration here; it is the visible economy of a method that leaves no arbitrary choice.", targetWords: ["poetry"] },
    { kind: "code", text: "assert(eq(distance(A,C), r) && eq(distance(B,C), r));" },
    { kind: "book", text: "In a good construction, the drawing carries the argument before the caption finishes explaining it.", targetWords: ["in"] },
    { kind: "ref", text: "The proof is a working interface for certainty: constraint, operation, visible result.", targetWords: ["proof"] },
  ],
  pythagoras: [
    { kind: "book", text: "The Pythagorean relation turns a diagonal into something the square areas on two perpendicular sides can measure.", targetWords: ["measure"] },
    { kind: "book", text: "For graphics, layout, rigging, and camera work, the diagonal is often the invisible quantity that has to be exact." },
    { kind: "spec", text: "right angle, hypotenuse, squared norm, Euclidean metric, diagonal scale, calibration." },
    { kind: "code", text: "length = Math.hypot(width, height)" },
    { kind: "book", text: "A square built on a side becomes an area proof; the diagram converts distance into a visible comparison.", targetWords: ["becomes"] },
    { kind: "code", text: "unit = vector.scale(1 / Math.hypot(vector.x, vector.y))" },
    { kind: "ref", text: "Composition takes form only after scale, distance, and proportion can be trusted by everyone touching the image.", targetWords: ["form"] },
  ],
  calculus: [
    { kind: "book", text: "Calculus gives motion two complementary tools: the derivative describes local change and the integral accumulates effect." },
    { kind: "book", text: "Animation, tracking, simulation, and filtering all depend on this bargain between an instant and an interval." },
    { kind: "ref", text: "Form in a moving frame is not a static outline; it is state, velocity, acceleration, and sampling made visible.", targetWords: ["form"] },
    { kind: "spec", text: "limit, derivative, integral, timestep, velocity, acceleration, numerical stability." },
    { kind: "code", text: "velocity = (position[t] - position[t - 1]) / deltaTime" },
    { kind: "book", text: "A sampled frame follows from the previous state plus the forces acting during the interval.", targetWords: ["follows"] },
    { kind: "code", text: "position += velocity * deltaTime + 0.5 * acceleration * deltaTime ** 2" },
    { kind: "ref", text: "The function is the contract that keeps a sequence coherent when individual pictures would otherwise become isolated.", targetWords: ["function"] },
  ],
  light: [
    { kind: "book", text: "Optics is production discipline: every convincing image is constrained by reflection, refraction, exposure, and sensor response." },
    { kind: "book", text: "Snell's law matters because it makes bending light predictable enough to design around glass, lenses, screens, and water." },
    { kind: "spec", text: "radiance, irradiance, normal incidence, refraction, dispersion, exposure, sensor response." },
    { kind: "code", text: "refracted = refract(ray.direction, surface.normal, etaIncident / etaTransmit)" },
    { kind: "code", text: "exposureValue = log2((aperture ** 2) / shutterSeconds)" },
    { kind: "ref", text: "Shape is controlled through angle, falloff, softness, contrast, distance, and exposure.", targetWords: ["shape"] },
    { kind: "book", text: "A source is not only bright or dim; its size, position, spectrum, and distance all change surface response." },
    { kind: "ref", text: "Light passes through lens geometry after aperture, wavelength, focus, and filtration have already selected it.", targetWords: ["light"] },
    { kind: "book", text: "The sensor does not receive a finished picture; it receives measured energy constrained by optics." },
    { kind: "ref", text: "Those measurements turn into image data only when exposure, color response, and noise remain within useful limits.", targetWords: ["into"] },
    { kind: "book", text: "Latitude, noise floor, and color management decide whether the plate can survive lighting changes and the final grade." },
    { kind: "ref", text: "A usable image depends on a stable signal, not merely a bright surface.", targetWords: ["signal"] },
  ],
  perspective: [
    { kind: "book", text: "Linear perspective turns the picture plane into a contract between observer, frame, and projected geometry." },
    { kind: "book", text: "Alberti's window becomes a camera model when eye point, horizon, vanishing point, and plane remain in agreement." },
    { kind: "spec", text: "eye point, horizon, picture plane, frustum, projection matrix, homogeneous divide." },
    { kind: "code", text: "clip = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0)" },
    { kind: "code", text: "ndc = clip.xyz / clip.w" },
    { kind: "ref", text: "A perspective setup is a total agreement between observer frame geometry and lens.", targetWords: ["total"] },
    { kind: "book", text: "Horizon, eye point, and picture plane establish the camera's contract with the scene." },
    { kind: "ref", text: "Camera craft keeps the work usable under blocking lens changes and time pressure.", targetWords: ["work"] },
    { kind: "book", text: "A tracked frustum can only work if lens metadata and camera pose describe the same view." },
    { kind: "ref", text: "The lens and display wall must agree before the camera can hold scale of the room.", targetWords: ["of"] },
    { kind: "book", text: "Projection errors become visible as soon as the viewer or camera moves away from the assumed point." },
    { kind: "ref", text: "Art becomes convincing when it obeys the same projection model as the photograph.", targetWords: ["Art"] },
  ],
  computation: [
    { kind: "book", text: "Turing reduces computation to finite control, a readable symbol, a writable tape, and a rule for the next action." },
    { kind: "book", text: "Shannon turns communication into engineering by measuring uncertainty and separating source, channel, noise, and receiver." },
    { kind: "spec", text: "state, symbol, transition, tape, entropy, channel code, noise, capacity." },
    { kind: "code", text: "next = transition[currentState][readSymbol]" },
    { kind: "code", text: "entropy = -probabilities.reduce((h, p) => h + p * Math.log2(p), 0)" },
    { kind: "terminal", text: "$ echo hello | machine --read --write --advance", targetWords: ["hello"] },
    { kind: "book", text: "A universal machine makes every formal process into something one machine can imitate." },
    { kind: "ref", text: "The world appears when symbols stop being notation and become an operating surface.", targetWords: ["world"] },
  ],
  network: [
    { kind: "book", text: "Licklider's man-computer symbiosis is a design brief for shared judgment between people and machines." },
    { kind: "book", text: "The shift is interactive computing, where feedback arrives before a batch job completes.", targetWords: ["feedback"] },
    { kind: "spec", text: "time sharing, memory organization, display input, collaboration, decision support." },
    { kind: "code", text: "while (human.setsGoal()) computer.searches(); human.evaluates(computer.candidates)" },
    { kind: "ref", text: "The system returns candidates before the context is lost.", targetWords: ["returns"] },
    { kind: "book", text: "Time sharing matters because the computer stops being a remote calculator and becomes a working surface." },
    { kind: "ref", text: "While the question is active, the user can still redirect the search.", targetWords: ["while"] },
    { kind: "code", text: "interface = loop(input, model, display, judgment)" },
    { kind: "book", text: "Thought remains with the person making the decision, not the machine proposing the next path.", targetWords: ["thought"] },
    { kind: "ref", text: "The answer is provisional until the operator accepts it as useful evidence.", targetWords: ["is"] },
    { kind: "book", text: "The interface is still unfinished while the operator is steering, comparing, and correcting.", targetWords: ["still"] },
    { kind: "ref", text: "Forming the loop between input, model, display, and judgment is the actual design problem.", targetWords: ["forming"] },
  ],
  graphics: [
    { kind: "book", text: "Kajiya's rendering equation turns light transport into an integral a renderer can approximate." },
    { kind: "book", text: "Ray tracing, path tracing, radiosity, BRDFs, and Monte Carlo sampling become parts of one transport problem." },
    { kind: "spec", text: "radiance, BRDF, hemisphere integral, visibility, Monte Carlo variance, path tracing." },
    { kind: "code", text: "Lo = Le + integrateHemisphere(fr * Li * max(0, dot(n, wi)))" },
    { kind: "code", text: "sample += throughput * emitted(hit) + throughput * brdf(hit) * incoming" },
    { kind: "ref", text: "Physics gives the renderer a constraint worth respecting before style is allowed to intervene.", targetWords: ["physics"] },
    { kind: "book", text: "Sampling, visibility, and BRDF evaluation decide where the renderer spends its effort." },
    { kind: "ref", text: "Approximation meets the frame budget only after sampling becomes selective.", targetWords: ["meets"] },
    { kind: "book", text: "Performance decides which error the audience will never notice and which artifact breaks belief.", targetWords: ["performance"] },
  ],
  lightfield: [
    { kind: "book", text: "Levoy and Hanrahan describe a light field as a four-dimensional function of rays through unobstructed space." },
    { kind: "book", text: "The move is avoiding full geometry reconstruction when enough rays have already been sampled from the scene." },
    { kind: "spec", text: "two-plane parameterization, plenoptic function, baseline, aperture, resampling, interpolation." },
    { kind: "code", text: "ray = lookupLightField(u, v, s, t)" },
    { kind: "code", text: "viewColor = reconstruct(lightField, camera.origin, camera.direction)" },
    { kind: "ref", text: "A dense capture lets the renderer sample a ray field instead of reconstructing every surface first.", targetWords: ["sample"] },
    { kind: "book", text: "The two-plane parameterization stores rays without pretending the scene geometry is already solved." },
    { kind: "ref", text: "Possible camera positions become queries into the captured field.", targetWords: ["possible"] },
    { kind: "book", text: "Neural radiance fields later compress views into answers from a learned continuous scene function.", targetWords: ["views"] },
  ],
  interface: [
    { kind: "book", text: "An interactive diagram becomes an instrument when the viewer changes a parameter and sees the consequence immediately." },
    { kind: "book", text: "The quality test is reversibility: disturb it, recover it, and learn the invariant underneath." },
    { kind: "spec", text: "affordance, input state, feedback, reversibility, latency, constraint, explanation." },
    { kind: "code", text: "state = reducer(state, gesture)" },
    { kind: "code", text: "draw(explain(model(state)))" },
    { kind: "ref", text: "The interaction is credible only if the model changes state when disturbed.", targetWords: ["the"] },
    { kind: "book", text: "A diagram becomes an instrument when a viewer can test the relationship instead of accepting a caption.", targetWords: ["diagram"] },
    { kind: "ref", text: "The relationship is learned by trying the system, not by reading around it.", targetWords: ["learned"] },
    { kind: "book", text: "The interface has to return consequence immediately for the explanation to hold.", targetWords: ["to"] },
    { kind: "book", text: "Reversibility is the quality test: disturb it, recover it, and keep the invariant visible." },
    { kind: "ref", text: "A useful control can listen without becoming noisy or stealing attention from the model.", targetWords: ["listen"] },
    { kind: "ref", text: "The best explanation responds without becoming noisy; it exposes the relationship, not the implementation." },
  ],
  stage: [
    { kind: "book", text: "Stagecraft can use optics, control, timing, and sightline to move attention without announcing the mechanism.", targetWords: ["use"] },
    { kind: "book", text: "Pepper's ghost, back projection, motion control, and LED volumes belong to the same lineage of engineered illusion." },
    { kind: "spec", text: "cue stack, timecode, sightline, occlusion, practical light, operator rehearsal." },
    { kind: "ref", text: "Technology earns its place when the trick disappears into timing.", targetWords: ["technology"] },
    { kind: "code", text: "cue.at(timecode).run([lights.fade(), media.play(), camera.move()])" },
    { kind: "code", text: "if (audience.seesMechanism) simplifyCue()" },
    { kind: "book", text: "The cue stack exists to keep performers, camera, light, and media aligned.", targetWords: ["to"] },
    { kind: "ref", text: "It does not tell the story by itself; it keeps the conditions aligned so the story can land.", targetWords: ["tell"] },
    { kind: "book", text: "The audience should remember consequence, not the machinery that produced it." },
    { kind: "ref", text: "The tales survive when belief remains intact after the cue has passed.", targetWords: ["tales"] },
  ],
  volume: [
    { kind: "book", text: "Virtual production joins camera tracking, realtime rendering, LED processing, practical light, and color management." },
    { kind: "book", text: "The wall is photographic only when lens metadata, pose, genlock, exposure, and color management describe the same moment." },
    { kind: "spec", text: "frustum tracking, lens metadata, genlock, latency, color pipeline, nDisplay calibration." },
    { kind: "code", text: "frustum = camera.pose * lensProjection(focalLength, sensorSize)" },
    { kind: "code", text: "assert(Math.abs(displayTime - cameraTime) < frameDuration)" },
    { kind: "ref", text: "Attention should stay with the crew, the lens, and the story.", targetWords: ["attention"] },
    { kind: "book", text: "Tracking and color do not become separate departments when they land in the same plate." },
    { kind: "ref", text: "The wall belongs to the photographic system only when pose, genlock, and color describe the same moment.", targetWords: ["belongs"] },
    { kind: "book", text: "On a volume stage, infrastructure should disappear into repeatable confidence.", targetWords: ["on"] },
    { kind: "ref", text: "Performance is what remains visible when the pipeline stops asking to be admired.", targetWords: ["performance"] },
    { kind: "ref", text: "A coherent pipeline protects the director from debugging the illusion in public." },
  ],
  prototype: [
    { kind: "book", text: "A prototype is useful when it removes one specific uncertainty and gives the team evidence they can discuss." },
    { kind: "book", text: "The useful prototype makes a risk observable enough for artists, engineers, and producers to make the same decision." },
    { kind: "spec", text: "hypothesis, constraint, measurable risk, acceptance test, handoff documentation." },
    { kind: "code", text: "experiment = isolate(highestRisk(concept))" },
    { kind: "code", text: "shipPrototype({ question, evidence, failureMode, nextDecision })" },
    { kind: "ref", text: "Test the smallest experiment first, before the production system grows around it.", targetWords: ["test"] },
    { kind: "book", text: "A prototype should answer one question clearly enough for a team to make a decision." },
    { kind: "ref", text: "The constraint should become visible while it is still cheap to change.", targetWords: ["the"] },
    { kind: "book", text: "Riskiest dependencies belong in the prototype, not the final handoff.", targetWords: ["riskiest"] },
    { kind: "ref", text: "An assumption is useful only after evidence can argue with it.", targetWords: ["assumption"] },
  ],
  neural: [
    { kind: "book", text: "Backpropagation adjusts internal weights until hidden units represent structure useful to the task." },
    { kind: "book", text: "The important claim is not memorized labels; it is internal representation emerging from correction." },
    { kind: "spec", text: "loss, gradient, hidden unit, representation, weight update, generalization." },
    { kind: "code", text: "loss.backward(); optimizer.step(); optimizer.zeroGrad()" },
    { kind: "code", text: "weights -= learningRate * gradient(loss, weights)" },
    { kind: "ref", text: "Representation appears in the hidden layer because the task demands structure.", targetWords: ["representation"] },
    { kind: "book", text: "Useful features are emerging as the model reduces error across many examples.", targetWords: ["emerging"] },
    { kind: "book", text: "Hidden units become useful when error gives the system a direction to move." },
    { kind: "ref", text: "Structure comes from repeated update and evaluation, not a hand-written feature list.", targetWords: ["from"] },
    { kind: "book", text: "Correction gives the layer direction without requiring every perceptual rule to be specified by hand.", targetWords: ["correction"] },
  ],
  ai: [
    { kind: "book", text: "In the Transformer, attention computes token relationships directly across context.", targetWords: ["attention"] },
    { kind: "book", text: "Scaled dot-product attention is simple enough to inspect and powerful enough to support a general sequence model." },
    { kind: "spec", text: "token embedding, positional encoding, query, key, value, attention head, context." },
    { kind: "code", text: "attention = softmax((Q @ K.T) / sqrt(d_k)) @ V" },
    { kind: "code", text: "context = concat(heads).project(W_o)" },
    { kind: "ref", text: "A model becomes useful when context, tools, memory, and judgment can be directed together.", targetWords: ["becomes"] },
    { kind: "book", text: "The interface opportunity is controllable attention over the work surface, not automation for its own sake.", targetWords: ["interface"] },
  ],
  story: [
    { kind: "book", text: "The through-line is practical intelligence: geometry constrains space, optics constrains light, computation constrains process, and AI constrains context." },
    { kind: "book", text: "Why a system works should be visible enough for the crew to trust it, but quiet enough for the audience to feel it.", targetWords: ["why"] },
    { kind: "spec", text: "constraint, apparatus, image, interaction, workflow, judgment, taste, story." },
    { kind: "code", text: "shot = solve(storyNeed, { geometry, optics, compute, ai, crew })" },
    { kind: "code", text: "keep = technologies.filter(layer => layer.servesStory && layer.survivesProduction)" },
    { kind: "book", text: "The system is successful when it makes the necessary layer arrive on time." },
    { kind: "ref", text: "A solution feels inevitable when it didn't hide the reasoning; it simply arranged the evidence well.", targetWords: ["didn't"] },
    { kind: "book", text: "I keep the mechanism close enough to trust but quiet enough that taste can still lead.", targetWords: ["I"] },
    { kind: "ref", text: "The point is to make another maker think from the proof toward the experience.", targetWords: ["think"] },
    { kind: "book", text: "Of all the layers available, only the ones serving the shot should remain visible.", targetWords: ["of"] },
    { kind: "book", text: "That reaction matters because the proof disappeared into the experience.", targetWords: ["that"] },
  ],
};

const RESEARCH_MICRO_LINES_BY_DIAGRAM = {
  euclid: [
    { kind: "code", text: "function circle(center, radius){ return { center, radius }; }" },
    { kind: "code", text: "const candidates = intersections(circle(A,r), circle(B,r));" },
    { kind: "code", text: "const C = candidates.sort(byUpperPoint)[0];" },
    { kind: "code", text: "drawLine(A,B); drawLine(A,C); drawLine(B,C);" },
    { kind: "spec", text: "Invariant: AC equals AB and BC equals AB." },
    { kind: "terminal", text: "$ construct euclid-i-1 --given AB --emit triangle" },
  ],
  pythagoras: [
    { kind: "code", text: "const c2 = a * a + b * b;" },
    { kind: "code", text: "const c = Math.sqrt(c2);" },
    { kind: "code", text: "const squareArea = side => side ** 2;" },
    { kind: "code", text: "assert(close(squareArea(c), squareArea(a) + squareArea(b)));" },
    { kind: "spec", text: "Implementation: diagonal length, unit vector, scale-normalized layout." },
    { kind: "terminal", text: "$ solve diagonal --width a --height b --normalize" },
  ],
  calculus: [
    { kind: "code", text: "const dxdt = (x1 - x0) / dt;" },
    { kind: "code", text: "const next = x + velocity * dt + acceleration * dt * dt * 0.5;" },
    { kind: "code", text: "area += curve.sample(t) * dt;" },
    { kind: "code", text: "error = Math.abs(predicted - measured);" },
    { kind: "spec", text: "Implementation: timestep, derivative, integration, error bound." },
    { kind: "terminal", text: "$ simulate motion --dt 1/120 --substeps 8" },
  ],
  light: [
    { kind: "code", text: "const eta = iorAir / iorGlass;" },
    { kind: "code", text: "const refracted = refract(direction, normal, eta);" },
    { kind: "code", text: "const ev = Math.log2((fStop * fStop) / shutter);" },
    { kind: "code", text: "signal = clamp((radiance * exposure) - noiseFloor, 0, whitePoint);" },
    { kind: "spec", text: "Implementation: refraction, falloff, exposure, sensor response." },
    { kind: "terminal", text: "$ meter plate --ev --latitude --white-balance" },
  ],
  perspective: [
    { kind: "code", text: "const view = inverse(cameraWorldMatrix);" },
    { kind: "code", text: "const projection = perspective(fov, aspect, near, far);" },
    { kind: "code", text: "const clip = projection.multiply(view).multiply(point);" },
    { kind: "code", text: "const screen = viewport(clip.xyz.divideScalar(clip.w));" },
    { kind: "spec", text: "Implementation: pose, lens, projection matrix, homogeneous divide." },
    { kind: "terminal", text: "$ align frustum --lens 35mm --horizon locked" },
  ],
  computation: [
    { kind: "code", text: "const rule = table[state][symbol];" },
    { kind: "code", text: "tape[cursor] = rule.write; cursor += rule.move;" },
    { kind: "code", text: "state = rule.nextState;" },
    { kind: "code", text: "const bits = -Math.log2(probability);" },
    { kind: "spec", text: "Implementation: state table, tape cursor, entropy estimate." },
    { kind: "terminal", text: "$ run machine --tape input.txt --trace states" },
  ],
  network: [
    { kind: "code", text: "const event = readInput(); model.update(event);" },
    { kind: "code", text: "const candidates = search(index, user.goal);" },
    { kind: "code", text: "view.render(rank(candidates, user.judgment));" },
    { kind: "code", text: "feedback.push({ action, result, accepted });" },
    { kind: "spec", text: "Implementation: input loop, ranking, display, operator correction." },
    { kind: "terminal", text: "$ start symbiosis --display live --latency low" },
  ],
  graphics: [
    { kind: "code", text: "const wi = sampleHemisphere(normal, rng);" },
    { kind: "code", text: "throughput *= brdf(hit, wi) * cosine(normal, wi) / pdf;" },
    { kind: "code", text: "radiance += throughput * trace(scene, spawnRay(hit, wi));" },
    { kind: "code", text: "pixel = toneMap(denoise(accumulator / samples));" },
    { kind: "spec", text: "Implementation: sample, trace, accumulate, denoise, display transform." },
    { kind: "terminal", text: "$ render frame --samples 64 --brdf ggx --aces" },
  ],
  lightfield: [
    { kind: "code", text: "const ray = parameterizeRay(u, v, s, t);" },
    { kind: "code", text: "const color = interpolate(lightField, ray);" },
    { kind: "code", text: "view[x,y] = reconstructRay(camera, x, y);" },
    { kind: "code", text: "cache.set(viewPose, resample(apertureGrid, viewPose));" },
    { kind: "spec", text: "Implementation: ray table, baseline, interpolation, novel view." },
    { kind: "terminal", text: "$ capture lightfield --grid 9x9 --baseline 6cm" },
  ],
  interface: [
    { kind: "code", text: "state = reducer(state, pointer.delta);" },
    { kind: "code", text: "const invariant = model.solve(state.parameters);" },
    { kind: "code", text: "diagram.draw(state, invariant);" },
    { kind: "code", text: "if (gesture.cancelled) state = previousCheckpoint;" },
    { kind: "spec", text: "Implementation: gesture, state, invariant, redraw, undo." },
    { kind: "terminal", text: "$ bind diagram --pointer --keyboard --gyro" },
  ],
  stage: [
    { kind: "code", text: "cueStack.at(timecode).trigger('media.play');" },
    { kind: "code", text: "lights.fade(scene.key, duration.beats(4));" },
    { kind: "code", text: "if (sightline.blocked(camera)) reviseBlocking();" },
    { kind: "code", text: "operator.confirm(cue.id, rehearsalState);" },
    { kind: "spec", text: "Implementation: cue graph, operator state, sightline, rehearsal timing." },
    { kind: "terminal", text: "$ rehearse cue --timecode --media --light --camera" },
  ],
  volume: [
    { kind: "code", text: "const frustum = lensToFrustum(lens, cameraPose, wallBounds);" },
    { kind: "code", text: "ndisplay.setViewOffset(frustum);" },
    { kind: "code", text: "assert(sync.delta(camera, wall) < frameDuration);" },
    { kind: "code", text: "color.validate(cameraLogC, wallCalibration, showLut);" },
    { kind: "spec", text: "Implementation: tracking, frustum, genlock, color, latency budget." },
    { kind: "terminal", text: "$ calibrate volume --tracking --genlock --color" },
  ],
  prototype: [
    { kind: "code", text: "const risk = risks.sort(byImpactThenUnknown)[0];" },
    { kind: "code", text: "const test = designExperiment(risk, smallestUsefulScope);" },
    { kind: "code", text: "const evidence = run(test).measure(acceptanceCriteria);" },
    { kind: "code", text: "decision = evidence.passes ? 'scale' : 'revise';" },
    { kind: "spec", text: "Implementation: isolate risk, measure result, decide next build." },
    { kind: "terminal", text: "$ prototype --question latency --acceptance 1-frame" },
  ],
  neural: [
    { kind: "code", text: "const logits = model.forward(batch.inputs);" },
    { kind: "code", text: "const loss = crossEntropy(logits, batch.labels);" },
    { kind: "code", text: "loss.backward(); optimizer.step();" },
    { kind: "code", text: "representation = model.hidden[layer].detach();" },
    { kind: "spec", text: "Implementation: forward pass, loss, gradient, hidden representation." },
    { kind: "terminal", text: "$ train network --epochs 40 --validate --checkpoint" },
  ],
  ai: [
    { kind: "code", text: "const Q = tokens.matmul(Wq), K = tokens.matmul(Wk), V = tokens.matmul(Wv);" },
    { kind: "code", text: "const weights = softmax(Q.matmul(K.T).divide(Math.sqrt(dk)));" },
    { kind: "code", text: "const attended = weights.matmul(V);" },
    { kind: "code", text: "answer = model.generate(prompt.with(context, tools));" },
    { kind: "spec", text: "Implementation: tokens, attention weights, context, tool call." },
    { kind: "terminal", text: "$ run agent --context retrieved --tools enabled" },
  ],
  story: [
    { kind: "code", text: "const layers = [geometry, optics, compute, ai].filter(servesShot);" },
    { kind: "code", text: "const proof = layers.map(layer => layer.evidence()).join(' -> ');" },
    { kind: "code", text: "const take = compose(storyNeed, crew, layers, taste);" },
    { kind: "code", text: "return removeOrnament(take).preserveMeaning();" },
    { kind: "spec", text: "Implementation: story need, technical layer, evidence, taste filter." },
    { kind: "terminal", text: "$ solve shot --story-first --hide-machinery" },
  ],
};

BLACKOUT_PAGES.forEach((page) => {
  if (RESEARCH_BLACKOUT_LINES[page.diagram]) page.lines = RESEARCH_BLACKOUT_LINES[page.diagram];
});

function getBlackoutMicroLines(pageIndex) {
  const diagram = BLACKOUT_PAGES[pageIndex]?.diagram;
  const lines = RESEARCH_MICRO_LINES_BY_DIAGRAM[diagram] || [];
  return lines;
}

function fallbackLayoutBlackoutText(tokens) {
  const rows = [];
  const maxChars = 31;
  const blockKinds = new Set(["code", "terminal", "diff add", "diff remove", "spec"]);
  let row = [];
  let count = 0;
  let columnOverride;
  const pushRow = () => {
    if (!row.length) return;
    rows.push({ tokens: row, kind: row[0]?.kind || "book", columnOverride });
    row = [];
    count = 0;
    columnOverride = undefined;
  };
  tokens.forEach((token) => {
    const nextColumnOverride = Number.isInteger(token.columnOverride) ? token.columnOverride : undefined;
    const isBlockLine = blockKinds.has(token.kind);
    const currentIsBlockLine = row.length && blockKinds.has(row[0]?.kind);
    const startsNewSourceLine = row.length && row[row.length - 1].lineIndex !== token.lineIndex;
    const shouldBreakForBlock = row.length && (
      (isBlockLine && startsNewSourceLine)
      || (isBlockLine && !currentIsBlockLine)
      || (!isBlockLine && currentIsBlockLine)
    );
    if (shouldBreakForBlock || (row.length && (count + token.word.length + 1 > maxChars || columnOverride !== nextColumnOverride))) {
      pushRow();
    }
    columnOverride = nextColumnOverride;
    row.push(token);
    count += token.word.length + 1;
  });
  pushRow();
  const firstColumnRows = Math.min(24, rows.length);
  const remainingRows = Math.max(0, rows.length - firstColumnRows);
  const remainingPerColumn = Math.max(1, Math.ceil(remainingRows / 2));
  const columnCounts = [0, 0, 0];
  return rows.map((item, index) => ({
    ...item,
    column: Number.isInteger(item.columnOverride)
      ? Math.max(0, Math.min(2, item.columnOverride))
      : (index < firstColumnRows ? 0 : 1 + Math.min(1, Math.floor((index - firstColumnRows) / remainingPerColumn))),
  })).map((item) => {
    const rowIndex = columnCounts[item.column] + 1;
    columnCounts[item.column] = rowIndex;
    return { ...item, row: rowIndex };
  });
}

function layoutBlackoutText(lines) {
  const tokens = lines.flatMap((line, lineIndex) => (
    line.text.split(" ").filter(Boolean).map((word, wordIndex) => ({
      word,
      kind: line.kind,
      lineIndex,
      wordIndex,
      columnOverride: line.column,
      targetWords: line.targetWords || [],
    }))
  ));
  return fallbackLayoutBlackoutText(tokens);
}

function cleanBlackoutWord(word) {
  return word.toLowerCase().replace(/[^a-z-]/g, '');
}

function formatBlackoutDisplayToken(token, tokenIndex, row) {
  const proseKinds = new Set(["book", "ref"]);
  if (!proseKinds.has(row.kind)) return token.word;
  let word = token.word;
  const isSourceStart = token.wordIndex === 0;
  if (isSourceStart && word) {
    word = word.charAt(0).toUpperCase() + word.slice(1);
  }
  return word;
}

function getPhraseTargetColumns(count) {
  if (count <= 1) return [0];
  if (count === 2) return [0, 2];
  if (count === 3) return [0, 1, 2];
  if (count === 4) return [0, 1, 1, 2];
  if (count === 5) return [0, 1, 1, 2, 2];
  return [0, 1, 2, 2].slice(0, count);
}

function selectPhraseWordKeys(rows, words) {
  const candidates = rows.flatMap((row, rowIndex) => row.tokens.map((token, tokenIndex) => ({
    clean: cleanBlackoutWord(token.word),
    column: row.column || 0,
    key: `${token.lineIndex}:${token.wordIndex}:${cleanBlackoutWord(token.word)}`,
    order: rowIndex * 1000 + tokenIndex,
    rowIndex,
    tokenIndex,
    sourceWordIndex: token.wordIndex,
    isAuthoredTarget: token.targetWords.map(cleanBlackoutWord).includes(cleanBlackoutWord(token.word)),
  })));
  const selected = new Map();
  const usedKeys = new Set();
  let lastOrder = -1;
  for (const [phraseIndex, word] of words.entries()) {
    const available = candidates.filter((candidate) => (
      candidate.isAuthoredTarget
      && candidate.clean === word
      && !usedKeys.has(candidate.key)
      && candidate.order > lastOrder
    ));
    if (!available.length) return new Map();
    const candidatePool = available;
    const choice = candidatePool
      .map((candidate) => ({
        candidate,
        score: Math.abs(candidate.rowIndex - (phraseIndex * 4)) - (candidate.column * 0.2),
      }))
      .sort((a, b) => a.score - b.score || a.candidate.order - b.candidate.order)[0].candidate;
    selected.set(choice.key, phraseIndex);
    usedKeys.add(choice.key);
    lastOrder = choice.order;
  }
  return selected;
}

function PhraseConstellation({ mapRef, segments, stepMs, lineMs, visibleCount, pulse }) {
  const visibleSegments = segments.slice(0, visibleCount ?? segments.length);
  const arrowGeometry = visibleSegments.map((segment, index) => {
    const aspect = mapRef.current
      ? mapRef.current.getBoundingClientRect().width / Math.max(1, mapRef.current.getBoundingClientRect().height)
      : 1;
    const dx = segment.x2 - segment.x1;
    const dy = (segment.y2 - segment.y1) / aspect;
    const length = Math.hypot(dx, dy);
    if (!length) return null;
    const ux = dx / length;
    const uy = dy / length;
    const px = -uy;
    const py = ux;
    const head = 0.82;
    const spread = 0.43;
    const tipX = segment.x2;
    const tipY = segment.y2;
    const baseX = tipX - ux * head;
    const baseY = tipY - uy * head * aspect;
    return {
      line: {
        x1: segment.x1,
        y1: segment.y1,
        x2: baseX,
        y2: baseY,
      },
      dot: {
        x: baseX,
        y: baseY,
        width: 0.64,
        height: 0.64 * aspect,
      },
      points: [
        [tipX, tipY],
        [baseX + px * spread, baseY + py * spread * aspect],
        [baseX - px * spread, baseY - py * spread * aspect],
      ].map(([x, y]) => `${x},${y}`).join(' '),
      delay: index,
    };
  }).filter(Boolean);

  return (
    <div ref={mapRef} className="blackout-panel__phrase-map" aria-hidden="true">
      <svg
        className={`blackout-panel__phrase-lines ${pulse ? `is-harmony-hit-${pulse.id % 2 ? 'a' : 'b'} is-harmony-lane--${pulse.lane}` : ''}`}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={pulse ? { '--harmony-pulse-ms': `${pulse.duration}ms` } : undefined}
      >
        {arrowGeometry.map((segment) => (
          <line
            key={`${segment.line.x1}-${segment.line.y1}-${segment.line.x2}-${segment.line.y2}`}
            x1={segment.line.x1}
            y1={segment.line.y1}
            x2={segment.line.x2}
            y2={segment.line.y2}
            style={{
              animationDelay: `0s, 0s`,
              animationDuration: `${lineMs / 1000}s, var(--harmony-pulse-ms, 220ms)`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}

function DiagramText({ x, y, children, className = "", anchor = "start" }) {
  return <text className={`diagram-text ${className}`} x={x} y={y} textAnchor={anchor}>{children}</text>;
}

function DiagramLabel({ x, y, children, anchor = "start" }) {
  return <DiagramText className="diagram-text--label" x={x} y={y} anchor={anchor}>{children}</DiagramText>;
}

function DiagramTitle({ children }) {
  return <text className="diagram-label" x="88" y="48">{children}</text>;
}

function FormulaText({ x, y, children, className = "" }) {
  return <DiagramText className={`diagram-text--formula ${className}`} x={x} y={y}>{children}</DiagramText>;
}

function TopLabel({ index = 0, children }) {
  return <DiagramLabel x={118 + index * 178} y="84">{children}</DiagramLabel>;
}

function BottomLabel({ index = 0, children }) {
  return <DiagramLabel x={118 + index * 178} y="376">{children}</DiagramLabel>;
}

function BottomFormula({ x = 118, children }) {
  return <FormulaText x={x} y="398">{children}</FormulaText>;
}

function diagramNote(index, voice = (index % 2 === 0 ? "call" : "answer")) {
  return `diagram-note-target diagram-note--${index} diagram-voice--${voice}`;
}

function ByrneTitle({ children }) {
  return (
    <g className="diagram-title-block">
      <text className="diagram-label diagram-label--byrne" x="56" y="34">{children}</text>
    </g>
  );
}

function ByrneLabel({ x, y, children, anchor = "middle", className = "" }) {
  return (
    <text className={`diagram-text diagram-text--byrne-label ${className}`} x={x} y={y} textAnchor={anchor}>
      {children}
    </text>
  );
}

function ByrneFormula({ x, y, children, anchor = "start" }) {
  return <text className="diagram-text diagram-text--byrne-formula" x={x} y={y} textAnchor={anchor}>{children}</text>;
}

function ByrnePoint({ x, y, label, anchor = "middle", dy = -18, note = 0 }) {
  const labelY = Number.isFinite(Number(y)) ? Number(y) + dy : y;
  return (
    <>
      <circle className={`diagram-dot ${diagramNote(note)}`} cx={x} cy={y} r="5.5" />
      <ByrneLabel x={x} y={labelY} anchor={anchor} className="diagram-point-label">{label}</ByrneLabel>
    </>
  );
}

function ByrneEuclidDiagram() {
  const ax = 276;
  const bx = 536;
  const baseY = 310;
  const cx = 406;
  const cy = 102.15;
  const r = 240;
  return (
    <>
      <ByrneTitle>EQUILATERAL TRIANGLE ON AB</ByrneTitle>
      <circle className={`diagram-circle diagram-circle--blue ${diagramNote(1, "call")}`} cx={ax} cy={baseY} r={r} />
      <circle className={`diagram-circle diagram-circle--red ${diagramNote(2, "answer")}`} cx={bx} cy={baseY} r={r} />
      <path className={`diagram-fill diagram-fill--yellow diagram-high-fill ${diagramNote(3, "call")}`} d={`M${ax} ${baseY} L${cx} ${cy} L${cx} ${baseY} Z`} />
      <path className={`diagram-fill diagram-fill--blue diagram-high-fill ${diagramNote(4, "answer")}`} d={`M${cx} ${cy} L${bx} ${baseY} L${cx} ${baseY} Z`} />
      <path className={`diagram-line diagram-line--red diagram-line--strong ${diagramNote(0, "call")}`} d={`M${ax} ${baseY} H${bx}`} />
      <path className={`diagram-line diagram-line--yellow diagram-line--strong ${diagramNote(5, "answer")}`} d={`M${ax} ${baseY} L${cx} ${cy}`} />
      <path className={`diagram-line diagram-line--red diagram-line--strong ${diagramNote(4, "answer")}`} d={`M${cx} ${cy} L${bx} ${baseY}`} />
      <path className="diagram-line diagram-line--construction" d={`M${cx} ${cy} V${baseY} M${ax} ${baseY} L${cx} ${baseY} L${bx} ${baseY}`} />
      <ByrnePoint x={ax} y={baseY} label="A" note={0} dy={24} />
      <ByrnePoint x={bx} y={baseY} label="B" note={1} dy={24} />
      <ByrnePoint x={cx} y={cy} label="C" note={2} dy={-20} />
      <ByrneLabel x="736" y="126">circle A, radius AB</ByrneLabel>
      <ByrneLabel x="742" y="176">circle B, radius AB</ByrneLabel>
      <ByrneFormula x="704" y="328">AB = AC = BC</ByrneFormula>
      <ByrneLabel x="704" y="360" anchor="start">Postulate III + common notion I.</ByrneLabel>
    </>
  );
}

function ByrnePythagorasDiagram() {
  return (
    <>
      <ByrneTitle>SQUARES ON A RIGHT TRIANGLE</ByrneTitle>
      <path className="diagram-fill diagram-fill--yellow diagram-high-fill" d="M270 220 L270 330 L160 330 L160 220 Z" />
      <path className="diagram-fill diagram-fill--blue diagram-high-fill" d="M270 330 L430 330 L430 390 L270 390 Z" />
      <path className="diagram-fill diagram-fill--red diagram-high-fill" d="M270 220 L430 330 L540 170 L380 60 Z" />
      <path className={`diagram-line diagram-line--yellow diagram-line--strong ${diagramNote(0, "call")}`} d="M270 330 L270 220" />
      <path className={`diagram-line diagram-line--blue diagram-line--strong ${diagramNote(1, "answer")}`} d="M270 330 L430 330" />
      <path className={`diagram-line diagram-line--red diagram-line--strong ${diagramNote(2, "call")}`} d="M270 220 L430 330" />
      <path className={`diagram-line ${diagramNote(1, "answer")}`} d="M270 220 L270 330 L160 330 L160 220 Z M270 330 L430 330 L430 390 L270 390 Z M270 220 L430 330 L540 170 L380 60 Z" />
      <path className="diagram-line diagram-line--construction" d="M292 308 V330 H270 M270 220 L380 60 M430 330 L540 170" />
      <ByrnePoint x="270" y="330" label="A" note={0} dy={22} />
      <ByrnePoint x="270" y="220" label="B" note={1} dy={-20} />
      <ByrnePoint x="430" y="330" label="C" note={2} dy={22} />
      <ByrneLabel x="144" y="198" anchor="start">square on AB</ByrneLabel>
      <ByrneLabel x="280" y="406" anchor="start">square on AC</ByrneLabel>
      <ByrneLabel x="508" y="122" anchor="start">square on BC</ByrneLabel>
      <ByrneFormula x="664" y="210">AB² + AC² = BC²</ByrneFormula>
      <ByrneLabel x="664" y="246" anchor="start">Euclid I.47.</ByrneLabel>
    </>
  );
}

function ByrneCalculusDiagram() {
  return (
    <>
      <ByrneTitle>TANGENT, LIMIT, AREA</ByrneTitle>
      <path className="diagram-fill diagram-fill--yellow diagram-high-fill" d="M132 340 L132 304 C230 284 314 226 398 174 C488 118 590 120 680 178 C762 230 834 266 900 276 L900 340 Z" />
      <path className={`diagram-line diagram-line--axis ${diagramNote(0, "call")}`} d="M104 340 H928 M132 366 V78" />
      <path className={`diagram-line diagram-line--blue diagram-line--strong ${diagramNote(1, "answer")}`} d="M132 304 C230 284 314 226 398 174 C488 118 590 120 680 178 C762 230 834 266 900 276" />
      <path className={`diagram-line diagram-line--red diagram-line--strong ${diagramNote(2, "call")}`} d="M398 174 L700 112" />
      <path className="diagram-line diagram-line--construction" d="M398 174 V340 M700 112 V340 M240 340 V268 M350 340 V202 M460 340 V138 M570 340 V130 M680 340 V178 M790 340 V246" />
      <ByrnePoint x="398" y="174" label="x" note={2} dy={-22} />
      <ByrneLabel x="914" y="360">x</ByrneLabel>
      <ByrneLabel x="112" y="84">y</ByrneLabel>
      <ByrneLabel x="548" y="102">tangent line</ByrneLabel>
      <ByrneLabel x="510" y="382">Riemann sum approaches area.</ByrneLabel>
      <ByrneFormula x="642" y="178">f'(x)=lim Δy/Δx</ByrneFormula>
      <ByrneFormula x="642" y="220">∫ f(x) dx</ByrneFormula>
    </>
  );
}

function ByrnePrismDiagram() {
  return (
    <>
      <ByrneTitle>PRISM DISPERSION</ByrneTitle>
      <path className={`diagram-line diagram-line--red diagram-line--strong ${diagramNote(0, "call")}`} d="M86 212 L380 170" />
      <path className="diagram-fill diagram-fill--yellow diagram-high-fill" d="M380 132 L380 292 L520 212 Z" />
      <path className={`diagram-line diagram-line--strong ${diagramNote(1, "answer")}`} d="M380 132 L380 292 L520 212 Z" />
      <path className="diagram-line diagram-line--construction" d="M380 82 V342 M520 118 V306 M350 212 H548" />
      <path className={`diagram-line diagram-ray diagram-line--red ${diagramNote(2, "call")}`} d="M520 212 L888 94" />
      <path className={`diagram-line diagram-ray diagram-line--yellow ${diagramNote(3, "answer")}`} d="M520 212 L910 176" />
      <path className={`diagram-line diagram-ray diagram-line--blue ${diagramNote(4, "call")}`} d="M520 212 L888 332" />
      <path className="diagram-line diagram-line--construction" d="M300 188 A84 84 0 0 1 302 236 M602 166 A98 98 0 0 1 606 260" />
      <ByrneLabel x="146" y="178">incident ray</ByrneLabel>
      <ByrneLabel x="320" y="156">normal</ByrneLabel>
      <ByrneLabel x="726" y="86">red</ByrneLabel>
      <ByrneLabel x="760" y="174">yellow</ByrneLabel>
      <ByrneLabel x="724" y="342">blue</ByrneLabel>
      <ByrneFormula x="610" y="390">n₁ sin θ₁ = n₂ sin θ₂</ByrneFormula>
    </>
  );
}

function ByrnePerspectiveDiagram() {
  return (
    <>
      <ByrneTitle>PICTURE PLANE AND VANISHING POINT</ByrneTitle>
      <rect className="diagram-fill diagram-fill--yellow diagram-high-fill" x="392" y="88" width="34" height="264" />
      <path className="diagram-fill diagram-fill--blue diagram-high-fill" d="M502 190 L646 148 L646 272 L502 236 Z" />
      <path className="diagram-fill diagram-fill--red diagram-high-fill" d="M648 148 L812 122 L812 300 L648 272 Z" />
      <path className={`diagram-line diagram-line--axis ${diagramNote(0, "call")}`} d="M120 210 H914" />
      <circle className={`diagram-circle diagram-circle--blue ${diagramNote(1, "answer")}`} cx="178" cy="210" r="26" />
      <path className={`diagram-line diagram-line--soft ${diagramNote(2, "call")}`} d="M178 210 L852 86 M178 210 L852 334 M178 210 L642 210 M178 210 L502 190 M178 210 L502 236" />
      <path className={`diagram-line diagram-line--strong ${diagramNote(3, "answer")}`} d="M392 88 V352 M426 88 V352 M502 190 L646 148 L646 272 L502 236 Z M648 148 L812 122 L812 300 L648 272 Z" />
      <circle className={`diagram-dot ${diagramNote(4, "call")}`} cx="642" cy="210" r="6" />
      <ByrneLabel x="178" y="166">eye</ByrneLabel>
      <ByrneLabel x="410" y="66">picture plane</ByrneLabel>
      <ByrneLabel x="642" y="230">VP</ByrneLabel>
      <ByrneLabel x="824" y="104">object plane</ByrneLabel>
      <ByrneFormula x="604" y="382">x′ = f x / z</ByrneFormula>
    </>
  );
}

function ByrneComputationDiagram() {
  const cells = ["1", "0", "1", "□", "1", "0"];
  return (
    <>
      <ByrneTitle>TURING TAPE AND STATE</ByrneTitle>
      <rect className="diagram-fill diagram-fill--yellow diagram-high-fill" x="144" y="246" width="576" height="72" />
      {cells.map((value, index) => (
        <g key={`cell-${index}`}>
          <rect className={`diagram-line ${diagramNote(index % 6, index % 2 ? "answer" : "call")}`} x={144 + index * 96} y="246" width="96" height="72" />
          <ByrneLabel x={192 + index * 96} y="282">{value}</ByrneLabel>
        </g>
      ))}
      <rect className="diagram-fill diagram-fill--blue diagram-high-fill" x="376" y="92" width="184" height="82" />
      <path className={`diagram-line diagram-line--red diagram-line--strong ${diagramNote(2, "call")}`} d="M468 174 V246 M426 206 H510 L468 246 Z" />
      <path className="diagram-line diagram-line--construction" d="M250 332 H620 M620 332 l-24 -14 M620 332 l-24 14" />
      <ByrneLabel x="468" y="74">finite control</ByrneLabel>
      <ByrneLabel x="468" y="132">state q₀</ByrneLabel>
      <ByrneLabel x="830" y="272">read / write / move</ByrneLabel>
      <ByrneFormula x="746" y="314">δ(q, symbol) → (q′, write, move)</ByrneFormula>
    </>
  );
}

function ByrneNetworkDiagram() {
  return (
    <>
      <ByrneTitle>HUMAN-MACHINE SYMBIOSIS</ByrneTitle>
      <circle className={`diagram-fill diagram-fill--yellow diagram-high-fill ${diagramNote(0, "call")}`} cx="202" cy="214" r="68" />
      <rect className={`diagram-fill diagram-fill--red diagram-high-fill ${diagramNote(1, "answer")}`} x="424" y="160" width="152" height="108" />
      <circle className={`diagram-fill diagram-fill--blue diagram-high-fill ${diagramNote(2, "call")}`} cx="802" cy="214" r="68" />
      <path className={`diagram-line diagram-line--strong ${diagramNote(3, "answer")}`} d="M270 214 H424 M576 214 H734" />
      <path className={`diagram-line diagram-line--soft ${diagramNote(4, "call")}`} d="M250 156 C364 68 640 68 756 156 M756 272 C640 358 364 358 250 272" />
      <path className="diagram-line diagram-line--construction" d="M424 196 H576 M424 232 H576 M318 214 l26 -14 v28 Z M686 214 l-26 -14 v28 Z" />
      <ByrneLabel x="202" y="120">human</ByrneLabel>
      <ByrneLabel x="500" y="138">interactive display</ByrneLabel>
      <ByrneLabel x="802" y="120">machine</ByrneLabel>
      <ByrneLabel x="502" y="342">request, search, suggestion, judgement.</ByrneLabel>
    </>
  );
}

function ByrneRenderingDiagram() {
  return (
    <>
      <ByrneTitle>RENDERING EQUATION</ByrneTitle>
      <path className="diagram-fill diagram-fill--yellow diagram-high-fill" d="M146 324 C260 260 400 252 552 318 L552 352 L146 352 Z" />
      <circle className={`diagram-fill diagram-fill--blue diagram-high-fill ${diagramNote(0, "call")}`} cx="184" cy="120" r="32" />
      <circle className={`diagram-fill diagram-fill--red diagram-high-fill ${diagramNote(1, "answer")}`} cx="836" cy="164" r="28" />
      <circle className={`diagram-dot ${diagramNote(2, "call")}`} cx="384" cy="300" r="7" />
      <path className={`diagram-line diagram-line--strong ${diagramNote(3, "answer")}`} d="M146 324 C260 260 400 252 552 318" />
      <path className={`diagram-line diagram-line--blue ${diagramNote(4, "call")}`} d="M384 300 L184 120" />
      <path className={`diagram-line diagram-line--red ${diagramNote(5, "answer")}`} d="M384 300 L836 164" />
      <path className="diagram-line diagram-line--construction" d="M384 300 V196 M384 300 C426 244 486 214 560 210 M384 300 L664 92 M384 300 L700 324" />
      <ByrneLabel x="184" y="74">camera ray ωₒ</ByrneLabel>
      <ByrneLabel x="836" y="112">incoming light Lᵢ</ByrneLabel>
      <ByrneLabel x="384" y="326">surface point x</ByrneLabel>
      <ByrneLabel x="424" y="198">normal n</ByrneLabel>
      <ByrneFormula x="588" y="366">Lₒ(x,ωₒ)=Lₑ+∫Ω fᵣ Lᵢ(ωᵢ·n)dωᵢ</ByrneFormula>
    </>
  );
}

function ByrneLightFieldDiagram() {
  return (
    <>
      <ByrneTitle>TWO-PLANE LIGHT FIELD</ByrneTitle>
      <path className="diagram-fill diagram-fill--blue diagram-high-fill" d="M190 100 L806 132 L806 178 L190 146 Z" />
      <path className="diagram-fill diagram-fill--red diagram-high-fill" d="M190 286 L806 252 L806 298 L190 332 Z" />
      <path className={`diagram-line diagram-line--strong ${diagramNote(0, "call")}`} d="M190 100 L806 132 L806 178 L190 146 Z M190 286 L806 252 L806 298 L190 332 Z" />
      <path className={`diagram-line diagram-line--blue ${diagramNote(1, "answer")}`} d="M246 122 L742 280 M358 128 L630 274 M470 134 L518 268 M582 140 L406 262 M694 146 L294 256" />
      <path className="diagram-line diagram-line--construction" d="M246 122 V306 M358 128 V296 M470 134 V286 M582 140 V276 M694 146 V266" />
      <ByrneLabel x="190" y="78" anchor="start">camera plane (u,v)</ByrneLabel>
      <ByrneLabel x="190" y="364" anchor="start">image plane (s,t)</ByrneLabel>
      <ByrneLabel x="818" y="164" anchor="start">sampled aperture</ByrneLabel>
      <ByrneFormula x="654" y="364">L(u,v,s,t)</ByrneFormula>
    </>
  );
}

function ByrneSketchpadDiagram() {
  return (
    <>
      <ByrneTitle>SKETCHPAD CONSTRAINT LOOP</ByrneTitle>
      <rect className="diagram-fill diagram-fill--blue diagram-high-fill" x="174" y="92" width="516" height="260" />
      <circle className={`diagram-fill diagram-fill--yellow diagram-high-fill ${diagramNote(0, "call")}`} cx="418" cy="226" r="76" />
      <path className={`diagram-line diagram-line--strong ${diagramNote(1, "answer")}`} d="M174 92 H690 V352 H174 Z M342 226 H494 M418 150 V302 M358 170 L478 282 M358 282 L478 170" />
      <circle className={`diagram-circle ${diagramNote(2, "call")}`} cx="418" cy="226" r="76" />
      <path className={`diagram-fill diagram-fill--red diagram-high-fill ${diagramNote(3, "answer")}`} d="M596 296 L846 362 L834 396 L584 330 Z" />
      <path className="diagram-line diagram-line--construction" d="M596 296 L548 252 M846 362 L834 396 L584 330" />
      <ByrneLabel x="420" y="70">CRT display</ByrneLabel>
      <ByrneLabel x="418" y="330">constrained circle + axes</ByrneLabel>
      <ByrneLabel x="794" y="340">light pen</ByrneLabel>
      <ByrneFormula x="696" y="122">state = reducer(state, gesture)</ByrneFormula>
    </>
  );
}

function ByrneStageDiagram() {
  return (
    <>
      <ByrneTitle>PEPPER'S GHOST SIGHTLINE</ByrneTitle>
      <rect className="diagram-fill diagram-fill--red diagram-high-fill" x="118" y="304" width="760" height="42" />
      <rect className="diagram-fill diagram-fill--blue diagram-high-fill" x="666" y="116" width="150" height="110" />
      <path className="diagram-fill diagram-fill--yellow diagram-high-fill" d="M330 116 L518 304 L466 304 L278 116 Z" />
      <path className={`diagram-line diagram-line--strong ${diagramNote(0, "call")}`} d="M118 304 H878 M330 116 L518 304 M278 116 L466 304 M666 116 H816 V226 H666 Z" />
      <path className={`diagram-line diagram-line--blue ${diagramNote(1, "answer")}`} d="M214 326 L398 210 L742 172" />
      <path className={`diagram-line diagram-line--red ${diagramNote(2, "call")}`} d="M742 172 L492 304" />
      <path className="diagram-line diagram-line--construction" d="M398 210 V304 M214 326 H308 M492 304 h78" />
      <ByrneLabel x="214" y="366">viewer</ByrneLabel>
      <ByrneLabel x="396" y="96">angled glass</ByrneLabel>
      <ByrneLabel x="742" y="94">hidden stage</ByrneLabel>
      <ByrneLabel x="502" y="332">virtual image</ByrneLabel>
    </>
  );
}

function ByrneVolumeDiagram() {
  return (
    <>
      <ByrneTitle>TRACKED CAMERA IN LED VOLUME</ByrneTitle>
      <path className="diagram-fill diagram-fill--blue diagram-high-fill" d="M492 112 H806 L900 200 V334 H492 Z" />
      <path className="diagram-fill diagram-fill--yellow diagram-high-fill" d="M232 304 H806 L900 334 H334 Z" />
      <path className="diagram-fill diagram-fill--red diagram-high-fill" d="M492 112 H806 V304 H492 Z" />
      <path className={`diagram-line diagram-line--strong ${diagramNote(0, "call")}`} d="M492 112 H806 L900 200 V334 H492 Z M806 112 V304 L900 334 M492 304 H806" />
      <path className={`diagram-line diagram-line--blue ${diagramNote(1, "answer")}`} d="M132 256 L492 112 M132 256 L806 112 M132 256 L806 304 M132 256 L492 304" />
      <path className="diagram-line diagram-line--construction" d="M492 112 V304 M806 112 V304 M232 304 L492 112 M334 334 L806 304" />
      <path className={`diagram-line diagram-line--red diagram-line--strong ${diagramNote(2, "call")}`} d="M102 236 H146 V276 H102 Z M146 246 L182 228 V284 L146 266 Z" />
      <circle className={`diagram-dot ${diagramNote(3, "answer")}`} cx="132" cy="256" r="7" />
      <ByrneLabel x="134" y="214">tracked camera</ByrneLabel>
      <ByrneLabel x="390" y="118">view frustum</ByrneLabel>
      <ByrneLabel x="638" y="88">active LED wall</ByrneLabel>
      <ByrneLabel x="792" y="362">LED floor</ByrneLabel>
      <ByrneFormula x="520" y="392">genlock + lens metadata + color calibration.</ByrneFormula>
    </>
  );
}

function ByrnePrototypeDiagram() {
  return (
    <>
      <ByrneTitle>PROTOTYPE EVIDENCE LOOP</ByrneTitle>
      <path className={`diagram-line diagram-line--construction ${diagramNote(0, "call")}`} d="M242 226 C296 104 446 92 500 206 C554 92 704 104 758 226 C688 334 552 338 500 250 C448 338 312 334 242 226 Z" />
      <rect className="diagram-fill diagram-fill--yellow diagram-high-fill" x="122" y="150" width="220" height="96" />
      <rect className="diagram-fill diagram-fill--blue diagram-high-fill" x="390" y="106" width="220" height="96" />
      <rect className="diagram-fill diagram-fill--red diagram-high-fill" x="658" y="194" width="220" height="96" />
      <path className={`diagram-line diagram-line--strong ${diagramNote(1, "answer")}`} d="M122 150 H342 V246 H122 Z M390 106 H610 V202 H390 Z M658 194 H878 V290 H658 Z" />
      <path className={`diagram-line diagram-line--blue ${diagramNote(2, "call")}`} d="M342 198 H390 M610 154 C646 154 646 242 658 242 M232 246 V330 H768 V290" />
      <path className="diagram-line diagram-line--construction" d="M158 178 H306 M426 134 H574 M694 222 H842" />
      <ByrneLabel x="232" y="132">prototype</ByrneLabel>
      <ByrneLabel x="500" y="88">test</ByrneLabel>
      <ByrneLabel x="768" y="176">handoff</ByrneLabel>
      <ByrneLabel x="500" y="366">unknown → experiment → evidence → system.</ByrneLabel>
    </>
  );
}

function ByrneNeuralDiagram() {
  const inputs = [126, 222, 318];
  const hiddenA = [94, 194, 294];
  const hiddenB = [148, 268];
  return (
    <>
      <ByrneTitle>BACKPROPAGATION NETWORK</ByrneTitle>
      <path className={`diagram-line diagram-line--construction ${diagramNote(0, "call")}`} d="M174 126 L382 94 M174 126 L382 194 M174 126 L382 294 M174 222 L382 94 M174 222 L382 194 M174 222 L382 294 M174 318 L382 94 M174 318 L382 194 M174 318 L382 294 M382 94 L592 148 M382 194 L592 148 M382 294 L592 148 M382 94 L592 268 M382 194 L592 268 M382 294 L592 268 M592 148 L810 208 M592 268 L810 208" />
      {inputs.map((y, index) => <circle key={`input-${y}`} className={`diagram-fill diagram-fill--yellow diagram-high-fill ${diagramNote(index, "call")}`} cx="174" cy={y} r="20" />)}
      {hiddenA.map((y, index) => <circle key={`hidden-a-${y}`} className={`diagram-fill diagram-fill--blue diagram-high-fill ${diagramNote(index + 1, "answer")}`} cx="382" cy={y} r="20" />)}
      {hiddenB.map((y, index) => <circle key={`hidden-b-${y}`} className={`diagram-fill diagram-fill--red diagram-high-fill ${diagramNote(index + 3, "call")}`} cx="592" cy={y} r="20" />)}
      <circle className={`diagram-fill diagram-fill--blue diagram-high-fill ${diagramNote(5, "answer")}`} cx="810" cy="208" r="22" />
      <path className={`diagram-line diagram-line--red diagram-line--strong ${diagramNote(4, "answer")}`} d="M810 208 C706 364 344 364 174 318" />
      <ByrneLabel x="174" y="74">input</ByrneLabel>
      <ByrneLabel x="382" y="54">hidden layer</ByrneLabel>
      <ByrneLabel x="592" y="108">hidden layer</ByrneLabel>
      <ByrneLabel x="810" y="170">output</ByrneLabel>
      <ByrneFormula x="526" y="386">weights ← weights - η ∂loss/∂w</ByrneFormula>
    </>
  );
}

function ByrneAttentionDiagram() {
  return (
    <>
      <ByrneTitle>SCALED DOT-PRODUCT ATTENTION</ByrneTitle>
      <rect className="diagram-fill diagram-fill--blue diagram-high-fill" x="116" y="82" width="230" height="54" />
      <rect className="diagram-fill diagram-fill--yellow diagram-high-fill" x="116" y="184" width="230" height="54" />
      <rect className="diagram-fill diagram-fill--red diagram-high-fill" x="116" y="286" width="230" height="54" />
      <rect className="diagram-fill diagram-fill--yellow diagram-high-fill" x="458" y="126" width="160" height="160" />
      <rect className="diagram-fill diagram-fill--blue diagram-high-fill" x="746" y="184" width="150" height="82" />
      <path className={`diagram-line diagram-line--strong ${diagramNote(0, "call")}`} d="M116 82 H346 V136 H116 Z M116 184 H346 V238 H116 Z M116 286 H346 V340 H116 Z M458 126 H618 V286 H458 Z M746 184 H896 V266 H746 Z" />
      <path className={`diagram-line diagram-line--blue ${diagramNote(1, "answer")}`} d="M346 109 L458 166 M346 211 L458 206 M346 313 L458 246 M618 206 H746" />
      <path className="diagram-line diagram-line--construction" d="M498 126 V286 M538 126 V286 M578 126 V286 M458 166 H618 M458 206 H618 M458 246 H618" />
      <ByrneLabel x="74" y="110" anchor="start">Q</ByrneLabel>
      <ByrneLabel x="74" y="212" anchor="start">K</ByrneLabel>
      <ByrneLabel x="74" y="314" anchor="start">V</ByrneLabel>
      <ByrneLabel x="538" y="104">attention matrix</ByrneLabel>
      <ByrneLabel x="822" y="164">context</ByrneLabel>
      <ByrneFormula x="566" y="364">softmax(QKᵀ / √dₖ)V</ByrneFormula>
    </>
  );
}

function ByrneStoryDiagram() {
  return (
    <>
      <ByrneTitle>STORY SYSTEMS LOOP</ByrneTitle>
      <circle className={`diagram-fill diagram-fill--yellow diagram-high-fill ${diagramNote(0, "call")}`} cx="136" cy="300" r="28" />
      <circle className={`diagram-fill diagram-fill--blue diagram-high-fill ${diagramNote(1, "answer")}`} cx="330" cy="138" r="28" />
      <circle className={`diagram-fill diagram-fill--red diagram-high-fill ${diagramNote(2, "call")}`} cx="534" cy="270" r="28" />
      <circle className={`diagram-fill diagram-fill--blue diagram-high-fill ${diagramNote(3, "answer")}`} cx="730" cy="126" r="28" />
      <circle className={`diagram-fill diagram-fill--yellow diagram-high-fill ${diagramNote(4, "call")}`} cx="874" cy="300" r="28" />
      <path className={`diagram-line diagram-line--strong ${diagramNote(5, "answer")}`} d="M136 300 L330 138 L534 270 L730 126 L874 300" />
      <path className="diagram-line diagram-line--construction" d="M136 300 C300 364 708 364 874 300 M330 138 C426 74 628 74 730 126 M534 270 V110" />
      <ByrneLabel x="136" y="350">geometry</ByrneLabel>
      <ByrneLabel x="330" y="92">light</ByrneLabel>
      <ByrneLabel x="534" y="312">code</ByrneLabel>
      <ByrneLabel x="730" y="82">AI</ByrneLabel>
      <ByrneLabel x="874" y="350">story</ByrneLabel>
      <ByrneFormula x="392" y="394">shot = solve(story, geometry, light, code, crew)</ByrneFormula>
    </>
  );
}

function elementPoint(cx, cy, radius, deg) {
  const centerX = Number(cx);
  const centerY = Number(cy);
  const r = Number(radius);
  const rad = (deg - 90) * Math.PI / 180;
  return [centerX + Math.cos(rad) * r, centerY + Math.sin(rad) * r];
}

function elementWedgePath(cx, cy, radius, startDeg, endDeg) {
  const centerX = Number(cx);
  const centerY = Number(cy);
  const r = Number(radius);
  const [sx, sy] = elementPoint(cx, cy, radius, startDeg);
  const [ex, ey] = elementPoint(cx, cy, radius, endDeg);
  const largeArc = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  return `M${centerX} ${centerY} L${sx.toFixed(2)} ${sy.toFixed(2)} A${r} ${r} 0 ${largeArc} 1 ${ex.toFixed(2)} ${ey.toFixed(2)} Z`;
}

function ElementLine({ x1, y1, x2, y2, color = "", note = 0, dotted = false, strong = false }) {
  return (
    <line
      className={`diagram-line ${color ? `diagram-line--${color}` : ""} ${dotted ? "diagram-line--dotted" : ""} ${strong ? "diagram-line--strong" : ""} ${diagramNote(note)}`}
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
    />
  );
}

function ElementCircle({ cx, cy, r, color = "", note = 0, dotted = false }) {
  return (
    <circle
      className={`diagram-circle ${color ? `diagram-circle--${color}` : ""} ${dotted ? "diagram-line--dotted" : ""} ${diagramNote(note)}`}
      cx={cx}
      cy={cy}
      r={r}
    />
  );
}

function ElementWedge({ cx, cy, r, start, end, fill = "yellow", note = 0 }) {
  return <path className={`diagram-fill diagram-fill--${fill} diagram-high-fill ${diagramNote(note)}`} d={elementWedgePath(cx, cy, r, start, end)} />;
}

function ElementPoly({ points, fill = "yellow", note = 0 }) {
  return <polygon className={`diagram-fill diagram-fill--${fill} diagram-high-fill ${diagramNote(note)}`} points={points} />;
}

function ElementPoint({ x, y, label, note = 0, dy = -14 }) {
  return <ByrnePoint x={x} y={y} label={label} note={note} dy={dy} />;
}

function ElementsEuclidDiagram() {
  // Euclid I.1 — circles of radius AB centred at A and B intersect at
  // C; the equilateral triangle is constructed. AB=228, apex height
  // 197.45. Baseline raised to y=252 lifts the figure into the upper
  // register of the slot.
  // A=(386,252), B=(614,252), C=(500, 54.55).
  // Circles radius 228 → top y=24, bottom y=480 (clipped at viewBox
  // bottom, reads as construction continuing below the figure).
  return (
    <>
      <ByrneTitle>EQUILATERAL TRIANGLE ON AB</ByrneTitle>
      <path
        className={`diagram-fill diagram-fill--yellow diagram-high-fill ${diagramNote(0)}`}
        d="M500 54.55 A228 228 0 0 1 500 449.45 A228 228 0 0 1 500 54.55 Z"
      />
      <ElementPoly points="386,252 614,252 500,54.55" fill="blue" note={1} />
      <ElementCircle cx="386" cy="252" r="228" color="red" note={2} />
      <ElementCircle cx="614" cy="252" r="228" color="yellow" note={3} />
      <ElementLine x1="386" y1="252" x2="614" y2="252" color="black" note={4} strong />
      <ElementLine x1="386" y1="252" x2="500" y2="54.55" color="red" note={5} strong />
      <ElementLine x1="614" y1="252" x2="500" y2="54.55" color="yellow" note={0} strong />
      <ElementLine x1="500" y1="54.55" x2="500" y2="252" dotted note={1} />
      <ElementPoint x="386" y="252" label="A" note={2} dy={24} />
      <ElementPoint x="614" y="252" label="B" note={3} dy={24} />
      <ElementPoint x="500" y="54.55" label="C" note={4} dy={-16} />
    </>
  );
}

function ElementsPythagorasDiagram() {
  // Euclid I.47 — squares on a right triangle. Legs AB=90 (yellow) and
  // AC=120 (blue); hypotenuse BC=150 (red). Centered with the right
  // angle at A=(440,265). Yellow square sits up-and-left of A; blue
  // square sits down-and-right; red square is the tilted hypotenuse
  // square reaching up to its top corners D and E.
  // A=(440,265). B=(440,175). C=(560,265).
  // BC vector = (120, 90), |BC| = 150. Outward normal (perpendicular
  // pointing away from A) for the red square: rotate (120,90) by -90°
  // → (90,-120). Normalised × 150 = (90,-120) already length 150.
  // D = B + outward = (440+90, 175-120) = (530, 55).
  // E = C + outward = (560+90, 265-120) = (650, 145).
  return (
    <>
      <ByrneTitle>SQUARES ON A RIGHT TRIANGLE — I.47</ByrneTitle>
      <ElementPoly points="350,175 440,175 440,265 350,265" fill="yellow" note={0} />
      <ElementPoly points="440,265 560,265 560,385 440,385" fill="blue" note={1} />
      <ElementPoly points="440,175 560,265 650,145 530,55" fill="red" note={2} />
      <path
        className={`diagram-line diagram-line--soft ${diagramNote(3)}`}
        d="M350 265 A150 150 0 0 1 560 385"
      />
      <ElementLine x1="440" y1="265" x2="440" y2="175" color="yellow" note={4} strong />
      <ElementLine x1="440" y1="265" x2="560" y2="265" color="blue" note={5} strong />
      <ElementLine x1="440" y1="175" x2="560" y2="265" color="red" note={0} strong />
      <ElementLine x1="530" y1="55" x2="650" y2="145" dotted note={1} />
      <ElementLine x1="560" y1="265" x2="650" y2="145" dotted note={2} />
      <ElementLine x1="440" y1="175" x2="530" y2="55" dotted note={3} />
      <path className="diagram-line diagram-line--thin" d="M440 247 H458 V265" />
      <ElementPoint x="440" y="265" label="A" note={4} dy={24} />
      <ElementPoint x="440" y="175" label="B" note={5} dy={-16} />
      <ElementPoint x="560" y="265" label="C" note={0} dy={24} />
      <ElementPoint x="530" y="55" label="D" note={1} dy={-14} />
      <ElementPoint x="650" y="145" label="E" note={2} dy={-14} />
    </>
  );
}

function ElementsCalculusDiagram() {
  // Limit by squeeze — sin θ / θ → 1. Three nested shapes share a
  // common left edge OA: inner triangle OAP ⊂ circular sector OAP ⊂
  // outer triangle OAT. As θ → 0 the three areas converge.
  // Centered with the quarter circle taking the full middle of the slot.
  // O=(380,320), r=220, A=(600,320). Angle θ=42°.
  // sin42°=0.6691, cos42°=0.7431, tan42°=0.9004.
  // P = (380 + 220·0.7431, 320 - 220·0.6691) = (543.48, 172.80).
  // T = (600, 320 - 220·0.9004) = (600, 121.91).
  return (
    <>
      <ByrneTitle>SECANT BECOMING TANGENT</ByrneTitle>
      {/* Outer triangle OAT — filled yellow, the largest of the three */}
      <ElementPoly points="380,320 600,320 600,121.91" fill="yellow" note={0} />
      {/* Sector OAP — filled red, sits inside the outer triangle */}
      <path
        className={`diagram-fill diagram-fill--red diagram-high-fill ${diagramNote(1)}`}
        d="M380 320 L600 320 A220 220 0 0 0 543.48 172.80 Z"
      />
      {/* Inner triangle OAP — filled blue, smallest, sits inside sector */}
      <ElementPoly points="380,320 600,320 543.48,172.80" fill="blue" note={2} />
      {/* Quarter arc from A around to the top of the y-axis */}
      <path
        className={`diagram-line diagram-line--soft ${diagramNote(3)}`}
        d="M600 320 A220 220 0 0 0 380 100"
      />
      {/* x-axis: full stage of the figure */}
      <ElementLine x1="200" y1="320" x2="780" y2="320" color="black" note={4} strong />
      {/* y-axis at O */}
      <ElementLine x1="380" y1="370" x2="380" y2="80" color="black" note={5} strong />
      {/* Tangent AT — vertical, blue strong, touching the circle at A */}
      <ElementLine x1="600" y1="320" x2="600" y2="100" color="blue" note={0} strong />
      {/* Radius OP — yellow strong, the angular ray */}
      <ElementLine x1="380" y1="320" x2="543.48" y2="172.80" color="yellow" note={1} strong />
      {/* Secant OT — dotted hypotenuse of the outer triangle */}
      <ElementLine x1="380" y1="320" x2="600" y2="121.91" dotted note={2} />
      {/* Chord AP — dotted edge of the inner triangle */}
      <ElementLine x1="600" y1="320" x2="543.48" y2="172.80" dotted note={3} />
      {/* Angle θ arc at O between OA and OP */}
      <path className={`diagram-line diagram-line--thin ${diagramNote(4)}`} d="M460 320 A80 80 0 0 0 439.48 266.92" />
      {/* Right-angle marker at A (radius perpendicular to tangent) */}
      <path className="diagram-line diagram-line--thin" d="M600 302 H582 V320" />
      {/* Labels */}
      <ElementPoint x="380" y="320" label="O" note={5} dy={26} />
      <ElementPoint x="600" y="320" label="A" note={0} dy={26} />
      <ElementPoint x="543.48" y="172.80" label="P" note={1} dy={-14} />
      <ElementPoint x="600" y="121.91" label="T" note={2} dy={-14} />
    </>
  );
}

function ElementsPrismDiagram() {
  // White ray from source S strikes prism at A, refracts inside to B,
  // and fans into a spectrum at the exit face. Prism vertices form an
  // equilateral-ish triangle centred horizontally in the slot.
  // Prism: top (440,80), bottom (440,340), right tip (620,210).
  // S=(120,210) light source. Spectrum endpoints: (880,82), (920,210),
  // (880,338).
  return (
    <>
      <ByrneTitle>LIGHT BROKEN BY A TRIANGLE</ByrneTitle>
      <ElementPoly points="440,80 440,340 620,210" fill="yellow" note={0} />
      <circle
        className={`diagram-fill diagram-fill--red diagram-high-fill ${diagramNote(1)}`}
        cx="120"
        cy="210"
        r="24"
      />
      <ElementLine x1="120" y1="210" x2="440" y2="210" color="red" note={2} strong />
      <ElementLine x1="440" y1="80" x2="440" y2="340" color="black" note={3} strong />
      <ElementLine x1="440" y1="80" x2="620" y2="210" color="yellow" note={4} strong />
      <ElementLine x1="440" y1="340" x2="620" y2="210" color="blue" note={5} strong />
      <ElementLine x1="440" y1="210" x2="620" y2="210" color="red" note={0} />
      <ElementLine x1="620" y1="210" x2="880" y2="82" color="red" note={1} strong />
      <ElementLine x1="620" y1="210" x2="920" y2="210" color="yellow" note={2} strong />
      <ElementLine x1="620" y1="210" x2="880" y2="338" color="blue" note={3} strong />
      <ElementLine x1="440" y1="166" x2="440" y2="254" dotted note={4} />
      <ElementLine x1="560" y1="138" x2="680" y2="282" dotted note={5} />
      <ElementLine x1="120" y1="78" x2="120" y2="342" dotted note={0} />
      <ElementPoint x="120" y="210" label="S" note={1} dy={-22} />
      <ElementPoint x="440" y="210" label="A" note={2} dy={28} />
      <ElementPoint x="620" y="210" label="B" note={3} dy={28} />
    </>
  );
}

function ElementsPerspectiveDiagram() {
  // Linear perspective from a single point. Eye E at left, picture
  // plane PP (yellow vertical) at the canvas, horizon line dotted to
  // the vanishing point V on the far right. Two receding quads (blue,
  // red) show parallels converging at V.
  // E=(140,215). PP at x=380, y=90..340. V=(900,215).
  return (
    <>
      <ByrneTitle>PERSPECTIVE FROM A POINT</ByrneTitle>
      <ElementCircle cx="140" cy="215" r="26" color="blue" note={0} />
      <ElementLine x1="140" y1="215" x2="900" y2="80" note={1} />
      <ElementLine x1="140" y1="215" x2="900" y2="350" note={2} />
      <ElementLine x1="140" y1="215" x2="900" y2="215" color="red" note={3} strong />
      <ElementLine x1="380" y1="90" x2="380" y2="340" color="yellow" note={4} strong />
      <ElementPoly points="510,170 670,148 670,282 510,260" fill="blue" note={0} />
      <ElementPoly points="670,148 870,126 870,304 670,282" fill="red" note={1} />
      <ElementLine x1="510" y1="170" x2="870" y2="126" color="blue" note={2} />
      <ElementLine x1="510" y1="260" x2="870" y2="304" color="red" note={3} />
      <ElementLine x1="380" y1="215" x2="900" y2="215" dotted note={5} />
      <circle
        className={`diagram-fill diagram-fill--red diagram-high-fill ${diagramNote(0)}`}
        cx="900"
        cy="215"
        r="10"
      />
      <path className="diagram-line diagram-line--thin" d="M380 233 H362 V215" />
      <ElementPoint x="140" y="215" label="E" note={1} dy={-26} />
      <ElementPoint x="380" y="90" label="P" note={2} dy={-14} />
      <ElementPoint x="380" y="340" label="P'" note={3} dy={26} />
      <ElementPoint x="900" y="215" label="V" note={4} dy={-20} />
    </>
  );
}

function ElementsComputationDiagram() {
  // Turing's symbol machine — a tape of six cells centred horizontally;
  // a state box S above the active cell; a read/write head H pointing
  // down onto it. Tape extends dotted to either side; execution thread
  // dotted below.
  // Cell width 100, six cells from x=200..800, y=270..330. State box
  // and head sit above x=450..550.
  return (
    <>
      <ByrneTitle>FINITE SYMBOL MACHINE</ByrneTitle>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <ElementPoly
          key={`cell-${i}`}
          points={`${200 + i * 100},270 ${300 + i * 100},270 ${300 + i * 100},330 ${200 + i * 100},330`}
          fill={i % 3 === 0 ? 'yellow' : i % 3 === 1 ? 'blue' : 'red'}
          note={i}
        />
      ))}
      <ElementLine x1="200" y1="270" x2="800" y2="270" color="black" note={0} strong />
      <ElementLine x1="200" y1="330" x2="800" y2="330" color="black" note={1} strong />
      <ElementLine x1="500" y1="148" x2="500" y2="270" color="red" note={2} strong />
      <ElementPoly points="440,98 560,98 560,148 440,148" fill="blue" note={3} />
      <ElementPoly points="440,148 560,148 500,202" fill="red" note={4} />
      <ElementLine x1="140" y1="300" x2="200" y2="300" dotted note={5} />
      <ElementLine x1="800" y1="300" x2="860" y2="300" dotted note={0} />
      <ElementLine x1="240" y1="358" x2="760" y2="358" dotted note={1} />
      <ElementPoint x="250" y="300" label="α" note={2} dy={6} />
      <ElementPoint x="750" y="300" label="ω" note={3} dy={6} />
      <ElementPoint x="500" y="300" label="x" note={4} dy={6} />
      <ElementPoint x="500" y="123" label="S" note={5} dy={6} />
    </>
  );
}

function ElementsNetworkDiagram() {
  // Mean proportional (Euclid VI.13). Baseline AC with B dividing it;
  // semicircle on AC; perpendicular at B meets the semicircle at D so
  // BD² = AB · BC. Centered horizontally.
  // A=(140,330), C=(860,330). AC=720. B=(620,330). AB=480, BC=240.
  // BD = √(480·240) = √115200 ≈ 339.41. But viewBox height 385 with top
  // y=20 → D at y=330-339 = -9 (out of frame). Need to scale down.
  // Use AB=360, BC=180. BD = √64800 ≈ 254.55. AC=540.
  // A=(230,330), B=(590,330), C=(770,330). D=(590, 75.45).
  // Semicircle radius = 270, center (500,330). Top at y=60.
  return (
    <>
      <ByrneTitle>MEAN PROPORTIONAL BETWEEN TWO LINES</ByrneTitle>
      <ElementPoly points="230,330 590,330 590,75.45" fill="yellow" note={0} />
      <ElementPoly points="590,330 770,330 590,75.45" fill="blue" note={1} />
      <path
        className={`diagram-line diagram-line--soft ${diagramNote(2)}`}
        d="M230 330 A270 270 0 0 1 770 330"
      />
      <ElementLine x1="230" y1="330" x2="590" y2="75.45" color="red" note={3} />
      <ElementLine x1="590" y1="75.45" x2="770" y2="330" color="red" note={4} />
      <ElementLine x1="230" y1="330" x2="590" y2="330" color="black" note={5} strong />
      <ElementLine x1="590" y1="330" x2="770" y2="330" color="black" note={0} strong />
      <ElementLine x1="590" y1="330" x2="590" y2="75.45" color="red" note={1} strong />
      <path className="diagram-line diagram-line--thin" d="M590 312 H572 V330" />
      <path className="diagram-line diagram-line--thin" d="M408 324 V336 M680 324 V336" />
      <ElementPoint x="230" y="330" label="A" note={2} dy={24} />
      <ElementPoint x="590" y="330" label="B" note={3} dy={24} />
      <ElementPoint x="770" y="330" label="C" note={4} dy={24} />
      <ElementPoint x="590" y="75.45" label="D" note={5} dy={-14} />
    </>
  );
}

function ElementsRenderingDiagram() {
  // Hemisphere of directions at a surface point. Baseline = surface;
  // semicircle = hemisphere of incoming directions. Centered: P at
  // (500, 330), hemisphere radius 240 → top y=90.
  const P = { x: 500, y: 330 };
  const r = 240;
  const dir = (deg) => ({
    x: P.x + r * Math.cos((deg * Math.PI) / 180),
    y: P.y - r * Math.sin((deg * Math.PI) / 180),
  });
  const L1 = dir(135);
  const L2 = dir(110);
  const L3 = dir(70);
  const V = dir(45);
  const f = (n) => n.toFixed(2);
  return (
    <>
      <ByrneTitle>HEMISPHERE OF DIRECTIONS AT A POINT</ByrneTitle>
      <ElementPoly points={`120,${P.y} ${P.x},${P.y} ${P.x},${P.y + 18} 120,${P.y + 18}`} fill="yellow" note={0} />
      <ElementPoly points={`${P.x},${P.y} 880,${P.y} 880,${P.y + 18} ${P.x},${P.y + 18}`} fill="blue" note={1} />
      <path
        className={`diagram-line diagram-line--soft ${diagramNote(2)}`}
        d={`M${P.x - r} ${P.y} A${r} ${r} 0 0 1 ${P.x + r} ${P.y}`}
      />
      <ElementLine x1={P.x} y1={P.y} x2={P.x} y2={P.y - r} dotted note={3} />
      <ElementLine x1={f(L1.x)} y1={f(L1.y)} x2={P.x} y2={P.y} color="yellow" note={4} />
      <ElementLine x1={f(L2.x)} y1={f(L2.y)} x2={P.x} y2={P.y} color="yellow" note={5} />
      <ElementLine x1={f(L3.x)} y1={f(L3.y)} x2={P.x} y2={P.y} color="yellow" note={0} />
      <ElementLine x1={P.x} y1={P.y} x2={f(V.x)} y2={f(V.y)} color="red" note={1} strong />
      <circle
        className={`diagram-fill diagram-fill--yellow diagram-high-fill ${diagramNote(2)}`}
        cx={f(L2.x)}
        cy={f(L2.y)}
        r="20"
      />
      <circle
        className={`diagram-fill diagram-fill--red diagram-high-fill ${diagramNote(3)}`}
        cx={f(V.x)}
        cy={f(V.y)}
        r="20"
      />
      <path className="diagram-line diagram-line--thin" d={`M${P.x} ${P.y - 48} A48 48 0 0 0 ${P.x - 34} ${P.y - 34}`} />
      <path className="diagram-line diagram-line--thin" d={`M${P.x} ${P.y - 48} A48 48 0 0 1 ${P.x + 34} ${P.y - 34}`} />
      <ElementLine x1="120" y1={P.y} x2="880" y2={P.y} color="black" note={4} strong />
      <circle className={`diagram-dot ${diagramNote(5)}`} cx={P.x} cy={P.y} r="7" />
      <ElementPoint x={P.x} y={P.y} label="P" note={0} dy={32} />
      <ElementPoint x={P.x} y={P.y - r} label="N" note={1} dy={-14} />
      <ElementPoint x={f(L2.x)} y={f(L2.y)} label="L" note={2} dy={-26} />
      <ElementPoint x={f(V.x)} y={f(V.y)} label="V" note={3} dy={-26} />
    </>
  );
}

function ElementsLightFieldDiagram() {
  // Two parallel planes parameterize a 4D field of rays. Centered with
  // both planes spanning x=120..880, top plane at y=110, bottom at 350.
  const yTop = 110;
  const yBot = 350;
  const cols = [
    { x: 240, top: 'A', bot: "A'" },
    { x: 413, top: 'B', bot: "B'" },
    { x: 587, top: 'C', bot: "C'" },
    { x: 760, top: 'D', bot: "D'" },
  ];
  return (
    <>
      <ByrneTitle>TWO PARALLELS PARAMETERIZE A FIELD OF RAYS</ByrneTitle>
      <ElementPoly
        points={`120,${yTop - 7} 880,${yTop - 7} 880,${yTop + 7} 120,${yTop + 7}`}
        fill="blue"
        note={0}
      />
      <ElementPoly
        points={`120,${yBot - 7} 880,${yBot - 7} 880,${yBot + 7} 120,${yBot + 7}`}
        fill="yellow"
        note={1}
      />
      <ElementLine x1="120" y1={yTop} x2="880" y2={yTop} color="black" note={2} strong />
      <ElementLine x1="120" y1={yBot} x2="880" y2={yBot} color="black" note={3} strong />
      {cols.map((c, i) => (
        <ElementLine
          key={`g-${i}`}
          x1={c.x}
          y1={yTop - 28}
          x2={c.x}
          y2={yBot + 28}
          dotted
          note={i % 6}
        />
      ))}
      <ElementLine x1={cols[0].x} y1={yTop} x2={cols[3].x} y2={yBot} color="yellow" note={4} />
      <ElementLine x1={cols[1].x} y1={yTop} x2={cols[0].x} y2={yBot} color="yellow" note={5} />
      <ElementLine x1={cols[3].x} y1={yTop} x2={cols[1].x} y2={yBot} color="yellow" note={0} />
      <ElementLine x1={cols[2].x} y1={yTop} x2={cols[3].x} y2={yBot} color="blue" note={1} />
      <ElementLine x1={cols[0].x} y1={yTop} x2={cols[2].x} y2={yBot} color="blue" note={2} />
      <ElementLine x1={cols[1].x} y1={yTop} x2={cols[2].x} y2={yBot} color="red" note={3} strong />
      {cols.map((c, i) => (
        <g key={`d-${i}`}>
          <circle className={`diagram-dot ${diagramNote(i)}`} cx={c.x} cy={yTop} r="6" />
          <circle className={`diagram-dot ${diagramNote((i + 3) % 6)}`} cx={c.x} cy={yBot} r="6" />
        </g>
      ))}
      {cols.map((c, i) => (
        <g key={`l-${i}`}>
          <ElementPoint x={c.x} y={yTop} label={c.top} note={i % 6} dy={-26} />
          <ElementPoint x={c.x} y={yBot} label={c.bot} note={(i + 2) % 6} dy={32} />
        </g>
      ))}
    </>
  );
}

function ElementsInterfaceDiagram() {
  // A diagram becomes an instrument when the hand can test the idea.
  // Control disc at O with three sectors (red/yellow/blue) covering
  // the upper hemisphere; pointer OP swung up-right; gesture vector
  // PG continues outward to G. Centered on the slot.
  // O=(440,260), r=150. P at 30°: (440+130, 260-75) = (570, 185).
  // G further out at 30°: (440+260·cos30°, 260-260·sin30°)
  //                     = (440+225.17, 260-130) = (665.17, 130).
  return (
    <>
      <ByrneTitle>DIAGRAM AS INSTRUMENT</ByrneTitle>
      <ElementWedge cx="440" cy="260" r="150" start={180} end={240} fill="red" note={0} />
      <ElementWedge cx="440" cy="260" r="150" start={240} end={300} fill="yellow" note={1} />
      <ElementWedge cx="440" cy="260" r="150" start={300} end={360} fill="blue" note={2} />
      <ElementLine x1="440" y1="260" x2="290" y2="260" dotted note={3} />
      <ElementLine x1="440" y1="260" x2="365" y2="130.10" dotted note={4} />
      <ElementLine x1="440" y1="260" x2="515" y2="130.10" dotted note={5} />
      <ElementLine x1="440" y1="260" x2="590" y2="260" dotted note={0} />
      <ElementCircle cx="440" cy="260" r="150" color="black" note={1} />
      <ElementLine x1="440" y1="260" x2="570" y2="185" color="yellow" note={2} strong />
      <ElementLine x1="570" y1="185" x2="780" y2="64" color="red" note={3} strong />
      <path
        className={`diagram-line diagram-line--soft ${diagramNote(4)}`}
        d="M570 185 Q680 100 780 64"
      />
      <circle className={`diagram-dot ${diagramNote(5)}`} cx="440" cy="260" r="7" />
      <ElementPoint x="440" y="260" label="O" note={0} dy={26} />
      <ElementPoint x="570" y="185" label="P" note={1} dy={-14} />
      <ElementPoint x="780" y="64" label="G" note={2} dy={-14} />
    </>
  );
}

function ElementsStageDiagram() {
  // Stage technology: a lamp L at upper-left throws a cone of light
  // onto centre stage where an actor A stands; the audience E watches
  // from lower-right. The yellow cone is the apparatus, the red figure
  // is the story, the dotted blue sightline is what the eye actually
  // sees — "the trick is the moment the audience stops seeing the
  // machine". The construction normal at the actor's feet is the
  // common reference of stage and lighting.
  // L=(200,100). Cone hits floor at (420,340) left and (560,340) right.
  // Actor A: small filled red figure centred at x=490..510, y=270..340.
  // Audience eye E=(820,290).
  return (
    <>
      <ByrneTitle>LIGHT, FIGURE, AUDIENCE</ByrneTitle>
      {/* Yellow cone of light from lamp L down to stage */}
      <ElementPoly points="200,100 420,340 560,340" fill="yellow" note={0} />
      {/* Lit patch of stage floor — strong yellow strip under the cone */}
      <ElementPoly points="420,340 560,340 560,360 420,360" fill="yellow" note={1} />
      {/* Lamp body — red disk emitting */}
      <circle
        className={`diagram-fill diagram-fill--red diagram-high-fill ${diagramNote(2)}`}
        cx="200"
        cy="100"
        r="22"
      />
      {/* Cone edges as colored construction lines */}
      <ElementLine x1="200" y1="100" x2="420" y2="340" color="yellow" note={3} strong />
      <ElementLine x1="200" y1="100" x2="560" y2="340" color="yellow" note={4} strong />
      {/* Stage floor — strong black, full width */}
      <ElementLine x1="120" y1="340" x2="880" y2="340" color="black" note={5} strong />
      {/* Actor A — a filled blue figure standing on the stage */}
      <ElementPoly points="480,260 520,260 520,340 480,340" fill="blue" note={0} />
      {/* Audience eye E — blue disk at the audience position */}
      <circle
        className={`diagram-fill diagram-fill--blue diagram-high-fill ${diagramNote(1)}`}
        cx="820"
        cy="290"
        r="22"
      />
      {/* Sightline — dotted red ray from E up to A */}
      <ElementLine x1="820" y1="290" x2="500" y2="260" dotted note={2} />
      {/* Normal at the actor's mark — dotted vertical from stage up */}
      <ElementLine x1="500" y1="340" x2="500" y2="220" dotted note={3} />
      {/* Stage-edge tick marks at the wings */}
      <path className="diagram-line diagram-line--thin" d="M120 334 V346 M880 334 V346" />
      {/* Labels */}
      <ElementPoint x="200" y="100" label="L" note={4} dy={-22} />
      <ElementPoint x="500" y="260" label="A" note={5} dy={-14} />
      <ElementPoint x="820" y="290" label="E" note={0} dy={-22} />
      <ElementPoint x="500" y="340" label="S" note={1} dy={26} />
    </>
  );
}

function ElementsVolumeDiagram() {
  // Frustum of a viewing volume — a truncated pyramid extending from
  // camera C at left out to the distant face. Top face red, back face
  // blue, bottom face yellow. Sight rays from C through the four near
  // corners continuing to the four far corners.
  return (
    <>
      <ByrneTitle>FRUSTUM OF A VIEWING VOLUME</ByrneTitle>
      <ElementPoly points="500,90 740,90 860,200 600,200" fill="red" note={0} />
      <ElementPoly points="600,200 860,200 860,340 600,340" fill="blue" note={1} />
      <ElementPoly points="320,340 600,340 860,340 540,370" fill="yellow" note={2} />
      <ElementLine x1="500" y1="90" x2="740" y2="90" color="black" note={3} strong />
      <ElementLine x1="740" y1="90" x2="860" y2="200" color="black" note={4} strong />
      <ElementLine x1="860" y1="200" x2="860" y2="340" color="black" note={5} strong />
      <ElementLine x1="600" y1="340" x2="860" y2="340" color="black" note={0} strong />
      <ElementLine x1="500" y1="90" x2="600" y2="200" color="black" note={1} strong />
      <ElementLine x1="600" y1="200" x2="600" y2="340" color="black" note={2} strong />
      <ElementLine x1="160" y1="240" x2="500" y2="90" color="blue" note={3} />
      <ElementLine x1="160" y1="240" x2="740" y2="90" color="blue" note={4} dotted />
      <ElementLine x1="160" y1="240" x2="860" y2="340" color="red" note={5} />
      <ElementLine x1="160" y1="240" x2="320" y2="340" color="red" note={0} />
      <ElementLine x1="400" y1="180" x2="400" y2="296" dotted note={1} />
      <ElementPoly points="120,218 170,218 170,262 120,262" fill="black" note={2} />
      <ElementLine x1="120" y1="218" x2="170" y2="262" color="red" note={3} strong />
      <ElementPoint x="160" y="240" label="C" note={4} dy={28} />
      <ElementPoint x="500" y="90" label="A" note={5} dy={-14} />
      <ElementPoint x="860" y="200" label="B" note={0} dy={-14} />
      <ElementPoint x="860" y="340" label="C'" note={1} dy={26} />
      <ElementPoint x="320" y="340" label="D" note={2} dy={26} />
    </>
  );
}

function ElementsPrototypeDiagram() {
  // Three similar triangles between parallels — Euclid VI.1. Three
  // iterations on a shared baseline with apexes on a shared upper
  // parallel. Diagonal through-line connects A → B → C.
  return (
    <>
      <ByrneTitle>PROTOTYPE AS CONSTRUCTION — VI.1</ByrneTitle>
      <ElementPoly points="140,310 260,110 380,310" fill="yellow" note={0} />
      <ElementPoly points="380,310 500,110 620,310" fill="blue" note={1} />
      <ElementPoly points="620,310 740,110 860,310" fill="red" note={2} />
      <ElementLine x1="140" y1="310" x2="860" y2="310" color="black" note={3} strong />
      <ElementLine x1="240" y1="110" x2="760" y2="110" dotted note={4} />
      <ElementLine x1="260" y1="110" x2="500" y2="110" color="red" note={5} strong />
      <ElementLine x1="500" y1="110" x2="740" y2="110" color="red" note={0} strong />
      <ElementLine x1="260" y1="110" x2="260" y2="310" dotted note={1} />
      <ElementLine x1="500" y1="110" x2="500" y2="310" dotted note={2} />
      <ElementLine x1="740" y1="110" x2="740" y2="310" dotted note={3} />
      <path
        className="diagram-line diagram-line--thin"
        d="M260 292 H278 V310 M500 292 H518 V310 M740 292 H758 V310"
      />
      <ElementPoint x="260" y="110" label="A" note={5} dy={-14} />
      <ElementPoint x="500" y="110" label="B" note={0} dy={-14} />
      <ElementPoint x="740" y="110" label="C" note={1} dy={-14} />
      <ElementPoint x="140" y="310" label="0" note={2} dy={26} />
      <ElementPoint x="860" y="310" label="n" note={3} dy={26} />
    </>
  );
}

function ElementsNeuralDiagram() {
  // Forward pass and back-propagation. Four vertical layer rules with
  // their nodes; one forward path emphasised in red; a dotted blue
  // return curve below the rules carries the correction back. A target
  // Y* sits next to Y so the loss has a referent.
  const layers = [
    { x: 200, ys: [140, 230, 320], fill: 'yellow', label: 'X' },
    { x: 400, ys: [120, 230, 340], fill: 'blue', label: 'H₁' },
    { x: 600, ys: [170, 290], fill: 'red', label: 'H₂' },
    { x: 800, ys: [230], fill: 'blue', label: 'Y' },
  ];
  const ruleTop = 90;
  const ruleBot = 360;
  // Forward path: pick one path through the network.
  const forward = [
    { x: layers[0].x, y: layers[0].ys[2] },
    { x: layers[1].x, y: layers[1].ys[1] },
    { x: layers[2].x, y: layers[2].ys[0] },
    { x: layers[3].x, y: layers[3].ys[0] },
  ];
  return (
    <>
      <ByrneTitle>FORWARD PASS AND CORRECTION</ByrneTitle>
      {/* Vertical layer rules — thin construction guides */}
      {layers.map((layer, i) => (
        <ElementLine
          key={`rule-${i}`}
          x1={layer.x}
          y1={ruleTop}
          x2={layer.x}
          y2={ruleBot}
          dotted
          note={i % 6}
        />
      ))}
      {/* Sparse forward connections — only the relevant edges so the
          figure reads as a path rather than a graph mesh */}
      {layers.slice(0, -1).flatMap((layer, li) =>
        layer.ys.map((yA, yi) =>
          layers[li + 1].ys.map((yB, yj) => (
            <line
              key={`e-${li}-${yi}-${yj}`}
              className={`diagram-line diagram-line--thin ${diagramNote((li + yi + yj) % 6)}`}
              x1={layer.x}
              y1={yA}
              x2={layers[li + 1].x}
              y2={yB}
              style={{ opacity: 0.32 }}
            />
          ))
        )
      )}
      {/* Forward path — strong red */}
      {forward.slice(0, -1).map((p, i) => (
        <ElementLine
          key={`fwd-${i}`}
          x1={p.x}
          y1={p.y}
          x2={forward[i + 1].x}
          y2={forward[i + 1].y}
          color="red"
          note={i + 1}
          strong
        />
      ))}
      {/* Nodes — filled colored circles per layer */}
      {layers.flatMap((layer, li) =>
        layer.ys.map((y, yi) => (
          <circle
            key={`n-${li}-${yi}`}
            className={`diagram-fill diagram-fill--${layer.fill} diagram-high-fill ${diagramNote((li + yi) % 6)}`}
            cx={layer.x}
            cy={y}
            r="20"
          />
        ))
      )}
      {/* Target Y* — outlined circle to the right of Y, dotted lines
          to show "what Y should have been" */}
      <ElementCircle cx="880" cy="230" r="18" color="red" dotted note={0} />
      <ElementLine x1="820" y1="230" x2="862" y2="230" dotted note={1} />
      {/* Correction return path — single clean blue arc from Y back to
          X, bottoming out at the layer-rule line so it sits in the same
          frame as the rest of the figure. */}
      <path
        className={`diagram-line diagram-line--dotted ${diagramNote(2)}`}
        d="M820 252 Q 500 410 200 336"
        style={{ stroke: '#0e638e', strokeWidth: 1.8 }}
      />
      {/* Two chevron arrowheads tracking the curve's tangent direction
          (leftward / back-toward-the-input) at the H₂ and H₁ rule
          crossings */}
      <path
        className="diagram-line diagram-line--thin"
        d="M642 318 L630 326 L642 334 M394 354 L382 360 L394 366"
        style={{ stroke: '#0e638e', fill: 'none', strokeWidth: 1.6 }}
      />
      {/* Layer labels at the top of each rule — plain text, no
          marker dots, because the figure already has plenty of dots */}
      {layers.map((layer, i) => (
        <ByrneLabel key={`lbl-${i}`} x={layer.x} y={ruleTop - 12}>
          {layer.label}
        </ByrneLabel>
      ))}
      <ByrneLabel x="880" y="208">Y*</ByrneLabel>
    </>
  );
}

function ElementsAttentionDiagram() {
  // Scaled dot-product attention as a matrix correspondence.
  //   Q × Kᵀ → A,  A · V → C.
  // Three-token toy example: Q column on the left, Kᵀ row across the
  // top, the 3×3 attention matrix A in the middle (cell fills act as a
  // miniature heat-map of softmax weights), V column to the right of
  // A, and the context output C as the rightmost column. Diagonal
  // dominance with one off-diagonal cell shows the pattern reads
  // "each query attends mostly to its own key, with some bleed".
  // Cells are 90 wide × 56 tall.
  const cw = 90;
  const ch = 56;
  const aLeft = 314;
  const aTop = 130;
  const A = [
    [1.00, 0.18, 0.18],
    [0.18, 1.00, 0.45],
    [0.18, 0.18, 1.00],
  ];
  const Q_x = 200;
  const K_y = 70;
  const V_x = aLeft + 3 * cw + 24; // 608
  const C_x = V_x + cw + 24;       // 722
  const c_w = 70;
  const cellY = (i) => aTop + i * ch;
  const cellX = (j) => aLeft + j * cw;
  return (
    <>
      <ByrneTitle>ATTENTION — Q × Kᵀ → A, A · V → C</ByrneTitle>
      {/* Kᵀ row across the top of A */}
      {[0, 1, 2].map((j) => (
        <ElementPoly
          key={`k-${j}`}
          points={`${cellX(j)},${K_y} ${cellX(j) + cw},${K_y} ${cellX(j) + cw},${K_y + ch} ${cellX(j)},${K_y + ch}`}
          fill="red"
          note={j}
        />
      ))}
      {/* Q column at the left of A */}
      {[0, 1, 2].map((i) => (
        <ElementPoly
          key={`q-${i}`}
          points={`${Q_x},${cellY(i)} ${Q_x + cw},${cellY(i)} ${Q_x + cw},${cellY(i) + ch} ${Q_x},${cellY(i) + ch}`}
          fill="blue"
          note={i + 1}
        />
      ))}
      {/* V column to the right of A */}
      {[0, 1, 2].map((i) => (
        <ElementPoly
          key={`v-${i}`}
          points={`${V_x},${cellY(i)} ${V_x + cw},${cellY(i)} ${V_x + cw},${cellY(i) + ch} ${V_x},${cellY(i) + ch}`}
          fill="yellow"
          note={i + 2}
        />
      ))}
      {/* Attention matrix A — cell fills proportional to attention */}
      {A.map((row, i) =>
        row.map((w, j) => (
          <rect
            key={`a-${i}-${j}`}
            x={cellX(j)}
            y={cellY(i)}
            width={cw}
            height={ch}
            fill="#fac22b"
            fillOpacity={w}
            stroke="#111"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))
      )}
      {/* Context output C — single column on the right, blue (matches
          the Q palette since C aligns to query positions) */}
      {[0, 1, 2].map((i) => (
        <ElementPoly
          key={`c-${i}`}
          points={`${C_x},${cellY(i)} ${C_x + c_w},${cellY(i)} ${C_x + c_w},${cellY(i) + ch} ${C_x},${cellY(i) + ch}`}
          fill="blue"
          note={i + 3}
        />
      ))}
      {/* Strong outlines on the four matrices */}
      <ElementLine x1={Q_x} y1={aTop} x2={Q_x + cw} y2={aTop} color="black" note={0} />
      <ElementLine x1={Q_x} y1={aTop + 3 * ch} x2={Q_x + cw} y2={aTop + 3 * ch} color="black" note={1} />
      <ElementLine x1={aLeft} y1={K_y} x2={aLeft + 3 * cw} y2={K_y} color="black" note={2} />
      <ElementLine x1={aLeft} y1={K_y + ch} x2={aLeft + 3 * cw} y2={K_y + ch} color="black" note={3} />
      {/* Dotted alignment guides — vertical drop from Kᵀ to A columns
          and horizontal extension from Q rows into A rows */}
      <path
        className="diagram-line diagram-line--dotted"
        d={`M${cellX(0)} ${K_y + ch} V${aTop} M${cellX(1)} ${K_y + ch} V${aTop} M${cellX(2)} ${K_y + ch} V${aTop} M${cellX(3)} ${K_y + ch} V${aTop} M${Q_x + cw} ${aTop + ch} H${aLeft} M${Q_x + cw} ${aTop + 2 * ch} H${aLeft}`}
      />
      {/* Operator marks — × between Q and Kᵀ; · between A and V; → into C */}
      <ByrneLabel x={(Q_x + cw + aLeft) / 2} y={aTop + 1.5 * ch + 6}>×</ByrneLabel>
      <ByrneLabel x={(aLeft + 3 * cw + V_x) / 2} y={aTop + 1.5 * ch + 6}>·</ByrneLabel>
      <ByrneLabel x={(V_x + cw + C_x) / 2} y={aTop + 1.5 * ch + 6}>=</ByrneLabel>
      {/* Labels — single letter per matrix in its own colour group */}
      <ByrneLabel x={Q_x + cw / 2} y={aTop + 3 * ch + 26}>Q</ByrneLabel>
      <ByrneLabel x={aLeft + 1.5 * cw} y={K_y - 8}>Kᵀ</ByrneLabel>
      <ByrneLabel x={aLeft + 1.5 * cw} y={aTop + 3 * ch + 26}>A</ByrneLabel>
      <ByrneLabel x={V_x + cw / 2} y={aTop + 3 * ch + 26}>V</ByrneLabel>
      <ByrneLabel x={C_x + c_w / 2} y={aTop + 3 * ch + 26}>C</ByrneLabel>
    </>
  );
}

function ElementsStoryDiagram() {
  // Extreme and Mean Ratio — Euclid VI.30. AB centred on the slot, cut
  // at C so AB : AC = AC : CB (golden section).
  // A=(180,340), B=(780,340). AB = 600. BD = AB/2 = 300 perpendicular
  // at B → D=(780,40). AD = √(600² + 300²) ≈ 670.82.
  // DE = DB = 300 along AD from D toward A. Unit vector D→A:
  //   ((180-780)/670.82, (340-40)/670.82) = (-0.8944, 0.4472).
  // E = D + 300 × unit = (780 - 268.33, 40 + 134.16) = (511.67, 174.16).
  // AE = AD - DE = 370.82. C = A + AE × (1,0) = (550.82, 340).
  // Check: AC = 370.82, CB = 780 - 550.82 = 229.18. φ = 1.618. ✓
  return (
    <>
      <ByrneTitle>EXTREME AND MEAN RATIO ON AB</ByrneTitle>
      <ElementPoly points="180,340 780,340 780,40" fill="yellow" note={0} />
      <ElementPoly points="180,340 550.82,340 511.67,174.16" fill="red" note={1} />
      <path
        className={`diagram-line diagram-line--soft ${diagramNote(2)}`}
        d="M780 40 A300 300 0 0 1 480 340"
      />
      <path
        className={`diagram-line diagram-line--soft ${diagramNote(3)}`}
        d="M550.82 340 A370.82 370.82 0 0 0 511.67 174.16"
      />
      <ElementLine x1="780" y1="340" x2="780" y2="40" dotted note={4} />
      <ElementLine x1="180" y1="340" x2="780" y2="40" dotted note={5} />
      <ElementLine x1="180" y1="340" x2="550.82" y2="340" color="blue" note={0} strong />
      <ElementLine x1="550.82" y1="340" x2="780" y2="340" color="red" note={1} strong />
      <ElementLine x1="180" y1="340" x2="511.67" y2="174.16" color="blue" note={2} />
      <path className="diagram-line diagram-line--thin" d="M780 322 H762 V340" />
      <ElementPoint x="180" y="340" label="A" note={3} dy={24} />
      <ElementPoint x="550.82" y="340" label="C" note={4} dy={24} />
      <ElementPoint x="780" y="340" label="B" note={5} dy={24} />
      <ElementPoint x="780" y="40" label="D" note={0} dy={-14} />
      <ElementPoint x="511.67" y="174.16" label="E" note={1} dy={-14} />
    </>
  );
}

function GeometryDiagram({ variant = "euclid" }) {
  return (
    <>
      <rect className="diagram-plane diagram-plane--yellow" x="58" y="54" width="236" height="236" />
      <rect className="diagram-plane diagram-plane--blue" x="700" y="92" width="198" height="256" />
      <path className="diagram-fill diagram-fill--yellow" d="M250 320 L370 112.15 L370 320 Z" />
      <path className="diagram-fill diagram-fill--blue" d="M370 112.15 L490 320 H370 Z" />
      <path className="diagram-line diagram-line--axis" d="M78 348 H930 M112 378 V52" />
      <path className={`diagram-line diagram-line--soft ${diagramNote(0)}`} d="M250 320 L370 112.15 L490 320 Z M250 320 H490 M370 112.15 V320" />
      <circle className={`diagram-circle diagram-harmony-target ${diagramNote(1)}`} cx="250" cy="320" r="240" />
      <circle className={`diagram-circle diagram-harmony-target ${diagramNote(2)}`} cx="490" cy="320" r="240" />
      <path className={`diagram-line diagram-line--thin ${diagramNote(4)}`} d="M250 320 C310 220 430 220 490 320" />
      <DiagramLabel x="238" y="350">A</DiagramLabel><DiagramLabel x="362" y="94">C</DiagramLabel><DiagramLabel x="484" y="350">B</DiagramLabel>
      <TopLabel index={3}>{variant === "calculus" ? "dy/dx = lim Δy/Δx" : "construct / measure / prove"}</TopLabel>
      <BottomFormula x="704">{variant === "pythagoras" ? "a² + b² = c²" : "AB = AC = BC"}</BottomFormula>
      <DiagramTitle>EUCLID I.1 CONSTRUCTION</DiagramTitle>
    </>
  );
}

function OpticsDiagram() {
  return (
    <>
      <rect className="diagram-fill diagram-fill--red" x="54" y="188" width="36" height="44" />
      <path className="diagram-fill diagram-fill--yellow" d="M392 144 L392 276 L522 210 Z" />
      <rect className="diagram-fill diagram-fill--blue" x="842" y="70" width="26" height="280" />
      <path className="diagram-line diagram-line--axis" d="M70 210 H930 M392 70 V350" />
      <path className={`diagram-line diagram-line--soft ${diagramNote(5)}`} d="M76 210 L392 144 L392 276 Z" />
      <path className={`diagram-prism diagram-harmony-plane ${diagramNote(4)}`} d="M392 144 L392 276 L522 210 Z" />
      <path className={`diagram-line diagram-ray diagram-ray--0 ${diagramNote(0)}`} d="M522 210 L850 82" />
      <path className={`diagram-line diagram-ray diagram-ray--1 ${diagramNote(1)}`} d="M522 210 L888 150" />
      <path className={`diagram-line diagram-ray diagram-ray--2 ${diagramNote(2)}`} d="M522 210 L902 212" />
      <path className={`diagram-line diagram-ray diagram-ray--3 ${diagramNote(3)}`} d="M522 210 L888 274" />
      <path className={`diagram-line diagram-ray diagram-ray--4 ${diagramNote(4)}`} d="M522 210 L850 342" />
      <path className={`diagram-line diagram-line--thin ${diagramNote(5)}`} d="M320 126 C350 168 350 252 320 294 M610 78 V342 M660 78 V342 M710 78 V342 M760 78 V342" />
      <TopLabel index={0}>incident ray</TopLabel><TopLabel index={1}>θ₁</TopLabel><TopLabel index={2}>θ₂</TopLabel>
      <BottomFormula x="512">n₁ sin θ₁ = n₂ sin θ₂</BottomFormula><BottomLabel index={3}>sensor / spectrum / λ</BottomLabel>
      <DiagramTitle>SNELL REFRACTION</DiagramTitle>
    </>
  );
}

function ComputationDiagram() {
  return (
    <>
      <rect className="diagram-fill diagram-fill--yellow" x="92" y="150" width="128" height="70" />
      <rect className="diagram-fill diagram-fill--blue" x="268" y="150" width="128" height="70" />
      <rect className="diagram-fill diagram-fill--red" x="444" y="150" width="128" height="70" />
      <rect className="diagram-fill diagram-fill--blue" x="620" y="150" width="128" height="70" />
      <rect className="diagram-fill diagram-fill--yellow" x="796" y="150" width="128" height="70" />
      <path className={`diagram-line ${diagramNote(0)}`} d="M92 150 h128 v70 h-128 Z M268 150 h128 v70 h-128 Z M444 150 h128 v70 h-128 Z M620 150 h128 v70 h-128 Z M796 150 h128 v70 h-128 Z" />
      <path className={`diagram-line diagram-line--soft ${diagramNote(1)}`} d="M220 185 H268 M396 185 H444 M572 185 H620 M748 185 H796" />
      <path className={`diagram-line diagram-line--thin ${diagramNote(2)}`} d="M508 82 V150 M472 102 h72 l-36 -52 Z" />
      <TopLabel index={0}>source</TopLabel><TopLabel index={1}>transmitter</TopLabel><TopLabel index={2}>channel</TopLabel>
      <TopLabel index={3}>receiver</TopLabel><TopLabel index={4}>destination</TopLabel>
      <BottomLabel index={2}>noise source</BottomLabel>
      <BottomFormula x="356">H(X) = -Σ p(x) log₂ p(x)</BottomFormula>
      <DiagramTitle>SHANNON COMMUNICATION MODEL</DiagramTitle>
    </>
  );
}

function GraphicsDiagram() {
  return (
    <>
      <path className="diagram-fill diagram-fill--yellow" d="M242 302 C338 246 430 246 526 302 L526 342 L242 342 Z" />
      <circle className="diagram-fill diagram-fill--blue" cx="198" cy="126" r="34" />
      <circle className="diagram-fill diagram-fill--red" cx="812" cy="184" r="28" />
      <circle className={`diagram-dot ${diagramNote(0)}`} cx="382" cy="302" r="7" />
      <path className={`diagram-line diagram-line--axis ${diagramNote(1)}`} d="M382 302 V208" />
      <path className={`diagram-line diagram-line--soft ${diagramNote(2)}`} d="M382 302 L198 126 M382 302 L812 184 M382 302 L666 104 M382 302 L684 316" />
      <path className={`diagram-line ${diagramNote(3)}`} d="M242 302 C338 246 430 246 526 302 M242 342 H526" />
      <TopLabel index={0}>camera ray / ωₒ</TopLabel><TopLabel index={2}>normal</TopLabel><TopLabel index={4}>light / Lᵢ</TopLabel>
      <BottomLabel index={0}>surface point x</BottomLabel>
      <BottomFormula x="430">Lₒ(x,ωₒ)=Lₑ+∫Ω fᵣLᵢ(ωᵢ·n)dωᵢ</BottomFormula>
      <DiagramTitle>RENDERING EQUATION</DiagramTitle>
    </>
  );
}

function NeuralDiagram() {
  return (
    <>
      <path className={`diagram-line diagram-line--thin ${diagramNote(0)}`} d="M174 128 L384 94 M174 128 L384 194 M174 128 L384 294 M174 228 L384 94 M174 228 L384 194 M174 228 L384 294 M174 328 L384 94 M174 328 L384 194 M174 328 L384 294 M384 94 L594 146 M384 194 L594 146 M384 294 L594 146 M384 94 L594 266 M384 194 L594 266 M384 294 L594 266 M594 146 L810 210 M594 266 L810 210" />
      {[128, 228, 328].map((y, row) => <circle className={`diagram-node diagram-node--${row} ${diagramNote(row)}`} key={`i-${row}`} cx="174" cy={y} r="18" />)}
      {[94, 194, 294].map((y, row) => <circle className={`diagram-node diagram-node--${row + 3} ${diagramNote(row + 3)}`} key={`h1-${row}`} cx="384" cy={y} r="18" />)}
      {[146, 266].map((y, row) => <circle className={`diagram-node diagram-node--${row + 1} ${diagramNote(row + 1)}`} key={`h2-${row}`} cx="594" cy={y} r="18" />)}
      <circle className={`diagram-node diagram-node--5 ${diagramNote(5)}`} cx="810" cy="210" r="18" />
      <path className={`diagram-line diagram-line--soft ${diagramNote(5)}`} d="M810 210 C710 370 338 370 174 328" />
      <TopLabel index={0}>input layer</TopLabel><TopLabel index={1}>hidden</TopLabel><TopLabel index={2}>hidden</TopLabel><TopLabel index={4}>output</TopLabel>
      <BottomFormula x="520">backprop: ∂loss / ∂w</BottomFormula>
      <DiagramTitle>MULTILAYER NETWORK</DiagramTitle>
    </>
  );
}

function SystemsDiagram() {
  return (
    <>
      <circle className="diagram-fill diagram-fill--yellow" cx="192" cy="180" r="54" />
      <circle className="diagram-fill diagram-fill--blue" cx="500" cy="120" r="54" />
      <circle className="diagram-fill diagram-fill--red" cx="808" cy="180" r="54" />
      <circle className="diagram-fill diagram-fill--blue" cx="650" cy="316" r="46" />
      <circle className="diagram-fill diagram-fill--yellow" cx="350" cy="316" r="46" />
      <path className={`diagram-line diagram-line--soft diagram-harmony-target ${diagramNote(0)}`} d="M246 180 C310 106 398 88 446 112 M554 112 C624 86 738 112 762 180 M782 226 C758 282 708 316 696 316 M604 316 H396 M304 316 C246 286 204 242 192 234" />
      <path className={`diagram-line ${diagramNote(1)}`} d="M192 180 L500 120 L808 180 L650 316 L350 316 Z" />
      <TopLabel index={0}>story</TopLabel><TopLabel index={2}>geometry</TopLabel><TopLabel index={4}>light</TopLabel>
      <BottomLabel index={1}>crew</BottomLabel><BottomLabel index={3}>code</BottomLabel>
      <BottomFormula x="330">shot = solve(story, geometry, light, code, crew)</BottomFormula>
      <DiagramTitle>STORY SYSTEMS LOOP</DiagramTitle>
    </>
  );
}

function BlackoutDiagram({ type, pulse }) {
  const pulseClass = pulse
    ? [
        pulse.detail ? `is-detail-tick-${pulse.detail.id % 2 ? 'a' : 'b'} is-detail-accent--${pulse.detail.accent} is-melody-lane--${pulse.detail.lane}` : '',
        pulse.structure ? `is-structure-tick-${pulse.structure.id % 2 ? 'a' : 'b'} is-structure-accent--${pulse.structure.accent} is-melody-lane--${pulse.structure.lane}` : '',
        pulse.harmony ? `is-harmony-diagram-hit-${pulse.harmony.id % 2 ? 'a' : 'b'} is-harmony-lane--${pulse.harmony.lane}` : '',
        pulse.highFill ? `is-high-melody-fill-${pulse.highFill.id % 2 ? 'a' : 'b'} is-high-melody-lane--${pulse.highFill.lane}` : '',
      ].filter(Boolean).join(' ')
    : '';
  const pulseDuration = Math.max(pulse?.detail?.duration || 0, pulse?.structure?.duration || 0);
  const harmonyDuration = pulse?.harmony?.duration || 0;
  const fillDuration = pulse?.highFill?.duration || 0;
  const archetypes = {
    euclid: <ElementsEuclidDiagram />,
    pythagoras: <ElementsPythagorasDiagram />,
    calculus: <ElementsCalculusDiagram />,
    light: <ElementsPrismDiagram />,
    perspective: <ElementsPerspectiveDiagram />,
    computation: <ElementsComputationDiagram />,
    network: <ElementsNetworkDiagram />,
    graphics: <ElementsRenderingDiagram />,
    lightfield: <ElementsLightFieldDiagram />,
    interface: <ElementsInterfaceDiagram />,
    stage: <ElementsStageDiagram />,
    volume: <ElementsVolumeDiagram />,
    prototype: <ElementsPrototypeDiagram />,
    neural: <ElementsNeuralDiagram />,
    ai: <ElementsAttentionDiagram />,
    story: <ElementsStoryDiagram />,
  };
  if (archetypes[type]) {
    return (
      <svg
        className={`blackout-panel__diagram blackout-panel__diagram--${type} ${pulseClass}`}
        viewBox="0 20 1000 385"
        aria-hidden="true"
        style={{
          ...(pulseDuration ? { '--melody-pulse-ms': `${pulseDuration}ms` } : {}),
          ...(fillDuration ? { '--high-melody-fill-ms': `${fillDuration}ms` } : {}),
          ...(harmonyDuration ? { '--harmony-diagram-ms': `${harmonyDuration}ms` } : {}),
        }}
      >
        {archetypes[type]}
      </svg>
    );
  }

  const diagrams = {
    euclid: (
      <>
        <path className={`diagram-line diagram-line--soft ${diagramNote(0)}`} d="M145 238 L305 54 L465 238 Z M145 238 L465 238 M305 54 L305 238" />
        <path className={`diagram-line diagram-line--thin ${diagramNote(1)}`} d="M145 238 C176 82 434 82 465 238 M145 238 C196 382 414 382 465 238" />
        <circle className={`diagram-circle ${diagramNote(2)}`} cx="145" cy="238" r="160" />
        <circle className={`diagram-circle ${diagramNote(3)}`} cx="465" cy="238" r="160" />
        <DiagramLabel x="133" y="266">A</DiagramLabel><DiagramLabel x="300" y="84">C</DiagramLabel><DiagramLabel x="455" y="266">B</DiagramLabel>
        <TopLabel index={3}>Euclid I.1 construction</TopLabel>
        <BottomLabel index={3}>AB = AC = BC</BottomLabel>
        <BottomLabel index={4}>r(A) = r(B)</BottomLabel>
      </>
    ),
    pythagoras: (
      <>
        <rect className="diagram-fill diagram-fill--yellow" x="160" y="160" width="90" height="90" />
        <rect className="diagram-fill diagram-fill--blue" x="250" y="250" width="140" height="140" />
        <path className="diagram-fill diagram-fill--red" d="M250 160 L390 250 L480 110 L340 20 Z" />
        <path className="diagram-line diagram-line--axis" d="M76 400 H548 M108 400 V54" />
        <path className={`diagram-line diagram-line--soft ${diagramNote(0)}`} d="M250 250 L250 160 L390 250 Z" />
        <path className={`diagram-line ${diagramNote(1)}`} d="M160 160 h90 v90 h-90 Z M250 250 h140 v140 h-140 Z M250 160 L390 250 L480 110 L340 20 Z" />
        <path className={`diagram-line diagram-line--thin ${diagramNote(2)}`} d="M278 222 v28 h-28 M250 160 L390 250 M250 250 H390 M250 250 V160" />
        <TopLabel index={3}>right triangle plus three squares</TopLabel>
        <BottomFormula x="626">a² + b² = c²</BottomFormula>
        <BottomLabel index={3}>area relation proves the diagonal</BottomLabel>
        <DiagramTitle>PYTHAGOREAN THEOREM</DiagramTitle>
      </>
    ),
    calculus: (
      <>
        <path className="diagram-fill diagram-fill--yellow" d="M150 342 L150 304 C245 284 324 230 400 174 C492 106 602 108 692 174 C776 236 838 278 900 288 L900 342 Z" />
        <path className={`diagram-line diagram-line--axis ${diagramNote(0)}`} d="M120 342 H920 M150 368 V76" />
        <path className={`diagram-line diagram-line--soft diagram-harmony-target ${diagramNote(1)}`} d="M150 304 C245 284 324 230 400 174 C492 106 602 108 692 174 C776 236 838 278 900 288" />
        <path className={`diagram-line ${diagramNote(2)}`} d="M398 176 L690 112 M392 176 L392 342 M690 112 L690 342" />
        <path className={`diagram-line diagram-line--thin ${diagramNote(3)}`} d="M250 342 V278 M350 342 V214 M450 342 V146 M550 342 V126 M650 342 V146 M750 342 V214 M850 342 V270" />
        <TopLabel index={0}>y axis</TopLabel><TopLabel index={4}>x axis</TopLabel>
        <TopLabel index={2}>tangent slope</TopLabel><BottomLabel index={2}>area under f(x)</BottomLabel>
        <FormulaText x="566" y="84">f'(x)=lim Δy/Δx</FormulaText>
        <BottomFormula x="586">∫ f(x) dx</BottomFormula>
        <DiagramTitle>DERIVATIVE AND INTEGRAL</DiagramTitle>
      </>
    ),
    light: (
      <>
        <path className={`diagram-line diagram-line--soft ${diagramNote(5)}`} d="M80 210 L402 160 L402 260 Z" />
        <path className={`diagram-line diagram-ray diagram-ray--0 ${diagramNote(0)}`} d="M402 160 L682 72" />
        <path className={`diagram-line diagram-ray diagram-ray--1 ${diagramNote(1)}`} d="M402 184 L704 146" />
        <path className={`diagram-line diagram-ray diagram-ray--2 ${diagramNote(2)}`} d="M402 210 L716 216" />
        <path className={`diagram-line diagram-ray diagram-ray--3 ${diagramNote(3)}`} d="M402 236 L704 286" />
        <path className={`diagram-line diagram-ray diagram-ray--4 ${diagramNote(4)}`} d="M402 260 L682 352" />
        <path className={`diagram-line diagram-line--thin ${diagramNote(5)}`} d="M80 210 L402 210 M402 84 L402 336" />
        <path className={`diagram-prism diagram-fill--yellow ${diagramNote(4)}`} d="M402 160 L402 260 L492 210 Z" />
        <TopLabel index={0}>white light</TopLabel>
        <TopLabel index={3}>λ red</TopLabel><BottomLabel index={4}>spectrum</BottomLabel><BottomLabel index={3}>λ violet</BottomLabel>
        <FormulaText x="360" y="84">n₁ sin θ₁ = n₂ sin θ₂</FormulaText>
        <DiagramTitle>PRISM DISPERSION</DiagramTitle>
      </>
    ),
    perspective: (
      <>
        <rect className="diagram-fill diagram-fill--yellow" x="112" y="104" width="260" height="228" />
        <rect className="diagram-fill diagram-fill--blue" x="628" y="104" width="260" height="228" />
        <path className={`diagram-line diagram-line--soft ${diagramNote(0)}`} d="M500 204 L86 78 M500 204 L918 78 M500 204 L82 352 M500 204 L920 352" />
        <path className={`diagram-line ${diagramNote(1)}`} d="M146 116 L372 166 L372 286 L146 336 Z M628 166 L852 116 L852 336 L628 286 Z" />
        <path className={`diagram-line diagram-line--thin ${diagramNote(2)}`} d="M70 204 L930 204 M500 58 L500 366" />
        <circle className={`diagram-dot ${diagramNote(3)}`} cx="500" cy="204" r="5" />
        <TopLabel index={0}>horizon</TopLabel><TopLabel index={2}>vanishing point</TopLabel>
        <TopLabel index={3}>picture plane</TopLabel>
        <BottomFormula x="346">x′ = f x / z</BottomFormula>
        <DiagramTitle>ONE-POINT PERSPECTIVE</DiagramTitle>
      </>
    ),
    computation: (
      <>
        <rect className="diagram-fill diagram-fill--yellow" x="116" y="242" width="520" height="74" />
        <rect className="diagram-fill diagram-fill--blue" x="314" y="116" width="144" height="82" />
        <path className={`diagram-line ${diagramNote(0)}`} d="M116 242 h520 v74 h-520 Z M190 242 v74 M264 242 v74 M338 242 v74 M412 242 v74 M486 242 v74 M560 242 v74" />
        <path className={`diagram-line diagram-line--soft ${diagramNote(1)}`} d="M386 198 V242 M356 214 h60 l-30 28 Z" />
        <path className={`diagram-line ${diagramNote(2)}`} d="M314 116 h144 v82 h-144 Z" />
        <BottomLabel index={0}>0 1 1 □ 0 1</BottomLabel>
        <TopLabel index={1}>state q₀</TopLabel><TopLabel index={3}>read/write head</TopLabel>
        <DiagramTitle>TURING MACHINE</DiagramTitle>
      </>
    ),
    network: (
      <>
        <circle className="diagram-fill diagram-fill--yellow" cx="235" cy="210" r="80" />
        <circle className="diagram-fill diagram-fill--blue" cx="765" cy="210" r="80" />
        <rect className="diagram-fill diagram-fill--red" x="428" y="168" width="144" height="84" />
        <path className={`diagram-line diagram-line--soft ${diagramNote(0)}`} d="M315 190 C390 118 610 118 685 190 M685 230 C610 302 390 302 315 230" />
        <path className={`diagram-line ${diagramNote(1)}`} d="M428 168 h144 v84 h-144 Z M315 210 H428 M572 210 H685" />
        <TopLabel index={0}>human</TopLabel><TopLabel index={2}>display</TopLabel><TopLabel index={4}>computer</TopLabel>
        <BottomLabel index={1}>request / gesture</BottomLabel><BottomLabel index={3}>feedback / suggestion</BottomLabel>
        <DiagramTitle>HUMAN-MACHINE SYMBIOSIS</DiagramTitle>
      </>
    ),
    graphics: (
      <>
        <path className="diagram-fill diagram-fill--yellow" d="M120 320 L280 110 L520 150 L660 330 Z" />
        <path className="diagram-fill diagram-fill--blue" d="M660 330 L900 210 L520 150 Z" />
        <path className={`diagram-line diagram-line--soft ${diagramNote(0)}`} d="M120 320 L280 110 L520 150 L660 330 Z M280 110 L660 330 M520 150 L120 320" />
        <path className={`diagram-line ${diagramNote(1)}`} d="M660 330 L900 210 M120 320 L900 210 M280 110 L900 210 M520 150 L900 210" />
        <circle className={`diagram-circle ${diagramNote(2)}`} cx="900" cy="210" r="42" />
        <TopLabel index={0}>mesh</TopLabel><TopLabel index={4}>camera</TopLabel>
        <FormulaText x="570" y="84">Lₒ = Lₑ + ∫ fᵣ Lᵢ cosθ dω</FormulaText>
        <BottomLabel index={3}>BRDF / visibility / sample</BottomLabel>
        <DiagramTitle>RENDERING EQUATION</DiagramTitle>
      </>
    ),
    lightfield: (
      <>
        <path className="diagram-fill diagram-fill--blue" d="M170 92 L810 122 L810 172 L170 142 Z" />
        <path className="diagram-fill diagram-fill--red" d="M170 278 L810 248 L810 298 L170 328 Z" />
        <path className={`diagram-line ${diagramNote(0)}`} d="M170 92 L810 122 L810 172 L170 142 Z M170 278 L810 248 L810 298 L170 328 Z" />
        <path className={`diagram-line diagram-line--soft diagram-harmony-target ${diagramNote(1)}`} d="M236 118 L236 305 M356 124 L356 294 M476 130 L476 283 M596 136 L596 272 M716 142 L716 260" />
        <path className={`diagram-line ${diagramNote(2)}`} d="M236 118 L716 260 M236 305 L716 142 M356 124 L596 272 M356 294 L596 136" />
        <TopLabel index={0}>camera plane (u,v)</TopLabel><BottomLabel index={0}>image plane (s,t)</BottomLabel>
        <BottomFormula x="392">L(u,v,s,t)</BottomFormula>
        <DiagramTitle>LIGHT FIELD PARAMETERIZATION</DiagramTitle>
      </>
    ),
    interface: (
      <>
        <rect className="diagram-fill diagram-fill--blue" x="180" y="92" width="520" height="260" />
        <circle className="diagram-fill diagram-fill--yellow" cx="426" cy="226" r="78" />
        <path className="diagram-fill diagram-fill--red" d="M602 300 L832 368 L812 390 L586 318 Z" />
        <path className={`diagram-line ${diagramNote(0)}`} d="M180 92 h520 v260 h-520 Z" />
        <path className={`diagram-line diagram-line--soft ${diagramNote(1)}`} d="M330 226 H522 M426 130 V322 M352 172 L500 280 M352 280 L500 172" />
        <circle className={`diagram-circle ${diagramNote(2)}`} cx="426" cy="226" r="78" />
        <path className={`diagram-line diagram-line--thin ${diagramNote(3)}`} d="M602 300 L832 368 L812 390 L586 318 Z M602 300 L552 254" />
        <TopLabel index={0}>CRT display</TopLabel><TopLabel index={2}>constraints</TopLabel>
        <BottomLabel index={3}>light pen</BottomLabel><BottomLabel index={2}>cursor</BottomLabel>
        <DiagramTitle>SKETCHPAD INTERACTION LOOP</DiagramTitle>
      </>
    ),
    stage: (
      <>
        <rect className="diagram-fill diagram-fill--red" x="120" y="300" width="760" height="42" />
        <rect className="diagram-fill diagram-fill--blue" x="652" y="120" width="160" height="110" />
        <path className="diagram-fill diagram-fill--yellow" d="M336 120 L520 300 L470 300 L286 120 Z" />
        <path className={`diagram-line ${diagramNote(0)}`} d="M120 300 H880 M336 120 L520 300 M286 120 L470 300 M652 120 h160 v110 h-160 Z" />
        <path className={`diagram-line diagram-line--soft diagram-harmony-target ${diagramNote(1)}`} d="M220 320 L402 210 L730 176 M730 176 L500 300" />
        <path className={`diagram-line diagram-line--thin ${diagramNote(2)}`} d="M402 210 L402 300 M220 320 H300" />
        <BottomLabel index={0}>audience</BottomLabel><TopLabel index={1}>angled glass</TopLabel><TopLabel index={3}>hidden stage</TopLabel>
        <BottomLabel index={2}>virtual image</BottomLabel>
        <DiagramTitle>PEPPER'S GHOST SETUP</DiagramTitle>
      </>
    ),
    volume: (
      <>
        <path className="diagram-fill diagram-fill--blue" d="M476 126 H804 L892 208 V334 H476 Z" />
        <path className="diagram-fill diagram-fill--yellow" d="M220 306 H804 L892 334 H330 Z" />
        <path className="diagram-fill diagram-fill--red" d="M476 126 L804 126 L804 306 L476 306 Z" />
        <path className={`diagram-line ${diagramNote(0)}`} d="M476 126 H804 L892 208 V334 H476 Z M804 126 V306 L892 334 M476 306 H804" />
        <path className={`diagram-line diagram-line--soft ${diagramNote(1)}`} d="M132 256 L476 126 M132 256 L804 126 M132 256 L804 306 M132 256 L476 306" />
        <path className={`diagram-line diagram-line--thin ${diagramNote(2)}`} d="M476 126 L476 306 M804 126 L804 306 M220 306 L476 126 M330 334 L804 306" />
        <circle className={`diagram-dot ${diagramNote(3)}`} cx="132" cy="256" r="8" />
        <path className={`diagram-line ${diagramNote(4)}`} d="M102 236 h44 v40 h-44 Z M146 246 l34 -16 v52 l-34 -16 Z" />
        <TopLabel index={0}>tracked camera</TopLabel><TopLabel index={1}>camera frustum</TopLabel>
        <TopLabel index={3}>active LED wall</TopLabel><TopLabel index={4}>side wall</TopLabel>
        <BottomLabel index={1}>stage floor / practical spill</BottomLabel>
        <BottomFormula x="512">genlock · lens metadata · color calibration</BottomFormula>
        <DiagramTitle>VIRTUAL PRODUCTION FRUSTUM</DiagramTitle>
      </>
    ),
    prototype: (
      <>
        <rect className="diagram-fill diagram-fill--yellow" x="126" y="112" width="238" height="104" />
        <rect className="diagram-fill diagram-fill--blue" x="390" y="156" width="238" height="104" />
        <rect className="diagram-fill diagram-fill--red" x="654" y="200" width="238" height="104" />
        <path className={`diagram-line diagram-line--soft ${diagramNote(0)}`} d="M126 112 h238 v104 h-238 Z M390 156 h238 v104 h-238 Z M654 200 h238 v104 h-238 Z" />
        <path className={`diagram-line diagram-line--thin ${diagramNote(1)}`} d="M364 164 L390 164 M628 216 L654 216 M246 216 L246 326 L774 326 L774 304" />
        <path className={`diagram-line ${diagramNote(2)}`} d="M166 148 h150 M430 194 h150 M694 238 h150" />
        <TopLabel index={0}>prototype</TopLabel><TopLabel index={2}>test</TopLabel><TopLabel index={4}>handoff</TopLabel>
        <BottomLabel index={1}>unknown → experiment → evidence → system</BottomLabel>
        <DiagramTitle>PROTOTYPE EVIDENCE LOOP</DiagramTitle>
      </>
    ),
    neural: (
      <>
        <path className={`diagram-line diagram-line--thin ${diagramNote(0)}`} d="M174 128 L384 94 M174 128 L384 194 M174 128 L384 294 M174 228 L384 94 M174 228 L384 194 M174 228 L384 294 M174 328 L384 94 M174 328 L384 194 M174 328 L384 294 M384 94 L594 146 M384 194 L594 146 M384 294 L594 146 M384 94 L594 266 M384 194 L594 266 M384 294 L594 266 M594 146 L810 210 M594 266 L810 210" />
        {[128, 228, 328].map((y, row) => <circle className={`diagram-node diagram-node--${row} ${diagramNote(row)}`} key={`ni-${row}`} cx="174" cy={y} r="16" />)}
        {[94, 194, 294].map((y, row) => <circle className={`diagram-node diagram-node--${row + 3} ${diagramNote(row + 3)}`} key={`nh1-${row}`} cx="384" cy={y} r="16" />)}
        {[146, 266].map((y, row) => <circle className={`diagram-node diagram-node--${row + 1} ${diagramNote(row + 1)}`} key={`nh2-${row}`} cx="594" cy={y} r="16" />)}
        <circle className={`diagram-node diagram-node--5 ${diagramNote(5)}`} cx="810" cy="210" r="16" />
        <TopLabel index={0}>input layer</TopLabel><TopLabel index={1}>hidden</TopLabel><TopLabel index={2}>hidden</TopLabel><TopLabel index={4}>output</TopLabel>
        <BottomFormula x="356">∂loss / ∂w</BottomFormula>
        <DiagramTitle>BACKPROPAGATION NETWORK</DiagramTitle>
      </>
    ),
    ai: (
      <>
        <rect className="diagram-fill diagram-fill--blue" x="130" y="88" width="680" height="44" />
        <rect className="diagram-fill diagram-fill--yellow" x="130" y="208" width="680" height="44" />
        <rect className="diagram-fill diagram-fill--red" x="130" y="268" width="680" height="44" />
        <path className={`diagram-line diagram-line--thin ${diagramNote(0)}`} d="M130 110 h740 M130 170 h740 M130 230 h740 M130 290 h740" />
        <path className={`diagram-line diagram-line--soft ${diagramNote(1)}`} d="M190 110 L378 230 L566 170 L754 290 M190 290 L378 170 L566 230 L754 110" />
        <path className={`diagram-line ${diagramNote(2)}`} d="M170 88 h80 v44 h-80 Z M338 208 h80 v44 h-80 Z M526 148 h80 v44 h-80 Z M714 268 h80 v44 h-80 Z" />
        <TopLabel index={0}>Q</TopLabel><TopLabel index={1}>K</TopLabel><TopLabel index={2}>V</TopLabel><TopLabel index={4}>context</TopLabel>
        <BottomFormula x="338">softmax(QKᵀ / √d)V</BottomFormula>
        <DiagramTitle>QUERY KEY VALUE ATTENTION</DiagramTitle>
      </>
    ),
    story: (
      <>
        <circle className="diagram-fill diagram-fill--yellow" cx="120" cy="300" r="22" />
        <circle className="diagram-fill diagram-fill--blue" cx="500" cy="186" r="22" />
        <circle className="diagram-fill diagram-fill--red" cx="880" cy="118" r="22" />
        <path className={`diagram-line diagram-line--soft diagram-harmony-target ${diagramNote(0)}`} d="M120 300 C230 90 408 360 500 186 C592 18 770 330 880 118" />
        <path className={`diagram-line ${diagramNote(1)}`} d="M120 300 L500 186 L880 118 M206 210 C290 250 350 250 428 210 M570 196 C650 150 724 150 800 196" />
        <path className={`diagram-line diagram-line--thin ${diagramNote(2)}`} d="M160 340 h680 M500 66 v300" />
        <TopLabel index={0}>geometry</TopLabel><TopLabel index={2}>story</TopLabel><TopLabel index={4}>AI</TopLabel>
        <BottomLabel index={2}>tools → shots → tales</BottomLabel>
        <DiagramTitle>STORY SYSTEMS LOOP</DiagramTitle>
      </>
    ),
  };

  return (
    <svg
      className={`blackout-panel__diagram blackout-panel__diagram--${type} ${pulseClass}`}
      viewBox="0 0 1000 420"
      aria-hidden="true"
      style={{
        ...(pulseDuration ? { '--melody-pulse-ms': `${pulseDuration}ms` } : {}),
        ...(fillDuration ? { '--high-melody-fill-ms': `${fillDuration}ms` } : {}),
        ...(harmonyDuration ? { '--harmony-diagram-ms': `${harmonyDuration}ms` } : {}),
      }}
    >
      {diagrams[type] || diagrams.euclid}
    </svg>
  );
}

function BlackoutPoetryPanel() {
  const [active, setActive] = useState(0);
  const [phraseSegments, setPhraseSegments] = useState([]);
  const [isMobileLayout, setIsMobileLayout] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia('(max-width: 700px)').matches
  ));
  const [titleCount, setTitleCount] = useState(0);
  const [timingNonce, setTimingNonce] = useState(0);
  const [diagramPulse, setDiagramPulse] = useState({ detail: null, structure: null });
  const [drumPulse, setDrumPulse] = useState(null);
  const [harmonyPulse, setHarmonyPulse] = useState(null);
  const [musicVisualsActive, setMusicVisualsActive] = useState(getResumeAudioEngine().enabled);
  const [revealedWordCount, setRevealedWordCount] = useState(getResumeAudioEngine().enabled ? 0 : 99);
  const [revealedLineCount, setRevealedLineCount] = useState(getResumeAudioEngine().enabled ? 0 : 99);
  const panelRef = useRef(null);
  const phraseMapRef = useRef(null);
  const activeWordRefs = useRef([]);
  const activeRef = useRef(active);
  const wordRevealTimerRef = useRef(null);
  const lineRevealTimerRef = useRef(null);
  const revealSequenceStartedRef = useRef(false);
  const revealStepRef = useRef(0);
  const revealWordCountRef = useRef(0);
  const activePage = BLACKOUT_PAGES[active];
  const activeStatement = activePage.phrase;
  const visualTiming = getResumeAudioEngine().visualTiming;
  const typeMs = visualTiming.typeMs;
  const cursorMs = visualTiming.cursorMs;
  const wordMs = visualTiming.wordMs;
  const lineMs = visualTiming.lineMs;
  const drawMs = visualTiming.drawMs;
  const pageMs = visualTiming.pageMs;
  const revealStepMs = Math.max(115, Math.min(wordMs, lineMs) * 0.58);
  const phraseRevealMs = Math.max(0, activeStatement.words.length * 2 - 1) * revealStepMs;
  const pageDurationMs = Math.max(pageMs, phraseRevealMs + Math.max(900, lineMs * 2.4));
  const title = "poetry in proof";
  const markMode = activePage.mark || "highlight";
  const phraseBridgeLines = EMPTY_BLACKOUT_BRIDGES;
  const pageLines = useMemo(() => [
    ...activePage.lines,
    ...phraseBridgeLines,
    ...getBlackoutMicroLines(active),
  ], [activePage, active, phraseBridgeLines]);
  const laidOutRows = useMemo(() => layoutBlackoutText(pageLines), [pageLines]);
  const phraseWordKeys = useMemo(() => (
    selectPhraseWordKeys(laidOutRows, activeStatement.words)
  ), [laidOutRows, activeStatement]);

  const measuredMaxHeightRef = useRef(0);

  // Mobile now uses a fixed CSS frame. Clear any previous inline height
  // lock from older builds so plate changes cannot move the sections below.
  useLayoutEffect(() => {
    if (!panelRef.current) return;
    if (!isMobileLayout) {
      panelRef.current.style.height = '';
      return;
    }
    measuredMaxHeightRef.current = 0;
    panelRef.current.style.height = '';
  }, [isMobileLayout]);

  // Reset the measured max only on real orientation changes — mobile
  // browsers fire 'resize' constantly as the address bar hides/shows on
  // scroll, which would nuke the lock and re-measure (potentially
  // smaller) on the next plate change, causing the section to shrink.
  useEffect(() => {
    const reset = () => {
      measuredMaxHeightRef.current = 0;
      if (panelRef.current) panelRef.current.style.height = '';
    };
    window.addEventListener('orientationchange', reset);
    return () => {
      window.removeEventListener('orientationchange', reset);
    };
  }, []);

  const cycle = () => setActive((idx) => (idx + 1) % BLACKOUT_PAGES.length);
  const clearRevealTimers = () => {
    if (wordRevealTimerRef.current) {
      window.clearInterval(wordRevealTimerRef.current);
      wordRevealTimerRef.current = null;
    }
    if (lineRevealTimerRef.current) {
      window.clearInterval(lineRevealTimerRef.current);
      lineRevealTimerRef.current = null;
    }
  };
  const beginPhraseRevealSequence = (wordCount = activeStatement.words.length) => {
    if (revealSequenceStartedRef.current) return;
    revealSequenceStartedRef.current = true;
    revealStepRef.current = 0;
    revealWordCountRef.current = wordCount;
    if (!musicVisualsActive) {
      setRevealedWordCount(wordCount);
      setRevealedLineCount(Math.max(0, wordCount - 1));
      return;
    }
    advancePhraseRevealStep();
  };
  const advancePhraseRevealStep = () => {
    if (!revealSequenceStartedRef.current) return;
    const wordCount = revealWordCountRef.current || activeStatement.words.length;
    const step = revealStepRef.current % Math.max(1, wordCount);
    if (revealStepRef.current > 0 && step === 0) {
      setRevealedWordCount(0);
      setRevealedLineCount(0);
    }
    const nextWordCount = Math.min(wordCount, step + 1);
    setRevealedWordCount(nextWordCount);
    setRevealedLineCount(Math.min(Math.max(0, wordCount - 1), Math.max(0, nextWordCount - 1)));
    revealStepRef.current += 1;
  };

  useEffect(() => {
    activeRef.current = active;
    revealSequenceStartedRef.current = false;
    clearRevealTimers();
  }, [active]);

  useEffect(() => {
    const page = BLACKOUT_PAGES[active];
    getResumeAudioEngine().hooks.pageTransition(active, page.phrase.words.length);
  }, [active]);

  useEffect(() => {
    const onSongChange = () => {
      const current = activeRef.current;
      const page = BLACKOUT_PAGES[current];
      getResumeAudioEngine().hooks.pageTransition(current, page.phrase.words.length);
      clearRevealTimers();
      setMusicVisualsActive(getResumeAudioEngine().enabled);
      setRevealedWordCount(getResumeAudioEngine().enabled ? 0 : 99);
      setRevealedLineCount(getResumeAudioEngine().enabled ? 0 : 99);
      setTimingNonce((value) => value + 1);
    };
    window.addEventListener('resume-song-change', onSongChange);
    return () => window.removeEventListener('resume-song-change', onSongChange);
  }, []);

  useEffect(() => {
    const onAudioChange = () => {
      const isEnabled = getResumeAudioEngine().enabled;
      setMusicVisualsActive(isEnabled);
      clearRevealTimers();
      revealSequenceStartedRef.current = false;
      if (isEnabled) {
        setRevealedWordCount(0);
        setRevealedLineCount(0);
        window.setTimeout(() => beginPhraseRevealSequence(activeStatement.words.length), Math.max(80, visualTiming.stepMs * 0.75));
      } else {
        setRevealedWordCount(99);
        setRevealedLineCount(99);
      }
    };
    window.addEventListener('resume-audio-change', onAudioChange);
    return () => window.removeEventListener('resume-audio-change', onAudioChange);
  }, [activeStatement.words.length, visualTiming.stepMs]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let cancelled = false;
    let timeoutId = null;
    const tick = () => {
      timeoutId = window.setTimeout(() => {
        if (cancelled) return;
        cycle();
        tick();
      }, pageDurationMs);
    };
    tick();
    return () => {
      cancelled = true;
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [timingNonce, pageDurationMs]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    if (!musicVisualsActive) return undefined;
    revealSequenceStartedRef.current = false;
    clearRevealTimers();
    setRevealedWordCount(0);
    setRevealedLineCount(0);
    const wordCount = activeStatement.words.length;
    const id = window.setTimeout(() => beginPhraseRevealSequence(wordCount), Math.max(80, visualTiming.stepMs * 0.75));
    return () => window.clearTimeout(id);
  }, [active, musicVisualsActive, timingNonce, visualTiming.stepMs, activeStatement.words.length]);

  useEffect(() => {
    activeWordRefs.current = [];
  }, [active, phraseWordKeys]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const onMelodyNote = (event) => {
      const svg = panelRef.current?.querySelector('.blackout-panel__diagram');
      const highFillLanes = new Set(['angel', 'dust']);
      const answerLanes = new Set(['angel', 'build', 'chop', 'dust', 'ghost', 'switch']);
      const family = answerLanes.has(event.detail.lane) ? 'detail' : 'structure';
      const voice = family === 'detail' ? 'answer' : 'call';
      let accent = event.detail.accent;
      if (svg && !svg.querySelector(`.diagram-note--${accent}.diagram-voice--${voice}`)) {
        const voiceTargets = Array.from(svg.querySelectorAll(`.diagram-note-target.diagram-voice--${voice}`));
        const fallbackTargets = Array.from(svg.querySelectorAll('.diagram-note-target'));
        const availableAccents = (voiceTargets.length ? voiceTargets : fallbackTargets)
          .map((node) => Array.from(node.classList).find((className) => className.startsWith('diagram-note--')))
          .map((className) => Number(className?.replace('diagram-note--', '')))
          .filter((value, index, list) => Number.isFinite(value) && list.indexOf(value) === index);
        if (availableAccents.length) {
          accent = availableAccents[event.detail.id % availableAccents.length];
        }
      }
      setDiagramPulse((current) => ({
        ...current,
        [family]: {
          id: event.detail.id,
          lane: event.detail.lane,
          accent,
          voice,
          duration: Math.max(360, event.detail.duration * 1.65),
        },
        ...(highFillLanes.has(event.detail.lane) ? {
          highFill: {
            id: event.detail.id,
            lane: event.detail.lane,
            duration: Math.max(420, event.detail.duration * 2.15),
          },
        } : {}),
      }));
    };
    window.addEventListener('resume-melody-note', onMelodyNote);
    return () => window.removeEventListener('resume-melody-note', onMelodyNote);
  }, [phraseSegments.length, revealedLineCount, lineMs]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const onHarmonyHit = (event) => {
      setHarmonyPulse({
        id: event.detail.id,
        lane: event.detail.lane,
        duration: event.detail.duration,
      });
      setDiagramPulse((current) => ({
        ...current,
        harmony: {
          id: event.detail.id,
          lane: event.detail.lane,
          duration: Math.max(760, event.detail.duration * 3.2),
        },
      }));
      beginPhraseRevealSequence();
    };
    window.addEventListener('resume-harmony-hit', onHarmonyHit);
    return () => window.removeEventListener('resume-harmony-hit', onHarmonyHit);
  }, [activeStatement.words.length, revealedWordCount, wordMs, lineMs, phraseSegments.length]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const onDrumHit = (event) => {
      setDrumPulse({
        id: event.detail.id,
        lane: event.detail.lane,
        strength: event.detail.strength,
        duration: event.detail.duration,
      });
    };
    window.addEventListener('resume-drum-hit', onDrumHit);
    return () => window.removeEventListener('resume-drum-hit', onDrumHit);
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const onMidiEvent = (event) => {
      const detail = event.detail || {};
      if (detail.type !== 'noteon' || detail.group !== 'drums' || detail.lane !== 'hat') return;
      advancePhraseRevealStep();
    };
    window.addEventListener('resume-midi-event', onMidiEvent);
    return () => window.removeEventListener('resume-midi-event', onMidiEvent);
  }, [activeStatement.words.length]);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 700px)');
    const update = () => setIsMobileLayout(query.matches);
    update();
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, []);

  useEffect(() => {
    setTitleCount(0);
    if (musicVisualsActive && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      let lastStepAt = 0;
      const onMidiEvent = (event) => {
        const detail = event.detail || {};
        if (detail.type !== 'noteon' || detail.group !== 'drums' || detail.lane !== 'hat') return;
        const now = performance.now();
        if (now - lastStepAt < 34) return;
        lastStepAt = now;
        setTitleCount((count) => Math.min(title.length, count + 1));
      };
      window.addEventListener('resume-midi-event', onMidiEvent);
      return () => window.removeEventListener('resume-midi-event', onMidiEvent);
    }
    const id = window.setInterval(() => {
      setTitleCount((count) => {
        if (count >= title.length) {
          window.clearInterval(id);
          return count;
        }
        const next = count + 1;
        return next;
      });
    }, typeMs);
    return () => window.clearInterval(id);
  }, [active, title, typeMs, timingNonce, musicVisualsActive, visualTiming.stepMs]);

  useEffect(() => () => clearRevealTimers(), []);

  useEffect(() => {
    let raf = null;
    let retryTimer = null;
    let cancelled = false;

    const measureSegments = () => {
      const mapBox = phraseMapRef.current?.getBoundingClientRect();
      const nodes = activeWordRefs.current.filter(Boolean);
      if (!mapBox || nodes.length < 2) {
        setPhraseSegments([]);
        return false;
      }
      const points = nodes.map((node) => {
        const rect = node.getBoundingClientRect();
        return {
          x: ((rect.left + rect.width / 2 - mapBox.left) / mapBox.width) * 100,
          y: ((rect.top + rect.height / 2 - mapBox.top) / mapBox.height) * 100,
          w: (rect.width / mapBox.width) * 100,
          h: (rect.height / mapBox.height) * 100,
        };
      });
      setPhraseSegments(points.slice(0, -1).map((point, index) => {
        const next = points[index + 1];
        const dx = next.x - point.x;
        const dy = next.y - point.y;
        const rowDistance = Math.abs(next.y - point.y);
        const columnDistance = Math.abs(next.x - point.x);
        if (rowDistance < 7 && columnDistance < 18) return null;
        const length = Math.max(0.01, Math.hypot(dx, dy));
        const ux = dx / length;
        const uy = dy / length;
        const startInset = Math.max(point.w / 2, point.h / 2) + 0.12;
        const endInset = Math.max(next.w / 2, next.h / 2) - 0.62;
        return {
          x1: point.x + ux * startInset,
          y1: point.y + uy * startInset,
          x2: next.x - ux * endInset,
          y2: next.y - uy * endInset,
        };
      }).filter(Boolean));
      return true;
    };

    const scheduleMeasure = () => {
      if (raf) window.cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(() => {
        raf = null;
        measureSegments();
      });
    };

    const retryMeasure = (attempt = 0) => {
      if (cancelled) return;
      const measured = measureSegments();
      if (measured || attempt >= 10) return;
      retryTimer = window.setTimeout(() => retryMeasure(attempt + 1), attempt < 4 ? 80 : 180);
    };

    const readyFonts = document.fonts?.ready;
    scheduleMeasure();
    retryMeasure();
    readyFonts?.then(() => {
      if (!cancelled) scheduleMeasure();
    });

    const observer = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(scheduleMeasure)
      : null;
    if (observer && panelRef.current) observer.observe(panelRef.current);
    window.addEventListener('resize', scheduleMeasure);
    window.addEventListener('orientationchange', scheduleMeasure);

    return () => {
      cancelled = true;
      if (raf) window.cancelAnimationFrame(raf);
      if (retryTimer) window.clearTimeout(retryTimer);
      observer?.disconnect();
      window.removeEventListener('resize', scheduleMeasure);
      window.removeEventListener('orientationchange', scheduleMeasure);
    };
  }, [active, laidOutRows, revealedWordCount, phraseWordKeys]);

  return (
    <>
    <h1
      className="identity__poetry-title"
      aria-label={title}
      style={{ '--cursor-ms': `${cursorMs}ms` }}
    >
      <span
        key={`title-${active}`}
        className="identity__poetry-type"
        aria-hidden="true"
      >
        {title.slice(0, titleCount)}
        <span className="identity__poetry-cursor" />
      </span>
    </h1>
    <div
      ref={panelRef}
      className="blackout-panel"
      role="button"
      tabIndex="0"
      aria-label={`Identity phrase: ${activeStatement.label}`}
      onMouseEnter={cycle}
      onClick={cycle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          cycle();
        }
      }}
      style={{
        '--diagram-draw-ms': `${drawMs}ms`,
        '--phrase-line-ms': `${lineMs}ms`,
      }}
    >
      <div key={active} className={`blackout-panel__page blackout-panel__page--${activePage.layout}`}>
        <figure className="blackout-panel__figure" aria-hidden="true">
          <BlackoutDiagram type={activePage.diagram} pulse={diagramPulse} />
        </figure>
        <PhraseConstellation
          mapRef={phraseMapRef}
          segments={phraseSegments}
          stepMs={visualTiming.stepMs}
          lineMs={lineMs}
          visibleCount={isMobileLayout ? phraseSegments.length : (musicVisualsActive ? revealedLineCount : phraseSegments.length)}
          pulse={harmonyPulse}
        />
          <div className="blackout-panel__manual-flow" aria-hidden="true">
          {(() => {
            return laidOutRows.map((row, rowIndex) => (
              <p
                key={rowIndex}
                className={`blackout-panel__manual-row blackout-panel__manual-row--${(row.kind || "book").replace(' ', '-')} blackout-panel__manual-row--c${row.column || 0}`}
                style={row.row ? { gridRow: row.row } : undefined}
              >
                {row.tokens.map((token, tokenIndex) => {
                  const clean = cleanBlackoutWord(token.word);
                  const key = `${token.lineIndex}:${token.wordIndex}:${clean}`;
                  const phraseIndex = phraseWordKeys.has(key) ? phraseWordKeys.get(key) : -1;
                  const isActive = phraseIndex >= 0;
                  const isRevealed = !musicVisualsActive || phraseIndex < revealedWordCount;
                  const isMicro = token.lineIndex >= activePage.lines.length + phraseBridgeLines.length;
                  return (
                    <React.Fragment key={key}>
                      <span
                        ref={isActive ? (node) => { activeWordRefs.current[phraseIndex] = node; } : undefined}
                        className={`blackout-panel__word blackout-panel__word--${token.kind.replace(' ', '-')} ${isMicro ? 'blackout-panel__word--micro' : ''} ${isActive && isRevealed ? `is-active is-active--${markMode}` : ''}`}
                        style={isActive && isRevealed ? { '--word-delay': `${musicVisualsActive ? 0 : phraseIndex * (wordMs / 1000)}s` } : undefined}
                      >
                        {formatBlackoutDisplayToken(token, tokenIndex, row)}
                      </span>{" "}
                    </React.Fragment>
                  );
                })}
              </p>
            ));
          })()}
        </div>
      </div>
    </div>
    </>
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

function HelpPlayer({ src }) {
  const hostRef = useRef(null);
  const [status, setStatus] = useState('loading'); // loading | ready | missing | error
  const [projection, setProjection] = useState(null);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(true);
  const [showHint, setShowHint] = useState(true);
  const [activeChordKey, setActiveChordKey] = useState('');
  const rendererRef = useRef(null);
  const audibleRef = useRef(false);
  const pausedRef = useRef(true);
  const userPausedRef = useRef(false);
  const wasPlayingBeforeHiddenRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const probeVideo = document.createElement('video');
    const getVideoUrl = (candidate) => {
      if (typeof candidate === 'string') return candidate;
      return candidate.videoUrl || candidate.src || candidate.url;
    };
    const canPlaySource = (candidate) => {
      const clean = String(getVideoUrl(candidate)).split('?')[0].toLowerCase();
      if (clean.endsWith('.mp4')) return probeVideo.canPlayType('video/mp4') !== '';
      if (clean.endsWith('.webm')) {
        // Accept any non-empty canPlayType for WebM (covers Chrome,
        // Firefox, Safari Mac which returns 'maybe'). The MP4 sits at
        // the end of the desktop source chain as a last resort.
        return probeVideo.canPlayType('video/webm; codecs="vp9, opus"') !== ''
          || probeVideo.canPlayType('video/webm') !== '';
      }
      return true;
    };
    async function go() {
      try {
        const sources = Array.isArray(src) ? src : [src];
        let playableSrc = null;
        // HEAD probe first so a missing file fails fast and the
        // placeholder shows immediately instead of stalling.
        for (const candidate of sources) {
          if (!canPlaySource(candidate)) continue;
          const head = await fetch(getVideoUrl(candidate), { method: 'HEAD' }).catch(() => null);
          if (head?.ok) {
            playableSrc = candidate;
            break;
          }
        }
        if (!playableSrc) { if (!cancelled) setStatus('missing'); return; }
        const mod = await window.__spotlightBundlePromise;
        if (cancelled) return;
        const result = await mod.mountSpotlight(hostRef.current, playableSrc);
        if (cancelled) { result.renderer.dispose(); return; }
        rendererRef.current = result.renderer;
        result.renderer.setStateCallback((state) => {
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
    };
  }, [src]);

  useEffect(() => {
    const onKey = (e) => {
      const key = e.key.toLowerCase();
      if (key === 'w' || key === 'a' || key === 's' || key === 'd') setShowHint(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const refreshFromEngine = () => {
      const engine = getResumeAudioEngine();
      setActiveChordKey(engine.enabled ? engine.currentChordKey || '' : '');
    };
    const onChordKey = (event) => setActiveChordKey(event.detail?.key || '');
    window.addEventListener('resume-chord-key', onChordKey);
    window.addEventListener('resume-audio-change', refreshFromEngine);
    refreshFromEngine();
    return () => {
      window.removeEventListener('resume-chord-key', onChordKey);
      window.removeEventListener('resume-audio-change', refreshFromEngine);
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
          if (!pausedRef.current) renderer.pause();
          return;
        }
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
  }, [status]);

  useEffect(() => {
    if (status !== 'ready') return undefined;
    const onVisibilityChange = () => {
      if (document.visibilityState !== 'hidden') return;
      const renderer = rendererRef.current;
      if (!renderer) return;
      wasPlayingBeforeHiddenRef.current = false;
      userPausedRef.current = true;
      if (!pausedRef.current) renderer.pauseAndMute();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [status]);

  const hideHint = () => setShowHint(false);
  const resetHint = () => setShowHint(true);

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
      userPausedRef.current = true;
      wasPlayingBeforeHiddenRef.current = false;
      rendererRef.current.pauseAndMute();
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
  const toggleFullscreen = () => {
    hideHint();
    const slot = hostRef.current?.closest('.help-player');
    if (!slot) return;
    if (slot.classList.contains('is-pseudo-fullscreen')) {
      exitPseudoFullscreen(slot);
      rendererRef.current?.resize?.();
      return;
    }
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
      return;
    }
    if (isMobileFullscreenTarget()) {
      if (rendererRef.current?.enterNativeVideoFullscreen?.()) return;
      enterPseudoFullscreen(slot, () => rendererRef.current?.resize?.());
      return;
    }
    if (slot.requestFullscreen) {
      slot.requestFullscreen().catch(() => {
        enterPseudoFullscreen(slot, () => rendererRef.current?.resize?.());
      });
      return;
    }
    enterPseudoFullscreen(slot, () => rendererRef.current?.resize?.());
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
        <div className="help-player__overlay">
          <div className="help-player__placeholder-grid" />
          <div className="help-player__label">
            <span className="mono">[ decoding mesh projection · sv3d/proj/mshp ]</span>
          </div>
        </div>
      )}
      {status === 'missing' && (
        <div className="help-player__overlay help-player__overlay--missing">
          <div className="help-player__placeholder-grid" />
          <div className="help-player__missing">
            <div className="mono small dim">Asset not found</div>
            <div className="serif large">place <span className="mono">help_full.webm</span></div>
            <div className="serif large">at <span className="mono">resume/media/</span></div>
            <div className="mono small dim" style={{marginTop:'1em'}}>
              the page will boot the MESH decoder + drag-to-look 360° viewer
            </div>
          </div>
        </div>
      )}
      {status === 'error' && (
        <div className="help-player__overlay">
          <div className="help-player__placeholder-grid" />
          <div className="help-player__missing">
            <div className="mono small">Decoder error — check console</div>
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
  const videoRef = useRef(null);
  const slotIdRef = useRef(`video-slot-${Math.random().toString(36).slice(2)}`);
  const userHeldPlaybackRef = useRef(false);
  const [status, setStatus] = useState('loading'); // loading | ready | missing
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
    let cancelled = false;
    async function probe() {
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
  }, [src]);

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
      userHeldPlaybackRef.current = false;
      if (window.__resumeHeldVideoSlot === slotIdRef.current) window.__resumeHeldVideoSlot = null;
      video.muted = true;
      video.pause();
    }
  };

  const replayWithSound = () => activateSlot({ withSound: true, restart: true, userInitiated: true });

  const toggleFullscreen = () => {
    const slot = videoRef.current?.closest('.video-slot');
    if (!slot) return;
    if (slot.classList.contains('is-pseudo-fullscreen')) {
      exitPseudoFullscreen(slot);
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
          preload="metadata"
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
//  Section primitives
// ────────────────────────────────────────────────────────────────────

function getSectionShape(id) {
  if (['summary', 'experience'].includes(id)) return 'triangle';
  if (['help', 'blackbird', 'system', 'project'].includes(id)) return 'circle';
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
//  Header / identity
// ────────────────────────────────────────────────────────────────────

function Identity({ data }) {
  return (
    <header className="identity">
      <div className="identity__top mono dim">
        <span>{data.name}</span>
        <span className="identity__top-dot" aria-hidden="true"></span>
        <span>Creative Technologist</span>
        <span className="identity__top-dot identity__top-dot--circle" aria-hidden="true"></span>
        <span>{data.location}</span>
        <span className="identity__top-dot identity__top-dot--square" aria-hidden="true"></span>
        <a href="https://www.linkedin.com/in/tawfeeq-martin-82991a14/" target="_blank" rel="noreferrer">LinkedIn</a>
        <MusicStation />
      </div>
      <BlackoutPoetryPanel />
    </header>
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

function HelpFeature({ src }) {
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
        </div>
        <div className="help-hero__player">
          <HelpPlayer src={src} />
        </div>
        <div className="help-hero__details">
          <p>
            I led the on-set technology and co-invented <strong>Mill Stitch™</strong>, a
            real-time 360° pipeline that let the director see the surround action live during
            principal photography in the LA river basin.
          </p>
          <p>
            What you're watching here is decoded directly from that original format —
            <span className="mono"> sv3d → proj → mshp</span>, the geometry inflated and rendered
            on a sphere at the world origin. Drag to look around.
          </p>
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
  const [filter, setFilter] = useState('all');
  const projects = useMemo(() => {
    const set = new Set(items.map(a => a.project.split('—')[0].trim()));
    return ['all', ...Array.from(set)];
  }, [items]);
  const filtered = filter === 'all' ? items : items.filter(a => a.project.startsWith(filter));
  return (
    <Section id="awards" label="06 · AWARDS & RECOGNITION">
      <div className="awards__filters mono">
        {['all','gold','silver','honor'].map(t => (
          <button
            key={t}
            className={`awards__filter ${filter===t?'is-on':''}`}
            onClick={() => setFilter(t)}
          >{t}</button>
        ))}
      </div>
      <ul className="awards">
        {items
          .filter(a => filter==='all' || a.tier===filter)
          .map((a,i) => (
            <li key={i} className={`award award--${a.tier}`}>
              <div className="award__tier mono">
                <span className={`award__tier-dot award__tier-dot--${a.tier}`} />
                {a.tier}
              </div>
              <div className="award__org mono">{a.org}</div>
              <div className="award__title">{a.title}</div>
              <div className="award__project serif italic">{a.project}</div>
              <div className="award__role mono dim">{a.role}</div>
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
//  References — flippable cards
// ────────────────────────────────────────────────────────────────────

function References({ items }) {
  const [active, setActive] = useState(0);
  const refShapes = ['triangle', 'circle', 'square'];
  return (
    <Section id="refs" label="09 · REFERENCES">
      <div className="refs">
        <div className="refs__quote">
          <div className="refs__qmark serif">“</div>
          <blockquote className="refs__text serif">
            {items[active].quote}
          </blockquote>
          <div className="refs__attribution">
            <div className="refs__name serif">
              <span className={`refs__mark refs__mark--${refShapes[active % 3]}`} aria-hidden="true" />
              {items[active].name}
            </div>
            <div className="refs__title mono">{items[active].title}</div>
            {items[active].sub && <div className="refs__sub mono dim">{items[active].sub}</div>}
          </div>
        </div>
        <ol className="refs__list">
          {items.map((r, i) => (
            <li key={i}>
              <button
                className={`refs__chip ${i===active?'is-on':''}`}
                onClick={() => setActive(i)}
              >
                <span className="refs__chip-num mono">{String(i+1).padStart(2,'0')}</span>
                <span className="refs__chip-name">{r.name}</span>
                <span className="refs__chip-title mono dim">{r.title}</span>
              </button>
              <div className={`refs__inline-quote ${i === active ? 'is-active' : ''}`}>
                <blockquote className="refs__inline-text serif">{r.quote}</blockquote>
                {r.sub && <div className="refs__inline-sub mono dim">{r.sub}</div>}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}

// ────────────────────────────────────────────────────────────────────
//  Footer
// ────────────────────────────────────────────────────────────────────

function Footer({ data }) {
  return (
    <footer className="page-footer mono dim">
      {/* Identity strip + music station — a full mirror of the topline.
          Bookend bottom for the page. */}
      <div className="identity__top page-footer__identity">
        <span>{data.name}</span>
        <span className="identity__top-dot" aria-hidden="true"></span>
        <span>Creative Technologist</span>
        <span className="identity__top-dot identity__top-dot--circle" aria-hidden="true"></span>
        <span>{data.location}</span>
        <span className="identity__top-dot identity__top-dot--square" aria-hidden="true"></span>
        <a href="https://www.linkedin.com/in/tawfeeq-martin-82991a14/" target="_blank" rel="noreferrer">LinkedIn</a>
        <MusicStation />
      </div>
    </footer>
  );
}

Object.assign(window, {
  HelpPlayer, HelpFeature, Identity, Summary,
  Experience, ProjectCard, LiveSystemFeature, Awards, Skills, Education, References, Footer,
  VideoSlot, BlackbirdFeature, ScrollAudioLayers
});
