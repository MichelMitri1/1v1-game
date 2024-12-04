class Samurai extends Sprite {
  constructor(x, y, width, height) {
    super();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.frameIndex = 0;
    this.tickCount = 0;
    this.dx = 1;
    this.ticksPerFrame = 7;
    this.health = 30;
    this.destroyed = false;
    this.isFrozen = false;
    this.currentRow = 0;
    this.reverseAnimation = true;
    this.isPowerUpDropped = false;
    this.animations = {
      idle: { src: "/animation/samurai/IDLE.png", frames: 10 },
      attack: { src: "/animation/samurai/ATTACK 1.png", frames: 7 },
      hurt: { src: "/animation/samurai/HURT.png", frames: 4 },
      run: { src: "/animation/samurai/RUN.png", frames: 16 },
    };

    this.currentAnimation = "run";
    this.samurai = new Image();
    this.samurai.src = this.animations[this.currentAnimation].src;
    this.numberOfFrames = this.animations[this.currentAnimation].frames;
  }

  changeAnimation(animationName) {
    if (this.animations[animationName]) {
      this.currentAnimation = animationName;
      this.samurai.src = this.animations[animationName].src;
      this.numberOfFrames = this.animations[animationName].frames;
      this.frameIndex = 0;
      this.tickCount = 0;
    }
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

      return this.destroyed || this.frameIndex <= 0;
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

  draw(ctx) {
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
    this.drawHealthBar(ctx);
  }

  getCurrentFrameIndex() {
    return this.frameIndex;
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

  drawHealthBar(ctx) {
    const healthBarWidth = this.width * (this.health / 30);
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
