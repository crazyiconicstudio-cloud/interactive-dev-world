import { useRef, useEffect } from 'react';
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
  const setActiveZone = useGameStore((state) => state.setActiveZone);
  const activeZone = useGameStore((state) => state.activeZone);

  useFrame((state) => {
    if (markerRef.current) {
      // Float animation
      markerRef.current.position.y = 2 + Math.sin(state.clock.elapsedTime * 2 + zone.position[0]) * 0.3;
      
      // Check distance to car
      const zonePos = new THREE.Vector3(...zone.position);
      const distance = carPosition.distanceTo(zonePos);
      
      if (distance < 4) {
        setActiveZone(zone.id);
      } else if (activeZone === zone.id) {
        setActiveZone(null);
      }
    }
  });

  return (
    <group ref={markerRef} position={zone.position}>
      {/* Glowing ring on ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.9, 0]}>
        <ringGeometry args={[2.5, 3, 32]} />
        <meshBasicMaterial color={zone.color} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Floating marker */}
      <mesh castShadow>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial 
          color={zone.color} 
          emissive={zone.color} 
          emissiveIntensity={0.3}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* Icon display */}
      <Html center position={[0, 0, 0]} style={{ pointerEvents: 'none' }}>
        <div className="text-3xl select-none">{zone.icon}</div>
      </Html>

      {/* Label */}
      <Html center position={[0, 1.5, 0]} style={{ pointerEvents: 'none' }}>
        <div className="glass-panel px-3 py-1 text-sm font-semibold whitespace-nowrap text-foreground">
          {zone.label}
        </div>
      </Html>

      {/* Light beam */}
      <pointLight color={zone.color} intensity={2} distance={10} />
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
