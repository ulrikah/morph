// eslint-disable-next-line no-unused-vars
import {
    Vector3,
    Mesh,
    SphereGeometry,
    MeshPhongMaterial,
    LineBasicMaterial,
    Material,
    MeshToonMaterial,
    PointsMaterial,
    MeshBasicMaterial,
    LineDashedMaterial,
    MeshPhysicalMaterial,
} from "three";
import { random } from "../utils/random";

const walkerRadius = 0.1;
const walkerGeometry = new SphereGeometry(walkerRadius, 32, 32);
const walkerActiveMaterial = new MeshToonMaterial({ color: 0xce214a });
const walkerInactiveMaterial = new MeshToonMaterial({ color: 0x2194ce });

class Walker {
    position: Vector3;
    speed: number;
    body: Mesh<SphereGeometry, Material>;
    active: boolean;
    minDistToBranch: number;
    constructor(
        speed = 0.01,
        position = new Vector3(random(-2, 2), random(-2, 2), random(-2, 2))
    ) {
        this.body = new Mesh(walkerGeometry, walkerActiveMaterial);
        this.body.position.x = position.x;
        this.body.position.y = position.y;
        this.body.position.z = position.z;
        this.speed = speed;
        this.active = true;
        this.minDistToBranch = 0; // used to avoid checking collisions for every frame
    }

    walk = () => {
        this.body.position.x += random(-this.speed, this.speed);
        this.body.position.y += random(-this.speed, this.speed);
        this.body.position.z += random(-this.speed, this.speed);
    };

    collision = (target: Walker) => {
        const d = this.body.position.distanceTo(target.body.position);
        const r =
            this.body.geometry.parameters.radius +
            target.body.geometry.parameters.radius +
            this.speed +
            target.speed;
        if (d < r) {
            return true;
        } else {
            this.minDistToBranch =
                d > this.minDistToBranch ? d : this.minDistToBranch;
        }
        return false;
    };

    setInactive = () => {
        this.active = false;
        this.body.material = walkerInactiveMaterial;
        return this;
    };
}

export default Walker;
