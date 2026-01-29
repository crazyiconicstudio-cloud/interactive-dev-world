import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LightingProps {
  isMobile?: boolean;
}

export const Lighting = ({ isMobile = false }: LightingProps) => {
  const sunRef = useRef<THREE.DirectionalLight>(null);

  useFrame((state) => {
    // Subtle sun movement for dynamic shadows (skip on mobile for performance)
    if (sunRef.current && !isMobile) {
      const time = state.clock.elapsedTime * 0.02;
      sunRef.current.position.x = 30 + Math.sin(time) * 5;
    }
  });

  return (
    <>
      {/* Warm ambient light for base illumination */}
      <ambientLight intensity={isMobile ? 0.5 : 0.35} color="#ffeedd" />

      {/* Main directional light (sun) with shadows (reduced quality on mobile) */}
      <directionalLight
        ref={sunRef}
        position={[35, 60, 25]}
        intensity={1.8}
        color="#fff5e6"
        castShadow={!isMobile}
        shadow-mapSize={isMobile ? [1024, 1024] : [4096, 4096]}
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

      {/* Cool fill light for contrast (skip on mobile) */}
      {!isMobile && (
        <directionalLight
          position={[0, 20, -40]}
          intensity={0.25}
          color="#a0c4ff"
        />
      )}

      {/* Hemisphere light for sky/ground ambient with sunset colors */}
      <hemisphereLight
        args={['#ffa07a', '#3d6b41', 0.6]}
      />

      {/* Subtle rim light for depth (skip on mobile) */}
      {!isMobile && (
        <directionalLight
          position={[-30, 10, 30]}
          intensity={0.2}
          color="#ff9966"
        />
      )}

      {/* Atmospheric fog for depth - adjusted for sunset theme */}
      <fog attach="fog" args={['#2d1b3d', isMobile ? 35 : 25, isMobile ? 70 : 90]} />

      {/* Ground reflection light (skip on mobile) */}
      {!isMobile && (
        <pointLight
          position={[0, 0.5, 0]}
          intensity={0.15}
          color="#4a7c4e"
          distance={50}
        />
      )}
    </>
  );
};
