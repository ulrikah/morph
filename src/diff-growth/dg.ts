import CameraControls from "camera-controls";
import * as THREE from "three";
import createCanvas from "../utils/createCanvas";
import { random } from "../utils/random";

CameraControls.install({ THREE: THREE });

/*

Begin with a set of nodes connected in a chain-like fashion to form a path (or multiple paths). Each node should have a
 maximum of two neighbors (one preceding, one following).
In each tick of the simulation, for each node:
Move node towards it's connected neighbor nodes (attraction).
If node gets too close to any nearby nodes (connected or not), move it away from them (repulsion).
Move node towards the midpoint of an imaginary line between it's preceding and following nodes (alignment). It wants to rest equidistance between them with as little deflection as possible.
In each tick of the simulation, evaluate the distances between each pair of connected nodes. If too great, insert a new node between them (adaptive subdivision).
At some interval, insert new nodes in the chain to over-constrain the system and induce growth. The bends and undulations that emerge are a result of the system trying to equalize the forces using the rules defined in step 2.

*/

class Node {
    body: THREE.Mesh;
    constructor(
        position: THREE.Vector3,
        geometry: THREE.BufferGeometry,
        material: THREE.Material
    ) {
        this.body = new THREE.Mesh(geometry, material);
        this.body.position.x = position.x;
        this.body.position.y = position.y;
        this.body.position.z = position.z;
    }

    attract = (neighbors: Node[], force: number) => {
        neighbors.forEach((neighborNode: Node) =>
            this.body.position.lerp(neighborNode.body.position, force)
        );
    };
    repulse = (neighbors: Node[], distanceThreshold: number, force: number) => {
        neighbors.forEach((neighborNode: Node) => {
            const distanceTo = this.body.position.distanceTo(
                neighborNode.body.position
            );
            if (distanceTo < distanceThreshold) {
                this.body.position.lerp(
                    neighborNode.body.position.clone().negate(),
                    force
                );
            }
        });
    };

    align = (neighbors: Node[], force: number) => {
        if (neighbors.length == 2) {
            const a = neighbors[0].body.position.clone();
            const b = neighbors[1].body.position.clone();
            const midPoint = a.add(b).divideScalar(2);
            this.body.position.lerp(midPoint, force);
        }
    };
}

class Chain {
    nodes: Node[];
    worldScale: number;
    geometry: THREE.BufferGeometry;
    material: THREE.Material;
    force: number;
    nodeRadius: number;
    constructor(nNodes: number) {
        this.nodes = [];
        this.worldScale = 0.5;
        this.force = 0.01;
        this.nodeRadius = 0.1;
        // TODO: make the visual part disconnected from the growth algorithm
        this.geometry = new THREE.SphereBufferGeometry(this.nodeRadius, 32, 32);
        this.material = new THREE.MeshToonMaterial({ color: 0xce214a });
        const scale = 5;
        for (let i = 0; i < nNodes; i++) {
            const deg = (i * 180.0) / Math.PI;
            const x = Math.sin(deg) * scale;
            const z = random(-10, 10);
            const y = Math.cos(deg) * scale;
            const position = new THREE.Vector3(x, y, z);
            this.nodes.push(this.createNode(position));
        }
    }

    createNode = (
        position: THREE.Vector3,
        geometry = this.geometry,
        material = this.material
    ) => {
        return new Node(position, geometry, material);
    };

    getNeighbors = (index: number): Node[] => {
        let neighbors: Node[];
        if (index == 0) {
            neighbors = [this.nodes[index + 1]];
        } else if (index == this.nodes.length - 1) {
            neighbors = [this.nodes[index - 1]];
        } else {
            neighbors = [this.nodes[index - 1], this.nodes[index + 1]];
        }
        return neighbors;
    };

    adaptiveSubdivision = (threshold: number) => {
        const originalNodes: Node[] = [...this.nodes];
        const newNodes: Node[] = [];

        originalNodes.forEach((node) => {
            // need to re-index since this.nodes may have increased
            const idx = this.nodes.indexOf(node);
            const neighbors = this.getNeighbors(idx);
            neighbors.forEach((neighborNode) => {
                const distance = node.body.position.distanceTo(
                    neighborNode.body.position
                );
                if (distance > threshold) {
                    const a = node.body.position.clone();
                    const b = neighborNode.body.position.clone();
                    const midPoint = a.add(b).divideScalar(2);
                    const newNode = this.createNode(midPoint);
                    newNodes.push(newNode);
                    this.nodes.splice(idx, 0, newNode);
                }
            });
        });
        return newNodes;
    };

    step = () => {
        this.nodes.forEach((node, i) => {
            const neighbors = this.getNeighbors(i);
            node.attract(neighbors, this.force);
            node.repulse(neighbors, this.nodeRadius * 3, this.force * 30);
            node.align(neighbors, this.force);
        });
        // add new nodes if distance between two neighbors is too large
        const newNodes: Node[] = [];

        // adaptive subdivision
        newNodes.push(...this.adaptiveSubdivision(10));

        // TODO:
        // insert new nodes in the chain to over-constrain the system and induce growth
        // newNodes.push(...this.overConstrain());

        return newNodes;
    };
}

const differentialGrowth = () => {
    const canvas = createCanvas(window.innerWidth, window.innerHeight);
    const renderer = new THREE.WebGLRenderer({ canvas });

    const fov = 75;
    const aspect = 2;
    const near = 0.01;
    const far = 3000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 8;
    camera.position.y = 0;

    const clock = new THREE.Clock();
    const cameraControls = new CameraControls(camera, renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("white");

    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);

    scene.add(light);

    const chain: Chain = new Chain(1000);
    scene.add(...chain.nodes.map((node) => node.body));

    let doRender = true;
    const render = (time: number) => {
        const delta = clock.getDelta();
        cameraControls.update(delta);
        renderer.render(scene, camera);
        requestAnimationFrame(render);
        if (!doRender) {
            return;
        }
        const newNodes = chain.step();
        if (newNodes.length > 0) {
            console.log("Add ", newNodes.length);
            scene.add(...newNodes.map((node) => node.body));
        }
    };
    const pauseOnSpaceDown = () => {
        document.addEventListener("keydown", (event: KeyboardEvent) => {
            if ([" ", "Spacebar"].includes(event.key)) {
                doRender = !doRender;
            }
        });
    };
    pauseOnSpaceDown();
    requestAnimationFrame(render);
};

export default differentialGrowth;
