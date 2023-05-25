<template>
  <div class="row">
    <h1>Lugares</h1>
    <div class="col-md-12">
      <card class="">
        <base-input label="Buscar Lugar" v-model="search"></base-input>
      </card>
    </div>
    <!-- table -->
    <div class="col-md-9">
      <card>
        <el-table :data="locations.locations" class="table-striped">
          <el-table-column
            min-width="150"
            sortable
            label="Nombre"
            property="name"
          >
          </el-table-column>
          <el-table-column
            min-width="150"
            sortable
            label="Codigo"
            property="code"
          >
          </el-table-column>
          <el-table-column
            min-width="150"
            sortable
            label="Dirección"
            property="address"
          >
          </el-table-column>
          <el-table-column
            min-width="150"
            sortable
            label="Zona"
            property="zone.zoneName"
          >
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[10, 20]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="locations.total"
        >
        </el-pagination>
      </card>
    </div>
    <!-- buttons -->
    <div class="col-md-3">
      <card>
        <base-button
          type="success"
          class=""
          @click="modals.createLocation = true"
        >
          Crear lugar
        </base-button>
        <base-button type="success" class="" @click="modals.createZone = true">
          Crear zona
        </base-button>
      </card>
    </div>

    <!-- modals -->
    <template>
      <modal
        :show.sync="modals.createLocation"
        modal-classes="modal-dialog-centered modal-lg"
      >
        <card class="p-3">
          <h5 slot="header" class="title">Crear localización</h5>
          <form @submit.prevent="addLocation">
            <div class="row">
              <div class="col-lg-4">
                <base-input type="text" label="Nombre" v-model="location.name">
                </base-input>
              </div>
              <div class="col-lg-4">
                <base-input type="text" label="Codigo" v-model="location.code">
                </base-input>
              </div>
              <div class="col-lg-4">
                <base-input type="text" label="Zona">
                  <el-select
                    v-model="location.zoneId"
                    class="select-success"
                    placeholder="Selecciona una zona"
                    style="width: 100%"
                    filterable
                  >
                    <el-option
                      v-for="option in zones"
                      :key="option.id"
                      :value="option.id"
                      :label="option.zoneName"
                    >
                    </el-option>
                  </el-select>
                </base-input>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-4">
                <base-input type="text" label="Padre">
                  <el-autocomplete
                    class="w-100"
                    :trigger-on-focus="false"
                    clearable
                    v-model="parent.code"
                    :fetch-suggestions="getParent"
                    placeholder="Buscar lugar"
                    @select="handleSelectParent"
                  >
                    <template #default="{ item }">
                      <div class="value">
                        <b>{{ item.name }}</b
                        >,
                        <span class="link">{{ item.code }}</span>
                      </div>
                    </template>
                  </el-autocomplete>
                </base-input>
              </div>
              <div class="col-lg-4">
                <base-input type="text" label="Tipo">
                  <el-select
                    v-model="location.typeId"
                    class="select-success"
                    placeholder="Selecciona un tipo"
                  >
                    <el-option
                      v-for="option in locationTypes.types"
                      :key="option.id"
                      :value="option.id"
                      :label="option.name"
                    >
                    </el-option>
                  </el-select>
                </base-input>
              </div>
              <div class="col-lg-4">
                <base-input label="A cargo de" type="text">
                  <el-autocomplete
                    class="w-100"
                    :trigger-on-focus="false"
                    clearable
                    v-model="manager.name"
                    :fetch-suggestions="getUsers"
                    placeholder="Buscar usuario"
                    @select="handleSelectManager"
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
              <div class="col-lg-12">
                <base-input label="Grupo">
                  <el-autocomplete
                    class="w-100"
                    :trigger-on-focus="false"
                    clearable
                    v-model="group.name"
                    :fetch-suggestions="getGroups"
                    placeholder="Buscar grupos"
                    @select="handleSelectGroup"
                  >
                    <template #default="{ item }">
                      <div class="value">
                        <b>{{ item.code }}</b
                        >, <span class="link">{{ item.name }}</span>
                      </div>
                    </template>
                  </el-autocomplete>
                </base-input>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-6">
                <base-input
                  label="Telefono del local"
                  v-model="location.phone"
                ></base-input>
              </div>
              <div class="col-lg-6">
                <base-input
                  label="Rif del local"
                  v-model="location.rif"
                ></base-input>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-12">
                <base-input
                  v-model="location.address"
                  class="select-success"
                  placeholder="Calle falsa al lado de la casa de mentiras"
                  label="Dirección"
                >
                </base-input>
              </div>
            </div>

            <base-button native-type="submit" type="primary" class="btn-fill">
              Crear localizacion
            </base-button>
          </form>
        </card>
      </modal>
      <!-- ZONA -->
      <modal
        :show.sync="modals.createZone"
        modal-classes="modal-dialog-centered modal-sm"
      >
        <card class="p-3">
          <h5 slot="header" class="title">Crear zona</h5>
          <form @submit.prevent="addZone">
            <div class="row">
              <div class="col-md-12">
                <base-input type="text" label="Nombre" v-model="zone.zoneName">
                </base-input>
              </div>
            </div>

            <base-button native-type="submit" type="primary" class="btn-fill">
              Crear zona
            </base-button>
          </form>
        </card>
      </modal>
    </template>
  </div>
