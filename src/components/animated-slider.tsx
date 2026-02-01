'use client';

import { Slider } from '@/components/ui/slider';
import { useEffect, useState } from 'react';

type AnimatedSliderProps = {
  value: number;
  max: number;
};

export function AnimatedSlider({ value, max }: AnimatedSliderProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (value === undefined) return;

    let animationFrameId: number;

    const startAnimation = () => {
      let start: number | null = null;
      const duration = 1500; // Animation duration in ms

      const animate = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const animatedValue = Math.floor(progress * value);
        setDisplayValue(animatedValue);

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        }
      };
      animationFrameId = requestAnimationFrame(animate);
    };

    const timeoutId = setTimeout(startAnimation, 500); // Delay before starting animation

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationFrameId);
    };
  }, [value]);

  return (
    <div className="relative w-full my-4">
      <Slider
        value={[displayValue]}
        max={max}
        step={1}
        className="[&_span.bg-primary]:bg-primary [&_[role=slider]]:bg-white [&_[role=slider]]:border-2 [&_[role=slider]]:border-primary [&_[role=slider]]:shadow-none"
      />
    </div>
  );
}
