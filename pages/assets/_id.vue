<template>
  <div class="row">
    <div class="col-md-6">
      <card>
        <h4>Datos del activo</h4>
        <form @submit.prevent="">
          <div class="row">
            <div class="col-md-6">
              <label >Serial:</label>
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
        <base-button>
          editar activo
        </base-button>
      </card>
    </div>
    <div class="col-md-6">
      <card>
        <h4>Historial de asignaciones</h4>
        <el-table :data="asset.assignments">
          <el-table-column label="Fecha" prop="checkoutAt" min-width="150">
            <template slot-scope="scope">
              {{ formatDate(scope.row.checkoutAt) }}
            </template>
          </el-table-column>
          <el-table-column label="hecho por" prop="checkoutBy.username">
          </el-table-column>
        </el-table>
      </card>
    </div>
    <div class="col-md-6">
      <card>
        <h4>Historial mantenimientos</h4>
        <el-table></el-table>
      </card>
    </div>
  </div>
</template>

<script>
import { Select, Option, Table, TableColumn, Pagination } from "element-ui";

export default {
  name: "AssetDetails",
  middleware: "authenticated",
  components: {
    [Option.name]: Option,
    [Select.name]: Select,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Pagination.name]: Pagination
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
    async getAsset() {
      const { data } = await this.$axios.get(`/assets/${this.id}`);
      this.asset = data;
    },
  },
};
</script>