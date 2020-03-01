import { Noise } from "noisejs";
import { range } from "lodash";

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
        Math.round((noise.simplex2(x, y) + Number.EPSILON) * 100) / 100;
      min = value < min ? value : min;
      max = value > max ? value : max;
      if (value < 0) bellow0++;
      else above0++;

      if (value > -0.2) return 1;
      return 0;
    });
  });

  console.log(`Min: ${min}, Max: ${max}`);
  console.log(`<0: ${bellow0}, >0: ${above0}`);
  console.log(`Seed: ${seed}`);

  return matrix;
};

export const toEmoji = map =>
  map.map(row => row.map(column => (column === 0 ? "🌊" : "🌲")));

export const toConsole = map =>
  map.forEach(row => {
    console.log(row.join(""));
  });
