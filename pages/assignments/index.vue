<template>
  <div class="row">
    <div class="col-md-12">
      <h1>Ordenes</h1>
    </div>
    <div class="col-12">
      <card>
        <div class="row">
          <div class="col-11">
            <base-input label="Buscar activo" v-model="search"></base-input>
          </div>
          <div class="col-1 row justify-content-center align-items-center">
            <el-tooltip content="Filtrar" :open-delay="300" placement="top">
              <base-button
                type="info"
                size="sm"
                icon
                @click="modals.filter = true"
              >
                <i class="fa fa-solid fa-filter"></i>
              </base-button>
            </el-tooltip>
          </div>
        </div>
      </card>
    </div>
    <card class="col-md-9">
      <el-table :data="orders.orders" class="table-striped">
        <el-table-column type="expand">
          <template slot-scope="{ row }">
            <p>
              Creado por: {{ row.createdBy.name }}
              {{ row.createdBy.lastName }}
            </p>
            <p>Creado el : {{ new Date(row.createdAt).toLocaleString() }}</p>
          </template>
        </el-table-column>
        <el-table-column label="ticket" property="id"> </el-table-column>
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
            <p v-if="row.assignmentType === 'asset'">Activo</p>
          </div>
        </el-table-column>
        <el-table-column label="Código" property="user.username">
          <div slot-scope="{ row }">
            <p v-if="row.assignmentType === 'user'">{{ row.user.username }}</p>
            <p v-if="row.assignmentType === 'location'">
              {{ row.location.code }}
            </p>
            <p v-if="row.assignmentType === 'asset'">
              {{ row.asset.serial }}
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
              <base-button
                type="info"
                size="sm"
                icon
                @click="showOrder(row.id)"
              >
                <i class="fa fa-regular fa-eye"></i>
              </base-button>
            </el-tooltip>
            <el-tooltip content="Editar" :open-delay="300" placement="top">
              <base-button
                type="danger"
                size="sm"
                icon
                @click="$nuxt.$router.push(`/assignments/${row.id}`)"
              >
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
      <modal
        :show.sync="modals.filter"
        body-classes="p-0"
        modal-classes="modal-dialog-centered modal-sm"
      >
        <card>
          <el-form @submit.native.prevent>
            <base-input label="Modelo">
              <el-select
                v-model="filters.modelId"
                clearable
                filterable
                class="select-success"
                placeholder="Selecciona una modelo"
                label="Categoria"
                style="width: 100%"
              >
                <el-option
                  v-for="option in models"
                  :key="option.id"
                  :value="option.id"
                  :label="`${option.category.name} - ${option.name} - ${option.brand?.name}`"
                >
                </el-option>
              </el-select>
            </base-input>
            <base-input type="text" label="Categoria">
              <el-select
                v-model="filters.categoryId"
                class="select-success"
                placeholder="Selecciona una categoria"
                label="Categoria"
                style="width: 100%"
                filterable
              >
                <el-option
                  v-for="option in categories"
                  :key="option.id"
                  :value="option.id"
                  :label="option.name"
                >
                </el-option>
              </el-select>
            </base-input>
            <base-input type="text" label="Estado">
              <el-select
                v-model="filters.stateId"
                class="select-success"
                placeholder="Selecciona un estado"
                label="Estado"
                style="width: 100%"
                filterable
                clearable
              >
                <el-option
                  v-for="option in states"
                  :key="option.id"
                  :value="option.id"
                  :label="`${option.id} - ${option.name}`"
                >
                  {{ option.id }} - {{ option.name }}
                </el-option>
              </el-select>
            </base-input>
            <base-input type="text" label="Marca">
              <el-select
                v-model="filters.brandId"
                class="select-success"
                placeholder="Selecciona una marca"
                filterable
                label="Marca"
                style="width: 100%"
              >
                <el-option
                  v-for="option in brands"
                  :key="option.id"
                  :value="option.id"
                  :label="option.name"
                >
                </el-option>
              </el-select>
            </base-input>
            <base-input label="Desde">
              <el-date-picker
                type="daterange"
                class="bg-transparent"
                size="large"
                clearable
                v-model="dateFilter"
                @change="updateDateFilter"
              >
              </el-date-picker>
            </base-input>
            <base-switch label="Mostrar borrados"> </base-switch>
          </el-form>
        </card>
      </modal>
      <modal
        :show.sync="modals.viewOrder"
        body-classes="p-0"
        modal-classes="modal-dialog-centered modal-lg"
      >
        <card class="card-info">
          <div class="row p-3">
            <div class="col-md-6">
              <h4>Gana Loterias</h4>
              <div>Lo tenemos todo</div>
              <div>RIF: 123542673586736235</div>
              <div>Telefono: 027631234114</div>
            </div>
            <div class="col-md-6">
              <h4>Datos de la orden</h4>
              <template v-if="order.assignmentType === 'user'">
                Asignado A: {{ order.user.name }} {{ order.user.lastName }}
              </template>
              <template v-if="order.assignmentType === 'location'"
                >Asignado A: {{ order.location.name }} -
                {{ order.location.code }}</template
              >
              <template v-if="order.assignmentType === 'asset'"
                >Asignado A: {{ order.asset.serial }}</template
              >
              <div>
                Asignado por: {{ order.createdBy?.name }}
                {{ order.createdBy?.lastName }}
              </div>
              <div>
                Asignado el: {{ new Date(order.createdAt).toLocaleString() }}
              </div>
            </div>
          </div>
          <div class="row p-3">
            <el-table
              :data="order.assignments"
              :row-class-name="
                ({ row }) =>
                  row.isCurrent ? '' : 'text-decoration-line-through'
              "
            >
              <el-table-column prop="target.serial" label="serial">
              </el-table-column>
              <el-table-column prop="" label="Descripción">
                <template slot-scope="{ row }">
                  <div>
                    {{ row.target.model.category.name }} -
                    {{ row.target.model?.brand?.name }} -
                    {{ row.target.model.name }}
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="p-3">
            <base-button link>
              <router-link
                :to="{ path: `/assignments/print/${order.id}` }"
                target="_blank"
              >
                Imprimir</router-link
              >
            </base-button>
          </div>
        </card>
      </modal>
    </div>
  </div>
