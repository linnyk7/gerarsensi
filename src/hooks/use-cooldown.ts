'use client';
import { useState, useEffect, useCallback } from 'react';

const COOLDOWN_KEY = 'kizaru_cooldown_end';

export function useCooldown(duration: number) {
  const [cooldownEnd, setCooldownEnd] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0);

  useEffect(() => {
    const storedEndTime = localStorage.getItem(COOLDOWN_KEY);
    if (storedEndTime) {
      const endTime = parseInt(storedEndTime, 10);
      if (endTime > Date.now()) {
        setCooldownEnd(endTime);
      } else {
        localStorage.removeItem(COOLDOWN_KEY);
      }
    }
  }, []);
  
  useEffect(() => {
    if (cooldownEnd === null) {
      setRemainingTime(0);
      return;
    }

    const calculateRemaining = () => {
      const now = Date.now();
      const remaining = Math.max(0, cooldownEnd - now);
      setRemainingTime(remaining);
      if (remaining === 0) {
        setCooldownEnd(null);
        localStorage.removeItem(COOLDOWN_KEY);
      }
    };

    calculateRemaining();
    const intervalId = setInterval(calculateRemaining, 1000);

    return () => clearInterval(intervalId);
  }, [cooldownEnd]);

  const startCooldown = useCallback(() => {
    const endTime = Date.now() + duration;
    localStorage.setItem(COOLDOWN_KEY, endTime.toString());
    setCooldownEnd(endTime);
  }, [duration]);

  const isCoolingDown = remainingTime > 0;

  return { isCoolingDown, remainingTime, startCooldown };
}
