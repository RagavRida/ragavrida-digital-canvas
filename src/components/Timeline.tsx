import { useEffect, useRef, useState, useCallback } from "react";

const TIMELINE = [
  {
    year: "Present",
    title: "AI Researcher & Open Source Builder",
    desc: "Building multi-model context protocols, software engineering agents, and quantum computing tools. Actively shipping on GitHub.",
  },
  {
    year: "2024–26",
    title: "Jyothishmathi Institute of Technology & Science",
    desc: "Pursuing engineering degree while focusing on AI research, quantum computing, and algorithm development.",
  },
  {
    year: "2024",
    title: "Open Source Journey Begins",
    desc: "Started building and publishing projects — from LeetCode solutions to HFT caching systems and AI-powered fashion analysis tools.",
  },
];

/* ── Year flicker animation ── */
const PRESENT_CYCLE = ["FUTURE", "PAST", "NOW", "PRESENT"];

function useFlickerYear(year: string, trigger: boolean) {
  const [display, setDisplay] = useState("");
  const done = useRef(false);

  useEffect(() => {
    if (!trigger || done.current) return;
    done.current = true;

    if (year === "Present") {
      let idx = 0;
      const iv = setInterval(() => {
        setDisplay(PRESENT_CYCLE[idx]);
        idx++;
        if (idx >= PRESENT_CYCLE.length) {
          clearInterval(iv);
          setDisplay("PRESENT");
        }
      }, 120);
      return () => clearInterval(iv);
    }

    // Numeric year flicker: cycle digits 0-9 then lock
    const target = year.replace("–", "–"); // keep dash
    const chars = target.split("");
    const digitIndices = chars.map((c, i) => (/\d/.test(c) ? i : -1)).filter((i) => i >= 0);
    let tick = 0;
    const maxTicks = 8; // cycles before locking

    const iv = setInterval(() => {
      tick++;
      const arr = [...chars];
      digitIndices.forEach((di) => {
        if (tick < maxTicks) {
          arr[di] = String(Math.floor(Math.random() * 10));
        }
      });
      setDisplay(arr.join(""));
      if (tick >= maxTicks) {
        clearInterval(iv);
        setDisplay(target);
      }
    }, 40);
    return () => clearInterval(iv);
  }, [trigger, year]);

  return display;
}

/* ── Sonar ping on hover ── */
const SonarPings = ({ active }: { active: boolean }) => {
  if (!active) return null;
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[0, 500, 1000].map((delay) => (
        <span
          key={delay}
          className="absolute rounded-sm border-2 border-primary"
          style={{
            width: 12,
            height: 12,
            animation: `sonar-ping 1.5s cubic-bezier(0, 0, 0.2, 1) ${delay}ms infinite`,
          }}
        />
      ))}
    </div>
  );
};

/* ── Shockwave ring ── */
const Shockwave = ({ fire }: { fire: boolean }) => {
  if (!fire) return null;
  return (
    <span
      className="absolute rounded-full pointer-events-none"
      style={{
        width: 0,
        height: 0,
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        border: "2px solid hsl(16 100% 50% / 0.8)",
        animation: "shockwave 400ms ease-out forwards",
      }}
    />
  );
};

