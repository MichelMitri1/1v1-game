class Slime extends Sprite {
  constructor(x, y, width, height) {
    super(); // Inherit from Sprite
    this.x = x;
    this.y = y; // Position
    this.width = width;
    this.height = height; // Size
    this.frameIndex = 0; // Tracks animation frame
    this.tickCount = 0; // Counts ticks for animation timing
    this.dx = 1; // Movement speed
    this.ticksPerFrame = 25; // Time between animation frames
    this.numberOfFrames = 4; // Total animation frames
    this.health = 10; // Slime health
    this.destroyed = false; // Flag for whether slime is destroyed
    this.isFrozen = false; // Flag for freezing slime
    this.isPowerUpDropped = false; // Tracks if power-up was dropped
    this.slime = new Image(); // Load slime sprite
    this.slime.src = "/animation/slime/slime.png"; // Path to sprite sheet
  }

  update(sprites) {
    this.tickCount++;
    if (this.tickCount > this.ticksPerFrame) {
      this.tickCount = 0;
      this.frameIndex = (this.frameIndex + 1) % this.numberOfFrames; // Cycle animation
    }
    if (this.destroyed && !this.isPowerUpDropped) {
      this.dropPowerUp(sprites); // Drop power-up if destroyed
      this.isPowerUpDropped = true;
    }
    this.x -= this.dx; // Move slime
    return this.destroyed; // Return destruction state
  }

  draw(ctx) {
    // Draw the current animation frame
    const frameWidth = this.slime.width / this.numberOfFrames;
    ctx.drawImage(
      this.slime,
      frameWidth * this.frameIndex,
      0,
      frameWidth,
      this.slime.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
    this.drawHealthBar(ctx); // Show health bar
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
      sprites.push(powerup); // Add to the game
    }
  }

  drawHealthBar(ctx) {
    // Visual health bar above the slime
    const healthBarWidth = this.width * (this.health / 10);
    ctx.fillStyle = "red"; // Background bar
    ctx.fillRect(this.x - 22, this.y + 10, this.width, 5);
    ctx.fillStyle = "green"; // Current health
    ctx.fillRect(this.x - 22, this.y + 10, healthBarWidth, 5);
  }

  animationCycleComplete() {
    // Returns true when the animation cycle ends
    return (
      this.frameIndex === this.numberOfFrames - 1 &&
      this.tickCount === this.ticksPerFrame
    );
  }

  getCurrentFrameIndex() {
    return this.frameIndex; // Expose current animation frame
  }
}