</template>

<script>
import { BaseSwitch, Modal } from "@/components";
import {
  Select,
  Option,
  Table,
  TableColumn,
  Pagination,
  Form,
  DatePicker,
} from "element-ui";

export default {
  middleware: "authenticated",
  name: "assignments",
  components: {
    [Option.name]: Option,
    [Select.name]: Select,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Pagination.name]: Pagination,
    [Form.name]: Form,
    [DatePicker.name]: DatePicker,
    BaseSwitch,
    Modal,
  },
  data() {
    return {
      modals: {
        viewOrder: false,
        filter: false,
      },
      filters: {},
      orders: [],
      dateFilter: null,
      search: null,
      limit: 10,
      offset: 0,
      currentPage: 1,
      order: {},
    };
  },
  computed: {
    filter() {
      this.getAssignments();
      return this.filters;
    },
  },
  mounted() {
    this.getAssignments();
  },
  methods: {
    updateDateFilter() {
      if (
        this.dateFilter === null ||
        this.dateFilter === undefined ||
        this.dateFilter === ""
      ) {
        this.filters.startDate = null;
        this.filters.endDate = null;
        return;
      }
      this.filters.startDate = this.dateFilter[0];
      this.filters.endDate = this.dateFilter[1];
    },
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
        console.log(error);
      }
    },
    async showOrder(id) {
      try {
        await this.getOrder(id);
        console.log(this.order);
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

<style>
.text-decoration-line-through {
  text-decoration: line-through;
}
</style>