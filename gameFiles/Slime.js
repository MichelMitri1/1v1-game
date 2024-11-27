class Slime extends Sprite {
  constructor(x, y, width, height) {
    super();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.frameIndex = 0;
    this.tickCount = 0;
    this.dx = 1;
    this.ticksPerFrame = 25;
    this.numberOfFrames = 4;
    this.health = 10;
    this.destroyed = false;
    this.slime = new Image();
    this.slime.src = "/animation/slime/slime.png";
  }

  update() {
    this.tickCount++;
    if (this.tickCount > this.ticksPerFrame) {
      this.tickCount = 0;
      this.frameIndex++;
      if (this.frameIndex >= this.numberOfFrames) {
        this.frameIndex = 0;
      }
    }
    this.x -= this.dx;
    return this.destroyed;
  }

  draw(ctx) {
    const frameWidth = this.slime.width / this.numberOfFrames;
    const frameHeight = this.slime.height;

    ctx.drawImage(
      this.slime,
      frameWidth * this.frameIndex,
      0,
      frameWidth,
      frameHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );

    this.drawHealthBar(ctx);
  }

  drawHealthBar(ctx) {
    const healthBarWidth = this.width * (this.health / 10);

    ctx.fillStyle = "red";
    ctx.fillRect(this.x - 22, this.y + 10, this.width, 5);

    ctx.fillStyle = "green";
    ctx.fillRect(this.x - 22, this.y + 10, healthBarWidth, 5);
  }

  animationFinished() {
    return this.frameIndex >= this.numberOfFrames;
  }
}
