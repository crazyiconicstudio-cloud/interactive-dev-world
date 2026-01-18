import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { ZoneType, useGameStore } from '@/stores/gameStore';

interface Zone {
  id: ZoneType;
  position: [number, number, number];
  color: string;
  label: string;
  icon: string;
}

const zones: Zone[] = [
  { id: 'about', position: [10, 0, 0], color: '#ff6b35', label: 'About Me', icon: '👤' },
  { id: 'skills', position: [0, 0, 10], color: '#f7c548', label: 'Skills', icon: '⚡' },
  { id: 'projects', position: [-10, 0, 0], color: '#9b5de5', label: 'Projects', icon: '🚀' },
  { id: 'experience', position: [0, 0, -10], color: '#00f5d4', label: 'Experience', icon: '💼' },
  { id: 'contact', position: [8, 0, 8], color: '#f15bb5', label: 'Contact', icon: '✉️' },
];

interface ZoneMarkerProps {
  zone: Zone;
  carPosition: THREE.Vector3;
}

const ZoneMarker = ({ zone, carPosition }: ZoneMarkerProps) => {
  const markerRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.PointLight>(null);
  const setActiveZone = useGameStore((state) => state.setActiveZone);
  const activeZone = useGameStore((state) => state.activeZone);
  
  const isActive = activeZone === zone.id;
  const pulsePhase = useRef(Math.random() * Math.PI * 2);

  useFrame((state) => {
    if (markerRef.current) {
      // Floating animation with unique phase
      markerRef.current.position.y = 2.2 + Math.sin(state.clock.elapsedTime * 2 + pulsePhase.current) * 0.4;
      
      // Gentle rotation
      markerRef.current.rotation.y += 0.008;
    }

    // Animated rings
    if (ringRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 3 + pulsePhase.current) * 0.5 + 0.5;
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = 0.4 + pulse * 0.3;
      ringRef.current.scale.setScalar(1 + pulse * 0.15);
    }

    if (outerRingRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2 + pulsePhase.current + 1) * 0.5 + 0.5;
      (outerRingRef.current.material as THREE.MeshBasicMaterial).opacity = 0.2 + pulse * 0.2;
      outerRingRef.current.scale.setScalar(1 + pulse * 0.2);
      outerRingRef.current.rotation.z += 0.005;
    }

    // Glow intensity pulse
    if (glowRef.current) {
      const glowPulse = Math.sin(state.clock.elapsedTime * 4 + pulsePhase.current) * 0.5 + 0.5;
      glowRef.current.intensity = 2 + glowPulse * 2;
    }

    // Check distance to car
    const zonePos = new THREE.Vector3(...zone.position);
    const distance = carPosition.distanceTo(zonePos);
    
    if (distance < 4) {
      setActiveZone(zone.id);
    } else if (activeZone === zone.id) {
      setActiveZone(null);
    }
  });

  return (
    <group position={zone.position}>
      {/* Ground glow effect */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[4, 32]} />
        <meshBasicMaterial 
          color={zone.color} 
          transparent 
          opacity={0.1}
        />
      </mesh>

      {/* Inner animated ring */}
      <mesh 
        ref={ringRef}
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0.03, 0]}
      >
        <ringGeometry args={[2.2, 2.8, 32]} />
        <meshBasicMaterial 
          color={zone.color} 
          transparent 
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Outer animated ring */}
      <mesh 
        ref={outerRingRef}
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0.025, 0]}
      >
        <ringGeometry args={[3.2, 3.6, 32]} />
        <meshBasicMaterial 
          color={zone.color} 
          transparent 
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Radial lines */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, (i * Math.PI) / 3]}
          position={[0, 0.04, 0]}
        >
          <planeGeometry args={[0.05, 3.5]} />
          <meshBasicMaterial color={zone.color} transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* Floating marker */}
      <group ref={markerRef}>
        {/* Main crystal shape */}
        <mesh castShadow>
          <octahedronGeometry args={[0.8, 0]} />
          <meshStandardMaterial 
            color={zone.color} 
            emissive={zone.color} 
            emissiveIntensity={0.5}
            metalness={0.6}
            roughness={0.2}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Inner glow core */}
        <mesh>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshBasicMaterial 
            color={zone.color} 
            transparent 
            opacity={0.8}
          />
        </mesh>

        {/* Icon display */}
        <Html center position={[0, 0, 0]} style={{ pointerEvents: 'none' }}>
          <div className="text-3xl select-none drop-shadow-lg">{zone.icon}</div>
        </Html>

        {/* Label */}
        <Html center position={[0, 1.6, 0]} style={{ pointerEvents: 'none' }}>
          <div 
            className={`
              px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap
              backdrop-blur-xl border border-white/20
              transition-all duration-300
              ${isActive ? 'scale-110 shadow-2xl' : 'scale-100'}
            `}
            style={{ 
              background: `linear-gradient(135deg, ${zone.color}40, ${zone.color}20)`,
              color: '#fff',
              boxShadow: isActive ? `0 0 30px ${zone.color}60` : `0 0 15px ${zone.color}30`,
            }}
          >
            {zone.label}
          </div>
        </Html>
      </group>

      {/* Light source */}
      <pointLight 
        ref={glowRef}
        color={zone.color} 
        intensity={3} 
        distance={12}
        position={[0, 2, 0]}
      />

      {/* Ground light */}
      <spotLight
        color={zone.color}
        intensity={0.8}
        distance={8}
        angle={Math.PI / 4}
        penumbra={0.8}
        position={[0, 4, 0]}
        target-position={[0, 0, 0]}
      />
    </group>
  );
};

interface InteractiveZonesProps {
  carPosition: THREE.Vector3;
}

export const InteractiveZones = ({ carPosition }: InteractiveZonesProps) => {
  return (
    <group>
      {zones.map((zone) => (
        <ZoneMarker key={zone.id} zone={zone} carPosition={carPosition} />
      ))}
    </group>
  );
};
