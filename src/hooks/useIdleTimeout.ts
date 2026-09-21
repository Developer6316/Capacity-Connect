import { useEffect, useRef, useState } from 'react';

export function useIdleTimeout(
  onIdle: () => void,
  idleTimeMs: number = 15 * 60 * 1000 // default 15 minutes
) {
  const [isIdle, setIsIdle] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleActivity = () => {
      setIsIdle(false);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        setIsIdle(true);
        onIdle();
      }, idleTimeMs);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach((event) => {
      document.addEventListener(event, handleActivity);
    });

    handleActivity(); // Initial setup

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [onIdle, idleTimeMs]);

  return isIdle;
}
