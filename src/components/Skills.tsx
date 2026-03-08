import { useEffect, useRef, useState, useCallback } from "react";

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

const CYCLE_INTERVAL = 80;
const LOCK_STAGGER = 120;

function springInterpolate(t: number, stiffness: number, damping: number): number {
  const omega = Math.sqrt(stiffness);
  const zeta = damping / (2 * omega);
  if (zeta < 1) {
    const wd = omega * Math.sqrt(1 - zeta * zeta);
    return 1 - Math.exp(-zeta * omega * t) * (Math.cos(wd * t) + (zeta * omega / wd) * Math.sin(wd * t));
  }
  return 1 - (1 + omega * t) * Math.exp(-omega * t);
}

const Skills = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const [animState, setAnimState] = useState<"idle" | "cycling" | "done">("idle");
  // For each group, track which tags are locked and current displayed text
  const [groups, setGroups] = useState(
    SKILL_GROUPS.map((g) => ({
      displays: g.skills.map(() => g.cycle[0]), // start showing first cycle value
      locked: g.skills.map(() => false),
      flashing: g.skills.map(() => false),
      scales: g.skills.map(() => 1),
      headerSpacing: false,
    }))
  );

  const startAnimation = useCallback(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;
    setAnimState("cycling");

    // For each group, each tag cycles through the cycle array, then locks left-to-right
    SKILL_GROUPS.forEach((group, gi) => {
      const totalTags = group.skills.length;
      const cycleLen = group.cycle.length;

      group.skills.forEach((_, ti) => {
        // Each tag starts cycling immediately, locks after a stagger
        const lockTime = ti * LOCK_STAGGER;
        // Total cycles before lock: fill time with 80ms swaps
        const totalCycleSwaps = Math.floor(lockTime / CYCLE_INTERVAL) + cycleLen;

        let swapCount = 0;
        const interval = setInterval(() => {
          swapCount++;
          const cycleIndex = swapCount % cycleLen;
          setGroups((prev) => {
            const next = [...prev];
            const g = { ...next[gi] };
            g.displays = [...g.displays];
            g.displays[ti] = group.cycle[cycleIndex];
            next[gi] = g;
            return next;
          });

          if (swapCount >= totalCycleSwaps) {
            clearInterval(interval);
            // Lock to real value
            setGroups((prev) => {
              const next = [...prev];
              const g = { ...next[gi] };
              g.displays = [...g.displays];
              g.locked = [...g.locked];
              g.flashing = [...g.flashing];
              g.displays[ti] = group.skills[ti];
              g.locked[ti] = true;
              g.flashing[ti] = true;
              next[gi] = g;
              return next;
            });

            // Spring scale animation
            const springStart = performance.now();
            const springDuration = 600;
            const springFrame = () => {
              const elapsed = (performance.now() - springStart) / 1000;
              const progress = springInterpolate(elapsed, 200, 12);
              // Scale: overshoot to 1.08 then settle to 1.0
              const scale = 1 + 0.08 * (1 - progress);
              setGroups((prev) => {
                const next = [...prev];
                const g = { ...next[gi] };
                g.scales = [...g.scales];
                g.scales[ti] = scale;
                next[gi] = g;
                return next;
              });
              if (elapsed * 1000 < springDuration) {
                requestAnimationFrame(springFrame);
              } else {
                setGroups((prev) => {
                  const next = [...prev];
                  const g = { ...next[gi] };
                  g.scales = [...g.scales];
                  g.scales[ti] = 1;
                  next[gi] = g;
                  return next;
                });
              }
            };
            requestAnimationFrame(springFrame);

            // Remove flash after 200ms
            setTimeout(() => {
              setGroups((prev) => {
                const next = [...prev];
                const g = { ...next[gi] };
                g.flashing = [...g.flashing];
                g.flashing[ti] = false;
                next[gi] = g;
                return next;
              });
            }, 200);

            // If last tag in group, expand header letter-spacing
            if (ti === totalTags - 1) {
              setGroups((prev) => {
                const next = [...prev];
                const g = { ...next[gi] };
                g.headerSpacing = true;
                next[gi] = g;
                return next;
              });
            }
          }
        }, CYCLE_INTERVAL);
      });
    });
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          startAnimation();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [startAnimation]);

  return (
    <section id="skills" className="py-24 bg-surface" ref={sectionRef}>
      <div className="container px-6">
        <div className="reveal mb-16">
          <p className="font-body text-xs uppercase tracking-[0.3em] text-primary mb-4">
            // capabilities
          </p>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl">
            SKILL <span style={{ WebkitTextStroke: "2px hsl(40 70% 60%)", color: "transparent" }}>SET</span>
          </h2>
        </div>
        <div className="space-y-12">
          {SKILL_GROUPS.map((group, gi) => (
            <div key={group.category} className="reveal">
              <h3
                className="font-display font-bold text-sm uppercase text-gold mb-4"
                style={{
                  letterSpacing: groups[gi].headerSpacing ? "6px" : "normal",
                  transition: "letter-spacing 400ms cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-3 stagger">
                {group.skills.map((skill, ti) => (
                  <span
                    key={skill}
                    className="skill-chip font-body text-xs px-4 py-2 border bg-background text-foreground hoverable"
                    style={{
                      borderColor: groups[gi].flashing[ti]
                        ? "hsl(var(--primary))"
                        : "hsl(var(--border))",
                      transform: `scale(${groups[gi].scales[ti]})`,
                      boxShadow: groups[gi].flashing[ti]
                        ? "0 0 12px hsl(var(--primary) / 0.4)"
                        : "none",
                      transition: groups[gi].locked[ti]
                        ? "border-color 200ms ease, box-shadow 200ms ease"
                        : "none",
                      minWidth: "80px",
                      textAlign: "center" as const,
                    }}
                  >
                    {animState === "idle" ? skill : groups[gi].displays[ti]}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
