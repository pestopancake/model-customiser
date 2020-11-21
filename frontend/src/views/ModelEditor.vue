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
- re-use / pre fetch / cache assets
- vuex - state only - move out three js?
- mixin / component anything?
*/
<template>
  <div id="wrapper">
    <div id="ui">
      <div class="text-input-wrapper" v-if="$store.state.activeProduct">
        <!-- <input
          type="text"
          class="text-input"
          v-model="$store.state.text"
          @change="$store.dispatch('setMaterial')"
        /> -->
        <b-container fluid="md">
          <b-row v-for="textElement in $store.state.activeProduct.textElements"
            :key="textElement.name"
            class="my-1 justify-content-md-center">
            <b-col col md="2" class="text-right pr-0">
              <label for="input-small">{{textElement.name}}:</label>
            </b-col>
            <b-col col md="auto">
              <b-form-input
                type="text"
                size="sm"
                maxlength="20"
                v-model="textElement.value"
                @change="$store.dispatch('setMaterial')"
              />
            </b-col>
          </b-row>
        </b-container>
      </div>
      <div id="models">
        <template v-for="model in $store.state.config.products">
          <b-button
            class="btn mx-1"
            :key="model.id"
            v-on:click="$store.dispatch('selectModel', model)"
          >
            {{ model.displayName }}
          </b-button>
        </template>
      </div>
      <div id="colour-swatches">
        <template
          v-for="colour in [
            '#ff9900',
            '#ff0099',
            '#00ff99',
            '#0099ff',
            '#9900ff',
            '#99ff00',
          ]"
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
      <b-overlay :show="$store.state.isLoading" no-wrap></b-overlay>
    </div>
  </div>
</template>
<script>

export default {
  name: "ModelEditor",
  data() {
    return {
    };
  },
  async mounted() {
    // this.$store.dispatch("loadModel");
    // this.$store.dispatch('selectModel', this.$store.state.config.products[0])
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
#wrapper {
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
#models {
  display: flex;
  justify-content: center;
  padding: 10px;
  .model {
    cursor: pointer;
    padding: 10px 20px;
    background-color: rgba(200, 200, 200, 0.5);
  }
}
</style>