import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
function ThreedLayout() {
  const mountRef = useRef(null);

  useEffect(() => {
    let scene, camera, renderer;

    const init = () => {
      // Set up scene
      scene = new THREE.Scene();

      // Set up camera
      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 5;

      // Set up renderer
      renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      mountRef.current.appendChild(renderer.domElement);

      // Load model
      const loader = new GLTFLoader();
      loader.load(
        "http://localhost:4000/public/glb/cnc_control_panel.glb",
        (gltf) => {
          scene.add(gltf.scene);
        },
        undefined,
        (error) => {
          console.log("GLB LOAD ERROR", error);
        }
      );

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };

      animate();
    };

    init();

    // Clean up function
    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef}></div>;
}

export default ThreedLayout;
