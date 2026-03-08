import { useEffect, useState } from "react";

const ROLES = [
  "AI Researcher",
  "Aspiring Entrepreneur",
  "Quantum Computing Explorer",
  "Open Source Builder",
  "Full-Stack Developer",
];

const Hero = () => {
  const [roleIdx, setRoleIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIdx((i) => (i + 1) % ROLES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen flex items-center pt-16 relative overflow-hidden">
      <div className="container px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* Left */}
        <div className="reveal">
          <p className="font-body text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
            // building the future
          </p>
          <h1 className="font-display font-extrabold text-5xl sm:text-7xl lg:text-8xl leading-[0.9] mb-6">
            <span
              className="glitch-text block"
              data-text="RAGAV"
            >
              RAGAV
            </span>
            <span className="text-primary block" style={{ WebkitTextStroke: "2px hsl(16 100% 50%)", color: "transparent" }}>
              RIDA
            </span>
          </h1>
          <div className="h-8 overflow-hidden mb-6">
            <p
              key={roleIdx}
              className="font-body text-lg text-gold animate-fade-in"
            >
              {ROLES[roleIdx]}
            </p>
          </div>
          <p className="font-body text-sm text-muted-foreground max-w-md mb-8 leading-relaxed">
            AI researcher passionate about pushing the boundaries of artificial intelligence. 
            Building cutting-edge tools for quantum computing and revolutionizing existing algorithms.
          </p>
          <div className="flex gap-4 flex-wrap">
            <a
              href="#projects"
              className="bg-primary text-primary-foreground font-body text-xs uppercase tracking-widest px-6 py-3 cut-corner hover:brightness-110 transition"
            >
              View My Work
            </a>
            <a
              href="https://github.com/RagavRida"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-foreground/30 text-foreground font-body text-xs uppercase tracking-widest px-6 py-3 hover:border-primary hover:text-primary transition"
            >
              GitHub →
            </a>
          </div>
        </div>

        {/* Right - Identity Card */}
        <div className="reveal">
          <div className="cut-corner bg-surface border border-border p-8 relative">
            <div className="absolute top-3 right-6 text-xs font-body text-muted-foreground">
              ID_CARD.exe
            </div>
            <div className="w-24 h-24 bg-muted border border-border mb-6 flex items-center justify-center">
              <span className="font-display text-3xl font-extrabold text-primary">MR</span>
            </div>
            <h3 className="font-display font-extrabold text-xl text-foreground mb-1">
              M RAGHAVENDRA
            </h3>
            <p className="font-body text-xs text-gold mb-6">
              @RagavRida
            </p>
            <div className="grid grid-cols-3 gap-4 border-t border-border pt-6">
              <div>
                <p className="font-display text-2xl font-extrabold text-primary">14</p>
                <p className="font-body text-[10px] uppercase text-muted-foreground">Repos</p>
              </div>
              <div>
                <p className="font-display text-2xl font-extrabold text-gold">6+</p>
                <p className="font-body text-[10px] uppercase text-muted-foreground">Languages</p>
              </div>
              <div>
                <p className="font-display text-2xl font-extrabold text-foreground">4</p>
                <p className="font-body text-[10px] uppercase text-muted-foreground">Platforms</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
