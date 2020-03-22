import Phaser, { Game } from "phaser";

// import game from "./Game";
import UI from "./UI";
import GameScene from "./GameScene";

const physics = {
  default: "arcade",
  arcade: {
    gravity: { y: 0 }
  }
};

const config = {
  physics,
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "App",
  pixelArt: true,
  scene: [GameScene, UI]
};

new Game(config);
