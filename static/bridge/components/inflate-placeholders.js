import { createDataTexture } from '../utils/createDataTexture.js'

// const palette = ['white', 'white', 'white']
const palette = ['#A67356', '#E9A66F', 'magenta']

AFRAME.registerComponent('inflate-placeholders', {
  init: function() {
    this.el.addEventListener("model-loaded", () => {
      this.inflate();
    });
  },
  inflate: function() {
    // Override color palette
    const structure = this.el.object3D.getObjectByName('Structure')
    const colors = Array(16).fill('black')
    colors.splice(0, palette.length, ...palette)
    structure.material.map = createDataTexture(colors)
    structure.material.transparent = true
    structure.material.opacity = 0.6
    
    // Create flower placeholder entities
    this.el.object3D.traverse(object => {
      if (object.name.startsWith('Flower')) {
        const el = document.createElement('a-entity')
        this.el.appendChild(el)
        el.object3D.position.copy(object.position)
        el.object3D.quaternion.copy(object.quaternion)
        el.object3D.scale.copy(object.scale)
        // el.setAttribute('axes-helper', 'size: 3')
        el.classList.add('placeholder')
      }
    })
    this.el.sceneEl.emit('placeholders_ready')
  }
})