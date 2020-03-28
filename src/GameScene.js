import { Math as PhaserMath, Scene as PhaserScene } from "phaser";

import generator from "./TerrainGen";
import Scene from "./Scene";
import Map from "./Map";
import Movement from "./Movement";
import Player from "./Player";

const MAP_WIDTH = 100;
const MAP_HEIGHT = 100;
const TILE_WIDTH = 128;
const TILE_HEIGHT = 128;
// const SEED = 0.8444330836642344;

const worldToTile = (x, y) => ({
  x: Math.floor(x / TILE_WIDTH),
  y: Math.floor(y / TILE_HEIGHT)
});

const tileToWorld = (x, y) => ({
  x: Math.floor(x * TILE_WIDTH),
  y: Math.floor(y * TILE_HEIGHT)
});

const cursor = name => {
  return `url(${process.env.PUBLIC_URL}/${name}.png), pointer`;
};

export default class GameScene extends Scene {
  constructor() {
    super("GameScene");
    this.players = [];
  }

  get target() {
    return this.selectedTarget;
  }

  set target(selectedTarget) {
    this.selectedTarget = selectedTarget;

    if (selectedTarget) this.input.setDefaultCursor(cursor("cursor_move"));
    else this.input.setDefaultCursor(cursor("cursor"));
  }

  setClickCursor() {
    this.input.setDefaultCursor(cursor("cursor"));
  }

  setOpenCursor() {
    this.input.setDefaultCursor(cursor("cursor_open"));
  }

  setDefaultCursor() {
    if (this.target) this.input.setDefaultCursor(cursor("cursor_move"));
    else this.input.setDefaultCursor(cursor("cursor"));
  }

  addPlayer() {
    const playerId = this.players.length;
    const newPlayer = Player(this, playerId);
    this.players.push(newPlayer);
    return newPlayer;
  }

  preload() {
    this.load.setBaseURL(`${process.env.PUBLIC_URL}`);
    this.load.image("tileset", "tilesets/tileset-extruded.png");
    this.load.image("warrior", "warrior.png");
    // this.load.tilemapTiledJSON("map", "/tilemaps/copycat.json");
  }

  create() {
    this.input.setDefaultCursor(cursor("cursor"));
    this.input.mouse.disableContextMenu();

    const world = generator(MAP_WIDTH, MAP_HEIGHT);
    const { map, finder, costMatrix, spawnPoint, terrainLayer } = Map(
      this,
      world,
      MAP_WIDTH,
      MAP_HEIGHT
    );
    this.finder = finder;
    this.terrainLayer = terrainLayer;
    const { tileWidth, tileHeight } = map;

    const spawn = tileToWorld(spawnPoint.x - 2, spawnPoint.y + 2);

    const player = this.addPlayer();
    spawnPoint.castle.setOwner(player);
    this.target = player.addArmy(spawn.x, spawn.y, "warrior");

    this.setupCamera(terrainLayer.width, terrainLayer.height);
    this.camera.centerOn(spawn.x, spawn.y);

    this.movement = Movement(this, costMatrix, tileWidth, tileHeight);

    this.createMapControls();
    this.input.on("pointerdown", this.onPointerDown);

    this.scene.run("UI");

    this.events.on("castleclicked", castle => {
      this.setClickCursor();
      this.scene.pause();
      this.scene.run("Modal", { castle, player });
    });
  }

  onPointerDown = pointer => {
    if (pointer.rightButtonDown()) {
      this.target = null;
    }
    if (!this.target) return;

    const { worldX, worldY } = pointer;
    const to = worldToTile(worldX, worldY);
    const from = worldToTile(this.target.body.x, this.target.body.y);
    const onPathCalculated = this.movement.move(this.target);

    try {
      this.finder.findPath(from.x, from.y, to.x, to.y, onPathCalculated);
      this.finder.calculate();
    } catch (error) {
      console.error("Ups! Out of scope :S");
    }
  };

  update(time, delta) {
    this.controls.update(delta);
    this.camera.setZoom(PhaserMath.Clamp(this.camera.zoom, 0.08, 1));
    this.players.forEach(player => player.update());
  }
}
