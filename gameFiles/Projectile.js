class Projectile extends Sprite {
  constructor(x, y, width, height, speed) {
    super();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.destroyed = false;
    this.image = new Image();
    this.image.src = "/animation/finalBoss/projectile.png";
  }

  update() {
    this.x -= this.speed;
    if (this.x + this.width < 0) {
      this.destroyed = true;
    }

    return this.destroyed;
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}
