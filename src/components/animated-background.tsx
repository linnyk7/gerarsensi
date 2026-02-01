'use client';

import React, { useEffect, useRef } from 'react';

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      // Reset columns and drops on resize
      columns = Math.floor(w / 20);
      drops = [];
      for (let i = 0; i < columns; i++) {
        drops[i] = 1;
      }
    };
    
    window.addEventListener('resize', handleResize);

    let columns = Math.floor(w / 20);
    let drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    const str = "0123456789";

    let animationFrameId: number;

    function draw() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#FF007F'; // Neon Pink
      ctx.font = '15px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = str[Math.floor(Math.random() * str.length)];
        ctx.fillText(text, i * 20, drops[i] * 20);
        if (drops[i] * 20 > h && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animationFrameId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10 blur-[1px]" />;
};

export default AnimatedBackground;
