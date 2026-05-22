const PRODUCTION_MEDIA_ORIGIN = "https://media.tawfeeqmartin.com";
const IS_LOCAL_PREVIEW = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname);
const mediaUrl = (path) => {
  if (IS_LOCAL_PREVIEW) return path;
  return `${PRODUCTION_MEDIA_ORIGIN}/${path.replace(/^media\//, '')}`;
};
const withCacheKey = (url, key) => `${url}${url.includes('?') ? '&' : '?'}v=${key}`;
const TV_CLIP_CACHE_KEY = '20260521-mando-grogu-no-titles';
const SITE_MODE_STORAGE_KEY = 'resume.desktop.mode';
const IS_MOBILE_MEDIA_TARGET = window.matchMedia('(max-width: 900px), (pointer: coarse)').matches;
const helpMeshSource = (path) => ({
  videoUrl: mediaUrl(path),
  projectionUrl: mediaUrl(path),
  requireMesh: true,
});
// HELP must either render through the decoded Google Spotlight MESH
// projection or fail closed. Showing the native encoded layout looks
// broken, so there is intentionally no MP4/raw inline fallback here.
const HELP_DESKTOP_SOURCES = [
  helpMeshSource("media/help_full.webm"),
  helpMeshSource("media/help.f338.webm"),
];
const HELP_MOBILE_SOURCES = [
  helpMeshSource("media/help_full.webm"),
  helpMeshSource("media/help.f338.webm"),
];
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
    takes: 52,
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
        <span className="site-mode-toggle__mark site-mode-toggle__mark--triangle" aria-hidden="true"></span>
        read-only
      </button>
      <button
        type="button"
        className={mode === 'more-than-words' ? 'is-active' : ''}
        aria-pressed={mode === 'more-than-words'}
        onClick={() => switchMode('more-than-words')}
      >
        <span className="site-mode-toggle__mark site-mode-toggle__mark--square" aria-hidden="true"></span>
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
            <img src={item.avatar} alt="" loading="lazy" decoding="async" />
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
