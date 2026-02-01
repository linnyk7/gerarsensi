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

    const fontSize = 16;
    let columns = Math.floor(w / fontSize);
    let drops: number[] = [];

    const setupDrops = () => {
      columns = Math.floor(w / fontSize);
      drops = [];
      for (let i = 0; i < columns; i++) {
        // Randomize starting position for a more organic feel
        drops[i] = Math.floor(Math.random() * (h/fontSize));
      }
    };

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      setupDrops();
    };
    
    window.addEventListener('resize', handleResize);
    setupDrops();

    const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    let intervalId: ReturnType<typeof setInterval>;

    function draw() {
      // Semi-transparent black background to create the fading trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, w, h);
      
      // Use the theme's primary color, which is a strong pink
      ctx.fillStyle = 'hsl(330, 100%, 50%)';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        // Reset drop to the top randomly after it has crossed the screen
        if (drops[i] * fontSize > h && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        // Move the drop down
        drops[i]++;
      }
    }

    intervalId = setInterval(draw, 50);

    return () => {
        window.removeEventListener('resize', handleResize);
        clearInterval(intervalId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none" />;
};

export default AnimatedBackground;
