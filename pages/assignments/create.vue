<template>
  <div class="row">
    <div class="col-md-12">
      <card>
        <div class="d-flex align-items-center">
          <div class="col-md-4">
            <base-input label="Buscar activos"></base-input>
          </div>
          <div class="col-md-2">
            <base-input label="Tipo de asignacion" type="text">
              <el-select class="select-success" filterable style="width: 100%">
                <el-option key="user" value="user" label="Usuario"> </el-option>
                <el-option key="location" value="location" label="Lugar">
                </el-option>
              </el-select>
            </base-input>
          </div>
          <div class="col-md-4">
            <base-input label="Asignar a" type="text"> </base-input>
          </div>
          <div class="col-md-2">
            <base-input type="text" label="Estado">
              <el-select
                v-model="assetStateId"
                class="select-success"
                placeholder="Selecciona un estado"
                label="Estados"
                style="width: 100%"
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
          </div>
        </div>
      </card>
    </div>
    <div class="col-md-6">
      <card>
        <el-table>
          <el-table-column lable="test"> </el-table-column>
        </el-table>
      </card>
    </div>
    <div class="col-md-6">
      <card>
        <el-table>
          <el-table-column lable="test"> </el-table-column>
        </el-table>
      </card>
    </div>
  </div>
</template>

<script>
import { Select, Option, Table, TableColumn, Autocomplete } from "element-ui";
import { BaseSwitch, Modal } from "@/components";

export default {
  middleware: "authenticated",
  name: "create_assignments",
  components: {
    [Option.name]: Option,
    [Select.name]: Select,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Autocomplete.name]: Autocomplete,
    BaseSwitch,
    Modal,
  },
  data() {
    return {
      states: "",
      assetStateId: "",
      toSearch: "",
      assets: [],
    };
  },
  computed: {
    assetsOnSearch() {
      return this.assets;
    },
  },
  watch: {
    toSearch(newState, lastState) {
      if (newState === "") {
        this.getAssets({});
        return;
      }
      if (newState.length < 3) return;

      this.getAssets({
        toSearch: newState,
      });
    },
  },
  beforeMount() {
    this.getStatus();
  },
  mounted() {
    this.getAssets({});
  },
  methods: {
    async getStatus() {
      try {
        console.log(this.$store.state.auth);
        this.$axios.setToken(this.$store.state.auth.token, "Bearer");
        const { data, error } = await this.$axios.get("/assets/status");
        this.states = data;
      } catch (error) {
        console.log(error);
      }
    },
    async getAssets({ toSearch, limit, offset }) {
      try {
        let toSend = {
          params: {},
        };
        if (toSearch) {
          toSend.params.serial = toSearch;
        }

        if (limit && offset) {
          toSend.params.limit = limit;
          toSend.params.offset = offset;
        }
        this.$axios.setToken(this.$store.state.auth.token, "Bearer");
        const { data, error } = await this.$axios.get("/assets", toSend);
        console.log(data);
        this.assets = data;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>