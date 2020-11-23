<template>
  <div class="products">
    <h3>Products</h3>
    <ul>
      <li v-for="product in $store.state.config.products" :key="product.id">
        <b-link :to="{name: 'Product Editor', params: { id: product.id }}">
          {{product.displayName}}
        </b-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.products{
  background-color: rgba(255,255,255,0.9);
  padding: 20px;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
