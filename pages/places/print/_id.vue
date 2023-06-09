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
    <div class="d-flex d-flex justify-content-between">
      <div class="col-3">
        <strong> Reporte de inventario</strong>

        <br />
        Fecha de impresion: {{ new Date().toLocaleString() }} <br />
      </div>
      <div class="col-5">
        <strong>Datos de la {{ location.type?.name }}</strong> <br />
        {{ location.code }} - {{ location?.name }} | Grupo:
        {{ location.group?.code }} - {{ location.group?.name }}
        <br />
        Dirección: <b> {{ location.address }} </b><br />
        Numero de la {{ location.type?.name }}:
        <b> {{ location?.phone }}</b>
      </div>
      <div class="col-3">
        <strong>
          Datos del responsable de la
          {{ location.type?.name }}: </strong
        ><br />
        Nombre: <b> {{ location.manager?.name }}</b> <br />
        Teléfono: <b>{{ location.manager?.phone }}</b> <br />
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
          {{ assignment.target?.model.category.name }} -
          {{ assignment.target?.model?.brand?.name }} -
          {{ assignment.target?.model.name }}
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
      señalar que en caso de pedida o mal uso, el cliente asume la
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
      location: {
        name: null,
      },
      assigned: {},
      logo: "/img/logo.png",
    };
  },
  mounted() {
    this.getAssigned().then(() => {
      window.print();
      setTimeout(window.close, 500);
    });
  },
  methods: {
    async getAssigned() {
      try {
        const { data } = await this.$axios.get(`/locations/${this.id}/assets`);
        this.assigned = data.assigned;
        this.location = data.target;
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