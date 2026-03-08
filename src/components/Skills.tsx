import { useEffect, useRef, useState, useCallback } from "react";

const SKILL_GROUPS = [
  {
    category: "Languages",
    skills: ["Python", "TypeScript", "Java", "C++", "CSS", "SQL"],
  },
  {
    category: "AI & Data",
    skills: ["Machine Learning", "Quantum Computing", "LLMs", "Data Science", "Jupyter Notebooks", "Research Agents"],
  },
  {
    category: "Frameworks & Tools",
    skills: ["React", "MCP Protocol", "Git & GitHub", "Software Agents", "Algorithm Design", "Open Source"],
  },
];

const FAKE_SKILLS = [
  "Bootstrap", "COBOL", "Pascal", "Fortran", "Assembly", "Perl",
  "Haskell", "Erlang", "Prolog", "Lisp", "Smalltalk", "Ada",
  "Delphi", "BASIC", "Logo", "Scheme", "OCaml", "Elm",
  "CoffeeScript", "ActionScript", "Flash", "jQuery", "Backbone",
  "Grunt", "Bower", "Knockout", "Silverlight", "XSLT",
];

const CYCLE_INTERVAL = 80;
const LOCK_TIMES = [800, 1100, 1400]; // per column/group

const SlotChip = ({
  realSkill,
  lockDelay,
  triggered,
}: {
  realSkill: string;
  lockDelay: number;
  triggered: boolean;
}) => {
  const [display, setDisplay] = useState(realSkill);
  const [locked, setLocked] = useState(false);
  const [flash, setFlash] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!triggered) {
      setDisplay(realSkill);
      setLocked(false);
      setFlash(false);
      return;
    }

    // Start cycling
    intervalRef.current = setInterval(() => {
      setDisplay(FAKE_SKILLS[Math.floor(Math.random() * FAKE_SKILLS.length)]);
    }, CYCLE_INTERVAL);

    // Lock in after delay
    const lockTimer = setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setDisplay(realSkill);
      setLocked(true);
      setFlash(true);
      setTimeout(() => setFlash(false), 300);
    }, lockDelay);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      clearTimeout(lockTimer);
    };
  }, [triggered, realSkill, lockDelay]);

  return (
    <span
      className={`skill-chip font-body text-xs px-4 py-2 border bg-background text-foreground hoverable inline-block transition-all duration-200 ${
        flash
          ? "border-gold shadow-[0_0_16px_hsl(40_70%_60%/0.7),0_0_32px_hsl(40_70%_60%/0.3)] scale-110"
          : locked
          ? "border-border"
          : "border-primary/40"
      }`}
      style={{
        minWidth: "90px",
        textAlign: "center",
        ...(flash ? { color: "hsl(40 70% 60%)" } : {}),
      }}
    >
      {display}
    </span>
  );
};

const Skills = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [triggered, setTriggered] = useState(false);
  const [jackpot, setJackpot] = useState<number | null>(null);
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

            // Jackpot flash per group after their column locks
            LOCK_TIMES.forEach((t, i) => {
              setTimeout(() => {
                setJackpot(i);
                setTimeout(() => setJackpot(null), 400);
              }, t + 200);
            });
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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
          {SKILL_GROUPS.map((group, groupIdx) => (
            <div key={group.category} className="reveal">
              <h3
                className={`font-display font-bold text-sm uppercase tracking-widest mb-4 transition-all duration-300 ${
                  jackpot === groupIdx
                    ? "text-gold scale-105 drop-shadow-[0_0_12px_hsl(40_70%_60%/0.8)]"
                    : "text-gold"
                }`}
                style={{
                  transformOrigin: "left center",
                  ...(jackpot === groupIdx
                    ? { textShadow: "0 0 20px hsl(40 70% 60% / 0.9), 0 0 40px hsl(40 70% 60% / 0.4)" }
                    : {}),
                }}
              >
                {jackpot === groupIdx ? "🎰 " : ""}
                {group.category}
                {jackpot === groupIdx ? " 🎰" : ""}
              </h3>
              <div className="flex flex-wrap gap-3">
                {group.skills.map((skill) => (
                  <SlotChip
                    key={skill}
                    realSkill={skill}
                    lockDelay={LOCK_TIMES[groupIdx]}
                    triggered={triggered}
                  />
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
