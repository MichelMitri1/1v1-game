class Explosion extends Sprite {
  constructor(x, y, width, height) {
    super();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.frameIndex = 0;
    this.tickCount = 0;
    this.ticksPerFrame = 20;
    this.numberOfFrames = 12;
    this.explosion = new Image();
    this.explosion.src = "/animation/orb/explosion.png";
    this.orbExplosionSoundEffect = new Audio("/audioFiles/nuclearBomb.mp3");
    this.orbExplosionSoundEffect.play();
  }

  update() {
    this.tickCount++;
    if (this.tickCount > this.ticksPerFrame) {
      this.tickCount = 0;
      this.frameIndex++;
      if (this.frameIndex >= this.numberOfFrames) {
        return true;
      }
    }
    return false;
  }

  draw(ctx) {
    const frameWidth = this.explosion.width / this.numberOfFrames;
    ctx.drawImage(
      this.explosion,
      frameWidth * this.frameIndex,
      0,
      frameWidth,
      this.explosion.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  animationFinished() {
    return this.frameIndex >= this.numberOfFrames;
  }
}
