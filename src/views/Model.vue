/**
todo:
- loading overlay
- model selection
 - tree menu & end at a model?
- model options:
 - text
 - image
 - pattern
  - colour scheme
*/
<template>
  <div class="model">
    <button @click.prevent="init()">init</button>
    <div id="loading-overlay" v-show="isLoading">Loading</div>
    <canvas id="c"></canvas>
  </div>
</template>
<style scoped>
#c {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: block;
  position: fixed;
  z-index: -1;
}
</style>
<script>
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default {
  name: "Home",
  data() {
    return {
      isLoading: true,
      activeModelPath: "/gltf/jersey1/scene.gltf",
      activeModel: null,
      controls: null,
      renderer: null,
      camera: null,
      scene: null,
      animationFrameRequestId: null,
    };
  },
  mounted() {
    this.init();
    this.loadModel();
  },
  methods: {
    init() {
      console.log("mount ran");

      // this.reset();

      const BACKGROUND_COLOR = 0xf1f1f1;
      // Init the scene
      this.scene = new THREE.Scene();
      // Set background
      this.scene.background = new THREE.Color(BACKGROUND_COLOR);
      this.scene.fog = new THREE.Fog(BACKGROUND_COLOR, 6, 20);

      const canvas = document.querySelector("#c");

      // Init the renderer
      this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
      this.renderer.setClearColor(0xff9900);

      this.renderer.shadowMap.enabled = false;
      this.renderer.setPixelRatio(window.devicePixelRatio);

      var cameraFar = 2;

      // document.body.appendChild(this.renderer.domElement);
      canvas.replaceWith(this.renderer.domElement);

      // Add a camerra
      this.camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      this.camera.position.z = cameraFar;
      this.camera.position.x = 0;

      // Add lights
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

      var dirLight2 = new THREE.DirectionalLight(0xeeeeff, 0.2);
      dirLight2.position.set(8, 12, 8);
      dirLight2.castShadow = true;
      dirLight2.shadow.mapSize = new THREE.Vector2(1024, 1024);
      // Add directional Light to scene
      this.scene.add(dirLight2);

      // Floor
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

      // Add controls
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.maxPolarAngle = Math.PI;
      this.controls.minPolarAngle = 0;
      this.controls.enableDamping = true;
      this.controls.enablePan = false;
      this.controls.dampingFactor = 0.1;
      this.controls.autoRotate = false; // Toggle this if you'd like the chair to automatically rotate
      this.controls.autoRotateSpeed = 0.2; // 30

      this.animate();
    },
    loadModel(modelPath = null){
      if(modelPath) this.activeModelPath = modelPath;
      if(!this.activeModelPath) return false;
      var vm = this;

      var loader = new GLTFLoader();

      loader.load(
        this.activeModelPath,
        function (gltf) {
          vm.activeModel = gltf.scene;

          vm.activeModel.traverse((o) => {
            if (o.isMesh) {
              o.castShadow = true;
              o.receiveShadow = true;
            }
          });

          // Set the models initial scale
          vm.activeModel.scale.set(2, 2, 2);
          // theModel.rotation.y = Math.PI; // to rotate 180

          // Offset the y position a bit
          vm.activeModel.position.y = 0;

          // Add the model to the scene
          vm.scene.add(vm.activeModel);

          // Remove the loader
          vm.isLoading = false;
        },
        undefined,
        function (error) {
          console.error(error);
        }
      );
    },
    reset() {
      this.isLoading = true;
      // if(this.activeModel) this.activeModel.dispose();
      while (this.scene && this.scene.children.length > 0) {
        this.scene.remove(this.scene.children[0]);
      }
      if (this.animationFrameRequestId) {
        window.cancelAnimationFrame(this.animationFrameRequestId);
      }
      if (this.renderer) {
        this.renderer.renderLists.dispose();
        this.renderer.dispose();
      }
      if (this.controls) this.controls.dispose();
      this.activeModel = null;
      this.renderer = null;
      this.controls = null;
      this.camera = null;
      this.scene = null;
    },
    animate() {
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
      this.animationFrameRequestId = requestAnimationFrame(this.animate);

      if (this.resizeRendererToDisplaySize(this.renderer)) {
        const canvas = this.renderer.domElement;
        this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
        this.camera.updateProjectionMatrix();
      }

      // if (theModel != null && loaded == false) {
      //   initialRotation();
      //   DRAG_NOTICE.classList.add("start");
      // }
    },
    resizeRendererToDisplaySize() {
      const canvas = this.renderer.domElement;
      var width = window.innerWidth;
      var height = window.innerHeight;
      var canvasPixelWidth = canvas.width / window.devicePixelRatio;
      var canvasPixelHeight = canvas.height / window.devicePixelRatio;

      const needResize =
        canvasPixelWidth !== width || canvasPixelHeight !== height;
      if (needResize) {
        this.renderer.setSize(width, height, false);
      }
      return needResize;
    },
  },
  beforeDestroy(){
    console.log('destroying');
    this.reset();
  }
};
</script>
