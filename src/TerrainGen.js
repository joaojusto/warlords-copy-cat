import { Noise } from "noisejs";
import { findLast, range, sample, sortBy } from "lodash";
import { progress } from "@popmotion/popcorn";

export const TERRAIN_ID = [2];
export const FOREST_ID = [4, 5, 6];
export const SAND_ID = [8, 9, 10, 11, 12, 13, 14, 15];
export const CASTLE_ID = [];
export const MOUNTAIN_ID = [1];
export const WATER_ID = [3, 7];

const ZOOM_FACTOR = 12;

export default (width, height, seed = Math.random()) => {
  const noise = new Noise();
  noise.seed(seed);
  const zoom = (width * ZOOM_FACTOR) / 100;

  let min = 0;
  let max = 0;
  let bellow0 = 0;
  let above0 = 0;

  const matrix = range(height).map(y => {
    return range(width).map(x => {
      const value = noise.perlin2(x / zoom, y / zoom);

      min = value < min ? value : min;
      max = value > max ? value : max;

      if (value < 0) bellow0++;
      else above0++;

      return value;
    });
  });

  // let islands = [];

  // const border = 0.2;
  const waterLevel = 0.45;
  const sandLevel = waterLevel + 0.1;

  // const isAdjacent = (x, y) => island =>
  //   (x + 1 === island.x || x - 1 === island.x || x === island.x) &&
  //   (y + 1 === island.y || y - 1 === island.y || y === island.y);

  const isSand = level => level >= waterLevel && level < sandLevel;
  const isWater = level => level < waterLevel;
  const isTerrain = level => !isSand(level) && !isWater(level);

  const sandTile = (matrix, x, y) => {
    if (y - 1 < 0 || y + 1 >= matrix.length) return sample(WATER_ID);
    if (x - 1 < 0 || x + 1 >= matrix.length) return sample(WATER_ID);

    const topLeft = progress(min, max, matrix[y - 1][x - 1]);
    const top = progress(min, max, matrix[y - 1][x]);
    const topRight = progress(min, max, matrix[y - 1][x + 1]);
    const left = progress(min, max, matrix[y][x - 1]);
    const right = progress(min, max, matrix[y][x + 1]);
    const bottomLeft = progress(min, max, matrix[y + 1][x - 1]);
    const bottom = progress(min, max, matrix[y + 1][x]);
    const bottomRight = progress(min, max, matrix[y + 1][x + 1]);

    if (
      !isTerrain(top) &&
      !isTerrain(left) &&
      !isTerrain(right) &&
      !isTerrain(bottom)
    )
      return sample(WATER_ID);

    if (isTerrain(bottom) && isTerrain(right)) return SAND_ID[7];
    if (isTerrain(top) && isTerrain(right)) return SAND_ID[2];
    if (isTerrain(bottom) && isTerrain(left)) return SAND_ID[5];
    if (isTerrain(top) && isTerrain(left)) return SAND_ID[0];

    if (isTerrain(top)) return SAND_ID[1];
    if (isTerrain(bottom)) return SAND_ID[6];
    if (isTerrain(right)) return SAND_ID[3];
    if (isTerrain(left)) return SAND_ID[4];

    if (topLeft < waterLevel && top < waterLevel && topRight < waterLevel) {
      return SAND_ID[6];
    }

    if (
      bottomLeft < waterLevel &&
      bottom < waterLevel &&
      bottomRight < waterLevel
    ) {
      return SAND_ID[1];
    }
  };

  const tileType = matrix => (tile, x, y) => {
    const value = progress(min, max, tile);
    if (isWater(value)) return sample(WATER_ID);
    if (isSand(value)) return sandTile(matrix, x, y);
    // if (value >= 0.6 && value < 0.61) return sample(CASTLE_ID);
    if (value >= 0.7 && value < 0.8) return sample(FOREST_ID);
    if (value >= 0.8) return sample(MOUNTAIN_ID);
    return sample(TERRAIN_ID);
  };

  const tileTypeFactory = tileType(matrix);

  const normalized = matrix.map((row, y) =>
    row.map((tile, x) => {
      // if (y < height * border || y > height * (1 - border)) return WATER_ID;
      // if (x < width * border || x > width * (1 - border)) return WATER_ID;

      // const value = progress(min, max, tile);
      // if (value < waterLevel) return WATER_ID;

      return tileTypeFactory(tile, x, y);
      // const adjcentTiles = findLast(islands, island =>
      //   findLast(island, isAdjacent(x, y))
      // );
      //
      // if (adjcentTiles) {
      //   adjcentTiles.push({ x, y, type: tileType(tile) });
      // } else {
      //   islands.push([{ x, y, type: tileType(tile) }]);
      // }

      // return WATER_ID;
    })
  );

  console.log(`Min: ${min}, Max: ${max}`);
  console.log(`<0: ${bellow0}, >0: ${above0}`);
  console.log(`Seed: ${seed}`);

  // console.log(islands.length, islands);

  // sortBy(islands, "length")
  //   .reverse()[0]
  //   .forEach(({ x, y, type }) => (normalized[y][x] = type));
  return normalized;
};

export const toEmoji = map =>
  map.map(row => row.map(column => (column === 0 ? "🌊" : "🌲")));

export const toConsole = map =>
  map.forEach((row, index) => {
    console.log(`${index}: ${row.join("")}`);
  });
