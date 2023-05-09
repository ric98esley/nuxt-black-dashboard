<template>
  <div class="row">
    <h1 class="col-md-12">Asignaciones</h1>
    <!-- <card class="col-md-12">
      <base-input label="Buscar assignacion"></base-input>
    </card> -->
    <card class="col-md-9">
      <el-table :data="orders.orders" class="table-striped">
        <el-table-column label="ticket" property="id"></el-table-column>
        <el-table-column label="Orden de">
          <div slot-scope="{ row }">
            <p v-if="row.transactionType === 'checkout'">Salida</p>
            <p v-if="row.transactionType === 'checking'">Entrada</p>
          </div>
        </el-table-column>
        <el-table-column label="Asignado a" property="assignmentType">
          <div slot-scope="{ row }">
            <p v-if="row.assignmentType === 'user'">Usuario</p>
            <p v-if="row.assignmentType === 'location'">Lugar</p>
          </div>
        </el-table-column>
        <el-table-column label="Código" property="user.username">
          <div slot-scope="{ row }">
            <p v-if="row.assignmentType === 'user'">{{ row.user.username }}</p>
            <p v-if="row.assignmentType === 'location'">
              {{ row.location.code }}
            </p>
          </div>
        </el-table-column>
        <el-table-column
          label="Asignado por"
          property="createdBy.username"
        ></el-table-column>
        <el-table-column min-width="90" header-align="right" label="Acciones">
          <div slot-scope="{ row }" class="text-right">
            <el-tooltip content="Información" :open-delay="300" placement="top">
              <base-button type="info" size="sm" icon @click="showOrder(row.id)">
                <i class="fa fa-regular fa-eye"></i>
              </base-button>
            </el-tooltip>
            <el-tooltip content="Editar" :open-delay="300" placement="top">
              <base-button type="danger" size="sm" icon @click="$nuxt.$router.push(`/assignments/${row.id}`)">
                <i class="fa fa-regular fa-pen"></i>
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
        :total="orders.total"
      >
      </el-pagination>
    </card>
    <!-- buttons -->
    <div class="col-md-3">
      <card>
        <base-button
          block
          type="success"
          class="mb-3"
          @click="$nuxt.$router.push('/assignments/checkout')"
        >
          Crear asignacion
        </base-button>
        <base-button
          block
          type="success"
          class="mb-3"
          @click="$nuxt.$router.push('/assignments/checking')"
        >
          Recibir activos
        </base-button>
      </card>
      <card>
        <base-button
          block
          type="success"
          class="mb-3"
          @click="$nuxt.$router.push('/assignments/checking')"
        >
          Crear garantia
        </base-button>
        <base-button
          block
          type="success"
          class="mb-3"
          @click="$nuxt.$router.push('/assignments/checking')"
        >
          Crear venta
        </base-button>
      </card>
    </div>
    <!-- modasl -->
    <div>
      <modal :show.sync="modals.viewOrder" body-classes="p-0" modal-classes="modal-dialog-centered modal-lg">
        <card class="card-info">
          <div class="row p-3">
            <div class="col-md-6">
              
            </div>
            <div class="col-md-6">
              <h4>Datos de la asignación</h4>
              <template v-if="order.assignmentType === 'user'">Asignado A: {{ order.user.name }} {{ order.user.lastName}}</template>
              <template v-if="order.assignmentType === 'location'">Asignado A: {{ order.location.name }} - {{ order.location.code }}</template>
              <template v-if="order.assignmentType === 'asset'">Asignado A: {{ order.asset.serial }}</template>

            </div>
          </div>
          <div class="row p-3">
            <el-table :data="order.assignments" :row-class-name="row => row.isCurrent ? '' : 'text-decoration-line-through'">
              <el-table-column prop="target.serial" label="serial">
              </el-table-column>
              <el-table-column prop="" label="Descripción">
                <template slot-scope="{ row }" >
                  <div >
                  {{ row.target.model.category.name }} - {{ row.target.model?.brand?.name }} - {{ row.target.model.name}}
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="p-3">
            <base-button link>Imprimir</base-button>
          </div>
        </card>
      </modal>
    </div>
  </div>
</template>

<script>
import { BaseSwitch, Modal } from "@/components";
import { Select, Option, Table, TableColumn } from "element-ui";

export default {
  middleware: "authenticated",
  name: "assignments",
  components: {
    [Option.name]: Option,
    [Select.name]: Select,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    BaseSwitch,
    Modal,
  },
  data() {
    return {
      modals: {
        viewOrder: false,
      },
      orders: [],
      limit: 10,
      offset: 0,
      currentPage: 1,
      order: {}
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
    async getOrder(id) {
      try {
        const { data, error } = await this.$axios.get(`/orders/${id}`);
        this.order = data;
      } catch (error) {
        console.log(error)
      }
    },
    async showOrder(id) {
      try {
        await this.getOrder(id);
        console.log(this.order)
        this.modals.viewOrder = true;
      } catch (error) {
        console.log(error);
      }
    },
    async getAssignments() {
      try {
        const toSend = {
          params: {},
        };

        toSend.params.limit = this.limit;
        toSend.params.offset = this.offset;
        const { data, error } = await this.$axios.get("/orders", toSend);

        this.orders = data;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>