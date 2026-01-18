import { useEffect, useState } from 'react';
import { useGameStore } from '@/stores/gameStore';

export const LoadingScreen = () => {
  const isLoading = useGameStore((state) => state.isLoading);
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing...');

  useEffect(() => {
    if (isLoading) {
      const loadingStages = [
        { at: 15, text: 'Loading 3D assets...' },
        { at: 35, text: 'Building environment...' },
        { at: 55, text: 'Setting up physics...' },
        { at: 75, text: 'Preparing interactive zones...' },
        { at: 90, text: 'Almost ready...' },
      ];

      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          const newProgress = prev + Math.random() * 12 + 3;
          
          // Update loading text based on progress
          const stage = loadingStages.find(s => newProgress >= s.at && prev < s.at);
          if (stage) {
            setLoadingText(stage.text);
          }
          
          return Math.min(newProgress, 100);
        });
      }, 120);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  if (!isLoading && progress >= 100) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Animated car icon with road */}
      <div className="relative mb-10">
        <div className="relative">
          {/* Road underneath */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-muted rounded-full" />
          {/* Moving dashes on road */}
          <div className="absolute bottom-0.5 left-0 w-full overflow-hidden h-0.5">
            <div className="flex gap-2 animate-[slide_0.5s_linear_infinite]">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-3 h-0.5 bg-muted-foreground/50 rounded-full" />
              ))}
            </div>
          </div>
          {/* Car */}
          <div className="text-6xl animate-bounce" style={{ animationDuration: '1.5s' }}>
            🚗
          </div>
        </div>
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-3 text-center">
        Loading Portfolio
      </h1>
      
      <p className="text-muted-foreground mb-8 text-center h-6 transition-all duration-300">
        {loadingText}
      </p>

      {/* Progress bar container */}
      <div className="relative w-72 md:w-80">
        {/* Background track */}
        <div className="h-3 bg-muted rounded-full overflow-hidden shadow-inner">
          {/* Animated gradient fill */}
          <div 
            className="h-full loading-bar transition-all duration-300 ease-out relative"
            style={{ width: `${Math.min(progress, 100)}%` }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
        </div>
        
        {/* Percentage display */}
        <div className="flex justify-between items-center mt-3">
          <span className="text-xs text-muted-foreground">Loading...</span>
          <span className="text-sm font-mono font-semibold gradient-text">
            {Math.min(Math.floor(progress), 100)}%
          </span>
        </div>
      </div>

      {/* Tips section */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <p className="text-xs text-muted-foreground/60 max-w-md">
          💡 Tip: Use WASD or Arrow keys to drive, Space to jump, and Shift to boost!
        </p>
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/40 rounded-full animate-float"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${3 + i * 0.5}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
