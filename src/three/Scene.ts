import * as THREE from "three";
import { EventConnector } from "../event/EventConnector";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Floor } from "./Floor";

class Scene {
  mesh: THREE.Mesh<
    THREE.BoxGeometry,
    THREE.MeshNormalMaterial,
    THREE.Object3DEventMap
  >;
  rotation: { x: number; y: number; z: number };
  location: { x: number; y: number; z: number };
  constructor() {
    this.mesh = new THREE.Mesh();

    this.init();
    this.rotation = {
      x: 0,
      y: 0,
      z: 0,
    };
    this.location = {
      x: 0,
      y: 0,
      z: 0,
    };
    const event = new EventConnector();
    event.receive("value:location", this.getLocation.bind(this));
    event.receive("value:rotation", this.getRotation.bind(this));
  }

  getLocation(e: any) {
    const devide = 10;
    this.location.x = e.detail.x / devide;
    this.location.y = e.detail.y / devide;
    this.location.z = e.detail.z / devide;
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

    const path = new THREE.Object3D();
    scene.add(path);

    // this.mesh = new THREE.Mesh(geometry, material);
    // scene.add(this.mesh);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 3.3);
    directionalLight.position.set(-1, 10, -1);
    directionalLight.target.position.set(0, 0, 0);
    directionalLight.castShadow = true;

    const hemiLight = new THREE.HemisphereLight(0x707070, 0x444444);
    hemiLight.position.set(0, 120, 0);
    scene.add(hemiLight);

    scene.add(directionalLight);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.xr.enabled = true;

    new Floor(scene);

    const controls = new OrbitControls(camera, renderer.domElement);

    document.body.appendChild(renderer.domElement);

    setInterval(() => {
      const scale = 0.004;
      const pathGeometry = new THREE.BoxGeometry(scale, scale, scale);
      const pathMaterial = new THREE.MeshStandardMaterial({ color: 0x3dff57 });

      const mesh = new THREE.Mesh(pathGeometry, pathMaterial);
      mesh.position.set(this.location.x, this.location.y, this.location.z);
      path.add(mesh);
    }, 100);

    const animation = (time: number) => {
      // this.mesh.rotation.x = this.rotation.x;
      // this.mesh.rotation.y = this.rotation.y;
      // this.mesh.rotation.z = this.rotation.z;

      // this.mesh.position.set(this.location.x, this.location.y, this.location.z);

      renderer.render(scene, camera);
    };

    renderer.setAnimationLoop(animation);
  }
}

export { Scene };
