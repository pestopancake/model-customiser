<template>
  <div class="dev">
    <input type="checkbox" value="1" class="cb" checked>
    <div class="contents">
    <b-button-group vertical>
      <b-button variant="outline-primary" @click.prevent="$store.commit('clearScene')">clear scene</b-button>
      <b-button variant="outline-primary" @click.prevent="$store.dispatch('loadModel')">load model</b-button>
      <b-button variant="outline-primary" @click.prevent="$store.dispatch('selectModel')">select model</b-button>
      <b-button variant="outline-primary" @click.prevent="textureSnapshot">texture snapshot</b-button>
    </b-button-group>
      <ul>
        <li>isInitiating: {{$store.state.isInitiating}}</li>
        <li>isInitiated: {{$store.state.isInitiated}}</li>
        <li>isLoading: {{$store.state.isLoading}}</li>
        <li>isLoadingSoft: {{$store.state.isLoadingSoft}}</li>
      </ul>
    </div>
    <div>
      <img src="" id="canvaspreview" />
    </div>
  </div>
</template>

<script>
export default {
  name: "Dev",
  data() {
    return {};
  },
  methods: {
    textureSnapshot(){
      var canvas = document.getElementById("texturecanvas");
      var dataURL = canvas.toDataURL();
      var a = document.getElementById("canvaspreview");
      if (a) {
        document.getElementById("canvaspreview").src = dataURL;
      }
    }
  },
};
</script>
<style scoped lang="scss">
.dev {
  text-align: left;
  background-color: rgba(255, 255, 255, 0.9);
  position: fixed;
  top: 0;
  left: 0;
  .contents{
    padding: 10px;
    transform-origin: left top;
    transition: 0.1s ease-in-out;
    transform: scale(0.6);
    display:none;
    flex-direction: column;
  }
  input:checked + .contents {
    display: flex;
    transform: scale(1);
  }
  #canvaspreview{
    width: 500px;
  }
}
</style>
