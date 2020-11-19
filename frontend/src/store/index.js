/**
 * todo:
 * don't reset everything to change model, just remove existing model
 */

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
    activeMaterial: null,
    // config
    models: [
      {
        id: 1,
        displayName: 'Test Low Poly',
        activeModelPath: "/gltf/low/LowPolyShirt.gltf",
        activeModelTexture: "/gltf/low/lowpoly.png",
        activeColourMap: "/gltf/low/lowdesign.svg",
        // activeColourMap: "/gltf/low/UV_Map_SVG_Export.svg",
      },
      {
        id: 2,
        displayName: 'Jersey',
        activeModelPath: "/gltf/jersey1/scene.gltf",
        activeModelTexture: "/gltf/jersey1/textures/SSJersey_Outside_Lines_diffuse.jpeg",
        activeColourMap: "/gltf/jersey1/textures/colourmap.svg",
      },
      // {
      //   id: 2,
      //   displayName: 'T-Shirt',
      //   activeModelPath: "/gltf/tshirt1fixed/scene.gltf",
      //   activeModelTexture: "/gltf/tshirt1fixed/textures/default_baseColor.png",
      //   activeColourMap: "/gltf/tshirt1fixed/textures/colourmap.svg",
      // }
    ],
    text: "hello world",
    selectedColour: "#ff9900",
    // activeModelPath: "/gltf/jersey1/scene.gltf",
    // activeModelTexture: "/gltf/jersey1/textures/SSJersey_Outside_Lines_diffuse.jpeg",
    // activeColourMap: "/gltf/jersey1/textures/colourmap.svg",
    activeModelPath: "/gltf/low/LowPolyShirt.gltf",
    activeModelTexture: "/gltf/low/lowpoly.png",
    activeColourMap: "/gltf/low/lowdesign.svg",
    // activeModelPath: "/gltf/tshirt1fixed/scene.gltf",
    // activeModelTexture: "/gltf/tshirt1fixed/textures/default_baseColor.png",
    // activeColourMap: "/gltf/tshirt1fixed/textures/colourmap.svg",
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
    reset(store) {
      store.isLoading = false;
      store.isInitiated = false;
      store.isInitiating = false;
      // if(this.activeModel) this.activeModel.dispose();
      while (store.scene && store.scene.children.length > 0) {
        store.scene.remove(store.scene.children[0]);
      }
      // if (store.animationFrameRequestId) {
      //   window.cancelAnimationFrame(store.animationFrameRequestId);
      // }
      if (store.renderer) {
        store.renderer.renderLists.dispose();
        store.renderer.dispose();
      }
      if (store.controls) store.controls.dispose();
      store.activeModel = null;
      store.renderer = null;
      store.controls = null;
      store.camera = null;
      store.scene = null;
    },
    clearScene(store) {
      console.log(store.scene.children);
      // while (store.scene && store.scene.children.length > 0) {
      //   store.scene.remove(store.scene.children[0]);
      // }
    }
  },
  actions: {
    selectModel({ state }, model) {
      state.activeModelPath = model.activeModelPath;
      state.activeModelTexture = model.activeModelTexture;
      state.activeColourMap = model.activeColourMap;
      this.commit('reset');
      this.dispatch('init');
    },
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

      // this.dispatch("loadModel");

      window.animate();

      state.isLoading = false;
      state.isInitiating = false;
      state.isInitiated = true;
    },
    loadModel({ state }) {
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
    async setMaterial({ state }) {
      state.isLoadingSoft = true;
      var vm = this;

      var canvas = document.getElementById("texturecanvas");
      var context = canvas.getContext("2d");

      // var activeModelTextureResponse = await fetch(state.activeModelTexture);
      // var activeModelImg = await activeModelTextureResponse.text();

      var imageObj = new Image();
      let imgpromise = window.onload2promise(imageObj);
      imageObj.src = state.activeModelTexture;
      await imgpromise;
      
      canvas.width = imageObj.width;
      canvas.height = imageObj.height;

      // context.translate(canvas.width, 0); //location on the canvas to draw your sprite, this is important.
      // context.scale(-1, 1); //This does your mirroring/flipping

      //draw the original texture onto the canvas
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

      // context.restore();

      var activeColourMapImgResponse = await fetch(state.activeColourMap);
      var svgStr = await activeColourMapImgResponse.text();
      
      // todo: svg - replace colours by class not regex
      svgStr = svgStr.replace(/#ff9900/gi, state.selectedColour);
      var imgObj3 = new Image();
      // imgObj3.src = 'models/grape_ride_20_ssjersey_ss_jersey_line/textures/colourmap.svg';
      
      imgpromise = window.onload2promise(imgObj3);
      imgObj3.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgStr);
      await imgpromise;
      
      context.drawImage(imgObj3, 0, 0);

      // flip Y
      // context.translate(0, canvas.height); //location on the canvas to draw your sprite, this is important.
      // context.scale(1, -1); //This does your mirroring/flipping
      // flip X
      context.translate(canvas.width, 0); //location on the canvas to draw your sprite, this is important.
      context.scale(-1, 1); //This does your mirroring/flipping

      var imgObj2 = new Image();
      imgpromise = window.onload2promise(imgObj2);
      imgObj2.src = "img/logo.svg";
      await imgpromise;
      
      context.drawImage(imgObj2, 850, 100, 200, 200);

      //test writing text
      context.font = "42px Arial";
      context.fillStyle = "black";
      context.fillText(state.text, 850, 350);

      state.isLoadingSoft = false;
      vm.dispatch('refreshDesign');
    
    },
    refreshDesign({ state }) {
      var canvas = document.getElementById("texturecanvas");
      var texture = new THREE.Texture(canvas);
      // texture.rotation = -0.8;
      // texture.repeat.set(1,1,1);
      // texture.wrapS = THREE.RepeatWrapping;
      // texture.wrapT = THREE.RepeatWrapping;
      texture.flipY = 0;
      // texture.wrapS = THREE.RepeatWrapping;
      // texture.repeat.x = -1;
      texture.needsUpdate = true;

      if (!state.activeMaterial) {
        // var normalTexture = new THREE.TextureLoader().load('/gltf/low/normal map.jpg');
        state.activeMaterial = new THREE.MeshPhongMaterial({
          map: texture,
          // normalMap: normalTexture,
          shininess: 100,
          side: THREE.DoubleSide
        });
        state.activeModel.traverse((o) => {
          if (o.isMesh && o.name != null) {
            if (o.name == "mainmesh") {
              o.material = state.activeMaterial;
            }
          }
        });
      } else {
        state.activeMaterial.map = texture
      }
      
    },
  },
  modules: {
  }
})
