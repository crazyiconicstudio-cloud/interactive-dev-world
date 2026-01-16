import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { Controls } from '@/hooks/useKeyboardControls';

interface CarProps {
  controls: Controls;
  onPositionChange: (position: THREE.Vector3) => void;
}

export const Car = ({ controls, onPositionChange }: CarProps) => {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const carRef = useRef<THREE.Group>(null);
  const velocity = useRef(new THREE.Vector3());
  const rotation = useRef(0);

  useFrame((state, delta) => {
    if (!rigidBodyRef.current || !carRef.current) return;

    const speed = controls.boost ? 12 : 6;
    const turnSpeed = 2.5;
    const friction = 0.95;

    // Get current velocity
    const currentVel = rigidBodyRef.current.linvel();
    velocity.current.set(currentVel.x, currentVel.y, currentVel.z);

    // Calculate movement direction based on car rotation
    const forward = new THREE.Vector3(
      -Math.sin(rotation.current),
      0,
      -Math.cos(rotation.current)
    );

    // Handle turning
    if (controls.left) rotation.current += turnSpeed * delta;
    if (controls.right) rotation.current -= turnSpeed * delta;

    // Apply movement force
    const moveForce = new THREE.Vector3();
    if (controls.forward) {
      moveForce.add(forward.clone().multiplyScalar(speed));
    }
    if (controls.backward) {
      moveForce.add(forward.clone().multiplyScalar(-speed * 0.5));
    }

    // Apply forces with friction
    const newVel = new THREE.Vector3(
      (velocity.current.x + moveForce.x * delta * 10) * friction,
      velocity.current.y,
      (velocity.current.z + moveForce.z * delta * 10) * friction
    );

    // Jump
    if (controls.jump && Math.abs(currentVel.y) < 0.1) {
      newVel.y = 8;
    }

    rigidBodyRef.current.setLinvel(newVel, true);

    // Update car visual rotation
    carRef.current.rotation.y = rotation.current;

    // Report position for camera follow
    const pos = rigidBodyRef.current.translation();
    onPositionChange(new THREE.Vector3(pos.x, pos.y, pos.z));
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={[0, 2, 0]}
      colliders="cuboid"
      mass={1}
      linearDamping={0.5}
      angularDamping={0.5}
      lockRotations
    >
      <group ref={carRef}>
        {/* Car Body */}
        <mesh castShadow position={[0, 0.4, 0]}>
          <boxGeometry args={[1.2, 0.5, 2]} />
          <meshStandardMaterial color="#ff6b35" metalness={0.6} roughness={0.3} />
        </mesh>
        
        {/* Car Top/Cabin */}
        <mesh castShadow position={[0, 0.8, -0.2]}>
          <boxGeometry args={[1, 0.4, 1]} />
          <meshStandardMaterial color="#ff8c5a" metalness={0.5} roughness={0.4} />
        </mesh>

        {/* Windows */}
        <mesh position={[0, 0.85, 0.3]}>
          <boxGeometry args={[0.9, 0.3, 0.05]} />
          <meshStandardMaterial color="#87ceeb" metalness={0.8} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.85, -0.7]}>
          <boxGeometry args={[0.9, 0.3, 0.05]} />
          <meshStandardMaterial color="#87ceeb" metalness={0.8} roughness={0.1} />
        </mesh>

        {/* Wheels */}
        {[
          [-0.6, 0.15, 0.6],
          [0.6, 0.15, 0.6],
          [-0.6, 0.15, -0.6],
          [0.6, 0.15, -0.6],
        ].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 0.15, 16]} />
            <meshStandardMaterial color="#333" metalness={0.3} roughness={0.8} />
          </mesh>
        ))}

        {/* Headlights */}
        <mesh position={[-0.35, 0.4, 1]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#ffff99" emissive="#ffff00" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0.35, 0.4, 1]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#ffff99" emissive="#ffff00" emissiveIntensity={0.5} />
        </mesh>

        {/* Taillights */}
        <mesh position={[-0.4, 0.4, -1]}>
          <boxGeometry args={[0.15, 0.1, 0.05]} />
          <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[0.4, 0.4, -1]}>
          <boxGeometry args={[0.15, 0.1, 0.05]} />
          <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.3} />
        </mesh>
      </group>
    </RigidBody>
  );
};
