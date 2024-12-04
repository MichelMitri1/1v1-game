class Skeleton extends Sprite {
  constructor(x, y, width, height) {
    super();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.frameIndex = 12;
    this.tickCount = 0;
    this.dx = 1;
    this.ticksPerFrame = 10;
    this.numberOfFrames = 13;
    this.health = 25;
    this.destroyed = false;
    this.isFrozen = false;
    this.currentRow = 2;
    this.isPowerUpDropped = false;
    this.reverseAnimation = true;
    this.skeleton = new Image();
    this.skeleton.src = "/animation/skeleton/skeleton.png";
  }

  update(sprites) {
    if (this.destroyed) {
      this.dx = 0;
      this.tickCount++;
      if (this.tickCount > this.ticksPerFrame) {
        this.tickCount = 0;
        this.frameIndex--;
        if (this.frameIndex < 0) {
          this.frameIndex = 0;
        }
      }

      if (!this.isPowerUpDropped) {
        this.dropPowerUp(sprites);
        this.isPowerUpDropped = true;
      }

      return this.destroyed && this.frameIndex <= 0;
    }

    this.tickCount++;
    if (this.tickCount > this.ticksPerFrame) {
      this.tickCount = 0;
      if (this.reverseAnimation) {
        this.frameIndex--;
        if (this.frameIndex < 0) {
          this.frameIndex = this.numberOfFrames - 1;
        }
      } else {
        this.frameIndex++;
        if (this.frameIndex >= this.numberOfFrames) {
          this.frameIndex = 0;
        }
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
    this.drawHealthBar(ctx);
  }

  getCurrentFrameIndex() {
    return this.frameIndex;
  }

  drawHealthBar(ctx) {
    const healthBarWidth = this.width * (this.health / 25);
    if (this.health < 0) {
      this.health = 0;
    }

    ctx.fillStyle = "red";
    ctx.fillRect(this.x - 22, this.y + 40, this.width, 5);

    ctx.fillStyle = "green";
    ctx.fillRect(this.x - 22, this.y + 40, healthBarWidth, 5);
  }

  animationFinished() {
    return this.destroyed && this.frameIndex <= 0;
  }
}