</template>
<script>
import { BaseSwitch, Modal, BasePagination } from "@/components";
import { Select, Option, Table, TableColumn, Autocomplete, Pagination } from "element-ui";

export default {
  middleware: "authenticated",
  components: {
    [Option.name]: Option,
    [Select.name]: Select,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Autocomplete.name]: Autocomplete,
    [Pagination.name]: Pagination,
    BasePagination,
    BaseSwitch,
    Modal,
  },
  data() {
    return {
      currentPage: 1,
      search: "",
      limit: 10,
      offset: 0,
      locationTypes: {},
      locations: {},
      groups: {},
      zones: [],
      modals: {
        createLocation: false,
        createZone: false,
      },
      manager: {},
      parent: {},
      group: {},
      zone: {
        zoneName: null,
      },
      location: {
        code: null,
        name: null,
        typeId: null,
        groupId: null,
        phone: null,
        rif: null,
        parentId: null,
        managerId: null,
        zoneId: null,
        address: null,
      },
    };
  },
  watch: {
    search(newState, lastState) {
      if (newState === "") {
        this.getLocations();
        return;
      }
      if (newState.length < 3) return;

      this.getLocations();
    },
    manager(newState, lastState) {
      this.location.managerId = newState.id;
    },
    parent(newState, lastState) {
      this.location.parentId = newState.id;
    },
    group(newState, lastState) {
      this.location.groupId = newState.id;
    },
  },
  beforeMount() {
    this.getLocationType();
    this.getLocations();
  },
  mounted() {
    this.getZones();
  },
  methods: {
    handleSelectParent(item) {
      this.parent = item;
    },
    handleSelectManager(item) {
      this.manager = item;
    },
    handleSelectGroup(item) {
      this.group = item;
    },
    handleIconClick(ev) {
      console.log(ev);
    },
    handleSizeChange(val) {
      this.limit = val;
      this.getLocations();
    },
    handleCurrentChange(val) {
      this.offset = (val - 1) * this.limit;
      this.getLocations();
    },
    removeNullProps(obj) {
      for (let prop in obj) {
        if (obj[prop] === null) {
          delete obj[prop];
        }
      }
      return obj;
    },
    resetObject(obj) {
      for (let prop in obj) {
        obj[prop] = null;
      }
      return obj;
    },
    handleSelect(item) {
      this.manager = item;
    },
    async getLocationType() {
      try {
        const { data, error } = await this.$axios.get("/locations/types");
        this.locationTypes = data;
      } catch (error) {
        console.log(error);
      }
    },
    async getParent(queryString, cb) {
      const toSend = {
        params: {},
      };
      if (queryString.length > 2) {
        toSend.params.code = queryString;
      }

      const { data, error } = await this.$axios.get("/locations", toSend);
      cb(data.locations);
    },
    async addLocation() {
      try {
        let toSend = { ...this.location };
        const { data, error } = await this.$axios.post("/locations", toSend);
        this.resetObject(this.location);
        this.getLocations();
        this.$notify({
          message: `Agencia creada correctamente:
          ${data.name} - ${data.code}
          `,
          type: "success",
        });
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    },
    async addZone() {
      try {
        let toSend = { ...this.zone };
        this.removeNullProps(toSend);
        const { data, error } = await this.$axios.post(
          "/locations/zones",
          toSend
        );
        this.resetObject(this.zone);
        this.getZones();
        this.$notify({
          message: `Zona creada: ${data.zoneName}`,
          type: "success",
        });
      } catch (error) {
        console.log(error);
      }
    },
    async getLocations() {
      const toSend = {
        params: {},
      };
      if (this.search.length > 2) {
        toSend.params.code = this.search;
      }
      toSend.params.limit = this.limit;
      toSend.params.offset = this.offset;
      const { data, error } = await this.$axios.get("/locations", toSend);
      this.locations = data;
    },
    async getGroups(queryString, cb) {
      const toSend = {
        params: {},
      };
      if (queryString.length > 2) {
        toSend.params.code = queryString;
      }
      const { data, error } = await this.$axios.get("/groups", toSend);
      cb(data.groups);
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
    async getZones() {
      const toSend = {
        params: {},
      };
      if (this.search.length > 2) {
        toSend.params.name = this.search;
      }
      toSend.params.limit = this.limit;
      toSend.params.offset = this.offset;

      const { data, error } = await this.$axios.get("/locations/zones");

      this.zones = data;
      console.log(this.zones);
    },
  },
};
</script>