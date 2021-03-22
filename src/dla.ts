import * as THREE from "three";
import createCanvas from "./utils/createCanvas";
import Walker from "./dla/Walker";
import CameraControls from "camera-controls";
import { Color, MeshPhongMaterial, SphereGeometry } from "three";

CameraControls.install({ THREE: THREE });

const N_WALKERS = 1000;

const main = () => {
    const canvas = createCanvas(window.innerWidth, window.innerHeight);
    const renderer = new THREE.WebGLRenderer({ canvas });

    const fov = 75;
    const aspect = 2; // the canvas default
    const near = 0.1;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near);
    camera.position.z = 8;
    camera.position.y = 0;

    const clock = new THREE.Clock();
    const cameraControls = new CameraControls(camera, renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new Color("white");

    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);

    scene.add(light);

    const speed = 0.02;
    const minDistThreshold = 3;

    const branch: Walker[] = [new Walker(speed, new THREE.Vector3(0, 0, 0))];
    const walkers: Walker[] = [];
    for (let i = 0; i < N_WALKERS; i++) {
        walkers.push(new Walker(speed));
    }
    walkers.map((walker) => scene.add(walker.body));

    let doRender = true;
    const render = (time: number) => {
        const delta = clock.getDelta();
        cameraControls.update(delta);

        renderer.render(scene, camera);
        requestAnimationFrame(render);
        if (!doRender) {
            return;
        }

        walkers
            .filter((walker) => walker.active)
            .map((walker) => {
                walker.walk();
                if (walker.minDistToBranch < minDistThreshold) {
                    branch.forEach((targetWalker) => {
                        if (walker.collision(targetWalker)) {
                            branch.push(walker.setInactive());
                        }
                    });
                } else {
                    walker.minDistToBranch -= walker.speed;
                }
            });
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

export default main;
