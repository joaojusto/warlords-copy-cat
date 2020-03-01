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
const MAP_WIDTH = 40;
const MAP_HEIGHT = 20;

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
  const terrainLayer = map.createBlankDynamicLayer(
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
      const id = tile === 0 ? WATER_ID : TERRAIN_ID;
      spawnPoint = !spawnPoint && id !== 0 ? { x, y } : spawnPoint;
      terrainLayer.putTileAt(id, x, y);
    })
  );

  const player = this.physics.add
    .sprite(spawnPoint.x, spawnPoint.y, "warrior")
    .setDisplaySize(24, 24)
    .setDisplayOrigin(-2, -4);

  const finder = new EasyStar.js();
  finder.setGrid(terrainMatrix);
  finder.setAcceptableTiles([1]);
  finder.enableDiagonals();

  const move = path => {
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
}

function update(time, delta) {}

new Game(config);
