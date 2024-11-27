class Nuclear extends Sprite {
  constructor(x, y, width, height) {
    super();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.frameIndex = 0;
    this.tickCount = 0;
    this.ticksPerFrame = 22;
    this.numberOfFrames = 8;
    this.framesPerRow = 4;
    this.nuclearExplosion = new Image();
    this.nuclearExplosion.src = "/animation/nuclear/nuclear.png";
    this.nuclearExplosionSoundEffect = new Audio(
      "/audioFiles/explosionOrb.mp3"
    );
    this.nuclearExplosionSoundEffect.play();
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
    const frameWidth = this.nuclearExplosion.width / this.framesPerRow;
    const frameHeight = this.nuclearExplosion.height / 2;
    const currentRow = Math.floor(this.frameIndex / this.framesPerRow);
    const currentColumn = this.frameIndex % this.framesPerRow;

    ctx.drawImage(
      this.nuclearExplosion,
      currentColumn * frameWidth,
      currentRow * frameHeight,
      frameWidth,
      frameHeight,
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