/* ── Main component ── */
const Timeline = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [markerPopped, setMarkerPopped] = useState<boolean[]>(Array(TIMELINE.length).fill(false));
  const [cardRevealed, setCardRevealed] = useState<boolean[]>(Array(TIMELINE.length).fill(false));
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const markerRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Observe section entry
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Scroll-synced progress
  const handleScroll = useCallback(() => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const sectionTop = rect.top;
    const sectionHeight = rect.height;
    const viewH = window.innerHeight;
    // progress: 0 when section top hits viewport bottom, 1 when section bottom hits viewport top
    const raw = (viewH - sectionTop) / (sectionHeight + viewH);
    setScrollProgress(Math.max(0, Math.min(1, raw)));
  }, []);

  useEffect(() => {
    if (!inView) return;
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [inView, handleScroll]);

  // Trigger marker pops and card reveals based on scroll progress
  useEffect(() => {
    if (!inView) return;
    const markerThresholds = TIMELINE.map((_, i) => (i + 0.5) / (TIMELINE.length + 0.5) * 0.8 + 0.1);

    markerThresholds.forEach((threshold, i) => {
      if (scrollProgress >= threshold && !markerPopped[i]) {
        setMarkerPopped((prev) => { const n = [...prev]; n[i] = true; return n; });
        setTimeout(() => {
          setCardRevealed((prev) => { const n = [...prev]; n[i] = true; return n; });
        }, 150);
      }
    });
  }, [scrollProgress, inView, markerPopped]);

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden">
      <div className="container px-6">
        <div className="reveal mb-16">
          <p className="font-body text-xs uppercase tracking-[0.3em] text-primary mb-4">
            // journey
          </p>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl">
            THE <span style={{ WebkitTextStroke: "2px hsl(16 100% 50%)", color: "transparent" }}>PATH</span>
          </h2>
        </div>

        <div className="relative">
          {/* Vertical line — draws downward */}
          <div
            ref={lineRef}
            className="absolute left-2 md:left-1/2 top-0 bottom-0 w-px bg-primary/40 origin-top"
            style={{
              transform: `scaleY(${inView ? scrollProgress * 1.2 : 0})`,
              transition: inView ? "transform 100ms linear" : "none",
            }}
          />

          {/* Traveling glowing dot */}
          <div
            ref={dotRef}
            className="absolute left-2 md:left-1/2 w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-primary -translate-x-1/2 z-20 pointer-events-none"
            style={{
              top: `${Math.min(scrollProgress * 120, 100)}%`,
              opacity: inView ? 1 : 0,
              boxShadow: "0 0 20px #E85D26, 0 0 40px #E85D2680",
              transition: "top 100ms linear, opacity 400ms ease",
            }}
          />

          <div className="space-y-16">
            {TIMELINE.map((item, i) => {
              const isLeft = i % 2 === 0;
              return (
                <TimelineEntry
                  key={i}
                  item={item}
                  index={i}
                  isLeft={isLeft}
                  markerPopped={markerPopped[i]}
                  cardRevealed={cardRevealed[i]}
                  hovered={hoveredIdx === i}
                  onHover={() => setHoveredIdx(i)}
                  onLeave={() => setHoveredIdx(null)}
                  markerRef={(el) => { markerRefs.current[i] = el; }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ── Individual entry ── */
interface EntryProps {
  item: typeof TIMELINE[0];
  index: number;
  isLeft: boolean;
  markerPopped: boolean;
  cardRevealed: boolean;
  hovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  markerRef: (el: HTMLDivElement | null) => void;
}

const TimelineEntry = ({
  item, index, isLeft, markerPopped, cardRevealed, hovered, onHover, onLeave, markerRef,
}: EntryProps) => {
  const flickerYear = useFlickerYear(item.year, markerPopped);
  const [shockwave, setShockwave] = useState(false);

  useEffect(() => {
    if (markerPopped) {
      setShockwave(true);
      const t = setTimeout(() => setShockwave(false), 500);
      return () => clearTimeout(t);
    }
  }, [markerPopped]);

  return (
    <div
      className={`relative flex items-start gap-4 md:gap-8 ${
        isLeft ? "md:flex-row" : "md:flex-row-reverse"
      }`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Marker square */}
      <div
        ref={markerRef}
        className="absolute left-2 md:left-1/2 w-2.5 h-2.5 md:w-3 md:h-3 bg-primary -translate-x-1/2 mt-1.5 md:mt-2 z-10"
        style={{
          transform: `translateX(-50%) scale(${markerPopped ? 1 : 0})`,
          transition: markerPopped
            ? "transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1)"
            : "none",
        }}
      >
        <SonarPings active={hovered} />
        <Shockwave fire={shockwave} />
      </div>

      {/* Horizontal connector line */}
      <div
        className="hidden md:block absolute top-[10px] h-px bg-primary"
        style={{
          left: isLeft ? "auto" : "50%",
          right: isLeft ? "50%" : "auto",
          width: "4rem",
          opacity: hovered ? 1 : 0.3,
          transition: "opacity 300ms ease",
        }}
      />

      {/* Content card */}
      <div
        className={`ml-8 md:ml-0 md:w-1/2 ${isLeft ? "md:pr-16 md:text-right" : "md:pl-16"}`}
        style={{
          opacity: cardRevealed ? 1 : 0,
          transform: cardRevealed
            ? "translateX(0)"
            : `translateX(40px)`,
          transition: "opacity 600ms ease-out, transform 600ms ease-out",
        }}
      >
        <span
          className="font-body text-xs text-gold uppercase tracking-widest inline-block"
          style={{
            textShadow: markerPopped && item.year === "Present" ? "0 0 12px #E85D26" : "none",
            transition: "text-shadow 300ms ease",
          }}
        >
          {flickerYear || "\u00A0"}
        </span>
        <h3 className="font-display font-extrabold text-lg mt-2 mb-2">
          {item.title}
        </h3>
        <p className="font-body text-xs text-muted-foreground leading-relaxed">
          {item.desc}
        </p>
      </div>
    </div>
  );
};

export default Timeline;
