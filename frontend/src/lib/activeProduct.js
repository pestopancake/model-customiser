import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const pica = require('pica')();

import store from '@/store'
import threeJsScene from '@/lib/threeJsScene';
import assets from '@/lib/assets';
import generic from '@/lib/generic';

export default {
  activeModel: null,
  activeMaterial: null,
  activeTexture: null,
  async loadModel() {
    if (!store.state.activeProduct || !store.state.activeProduct.modelPath) return false;

    store.state.isLoading = true;

    var loader = new GLTFLoader();
    var gltf = await loader.loadAsync(store.state.activeProduct.modelPath, undefined);

    this.activeModel = gltf.scene;

    // this.activeModel.traverse((o) => {
    //   if (o.isMesh) {
    //     o.castShadow = true;
    //     o.receiveShadow = true;
    //     // o.geometry.center();
    //   }
    // });

    // scale model to fit
    var bbox = new THREE.Box3().setFromObject(this.activeModel);
    var scale = 1 / (bbox.max.x - bbox.min.x);
    this.activeModel.scale.set(scale, scale, scale);

    // rotate model
    // theModel.rotation.y = Math.PI; // to rotate 180

    // Offset the position
    // this.activeModel.position.y = 0;
    // vm.activeModel.position.z = -1;

    // Add the model to the scene
    threeJsScene.scene.add(this.activeModel);

    store.state.isLoading = false;

    await this.setMaterial();
  },
  async setMaterial() {
    if (!store.state.activeProduct) throw "no product selected";
    if (store.state.isLoading) throw "already loading";
    store.state.isLoadingSoft = true;
    var vm = this;
    let imgpromise;

    var canvas = document.getElementById("texturecanvas");
    var resizeCanvas = document.getElementById("resizecanvas");
    var context = canvas.getContext("2d");

    var imageObj = await assets.getImage(store.state.activeProduct.modelTexturePath);

    // var imageObj = new Image();
    // let imgpromise = generic.onload2promise(imageObj);
    // imageObj.src = store.state.activeProduct.modelTexturePath;
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

    let designPath = store.state.activeProduct.selectedDesign ? store.state.activeProduct.selectedDesign.path : store.state.activeProduct.designs[0].path;
    var svgStr = await assets.get(designPath);

    if(store.state.activeProduct.colours){
      for (let colourPlacement of store.state.activeProduct.colours) {
        let colour = colourPlacement.selectedColour || colourPlacement.defaultColour;
        if (store.state.activeProduct.selectedColourPlacement &&
          colourPlacement.displayName === store.state.activeProduct.selectedColourPlacement.displayName) {
          if (store.state.hoverColour) {
            colour = store.state.hoverColour
          }
        }
        svgStr = svgStr.replace(new RegExp(colourPlacement.colourMap, "gi"), colour);
      }
    }

    var imgObj3 = new Image();

    imgpromise = generic.onload2promise(imgObj3);
    imgObj3.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgStr);
    await imgpromise;

    context.drawImage(imgObj3, 0, 0);

    // flip Y
    // context.translate(0, canvas.height); //location on the canvas to draw your sprite, this is important.
    // context.scale(1, -1); //This does your mirroring/flipping
    // flip X
    // context.translate(canvas.width, 0); //location on the canvas to draw your sprite, this is important.
    // context.scale(-1, 1); //This does your mirroring/flipping

    if (store.state.activeProduct.imageElements) {
      for (let imageElement of store.state.activeProduct.imageElements) {
        if (!imageElement.value) continue;
        // reader.onload = e => console.log(e.target.result);
        let imgData = await generic.readFileAsync(imageElement.value);
        let img = new Image();
        imgpromise = generic.onload2promise(img);
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
        imgpromise = generic.onload2promise(imgResized);
        imgResized.src = resizeCanvas.toDataURL();
        await imgpromise;
        context.drawImage(imgResized, imageElement.position.x, imageElement.position.y);
      }
    }

    // text elements
    context.font = "42px Arial";
    if (store.state.activeProduct.textElements) {
      for (let textElement of store.state.activeProduct.textElements) {
        context.fillText(textElement.value, textElement.position.x, textElement.position.y);
      }
    }

    await this.refreshDesign();
  },
  async refreshDesign() {
    if (!this.activeTexture) {
      var canvas = document.getElementById("texturecanvas");
      this.activeTexture = new THREE.CanvasTexture(canvas);
      this.activeTexture.flipY = 0;
      // texture.repeat.set(1,1,1);
      // texture.repeat.x = -1;
      // texture.wrapS = THREE.RepeatWrapping;
      // texture.wrapT = THREE.RepeatWrapping;
    }
    this.activeTexture.needsUpdate = true;

    if (!this.activeMaterial) {
      var normalTexture = new THREE.TextureLoader().load('/gltf/low/normal map.jpg');
      this.activeMaterial = new THREE.MeshPhongMaterial({
        map: this.activeTexture,
        normalMap: normalTexture,
        //normalMapType: THREE.TangentSpaceNormalMap,
        // roughness: 0.4,
        // metalness: 0.2,
        normalScale: new THREE.Vector2(0.05, 0.05),
        shininess: 50,
        side: THREE.DoubleSide
      });
      this.activeModel.traverse((o) => {
        if (o.isMesh && o.name != null) {
          if (o.name == "mainmesh") {
            o.material = this.activeMaterial;
          }
        }
      });
    }
    await generic.sleep(100); // give it some time to render (throttles colour change on hover)
    store.state.isLoadingSoft = false;
  },
}