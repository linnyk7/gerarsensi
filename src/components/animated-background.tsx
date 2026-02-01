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
    
    const fontSize = 30; // Increased for lower density

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      columns = Math.floor(w / fontSize);
      drops = [];
      for (let i = 0; i < columns; i++) {
        // Randomize starting position for a more organic feel
        drops[i] = Math.floor(Math.random() * (h/fontSize));
      }
    };
    
    window.addEventListener('resize', handleResize);

    let columns = Math.floor(w / fontSize);
    let drops: number[] = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * (h/fontSize));
    }

    const str = "0123456789";

    let intervalId: ReturnType<typeof setInterval>;

    function draw() {
      // Solid black background with low opacity for a subtle trail effect, creating a "living texture"
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, w, h);
      
      // Soft pink color for the text
      ctx.fillStyle = 'hsl(330, 60%, 70%)';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = str[Math.floor(Math.random() * str.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        // Reset drop when it goes off screen
        if (drops[i] * fontSize > h && Math.random() > 0.98) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    // Use setInterval for a slower, controlled frame rate
    intervalId = setInterval(draw, 80); // ~12.5 FPS

    return () => {
        window.removeEventListener('resize', handleResize);
        clearInterval(intervalId);
    };
  }, []);

  // `pointer-events-none` is important so it doesn't block interactions
  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none" />;
};

export default AnimatedBackground;
