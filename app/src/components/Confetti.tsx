
import React, { useEffect, useRef } from "react";

export default function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Setup
    const w = window.innerWidth, h = window.innerHeight;
    canvas.width = w; canvas.height = h;
    const colors = ["#ffd9cc", "#bbf7d0", "#ffbdb6", "#86efac", "#ffe2de", "#4ade80", "#ff9b8f"];
    let confetti: any[] = [];
    for (let i = 0; i < 70; i++) {
      confetti.push({
        x: Math.random() * w,
        y: Math.random() * h * 0.5,
        r: 6 + Math.random() * 6,
        d: Math.random() * 30 + 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.floor(Math.random() * 10) - 10,
      });
    }
    let angle = 0;
    let animationFrame: number;
    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      angle += 0.01;
      for (let i = 0; i < confetti.length; i++) {
        let c = confetti[i];
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.fillStyle = c.color;
        ctx.globalAlpha = 0.7;
        ctx.fill();
        ctx.closePath();
        c.y += Math.cos(angle + i) + 1 + c.r / 2;
        c.x += Math.sin(angle) * 2;
        if (c.y > h) {
          c.x = Math.random() * w;
          c.y = -10;
        }
      }
      animationFrame = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[60] pointer-events-none"
      style={{ width: '100vw', height: '100vh' }}
      aria-hidden
    />
  );
}
