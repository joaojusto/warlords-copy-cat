import names from "@xaroth8088/random-names/generators/towns_and_cities/fantasyTowns.mjs";

export default class Castle {
  constructor(scene, x, y, tileWidth, tileHeight) {
    this.scene = scene;

    this.name = names();

    this.positon = {
      x: x * tileWidth + tileWidth,
      y: y * tileWidth + tileHeight
    };
    this.size = {
      x: tileWidth * 2 + tileWidth / 2,
      y: tileHeight * 2 + tileHeight / 2
    };

    this.trigger = scene.add
      .zone(this.positon.x, this.positon.y)
      .setSize(this.size.x, this.size.y);

    scene.physics.world.enable(this.trigger);
    this.trigger.body.setAllowGravity(false);
    this.trigger.body.moves = false;
    this.trigger.setInteractive();

    this.trigger.on("pointerover", () => scene.setOpenCursor());
    this.trigger.on("pointerout", () => scene.setDefaultCursor());
    this.trigger.on("pointerdown", () =>
      scene.events.emit("castleclicked", this)
    );

    this.armies = {
      warrior: 2
    };
  }

  setOwner = player => {
    this.owner = player.name;
  };

  clearOwner = () => {
    this.owner = null;
  };

  addArmy = (type, amount) => {
    const previousAmount = this.armies[type] || 0;
    this.armies = {
      ...this.armies,
      [type]: previousAmount + amount
    };
  };

  removeArmy = (type, amount) => {
    if (!this.armies[type]) return;

    const previousAmount = this.armies[type];
    this.armies = {
      ...this.armies,
      [type]: previousAmount - amount
    };
  };
}
