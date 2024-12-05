class EnemyGenerator extends Sprite {
  constructor(level) {
    super();
    this.enemies = [];
    this.finalBoss = null;
    this.defeatedEnemies = 0;
    this.maxEnemies = level === 1 ? 20 : 30;
    this.spawnIndex = 0;
    this.level = level;
    this.spawnDelayFrames = level === 1 ? 360 : 320;
    this.currentFrame = 0;
    if (level === 1) {
      this.enemyData = [
        { type: Slime, x: canvas.width, y: 455, width: 200, height: 250 },
        { type: Skeleton, x: canvas.width, y: 437, width: 200, height: 250 },
        { type: Bringer, x: canvas.width, y: 427, width: 300, height: 200 },
      ];
    } else {
      this.enemyData = [
        { type: Slime, x: canvas.width, y: 455, width: 200, height: 250 },
        { type: Bringer, x: canvas.width, y: 427, width: 300, height: 200 },
        { type: Skeleton, x: canvas.width, y: 437, width: 200, height: 250 },
        { type: Samurai, x: canvas.width, y: 467, width: 250, height: 250 },
      ];
    }
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
    if (this.defeatedEnemies === 0 && !this.finalBoss) {
      this.spawnFinalBoss(sprites);
    }
  }

  spawnFinalBoss(sprites) {
    this.finalBoss = new FinalBoss(430, 200, 200);
    sprites.push(this.finalBoss);
  }

  draw(ctx) {
    if (this.finalBoss && this.finalBoss.health <= 0) {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "white";
      ctx.font = "48px Tiny5, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(
        `Level ${this.level} Completed!`,
        canvas.width / 2,
        canvas.height / 2
      );

      ctx.font = "24px Tiny5, sans-serif";
      ctx.fillText(
        this.level === 1 ? "Press N to Continue to Level 2" : "You Won!",
        canvas.width / 2,
        canvas.height / 2 + 100
      );

      ctx.fillText(
        "Press R to Restart Level",
        canvas.width / 2,
        canvas.height / 2 + 50
      );
    }
  }
}
