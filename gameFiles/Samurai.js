class Samurai extends Sprite {
  constructor(x, y, width, height) {
    super(); // Inherit from Sprite
    this.x = x;
    this.y = y; // Position
    this.width = width;
    this.height = height; // Size
    this.frameIndex = 0; // Tracks animation frame
    this.tickCount = 0; // Counts ticks for animation timing
    this.dx = 1; // Movement speed
    this.ticksPerFrame = 7; // Animation speed control
    this.health = 20; // Samurai health
    this.destroyed = false; // Whether samurai is destroyed
    this.isFrozen = false; // Freezing status
    this.currentRow = 0; // Sprite sheet row for current animation
    this.reverseAnimation = true; // Animation direction
    this.isPowerUpDropped = false; // Tracks if power-up was dropped

    // Animation configurations
    this.animations = {
      idle: { src: "/animation/samurai/IDLE.png", frames: 10 },
      attack: { src: "/animation/samurai/ATTACK 1.png", frames: 7 },
      hurt: { src: "/animation/samurai/HURT.png", frames: 4 },
      run: { src: "/animation/samurai/RUN.png", frames: 16 },
    };

    // Set default animation
    this.currentAnimation = "run";
    this.samurai = new Image();
    this.samurai.src = this.animations[this.currentAnimation].src;
    this.numberOfFrames = this.animations[this.currentAnimation].frames;
  }

  changeAnimation(animationName) {
    // Switch to a different animation if valid
    if (this.animations[animationName]) {
      this.currentAnimation = animationName;
      this.samurai.src = this.animations[animationName].src;
      this.numberOfFrames = this.animations[animationName].frames;
      this.frameIndex = 0; // Reset frame index
      this.tickCount = 0; // Reset tick count
    }
  }

  update(sprites) {
    if (this.destroyed) {
      this.dx = 0; // Stop moving when destroyed
      this.tickCount++;
      if (this.tickCount > this.ticksPerFrame) {
        this.tickCount = 0;
        this.frameIndex = Math.max(this.frameIndex - 1, 0); // Reverse animation until it stops
      }
      if (!this.isPowerUpDropped) {
        this.dropPowerUp(sprites); // Drop power-up when destroyed
        this.isPowerUpDropped = true;
      }
      return this.destroyed || this.frameIndex <= 0; // Return true if destruction is complete
    }

    this.tickCount++;
    if (this.tickCount > this.ticksPerFrame) {
      this.tickCount = 0;
      // Update animation frames based on direction
      if (this.reverseAnimation) {
        this.frameIndex =
          (this.frameIndex - 1 + this.numberOfFrames) % this.numberOfFrames;
      } else {
        this.frameIndex = (this.frameIndex + 1) % this.numberOfFrames;
      }
    }

    this.x -= this.dx; // Move samurai
    return this.destroyed; // Return destruction status
  }

  draw(ctx) {
    // Draw the current animation frame
    const frameWidth = this.samurai.width / this.numberOfFrames;
    const frameHeight = this.samurai.height;
    const rowY = frameHeight * this.currentRow;

    ctx.drawImage(
      this.samurai,
      frameWidth * this.frameIndex,
      rowY,
      frameWidth,
      frameHeight,
      this.x,
      this.y - 50,
      this.width,
      this.height
    );
    this.drawHealthBar(ctx); // Display health bar
  }

  dropPowerUp(sprites) {
    // 30% chance to drop a random power-up
    if (Math.random() < 0.3) {
      const types = ["health", "shield", "shootCooldown", "orbReady"];
      const powerup = new PowerUp(
        this.x,
        595,
        types[Math.floor(Math.random() * types.length)]
      );
      sprites.push(powerup); // Add to game objects
    }
  }

  drawHealthBar(ctx) {
    // Draw health bar above samurai
    const healthBarWidth = this.width * (this.health / 20);
    this.health = Math.max(this.health, 0); // Ensure health doesn't drop below 0

    ctx.fillStyle = "red"; // Background bar
    ctx.fillRect(this.x - 22, this.y + 40, this.width, 5);

    ctx.fillStyle = "green"; // Current health
    ctx.fillRect(this.x - 22, this.y + 40, healthBarWidth, 5);
  }

  animationFinished() {
    return this.destroyed && this.frameIndex <= 0; // True when destruction animation completes
  }

  getCurrentFrameIndex() {
    return this.frameIndex; // Expose current animation frame
  }
}
