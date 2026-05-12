/* eslint-disable */
const { useState, useEffect, useRef, useMemo } = React;

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
  let melodyTriggerId = 0;
  let drumTriggerId = 0;
  let harmonyTriggerId = 0;
  let videoDucked = false;
  let videoResumeTimer = null;
  const stemMutes = { drums: false, harmony: false, melody: false };
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
      kick: '[c1 ~ ~ ~] [~ ~ c1 ~] [~ c1 ~ ~] [~ ~ ~ c1]',
      clap: '~ g3 ~ g3',
      hats: 'white ~ white [white white] ~ white ~ white white ~ white ~ [white white] ~ white ~',
      perc: '~ ~ brown ~ [~ pink] ~ ~ white ~ ~ brown ~ ~ ~ pink ~',
      kick808: 'bd ~ ~ ~ ~ ~ bd ~ ~ bd ~ ~ ~ ~ ~ bd',
      snare808: '~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~',
      hats808: 'hh ~ hh [hh hh] ~ hh ~ hh hh ~ hh ~ [hh hh] ~ hh ~',
      perc808: '~ ~ ~ cp ~ ~ ~ ~ ~ cp ~ ~ ~ ~ ~ ~',
      bass: 'ab1 ~ ~ ~ f1 ~ ~ ~ g1 ~ ~ ~ c2 ~ ~ ~ ab1 ~ ~ ~ f1 ~ ~ ~ g1 ~ ~ ~ c2 ~ ~ ~',
      chord: '<Ab^7 Fm9 Gm7 Cm9 Ab^7 Fm9 Gm7 Cm9>',
      chop: '~',
      lift: 'c5 ~ ~ ~ bb4 ~ ~ ~ ab4 ~ g4 ~ ~ eb5 ~ ~ c5 ~ ~ ~ d5 ~ ~ ~ eb5 ~ d5 ~ ~ c5 ~ ~',
      halo: 'c5 ~ eb5 ~ g5 ~ bb5 ~ ab5 ~ g5 ~ eb5 ~ d5 ~',
      angel: '~ ~ ~ ~ ~ ~ ~ ~ g6 ~ ~ ~ f6 ~ eb6 ~ ~ ~ ~ ~ ~ ~ ~ ~ bb6 ~ ab6 ~ g6 ~ ~ ~',
      build: '~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ eb5 ~ ~ g5 ~ bb5 ~ ~ c6 ~ bb5 ~ g5 ~ ~ ~',
      switch: '~ ~ ~ ~ ~ ~ ~ ~ c6 ~ bb5 ~ ab5 ~ g5 ~ ~ ~ eb5 ~ f5 ~ g5 ~ ~ c6 ~ bb5 ~ g5 ~ ~ ~',
      ghost: '~ ~ ~ ~ c6 ~ ~ ~ ~ bb5 ~ ~ ~ ab5 ~ g5 ~ ~ ~ ~ ~ ~ eb5 ~ ~ ~ f5 ~ g5 ~ ~ ~',
      dust: '~ c7 ~ ~ ~ ~ bb6 ~ ~ ~ ~ ~ ab6 ~ ~ ~ ~ g6 ~ ~ ~ ~ eb6 ~ ~ ~ ~ ~ f6 ~ ~ ~',
      bassGain: 0.12,
      chordGain: 0.14,
      chordLpf: 1250,
      chopGain: 0.012,
      liftGain: 0.085,
      wasdGain: 0.12,
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
  const melodyTrigger = (lane) => `.onTrigger((time,hap)=>globalThis.__resumeMelodyNote&&globalThis.__resumeMelodyNote("${lane}",time,hap&&hap.value), false)`;
  const drumTrigger = (lane) => `.onTrigger((time,hap)=>globalThis.__resumeDrumHit&&globalThis.__resumeDrumHit("${lane}",time,hap&&hap.value), false)`;
  const harmonyTrigger = (lane) => `.onTrigger((time,hap)=>globalThis.__resumeHarmonyHit&&globalThis.__resumeHarmonyHit("${lane}",time,hap&&hap.value), false)`;
  const makePattern = (song, wasd = '') => {
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
    const chord = escapePattern(wasd || song.chord);
    const chop = escapePattern(song.chop);
    const lift = escapePattern(song.lift);
    const halo = escapePattern(song.halo || '');
    const angel = escapePattern(song.angel || '');
    const build = escapePattern(song.build || '');
    const switchUp = escapePattern(song.switch || '');
    const ghost = escapePattern(song.ghost || '');
    const dust = escapePattern(song.dust || '');
    const bassGain = song.bassGain ?? 0.11;
    const chordGain = wasd ? (song.wasdGain ?? 0.18) : (song.chordGain ?? 0.12);
    const chordLpf = wasd ? (song.wasdLpf ?? 1650) : (song.chordLpf ?? 1450);
    const chopGain = song.chopGain ?? 0.07;
    const liftGain = song.liftGain ?? 0.045;
    const isTrap = song.name === 'trap cathedral';
    const isNeon = song.name === 'neon stutter';
    const drumMute = stemMutes.drums ? '.gain(0)' : '';
    const harmonyMute = stemMutes.harmony ? '.gain(0)' : '';
    const melodyMute = stemMutes.melody ? '.gain(0)' : '';
    if (song.midiLlm) {
      const midiChordLane = wasd
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
  ${midiBassLane}${harmonyMute},
  ${midiChordLane}${harmonyTrigger('chord')}${harmonyMute},
  note("${lift}").s("square").gain(${song.liftGain ?? 0.074}).attack(0.035).decay(0.28).sustain(0.32).release(0.5).legato(1.02).slide(0.045).hpf(520).lpf(sine.range(1200, 3000).slow(6)).lpq(2.6).distort(0.12).shape(0.006).room(0.16).sz(0.34).vib(3.8).vibmod(0.011).delay(0.035).delaytime(0.25).delayfb(0.045).pan(-0.14)${melodyTrigger('lift')}${melodyMute},
  note("${chop}").s("sine").gain(${song.chopGain ?? 0.026}).attack(0.008).decay(0.24).sustain(0.08).release(0.58).legato(0.86).hpf(1700).lpf(sine.range(3600, 7000).slow(5)).room(0.46).sz(0.62).delay(0.04).delaytime(0.375).delayfb(0.08).pan(0.26)${melodyTrigger('chop')}${melodyMute}
).cpm(${cpm})`;
    }
    const kickFx = isTrap
      ? 'gain(0.5).attack(0.001).decay(0.17).sustain(0).release(0.032).lpf(112).distort(0.1)'
      : isNeon
        ? 'gain(1.3).attack(0.001).decay(0.105).sustain(0).release(0.022).lpf(155).distort(0.1)'
        : 'gain(1.28).attack(0.001).decay(0.13).sustain(0).release(0.025).lpf(140).distort(0.08)';
    const clapSound = isTrap ? 'white' : 'pink';
    const clapFx = isTrap
      ? 'gain(0.52).attack(0.001).decay(0.085).sustain(0).release(0.045).hpf(760).lpf(4500).room(0.07)'
      : isNeon
        ? 'gain(0.72).attack(0.001).decay(0.055).sustain(0).release(0.04).hpf(1200).lpf(5600).room(0.12)'
        : 'gain(0.62).attack(0.002).decay(0.065).sustain(0).release(0.05).hpf(1200).lpf(6200).room(0.22)';
    const hatFx = isTrap
      ? 'gain(0.2).attack(0.001).decay(0.018).sustain(0).release(0.01).hpf(6900)'
      : isNeon
        ? 'gain(0.38).attack(0.001).decay(0.016).sustain(0).release(0.008).hpf(7600)'
        : 'gain(0.32).attack(0.001).decay(0.02).sustain(0).release(0.01).hpf(7200)';
    const percSound = isTrap ? 'brown' : 'pink';
    const percFx = isTrap
      ? 'gain(0.16).attack(0.002).decay(0.065).sustain(0).release(0.03).hpf(1500).lpf(5400).room(0.05)'
      : isNeon
        ? 'gain(0.34).attack(0.001).decay(0.026).sustain(0).release(0.014).hpf(3000).lpf(8200)'
        : 'gain(0.26).attack(0.001).decay(0.035).sustain(0).release(0.018).hpf(2600).lpf(7200).room(0.12)';
    const bassSound = isTrap ? 'sine' : (isNeon ? 'square' : 'sine');
    const bassFx = isTrap
      ? 'attack(0.035).decay(0.32).sustain(0.48).release(0.28).legato(1.18).slide(0.055).hpf(48).lpf(sine.range(135, 220).slow(4)).lpq(1.8).room(0.004)'
      : isNeon
        ? 'attack(0.003).decay(0.08).sustain(0).release(0.035).lpf(260).distort(0.22).krush(2)'
        : 'attack(0.004).decay(0.15).sustain(0).release(0.08).lpf(160).distort(0.18)';
    const chordFx = isTrap
      ? 'attack(0.18).decay(0.42).sustain(0.42).release(0.72).legato(1.1).unison(4).spread(0.42).detune(sine.range(-2, 2).slow(8)).hpf(120).lpf(sine.range(520, 880).slow(6)).lpq(3.2).distort(0.22).room(0.32).sz(0.58).shape(0.012).delay(0.035).delaytime(0.375).delayfb(0.08)'
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
      ? 'attack(0.028).decay(0.28).sustain(0.36).release(0.5).legato(0.96).slide(0.04).hpf(520).bpf(sine.range(900, 2300).slow(4)).bpq(2.8).lpf(3400).distort(0.12).shape(0.004).phaser(0.06).phaserrate(0.16).phaserdepth(0.14).room(0.12).sz(0.3).vib(2.6).vibmod(0.008).pan(-0.2).delay(0.035).delaytime(0.25).delayfb(0.04)'
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
    const trapDrumLanes = isTrap ? `
  s("${kick808}").bank("RolandTR808").gain(0.98).lpf(180).distort(0.18)${drumTrigger('kick')}${drumMute},
  s("${snare808}").bank("RolandTR808").gain(1.02).hpf(420).lpf(5800).room(0.04)${drumForm}${drumTrigger('snare')}${drumMute},
  s("${hats808}").bank("RolandTR808").gain(0.68).hpf(6500)${drumForm}${drumTrigger('hat')}${drumMute},
  s("${perc808}").bank("RolandTR808").gain(0.48).hpf(1200).room(0.03)${drumForm}${drumTrigger('perc')}${drumMute},
  s("~ hh ~ [hh hh] ~ hh [hh hh] ~ ~ hh ~ hh [hh hh] ~ hh ~").bank("RolandTR808").gain(0.34).hpf(7200)${switchForm}${drumTrigger('hat')}${drumMute},
  s("~ ~ ~ cp ~ ~ cp ~ ~ cp ~ ~ ~ ~ cp ~").bank("RolandTR808").gain(0.34).hpf(1400).room(0.025)${switchForm}${drumTrigger('perc')}${drumMute},` : '';
    const trapHaloLane = '';
    const chordLane = isTrap
      ? `chord("${chord}").voicing().s("sawtooth").gain(${chordGain}).${chordFx}`
      : `note("${chord}").s("supersaw").gain(${chordGain}).lpf(${chordLpf}).${chordFx}`;
    const bassLane = isTrap
      ? (wasd ? `note("~").s("sine").gain(0)` : `note("${bass}").layer(
    x => x.s("sine").pan(0).gain(1),
    x => x.s("triangle").detune(sine.range(-0.8, 0.8).slow(8)).pan(0).gain(0.16).lpf(260)
  ).gain(${bassGain}).${bassFx}`)
      + bassForm
      : `note("${bass}").s("${bassSound}").gain(${bassGain}).${bassFx}`;
    const leadLane = isTrap
      ? `note("${lift}").s("${liftSound}").gain(${liftGain}).${liftFx}`
      + leadForm
      : `note("${lift}").s("${liftSound}").gain(${liftGain}).${liftFx}${liftRate}`;
    const angelLane = isTrap
      ? `note("${angel}").layer(
    x => x.s("sine").gain(1).comb(0.12),
    x => x.add(12).s("sine").gain(0.08).pan(0.22),
    x => x.s("sawtooth").gain(0.045).hpf(3600).lpf(6800)
  ).gain(0.034).attack(0.005).decay(0.28).sustain(0.045).release(0.62).legato(0.72).hpf(1650).lpf(sine.range(3600, 6800).slow(5)).lpq(1.6).vib(5.2).vibmod(0.012).room(0.44).sz(0.6).delay(0.025).delaytime(0.25).delayfb(0.045).pan(0.24)`
      + angelForm
      : '';
    const buildLane = isTrap
      ? `note("${build}").s("sawtooth").gain(0.032).attack(0.12).decay(0.36).sustain(0.28).release(0.9).legato(1.2).hpf(720).lpf(sine.range(1100, 2400).slow(8)).lpq(4).distort(0.22).room(0.46).sz(0.62).delay(0.08).delaytime(0.5).delayfb(0.12).slow(2)`
      + buildForm
      : '';
    const switchLane = isTrap
      ? `note("${switchUp}").s("sine").gain(0.03).attack(0.035).decay(0.3).sustain(0.16).release(0.55).legato(0.82).hpf(950).lpf(sine.range(1700, 3600).slow(6)).lpq(3).vib(4.4).vibmod(0.018).room(0.36).sz(0.54).delay(0.05).delaytime(0.25).delayfb(0.08).pan(-0.08)${switchForm}`
      : '';
    const ghostLane = isTrap
      ? `note("${ghost}").s("triangle").gain(0.025).attack(0.06).decay(0.34).sustain(0.12).release(0.7).legato(1.04).hpf(900).lpf(sine.range(1800, 4200).slow(10)).lpq(2.4).room(0.38).sz(0.58).delay(0.09).delaytime(0.5).delayfb(0.13).pan(0.18)${ghostForm}`
      : '';
    const dustLane = isTrap
      ? `note("${dust}").s("sine").gain(0.012).attack(0.01).decay(0.18).sustain(0.04).release(0.52).legato(0.7).hpf(2600).lpf(sine.range(4300, 7600).slow(12)).room(0.5).sz(0.7).delay(0.08).delaytime(0.375).delayfb(0.1).pan(sine.slow(8))${dustForm}`
      : '';
    return `stack(${trapDrumLanes}${trapHaloLane}
  note("${kick}").s("sine").${kickFx}${drumTrigger('kick')}${drumMute},
  note("${clap}").s("${clapSound}").${clapFx}${drumTrigger('snare')}${drumMute},
  s("${hats}").s("white").${hatFx}${drumTrigger('hat')}${drumMute},
  s("${perc}").s("${percSound}").${percFx}${drumTrigger('perc')}${drumMute},
  ${bassLane}${harmonyMute},
  ${chordLane}${harmonyTrigger('chord')}${harmonyMute},
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

  const dispatchSyncedMusicEvent = (eventName, detail) => {
    let delayMs = 0;
    try {
      const context = strudel?.getAudioContext?.() || window.__resumeStrudelModule?.getAudioContext?.();
      if (context && Number.isFinite(detail.scheduledTime)) {
        delayMs = Math.max(0, (detail.scheduledTime - context.currentTime) * 1000);
      }
    } catch (error) {
      delayMs = 0;
    }
    window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent(eventName, { detail }));
    }, delayMs);
  };

  window.__resumeMelodyNote = (lane, scheduledTime, value = {}) => {
    if (!enabled || stemMutes.melody) return;
    const timing = visualTimingFor();
    dispatchSyncedMusicEvent('resume-melody-note', {
      id: ++melodyTriggerId,
      lane,
      scheduledTime,
      accent: deriveMelodyAccent(lane, value),
      duration: Math.max(120, timing.stepMs * 1.85),
    });
  };

  window.__resumeDrumHit = (lane, scheduledTime, value = {}) => {
    if (!enabled || stemMutes.drums) return;
    const timing = visualTimingFor();
    const strength = { kick: 1, snare: 0.82, hat: 0.46, perc: 0.58 }[lane] || 0.5;
    dispatchSyncedMusicEvent('resume-drum-hit', {
      id: ++drumTriggerId,
      lane,
      scheduledTime,
      strength,
      duration: Math.max(80, timing.stepMs * (lane === 'hat' ? 0.85 : 1.3)),
    });
  };

  window.__resumeHarmonyHit = (lane, scheduledTime, value = {}) => {
    if (!enabled || stemMutes.harmony) return;
    const timing = visualTimingFor();
    dispatchSyncedMusicEvent('resume-harmony-hit', {
      id: ++harmonyTriggerId,
      lane,
      scheduledTime,
      duration: Math.max(140, timing.stepMs * 1.6),
    });
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
        return module;
      });
    }
    return initPromise;
  };

  const playCurrent = async () => {
    if (!enabled) return;
    if (videoDucked) return;
    const module = await ensureStrudel();
    if (!enabled) return;
    if (videoDucked) return;
    const song = songPresets[songIndex];
    try {
      console.info('Strudel play', song.name, song.bpm);
      await module.evaluate(makePattern(song, activeWASD), true);
    } catch (error) {
      console.warn('Strudel pattern failed', error);
    }
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
        activeWASD = '';
        activeChordKey = '';
        console.info('Strudel chord override cleared');
        playCurrent();
        window.dispatchEvent(new CustomEvent('resume-audio-change'));
        return;
      }
      if (Object.prototype.hasOwnProperty.call(map, key)) {
        event.preventDefault();
        activeWASD = map[key];
        activeChordKey = key.toUpperCase();
        console.info('Strudel chord override', activeChordKey, activeWASD);
        playCurrent();
        window.dispatchEvent(new CustomEvent('resume-audio-change'));
      }
    }, true);
  };

  const hushCurrent = () => {
    if (strudel) {
      strudel.hush();
    } else if (initPromise) {
      initPromise.then((module) => module.hush()).catch((error) => console.warn('Strudel stop failed', error));
    }
  };

  const setVideoDucked = (active) => {
    if (videoResumeTimer) {
      window.clearTimeout(videoResumeTimer);
      videoResumeTimer = null;
    }
    if (active) {
      if (!videoDucked && enabled) hushCurrent();
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
    get videoDucked() { return videoDucked; },
    get stemMutes() { return { ...stemMutes }; },
    toggleStemMute(stem) {
      if (!Object.prototype.hasOwnProperty.call(stemMutes, stem)) return { ...stemMutes };
      stemMutes[stem] = !stemMutes[stem];
      playCurrent();
      window.dispatchEvent(new CustomEvent('resume-audio-change'));
      return { ...stemMutes };
    },
    setSong(delta) {
      songIndex = (songIndex + delta + songPresets.length) % songPresets.length;
      activeWASD = '';
      activeChordKey = '';
      playCurrent();
      return songIndex;
    },
    get enabled() { return enabled; },
    async setEnabled(next) {
      enabled = next;
      if (enabled) {
        bindKeyboard();
        const module = await ensureStrudel();
        if (module.initAudio) await module.initAudio();
        playCurrent();
      } else {
        activeWASD = '';
        videoDucked = false;
        if (videoResumeTimer) {
          window.clearTimeout(videoResumeTimer);
          videoResumeTimer = null;
        }
        hushCurrent();
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
function AudioToggle() {
  const [enabled, setEnabled] = useState(false);
  const [songVersion, setSongVersion] = useState(0);
  const engine = getResumeAudioEngine();

  useEffect(() => {
    const refresh = () => setSongVersion((version) => version + 1);
    window.addEventListener('resume-audio-change', refresh);
    return () => window.removeEventListener('resume-audio-change', refresh);
  }, []);

  const toggle = async () => {
    const requested = !engine.enabled;
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

  const cycleSong = (delta) => {
    engine.setSong(delta);
    setSongVersion((version) => version + 1);
    window.dispatchEvent(new CustomEvent('resume-song-change'));
  };

  return (
    <div className={`review-toggle review-toggle--audio ${enabled ? 'is-on' : ''}`} aria-label="Sound review">
      <button className="review-toggle__button" type="button" onClick={() => cycleSong(-1)} aria-label="Previous song">‹</button>
      <button
        className="review-toggle__main"
        type="button"
        onClick={toggle}
        aria-pressed={enabled}
      >
        <span className="review-toggle__kind mono">{enabled ? 'Sound On' : 'Sound Off'}</span>
        <span className="review-toggle__status" aria-hidden="true">{enabled ? '●' : '○'}</span>
        <span className="review-toggle__label mono">{`${engine.bpm} BPM · ${engine.session.name}${engine.chordOverride ? ` · ${engine.chordOverride}` : ''}`}</span>
      </button>
      <button className="review-toggle__button" type="button" onClick={() => cycleSong(1)} aria-label="Next song">›</button>
    </div>
  );
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
      <ReviewToggle kind="Theme" options={THEME_OPTIONS} classScope="theme" />
      <ReviewToggle kind="Fonts" options={FONT_OPTIONS} classScope="font" />
      <AudioToggle />
    </div>
  );
}

function StemMuteControls() {
  const engine = getResumeAudioEngine();
  const [state, setState] = useState({
    enabled: engine.enabled,
    mutes: engine.stemMutes,
    visual: engine.visualTiming,
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
    });
    window.addEventListener('resume-audio-change', refresh);
    window.addEventListener('resume-song-change', refresh);
    return () => {
      window.removeEventListener('resume-audio-change', refresh);
      window.removeEventListener('resume-song-change', refresh);
    };
  }, [engine]);

  const toggle = (stem) => {
    const mutes = engine.toggleStemMute(stem);
    setState({
      enabled: engine.enabled,
      mutes,
      visual: engine.visualTiming,
    });
  };

  return (
    <div
      className={`stem-mutes ${state.enabled ? 'is-audio-on' : ''}`}
      aria-label="Music stem mutes"
      style={{ '--stem-pulse-ms': `${state.visual.stemPulseMs}ms` }}
    >
      {stems.map((stem) => {
        const muted = Boolean(state.mutes[stem.id]);
        return (
          <button
            key={stem.id}
            type="button"
            className={`stem-mute stem-mute--${stem.shape} ${muted ? 'is-muted' : 'is-on'}`}
            onClick={() => toggle(stem.id)}
            aria-pressed={!muted}
            aria-label={`${muted ? 'Unmute' : 'Mute'} ${stem.label}`}
            title={`${muted ? 'Unmute' : 'Mute'} ${stem.label}`}
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
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
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
    phrase: { label: "art, craft, and technology", words: ["art", "craft", "and", "technology"] },
    lines: [
      { kind: "book", text: "perspective turns space into a picture plane with vanishing points and ruled convergence" },
      { kind: "ref", text: "alberti treats the frame as a window; the camera inherits the contract" },
      { kind: "spec", text: "eye point horizon orthogonal transversal projection plane" },
      { kind: "code", text: "screen = project(world * view * lens)" },
      { kind: "code", text: "clip = projection * view * model * vec4(position, 1)" },
      { kind: "diff add", text: "+ picture plane means the world can be staged for one exact observer" },
      { kind: "terminal", text: "$ align frustum --horizon --vanishing-point --lens" },
      { kind: "book", text: "virtual production is perspective theory with a live renderer behind the wall" },
      { kind: "ref", text: "the picture plane is a workshop surface where art craft and technology negotiate scale" },
      { kind: "ref", text: "the illusion holds when geometry optics and viewer position agree" },
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
    { kind: "ref", text: "Art direction sets the frame before the renderer starts answering questions about projection.", targetWords: ["art"] },
    { kind: "book", text: "Horizon, eye point, and picture plane establish the camera's contract with the scene." },
    { kind: "ref", text: "Camera craft keeps that contract usable under blocking, lens changes, and time pressure.", targetWords: ["craft"] },
    { kind: "book", text: "A tracked frustum can only work if lens metadata and camera pose describe the same view." },
    { kind: "ref", text: "The lens and display wall must agree before a tracked camera can hold scale.", targetWords: ["and"] },
    { kind: "book", text: "Projection errors become visible as soon as the viewer or camera moves away from the assumed point." },
    { kind: "ref", text: "Technology is convincing only when it obeys the same projection model as the photograph.", targetWords: ["technology"] },
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

function DiagramText({ x, y, children, className = "" }) {
  return <text className={`diagram-text ${className}`} x={x} y={y}>{children}</text>;
}

function PlateLabel({ x, y, children }) {
  return <text className="diagram-label" x={x} y={y}>{children}</text>;
}

function FormulaText({ x, y, children, className = "" }) {
  return <DiagramText className={`diagram-text--formula ${className}`} x={x} y={y}>{children}</DiagramText>;
}

function diagramNote(index) {
  return `diagram-note-target diagram-note--${index}`;
}

function GeometryPlate({ variant = "euclid" }) {
  return (
    <>
      <rect className="diagram-plane diagram-plane--yellow" x="58" y="54" width="236" height="236" />
      <rect className="diagram-plane diagram-plane--blue" x="700" y="92" width="198" height="256" />
      <path className="diagram-line diagram-line--axis" d="M78 348 H930 M112 378 V52" />
      <path className={`diagram-line diagram-line--soft ${diagramNote(0)}`} d="M126 318 L326 84 L526 318 Z M126 318 H526 M326 84 V318" />
      <circle className={`diagram-circle ${diagramNote(1)}`} cx="126" cy="318" r="200" />
      <circle className={`diagram-circle ${diagramNote(2)}`} cx="526" cy="318" r="200" />
      <path className={`diagram-line ${diagramNote(3)}`} d="M652 304 L652 118 L884 304 Z M652 304 H884 M652 118 L884 304" />
      <path className={`diagram-line diagram-line--thin ${diagramNote(4)}`} d="M686 270 L686 304 L652 304 M120 318 C212 180 430 180 526 318" />
      <DiagramText x="114" y="346">A</DiagramText><DiagramText x="318" y="66">C</DiagramText><DiagramText x="520" y="346">B</DiagramText>
      <FormulaText x="704" y="124">{variant === "pythagoras" ? "a² + b² = c²" : "AB = AC = BC"}</FormulaText>
      <DiagramText x="704" y="164">{variant === "calculus" ? "dy/dx = lim Δy/Δx" : "construct / measure / prove"}</DiagramText>
      <PlateLabel x="108" y="42">GEOMETRY PLATE / CARTESIAN CONSTRUCTION</PlateLabel>
    </>
  );
}

function OpticsPlate() {
  return (
    <>
      <rect className="diagram-plane diagram-plane--red" x="54" y="86" width="184" height="248" />
      <rect className="diagram-plane diagram-plane--yellow" x="664" y="54" width="246" height="310" />
      <path className="diagram-line diagram-line--axis" d="M70 210 H930 M392 70 V350" />
      <path className={`diagram-line diagram-line--soft ${diagramNote(5)}`} d="M76 210 L392 144 L392 276 Z" />
      <path className={`diagram-prism ${diagramNote(4)}`} d="M392 144 L392 276 L522 210 Z" />
      <path className={`diagram-line diagram-ray diagram-ray--0 ${diagramNote(0)}`} d="M522 210 L850 82" />
      <path className={`diagram-line diagram-ray diagram-ray--1 ${diagramNote(1)}`} d="M522 210 L888 150" />
      <path className={`diagram-line diagram-ray diagram-ray--2 ${diagramNote(2)}`} d="M522 210 L902 212" />
      <path className={`diagram-line diagram-ray diagram-ray--3 ${diagramNote(3)}`} d="M522 210 L888 274" />
      <path className={`diagram-line diagram-ray diagram-ray--4 ${diagramNote(4)}`} d="M522 210 L850 342" />
      <path className={`diagram-line diagram-line--thin ${diagramNote(5)}`} d="M320 126 C350 168 350 252 320 294 M610 78 V342 M660 78 V342 M710 78 V342 M760 78 V342" />
      <DiagramText x="82" y="190">incident ray</DiagramText><DiagramText x="330" y="112">θ₁</DiagramText><DiagramText x="532" y="178">θ₂</DiagramText>
      <FormulaText x="598" y="52">n₁ sin θ₁ = n₂ sin θ₂</FormulaText><DiagramText x="638" y="378">sensor / spectrum / λ</DiagramText>
      <PlateLabel x="90" y="52">OPTICS PLATE / LIGHT TRANSPORT</PlateLabel>
    </>
  );
}

function ComputationPlate() {
  return (
    <>
      <rect className="diagram-plane diagram-plane--blue" x="58" y="70" width="842" height="70" />
      <rect className="diagram-plane diagram-plane--yellow" x="118" y="250" width="232" height="86" />
      <path className={`diagram-line diagram-line--soft ${diagramNote(0)}`} d="M84 104 H884 M84 104 v70 M184 104 v70 M284 104 v70 M384 104 v70 M484 104 v70 M584 104 v70 M684 104 v70 M784 104 v70 M884 104 v70 M84 174 H884" />
      <path className={`diagram-line ${diagramNote(1)}`} d="M170 292 C268 188 390 188 488 292 S708 396 820 226" />
      <path className={`diagram-line diagram-line--thin ${diagramNote(2)}`} d="M218 292 L336 198 L488 292 L650 252 L820 226" />
      <circle className={`diagram-node diagram-node--3 ${diagramNote(3)}`} cx="218" cy="292" r="22" /><circle className={`diagram-node diagram-node--4 ${diagramNote(4)}`} cx="488" cy="292" r="22" /><circle className={`diagram-node diagram-node--5 ${diagramNote(5)}`} cx="820" cy="226" r="22" />
      <DiagramText x="102" y="94">tape</DiagramText><DiagramText x="188" y="154">1</DiagramText><DiagramText x="288" y="154">0</DiagramText><DiagramText x="388" y="154">□</DiagramText>
      <DiagramText x="116" y="226">machine[state][symbol] → write, move, next</DiagramText><FormulaText x="550" y="334">H(X) = -Σ p log₂ p</FormulaText>
      <PlateLabel x="84" y="48">COMPUTATION PLATE / TURING + SHANNON</PlateLabel>
    </>
  );
}

function GraphicsPlate() {
  return (
    <>
      <rect className="diagram-plane diagram-plane--yellow" x="584" y="54" width="320" height="286" />
      <rect className="diagram-plane diagram-plane--red" x="82" y="252" width="192" height="86" />
      <path className={`diagram-line diagram-line--soft ${diagramNote(0)}`} d="M98 252 L488 118 L884 320 M98 252 L488 318 L884 320 M98 252 L488 118 M488 118 L488 318" />
      <path className={`diagram-line ${diagramNote(1)}`} d="M488 118 L700 82 L884 320 L488 318 Z M594 164 L758 118 M594 230 L820 210 M594 292 L884 320" />
      <path className={`diagram-line diagram-line--thin ${diagramNote(2)}`} d="M98 252 L704 204 M98 252 L760 120 M98 252 L820 286" />
      <circle className={`diagram-dot ${diagramNote(3)}`} cx="98" cy="252" r="8" />
      <DiagramText x="70" y="236">camera</DiagramText><DiagramText x="512" y="104">frustum</DiagramText><DiagramText x="692" y="72">LED / volume</DiagramText>
      <FormulaText x="470" y="372">Lₒ = Lₑ + ∫Ω fᵣ Lᵢ cosθ dω</FormulaText><DiagramText x="130" y="348">sync: lens + tracking + genlock + color</DiagramText>
      <PlateLabel x="88" y="48">GRAPHICS / VIRTUAL PRODUCTION PLATE</PlateLabel>
    </>
  );
}

function NeuralPlate() {
  return (
    <>
      <rect className="diagram-plane diagram-plane--blue" x="52" y="58" width="250" height="300" />
      <rect className="diagram-plane diagram-plane--red" x="704" y="76" width="214" height="266" />
      <path className={`diagram-line diagram-line--thin ${diagramNote(0)}`} d="M156 112 L382 92 L614 132 L842 104 M156 204 L382 194 L614 212 L842 204 M156 296 L382 294 L614 292 L842 304 M156 112 L382 194 L614 292 M156 296 L382 194 L614 132 M382 92 L614 212 L842 304 M382 294 L614 212 L842 104" />
      {[156, 382, 614, 842].map((x, col) => [112, 204, 296].map((y, row) => (
        <circle className={`diagram-node diagram-node--${(col * 3 + row) % 6} ${diagramNote((col * 3 + row) % 6)}`} key={`${col}-${row}`} cx={x} cy={y + (col % 2 ? -20 : 0)} r={18} />
      )))}
      <path className={`diagram-line diagram-line--soft ${diagramNote(5)}`} d="M146 370 H854 M146 370 L382 344 L614 362 L854 332" />
      <DiagramText x="120" y="72">input</DiagramText><DiagramText x="328" y="52">hidden</DiagramText><DiagramText x="570" y="88">attention</DiagramText><DiagramText x="790" y="72">output</DiagramText>
      <FormulaText x="320" y="388">softmax(QKᵀ / √d)V</FormulaText><FormulaText x="518" y="32">∂loss / ∂w</FormulaText>
      <PlateLabel x="90" y="34">NEURAL / ATTENTION PLATE</PlateLabel>
    </>
  );
}

function SystemsPlate() {
  return (
    <>
      <rect className="diagram-plane diagram-plane--yellow" x="70" y="68" width="194" height="94" />
      <rect className="diagram-plane diagram-plane--blue" x="390" y="164" width="220" height="102" />
      <rect className="diagram-plane diagram-plane--red" x="720" y="258" width="188" height="94" />
      <path className={`diagram-line diagram-line--soft ${diagramNote(0)}`} d="M166 162 C270 62 392 92 498 164 S702 342 814 258" />
      <path className={`diagram-line ${diagramNote(1)}`} d="M166 162 L500 216 L814 258 M166 162 L500 216 M500 216 L814 258" />
      <path className={`diagram-line diagram-line--thin ${diagramNote(2)}`} d="M100 116 H236 M424 214 H578 M748 306 H880 M500 70 V372" />
      <DiagramText x="102" y="116">idea</DiagramText><DiagramText x="426" y="214">prototype</DiagramText><DiagramText x="748" y="306">shot</DiagramText>
      <DiagramText x="300" y="350">story.need().solveWith(math, light, code, crew, model)</DiagramText>
      <PlateLabel x="94" y="42">SYSTEMS / STORY PLATE</PlateLabel>
    </>
  );
}

function BlackoutDiagram({ type, pulse }) {
  const pulseClass = pulse
    ? [
        pulse.detail ? `is-detail-tick-${pulse.detail.id % 2 ? 'a' : 'b'} is-detail-accent--${pulse.detail.accent} is-melody-lane--${pulse.detail.lane}` : '',
        pulse.structure ? `is-structure-tick-${pulse.structure.id % 2 ? 'a' : 'b'} is-structure-accent--${pulse.structure.accent} is-melody-lane--${pulse.structure.lane}` : '',
      ].filter(Boolean).join(' ')
    : '';
  const pulseDuration = Math.max(pulse?.detail?.duration || 0, pulse?.structure?.duration || 0);
  const archetypes = {
    euclid: <GeometryPlate variant="euclid" />,
    light: <OpticsPlate />,
    computation: <ComputationPlate />,
    graphics: <GraphicsPlate />,
    neural: <NeuralPlate />,
    story: <SystemsPlate />,
  };
  if (archetypes[type]) {
    return (
      <svg
        className={`blackout-panel__diagram blackout-panel__diagram--${type} ${pulseClass}`}
        viewBox="0 0 1000 420"
        aria-hidden="true"
        style={pulseDuration ? { '--melody-pulse-ms': `${pulseDuration}ms` } : undefined}
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
        <DiagramText x="133" y="266">A</DiagramText><DiagramText x="300" y="42">C</DiagramText><DiagramText x="455" y="266">B</DiagramText>
        <DiagramText x="590" y="132">I.1 construct equilateral triangle</DiagramText>
        <DiagramText x="590" y="168">AB = AC = BC</DiagramText>
        <DiagramText x="590" y="204">r(A) = r(B)</DiagramText>
      </>
    ),
    pythagoras: (
      <>
        <path className="diagram-line diagram-line--axis" d="M76 400 H548 M108 400 V54" />
        <path className={`diagram-line diagram-line--soft ${diagramNote(0)}`} d="M250 250 L250 160 L390 250 Z" />
        <path className={`diagram-line ${diagramNote(1)}`} d="M160 160 h90 v90 h-90 Z M250 250 h140 v140 h-140 Z M250 160 L390 250 L480 110 L340 20 Z" />
        <path className={`diagram-line diagram-line--thin ${diagramNote(2)}`} d="M278 222 v28 h-28 M250 160 L390 250 M250 250 H390 M250 250 V160" />
        <FormulaText x="626" y="128">a² + b² = c²</FormulaText>
        <DiagramText x="278" y="208">a</DiagramText><DiagramText x="310" y="292">b</DiagramText><DiagramText x="320" y="202">c</DiagramText>
        <DiagramText x="626" y="170">distance stays invariant under rotation</DiagramText>
        <DiagramText x="626" y="210">square areas make the unseen diagonal measurable</DiagramText>
        <PlateLabel x="88" y="48">PYTHAGORAS PLATE / DISTANCE + AREA</PlateLabel>
      </>
    ),
    calculus: (
      <>
        <rect className="diagram-plane diagram-plane--blue" x="78" y="116" width="842" height="208" />
        <rect className="diagram-plane diagram-plane--yellow" x="594" y="62" width="276" height="94" />
        <path className={`diagram-line diagram-line--soft ${diagramNote(0)}`} d="M80 322 C180 322 192 118 294 118 C402 118 390 322 510 322 C625 322 642 140 760 120 C850 105 902 178 940 250" />
        <path className={`diagram-line diagram-line--thin ${diagramNote(1)}`} d="M76 342 L930 342 M114 368 L114 84 M256 342 L256 124 M420 342 L420 238 M604 342 L604 300 M784 342 L784 134" />
        <path className={`diagram-line ${diagramNote(2)}`} d="M250 132 L440 248 M600 300 L792 132" />
        <DiagramText x="128" y="96">y</DiagramText><DiagramText x="910" y="360">x</DiagramText>
        <FormulaText x="610" y="96">dy/dx = velocity</FormulaText>
        <FormulaText x="610" y="132">∫ v dt = distance</FormulaText>
        <PlateLabel x="88" y="48">CALCULUS PLATE / CHANGE + ACCUMULATION</PlateLabel>
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
        <path className={`diagram-prism ${diagramNote(4)}`} d="M402 160 L402 260 L492 210 Z" />
        <DiagramText x="96" y="194">white light</DiagramText>
        <DiagramText x="560" y="64">λ red</DiagramText><DiagramText x="732" y="220">spectrum</DiagramText><DiagramText x="558" y="366">λ violet</DiagramText>
        <FormulaText x="360" y="128">n₁ sin θ₁ = n₂ sin θ₂</FormulaText>
        <PlateLabel x="88" y="48">OPTICS PLATE / REFRACTION + SPECTRUM</PlateLabel>
      </>
    ),
    perspective: (
      <>
        <rect className="diagram-plane diagram-plane--yellow" x="112" y="104" width="260" height="228" />
        <rect className="diagram-plane diagram-plane--blue" x="628" y="104" width="260" height="228" />
        <path className={`diagram-line diagram-line--soft ${diagramNote(0)}`} d="M500 204 L86 78 M500 204 L918 78 M500 204 L82 352 M500 204 L920 352" />
        <path className={`diagram-line ${diagramNote(1)}`} d="M146 116 L372 166 L372 286 L146 336 Z M628 166 L852 116 L852 336 L628 286 Z" />
        <path className={`diagram-line diagram-line--thin ${diagramNote(2)}`} d="M70 204 L930 204 M500 58 L500 366" />
        <circle className={`diagram-dot ${diagramNote(3)}`} cx="500" cy="204" r="5" />
        <DiagramText x="516" y="196">VP</DiagramText><DiagramText x="74" y="196">horizon</DiagramText>
        <DiagramText x="624" y="84">picture plane</DiagramText>
        <FormulaText x="346" y="356">x′ = f x / z</FormulaText>
        <PlateLabel x="88" y="48">PERSPECTIVE PLATE / PICTURE PLANE</PlateLabel>
      </>
    ),
    computation: (
      <>
        <path className={`diagram-line diagram-line--soft ${diagramNote(0)}`} d="M100 128 L900 128 M100 204 L900 204 M100 280 L900 280" />
        <path className={`diagram-line ${diagramNote(1)}`} d="M128 104 h92 v48 h-92 Z M306 180 h92 v48 h-92 Z M484 256 h92 v48 h-92 Z M662 104 h92 v48 h-92 Z" />
        <path className={`diagram-line diagram-line--thin ${diagramNote(2)}`} d="M220 128 L306 204 L398 204 L484 280 L576 280 L662 128" />
        <DiagramText x="118" y="94">state q₀</DiagramText><DiagramText x="296" y="170">read / write</DiagramText>
        <DiagramText x="474" y="246">transition</DiagramText><DiagramText x="650" y="94">halt?</DiagramText>
        <DiagramText x="118" y="334">tape: 0 1 1 □ 0 1</DiagramText>
        <PlateLabel x="88" y="48">COMPUTATION PLATE / STATE MACHINE</PlateLabel>
      </>
    ),
    network: (
      <>
        <rect className="diagram-plane diagram-plane--blue" x="128" y="82" width="230" height="236" />
        <rect className="diagram-plane diagram-plane--yellow" x="628" y="102" width="250" height="232" />
        <path className={`diagram-line diagram-line--thin ${diagramNote(0)}`} d="M182 130 L358 90 L514 190 L690 108 L846 252 M182 130 L306 286 L514 190 L704 316 L846 252 M358 90 L704 316" />
        <circle className={`diagram-node diagram-node--0 ${diagramNote(0)}`} cx="182" cy="130" r="28" />
        <circle className={`diagram-node diagram-node--1 ${diagramNote(1)}`} cx="358" cy="90" r="20" />
        <circle className={`diagram-node diagram-node--2 ${diagramNote(2)}`} cx="514" cy="190" r="34" />
        <circle className={`diagram-node diagram-node--3 ${diagramNote(3)}`} cx="704" cy="316" r="24" />
        <circle className={`diagram-node diagram-node--4 ${diagramNote(4)}`} cx="846" cy="252" r="30" />
        <circle className={`diagram-node diagram-node--5 ${diagramNote(5)}`} cx="306" cy="286" r="18" />
        <DiagramText x="126" y="92">human</DiagramText><DiagramText x="474" y="178">symbiosis</DiagramText><DiagramText x="804" y="216">machine</DiagramText>
        <DiagramText x="330" y="370">interactive loop: ask / compute / judge / revise</DiagramText>
        <PlateLabel x="88" y="48">LICKLIDER PLATE / HUMAN-MACHINE LOOP</PlateLabel>
      </>
    ),
    graphics: (
      <>
        <path className={`diagram-line diagram-line--soft ${diagramNote(0)}`} d="M120 320 L280 110 L520 150 L660 330 Z M280 110 L660 330 M520 150 L120 320" />
        <path className={`diagram-line ${diagramNote(1)}`} d="M660 330 L900 210 M120 320 L900 210 M280 110 L900 210 M520 150 L900 210" />
        <circle className={`diagram-circle ${diagramNote(2)}`} cx="900" cy="210" r="42" />
        <DiagramText x="690" y="194">camera</DiagramText><DiagramText x="118" y="348">mesh</DiagramText>
        <FormulaText x="570" y="92">Lₒ = Lₑ + ∫ fᵣ Lᵢ cosθ dω</FormulaText>
        <DiagramText x="570" y="128">BRDF / visibility / sample</DiagramText>
        <PlateLabel x="88" y="48">GRAPHICS PLATE / RENDERING EQUATION</PlateLabel>
      </>
    ),
    lightfield: (
      <>
        <rect className="diagram-plane diagram-plane--blue" x="118" y="92" width="782" height="70" />
        <rect className="diagram-plane diagram-plane--red" x="118" y="260" width="782" height="70" />
        <path className={`diagram-line diagram-line--thin ${diagramNote(0)}`} d="M120 120 C260 96 370 96 510 120 S760 144 900 120 M120 300 C260 276 370 276 510 300 S760 324 900 300" />
        <path className={`diagram-line diagram-line--soft ${diagramNote(1)}`} d="M160 102 L160 318 M262 102 L262 318 M364 102 L364 318 M466 102 L466 318 M568 102 L568 318 M670 102 L670 318 M772 102 L772 318 M874 102 L874 318" />
        <path className={`diagram-line ${diagramNote(2)}`} d="M160 120 L874 300 M160 300 L874 120 M262 120 L772 300 M262 300 L772 120" />
        <DiagramText x="150" y="92">u</DiagramText><DiagramText x="872" y="92">v</DiagramText><DiagramText x="132" y="338">s</DiagramText><DiagramText x="884" y="338">t</DiagramText>
        <FormulaText x="392" y="210">L(u,v,s,t)</FormulaText>
        <PlateLabel x="88" y="48">LIGHT FIELD PLATE / TWO-PLANE PARAMETERIZATION</PlateLabel>
      </>
    ),
    interface: (
      <>
        <rect className="diagram-plane diagram-plane--yellow" x="118" y="110" width="312" height="194" />
        <rect className="diagram-plane diagram-plane--blue" x="570" y="92" width="310" height="232" />
        <path className={`diagram-line diagram-line--soft ${diagramNote(0)}`} d="M120 112 h310 v190 h-310 Z M570 92 h310 v232 h-310 Z" />
        <path className={`diagram-line ${diagramNote(1)}`} d="M168 162 h210 M168 206 h152 M168 250 h238 M620 152 C700 96 802 122 826 204 C848 280 738 330 650 286" />
        <path className={`diagram-line diagram-line--thin ${diagramNote(2)}`} d="M430 206 L570 206 M500 178 L570 152 M500 234 L570 286" />
        <DiagramText x="146" y="94">control</DiagramText><DiagramText x="604" y="78">response</DiagramText>
        <DiagramText x="452" y="198">feedback</DiagramText>
        <PlateLabel x="88" y="48">INTERACTION PLATE / INPUT + FEEDBACK</PlateLabel>
      </>
    ),
    stage: (
      <>
        <rect className="diagram-plane diagram-plane--red" x="120" y="238" width="760" height="102" />
        <rect className="diagram-plane diagram-plane--yellow" x="400" y="70" width="200" height="110" />
        <path className={`diagram-line diagram-line--soft ${diagramNote(0)}`} d="M120 330 C270 240 410 202 500 202 C590 202 730 240 880 330" />
        <path className={`diagram-line ${diagramNote(1)}`} d="M120 330 L500 72 L880 330 M254 240 L746 240 M360 168 L640 168" />
        <path className={`diagram-line diagram-line--thin ${diagramNote(2)}`} d="M190 90 L300 240 M810 90 L700 240 M500 72 L500 360" />
        <DiagramText x="468" y="64">fly</DiagramText><DiagramText x="156" y="356">audience</DiagramText><DiagramText x="690" y="228">sightline</DiagramText>
        <DiagramText x="404" y="388">cue = timing + belief</DiagramText>
        <PlateLabel x="88" y="48">STAGECRAFT PLATE / CUE + SIGHTLINE</PlateLabel>
      </>
    ),
    volume: (
      <>
        <rect className="diagram-plane diagram-plane--blue" x="170" y="112" width="500" height="230" />
        <rect className="diagram-plane diagram-plane--yellow" x="670" y="112" width="170" height="248" />
        <path className={`diagram-line diagram-line--soft ${diagramNote(0)}`} d="M170 112 h500 v230 h-500 Z M670 112 L840 190 L840 360 L670 342 M840 190 L340 190" />
        <path className={`diagram-line ${diagramNote(1)}`} d="M90 250 L340 190 L840 360 M90 250 L670 112 M90 250 L670 342" />
        <circle className={`diagram-dot ${diagramNote(2)}`} cx="90" cy="250" r="7" />
        <DiagramText x="72" y="238">lens</DiagramText><DiagramText x="360" y="178">frustum</DiagramText><DiagramText x="704" y="106">LED volume</DiagramText>
        <DiagramText x="440" y="382">genlock / timecode / color</DiagramText>
        <PlateLabel x="88" y="48">VIRTUAL PRODUCTION PLATE / CAMERA FRUSTUM</PlateLabel>
      </>
    ),
    prototype: (
      <>
        <rect className="diagram-plane diagram-plane--yellow" x="126" y="112" width="238" height="104" />
        <rect className="diagram-plane diagram-plane--blue" x="390" y="156" width="238" height="104" />
        <rect className="diagram-plane diagram-plane--red" x="654" y="200" width="238" height="104" />
        <path className={`diagram-line diagram-line--soft ${diagramNote(0)}`} d="M126 112 h238 v104 h-238 Z M390 156 h238 v104 h-238 Z M654 200 h238 v104 h-238 Z" />
        <path className={`diagram-line diagram-line--thin ${diagramNote(1)}`} d="M364 164 L390 164 M628 216 L654 216 M246 216 L246 326 L774 326 L774 304" />
        <path className={`diagram-line ${diagramNote(2)}`} d="M166 148 h150 M430 194 h150 M694 238 h150" />
        <DiagramText x="158" y="100">prototype</DiagramText><DiagramText x="424" y="144">test</DiagramText><DiagramText x="686" y="188">handoff</DiagramText>
        <DiagramText x="318" y="366">unknown → experiment → evidence → system</DiagramText>
        <PlateLabel x="88" y="48">PROTOTYPE PLATE / EVIDENCE LOOP</PlateLabel>
      </>
    ),
    neural: (
      <>
        <path className={`diagram-line diagram-line--thin ${diagramNote(0)}`} d="M160 110 L390 90 L620 140 L850 104 M160 210 L390 190 L620 220 L850 204 M160 310 L390 290 L620 300 L850 312 M160 110 L390 190 L620 300 M160 310 L390 190 L620 140 M390 90 L620 220 L850 312 M390 290 L620 220 L850 104" />
        {[160, 390, 620, 850].map((x, col) => [110, 210, 310].map((y, row) => (
          <circle className={`diagram-node diagram-node--${(col * 3 + row) % 6} ${diagramNote((col * 3 + row) % 6)}`} key={`${col}-${row}`} cx={x} cy={y + (col % 2 ? -20 : 0)} r={15} />
        )))}
        <DiagramText x="132" y="74">input</DiagramText><DiagramText x="350" y="70">hidden</DiagramText><DiagramText x="596" y="94">latent</DiagramText><DiagramText x="816" y="74">output</DiagramText>
        <FormulaText x="356" y="374">∂loss / ∂w</FormulaText>
        <PlateLabel x="88" y="48">NEURAL PLATE / REPRESENTATION LEARNING</PlateLabel>
      </>
    ),
    ai: (
      <>
        <rect className="diagram-plane diagram-plane--blue" x="130" y="88" width="680" height="44" />
        <rect className="diagram-plane diagram-plane--yellow" x="130" y="208" width="680" height="44" />
        <rect className="diagram-plane diagram-plane--red" x="130" y="268" width="680" height="44" />
        <path className={`diagram-line diagram-line--thin ${diagramNote(0)}`} d="M130 110 h740 M130 170 h740 M130 230 h740 M130 290 h740" />
        <path className={`diagram-line diagram-line--soft ${diagramNote(1)}`} d="M190 110 L378 230 L566 170 L754 290 M190 290 L378 170 L566 230 L754 110" />
        <path className={`diagram-line ${diagramNote(2)}`} d="M170 88 h80 v44 h-80 Z M338 208 h80 v44 h-80 Z M526 148 h80 v44 h-80 Z M714 268 h80 v44 h-80 Z" />
        <DiagramText x="164" y="78">Q</DiagramText><DiagramText x="336" y="198">K</DiagramText><DiagramText x="526" y="138">V</DiagramText><DiagramText x="710" y="258">context</DiagramText>
        <FormulaText x="338" y="354">softmax(QKᵀ / √d)V</FormulaText>
        <PlateLabel x="88" y="48">ATTENTION PLATE / QUERY KEY VALUE</PlateLabel>
      </>
    ),
    story: (
      <>
        <path className={`diagram-line diagram-line--soft ${diagramNote(0)}`} d="M120 300 C230 90 408 360 500 186 C592 18 770 330 880 118" />
        <path className={`diagram-line ${diagramNote(1)}`} d="M120 300 L500 186 L880 118 M206 210 C290 250 350 250 428 210 M570 196 C650 150 724 150 800 196" />
        <path className={`diagram-line diagram-line--thin ${diagramNote(2)}`} d="M160 340 h680 M500 66 v300" />
        <DiagramText x="118" y="322">geometry</DiagramText><DiagramText x="456" y="178">story</DiagramText><DiagramText x="782" y="106">AI</DiagramText>
        <DiagramText x="356" y="382">tools → shots → tales</DiagramText>
        <PlateLabel x="88" y="48">STORY PLATE / SYSTEMS IN SERVICE</PlateLabel>
      </>
    ),
  };

  return (
    <svg
      className={`blackout-panel__diagram blackout-panel__diagram--${type} ${pulseClass}`}
      viewBox="0 0 1000 420"
      aria-hidden="true"
      style={pulseDuration ? { '--melody-pulse-ms': `${pulseDuration}ms` } : undefined}
    >
      {diagrams[type] || diagrams.euclid}
    </svg>
  );
}

function BlackoutPoetryPanel() {
  const [active, setActive] = useState(0);
  const [phraseSegments, setPhraseSegments] = useState([]);
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
    if (wordRevealTimerRef.current || revealSequenceStartedRef.current) return;
    revealSequenceStartedRef.current = true;
    let step = 0;
    const maxStep = Math.max(0, wordCount * 2 - 1);
    const advance = () => {
      if (step % 2 === 0) {
        setRevealedWordCount(Math.min(wordCount, (step / 2) + 1));
      } else {
        setRevealedLineCount(Math.min(Math.max(0, wordCount - 1), (step + 1) / 2));
      }
      if (step >= maxStep) {
        window.clearInterval(wordRevealTimerRef.current);
        wordRevealTimerRef.current = null;
        return;
      }
      step += 1;
    };
    advance();
    wordRevealTimerRef.current = window.setInterval(advance, revealStepMs);
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
      let accent = event.detail.accent;
      if (svg && !svg.querySelector(`.diagram-note--${accent}`)) {
        const availableAccents = Array.from(svg.querySelectorAll('.diagram-note-target'))
          .map((node) => Array.from(node.classList).find((className) => className.startsWith('diagram-note--')))
          .map((className) => Number(className?.replace('diagram-note--', '')))
          .filter((value, index, list) => Number.isFinite(value) && list.indexOf(value) === index);
        if (availableAccents.length) {
          accent = availableAccents[event.detail.id % availableAccents.length];
        }
      }
      const detailLanes = new Set(['angel', 'chop', 'dust', 'ghost']);
      const family = detailLanes.has(event.detail.lane) ? 'detail' : 'structure';
      setDiagramPulse((current) => ({
        ...current,
        [family]: {
        id: event.detail.id,
        lane: event.detail.lane,
        accent,
        duration: Math.max(360, event.detail.duration * 1.65),
        },
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
    setTitleCount(0);
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
  }, [active, title, typeMs, timingNonce]);

  useEffect(() => () => clearRevealTimers(), []);

  useEffect(() => {
    const raf = window.requestAnimationFrame(() => {
      const mapBox = phraseMapRef.current?.getBoundingClientRect();
      const nodes = activeWordRefs.current.filter(Boolean);
      if (!mapBox || nodes.length < 2) {
        setPhraseSegments([]);
        return;
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
    });
    return () => window.cancelAnimationFrame(raf);
  }, [active, laidOutRows, revealedWordCount, phraseWordKeys]);

  return (
    <>
    <h1
      className={`identity__poetry-title ${drumPulse ? `is-drum-hit-${drumPulse.id % 2 ? 'a' : 'b'} is-drum-lane--${drumPulse.lane}` : ''}`}
      aria-label={title}
      style={{
        '--cursor-ms': `${cursorMs}ms`,
        '--drum-pulse-ms': `${drumPulse?.duration || 140}ms`,
        '--drum-strength': drumPulse?.strength || 0,
      }}
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
          visibleCount={musicVisualsActive ? revealedLineCount : phraseSegments.length}
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
    <StemMuteControls />
    </>
  );
}

// ────────────────────────────────────────────────────────────────────
//  HelpPlayer — embedded MESH-projection 360° video
// ────────────────────────────────────────────────────────────────────

function HelpPlayer({ src }) {
  const hostRef = useRef(null);
  const [status, setStatus] = useState('loading'); // loading | ready | missing | error
  const [projection, setProjection] = useState(null);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(true);
  const [showHint, setShowHint] = useState(true);
  const rendererRef = useRef(null);
  const audibleRef = useRef(false);
  const pausedRef = useRef(true);
  const userPausedRef = useRef(false);
  const wasPlayingBeforeHiddenRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    async function go() {
      try {
        const sources = Array.isArray(src) ? src : [src];
        let playableSrc = null;
        // HEAD probe first so a missing file fails fast and the
        // placeholder shows immediately instead of stalling.
        for (const candidate of sources) {
          const head = await fetch(candidate, { method: 'HEAD' }).catch(() => null);
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
      if (!pausedRef.current) renderer.pause();
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
      rendererRef.current.play();
    } else {
      userPausedRef.current = true;
      wasPlayingBeforeHiddenRef.current = false;
      rendererRef.current.pause();
    }
  };
  const replayWithSound = () => {
    hideHint();
    userPausedRef.current = false;
    wasPlayingBeforeHiddenRef.current = false;
    rendererRef.current?.replayWithSound();
  };
  const toggleSound = () => {
    hideHint();
    userPausedRef.current = false;
    rendererRef.current?.toggleMuted();
  };
  const toggleFullscreen = () => {
    hideHint();
    const slot = hostRef.current?.closest('.help-player');
    if (!slot) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      slot.requestFullscreen?.().catch(() => {});
    }
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
              <span className="wasd-key"><b>W</b><i>↑</i></span>
              <span />
              <span className="wasd-key"><b>A</b><i>←</i></span>
              <span className="wasd-key wasd-key--center"><b>S</b><i>↓</i></span>
              <span className="wasd-key"><b>D</b><i>→</i></span>
            </div>
          </div>
          <div className="video-controls video-controls--help" aria-label="HELP video controls">
            <button className="video-control video-control--primary mono" onClick={togglePlayback} aria-label={paused ? 'Play video' : 'Pause video'}>
              <span className={`video-control__icon ${paused ? 'video-control__icon--play' : 'video-control__icon--pause'}`} aria-hidden="true" />
              <span>{paused ? 'play' : 'pause'}</span>
            </button>
            <button className="video-control mono" onClick={replayWithSound} aria-label="Replay from beginning with sound">
              <span className="video-control__icon video-control__icon--replay" aria-hidden="true" />
              <span>replay</span>
            </button>
            <button className="video-control mono" onClick={toggleSound} aria-label={muted ? 'Turn sound on' : 'Mute video'}>
              <span className={`video-control__icon ${muted ? 'video-control__icon--sound-off' : 'video-control__icon--sound-on'}`} aria-hidden="true" />
              <span>{muted ? 'click for sound' : 'mute'}</span>
            </button>
            <button className="video-control video-control--icon mono" onClick={toggleFullscreen} aria-label="Enter fullscreen">
              <span className="video-control__icon video-control__icon--fullscreen" aria-hidden="true" />
            </button>
          </div>
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
          if (!userHeldPlaybackRef.current) video.pause();
        }
      },
      { threshold: [0, 0.2, 0.62, 1] }
    );
    const slot = video.closest('.video-slot');
    if (slot) observer.observe(slot);
    return () => observer.disconnect();
  }, [status]);

  function activateSlot({ withSound = false, restart = false, userInitiated = false } = {}) {
    const video = videoRef.current;
    if (!video) return;
    if (!userInitiated && window.__resumeHeldVideoSlot && window.__resumeHeldVideoSlot !== slotIdRef.current) return;
    window.dispatchEvent(new CustomEvent('resume-video-slot-active', {
      detail: { id: slotIdRef.current, userInitiated }
    }));
    if (restart) video.currentTime = 0;
    if (withSound) video.muted = false;
    if (userInitiated && !video.muted) {
      userHeldPlaybackRef.current = true;
      window.__resumeHeldVideoSlot = slotIdRef.current;
    }
    video.play().catch(() => {});
  }

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    window.dispatchEvent(new CustomEvent('resume-video-slot-active', {
      detail: { id: slotIdRef.current, userInitiated: true }
    }));
    video.muted = !video.muted;
    userHeldPlaybackRef.current = !video.muted;
    window.__resumeHeldVideoSlot = video.muted ? null : slotIdRef.current;
    setMuted(video.muted);
    if (video.paused) video.play().catch(() => {});
  };

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      activateSlot({ userInitiated: true });
    } else {
      userHeldPlaybackRef.current = false;
      if (window.__resumeHeldVideoSlot === slotIdRef.current) window.__resumeHeldVideoSlot = null;
      video.pause();
    }
  };

  const replayWithSound = () => activateSlot({ withSound: true, restart: true, userInitiated: true });

  const toggleFullscreen = () => {
    const slot = videoRef.current?.closest('.video-slot');
    if (!slot) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      slot.requestFullscreen?.().catch(() => {});
    }
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
            <span className={`video-control__icon ${paused ? 'video-control__icon--play' : 'video-control__icon--pause'}`} aria-hidden="true" />
            <span>{paused ? 'play' : 'pause'}</span>
          </button>
          <button className="video-control mono" onClick={replayWithSound} aria-label="Replay from beginning with sound">
            <span className="video-control__icon video-control__icon--replay" aria-hidden="true" />
            <span>replay</span>
          </button>
          <button className="video-control mono" onClick={toggleSound} aria-label={muted ? 'Turn sound on' : 'Mute video'}>
            <span className={`video-control__icon ${muted ? 'video-control__icon--sound-off' : 'video-control__icon--sound-on'}`} aria-hidden="true" />
            <span>{muted ? 'click for sound' : 'mute'}</span>
          </button>
          <button className="video-control video-control--icon mono" onClick={toggleFullscreen} aria-label="Enter fullscreen">
            <span className="video-control__icon video-control__icon--fullscreen" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────
//  BlackbirdFeature — flat video + context (parallel to HELP)
// ────────────────────────────────────────────────────────────────────

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
          <ul className="help-feature__chips mono">
            <li>Unreal Engine · real-time AR composite</li>
            <li>Mill Cyclops™ · virtual production toolkit</li>
            <li>Arraiy tracking · live positional data</li>
            <li>HPA · Judges Award · Creativity & Innovation</li>
            <li>Cannes Gold · Innovative Use of Technology</li>
          </ul>
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
  if (['help', 'blackbird', 'project'].includes(id)) return 'circle';
  return 'square';
}

function Section({ id, label, children, dense }) {
  const shape = getSectionShape(id);
  return (
    <section id={id} className={`section section--${shape} ${dense ? 'section--dense' : ''}`}>
      <header className="section__header">
        <span className="section__mark" aria-hidden="true" />
        <span className="section__rule" />
        <span className="section__label mono">{label}</span>
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
        <span className="identity__top-dot">●</span>
        <span>FOLIO · 2026</span>
        <span className="identity__top-dot">●</span>
        <span>{data.location}</span>
        <span className="identity__top-dot">●</span>
        <a href="https://www.linkedin.com/in/tawfeeq-martin-82991a14/" target="_blank" rel="noreferrer">LinkedIn</a>
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
            <ul className="job__bullets">
              {job.bullets.map((b, j) => (<li key={j}>{b}</li>))}
            </ul>
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
        <div className="help-hero__awards">
          <ul className="help-feature__chips mono">
            <li>Cannes Gold · Innovative Use of Tech</li>
            <li>Cannes Gold · VR</li>
            <li>SXSW Gold · AR/VR Breakthrough</li>
            <li>Webby · Technical Achievement</li>
          </ul>
        </div>
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
  return (
    <Section id="refs" label="09 · REFERENCES">
      <div className="refs">
        <div className="refs__quote">
          <div className="refs__qmark serif">“</div>
          <blockquote className="refs__text serif">
            {items[active].quote}
          </blockquote>
          <div className="refs__attribution">
            <div className="refs__name serif">{items[active].name}</div>
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
      <div>
        <span>{data.name}</span>
        <span className="dot">●</span>
        <span>{data.location}</span>
        <span className="dot">●</span>
        <a href={`https://${data.site}`} target="_blank" rel="noreferrer">{data.site}</a>
      </div>
      <div className="page-footer__build">
        rev · 2026.05 · built with three.js + a parser for google's mesh projection + strudel.cc audio
      </div>
    </footer>
  );
}

Object.assign(window, {
  HelpPlayer, HelpFeature, Identity, Summary,
  Experience, ProjectCard, Awards, Skills, Education, References, Footer,
  VideoSlot, BlackbirdFeature
});
