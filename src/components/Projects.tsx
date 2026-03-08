const PROJECTS = [
  {
    name: "mmcp",
    desc: "Multiple Model Context Protocol — orchestrating multi-model AI pipelines",
    tech: ["TypeScript", "MIT"],
    url: "https://github.com/RagavRida/mmcp",
  },
  {
    name: "ex-claw",
    desc: "Open source software engineering agent — autonomous code generation & debugging",
    tech: ["Python"],
    url: "https://github.com/RagavRida/ex-claw",
  },
  {
    name: "research-agent",
    desc: "AI-powered autonomous research agent for academic exploration",
    tech: ["Python"],
    url: "https://github.com/RagavRida/research-agent",
  },
  {
    name: "QAxis",
    desc: "Quantum computing axis — tools for quantum algorithm experimentation",
    tech: ["Python"],
    url: "https://github.com/RagavRida/QAxis",
  },
  {
    name: "hft-radial-cache",
    desc: "High-frequency trading radial cache — ultra-low-latency caching system",
    tech: ["C++", "MIT"],
    url: "https://github.com/RagavRida/hft-radial-cache",
  },
  {
    name: "context-os",
    desc: "Context-aware operating system layer for intelligent app orchestration",
    tech: ["TypeScript"],
    url: "https://github.com/RagavRida/context-os",
  },
  {
    name: "fashion-ai",
    desc: "AI-driven fashion analysis and trend prediction system",
    tech: ["Python"],
    url: "https://github.com/RagavRida/fashion-ai",
  },
  {
    name: "sprak",
    desc: "Spark-inspired data processing tool built with modern TypeScript",
    tech: ["TypeScript"],
    url: "https://github.com/RagavRida/sprak",
  },
];

const Projects = () => (
  <section id="projects" className="py-24">
    <div className="container px-6">
      <div className="reveal mb-16">
        <p className="font-body text-xs uppercase tracking-[0.3em] text-primary mb-4">
          // selected work
        </p>
        <h2 className="font-display font-extrabold text-4xl md:text-5xl">
          PROJ<span className="text-primary">ECTS</span>
        </h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
        {PROJECTS.map((p) => (
          <a
            key={p.name}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group cut-corner bg-surface border border-border p-6 hover:border-primary/50 transition-all duration-300 hoverable block"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-display font-extrabold text-lg text-foreground group-hover:text-primary transition-colors">
                {p.name}
              </h3>
              <span className="font-body text-xs text-muted-foreground group-hover:text-primary transition-colors">
                ↗
              </span>
            </div>
            <p className="font-body text-xs text-muted-foreground mb-6 leading-relaxed">
              {p.desc}
            </p>
            <div className="flex flex-wrap gap-2">
              {p.tech.map((t) => (
                <span
                  key={t}
                  className="font-body text-[10px] uppercase px-2 py-1 bg-background border border-border text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </div>
  </section>
);

export default Projects;
