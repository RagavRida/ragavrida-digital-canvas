import { OrganismRenderer } from "./types";

interface Point { x: number; y: number; ox: number; oy: number; pinned: boolean }

let points: Point[] = [];
let cols = 0, rows = 0;

export const fabricSim: OrganismRenderer = {
  init(_ctx, w, h) {
    cols = 18;
    rows = 14;
    const spacingX = (w - 40) / (cols - 1);
    const spacingY = (h - 30) / (rows - 1);
    points = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = 20 + c * spacingX;
        const y = 15 + r * spacingY;
        points.push({ x, y, ox: x, oy: y, pinned: r === 0 });
      }
    }
  },
  draw(ctx, w, h, t, speed) {
    ctx.clearRect(0, 0, w, h);
    const wind = Math.sin(t * 0.02) * 0.5 + Math.sin(t * 0.007) * 0.3;

    // physics
    for (const p of points) {
      if (p.pinned) continue;
      const vx = (p.x - p.ox) * 0.98;
      const vy = (p.y - p.oy) * 0.98;
      p.ox = p.x;
      p.oy = p.y;
      p.x += vx + wind * speed * 0.5;
      p.y += vy + 0.15 * speed; // gravity
    }

    // constraints
    const spacingX = (w - 40) / (cols - 1);
    const spacingY = (h - 30) / (rows - 1);
    const restH = spacingX;
    const restV = spacingY;

    for (let iter = 0; iter < 3; iter++) {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          // horizontal
          if (c < cols - 1) {
            const j = i + 1;
            const dx = points[j].x - points[i].x;
            const dy = points[j].y - points[i].y;
            const d = Math.sqrt(dx * dx + dy * dy) || 1;
            const diff = (d - restH) / d * 0.5;
            if (!points[i].pinned) { points[i].x += dx * diff; points[i].y += dy * diff; }
            if (!points[j].pinned) { points[j].x -= dx * diff; points[j].y -= dy * diff; }
          }
          // vertical
          if (r < rows - 1) {
            const j = i + cols;
            const dx = points[j].x - points[i].x;
            const dy = points[j].y - points[i].y;
            const d = Math.sqrt(dx * dx + dy * dy) || 1;
            const diff = (d - restV) / d * 0.5;
            if (!points[i].pinned) { points[i].x += dx * diff; points[i].y += dy * diff; }
            if (!points[j].pinned) { points[j].x -= dx * diff; points[j].y -= dy * diff; }
          }
        }
      }
    }

    // render mesh
    for (let r = 0; r < rows - 1; r++) {
      for (let c = 0; c < cols - 1; c++) {
        const i = r * cols + c;
        const a = points[i], b = points[i + 1], d = points[i + cols], e = points[i + cols + 1];
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.lineTo(e.x, e.y);
        ctx.lineTo(d.x, d.y);
        ctx.closePath();

        const ratio = r / rows;
        const r1 = 255, g1 = 107, b1 = 157;
        const r2 = 196, g2 = 69, b2 = 105;
        const red = r1 + (r2 - r1) * ratio;
        const green = g1 + (g2 - g1) * ratio;
        const blue = b1 + (b2 - b1) * ratio;
        ctx.fillStyle = `rgba(${red},${green},${blue},0.12)`;
        ctx.fill();
        ctx.strokeStyle = `rgba(${red},${green},${blue},0.2)`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
};
