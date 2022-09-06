import { getFramedFov } from '../utils/camera.js'

const { AFRAME, THREE } = window;

/**
 * Stream A: {1-4}
 * Stream B: {5-8}
 */
const DISPLAY_RES = [3840, 2160];
const POOL_RES = [3072, 1280];
const STREAM_A_RES = [1536, 32];
const STREAM_B_RES = [1472, 32];

const POOL_SIZE = [24, 10]  // [width, height] in 3D space
const PX_TO_M = POOL_SIZE[0] / POOL_RES[0]
const STREAM2POOL = 48 / 32

const POOL_U = POOL_RES[0] / DISPLAY_RES[0];
const POOL_V = POOL_RES[1] / DISPLAY_RES[1];

const STREAM_A_U = STREAM_A_RES[0] / DISPLAY_RES[0];
const STREAM_A_V = STREAM_A_RES[1] / DISPLAY_RES[1];

const STREAM_B_U = STREAM_B_RES[0] / DISPLAY_RES[0];
const STREAM_B_V = STREAM_B_RES[1] / DISPLAY_RES[1];

const POOL_ASPECT = POOL_RES[0] / POOL_RES[1];
const STREAM_A_ASPECT = STREAM_A_RES[0] / STREAM_A_RES[1];
const STREAM_B_ASPECT = STREAM_B_RES[0] / STREAM_B_RES[1];

function createCameraStreamA() {
  // Longways
  const left = 0
  const right = STREAM_A_RES[0] * PX_TO_M * STREAM2POOL
  // Shortways
  const top = STREAM_A_RES[1] * PX_TO_M / 2 * STREAM2POOL
  const bottom = -top
  return new THREE.OrthographicCamera(left, right, top, bottom, 1, 3)
}

function createCameraStreamB() {
  // Longways
  const left = 0
  const right = STREAM_B_RES[0] * PX_TO_M * STREAM2POOL
  // Shortways
  const top = STREAM_B_RES[1] * PX_TO_M / 2 * STREAM2POOL
  const bottom = -top
  return new THREE.OrthographicCamera(left, right, top, bottom, 1, 3)
}



