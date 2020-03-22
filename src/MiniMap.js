const CONFIG = {
  width: 102,
  height: 102,
  margin: 10,
  padding: 2,
  background: 0x002244,
  name: "minimap"
};

export default (scene, mapWidth, mapHeight) => {
  const { width, height, margin, padding, name, background } = CONFIG;

  const zoom = (height - padding) / mapHeight;
  const center = { x: mapWidth / 2, y: mapHeight / 2 };
  const positon = { x: scene.width - width - margin, y: margin };

  return scene.cameras
    .add(positon.x, positon.y, width, height)
    .setZoom(zoom)
    .setName(name)
    .centerOn(center.x, center.y)
    .setBackgroundColor(background);
};
