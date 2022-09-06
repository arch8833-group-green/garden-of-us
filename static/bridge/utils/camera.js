const { THREE } = window


/**
 * Solves for the FOV that will perfectly frame a plane at a given distance
 * https://www.html5gamedevs.com/topic/33246-make-a-perfect-plane-to-fit-frustum/
 *
 * @param {number} dist - Distance from camera to frame
 * @param {number} height - Height of frame
 *
 * @returns {number} Vertical FOV in degrees that will fit frame
 */
export function getFramedFov(dist, height) {
  return 2 * Math.atan(height / (2 * dist)) * THREE.MathUtils.RAD2DEG
}