AFRAME.registerSystem("multiple-views", {
  schema: {
    enabled: { default: false },
  },
  init() {
    /**
     * "bounds" describes the UV range of each view on the canvas
     * [0, 0] is bottom-left, [1, 1] is top-right
     * min is bottom-left, max is top right
     */
    this.views = [
      {
        name: "pool",
        bounds: { min: [0, 1 - POOL_V], max: [POOL_U, 1] },
        camera: new THREE.PerspectiveCamera(getFramedFov(50, 10), POOL_ASPECT, 1, 400),
        position: { x: 0, y: 0, z: 50 },
      },
      {
        name: "stream-1",
        bounds: {
          min: [0, 1 - POOL_V - STREAM_A_V * 1],
          max: [STREAM_A_U, 1 - POOL_V - STREAM_A_V * 0],
        },
        camera: createCameraStreamA(),
        position: { x: -7.28, y: -5, z: 10 },
        rotation: { x: 0, y: 0, z: -90 },
      },
      {
        name: "stream-2",
        bounds: {
          min: [0, 1 - POOL_V - STREAM_A_V * 2],
          max: [STREAM_A_U, 1 - POOL_V - STREAM_A_V * 1],
        },
        camera: createCameraStreamA(),
        position: { x: -3.01, y: -5, z: 10 },
        rotation: { x: 0, y: 0, z: -90 },
      },
      {
        name: "stream-3",
        bounds: {
          min: [0, 1 - POOL_V - STREAM_A_V * 3],
          max: [STREAM_A_U, 1 - POOL_V - STREAM_A_V * 2],
        },
        camera: createCameraStreamA(),
        position: { x: 2.92, y: -5, z: 10 },
        rotation: { x: 0, y: 0, z: -90 },
      },
      {
        name: "stream-4",
        bounds: {
          min: [0, 1 - POOL_V - STREAM_A_V * 4],
          max: [STREAM_A_U, 1 - POOL_V - STREAM_A_V * 3],
        },
        camera: createCameraStreamA(),
        position: { x: 7.20, y: -5, z: 10 },
        rotation: { x: 0, y: 0, z: -90 },
      },
      {
        name: "stream-5",
        bounds: {
          min: [0, 1 - POOL_V - STREAM_A_V * 4 - STREAM_B_V * 1],
          max: [STREAM_B_U, 1 - POOL_V - STREAM_A_V * 4 - STREAM_B_V * 0],
        },
        camera: createCameraStreamB(),
        position: { x: -8.020, y: 5, z: 10 },
        rotation: { x: 0, y: 0, z: 90 },
      },
      {
        name: "stream-6",
        bounds: {
          min: [0, 1 - POOL_V - STREAM_A_V * 4 - STREAM_B_V * 2],
          max: [STREAM_B_U, 1 - POOL_V - STREAM_A_V * 4 - STREAM_B_V * 1],
        },
        camera: createCameraStreamB(),
        position: { x: -2.203, y: 5, z: 10 },
        rotation: { x: 0, y: 0, z: 90 },
      },
      {
        name: "stream-7",
        bounds: {
          min: [0, 1 - POOL_V - STREAM_A_V * 4 - STREAM_B_V * 3],
          max: [STREAM_B_U, 1 - POOL_V - STREAM_A_V * 4 - STREAM_B_V * 2],
        },
        camera: createCameraStreamB(),
        position: { x: 2.139, y: 5, z: 10 },
        rotation: { x: 0, y: 0, z: 90 },
      },
      {
        name: "stream-8",
        bounds: {
          min: [0, 1 - POOL_V - STREAM_A_V * 4 - STREAM_B_V * 4],
          max: [STREAM_B_U, 1 - POOL_V - STREAM_A_V * 4 - STREAM_B_V * 3],
        },
        camera: createCameraStreamB(),
        position: { x: 8.090, y: 5, z: 10 },
        rotation: { x: 0, y: 0, z: 90 },
      },
    ];

    for (let view of this.views) {
      const viewEl = document.createElement("a-entity");
      viewEl.id = `view-${view.name}`;
      viewEl.setObject3D("camera", view.camera);
      viewEl.setAttribute("position", view.position);
      viewEl.setAttribute("rotation", view.rotation);
      viewEl.setAttribute('camera-helper', '')
      // const helper = new THREE.CameraHelper(view.camera);
      // view.helper = helper;
      // helper.visible = false
      
      // this.el.object3D.add(helper);
      this.el.appendChild(viewEl);
    }
  },
  update() {
    if (this.data.enabled) this.enable();
    else this.disable();
  },
  play() {
    if (this.el.sceneEl.renderStarted && this.data.enabled) this.enable();
    this.el.addEventListener("renderstart", () => {
      if (this.data.enabled) {
        this.enable();
      }
    });
  },
  pause() {
    this.disable();
  },
  enable() {
    this.el.renderer.setScissorTest(true);
    this.el.renderer.setAnimationLoop(this.render.bind(this));
    this.setHelpersVisible(false)
  },
  disable() {
    if (this.el.renderStarted) {
      this.el.renderer.setScissorTest(false);
      this.el.renderer.setAnimationLoop(this.el.render.bind(this.el));
      this.el.resize()
      this.setHelpersVisible(true)
    }
  },
  setHelpersVisible(visible) {
    for (const el of document.querySelectorAll('[camera-helper]:not(a-mixin)')) {
      el.setAttribute('camera-helper', { visible })
    }
    for (const el of document.querySelectorAll('[axes-helper]:not(a-mixin)')) {
      el.setAttribute('axes-helper', { visible })
    }    for (const el of document.querySelectorAll('[grid-helper]:not(a-mixin)')) {
      el.setAttribute('grid-helper', { visible })
    }
  },
  hideHelpers() {
    
  },
  render(time, frame) {
    // See https://github.com/aframevr/aframe/blob/018e1236bc71cc9ffa42cd34aeedd03a23a8cd2e/src/core/scene/a-scene.js#L781
    const scene = this.el.sceneEl;
    const renderer = scene.renderer;
    const canvas = renderer.domElement;

    scene.frame = frame;
    scene.delta = scene.clock.getDelta() * 1000;
    scene.time = scene.clock.elapsedTime * 1000;

    if (scene.isPlaying) {
      scene.tick(scene.time, scene.delta);
    }

    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

    // Render all views
    for (let i = 0; i < this.views.length; ++i) {
      const view = this.views[i];
      const { x, y, width, height } = getRect(view, renderer);

      renderer.setViewport(x, y, width, height);
      renderer.setScissor(x, y, width, height);

      renderer.render(scene.object3D, view.camera);
    }
  },
});

function getRect(view, renderer) {
  const [minU, minV] = view.bounds.min;
  const [maxU, maxV] = view.bounds.max;
  const x = minU * renderer.domElement.clientWidth;
  const y = minV * renderer.domElement.clientHeight;
  const width = (maxU - minU) * renderer.domElement.clientWidth;
  const height = (maxV - minV) * renderer.domElement.clientHeight;
  return { x, y, width, height };
}
