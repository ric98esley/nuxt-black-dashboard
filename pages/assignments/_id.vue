<template>
  <div class="row">
    <div class="col-md-12">
        <h2>ticket {{ id }}</h2>
    </div>
    <div class="col-md-6">
      
      <h3>Datos</h3>

    </div>
  </div>
</template>
<script>
export default {
  name: "order",
  middleware: "authenticated",
  data() {
    return {
      id: this.$route.params.id,
      order: {}
    };
  },
  mounted() {
    this.getOrder();
  },
  methods: {
    async getOrder() {
      try {
        const { data } = await this.$axios.get(`/orders/${this.id}`);

        this.order = data
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>