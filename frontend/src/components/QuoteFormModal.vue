<template>
  <b-modal id="quote-form-modal" @ok="handleOk">
    <form ref="form" @submit.stop.prevent="handleSubmit">
      <b-form-group label="Name" label-for="name-input">
        <b-form-input
          id="name-input"
          v-model="formParams.name"
          required
        ></b-form-input>
      </b-form-group>
      <b-form-group label="Email" label-for="email-input">
        <b-form-input
          id="email-input"
          type="email"
          v-model="formParams.email"
          required
        ></b-form-input>
      </b-form-group>
    </form>
  </b-modal>
</template>
<script>
export default {
  name: "QuoteFormModal",
  data() {
    return {
      formParams: {
        name: "",
        email: "",
      },
      formIsValid: null,
      submittedNames: [],
    };
  },
  methods: {
    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.handleSubmit();
    },
    async handleSubmit() {
      var url = process.env.VUE_APP_BACKEND_API_URL;
      var data = {
        name: this.formParams.name,
        email: this.formParams.email,
        data: this.$store.state.activeProduct
      }
      console.log(data)
      const response = await fetch(url + 'quote/create', {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        mode: "cors",
        body: JSON.stringify(data),
      })

      this.$nextTick(() => {
        this.$bvModal.hide("quote-form-modal");
      });
    },
  },
};
</script>
<style lang="scss" scoped>
</style>