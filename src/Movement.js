import { isEqual } from "lodash";
import { Geom } from "phaser";

const INITIAL_STATE = {
  path: [],
  cost: 0,
  totalCost: 0,
  currentTurn: [],
  nextTurns: [],
  indicators: [],
  nextIndicators: []
};

const pathReducer = (costMatrix, target) => (state, { x, y }) => {
  const { cost, totalCost, currentTurn, nextTurns } = state;
  const tileCost = costMatrix[y][x];

  if (totalCost + tileCost <= target.movementPoints)
    return {
      ...state,
      cost: cost + tileCost,
      totalCost: totalCost + tileCost,
      currentTurn: [...currentTurn, { x, y }]
    };

  return {
    ...state,
    totalCost: totalCost + tileCost,
    nextTurns: [...nextTurns, { x, y }]
  };
};

export default (scene, costMatrix, tileWidth, tileHeight) => {
  let graphics = scene.add.graphics();
  let state = INITIAL_STATE;

  const worldX = value => value * tileWidth;
  const worldY = value => value * tileHeight;

  const clear = () => {
    graphics.destroy();
    graphics = scene.add.graphics();
    state = INITIAL_STATE;
  };

  const createPathPoint = ({ x, y }) => {
    const positon = {
      x: worldX(x) + tileWidth / 2,
      y: worldY(y) + tileHeight / 2
    };
    const circle = new Geom.Circle(positon.x, positon.y, 8);
    graphics.fillCircleShape(circle);
    return circle;
  };

  const onComplete = target => () => {
    scene.camera.stopFollow(target.body);
    clear();
  };

  const doMove = target => {
    const { cost, currentTurn } = state;
    const tweens = currentTurn.map(({ x, y }) => ({
      targets: target.body,
      x: { value: worldX(x), duration: 200 },
      y: { value: worldY(y), duration: 200 }
    }));

    scene.camera.startFollow(target.body);
    scene.tweens.timeline({ tweens, onComplete: onComplete(target) });

    target.spendMovement(cost);
  };

  const move = target => path => {
    if (!path || path.length <= 1) return clear();

    if (state && state.currentTurn.length && isEqual(state.path, path))
      return doMove(target);

    clear();

    const nextState = path
      .slice(1, path.length)
      .reduce(pathReducer(costMatrix, target), { ...INITIAL_STATE, path });

    let { currentTurn, nextTurns } = nextState;

    graphics.fillStyle(0xffffff, 1); // color: white
    nextState.indicators = currentTurn.map(createPathPoint);

    graphics.fillStyle(0xff0000, 1); // color: red
    nextState.nextIndicators = nextTurns.map(createPathPoint);

    state = nextState;
  };

  return { move, clear };
};
