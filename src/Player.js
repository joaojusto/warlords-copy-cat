import Army from "./Army";

const INITIAL_STATE = {
  turn: 1,
  name: "",
  money: 0,
  armies: [],
  castles: []
};

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
  const update = () => state.armies.forEach(army => army.update());

  return {
    state,
    name,
    turn,
    update,
    endTurn,
    addArmy
  };
};

export default player;
