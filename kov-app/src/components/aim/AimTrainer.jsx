import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import CustomCrosshair from './CustomCrosshair';
import WeaponManager from './weapons/WeaponManager';
import TargetManager from './targets/TargetManager';  // Add this import
import { soundEffects } from '../../utils/soundEffects';
import useSound from 'use-sound';

const AimTrainer = () => {
  // Add sound hooks
  const [playShoot] = useSound('/sounds/shoot.mp3', { volume: 0.5 });
  const [playHit] = useSound('/sounds/hit.mp3', { volume: 0.25 });

  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [sceneReady, setSceneReady] = useState(false); // Add a new state to track scene readiness
  
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const raycasterRef = useRef(new THREE.Raycaster());

  useEffect(() => {
    if (!containerRef.current) return;

    console.log('Initializing scene...');
    sceneRef.current = new THREE.Scene();
    sceneRef.current.background = new THREE.Color(0x87ceeb); // Sky blue

    // Camera setup
    cameraRef.current = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    // Position camera back and up slightly, looking forward
    cameraRef.current.position.set(0, 2, 5);
    cameraRef.current.lookAt(0, 2, -10);

    // Add grid helpers for visualization
    const gridHelper = new THREE.GridHelper(20, 20, 0x888888, 0x444444);
    sceneRef.current.add(gridHelper);

    // Add an axis helper
    const axesHelper = new THREE.AxesHelper(5);
    sceneRef.current.add(axesHelper);

    // Renderer setup
    rendererRef.current = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    });
    rendererRef.current.setSize(window.innerWidth * 0.8, window.innerHeight * 0.8);
    rendererRef.current.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(rendererRef.current.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    sceneRef.current.add(ambientLight);
    sceneRef.current.add(directionalLight);

    // Add a floor for reference
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x808080,
      roughness: 0.8
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    sceneRef.current.add(floor);

    console.log('Scene initialized with:', {
      sceneChildren: sceneRef.current.children.length,
      cameraPosition: cameraRef.current.position
    });

    // Set scene ready after initialization
    setSceneReady(true);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        // Log scene state every few seconds
        if (Date.now() % 3000 < 16) {  // Log every ~3 seconds
          const hasTarget = sceneRef.current.children.some(child => 
            child.isTarget || (child.children && child.children.some(grandChild => grandChild.isTarget))
          );
          console.log('Scene state:', {
            children: sceneRef.current.children.length,
            targetPresent: hasTarget,
            childTypes: sceneRef.current.children.map(child => ({
              name: child.name,
              type: child.type,
              isTarget: child.isTarget
            }))
          });
        }
      }
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      
      const width = window.innerWidth * 0.8;
      const height = window.innerHeight * 0.8;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      setSceneReady(false);
    };
  }, []);

  // Add sound initialization
  useEffect(() => {
    const handleFirstInteraction = async () => {
      await soundEffects.init();
      window.removeEventListener('click', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    return () => window.removeEventListener('click', handleFirstInteraction);
  }, []);

  // Mouse movement handler
  const handleMouseMove = (event) => {
    if (!cameraRef.current || document.pointerLockElement !== containerRef.current) return;

    const movementX = event.movementX || 0;
    const movementY = event.movementY || 0;
    const sensitivity = 0.002;

    const euler = new THREE.Euler(0, 0, 0, 'YXZ');
    euler.setFromQuaternion(cameraRef.current.quaternion);
    
    euler.y -= movementX * sensitivity;
    euler.x = Math.max(
      -Math.PI/2,
      Math.min(Math.PI/2, euler.x - movementY * sensitivity)
    );

    cameraRef.current.quaternion.setFromEuler(euler);
  };

  // Pointer lock handling
  useEffect(() => {
    const handlePointerLockError = (event) => {
      console.log('Pointer lock error:', event);
    };

    const handlePointerLockChange = () => {
      try {
        if (document.pointerLockElement === containerRef.current) {
          document.addEventListener('mousemove', handleMouseMove);
        } else {
          document.removeEventListener('mousemove', handleMouseMove);
        }
      } catch (error) {
        console.log('Pointer lock change error:', error);
      }
    };

    document.addEventListener('pointerlockerror', handlePointerLockError);
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    
    return () => {
      document.removeEventListener('pointerlockerror', handlePointerLockError);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleContainerClick = async () => {
    if (document.pointerLockElement !== containerRef.current) {
      try {
        await containerRef.current.requestPointerLock();
      } catch (error) {
        console.log('Pointer lock error:', error);
        // Optionally show user feedback here
      }
    }
  };

  const handleShoot = useCallback(() => {
    if (!sceneRef.current || !cameraRef.current) return;

    // Play shoot sound
    playShoot();

    // Update raycaster
    raycasterRef.current.setFromCamera(
      new THREE.Vector2(0, 0),
      cameraRef.current
    );

    const intersects = raycasterRef.current.intersectObjects(
      sceneRef.current.children, true
    );

    const hit = intersects.find(intersect => 
      intersect.object.isTarget || 
      intersect.object.parent?.isTarget
    );

    if (hit) {
      setScore(prev => prev + 1);
      playHit();
      const hitEvent = new CustomEvent('targetHit', {
        detail: { point: hit.point }
      });
      window.dispatchEvent(hitEvent);
    } else {
      setMisses(prev => prev + 1);
    }
  }, [playShoot, playHit]);

  // Add click handler
  useEffect(() => {
    const handleClick = (event) => {
      if (document.pointerLockElement === containerRef.current) {
        handleShoot();
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [handleShoot]);

  return (
    <div className="w-full h-screen flex flex-col items-center bg-gray-900 p-4">
      <div className="text-2xl mb-4 space-x-4 text-white">
        <span>Score: {score}</span>
        <span>Misses: {misses}</span>
      </div>

      <div 
        ref={containerRef} 
        className="relative w-4/5 h-4/5 border border-gray-600 rounded-lg overflow-hidden"
        onClick={handleContainerClick}
      >
        {sceneReady && sceneRef.current && cameraRef.current && (
          <>
            <TargetManager 
              key="target"  // Force remount
              scene={sceneRef.current}
              targetType="STANDARD"
            />
            <WeaponManager 
              key="weapon"  // Force remount
              scene={sceneRef.current}
              camera={cameraRef.current}
            />
          </>
        )}
        <CustomCrosshair />
      </div>
    </div>
  );
};

export default AimTrainer;