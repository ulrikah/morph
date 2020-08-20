import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Mesh,
  SphereGeometry,
  DirectionalLight,
  MeshPhongMaterial
} from 'three'
import createCanvas from './utils/createCanvas'

const main = () => {
  const canvas = createCanvas(window.innerWidth / 2, window.innerHeight / 2)

  const renderer = new WebGLRenderer({ canvas })

  const fov = 75
  const aspect = 2 // the canvas default
  const near = 0.1
  const far = 5
  const camera = new PerspectiveCamera(fov, aspect, near, far)
  camera.position.z = 2

  const scene = new Scene()

  const sphere = createSphere()
  sphere.position.x = 0
  sphere.position.y = 0
  sphere.position.z = 0

  const color = 0xFFFFFF
  const intensity = 1
  const light = new DirectionalLight(color, intensity)
  light.position.set(-1, 2, 4)

  scene.add(light)
  scene.add(sphere)

  const render = (time : number) => {
    time *= 0.001 // convert time to seconds
    renderer.render(scene, camera)
    requestAnimationFrame(render)

    const rotation = time * 0.1
    sphere.rotation.x = rotation
    sphere.rotation.y = rotation
    sphere.position.x = Math.sin(time) // Math.random() > .5 ? time * 0.01 : -1 * time * 0.01
  }
  requestAnimationFrame(render)
}

const createSphere = () => {
  var geometry = new SphereGeometry(0.5, 32, 32)
  var material = new MeshPhongMaterial({ color: 0xff00ee })
  var sphere = new Mesh(geometry, material)
  return sphere
}

export default main
