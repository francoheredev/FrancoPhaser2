// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class Level1 extends Phaser.Scene {
  constructor() {
    super("level1");
  }

  init() {
    this.score = 0;
  }

  preload() {
    this.load.tilemapTiledJSON(
        'map',
        'public/assets/tilemaps/level1.json'
    );

    this.load.image(
        'texture',
        'public/assets/images/texture.png'
    );

    this.load.image("star", "public/assets/images/star.png");

    this.load.spritesheet("player", "public/assets/images/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create() {

    const map = this.make.tilemap({
        key: 'map'
    });

    const tileset = map.addTilesetImage(
        'texture', // nombre EXACTO del tileset en Tiled
        'texture'
    );

    const ground = map.createLayer(
        'Ground',
        tileset
    );

    const walls = map.createLayer(
        'Walls',
        tileset
    );

    walls.setCollisionBetween(2, 2);

    this.player = this.add.rectangle(64, 300, 30, 30, 0xff0000);
    this.physics.world.enableBody(this.player);
    this.player.body.setCollideWorldBounds(true);
    this.player.body.setBounce(0.2);

    this.physics.add.collider(this.player, walls);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }

    if (this.keyR.isDown) {
      this.scene.restart();
    }
  }
}
