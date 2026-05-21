const PRODUCTION_MEDIA_ORIGIN = "https://media.tawfeeqmartin.com";
const IS_LOCAL_PREVIEW = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname);
const mediaUrl = (path) => {
  if (IS_LOCAL_PREVIEW) return path;
  return `${PRODUCTION_MEDIA_ORIGIN}/${path.replace(/^media\//, '')}`;
};
const withCacheKey = (url, key) => `${url}${url.includes('?') ? '&' : '?'}v=${key}`;
const TV_CLIP_CACHE_KEY = '20260520-bw-preprocessed';
const IS_MOBILE_MEDIA_TARGET = window.matchMedia('(max-width: 900px), (pointer: coarse)').matches;
// First mobile choice: mesh WebM. Frames are authored to align with the
// mesh UVs so projection renders correctly. Chrome Android plays VP9
// fine; iOS Safari's WebM/VP9 support is unreliable, so this source
// fails canPlayType() on iOS and we fall through to the MP4.
const HELP_MOBILE_WEBM = {
  videoUrl: mediaUrl("media/help-720-mesh.webm"),
  projectionUrl: mediaUrl("media/help-720-mesh.webm"),
};
// iOS Safari fallback: the MP4 frames don't align with the mesh UVs so
// projection looks wrong on it. Show it inline (raw) so the user at
// least sees the video content while we work out a properly mesh-laid
// MP4 source.
const HELP_MOBILE_MP4 = {
  videoUrl: mediaUrl("media/help-720-mobile.mp4"),
  projectionUrl: mediaUrl("media/help-720-mesh.webm"),
  inlineVideoFallback: true,
};
// Desktop sources — full mesh-laid-out WebMs, with an MP4 inline
// fallback at the end so Safari Mac (which can fail VP9) still
// shows something.
const HELP_DESKTOP_SOURCES = [
  mediaUrl("media/help_full.webm"),
  mediaUrl("media/help-720-mesh.webm"),
  mediaUrl("media/help.f338.webm"),
  HELP_MOBILE_MP4,
];
// Mobile sources — kept entirely separate from desktop so changes to
// one path can't bleed into the other.
const HELP_MOBILE_SOURCES = [HELP_MOBILE_WEBM, HELP_MOBILE_MP4];
const HELP_VIDEO_URLS = IS_MOBILE_MEDIA_TARGET
  ? HELP_MOBILE_SOURCES
  : HELP_DESKTOP_SOURCES;
const BLACKBIRD_INNOVATION_VIDEO_URL = mediaUrl("media/blackbird-innovation.mp4");
const BLACKBIRD_VIDEO_URL = mediaUrl("media/blackbird.mp4");

