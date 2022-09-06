const { AFRAME, THREE } = window;

AFRAME.registerComponent("grid-helper", {
  schema: {
    size: { default: 10 },
    divisions: { default: 10 },
    visible: { default: true },
  },
  update: function () {
    if (this.gridHelper) {
      this.gridHelper.material.dispose();
      this.gridHelper.geometry.dispose();
      this.el.removeObject3D("gridHelper");
    }
    if (this.data.visible) {
      this.gridHelper = new THREE.GridHelper(
        this.data.size,
        this.data.divisions
      );
      this.el.setObject3D("gridHelper", this.gridHelper);
    }
  },
});
