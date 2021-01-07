<template>
  <div class="dev">
    <input type="checkbox" value="1" class="cb" checked />
    <div class="contents">
      <b-button-group vertical>
        <b-button variant="outline-primary" @click.prevent="textureSnapshot"
          >texture snapshot</b-button
        >
      </b-button-group>
      <b>state:</b>
      <ul class="list-group">
        <li>isInitiating: {{ $store.state.isInitiating }}</li>
        <li>isInitiated: {{ $store.state.isInitiated }}</li>
        <li>isLoading: {{ $store.state.isLoading }}</li>
        <li>isLoadingSoft: {{ $store.state.isLoadingSoft }}</li>
      </ul>
      <b>env:</b>
      <ul class="list-group">
        <li v-for="(v, k) of env" :key="v">
          {{k}}:<br>{{v}}
        </li>
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
    return {
      env: process.env
    };
  },
  methods: {
    textureSnapshot() {
      var canvas = document.getElementById("texturecanvas");
      var dataURL = canvas.toDataURL();
      var a = document.getElementById("canvaspreview");
      if (a) {
        document.getElementById("canvaspreview").src = dataURL;
      }
    },
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
  .contents {
    padding: 10px;
    transform-origin: left top;
    transition: 0.1s ease-in-out;
    transform: scale(0.6);
    display: none;
    flex-direction: column;
  }
  input:checked + .contents {
    display: flex;
    transform: scale(1);
  }
  #canvaspreview {
    width: 500px;
  }
}
</style>
