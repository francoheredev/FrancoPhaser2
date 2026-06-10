export default class Level3 extends Phaser.Scene {
  constructor() {
    super("level3");
  }

  init(data) {
    this.score = data.score || 0;
  }

  preload() {
    this.load.tilemapTiledJSON(
      "map3",
      "public/assets/tilemaps/Nivel3.json"
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
    const map = this.make.tilemap({ key: "map3" });

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

    this.player = this.physics.add.sprite(
      32,
      32,
      "dude"
    );

    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    // ===== CÁMARA =====
    const mapWidth = map.widthInPixels;
    const mapHeight = map.heightInPixels;

    this.physics.world.setBounds(
      0,
      0,
      mapWidth,
      mapHeight
    );

    this.cameras.main.setBounds(
      0,
      0,
      mapWidth,
      mapHeight
    );

    this.cameras.main.startFollow(
      this.player,
      true,
      0.1,
      0.1
    );

    this.cameras.main.setZoom(1.5);

    // ===== ANIMACIONES =====
    if (!this.anims.exists("left")) {
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
    }

    // ===== CONTROLES =====
    this.cursors =
      this.input.keyboard.createCursorKeys();

    this.keyR =
      this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.R
      );

    // ===== COLISIONES =====
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

    // ===== SCORE (flotante) =====
    this.scoreText = this.add.text(
      this.player.x,
      this.player.y - 40,
      `${this.score}`,
      {
        fontSize: "24px",
        color: "#ffffff",
      }
    );

    this.scoreText.setDepth(1000);
  }

  update() {
    this.player.setVelocity(0);

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play("right", true);
    } else {
      this.player.anims.play("turn", true);
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-160);
    }

    if (this.cursors.down.isDown) {
      this.player.setVelocityY(160);
    }

    // 👇 SCORE SIGUE AL PLAYER
    this.scoreText.setPosition(
      this.player.x,
      this.player.y - 40
    );

    if (
      Phaser.Input.Keyboard.JustDown(
        this.keyR
      )
    ) {
      this.scene.restart({
        score: this.score,
      });
    }
  }

  collectStar(player, star) {
    star.destroy();

    this.score += 1;

    this.scoreText.setText(`${this.score}`);
  }

  reachGoal() {
    if (this.stars.countActive(true) === 0) {
      this.physics.pause();

      this.add
        .text(
          this.cameras.main.width / 2,
          this.cameras.main.height / 2,
          "¡JUEGO COMPLETADO!",
          {
            fontSize: "48px",
            color: "#00ff00",
          }
        )
        .setOrigin(0.5)
        .setScrollFactor(0);
    }
  }
}