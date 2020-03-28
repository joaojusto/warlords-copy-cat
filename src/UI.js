import { Scene } from "phaser";

import MiniMap from "./MiniMap";

export default class UI extends Scene {
  constructor() {
    super("UIScene");
    Scene.call(this, { key: "UI", active: false });
  }

  create() {
    const game = this.scene.get("GameScene");
    MiniMap(game, game.terrainLayer.width, game.terrainLayer.height);

    const player = game.players[0];

    const title = this.add.text(
      20,
      20,
      `Current Player: ${player.name()}, turn: ${player.turn()}`,
      { fill: "#000000" }
    );

    const button = this.add
      .text(700, 560, `End Turn`, { fill: "#000000" })
      .setInteractive()
      .on("pointerdown", () => {
        game.target = null;
        game.movement.clear();
        player.endTurn();
        title.setText(
          `Current Player: ${player.name()}, turn: ${player.turn()}`
        );
      })
      .on("pointerover", () => game.setClickCursor())
      .on("pointerout", () => game.setDefaultCursor());
  }
}
