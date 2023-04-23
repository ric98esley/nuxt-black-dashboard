<template>
  <div class="row">
    <h1>Asignaciones</h1>
    <card class="col-md-12">
      <base-input label="Buscar assignacion"></base-input>
    </card>
    <card class="col-md-9">
      <el-table :data="assignments" class="table-striped">
        <el-table-column label="ticket" property="id"></el-table-column>
        <el-table-column label="serial asignado" property="asset.serial"></el-table-column>
        <el-table-column label="Tipo de asignacion" property="assinedType"></el-table-column>
        <el-table-column label="Asignado a" property="assinedTo"></el-table-column>
      </el-table>
    </card>
    <div class="col-md-3">
      <card>
        <base-button block type="success" class=" mb-3" @click="$nuxt.$router.push('/assignments/create');">
          Crear asignacion
        </base-button>
      </card>
    </div>
  </div>
</template>

<script>
import { BaseSwitch, Modal } from "@/components"
import { Select, Option, Table, TableColumn } from "element-ui";

export default {
  middleware: 'authenticated',
  name: "assignments",
  components: {
    [Option.name]: Option,
    [Select.name]: Select,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    BaseSwitch,
    Modal
  },
  data() {
    return {
      models: {
        createAssignment: false
      },
      assignments: []
    }
  },
  mounted() {
    this.getAssignments()
  },
  methods: {
    async getAssignments() {
      try {
        this.$axios.setToken(this.$store.state.auth.token, 'Bearer')
        const { data, error } = await this.$axios.get('/assignments/checkout/20')
        console.log(data);
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>