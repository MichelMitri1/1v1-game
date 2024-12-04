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

  update(sprites) {
    console.log(sprites);
    
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
