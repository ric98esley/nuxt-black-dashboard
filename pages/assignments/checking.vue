<template>
  <div class="row">
    <div class="col-md-12">
      <h1>Recibir activos</h1>
    </div>
    <div class="col-md-12">
      <card>
        <base-input
          label="Buscar Activo asignado"
          v-model="search"
        ></base-input>
      </card>
    </div>
    <div class="col-md-6">
      <card>
        <h4 slot="header" class="card-title">Lista de asignaciones activas</h4>
        <el-table :data="assignments.assignments">
          <el-table-column min-width="50" sortable label="id" property="id">
          </el-table-column>
          <el-table-column min-width="150" sortable label="Tipo de asignación">
            <div slot-scope="{ row }">
              <p v-if="row.assignmentType === 'user'">Usuario</p>
              <p v-if="row.assignmentType === 'location'">Lugar</p>
            </div>
          </el-table-column>
          <el-table-column
            min-width="150"
            sortable
            label="Serial"
            property="asset.serial"
          >
          </el-table-column>
          <el-table-column label="Código" property="user.username">
            <div slot-scope="{ row }">
              <p v-if="row.assignmentType === 'user'">
                {{ row.user.username }}
              </p>
              <p v-if="row.assignmentType === 'location'">
                {{ row.location.code }}
              </p>
            </div>
          </el-table-column>
          <el-table-column min-width="100" header-align="right" label="Agregar">
            <div slot-scope="{ row }" class="text-right">
              <el-tooltip content="Agregar" :open-delay="300" placement="top">
                <base-button type="info" size="sm" icon native-type="button">
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
    <div class="col-md-6">
      <card>
        <h4 slot="header" class="card-title">Recibir</h4>
        <el-table>
          <el-table-column> </el-table-column>
        </el-table>
      </card>
    </div>
  </div>
</template>


<script>
export default {
  middleware: "authenticated",
  name: "checking",
  data() {
    return {
      search: "",
      assignments: {},
      limit: 10,
      offset: 0
    };
  },
  mounted() {
    this.getAssignments();
  },
  methods: {
    handleSizeChange(val) {
      this.limit = val;
      this.getAssignments();
    },
    handleCurrentChange(val) {
      this.offset = (val - 1) * this.limit;
      this.getAssignments();
    },
    async getAssignments() {
      const toSend = {
        params: {},
      };
      const { data, error } = await this.$axios.get(
        "/orders/assignments",
        toSend
      );

      console.log(data);

      this.assignments = data;
    },
  },
};
</script>