// Resume data
const RESUME = {
  name: "Tawfeeq Martin",
  title: "Creative Engineer / Creative Technologist",
  roleLabel: "Creative Engineer / Creative Technologist",
  location: "Los Angeles, CA",
  phone: "+1 310 403 9849",
  email: "tawfeeqmartin@gmail.com",
  site: "tawfeeqmartin.com",
  linkedin: "https://www.linkedin.com/in/tawfeeqmartin",
  summary: "Creative engineer and technical leader with 20+ years turning ambiguous ideas into working systems, award-winning tools, and new production capabilities. Moves across design, engineering, product, and production - finding the strange problem inside the brief, prototyping the missing thing, and bringing teams from first experiment through launch. Work spans ILM StageCraft, immersive and real-time systems, digital humans, AI-native creative tools, local inference, generative workflows, and automation. Drawn to problems that do not have an obvious shape yet, and to building them with people who believe they can be real.",

  intro: [
    "I've spent 20+ years at the intersection of emerging technology and storytelling — at Waterfront Studios, The Mill, ILM StageCraft, and in my own independent work. What draws me to this role is that it describes something I've actually been doing: taking capabilities that don't have a product shape yet and finding one.",
    "Mill Stitch started as an R&D problem with no clear solution. I helped invent the tool, defined its scope, supervised the shoot, and saw it through to awards recognition. The Mill Blackbird was the same — a three-year product development arc that required as much product thinking as engineering. I built a bespoke 360° on-set camera acquisition tool for the MSG Sphere, and shipped agiftoftime.app independently.",
    "I am developing with Claude Code, MCP, and agentic systems daily. I understand what these tools can do at the frontier, and I have a sense for the gap between a research capability and something a person would actually want to use.",
  ],

  experience: [
    {
      role: "Stagecraft Creative Engineering",
      org: "Industrial Light & Magic",
      where: "Full-time",
      period: "Aug 2020 - Present",
      tag: "Current",
      bullets: [
        "R&D and creative engineering for ILM StageCraft and Disney Infinity Stage, supporting real-time virtual production across major feature, episodic, music-video, and live experiential work.",
        "Creative engineer on interactive, performance-driven LED-volume shows, synchronizing real-time visuals through TouchDesigner, MIDI, OSC, DMX lighting, external encoders, and practical FX.",
        "Built real-time digital-human systems, including ILM's KISS digital-avatar show with Pophouse Entertainment, bringing the band to life as performance-captured virtual characters.",
        "Architects, deploys, and maintains real-time rendering, motion capture, in-camera VFX, and core stage infrastructure; translates ambiguous requests into durable capabilities under running-stage constraints.",
        "Partners directly with directors, cinematographers, VFX supervisors, operators, engineers, and business stakeholders to surface user needs, explain tradeoffs, and drive live decisions.",
        "Researches AI-augmented workflows including LLM tools, multi-agent orchestration, local inference, generative systems, and automation prototypes for future production use.",
        "Contributed to a platform recognized by SIGGRAPH, the Television Academy Engineering Emmy, and the NATAS Technology & Engineering Emmy.",
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
        "KISS Digital Avatars",
      ],
    },
    {
      role: "Creative Engineer | Technical Product Manager",
      org: "Sphere Entertainment Co.",
      where: "Contract",
      period: "Jun - Aug 2020",
      bullets: [
        "Owned a bespoke on-set product for early MSG Sphere content-pipeline development, from ambiguous customer brief through shipped operator workflow.",
        "Scoped, designed, and built software for motion-controlled, nodal single-camera passes that aligned into seamless 360-degree compositions.",
        "Integrated camera motion, live preview, acquisition review, take selection, and editorial handoff so teams could evaluate material earlier.",
        "Translated complex capture needs into a simple tool for creative, production, and technical users under live production constraints.",
        "Reduced acquisition ambiguity by helping operators inspect layered passes, validate capture intent, and move selected material downstream.",
      ],
    },
    {
      role: "Head of Creative Engineering, Mill Experience",
      org: "The Mill",
      where: "",
      period: "Oct 2010 - Jun 2020",
      description: "Founding technical and product leader of Mill Experience, partnering with the LA Creative Director and Executive Producer to build a creative technology practice at the intersection of emerging technology, business strategy, engineering, and cinematic storytelling.",
      bullets: [
        "Product management scope - 0-to-1 product strategy; user discovery; product goals and roadmaps; requirements; rapid prototyping and experimentation; cross-functional delivery; GTM; launch; adoption; success measures; lifecycle decisions.",
        "Helped define the practice, technical capability, production approach, and client-facing innovation model behind award-winning immersive, real-time, and experiential work.",
        "Led R&D and product delivery from concept through prototype, production, launch, and reusable workflow adoption.",
        "Built and led cross-functional teams of engineers, artists, producers, vendors, and client stakeholders through ambiguous 0-to-1 innovation work.",
        "Co-inventor of Mill Stitch: identified the 360 live-action production pain point, proved feasibility, built the prototype and pipeline, and shipped it into live production; recognized with Cannes Gold and SXSW Gold.",
        "Co-inventor of The Mill BLACKBIRD: helped lead multi-year R&D across hardware, software, capture, and post workflows for an adjustable motion-capture car rig; recognized with Cannes Gold and HPA Gold.",
        "Technical Innovations Manager on HELP, directed by Justin Lin with Google ATAP, Spotlight Stories, and Bullitt Branded; supported a first-of-its-kind Hollywood-scale 360 film.",
        "Converted one-off innovation projects into reusable products, workflows, pipeline patterns, and stakeholder playbooks.",
        "Technical Innovations Manager on Cashmere Cat's For Your Eyes Only and Emotions, directed by Jake Schreier and choreographed and performed by Margaret Qualley; supported a first-of-its-kind real-time Unreal Engine music-video series.",
        "Creative Engineer on REEPS ONE: Does Not Exist, an early 360 immersive music video.",
        "Technical Innovations Manager on the Louis Vuitton Women's Spring-Summer 2020 Show video It's Okay To Cry, directed by SOPHIE and Nicholas Harwood, with Es Devlin's monumental LED set at the Louvre.",
        "Technicolor Fellowship and Experience Center Committee.",
      ],
    },
    {
      role: "Head of Engineering",
      org: "Waterfront Film Studios",
      where: "",
      period: "Jan 2002 - Sep 2010",
      bullets: [
        "Managed technology and systems services across multiple offices serving local and international entertainment markets; led engineering operations, infrastructure, pipeline development, software and hardware prototyping, client and vendor relationships, and cross-functional technical teams.",
      ],
    },
    {
      role: "Head of Engineering",
      org: "Condor Digital",
      where: "",
      period: "2008 - 2009",
      bullets: [
        "Led engineering operations for a full-service post-production and content studio in Cape Town while continuing the broader Waterfront Film Studios remit.",
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
    { org: "Webby Awards", title: "Honoree · Augmented Reality · Advertising, Media & PR", project: "Oreo · Trolls World Tour AR Experience", role: "TIM & Creative Technologist", tier: "honor" },
    { org: "Technicolor", title: "Outstanding Technology Contribution", project: "Engineering Awards", role: "TIM & Product Development", tier: "honor" },
    { org: "SIGGRAPH", title: "Recognition · Virtual Production Methodology & Tooling", project: "ILM StageCraft", role: "Senior Virtual Production Engineer", tier: "honor" },
    { org: "AICP", title: "Recognition · Production Technology", project: "The Mill", role: "Technical Innovations Manager", tier: "honor" },
  ],

  skills: [
    { group: "Creative Engineering Leadership", items: ["0-to-1 creative technology strategy and execution", "Creative ambition translated into clear technical possibilities and tradeoffs", "Rapid prototypes that help Design, Engineering, Product, and Production converge", "Hands-on feasibility, model capability, and cost/quality decisions", "Cross-functional teams aligned around meaningful user and audience outcomes", "Ideas carried from strange first question through launch, adoption, and iteration"] },
    { group: "AI / Generative Systems", items: ["LLM tooling", "Prompt and model testing", "Multi-agent orchestration", "Local inference", "ComfyUI workflows", "Custom nodes", "LoRA training", "Diffusion and video workflows", "Automation prototypes"] },
    { group: "Signature Products", items: ["Mill Stitch", "The Mill BLACKBIRD", "HELP pipeline tooling", "MSG Sphere on-set preview and selects"] },
    { group: "Frontend / Visualization", items: ["JavaScript", "React familiarity", "Node", "WebGL / GLSL", "Three.js", "Web Audio", "Python", "C++", "bash"] },
    { group: "Design × Make × Believe", items: ["Design - find the strange problem inside the brief and frame what matters", "Make - prototype the missing thing early enough to see, feel, test, and improve it", "Believe - turn possibility into a shared plan that people can build together"] },
    { group: "Product / UX Delivery", items: ["0-to-1 scope", "Roadmap and feature triage", "User and stakeholder translation", "Research leadership", "Prototyping", "Launch and adoption"] },
    { group: "Production Systems", items: ["ILM StageCraft", "ICVFX", "LED-volume stages", "Unreal Engine", "Real-time rendering", "Motion capture", "360-degree capture and review"] },
    { group: "Network", items: ["Long-standing relationships across Google ATAP, Disney and ILM, Amazon AGI and AWS, Sphere, Technicolor, studios, brands, artists, founders, builders, and frontier-technology leaders"] },
  ],

  education: [
    { school: "Boise State University", degree: "B.S. Electrical & Computer Systems Engineering" },
    { school: "University of Stellenbosch", degree: "Business Administration / Management" },
  ],

  references: [
    {
      name: "Usman Shakeel",
      avatar: "media/imessage/generated/usman-avatar-v4.png",
      title: "Director of Engineering, Amazon AGI Infrastructure",
      sub: "Former Worldwide Technology Leader, M&E, AWS",
      quote: "Tawfeeq is very technology savvy and one of the smartest guys I have worked with. He is very well spoken and trust worthy. It is always a treat to discuss the latest tech with him and I learn a thing or two around his subject matter during our meetings.",
    },
    {
      name: "Regina Dugan",
      avatar: "media/imessage/generated/regina-avatar-v4.png",
      title: "CEO, Wellcome Leap",
      sub: "Former VP Building 8, Facebook (Meta); VP Engineering, Google ATAP; Director, DARPA",
      quote: "Tawfeeq is an exceptional architect of new technologies for storytelling. I met Tawfeeq when he worked as a representative of the Mill alongside the team at Google ATAP and Justin Lin to help create the first cinematic, immersive film made uniquely for mobile. Tawfeeq led the technology team responsible for building the only Hollywood-scale film pipeline and custom tool set including Mill Stitch. These award-winning tools enabled director Justin Lin to view the 360-degree action of ‘HELP’ as it was shot, in real-time, as the images fed through a series of cameras suspended over the LA river basin. ‘HELP’ went on to be recognized for awards that included: Cannes Gold Lion for Innovative use of technology, Cannes Gold Lion for best in virtual reality, the WEBBY award for technical achievement in VR, and the SXSW AR/VR breakthrough innovation award.",
    },
    {
      name: "Daniell Phillips",
      avatar: "media/imessage/generated/dan-avatar-v4.png",
      title: "Director, Brand Partnerships, Residence",
      sub: "Former colleague, The Mill",
      quote: "Tawfeeq is a pleasure to work alongside, and brings a real depth of technical and creative knowledge to a broad range of content, film-making and experiential production processes. We have worked together to deliver a really expansive set of client and internal R&D projects, ranging from virtual production to real-time character executions and augmented reality applications, through to VFX and CG pipeline plug-ins. Tawfeeq always brought rigour alongside a real problem-solving approach, with vast technical knowhow. An asset to any team.",
    },
  ],
};

window.RESUME = RESUME;
