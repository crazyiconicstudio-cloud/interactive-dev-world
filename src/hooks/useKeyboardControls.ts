import { useState, useEffect } from 'react';

export interface Controls {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
  boost: boolean;
}

export const useKeyboardControls = () => {
  const [controls, setControls] = useState<Controls>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    boost: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      setControls((prev) => ({
        ...prev,
        forward: key === 'w' || key === 'arrowup' ? true : prev.forward,
        backward: key === 's' || key === 'arrowdown' ? true : prev.backward,
        left: key === 'a' || key === 'arrowleft' ? true : prev.left,
        right: key === 'd' || key === 'arrowright' ? true : prev.right,
        jump: key === ' ' ? true : prev.jump,
        boost: key === 'shift' ? true : prev.boost,
      }));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      setControls((prev) => ({
        ...prev,
        forward: key === 'w' || key === 'arrowup' ? false : prev.forward,
        backward: key === 's' || key === 'arrowdown' ? false : prev.backward,
        left: key === 'a' || key === 'arrowleft' ? false : prev.left,
        right: key === 'd' || key === 'arrowright' ? false : prev.right,
        jump: key === ' ' ? false : prev.jump,
        boost: key === 'shift' ? false : prev.boost,
      }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return controls;
};
