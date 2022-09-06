AFRAME.registerComponent('structure-motion', {
  schema: {
    speed: { default: 1 },
    amplitude: { default: 1 },
    offset: { default: 0 },
  },
  tick: function(time, deltaTime) {
    if (this.el.object3D) {
    this.el.object3D.rotation.x = Math.sin(time / 1000 * 0.2 * this.data.speed + this.data.offset) * 0.3 * this.data.amplitude
    this.el.object3D.rotation.y = Math.sin(time / 1000 * 0.3 * this.data.speed + this.data.offset) * 0.3 * this.data.amplitude
    }
      
  }
})