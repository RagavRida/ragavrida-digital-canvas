import { OrganismRenderer } from "./types";

let rotation = 0;
let stateTheta = 0, statePhi = 0;

function project(x: number, y: number, z: number, w: number, h: number, rot: number) {
  const cos = Math.cos(rot), sin = Math.sin(rot);
  const rx = x * cos - z * sin;
  const rz = x * sin + z * cos;
  const scale = 200 / (200 + rz);
  return { x: w / 2 + rx * scale, y: h / 2 + y * scale, z: rz };
}

export const blochSphere: OrganismRenderer = {
  init() {
    rotation = 0;
    stateTheta = Math.PI / 4;
    statePhi = 0;
  },
  draw(ctx, w, h, t, speed) {
    ctx.clearRect(0, 0, w, h);
    rotation += 0.005 * speed;
    statePhi += 0.015 * speed;
    stateTheta += Math.sin(t * 0.01) * 0.003 * speed;

    const R = Math.min(w, h) * 0.32;
    const hue = (t * 0.5) % 360;

    // draw wireframe
    ctx.lineWidth = 0.5;

    // longitude lines
    for (let i = 0; i < 8; i++) {
      const phi = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      for (let j = 0; j <= 32; j++) {
        const theta = (j / 32) * Math.PI;
        const x = R * Math.sin(theta) * Math.cos(phi);
        const y = -R * Math.cos(theta);
        const z = R * Math.sin(theta) * Math.sin(phi);
        const p = project(x, y, z, w, h, rotation);
        if (j === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = `hsla(${hue + 180}, 70%, 60%, 0.15)`;
      ctx.stroke();
    }

    // latitude lines
    for (let i = 1; i < 6; i++) {
      const theta = (i / 6) * Math.PI;
      ctx.beginPath();
      for (let j = 0; j <= 32; j++) {
        const phi = (j / 32) * Math.PI * 2;
        const x = R * Math.sin(theta) * Math.cos(phi);
        const y = -R * Math.cos(theta);
        const z = R * Math.sin(theta) * Math.sin(phi);
        const p = project(x, y, z, w, h, rotation);
        if (j === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = `hsla(${hue + 180}, 70%, 60%, 0.1)`;
      ctx.stroke();
    }

    // equator
    ctx.beginPath();
    for (let j = 0; j <= 32; j++) {
      const phi = (j / 32) * Math.PI * 2;
      const x = R * Math.cos(phi);
      const z = R * Math.sin(phi);
      const p = project(x, 0, z, w, h, rotation);
      if (j === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.strokeStyle = `hsla(${hue + 180}, 70%, 60%, 0.25)`;
    ctx.lineWidth = 1;
    ctx.stroke();

    // state vector
    const sx = R * Math.sin(stateTheta) * Math.cos(statePhi);
    const sy = -R * Math.cos(stateTheta);
    const sz = R * Math.sin(stateTheta) * Math.sin(statePhi);
    const center = project(0, 0, 0, w, h, rotation);
    const tip = project(sx, sy, sz, w, h, rotation);

    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    ctx.lineTo(tip.x, tip.y);
    const color = `hsl(${hue}, 80%, 70%)`;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(tip.x, tip.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;

    // poles
    const north = project(0, -R, 0, w, h, rotation);
    const south = project(0, R, 0, w, h, rotation);
    ctx.font = "9px 'IBM Plex Mono', monospace";
    ctx.fillStyle = `hsla(${hue + 180}, 70%, 60%, 0.5)`;
    ctx.fillText("|0⟩", north.x + 6, north.y);
    ctx.fillText("|1⟩", south.x + 6, south.y);
  }
};
