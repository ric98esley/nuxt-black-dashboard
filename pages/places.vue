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
              <div class="col-md-4">
                <base-input type="text" label="Nombre" v-model="location.name">
                </base-input>
              </div>
              <div class="col-md-4">
                <base-input type="text" label="Codigo" v-model="location.code">
                </base-input>
              </div>
              <div class="col-md-4">
                <base-input type="text" label="Zona">
                  <el-select
                    v-model="location.zoneId"
                    class="select-success"
                    placeholder="Selecciona una zona"
                    style="width: 100%"
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
              <div class="col-md-4">
                <base-input type="text" label="Padre">
                  <el-select
                    v-model="location.locationParent"
                    class="select-success"
                    placeholder="Selecciona un padre"
                  >
                  </el-select>
                </base-input>
              </div>
              <div class="col-md-4">
                <base-input v-model="location.managerId" label="A cargo de">
                </base-input>
              </div>
              <div class="col-md-4">
                <base-input v-model="location.type" label="Tipo de lugar">
                </base-input>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
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

export default {
  middleware: "authenticated",
  components: {
    BaseSwitch,
    Modal,
    BasePagination,
  },
  data() {
    return {
      currentPage: 1,
      search: "",
      limit: 10,
      offset: 0,
      locations: [],
      zones: [],
      modals: {
        createLocation: false,
        createZone: false,
      },
      zone: {
        zoneName: null,
      },
      location: {
        name: null,
        type: null,
        code: null,
        locationParent: null,
        address: null,
        managerId: null,
        zoneId: null,
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
  },
  beforeMount() {
    this.getLocations();
  },
  mounted() {
    this.getZones();
  },
  methods: {
    handleSizeChange(val) {
      console.log(`${val} items per page`);
      this.limit = val;
      this.getUsers();
    },
    handleCurrentChange(val) {
      console.log(`current page: ${val}`);
      this.offset = (val - 1) * this.limit;
      console.log(this.offset);
      this.getUsers();
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
    async getLocations() {
      const toSend = {
        params: {},
      };
      if (this.search.length > 2) {
        toSend.params.name = this.search;
      }
      toSend.params.limit = this.limit;
      toSend.params.offset = this.offset;

      const { data, error } = await this.$axios.get("/locations", toSend);

      this.locations = data;
      console.log(this.locations);
    },
    async addLocation() {
      try {
        let toSend = { ...this.location };
        this.removeNullProps(toSend);
        const { data, error } = await this.$axios.post("/locations", toSend);
        this.resetObject(this.location);
        this.getLocations();
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
        console.log(data);
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