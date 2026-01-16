import { RigidBody } from '@react-three/rapier';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

// Low-poly tree component
const Tree = ({ position }: { position: [number, number, number] }) => {
  const scale = 0.8 + Math.random() * 0.6;
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 2, 6]} />
        <meshStandardMaterial color="#8B4513" roughness={0.9} />
      </mesh>
      {/* Foliage - stacked cones for low-poly look */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <coneGeometry args={[1.2, 2, 6]} />
        <meshStandardMaterial color="#228B22" roughness={0.8} />
      </mesh>
      <mesh position={[0, 3.5, 0]} castShadow>
        <coneGeometry args={[0.9, 1.5, 6]} />
        <meshStandardMaterial color="#2E8B2E" roughness={0.8} />
      </mesh>
      <mesh position={[0, 4.3, 0]} castShadow>
        <coneGeometry args={[0.5, 1, 6]} />
        <meshStandardMaterial color="#32CD32" roughness={0.8} />
      </mesh>
    </group>
  );
};

// Low-poly building component
const Building = ({ position, height, color }: { position: [number, number, number]; height: number; color: string }) => {
  return (
    <RigidBody type="fixed" position={position} colliders="cuboid">
      <mesh castShadow receiveShadow position={[0, height / 2, 0]}>
        <boxGeometry args={[3, height, 3]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* Roof */}
      <mesh castShadow position={[0, height + 0.5, 0]}>
        <boxGeometry args={[3.2, 0.3, 3.2]} />
        <meshStandardMaterial color="#555" roughness={0.7} />
      </mesh>
      {/* Windows */}
      {Array.from({ length: Math.floor(height / 2) }).map((_, i) => (
        <group key={i}>
          <mesh position={[1.51, 1.5 + i * 2, 0]}>
            <boxGeometry args={[0.02, 0.8, 0.6]} />
            <meshStandardMaterial color="#87ceeb" emissive="#4a90d9" emissiveIntensity={0.2} />
          </mesh>
          <mesh position={[-1.51, 1.5 + i * 2, 0]}>
            <boxGeometry args={[0.02, 0.8, 0.6]} />
            <meshStandardMaterial color="#87ceeb" emissive="#4a90d9" emissiveIntensity={0.2} />
          </mesh>
        </group>
      ))}
    </RigidBody>
  );
};

// Rock component
const Rock = ({ position, scale }: { position: [number, number, number]; scale: number }) => {
  return (
    <RigidBody type="fixed" position={position} colliders="hull">
      <mesh castShadow scale={scale}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#777" roughness={0.9} />
      </mesh>
    </RigidBody>
  );
};

export const Environment = () => {
  // Generate random positions for trees
  const trees = useMemo(() => {
    const positions: [number, number, number][] = [];
    for (let i = 0; i < 40; i++) {
      let x, z;
      do {
        x = (Math.random() - 0.5) * 80;
        z = (Math.random() - 0.5) * 80;
      } while (Math.abs(x) < 8 && Math.abs(z) < 8); // Keep clear area in center
      positions.push([x, 0, z]);
    }
    return positions;
  }, []);

  // Generate rocks
  const rocks = useMemo(() => {
    const positions: { pos: [number, number, number]; scale: number }[] = [];
    for (let i = 0; i < 15; i++) {
      const x = (Math.random() - 0.5) * 70;
      const z = (Math.random() - 0.5) * 70;
      positions.push({ pos: [x, 0.5, z], scale: 0.3 + Math.random() * 0.5 });
    }
    return positions;
  }, []);

  return (
    <group>
      {/* Ground plane */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#4a7c4e" roughness={0.9} />
        </mesh>
      </RigidBody>

      {/* Roads - Main cross */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[6, 100]} />
        <meshStandardMaterial color="#333" roughness={0.8} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[100, 6]} />
        <meshStandardMaterial color="#333" roughness={0.8} />
      </mesh>

      {/* Road markings */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh key={`line-h-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[-45 + i * 5, 0.02, 0]}>
          <planeGeometry args={[2, 0.2]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
      ))}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh key={`line-v-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -45 + i * 5]}>
          <planeGeometry args={[0.2, 2]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
      ))}

      {/* Buildings */}
      <Building position={[15, 0, 15]} height={8} color="#e8d4c4" />
      <Building position={[-15, 0, 15]} height={6} color="#d4c4b4" />
      <Building position={[15, 0, -15]} height={10} color="#c4b4a4" />
      <Building position={[-15, 0, -15]} height={7} color="#f0e0d0" />
      <Building position={[25, 0, 0]} height={5} color="#ddd" />
      <Building position={[-25, 0, 0]} height={9} color="#ccc" />
      <Building position={[0, 0, 25]} height={6} color="#e0d0c0" />
      <Building position={[0, 0, -25]} height={8} color="#d0c0b0" />

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
