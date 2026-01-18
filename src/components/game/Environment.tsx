import { RigidBody } from '@react-three/rapier';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Enhanced low-poly tree component
const Tree = ({ position }: { position: [number, number, number] }) => {
  const scale = 0.8 + Math.random() * 0.6;
  const treeRef = useRef<THREE.Group>(null);
  
  // Subtle sway animation
  useFrame((state) => {
    if (treeRef.current) {
      treeRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.02;
    }
  });

  return (
    <group ref={treeRef} position={position} scale={scale}>
      {/* Trunk with bark texture simulation */}
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.18, 2, 8]} />
        <meshStandardMaterial 
          color="#5d4037" 
          roughness={0.95}
          metalness={0.05}
        />
      </mesh>
      {/* Foliage layers with depth variation */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <coneGeometry args={[1.3, 2.2, 8]} />
        <meshStandardMaterial 
          color="#1b5e20" 
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>
      <mesh position={[0, 3.6, 0]} castShadow>
        <coneGeometry args={[1.0, 1.7, 8]} />
        <meshStandardMaterial 
          color="#2e7d32" 
          roughness={0.85}
        />
      </mesh>
      <mesh position={[0, 4.5, 0]} castShadow>
        <coneGeometry args={[0.6, 1.2, 8]} />
        <meshStandardMaterial 
          color="#43a047" 
          roughness={0.85}
        />
      </mesh>
    </group>
  );
};

