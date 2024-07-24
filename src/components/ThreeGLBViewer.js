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
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Render the scene
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup function
    return () => {
      currentMount.removeChild(renderer.domElement);
    };
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);

      // Create a scene
      const scene = new THREE.Scene();

      // Create a camera
      const camera = new THREE.PerspectiveCamera(
        75,
        mountRef.current.clientWidth / mountRef.current.clientHeight,
        0.1,
        1000
      );
      camera.position.z = 5;

      // Create a renderer
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      mountRef.current.appendChild(renderer.domElement);

      // Load the GLB file
      const loader = new GLTFLoader();
      loader.load(url, (gltf) => {
        scene.add(gltf.scene);
      });

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);

        // Render the scene
        renderer.render(scene, camera);
      };

      animate();
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".glb"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />
    </div>
  );
};

export default ThreeGLBViewer;
