// src/components/aim/targets/targetConfigs.js
export const TARGET_TYPES = {
    STANDARD: 'STANDARD',
    SMALL: 'SMALL',
    MOVING: 'MOVING'
  };
  
  export const TARGET_CONFIG = {
    STANDARD: {
      name: 'Standard Target',
      size: {
        cylinder: { radius: 2, height: 8 },  // Much bigger
        sphere: { radius: 3 }  // Much bigger head
      },
      color: 0xff00ff,  // Bright magenta for better visibility
      movePattern: {
        speed: 0.8,     // Faster
        rangeX: 8,      // Wider range
        rangeY: 3       // More vertical movement
      }
    },
    SMALL: {
      name: 'Small Target',
      size: {
        cylinder: { radius: 0.15, height: 1.2 },
        sphere: { radius: 0.25 }
      },
      color: 0xff0000,
      movePattern: {
        speed: 1.2,
        rangeX: 6,
        rangeY: 2
      }
    },
    MOVING: {
      name: 'Moving Target',
      size: {
        cylinder: { radius: 0.2, height: 1.5 },
        sphere: { radius: 0.3 }
      },
      color: 0xff0000,
      movePattern: {
        speed: 1.5,
        rangeX: 10,
        rangeY: 4
      }
    }
  };