import { Noise } from "noisejs";
import { range, sample } from "lodash";

import { WATER_ID, TERRAIN_ID, FLOWER_ID } from "./DynamicTileMap";

export default (width, height, seed = Math.random()) => {
  const noise = new Noise();
  noise.seed(seed);

  let min = 0;
  let max = 0;
  let bellow0 = 0;
  let above0 = 0;

  const matrix = range(height).map(y => {
    return range(width).map(x => {
      const value =
        Math.round(
          (noise.perlin2(x / (width / 4), y / (height / 4)) + Number.EPSILON) *
            100
        ) / 100;
      min = value < min ? value : min;
      max = value > max ? value : max;
      if (value < 0) bellow0++;
      else above0++;

      return value;
    });
  });
  const lowerBound = min - min * 0.6;
  const maxBound = max - max * 0.3;
  const midBound = max - max * 0.6;

  const normalized = matrix.map(row =>
    row.map(tile => {
      if (tile < lowerBound) return WATER_ID;
      if (tile >= maxBound) return sample(FLOWER_ID);
      return sample(TERRAIN_ID);
    })
  );

  console.log(`Min: ${min}, Max: ${max}`);
  console.log(`<0: ${bellow0}, >0: ${above0}`);
  console.log(`Seed: ${seed}`);

  return normalized;
};

export const toEmoji = map =>
  map.map(row => row.map(column => (column === 0 ? "🌊" : "🌲")));

export const toConsole = map =>
  map.forEach((row, index) => {
    console.log(`${index}: ${row.join("")}`);
  });
