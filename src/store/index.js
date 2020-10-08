import Vue from 'vue'
import Vuex from 'vuex'

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // waiting
    isInitiating: false,
    isInitiated: false,
    isLoading: false,
    isLoadingSoft: false,
    // scene config
    backgroundColour: 0xf1f1f1,
    // scene state
    scene: null,
    renderer: null,
    animationFrameRequestId: null,
    camera: null,
    controls: null,
    activeModel: null,
    // config
    text: "hello world",
    selectedColour: "#ff9900",
    // activeModelPath: "/gltf/jersey1/scene.gltf",
    // activeModelTexture: "/gltf/jersey1/textures/SSJersey_Outside_Lines_diffuse.jpeg",
    // activeColourMap: "/gltf/jersey1/textures/colourmap.svg",
    activeModelPath: "/gltf/tshirt1fixed/scene.gltf",
    activeModelTexture: "/gltf/tshirt1fixed/textures/default_baseColor.png",
    activeColourMap: "/gltf/tshirt1fixed/textures/colourmap.svg",
  },
  mutations: {
    createScene(state) {
      state.scene = new THREE.Scene();
      state.scene.background = new THREE.Color(state.backgroundColour);
      state.scene.fog = new THREE.Fog(state.backgroundColour, 6, 20);
    },
    createRenderer(state) {
      const canvas = document.querySelector("#c");
      state.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
      state.renderer.setClearColor(0xff9900);
      state.renderer.shadowMap.enabled = false;
      state.renderer.setPixelRatio(window.devicePixelRatio);
      // document.body.appendChild(state.renderer.domElement);
      canvas.replaceWith(state.renderer.domElement);
    },
    createCamera(state) {
      state.camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      state.camera.position.z = 2;
      state.camera.position.x = 0;
      state.camera.zoom = 1;
    },
    createLights(state) {
      var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
      hemiLight.position.set(0, 50, 0);
      // Add hemisphere light to scene
      state.scene.add(hemiLight);

      var dirLight = new THREE.DirectionalLight(0xeeeeff, 0.45);
      dirLight.position.set(-8, 12, 8);
      dirLight.castShadow = true;
      dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
      // Add directional Light to scene
      state.scene.add(dirLight);

      var dirLight2 = new THREE.DirectionalLight(0xeeeeff, 0.45);
      dirLight2.position.set(8, 12, 8);
      dirLight2.castShadow = true;
      dirLight2.shadow.mapSize = new THREE.Vector2(1024, 1024);
      // Add directional Light to scene
      state.scene.add(dirLight2);
    },
    createFloor(state) { 
      var floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
      var floorMaterial = new THREE.MeshPhongMaterial({
        color: 0xdddddd,
        shininess: 0,
      });
      var floor = new THREE.Mesh(floorGeometry, floorMaterial);
      floor.rotation.x = -0.5 * Math.PI;
      floor.receiveShadow = true;
      floor.position.y = -1;
      state.scene.add(floor);
    },
    createCameraControls(state) { 
      state.controls = new OrbitControls(state.camera, state.renderer.domElement);
      // state.controls.maxPolarAngle = Math.PI / 2;
      // state.controls.minPolarAngle = Math.PI / 2;
      state.controls.maxPolarAngle = Math.PI;
      state.controls.minPolarAngle = 0;
      state.controls.minDistance = 1;
      // state.controls.maxDistance = 3.5;
      state.controls.zoomSpeed = 0.5;
      state.controls.enableDamping = true;
      state.controls.enablePan = false;
      state.controls.dampingFactor = 0.1;
      state.controls.autoRotate = false;
      state.controls.autoRotateSpeed = 8;
    },
  },
  actions: {
    init({ state }) {
      if (state.isInitiated || state.isInitiating) return false;
      state.isLoading = true;
      state.isInitiating = true;

      this.commit('createScene');

      this.commit('createRenderer');

      this.commit('createCamera');

      this.commit('createLights');

      this.commit('createFloor');

      this.commit('createCameraControls');

      this.dispatch("loadDefaultModel");

      window.animate();

      state.isLoading = false;
      state.isInitiating = false;
      state.isInitiated = true;
    },
    loadDefaultModel({ state }) {
      var vm = this;

      if (!state.activeModelPath) return false;

      state.isLoading = true;

      var loader = new GLTFLoader();

      loader.load(
        state.activeModelPath,
        function (gltf) {
          state.activeModel = gltf.scene;

          // state.activeModel.traverse((o) => {
          //   if (o.isMesh) {
          //     o.castShadow = true;
          //     o.receiveShadow = true;
          //     // o.geometry.center();
          //   }
          // });

          // scale model to fit
          var bbox = new THREE.Box3().setFromObject(state.activeModel);
          var scale = 1 / (bbox.max.x - bbox.min.x);
          state.activeModel.scale.set(scale, scale, scale);

          // rotate model
          // theModel.rotation.y = Math.PI; // to rotate 180

          // Offset the position
          // state.activeModel.position.y = 0;
          // vm.activeModel.position.z = -1;

          // Add the model to the scene
          state.scene.add(state.activeModel);

          state.isLoading = false;

          vm.dispatch('setMaterial');
        },
        undefined,
        function (error) {
          console.error(error);
        }
      );
    },
    setMaterial({ state }) {
      state.isLoadingSoft = true;
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
      imageObj.src = state.activeModelTexture;
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

        fetch(state.activeColourMap)
          .then((response) => response.text())
          .then(function (svgStr) {
            // var svgobj = SVG(svgStr);
            // console.log(svgobj);
            svgStr = svgStr.replace(/#ff9900/gi, state.selectedColour);

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
                context.fillText(state.text, 1200, 600);
                texture.needsUpdate = true;

                new_mtl = new THREE.MeshPhongMaterial({
                  map: texture,
                  shininess: color.shininess ? color.shininess : 10,
                });

                state.isLoadingSoft = false;
                vm.dispatch('replaceMaterial', new_mtl);
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
    replaceMaterial({ state }, newMaterial) {
      state.activeModel.traverse((o) => {
        if (o.isMesh && o.name != null) {
          if (o.name == "mainmesh") {
            o.material = newMaterial;
          }
        }
      });
    },
    reset({ state }) {
      state.isLoading = false;
      state.isInitiated = false;
      state.isInitiating = false;
      // if(this.activeModel) this.activeModel.dispose();
      while (state.scene && state.scene.children.length > 0) {
        state.scene.remove(state.scene.children[0]);
      }
      if (state.animationFrameRequestId) {
        window.cancelAnimationFrame(state.animationFrameRequestId);
      }
      if (state.renderer) {
        state.renderer.renderLists.dispose();
        state.renderer.dispose();
      }
      if (state.controls) state.controls.dispose();
      state.activeModel = null;
      state.renderer = null;
      state.controls = null;
      state.camera = null;
      state.scene = null;
    },
  },
  modules: {
  }
})
