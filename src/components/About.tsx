const About = () => (
  <section id="about" className="py-24">
    <div className="container px-6 grid md:grid-cols-2 gap-12">
      {/* Left */}
      <div className="reveal">
        <p className="font-body text-xs uppercase tracking-[0.3em] text-primary mb-4">
          // about
        </p>
        <h2 className="font-display font-extrabold text-4xl md:text-5xl mb-6">
          WHO I <span className="text-primary">AM</span>
        </h2>
        <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
          As an AI researcher, I am passionate about pushing the boundaries of artificial 
          intelligence and its applications. I have been working on projects to revolutionize 
          existing algorithms and develop cutting-edge tools for quantum computing.
        </p>
        <p className="font-body text-sm text-muted-foreground leading-relaxed">
          This involves collaborating with teams to build advanced software engineering agents, 
          multi-model context protocols, and research tools. Currently studying at Jyothishmathi 
          Institute of Technology and Science while actively building and shipping open source projects.
        </p>
      </div>

      {/* Right - Terminal */}
      <div className="reveal">
        <div className="bg-surface border border-border p-6 font-body text-xs">
          <div className="flex gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-primary/60" />
            <div className="w-3 h-3 rounded-full bg-gold/60" />
            <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
          </div>
          <div className="space-y-2 text-muted-foreground">
            <p><span className="text-primary">$</span> whoami</p>
            <p className="text-foreground pl-4">raghavendra manchikatla</p>
            <p><span className="text-primary">$</span> role</p>
            <p className="text-gold pl-4">AI Researcher & Aspiring Entrepreneur</p>
            <p><span className="text-primary">$</span> stack</p>
            <p className="text-foreground pl-4">Python · TypeScript · Java · C++ · Jupyter</p>
            <p><span className="text-primary">$</span> location</p>
            <p className="text-foreground pl-4">India 🇮🇳</p>
            <p><span className="text-primary">$</span> education</p>
            <p className="text-foreground pl-4">Jyothishmathi Institute of Technology & Science</p>
            <p><span className="text-primary">$</span> status</p>
            <p className="text-gold pl-4">building & shipping <span className="terminal-cursor">▌</span></p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default About;
