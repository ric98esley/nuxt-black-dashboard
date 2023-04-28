<template>
  <div class="row">
    <h1>Asignaciones</h1>
    <card class="col-md-12">
      <base-input label="Buscar assignacion"></base-input>
    </card>
    <card class="col-md-9">
      <el-table :data="orders.orders" class="table-striped">
        <el-table-column label="ticket" property="id"></el-table-column>
        <el-table-column label="Tipo" property="transactionType"></el-table-column>1
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
      orders: []
    }
  },
  mounted() {
    this.getAssignments()
  },
  methods: {
    async getAssignments() {
      try {
        const toSend ={
          params: {

          }
        }
        const { data, error } = await this.$axios.get('/orders', toSend)

        this.orders = data
        console.log(this.orders);
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>