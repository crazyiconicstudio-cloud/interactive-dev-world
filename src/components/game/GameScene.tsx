import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { Car } from './Car';
import { Environment } from './Environment';
import { InteractiveZones } from './InteractiveZones';
import { Lighting } from './Lighting';
import { Sky } from './Sky';
import { CameraController } from './CameraController';
import { useKeyboardControls, Controls } from '@/hooks/useKeyboardControls';
import { useGameStore } from '@/stores/gameStore';
import { TouchControlState } from '@/hooks/useTouchControls';

interface GameSceneProps {
  isMobile?: boolean;
  touchControls?: TouchControlState;
}

export const GameScene = ({ isMobile = false, touchControls }: GameSceneProps) => {
  const keyboardControls = useKeyboardControls();
  const [carPosition, setCarPosition] = useState(new THREE.Vector3(0, 2, 0));
  const [carVelocity, setCarVelocity] = useState(0);
  const [carRotation, setCarRotation] = useState(0);
  const setLoading = useGameStore((state) => state.setLoading);
  const setCarSpeed = useGameStore((state) => state.setCarSpeed);

  // Merge keyboard and touch controls
  const controls: Controls = {
    forward: keyboardControls.forward || (touchControls?.forward ?? false),
    backward: keyboardControls.backward || (touchControls?.backward ?? false),
    left: keyboardControls.left || (touchControls?.left ?? false),
    right: keyboardControls.right || (touchControls?.right ?? false),
    jump: keyboardControls.jump || (touchControls?.jump ?? false),
    boost: keyboardControls.boost || (touchControls?.boost ?? false),
  };

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, [setLoading]);

  const handlePositionChange = (position: THREE.Vector3, velocity: number, rotation: number) => {
    setCarPosition(position);
    setCarVelocity(velocity);
    setCarRotation(rotation);
    setCarSpeed(velocity);
  };

  return (
    <Canvas
      shadows
      camera={{ position: [0, 10, 15], fov: 60 }}
      style={{ width: '100vw', height: '100vh' }}
      gl={{ 
        antialias: !isMobile, // Disable antialiasing on mobile for performance
        alpha: false,
        powerPreference: isMobile ? 'default' : 'high-performance',
        stencil: false,
      }}
      dpr={isMobile ? [1, 1.5] : [1, 2]} // Lower DPR on mobile
      onCreated={({ gl }) => {
        gl.setClearColor('#1a1520');
        gl.shadowMap.enabled = !isMobile; // Disable shadows on mobile
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.1;
      }}
    >
      <Sky />
      <Lighting isMobile={isMobile} />
      
      <Physics gravity={[0, -20, 0]}>
        <Car controls={controls} onPositionChange={handlePositionChange} />
        <Environment isMobile={isMobile} />
        <InteractiveZones carPosition={carPosition} />
      </Physics>

      <CameraController 
        target={carPosition} 
        carRotation={carRotation}
        carVelocity={carVelocity}
        isMobile={isMobile}
      />

      {/* Post-processing effects - simplified on mobile */}
      {!isMobile && (
        <EffectComposer>
          <Bloom 
            intensity={0.4}
            luminanceThreshold={0.8}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
          <Vignette 
            offset={0.3}
            darkness={0.5}
            eskil={false}
          />
        </EffectComposer>
      )}
    </Canvas>
  );
};
