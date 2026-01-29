import { useGameStore } from '@/stores/gameStore';
import { Volume2, VolumeX, HelpCircle, Gauge } from 'lucide-react';

interface GameHUDProps {
  isMobile?: boolean;
}

export const GameHUD = ({ isMobile = false }: GameHUDProps) => {
  const isMuted = useGameStore((state) => state.isMuted);
  const toggleMute = useGameStore((state) => state.toggleMute);
  const setShowInstructions = useGameStore((state) => state.setShowInstructions);
  const isLoading = useGameStore((state) => state.isLoading);
  const showInstructions = useGameStore((state) => state.showInstructions);
  const carSpeed = useGameStore((state) => state.carSpeed);

  if (isLoading || showInstructions) return null;

  const speedKmh = Math.round(carSpeed * 8); // Convert to display units
  const speedPercentage = Math.min((carSpeed / 14) * 100, 100);

  return (
    <>
      {/* Top left - Brand */}
      <div className="fixed top-6 left-6 z-20">
        <h1 className="text-2xl font-bold gradient-text glow-text tracking-tight">
          Developer Portfolio
        </h1>
        <p className="text-sm text-muted-foreground font-medium">
          Explore & Discover
        </p>
      </div>

      {/* Top right - Controls */}
      <div className="fixed top-6 right-6 z-20 flex gap-2">
        <button
          onClick={() => setShowInstructions(true)}
          className="glass-panel p-3 hover:scale-110 transition-all duration-200 hover:shadow-lg"
          title="Show instructions"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
        <button
          onClick={toggleMute}
          className="glass-panel p-3 hover:scale-110 transition-all duration-200 hover:shadow-lg"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>

      {/* Speed indicator */}
      <div className="fixed bottom-6 right-6 z-20 glass-panel p-4 min-w-[140px]">
        <div className="flex items-center gap-2 mb-2">
          <Gauge className="w-4 h-4 text-primary" />
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Speed</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold gradient-text tabular-nums">{speedKmh}</span>
          <span className="text-sm text-muted-foreground">km/h</span>
        </div>
        {/* Speed bar */}
        <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full loading-bar transition-all duration-150 ease-out"
            style={{ width: `${speedPercentage}%` }}
          />
        </div>
      </div>

      {/* Bottom left - Mini controls hint (desktop only) */}
      {!isMobile && (
        <div className="fixed bottom-6 left-6 z-20 glass-panel px-4 py-3">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex flex-col gap-1">
              <div className="flex gap-1 justify-center">
                <kbd className="instruction-key text-xs px-2 py-0.5 min-w-[1.5rem] h-6">W</kbd>
              </div>
              <div className="flex gap-1">
                <kbd className="instruction-key text-xs px-2 py-0.5 min-w-[1.5rem] h-6">A</kbd>
                <kbd className="instruction-key text-xs px-2 py-0.5 min-w-[1.5rem] h-6">S</kbd>
                <kbd className="instruction-key text-xs px-2 py-0.5 min-w-[1.5rem] h-6">D</kbd>
              </div>
            </div>
            <div className="text-muted-foreground text-xs">
              <p>Move</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="flex flex-col gap-1 items-center">
              <kbd className="instruction-key text-xs px-2 py-0.5 h-6">Space</kbd>
              <span className="text-muted-foreground text-xs">Jump</span>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="flex flex-col gap-1 items-center">
              <kbd className="instruction-key text-xs px-2 py-0.5 h-6">Shift</kbd>
              <span className="text-muted-foreground text-xs">Boost</span>
            </div>
          </div>
        </div>
      )}

      {/* Center top - Compass/Direction indicator */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-20">
        <div className="glass-panel px-4 py-2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
            Exploring
          </span>
        </div>
      </div>
    </>
  );
};
