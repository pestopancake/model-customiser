<template>
  <div class="about">
    <h1>This is an about page</h1>
    <HelloWorld msg="" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "About",
  components: {
    HelloWorld,
  },
  mounted() {},
};
</script>
