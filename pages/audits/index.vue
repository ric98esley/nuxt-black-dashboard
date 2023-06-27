<template>
  <div class="row">
    <div class="col-12">
      <h1>Auditorias: Historial de asignaciones</h1>
      <div class="col-12">
        <card>
          <div class="row">
            <div class="col-6">
              <base-input
                label="Buscar activo"
                v-model="filter.serial"
                clearable
              ></base-input>
            </div>
            <base-input label="Desde">
              <el-date-picker
                type="daterange"
                class="bg-transparent"
                size="large"
                clearable
                v-model="dateFilter"
                @change="updateDateFilter"
                :default-time="['00:00:00', '23:59:59']"
              >
              </el-date-picker>
            </base-input>
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
    </div>
    <div col-12>
      <card>
        <el-tabs v-model="transactionType">
          <el-tab-pane label="Salidas" name="checkout"></el-tab-pane>
          <el-tab-pane label="Entradas" name="checking"></el-tab-pane>
          <el-tab-pane label="Garantias" name="warranty"></el-tab-pane>
          <el-tab-pane label="Ventas" name="sale"></el-tab-pane>
        </el-tabs>
        <el-table :data="assignments?.assignments">
          <el-table-column label="Fecha" prop="checkoutAt">
            <template slot-scope="{ row }">
              <div v-if="transactionType == 'checkout'">
                {{ new Date(row.checkoutAt).toLocaleString() }}
              </div>
              <div v-if="transactionType == 'checking'">
                {{ new Date(row.checkingAt).toLocaleString() }}
              </div>
            </template>
          </el-table-column>

          <el-table-column sortable label="Serial" property="target.serial">
          </el-table-column>
          <el-table-column sortable label="Descripción">
            <div slot-scope="{ row }">
              {{ row.target?.model.category.name }} -
              {{ row.target?.model?.brand?.name }} -
              {{ row.target?.model.name }}
            </div>
          </el-table-column>
          <el-table-column label="Lugar">
            <div slot-scope="{ row }">
              <template v-if="row?.user">
                <b>
                  {{ row.user?.username }}
                </b>
                - {{ row.user?.name }} {{ row.user?.lastName }}
              </template>
              <template v-if="row?.location">
                <b>
                  {{ row.location?.code }}
                </b>
                -
                {{ row.location?.name }}
              </template>
              <template v-if="row?.asset">
                <b> Serial: </b>
                {{ row.asset?.serial }}
              </template>
            </div>
          </el-table-column>
          <el-table-column header-align="right">
            <div class="text-right">
              <el-tooltip content="Agregar" :open-delay="300" placement="top">
                <base-button type="info" size="sm" icon native-type="button">
                  <i class="fa fa-regular fa-clipboard-list"></i>
                </base-button>
              </el-tooltip>
            </div>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[10, 20, 30, 40, 50, 100]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="assignments.total"
        >
        </el-pagination>
      </card>
    </div>
    <!-- modals -->
    <div>
      <modal :show.sync="modals.filter">
        <card>
          <el-form @submit.native.prevent="">
            <div class="row">
              <div class="col-md-12">
                <base-input type="text" label="Tipo de asignacion">
                  <el-select
                    class="select-success"
                    filterable
                    style="width: 100%"
                    v-model="filters.assignmentType"
                    clearable
                  >
                    <el-option key="user" value="user" label="Usuario">
                    </el-option>
                    <el-option key="location" value="location" label="Lugar">
                    </el-option>
                    <el-option key="Activo" value="asset" label="Activo">
                    </el-option>
                  </el-select>
                </base-input>
                <div class="col-md-12">
                  <base-input
                    label="Asignado a"
                    type="text"
                    v-if="filters.assignmentType === 'user'"
                  >
                    <el-autocomplete
                      :trigger-on-focus="false"
                      clearable
                      v-model="target.name"
                      :fetch-suggestions="searchUsers"
                      placeholder="Buscar usuario"
                      @select="handleSelect"
                      class="w-100"
                    >
                      <template #default="{ item }">
                        <div class="value">
                          <b>{{ item.username }}</b
                          >, <span class="link">{{ item.role }}</span>
                        </div>
                      </template>
                    </el-autocomplete>
                  </base-input>
                  <base-input
                    label="Asignado a"
                    type="text"
                    v-if="filters.assignmentType === 'asset'"
                  >
                    <el-autocomplete
                      :trigger-on-focus="false"
                      clearable
                      v-model="target.serial"
                      :fetch-suggestions="searchAsset"
                      placeholder="Buscar activo"
                      @select="handleSelect"
                      class="w-100"
                    >
                      <template #default="{ item }">
                        <div class="value">
                          <b>{{ item.serial }}</b
                          >, <span class="link">{{ item.state.name }}</span>
                        </div>
                      </template>
                    </el-autocomplete>
                  </base-input>
                  <base-input
                    label="Asignado a"
                    type="text"
                    v-if="filters.assignmentType === 'location'"
                  >
                    <el-autocomplete
                      :trigger-on-focus="false"
                      clearable
                      v-model="target.name"
                      :fetch-suggestions="searchLocations"
                      placeholder="Buscar lugar"
                      @select="handleSelect"
                      class="w-100"
                    >
                      <template #default="{ item }">
                        <div class="value">
                          <b>{{ item.name }}</b
                          >, <span class="link">{{ item.code }}</span>
                        </div>
                      </template>
                    </el-autocomplete>
                  </base-input>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <base-input type="text" label="Modelo" v-model="filters.model">
                </base-input>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <base-input type="text" label="Marca" v-model="filters.brand">
                </base-input>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <base-input
                  type="text"
                  label="Categoria"
                  v-model="filters.category"
                >
                </base-input>
              </div>
            </div>
          </el-form>
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
  Tabs,
  TabPane,
  Autocomplete,
} from "element-ui";
export default {
  middleware: "authenticated",
  name: "audits",
  components: {
    [Option.name]: Option,
    [Select.name]: Select,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Pagination.name]: Pagination,
    [Form.name]: Form,
    [DatePicker.name]: DatePicker,
    [Tabs.name]: Tabs,
    [TabPane.name]: TabPane,
    [Autocomplete.name]: Autocomplete,
    BaseSwitch,
    Modal,
  },
  data() {
    return {
      transactionType: "checkout",
      dateFilter: null,
      currentPage: 1,
      modals: {
        filter: false,
      },
      target: {},
      filters: {
        userId: null,
        locationId: null,
        assetId: null,
        assignmentType: null,
        limit: 10,
        offset: 0,
        sort: "checkoutAt",
        order: "DESC",
        all: true,
        serial: null,
        isCurrent: null,
        checkingAtFrom: null,
        checkingAtTo: null,
        checkoutAtFrom: null,
        checkoutAtTo: null,
        model: null,
        category: null,
        brand: null,
      },
      assignments: {
        assignments: [],
      },
    };
  },
  watch: {
    filter() {
      this.getAssignments();
    },
  },
  computed: {
    filter() {
      this.updateDateFilter();
      this.getAssignments();
      return this.filters;
    },
  },
  mounted() {
    this.getAssignments();
  },
  methods: {
    handleSelect(item) {
      switch (this.filters.assignmentType) {
        case "user":
          this.filters.userId = item.id;
          this.filters.assetId = null;
          this.filters.locationId = null;
          break;
        case "asset":
          this.filters.userId = null;
          this.filters.assetId = item.id;
          this.filters.locationId = null;
          break;
        case "location":
          this.filters.userId = null;
          this.filters.assetId = null;
          this.filters.locationId = item.id;
          break;
        default:
          this.filters.userId = null;
          this.filters.assetId = null;
          this.filters.locationId = null;
          break;
      }
    },
    removeNullProps(obj) {
      for (let prop in obj) {
        if (obj[prop] === null || obj[prop] === undefined || obj[prop] === "") {
          delete obj[prop];
        }
      }
      return obj;
    },
    handleSizeChange(val) {
      this.filters.limit = val;
      this.getAssignments();
    },
    handleCurrentChange(val) {
      this.filters.offset = (val - 1) * this.filters.limit;
      this.getAssignments();
    },
    updateDateFilter() {
      if (
        this.dateFilter === null ||
        this.dateFilter === undefined ||
        this.dateFilter === ""
      ) {
        console.log("clean");
        this.filters.checkingAtFrom = null;
        this.filters.checkingAtTo = null;
        this.filters.checkoutAtFrom = null;
        this.filters.checkoutAtTo = null;
        return;
      }

      if (this.transactionType == "checking") {
        console.log("checking");
        this.filters.checkingAtFrom = this.dateFilter[0];
        this.filters.checkingAtTo = this.dateFilter[1];
        this.filters.checkoutAtFrom = null;
        this.filters.checkoutAtTo = null;
      }

      if (this.transactionType == "checkout") {
        console.log("checkout");
        this.filters.checkoutAtFrom = this.dateFilter[0];
        this.filters.checkoutAtTo = this.dateFilter[1];
        this.filters.checkingAtFrom = null;
        this.filters.checkingAtTo = null;
      }
    },
    async getAssignments() {
      try {
        const params = { ...this.filters };
        params.sort = `${this.transactionType}At`;
        this.removeNullProps(params);

        if (!params.assignmentType) {
          delete params.assetId;
          delete params.locationId;
          delete params.userId;
        }
        const toSend = {
          params,
        };

        const { data, error } = await this.$axios.get(
          "/orders/assignments",
          toSend
        );

        this.assignments = data;
      } catch (error) {
        console.log(error);
      }
    },
    async searchUsers(queryString, cb) {
      try {
        let toSend = {
          params: {},
        };

        if (queryString.length > 2) {
          toSend.params.username = queryString;
        }

        const { data, error } = await this.$axios.get("/users", toSend);
        cb(data.users);
      } catch (error) {
        console.log(error);
      }
    },
    async searchAsset(queryString, cb) {
      try {
        let toSend = {
          params: {},
        };

        if (queryString.length > 2) {
          toSend.params.serial = queryString;
        }

        const { data, error } = await this.$axios.get("/assets", toSend);
        cb(data.assets);
      } catch (error) {
        console.log(error);
      }
    },
    async searchLocations(queryString, cb) {
      const toSend = {
        params: {},
      };
      if (queryString.length > 2) {
        toSend.params.code = queryString;
      }

      const { data, error } = await this.$axios.get("/locations", toSend);
      cb(data.locations);
    },
    async getStatus() {
      try {
        const { data, error } = await this.$axios.get("/assets/status");
        this.states = data;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>