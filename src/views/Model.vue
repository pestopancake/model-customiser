/**
feature todo:
- model selection
 - tree menu & end at a model?
- model options:
 - text
 - image
 - pattern
  - colour scheme

misc todo:
- loading overlay

Tidy up:
- pre fetch / cache assets
- vuex
- promises
- mixin / component anything?
*/
<template>
  <div id="wrapper">
    <div id="loading-overlay" v-show="isLoading">Loading</div>
    <canvas id="c"></canvas>

    <div id="ui">
      <input type="text" v-model="text" @change="setMaterial()" />
      <input
        type="color"
        id="color"
        name="color"
        v-model="selectedColour"
        @change="setMaterial()"
      />
      <button @click.prevent="setMaterial()">refresh material</button>

      <div id="colour-swatches">
        <template
          v-for="colour in ['#ff9900', '#ff0099', '#00ff99', '#0099ff', '#9900ff', '#99ff00']"
        >
          <div
            class="colour-swatch"
            :style="{ 'background-color': colour }"
            :key="colour"
            v-on:mouseover="
              selectedColour = colour;
              setMaterial();
            "
          ></div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import ThreeJSHelper from "../lib/ThreeJSHelper";

export default {
  name: "Home",
  data() {
    return {
      text: "hello world",
      selectedColour: "#ff9900",
      isLoading: true,
      activeModelPath: "/gltf/jersey1/scene.gltf",
      activeModelTexture: "/gltf/jersey1/textures/SSJersey_Outside_Lines_diffuse.jpeg",
      activeColourMap: "/gltf/jersey1/textures/colourmap.svg",
      // activeModelPath: "/gltf/tshirt1fixed/scene.gltf",
      // activeModelTexture: "/gltf/tshirt1fixed/textures/default_baseColor.png",
      // activeColourMap: "/gltf/jersey1/textures/colourmap.svg",
      activeModel: null,
      controls: null,
      renderer: null,
      camera: null,
      scene: null,
      animationFrameRequestId: null,
    };
  },
  mounted() {
    // this.reset();
    this.init();
    this.loadModel();
  },
  methods: {
    init() {
      console.log("mount ran");

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
      this.camera.zoom = 1;

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

      var dirLight2 = new THREE.DirectionalLight(0xeeeeff, 0.45);
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
      // this.controls.maxPolarAngle = Math.PI / 2;
      // this.controls.minPolarAngle = Math.PI / 2;
      this.controls.maxPolarAngle = Math.PI;
      this.controls.minPolarAngle = 0;
      this.controls.minDistance = 1;
      // this.controls.maxDistance = 3.5;
      this.controls.zoomSpeed = 0.5;
      this.controls.enableDamping = true;
      this.controls.enablePan = false;
      this.controls.dampingFactor = 0.1;
      this.controls.autoRotate = false;
      this.controls.autoRotateSpeed = 8;

      this.animate();
    },
    loadModel(modelPath = null) {
      if (modelPath) this.activeModelPath = modelPath;
      if (!this.activeModelPath) return false;
      var vm = this;

      var loader = new GLTFLoader();

      loader.load(
        this.activeModelPath,
        function (gltf) {
          console.log(gltf);
          vm.activeModel = gltf.scene;

          vm.activeModel.traverse((o) => {
            if (o.isMesh) {
              o.castShadow = true;
              o.receiveShadow = true;
              // o.geometry.center();
            }
          });

          // Set the models initial scale
          // vm.activeModel.scale.set(2, 2, 2);

          var bbox = new THREE.Box3().setFromObject(vm.activeModel);
          var scale = 1 / (bbox.max.x - bbox.min.x);
          // console.log(scale);
          // var scale = 0.001;
          console.log(scale)
          vm.activeModel.scale.set(scale,scale,scale);
          // theModel.rotation.y = Math.PI; // to rotate 180

          // Offset the y position a bit
          vm.activeModel.position.y = 0;
          // vm.activeModel.position.z = -1;

          // Add the model to the scene
          vm.scene.add(vm.activeModel);

          // Remove the loader
          vm.isLoading = false;

          vm.setMaterial();
        },
        undefined,
        function (error) {
          console.error(error);
        }
      );
    },
    setMaterial() {
      var vm = this;
      let color = {
        canvas: true,
        color: "ff9900",
        shininess: 50,
      };

      var new_mtl;

      var canvas = document.createElement("canvas");
      canvas.id = "texturecanvas";
      canvas.style.position = "fixed";
      canvas.style.top = "0";
      canvas.style.right = "0";
      var context = canvas.getContext("2d");
      var texture = new THREE.Texture(canvas);
      var texture2;
      // texture.rotation = -0.8;
      // texture.repeat.set(1,1,1);
      // texture.wrapS = THREE.RepeatWrapping;
      // texture.wrapT = THREE.RepeatWrapping;
      texture.flipY = 0;
      texture.flipX = 0;

      var imageObj = new Image();
      imageObj.src = this.activeModelTexture;
      imageObj.onload = function () {
        canvas.width = imageObj.width;
        canvas.height = imageObj.height;

        context.drawImage(
          imageObj,
          0,
          0,
          imageObj.width,
          imageObj.height,
          0,
          0,
          canvas.width,
          canvas.height
        );

        //flip the context to draw assets bellow upside down

        // context.restore();
        texture.needsUpdate = true;

        fetch(vm.activeColourMap)
          .then((response) => response.text())
          .then(function (svgStr) {
            // var svgobj = SVG(svgStr);
            // console.log(svgobj);
            svgStr = svgStr.replace("#ff9900", vm.selectedColour);

            var imgObj3 = new Image();
            // imgObj3.src = 'models/grape_ride_20_ssjersey_ss_jersey_line/textures/colourmap.svg';
            imgObj3.src =
              "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgStr);
            texture2 = new THREE.Texture(
              "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgStr)
            );
            texture2.needsUpdate = true;
            imgObj3.onload = function () {
              context.drawImage(imgObj3, 0, 0);

              context.translate(0, canvas.height); //location on the canvas to draw your sprite, this is important.
              context.scale(1, -1); //This does your mirroring/flipping

              var imgObj2 = new Image();
              imgObj2.src = "img/pattern_.jpg";
              imgObj2.onload = function () {
                context.drawImage(imgObj2, 1200, 650, 200, 200);

                //test writing text
                context.font = "24px Arial";
                context.fillStyle = "red";
                context.fillText(vm.text, 1200, 600);
                texture.needsUpdate = true;

                new_mtl = new THREE.MeshPhongMaterial({
                  map: texture,
                  shininess: color.shininess ? color.shininess : 10,
                });

                vm.replaceMaterial(new_mtl);
              };

              // dev: to see canvas
              // var dataURL = canvas.toDataURL();
              // document.getElementById("canvaspreview").src = dataURL;
            };
          });
      };

      // var body = document.getElementsByTagName("body")[0];
      // body.appendChild(canvas);
    },
    replaceMaterial(newMaterial) {
      this.activeModel.traverse((o) => {
        if (o.isMesh && o.name != null) {
          if (o.name == "mainmesh") {
            o.material = newMaterial;
          }
        }
      });
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

      if (ThreeJSHelper.resizeRendererToDisplaySize(this.renderer)) {
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
  beforeDestroy() {
    console.log("destroying");
    this.reset();
  },
};
</script>
<style lang="scss" scoped>
#wrapper{
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: block;
  position: fixed;
}
#ui {
  border-top: 5px solid #d0d0d0;
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.colour-swatch {
  width: 20px;
  height: 20px;
  display: inline-block;
}
</style>