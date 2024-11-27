class Orb extends Sprite {
  constructor(x, y, width, height) {
    super();
    this.x = x;
    this.y = y;
    this.dx = 10;
    this.width = width;
    this.height = height;
    this.frames = [];
    this.frameIndex = 0;
    this.tickCount = 0;
    this.ticksPerFrame = 5;
    this.destroyed = false;
    const framePaths = [
      "/animation/orb/pulse1.png",
      "/animation/orb/pulse2.png",
      "/animation/orb/pulse3.png",
      "/animation/orb/pulse4.png",
    ];

    framePaths.forEach((path) => {
      const img = new Image();
      img.src = path;
      this.frames.push(img);
    });
  }

  update() {
    this.tickCount++;

    if (this.tickCount > this.ticksPerFrame) {
      this.tickCount = 0;
      this.frameIndex++;

      if (this.frameIndex >= this.frames.length) {
        this.frameIndex = 0;
      }
    }

    this.x += this.dx;

    return this.destroyed || this.x > canvas.width;
  }

  draw(ctx) {
    const currentFrame = this.frames[this.frameIndex];
    ctx.drawImage(currentFrame, this.x, this.y, this.width, this.height);
  }
}
