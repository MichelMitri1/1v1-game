class Background extends Sprite {
  constructor(x, y, width, height) {
    super(); // Inherit from Sprite
    this.x = x;
    this.y = y; // Position
    this.width = width;
    this.height = height; // Size
    this.backgroundImage = new Image(); // Load background image
    this.backgroundImage.src = "/pictureFiles/backgroundSky.webp"; // Image file path
    this.backgroundSpeed = 2; // Speed for background scrolling (if implemented)
  }

  update(sprites) {
    // Empty for now but can be used for scrolling or dynamic changes
  }

  draw(ctx) {
    // Draw the background image on the canvas
    ctx.drawImage(
      this.backgroundImage,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}
