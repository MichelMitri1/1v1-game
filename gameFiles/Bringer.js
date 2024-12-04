class Bringer extends Sprite {
  constructor(x, y, width, height) {
    super();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.frameIndex = 0;
    this.tickCount = 0;
    this.dx = 1;
    this.ticksPerFrame = 15;
    this.numberOfFrames = 8;
    this.health = 35;
    this.destroyed = false;
    this.currentRow = 1;
    this.reverseAnimation = false;
    this.isFrozen = false;
    this.isPowerUpDropped = false;
    this.bringer = new Image();
    this.bringer.src = "/animation/bringer/bringer.png";
  }

  update(sprites) {
    if (this.destroyed) {
      this.dx = 0;

      this.tickCount++;
      if (this.tickCount > this.ticksPerFrame) {
        this.tickCount = 0;
        this.frameIndex++;
        if (this.frameIndex >= this.numberOfFrames) {
          this.frameIndex = this.numberOfFrames - 1;
        }
      }
      if (!this.isPowerUpDropped) {
        this.dropPowerUp(sprites);
        this.isPowerUpDropped = true;
      }

      return this.animationFinished();
    }

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

  dropPowerUp(sprites) {
    const dropChance = Math.random();
    if (dropChance < 0.3) {
      const types = ["health", "shield", "shootCooldown", "orbReady"];
      const randomType = types[Math.floor(Math.random() * types.length)];
      const powerup = new PowerUp(this.x, 595, randomType);
      sprites.push(powerup);
    }
  }

  draw(ctx) {
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
    this.drawHealthBar(ctx);
  }

  getCurrentFrameIndex() {
    return this.frameIndex;
  }

  drawHealthBar(ctx) {
    const healthBarWidth = (this.width - 100) * (this.health / 35);

    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y + 50, this.width - 100, 5);

    ctx.fillStyle = "green";
    ctx.fillRect(this.x, this.y + 50, healthBarWidth, 5);
  }

  animationFinished() {
    return this.destroyed && this.frameIndex >= this.numberOfFrames - 1;
  }
}
