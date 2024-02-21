import * as THREE from "three";
import { EventConnector } from "../event/EventConnector";

class Scene {
  mesh:
    | THREE.Mesh<
        THREE.BoxGeometry,
        THREE.MeshNormalMaterial,
        THREE.Object3DEventMap
      >
    | any;
  rotation: { x: number; y: number; z: number };
  constructor() {
    this.init();
    this.rotation = {
      x: 0,
      y: 0,
      z: 0,
    };
    const event = new EventConnector();
    event.receive("value:location", this.getLocation);
    event.receive("value:rotation", this.getRotation.bind(this));
  }

  getLocation(e: any) {
    console.log(e);
  }

  getRotation(e: any) {
    this.rotation.x = (e.detail.y * Math.PI) / 180 || 0;
    this.rotation.y = (e.detail.z * Math.PI) / 180 || 0;
    this.rotation.z = (e.detail.x * Math.PI) / 180 || 0;
  }

  init() {
    const width = window.innerWidth,
      height = window.innerHeight;

    const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10);
    camera.position.z = 1;

    const scene = new THREE.Scene();

    const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const material = new THREE.MeshNormalMaterial();

    this.mesh = new THREE.Mesh(geometry, material);
    scene.add(this.mesh);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.xr.enabled = true;

    document.body.appendChild(renderer.domElement);

    const animation = (time: number) => {
      this.mesh.rotation.x = this.rotation.x;
      this.mesh.rotation.y = this.rotation.y;
      this.mesh.rotation.z = this.rotation.z;

      renderer.render(scene, camera);
    };

    renderer.setAnimationLoop(animation);
  }
}

export { Scene };
