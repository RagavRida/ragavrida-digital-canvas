import { useEffect, useRef, useCallback } from "react";

type CursorMode = "default" | "text" | "image" | "button";

const LERP_MAIN = 0.08;
const LERP_GHOST = 0.04;
const TRANSITION = "200ms cubic-bezier(0.34, 1.56, 0.64, 1)";

const CustomCursor = () => {
  const blobRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const blobPos = useRef({ x: 0, y: 0 });
  const ghostPos = useRef({ x: 0, y: 0 });
  const mode = useRef<CursorMode>("default");
  const buttonCenter = useRef<{ x: number; y: number } | null>(null);
  const imageEl = useRef<Element | null>(null);
  const raf = useRef(0);

  const tick = useCallback(() => {
    const blob = blobRef.current;
    const ghost = ghostRef.current;
    if (!blob || !ghost) return;

    // Determine lerp target
    let tx = pos.current.x;
    let ty = pos.current.y;

    if (mode.current === "button" && buttonCenter.current) {
      // Stretch toward button center
      tx = pos.current.x + (buttonCenter.current.x - pos.current.x) * 0.4;
      ty = pos.current.y + (buttonCenter.current.y - pos.current.y) * 0.4;
    }

    target.current = { x: tx, y: ty };

    blobPos.current.x += (target.current.x - blobPos.current.x) * LERP_MAIN;
    blobPos.current.y += (target.current.y - blobPos.current.y) * LERP_MAIN;
    ghostPos.current.x += (target.current.x - ghostPos.current.x) * LERP_GHOST;
    ghostPos.current.y += (target.current.y - ghostPos.current.y) * LERP_GHOST;

    blob.style.left = blobPos.current.x + "px";
    blob.style.top = blobPos.current.y + "px";
    ghost.style.left = ghostPos.current.x + "px";
    ghost.style.top = ghostPos.current.y + "px";

    // Button stretch effect
    if (mode.current === "button" && buttonCenter.current) {
      const dx = buttonCenter.current.x - blobPos.current.x;
      const dy = buttonCenter.current.y - blobPos.current.y;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      const dist = Math.sqrt(dx * dx + dy * dy);
      const stretchX = 1 + Math.min(dist * 0.008, 0.6);
      const stretchY = 1 / stretchX;
      blob.style.transform = `translate(-50%, -50%) rotate(${angle}deg) scale(${stretchX}, ${stretchY})`;
    }

    raf.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    const blob = blobRef.current;
    const ghost = ghostRef.current;
    if (!blob || !ghost) return;

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const setMode = (newMode: CursorMode) => {
      mode.current = newMode;
      blob.setAttribute("data-mode", newMode);
      ghost.setAttribute("data-mode", newMode);

      if (newMode !== "button") {
        blob.style.transform = "translate(-50%, -50%)";
        buttonCenter.current = null;
      }
      if (newMode !== "image") {
        imageEl.current = null;
      }
    };

    const onEnter = (e: Event) => {
      const el = e.currentTarget as HTMLElement;

      if (el.matches("button, a.btn, [role='button'], .hoverable-btn")) {
        const rect = el.getBoundingClientRect();
        buttonCenter.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        setMode("button");
      } else if (el.matches("img, video, canvas, picture, .hoverable-img, svg.project-img")) {
        imageEl.current = el;
        setMode("image");
      } else if (
        el.matches("p, h1, h2, h3, h4, h5, h6, span, a, label, li, blockquote, .hoverable-text") &&
        !el.matches("button, [role='button']")
      ) {
        setMode("text");
      }
    };

    const onLeave = () => {
      setMode("default");
    };

    // Attach listeners
    document.addEventListener("mousemove", onMove);

    const attachHoverListeners = () => {
      const targets = document.querySelectorAll(
        "button, a, [role='button'], .hoverable-btn, img, video, canvas, picture, .hoverable-img, p, h1, h2, h3, h4, h5, h6, span, label, li, blockquote, .hoverable-text"
      );
      targets.forEach((el) => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
      return targets;
    };

    let targets = attachHoverListeners();

    // Re-attach on DOM changes
    const observer = new MutationObserver(() => {
      targets.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
      targets = attachHoverListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    raf.current = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf.current);
      observer.disconnect();
      targets.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, [tick]);

  return (
    <>
      <div ref={blobRef} data-mode="default" className="cursor-blob hidden md:block" />
      <div ref={ghostRef} data-mode="default" className="cursor-ghost hidden md:block" />
    </>
  );
};

export default CustomCursor;
