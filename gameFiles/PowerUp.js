class PowerUp {
  constructor(x, y, type) {
    // Position and type of the power-up
    this.x = x;
    this.y = y;
    this.type = type; // Type determines the effect: "health", "shield", etc.

    // Dimensions and movement
    this.width = 30;
    this.height = 30;
    this.dx = 1; // Speed at which the power-up moves left

    // State
    this.destroyed = false; // Tracks if the power-up should be removed
    this.active = false; // Tracks if the power-up effect is active
    this.effectDuration = 500; // Duration of the effect (if applicable)

    // Power-up image
    this.img = new Image();
  }

  // Applies the power-up effect to the player
  applyEffect(player) {
    switch (this.type) {
      case "health": // Increase player health
        if (player.health + 50 >= 200) {
          player.health = 200; // Cap health at 200
        } else {
          player.health += 50;
        }
        break;

      case "shield": // Fully restore the player's shield
        player.isShielded = true;
        player.shieldHealth = 60;
        break;

      case "shootCooldown": // Enable rapid fire
        player.shootCooldown = 10; // Reduced cooldown for shooting
        player.isShootingFaster = true;
        player.rapidFireCooldown = 70; // Duration for rapid fire
        break;

      case "orbReady": // Instantly ready the orb for use
        player.orbCooldown = 1600;
        break;
    }
  }

  // Updates the power-up's position and state
  update() {
    if (this.x < 0) {
      // If the power-up moves off-screen
      this.destroyed = true; // Mark it for removal
    }
    this.x -= this.dx; // Move the power-up to the left

    return this.destroyed; // Return whether it's destroyed
  }

  // Draws the power-up on the canvas
  draw(ctx) {
    // Set the image source based on the type
    switch (this.type) {
      case "health":
        this.img.src = "/pictureFiles/health.png";
        break;
      case "shield":
        this.img.src = "/pictureFiles/shield.webp";
        break;
      case "shootCooldown":
        this.img.src = "/pictureFiles/rapidFire.webp";
        break;
      case "orbReady":
        this.img.src = "/pictureFiles/orbReady.webp";
        break;
    }

    // Render the power-up image
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
}
