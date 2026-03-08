import { OrganismRenderer } from "./types";

interface Branch { x1: number; y1: number; x2: number; y2: number; depth: number; alpha: number; age: number }

let branches: Branch[] = [];
let growTimer = 0;
let maxDepth = 0;

function growBranches(x: number, y: number, angle: number, len: number, depth: number): Branch[] {
  const x2 = x + Math.cos(angle) * len;
  const y2 = y + Math.sin(angle) * len;
  const b: Branch = { x1: x, y1: y, x2, y2, depth, alpha: 1, age: 0 };
  const result = [b];
  if (depth < 6) {
    const spread = 0.3 + Math.random() * 0.5;
    result.push(...growBranches(x2, y2, angle - spread, len * 0.72, depth + 1));
    result.push(...growBranches(x2, y2, angle + spread, len * 0.72, depth + 1));
  }
  return result;
}

export const fractalTree: OrganismRenderer = {
  init(_ctx, w, h) {
    branches = [];
    maxDepth = 2;
    growTimer = 0;
    const initial = growBranches(w / 2, h - 10, -Math.PI / 2, h * 0.18, 0);
    branches = initial.filter(b => b.depth < maxDepth);
  },
  draw(ctx, w, h, t, speed) {
    ctx.clearRect(0, 0, w, h);

    growTimer += speed;
    if (growTimer > 120 && maxDepth < 6) {
      maxDepth++;
      growTimer = 0;
      const newBranches = growBranches(w / 2, h - 10, -Math.PI / 2, h * 0.18, 0);
      branches = newBranches.filter(b => b.depth < maxDepth);
    }

    // fade outer branches
    for (const b of branches) {
      b.age += 0.01 * speed;
      if (b.depth >= maxDepth - 1 && b.age > 2) {
        b.alpha -= 0.005 * speed;
      }
    }
    branches = branches.filter(b => b.alpha > 0);

    for (const b of branches) {
      const ratio = b.depth / 6;
      const r = 232 + (255 - 232) * ratio;
      const g = 93 + (255 - 93) * ratio;
      const bv = 38 + (255 - 38) * ratio;

      ctx.beginPath();
      ctx.moveTo(b.x1, b.y1);
      ctx.lineTo(b.x2, b.y2);
      ctx.strokeStyle = `rgba(${r},${g},${bv},${b.alpha * (1 - ratio * 0.4)})`;
      ctx.lineWidth = Math.max(0.5, 3 - b.depth * 0.5);
      ctx.stroke();
    }
  }
};
