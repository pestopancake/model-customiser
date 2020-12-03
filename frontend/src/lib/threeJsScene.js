import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import store from '@/store'

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
    if (store.state.activeModel) {
      this.scene.remove(store.state.activeModel);
    }
    if (store.state.activeMaterial) {
      store.state.activeMaterial.dispose();
    }
    store.state.activeModel = null;
    store.state.activeMaterial = null;
  },
  createRenderer() {
    const canvas = document.querySelector("#c");
    store.state.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    store.state.renderer.setClearColor(0xff9900);
    store.state.renderer.shadowMap.enabled = false;
    store.state.renderer.setPixelRatio(window.devicePixelRatio);
    // document.body.appendChild(state.renderer.domElement);
    canvas.replaceWith(store.state.renderer.domElement);
  },
  createCamera(state) {
    store.state.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    store.state.camera.position.z = 2;
    store.state.camera.position.x = 0;
    store.state.camera.zoom = 1;
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
    store.state.controls = new OrbitControls(store.state.camera, store.state.renderer.domElement);
    // store.state.controls.maxPolarAngle = Math.PI / 2;
    // store.state.controls.minPolarAngle = Math.PI / 2;
    store.state.controls.maxPolarAngle = Math.PI;
    store.state.controls.minPolarAngle = 0;
    store.state.controls.minDistance = 1;
    // store.state.controls.maxDistance = 3.5;
    store.state.controls.zoomSpeed = 0.5;
    store.state.controls.enableDamping = true;
    store.state.controls.enablePan = false;
    store.state.controls.dampingFactor = 0.1;
    store.state.controls.autoRotate = false;
    store.state.controls.autoRotateSpeed = 8;
  },
  animate() {
    var vm = store.state;
    vm.controls.update();
    vm.renderer.render(this.scene, vm.camera);
    window.animationFrameRequestId = requestAnimationFrame(() => this.animate());
    if (this.resizeRendererToDisplaySize(vm.renderer)) {
      const canvas = vm.renderer.domElement;
      vm.camera.aspect = canvas.clientWidth / canvas.clientHeight;
      vm.camera.updateProjectionMatrix();
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