<template>
  <div class="print">
    <div class="logo-print">
      <img :src="logo" alt="logo" />
    </div>
    <table class="w-100">
      <tr style="boder: 0; width: 300px">
        <td>
          <strong>Comercializadora la excelencia (Gana loterias)</strong>
          <address>
            Rif: J-29401587-5 <br />
            Departamento técnico <br />
            Calle 15, Barrio Obrero - San Cristobal <br />
            Teléfono: 0276-355-6947 <br />
            Teléfono Realizado por:
            <b> {{ order.createdBy?.name }} {{ order.createdBy?.lastName }} </b>
          </address>
        </td>
      </tr>
    </table>
    <br />
    <table class="w-100">
      <tr>
        <td>
          <strong>Datos de la asignación</strong><br />
          {{
            order.transactionType == "checkout"
              ? "Reporte de salida"
              : "Reporte de entrada"
          }}
          <br />
          Fecha de impresion: {{ Date() }} <br />
          Creado el: {{ formatDate(order.createdAt) }} <br />
          <template v-if="order.assignmentType == 'location'">
            {{ order.location?.code }} - {{ order.location?.name }} | Grupo:
            {{ order.location?.group.code }} - {{ order.location?.group.name }}
            <br />
            Dirección: <b> {{ order.location?.address }} </b><br />
            Numero de la taquilla: <b> {{ order.location?.phone }}</b>
            <br /><br />
            <strong> Datos del responsable de la agencia: </strong><br />
            Nombre: <b> {{ order.location?.manager.name }}</b> <br />
            Teléfono: <b>{{ order.location?.manager.phone }}</b> <br />
          </template>
        </td>
        <td style="boder: 0; width: 300px">
          <b> Cantidad de activos: {{ order.assignments?.length }} </b>
        </td>
      </tr>
    </table>
    <table class="w-100 table-print">
      <tr>
        <th></th>
        <th>Fecha</th>
        <th>Serial</th>
        <th>Descripción</th>
      </tr>
      <tr v-for="(assignment, index) in order.assignments">
        <th>{{ index + 1 }}</th>
        <th>{{ formatDate(assignment.checkoutAt) }}</th>
        <th>{{ assignment.target?.serial }}</th>
        <th>
          {{ assignment.target.model.category.name }} -
          {{ assignment.target.model?.brand?.name }} -
          {{ assignment.target.model.name }}
        </th>
      </tr>
    </table>

    <table class="w-100 disclaimer">
      <tr>
        <th>
          Con este documento el cliente, quien recibe, acepta la responsabilidad
          de cuidar los articulos aquí descriptos y responder por ellos en caso
          de robo, perdida o mal uso.
        </th>
      </tr>
    </table>
    <table class="w-100 signs mt-5">
      <tr class="mt-5">
        <th>Firma del cliente</th>
        <th>Firma del tecnico</th>
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
      logo: "/img/logo.png",
    };
  },
  mounted() {
    this.getOrder().then(() => {
      window.print();
      // setTimeout(window.close, 500);
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
.table-print {
  text-align: center;
  border: 1px solid black;
  padding: 3px 2px;
}
.table-print tr th {
  font-weight: normal;
  border: 1px solid black;
}
.table-print tr:first-child th {
  font-weight: bold;
  border: 1px solid black;
}
.disclaimer {
  text-align: center;
}
.disclaimer tr th {
  font-weight: normal;
}

.signs {
  text-align: center;
}
.logo-print {
  width: 120px;
  position: absolute;
  right: 8px;
  top: 8px;
  z-index: 1;
}
</style>