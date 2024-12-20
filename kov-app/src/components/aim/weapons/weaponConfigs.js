// weaponConfigs.js
export const WEAPONS = {
    ASSAULT: {
      name: 'Assault Rifle',
      // Based on CS:GO/Valorant style recoil pattern
      recoilPattern: {
        // Initial kick
        initialKick: {
          up: 0.8,
          duration: 50  // ms
        },
        // Main recoil pattern (CS:GO style)
        pattern: [
          { x: 0, y: 1, duration: 60 },    // Strong initial vertical
          { x: 0.2, y: 1.2, duration: 60 }, // Slight right
          { x: 0.4, y: 1.4, duration: 60 }, // More right
          { x: 0.2, y: 1.5, duration: 60 }, // Start moving left
          { x: -0.2, y: 1.5, duration: 60 }, // Left
          { x: -0.4, y: 1.4, duration: 60 }, // More left
          { x: -0.2, y: 1.2, duration: 60 }, // Back right
          { x: 0, y: 1, duration: 60 }     // Center
        ],
        // Recovery (when not shooting)
        recovery: {
          speed: 0.92,  // 92% recovery per frame
          delay: 100    // ms before recovery starts
        },
        // Spread (accuracy cone)
        spread: {
          base: 0.1,
          moving: 0.4,
          jumping: 0.8,
          maximum: 1.5
        }
      },
      // Fire rate and mechanics
      mechanics: {
        rateOfFire: 600,  // rounds per minute
        automatic: true,
        tapResetTime: 200, // ms to reset recoil when tap firing
        moveSpeed: 0.85    // movement speed multiplier while shooting
      },
      // View model settings
      viewModel: {
        position: { x: 0.7, y: -0.5, z: -1.5 },
        recoil: {
          visualKick: {
            up: 0.2,      // Visual kick up
            back: 0.1,    // Visual kick back
            rotate: 2     // Degrees of rotation
          },
          visualRecovery: {
            speed: 0.15,  // Speed of visual recovery
            damping: 0.8  // Smoothing factor
          }
        }
      }
    },
    SNIPER: {
      name: 'Sniper Rifle',
      // Based on CS:GO AWP/COD Sniper mechanics
      recoilPattern: {
        initialKick: {
          up: 2.5,
          duration: 100
        },
        pattern: [
          { x: 0, y: 2.5, duration: 100 }  // Single strong kick
        ],
        recovery: {
          speed: 0.95,
          delay: 200
        },
        spread: {
          base: 0,        // Perfect accuracy when scoped
          moving: 1.5,    // Huge penalty while moving
          jumping: 3,     // Even bigger penalty while jumping
          maximum: 3
        }
      },
      mechanics: {
        rateOfFire: 50,   // Very slow rate of fire
        automatic: false,
        rechambering: 1500, // Time to rechamber round in ms
        scopeTime: 200    // Time to scope in
      },
      viewModel: {
        position: { x: 0.7, y: -0.5, z: -1.5 },
        recoil: {
          visualKick: {
            up: 0.4,
            back: 0.3,
            rotate: 5
          },
          visualRecovery: {
            speed: 0.1,
            damping: 0.9
          }
        }
      }
    }
  };
  
  export const WEAPON_TYPES = {
    ASSAULT: 'ASSAULT',
    SNIPER: 'SNIPER'
  };