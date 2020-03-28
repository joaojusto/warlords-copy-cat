import { Scene as PhaserScene, Cameras, Input } from "phaser";

export default class Scene extends PhaserScene {
  get controls() {
    return this.mapControls;
  }

  set controls(controls) {
    this.mapControls = controls;
  }

  get camera() {
    return this.cameras.main;
  }

  get keyboard() {
    return this.input.keyboard;
  }

  get width() {
    return this.game.config.width;
  }

  get height() {
    return this.game.config.height;
  }

  get finder() {
    return this.pathFinder;
  }

  set finder(finder) {
    this.pathFinder = finder;
  }

  get movement() {
    return this.entityMover;
  }

  set movement(movement) {
    this.entityMover = movement;
  }

  get minimap() {
    return this.minimapCamera;
  }

  set minimap(minimap) {
    this.minimapCamera = minimap;
  }

  get terrainLayer() {
    return this.terrain;
  }

  set terrainLayer(terrainLayer) {
    this.terrain = terrainLayer;
  }

  createMapControls() {
    const { Q, E } = Input.Keyboard.KeyCodes;
    const { SmoothedKeyControl } = Cameras.Controls;
    const { left, right, up, down } = this.input.keyboard.createCursorKeys();

    const config = {
      up: up,
      down: down,
      left: left,
      right: right,
      camera: this.camera,
      zoomIn: this.keyboard.addKey(Q),
      zoomOut: this.keyboard.addKey(E),
      drag: 0.6,
      maxSpeed: 200.0,
      acceleration: 2.8
    };

    this.controls = new SmoothedKeyControl(config);
  }

  setupCamera(mapWidth, mapHeight) {
    const { width, height } = this.camera;

    this.camera.setBounds(0, 0, mapWidth, mapHeight);
    this.camera.setScroll(
      -(width / 2) + mapWidth / 2,
      -(height / 2) + mapHeight / 2
    );
  }
}
