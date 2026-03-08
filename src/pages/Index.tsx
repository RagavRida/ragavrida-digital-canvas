import { useEffect } from "react";
import CustomCursor from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MarqueeTicker from "@/components/MarqueeTicker";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import ContentUniverse from "@/components/ContentUniverse";
import Timeline from "@/components/Timeline";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("fold-exit");
            entry.target.classList.add("visible");
          } else if (entry.target.classList.contains("visible")) {
            const rect = entry.boundingClientRect;
            if (rect.top < 0) {
              entry.target.classList.remove("visible");
              entry.target.classList.add("fold-exit");
            }
          }
        });
      },
      { threshold: 0.01, rootMargin: "0px 0px 200px 0px" }
    );

    document.querySelectorAll(".reveal, .stagger").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <CustomCursor />
      <Navbar />
      <div className="fold-perspective">
        <Hero />
        <MarqueeTicker />
        <About />
        <Skills />
        <Projects />
        <ContentUniverse />
        <Timeline />
        <Contact />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
