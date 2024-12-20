import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const WeaponManager = ({ scene, camera }) => {
  const weaponRef = useRef(null);
  
  const createWeaponModel = () => {
    const group = new THREE.Group();

    // Create a more visible weapon model
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.2, 0.8),
      new THREE.MeshPhongMaterial({ 
        color: 0x444444,
        shininess: 30
      })
    );

    const barrel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 0.4, 8),
      new THREE.MeshPhongMaterial({ 
        color: 0x222222,
        shininess: 50
      })
    );
    
    // Position barrel relative to body
    barrel.rotation.x = Math.PI / 2;
    barrel.position.z = -0.6;

    // Add parts to group
    group.add(body);
    group.add(barrel);

    // Position weapon in view (adjusted for visibility)
    group.position.set(0.4, -0.4, -1);
    
    return group;
  };

  useEffect(() => {
    // Clear any existing weapon
    if (weaponRef.current) {
      camera.remove(weaponRef.current);
    }

    // Create and add new weapon
    weaponRef.current = createWeaponModel();
    camera.add(weaponRef.current);

    // Debug logging
    console.log('Weapon created and added to camera');
    console.log('Weapon position:', weaponRef.current.position);

    return () => {
      if (weaponRef.current) {
        camera.remove(weaponRef.current);
      }
    };
  }, [camera]);

  return null;
};

export default WeaponManager;