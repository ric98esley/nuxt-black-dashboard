<template>
  <div class="row">
    <div class="col-12">
      <h1>Auditorias: Historial de asignaciones</h1>
    </div>
    <div col-12>
      <card>
        <el-tabs v-model="transactionType">
          <el-tab-pane label="Salidas" name="checkout"></el-tab-pane>
          <el-tab-pane label="Entradas" name="checking"></el-tab-pane>
          <el-tab-pane label="Garantias" name="warranty"></el-tab-pane>
          <el-tab-pane label="Ventas" name="sale"></el-tab-pane>
        </el-tabs>
        <el-table :data="assignments.assignments">
          <el-table-column label="Fecha" prop="checkoutAt" min-width="150">
            <template slot-scope="{ row }">
              {{ new Date(row.checkoutAt).toLocaleString() }}
            </template>
          </el-table-column>

          <el-table-column sortable label="Serial" property="target.serial">
          </el-table-column>
          <el-table-column label="Lugar" slot-scope="{ row }">
            <div>
              <template v-if="row?.user">
                <b>
                  {{ row.user?.username }}
                </b>
                - {{ row.user?.name }} {{ row.user?.lastName }}
              </template>
              <template v-if="row.location">
                <b>
                  {{ row.location?.code }}
                </b>
                -
                {{ row.location?.name }}
              </template>
              <template v-if="row.asset">
                <b> Serial: </b>
                {{ row.asset?.serial }}
              </template>
            </div>
          </el-table-column>
          <el-table-column header-align="right">
            <div slot-scope="{ row }" class="text-right">
              <el-tooltip content="Agregar" :open-delay="300" placement="top">
                <base-button type="info" size="sm" icon native-type="button">
                  <i class="fa fa-regular fa-plus"></i>
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
      filters: {
        userId: null,
        locationId: null,
        assetId: null,
        targetId: null,
        assignmentType: null,
        limit: null,
        offset: null,
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
      assignments: {},
    };
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
    async getAssignments() {
      try {
        const params = { ...this.filters };
        this.removeNullProps(params);
        const toSend = {
          params,
        };

        const { data, error } = await this.$axios.get(
          "/orders/assignments",
          toSend
        );

        this.assignments = data;
        console.log(this.assignments);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>