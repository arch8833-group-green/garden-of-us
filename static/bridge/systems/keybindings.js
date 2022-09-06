import './canvas-layout.js'

const FACTOR = 1.1;

const { AFRAME } = window;

AFRAME.registerSystem("keybindings", {
  init: function () {
    const layoutSystem = this.el.sceneEl.systems["canvas-layout"];
    const onKeyDown = (e) => {
      switch (e.key) {
        case "-":
          layoutSystem.handleZoom(1 / FACTOR);
          break;
        case "=":
          layoutSystem.handleZoom(FACTOR);
          break;
        case "0":
          layoutSystem.setScale(1);
          break;
        case "9":
          layoutSystem.toggleBridge();
          break;
      }
    }
    
    window.addEventListener('keydown', onKeyDown)
  },
});
