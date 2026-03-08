import { OrganismRenderer } from "./types";

let joints: { angle: number; targetAngle: number; len: number }[] = [];
let trail: { x: number; y: number; alpha: number }[] = [];
let baseX = 0, baseY = 0;
let targetX = 0, targetY = 0;
let retargetTimer = 0;

export const roboticClaw: OrganismRenderer = {
  init(_ctx, w, h) {
    baseX = w / 2;
    baseY = h * 0.85;
    joints = [
      { angle: -Math.PI / 3, targetAngle: -Math.PI / 3, len: 50 },
      { angle: -Math.PI / 4, targetAngle: -Math.PI / 4, len: 40 },
      { angle: Math.PI / 6, targetAngle: Math.PI / 6, len: 30 },
    ];
    trail = [];
    retargetTimer = 0;
    targetX = w / 2;
    targetY = h / 2;
  },
  draw(ctx, w, h, t, speed) {
    ctx.clearRect(0, 0, w, h);

    retargetTimer -= speed;
    if (retargetTimer <= 0) {
      targetX = 30 + Math.random() * (w - 60);
      targetY = 20 + Math.random() * (h * 0.6);
      retargetTimer = 60 + Math.random() * 80;
    }

    // simple IK approximation
    let endX = baseX, endY = baseY;
    for (const j of joints) {
      endX += Math.cos(j.angle) * j.len;
      endY += Math.sin(j.angle) * j.len;
    }
    const dx = targetX - endX, dy = targetY - endY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const reach = joints.reduce((s, j) => s + j.len, 0);

    for (let i = joints.length - 1; i >= 0; i--) {
      const factor = 0.02 * speed * (i + 1) / joints.length;
      joints[i].angle += Math.atan2(dy, dx) * factor * (dist / reach);
      joints[i].angle = Math.max(-Math.PI, Math.min(0.2, joints[i].angle));
    }

    // draw arm
    let px = baseX, py = baseY;
    ctx.beginPath();
    ctx.moveTo(px, py);
    for (const j of joints) {
      const nx = px + Math.cos(j.angle) * j.len;
      const ny = py + Math.sin(j.angle) * j.len;
      ctx.lineTo(nx, ny);

      // joint circle
      ctx.moveTo(nx + 3, ny);
      ctx.arc(nx, ny, 3, 0, Math.PI * 2);
      ctx.moveTo(nx, ny);

      px = nx;
      py = ny;
    }
    ctx.strokeStyle = "rgba(232,93,38,0.7)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // claw tip
    const clawSize = 8;
    const lastAngle = joints[joints.length - 1].angle;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px + Math.cos(lastAngle - 0.4) * clawSize, py + Math.sin(lastAngle - 0.4) * clawSize);
    ctx.moveTo(px, py);
    ctx.lineTo(px + Math.cos(lastAngle + 0.4) * clawSize, py + Math.sin(lastAngle + 0.4) * clawSize);
    ctx.strokeStyle = "#E85D26";
    ctx.lineWidth = 2;
    ctx.stroke();

    // trail
    trail.push({ x: px, y: py, alpha: 0.6 });
    trail = trail.filter(p => {
      p.alpha -= 0.008 * speed;
      return p.alpha > 0;
    });
    for (const p of trail) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(232,93,38,${p.alpha})`;
      ctx.fill();
    }
    if (trail.length > 200) trail.splice(0, trail.length - 200);
  }
};
