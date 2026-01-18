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
import { useKeyboardControls } from '@/hooks/useKeyboardControls';
import { useGameStore } from '@/stores/gameStore';

export const GameScene = () => {
  const controls = useKeyboardControls();
  const [carPosition, setCarPosition] = useState(new THREE.Vector3(0, 2, 0));
  const [carVelocity, setCarVelocity] = useState(0);
  const [carRotation, setCarRotation] = useState(0);
  const setLoading = useGameStore((state) => state.setLoading);
  const setCarSpeed = useGameStore((state) => state.setCarSpeed);

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
        antialias: true, 
        alpha: false,
        powerPreference: 'high-performance',
        stencil: false,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor('#1a1520');
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.1;
      }}
    >
      <Sky />
      <Lighting />
      
      <Physics gravity={[0, -20, 0]}>
        <Car controls={controls} onPositionChange={handlePositionChange} />
        <Environment />
        <InteractiveZones carPosition={carPosition} />
      </Physics>

      <CameraController 
        target={carPosition} 
        carRotation={carRotation}
        carVelocity={carVelocity}
      />

      {/* Post-processing effects for premium look */}
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
    </Canvas>
  );
};
