<template>
  <div class="row">
    <div class="col-md-12">
      <card>
        <div class="d-flex align-items-center">
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
              </el-select>
            </base-input>
          </div>
          <div class="col-md-4">
            <base-input label="Asignar a" type="text">
              <el-autocomplete
                v-model="targetSearch"
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
          </div>
          <div class="col-md-2">
            <base-input type="text" label="Estado">
              <el-select
                v-model="assetState"
                class="select-success"
                placeholder="Selecciona un estado"
                label="Estados"
                style="width: 100%"
                name="assetState"
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
            property="model.model"
          ></el-table-column>
          <el-table-column
            min-width="100"
            sortable
            label="Tipo"
            property="model.category.name"
          ></el-table-column>
          <el-table-column
            min-width="100"
            header-align="right"
            label="Agregar"
          >
            <div slot-scope="{ row }" class="text-right">
              <el-tooltip content="Agregar" :open-delay="300" placement="top">
                <base-button
                  type="info"
                  size="sm"
                  icon
                  @click="addAssignment(row)"
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
        <div class="row">
          <div class="col-sm-6">
            <span class="h-4 text-primary">Asignar a </span>
            <b> {{ target.username }} </b>
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
          <el-table-column
            min-width="100"
            header-align="right"
            label="Borrar"
          >
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
      assetsToAssignment: [],
      assignmentType: "",
      targetSearch: "",
      target: {},
      states: {},
      assetState: null,
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
    async getUsers(queryString, cb) {
      try {
        let toSend = {
          params: {},
        };

        if (queryString.length > 2) {
          toSend.params.username = queryString;
        }

        const { data, error } = await this.$axios.get("/users", toSend);
        this.users = data;
        cb(data.users);
      } catch (error) {
        console.log(error);
      }
    },
    async getStatus() {
      try {
        console.log(this.$store.state.auth);
        const { data, error } = await this.$axios.get("/assets/status");
        this.states = data;
      } catch (error) {
        console.log(error);
      }
    },
    async getAssets() {
      try {
        let toSend = {
          params: {},
        };
        if (this.toSearchAssets.length > 3) {
          toSend.params.serial = this.toSearchAssets;
        }

        const { data, error } = await this.$axios.get("/assets", toSend);
        this.assets = data;
      } catch (error) {
        console.log(error);
      }
    },
    addAssignment(data) {
      console.log(data);
      this.assetsToAssignment.push(data);
    },
    deleteAssignment(row) {
      const index = this.assetsToAssignment.indexOf(row);
      if (index !== -1) {
        this.assetsToAssignment.splice(index, 1);
      }
    },
  },
};
</script>