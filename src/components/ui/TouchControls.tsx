import { useEffect, useRef, useState } from 'react';
import { Rocket, ArrowUp } from 'lucide-react';

interface TouchControlsProps {
  onControlChange: (controls: {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    jump: boolean;
    boost: boolean;
  }) => void;
}

export const TouchControls = ({ onControlChange }: TouchControlsProps) => {
  const joystickRef = useRef<HTMLDivElement>(null);
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const [isJoystickActive, setIsJoystickActive] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [isBoosting, setIsBoosting] = useState(false);
  const touchIdRef = useRef<number | null>(null);

  useEffect(() => {
    const controls = {
      forward: joystickPos.y < -0.3,
      backward: joystickPos.y > 0.3,
      left: joystickPos.x < -0.3,
      right: joystickPos.x > 0.3,
      jump: isJumping,
      boost: isBoosting,
    };
    onControlChange(controls);
  }, [joystickPos, isJumping, isBoosting, onControlChange]);

  const handleJoystickStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    touchIdRef.current = touch.identifier;
    setIsJoystickActive(true);
    updateJoystickPosition(touch);
  };

  const handleJoystickMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!isJoystickActive) return;
    
    for (let i = 0; i < e.touches.length; i++) {
      if (e.touches[i].identifier === touchIdRef.current) {
        updateJoystickPosition(e.touches[i]);
        break;
      }
    }
  };

  const handleJoystickEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    let found = false;
    for (let i = 0; i < e.touches.length; i++) {
      if (e.touches[i].identifier === touchIdRef.current) {
        found = true;
        break;
      }
    }
    if (!found) {
      setIsJoystickActive(false);
      setJoystickPos({ x: 0, y: 0 });
      touchIdRef.current = null;
    }
  };

  const updateJoystickPosition = (touch: React.Touch) => {
    if (!joystickRef.current) return;
    
    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    let deltaX = (touch.clientX - centerX) / (rect.width / 2);
    let deltaY = (touch.clientY - centerY) / (rect.height / 2);
    
    // Clamp to circle
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    if (distance > 1) {
      deltaX /= distance;
      deltaY /= distance;
    }
    
    setJoystickPos({ x: deltaX, y: deltaY });
  };

  const handleJumpStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsJumping(true);
  };

  const handleJumpEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsJumping(false);
  };

  const handleBoostStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsBoosting(true);
  };

  const handleBoostEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsBoosting(false);
  };

  return (
    <div className="fixed inset-0 z-30 pointer-events-none">
      {/* Joystick - Left side */}
      <div 
        ref={joystickRef}
        className="absolute bottom-8 left-8 w-32 h-32 pointer-events-auto touch-none"
        onTouchStart={handleJoystickStart}
        onTouchMove={handleJoystickMove}
        onTouchEnd={handleJoystickEnd}
        onTouchCancel={handleJoystickEnd}
      >
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full bg-black/30 backdrop-blur-sm border-2 border-white/20" />
        
        {/* Direction indicators */}
        <div className="absolute inset-4 rounded-full border border-white/10" />
        
        {/* Inner joystick knob */}
        <div 
          className="absolute w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/60 border-2 border-white/40 shadow-lg transition-transform duration-75"
          style={{
            left: `calc(50% - 1.75rem + ${joystickPos.x * 40}px)`,
            top: `calc(50% - 1.75rem + ${joystickPos.y * 40}px)`,
          }}
        >
          <div className="absolute inset-1 rounded-full bg-white/20" />
        </div>
      </div>

      {/* Action buttons - Right side */}
      <div className="absolute bottom-8 right-8 flex flex-col gap-4 pointer-events-auto">
        {/* Jump button */}
        <button
          className={`w-16 h-16 rounded-full flex items-center justify-center touch-none transition-all duration-100 ${
            isJumping 
              ? 'bg-primary scale-90 shadow-lg shadow-primary/50' 
              : 'bg-black/30 backdrop-blur-sm border-2 border-white/20'
          }`}
          onTouchStart={handleJumpStart}
          onTouchEnd={handleJumpEnd}
          onTouchCancel={handleJumpEnd}
        >
          <ArrowUp className={`w-7 h-7 ${isJumping ? 'text-primary-foreground' : 'text-white/80'}`} />
        </button>

        {/* Boost button */}
        <button
          className={`w-16 h-16 rounded-full flex items-center justify-center touch-none transition-all duration-100 ${
            isBoosting 
              ? 'bg-orange-500 scale-90 shadow-lg shadow-orange-500/50' 
              : 'bg-black/30 backdrop-blur-sm border-2 border-white/20'
          }`}
          onTouchStart={handleBoostStart}
          onTouchEnd={handleBoostEnd}
          onTouchCancel={handleBoostEnd}
        >
          <Rocket className={`w-7 h-7 ${isBoosting ? 'text-white' : 'text-white/80'}`} />
        </button>
      </div>

      {/* Hint text */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-xs">
        Drag to move • Tap buttons to jump/boost
      </div>
    </div>
  );
};
