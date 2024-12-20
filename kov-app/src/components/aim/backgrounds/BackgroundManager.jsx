// src/components/aim/backgrounds/BackgroundManager.jsx
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { BACKGROUND_CONFIG } from './backgroundConfigs';

const BackgroundManager = ({ scene, type = 'BASIC' }) => {
  const backgroundRef = useRef(null);
  const gridRef = useRef(null);

  const setupBasicBackground = () => {
    console.log('Setting up basic background');
    const config = BACKGROUND_CONFIG.BASIC;
    scene.background = new THREE.Color(config.color);
    scene.fog = new THREE.FogExp2(config.fog.color, config.fog.density);
  };

  const setupGridBackground = () => {
    console.log('Setting up grid background');
    const config = BACKGROUND_CONFIG.GRID;
    scene.background = new THREE.Color(config.color);
    
    const grid = new THREE.GridHelper(
      config.gridSize, 
      config.gridDivisions,
      config.gridColor,
      config.gridColor
    );
    gridRef.current = grid;
    scene.add(grid);
  };

  const setupDarkBackground = () => {
    console.log('Setting up dark background');
    const config = BACKGROUND_CONFIG.DARK;
    scene.background = new THREE.Color(config.color);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(config.ambientLight);
    scene.add(ambientLight);
    
    // Add spotlight
    const spotLight = new THREE.SpotLight(config.spotLight);
    spotLight.position.set(0, 10, 0);
    spotLight.angle = Math.PI / 4;
    scene.add(spotLight);
  };

  useEffect(() => {
    console.log('BackgroundManager: Initializing with type:', type);

    // Clean up previous background
    if (gridRef.current) {
      console.log('Removing previous grid');
      scene.remove(gridRef.current);
    }

    // Setup new background
    switch (type) {
      case 'GRID':
        setupGridBackground();
        break;
      case 'DARK':
        setupDarkBackground();
        break;
      default:
        setupBasicBackground();
    }

    return () => {
      console.log('BackgroundManager: Cleaning up');
      if (gridRef.current) {
        scene.remove(gridRef.current);
      }
    };
  }, [scene, type]);

  useEffect(() => {
    console.log('BackgroundManager mounted');
    return () => console.log('BackgroundManager unmounted');
  }, []);

  return null;
};

export default BackgroundManager;