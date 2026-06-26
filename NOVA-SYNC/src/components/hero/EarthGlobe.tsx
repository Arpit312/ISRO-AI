"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Ring } from "@react-three/drei";
import * as THREE from "three";

// ============================================
// Earth Globe with procedural shader
// ============================================
function EarthMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  // Create a procedural Earth-like material
  const earthMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;

        // Simple noise function
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }
        
        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }

        float fbm(vec2 p) {
          float v = 0.0;
          float a = 0.5;
          for (int i = 0; i < 5; i++) {
            v += a * noise(p);
            p *= 2.0;
            a *= 0.5;
          }
          return v;
        }

        void main() {
          // Create continental shapes using noise
          float continent = fbm(vUv * 8.0 + vec2(time * 0.01, 0.0));
          float detail = fbm(vUv * 20.0 + vec2(0.0, time * 0.005));
          
          // Ocean color (deep blue-cyan)
          vec3 oceanColor = vec3(0.02, 0.08, 0.18);
          vec3 oceanShallow = vec3(0.0, 0.25, 0.4);
          
          // Land colors
          vec3 landGreen = vec3(0.05, 0.2, 0.08);
          vec3 landBrown = vec3(0.15, 0.1, 0.05);
          vec3 landDesert = vec3(0.25, 0.2, 0.1);
          
          // Ice caps
          float latitude = abs(vUv.y - 0.5) * 2.0;
          vec3 iceColor = vec3(0.7, 0.8, 0.9);
          
          // Mix land types
          vec3 landColor = mix(landGreen, landBrown, detail);
          landColor = mix(landColor, landDesert, smoothstep(0.55, 0.7, continent));
          
          // Ocean vs land
          float landMask = smoothstep(0.42, 0.48, continent);
          vec3 surfaceColor = mix(mix(oceanColor, oceanShallow, detail * 0.3), landColor, landMask);
          
          // Ice at poles
          float iceMask = smoothstep(0.8, 0.95, latitude) * (1.0 - detail * 0.3);
          surfaceColor = mix(surfaceColor, iceColor, iceMask);
          
          // City lights on dark side
          float lightDot = dot(vNormal, normalize(vec3(1.0, 0.5, 0.5)));
          float nightSide = smoothstep(0.1, -0.2, lightDot);
          float cities = step(0.72, noise(vUv * 40.0)) * landMask * nightSide;
          vec3 cityGlow = vec3(1.0, 0.85, 0.4) * cities * 0.8;
          
          // Basic diffuse lighting
          float diffuse = max(dot(vNormal, normalize(vec3(1.0, 0.5, 0.5))), 0.0);
          float ambient = 0.08;
          
          vec3 finalColor = surfaceColor * (ambient + diffuse * 0.9) + cityGlow;
          
          // Atmospheric rim glow
          float rim = 1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0);
          rim = pow(rim, 3.0);
          finalColor += vec3(0.0, 0.5, 1.0) * rim * 0.5;
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      uniforms: {
        time: { value: 0 },
      },
    });
  }, []);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.05;
      earthMaterial.uniforms.time.value = clock.getElapsedTime();
    }
    if (glowRef.current) {
      glowRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <group>
      {/* Earth */}
      <mesh ref={meshRef} material={earthMaterial}>
        <sphereGeometry args={[2, 64, 64]} />
      </mesh>

      {/* Atmospheric glow shell */}
      <mesh ref={glowRef} scale={1.05}>
        <sphereGeometry args={[2, 32, 32]} />
        <shaderMaterial
          transparent
          side={THREE.BackSide}
          vertexShader={`
            varying vec3 vNormal;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            varying vec3 vNormal;
            void main() {
              float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
              gl_FragColor = vec4(0.0, 0.6, 1.0, intensity * 0.6);
            }
          `}
        />
      </mesh>
    </group>
  );
}

// ============================================
// Orbital Rings
// ============================================
function OrbitalRings() {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = t * 0.15;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -t * 0.1;
    }
  });

  return (
    <>
      <mesh ref={ring1Ref} rotation={[Math.PI / 3.5, 0.2, 0]}>
        <Ring args={[2.6, 2.65, 128]} />
        <meshBasicMaterial color="#00C2FF" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ring2Ref} rotation={[Math.PI / 2.5, -0.3, 0.5]}>
        <Ring args={[3.0, 3.04, 128]} />
        <meshBasicMaterial color="#7A5FFF" transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>
    </>
  );
}

// ============================================
// Satellite dots orbiting the globe
// ============================================
function SatelliteDots() {
  const groupRef = useRef<THREE.Group>(null);

  const satellites = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      id: i,
      radius: 2.8 + Math.random() * 0.5,
      speed: 0.3 + Math.random() * 0.4,
      offset: (i / 6) * Math.PI * 2,
      tilt: (Math.random() - 0.5) * 1.5,
    }));
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      const sat = satellites[i];
      child.position.x = Math.cos(t * sat.speed + sat.offset) * sat.radius;
      child.position.z = Math.sin(t * sat.speed + sat.offset) * sat.radius;
      child.position.y = Math.sin(t * sat.speed * 0.5 + sat.offset) * sat.tilt;
    });
  });

  return (
    <group ref={groupRef}>
      {satellites.map((sat) => (
        <mesh key={sat.id}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#00E5FF" />
        </mesh>
      ))}
    </group>
  );
}

// ============================================
// Stars Background
// ============================================
function Stars() {
  const positions = useMemo(() => {
    const arr = new Float32Array(3000);
    for (let i = 0; i < 3000; i++) {
      arr[i] = (Math.random() - 0.5) * 50;
    }
    return arr;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.05} sizeAttenuation transparent opacity={0.6} />
    </points>
  );
}

// ============================================
// Main Globe Component
// ============================================
export default function EarthGlobe() {
  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.15} />
        <directionalLight position={[5, 3, 5]} intensity={1.2} />

        <Stars />
        <EarthMesh />
        <OrbitalRings />
        <SatelliteDots />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          rotateSpeed={0.3}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
}
