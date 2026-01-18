import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Lighting = () => {
  const sunRef = useRef<THREE.DirectionalLight>(null);

  useFrame((state) => {
    // Subtle sun movement for dynamic shadows
    if (sunRef.current) {
      const time = state.clock.elapsedTime * 0.02;
      sunRef.current.position.x = 30 + Math.sin(time) * 5;
    }
  });

  return (
    <>
      {/* Warm ambient light for base illumination */}
      <ambientLight intensity={0.35} color="#ffeedd" />

      {/* Main directional light (sun) with soft shadows */}
      <directionalLight
        ref={sunRef}
        position={[35, 60, 25]}
        intensity={1.8}
        color="#fff5e6"
        castShadow
        shadow-mapSize={[4096, 4096]}
        shadow-camera-far={120}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
        shadow-bias={-0.0001}
        shadow-normalBias={0.02}
        shadow-radius={2}
      />

      {/* Warm fill light from opposite side */}
      <directionalLight
        position={[-25, 35, -15]}
        intensity={0.4}
        color="#ffccaa"
      />

      {/* Cool fill light for contrast */}
      <directionalLight
        position={[0, 20, -40]}
        intensity={0.25}
        color="#a0c4ff"
      />

      {/* Hemisphere light for sky/ground ambient with sunset colors */}
      <hemisphereLight
        args={['#ffa07a', '#3d6b41', 0.6]}
      />

      {/* Subtle rim light for depth */}
      <directionalLight
        position={[-30, 10, 30]}
        intensity={0.2}
        color="#ff9966"
      />

      {/* Atmospheric fog for depth - adjusted for sunset theme */}
      <fog attach="fog" args={['#2d1b3d', 25, 90]} />

      {/* Ground reflection light */}
      <pointLight
        position={[0, 0.5, 0]}
        intensity={0.15}
        color="#4a7c4e"
        distance={50}
      />
    </>
  );
};
