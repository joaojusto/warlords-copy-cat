const INITIAL_STATE = {
  turn: 1,
  name: "",
  money: 0,
  armies: [],
  castles: []
};

class Army {
  constructor(scene, x, y, type) {
    this.scene = scene;
    this.movementPoints = 4;
    this.body = scene.physics.add
      .sprite(x, y, type)
      .setDisplaySize(24, 24)
      .setDisplayOrigin(-42, -44);
  }

  spendMovement = amount => (this.movementPoints -= amount);
  resetMovement = () => (this.movementPoints = 4);
}

const player = (scene, id) => {
  let state = {
    ...INITIAL_STATE,
    name: `Player ${id}`
  };

  const endTurn = () => {
    state.armies.forEach(army => army.resetMovement());

    state = {
      ...state,
      turn: state.turn + 1
    };
  };

  const addArmy = (x, y, type) => {
    const newArmy = new Army(scene, x, y, type);
    state = {
      ...state,
      armies: [...state.armies, newArmy]
    };
    return newArmy;
  };

  const name = () => state.name;
  const turn = () => state.turn;

  return {
    state,
    name,
    turn,
    endTurn,
    addArmy
  };
};

export default player;
