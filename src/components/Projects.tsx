import { useRef, useEffect, useState, useCallback } from "react";
import { OrganismRenderer } from "./organisms/types";
import { synapseNetwork } from "./organisms/synapseNetwork";
import { roboticClaw } from "./organisms/roboticClaw";
import { particleSwarm } from "./organisms/particleSwarm";
import { blochSphere } from "./organisms/blochSphere";
import { oscilloscope } from "./organisms/oscilloscope";
import { fractalTree } from "./organisms/fractalTree";
import { fabricSim } from "./organisms/fabricSim";
import { sparkGenerator } from "./organisms/sparkGenerator";

const PROJECTS: {
  name: string;
  desc: string;
  tech: string[];
  url: string;
  organism: OrganismRenderer;
}[] = [
  {
    name: "mmcp",
    desc: "Multiple Model Context Protocol — orchestrating multi-model AI pipelines",
    tech: ["TypeScript", "MIT"],
    url: "https://github.com/RagavRida/mmcp",
    organism: synapseNetwork,
  },
  {
    name: "ex-claw",
    desc: "Open source software engineering agent — autonomous code generation & debugging",
    tech: ["Python"],
    url: "https://github.com/RagavRida/ex-claw",
    organism: roboticClaw,
  },
  {
    name: "research-agent",
    desc: "AI-powered autonomous research agent for academic exploration",
    tech: ["Python"],
    url: "https://github.com/RagavRida/research-agent",
    organism: particleSwarm,
  },
  {
    name: "QAxis",
    desc: "Quantum computing axis — tools for quantum algorithm experimentation",
    tech: ["Python"],
    url: "https://github.com/RagavRida/QAxis",
    organism: blochSphere,
  },
  {
    name: "hft-radial-cache",
    desc: "High-frequency trading radial cache — ultra-low-latency caching system",
    tech: ["C++", "MIT"],
    url: "https://github.com/RagavRida/hft-radial-cache",
    organism: oscilloscope,
  },
  {
    name: "context-os",
    desc: "Context-aware operating system layer for intelligent app orchestration",
    tech: ["TypeScript"],
    url: "https://github.com/RagavRida/context-os",
    organism: fractalTree,
  },
  {
    name: "fashion-ai",
    desc: "AI-driven fashion analysis and trend prediction system",
    tech: ["Python"],
    url: "https://github.com/RagavRida/fashion-ai",
    organism: fabricSim,
  },
  {
    name: "sprak",
    desc: "Spark-inspired data processing tool built with modern TypeScript",
    tech: ["TypeScript"],
    url: "https://github.com/RagavRida/sprak",
    organism: sparkGenerator,
  },
];

// Global hover state for cross-card speed control
let hoveredIndex: number | null = null;

