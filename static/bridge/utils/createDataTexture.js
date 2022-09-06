const { THREE } = window

export function createDataTexture(colors) {
  const width = Math.ceil(Math.sqrt(colors.length));
  const height = width;

  const size = width * height;
  const data = new Uint8Array(4 * size);
  const color = new THREE.Color(0xffffff);

  for (let i = 0; i < size; i++) {
    const stride = i * 4;

    color.set(colors[i] ?? 'black')
    const r = Math.floor(color.r * 255);
    const g = Math.floor(color.g * 255);
    const b = Math.floor(color.b * 255);

    data[stride] = r;
    data[stride + 1] = g;
    data[stride + 2] = b;
    data[stride + 3] = 255;
  }

  const texture = new THREE.DataTexture(data, width, height);
  texture.needsUpdate = true

  return texture
}