import { useState } from "react";

const NAV_LINKS = [
  { label: "Work", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Connect", href: "#contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-16 px-6">
        <a href="#" className="font-display font-800 text-xl tracking-tight">
          RAGAV<span className="text-primary">RIDA</span>
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="font-body text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="mailto:ragavrida@gmail.com"
            className="bg-primary text-primary-foreground font-display font-bold text-xs uppercase tracking-widest px-5 py-2 cut-corner hover:brightness-110 transition"
          >
            Hire Me
          </a>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-1.5 z-50"
          aria-label="Menu"
        >
          <span className={`hamburger-line w-6 h-0.5 bg-foreground block ${open ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`hamburger-line w-6 h-0.5 bg-foreground block ${open ? "opacity-0" : ""}`} />
          <span className={`hamburger-line w-6 h-0.5 bg-foreground block ${open ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden fixed inset-0 top-16 bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 z-40">
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-display text-3xl font-800 text-foreground hover:text-primary transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
