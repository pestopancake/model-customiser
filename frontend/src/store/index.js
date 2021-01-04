/**
 * todo
 * move colour palettes & default colour into designs
 * store images with quote (upload and use url..)
 * better loading overlay
 * cors issue fetching from backend - local/dev need to work different
 * quote - load in images (url attr)
 * 
 * admin
 * list quotes, get SVG
 * 
 * UI tweaks
 * reset camera on changing product (button to reset camera?)
 * loading state for form + form submitted
 * 
 * backend
 * email notification for new quote
 * 
 * 
 * multiple clients
 * config per client
 * 
 * ideas
 * save svg + screenshot from client, can use as reference to check for errors
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
        return false; // if the product is already selected do nothing
      }

      Vue.set(product, 'selectedDesign', product.designs[0]);

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
