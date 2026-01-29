import { Suspense } from 'react';
import { GameScene } from '@/components/game/GameScene';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { InstructionsOverlay } from '@/components/ui/InstructionsOverlay';
import { PortfolioPanel } from '@/components/ui/PortfolioPanel';
import { GameHUD } from '@/components/ui/GameHUD';
import { MobileFallback } from '@/components/ui/MobileFallback';

const Index = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Loading Screen */}
      <LoadingScreen />
      
      {/* Mobile Fallback */}
      <MobileFallback />
      
      {/* Main 3D Game */}
      <Suspense fallback={null}>
        <GameScene />
      </Suspense>
      
      {/* UI Overlays */}
      <InstructionsOverlay />
      <GameHUD />
      <PortfolioPanel />
    </div>
  );
};

export default Index;
