import { useState, useCallback } from 'react';

export interface TouchControlState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
  boost: boolean;
}

export const useTouchControls = () => {
  const [controls, setControls] = useState<TouchControlState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    boost: false,
  });

  const updateControls = useCallback((newControls: TouchControlState) => {
    setControls(newControls);
  }, []);

  return { controls, updateControls };
};
