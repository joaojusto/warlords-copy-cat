import { Math as PhaserMath } from "phaser";

import generator from "./TerrainGen";
import Scene from "./Scene";
import Map from "./Map";
import MiniMap from "./MiniMap";
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

export default class GameScene extends Scene {
  constructor() {
    super(arguments);
    this.players = [];
  }

  addPlayer() {
    const playerId = this.players.length;
    const newPlayer = Player(this, playerId);
    this.players.push(newPlayer);
    return newPlayer;
  }

  preload() {
    this.load.setBaseURL(`${process.env.PUBLIC_URL}`);
    this.load.image("tiles", "tilesets/tileset-extruded.png");
    this.load.image("warrior", "warrior.png");
    // this.load.tilemapTiledJSON("map", "/tilemaps/copycat.json");
  }

  create() {
    const world = generator(MAP_WIDTH, MAP_HEIGHT);
    const { map, finder, costMatrix, spawnPoint, terrainLayer } = Map(
      this,
      world,
      MAP_WIDTH,
      MAP_HEIGHT
    );
    this.finder = finder;
    const { tileWidth, tileHeight } = map;

    const player = this.addPlayer();
    this.target = player.addArmy(
      spawnPoint.x * tileWidth,
      spawnPoint.y * tileHeight,
      "warrior"
    );

    this.minimap = MiniMap(this, terrainLayer.width, terrainLayer.height);
    this.setupCamera(terrainLayer.width, terrainLayer.height);
    this.camera.centerOn(this.target.body.x, this.target.body.y);

    this.movement = Movement(this, costMatrix, tileWidth, tileHeight);

    this.createMapControls();
    this.input.on("pointerdown", this.onPointerDown);

    const title = this.add
      .text(
        20,
        20,
        `Current Player: ${player.name()}, turn: ${player.turn()}`,
        { fill: "#000000" }
      )
      .setScrollFactor(0);

    const button = this.add
      .text(700, 560, `End Turn`, { fill: "#000000" })
      .setScrollFactor(0)
      .setInteractive()
      .on("pointerdown", () => {
        player.endTurn();
        title.setText(
          `Current Player: ${player.name()}, turn: ${player.turn()}`
        );
      });
  }

  onPointerDown = ({ worldX, worldY }) => {
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
  }
}
