import Phaser, { Game } from "phaser";
import generator from "./TerrainGen";
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

const WATER_ID = 255;
const TERRAIN_ID = 199;
const MAP_WIDTH = 100;
const MAP_HEIGHT = 100;
// const SEED = 0.8444330836642344;

function preload() {
  this.load.setBaseURL(`${process.env.PUBLIC_URL}`);
  this.load.image("tiles", "tilesets/tuxmon-sample-32px-extruded.png");
  this.load.image("warrior", "warrior.png");
  this.load.tilemapTiledJSON("map", "/tilemaps/warlords.json");
}

function create() {
  const map = this.make.tilemap({ key: "map" });
  const { tileWidth, tileHeight } = map;
  const tiles = map.addTilesetImage("tuxmon-sample-32px-extruded", "tiles");
  let terrainLayer = map.createBlankDynamicLayer(
    "terrain",
    tiles,
    0,
    0,
    MAP_WIDTH,
    MAP_HEIGHT,
    tileWidth,
    tileHeight
  );

  let spawnPoint;
  const terrainMatrix = generator(MAP_WIDTH, MAP_HEIGHT);
  terrainMatrix.forEach((row, y) =>
    row.forEach((tile, x) => {
      if (!spawnPoint && tile !== WATER_ID) {
        spawnPoint = { x, y };
      }
      terrainLayer.putTileAt(tile, x, y);
    })
  );

  terrainLayer = map.convertLayerToStatic(terrainLayer);

  const { width, height } = terrainLayer;
  const minimapConfig = {
    width: 120,
    height: 120,
    margin: 10,
    background: 0x002244,
    name: "minimap"
  };

  this.cameras
    .add(
      config.width - minimapConfig.width - minimapConfig.margin,
      minimapConfig.margin,
      minimapConfig.width,
      minimapConfig.height
    )
    .setZoom((minimapConfig.height - 2) / height)
    .setName(minimapConfig.name)
    .setBackgroundColor(minimapConfig.background)
    .centerOn(width / 2, height / 2);

  const player = this.physics.add
    .sprite(spawnPoint.x, spawnPoint.y, "warrior")
    .setDisplaySize(24, 24)
    .setDisplayOrigin(-2, -4);

  this.cameras.main.setBounds(0, 0, width, height);
  this.cameras.main.startFollow(player);

  const finder = new EasyStar.js();
  finder.setGrid(terrainMatrix);
  finder.setAcceptableTiles([TERRAIN_ID]);
  finder.enableDiagonals();

  const move = path => {
    if (!path) return;

    const tweens = path.slice(1, path.length).map(({ x, y }) => ({
      targets: player,
      x: { value: x * tileWidth, duration: 200 },
      y: { value: y * tileHeight, duration: 200 }
    }));

    this.tweens.timeline({ tweens });
  };

  this.input.on("pointerdown", function(pointer) {
    const { worldX, worldY } = pointer;
    const toX = Math.floor(worldX / tileWidth);
    const toY = Math.floor(worldY / tileHeight);
    const fromX = Math.floor(player.x / tileWidth);
    const fromY = Math.floor(player.y / tileHeight);

    try {
      finder.findPath(fromX, fromY, toX, toY, move);
      finder.calculate();
    } catch (error) {
      console.log("Ups! Out of scope :S");
    }
  });
}

function update(time, delta) {}

new Game(config);
