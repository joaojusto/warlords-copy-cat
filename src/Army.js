export default class Army {
  constructor(scene, x, y, type) {
    this.scene = scene;
    this.movementPoints = 4;
    this.body = scene.physics.add
      .sprite(x, y, type)
      .setDisplaySize(64, 64)
      .setDisplayOrigin(-16, -10)
      .setInteractive()
      .on("pointerdown", () => (scene.target = this));

    this.onCastle = false;

    this.body.on("overlapstart", function() {
      this.body.debugBodyColor = 0xff3300;
      this.onCastle = true;
      alert("You're on a castle");
    });

    this.body.on("overlapend", function() {
      this.body.debugBodyColor = 0x00ff33;
      this.onCastle = false;
    });

    this.scene.castles.forEach(({ trigger }) => {
      this.scene.physics.add.overlap(this.body, trigger);
    });
  }

  spendMovement = amount => (this.movementPoints -= amount);

  resetMovement = () => (this.movementPoints = 4);

  update = () => {
    const {
      body: { body }
    } = this;

    if (body.embedded) body.touching.none = false;

    const touching = !body.touching.none;
    const wasTouching = !body.wasTouching.none;

    if (touching && !wasTouching) this.body.emit("overlapstart");
    else if (!touching && wasTouching) this.body.emit("overlapend");
  };
}
