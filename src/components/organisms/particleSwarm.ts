import { OrganismRenderer } from "./types";

interface Particle { x: number; y: number; vx: number; vy: number }

let particles: Particle[] = [];
let convergeTimer = 0;
let convergeShape = 0;
let converging = false;

export const particleSwarm: OrganismRenderer = {
  init(_ctx, w, h) {
    particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
    }));
    convergeTimer = 180;
    convergeShape = 0;
    converging = false;
  },
  draw(ctx, w, h, t, speed) {
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;

    convergeTimer -= speed;
    if (convergeTimer <= 0 && !converging) {
      converging = true;
      convergeShape = Math.floor(Math.random() * 3);
      convergeTimer = 60;
    }
    if (converging && convergeTimer <= 0) {
      converging = false;
      convergeTimer = 120 + Math.random() * 60;
    }

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      if (converging) {
        // target positions
        let tx = cx, ty = cy;
        const angle = (i / particles.length) * Math.PI * 2;
        const r = 35;
        if (convergeShape === 0) { // circle
          tx = cx + Math.cos(angle) * r;
          ty = cy + Math.sin(angle) * r;
        } else if (convergeShape === 1) { // grid
          const cols = 6;
          tx = cx - 30 + (i % cols) * 12;
          ty = cy - 25 + Math.floor(i / cols) * 12;
        } else { // star
          const inner = r * 0.4;
          const outer = r;
          const ra = i % 2 === 0 ? outer : inner;
          tx = cx + Math.cos(angle) * ra;
          ty = cy + Math.sin(angle) * ra;
        }
        p.vx += (tx - p.x) * 0.05 * speed;
        p.vy += (ty - p.y) * 0.05 * speed;
      } else {
        // flocking
        let sepX = 0, sepY = 0, aliX = 0, aliY = 0, cohX = 0, cohY = 0, neighbors = 0;
        for (let j = 0; j < particles.length; j++) {
          if (i === j) continue;
          const o = particles[j];
          const dx = o.x - p.x, dy = o.y - p.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 60) {
            neighbors++;
            if (d < 20 && d > 0) { sepX -= dx / d; sepY -= dy / d; }
            aliX += o.vx; aliY += o.vy;
            cohX += o.x; cohY += o.y;
          }
        }
        if (neighbors > 0) {
          p.vx += sepX * 0.05 + (aliX / neighbors - p.vx) * 0.02 + (cohX / neighbors - p.x) * 0.003;
          p.vy += sepY * 0.05 + (aliY / neighbors - p.vy) * 0.02 + (cohY / neighbors - p.y) * 0.003;
        }
      }

      p.vx *= 0.96;
      p.vy *= 0.96;
      const maxV = 2 * speed;
      const v = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (v > maxV) { p.vx = (p.vx / v) * maxV; p.vy = (p.vy / v) * maxV; }

      p.x += p.vx * speed;
      p.y += p.vy * speed;

      // bounds
      if (p.x < 5) p.vx += 0.3; if (p.x > w - 5) p.vx -= 0.3;
      if (p.y < 5) p.vy += 0.3; if (p.y > h - 5) p.vy -= 0.3;

      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = converging ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.35)";
      ctx.shadowColor = "rgba(255,255,255,0.5)";
      ctx.shadowBlur = converging ? 6 : 2;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }
};
