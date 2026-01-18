import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { Controls } from '@/hooks/useKeyboardControls';

interface CarProps {
  controls: Controls;
  onPositionChange: (position: THREE.Vector3, velocity: number, rotation: number) => void;
}

export const Car = ({ controls, onPositionChange }: CarProps) => {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const carRef = useRef<THREE.Group>(null);
  const wheelsRef = useRef<THREE.Mesh[]>([]);
  const velocity = useRef(new THREE.Vector3());
  const rotation = useRef(0);
  const wheelRotation = useRef(0);
  const suspensionOffset = useRef([0, 0, 0, 0]);
  const steeringAngle = useRef(0);

  // Materials
  const bodyMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#ff6b35',
    metalness: 0.8,
    roughness: 0.2,
    envMapIntensity: 1.5,
  }), []);

  const bodyAccentMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#ff8c5a',
    metalness: 0.7,
    roughness: 0.3,
  }), []);

  const glassMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#87ceeb',
    metalness: 0.1,
    roughness: 0.05,
    transmission: 0.6,
    thickness: 0.5,
    transparent: true,
    opacity: 0.8,
  }), []);

  const wheelMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1a1a1a',
    metalness: 0.3,
    roughness: 0.7,
  }), []);

  const wheelRimMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#c0c0c0',
    metalness: 0.9,
    roughness: 0.1,
  }), []);

  const headlightMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#ffffee',
    emissive: '#ffff99',
    emissiveIntensity: 2,
  }), []);

  const taillightMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#ff0000',
    emissive: '#ff0000',
    emissiveIntensity: 1.5,
  }), []);

  useFrame((state, delta) => {
    if (!rigidBodyRef.current || !carRef.current) return;

    const speed = controls.boost ? 14 : 7;
    const turnSpeed = 2.8;
    const friction = 0.94;

    // Get current velocity
    const currentVel = rigidBodyRef.current.linvel();
    velocity.current.set(currentVel.x, currentVel.y, currentVel.z);
    const horizontalSpeed = Math.sqrt(currentVel.x ** 2 + currentVel.z ** 2);

    // Calculate movement direction based on car rotation
    const forward = new THREE.Vector3(
      -Math.sin(rotation.current),
      0,
      -Math.cos(rotation.current)
    );

    // Handle turning with speed-based influence
    const turnInfluence = Math.min(horizontalSpeed / 5, 1);
    if (controls.left) {
      rotation.current += turnSpeed * delta * turnInfluence;
      steeringAngle.current = THREE.MathUtils.lerp(steeringAngle.current, 0.4, 0.1);
    } else if (controls.right) {
      rotation.current -= turnSpeed * delta * turnInfluence;
      steeringAngle.current = THREE.MathUtils.lerp(steeringAngle.current, -0.4, 0.1);
    } else {
      steeringAngle.current = THREE.MathUtils.lerp(steeringAngle.current, 0, 0.15);
    }

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

    // Wheel rotation based on speed
    wheelRotation.current += horizontalSpeed * delta * 2;
    
    // Update wheel rotations
    wheelsRef.current.forEach((wheel, i) => {
      if (wheel) {
        // Spin wheels
        wheel.rotation.x = wheelRotation.current;
        // Steering for front wheels
        if (i < 2) {
          wheel.rotation.y = steeringAngle.current;
        }
      }
    });

    // Suspension animation
    const targetSuspension = controls.forward || controls.backward ? 0.03 : 0;
    suspensionOffset.current = suspensionOffset.current.map((offset, i) => {
      const phaseOffset = i * 0.5;
      const bounce = Math.sin(state.clock.elapsedTime * 15 + phaseOffset) * targetSuspension * horizontalSpeed * 0.1;
      return THREE.MathUtils.lerp(offset, bounce, 0.1);
    });

    // Report position, velocity, and rotation for camera and HUD
    const pos = rigidBodyRef.current.translation();
    onPositionChange(new THREE.Vector3(pos.x, pos.y, pos.z), horizontalSpeed, rotation.current);
  });

  const wheelPositions: [number, number, number][] = [
    [-0.55, 0.2, 0.7],   // Front left
    [0.55, 0.2, 0.7],    // Front right
    [-0.55, 0.2, -0.7],  // Rear left
    [0.55, 0.2, -0.7],   // Rear right
  ];

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
        {/* Main body - lower chassis */}
        <mesh castShadow position={[0, 0.35, 0]} material={bodyMaterial}>
          <boxGeometry args={[1.3, 0.35, 2.2]} />
        </mesh>
        
        {/* Body contour - front hood slope */}
        <mesh castShadow position={[0, 0.45, 0.65]} rotation={[0.2, 0, 0]} material={bodyMaterial}>
          <boxGeometry args={[1.2, 0.2, 0.8]} />
        </mesh>

        {/* Body contour - rear slope */}
        <mesh castShadow position={[0, 0.45, -0.75]} rotation={[-0.15, 0, 0]} material={bodyMaterial}>
          <boxGeometry args={[1.2, 0.2, 0.6]} />
        </mesh>
        
        {/* Cabin */}
        <mesh castShadow position={[0, 0.7, -0.1]} material={bodyAccentMaterial}>
          <boxGeometry args={[1.1, 0.4, 1.1]} />
        </mesh>

        {/* Roof */}
        <mesh castShadow position={[0, 0.95, -0.1]} material={bodyMaterial}>
          <boxGeometry args={[1.0, 0.1, 0.9]} />
        </mesh>

        {/* Front windshield */}
        <mesh position={[0, 0.75, 0.45]} rotation={[0.5, 0, 0]} material={glassMaterial}>
          <boxGeometry args={[0.95, 0.4, 0.05]} />
        </mesh>
        
        {/* Rear windshield */}
        <mesh position={[0, 0.75, -0.65]} rotation={[-0.4, 0, 0]} material={glassMaterial}>
          <boxGeometry args={[0.95, 0.35, 0.05]} />
        </mesh>

        {/* Side windows */}
        <mesh position={[0.56, 0.72, -0.1]} rotation={[0, 0, 0.1]} material={glassMaterial}>
          <boxGeometry args={[0.03, 0.3, 0.9]} />
        </mesh>
        <mesh position={[-0.56, 0.72, -0.1]} rotation={[0, 0, -0.1]} material={glassMaterial}>
          <boxGeometry args={[0.03, 0.3, 0.9]} />
        </mesh>

        {/* Wheels with suspension */}
        {wheelPositions.map((pos, i) => (
          <group 
            key={i} 
            position={[pos[0], pos[1] + suspensionOffset.current[i], pos[2]]}
          >
            {/* Wheel hub for steering */}
            <group ref={(el) => { if (el) wheelsRef.current[i] = el as unknown as THREE.Mesh; }}>
              {/* Tire */}
              <mesh rotation={[0, 0, Math.PI / 2]} castShadow material={wheelMaterial}>
                <cylinderGeometry args={[0.22, 0.22, 0.18, 16]} />
              </mesh>
              {/* Rim */}
              <mesh rotation={[0, 0, Math.PI / 2]} material={wheelRimMaterial}>
                <cylinderGeometry args={[0.12, 0.12, 0.19, 8]} />
              </mesh>
              {/* Rim spokes */}
              {[0, 1, 2, 3, 4].map((spoke) => (
                <mesh 
                  key={spoke} 
                  rotation={[0, 0, Math.PI / 2]} 
                  position={[0, 0, 0]}
                  material={wheelRimMaterial}
                >
                  <boxGeometry args={[0.02, 0.2, 0.18]} />
                </mesh>
              ))}
            </group>
            {/* Wheel well shadow */}
            <mesh position={[0, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.25, 0.25, 0.05, 16]} />
              <meshStandardMaterial color="#1a1010" transparent opacity={0.3} />
            </mesh>
          </group>
        ))}

        {/* Headlights */}
        <mesh position={[-0.4, 0.4, 1.1]} material={headlightMaterial}>
          <boxGeometry args={[0.2, 0.1, 0.05]} />
        </mesh>
        <mesh position={[0.4, 0.4, 1.1]} material={headlightMaterial}>
          <boxGeometry args={[0.2, 0.1, 0.05]} />
        </mesh>
        
        {/* Headlight glow */}
        <pointLight position={[-0.4, 0.4, 1.3]} color="#ffffcc" intensity={0.5} distance={8} />
        <pointLight position={[0.4, 0.4, 1.3]} color="#ffffcc" intensity={0.5} distance={8} />

        {/* Taillights */}
        <mesh position={[-0.45, 0.4, -1.1]} material={taillightMaterial}>
          <boxGeometry args={[0.2, 0.08, 0.03]} />
        </mesh>
        <mesh position={[0.45, 0.4, -1.1]} material={taillightMaterial}>
          <boxGeometry args={[0.2, 0.08, 0.03]} />
        </mesh>

        {/* Front grille */}
        <mesh position={[0, 0.32, 1.11]} castShadow>
          <boxGeometry args={[0.6, 0.15, 0.02]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Side mirrors */}
        <mesh position={[-0.7, 0.65, 0.3]} castShadow material={bodyMaterial}>
          <boxGeometry args={[0.15, 0.08, 0.1]} />
        </mesh>
        <mesh position={[0.7, 0.65, 0.3]} castShadow material={bodyMaterial}>
          <boxGeometry args={[0.15, 0.08, 0.1]} />
        </mesh>

        {/* Exhaust pipes */}
        <mesh position={[-0.35, 0.2, -1.15]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.1, 8]} />
          <meshStandardMaterial color="#444" metalness={0.9} roughness={0.3} />
        </mesh>
        <mesh position={[-0.25, 0.2, -1.15]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.1, 8]} />
          <meshStandardMaterial color="#444" metalness={0.9} roughness={0.3} />
        </mesh>
      </group>
    </RigidBody>
  );
};
