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

const Timeline = () => (
  <section className="py-24">
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
        {/* Vertical line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border" />

        <div className="space-y-16">
          {TIMELINE.map((item, i) => (
            <div
              key={i}
              className={`reveal relative flex flex-col md:flex-row ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } items-start gap-8`}
            >
              {/* Dot */}
              <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-primary -translate-x-1/2 mt-2 z-10" />

              {/* Content */}
              <div className={`ml-12 md:ml-0 md:w-1/2 ${i % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16"}`}>
                <span className="font-body text-xs text-gold uppercase tracking-widest">
                  {item.year}
                </span>
                <h3 className="font-display font-extrabold text-lg mt-2 mb-2">
                  {item.title}
                </h3>
                <p className="font-body text-xs text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Timeline;
