class Explosion extends Sprite {
  constructor(x, y, width, height) {
    super(); // Initialize the parent Sprite class

    // Explosion position and size
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    // Animation properties
    this.frameIndex = 0; // Current frame of the explosion animation
    this.tickCount = 0; // Counter to manage frame timing
    this.ticksPerFrame = 20; // Frames remain visible for this many ticks
    this.numberOfFrames = 12; // Total frames in the explosion animation

    // Explosion sprite sheet
    this.explosion = new Image();
    this.explosion.src = "/animation/orb/explosion.png"; // Path to explosion animation

    // Sound effect for the explosion
    this.orbExplosionSoundEffect = new Audio("/audioFiles/explosionOrb.mp3");
    this.orbExplosionSoundEffect.play(); // Play the sound effect when the explosion is created
  }

  // Updates the explosion animation
  update() {
    this.tickCount++; // Increment the tick counter
    if (this.tickCount > this.ticksPerFrame) {
      this.tickCount = 0; // Reset the tick counter
      this.frameIndex++; // Move to the next animation frame
      if (this.frameIndex >= this.numberOfFrames) {
        return true; // Animation is finished
      }
    }
    return false; // Animation is still ongoing
  }

  // Draws the current frame of the explosion on the canvas
  draw(ctx) {
    const frameWidth = this.explosion.width / this.numberOfFrames; // Width of each frame in the sprite sheet
    ctx.drawImage(
      this.explosion,
      frameWidth * this.frameIndex, // X position in the sprite sheet
      0,
      frameWidth,
      this.explosion.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  // Checks if the animation has finished
  animationFinished() {
    return this.frameIndex >= this.numberOfFrames; // Returns true if the last frame has been reached
  }
}
