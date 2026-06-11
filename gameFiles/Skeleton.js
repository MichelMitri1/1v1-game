class Skeleton extends Sprite {
  constructor(x, y, width, height) {
    super(); // Inherit from Sprite
    this.x = x;
    this.y = y; // Position
    this.width = width;
    this.height = height; // Size
    this.frameIndex = 12; // Starts at the last animation frame
    this.tickCount = 0; // Tracks animation timing
    this.dx = 1; // Movement speed
    this.ticksPerFrame = 10; // Animation speed control
    this.numberOfFrames = 13; // Total animation frames
    this.health = 15; // Skeleton health
    this.destroyed = false; // Whether skeleton is destroyed
    this.isFrozen = false; // Freezing status
    this.currentRow = 2; // Sprite sheet row for current animation
    this.isPowerUpDropped = false; // Power-up drop tracking
    this.reverseAnimation = true; // Controls forward or reverse animation
    this.skeleton = new Image(); // Load skeleton sprite
    this.skeleton.src = "/animation/skeleton/skeleton.png"; // Path to sprite sheet
  }

  update(sprites) {
    if (this.destroyed) {
      this.dx = 0; // Stop moving if destroyed
      this.tickCount++;
      if (this.tickCount > this.ticksPerFrame) {
        this.tickCount = 0;
        this.frameIndex--; // Play destruction animation in reverse
        if (this.frameIndex < 0) this.frameIndex = 0;
      }
      if (!this.isPowerUpDropped) {
        this.dropPowerUp(sprites); // Drop power-up on destruction
        this.isPowerUpDropped = true;
      }
      return this.destroyed && this.frameIndex <= 0; // Return true when animation finishes
    }

    this.tickCount++;
    if (this.tickCount > this.ticksPerFrame) {
      this.tickCount = 0;
      if (this.reverseAnimation) {
        this.frameIndex =
          (this.frameIndex - 1 + this.numberOfFrames) % this.numberOfFrames;
      } else {
        this.frameIndex = (this.frameIndex + 1) % this.numberOfFrames;
      }
    }
    this.x -= this.dx; // Move skeleton
    return this.destroyed; // Return destruction status
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

  draw(ctx) {
    // Draw the current animation frame
    const frameWidth = this.skeleton.width / 13;
    const frameHeight = this.skeleton.height / 5;
    const rowY = frameHeight * this.currentRow;

    ctx.drawImage(
      this.skeleton,
      frameWidth * this.frameIndex,
      rowY,
      frameWidth,
      frameHeight,
      this.x - 20,
      this.y,
      this.width,
      this.height
    );
    this.drawHealthBar(ctx); // Display health bar
  }

  drawHealthBar(ctx) {
    // Draw health bar above skeleton
    const healthBarWidth = this.width * (this.health / 15);
    if (this.health < 0) this.health = 0;

    ctx.fillStyle = "red"; // Background bar
    ctx.fillRect(this.x - 22, this.y + 40, this.width, 5);
    ctx.fillStyle = "green"; // Current health
    ctx.fillRect(this.x - 22, this.y + 40, healthBarWidth, 5);
  }

  animationFinished() {
    return this.destroyed && this.frameIndex <= 0; // True when destruction animation completes
  }

  getCurrentFrameIndex() {
    return this.frameIndex; // Expose current frame index
  }
}
