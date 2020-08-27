// eslint-disable-next-line no-unused-vars
import { Vector3, Mesh, SphereGeometry, MeshPhongMaterial } from "three";
import { random } from "../utils/random";

class Walker {
    position: Vector3;
    radius: number;
    speed: number;
    body: Mesh<SphereGeometry, MeshPhongMaterial>
    constructor (speed = 0.01, position = new Vector3(random(-2, 2), random(-2, 2), random(-2, 2)), radius = 0.1) {
      const geometry = new SphereGeometry(radius, 32, 32)
      const material = new MeshPhongMaterial({ color: 0xff22ee })
      this.body = new Mesh(geometry, material)
      this.body.position.x = position.x
      this.body.position.y = position.y
      this.body.position.z = position.z
      this.speed = speed;
    }

    walk = () => {
      this.body.position.x += random(-this.speed, this.speed)
      this.body.position.y += random(-this.speed, this.speed)
      this.body.position.z += random(-this.speed, this.speed)
    }

    collision = (target : Walker) => {
      const d = this.body.position.distanceTo(target.body.position)
      const r = this.body.geometry.parameters.radius + target.body.geometry.parameters.radius + this.speed + target.speed
      if (d < r) {
        return true
      }
      return false
    }
}

export default Walker;
