import Phaser, { Game } from "phaser";
import EasyStar from "easystarjs";

const physics = {
  default: "arcade",
  arcade: {
    gravity: { y: 0 }
  }
};

const scene = {
  create,
  update,
  preload
};

const config = {
  scene,
  physics,
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "App",
  pixelArt: true
};

let cursors;
let player;
let finder;

function preload() {
  this.load.setBaseURL(`${process.env.PUBLIC_URL}`);
  this.load.image("tiles", `/tilesets/tuxmon-sample-32px-extruded.png`);
  this.load.tilemapTiledJSON("map", `/tilemaps/tuxemon-town.json`);
  this.load.atlas("atlas", "/atlas/atlas.png", "/atlas/atlas.json");
}

function create() {
  const move = path => {
    const tweens = path.slice(1, path.length).map(({ x, y }) => ({
      targets: player,
      x: { value: x * map.tileWidth, duration: 200 },
      y: { value: y * map.tileHeight, duration: 200 }
    }));

    this.tweens.timeline({ tweens });
  };
  const map = this.make.tilemap({ key: "map" });

  // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
  // Phaser's cache (i.e. the name you used in preload)
  const tileset = map.addTilesetImage("tuxmon-sample-32px-extruded", "tiles");

  // Parameters: layer name (or index) from Tiled, tileset, x, y
  const belowLayer = map.createStaticLayer("Below Player", tileset, 0, 0);
  const worldLayer = map.createStaticLayer("World", tileset, 0, 0);
  const aboveLayer = map.createStaticLayer("Above Player", tileset, 0, 0);

  worldLayer.setCollisionByProperty({ collides: true });

  // By default, everything gets depth sorted on the screen in the order we created things. Here, we
  // want the "Above Player" layer to sit on top of the player, so we explicitly give it a depth.
  // Higher depths will sit on top of lower depth objects.
  aboveLayer.setDepth(10);

  // Object layers in Tiled let you embed extra info into a map - like a spawn point or custom
  // collision shapes. In the tmx file, there's an object layer with a point named "Spawn Point"
  const spawnPoint = map.findObject(
    "Objects",
    obj => obj.name === "Spawn Point"
  );

  // Create a sprite with physics enabled via the physics system. The image used for the sprite has
  // a bit of whitespace, so I'm using setSize & setOffset to control the size of the player's body.
  player = this.physics.add
    .sprite(spawnPoint.x, spawnPoint.y, "atlas", "misa-front")
    .setSize(30, 40)
    .setOffset(0, 24)
    .setDepth(5);

  // Watch the player and worldLayer for collisions, for the duration of the scene:
  this.physics.add.collider(player, worldLayer);

  const findTile = (x, y, layers = [worldLayer, aboveLayer, belowLayer]) => {
    return layers
      .map(layer => layer.getTileAt(x, y))
      .filter(tile => !!tile)
      .reduce((accumulator, tile) => ({
        index: tile.properties.colides
          ? tile.index
          : accumulator.index || tile.index,
        properties: tile.properties.colides
          ? tile.properties
          : accumulator.properties || tile.properties
      }));
  };

  finder = new EasyStar.js();
  const grid = [];
  const acceptableTiles = [];
  const { width, height } = map;
  for (let y = 0; y < height; y++) {
    const col = [];
    for (let x = 0; x < width; x++) {
      // In each cell we store the ID of the tile, which corresponds
      // to its index in the tileset of the map ("ID" field in Tiled)
      let { index, properties } = findTile(x, y);
      if (!properties || !properties.collides) acceptableTiles.push(index);
      col.push(index);
    }
    grid.push(col);
  }
  finder.setGrid(grid);
  finder.setAcceptableTiles(acceptableTiles);
  finder.enableDiagonals();

  this.input.on("pointerdown", function(pointer) {
    const { worldX, worldY } = pointer;
    const { tileWidth, tileHeight } = map;
    const toX = Math.floor(worldX / tileWidth);
    const toY = Math.floor(worldY / tileHeight);
    const fromX = Math.floor(player.x / tileWidth);
    const fromY = Math.floor(player.y / tileHeight);

    finder.findPath(fromX, fromY, toX, toY, path => {
      if (path === null) {
        console.warn("Path was not found.");
      } else {
        console.log("Path was found!", path);
        move(path);
      }
    });
    finder.calculate();
  });

  // Create the player's walking animations from the texture atlas. These are stored in the global
  // animation manager so any sprite can access them.
  const anims = this.anims;
  anims.create({
    key: "misa-left-walk",
    frames: anims.generateFrameNames("atlas", {
      prefix: "misa-left-walk.",
      start: 0,
      end: 3,
      zeroPad: 3
    }),
    frameRate: 10,
    repeat: -1
  });
  anims.create({
    key: "misa-right-walk",
    frames: anims.generateFrameNames("atlas", {
      prefix: "misa-right-walk.",
      start: 0,
      end: 3,
      zeroPad: 3
    }),
    frameRate: 10,
    repeat: -1
  });
  anims.create({
    key: "misa-front-walk",
    frames: anims.generateFrameNames("atlas", {
      prefix: "misa-front-walk.",
      start: 0,
      end: 3,
      zeroPad: 3
    }),
    frameRate: 10,
    repeat: -1
  });
  anims.create({
    key: "misa-back-walk",
    frames: anims.generateFrameNames("atlas", {
      prefix: "misa-back-walk.",
      start: 0,
      end: 3,
      zeroPad: 3
    }),
    frameRate: 10,
    repeat: -1
  });

  const camera = this.cameras.main;
  camera.startFollow(player);
  camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

  cursors = this.input.keyboard.createCursorKeys();
  this.input.keyboard.once("keydown_D", event => {
    // Turn on physics debugging to show player's hitbox
    this.physics.world.createDebugGraphic();

    // Create worldLayer collision graphic above the player, but below the help text
    const graphics = this.add
      .graphics()
      .setAlpha(0.75)
      .setDepth(20);
    worldLayer.renderDebug(graphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    });
  });
}

function update(time, delta) {
  const speed = 175;
  const prevVelocity = player.body.velocity.clone();

  // Stop any previous movement from the last frame
  player.body.setVelocity(0);

  // Horizontal movement
  if (cursors.left.isDown) {
    player.body.setVelocityX(-speed);
  } else if (cursors.right.isDown) {
    player.body.setVelocityX(speed);
  }

  // Vertical movement
  if (cursors.up.isDown) {
    player.body.setVelocityY(-speed);
  } else if (cursors.down.isDown) {
    player.body.setVelocityY(speed);
  }

  // Normalize and scale the velocity so that player can't move faster along a diagonal
  player.body.velocity.normalize().scale(speed);

  // Update the animation last and give left/right animations precedence over up/down animations
  if (cursors.left.isDown) {
    player.anims.play("misa-left-walk", true);
  } else if (cursors.right.isDown) {
    player.anims.play("misa-right-walk", true);
  } else if (cursors.up.isDown) {
    player.anims.play("misa-back-walk", true);
  } else if (cursors.down.isDown) {
    player.anims.play("misa-front-walk", true);
  } else {
    player.anims.stop();

    // If we were moving, pick and idle frame to use
    if (prevVelocity.x < 0) player.setTexture("atlas", "misa-left");
    else if (prevVelocity.x > 0) player.setTexture("atlas", "misa-right");
    else if (prevVelocity.y < 0) player.setTexture("atlas", "misa-back");
    else if (prevVelocity.y > 0) player.setTexture("atlas", "misa-front");
  }
}

new Game(config);
