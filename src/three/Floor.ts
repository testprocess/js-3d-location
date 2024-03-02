import * as THREE from "three";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils";

class Floor {
  width: number;
  height: number;
  scene: THREE.Scene;
  floor:
    | THREE.Mesh<
        THREE.BufferGeometry<THREE.NormalBufferAttributes>,
        THREE.MeshBasicMaterial
      >
    | any;
  constructor(scene: THREE.Scene) {
    this.width = 60;
    this.height = 60;
    this.scene = scene;

    this.addFloorDots();
  }

  public switchShowFloor({ visible }: { visible: boolean }) {
    this.floor.visible = visible;
  }

  private addFloorDots() {
    const geometrys: THREE.BoxGeometry[] = [];

    for (let indexW = -this.width; indexW < this.width * 2; indexW++) {
      for (let indexH = -this.height; indexH < this.height * 2; indexH++) {
        const size = 0.003;
        const geometry = new THREE.BoxGeometry(size, size, size);

        geometry.translate(indexW / 10, 0, indexH / 10);
        geometrys.push(geometry);
      }
    }

    const merged = BufferGeometryUtils.mergeGeometries(geometrys);
    const material = new THREE.MeshBasicMaterial({ color: 0x888b8f });
    this.floor = new THREE.Mesh(merged, material);

    this.scene.add(this.floor);
  }
}

export { Floor };
