class MenuScreen extends Sprite {
  constructor() {
    super(); // Inherit from Sprite
    this.state = "main"; // Tracks current menu state ("main", "howToPlay", "selectLevel")
    this.levels = [1, 2]; // Available levels to select
    this.destroyed = false; // Tracks if the menu is destroyed
    this.howToPlayText = [
      // Instructions displayed in the "howToPlay" menu
      "Use 'W', 'A', 'D' to move.",
      "Hold 'Space' to shoot.",
      "Press 'L' to fire an Orb.",
      "Press 'P' to pause, and 'C' to continue",
      "Press 'R' to restart",
      "Avoid enemy attacks and destroy them.",
      "Kill the final boss to win!",
    ];
    this.initUi(); // Inject custom font styles for the menu
  }

  update(sprites, keys) {
    if (this.destroyed) return true; // Exit if menu is destroyed

    // Key-based navigation between states
    if (keys[" "]) {
      if (this.state === "main") this.state = "selectLevel";
    } else if (keys["1"] && this.state === "selectLevel") {
      this.startGame(1); // Start level 1
    } else if (keys["2"] && this.state === "selectLevel") {
      this.startGame(2); // Start level 2
    } else if ((keys["q"] || keys["Q"]) && this.state === "main") {
      this.state = "howToPlay"; // Show how-to-play instructions
    } else if ((keys["b"] || keys["B"]) && this.state !== "main") {
      this.state = "main"; // Return to main menu
    }
  }

  initUi() {
    // Load custom font from Google Fonts and define styles
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
    // Transition from menu to game
    const myBackground = new Background(0, 0, canvas.width, canvas.height);
    const myHero = new Hero(100, 525, 100, 100);
    myHero.level = level; // Assign selected level
    const generator = new EnemyGenerator(level);
    game.addSprite(myBackground);
    game.addSprite(myHero);
    game.addSprite(generator);
    this.destroyed = true; // Mark menu as destroyed
  }

  draw(ctx) {
    // Draw menu screen background
    ctx.fillStyle = "#add8e6";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Display title
    ctx.font = "48px Tiny5, sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#333";
    ctx.fillText("Light Horizon", canvas.width / 2, 80);

    // Render specific state content
    if (this.state === "main") {
      this.drawButtons(ctx, ["Press Space to Play", "Press Q for How to Play"]);
    } else if (this.state === "howToPlay") {
      this.drawHowToPlay(ctx); // Show instructions
    } else if (this.state === "selectLevel") {
      const levelButtons = this.levels.map(
        (level) => `Press ${level} for Level ${level}`
      );
      this.drawButtons(ctx, [...levelButtons, "Press B to Go Back"]);
    }
  }

  drawButtons(ctx, buttons) {
    // Render buttons for menu options
    ctx.font = "30px Tiny5, sans-serif";
    ctx.textAlign = "center";

    buttons.forEach((text, index) => {
      const buttonX = canvas.width / 2;
      const buttonY = 150 + index * 65;

      // Button background
      ctx.fillStyle = "#4169e1";
      ctx.fillRect(buttonX - 175, buttonY - 30, 350, 50);

      // Button border
      ctx.strokeStyle = "#1e90ff";
      ctx.lineWidth = 3;
      ctx.strokeRect(buttonX - 175, buttonY - 30, 350, 50);

      // Button text
      ctx.fillStyle = "#ffffff";
      ctx.fillText(text, buttonX, buttonY + 10);
    });
  }

  drawHowToPlay(ctx) {
    // Display how-to-play instructions
    ctx.font = "36px Tiny5, sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#333";
    ctx.fillText("How to Play", canvas.width / 2, 130);

    ctx.font = "20px Tiny5, sans-serif";
    const lineHeight = 30;
    this.howToPlayText.forEach((line, index) => {
      ctx.fillText(line, canvas.width / 2, 170 + index * lineHeight);
    });

    // Back button
    ctx.fillStyle = "#4169e1";
    ctx.fillRect(canvas.width / 2 - 100, 400, 200, 50);

    ctx.strokeStyle = "#1e90ff";
    ctx.lineWidth = 3;
    ctx.strokeRect(canvas.width / 2 - 100, 400, 200, 50);

    ctx.fillStyle = "#ffffff";
    ctx.fillText("Press B to Go Back", canvas.width / 2, 435);
  }
}
