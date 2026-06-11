class Bullet extends Sprite {
  constructor(x, y, width, height) {
    super(); // Initialize the parent Sprite class

    // Bullet position and movement
    this.x = x;
    this.y = y;
    this.dx = 15; // Speed of the bullet
    this.width = width;
    this.height = height;

    // State
    this.destroyed = false; // Tracks if the bullet has been destroyed

    // Bullet image
    this.bulletImage = new Image();
    this.bulletImage.src = "/pictureFiles/bulletImage.png"; // Path to the bullet image
  }

  // Updates the bullet's position
  update() {
    this.x += this.dx; // Move the bullet to the right

    // Mark as destroyed if it moves off-screen
    return this.destroyed || this.x > canvas.width;
  }

  // Draws the bullet on the canvas
  draw(ctx) {
    ctx.drawImage(this.bulletImage, this.x, this.y, this.width, this.height);
  }
}
