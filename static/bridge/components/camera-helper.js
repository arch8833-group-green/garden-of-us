const { AFRAME, THREE } = window

AFRAME.registerComponent('camera-helper', {
  schema: {
    visible: { default: true }
  },
  init() {
    const camera = this.el.getObject3D('camera')
    if (!camera) throw new Error('"camera-helper" requires a camera object')
    
    const helper = new THREE.CameraHelper(camera)
    this.el.sceneEl.object3D.add(helper)
    // camera.add(helper)
    this.helper = helper
  },
  update() {
    this.helper.material.visible = this.data.visible
  }
})