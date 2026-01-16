import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraControllerProps {
  target: THREE.Vector3;
}

export const CameraController = ({ target }: CameraControllerProps) => {
  const { camera } = useThree();
  const currentPosition = useRef(new THREE.Vector3(0, 8, 12));
  const currentLookAt = useRef(new THREE.Vector3());
  const mouseOffset = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);

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
    const distance = 15;
    const height = 8 + mouseOffset.current.y * 10;
    
    const desiredPosition = new THREE.Vector3(
      target.x + Math.sin(mouseOffset.current.x) * distance,
      target.y + height,
      target.z + Math.cos(mouseOffset.current.x) * distance
    );

    // Smooth interpolation
    const smoothness = 1 - Math.pow(0.001, delta);
    currentPosition.current.lerp(desiredPosition, smoothness * 5);
    currentLookAt.current.lerp(target, smoothness * 8);

    // Apply to camera
    camera.position.copy(currentPosition.current);
    camera.lookAt(currentLookAt.current);
  });

  return null;
};
