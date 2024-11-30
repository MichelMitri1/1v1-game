class EnemyGenerator {
  constructor() {
    this.enemies = [];
    this.finalBoss = null;
    this.defeatedEnemies = 0;
    this.maxEnemies = 20;
    this.spawnIndex = 0;
    this.spawnDelayFrames = 420;
    this.currentFrame = 0;
    this.enemyData = [
      { type: Slime, x: canvas.width, y: 455, width: 200, height: 250 },
      { type: Bringer, x: canvas.width, y: 427, width: 300, height: 200 },
      { type: Skeleton, x: canvas.width, y: 437, width: 200, height: 250 },
      { type: Samurai, x: canvas.width, y: 467, width: 250, height: 250 },
    ];
  }

  update(sprites) {
    if (
      this.spawnIndex < this.maxEnemies &&
      this.currentFrame % this.spawnDelayFrames === 0
    ) {
      const enemyConfig =
        this.enemyData[Math.floor(Math.random() * this.enemyData.length)];
      const enemy = new enemyConfig.type(
        enemyConfig.x,
        enemyConfig.y,
        enemyConfig.width,
        enemyConfig.height
      );
      this.enemies.push(enemy);
      sprites.push(enemy);
      this.spawnIndex++;
    }
    this.currentFrame++;

    this.enemies = this.enemies.filter((enemy) => !enemy.isDefeated);

    this.defeatedEnemies = this.maxEnemies - this.enemies.length;
    if (this.defeatedEnemies === this.maxEnemies && !this.finalBoss) {
      this.spawnFinalBoss();
    }
  }

  spawnFinalBoss() {
    this.finalBoss = new FinalBoss(150, 200, 200);
  }

  draw(ctx) {}
}
