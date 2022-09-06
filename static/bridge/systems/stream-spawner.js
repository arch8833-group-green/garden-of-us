const { AFRAME } = window

AFRAME.registerSystem('stream-spawner', {
  init: function() {
    
  },
  
  spawnShape({ color, primitive }) {
    const numStream = 1 + Math.floor(Math.random() * 8)
    
    const isStreamA = numStream <= 4
    const direction = isStreamA ? 1 : -1
    
    const streamTopEl = document.querySelector(`#stream-${numStream}-top`)
    
    const el = document.createElement('a-entity')
    el.setAttribute('geometry', { primitive })
    el.setAttribute('material', { color })
    el.setAttribute('scale', { x: 0.3, y: 0.3, z: 0.3 })
    el.setAttribute('animation__translate', {
      property: 'position.y',
      from: 0,
      to: direction * (20 + Math.random() * 2),
      dur: 4000,
      easing: 'easeInOutQuad'
    })
    el.addEventListener('animationcomplete__translate', () => {
      console.log('complete')
        el.setAttribute('animation__scale', {
          property: 'scale',
          to: "0 0 0",
          dur: 1000,
          easing: 'easeInOutQuad'
        })
        el.addEventListener('')
    }, { once: true })
    
    window.el = el
    
    streamTopEl.appendChild(el)
  }
  
})

/**
          <a-entity
            geometry="primitive: box"
            material="color: white"
            scale="0.3 0.3 0.3"
            animation="property:position.y; from:0; to: 25; loop:true; dur: 4000; dir: alternate; easing: easeInOutQuad"
          ></a-entity>
*/