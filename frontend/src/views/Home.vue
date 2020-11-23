<template>
  <div class="home">
    <img
      alt="Vue logo"
      src="../assets/logo.png"
      v-show="$store.state.isLoading"
    />
    <SelectProduct />
  </div>
</template>

<script>
// @ is an alias to /src
import SelectProduct from "@/components/SelectProduct.vue";

export default {
  name: "Home",
  components: {
    SelectProduct,
  },
  mounted() {},
};
</script>
