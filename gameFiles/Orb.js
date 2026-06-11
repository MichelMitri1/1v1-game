class Orb extends Sprite {
  constructor(x, y, width, height) {
    super(); // Initialize the parent Sprite class

    // Orb position and movement
    this.x = x;
    this.y = y;
    this.dx = 10; // Speed of the orb
    this.width = width;
    this.height = height;

    // Animation properties
    this.frames = []; // Array to hold orb animation frames
    this.frameIndex = 0; // Current animation frame index
    this.tickCount = 0; // Tick counter for frame timing
    this.ticksPerFrame = 5; // Number of ticks per frame
    this.destroyed = false; // Tracks if the orb has been destroyed

    // Load animation frames from specified file paths
    const framePaths = [
      "/animation/orb/pulse1.png",
      "/animation/orb/pulse2.png",
      "/animation/orb/pulse3.png",
      "/animation/orb/pulse4.png",
    ];

    framePaths.forEach((path) => {
      const img = new Image();
      img.src = path; // Set the source for each frame
      this.frames.push(img); // Add the frame to the array
    });
  }

  // Updates the orb's position and animation
  update() {
    this.tickCount++; // Increment the tick counter

    // Update the animation frame if enough ticks have passed
    if (this.tickCount > this.ticksPerFrame) {
      this.tickCount = 0; // Reset the tick counter
      this.frameIndex++; // Advance to the next frame

      // Loop back to the first frame if the end is reached
      if (this.frameIndex >= this.frames.length) {
        this.frameIndex = 0;
      }
    }

    this.x += this.dx; // Move the orb to the right

    // Mark the orb as destroyed if it moves off-screen
    return this.destroyed || this.x > canvas.width;
  }

  // Draws the current frame of the orb animation
  draw(ctx) {
    const currentFrame = this.frames[this.frameIndex]; // Get the current animation frame
    ctx.drawImage(currentFrame, this.x, this.y, this.width, this.height); // Draw the frame
  }
}
