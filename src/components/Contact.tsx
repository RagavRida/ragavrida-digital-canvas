import { useState } from "react";

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
          <h2 className="font-display font-extrabold text-4xl md:text-6xl">
            LET'S BUILD SOMETHING{" "}
            <span style={{ WebkitTextStroke: "2px hsl(40 70% 60%)", color: "transparent" }}>
              GREAT.
            </span>
          </h2>
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
