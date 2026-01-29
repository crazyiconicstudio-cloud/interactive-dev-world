import { useGameStore } from '@/stores/gameStore';
import { Gamepad2, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Hand } from 'lucide-react';

interface InstructionsOverlayProps {
  isMobile?: boolean;
}

export const InstructionsOverlay = ({ isMobile = false }: InstructionsOverlayProps) => {
  const showInstructions = useGameStore((state) => state.showInstructions);
  const setShowInstructions = useGameStore((state) => state.setShowInstructions);
  const isLoading = useGameStore((state) => state.isLoading);

  if (isLoading || !showInstructions) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center animate-fade-in">
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-background/85 backdrop-blur-md" />
      
      {/* Content */}
      <div className="relative glass-panel p-8 md:p-10 max-w-xl mx-4 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <Gamepad2 className="w-8 h-8 text-primary" />
          <h2 className="text-3xl md:text-4xl font-bold gradient-text">
            Welcome
          </h2>
        </div>
        
        <p className="text-muted-foreground mb-8 text-center text-lg">
          Explore this 3D world to discover my work, skills, and experience!
        </p>

        {/* Controls grid - Different for mobile vs desktop */}
        {isMobile ? (
          <div className="grid gap-5 mb-8">
            {/* Touch controls */}
            <div className="glass-panel p-4 rounded-xl">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Touch Controls</h3>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <Hand className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Virtual Joystick</p>
                  <p className="text-sm text-muted-foreground">Drag left side to move</p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-panel p-4 rounded-xl text-center">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
                  <ArrowUp className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Jump Button</p>
              </div>
              <div className="glass-panel p-4 rounded-xl text-center">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl">🚀</span>
                </div>
                <p className="text-sm text-muted-foreground">Boost Button</p>
              </div>
            </div>

            {/* Camera control */}
            <div className="glass-panel p-4 rounded-xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                <span className="text-2xl">👆</span>
              </div>
              <div>
                <p className="font-medium">Swipe to Look</p>
                <p className="text-sm text-muted-foreground">Swipe on screen to rotate camera</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 mb-8">
            {/* Movement controls */}
            <div className="glass-panel p-4 rounded-xl">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Movement</h3>
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-center gap-1">
                  <div className="flex gap-1 justify-center">
                    <span className="instruction-key">W</span>
                  </div>
                  <div className="flex gap-1">
                    <span className="instruction-key">A</span>
                    <span className="instruction-key">S</span>
                    <span className="instruction-key">D</span>
                  </div>
                </div>
                <span className="text-muted-foreground text-2xl">or</span>
                <div className="flex flex-col items-center gap-1">
                  <div className="flex gap-1 justify-center">
                    <span className="instruction-key"><ArrowUp className="w-4 h-4" /></span>
                  </div>
                  <div className="flex gap-1">
                    <span className="instruction-key"><ArrowLeft className="w-4 h-4" /></span>
                    <span className="instruction-key"><ArrowDown className="w-4 h-4" /></span>
                    <span className="instruction-key"><ArrowRight className="w-4 h-4" /></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action controls */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-panel p-4 rounded-xl text-center">
                <span className="instruction-key mb-2 inline-block px-6">Space</span>
                <p className="text-sm text-muted-foreground mt-2">Jump</p>
              </div>
              <div className="glass-panel p-4 rounded-xl text-center">
                <span className="instruction-key mb-2 inline-block px-6">Shift</span>
                <p className="text-sm text-muted-foreground mt-2">Boost</p>
              </div>
            </div>

            {/* Camera control */}
            <div className="glass-panel p-4 rounded-xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                <span className="text-2xl">🖱️</span>
              </div>
              <div>
                <p className="font-medium">Click & Drag</p>
                <p className="text-sm text-muted-foreground">Rotate camera view</p>
              </div>
            </div>
          </div>
        )}

        {/* Tip */}
        <div className="text-center text-sm text-muted-foreground mb-6 p-3 rounded-lg bg-primary/5 border border-primary/10">
          <span className="text-primary">✨</span> Drive to the glowing markers to explore different sections
        </div>

        {/* Start button */}
        <button
          onClick={() => setShowInstructions(false)}
          className="btn-primary w-full text-primary-foreground font-semibold text-lg py-4 rounded-xl"
        >
          Start Exploring 🚀
        </button>
      </div>
    </div>
  );
};
