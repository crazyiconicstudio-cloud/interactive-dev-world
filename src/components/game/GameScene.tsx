import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
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
  const setLoading = useGameStore((state) => state.setLoading);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [setLoading]);

  return (
    <Canvas
      shadows
      camera={{ position: [0, 10, 15], fov: 60 }}
      style={{ width: '100vw', height: '100vh' }}
      gl={{ antialias: true, alpha: false }}
      onCreated={({ gl }) => {
        gl.setClearColor('#1a1520');
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
      }}
    >
      <Sky />
      <Lighting />
      
      <Physics gravity={[0, -20, 0]}>
        <Car controls={controls} onPositionChange={setCarPosition} />
        <Environment />
        <InteractiveZones carPosition={carPosition} />
      </Physics>

      <CameraController target={carPosition} />
    </Canvas>
  );
};
