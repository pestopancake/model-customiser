<template>
  <div id="wrapper">
    <div id="ui">
      <div>
        <b-card no-body id="ui-tabs">
          <b-tabs content-class="mt-3" align="center" pills card end>
            <b-tab title="Text" active>
              <div class="text-input-wrapper" v-if="$store.state.activeProduct">
                <b-container fluid="md">
                  <b-row
                    v-for="textElement in $store.state.activeProduct
                      .textElements"
                    :key="textElement.name"
                    class="my-1 justify-content-md-left"
                  >
                    <b-col cols="3" md="2" class="text-right pr-0">
                      <label for="input-small">{{ textElement.name }}:</label>
                    </b-col>
                    <b-col col>
                      <b-form-input
                        type="text"
                        size="sm"
                        maxlength="20"
                        v-model="textElement.value"
                        v-on:keyup="textChanged()"
                      />
                    </b-col>
                  </b-row>
                </b-container>
              </div>
            </b-tab>
            <b-tab title="Logos">
              <div
                class="image-input-wrapper"
                v-if="$store.state.activeProduct"
              >
                <b-container fluid="md">
                  <b-row
                    v-for="imageElement in $store.state.activeProduct
                      .imageElements"
                    :key="imageElement.name"
                    class="my-1 justify-content-md-left"
                  >
                    <b-col cols="3" md="2" class="text-right pr-0">
                      <label for="input-small">{{ imageElement.name }}:</label>
                    </b-col>
                    <b-col col>
                      <b-input-group>
                        <b-form-file
                          v-model="imageElement.value"
                          @change="designChanged()"
                          accept="image/*"
                          placeholder="Choose an image or drop it here..."
                          drop-placeholder="Drop image here..."
                        ></b-form-file>
                        <b-button
                          v-show="imageElement.value"
                          @click="
                            imageElement.value = null;
                            designChanged();
                          "
                        >
                          <b-icon icon="x"></b-icon>
                        </b-button>
                      </b-input-group>
                    </b-col>
                  </b-row>
                </b-container>
              </div>
            </b-tab>
            <b-tab title="Design">
              <div id="designs" v-if="$store.state.activeProduct">
                <template v-for="design in $store.state.activeProduct.designs">
                  <b-button
                    class="btn mx-1"
                    :variant="
                      $store.state.activeProduct.selectedDesign &&
                      $store.state.activeProduct.selectedDesign.name ===
                        design.name
                        ? 'primary'
                        : ''
                    "
                    @click.prevent="selectDesign(design)"
                    :key="design.path"
                  >
                    {{ design.name }}
                  </b-button>
                </template>
              </div>
              <div id="colours" class="my-2" v-if="$store.state.activeProduct">
                <template
                  v-for="colourPlacement in $store.state.activeProduct.colours"
                >
                  <b-button
                    class="colour mx-2"
                    :variant="
                      $store.state.activeProduct.selectedColourPlacement &&
                      $store.state.activeProduct.selectedColourPlacement
                        .displayName === colourPlacement.displayName
                        ? 'primary'
                        : ''
                    "
                    :key="colourPlacement.displayName"
                    @click="
                      $set(
                        $store.state.activeProduct,
                        'selectedColourPlacement',
                        colourPlacement
                      );
                      designChanged();
                    "
                  >
                    {{ colourPlacement.displayName }}
                  </b-button>
                </template>
              </div>
              <div id="colour-swatches" v-if="activeColourPalette">
                <template v-for="colour in activeColourPalette.colours">
                  <div
                    class="colour-swatch"
                    :class="{ active: selectedColour == colour }"
                    :style="{ 'background-color': colour }"
                    :key="colour"
                    v-on:mouseover="hoverColour(colour)"
                    v-on:mouseout="hoverColour(null)"
                    @click="
                      $set(
                        $store.state.activeProduct.selectedColourPlacement,
                        'selectedColour',
                        colour
                      );
                      designChanged();
                    "
                  ></div>
                </template>
              </div>
            </b-tab>
            <b-tab title="Submit">
              <b-button class="btn mx-1 my-2" @click.prevent="submitQuote()">
                Submit Quote
              </b-button>
            </b-tab>
          </b-tabs>
        </b-card>
      </div>

      <!-- <div id="models" class="my-2">
        <template v-for="product in $store.state.config.products">
          <b-link
            class="btn"
            :to="{ name: 'Product Editor', params: { productid: product.id } }"
            :key="product.id"
          >
            {{ product.displayName }}
          </b-link>
        </template>
      </div> -->
      <b-overlay :show="$store.state.isLoading" no-wrap></b-overlay>
      <QuoteFormModal />
    </div>
  </div>
