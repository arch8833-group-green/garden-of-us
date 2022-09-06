const { AFRAME, THREE } = window

AFRAME.registerComponent('axes-helper', {
  schema: {
    size: { default: 1 },
    visible: { default: true }
  },
  update() {
    if (this.helper) {
      this.helper.removeFromParent()
      this.helper.dispose()
    }
    if (this.data.visible) {
      this.helper = new THREE.AxesHelper(this.data.size)
      this.el.object3D.add(this.helper)
    }
  }
})