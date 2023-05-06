<template>
  <h1>Ruta dinamica {{ id }}</h1>
</template>

<script>
export default {
  name: "AssetDetails",
  middleware: "authenticated",
  data() {
    return {
      id: this.$route.params.id,
    };
  },
  mounted() {
    this.getAsset();
  },
  methods: {
    async getAsset() {
      const { data } = await this.$axios.get(`/assets/${this.id}`);
      console.log(data);
    },
  },
};
</script>