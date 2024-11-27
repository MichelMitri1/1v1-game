class Bullet extends Sprite {
  constructor(x, y, width, height) {
    super();
    this.x = x;
    this.y = y;
    this.dx = 15;
    this.width = width;
    this.height = height;
    this.destroyed = false;
    this.bulletImage = new Image();
    this.bulletImage.src = "/pictureFiles/bulletImage.png";
  }

  update() {
    this.x += this.dx;

    return this.destroyed || this.x > canvas.width;
  }

  draw(ctx) {
    ctx.drawImage(this.bulletImage, this.x, this.y, this.width, this.height);
  }
}
