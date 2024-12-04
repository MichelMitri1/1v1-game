class PowerUp {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.width = 30;
    this.height = 30;
    this.dx = 1;
    this.destroyed = false;
    this.img = new Image();
    this.active = false;
    this.effectDuration = 500;
  }

  applyEffect(player) {
    switch (this.type) {
      case "health":
        if (player.health + 50 >= 200) {
          player.health = 200;
        } else {
          player.health = player.health + 50;
        }
        break;
      case "shield":
        player.isShielded = true;
        player.shieldHealth = 60;
        break;
      case "shootCooldown":
        player.shootCooldown = 10;
        player.isShootingFaster = true;
        player.rapidFireCooldown = 70;
        break;
      case "orbReady":
        player.orbCooldown = 1600;
        break;
    }
  }

  update() {
    if (this.x < 0) {
      this.destroyed = true;
    }
    this.x -= this.dx;

    return this.destroyed;
  }

  draw(ctx) {
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
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
}
