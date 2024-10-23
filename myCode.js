const bulletCount = document.getElementById("bulletCount");
const bulletCount2 = document.getElementById("bulletCount2");
const score = document.getElementById("score");

let player1Score = 0;
let player2Score = 0;

score.innerHTML = `Score: ${player1Score} | ${player2Score}`;

function checkCollision(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

function resetGame(sprites, player1, player2) {
  for (let i = sprites.length - 1; i >= 0; i--) {
    if (sprites[i] instanceof Bullet || sprites[i] instanceof Bullet2) {
      sprites.splice(i, 1);
    }
  }

  player1.bulletsInRound = 10;
  player2.bulletsInRound = 10;
  player1.health = 5;
  player2.health = 5;

  bulletCount.innerHTML = `Player 1 Bullets: ${player1.bulletsInRound}`;
  bulletCount2.innerHTML = `Player 2 Bullets: ${player2.bulletsInRound}`;

  player1.x = 100;
  player1.y = 400;
  player2.x = canvas.width - 150;
  player2.y = 400;
}

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
    this.jumpStrength = -7;
    this.groundY = y;
    this.canShoot = true;
    this.bulletsInRound = 10;
    this.reloading = false;
    this.health = 5;
  }

  update(sprites, keys) {
    if (this.bulletsInRound > 0) {
      bulletCount.innerHTML = `Player 1 Bullets: ${this.bulletsInRound}`;
    }
    this.dx = 0;

    if (keys["d"] && this.x + this.width < canvas.width) {
      this.dx = 2;
    }
    if (keys["a"] && this.x > 0) {
      this.dx = -2;
    }

    if (keys["w"] && !this.isJumping) {
      this.isJumping = true;
      this.vy = this.jumpStrength;
    }

    if (this.isJumping) {
      this.vy += this.gravity;
      this.y += this.vy;

      if (this.y >= this.groundY) {
        this.y = this.groundY;
        this.isJumping = false;
        this.vy = 0;
      }
    }

    this.x += this.dx;

    if (this.bulletsInRound > 0 && !this.reloading) {
      if (keys["f"] && this.canShoot) {
        var bullet = new Bullet(this.x + 20, this.y + 20, 50, 5);
        sprites.push(bullet);
        this.bulletsInRound -= 1;
        this.canShoot = false;
      }
    } else if (this.bulletsInRound === 0 && !this.reloading) {
      this.reloading = true;
      bulletCount.innerHTML = `Reloading...`;
      this.canShoot = false;
      setTimeout(() => {
        this.bulletsInRound = 10;
        bulletCount.innerHTML = `Player 1 Bullets: ${this.bulletsInRound}`;
        this.reloading = false;
        this.canShoot = true;
      }, 3000);
    }

    if (!keys["f"]) {
      this.canShoot = true;
    }

    for (let i = 0; i < sprites.length; i++) {
      if (sprites[i] instanceof Bullet2) {
        if (checkCollision(this, sprites[i])) {
          this.health -= 1;
          sprites.splice(i, 1);
          i--;
        }
      }
    }

    if (this.health === 0) {
      player2Score += 1;
      score.innerHTML = `Score: ${player1Score} | ${player2Score}`;
      resetGame(
        sprites,
        this,
        sprites.find((s) => s instanceof Hero2)
      );
    }
  }

  draw(ctx) {
    ctx.fillStyle = "purple";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    this.drawHealthBar(ctx);
  }

  drawHealthBar(ctx) {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y - 10, this.width, 5);
    ctx.fillStyle = "green";
    ctx.fillRect(this.x, this.y - 10, this.width * (this.health / 5), 5);
  }
}

class Hero2 extends Sprite {
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
    this.jumpStrength = -7;
    this.groundY = y;
    this.canShoot = true;
    this.bulletsInRound = 10;
    this.reloading = false;
    this.health = 5;
  }

  update(sprites, keys) {
    if (this.bulletsInRound > 0) {
      bulletCount2.innerHTML = `Player 2 Bullets: ${this.bulletsInRound}`;
    }
    this.dx = 0;

    if (keys["ArrowRight"] && this.x + this.width < canvas.width) {
      this.dx = 2;
    }
    if (keys["ArrowLeft"] && this.x > 0) {
      this.dx = -2;
    }

    if (keys["ArrowUp"] && !this.isJumping) {
      this.isJumping = true;
      this.vy = this.jumpStrength;
    }

    if (this.isJumping) {
      this.vy += this.gravity;
      this.y += this.vy;

      if (this.y >= this.groundY) {
        this.y = this.groundY;
        this.isJumping = false;
        this.vy = 0;
      }
    }

    this.x += this.dx;

    if (this.bulletsInRound > 0 && !this.reloading) {
      if (keys["0"] && this.canShoot) {
        var bullet = new Bullet2(this.x - 20, this.y + 20, 50, 5);
        sprites.push(bullet);
        this.bulletsInRound -= 1;
        this.canShoot = false;
      }
    } else if (this.bulletsInRound === 0 && !this.reloading) {
      this.reloading = true;
      bulletCount2.innerHTML = `Reloading...`;
      this.canShoot = false;
      setTimeout(() => {
        this.bulletsInRound = 10;
        bulletCount2.innerHTML = `Player 2 Bullets: ${this.bulletsInRound}`;
        this.reloading = false;
        this.canShoot = true;
      }, 3000);
    }

    if (!keys["0"]) {
      this.canShoot = true;
    }

    for (let i = 0; i < sprites.length; i++) {
      if (sprites[i] instanceof Bullet) {
        if (checkCollision(this, sprites[i])) {
          this.health -= 1;
          sprites.splice(i, 1);
          i--;
        }
      }
    }

    if (this.health === 0) {
      player1Score += 1;
      score.innerHTML = `Score: ${player1Score} | ${player2Score}`;
      resetGame(
        sprites,
        sprites.find((s) => s instanceof Hero),
        this
      );
    }
  }

  draw(ctx) {
    ctx.fillStyle = "black";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    this.drawHealthBar(ctx);
  }

  drawHealthBar(ctx) {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y - 10, this.width, 5);
    ctx.fillStyle = "green";
    ctx.fillRect(this.x, this.y - 10, this.width * (this.health / 5), 5);
  }
}
class Bullet extends Sprite {
  constructor(x, y, width, height) {
    super();
    this.x = x;
    this.dx = 15;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  update() {
    this.x += this.dx;
  }

  draw(ctx) {
    ctx.fillStyle = "purple";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Bullet2 extends Sprite {
  constructor(x, y, width, height) {
    super();
    this.x = x;
    this.dx = 15;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  update() {
    this.x -= this.dx;
  }

  draw(ctx) {
    ctx.fillStyle = "black";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Ground extends Sprite {
  constructor(y, width, height) {
    super();
    this.y = y;
    this.width = width;
    this.height = height;
  }

  update() {}

  draw(ctx) {
    ctx.fillStyle = "green";
    ctx.fillRect(0, this.y, this.width, this.height);
  }
}

var game = new Game();
var myHero = new Hero(100, 400, 50, 50);
var myHero2 = new Hero2(canvas.width - 150, 400, 50, 50);
var myGround = new Ground(451, canvas.width, 200);

game.addSprite(myHero);
game.addSprite(myGround);
game.addSprite(myHero2);

game.animate();
