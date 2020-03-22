import generator from "./TerrainGen";

const INITIAL_STATE = {
  map: null,
  players: []
};

const game = () => {
  let state = {
    ...INITIAL_STATE
  };

  const loadMap = map => {
    state = { ...state, map };
  };

  const saveMap = () => {
    return state.map;
  };

  const addPlayer = player => {
    const { players } = state;
    state = { ...state, players: [...players, player] };
  };

  const generateMap = (width, height, seed = Math.random) => {
    const map = generator(width, height);
    state = { ...state, map };
  };

  return {
    loadMap,
    saveMap,
    addPlayer,
    generateMap
  };
};

export default game;
