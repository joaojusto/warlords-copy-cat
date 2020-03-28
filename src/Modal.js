import { map, isEqual, isEmpty } from "lodash";
import { Scene } from "phaser";

const style = { fill: "#000000", align: "center" };

export default class Modal extends Scene {
  constructor() {
    super({ key: "Modal", active: false });
  }

  preload() {
    this.load.setBaseURL(`${process.env.PUBLIC_URL}`);
    this.load.image("modal", "modal_bg.png");
  }

  create(data) {
    const { name } = data.castle;
    this.game = this.scene.get("GameScene");
    this.castle = data.castle;
    this.player = data.player;
    this.armies = [];
    this.newArmy = {};

    this.add.sprite(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      "modal"
    );

    this.title = this.add
      .text(
        this.cameras.main.centerX,
        100,
        name.charAt(0).toUpperCase() + name.slice(1),
        style
      )
      .setOrigin(0.5, 0.5);

    this.add.text(90, 140, "Garrison", style);

    this.add.text(630, 140, "New army", style);

    this.exit = this.add
      .text(660, 490, "Close", style)
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.stop();
        this.game.setDefaultCursor();
        if (!isEmpty(this.newArmy))
          this.player.addArmy(
            this.castle.positon.x,
            this.castle.positon.y,
            "warrior"
          );
        this.game.scene.resume();
      });
  }

  update() {
    this.drawArmyList();
    this.drawNewArmyList();
  }

  drawNewArmyList() {
    if (isEqual(this.newArmy, this.previousNewArmy)) return;
    if (this.newArmyList) this.newArmyList.forEach(item => item.destroy());
    if (this.newLabelList) this.newLabelList.forEach(item => item.destroy());

    let index = 1;
    this.newArmyList = map(this.newArmy, (amount, type) => {
      const x = 630;
      const y = 160 + index * 20;
      index++;
      return this.add.sprite(x, y, type);
    });

    index = 1;
    this.newLabelList = map(this.newArmy, amount => {
      const x = 650;
      const y = 155 + index * 20;
      index++;
      return this.add.text(x, y, `x${amount}`, style);
    });

    this.previousNewArmy = this.newArmy;
  }

  drawArmyList() {
    if (isEqual(this.armies, this.castle.armies)) return;
    if (this.armyList) this.armyList.forEach(item => item.destroy());
    if (this.labelList) this.labelList.forEach(item => item.destroy());
    if (this.buttonList) this.buttonList.forEach(item => item.destroy());

    let index = 1;
    this.armyList = map(this.castle.armies, (amount, type) => {
      const x = 100;
      const y = 160 + index * 20;
      index++;
      return this.add.sprite(x, y, type);
    });

    index = 1;
    this.labelList = map(this.castle.armies, amount => {
      const x = 120;
      const y = 155 + index * 20;
      index++;
      return this.add.text(x, y, `x${amount}`, style);
    });

    index = 1;
    this.buttonList = map(this.castle.armies, (amount, type) => {
      const x = 200;
      const y = 155 + index * 20;
      index++;
      return this.add
        .text(x, y, `---->`, style)
        .setInteractive()
        .on("pointerdown", () => {
          if (amount <= 0) return;
          this.castle.removeArmy(type, 1);
          this.newArmy = {
            ...this.newArmy,
            [type]: (this.newArmy[type] || 0) + 1
          };
        });
    });

    this.armies = this.castle.armies;
  }
}
