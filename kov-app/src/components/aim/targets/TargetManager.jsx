// src/components/aim/targets/TargetManager.jsx
import React, { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { TARGET_CONFIG } from './targetConfigs';
import { soundEffects } from '../../../utils/soundEffects';

const TargetManager = ({ scene, targetType = 'STANDARD' }) => {
  const targetRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const animationFrameRef = useRef(null);
  const debugRef = useRef(0);  // Add this
  const hitAnimationRef = useRef(null);

  const createTarget = () => {
    console.log('Creating target with config:', TARGET_CONFIG[targetType]);
    const config = TARGET_CONFIG[targetType];
    const targetGroup = new THREE.Group();
    targetGroup.isTarget = true;  // Mark the group itself as a target
    
    // Add massive debug sphere at target position
    const debugSphere = new THREE.Mesh(
      new THREE.SphereGeometry(1),
      new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
    );
    targetGroup.add(debugSphere);

    // Add lines extending from target in all directions
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-50, 0, 0),
      new THREE.Vector3(50, 0, 0)
    ]);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const xLine = new THREE.Line(lineGeometry, lineMaterial);
    targetGroup.add(xLine);

    // Add debug axes helper
    const axesHelper = new THREE.AxesHelper(1);
    targetGroup.add(axesHelper);

    // Create target body
    const cylinderGeo = new THREE.CylinderGeometry(
      config.size.cylinder.radius,
      config.size.cylinder.radius,
      config.size.cylinder.height,
      32
    );
    const material = new THREE.MeshPhongMaterial({ 
      color: config.color,
      emissive: 0xff00ff,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.8,
      wireframe: true  // Add wireframe to see structure better
    });
    
    const cylinder = new THREE.Mesh(cylinderGeo, material);
    cylinder.position.y = config.size.cylinder.height / 2;
    cylinder.isTarget = true;
    cylinder.name = 'targetBody';  // Add names for debugging
    
    // Create target head
    const sphereGeo = new THREE.SphereGeometry(config.size.sphere.radius, 32, 32);
    const sphere = new THREE.Mesh(sphereGeo, material);
    sphere.position.y = config.size.cylinder.height + config.size.sphere.radius;
    sphere.isTarget = true;
    sphere.name = 'targetHead';    // Add names for debugging
    
    targetGroup.add(cylinder);
    targetGroup.add(sphere);
    targetGroup.name = 'targetGroup';  // Add name for debugging
    
    // Position in world space - moved closer and higher
    targetGroup.position.set(0, 5, -15);  // Higher up and further back

    // Add a debug sphere to mark the position
    const debugSphereSmall = new THREE.Mesh(
      new THREE.SphereGeometry(0.1),
      new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    );
    targetGroup.add(debugSphereSmall);

    // Add box helper to show bounds
    const boxHelper = new THREE.BoxHelper(targetGroup, 0xffff00);
    targetGroup.add(boxHelper);

    // Debug the entire group structure
    console.log('Target group structure:', {
      groupIsTarget: targetGroup.isTarget,
      groupName: targetGroup.name,
      childCount: targetGroup.children.length,
      children: targetGroup.children.map(child => ({
        name: child.name,
        isTarget: child.isTarget
      }))
    });

    console.log('Target created with initial position:', targetGroup.position);

    // Log position in all frames
    setInterval(() => {
      console.log('Target world position:', targetGroup.getWorldPosition(new THREE.Vector3()));
    }, 1000);

    return targetGroup;
  };

  const updateTargetPosition = () => {
    if (!targetRef.current) return;
    
    const config = TARGET_CONFIG[targetType];
    const elapsedTime = (Date.now() - startTimeRef.current) / 1000;
    
    // More dynamic movement
    const noise = Math.sin(elapsedTime * 0.5) * Math.cos(elapsedTime * 0.3);
    const randomX = Math.sin(elapsedTime * config.movePattern.speed) * config.movePattern.rangeX;
    const randomY = Math.cos(elapsedTime * 0.7) * config.movePattern.rangeY;
    const wobble = Math.sin(elapsedTime * 2) * 0.5;
    
    targetRef.current.position.x = randomX + noise * 2;
    targetRef.current.position.y = 5 + randomY + wobble;
    targetRef.current.position.z = -15 + Math.sin(elapsedTime * 0.2) * 2;
    
    // Add slight rotation for more dynamic movement
    targetRef.current.rotation.y = Math.sin(elapsedTime * 0.5) * 0.1;
    
    animationFrameRef.current = requestAnimationFrame(updateTargetPosition);
  };

  const handleHit = useCallback((event) => {
    if (!targetRef.current) return;

    // Play hit marker sound at full volume
    soundEffects.playSound('hit', 1.0);

    // Visual feedback
    const material = targetRef.current.children.find(
      child => child.isMesh
    )?.material;

    if (material) {
      // Store original color
      const originalColor = material.color.getHex();
      material.color.setHex(0xffff00); // Flash yellow

      // Reset color after 100ms
      setTimeout(() => {
        material.color.setHex(originalColor);
      }, 100);
    }

    // Optional: Add particle effect at hit point
    const particles = new THREE.Points(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3().copy(event.detail.point)
      ]),
      new THREE.PointsMaterial({ color: 0xff0000, size: 0.1 })
    );
    scene.add(particles);
    setTimeout(() => scene.remove(particles), 200);
  }, [scene]);

  useEffect(() => {
    window.addEventListener('targetHit', handleHit);
    return () => window.removeEventListener('targetHit', handleHit);
  }, [handleHit]);

  useEffect(() => {
    if (!scene) {
      console.error('Scene is undefined in TargetManager');
      return;
    }

    console.log('TargetManager mounted with scene:', {
      sceneChildren: scene.children.length,
      sceneIsObject3D: scene instanceof THREE.Scene,
      targetType
    });

    // Debug interval
    const debugInterval = setInterval(() => {
      debugRef.current++;
      console.log('Target debug check:', {
        iteration: debugRef.current,
        targetExists: !!targetRef.current,
        targetInScene: targetRef.current ? scene.children.includes(targetRef.current) : false,
        sceneChildren: scene.children.length
      });
    }, 1000);

    console.log('TargetManager useEffect triggered');
    if (targetRef.current) {
      console.log('Removing existing target');
      scene.remove(targetRef.current);
    }

    // Add a small delay to ensure scene is fully ready
    const initTimeout = setTimeout(() => {
      console.log('Delayed target initialization...');
      try {
        targetRef.current = createTarget();
        scene.add(targetRef.current);
        console.log('Target added to scene:', {
          targetPosition: targetRef.current.position,
          sceneChildren: scene.children.length,
          sceneHasTarget: scene.children.includes(targetRef.current)
        });
        
        startTimeRef.current = Date.now();
        updateTargetPosition();
      } catch (error) {
        console.error('Error setting up target:', error);
      }
    }, 100);

    return () => {
      clearTimeout(initTimeout);
      clearInterval(debugInterval);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (targetRef.current) {
        scene.remove(targetRef.current);
      }
    };
  }, [scene, targetType]);

  return null;
};

export default TargetManager;