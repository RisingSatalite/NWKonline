// components/ThreeGLBViewer.js

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const ThreeGLBViewer = () => {
  const mountRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;

    // Create a scene
    const scene = new THREE.Scene();

    // Create a camera
    const camera = new THREE.PerspectiveCamera(
      75,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Create a renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    // Add lighting
    const light = new THREE.AmbientLight(0xffffff); // Soft white light
    scene.add(light);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup function
    return () => {
      renderer.dispose();
      currentMount.removeChild(renderer.domElement);
    };
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);

      const scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(
        75,
        mountRef.current.clientWidth / mountRef.current.clientHeight,
        0.1,
        1000
      );
      camera.position.z = 5;

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      mountRef.current.innerHTML = ''; // Clear previous renderer content
      mountRef.current.appendChild(renderer.domElement);

      const light = new THREE.AmbientLight(0xffffff);
      scene.add(light);

      const loader = new GLTFLoader();
      loader.load(url, (gltf) => {
        scene.add(gltf.scene);
        animate(); // Start the animation loop after the model is loaded
      });

      const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };
    }
  };

  return (
    <div className="bg-slate-500" style={{ height: '100vh', overflow: 'hidden' }}>
      <input
        type="file"
        accept=".glb"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ position: 'absolute', zIndex: 1 }}
      />
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default ThreeGLBViewer;
