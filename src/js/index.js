import Level1 from "../scenes/Level1.js";
import Level2 from "../scenes/Level2.js";
import Level3 from "../scenes/Level3.js";

// Create a new Phaser config object
const config = {
  type: Phaser.AUTO,
  width: 720,
  height: 720,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 800,
      height: 600,
    },
    max: {
      width: 1600,
      height: 1200,
    },
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
      debug: true,
    },
  },
  // List of scenes to load
  // Only the first scene will be shown
  // Remember to import the scene before adding it to the list
  scene: [Level1, Level2, Level3],
};

// Create a new Phaser game instance
window.game = new Phaser.Game(config);
