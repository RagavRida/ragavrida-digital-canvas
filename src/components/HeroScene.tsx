import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ─── Animated Particles ─── */
const ParticleField = () => {
  const ref = useRef<THREE.Points>(null);
  const count = 600;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.02;
    ref.current.rotation.x = Math.sin(t * 0.01) * 0.1;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#ff3c00"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};

/* ─── Wireframe Icosahedron ─── */
const WireframeShape = () => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.x = t * 0.3;
    ref.current.rotation.y = t * 0.2;
    ref.current.rotation.z = t * 0.1;
  });

  return (
    <mesh ref={ref} position={[3.2, 0.2, 0]}>
      <icosahedronGeometry args={[1.6, 1]} />
      <meshBasicMaterial
        color="#ff3c00"
        wireframe
        transparent
        opacity={0.35}
      />
    </mesh>
  );
};

/* ─── Mouse-parallax camera rig ─── */
const ParallaxRig = () => {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useFrame(() => {
    camera.position.x += (mouse.current.x * 0.6 - camera.position.x) * 0.05;
    camera.position.y += (mouse.current.y * 0.4 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });

  // Update on pointer move via window event
  useMemo(() => {
    const handler = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", handler);
    return () => window.removeEventListener("pointermove", handler);
  }, []);

  return null;
};

/* ─── Main exported component ─── */
const HeroScene = () => (
  <div className="absolute inset-0 z-0 pointer-events-none">
    <Canvas
      camera={{ position: [0, 0, 5], fov: 60 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ParallaxRig />
      <ParticleField />
      <WireframeShape />
    </Canvas>
  </div>
);

export default HeroScene;
