import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

//todo:organise these helper functions

window.animate = function () {
  var vm = store.state;
  vm.controls.update();
  vm.renderer.render(vm.scene, vm.camera);
  window.animationFrameRequestId = requestAnimationFrame(window.animate);
  if (window.resizeRendererToDisplaySize(vm.renderer)) {
    const canvas = vm.renderer.domElement;
    vm.camera.aspect = canvas.clientWidth / canvas.clientHeight;
    vm.camera.updateProjectionMatrix();
  }
};

window.resizeRendererToDisplaySize = function (renderer) {
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
}

window.onload2promise = function (obj) {
  return new Promise((resolve, reject) => {
    obj.onload = () => resolve(obj);
    obj.onerror = reject;
  });
}

window.readFileAsync = function (file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = reject;

    reader.readAsDataURL(file);
  })
}

new Vue({
  router,
  store,
  render: h => h(App),
  mounted: function () {
    this.$store.dispatch("init");
  }
}).$mount('#app')
