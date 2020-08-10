import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Mesh,
  BoxGeometry,
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

  const cubes = [
    createCube(0x44aa88, 0, 1.0),
    createCube(0x8844aa, -2, 1.3),
    createCube(0xaa8844, 2, 0.3)
  ]

  const color = 0xFFFFFF
  const intensity = 1
  const light = new DirectionalLight(color, intensity)
  light.position.set(-1, 2, 4)

  scene.add(light)
  cubes.forEach((cube) => scene.add(cube))

  const render = (time : number) => {
    time *= 0.001 // convert time to seconds

    cubes.forEach((cube, ndx) => {
      const speed = 1 + ndx * 0.1
      const rotation = time * speed
      cube.rotation.x = rotation
      cube.rotation.y = rotation
    })

    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}

const createCube = (color : number, x : number, scale = 1.0) => {
  const geometry = new BoxGeometry(scale, scale, scale)
  const material = new MeshPhongMaterial({ color })
  const cube = new Mesh(geometry, material)
  cube.position.x = x
  return cube
}

export default main
