import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraControllerProps {
  target: THREE.Vector3;
  carRotation?: number;
  carVelocity?: number;
}

export const CameraController = ({ target, carRotation = 0, carVelocity = 0 }: CameraControllerProps) => {
  const { camera } = useThree();
  const currentPosition = useRef(new THREE.Vector3(0, 8, 12));
  const currentLookAt = useRef(new THREE.Vector3());
  const mouseOffset = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const tiltAngle = useRef(0);
  const shakeOffset = useRef(new THREE.Vector3());
  const lastVelocity = useRef(0);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0 || e.button === 2) {
        isDragging.current = true;
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        mouseOffset.current.x += e.movementX * 0.005;
        mouseOffset.current.y = Math.max(-0.5, Math.min(0.5, mouseOffset.current.y - e.movementY * 0.003));
      }
    };

    const handleContextMenu = (e: Event) => e.preventDefault();

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  useFrame((state, delta) => {
    // Calculate desired camera position with orbit offset
    const distance = 14;
    const baseHeight = 7;
    const height = baseHeight + mouseOffset.current.y * 10;
    
    // Add tilt based on car rotation change
    const rotationDelta = carRotation - (tiltAngle.current || carRotation);
    tiltAngle.current = THREE.MathUtils.lerp(tiltAngle.current, carRotation, 0.1);
    
    // Subtle camera roll on turns
    const rollAmount = Math.sin(rotationDelta * 10) * 0.02;
    
    // Camera shake on boost or sudden velocity changes
    const velocityDelta = Math.abs(carVelocity - lastVelocity.current);
    lastVelocity.current = carVelocity;
    
    const shakeIntensity = carVelocity > 10 ? 0.05 : velocityDelta > 3 ? 0.08 : 0;
    shakeOffset.current.set(
      (Math.random() - 0.5) * shakeIntensity,
      (Math.random() - 0.5) * shakeIntensity * 0.5,
      (Math.random() - 0.5) * shakeIntensity
    );
    shakeOffset.current.lerp(new THREE.Vector3(), 0.3);
    
    // Dynamic FOV based on speed
    const targetFOV = 60 + carVelocity * 0.5;
    (camera as THREE.PerspectiveCamera).fov = THREE.MathUtils.lerp(
      (camera as THREE.PerspectiveCamera).fov,
      Math.min(targetFOV, 75),
      0.05
    );
    (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
    
    const desiredPosition = new THREE.Vector3(
      target.x + Math.sin(mouseOffset.current.x) * distance + shakeOffset.current.x,
      target.y + height + shakeOffset.current.y,
      target.z + Math.cos(mouseOffset.current.x) * distance + shakeOffset.current.z
    );

    // Smoother interpolation for premium feel
    const positionSmoothing = 1 - Math.pow(0.0005, delta);
    const lookAtSmoothing = 1 - Math.pow(0.0001, delta);
    
    currentPosition.current.lerp(desiredPosition, positionSmoothing * 4);
    currentLookAt.current.lerp(target, lookAtSmoothing * 6);

    // Apply to camera
    camera.position.copy(currentPosition.current);
    camera.lookAt(currentLookAt.current);
    
    // Apply subtle roll
    camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, rollAmount, 0.1);
  });

  return null;
};
