"use client";

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const VoxelSprite: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // Scene and camera
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      width / -2,
      width / 2,
      height / 2,
      height / -2,
      0.1,
      1000
    );
    camera.position.z = 1;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    // Load sprite texture (sprite sheet in public/voxel-sprite.png)
    const loader = new THREE.TextureLoader();
    loader.load('/voxel-sprite.png', (texture) => {
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;

      // Assume 4x4 sprite sheet
      const columns = 4;
      const rows = 4;
      const totalFrames = columns * rows;
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1 / columns, 1 / rows);

      const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
      const sprite = new THREE.Sprite(material);
      scene.add(sprite);
      // Escalar sprite para que ocupe un frame completo en canvas
      sprite.scale.set(width / columns, height / rows, 1);

      let frame = 0;
      const animate = () => {
        frame = (frame + 1) % totalFrames;
        const col = frame % columns;
        const row = Math.floor(frame / columns);
        texture.offset.set(col / columns, 1 - (row + 1) / rows);

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      };
      animate();
    });

    // Cleanup
    return () => {
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '300px', height: '300px', backgroundColor: '#fff' }} />;
};

export default VoxelSprite;
