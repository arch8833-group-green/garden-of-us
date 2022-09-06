import "./stream-spawner.js";
import { searchParams } from "../utils/searchParams.js";

const { AFRAME, THREE, Howl, io } = window;

const sprite = [
  [0, 4562],
  [4562, 4532],
  [9087, 4494],
  [13611, 4601],
];
const pling = new Howl({
  src: [
    "/assets/audio/pling_combined.mp3",
  ],
  html5: true,
  sprite,
});

window.pling = pling;

AFRAME.registerSystem("socket-io", {
  dependencies: ["stream-spawner"],
  init: function () {
    if (searchParams.has("livereload")) {
      io("/livereload").on("reload", () => location.reload());
    }

    const socket = io();
    const spawner = this.el.sceneEl.systems["stream-spawner"];

    socket.on("spawn", ({ colorArray, primitive }) => {
      this.spawnFlower(colorArray);
      // console.log('spawning shape', { color, primitive })
      // spawner.spawnShape({ color, primitive })
    });

    this.el.addEventListener(
      "placeholders_ready",
      () => {
        this.placeholders = [...document.querySelectorAll(".placeholder")];
        this.placeholderIdx = 0;

        this.preload();
      },
      { once: true }
    );
  },
  spawnFlower: function (colorArray, immediate = false) {
    
    // Reorder colors to better match UV layout
    const temp = colorArray[0]
    colorArray[0] = colorArray[1]
    colorArray[1] = temp
    
    const rootEl = this.placeholders[this.placeholderIdx];
    this.placeholderIdx = (this.placeholderIdx + 1) % this.placeholders.length;
    window.rootEl = rootEl;
    // Remove old flowers

    const dur = 500;
    for (let childEl of rootEl.children) {
      childEl.setAttribute("animation", {
        property: "scale",
        to: "0 0 0",
        dur,
      });
      setTimeout(() => {
        childEl.remove();
      }, dur);
    }

    // OLD APPROACH: MAKE RANDOM TARGET POSITION

    // const rootEl = document.createElement("a-entity");
    // rootEl.setAttribute("animation", {
    //   property: "object3D.rotation.z",
    //   from: 0,
    //   to: 360,
    //   dur: 10000,
    //   loop: true,
    //   easing: "linear",
    // });
    // rootEl.setAttribute("position", {
    //   x: THREE.MathUtils.randFloat(-9, 9),
    //   y: THREE.MathUtils.randFloat(-1.8, 1.8),
    //   z: 1,
    // });

    const flowerEl = document.createElement("a-entity");
    // flowerEl.setAttribute("rotation", "90 0 0");
    // flowerEl.setAttribute("scale", "0.5 0.5 0.5");
    flowerEl.setAttribute("gltf-model", "#asset-triangle-flower-textured");
    flowerEl.setAttribute("spawned-flower", { colorArray, immediate });
    rootEl.appendChild(flowerEl);
    if (!immediate) {
      const spriteName = String(Math.floor(Math.random() * sprite.length));
      console.log("playing sound", spriteName);
      pling.play(spriteName);
    }
    // this.el.sceneEl.appendChild(rootEl);
  },
  preload: function () {
    const sampleColorArrays = [
      ["#F3C053", "#FFD7BA", "#E7EDB7"],
      ["#70DBFF", "#0A85ED", "#6966FF"],
      ["#476b57", "#a5d7b8", "#A1C349"],
    ];

    for (let colorArray of sampleColorArrays) {
      this.spawnFlower(colorArray, true);
    }
  },
});
