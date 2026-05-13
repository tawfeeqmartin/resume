// Resume data
const RESUME = {
  name: "Tawfeeq Martin",
  title: "Creative Technologist · Senior Virtual Production Engineer",
  location: "Los Angeles, CA",
  site: "tawfeeqmartin.com",
  summary: "Award-winning creative technologist with 20+ years defining and shipping products at the intersection of emerging technology and cinematic storytelling. Core engineering team at ILM StageCraft. Previously Technical Innovations Manager at The Mill, where I led 0-to-1 product development on landmark projects including Google Spotlight Stories ‘HELP’ (dir. Justin Lin) — a double Gold Cannes Lion–winning immersive 360° film — and was one of the inventors of Mill Stitch™ and the Mill Blackbird car rig. Independent developer of AI tools, devotional software, and generative creative systems.",

  intro: [
    "I've spent 20+ years at the intersection of emerging technology and storytelling — at Waterfront Studios, The Mill, ILM StageCraft, and in my own independent work. What draws me to this role is that it describes something I've actually been doing: taking capabilities that don't have a product shape yet and finding one.",
    "Mill Stitch started as an R&D problem with no clear solution. I helped invent the tool, defined its scope, supervised the shoot, and saw it through to awards recognition. The Mill Blackbird was the same — a three-year product development arc that required as much product thinking as engineering. I built a bespoke 360° on-set camera acquisition tool for the MSG Sphere, and shipped agiftoftime.app independently.",
    "I am developing with Claude Code, MCP, and agentic systems daily. I understand what these tools can do at the frontier, and I have a sense for the gap between a research capability and something a person would actually want to use.",
  ],

  experience: [
    {
      role: "Senior Virtual Production Engineer",
      org: "ILM StageCraft (Industrial Light & Magic)",
      where: "Los Angeles, CA",
      period: "2020 — Present",
      tag: "Current",
      bullets: [
        "Core engineering team for ILM StageCraft, the world's leading LED volume virtual production system, supporting major episodic and feature productions.",
        "Architect and maintain real-time rendering infrastructure connecting both ILM in-house renderer / Unreal Engine to in-camera VFX (ICVFX) pipelines across multiple stage facilities.",
        "Active research into AI-augmented production workflows: LLM-based tooling, multi-agent orchestration, and local inference pipelines as future enhancements to virtual production infrastructure.",
        "Identify opportunities to apply frontier AI capabilities to virtual production; translate research into actionable prototypes and proposals for production integration.",
        "Collaborate directly with directors, DPs, and VFX supervisors to solve on-set technical challenges during live photography.",
        "Contributed to ILM StageCraft work recognized by SIGGRAPH, the Television Academy's 74th Engineering, Science & Technology Emmy, and NATAS's 75th Technology & Engineering Emmy.",
      ],
      credits: [
        "Obi-Wan Kenobi",
        "Skeleton Crew",
        "Andor Season 2",
        "The Mandalorian Season 3",
        "The Santa Clauses S2",
        "The Creator",
        "Wicked",
        "A Big Bold Beautiful Journey",
        "The Mandalorian & Grogu",
      ],
    },
    {
      role: "Technology Consultant",
      org: "Madison Square Garden Entertainment Corp.",
      where: "Freelance",
      period: "Jun — Aug 2020",
      bullets: [
        "Scoped, designed, and delivered a bespoke 360° live-action preview, acquisition, and selects-editorial on-set tool for the MSG Sphere system — sole owner from brief to shipped product.",
      ],
    },
    {
      role: "Technical Innovations Manager",
      org: "The Mill",
      where: "Los Angeles, CA",
      period: "2010 — 2020",
      bullets: [
        "Led R&D and technical innovation across The Mill's most recognized projects — from concept through production and post.",
        "Led 0-to-1 product development on Mill Stitch™: identified the problem (no way for a director to view 360° action in real time on set), defined the solution, built the pipeline, shipped it on a live production, and saw it through to Cannes Gold, SXSW Gold, and a Webby Award.",
        "Defined product strategy and led execution on The Mill Blackbird — identified an unmet need in automotive advertising, conceptualized the adjustable CG car rig, and delivered a three-year R&D arc from concept to awarded product.",
        "Produced and supervised REEPS ONE: ‘Does Not Exist’ — the first immersive music video of its kind; owned creative and technical direction end to end.",
        "Served on the Technicolor Fellowship network; instrumental in building the Technicolor Experience Center for emerging technologies.",
      ],
    },
    {
      role: "Chief Technology Officer",
      org: "Waterfront Studios",
      where: "",
      period: "2002 — 2010",
      bullets: [
        "Led all technology strategy, product development, and engineering operations for a full-service post-production and content studio.",
        "Oversaw software/hardware prototyping, real-time rendering applications, UX/UI development, and emerging-technology R&D.",
        "Built and managed engineering teams; established client and vendor relationships at an executive level.",
      ],
    },
    {
      role: "Head of Engineering",
      org: "Condor Post",
      where: "Cape Town, South Africa",
      period: "2008 — 2009",
      bullets: [
        "Led engineering operations for a post-production facility in Cape Town.",
        "Managed technical infrastructure, pipeline development, and cross-functional engineering staff.",
      ],
    },
  ],

  project: {
    name: "agiftoftime.app",
    sub: "Islamic Prayer Clock · 2025",
    body: "A devotional progressive web app built during Ramadan. A dichroic glass cube refracts light into Islamic prayer-time windows using Three.js and custom WebGL shaders; spatial adhan plays from the Qibla direction via HRTF Web Audio API. Grounded in the Islamic scholarly tradition of ilm al-miqat (celestial timekeeping). Launched to immediate recognition from the Islamic and Three.js communities. Sole product owner — identified audience, defined scope, designed experience, and shipped independently.",
    stack: ["Three.js", "WebGL / GLSL", "HRTF Web Audio", "PWA"],
  },

  awards: [
    { org: "Television Academy", title: "74th Engineering, Science & Technology Emmy · StageCraft Virtual Production Tool Suite", project: "ILM StageCraft", role: "Senior Virtual Production Engineer", tier: "gold" },
    { org: "NATAS", title: "75th Technology & Engineering Emmy · Excellence in Production Technology", project: "The Santa Clauses Season Two · ILM StageCraft", role: "Senior Virtual Production Engineer", tier: "gold" },
    { org: "HPA", title: "Judges Award · Creativity & Innovation", project: "The Mill Blackbird", role: "Technical Innovations Manager", tier: "gold" },
    { org: "Cannes Lions", title: "Gold · Digital Craft · Innovative Use of Technology", project: "The Mill Blackbird", role: "TIM & Project Manager", tier: "gold" },
    { org: "Cannes Lions", title: "Gold · Digital Craft · Innovative Use of Technology", project: "Google Spotlight Stories ‘HELP’ (dir. Justin Lin)", role: "TIM & Shoot Supervisor", tier: "gold" },
    { org: "Cannes Lions", title: "Gold · Virtual Reality", project: "‘HELP’", role: "TIM & Shoot Supervisor", tier: "gold" },
    { org: "The One Show", title: "Gold Pencil · Responsive Environments", project: "Chevrolet ‘The Human Race’", role: "TIM & Shoot Supervisor", tier: "gold" },
    { org: "The One Show", title: "Silver Pencil · Integrated Digital & Physical IP", project: "Chevrolet ‘The Human Race’", role: "TIM & Shoot Supervisor", tier: "silver" },
    { org: "SXSW", title: "Gold · AR/VR Breakthrough Innovation", project: "Mill Stitch™", role: "TIM / Product Manager", tier: "gold" },
    { org: "Webby Awards", title: "Technical Achievement · 20th Annual", project: "Justin Lin / Google ATAP / The Mill — ‘HELP’", role: "TIM & Shoot Supervisor", tier: "honor" },
    { org: "Technicolor", title: "Outstanding Technology Contribution", project: "Engineering Awards", role: "TIM & Product Development", tier: "honor" },
    { org: "SIGGRAPH", title: "Recognition · Virtual Production Methodology & Tooling", project: "ILM StageCraft", role: "Senior Virtual Production Engineer", tier: "honor" },
    { org: "AICP", title: "Recognition · Production Technology", project: "The Mill", role: "Technical Innovations Manager", tier: "honor" },
  ],

  skills: [
    { group: "Virtual Production", items: ["ILM StageCraft ICVFX", "LED volume stages", "Unreal Engine", "On-set real-time engineering"] },
    { group: "Creative Technology", items: ["TouchDesigner", "Three.js", "WebGL / GLSL", "Web Audio (HRTF)", "p5.js"] },
    { group: "AI & Research", items: ["LLM tooling research", "Multi-agent orchestration", "Local inference", "CUDA multi-GPU"] },
    { group: "Product", items: ["SW/HW prototyping", "UX/UI", "ML/AI", "AR/VR", "Biometrics", "Agile / Scrum"] },
    { group: "Music", items: ["Ableton Live", "Push 3 standalone", "Generative MIDI"] },
    { group: "Languages", items: ["Python", "JavaScript / Node", "C++", "bash"] },
    { group: "Leadership", items: ["R&D leadership", "Executive leadership", "BD & strategy", "Certified Scrum Master"] },
  ],

  education: [
    { school: "Boise State University", degree: "B.S. — Electrical & Computer Systems Engineering" },
    { school: "Cape Town University of Technology", degree: "National Diploma — Computer Systems Engineering" },
    { school: "University of Stellenbosch", degree: "Business Administration / Management" },
  ],

  references: [
    {
      name: "Regina Dugan",
      title: "CEO, Wellcome Leap",
      sub: "fmr. VP Building 8 (Facebook) · VP Engineering, ATAP (Google) · Director, DARPA",
      quote: "Tawfeeq is an exceptional architect of new technologies for storytelling. He led the technology team responsible for building the only Hollywood-scale film pipeline and custom toolset including Mill Stitch — tools that enabled director Justin Lin to view the 360-degree action of ‘HELP’ as it was shot, in real time. ‘HELP’ went on to win Cannes Gold for Innovative Use of Technology, Cannes Gold for Virtual Reality, the WEBBY for technical achievement in VR, and the SXSW AR/VR breakthrough innovation award.",
    },
    {
      name: "Usman Shakeel",
      title: "Director of Engineering, Amazon AGI Infrastructure",
      sub: "fmr. Worldwide Technology Leader, M&E — AWS",
      quote: "Tawfeeq is very technology savvy and one of the smartest people I have worked with. Well spoken and trustworthy. It is always a treat to discuss the latest tech with him — I learn a thing or two during every meeting.",
    },
    {
      name: "Virginia ‘Ginny’ Galloway",
      title: "Co-Founder, WildVentureXR",
      sub: "fmr. Executive Producer, Marshmallow Laser Feast",
      quote: "Tawfeeq was instrumental in bringing REEPS ONE: ‘Does Not Exist’ to life. An ambitious, original concept that faced many challenges — and Tawfeeq was there at every turn with creative and technical solutions. He went way above and beyond. A 5-star master of his craft.",
    },
    {
      name: "Daniell Phillips",
      title: "Director, Brand Partnerships — Residence",
      sub: "fmr. The Mill",
      quote: "Brings real depth of technical and creative knowledge to a broad range of content, film-making and experiential production. Across virtual production, real-time character executions, AR applications and CG pipeline plug-ins, Tawfeeq always brought rigour alongside a real problem-solving approach. An asset to any team.",
    },
    {
      name: "Chris Harlowe",
      title: "Executive Producer, Emerging Tech — The Mill",
      sub: "",
      quote: "Often assigned tasks with mission-impossible status, Tawfeeq is fearless in his pursuit of solutions. Creative and open-minded about resolving technical challenges, and passionate about new technology.",
    },
    {
      name: "Gaël Seydoux",
      title: "Co-Founder & CEO, Emova",
      sub: "fmr. Technicolor",
      quote: "Tawfeeq brings a technology vision that uplifts the debate and ensures projects are on track and challenged. Strong background in computer graphics, tremendous experience, always seeks excellence.",
    },
    {
      name: "Matthew Rolston",
      title: "Acclaimed Artist, Photographer, Creative Director",
      sub: "",
      quote: "An intuitive grasp of working collaboratively. The VR gallery experience was a great success amongst my colleagues and friends. The hard work — both creative and technical — that went into its creation is what makes the work come alive.",
    },
  ],
};

window.RESUME = RESUME;
