const ITEMS = [
  "Python", "TypeScript", "Java", "C++", "AI/ML", "Quantum Computing",
  "MCP", "LLMs", "Research", "Open Source", "Data Science", "Full-Stack",
  "Jupyter", "Algorithms", "React", "Software Agents",
];

const MarqueeTicker = () => (
  <section className="bg-primary py-3 overflow-hidden relative">
    <div className="flex animate-marquee whitespace-nowrap">
      {[...ITEMS, ...ITEMS].map((item, i) => (
        <span
          key={i}
          className="font-display font-extrabold text-sm uppercase tracking-widest text-primary-foreground mx-8"
        >
          {item} <span className="text-background/40 mx-2">◆</span>
        </span>
      ))}
    </div>
  </section>
);

export default MarqueeTicker;
