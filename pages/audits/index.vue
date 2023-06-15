<template>
  <div class="row">
    <div class="col-12">
      <h1>Auditorias: Historial de asignaciones</h1>
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
      </card>
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
    BaseSwitch,
    Modal,
  },
  data() {
    return {
      transactionType: "checkout",
      dateFilter: null,
      filters: {
        userId: null,
        locationId: null,
        assetId: null,
        assignmentType: null,
        limit: 50,
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
    removeNullProps(obj) {
      for (let prop in obj) {
        if (obj[prop] === null || obj[prop] === undefined || obj[prop] === "") {
          delete obj[prop];
        }
      }
      return obj;
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
  },
};
</script>