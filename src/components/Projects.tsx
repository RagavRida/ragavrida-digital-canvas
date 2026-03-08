import { useRef, useEffect, useState, useCallback } from "react";

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

const TiltCard = ({ project, index }: { project: typeof PROJECTS[0]; index: number }) => {
  const cardRef = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)";
  }, []);

  return (
    <a
      ref={cardRef}
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group cut-corner bg-surface border border-border p-6 hover:border-primary/50 transition-colors duration-300 hoverable block will-change-transform"
      style={{
        transition: "transform 0.15s ease-out, border-color 0.3s ease",
        animationDelay: `${index * 80}ms`,
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-display font-extrabold text-lg text-foreground group-hover:text-primary transition-colors">
          {project.name}
        </h3>
        <span className="font-body text-xs text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5 inline-block duration-300">
          ↗
        </span>
      </div>
      <p className="font-body text-xs text-muted-foreground mb-6 leading-relaxed">
        {project.desc}
      </p>
      <div className="flex flex-wrap gap-2">
        {project.tech.map((t) => (
          <span
            key={t}
            className="font-body text-[10px] uppercase px-2 py-1 bg-background border border-border text-muted-foreground"
          >
            {t}
          </span>
        ))}
      </div>
    </a>
  );
};

const Projects = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
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
        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROJECTS.map((p, i) => (
            <div
              key={p.name}
              className="transition-all duration-700 ease-out"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(30px)",
                transitionDelay: `${i * 80}ms`,
              }}
            >
              <TiltCard project={p} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
