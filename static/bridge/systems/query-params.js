import './canvas-layout.js'

const { AFRAME } = window;

AFRAME.registerSystem("query-params", {
  init: function () {
    this.el.sceneEl.addEventListener('renderstart', () =>{
    const url = new URL(location.href)
    if (url.searchParams.has("output")) {
      this.el.sceneEl.setAttribute("canvas-layout", { scale: 1, bridge: true });
    }
    })
  },
});
