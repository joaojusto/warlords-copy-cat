import Phaser, { Game } from "phaser";

// import game from "./Game";
import UI from "./UI";
import Modal from "./Modal";
import GameScene from "./GameScene";

const physics = {
  default: "arcade",
  arcade: {
    debug: true,
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
  scene: [GameScene, UI, Modal]
};

new Game(config);
