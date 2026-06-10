export default class Level1 extends Phaser.Scene {
  constructor() {
    super("level1");
  }

  init(data) {
    this.score = data.score || 0;
  }

  preload() {
    this.load.tilemapTiledJSON(
      "map",
      "public/assets/tilemaps/Nivel1.json"
    );

    this.load.image(
      "sprite-sheet-32x32",
      "public/assets/images/sprite-sheet-32x32.png"
    );

    this.load.image(
      "star",
      "public/assets/images/star.png"
    );

    this.load.spritesheet(
      "dude",
      "public/assets/images/dude.png",
      {
        frameWidth: 32,
        frameHeight: 48,
      }
    );
  }

  create() {
    const map = this.make.tilemap({ key: "map" });

    const tileset = map.addTilesetImage(
      "sprite-sheet-32x32",
      "sprite-sheet-32x32"
    );

    map.createLayer("Ground", tileset, 0, 0);
    const wallsLayer = map.createLayer(
      "Walls",
      tileset,
      0,
      0
    );

    // Jugador
    this.player = this.physics.add.sprite(
      32,
      32,
      "dude"
    );

    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    // Animaciones
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers(
        "dude",
        { start: 0, end: 3 }
      ),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers(
        "dude",
        { start: 5, end: 8 }
      ),
      frameRate: 10,
      repeat: -1,
    });

    // Controles
    this.cursors =
      this.input.keyboard.createCursorKeys();

    this.keyR =
      this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.R
      );

    // Colisiones
    wallsLayer.setCollisionByProperty({
      collides: true,
    });

    this.physics.add.collider(
      this.player,
      wallsLayer
    );

    // ===== ESTRELLAS =====
    this.stars = this.physics.add.staticGroup();

    const starsLayer =
      map.getObjectLayer("Stars");

    if (starsLayer) {
      starsLayer.objects.forEach((obj) => {
        this.stars.create(
          obj.x,
          obj.y,
          "star"
        );
      });
    }

    this.physics.add.overlap(
      this.player,
      this.stars,
      this.collectStar,
      null,
      this
    );

    // ===== GOAL =====
    const goalLayer =
      map.getObjectLayer("Goal");

    if (
      goalLayer &&
      goalLayer.objects.length > 0
    ) {
      const goalObject =
        goalLayer.objects[0];

      this.goal =
        this.physics.add.staticSprite(
          goalObject.x,
          goalObject.y,
          "star"
        );

      this.goal.setTint(0x00ffff);
      this.goal.setScale(1.5);
      this.goal.setVisible(false);

      this.physics.add.overlap(
        this.player,
        this.goal,
        this.reachGoal,
        null,
        this
      );
    }

    // Score
    this.scoreText = this.add.text(
      16,
      16,
      `Score: ${this.score}`,
      {
        fontSize: "32px",
        color: "#ffffff",
      }
    );
  }

  update() {
    this.player.setVelocity(0);

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play(
        "left",
        true
      );
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play(
        "right",
        true
      );
    } else {
      this.player.anims.play(
        "turn",
        true
      );
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-160);
    }

    if (this.cursors.down.isDown) {
      this.player.setVelocityY(160);
    }

    if (
      Phaser.Input.Keyboard.JustDown(
        this.keyR
      )
    ) {
      this.scene.restart({
        score: 0,
      });
    }
  }

  collectStar(player, star) {
    star.destroy();

    this.score += 1;

    this.scoreText.setText(
      `Score: ${this.score}`
    );

    if (
      this.stars.countActive(true) === 0 &&
      this.goal
    ) {
      this.goal.setVisible(true);
    }
  }

  reachGoal() {
    if (this.stars.countActive(true) === 0) {
      this.scene.start("level2", {
        score: this.score,
      });
    }
  }
}