import { OrganismRenderer } from "./types";

let buffer: number[] = [];
let spikeTimer = 0;

export const oscilloscope: OrganismRenderer = {
  init(_ctx, w) {
    buffer = new Array(Math.ceil(w)).fill(0);
    spikeTimer = 60;
  },
  draw(ctx, w, h, t, speed) {
    ctx.clearRect(0, 0, w, h);
    const cy = h / 2;
    const amp = h * 0.25;

    // shift buffer left
    const shift = Math.max(1, Math.round(speed * 1.5));
    for (let i = 0; i < shift; i++) {
      buffer.shift();
      const x = buffer.length;
      const base =
        Math.sin(x * 0.02 * 0.8) * 0.4 +
        Math.sin(x * 0.02 * 1.7) * 0.25 +
        Math.sin(x * 0.02 * 3.1) * 0.2 +
        Math.sin(x * 0.02 * 5.4) * 0.15;

      spikeTimer -= speed;
      let spike = 0;
      if (spikeTimer <= 0) {
        spike = (Math.random() - 0.5) * 1.8;
        spikeTimer = 30 + Math.random() * 90;
      }
      buffer.push(base + spike);
    }

    // ensure buffer length
    while (buffer.length < w) buffer.push(0);
    if (buffer.length > w) buffer.length = Math.ceil(w);

    // scanline glow
    ctx.beginPath();
    for (let i = 0; i < buffer.length; i++) {
      const y = cy + buffer[i] * amp;
      if (i === 0) ctx.moveTo(i, y);
      else ctx.lineTo(i, y);
    }
    ctx.strokeStyle = "rgba(0,255,136,0.15)";
    ctx.lineWidth = 6;
    ctx.stroke();

    // main line
    ctx.beginPath();
    for (let i = 0; i < buffer.length; i++) {
      const y = cy + buffer[i] * amp;
      if (i === 0) ctx.moveTo(i, y);
      else ctx.lineTo(i, y);
    }
    ctx.strokeStyle = "#00FF88";
    ctx.lineWidth = 1.5;
    ctx.shadowColor = "#00FF88";
    ctx.shadowBlur = 6;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // grid lines
    ctx.strokeStyle = "rgba(0,255,136,0.06)";
    ctx.lineWidth = 0.5;
    for (let y = 0; y < h; y += h / 6) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
    for (let x = 0; x < w; x += w / 8) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
  }
};
