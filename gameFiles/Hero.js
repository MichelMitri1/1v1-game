class Hero extends Sprite {
  constructor(x, y, width, height) {
    super(); // Initialize the parent Sprite class

    // Position and dimensions
    this.x = x;
    this.y = y;
    this.dx = 0; // Horizontal movement speed
    this.vy = 0; // Vertical velocity (used for jumping)
    this.width = width;
    this.height = height;

    // Movement and physics
    this.isJumping = false; // Indicates if the hero is mid-jump
    this.gravity = 0.1; // Gravity applied to hero
    this.jumpStrength = -5; // Force of the jump
    this.groundY = y; // Ground position for landing

    // Health and shield
    this.health = 200; // Hero's health points
    this.shieldHealth = 60; // Shield's health points
    this.isShielded = true; // Whether the shield is active
    this.isHit = false; // Tracks if the hero has been hit

    // Shooting mechanics
    this.isShootingFaster = false; // Indicates if rapid fire is active
    this.shootCooldown = 23; // Cooldown for shooting bullets
    this.orbCooldown = 1600; // Cooldown for shooting orbs
    this.originalOrbCooldown = this.orbCooldown; // Store the original cooldown
    this.rapidFireCooldown = 0; // Duration of rapid fire power-up

    // Game state and scoring
    this.score = 0; // Tracks the player's score
    this.level = 1; // Current game level
    this.isTakingDamage = false; // Prevents multiple hits from the same attack

    // Sounds
    this.shootSoundEffect = new Audio("/audioFiles/shooting.wav");
    this.orbSoundEffect = new Audio("/audioFiles/shootingOrb.mp3");
    this.deathSoundEffect = new Audio("/audioFiles/deathSound.mp3");

    // Animation setup
    this.animations = {
      idle: { spriteSheet: new Image(), numberOfFrames: 4, ticksPerFrame: 45 },
      run: { spriteSheet: new Image(), numberOfFrames: 6, ticksPerFrame: 10 },
      jump: { spriteSheet: new Image(), numberOfFrames: 4, ticksPerFrame: 15 },
      attack: { spriteSheet: new Image(), numberOfFrames: 8, ticksPerFrame: 2 },
      hurt: { spriteSheet: new Image(), numberOfFrames: 4, ticksPerFrame: 15 },
      death: { spriteSheet: new Image(), numberOfFrames: 6, ticksPerFrame: 40 },
    };

    this.currentAnimation = "idle"; // Default animation state
    this.animation = { frameIndex: 0, tickCount: 0 }; // Animation tracking

    // Load sprite sheets for animations
    this.animations.idle.spriteSheet.src = "/animation/character/Punk_idle.png";
    this.animations.run.spriteSheet.src = "/animation/character/Punk_run.png";
    this.animations.jump.spriteSheet.src = "/animation/character/Punk_jump.png";
    this.animations.attack.spriteSheet.src =
      "/animation/character/Punk_attack3.png";
    this.animations.hurt.spriteSheet.src = "/animation/character/Punk_hurt.png";
    this.animations.death.spriteSheet.src =
      "/animation/character/Punk_death.png";

    this.initUI(); // Initialize the UI elements for score and cooldowns
  }

  // Initialize the user interface elements for the game
  initUI() {
    const canvas = document.getElementById("canvas"); // Get the game canvas
    canvas.style.position = "relative"; // Set the canvas position for relative positioning

    // Create a container for the UI elements
    this.container = document.createElement("div");
    this.container.className = "container";
    this.container.style.position = "absolute";
    this.container.style.top = "0px";
    this.container.style.left = "45px";
    this.container.style.color = "purple"; // Set the text color for the UI
    this.container.style.pointerEvents = "none"; // Prevent the UI from blocking interactions

    // Create the score display element
    this.scoreElement = document.createElement("h1");
    this.scoreElement.id = "score";
    this.scoreElement.innerHTML = `Score: ${this.score}`; // Display the current score
    this.scoreElement.className = "tiny5-regular";
    this.container.appendChild(this.scoreElement);

    // Create the orb cooldown display element
    this.orbReadyElement = document.createElement("h1");
    this.orbReadyElement.id = "orbCooldown";
    this.orbReadyElement.innerHTML = `Orb: Ready`; // Display the orb status
    this.orbReadyElement.className = "tiny5-regular";
    this.container.appendChild(this.orbReadyElement);

    // Add the container to the canvas's parent element
    canvas.parentElement.appendChild(this.container);
  }

  // Updates the hero's state, animations, and interactions with the game world
  update(sprites, keys) {
    if (this.health > 0) {
      // If the hero is alive
      this.handleMovement(keys); // Handle movement and jumping
      this.handleShooting(sprites, keys); // Handle shooting logic
      this.handleCheckIfEnemyCloseToPlayer(sprites); // Check for nearby enemies
      this.handleCollisions(sprites); // Handle collisions with objects
      this.updateAnimation(sprites, this.currentAnimation); // Update the current animation
      if ((keys["n"] || keys["N"]) && this.level === 1) {
        // Advance to the next level if 'N' is pressed
        this.nextLevel();
      }
    } else {
      // If the hero's health is zero or less
      this.updateAnimation(sprites, "death"); // Play the death animation
      this.handlePlayerDeath(sprites, keys); // Handle game over logic
    }
  }

  // Handles player movement and jumping based on key inputs
  handleMovement(keys) {
    // Handle horizontal movement
    if ((keys["d"] || keys["D"]) && this.x + this.width < canvas.width) {
      this.dx = 2; // Move right
    } else if ((keys["a"] || keys["A"]) && this.x > 0) {
      this.dx = -2; // Move left
    } else {
      this.dx = 0; // Stop moving
    }

    // Handle jumping
    if ((keys["w"] || keys["W"]) && !this.isJumping) {
      this.isJumping = true; // Start jumping
      this.vy = this.jumpStrength; // Apply jump strength
      this.currentAnimation = "jump"; // Change animation to jump
    }

    // Update vertical movement if jumping
    if (this.isJumping) {
      this.vy += this.gravity; // Apply gravity
      this.y += this.vy; // Update vertical position

      // Check if the hero lands on the ground
      if (this.y >= this.groundY) {
        this.y = this.groundY; // Reset vertical position to ground level
        this.isJumping = false; // Stop jumping
        this.vy = 0; // Reset vertical velocity
        this.currentAnimation = this.dx !== 0 ? "run" : "idle"; // Update animation based on movement
      }

      this.x += this.dx; // Update horizontal position
      return; // Exit early to skip ground-based logic
    }

    // Update animation based on horizontal movement
    if (this.dx !== 0) {
      this.currentAnimation = "run"; // Running animation
    } else {
      this.currentAnimation = "idle"; // Idle animation
    }

    // Restart the game if 'R' is pressed
    if (keys["r"] || keys["R"]) {
      game.paused = false; // Unpause the game
      this.restartGame(); // Restart the game
    }

    this.x += this.dx; // Update horizontal position
  }

  // Handles the logic for shooting bullets and orbs, including cooldown management
  handleShooting(sprites, keys) {
    // Update orb cooldown
    if (this.orbCooldown < this.originalOrbCooldown) {
      this.orbCooldown += 1;
      this.orbReadyElement.innerHTML = `Orb: Ready In ${Math.floor(
        (this.originalOrbCooldown - this.orbCooldown) / 160
      )}`;
    } else {
      this.orbReadyElement.innerHTML = `Orb: Ready`; // Orb is ready to use
    }

    // Manage bullet cooldown
    if (!this.shootCooldown) this.shootCooldown = 0;
    if (this.shootCooldown > 0) {
      this.shootCooldown -= 1;
    }

    // Fire a bullet if spacebar is pressed and cooldown is zero
    if (keys[" "] && this.shootCooldown === 0) {
      const bullet = new Bullet(this.x + 30, this.y + 30, 50, 50); // Create a new bullet
      const shootSoundEffectInstance = this.shootSoundEffect.cloneNode(); // Clone shoot sound effect
      shootSoundEffectInstance.play(); // Play the sound effect
      sprites.push(bullet); // Add the bullet to the game sprites

      // Adjust cooldown for rapid-fire if active
      if (this.isShootingFaster && this.rapidFireCooldown > 0) {
        this.rapidFireCooldown -= 1;
        this.shootCooldown = 10;
      } else {
        this.rapidFireCooldown = 0;
        this.isShootingFaster = false;
        this.shootCooldown = 23;
      }
    }

    // Reset bullet cooldown if spacebar is released
    if (!keys[" "]) {
      this.shootCooldown = 0;
    }

    // Fire an orb if 'L' is pressed and orb cooldown is ready
    if (
      (keys["l"] || keys["L"]) &&
      this.orbCooldown === this.originalOrbCooldown
    ) {
      this.orbSoundEffect.play(); // Play orb sound effect
      this.currentAnimation = "attack"; // Switch to attack animation
      const orb = new Orb(this.x + 30, this.y + 10, 100, 100); // Create a new orb
      sprites.push(orb); // Add the orb to the game sprites
      this.orbCooldown = 0; // Reset orb cooldown
    }
  }

  // Handles logic for detecting and interacting with nearby enemies
  handleCheckIfEnemyCloseToPlayer(sprites) {
    // Filter for enemy sprites in the game
    const targets = sprites.filter(
      (sprite) =>
        sprite instanceof Slime ||
        sprite instanceof Skeleton ||
        sprite instanceof Bringer ||
        sprite instanceof FinalBoss ||
        sprite instanceof Samurai
    );

    // Iterate over each enemy target
    targets.forEach((target) => {
      if (this.health > 0) {
        // Only interact if hero is alive
        let isClose;

        // Handle different enemy types
        switch (true) {
          // Interactions with Bringer enemy
          case target instanceof Bringer:
            isClose = target.x <= this.x + this.width - 20; // Check proximity
            if (isClose && target.health > 0) {
              if (!target.isFrozen) {
                target.frameIndex = 0; // Reset animation frame
                target.currentRow = 2; // Set attack animation row
                target.dx = 0; // Stop movement
                target.isFrozen = true; // Mark as frozen
              }
              // Apply damage if Bringer attacks
              if (
                target.getCurrentFrameIndex() === target.numberOfFrames - 1 &&
                target.tickCount === 0 &&
                !this.isTakingDamage
              ) {
                if (this.shieldHealth > 0) {
                  this.isShielded = true;
                  this.shieldHealth -= 5;
                } else {
                  this.isShielded = false;
                  this.health -= 5;
                }
                this.isTakingDamage = true;
              }
              if (target.getCurrentFrameIndex() === 0) {
                this.isTakingDamage = false;
              }
            }
            if (!isClose && target.isFrozen && target.health > 0) {
              target.dx = 1; // Resume movement
              target.currentRow = 1; // Reset animation row
              target.isFrozen = false;
            }
            break;

          // Interactions with Skeleton enemy
          case target instanceof Skeleton:
            isClose = target.x <= this.x + this.width - 70; // Check proximity
            if (isClose && target.health > 0) {
              if (!target.isFrozen) {
                target.frameIndex = 0; // Reset animation frame
                target.currentRow = 0; // Set attack animation row
                target.dx = 0; // Stop movement
                target.isFrozen = true; // Mark as frozen
              }
              // Apply damage if Skeleton attacks
              if (
                target.getCurrentFrameIndex() === 4 &&
                target.tickCount === 0 &&
                !this.isTakingDamage
              ) {
                if (this.shieldHealth > 0) {
                  this.isShielded = true;
                  this.shieldHealth -= 3;
                } else {
                  this.isShielded = false;
                  this.health -= 3;
                }
                this.isTakingDamage = true;
              }
              if (target.getCurrentFrameIndex() !== 4) {
                this.isTakingDamage = false;
              }
            }
            if (!isClose && target.isFrozen && target.health > 0) {
              target.dx = 1; // Resume movement
              target.currentRow = 2; // Reset animation row
              target.isFrozen = false;
            }
            break;

          // Interactions with Samurai enemy
          case target instanceof Samurai:
            isClose = target.x <= this.x + this.width - 100; // Check proximity
            if (isClose && target.health > 0) {
              if (!target.isFrozen) {
                target.frameIndex = 0; // Reset animation frame
                target.dx = 0; // Stop movement
                target.isFrozen = true; // Mark as frozen
                target.ticksPerFrame = 8; // Adjust animation speed
                target.changeAnimation("attack"); // Switch to attack animation
              }
              // Apply damage if Samurai attacks
              if (
                target.getCurrentFrameIndex() === 5 &&
                target.tickCount === 0 &&
                !this.isTakingDamage
              ) {
                if (this.shieldHealth > 0) {
                  this.isShielded = true;
                  this.shieldHealth -= 5;
                } else {
                  this.isShielded = false;
                  this.health -= 5;
                }
                this.isTakingDamage = true;
              }
              if (target.getCurrentFrameIndex() !== 5) {
                this.isTakingDamage = false;
              }
            }
            if (!isClose && target.isFrozen && target.health > 0) {
              target.dx = 1; // Resume movement
              target.changeAnimation("run"); // Switch to run animation
              target.ticksPerFrame = 7; // Reset animation speed
              target.isFrozen = false;
            }
            break;

          // Interactions with Slime enemy
          case target instanceof Slime:
            isClose = target.x <= this.x + this.width - 100; // Check proximity
            if (isClose && target.health > 0) {
              target.dx = 0; // Stop movement
              target.isFrozen = true; // Mark as frozen
            }
            if (!isClose && target.isFrozen && target.health > 0) {
              target.dx = 1; // Resume movement
              target.isFrozen = false;
            }
            // Apply damage if Slime attacks
            if (
              isClose &&
              target.getCurrentFrameIndex() === 0 &&
              target.tickCount === 0 &&
              !this.isTakingDamage
            ) {
              if (this.shieldHealth > 0) {
                this.isShielded = true;
                this.shieldHealth -= 1;
              } else {
                this.isShielded = false;
                this.health -= 1;
              }
              this.isTakingDamage = true;
            }
            if (target.animationCycleComplete()) {
              this.isTakingDamage = false;
            }
            break;

          default:
            break;
        }
      }
    });
  }

  // Handles collisions between the hero and projectiles, power-ups, or enemies
  handleCollisions(sprites) {
    // Separate game objects into categories for collision handling
    const projectiles = sprites.filter(
      (sprite) =>
        sprite instanceof Bullet ||
        sprite instanceof Orb ||
        sprite instanceof Projectile
    );
    const powerUps = sprites.filter((sprite) => sprite instanceof PowerUp);
    const targets = sprites.filter(
      (sprite) =>
        sprite instanceof Slime ||
        sprite instanceof Skeleton ||
        sprite instanceof Bringer ||
        sprite instanceof FinalBoss ||
        sprite instanceof Samurai
    );

    // Handle collisions with power-ups
    powerUps.forEach((powerUp) => {
      if (this.checkCollision(this, powerUp)) {
        powerUp.applyEffect(this); // Apply the power-up effect to the hero
        powerUp.destroyed = true; // Mark the power-up for removal
      }
    });

    // Handle collisions with projectiles
    projectiles.forEach((projectile) => {
      if (projectile instanceof Projectile) {
        if (this.checkCollision(projectile, this)) {
          if (!this.isHit) {
            this.isHit = true; // Prevent multiple hits from the same projectile
            if (this.shieldHealth > 0) {
              this.shieldHealth -= 10; // Reduce shield health
              if (this.shieldHealth <= 0) {
                this.shieldHealth = 0;
              }
            } else {
              this.health -= 10; // Reduce hero's health
            }
          }
          projectile.destroyed = true; // Mark the projectile for removal
        } else {
          this.isHit = false; // Reset hit state if no collision
        }
        return; // Exit to avoid checking against targets
      }

      // Handle projectiles hitting targets (enemies)
      targets.forEach((target) => {
        if (this.checkCollision(projectile, target)) {
          if (target.health <= 0) {
            target.destroyed = true; // Mark the target for removal
            return;
          }

          // Handle orb projectile interactions
          if (projectile instanceof Orb) {
            const explosion = new Explosion(
              target.x - 70,
              target.y - 180,
              400,
              400
            );
            if (
              target.x >= explosion.x - 100 &&
              target.x <= explosion.x + 100
            ) {
              target.health -= 30; // Damage all targets within explosion range
            }
            sprites.push(explosion); // Add explosion effect to game sprites
          } else if (projectile instanceof Bullet) {
            target.health--; // Reduce target's health
          }
          projectile.destroyed = true; // Mark the projectile for removal

          // Handle target death
          if (target.health <= 0) {
            target.health = 0;
            const death = this.deathSoundEffect.cloneNode();
            death.play(); // Play death sound effect

            // Adjust death animations based on target type
            if (target instanceof Skeleton) {
              target.frameIndex = 12;
              target.ticksPerFrame = 20;
              target.currentRow = 1;
              target.dx = 0;
              target.destroyed = true;
            }
            if (target instanceof Bringer) {
              target.frameIndex = 0;
              target.ticksPerFrame = 22;
              target.currentRow = 4;
              target.dx = 0;
              target.destroyed = true;
            }
            if (target instanceof FinalBoss) {
              target.frameIndex = 0;
              target.ticksPerFrame = 25;
              target.changeAnimation("death"); // Trigger death animation
              target.dx = 0;
              target.destroyed = true;
            }

            this.score += 10; // Increase player score
            this.scoreElement.innerHTML = `Score: ${this.score}`; // Update score UI
          }
        }
      });
    });

    // Handle shield breaking
    if (this.shieldHealth <= 0) {
      this.shieldHealth = 0; // Reset shield health to zero
      this.isShielded = false; // Disable shield
    }
  }

  // Checks for a collision between two rectangular objects
  checkCollision(source, target) {
    return (
      source.x < target.x + target.width && // Source is to the left of target's right edge
      source.x + source.width > target.x && // Source is to the right of target's left edge
      source.y < target.y + target.height && // Source is above target's bottom edge
      source.y + source.height > target.y // Source is below target's top edge
    );
  }

  // Updates the animation frame based on the current animation state
  updateAnimation(sprites, currentAnimation) {
    const animation = this.animations[currentAnimation]; // Get the current animation details
    this.animation.tickCount++; // Increment the tick count

    // If enough ticks have passed, update the frame
    if (this.animation.tickCount > animation.ticksPerFrame) {
      this.animation.tickCount = 0; // Reset the tick count

      if (this.currentAnimation === "death") {
        // Special logic for death animation
        if (this.animation.frameIndex < animation.numberOfFrames - 1) {
          this.animation.frameIndex++; // Advance the frame
        } else {
          // Remove all enemy sprites after death animation finishes
          sprites.forEach((sprite) => {
            if (
              sprite instanceof Slime ||
              sprite instanceof Samurai ||
              sprite instanceof FinalBoss ||
              sprite instanceof Bringer ||
              sprite instanceof Skeleton
            ) {
              sprites.pop(sprite); // Remove enemy from sprites array
            }
          });
        }
      } else {
        this.animation.frameIndex++; // Advance the frame for other animations
        if (this.animation.frameIndex >= animation.numberOfFrames) {
          this.animation.frameIndex = 0; // Loop back to the first frame
        }
      }
    }
  }

  // Handles logic when the player dies
  handlePlayerDeath(sprites, keys) {
    if (this.health <= 0) {
      // If the hero has no health left
      this.currentAnimation = "death"; // Switch to death animation
      this.updateAnimation(sprites, this.currentAnimation); // Update the animation

      if (!this.deathSoundPlayed) {
        // Play death sound if not already played
        this.deathSoundEffect.play();
        this.deathSoundPlayed = true;
      }
    }

    if (keys["a"] || keys["R"]) {
      // Restart the game if 'A' or 'R' is pressed
      this.restartGame();
    }
  }

  // Resets the game state and restarts the current level
  restartGame() {
    game.paused = false; // Unpause the game
    game.sprites = []; // Clear all sprites
    this.health = 200; // Reset health
    this.shieldHealth = 60; // Reset shield health
    this.orbCooldown = 1600; // Reset orb cooldown
    this.score = 0; // Reset score
    this.x = 100; // Reset position
    const menuScreen = new MenuScreen(); // Create a new menu screen
    menuScreen.startGame(this.level); // Start the game at the current level
    game.addSprite(menuScreen); // Add the menu screen to the game
  }

  // Advances the player to the next level
  nextLevel() {
    game.paused = false; // Unpause the game
    game.sprites = []; // Clear all sprites
    this.health = 200; // Reset health
    this.shieldHealth = 60; // Reset shield health
    this.orbCooldown = 1600; // Reset orb cooldown
    this.score = 0; // Reset score
    this.x = 100; // Reset position
    const menuScreen = new MenuScreen(); // Create a new menu screen
    menuScreen.startGame(this.level + 1); // Start the game at the next level
    game.addSprite(menuScreen); // Add the menu screen to the game
  }

  // Draws the current animation and other UI elements to the canvas
  draw(ctx) {
    const animation = this.animations[this.currentAnimation]; // Get the current animation
    const frameWidth = animation.spriteSheet.width / animation.numberOfFrames; // Calculate frame width
    const frameHeight = animation.spriteSheet.height; // Frame height is the sprite sheet height

    // Draw the current frame of the animation
    ctx.drawImage(
      animation.spriteSheet,
      this.animation.frameIndex * frameWidth,
      0,
      frameWidth,
      frameHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );

    this.drawHealthBar(ctx); // Draw the health bar
    this.drawShield(ctx); // Draw the shield bar

    if (game.paused) {
      // If the game is paused, draw the pause menu
      this.drawPauseMenu(ctx);
    }

    if (this.health <= 0) {
      // If the hero's health is zero or less, show "Game Over"
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "white";
      ctx.font = "48px Tiny5, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);

      ctx.font = "24px Tiny5, sans-serif";
      ctx.fillText(
        "Press R to Restart",
        canvas.width / 2,
        canvas.height / 2 + 50
      );
    }
  }

  // Draws the health bar above the hero
  drawHealthBar(ctx) {
    const healthBarWidth = this.width * (this.health / 200); // Calculate the health bar width

    ctx.fillStyle = "red"; // Background for the health bar
    ctx.fillRect(this.x - 22, this.y + 10, this.width, 5);

    ctx.fillStyle = "green"; // Foreground for the health bar (current health)
    ctx.fillRect(this.x - 22, this.y + 10, healthBarWidth, 5);
  }

  // Draws the shield bar above the hero
  drawShield(ctx) {
    const shieldWidth = this.width * (this.shieldHealth / 60); // Calculate the shield bar width
    ctx.fillStyle = "lightblue"; // Color for the shield bar
    ctx.fillRect(this.x - 22, this.y + 5, shieldWidth, 5);
  }

  // Draws the pause menu on the screen
  drawPauseMenu(ctx) {
    ctx.fillStyle = "black"; // Background for the pause menu
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white"; // Text color
    ctx.font = "48px Tiny5, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Game Paused", canvas.width / 2, canvas.height / 2);

    ctx.font = "24px Tiny5, sans-serif";
    ctx.fillText(
      "Press C to Continue",
      canvas.width / 2,
      canvas.height / 2 + 50
    );
  }
}

var game = new Game();
var menuScreen = new MenuScreen();
game.addSprite(menuScreen);
game.animate();
