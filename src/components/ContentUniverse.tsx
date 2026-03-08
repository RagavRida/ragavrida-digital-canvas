const PLATFORMS = [
  {
    name: "GitHub",
    handle: "@RagavRida",
    tagline: "14 repos · Python, TypeScript, Java, C++",
    url: "https://github.com/RagavRida",
  },
  {
    name: "LinkedIn",
    handle: "Raghavendra Manchikatla",
    tagline: "AI Researcher · 395+ connections",
    url: "https://www.linkedin.com/in/raghavendra-manchikatla-79b12624b/",
  },
  {
    name: "X / Twitter",
    handle: "@RagavRida",
    tagline: "Thoughts on AI, tech & building in public",
    url: "https://x.com/RagavRida",
  },
  {
    name: "Instagram",
    handle: "@ragavrida_09",
    tagline: "Behind the scenes · Creator life",
    url: "https://www.instagram.com/ragavrida_09/",
  },
];

const ContentUniverse = () => (
  <section className="py-24 bg-surface">
    <div className="container px-6">
      <div className="reveal mb-16">
        <p className="font-body text-xs uppercase tracking-[0.3em] text-primary mb-4">
          // content universe
        </p>
        <h2 className="font-display font-extrabold text-4xl md:text-5xl">
          FIND ME <span className="text-gold">EVERYWHERE</span>
        </h2>
      </div>
      <div className="grid sm:grid-cols-2 gap-4 stagger">
        {PLATFORMS.map((p) => (
          <a
            key={p.name}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group border border-border p-6 bg-background hover:border-primary/50 transition-all duration-300 hoverable block"
          >
            <h3 className="font-display font-extrabold text-xl mb-1 group-hover:text-primary transition-colors">
              {p.name}
            </h3>
            <p className="font-body text-xs text-gold mb-2">{p.handle}</p>
            <p className="font-body text-xs text-muted-foreground">{p.tagline}</p>
          </a>
        ))}
      </div>
    </div>
  </section>
);

export default ContentUniverse;
