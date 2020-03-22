import Phaser, { Game } from "phaser";
import EasyStar from "easystarjs";
import { isEqual, includes } from "lodash";

import game from "./Game";
import generator from "./TerrainGen";

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

const minimapConfig = {
  width: 102,
  height: 102,
  margin: 10,
  background: 0x002244,
  name: "minimap"
};

export const TERRAIN_ID = [2];
export const FOREST_ID = [4, 5, 6];
export const SAND_ID = [8, 9, 10, 11, 12, 13, 14, 15];
export const CASTLE_ID = [];
export const MOUNTAIN_ID = [1];
export const WATER_ID = [3, 7];
const MAP_WIDTH = 100;
const MAP_HEIGHT = 100;
// const SEED = 0.8444330836642344;

function preload() {
  this.load.setBaseURL(`${process.env.PUBLIC_URL}`);
  this.load.image("tiles", "tilesets/tileset-extruded.png");
  this.load.image("warrior", "warrior.png");
  // this.load.tilemapTiledJSON("map", "/tilemaps/copycat.json");
}

let controls;

function create() {
  const map = this.make.tilemap({ tileWidth: 128, tileHeight: 128 });
  const { tileWidth, tileHeight } = map;
  const tiles = map.addTilesetImage(
    "tilemap",
    "tiles",
    tileWidth,
    tileHeight,
    1,
    2
  );
  console.log("here", tileWidth, tileHeight);
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

  const finder = new EasyStar.js();
  finder.setGrid(terrainMatrix);
  finder.setAcceptableTiles([...TERRAIN_ID, ...MOUNTAIN_ID, ...FOREST_ID]);
  // finder.enableDiagonals();
  // finder.enableCornerCutting();
  const costMatrix = [];
  const setCost = (tile, x, y, cost) => {
    finder.setTileCost(tile, cost);
    costMatrix[y] = costMatrix[y] || [];
    costMatrix[y][x] = cost;
  };

  terrainMatrix.forEach((row, y) =>
    row.forEach((tile, x) => {
      if (!spawnPoint && !includes(WATER_ID, tile)) spawnPoint = { x, y };
      terrainLayer.putTileAt(tile, x, y);
      if (includes(TERRAIN_ID, tile)) setCost(tile, x, y, 1);
      if (includes(FOREST_ID, tile)) setCost(tile, x, y, 2);
      if (includes(MOUNTAIN_ID, tile)) setCost(tile, x, y, 3);
    })
  );

  terrainLayer = map.convertLayerToStatic(terrainLayer);

  const { width, height } = terrainLayer;

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
    .sprite(spawnPoint.x * tileWidth, spawnPoint.y * tileHeight, "warrior")
    .setDisplaySize(24, 24)
    .setDisplayOrigin(-42, -44);

  this.cameras.main.setBounds(0, 0, width, height);
  this.cameras.main.setScroll(
    -(this.cameras.main.width / 2) + width / 2,
    -(this.cameras.main.height / 2) + height / 2
  );
  this.cameras.main.centerOn(player.x, player.y);

  let graphics = this.add.graphics();

  const MOVEMENT_POINTS = 4;
  const playerState = { movementPoints: MOVEMENT_POINTS };
  let currentMovement;

  const doMove = movement => {
    const tweens = movement.currentTurn.map(({ x, y }) => ({
      targets: player,
      x: { value: x * tileWidth, duration: 200 },
      y: { value: y * tileHeight, duration: 200 }
    }));
    this.cameras.main.startFollow(player);
    this.tweens.timeline({
      tweens,
      onComplete: () => {
        this.cameras.main.stopFollow(player);
        clearOldMovement(movement);
      }
    });
    playerState.movementPoints -= movement.currentCost;
  };

  const clearOldMovement = movement => {
    graphics.destroy();
    graphics = this.add.graphics();
    movement = null;
  };

  const move = path => {
    if (!path) return;

    console.log(currentMovement && currentMovement.path, path);

    if (currentMovement && isEqual(currentMovement.path, path)) {
      console.log("here");
      return doMove(currentMovement);
    } else if (currentMovement) {
      clearOldMovement(currentMovement);
    }

    const movementState = {
      path,
      currentCost: 0,
      totalCost: 0,
      currentTurn: [],
      nextTurns: [],
      indicators: [],
      nextIndicators: []
    };

    const pathReducer = (state, { x, y }) => {
      const cost = costMatrix[y][x];
      const totalCost = state.totalCost + cost;
      const currentTurn = [...state.currentTurn];
      const nextTurns = [...state.nextTurns];
      let currentCost = state.currentCost;

      if (totalCost <= playerState.movementPoints) {
        currentTurn.push({ x, y });
        currentCost = totalCost;
      } else nextTurns.push({ x, y });

      return { path, currentCost, totalCost, currentTurn, nextTurns };
    };

    const movement = path
      .slice(1, path.length)
      .reduce(pathReducer, movementState);

    graphics.fillStyle(0xffffff, 1); // color: 0xRRGGBB
    movement.indicators = movement.currentTurn.map(({ x, y }) => {
      const circle = new Phaser.Geom.Circle(
        x * tileWidth + tileWidth / 2,
        y * tileHeight + tileHeight / 2,
        8
      );
      graphics.fillCircleShape(circle);
      return circle;
    });

    graphics.fillStyle(0xff0000, 1); // color: 0xRRGGBB
    movement.nextIndicators = movement.nextTurns.map(({ x, y }) => {
      const circle = new Phaser.Geom.Circle(
        x * tileWidth + tileWidth / 2,
        y * tileHeight + tileHeight / 2,
        8
      );
      graphics.fillCircleShape(circle);
      return circle;
    });
    console.log("here", movement);
    currentMovement = movement;
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
      console.error("Ups! Out of scope :S");
    }
  });

  const cursors = this.input.keyboard.createCursorKeys();

  const controlConfig = {
    camera: this.cameras.main,
    left: cursors.left,
    right: cursors.right,
    up: cursors.up,
    down: cursors.down,
    zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
    zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
    acceleration: 2.8,
    drag: 0.6,
    maxSpeed: 200.0
  };

  controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
}

function update(time, delta) {
  controls.update(delta);
  this.cameras.main.setZoom(Phaser.Math.Clamp(this.cameras.main.zoom, 0.08, 1));
}

new Game(config);