// Enhanced building with windows and gradients
const Building = ({ position, height, color }: { position: [number, number, number]; height: number; color: string }) => {
  const windowGlowIntensity = useRef(0);
  
  useFrame((state) => {
    windowGlowIntensity.current = 0.3 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
  });

  return (
    <RigidBody type="fixed" position={position} colliders="cuboid">
      {/* Main building body */}
      <mesh castShadow receiveShadow position={[0, height / 2, 0]}>
        <boxGeometry args={[3, height, 3]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      
      {/* Building trim/accent */}
      <mesh castShadow position={[0, 0.1, 0]}>
        <boxGeometry args={[3.1, 0.2, 3.1]} />
        <meshStandardMaterial color="#555" roughness={0.8} metalness={0.2} />
      </mesh>
      
      {/* Roof with slight overhang */}
      <mesh castShadow position={[0, height + 0.2, 0]}>
        <boxGeometry args={[3.3, 0.4, 3.3]} />
        <meshStandardMaterial color="#3d3d3d" roughness={0.6} metalness={0.3} />
      </mesh>
      
      {/* Roof top accent */}
      <mesh castShadow position={[0, height + 0.5, 0]}>
        <boxGeometry args={[2.5, 0.2, 2.5]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.5} metalness={0.4} />
      </mesh>
      
      {/* Windows with glow effect */}
      {Array.from({ length: Math.floor(height / 2) }).map((_, i) => (
        <group key={i}>
          {/* Front windows */}
          <mesh position={[0, 1.5 + i * 2, 1.51]}>
            <planeGeometry args={[2, 0.8]} />
            <meshStandardMaterial 
              color="#1a237e" 
              emissive="#4fc3f7" 
              emissiveIntensity={0.4}
              transparent
              opacity={0.9}
            />
          </mesh>
          {/* Back windows */}
          <mesh position={[0, 1.5 + i * 2, -1.51]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[2, 0.8]} />
            <meshStandardMaterial 
              color="#1a237e" 
              emissive="#4fc3f7" 
              emissiveIntensity={0.3}
              transparent
              opacity={0.9}
            />
          </mesh>
          {/* Side windows */}
          <mesh position={[1.51, 1.5 + i * 2, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[2, 0.8]} />
            <meshStandardMaterial 
              color="#1a237e" 
              emissive="#ffb74d" 
              emissiveIntensity={0.25 + (i % 2) * 0.15}
              transparent
              opacity={0.9}
            />
          </mesh>
          <mesh position={[-1.51, 1.5 + i * 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[2, 0.8]} />
            <meshStandardMaterial 
              color="#1a237e" 
              emissive="#ffb74d" 
              emissiveIntensity={0.25 + ((i + 1) % 2) * 0.15}
              transparent
              opacity={0.9}
            />
          </mesh>
        </group>
      ))}
      
      {/* Window light glow */}
      <pointLight position={[0, height / 2, 2]} color="#4fc3f7" intensity={0.3} distance={5} />
    </RigidBody>
  );
};

// Enhanced rock with better shading
const Rock = ({ position, scale }: { position: [number, number, number]; scale: number }) => {
  return (
    <RigidBody type="fixed" position={position} colliders="hull">
      <mesh castShadow scale={scale}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial 
          color="#6d6d6d" 
          roughness={0.95}
          metalness={0.05}
        />
      </mesh>
      {/* Secondary rock for variation */}
      <mesh castShadow position={[0.3, -0.2, 0.2]} scale={scale * 0.6}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial 
          color="#5a5a5a" 
          roughness={0.9}
        />
      </mesh>
    </RigidBody>
  );
};

// Street lamp component
const StreetLamp = ({ position }: { position: [number, number, number] }) => {
  return (
    <group position={position}>
      {/* Pole */}
      <mesh castShadow position={[0, 2, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 4, 8]} />
        <meshStandardMaterial color="#2c2c2c" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Lamp arm */}
      <mesh castShadow position={[0.4, 3.8, 0]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.04, 0.04, 0.8, 6]} />
        <meshStandardMaterial color="#2c2c2c" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Lamp head */}
      <mesh castShadow position={[0.7, 3.9, 0]}>
        <boxGeometry args={[0.3, 0.15, 0.2]} />
        <meshStandardMaterial color="#3a3a3a" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Light bulb */}
      <mesh position={[0.7, 3.8, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial 
          color="#fff8e1" 
          emissive="#ffcc80" 
          emissiveIntensity={2}
        />
      </mesh>
      <pointLight position={[0.7, 3.7, 0]} color="#ffcc80" intensity={1} distance={12} castShadow />
    </group>
  );
};

export const Environment = () => {
  // Generate random positions for trees
  const trees = useMemo(() => {
    const positions: [number, number, number][] = [];
    for (let i = 0; i < 45; i++) {
      let x, z;
      do {
        x = (Math.random() - 0.5) * 85;
        z = (Math.random() - 0.5) * 85;
      } while (Math.abs(x) < 8 && Math.abs(z) < 8);
      positions.push([x, 0, z]);
    }
    return positions;
  }, []);

  // Generate rocks
  const rocks = useMemo(() => {
    const positions: { pos: [number, number, number]; scale: number }[] = [];
    for (let i = 0; i < 18; i++) {
      const x = (Math.random() - 0.5) * 75;
      const z = (Math.random() - 0.5) * 75;
      positions.push({ pos: [x, 0.3, z], scale: 0.25 + Math.random() * 0.45 });
    }
    return positions;
  }, []);

  // Street lamp positions
  const lampPositions: [number, number, number][] = [
    [4, 0, 15], [-4, 0, 15], [4, 0, -15], [-4, 0, -15],
    [15, 0, 4], [15, 0, -4], [-15, 0, 4], [-15, 0, -4],
  ];

  // Grass patches for variation
  const grassPatches = useMemo(() => {
    const patches: { pos: [number, number, number]; scale: number; rotation: number }[] = [];
    for (let i = 0; i < 100; i++) {
      const x = (Math.random() - 0.5) * 90;
      const z = (Math.random() - 0.5) * 90;
      if (Math.abs(x) > 4 || Math.abs(z) > 4) {
        patches.push({ 
          pos: [x, 0.02, z], 
          scale: 1 + Math.random() * 2,
          rotation: Math.random() * Math.PI
        });
      }
    }
    return patches;
  }, []);

  return (
    <group>
      {/* Main ground plane with grass texture simulation */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial 
            color="#3d6b41" 
            roughness={0.95}
            metalness={0.02}
          />
        </mesh>
      </RigidBody>

      {/* Grass variation patches */}
      {grassPatches.map((patch, i) => (
        <mesh 
          key={`grass-${i}`} 
          rotation={[-Math.PI / 2, patch.rotation, 0]} 
          position={patch.pos}
        >
          <circleGeometry args={[patch.scale, 6]} />
          <meshStandardMaterial 
            color={i % 2 === 0 ? "#4a7c4e" : "#2d5a30"} 
            roughness={0.95}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}

      {/* Roads with asphalt texture */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[6.5, 100]} />
        <meshStandardMaterial 
          color="#2a2a2a" 
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[100, 6.5]} />
        <meshStandardMaterial 
          color="#2a2a2a" 
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>

      {/* Road edges/curbs */}
      <mesh position={[-3.4, 0.05, 0]}>
        <boxGeometry args={[0.15, 0.1, 100]} />
        <meshStandardMaterial color="#666" roughness={0.9} />
      </mesh>
      <mesh position={[3.4, 0.05, 0]}>
        <boxGeometry args={[0.15, 0.1, 100]} />
        <meshStandardMaterial color="#666" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.05, -3.4]}>
        <boxGeometry args={[100, 0.1, 0.15]} />
        <meshStandardMaterial color="#666" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.05, 3.4]}>
        <boxGeometry args={[100, 0.1, 0.15]} />
        <meshStandardMaterial color="#666" roughness={0.9} />
      </mesh>

      {/* Center lane markings (yellow) */}
      {Array.from({ length: 25 }).map((_, i) => (
        <mesh key={`center-h-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[-48 + i * 4, 0.02, 0]}>
          <planeGeometry args={[1.8, 0.12]} />
          <meshStandardMaterial color="#f9a825" emissive="#f9a825" emissiveIntensity={0.1} />
        </mesh>
      ))}
      {Array.from({ length: 25 }).map((_, i) => (
        <mesh key={`center-v-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -48 + i * 4]}>
          <planeGeometry args={[0.12, 1.8]} />
          <meshStandardMaterial color="#f9a825" emissive="#f9a825" emissiveIntensity={0.1} />
        </mesh>
      ))}

      {/* Side lane markings (white) */}
      {Array.from({ length: 12 }).map((_, i) => (
        <group key={`side-marks-${i}`}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-48 + i * 8, 0.02, 2.5]}>
            <planeGeometry args={[3, 0.15]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.05} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-48 + i * 8, 0.02, -2.5]}>
            <planeGeometry args={[3, 0.15]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.05} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2.5, 0.02, -48 + i * 8]}>
            <planeGeometry args={[0.15, 3]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.05} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2.5, 0.02, -48 + i * 8]}>
            <planeGeometry args={[0.15, 3]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.05} />
          </mesh>
        </group>
      ))}

      {/* Crosswalk at intersection */}
      {Array.from({ length: 8 }).map((_, i) => (
        <group key={`crosswalk-${i}`}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2.8 + i * 0.8, 0.025, 4]}>
            <planeGeometry args={[0.5, 2]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2.8 + i * 0.8, 0.025, -4]}>
            <planeGeometry args={[0.5, 2]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[4, 0.025, -2.8 + i * 0.8]}>
            <planeGeometry args={[2, 0.5]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-4, 0.025, -2.8 + i * 0.8]}>
            <planeGeometry args={[2, 0.5]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </group>
      ))}

      {/* Buildings with enhanced visuals */}
      <Building position={[15, 0, 15]} height={9} color="#e8d8c8" />
      <Building position={[-15, 0, 15]} height={7} color="#d4c8b8" />
      <Building position={[15, 0, -15]} height={11} color="#c8b8a8" />
      <Building position={[-15, 0, -15]} height={8} color="#f0e4d4" />
      <Building position={[25, 0, 0]} height={6} color="#e0d0c0" />
      <Building position={[-25, 0, 0]} height={10} color="#d0c0b0" />
      <Building position={[0, 0, 25]} height={7} color="#e4d4c4" />
      <Building position={[0, 0, -25]} height={9} color="#d8c8b8" />

      {/* Street lamps */}
      {lampPositions.map((pos, i) => (
        <StreetLamp key={i} position={pos} />
      ))}

      {/* Trees */}
      {trees.map((pos, i) => (
        <Tree key={i} position={pos} />
      ))}

      {/* Rocks */}
      {rocks.map((rock, i) => (
        <Rock key={i} position={rock.pos} scale={rock.scale} />
      ))}

      {/* Boundary walls (invisible) */}
      <RigidBody type="fixed" position={[0, 5, -50]} colliders="cuboid">
        <mesh>
          <boxGeometry args={[100, 10, 1]} />
          <meshStandardMaterial transparent opacity={0} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[0, 5, 50]} colliders="cuboid">
        <mesh>
          <boxGeometry args={[100, 10, 1]} />
          <meshStandardMaterial transparent opacity={0} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[-50, 5, 0]} colliders="cuboid">
        <mesh>
          <boxGeometry args={[1, 10, 100]} />
          <meshStandardMaterial transparent opacity={0} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[50, 5, 0]} colliders="cuboid">
        <mesh>
          <boxGeometry args={[1, 10, 100]} />
          <meshStandardMaterial transparent opacity={0} />
        </mesh>
      </RigidBody>
    </group>
  );
};
