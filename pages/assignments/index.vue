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
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page.sync="currentPage" :page-sizes="[10, 20]" :page-size="10"
        layout="total, sizes, prev, pager, next, jumper" :total="orders.total">
      </el-pagination>
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
      orders: [],
      limit: 10,
      offset: 0,
    }
  },
  mounted() {
    this.getAssignments()
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
      try {
        const toSend = {
          params: {
          }
        }

        toSend.params.limit = this.limit;
        toSend.params.offset = this.offset;
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