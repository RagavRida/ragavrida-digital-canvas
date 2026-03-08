import { useState, useEffect, useRef, useCallback } from "react";

const HEADING_TEXT = "LET'S BUILD SOMETHING GREAT.";
const CYCLE_MS = 8000;
const FLY_OUT_MS = 1200;
const SETTLE_MS = 200; // extra wait after fly out
const LINE_DRAW_MS = 800;
const HOLD_MS = 1500;
const LINE_ERASE_MS = 400;
const FLY_BACK_MS = 1000;

// Spring physics sim for fly-back
function springInterpolate(t: number, stiffness = 120, damping = 14): number {
  const omega = Math.sqrt(stiffness);
  const zeta = damping / (2 * omega);
  if (zeta < 1) {
    const omegaD = omega * Math.sqrt(1 - zeta * zeta);
    return 1 - Math.exp(-zeta * omega * t) * (Math.cos(omegaD * t) + (zeta * omega / omegaD) * Math.sin(omegaD * t));
  }
  return 1 - (1 + omega * t) * Math.exp(-omega * t);
}

interface StarPos {
  x: number;
  y: number;
}

const ConstellationHeading = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);
  const phaseRef = useRef<"idle" | "flyout" | "lines" | "hold" | "erase" | "flyback">("idle");
  const rafRef = useRef(0);
  const starPositions = useRef<StarPos[]>([]);
  const homePositions = useRef<{ x: number; y: number }[]>([]);

  const letters = HEADING_TEXT.split("");

  const generateStarPositions = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const w = rect.width * 0.8;
    const h = Math.max(rect.height, 200) * 2;
    const offsetX = rect.width * 0.1;
    const offsetY = -h * 0.15;

    starPositions.current = letters.map(() => ({
      x: offsetX + Math.random() * w,
      y: offsetY + Math.random() * h,
    }));
  }, [letters.length]);

  const captureHomePositions = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    homePositions.current = lettersRef.current.map((el) => {
      if (!el) return { x: 0, y: 0 };
      const r = el.getBoundingClientRect();
      return {
        x: r.left - containerRect.left + r.width / 2,
        y: r.top - containerRect.top + r.height / 2,
      };
    });
  }, []);

  const resetLetters = useCallback(() => {
    lettersRef.current.forEach((el) => {
      if (!el) return;
      el.style.transform = "";
      el.style.opacity = "1";
      el.style.fontSize = "";
      el.style.width = "";
      el.style.height = "";
      el.style.boxShadow = "";
      el.style.borderRadius = "";
      el.style.background = "";
      el.style.color = "";
      el.style.position = "";
      el.style.left = "";
      el.style.top = "";
      el.style.display = "";
    });
  }, []);

  const drawLines = useCallback((progress: number) => {
    const svg = svgRef.current;
    if (!svg) return;
    const stars = starPositions.current;
    // Build lines between adjacent stars
    let html = "";
    for (let i = 0; i < stars.length - 1; i++) {
      if (letters[i] === " " || letters[i + 1] === " ") continue;
      const a = stars[i];
      const b = stars[i + 1];
      const len = Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
      const dashOffset = len * (1 - progress);
      html += `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" 
        stroke="hsl(16 100% 50% / 0.6)" stroke-width="1" 
        stroke-dasharray="${len}" stroke-dashoffset="${dashOffset}" />`;
    }
    svg.innerHTML = html;
  }, [letters]);

  const clearLines = useCallback(() => {
    if (svgRef.current) svgRef.current.innerHTML = "";
  }, []);

  const runCycle = useCallback(() => {
    captureHomePositions();
    generateStarPositions();

    const stars = starPositions.current;
    const homes = homePositions.current;
    if (!stars.length || !homes.length) return;

    let startTime = performance.now();
    phaseRef.current = "flyout";

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const phase = phaseRef.current;

      if (phase === "flyout") {
        const t = Math.min(elapsed / FLY_OUT_MS, 1);
        const ease = 1 - Math.pow(1 - t, 3); // ease-out cubic

        lettersRef.current.forEach((el, i) => {
          if (!el || letters[i] === " ") return;
          const home = homes[i];
          const star = stars[i];
          const dx = star.x - home.x;
          const dy = star.y - home.y;
          // Random bezier path via mid-point offset
          const mx = dx * 0.5 + (Math.sin(i * 1.7) * 60);
          const my = dy * 0.5 + (Math.cos(i * 2.3) * 40);

          const cx = home.x + (ease < 0.5 ? mx * (ease * 2) : dx * ease);
          const cy = home.y + (ease < 0.5 ? my * (ease * 2) : dy * ease);

          const scale = 1 - ease * 0.95; // down to ~0.05
          const tx = cx - home.x;
          const ty = cy - home.y;

          el.style.position = "relative";
          el.style.display = "inline-block";
          el.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
          el.style.opacity = String(1 - ease * 0.3);
          if (ease > 0.7) {
            const glowIntensity = (ease - 0.7) / 0.3;
            el.style.color = "transparent";
            el.style.width = "3px";
            el.style.height = "3px";
            el.style.borderRadius = "50%";
            el.style.background = `radial-gradient(circle, rgba(255,255,255,${glowIntensity}) 0%, rgba(255,60,0,${glowIntensity * 0.5}) 60%, transparent 100%)`;
            el.style.boxShadow = `0 0 ${8 * glowIntensity}px rgba(255,255,255,${glowIntensity * 0.8}), 0 0 ${20 * glowIntensity}px rgba(255,60,0,${glowIntensity * 0.4})`;
          }
        });

        if (t >= 1) {
          phaseRef.current = "lines";
          startTime = now;
        }
      } else if (phase === "lines") {
        const t = Math.min((elapsed) / LINE_DRAW_MS, 1);
        drawLines(t);
        if (t >= 1) {
          phaseRef.current = "hold";
          startTime = now;
        }
      } else if (phase === "hold") {
        if (elapsed >= HOLD_MS) {
          phaseRef.current = "erase";
          startTime = now;
        }
      } else if (phase === "erase") {
        const t = Math.min(elapsed / LINE_ERASE_MS, 1);
        drawLines(1 - t);
        if (t >= 1) {
          clearLines();
          phaseRef.current = "flyback";
          startTime = now;
        }
      } else if (phase === "flyback") {
        const t = Math.min(elapsed / FLY_BACK_MS, 1);
        const spring = springInterpolate(t * 3, 120, 14); // scale t for spring response

        lettersRef.current.forEach((el, i) => {
          if (!el || letters[i] === " ") return;
          const home = homes[i];
          const star = stars[i];
          const dx = star.x - home.x;
          const dy = star.y - home.y;

          const tx = dx * (1 - spring);
          const ty = dy * (1 - spring);
          const scale = 0.05 + 0.95 * spring;

          el.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
          el.style.opacity = String(0.7 + 0.3 * spring);

          if (spring > 0.3) {
            el.style.color = "";
            el.style.width = "";
            el.style.height = "";
            el.style.borderRadius = "";
            el.style.background = "";
            el.style.boxShadow = "";
          }
        });

        if (t >= 1) {
          resetLetters();
          phaseRef.current = "idle";
          return; // stop this animation frame loop
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
  }, [captureHomePositions, generateStarPositions, drawLines, clearLines, resetLetters, letters]);

  useEffect(() => {
    // Start cycle on intersection
    const container = containerRef.current;
    if (!container) return;

    let intervalId: ReturnType<typeof setInterval> | null = null;
    let isVisible = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            isVisible = true;
            // Delay first cycle slightly
            setTimeout(() => {
              runCycle();
              intervalId = setInterval(runCycle, CYCLE_MS);
            }, 500);
          } else if (!entry.isIntersecting && isVisible) {
            isVisible = false;
            if (intervalId) clearInterval(intervalId);
            cancelAnimationFrame(rafRef.current);
            resetLetters();
            clearLines();
            phaseRef.current = "idle";
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      if (intervalId) clearInterval(intervalId);
      cancelAnimationFrame(rafRef.current);
    };
  }, [runCycle, resetLetters, clearLines]);

  return (
    <div ref={containerRef} className="relative overflow-visible">
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ overflow: "visible", zIndex: 1 }}
      />
      <h2 className="font-display font-extrabold text-4xl md:text-6xl relative" style={{ zIndex: 2 }}>
        {letters.map((char, i) => (
          <span
            key={i}
            ref={(el) => { lettersRef.current[i] = el; }}
            className={char === " " ? "" : "inline-block"}
            style={{ willChange: "transform, opacity" }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </h2>
    </div>
  );
};

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `mailto:ragavrida@gmail.com?subject=Hello from ${form.name}&body=${form.message}`;
  };

  return (
    <section id="contact" className="py-24 bg-surface">
      <div className="container px-6">
        <div className="reveal mb-16 text-center">
          <ConstellationHeading />
        </div>

        <div className="max-w-lg mx-auto reveal">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-background border border-border px-4 py-3 font-body text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition"
              required
            />
            <input
              type="email"
              placeholder="Your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-background border border-border px-4 py-3 font-body text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition"
              required
            />
            <textarea
              placeholder="Your message"
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full bg-background border border-border px-4 py-3 font-body text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition resize-none"
              required
            />
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground font-body text-xs uppercase tracking-widest py-3 cut-corner hover:brightness-110 transition"
            >
              Send Message
            </button>
          </form>

          <div className="flex justify-center gap-6 mt-10">
            {[
              { label: "GitHub", url: "https://github.com/RagavRida" },
              { label: "LinkedIn", url: "https://www.linkedin.com/in/raghavendra-manchikatla-79b12624b/" },
              { label: "X", url: "https://x.com/RagavRida" },
              { label: "Instagram", url: "https://www.instagram.com/ragavrida_09/" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-xs text-muted-foreground hover:text-primary transition-colors hoverable"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
