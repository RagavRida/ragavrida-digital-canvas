import { OrganismRenderer } from "./types";

interface Bolt { segments: { x: number; y: number }[]; alpha: number }

let bolts: Bolt[] = [];
let spawnTimer = 0;

function generateBolt(cx: number, cy: number, w: number, h: number, depth: number): { x: number; y: number }[] {
  // pick random edge target
  const edge = Math.floor(Math.random() * 4);
  let tx: number, ty: number;
  if (edge === 0) { tx = Math.random() * w; ty = 0; }
  else if (edge === 1) { tx = w; ty = Math.random() * h; }
  else if (edge === 2) { tx = Math.random() * w; ty = h; }
  else { tx = 0; ty = Math.random() * h; }

  const points = [{ x: cx, y: cy }];
  const steps = 6 + depth * 2;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const x = cx + (tx - cx) * t + (Math.random() - 0.5) * 30;
    const y = cy + (ty - cy) * t + (Math.random() - 0.5) * 30;
    points.push({ x, y });
  }
  return points;
}

export const sparkGenerator: OrganismRenderer = {
  init(_ctx, _w, _h) {
    bolts = [];
    spawnTimer = 30;
  },
  draw(ctx, w, h, t, speed) {
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;

    spawnTimer -= speed;
    if (spawnTimer <= 0 && bolts.length < 4) {
      const numBolts = 1 + Math.floor(Math.random() * 2);
      for (let i = 0; i < numBolts; i++) {
        const segments = generateBolt(cx, cy, w, h, Math.floor(Math.random() * 3));
        bolts.push({ segments, alpha: 1 });
      }
      spawnTimer = 50 + Math.random() * 40;
    }

    // draw center point
    ctx.beginPath();
    ctx.arc(cx, cy, 2, 0, Math.PI * 2);
    ctx.fillStyle = "#3178C6";
    ctx.shadowColor = "#3178C6";
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;

    // draw bolts
    bolts = bolts.filter(bolt => {
      bolt.alpha -= 0.025 * speed;
      if (bolt.alpha <= 0) return false;

      // glow
      ctx.beginPath();
      for (let i = 0; i < bolt.segments.length; i++) {
        const s = bolt.segments[i];
        if (i === 0) ctx.moveTo(s.x, s.y);
        else ctx.lineTo(s.x, s.y);
      }
      ctx.strokeStyle = `rgba(49,120,198,${bolt.alpha * 0.3})`;
      ctx.lineWidth = 4;
      ctx.stroke();

      // core
      ctx.beginPath();
      for (let i = 0; i < bolt.segments.length; i++) {
        const s = bolt.segments[i];
        if (i === 0) ctx.moveTo(s.x, s.y);
        else ctx.lineTo(s.x, s.y);
      }
      ctx.strokeStyle = `rgba(200,220,255,${bolt.alpha * 0.9})`;
      ctx.lineWidth = 1;
      ctx.shadowColor = "#3178C6";
      ctx.shadowBlur = bolt.alpha * 8;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // branch bolts at midpoints
      if (bolt.alpha > 0.7) {
        const mid = bolt.segments[Math.floor(bolt.segments.length / 2)];
        if (Math.random() < 0.02 * speed) {
          const branch = generateBolt(mid.x, mid.y, w, h, 0);
          bolts.push({ segments: branch.slice(0, 4), alpha: bolt.alpha * 0.6 });
        }
      }

      return true;
    });
  }
};
