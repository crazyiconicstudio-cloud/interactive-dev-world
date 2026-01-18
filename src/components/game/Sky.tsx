import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Sky = () => {
  const skyRef = useRef<THREE.Mesh>(null);
  const starsRef = useRef<THREE.Points>(null);

  // Generate stars
  const starsGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const starCount = 500;
    const positions = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.4; // Upper hemisphere only
      const radius = 180;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.cos(phi);
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);

  useFrame((state) => {
    if (skyRef.current) {
      // Very slow rotation for subtle movement
      skyRef.current.rotation.y += 0.00005;
    }
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.00003;
      // Twinkle effect
      const material = starsRef.current.material as THREE.PointsMaterial;
      material.opacity = 0.6 + Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <>
      {/* Main sky dome with enhanced gradient */}
      <mesh ref={skyRef} scale={[-1, 1, 1]}>
        <sphereGeometry args={[200, 64, 64]} />
        <shaderMaterial
          side={THREE.BackSide}
          uniforms={{
            topColor: { value: new THREE.Color('#1a0a2e') },
            midColor: { value: new THREE.Color('#4a1942') },
            bottomColor: { value: new THREE.Color('#ff6b35') },
            horizonColor: { value: new THREE.Color('#ff9966') },
            offset: { value: 25 },
            exponent: { value: 0.5 },
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
            uniform vec3 midColor;
            uniform vec3 bottomColor;
            uniform vec3 horizonColor;
            uniform float offset;
            uniform float exponent;
            varying vec3 vWorldPosition;
            
            void main() {
              float h = normalize(vWorldPosition + offset).y;
              
              // Multi-stop gradient for richer sunset
              vec3 color;
              if (h < 0.0) {
                color = bottomColor;
              } else if (h < 0.15) {
                float t = h / 0.15;
                color = mix(bottomColor, horizonColor, t);
              } else if (h < 0.35) {
                float t = (h - 0.15) / 0.2;
                color = mix(horizonColor, midColor, t);
              } else {
                float t = pow((h - 0.35) / 0.65, exponent);
                color = mix(midColor, topColor, t);
              }
              
              // Add subtle gradient noise for more natural look
              float noise = fract(sin(dot(vWorldPosition.xz, vec2(12.9898, 78.233))) * 43758.5453);
              color += noise * 0.02 - 0.01;
              
              gl_FragColor = vec4(color, 1.0);
            }
          `}
        />
      </mesh>

      {/* Stars */}
      <points ref={starsRef} geometry={starsGeometry}>
        <pointsMaterial
          color="#ffffff"
          size={0.8}
          transparent
          opacity={0.7}
          sizeAttenuation
        />
      </points>

      {/* Sun glow */}
      <mesh position={[60, 15, -80]}>
        <sphereGeometry args={[8, 32, 32]} />
        <meshBasicMaterial 
          color="#ffcc66" 
          transparent 
          opacity={0.9}
        />
      </mesh>
      
      {/* Sun corona */}
      <mesh position={[60, 15, -80]}>
        <sphereGeometry args={[15, 32, 32]} />
        <meshBasicMaterial 
          color="#ff9944" 
          transparent 
          opacity={0.3}
        />
      </mesh>

      {/* Sun light source */}
      <pointLight position={[60, 15, -80]} color="#ffaa55" intensity={2} distance={200} />

      {/* Horizon glow */}
      <mesh position={[0, -5, -100]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[400, 100]} />
        <meshBasicMaterial 
          color="#ff6b35" 
          transparent 
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
};
