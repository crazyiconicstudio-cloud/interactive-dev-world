import { useGameStore } from '@/stores/gameStore';
import { Volume2, VolumeX, HelpCircle, Compass } from 'lucide-react';

export const GameHUD = () => {
  const isMuted = useGameStore((state) => state.isMuted);
  const toggleMute = useGameStore((state) => state.toggleMute);
  const setShowInstructions = useGameStore((state) => state.setShowInstructions);
  const isLoading = useGameStore((state) => state.isLoading);
  const showInstructions = useGameStore((state) => state.showInstructions);

  if (isLoading || showInstructions) return null;

  return (
    <>
      {/* Top left - Brand */}
      <div className="fixed top-6 left-6 z-20">
        <h1 className="text-2xl font-bold gradient-text glow-text">
          Developer Portfolio
        </h1>
        <p className="text-sm text-muted-foreground">
          Explore & Discover
        </p>
      </div>

      {/* Top right - Controls */}
      <div className="fixed top-6 right-6 z-20 flex gap-2">
        <button
          onClick={() => setShowInstructions(true)}
          className="glass-panel p-3 hover:scale-110 transition-transform"
          title="Show instructions"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
        <button
          onClick={toggleMute}
          className="glass-panel p-3 hover:scale-110 transition-transform"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>

      {/* Bottom left - Mini controls hint */}
      <div className="fixed bottom-6 left-6 z-20 glass-panel px-4 py-2">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="flex gap-1">
            <kbd className="instruction-key text-xs px-2 py-1">W</kbd>
            <kbd className="instruction-key text-xs px-2 py-1">A</kbd>
            <kbd className="instruction-key text-xs px-2 py-1">S</kbd>
            <kbd className="instruction-key text-xs px-2 py-1">D</kbd>
          </span>
          <span>Move</span>
          <span className="text-muted">|</span>
          <kbd className="instruction-key text-xs px-2 py-1">Space</kbd>
          <span>Jump</span>
        </div>
      </div>

      {/* Compass indicator */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-20">
        <div className="glass-panel p-2">
          <Compass className="w-6 h-6 text-primary animate-spin-slow" style={{ animationDuration: '20s' }} />
        </div>
      </div>
    </>
  );
};
