"use client";
import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { Suspense, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function HumanBodyModel() {
  const { scene } = useGLTF("/science/base_basic_shaded.glb");
  const modelRef = useRef<THREE.Object3D>(null);

  useEffect(() => {
    if (!modelRef.current) return;

    // Normalize model orientation
    modelRef.current.rotation.set(0, 4.6, 0);

    // Animate rotation based on scroll
    const ctx = gsap.context(() => {
      const rotationTween = gsap.to(modelRef.current!.rotation, {
        y: `+=${150 * (Math.PI / 180)}`, // revolution less then 180
        ease: "none",
        scrollTrigger: {
          trigger: "#human-model-container",
          start: "top bottom",
          end: "bottom+=400 top",
          scrub: true,
        },
      });

      const handleResize = () => {
        if (modelRef.current) {
          rotationTween.scrollTrigger?.refresh()
        }
      }

      window.addEventListener("resize", handleResize)
    });

    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("resize", () => { })
      ctx.revert();
    }
  }, []);

  return <primitive ref={modelRef} object={scene} scale={2} position={[0, -1.6, 0]} />;
}

export default function HumanModel() {
  return (
    <div id="human-model-container" className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 4.8], fov: 60 }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 5, 5]} />
        <Suspense fallback={null}>
          <HumanBodyModel />
        </Suspense>
      </Canvas>
    </div>
  );
}