const CLEARED_TRAILER_GROUPS = [
  {
    slug: 'mandalorian-s3',
    project: 'The Mandalorian Season 3',
    sourceUrl: 'https://www.youtube.com/watch?v=Znsa4Deavgg',
    weight: 8,
    lanes: ['kick', 'snare', 'bass', 'lead', 'lift', 'switch', 'angel', 'idle', 'init'],
  },
  {
    slug: 'obi-wan',
    project: 'Obi-Wan Kenobi',
    sourceUrl: 'https://www.youtube.com/watch?v=3Yh_6_zItPU',
    takes: 6,
    weight: 12,
    lanes: ['kick', 'snare', 'bass', 'lead', 'lift', 'build', 'ghost', 'idle', 'init'],
  },
  {
    slug: 'mandalorian-grogu',
    project: 'The Mandalorian and Grogu',
    weight: 7,
    lanes: ['kick', 'snare', 'bass', 'lead', 'switch', 'angel', 'idle', 'init'],
  },
  {
    slug: 'skeleton-crew',
    project: 'Skeleton Crew',
    weight: 7,
    lanes: ['kick', 'snare', 'lead', 'lift', 'build', 'ghost', 'idle'],
  },
  {
    slug: 'creator',
    project: 'The Creator',
    weight: 7,
    lanes: ['snare', 'bass', 'lead', 'lift', 'switch', 'angel', 'idle'],
  },
  {
    slug: 'joker',
    project: 'Joker: Folie A Deux',
    weight: 4,
    lanes: ['snare', 'lead', 'lift', 'ghost', 'idle'],
  },
  {
    slug: 'andor-s2',
    project: 'Andor Season 2',
    sourceUrl: 'https://www.youtube.com/watch?v=QHAu5XHsDhQ',
    takes: 6,
    weight: 9,
    lanes: ['kick', 'snare', 'bass', 'lead', 'lift', 'build', 'ghost', 'idle', 'init'],
  },
  {
    slug: 'big-bold',
    project: 'A Big Bold Beautiful Journey',
    weight: 5,
    lanes: ['kick', 'snare', 'lead', 'lift', 'ghost', 'idle'],
  },
];
// Sources with more dead bars baked into the trailer file get an extra
// punch-in on the Mac so the cinematic content fills the CRT.
const CLEARED_TRAILER_PUNCH_IN = { creator: 1.34 };
const CLEARED_TRAILER_SOURCES = CLEARED_TRAILER_GROUPS.flatMap((group) =>
  Array.from({ length: group.takes || 4 }, (_, index) => {
    const take = String(index + 1).padStart(2, '0');
    return {
      url: withCacheKey(mediaUrl(`media/tv-clips/cleared-${group.slug}-${take}.mp4`), TV_CLIP_CACHE_KEY),
      kind: 'video',
      fit: 'contain',
      matteAspect: 2.39,
      punchIn: CLEARED_TRAILER_PUNCH_IN[group.slug] || 1,
      optional: true,
      project: group.project,
      cue: `cleared trailer phrase ${take}`,
      sampleKey: `${group.slug}-trailer-${take}`,
      sourceUrl: group.sourceUrl || '',
      weight: group.weight,
      lanes: group.lanes,
    };
  })
);
const CLEARED_TRAILER_HOOK_GROUPS = [
  { slug: 'mandalorian-s3', project: 'The Mandalorian Season 3', takes: 3, weight: 8 },
  { slug: 'obi-wan', project: 'Obi-Wan Kenobi', takes: 3, weight: 12 },
  { slug: 'mandalorian-grogu', project: 'The Mandalorian and Grogu', takes: 3, weight: 7 },
  { slug: 'skeleton-crew', project: 'Skeleton Crew', takes: 3, weight: 7 },
  { slug: 'creator', project: 'The Creator', takes: 3, weight: 7 },
  { slug: 'joker', project: 'Joker: Folie A Deux', takes: 3, weight: 4 },
  { slug: 'andor-s2', project: 'Andor Season 2', takes: 4, weight: 9 },
  { slug: 'big-bold', project: 'A Big Bold Beautiful Journey', takes: 3, weight: 5 },
];
const CLEARED_TRAILER_HOOK_SOURCES = CLEARED_TRAILER_HOOK_GROUPS.flatMap((group) =>
  Array.from({ length: group.takes }, (_, index) => {
    const take = String(index + 1).padStart(2, '0');
    return {
      url: withCacheKey(mediaUrl(`media/tv-clips/cleared-${group.slug}-hook-${take}.mp4`), TV_CLIP_CACHE_KEY),
      kind: 'video',
      fit: 'contain',
      matteAspect: 2.39,
      punchIn: CLEARED_TRAILER_PUNCH_IN[group.slug] || 1,
      optional: true,
      pool: 'vocal-hook',
      hasAudio: true,
      project: group.project,
      cue: `vocal hook ${take}`,
      sampleKey: `${group.slug}-hook-${take}`,
      weight: group.weight,
      lanes: ['vocal'],
    };
  })
);
const TV_VIDEO_SOURCES = [
  ...CLEARED_TRAILER_SOURCES,
  ...CLEARED_TRAILER_HOOK_SOURCES,
];
window.RESUME_TV_CLIP_POOLS = {
  visual: CLEARED_TRAILER_SOURCES,
  vocal: CLEARED_TRAILER_HOOK_SOURCES,
};
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

function App() {
  return (
    <>
      <ScrollAudioLayers />
      <div className="page">
        <TopStrip data={RESUME} />
        <div className="hero-stack">
          <div className="hero-stack__intro">
            <h1 className="hero-lead">
              <span className="hero-lead__name">Tawfeeq Martin.</span>
            </h1>
          </div>
          <aside className="hero-stack__sticky">
            <TvHero sources={TV_VIDEO_SOURCES} />
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
