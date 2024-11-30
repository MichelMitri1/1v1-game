class Hero extends Sprite {
  constructor(x, y, width, height) {
    super();
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.vy = 0;
    this.width = width;
    this.height = height;
    this.isJumping = false;
    this.gravity = 0.1;
    this.jumpStrength = -5;
    this.groundY = y;
    this.canShoot = true;
    this.reloading = false;
    this.health = 200;
    this.score = 0;
    this.shootSoundEffect = new Audio("/audioFiles/shooting.wav");
    this.orbSoundEffect = new Audio("/audioFiles/shootingOrb.mp3");
    this.deathSoundEffect = new Audio("/audioFiles/deathSound.mp3");
    this.orbCooldown = 1600;
    this.originalOrbCooldown = this.orbCooldown;
    this.isTakingDamage = false;
    this.level = 1;
    this.wave = 1;
    this.animations = {
      idle: {
        spriteSheet: new Image(),
        numberOfFrames: 4,
        ticksPerFrame: 45,
      },
      run: {
        spriteSheet: new Image(),
        numberOfFrames: 6,
        ticksPerFrame: 10,
      },
      jump: {
        spriteSheet: new Image(),
        numberOfFrames: 4,
        ticksPerFrame: 15,
      },
      attack: {
        spriteSheet: new Image(),
        numberOfFrames: 8,
        ticksPerFrame: 2,
      },
      hurt: {
        spriteSheet: new Image(),
        numberOfFrames: 4,
        ticksPerFrame: 15,
      },
      death: {
        spriteSheet: new Image(),
        numberOfFrames: 6,
        ticksPerFrame: 20,
      },
    };

    this.currentAnimation = "idle";
    this.animation = {
      frameIndex: 0,
      tickCount: 0,
    };

    this.animations.idle.spriteSheet.src = "/animation/character/Punk_idle.png";
    this.animations.run.spriteSheet.src = "/animation/character/Punk_run.png";
    this.animations.jump.spriteSheet.src = "/animation/character/Punk_jump.png";
    this.animations.attack.spriteSheet.src =
      "/animation/character/Punk_attack3.png";
    this.animations.hurt.spriteSheet.src = "/animation/character/Punk_hurt.png";
    this.animations.death.spriteSheet.src =
      "/animation/character/Punk_death.png";

    this.initUI();
  }

  initUI() {
    const preconnect1 = document.createElement("link");
    preconnect1.rel = "preconnect";
    preconnect1.href = "https://fonts.googleapis.com";
    document.head.appendChild(preconnect1);

    const preconnect2 = document.createElement("link");
    preconnect2.rel = "preconnect";
    preconnect2.href = "https://fonts.gstatic.com";
    preconnect2.crossOrigin = "anonymous";
    document.head.appendChild(preconnect2);

    const fontLink = document.createElement("link");
    fontLink.href =
      "https://fonts.googleapis.com/css2?family=Tiny5&display=swap";
    fontLink.rel = "stylesheet";
    document.head.appendChild(fontLink);

    const styleElement = document.createElement("style");
    styleElement.innerHTML = `
      .tiny5-regular {
        font-family: "Tiny5", sans-serif;
        font-weight: 400;
        font-style: normal;
      }
    `;
    document.head.appendChild(styleElement);

    const canvas = document.getElementById("canvas");
    canvas.style.position = "relative";

    this.container = document.createElement("div");
    this.container.className = "container";
    this.container.style.position = "absolute";
    this.container.style.top = "0px";
    this.container.style.left = "45px";
    this.container.style.color = "purple";
    this.container.style.pointerEvents = "none";

    this.scoreElement = document.createElement("h1");
    this.scoreElement.id = "score";
    this.scoreElement.innerHTML = `Score: ${this.score}`;
    this.scoreElement.className = "tiny5-regular";
    this.container.appendChild(this.scoreElement);

    this.orbReadyElement = document.createElement("h1");
    this.orbReadyElement.id = "orbCooldown";
    this.orbReadyElement.innerHTML = `Orb: Ready`;
    this.orbReadyElement.className = "tiny5-regular";
    this.container.appendChild(this.orbReadyElement);

    canvas.parentElement.appendChild(this.container);
  }

  update(sprites, keys) {
    this.handleMovement(keys);
    this.handleShooting(sprites, keys);
    this.updateAnimation();
    this.handleCheckIfEnemyCloseToPlayer(sprites);
    this.handlePlayerDeath();
    this.handleCollisions(sprites);
  }

  handleMovement(keys) {
    if (keys["d"] && this.x + this.width < canvas.width) {
      this.dx = 2;
    } else if (keys["a"] && this.x > 0) {
      this.dx = -2;
    } else {
      this.dx = 0;
    }

    if (keys["w"] && !this.isJumping) {
      this.isJumping = true;
      this.vy = this.jumpStrength;
      this.currentAnimation = "jump";
    }

    if (this.isJumping) {
      this.vy += this.gravity;
      this.y += this.vy;

      if (this.y >= this.groundY) {
        this.y = this.groundY;
        this.isJumping = false;
        this.vy = 0;
        this.currentAnimation = this.dx !== 0 ? "run" : "idle";
      }

      this.x += this.dx;
      return;
    }

    if (this.dx !== 0) {
      this.currentAnimation = "run";
    } else {
      this.currentAnimation = "idle";
    }

    this.x += this.dx;
  }

  handleShooting(sprites, keys) {
    if (this.orbCooldown < this.originalOrbCooldown) {
      this.orbCooldown += 1;
      this.orbReadyElement.innerHTML = `Orb: Ready In ${Math.floor(
        (this.originalOrbCooldown - this.orbCooldown) / 160
      )}`;
    } else {
      this.orbReadyElement.innerHTML = `Orb: Ready`;
    }

    if (!this.shootCooldown) this.shootCooldown = 0;

    if (this.shootCooldown > 0) {
      this.shootCooldown -= 1;
    }

    if (keys[" "] && this.shootCooldown === 0) {
      const bullet = new Bullet(this.x + 30, this.y + 30, 50, 50);
      const shootSoundEffectInstance = this.shootSoundEffect.cloneNode();
      shootSoundEffectInstance.play();
      sprites.push(bullet);
      this.shootCooldown = 23;
    }

    if (!keys[" "]) {
      this.shootCooldown = 0;
    }

    if (keys["l"] && this.orbCooldown === this.originalOrbCooldown) {
      this.orbSoundEffect.play();
      this.currentAnimation = "attack";
      const orb = new Orb(this.x + 30, this.y + 10, 100, 100);
      sprites.push(orb);
      this.orbCooldown = 0;
    }
  }

  handleCheckIfEnemyCloseToPlayer(sprites) {
    const targets = sprites.filter(
      (sprite) =>
        sprite instanceof Slime ||
        sprite instanceof Skeleton ||
        sprite instanceof Bringer ||
        sprite instanceof FinalBoss ||
        sprite instanceof Samurai
    );

    targets.forEach((target) => {
      if (this.health > 0) {
        if (target instanceof Bringer) {
          const isClose = target.x <= this.x + this.width - 20;

          if (isClose && target.health > 0) {
            if (!target.isFrozen) {
              target.frameIndex = 0;
              target.currentRow = 2;
              target.dx = 0;
              target.isFrozen = true;
            }

            if (
              target.getCurrentFrameIndex() === target.numberOfFrames - 1 &&
              target.tickCount === 0 &&
              !this.isTakingDamage
            ) {
              this.health -= 5;
              this.isTakingDamage = true;
            }

            if (target.getCurrentFrameIndex() === 0) {
              this.isTakingDamage = false;
            }
          }

          if (!isClose && target.isFrozen && target.health > 0) {
            target.dx = 1;
            target.currentRow = 1;
            target.isFrozen = false;
          }
        }

        if (target instanceof Skeleton) {
          const isClose = target.x <= this.x + this.width - 70;

          if (isClose && target.health > 0) {
            if (!target.isFrozen) {
              target.frameIndex = 0;
              target.currentRow = 0;
              target.dx = 0;
              target.isFrozen = true;
            }

            if (
              target.getCurrentFrameIndex() === 4 &&
              target.tickCount === 0 &&
              !this.isTakingDamage
            ) {
              this.health -= 3;
              this.isTakingDamage = true;
            }

            if (target.getCurrentFrameIndex() !== 4) {
              this.isTakingDamage = false;
            }
          }

          if (!isClose && target.isFrozen && target.health > 0) {
            target.dx = 1;
            target.currentRow = 2;
            target.isFrozen = false;
          }
        }

        if (target instanceof Samurai) {
          const isClose = target.x <= this.x + this.width - 100;

          if (isClose && target.health > 0) {
            if (!target.isFrozen) {
              target.frameIndex = 0;
              target.dx = 0;
              target.isFrozen = true;
              target.ticksPerFrame = 8;
              target.changeAnimation("attack");
            }

            if (
              target.getCurrentFrameIndex() === 5 &&
              target.tickCount === 0 &&
              !this.isTakingDamage
            ) {
              this.health -= 5;
              this.isTakingDamage = true;
            }

            if (target.getCurrentFrameIndex() !== 5) {
              this.isTakingDamage = false;
            }
          }

          if (!isClose && target.isFrozen && target.health > 0) {
            target.dx = 1;
            target.changeAnimation("run");
            target.ticksPerFrame = 7;
            target.isFrozen = false;
          }
        }

        if (target instanceof Slime) {
          var canHit = false;
          const isClose = target.x <= this.x + this.width - 100;
          if (isClose && target.health > 0) {
            canHit = true;
            target.dx = 0;
            target.isFrozen = true;
          }

          if (!isClose && target.isFrozen && target.health > 0) {
            canHit = true;
            target.dx = 1;
            target.isFrozen = false;
          }

          if (canHit) {
            if (
              target.getCurrentFrameIndex() === 0 &&
              target.tickCount === 0 &&
              !this.isTakingDamage
            ) {
              this.health -= 1;
              this.isTakingDamage = true;
            }
          }
          if (target.animationCycleComplete()) {
            this.isTakingDamage = false;
          }
        }
      }
    });
  }

  handleCollisions(sprites) {
    const projectiles = sprites.filter(
      (sprite) => sprite instanceof Bullet || sprite instanceof Orb
    );
    const targets = sprites.filter(
      (sprite) =>
        sprite instanceof Slime ||
        sprite instanceof Skeleton ||
        sprite instanceof Bringer ||
        sprite instanceof FinalBoss ||
        sprite instanceof Samurai
    );

    projectiles.forEach((projectile) => {
      targets.forEach((target) => {
        if (this.checkCollision(projectile, target)) {
          if (target.health <= 0) {
            target.destroyed = true;
            return;
          }
          if (projectile instanceof Orb) {
            const explosion = new Explosion(
              target.x - 70,
              target.y - 180,
              400,
              400
            );
            if (
              target.x >= explosion.x - 100 &&
              target.x <= explosion.x + 100
            ) {
              target.health -= 15;
            }
            sprites.push(explosion);
          } else if (projectile instanceof Bullet) {
            target.health--;
          }

          projectile.destroyed = true;

          if (target.health <= 0) {
            target.health = 0;
            const death = this.deathSoundEffect.cloneNode();
            death.play();
            if (target instanceof Skeleton) {
              target.frameIndex = 12;
              target.ticksPerFrame = 20;
              target.currentRow = 1;
              target.dx = 0;
              target.destroyed = true;
            }

            if (target instanceof Bringer) {
              target.frameIndex = 0;
              target.ticksPerFrame = 22;
              target.currentRow = 4;
              target.dx = 0;
              target.destroyed = true;
            }

            if (target instanceof FinalBoss) {
              target.frameIndex = 0;
              target.ticksPerFrame = 25;
              target.changeAnimation("death");
              target.dx = 0;
              target.destroyed = true;
            }
            target.destroyed = true;
            this.score = this.score + 10;
            this.scoreElement.innerHTML = `Score: ${this.score}`;
          }
        }
      });
    });
  }

  checkCollision(source, target) {
    return (
      source.x < target.x + target.width &&
      source.x + source.width > target.x &&
      source.y < target.y + target.height &&
      source.y + source.height > target.y
    );
  }

  updateAnimation() {
    const animation = this.animations[this.currentAnimation];
    this.animation.tickCount++;

    if (this.animation.tickCount > animation.ticksPerFrame) {
      this.animation.tickCount = 0;
      this.animation.frameIndex++;

      if (this.animation.frameIndex >= animation.numberOfFrames) {
        this.animation.frameIndex = 0;
      }
    }
  }

  handlePlayerDeath() {
    if (this.health <= 0) {
      this.currentAnimation = "death";
      this.animation.frameIndex = 0;
      this.animation.tickCount = 0;

      this.dx = 0;
      this.vy = 0;
      this.canShoot = false;

      if (!this.deathSoundPlayed) {
        this.deathSoundEffect.play();
        this.deathSoundPlayed = true;
      }
    }
  }

  draw(ctx) {
    const animation = this.animations[this.currentAnimation];
    const frameWidth = animation.spriteSheet.width / animation.numberOfFrames;
    const frameHeight = animation.spriteSheet.height;

    ctx.drawImage(
      animation.spriteSheet,
      this.animation.frameIndex * frameWidth,
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
    const healthBarWidth = this.width * (this.health / 200);

    ctx.fillStyle = "red";
    ctx.fillRect(this.x - 22, this.y + 10, this.width, 5);

    ctx.fillStyle = "green";
    ctx.fillRect(this.x - 22, this.y + 10, healthBarWidth, 5);
  }
}

var game = new Game();
var myHero = new Hero(100, 525, 100, 100);
var myBackground = new Background(0, 0, canvas.width, canvas.height);
var generator = new EnemyGenerator();
game.addSprite(myBackground);
game.addSprite(myHero);
game.addSprite(generator);
game.animate();
