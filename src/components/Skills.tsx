import { useEffect, useRef, useState } from "react";

const SKILL_GROUPS = [
  {
    category: "Languages",
    skills: ["Python", "TypeScript", "Java", "C++", "CSS", "SQL"],
    cycle: ["SQL", "Java", "CSS", "C++", "TypeScript", "Python"],
  },
  {
    category: "AI & Data",
    skills: ["Machine Learning", "Quantum Computing", "LLMs", "Data Science", "Jupyter Notebooks", "Research Agents"],
    cycle: ["Data Science", "LLMs", "Jupyter Notebooks", "Quantum Computing", "Research Agents", "Machine Learning"],
  },
  {
    category: "Frameworks & Tools",
    skills: ["React", "MCP Protocol", "Git & GitHub", "Software Agents", "Algorithm Design", "Open Source"],
    cycle: ["Open Source", "Git & GitHub", "Algorithm Design", "Software Agents", "React", "MCP Protocol"],
  },
];

const CYCLE_MS = 80;
const STAGGER_MS = 120;

function springScale(t: number): number {
  const stiffness = 200;
  const damping = 12;
  const omega = Math.sqrt(stiffness);
  const zeta = damping / (2 * omega);
  if (zeta < 1) {
    const omegaD = omega * Math.sqrt(1 - zeta * zeta);
    return 1 - Math.exp(-zeta * omega * t) * (Math.cos(omegaD * t) + (zeta * omega / omegaD) * Math.sin(omegaD * t));
  }
  return 1 - (1 + omega * t) * Math.exp(-omega * t);
}

const SlotChip = ({
  realSkill,
  cyclePool,
  lockDelay,
  triggered,
}: {
  realSkill: string;
  cyclePool: string[];
  lockDelay: number;
  triggered: boolean;
}) => {
  const [display, setDisplay] = useState(realSkill);
  const [locked, setLocked] = useState(false);
  const [flash, setFlash] = useState(false);
  const [scale, setScale] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cycleIdx = useRef(0);

  useEffect(() => {
    if (!triggered) return;

    // Start cycling through the pool
    intervalRef.current = setInterval(() => {
      setDisplay(cyclePool[cycleIdx.current % cyclePool.length]);
      cycleIdx.current++;
    }, CYCLE_MS);

    const lockTimer = setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setDisplay(realSkill);
      setLocked(true);
      setFlash(true);

      // Spring scale animation
      const start = performance.now();
      const duration = 400;
      const animateSpring = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        const s = springScale(t * 2.5); // compress time for snappy feel
        setScale(1 + (0.08) * (1 - s));
        if (t < 1) requestAnimationFrame(animateSpring);
        else setScale(1);
      };
      requestAnimationFrame(animateSpring);

      setTimeout(() => setFlash(false), 200);
    }, lockDelay);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      clearTimeout(lockTimer);
    };
  }, [triggered, realSkill, lockDelay, cyclePool]);

  return (
    <span
      className="skill-chip font-body text-xs px-4 py-2 border bg-background text-foreground hoverable inline-block"
      style={{
        minWidth: "90px",
        textAlign: "center",
        transform: `scale(${scale})`,
        borderColor: flash ? "#E85D26" : undefined,
        boxShadow: flash ? "0 0 14px rgba(232,93,38,0.6), 0 0 28px rgba(232,93,38,0.2)" : undefined,
        transition: locked && !flash ? "border-color 200ms, box-shadow 200ms" : undefined,
      }}
    >
      {display}
    </span>
  );
};

const Skills = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [triggered, setTriggered] = useState(false);
  const [lockedGroups, setLockedGroups] = useState<boolean[]>([false, false, false]);
  const hasPlayed = useRef(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasPlayed.current) {
            hasPlayed.current = true;
            setTriggered(true);

            // Mark groups as locked after their last tag locks
            SKILL_GROUPS.forEach((group, gi) => {
              const lastTagDelay = (group.skills.length - 1) * STAGGER_MS;
              // Base offset per group: all tags in previous groups
              let baseOffset = 0;
              for (let i = 0; i < gi; i++) baseOffset += SKILL_GROUPS[i].skills.length * STAGGER_MS;
              const totalDelay = baseOffset + lastTagDelay + 250;

              setTimeout(() => {
                setLockedGroups((prev) => {
                  const next = [...prev];
                  next[gi] = true;
                  return next;
                });
              }, totalDelay);
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Compute global tag index offset for stagger
  let globalTagIdx = 0;

  return (
    <section id="skills" ref={sectionRef} className="py-24 bg-surface">
      <div className="container px-6">
        <div className="reveal mb-16">
          <p className="font-body text-xs uppercase tracking-[0.3em] text-primary mb-4">
            // capabilities
          </p>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl">
            SKILL{" "}
            <span style={{ WebkitTextStroke: "2px hsl(40 70% 60%)", color: "transparent" }}>
              SET
            </span>
          </h2>
        </div>
        <div className="space-y-12">
          {SKILL_GROUPS.map((group, groupIdx) => {
            const groupStartIdx = globalTagIdx;
            globalTagIdx += group.skills.length;

            return (
              <div key={group.category} className="reveal">
                <h3
                  className="font-display font-bold text-sm uppercase mb-4 text-gold"
                  style={{
                    letterSpacing: lockedGroups[groupIdx] ? "6px" : "normal",
                    transition: "letter-spacing 400ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                    transformOrigin: "left center",
                  }}
                >
                  {group.category}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {group.skills.map((skill, skillIdx) => (
                    <SlotChip
                      key={skill}
                      realSkill={skill}
                      cyclePool={group.cycle}
                      lockDelay={(groupStartIdx + skillIdx) * STAGGER_MS + 300}
                      triggered={triggered}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;
