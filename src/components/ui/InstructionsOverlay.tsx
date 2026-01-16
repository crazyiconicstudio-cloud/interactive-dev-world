import { useGameStore } from '@/stores/gameStore';

export const InstructionsOverlay = () => {
  const showInstructions = useGameStore((state) => state.showInstructions);
  const setShowInstructions = useGameStore((state) => state.setShowInstructions);
  const isLoading = useGameStore((state) => state.isLoading);

  if (isLoading || !showInstructions) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-slide-up">
      <div className="glass-panel p-8 max-w-lg mx-4">
        <h2 className="text-3xl font-bold gradient-text mb-6 text-center">
          Welcome to My Portfolio
        </h2>
        
        <p className="text-muted-foreground mb-6 text-center">
          Explore this 3D world to discover my work, skills, and experience!
        </p>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              <span className="instruction-key">W</span>
              <span className="instruction-key">A</span>
              <span className="instruction-key">S</span>
              <span className="instruction-key">D</span>
            </div>
            <span className="text-foreground">or Arrow keys to move</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="instruction-key">Space</span>
            <span className="text-foreground">to jump</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="instruction-key">Shift</span>
            <span className="text-foreground">to boost</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="instruction-key">🖱️ Drag</span>
            <span className="text-foreground">to rotate camera</span>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground mb-6">
          Drive to the glowing markers to explore different sections
        </div>

        <button
          onClick={() => setShowInstructions(false)}
          className="btn-primary w-full text-primary-foreground font-semibold"
        >
          Start Exploring 🚀
        </button>
      </div>
    </div>
  );
};
