class EnemyGenerator extends Sprite {
  constructor(level) {
    super(); // Inherit from Sprite
    this.enemies = []; // List of spawned enemies
    this.finalBoss = null; // Reference to the final boss
    this.defeatedEnemies = 0; // Tracks defeated enemies
    this.maxEnemies = level === 1 ? 10 : 15; // Max enemies based on level
    this.spawnIndex = 0; // Tracks how many enemies have been spawned
    this.level = level; // Current level
    this.spawnDelayFrames = level === 1 ? 360 : 320; // Delay between enemy spawns
    this.currentFrame = 0; // Tracks game frames

    // Enemy types and their properties per level
    this.enemyData =
      level === 1
        ? [
            { type: Slime, x: canvas.width, y: 455, width: 200, height: 250 },
            {
              type: Skeleton,
              x: canvas.width,
              y: 437,
              width: 200,
              height: 250,
            },
            { type: Bringer, x: canvas.width, y: 427, width: 300, height: 200 },
          ]
        : [
            { type: Slime, x: canvas.width, y: 455, width: 200, height: 250 },
            { type: Bringer, x: canvas.width, y: 427, width: 300, height: 200 },
            {
              type: Skeleton,
              x: canvas.width,
              y: 437,
              width: 200,
              height: 250,
            },
            { type: Samurai, x: canvas.width, y: 467, width: 250, height: 250 },
          ];
  }

  update(sprites) {
    // Spawn new enemies at specified intervals
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

    // Remove defeated enemies from the active list
    this.enemies = this.enemies.filter((enemy) => !enemy.isDefeated);

    // Count how many enemies have been defeated
    this.defeatedEnemies = this.maxEnemies - this.enemies.length;

    // Spawn the final boss when all enemies are defeated
    if (this.defeatedEnemies === 0 && !this.finalBoss) {
      this.spawnFinalBoss(sprites);
    }
  }

  spawnFinalBoss(sprites) {
    // Adds the final boss to the game
    this.finalBoss = new FinalBoss(430, 200, 200);
    sprites.push(this.finalBoss);
  }

  draw(ctx) {
    // Displays the level completion screen after defeating the final boss
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
