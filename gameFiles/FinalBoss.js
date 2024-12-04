class FinalBoss extends Sprite {
  constructor(y, width, height) {
    super();
    this.x = canvas.width;
    this.y = y;
    this.width = width;
    this.height = height;
    this.frameIndex = 0;
    this.tickCount = 0;
    this.dx = 1;
    this.ticksPerFrame = 20;
    this.numberOfFrames = 4;
    this.health = 300;
    this.powerupDropped = false;
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
    this.shootCooldown = 700;
    this.lastShootTime = performance.now();
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

  update(sprites) {
    const currentTime = performance.now();

    if (currentTime - this.lastShootTime >= this.shootCooldown) {
      this.shootProjectile(sprites);
      this.lastShootTime = currentTime;
    }

    this.checkHealthThreshold(sprites);

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

    if (this.x <= 1200) {
      this.dx = 0;
    }
    this.x = this.x - this.dx / 2;
    return this.destroyed;
  }

  shootProjectile(sprites) {
    const projectile = new Projectile(
      this.x,
      this.y + this.height / 2 - 50,
      100,
      100,
      5
    );
    sprites.push(projectile);
  }

  checkHealthThreshold(sprites) {
    if (this.health % 50 === 0) {
      if (!this.powerupDropped) {
        const types = ["health", "shield", "shootCooldown", "orbReady"];
        const randomType = types[Math.floor(Math.random() * types.length)];
        const powerup = new PowerUp(this.x, 595, randomType);
        sprites.push(powerup);
        this.powerupDropped = true;
      }
    } else {
      this.powerupDropped = false;
    }
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
    const healthBarWidth = this.width * (this.health / 300);
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
