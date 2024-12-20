// src/components/aim/weapons/AssaultRifle.jsx
import React from 'react';
import * as THREE from 'three';
import { WEAPONS } from './weaponConfigs';

const createAssaultRifleModel = () => {
  const weapon = WEAPONS.ASSAULT;
  const weaponGroup = new THREE.Group();

  // Body
  const bodyGeo = new THREE.BoxGeometry(
    weapon.model.body.width, 
    weapon.model.body.height, 
    weapon.model.body.length
  );
  const bodyMat = new THREE.MeshPhongMaterial({ color: 0x333333 });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  weaponGroup.add(body);

  // Barrel
  const barrelGeo = new THREE.BoxGeometry(
    weapon.model.barrel.width,
    weapon.model.barrel.height,
    weapon.model.barrel.length
  );
  const barrel = new THREE.Mesh(barrelGeo, bodyMat);
  barrel.position.z = -(weapon.model.body.length/2 + weapon.model.barrel.length/2);
  weaponGroup.add(barrel);

  // Position weapon in view
  weaponGroup.position.set(1, -1, -3);
  weaponGroup.rotation.y = Math.PI / 12;

  return weaponGroup;
};

export { createAssaultRifleModel };