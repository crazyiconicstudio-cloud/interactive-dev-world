import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Sky = () => {
  const skyRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (skyRef.current) {
      // Slow rotation for subtle movement
      skyRef.current.rotation.y += 0.0001;
    }
  });

  return (
    <mesh ref={skyRef} scale={[-1, 1, 1]}>
      <sphereGeometry args={[200, 32, 32]} />
      <shaderMaterial
        side={THREE.BackSide}
        uniforms={{
          topColor: { value: new THREE.Color('#2d1b4e') },
          bottomColor: { value: new THREE.Color('#ff6b35') },
          offset: { value: 20 },
          exponent: { value: 0.6 },
        }}
        vertexShader={`
          varying vec3 vWorldPosition;
          void main() {
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPosition.xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 topColor;
          uniform vec3 bottomColor;
          uniform float offset;
          uniform float exponent;
          varying vec3 vWorldPosition;
          void main() {
            float h = normalize(vWorldPosition + offset).y;
            gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
          }
        `}
      />
    </mesh>
  );
};
