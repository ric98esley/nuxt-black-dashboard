<template>
  <div class="row">
    <card>
      <div class="d-flex align-items-center">
        <div class="col-md-9">
          <label for="">Buscar activo</label>
          <el-select
            v-model="toSearch"
            class="select-success"
            placeholder="Coloca el serial de un equipo"
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="asset in assetsOnSearch.assets"
              :key="asset.id"
              :value="asset.serial"
              :label="asset.serial"
            >
            </el-option>
          </el-select>
        </div>
        <div class="col-md-2">
          <base-button type="primary">Agregar</base-button>
        </div>
      </div>
    </card>
  </div>
</template>

<script>
import {
  Select,
  Option,
  Table,
  TableColumn,
  Autocomplete,
} from "element-ui";
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
        this.getAssets({
        });
        return;
      }
      if (newState.length < 3) return;

      this.getAssets({
        toSearch: newState,
      });
    },
  },
  mounted() {
    this.getAssets({})
  },
  methods: {
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