import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Lighting = () => {
  const sunRef = useRef<THREE.DirectionalLight>(null);

  return (
    <>
      {/* Ambient light for base illumination */}
      <ambientLight intensity={0.4} color="#ffeedd" />

      {/* Main directional light (sun) */}
      <directionalLight
        ref={sunRef}
        position={[30, 50, 20]}
        intensity={1.5}
        color="#fff5e6"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
        shadow-bias={-0.0001}
      />

      {/* Secondary fill light */}
      <directionalLight
        position={[-20, 30, -10]}
        intensity={0.3}
        color="#a0c4ff"
      />

      {/* Hemisphere light for sky/ground ambient */}
      <hemisphereLight
        args={['#87ceeb', '#4a7c4e', 0.5]}
      />

      {/* Fog for atmosphere */}
      <fog attach="fog" args={['#1a1520', 30, 80]} />
    </>
  );
};
