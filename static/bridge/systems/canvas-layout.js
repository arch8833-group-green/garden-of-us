import './multiple-views.js'

const { AFRAME } = window

AFRAME.registerSystem("canvas-layout", {
  schema: {
    bridge: { default: false },
    scale: { default: 1 },
  },
  setScale: function(scale) {
    this.el.setAttribute("canvas-layout", { ...this.data, scale });
  },
  handleZoom: function (amount) {
    let { scale } = this.data;
    scale *= amount;
    this.el.setAttribute("canvas-layout", { ...this.data, scale });
  },
  toggleBridge: function () {
    this.el.setAttribute("canvas-layout", { ...this.data, bridge: !this.data.bridge });
  },
  update: function () {
    const scene = this.el.sceneEl;
    const { scale, bridge } = this.data;
    if (bridge) {
      scene.className = "bridge";
      scene.style.transform = `scale(${scale})`;
    } else {
      scene.className = "";
      scene.style.transform = "";
    }
    scene.setAttribute("multiple-views", { enabled: bridge });
  },
});
