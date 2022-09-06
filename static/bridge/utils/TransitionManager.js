const { AFRAME, THREE } = window;
const { lerp } = THREE.MathUtils;

const destRotation = new THREE.Euler();
const destQuaternion = new THREE.Quaternion();
const destPosition = new THREE.Vector3();
const destScale = new THREE.Vector3();

const deltaRotation = new THREE.Euler();

export class TransitionManager {
  constructor(object, scene) {
    const prevRotation = new THREE.Euler();
    const prevQuaternion = new THREE.Quaternion();
    const prevPosition = new THREE.Vector3();
    const prevScale = new THREE.Vector3();

    const parentWorldRotationInitial = new THREE.Euler(); // world rotation including revolutions
    const parentWorldRotationInitialMod = new THREE.Euler(); // world rotation disregarding revolutions

    this.setParent = function (parent) {
      parent.attach(object);
      object.position.setScalar(0);
      // object.scale.setScalar(1);
      object.quaternion.identity();
    };

    this.transitionParent = async function (parent, options) {
      // detach object from parent
      scene.attach(object);

      // save target's transforms
      getWorldRotation(parent, parentWorldRotationInitial);
      parentWorldRotationInitialMod.copy(parentWorldRotationInitial)
      parentWorldRotationInitialMod.x %= (Math.PI * 2)
      parentWorldRotationInitialMod.y %= (Math.PI * 2)
      parentWorldRotationInitialMod.z %= (Math.PI * 2)

      // save current transforms
      prevPosition.copy(object.position);
      prevRotation.setFromQuaternion(object.quaternion); // discard revolutions
      prevScale.copy(object.scale);

      // transition to new parent
      const targets = { t: 0 };
      await AFRAME.ANIME({
        targets,
        t: 1,
        duration: 3000,
        easing: "linear",
        ...options,
        update: () => {
          const t = targets.t;

          getWorldRotation(parent, destRotation);

          const deltaX = destRotation.x - parentWorldRotationInitial.x;
          const deltaY = destRotation.y - parentWorldRotationInitial.y;
          const deltaZ = destRotation.z - parentWorldRotationInitial.z;

          parent.getWorldPosition(destPosition);
          // parent.getWorldScale(destScale);
          parent.getWorldQuaternion(destQuaternion);

          object.position.lerpVectors(prevPosition, destPosition, t);
          // object.scale.lerpVectors(prevScale, destScale, t);
          object.quaternion.slerp(destQuaternion, Math.pow(t, 2))
          // object.rotation.set(
          //   lerp(prevRotation.x, parentWorldRotationInitialMod.x + deltaX, t),
          //   lerp(prevRotation.y, parentWorldRotationInitialMod.y + deltaY, t),
          //   lerp(prevRotation.z, parentWorldRotationInitialMod.z + deltaZ, t)
          // );
        },
      }).finished;

      this.setParent(parent)
    };
  }
}

/*
 * @param {THREE.Object3D} object
 * @param {THREE.Euler} target
 */
function getWorldRotation(object, target) {
  target.copy(object.rotation);
  object.traverseAncestors((ancestor) => {
    target.x += ancestor.rotation.x;
    target.y += ancestor.rotation.y;
    target.z += ancestor.rotation.z;
  });
}

/*  === USAGE ===

const petal = new THREE.Group()
const emptyRandom = new THREE.Group()
const emptyFlower = new THREE.Group()

const tm = new TransitionManager(petal)
tm.setParent(emptyRandom)
tm.transitionParent(emptyFlower).then((object) => {
  console.log('animated to parent', object.parent)
})

*/
