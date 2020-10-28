<template>
  <div class="home">
    <img
      alt="Vue logo"
      src="../assets/logo.png"
      v-show="$store.state.isLoading"
    />
    <HelloWorld msg="" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "Home",
  components: {
    HelloWorld,
  },
  mounted() {},
};
</script>
