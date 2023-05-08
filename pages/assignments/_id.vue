<template>
  <div class="row">
    <div class="col-md-12">
      <h2>ticket {{ id }}</h2>
    </div>
    <div class="col-md-6">
      <card>
        <h3>Agregar asignaciones</h3>
      </card>
    </div>
    <div class="col-md-6">
      <card>
        <h3>asignaciones</h3>
        <el-table :data="order.assignments">
          <el-table-column prop="id"> </el-table-column>
        </el-table>
      </card>
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
      order: {},
    };
  },
  mounted() {
    this.getOrder();
  },
  methods: {
    async getOrder() {
      try {
        const { data } = await this.$axios.get(`/orders/${this.id}`);

        this.order = data;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>