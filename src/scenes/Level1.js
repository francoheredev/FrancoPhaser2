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
        'assets/maps/level1.json'
    );

    this.load.image(
        'tiles',
        'assets/tilesets/dungeon.png'
    );

    this.load.image("star", "public/assets/images/star.png");

    this.load.spritesheet("dude", "public/assets/images/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create() {

    const map = this.make.tilemap({
        key: 'map'
    });

    const tileset = map.addTilesetImage(
        'MAPA-TP', // nombre EXACTO del tileset en Tiled
        'tiles'
    );

    const ground = map.createLayer(
        'Ground',
        tileset
    );

    const walls = map.createLayer(
        'Walls',
        tileset
    );

    walls.setCollisionByProperty({
        collides: true
    });

    this.player = this.physics.add.sprite(100, 100, 'player');

    this.physics.add.collider(this.player, walls);
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("turn");
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }

    if (this.keyR.isDown) {
      this.scene.restart();
    }
  }
}
