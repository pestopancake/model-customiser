/**
 * todo:
 * get config based on env (for multiple clients)
 * loading overlay
 * save quote
 * load a saved quote
 */

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import * as THREE from "three";

import config from '@/config/config.json';
import threeJsScene from '@/lib/threeJsScene';
import activeProduct from '@/lib/activeProduct';
import generic from '@/lib/generic';

export default new Vuex.Store({
  state: {
    // loading states
    isInitiating: false,
    isInitiated: false,
    isLoading: false,
    isLoadingSoft: false,
    // scene state
    activeProduct: null,
    activeModel: null,
    activeMaterial: null,
    activeTexture: null,
    // config
    config: config,
    selectedColour: "#ff9900",
    hoverColour: null,
  },
  mutations: {
  },
  actions: {
    async init({ state }) {
      threeJsScene.init();
    },
    selectProduct({ state }, product, force) {
      if (Number.isInteger(product)) {
        product = state.config.products.find(aProduct => aProduct.id === product);
      }
      if (!product) throw 'product not found';
      if (state.activeProduct && state.activeProduct.id === product.id && !force) { 
        return false;
      }
      state.isLoading = true;
      threeJsScene.clearScene();
      state.activeProduct = product;
      activeProduct.loadModel();
    },
    setMaterial() {
      activeProduct.setMaterial();
    }
  },
  modules: {
  }
})
