import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { StageEnvironment } from '../types';

interface ThreeStageCanvasProps {
  environment?: StageEnvironment;
  isCelebrationActive?: boolean;
}

export const ThreeStageCanvas: React.FC<ThreeStageCanvasProps> = ({
  environment = 'oasis',
  isCelebrationActive = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const spotsRef = useRef<THREE.SpotLight[]>([]);
  const particleSysRef = useRef<THREE.Points | null>(null);
  const ringMeshesRef = useRef<THREE.Mesh[]>([]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 4, 18);
    camera.lookAt(0, 1, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // Color palettes based on environment
    const getColors = (env: string) => {
      switch (env) {
        case 'gala':
          return { ambient: 0x1e1b4b, spot1: 0x3b82f6, spot2: 0xf59e0b, ring: 0x60a5fa, floor: 0x050a18 };
        case 'cyber':
          return { ambient: 0x0a1026, spot1: 0x3b82f6, spot2: 0x8b5cf6, ring: 0x38bdf8, floor: 0x030712 };
        case 'sunset':
          return { ambient: 0x1e1b4b, spot1: 0x6366f1, spot2: 0xf43f5e, ring: 0x818cf8, floor: 0x050a18 };
        case 'oasis':
        default:
          return { ambient: 0x0a152e, spot1: 0x2563eb, spot2: 0x06b6d4, ring: 0x60a5fa, floor: 0x050a18 };
      }
    };

    const colors = getColors(environment);

    // Ambient light
    const ambientLight = new THREE.AmbientLight(colors.ambient, 1.6);
    scene.add(ambientLight);

    // Spotlights (Left & Right Stage Beams)
    const spot1 = new THREE.SpotLight(colors.spot1, 3.5, 35, Math.PI / 4, 0.4, 1);
    spot1.position.set(-9, 12, 10);
    spot1.target.position.set(0, 0, 0);
    scene.add(spot1);
    scene.add(spot1.target);

    const spot2 = new THREE.SpotLight(colors.spot2, 3.5, 35, Math.PI / 4, 0.4, 1);
    spot2.position.set(9, 12, 10);
    spot2.target.position.set(0, 0, 0);
    scene.add(spot2);
    scene.add(spot2.target);

    spotsRef.current = [spot1, spot2];

    // Main 3D Stage Platform (Cylinder with metallic trims)
    const stageGeo = new THREE.CylinderGeometry(8.5, 9.2, 0.6, 64);
    const stageMat = new THREE.MeshStandardMaterial({
      color: colors.floor,
      roughness: 0.2,
      metalness: 0.8,
    });
    const stageMesh = new THREE.Mesh(stageGeo, stageMat);
    stageMesh.position.set(0, -0.3, 0);
    scene.add(stageMesh);

    // Concentric LED Rings on Stage
    const ringMeshes: THREE.Mesh[] = [];
    [5.5, 7.2, 8.4].forEach((radius, idx) => {
      const ringGeo = new THREE.TorusGeometry(radius, 0.05, 16, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: colors.ring,
        transparent: true,
        opacity: 0.6 - idx * 0.15,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.y = 0.02;
      scene.add(ringMesh);
      ringMeshes.push(ringMesh);
    });
    ringMeshesRef.current = ringMeshes;

    // Floating Ambient Firefly / Tech Bokeh Particles
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 32;
      positions[i * 3 + 1] = Math.random() * 16 - 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 24;
      particleScales[i] = Math.random() * 1.5 + 0.5;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: colors.ring,
      size: 0.18,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particleSysRef.current = particles;

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Slow smooth camera oscillation
      camera.position.x = Math.sin(elapsedTime * 0.25) * 1.2;
      camera.position.y = 3.8 + Math.cos(elapsedTime * 0.3) * 0.4;
      camera.lookAt(0, 1.2, 0);

      // Spotlights dance slightly
      if (spotsRef.current.length >= 2) {
        spotsRef.current[0].position.x = -9 + Math.sin(elapsedTime * 0.8) * 2.5;
        spotsRef.current[1].position.x = 9 + Math.cos(elapsedTime * 0.8) * 2.5;
      }

      // Rotate Stage Rings
      ringMeshesRef.current.forEach((r, idx) => {
        r.rotation.z += (idx % 2 === 0 ? 0.003 : -0.003);
      });

      // Float Particles
      if (particleSysRef.current) {
        particleSysRef.current.rotation.y = elapsedTime * 0.04;
        const pos = particleSysRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          pos[i * 3 + 1] += Math.sin(elapsedTime + i) * 0.005;
        }
        particleSysRef.current.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [environment]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
    />
  );
};
