import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  DirectionalLight,
  Color
} from 'three'
import createCanvas from './utils/createCanvas'
import Walker from './dla/Walker';

const main = () => {
  const canvas = createCanvas(window.innerWidth, window.innerHeight)

  const renderer = new WebGLRenderer({ canvas })

  const fov = 75
  const aspect = 2 // the canvas default
  const near = 0.1
  const camera = new PerspectiveCamera(fov, aspect, near)
  camera.position.z = 8
  camera.position.y = 0

  const scene = new Scene()

  const color = 0xFFFFFF
  const intensity = 1
  const light = new DirectionalLight(color, intensity)
  light.position.set(-1, 2, 4)

  scene.add(light)

  const walkers : Walker[] = []
  for (let i = 0; i < 500; i++) {
    walkers.push(new Walker(0.02))
  }
  walkers.map(walker => scene.add(walker.body))

  const render = (time : number) => {
    time *= 0.001 // convert time to seconds
    renderer.render(scene, camera)
    requestAnimationFrame(render)

    walkers.map((walker, index) => {
      walker.walk()
      walkers
        .filter((_walker) => _walker !== walker)
        .forEach(targetWalker => {
          if (walker.collision(targetWalker)) {
            console.log("Collided")
            walker.body.material.color = new Color(0x22eeff)
          }
        })
    })
  }
  requestAnimationFrame(render)
}

export default main
