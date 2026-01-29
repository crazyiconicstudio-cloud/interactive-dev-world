import { Suspense, useState, useEffect } from 'react';
import { GameScene } from '@/components/game/GameScene';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { InstructionsOverlay } from '@/components/ui/InstructionsOverlay';
import { PortfolioPanel } from '@/components/ui/PortfolioPanel';
import { GameHUD } from '@/components/ui/GameHUD';
import { TouchControls } from '@/components/ui/TouchControls';
import { useTouchControls } from '@/hooks/useTouchControls';

const Index = () => {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const { controls: touchControls, updateControls } = useTouchControls();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || 
        ('ontouchstart' in window && window.innerWidth < 1024) ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Wait until we know if it's mobile
  if (isMobile === null) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🚗</div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <LoadingScreen />
      
      <Suspense fallback={null}>
        <GameScene isMobile={isMobile} touchControls={touchControls} />
      </Suspense>
      
      <InstructionsOverlay isMobile={isMobile} />
      <GameHUD isMobile={isMobile} />
      <PortfolioPanel />
      
      {/* Touch controls for mobile */}
      {isMobile && <TouchControls onControlChange={updateControls} />}
    </div>
  );
};

export default Index;
