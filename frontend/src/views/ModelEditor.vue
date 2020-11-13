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

    <div id="ui">
      <div class="text-input-wrapper">
        <input type="text" class="text-input" v-model="$store.state.text" @change="$store.dispatch('setMaterial')" />
      </div>
      <div id="models">
        <template
          v-for="model in $store.state.models"
        >
          <div
            class="model"
            :key="model.id"
            v-on:click="
              $store.dispatch('selectModel', model);
            "
          >
            {{model.displayName}}
          </div>
        </template>
      </div>
      <div id="colour-swatches">
        <template
          v-for="colour in ['#ff9900', '#ff0099', '#00ff99', '#0099ff', '#9900ff', '#99ff00']"
        >
          <div
            class="colour-swatch"
            :style="{ 'background-color': colour }"
            :key="colour"
            v-on:mouseover="
              $store.state.selectedColour = colour;
              $store.dispatch('setMaterial');
            "
          ></div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: "ModelEditor",
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
    };
  },
  mounted: function(){
    this.$store.dispatch("loadModel");
  },
  methods: {
  },
};
</script>
<style lang="scss" scoped>
#wrapper{
  width: 100%;
  // height: 50%;
  bottom: 0;
  left: 0;
  display: block;
  position: fixed;
}
#ui {
  // border-top: 5px solid #d0d0d0;
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
#colour-swatches {
  display: flex;
  justify-content: center;
  .colour-swatch {
    cursor: pointer;
    width: 50px;
    height: 50px;
    margin-left: 1vw;
  }
}
.text-input-wrapper{
  display: flex;
  justify-content: center;
  .text-input{
    padding: 10px;
    margin: 10px;
    width: 50vw;
  }
}
#models{
  display: flex;
  justify-content: center;
  padding: 10px;
  .model{
    cursor: pointer;
    padding: 10px 20px;
    background-color: rgba(200,200,200, 0.5);
  }
}
</style>