class Bringer extends Sprite {
  constructor(x, y, width, height) {
    super(); // Inherit from Sprite
    this.x = x;
    this.y = y; // Position
    this.width = width;
    this.height = height; // Size
    this.frameIndex = 0; // Tracks animation frame
    this.tickCount = 0; // Counts ticks for animation timing
    this.dx = 1; // Movement speed
    this.ticksPerFrame = 15; // Animation speed control
    this.numberOfFrames = 8; // Total animation frames
    this.health = 20; // Bringer health
    this.destroyed = false; // Whether bringer is destroyed
    this.currentRow = 1; // Sprite sheet row for current animation
    this.reverseAnimation = false; // Controls animation direction
    this.isFrozen = false; // Freezing status
    this.isPowerUpDropped = false; // Tracks if power-up was dropped
    this.bringer = new Image(); // Load bringer sprite
    this.bringer.src = "/animation/bringer/bringer.png"; // Path to sprite sheet
  }

  update(sprites) {
    if (this.destroyed) {
      this.dx = 0; // Stop moving when destroyed
      this.tickCount++;
      if (this.tickCount > this.ticksPerFrame) {
        this.tickCount = 0;
        this.frameIndex++; // Advance destruction animation
        if (this.frameIndex >= this.numberOfFrames) {
          this.frameIndex = this.numberOfFrames - 1; // Stay on the last frame
        }
      }
      if (!this.isPowerUpDropped) {
        this.dropPowerUp(sprites); // Drop power-up if destroyed
        this.isPowerUpDropped = true;
      }
      return this.animationFinished(); // Return true when animation ends
    }

    this.tickCount++;
    if (this.tickCount > this.ticksPerFrame) {
      this.tickCount = 0;
      this.frameIndex = (this.frameIndex + 1) % this.numberOfFrames; // Loop animation
    }

    this.x -= this.dx; // Move bringer
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
    const frameWidth = this.bringer.width / 8;
    const frameHeight = this.bringer.height / 8;
    const rowY = frameHeight * this.currentRow;

    ctx.drawImage(
      this.bringer,
      frameWidth * this.frameIndex,
      rowY,
      frameWidth,
      frameHeight,
      this.x - 120,
      this.y,
      this.width,
      this.height
    );
    this.drawHealthBar(ctx); // Display health bar
  }

  drawHealthBar(ctx) {
    // Draw health bar above bringer
    const healthBarWidth = (this.width - 100) * (this.health / 20);

    ctx.fillStyle = "red"; // Background bar
    ctx.fillRect(this.x, this.y + 50, this.width - 100, 5);

    ctx.fillStyle = "green"; // Current health
    ctx.fillRect(this.x, this.y + 50, healthBarWidth, 5);
  }

  animationFinished() {
    return this.destroyed && this.frameIndex >= this.numberOfFrames - 1; // True when destruction animation completes
  }

  getCurrentFrameIndex() {
    return this.frameIndex; // Expose current animation frame
  }
}
