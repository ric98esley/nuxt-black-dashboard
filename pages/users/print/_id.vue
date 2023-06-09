<template>
  <div class="print">
    <div class="w-100 d-flex justify-content-between">
      <div class="col-6">
        <img :src="logo" alt="logo" class="logo-print" />
      </div>
      <div class="col-6 text-right">
        <strong>Comercializadora la excelencia (Gana loterias)</strong>
        <address>
          Rif: J-29401587-5 <br />
          Departamento técnico <br />
          Calle 15, Barrio Obrero - San Cristobal <br />
          Teléfono: 0276-355-6947 <br />
        </address>
      </div>
    </div>
    <br />
    <div class="row justify-content-between">
      <div class="col-3">
        <strong>        Reporte de inventario</strong>
        <br />
        Fecha de impresion: {{ new Date().toLocaleString() }} <br />
      </div>
      <div class="col-8">
        <strong>Datos de {{ user?.username }}</strong> <br />
        {{ user?.name }} {{ user?.lastName }} <br />
        <b>Teléfono:</b> {{ user?.phone }} <br />
        <b>Email:</b> {{ user?.email }} <br />
        <b>Cedula:</b> {{ user?.cardId }}
      </div>
    </div>
    <br /><br />
    <table class="w-100 table-print">
      <tr>
        <th></th>
        <th>Fecha</th>
        <th>Serial</th>
        <th>Descripción</th>
      </tr>
      <tr v-for="(assignment, index) in assigned.rows" v-bind:key="index">
        <td>{{ index + 1 }}</td>
        <td>{{ new Date(assignment.checkoutAt).toLocaleString() }}</td>
        <td>{{ assignment.target?.serial }}</td>
        <td>
          {{ assignment.target.model.category.name }} -
          {{ assignment.target.model?.brand?.name }} -
          {{ assignment.target.model.name }}
        </td>
      </tr>
      <tr>
        <th colspan="4">
          <b> Cantidad de activos asignados: {{ assigned.total }} </b>
        </th>
      </tr>
    </table>

    <table class="w-100 signs mt-5">
      <tr class="mt-5">
        <th>Firma del cliente</th>
        <th>Firma del tecnico</th>
      </tr>
    </table>
    <div>
      <br /><br />
      <strong>Nota:</strong> Con este documento se hace constar el buen
      funcionamiento de los activos asignados, así como también el compromiso
      por el cuidado de los mismos por parte de quien recibe. Es importante
      señalar que en caso de robo, pedida o mal uso, el cliente asume la
      responsabilidad ante la empresa.
    </div>
  </div>
</template>

<script>
export default {
  middleware: "authenticated",
  layout: "print",
  data() {
    return {
      id: this.$route.params.id,
      user: {},
      assigned: {},
      logo: "/img/logo.png",
    };
  },
  mounted() {
    this.getUser().then(() => {
      window.print();
      setTimeout(window.close, 500);
    });
  },
  methods: {
    async getUser() {
      try {
        const { data, error } = await this.$axios.get(`/users/${this.id}/assets`);
        this.user = data.target;
        this.assigned = data.assigned;
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
  padding: 3px 2px;
}
.table-print tr th {
  font-weight: normal;
}
.table-print tr td {
  font-weight: normal;
}
.table-print__header tr td {
  font-weight: normal;
  vertical-align: top;
}
.table-print tr:first-child th {
  font-weight: bold;
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
  width: 150px;
}
</style>