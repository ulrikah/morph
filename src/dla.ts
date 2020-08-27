import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  DirectionalLight,
  Vector3
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

  const speed = 0.04;
  const minDistThreshold = 3;
  const branch: Walker[] = [new Walker(speed, new Vector3(0, 0, 0))]
  const walkers : Walker[] = []
  for (let i = 0; i < 3000; i++) {
    walkers.push(new Walker(speed))
  }
  walkers.map(walker => scene.add(walker.body))

  const render = (time : number) => {
    time *= 0.001 // convert time to seconds
    renderer.render(scene, camera)
    requestAnimationFrame(render)

    walkers
      .filter(walker => walker.active)
      .map((walker) => {
        walker.walk()
        if (walker.minDistToBranch < minDistThreshold) {
          branch
            .forEach(targetWalker => {
              if (walker.collision(targetWalker)) {
                branch.push(walker.setInactive());
              }
            })
        } else {
          walker.minDistToBranch -= walker.speed; // to support the case where a walker has moved towards the branch
        }
      })
  }
  requestAnimationFrame(render)
}

export default main
