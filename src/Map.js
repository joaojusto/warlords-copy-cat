import EasyStar from "easystarjs";
import { includes } from "lodash";

import {
  TERRAIN_ID,
  FOREST_ID,
  CASTLE_ID,
  MOUNTAIN_ID,
  WATER_ID
} from "./TerrainGen";

const setTileCost = (costMatrix, finder) => (tile, x, y, cost) => {
  finder.setTileCost(tile, cost);
  costMatrix[y] = costMatrix[y] || [];
  costMatrix[y][x] = cost;
};

export default (scene, world, width, height) => {
  const map = scene.make.tilemap({ tileWidth: 128, tileHeight: 128 });
  const { tileWidth, tileHeight } = map;
  const tileset = map.addTilesetImage(
    "tileset",
    "tileset",
    tileWidth,
    tileHeight,
    1,
    2
  );

  let terrainLayer = map.createBlankDynamicLayer(
    "terrain",
    tileset,
    0,
    0,
    width,
    height
  );

  let objectLayer = map.createBlankDynamicLayer(
    "object",
    tileset,
    0,
    0,
    width,
    height
  );

  let spawnPoint;

  const finder = new EasyStar.js();
  finder.setGrid(world);
  finder.setAcceptableTiles([...TERRAIN_ID, ...MOUNTAIN_ID, ...FOREST_ID]);
  finder.enableDiagonals();
  // finder.enableCornerCutting();

  const costMatrix = [];
  const setCost = setTileCost(costMatrix, finder);
  scene.triggers = [];

  world.forEach((row, y) =>
    row.forEach((tile, x) => {
      if (!spawnPoint && includes(CASTLE_ID, tile)) spawnPoint = { x, y };

      if (includes(CASTLE_ID, tile)) {
        terrainLayer.putTileAt(TERRAIN_ID[0], x, y);
        objectLayer.putTileAt(tile, x, y);
        if (tile === CASTLE_ID[0]) {
          const trigger = scene.add
            .zone(x * tileWidth + tileWidth, y * tileWidth + tileHeight)
            .setSize(tileWidth * 2 + 64, tileHeight * 2 + 64);
          scene.physics.world.enable(trigger);
          trigger.body.setAllowGravity(false);
          trigger.body.moves = false;
          trigger.setInteractive();
          scene.triggers.push(trigger);
          trigger.on("pointerover", () => scene.setOpenCursor());
          trigger.on("pointerout", () => scene.setDefaultCursor());
        }
      } else terrainLayer.putTileAt(tile, x, y);

      if (includes(TERRAIN_ID, tile)) setCost(tile, x, y, 1);
      if (includes(FOREST_ID, tile)) setCost(tile, x, y, 2);
      if (includes(MOUNTAIN_ID, tile)) setCost(tile, x, y, 3);
    })
  );

  terrainLayer = map.convertLayerToStatic(terrainLayer);
  objectLayer = map.convertLayerToStatic(objectLayer);

  objectLayer.setTileIndexCallback(24, () => console.log("here 24"), scene);
  objectLayer.setTileIndexCallback(25, () => console.log("here 25"), scene);

  scene.objectLayer = objectLayer;

  return {
    map,
    finder,
    costMatrix,
    spawnPoint,
    terrainLayer
  };
};
