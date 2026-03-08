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

const Skills = () => (
  <section id="skills" className="py-24 bg-surface">
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
        {SKILL_GROUPS.map((group) => (
          <div key={group.category} className="reveal">
            <h3 className="font-display font-bold text-sm uppercase tracking-widest text-gold mb-4">
              {group.category}
            </h3>
            <div className="flex flex-wrap gap-3 stagger">
              {group.skills.map((skill) => (
                <span
                  key={skill}
                  className="skill-chip font-body text-xs px-4 py-2 border border-border bg-background text-foreground hoverable"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Skills;
