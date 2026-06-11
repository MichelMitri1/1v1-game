class Projectile extends Sprite {
  constructor(x, y, width, height, speed) {
    super(); // Inherit from Sprite
    this.x = x;
    this.y = y; // Position
    this.width = width;
    this.height = height; // Size
    this.speed = speed; // Movement speed
    this.destroyed = false; // Tracks if the projectile is out of bounds
    this.image = new Image(); // Load projectile image
    this.image.src = "/animation/finalBoss/projectile.png"; // Path to projectile sprite
  }

  update() {
    this.x -= this.speed; // Move projectile to the left
    if (this.x + this.width < 0) {
      this.destroyed = true; // Mark as destroyed when out of bounds
    }
    return this.destroyed; // Return destruction status
  }

  draw(ctx) {
    // Draw the projectile on the canvas
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}
