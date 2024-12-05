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
    this.initUi();
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

  initUi() {
    const preconnect1 = document.createElement("link");
    preconnect1.rel = "preconnect";
    preconnect1.href = "https://fonts.googleapis.com";
    document.head.appendChild(preconnect1);

    const preconnect2 = document.createElement("link");
    preconnect2.rel = "preconnect";
    preconnect2.href = "https://fonts.gstatic.com";
    preconnect2.crossOrigin = "anonymous";
    document.head.appendChild(preconnect2);

    const fontLink = document.createElement("link");
    fontLink.href =
      "https://fonts.googleapis.com/css2?family=Tiny5&display=swap";
    fontLink.rel = "stylesheet";
    document.head.appendChild(fontLink);

    const styleElement = document.createElement("style");
    styleElement.innerHTML = `
      .tiny5-regular {
        font-family: "Tiny5", sans-serif;
        font-weight: 400;
        font-style: normal;
      }
    `;
    document.head.appendChild(styleElement);
  }

  startGame(level) {
    const myBackground = new Background(0, 0, canvas.width, canvas.height);
    const myHero = new Hero(100, 525, 100, 100);
    myHero.level = level;
    const generator = new EnemyGenerator(level);
    game.addSprite(myBackground);
    game.addSprite(myHero);
    game.addSprite(generator);
    this.destroyed = true;
  }

  draw(ctx) {
    ctx.fillStyle = "#add8e6";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = "48px Tiny5, sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#333";
    ctx.fillText("Light Horizon", canvas.width / 2, 80);

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
    ctx.font = "30px Tiny5, sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";

    buttons.forEach((text, index) => {
      const buttonX = canvas.width / 2;
      const buttonY = 150 + index * 65;
      ctx.fillStyle = "#4169e1";
      ctx.fillRect(buttonX - 175, buttonY - 30, 350, 50);

      ctx.strokeStyle = "#1e90ff";
      ctx.lineWidth = 3;
      ctx.strokeRect(buttonX - 175, buttonY - 30, 350, 50);

      ctx.fillStyle = "#ffffff";
      ctx.fillText(text, buttonX, buttonY + 10);
    });
  }

  drawHowToPlay(ctx) {
    ctx.font = "36px Tiny5, sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#333";
    ctx.fillText("How to Play", canvas.width / 2, 130);

    ctx.font = "20px Tiny5, sans-serif";
    const lineHeight = 30;
    this.howToPlayText.forEach((line, index) => {
      ctx.fillText(line, canvas.width / 2, 170 + index * lineHeight);
    });

    ctx.fillStyle = "#4169e1";
    ctx.fillRect(canvas.width / 2 - 100, 400, 200, 50);

    ctx.strokeStyle = "#1e90ff";
    ctx.lineWidth = 3;
    ctx.strokeRect(canvas.width / 2 - 100, 400, 200, 50);

    ctx.fillStyle = "#ffffff";
    ctx.fillText("Press B to Go Back", canvas.width / 2, 435);
  }
}
