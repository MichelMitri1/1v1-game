class MenuScreen extends Sprite {
  constructor() {
    super();
    this.state = "main";
    this.levels = [1, 2];
    this.destroyed = false;
    this.howToPlayText = [
      "Use 'W', 'A', 'D' to move.",
      "Press 'Space' to shoot.",
      "Press 'L' to fire an Orb.",
      "Avoid enemy attacks and destroy them.",
      "Survive as long as possible!",
    ];
  }

  update(sprites, keys) {
    if (this.destroyed) {
      return true;
    }

    if (keys[" "]) {
      if (this.state === "main") {
        this.state = "selectLevel";
      }
    } else if (keys["1"]) {
      if (this.state === "selectLevel") {
        this.startGame(1);
      }
    } else if (keys["2"]) {
      if (this.state === "selectLevel") {
        this.startGame(2);
      }
    } else if (keys["q"]) {
      if (this.state === "main") {
        this.state = "howToPlay";
      }
    } else if (keys["b"]) {
      if (this.state !== "main") {
        this.state = "main";
      }
    }
  }

  startGame(level) {
    const myBackground = new Background(0, 0, canvas.width, canvas.height);
    const myHero = new Hero(100, 525, 100, 100);
    const generator = new EnemyGenerator(level);
    game.addSprite(myBackground);
    game.addSprite(myHero);
    game.addSprite(generator);
    // game.animate();
    this.destroyed = true;
  }

  draw(ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (this.state === "main") {
      this.drawButtons(ctx, ["Press Space to Play", "Press Q for How to Play"]);
    } else if (this.state === "howToPlay") {
      this.drawHowToPlay(ctx);
    } else if (this.state === "selectLevel") {
      const levelButtons = this.levels.map(
        (level) => `Press ${level} for Level ${level}`
      );
      this.drawButtons(ctx, [...levelButtons, "Press B to Go Back"]);
    }
  }

  drawButtons(ctx, buttons) {
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "black";

    buttons.forEach((text, index) => {
      const buttonX = canvas.width / 2;
      const buttonY = 200 + index * 65;
      ctx.fillText(text, buttonX, buttonY);
      ctx.strokeStyle = "black";
      ctx.strokeRect(buttonX - 175, buttonY - 30, 350, 50);
    });
  }

  drawHowToPlay(ctx) {
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "black";

    ctx.fillText("How to Play", canvas.width / 2, 100);

    const lineHeight = 30;
    this.howToPlayText.forEach((line, index) => {
      ctx.fillText(line, canvas.width / 2, 150 + index * lineHeight);
    });

    ctx.strokeStyle = "black";
    ctx.strokeRect(canvas.width / 2 - 100, 400, 200, 50);
    ctx.fillText("Press B to Go Back", canvas.width / 2, 435);
  }
}
