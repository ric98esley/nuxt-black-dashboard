<template>
  <div class="row">
    <div class="col-md-6">
      <card>
        <h4>Datos del activo</h4>
        <form @submit.prevent="">
          <div class="row">
            <div class="col-md-6">
              <label>Serial:</label>
              {{ asset.serial }}
            </div>
            <div class="col-md-6">
              <label> Creado por:</label>
              {{ asset.createdBy?.username }}
            </div>
            <div class="col-md-6">
              <label> Fecha de creación</label>
              {{ formatDate(asset.createdAt) }}
            </div>
            <div class="col-md-6">
              <label> Número de entradas</label>
              {{ asset.countChecking }}
            </div>
            <div class="col-md-6">
              <label> Modelo</label>
              {{ asset.model?.model }}
            </div>
            <div class="col-md-6">
              <label> Categoria</label>
              {{ asset.model?.category.name }}
            </div>
            <div class="col-md-6">
              <label> Estado</label>
              {{ asset.state?.name }}
            </div>
          </div>
        </form>
      </card>
    </div>
    <div class="col-md-6">
      <card>
        <base-button> editar activo </base-button>
      </card>
    </div>
    <div class="col-md-6">
      <card>
        <h4>Historial de asignaciones</h4>
        <el-table :data="asset.assignments">
          <el-table-column type="expand">
            <template slot-scope="{ row }">
              <div class="row">
                <div class="col-12">
                  <p>Asignado el: {{ row.checkoutAt }}</p>
                  <p>
                    Asignado por:
                    <router-link to="/">
                      {{ row.checkoutBy.name }}
                      {{ row.checkoutBy.lastName }}</router-link
                    >
                  </p>
                </div>
                <div class="col-12" v-if="row.checkingAt">
                  <p>Recibido el: {{ row.checkingAt }}</p>
                  Recibido por:
                  <router-link to="#">
                    {{ row.checkingBy.name }}
                    {{ row.checkingBy.lastName }}
                  </router-link>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Fecha" prop="checkoutAt">
            <template slot-scope="scope">
              {{ formatDate(scope.row.checkoutAt) }}
            </template>
          </el-table-column>
          <el-table-column label="Asignado a">
            <template slot-scope="{ row }">
              <div v-if="row.assignmentType === 'location'">
                {{ row.location?.code }}- {{ row.location?.name }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </card>
    </div>
    <div class="col-md-6">
      <card>
        <h4>Historial mantenimientos</h4>
        <el-table></el-table>
        <div id="barcode">
          <barcode :value="asset.serial" format="CODE128" width="1" height="30"></barcode>
        </div>
        <base-button @click="print"> imprimir codigo de barras </base-button>
      </card>
    </div>
  </div>
</template>

<script>
import { Select, Option, Table, TableColumn, Pagination } from "element-ui";
import VueBarcode from "vue-barcode";

export default {
  name: "AssetDetails",
  middleware: "authenticated",
  components: {
    [Option.name]: Option,
    [Select.name]: Select,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Pagination.name]: Pagination,
    barcode: VueBarcode,
  },
  data() {
    return {
      asset: {},
      id: this.$route.params.id,
    };
  },
  mounted() {
    this.getAsset();
  },
  methods: {
    async print() {
      console.log(this.$Printd.print(document.getElementById('barcode')));
    },
    formatDate(dateString) {
      // Crear un objeto de fecha a partir de la cadena de fecha

      const fecha = new Date(dateString);

      // Obtener el año, mes y día en formato de número
      const year = fecha.getFullYear();
      const month = fecha.getMonth() + 1;
      const day = fecha.getDate();

      // Crear un string con la fecha en formato "yyyy-mm-dd"
      const fechaFormateada = `${day.toString().padStart(2, "0")}-${month
        .toString()
        .padStart(2, "0")}-${year}
      `;

      return fechaFormateada;
    },
    async getAsset() {
      const { data } = await this.$axios.get(`/assets/${this.id}`);
      this.asset = data;
      console.log(this.asset);
    },
  },
};
</script>
