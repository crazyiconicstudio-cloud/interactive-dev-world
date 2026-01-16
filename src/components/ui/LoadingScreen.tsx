import { useEffect, useState } from 'react';
import { useGameStore } from '@/stores/gameStore';

export const LoadingScreen = () => {
  const isLoading = useGameStore((state) => state.isLoading);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  if (!isLoading && progress >= 100) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      {/* Animated car icon */}
      <div className="mb-8 text-6xl animate-float">🚗</div>
      
      <h1 className="text-4xl font-bold gradient-text mb-4">
        Loading Portfolio...
      </h1>
      
      <p className="text-muted-foreground mb-8">
        Preparing your adventure
      </p>

      {/* Progress bar */}
      <div className="w-64 h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full loading-bar transition-all duration-200 ease-out"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      
      <p className="mt-4 text-sm text-muted-foreground font-mono">
        {Math.min(Math.floor(progress), 100)}%
      </p>
    </div>
  );
};
