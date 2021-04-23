import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import store from '@/store'
import activeProduct from '@/lib/activeProduct';

export default {
  backgroundColour: '#f1f1f1',
  init() {
    if (store.state.isInitiated || store.state.isInitiating) {
      throw 'state already instantiated or in-progress';
    }

    store.state.isLoading = true;
    store.state.isInitiating = true;

    this.createScene();

    this.createRenderer();

    this.createCamera();

    this.createLights();

    this.createFloor();

    this.createCameraControls();

    this.animate();

    store.state.isLoading = false;
    store.state.isInitiating = false;
    store.state.isInitiated = true;
  },
  createScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.backgroundColour);
    this.scene.fog = new THREE.Fog(this.backgroundColour, 1, 20);
  },
  clearScene() {
    if (activeProduct.activeModel) {
      this.scene.remove(activeProduct.activeModel);
    }
    if (activeProduct.activeMaterial) {
      activeProduct.activeMaterial.dispose();
    }
    activeProduct.activeModel = null;
    activeProduct.activeMaterial = null;
  },
  createRenderer() {
    const canvas = document.querySelector("#c");
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setClearColor(0xff9900);
    this.renderer.shadowMap.enabled = false;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    // document.body.appendChild(state.renderer.domElement);
    canvas.replaceWith(this.renderer.domElement);
  },
  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.z = 2;
    this.camera.position.x = 0;
    this.camera.zoom = 1.2;
  },
  createLights() {
    var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
    hemiLight.position.set(0, 50, 0);
    // Add hemisphere light to scene
    this.scene.add(hemiLight);

    var dirLight = new THREE.DirectionalLight(0xeeeeff, 0.45);
    dirLight.position.set(-8, 12, 8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
    // Add directional Light to scene
    this.scene.add(dirLight);

    var dirLight2 = new THREE.DirectionalLight(0xeeeeff, 0.45);
    dirLight2.position.set(8, 12, 8);
    dirLight2.castShadow = true;
    dirLight2.shadow.mapSize = new THREE.Vector2(1024, 1024);
    // Add directional Light to scene
    this.scene.add(dirLight2);
  },
  createFloor() {
    var floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
    var floorMaterial = new THREE.MeshPhongMaterial({
      color: 0xdddddd,
      shininess: 0,
    });
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -0.5 * Math.PI;
    floor.receiveShadow = true;
    floor.position.y = -1;
    this.scene.add(floor);
  },
  createCameraControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.maxPolarAngle = Math.PI / 2;
    this.controls.minPolarAngle = Math.PI / 2;
    // this.controls.maxPolarAngle = Math.PI;
    // this.controls.minPolarAngle = 0;
    this.controls.minDistance = 1;
    this.controls.maxDistance = 3.5;
    this.controls.zoomSpeed = 1;
    this.controls.enableDamping = true;
    this.controls.enablePan = false;
    this.controls.dampingFactor = 0.06;
    this.controls.autoRotate = false;
    this.controls.autoRotateSpeed = 3;
  },
  animate() {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    window.animationFrameRequestId = requestAnimationFrame(() => this.animate());
    if (this.resizeRendererToDisplaySize(this.renderer)) {
      const canvas = this.renderer.domElement;
      this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
      this.camera.updateProjectionMatrix();
    }
  },
  resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    var width = window.innerWidth;
    var height = window.innerHeight;
    var canvasPixelWidth = canvas.width / window.devicePixelRatio;
    var canvasPixelHeight = canvas.height / window.devicePixelRatio;

    const needResize =
      canvasPixelWidth !== width || canvasPixelHeight !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  },
}