const SpecimenCard = ({
  project,
  index,
  sectionVisible,
}: {
  project: (typeof PROJECTS)[0];
  index: number;
  sectionVisible: boolean;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const frameCount = useRef(0);
  const initialized = useRef(false);
  const awakening = useRef(0);
  const [isHovered, setIsHovered] = useState(false);
  const [specimenLabel, setSpecimenLabel] = useState("");
  const labelTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const FULL_LABEL = "// ORGANISM ACTIVE";

  // Typing label effect
  useEffect(() => {
    if (labelTimerRef.current) {
      clearInterval(labelTimerRef.current);
      labelTimerRef.current = null;
    }

    if (isHovered) {
      let i = 0;
      labelTimerRef.current = setInterval(() => {
        i++;
        setSpecimenLabel(FULL_LABEL.slice(0, i));
        if (i >= FULL_LABEL.length && labelTimerRef.current) {
          clearInterval(labelTimerRef.current);
          labelTimerRef.current = null;
        }
      }, 30);
    } else {
      // type backward
      setSpecimenLabel((prev) => {
        if (!prev) return "";
        let len = prev.length;
        labelTimerRef.current = setInterval(() => {
          len--;
          if (len <= 0) {
            setSpecimenLabel("");
            if (labelTimerRef.current) clearInterval(labelTimerRef.current);
            labelTimerRef.current = null;
          } else {
            setSpecimenLabel(FULL_LABEL.slice(0, len));
          }
        }, 20);
        return prev;
      });
    }

    return () => {
      if (labelTimerRef.current) clearInterval(labelTimerRef.current);
    };
  }, [isHovered]);

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        canvas.style.width = rect.width + "px";
        canvas.style.height = rect.height + "px";
        if (!initialized.current) {
          project.organism.init(ctx, rect.width, rect.height);
          initialized.current = true;
        }
      }
    };
    resize();

    const loop = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) { animRef.current = requestAnimationFrame(loop); return; }

      const w = rect.width;
      const h = rect.height;

      if (!initialized.current) {
        project.organism.init(ctx, w, h);
        initialized.current = true;
      }

      // awakening ramp (0→1 over 2s ≈ 120 frames)
      if (sectionVisible && awakening.current < 1) {
        awakening.current = Math.min(1, awakening.current + 0.008);
      }

      // speed calculation
      let speed = 1;
      if (hoveredIndex !== null) {
        speed = hoveredIndex === index ? 2 : 0.2;
      }
      speed *= awakening.current;

      frameCount.current++;
      ctx.save();
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
      project.organism.draw(ctx, w, h, frameCount.current, speed);
      ctx.restore();

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [project, index, sectionVisible]);

  const handleMouseEnter = useCallback(() => {
    hoveredIndex = index;
    setIsHovered(true);
  }, [index]);

  const handleMouseLeave = useCallback(() => {
    hoveredIndex = null;
    setIsHovered(false);
  }, []);

  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative block overflow-hidden hoverable"
      style={{
        background: "#050505",
        border: isHovered
          ? "1px solid rgba(255,255,255,0.3)"
          : "1px solid rgba(255,255,255,0.06)",
        transition: "border-color 0.4s ease",
      }}
    >
      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Canvas organism */}
      <div className="absolute inset-0">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      {/* Glass overlay */}
      <div
        className="relative z-[2] p-6 flex flex-col justify-between"
        style={{
          minHeight: "220px",
          backdropFilter: isHovered ? "blur(3px)" : "blur(0px)",
          transition: "backdrop-filter 0.4s ease",
        }}
      >
        <div>
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
        </div>

        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            {project.tech.map((t) => (
              <span
                key={t}
                className="font-body text-[10px] uppercase px-2 py-1 border text-muted-foreground"
                style={{
                  background: "rgba(5,5,5,0.6)",
                  borderColor: "rgba(255,255,255,0.08)",
                }}
              >
                {t}
              </span>
            ))}
          </div>

          {/* Specimen label */}
          <div className="h-4">
            {specimenLabel && (
              <span
                className="font-body text-primary"
                style={{ fontSize: "8px", letterSpacing: "0.1em" }}
              >
                {specimenLabel}
                <span className="terminal-cursor">▌</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </a>
  );
};

// Background grid dots
const DotGrid = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const offset = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth * window.devicePixelRatio;
      canvas.height = parent.clientHeight * window.devicePixelRatio;
      canvas.style.width = parent.clientWidth + "px";
      canvas.style.height = parent.clientHeight + "px";
    };
    resize();
    window.addEventListener("resize", resize);

    const loop = () => {
      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
      ctx.clearRect(0, 0, w, h);

      offset.current += 0.1;
      if (offset.current >= 24) offset.current = 0;

      ctx.fillStyle = "rgba(255,255,255,0.04)";
      for (let x = 0; x < w; x += 24) {
        for (let y = -24 + (offset.current % 24); y < h + 24; y += 24) {
          ctx.beginPath();
          ctx.arc(x, y, 0.75, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
    />
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
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      <DotGrid />
      <div className="container px-6 relative z-10">
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
              style={{
                opacity: visible ? 1 : 0,
                transform: visible
                  ? "translateY(0) rotate(0deg)"
                  : `translateY(-20px) rotate(${(i % 2 === 0 ? -1 : 1) * (0.5 + Math.random() * 0.5)}deg)`,
                transition: `opacity 0.6s ease-out ${i * 100}ms, transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 100}ms`,
              }}
            >
              <SpecimenCard
                project={p}
                index={i}
                sectionVisible={visible}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
