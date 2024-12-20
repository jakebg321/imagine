// src/components/aim/backgrounds/backgroundConfigs.js
export const BACKGROUND_TYPES = {
    BASIC: 'BASIC',
    GRID: 'GRID',
    DARK: 'DARK'
  };
  
  export const BACKGROUND_CONFIG = {
    BASIC: {
      name: 'Basic Environment',
      color: 0x87CEEB,  // Sky blue
      fog: {
        color: 0xffffff,
        density: 0.01
      }
    },
    GRID: {
      name: 'Grid Environment',
      color: 0x000000,
      gridColor: 0x00ff00,
      gridSize: 100,        // Increased size
      gridDivisions: 50,    // More divisions
      gridPosition: {
        y: -10
      }
    },
    DARK: {
      name: 'Dark Environment',
      color: 0x111111,      // Very dark gray
      ambientLight: {
        color: 0x222222,    // Dark ambient
        intensity: 0.3      // Reduced intensity
      },
      spotLight: {
        color: 0xff0000,    // Red spotlight
        intensity: 1.5,     // Increased intensity
        position: {
          x: 0,
          y: 20,
          z: 0
        },
        angle: Math.PI / 3,
        penumbra: 0.2,
        distance: 100
      },
      fog: {
        color: 0x000000,
        density: 0.03
      }
    }
  };