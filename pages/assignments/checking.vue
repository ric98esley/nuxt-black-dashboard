<template>
  <div class="row">
    <div class="col-md-12">
      <h1>Recibir activos</h1>
    </div>
    <div class="col-md-12">
      <card>
        <div class="d-flex justify-content-between">
          <div class="col-md-4">
            <base-input
              label="Buscar Activo asignado"
              v-model="search"
            ></base-input>
          </div>
          <base-button
            type="primary"
            native-type="button"
            @click="chekingAssets()"
          >
            Recibir
          </base-button>
        </div>
      </card>
    </div>
    <div class="">
      <card></card>
    </div>
    <div class="col-md-4">
      <card>
        <h4 slot="header" class="card-title">Lista de asignaciones activas</h4>
        <el-table :data="assignments?.assignments">
          <!-- fecha -->
          <el-table-column label="Fecha" prop="checkoutAt" min-width="150">
            <template slot-scope="scope">
              {{ formatDate(scope.row.checkoutAt) }}
            </template>
          </el-table-column>

          <el-table-column
            min-width="150"
            sortable
            label="Serial"
            property="target.serial"
          >
          </el-table-column>
          <el-table-column header-align="right">
            <div slot-scope="{ row }" class="text-right">
              <el-tooltip content="Agregar" :open-delay="300" placement="top">
                <base-button
                  type="info"
                  size="sm"
                  icon
                  native-type="button"
                  @click="addAssignment(row)"
                  :disabled="assetsId.includes(row.id)"
                >
                  <i class="fa fa-regular fa-plus"></i>
                </base-button>
              </el-tooltip>
            </div>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[10, 20]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="assignments.total"
        >
        </el-pagination>
      </card>
    </div>
    <div class="col-md-8">
      <card>
        <h4 slot="header" class="card-title">Recibir</h4>
        <el-table :data="assetsToChecking">
          <el-table-column property="target.serial" label="Serial">
          </el-table-column>
          <el-table-column label="Tipo">
            <div slot-scope="{ row }">
              {{
                `${row.target.model.category.name} - ${row.target.model.name} - ${row.target.model.brand?.name}`
              }}
            </div>
          </el-table-column>
          <el-table-column label="Procedencia">
            <div slot-scope="{ row }">
              <p v-if="row.assignmentType === 'user'">
                {{ `Usuario: ${row.user.username}-` }}
              </p>
              <p v-if="row.assignmentType === 'location'">
                {{ `Lugar: ${row.location.code}` }}
              </p>
            </div>
          </el-table-column>
          <el-table-column label="Estado">
            <base-input type="text" slot-scope="{ row }">
              <el-select
                v-model="row.target.assetStateId"
                class="select-success"
                placeholder="Selecciona un estado"
                label="Estados"
                style="width: 100%"
                name="assetState"
              >
                <el-option
                  v-for="option in states"
                  :key="option.id"
                  :value="option.id"
                  :label="option.name"
                >
                </el-option>
              </el-select>
            </base-input>
          </el-table-column>
          <el-table-column min-width="100" header-align="right">
            <div slot-scope="{ row }" class="text-right">
              <el-tooltip content="Agregar" :open-delay="300" placement="top">
                <base-button
                  type="danger"
                  size="sm"
                  icon
                  @click="deleteAssignment(row)"
                >
                  <i class="fa fa-solid fa-trash"></i>
                </base-button>
              </el-tooltip>
            </div>
          </el-table-column>
        </el-table>
      </card>
    </div>
  </div>
</template>


<script>
import { Select, Option, Table, TableColumn, Pagination } from "element-ui";

export default {
  middleware: "authenticated",
  name: "checking",
  components: {
    [Option.name]: Option,
    [Select.name]: Select,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Pagination.name]: Pagination
  },
  data() {
    return {
      currentPage: 1,
      assetsToChecking: [],
      search: "",
      assignments: {},
      limit: 10,
      offset: 0,
      states: {},
      assetState: null,
    };
  },
  computed: {
    assetsId() {
      return this.assetsToChecking.map((asset) => {
        return asset.id;
      });
    },
  },
  beforeMount() {
    this.getStatus();
  },
  mounted() {
    this.getAssignments();
  },
  watch: {
    search(newState, lastState) {
      if (newState === "") {
        this.getAssignments();
        return;
      }
      if (newState.length < 3) return;

      this.getAssignments();
    },
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
    handleSizeChange(val) {
      this.limit = val;
      this.getAssignments();
    },
    handleCurrentChange(val) {
      this.offset = (val - 1) * this.limit;
      this.getAssignments();
    },
    formatData(data) {
      const toSend = data.map((assignment) => {
        return {
          id: assignment.target.id,
          assetStateId: assignment.target.assetStateId,
        };
      });
      return {
        targets: toSend,
      };
    },
    addAssignment(data) {
      if (this.assetsId.includes(data.id)) return;
      const toAdd = JSON.parse(JSON.stringify(data));
      this.assetsToChecking.push(toAdd);
    },
    deleteAssignment(row) {
      const index = this.assetsToChecking.indexOf(row);
      if (index !== -1) {
        this.assetsToChecking.splice(index, 1);
      }
    },
    async getStatus() {
      try {
        const { data, error } = await this.$axios.get("/assets/status");
        this.states = data;
      } catch (error) {
        console.log(error);
      }
    },
    async getAssignments() {
      try {
        const toSend = {
          params: {},
        };
        if (this.search.length > 2) {
          toSend.params.serial = this.search;
        }
        toSend.params.limit = this.limit;
        toSend.params.offset = this.offset;

        const { data, error } = await this.$axios.get(
          "/orders/assignments",
          toSend
        );
        this.assignments = data;
      } catch (error) {
        console.log(error);
      }
    },
    async chekingAssets() {
      try {
        const toSend = this.formatData(this.assetsToChecking);

        const checking = await this.$axios.post("/orders/checking", toSend);

        this.$notify({
          message: "Activos recibidos correctamente",
          timeout: 3000,
          icon: "tim-icons icon-bell-55",
        });
        this.getAssignments();

        this.assetsToChecking = [];
      } catch (error) {
        this.$notify({
          message: "Algo ocurrio mal, verifica los activos recibidos",
          timeout: 3000,
          icon: "tim-icons icon-bell-55",
        });
        console.log(error);
      }
    },
  },
};
</script>