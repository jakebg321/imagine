// src/components/aim/weapons/SniperRifle.jsx
import * as THREE from 'three';
import { WEAPONS } from './weaponConfigs';

// Changed from React component to a regular function

const createSniperRifleModel = () => {
    const weapon = WEAPONS.SNIPER;
    const weaponGroup = new THREE.Group();
  
    // Create a simplified front-view sniper model
    const barrelGeo = new THREE.BoxGeometry(0.25, 0.15, 0.8);
    const barrelMat = new THREE.MeshPhongMaterial({ color: 0x222222 });
    const barrel = new THREE.Mesh(barrelGeo, barrelMat);
    
    // Add scope
    const scopeGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 16);
    const scope = new THREE.Mesh(scopeGeo, barrelMat);
    scope.rotation.x = Math.PI / 2;
    scope.position.y = 0.15;
    
    // Add muzzle brake
    const muzzleGeo = new THREE.BoxGeometry(0.3, 0.1, 0.1);
    const muzzle = new THREE.Mesh(muzzleGeo, barrelMat);
    muzzle.position.z = -0.4;
  
    weaponGroup.add(barrel);
    weaponGroup.add(scope);
    weaponGroup.add(muzzle);
  
    // Position for FPS view
    weaponGroup.position.set(0.7, -0.5, -1.5);
    return weaponGroup;
  };
// Changed to export the creation function instead of a React component
export { createSniperRifleModel };