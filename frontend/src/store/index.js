/**
 * todo:
 */

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const pica = require('pica')();

import config from './../../public/config/config.json';

var assets = {
  cache: [],
  imageCache: [],
  async get(path) {
    return this.cache[path] || this.fetch(path);
  },
  async fetch(path) {
    var response = await fetch(path);
    this.cache[path] = await response.text()
    return this.cache[path];
  },
  async getImage(path) {
    if (this.imageCache[path]) return this.imageCache[path];
    this.imageCache[path] = new Image();
    let imgpromise = window.onload2promise(this.imageCache[path]);
    this.imageCache[path].src = path;
    await imgpromise
    return this.imageCache[path];
  },
};

var sleep = function(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default new Vuex.Store({
  state: {
    // loading states
    isInitiating: false,
    isInitiated: false,
    isLoading: false,
    isLoadingSoft: false,
    // generic scene state
    scene: null,
    renderer: null,
    animationFrameRequestId: null,
    camera: null,
    controls: null,
    // generic scene config
    backgroundColour: 0xf1f1f1,
    // scene state
    activeModel: null,
    activeMaterial: null,
    activeTexture: null,
    activeProduct: null,
    // config
    config: config,
    models: [
      {
        id: 1,
        displayName: 'Test Low Poly',
        activeModelPath: "/gltf/low/LowPolyShirt.gltf",
        activeModelTexture: "/gltf/low/lowpoly.png",
        activeColourMap: "/gltf/low/lowdesign.svg",
        // activeColourMap: "/gltf/low/UV_Map_SVG_Export.svg",
      },
      // {
      //   id: 2,
      //   displayName: 'Jersey',
      //   activeModelPath: "/gltf/jersey1/scene.gltf",
      //   activeModelTexture: "/gltf/jersey1/textures/SSJersey_Outside_Lines_diffuse.jpeg",
      //   activeColourMap: "/gltf/jersey1/textures/colourmap.svg",
      // },
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
    hoverColour: null,
  },
  mutations: {
    createScene(state) {

      state.scene = new THREE.Scene();
      state.scene.background = new THREE.Color(state.backgroundColour);
      state.scene.fog = new THREE.Fog(state.backgroundColour, 1, 20);
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
    clearScene(store) {
      if (store.activeModel) {
        store.scene.remove(store.activeModel);
      }
      if (store.activeMaterial) {
        store.activeMaterial.dispose();
      }
      store.activeModel = null;
      store.activeMaterial = null;
    }
  },
  actions: {
    async init({ state }) {
      if (state.isInitiated || state.isInitiating) {
        throw 'state already instantiated or in-progress';
      }

      // var config = await (await fetch("/config/config.json")).json();
      // state.config = config;

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
    selectModel({ state }, model, force) {
      if (Number.isInteger(model)) {
        model = state.config.products.find(product => product.id === model);
      }
      if (!model) throw 'product not found';
      if (state.activeProduct && state.activeProduct.id === model.id && !force) { 
        console.log('product already selected');
        return false;
      }
      state.isLoading = true;
      this.commit('clearScene');
      state.activeProduct = model;
      this.dispatch("loadModel");
    },
    async loadModel({ state }) {
      var vm = this;

      if (!state.activeProduct || !state.activeProduct.modelPath) return false;

      state.isLoading = true;

      var loader = new GLTFLoader();
      var gltf = await loader.loadAsync(state.activeProduct.modelPath, undefined);

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
    async setMaterial({ state }) {
      if (!state.activeProduct) throw "no product selected";
      if (state.isLoading) throw "already loading";
      state.isLoadingSoft = true;
      var vm = this;
      let imgpromise;

      var canvas = document.getElementById("texturecanvas");
      var resizeCanvas = document.getElementById("resizecanvas");
      var context = canvas.getContext("2d");

      // var activeModelTextureResponse = await fetch(state.activeProduct.modelTexturePath);
      // var activeModelImg = await activeModelTextureResponse.text();

      var imageObj = await assets.getImage(state.activeProduct.modelTexturePath);

      // var imageObj = new Image();
      // let imgpromise = window.onload2promise(imageObj);
      // imageObj.src = state.activeProduct.modelTexturePath;
      // await imgpromise;

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

      let designPath = state.activeProduct.selectedDesign ? state.activeProduct.selectedDesign.path : state.activeProduct.designs[0].path;
      var svgStr = await assets.get(designPath);

      // todo: svg - replace colours by class not regex
      svgStr = svgStr.replace(/#ff9900/gi, state.hoverColour || state.selectedColour);
      var imgObj3 = new Image();

      imgpromise = window.onload2promise(imgObj3);
      imgObj3.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgStr);
      await imgpromise;

      context.drawImage(imgObj3, 0, 0);

      // flip Y
      // context.translate(0, canvas.height); //location on the canvas to draw your sprite, this is important.
      // context.scale(1, -1); //This does your mirroring/flipping
      // flip X
      // context.translate(canvas.width, 0); //location on the canvas to draw your sprite, this is important.
      // context.scale(-1, 1); //This does your mirroring/flipping

      if(state.activeProduct.imageElements){
        for (let imageElement of state.activeProduct.imageElements) {
          if (!imageElement.value) continue;
          // reader.onload = e => console.log(e.target.result);
          let imgData =  await window.readFileAsync(imageElement.value);
          let img = new Image();
          imgpromise = window.onload2promise(img);
          img.src = imgData;
          await imgpromise;

          let width = imageElement.maxWidth;
          resizeCanvas.width = width;
          resizeCanvas.height = img.height * width / img.width;
          await pica.resize(img, resizeCanvas, {
            features: ['js', 'wasm', 'cib', 'ww'],
            unsharpAmount: 80,
            unsharpRadius: 0.6,
            unsharpThreshold: 2,
            alpha: true,
          });

          var imgResized = new Image();
          imgpromise = window.onload2promise(imgResized);
          imgResized.src = resizeCanvas.toDataURL();
          await imgpromise;
          context.drawImage(imgResized, imageElement.position.x, imageElement.position.y);
        }
      }

      // text elements
      context.font = "42px Arial";
      if(state.activeProduct.textElements){
        for (let textElement of state.activeProduct.textElements) {
          context.fillText(textElement.value, textElement.position.x, textElement.position.y);
        }
      }

      vm.dispatch('refreshDesign');
    },
    async refreshDesign({ state }) {
      if (!state.activeTexture) {
        var canvas = document.getElementById("texturecanvas");
        state.activeTexture = new THREE.CanvasTexture(canvas);
        state.activeTexture.flipY = 0;
        // texture.repeat.set(1,1,1);
        // texture.repeat.x = -1;
        // texture.wrapS = THREE.RepeatWrapping;
        // texture.wrapT = THREE.RepeatWrapping;
      }
      state.activeTexture.needsUpdate = true;

      if (!state.activeMaterial) {
        var normalTexture = new THREE.TextureLoader().load('/gltf/low/normal map.jpg');
        state.activeMaterial = new THREE.MeshPhongMaterial({
          map: state.activeTexture,
          normalMap: normalTexture,
          //normalMapType: THREE.TangentSpaceNormalMap,
          // roughness: 0.4,
          // metalness: 0.2,
          normalScale: new THREE.Vector2(0.05, 0.05),
          shininess: 50,
          side: THREE.DoubleSide
        });
        state.activeModel.traverse((o) => {
          if (o.isMesh && o.name != null) {
            if (o.name == "mainmesh") {
              o.material = state.activeMaterial;
            }
          }
        });
      }
      await sleep(100); // give it some time to render (throttles colour change on hover)
      state.isLoadingSoft = false;
    },
  },
  modules: {
  }
})
