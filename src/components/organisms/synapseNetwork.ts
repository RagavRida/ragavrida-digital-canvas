import { OrganismRenderer } from "./types";

interface Node { x: number; y: number; glow: number }
interface Signal { from: number; to: number; progress: number; speed: number }

let nodes: Node[] = [];
let connections: [number, number][] = [];
let signals: Signal[] = [];

export const synapseNetwork: OrganismRenderer = {
  init(_ctx, w, h) {
    const cx = w / 2, cy = h / 2;
    nodes = [
      { x: cx - 60, y: cy - 40, glow: 0 },
      { x: cx + 60, y: cy - 40, glow: 0 },
      { x: cx, y: cy + 50, glow: 0 },
      { x: cx - 80, y: cy + 20, glow: 0 },
      { x: cx + 80, y: cy + 20, glow: 0 },
      { x: cx, y: cy - 60, glow: 0 },
    ];
    connections = [[0,1],[1,2],[2,3],[3,0],[0,5],[5,1],[1,4],[4,2],[2,0],[3,5],[4,5]];
    signals = [];
  },
  draw(ctx, w, h, t, speed) {
    ctx.clearRect(0, 0, w, h);

    // spawn signals
    if (Math.random() < 0.03 * speed) {
      const ci = Math.floor(Math.random() * connections.length);
      const [from, to] = connections[ci];
      signals.push({ from, to, progress: 0, speed: (0.008 + Math.random() * 0.012) * speed });
    }

    // draw connections
    for (const [a, b] of connections) {
      ctx.beginPath();
      ctx.moveTo(nodes[a].x, nodes[a].y);
      ctx.lineTo(nodes[b].x, nodes[b].y);
      ctx.strokeStyle = "rgba(79,195,247,0.12)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // update & draw signals
    signals = signals.filter(s => {
      s.progress += s.speed;
      if (s.progress >= 1) {
        nodes[s.to].glow = 1;
        // fork
        const nexts = connections.filter(c => c[0] === s.to || c[1] === s.to);
        if (Math.random() < 0.4 * speed) {
          const nc = nexts[Math.floor(Math.random() * nexts.length)];
          if (nc) {
            const nextTo = nc[0] === s.to ? nc[1] : nc[0];
            signals.push({ from: s.to, to: nextTo, progress: 0, speed: s.speed });
          }
        }
        return false;
      }
      const fromN = nodes[s.from], toN = nodes[s.to];
      const sx = fromN.x + (toN.x - fromN.x) * s.progress;
      const sy = fromN.y + (toN.y - fromN.y) * s.progress;
      ctx.beginPath();
      ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = "#4FC3F7";
      ctx.shadowColor = "#4FC3F7";
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
      return true;
    });

    // draw nodes
    for (const n of nodes) {
      n.glow *= 0.95;
      const r = 3 + n.glow * 4;
      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(79,195,247,${0.3 + n.glow * 0.7})`;
      ctx.shadowColor = "#4FC3F7";
      ctx.shadowBlur = n.glow * 15;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    if (signals.length > 30) signals.length = 30;
  }
};
