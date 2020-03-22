import EasyStar from "easystarjs";
import { includes } from "lodash";

import {
  TERRAIN_ID,
  FOREST_ID,
  // CASTLE_ID,
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
  const tiles = map.addTilesetImage(
    "tilemap",
    "tiles",
    tileWidth,
    tileHeight,
    1,
    2
  );

  let terrainLayer = map.createBlankDynamicLayer(
    "terrain",
    tiles,
    0,
    0,
    width,
    height,
    tileWidth,
    tileHeight
  );

  let spawnPoint;

  const finder = new EasyStar.js();
  finder.setGrid(world);
  finder.setAcceptableTiles([...TERRAIN_ID, ...MOUNTAIN_ID, ...FOREST_ID]);
  finder.enableDiagonals();
  // finder.enableCornerCutting();

  const costMatrix = [];
  const setCost = setTileCost(costMatrix, finder);

  world.forEach((row, y) =>
    row.forEach((tile, x) => {
      if (!spawnPoint && !includes(WATER_ID, tile)) spawnPoint = { x, y };
      terrainLayer.putTileAt(tile, x, y);
      if (includes(TERRAIN_ID, tile)) setCost(tile, x, y, 1);
      if (includes(FOREST_ID, tile)) setCost(tile, x, y, 2);
      if (includes(MOUNTAIN_ID, tile)) setCost(tile, x, y, 3);
    })
  );

  terrainLayer = map.convertLayerToStatic(terrainLayer);

  return {
    map,
    finder,
    costMatrix,
    spawnPoint,
    terrainLayer
  };
};
