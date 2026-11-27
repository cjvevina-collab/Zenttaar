import React, { useEffect, useRef } from 'react';

interface LightningBolt {
  points: { x: number; y: number }[];
  alpha: number;
  width: number;
  color: string;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  color: string;
}

export const LightningCursor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (prefersReduced || isTouch) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const bolts: LightningBolt[] = [];
    const sparks: Spark[] = [];
    let lastX = -100;
    let lastY = -100;

    const colors = ['#F59E0B', '#FBBF24', '#FB7185', '#FFFFFF'];

    const createBoltSegment = (x1: number, y1: number, x2: number, y2: number, color: string) => {
      const pts: { x: number; y: number }[] = [{ x: x1, y: y1 }];
      const segments = 4;
      const dx = x2 - x1;
      const dy = y2 - y1;
      const dist = Math.hypot(dx, dy);
      const jitter = Math.min(12, Math.max(2.5, dist * 0.22));

      for (let i = 1; i < segments; i++) {
        const t = i / segments;
        pts.push({
          x: x1 + dx * t + (Math.random() - 0.5) * jitter,
          y: y1 + dy * t + (Math.random() - 0.5) * jitter,
        });
      }
      pts.push({ x: x2, y: y2 });

      bolts.push({
        points: pts,
        alpha: 0.92,
        width: Math.random() * 1.1 + 0.75,
        color,
      });

      if (Math.random() > 0.68 && pts.length > 2) {
        const mid = pts[Math.floor(pts.length / 2)];
        const angle = Math.random() * Math.PI * 2;
        const branchLen = 10 + Math.random() * 14;
        bolts.push({
          points: [
            { x: mid.x, y: mid.y },
            {
              x: mid.x + Math.cos(angle) * (branchLen * 0.5) + (Math.random() - 0.5) * 4,
              y: mid.y + Math.sin(angle) * (branchLen * 0.5) + (Math.random() - 0.5) * 4,
            },
            {
              x: mid.x + Math.cos(angle) * branchLen,
              y: mid.y + Math.sin(angle) * branchLen,
            },
          ],
          alpha: 0.7,
          width: 0.7,
          color: '#FDE68A',
        });
      }
    };

    const spawnSparks = (x: number, y: number, count: number) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.2 + Math.random() * 2.4;
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 0.85,
          size: Math.random() * 1.5 + 0.7,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      if (lastX < 0) {
        lastX = x;
        lastY = y;
        return;
      }

      const dist = Math.hypot(x - lastX, y - lastY);
      if (dist >= 2.5) {
        const color = Math.random() > 0.22 ? '#F59E0B' : '#FB7185';
        createBoltSegment(lastX, lastY, x, y, color);
        if (dist > 18) {
          spawnSparks(x, y, 2);
        }
        lastX = x;
        lastY = y;
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      for (let i = 0; i < 4; i++) {
        const angle = (Math.PI * 2 * i) / 4 + Math.random() * 0.5;
        const len = 20 + Math.random() * 16;
        createBoltSegment(
          x,
          y,
          x + Math.cos(angle) * len,
          y + Math.sin(angle) * len,
          i % 2 === 0 ? '#FBBF24' : '#FFFFFF'
        );
      }
      spawnSparks(x, y, 5);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });

    let rafId = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = bolts.length - 1; i >= 0; i--) {
        const b = bolts[i];
        ctx.save();
        ctx.globalAlpha = b.alpha;
        ctx.strokeStyle = b.color;
        ctx.lineWidth = b.width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 7;

        ctx.beginPath();
        ctx.moveTo(b.points[0].x, b.points[0].y);
        for (let j = 1; j < b.points.length; j++) {
          ctx.lineTo(b.points[j].x, b.points[j].y);
        }
        ctx.stroke();
        ctx.restore();

        // Crisp exponential decay for smooth, instant response
        b.alpha *= 0.8;
        if (b.alpha <= 0.03) {
          bolts.splice(i, 1);
        }
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        ctx.save();
        ctx.globalAlpha = s.alpha;
        ctx.fillStyle = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 5;
        ctx.fillRect(s.x, s.y, s.size, s.size);
        ctx.restore();

        s.x += s.vx;
        s.y += s.vy;
        s.alpha *= 0.84;
        if (s.alpha <= 0.03) {
          sparks.splice(i, 1);
        }
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50"
    />
  );
};
