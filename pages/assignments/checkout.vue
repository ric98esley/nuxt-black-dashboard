<template>
  <div class="row">
    <div class="col-md-12">
      <card>
        <div class="row">
          <div class="col-md-4">
            <base-input label="Buscar activos" v-model="toSearchAssets">
            </base-input>
          </div>
          <div class="col-md-2">
            <base-input label="Tipo de asignacion" type="text">
              <el-select
                class="select-success"
                filterable
                style="width: 100%"
                v-model="assignmentType"
              >
                <el-option key="user" value="user" label="Usuario"> </el-option>
                <el-option key="location" value="location" label="Lugar">
                </el-option>
                <el-option key="Activo" value="asset" label="Activo">
                </el-option>
              </el-select>
            </base-input>
          </div>
          <div class="col-md-2">
            <base-input
              label="Asignar a"
              type="text"
              v-if="assignmentType === 'user'"
            >
              <el-autocomplete
                :trigger-on-focus="false"
                clearable
                v-model="target.name"
                :fetch-suggestions="getUsers"
                placeholder="Buscar usuario"
                @select="handleSelect"
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
              label="Asignar a"
              type="text"
              v-if="assignmentType === 'location'"
            >
              <el-autocomplete
                :trigger-on-focus="false"
                clearable
                v-model="target.name"
                :fetch-suggestions="getLocations"
                placeholder="Buscar lugar"
                @select="handleSelect"
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
          <div class="col-md-2">
            <base-input type="text" label="Estado">
              <el-select
                v-model="assetState"
                class="select-success"
                placeholder="Selecciona un estado"
                label="Estados"
                style="width: 100%"
                name="Estado de los activo"
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
          <div class="col-md-2">
            <base-input label="Guardar">
              <base-button
                type="primary"
                native-type="button"
                @click="createCheckout"
                :disabled="!(assetsId.length > 0)"
              >
                Asignar
              </base-button>
            </base-input>
          </div>
        </div>
      </card>
    </div>

    <!-- tables -->
    <div class="col-md-7">
      <card>
        <el-table :data="assets.assets" class="table-striped">
          <el-table-column
            min-width="110"
            sortable
            label="Serial"
            property="serial"
          ></el-table-column>
          <el-table-column
            min-width="120"
            sortable
            label="Estado"
            property="state.name"
          ></el-table-column>
          <el-table-column
            min-width="100"
            label="Modelo"
            property="model.name"
          ></el-table-column>
          <el-table-column
            min-width="100"
            sortable
            label="Tipo"
            property="model.category.name"
          ></el-table-column>
          <el-table-column min-width="100" header-align="right" label="Agregar">
            <div slot-scope="{ row }" class="text-right">
              <el-tooltip content="Agregar" :open-delay="300" placement="top">
                <base-button
                  type="info"
                  size="sm"
                  icon
                  native-type="button"
                  @click="addAssignment(row)"
                  :disabled="assetsId.includes(row.id)"
                >
                  <i class="fa fa-regular fa-plus"></i>
                </base-button>
              </el-tooltip>
            </div>
          </el-table-column>
        </el-table>
      </card>
    </div>
    <div class="col-md-5">
      <card>
        <div class="row" v-if="target.name?.length > 2 && assignmentType">
          <div class="col-sm-6">
            <span class="h-4 text-primary">Asignar a </span>
            <b v-if="assignmentType === 'user'"> {{ target.username }} </b>
            <b v-if="assignmentType === 'location'"> {{ target.code }} </b>
          </div>
          <div class="col-sm-6 d-flex justify-content-end">
            <span> total asignados:&nbsp; </span>
            <b>
              {{ assetsToAssignment.length }}
            </b>
          </div>
        </div>
        <el-table :data="assetsToAssignment" class="table-striped">
          <el-table-column label="Serial" property="serial"> </el-table-column>
          <el-table-column label="Tipo" property="model.category.name">
          </el-table-column>
          <el-table-column min-width="100" header-align="right" label="Borrar">
            <div slot-scope="{ row }" class="text-right">
              <el-tooltip content="Agregar" :open-delay="300" placement="top">
                <base-button
                  type="danger"
                  size="sm"
                  icon
                  @click="deleteAssignment(row)"
                >
                  <i class="fa fa-solid fa-trash"></i>
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
import { Select, Option, Table, TableColumn, Autocomplete } from "element-ui";
import { BaseSwitch, Modal } from "@/components";

export default {
  middleware: "authenticated",
  name: "checkout",
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
      assetState: null,
      assetsToAssignment: [],
      assignmentType: "",
      targetSearch: {},
      target: {},
      states: {},
      toSearchAssets: "",
      assets: [],
      users: [],
    };
  },
  watch: {
    toSearchAssets(newState, lastState) {
      if (newState === "") {
        this.getAssets();
        return;
      }
      if (newState.length < 3) return;

      this.getAssets({
        toSearch: newState,
      });
    },
    assignmentType(newState, lastState) {
      this.target = {};
    },
  },
  computed: {
    assetsId() {
      return this.assetsToAssignment.map((asset) => {
        return asset.id;
      });
    },
  },
  beforeMount() {
    this.getStatus();
  },
  mounted() {
    this.getAssets();
  },
  methods: {
    handleSelect(item) {
      this.target = item;
    },
    handleIconClick(ev) {
      console.log(ev);
    },
    formatData(data) {
      const toSend = data.map((asset) => {
        return {
          id: asset.id,
          stateId: this.assetState,
        };
      });
      return toSend;
    },
    async getUsers(queryString, cb) {
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
    async getLocations(queryString, cb) {
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
    async getAssets() {
      try {
        let toSend = {
          params: {
            state: 'desplegable'
          },
        };
        if (this.toSearchAssets.length > 2) {
          toSend.params.serial = this.toSearchAssets;
        }

        const { data, error } = await this.$axios.get("/assets", toSend);
        this.assets = data;
      } catch (error) {
        console.log(error);
      }
    },
    addAssignment(data) {
      if (this.assetsId.includes(data.id)) return;

      this.assetsToAssignment.push(data);
    },
    deleteAssignment(row) {
      const index = this.assetsToAssignment.indexOf(row);
      if (index !== -1) {
        this.assetsToAssignment.splice(index, 1);
      }
    },
    async createCheckout() {
      let toSend = {};

      toSend.targets = this.formatData(this.assetsToAssignment);

      if (this.assignmentType === "user") {
        toSend.userId = this.target.id;
      } else if (this.assignmentType === "location") {
        toSend.locationId = this.target.id;
      } else if (this.assignmentType === "asset") {
        toSend.assetId = this.target.id;
      } else {
        this.$notify({
          message: "Debes asignar a un lugar, persona o activo",
          timeout: 3000,
          icon: "tim-icons icon-bell-55",
        });
        return;
      }
      try {
        const {data, error} = await this.$axios.post("/orders/checkout", toSend);
        this.$notify({
          message: "Activos asignado correctamente",
          timeout: 3000,
          icon: "tim-icons icon-bell-55",
        });
        window.open(`/assignments/print/${data.id}`, '_blank');
      } catch (error) {
        this.$notify({
          message: "Algo ocurrio mal",
          timeout: 3000,
          icon: "tim-icons icon-bell-55",
        });
        console.log(error);
      }
    },
  },
};
</script>