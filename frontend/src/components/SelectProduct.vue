<template>
    <div class="products">
        <h3 class="mb-3">Products</h3>
        <!-- <ul>
      <li v-for="product in $store.state.config.products" :key="product.id">
        <b-link :to="{name: 'Product Editor', params: { productid: product.id }}">
          {{product.displayName}}
        </b-link>
      </li>
    </ul> -->
        <div class="row justify-content-center">
            <div
                class="col-2"
                v-for="product in $store.state.config.products"
                :key="product.id"
            >
                <b-link
                    :to="{
                        name: 'Product Editor',
                        params: { productid: product.id },
                    }"
                >
                    <div class="card">
                        <img
                            :src="'assets/product_' + product.id + '.png'"
                            class="card-img-top"
                            alt=""
                            style="height:230px;"
                        />
                        <div class="card-body">
                            <h5 class="card-title">
                                {{ product.displayName }}
                            </h5>
                            <!-- <p class="card-text">
                                Some quick example text to build on the card
                                title and make up the bulk of the card's
                                content.
                            </p> -->
                            <a href="#" class="btn btn-primary">Configure</a>
                        </div>
                    </div>
                </b-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "HelloWorld",
    props: {
        msg: String,
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.products {
    background-color: rgba(255, 255, 255, 0.95);
    padding: 20px;
}
ul {
    list-style-type: none;
    padding: 0;
}
li {
    display: inline-block;
    margin: 0 10px;
}
</style>
