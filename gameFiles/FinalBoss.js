class FinalBoss extends Sprite {
  constructor(y, width, height) {
    super(); // Inherit from Sprite
    this.x = canvas.width; // Start from the right of the canvas
    this.y = y; // Vertical position
    this.width = width;
    this.height = height; // Boss size
    this.frameIndex = 0; // Tracks animation frame
    this.tickCount = 0; // Counts ticks for animation timing
    this.dx = 1; // Movement speed
    this.ticksPerFrame = 20; // Animation speed control
    this.numberOfFrames = 4; // Total frames in the current animation
    this.health = 100; // Boss health
    this.powerupDropped = false; // Tracks if a power-up has been dropped
    this.destroyed = false; // Whether the boss is destroyed
    this.currentRow = 0; // Row in sprite sheet for current animation
    this.reverseAnimation = false; // Controls animation direction

    // Define animations for the boss
    this.animations = {
      idle: { src: "/animation/finalBoss/IDLE.png", frames: 4 },
      attack: { src: "/animation/finalBoss/ATTACK.png", frames: 8 },
      death: { src: "/animation/finalBoss/DEATH.png", frames: 7 },
      flying: { src: "/animation/finalBoss/FLYING.png", frames: 4 },
      hurt: { src: "/animation/finalBoss/HURT.png", frames: 4 },
    };

    this.currentAnimation = "flying"; // Default animation
    this.finalBoss = new Image();
    this.finalBoss.src = this.animations[this.currentAnimation].src;
    this.numberOfFrames = this.animations[this.currentAnimation].frames;

    this.shootCooldown = 1500; // Interval between projectiles (ms)
    this.lastShootTime = performance.now(); // Tracks last shot time
  }

  changeAnimation(animationName) {
    // Switch to a new animation if valid
    if (this.animations[animationName]) {
      this.currentAnimation = animationName;
      this.finalBoss.src = this.animations[animationName].src;
      this.numberOfFrames = this.animations[animationName].frames;
      this.frameIndex = 0; // Reset animation frame
      this.tickCount = 0; // Reset tick counter
    }
  }

  update(sprites) {
    const currentTime = performance.now();

    // Shoot projectiles at regular intervals
    if (currentTime - this.lastShootTime >= this.shootCooldown) {
      this.shootProjectile(sprites);
      this.lastShootTime = currentTime;
    }

    this.checkHealthThreshold(sprites); // Drop power-ups at health milestones

    if (this.destroyed) {
      this.dx = 0; // Stop moving when destroyed
      this.tickCount++;
      if (this.tickCount > this.ticksPerFrame) {
        this.tickCount = 0;
        this.frameIndex = Math.max(this.frameIndex - 1, 0); // Reverse animation
      }
      return this.destroyed || this.frameIndex <= 0; // Return true when death animation finishes
    }

    this.tickCount++;
    if (this.tickCount > this.ticksPerFrame) {
      this.tickCount = 0;
      // Advance or reverse animation frames
      if (this.reverseAnimation) {
        this.frameIndex =
          (this.frameIndex - 1 + this.numberOfFrames) % this.numberOfFrames;
      } else {
        this.frameIndex = (this.frameIndex + 1) % this.numberOfFrames;
      }
    }

    // Stop moving at a fixed position
    if (this.x <= 1200) this.dx = 0;

    this.x -= this.dx / 2; // Slow movement
    return this.destroyed; // Return destruction status
  }

  shootProjectile(sprites) {
    // Shoots a projectile aimed at the player
    const projectile = new Projectile(
      this.x,
      this.y + this.height / 2 - 50,
      100,
      100,
      5
    );
    sprites.push(projectile);
  }

  checkHealthThreshold(sprites) {
    // Drops a power-up when health hits a multiple of 50
    if (this.health % 50 === 0) {
      if (!this.powerupDropped) {
        const types = ["health", "shield", "shootCooldown", "orbReady"];
        const powerup = new PowerUp(
          this.x,
          595,
          types[Math.floor(Math.random() * types.length)]
        );
        sprites.push(powerup);
        this.powerupDropped = true;
      }
    } else {
      this.powerupDropped = false; // Reset flag for next threshold
    }
  }

  draw(ctx) {
    // Draw the current animation frame
    const frameWidth = this.finalBoss.width / this.numberOfFrames;
    const frameHeight = this.finalBoss.height;
    const rowY = frameHeight * this.currentRow;

    ctx.drawImage(
      this.finalBoss,
      frameWidth * this.frameIndex,
      rowY,
      frameWidth,
      frameHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
    this.drawHealthBar(ctx); // Display health bar
  }

  drawHealthBar(ctx) {
    // Display health bar above the boss
    const healthBarWidth = this.width * (this.health / 100);
    this.health = Math.max(this.health, 0); // Ensure health doesn't drop below 0

    ctx.fillStyle = "red"; // Background bar
    ctx.fillRect(this.x - 22, this.y + 40, this.width, 5);

    ctx.fillStyle = "green"; // Current health
    ctx.fillRect(this.x - 22, this.y + 40, healthBarWidth, 5);
  }

  animationFinished() {
    return this.destroyed && this.frameIndex <= 0; // True when death animation completes
  }
}
