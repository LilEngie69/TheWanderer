// src/StarGlobe.js
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const StarGlobe = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const width = mountRef.current.clientWidth;
    const height = 300;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // Create the star (glowing sphere)
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffcc00,
      emissive: 0xffa500,
      emissiveIntensity: 2,
      roughness: 0.4,
      metalness: 0.3,
    });
    const star = new THREE.Mesh(geometry, material);
    scene.add(star);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffcc00, 2, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      star.rotation.y += 0.002;
      star.rotation.x += 0.001; // 3D feel
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        maxWidth: '600px',
        height: '300px',
        margin: 'auto',
      }}
    />
  );
};

export default StarGlobe;
