class FinalBoss extends Sprite {
  constructor(y, width, height) {
    super();
    this.x = canvas.width - 400;
    this.y = y;
    this.width = width;
    this.height = height;
    this.frameIndex = 0;
    this.tickCount = 0;
    this.dx = 1;
    this.ticksPerFrame = 20;
    this.numberOfFrames = 4;
    this.health = 100;
    this.destroyed = false;
    this.currentRow = 0;
    this.reverseAnimation = false;

    this.animations = {
      idle: { src: "/animation/finalBoss/IDLE.png", frames: 4 },
      attack: { src: "/animation/finalBoss/ATTACK.png", frames: 8 },
      death: { src: "/animation/finalBoss/DEATH.png", frames: 7 },
      flying: { src: "/animation/finalBoss/FLYING.png", frames: 4 },
      hurt: { src: "/animation/finalBoss/HURT.png", frames: 4 },
    };

    this.currentAnimation = "flying";
    this.finalBoss = new Image();
    this.finalBoss.src = this.animations[this.currentAnimation].src;
    this.numberOfFrames = this.animations[this.currentAnimation].frames;
  }

  changeAnimation(animationName) {
    if (this.animations[animationName]) {
      this.currentAnimation = animationName;
      this.finalBoss.src = this.animations[animationName].src;
      this.numberOfFrames = this.animations[animationName].frames;
      this.frameIndex = 0;
      this.tickCount = 0;
    }
  }

  update() {
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
    this.x = this.x - this.dx / 2;
    return this.destroyed;
  }

  draw(ctx) {
    const frameWidth = this.finalBoss.width / this.numberOfFrames;
    const frameHeight = this.finalBoss.height;
    const rowY = frameHeight * this.currentRow;

    ctx.drawImage(
      this.finalBoss,
      frameWidth * this.frameIndex,
      rowY,
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
    const healthBarWidth = this.width * (this.health / 100);
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
