/**
 * todo:
 * colour palettes & default colour
 * get config based on env (for multiple clients)
 * store images with quote (upload and use url..)
 * loading overlay
 * save quote
 * load a saved quote
 * reset camera on change product
 * cors issue fetching from backend
 */

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import config from '@/config/config.json';
import threeJsScene from '@/lib/threeJsScene';
import activeProduct from '@/lib/activeProduct';

export default new Vuex.Store({
  state: {
    // loading states
    isInitiating: false,
    isInitiated: false,
    isLoading: false,
    isLoadingSoft: false,
    // scene state
    activeProduct: null,
    // config
    config: config,
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
