// RecoilSystem.js
export class RecoilSystem {
    constructor(weapon) {
      this.weapon = weapon;
      this.currentRecoil = { x: 0, y: 0 };
      this.patternIndex = 0;
      this.isRecovering = false;
      this.lastShotTime = 0;
      this.shotCount = 0;
    }
  
    // Called when shooting
    applyRecoil(time) {
      const recoilConfig = this.weapon.recoilPattern;
      
      // Initial kick on first shot
      if (this.shotCount === 0) {
        this.currentRecoil.y += recoilConfig.initialKick.up;
        this.lastShotTime = time;
      }
  
      // Apply recoil pattern
      if (this.patternIndex < recoilConfig.pattern.length) {
        const pattern = recoilConfig.pattern[this.patternIndex];
        this.currentRecoil.x += pattern.x;
        this.currentRecoil.y += pattern.y;
      }
  
      this.shotCount++;
      this.patternIndex = (this.patternIndex + 1) % recoilConfig.pattern.length;
      this.isRecovering = false;
    }
  
    // Called every frame
    update(time, deltaTime) {
      const recoilConfig = this.weapon.recoilPattern;
  
      // Check if we should start recovery
      if (!this.isRecovering && 
          time - this.lastShotTime > recoilConfig.recovery.delay) {
        this.isRecovering = true;
      }
  
      // Apply recovery
      if (this.isRecovering) {
        // Exponential decay recovery
        this.currentRecoil.x *= Math.pow(recoilConfig.recovery.speed, deltaTime);
        this.currentRecoil.y *= Math.pow(recoilConfig.recovery.speed, deltaTime);
  
        // Reset when recoil is very small
        if (Math.abs(this.currentRecoil.x) < 0.01 && 
            Math.abs(this.currentRecoil.y) < 0.01) {
          this.reset();
        }
      }
  
      return this.currentRecoil;
    }
  
    // Reset recoil (called when stopping shooting)
    reset() {
      this.currentRecoil = { x: 0, y: 0 };
      this.patternIndex = 0;
      this.isRecovering = false;
      this.shotCount = 0;
    }
  
    // Get visual model offset for weapon
    getViewModelOffset() {
      const viewKick = this.weapon.viewModel.recoil.visualKick;
      return {
        x: -this.currentRecoil.x * viewKick.back,
        y: -this.currentRecoil.y * viewKick.up,
        rotation: -this.currentRecoil.x * viewKick.rotate
      };
    }
  }