</template>
<script>
import router from "@/router";
import _throttle from "lodash/throttle";
import QuoteFormModal from "@/components/QuoteFormModal";

export default {
  name: "ModelEditor",
  components: { QuoteFormModal },
  data() {
    return {
      colourPromiseLock: false,
    };
  },
  async mounted() {
    this.selectProduct();
  },
  computed: {
    selectedColour() {
      return this.$store.state.activeProduct.selectedColourPlacement
        .selectedColour;
    },
    activeColourPalette() {
      if (
        this.$store.state.activeProduct &&
        this.$store.state.activeProduct.selectedColourPlacement
      ) {
        return this.$store.state.config.colourPalettes[
          this.$store.state.activeProduct.selectedColourPlacement.colourPalette
        ];
      }
      return [];
    },
  },
  methods: {
    textChanged: _throttle(function () {
      this.designChanged();
    }, 500),
    submitQuote() {
      this.$bvModal.show("quote-form-modal");
    },
    async selectProduct() {
      // get quote & load product into state
      if (router.currentRoute.params.quoteid) {
        var url = process.env.VUE_APP_BACKEND_API_URL;
        var request = await fetch(
          url + "quote/" + router.currentRoute.params.quoteid,
          {
            headers: {
              "Content-Type": "application/json",
            },
            mode: "cors",
          }
        )
        var response = await request.json();
        var quote = response.data;
        
        this.$store.dispatch("selectProduct", quote.data, true);
        return true;
      }

      var productId = router.currentRoute.params.productid;
      if (productId) {
        this.$store.dispatch("selectProduct", parseInt(productId));
      } else {
        this.$store.dispatch(
          "selectProduct",
          this.$store.state.config.products[0]
        );
      }
    },
    selectDesign(design) {
      this.$set(this.$store.state.activeProduct, "selectedDesign", design);
      this.designChanged();
    },
    designChanged() {
      this.$store.dispatch("setMaterial");
    },
    async hoverColour(colour) {
      var vm = this;
      this.$store.state.hoverColour = colour;
      if (vm.$store.state.isLoadingSoft && !vm.colourPromiseLock) {
        vm.colourPromiseLock = true;
        await new Promise(function (resolve) {
          (function waitForFoo() {
            if (!vm.$store.state.isLoadingSoft) {
              vm.colourPromiseLock = false;
              return resolve();
            }
            setTimeout(waitForFoo, 20);
          })();
        });
      }
      if (!vm.$store.state.isLoadingSoft) {
        this.designChanged();
      }
    },
  },
  watch: {
    $route() {
      this.selectProduct();
    },
  },
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
  // background-color: rgba(200, 200, 200, 0.7);
  // font-weight: bold;
  // padding-top: 10px;
  position: fixed;
  bottom: 0;
  width: 100%;

  #ui-tabs {
    max-width: 1024px;
    margin: 0 auto;
  }
}
#colour-swatches {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  .colour-swatch {
    // border-width: 3px 3px 0 3px;
    // border-style: solid;
    // border-color: rgba(200, 200, 200, 0.8);
    box-shadow: 0px 0px 5px 1px rgba(200, 200, 200, 0.8);
    cursor: pointer;
    width: 50px;
    height: 50px;
    margin-left: 1vw;

    &.active {
      border: 3px solid #007bff;
    }
  }
}
</style>