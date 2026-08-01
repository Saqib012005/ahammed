import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Float, Environment } from '@react-three/drei';
import { useRef, Suspense } from 'react';

function Blob() {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.x = Math.sin(t / 4);
    ref.current.rotation.y = Math.sin(t / 2);
  });
  return (
    <Float speed={1.5} rotationIntensity={1.5} floatIntensity={1.2}>
      <Sphere ref={ref} args={[1, 128, 128]} scale={0.5} position={[3.2, -1.8, 0]}>
        <MeshDistortMaterial
          color="#FF7A1A"
          distort={0.45}
          speed={2.2}
          roughness={0.15}
          metalness={0.35}
        />
      </Sphere>
    </Float>
  );
}

function FloatingRing({ position, color = '#FFA45C', scale = 1 }) {
  return (
    <Float speed={2} rotationIntensity={2} floatIntensity={1.5}>
      <mesh position={position} scale={scale} rotation={[0.5, 0.5, 0]}>
        <torusGeometry args={[0.35, 0.08, 24, 100]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.2} />
      </mesh>
    </Float>
  );
}

function FloatingBox({ position, color = '#FFE6CC', scale = 0.3 }) {
  return (
    <Float speed={2.5} rotationIntensity={3} floatIntensity={2}>
      <mesh position={position} scale={scale}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
      </mesh>
    </Float>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 3, 3]} intensity={1.1} color="#FFC38D" />
        <directionalLight position={[-3, -2, 2]} intensity={0.6} color="#FF7A1A" />
        <Blob />
        <FloatingRing position={[-3.5, 1.5, 0.5]} color="#FF7A1A" scale={0.7} />
        <FloatingRing position={[3.5, 1.4, 0.5]} color="#FFA45C" scale={0.55} />
        <FloatingBox position={[-3.2, -1.6, -1]} color="#FFE6CC" scale={0.35} />
        <FloatingBox position={[3.8, -0.5, -1]} color="#FFC38D" scale={0.28} />
        <Environment preset="sunset" />
      </Suspense>
    </Canvas>
  );
}
