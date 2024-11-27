class Background extends Sprite {
  constructor(x, y, width, height) {
    super();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.backgroundImage = new Image();
    this.backgroundImage.src = "/pictureFiles/backgroundSky.webp";
    this.backgroundSpeed = 2;
  }

  update() {
    if (this.x <= -this.width) {
      this.x = 0;
    }
  }

  draw(ctx) {
    ctx.drawImage(
      this.backgroundImage,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}
