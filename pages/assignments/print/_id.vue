<template>
  <div class="print">
    <h4>
      {{
        order.transactionType == "checkout"
          ? "Reporte de salida"
          : "Reporte de entrada"
      }}
      <br />
      Fecha de impresion: {{ Date() }} <br />
      <template v-if="order.assignmentType == 'location'">
        {{ order.location?.code }} - {{ order.location?.name }} | Grupo:
        {{ order.location?.group.code }} - {{ order.location?.group.name }}
      </template>
    </h4>
    <table class="w-100">
      <tr style="boder: 0; width: 300px">
        <td>
          <strong>Gana loterias</strong>
          <address>
            Rif: J-29401587 <br />
            departamento técnico <br />
            Calle 15, Barrio Obrero - San Cristobal <br />
            Telefono: 0276-355-6947 <br />
            Realizado por:
            <b> {{ order.createdBy?.name }} {{ order.createdBy?.lastName }} </b>
          </address>
        </td>
        <td style="boder: 0; width: 300px">
          <b> Cantidad de activos: {{ order.assignments?.length }} </b>
        </td>
      </tr>
    </table>
    <br />
    <table class="w-100">
      <tr>
        <th>Fecha</th>
        <th>Serial</th>
        <th>Descripción</th>
      </tr>
      <tr v-for="assignment in order.assignments">
        <th>{{ formatDate(assignment.checkoutAt) }}</th>
        <th>{{ assignment.target?.serial }}</th>
        <th>
          {{ assignment.target.model.category.name }} -
          {{ assignment.target.model?.brand?.name }} -
          {{ assignment.target.model.name }}
        </th>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  middleware: "authenticated",
  layout: "print",
  data() {
    return {
      id: this.$route.params.id,
      order: {},
    };
  },
  mounted() {
    this.getOrder().then(() => {
      window.print();
      setTimeout(window.close, 500);
    });
  },
  methods: {
    formatDate(dateString) {
      // Crear un objeto de fecha a partir de la cadena de fecha

      const fecha = new Date(dateString);

      // Obtener el año, mes y día en formato de número
      const year = fecha.getFullYear();
      const month = fecha.getMonth() + 1;
      const day = fecha.getDate();

      // Crear un string con la fecha en formato "yyyy-mm-dd"
      const fechaFormateada = `${year}-${month
        .toString()
        .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

      return fechaFormateada;
    },
    async getOrder() {
      try {
        console.log("adfadf");
        const { data, error } = await this.$axios.get(`/orders/${this.id}`);
        this.order = data;
        console.log(this.order);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
<style>
.print {
  color: black;
  margin-top: -100px;
}
.print h1 {
  color: black;
}
.print h4 {
  line-height: 22px;
  font-weight: bold;
  color: black;
  font-size: 12px;
}
</style>