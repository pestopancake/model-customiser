import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

window.animate = function () {
  var vm = store.state;
  vm.controls.update();
  vm.renderer.render(vm.scene, vm.camera);
  vm.animationFrameRequestId = requestAnimationFrame(window.animate);
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

new Vue({
  router,
  store,
  render: h => h(App),
  mounted: function () {
    this.$store.dispatch("init");
  }
}).$mount('#app')
