import { TransitionManager } from "../utils/TransitionManager.js";
import { createDataTexture } from '../utils/createDataTexture.js'
const { AFRAME } = window;

AFRAME.registerComponent("spawned-flower", {
  schema: {
    colorArray: { default: ['red', 'green', 'blue']},
    immediate: { default: false }
  },
  init: function () {
    this.el.addEventListener("model-loaded", () => {
      this.split();
    });
  },
  split: async function () {
    
    console.log('spawning flower', this.data.colorArray)
    
    // Override petal texture with custom colors
    const petalMaterial = this.el.object3D.getObjectByName('Petal001').material
    const texture = createDataTexture(this.data.colorArray)
    petalMaterial.map = texture
    
    // Override body color
    const body = this.el.object3DMap.mesh.getObjectByName("Body");
    body.material.color.set(this.data.colorArray[1]);
    
    // Skip the spawn animation for pre-loaded flowers
    if (this.data.immediate)
      return;
    
    
    body.scale.setScalar(1e-6);
    const transitionInBody = () => {
      AFRAME.ANIME({
        targets: body.scale,
        x: 1,
        y: 1,
        z: 1,
        easing: "easeInOutQuad",
      });
      AFRAME.ANIME({
        targets: body.rotation,
        y: [-3, 0],
        easing: "easeInOutQuad",
      });
    };
    
    
    const streamIndices = randomIndices(8, 6)
    
    const promises = this.el.object3DMap.mesh.children
      .filter((object) => object.name.includes("Petal"))
      .map(async (object, i) => {
        // Update world matrix for petal and ancestors
        object.updateWorldMatrix(true, false);

        // Create empty entity at each petal position
        const emptyEl = document.createElement("a-entity");
        this.el.appendChild(emptyEl);
        emptyEl.object3D.applyMatrix4(object.matrix);
        emptyEl.classList.add("origin");
        // emptyEl.setAttribute("axes-helper", "");

        const streamId = streamIndices[i] + 1
        const topEl = document.querySelector(`#stream-${streamId}-top`);
        const bottomEl = document.querySelector(`#stream-${streamId}-bottom`);

        const tm = new TransitionManager(object, this.el.sceneEl.object3D);
        tm.setParent(topEl.object3D);
        await tm.transitionParent(bottomEl.object3D);
        await tm.transitionParent(emptyEl.object3D, {
          easing: "easeInOutSine",
        });
      });
    await Promise.all(promises);
    transitionInBody();
  },
});

function randomIndices(totalSize, size) {
    let indices = Array(totalSize).fill().map((_, i) => i)
    let randomIndices = []
    while (randomIndices.length < size) {
        const i = Math.floor(Math.random() * indices.length)
        randomIndices.push(...indices.splice(i, 1))
    }
    return randomIndices
}