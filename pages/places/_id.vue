<template>
  <div class="row">
    <div class="col-md-6">
      <card>
        <h4>Datos de {{ location?.type?.name }}</h4>
        <form @submit.prevent="">
          <div class="row">
            <div class="col-md-6">
              <label>Nombre:</label>
              {{ location?.name }}
            </div>
            <div class="col-md-6">
              <label> Codigo:</label>
              {{ location?.code }}
            </div>
            <div class="col-md-6">
              <label> Fecha de creación</label>
              {{ new Date(location?.createdAt).toLocaleString() }}
            </div>
            <div class="col-md-6">
              <label> Direccion</label>
              {{ location?.address }}
            </div>
            <div class="col-md-6">
              <label> A cargo de</label>
              {{ location.manager?.username }}
            </div>
          </div>
        </form>
        <base-button @click="modals.updateLocation = true">
          Editar {{ location?.type?.name }}
        </base-button>
      </card>
    </div>
    <div class="col-md-6"></div>
    <div class="col-md-6">
      <card>
        <div class="row justify-content-between mr-3 ml-3">
          <h4>Asignaciones actuales: {{ assigned.total}}</h4>
          <nuxt-link
            :to="{ path: `/places/print/${location.id}` }"
            target="_blank"
          >
            Imprimir
          </nuxt-link>
        </div>
        <el-table :data="assigned?.rows">
          <el-table-column type="expand">
            <template slot-scope="{ row }">
              <div class="row">
                <div class="col-12">
                  <p>Asignado el: {{ row.checkoutAt }}</p>
                  <p>
                    Asignado por:
                      {{ row.checkoutBy.name }}
                      {{ row.checkoutBy.lastName }}
                  </p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Fecha">
            <template slot-scope="{ row }">
              {{ new Date(row.checkoutAt).toLocaleString() }}
            </template>
          </el-table-column>
          <el-table-column label="Serial" prop="target.serial">
          </el-table-column>
          <el-table-column label="Descripción">
            <template slot-scope="{ row }">
              <div>
                {{ row.target.model.category.name }} -
                {{ row.target.model?.brand?.name }} -
                {{ row.target.model.name }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </card>
    </div>
    <div class="col-md-6">
      <card>
        <h4>Asignaciones antiguas</h4>
        <el-table :data="location?.oldAssignments">
          <el-table-column type="expand">
            <template slot-scope="{ row }">
              <div class="row">
                <div class="col-12">
                  <p>Asignado el: {{ row.checkoutAt }}</p>
                  <p>
                    Asignado por:
                    <router-link to="/">
                      {{ row.checkoutBy.name }}
                      {{ row.checkoutBy.lastName }}</router-link
                    >
                  </p>
                </div>
                <div class="col-12" v-if="row.checkingAt">
                  <p>Recibido el: {{ row.checkingAt }}</p>
                  Recibido por:
                  <router-link to="#">
                    {{ row.checkingBy.name }}
                    {{ row.checkingBy.lastName }}
                  </router-link>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Fecha" prop="checkoutAt">
            <template slot-scope="{ row }">
              {{ new Date(row.checkoutAt).toLocaleString() }}
            </template>
          </el-table-column>
          <el-table-column label="serial" prop="target.serial">
          </el-table-column>
          <el-table-column label="Descripción">
            <template slot-scope="{ row }">
              <div>
                {{ row.target.model.category.name }} -
                {{ row.target.model?.brand?.name }} -
                {{ row.target.model.name }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </card>
    </div>
    <!-- Modals -->
    <div>
      <modal
        :show.sync="modals.updateLocation"
        modal-classes="modal-dialog-centered modal-lg"
      >
        <card class="p-3">
          <h5 slot="header" class="title">Actualizar localización</h5>
          <form @submit.prevent="updateLocation">
            <div class="row">
              <div class="col-lg-4">
                <base-input type="text" label="Nombre" v-model="toUpdate.name">
                </base-input>
              </div>
              <div class="col-lg-4">
                <base-input
                  type="text"
                  label="Codigo"
                  v-model="location.code"
                  disabled
                >
                </base-input>
              </div>
              <div class="col-lg-4">
                <base-input type="text" label="Zona">
                  <el-select
                    v-model="toUpdate.zoneId"
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
                    v-model="toUpdate.typeId"
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
                  v-model="toUpdate.phone"
                ></base-input>
              </div>
              <div class="col-lg-6">
                <base-input
                  label="Rif del local"
                  v-model="toUpdate.rif"
                ></base-input>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-12">
                <base-input
                  v-model="toUpdate.address"
                  class="select-success"
                  placeholder="Calle falsa al lado de la casa de mentiras"
                  label="Dirección"
                >
                </base-input>
              </div>
            </div>

            <base-button native-type="submit" type="primary" class="btn-fill">
              actualizar
            </base-button>
          </form>
        </card>
      </modal>
    </div>
  </div>
</template>

<script>
import {
  Select,
  Option,
  Table,
  TableColumn,
  Pagination,
  Autocomplete,
} from "element-ui";
import VueBarcode from "vue-barcode";
import { BaseSwitch, Modal } from "@/components";

export default {
  name: "PlaceDetails",
  middleware: "authenticated",
  components: {
    [Option.name]: Option,
    [Select.name]: Select,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Pagination.name]: Pagination,
    [Autocomplete.name]: Autocomplete,
    barcode: VueBarcode,
    Modal,
  },
  data() {
    return {
      id: this.$route.params.id,
      modals: {
        updateLocation: false,
      },
      locationTypes: {},
      locations: {},
      groups: {},
      zones: [],
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
      assigned: {},
      parent: {},
      manager: {},
      group: {},
      place: {},
      states: [],
      models: [],
    };
  },
  mounted() {
    this.getAssigned();
    this.getZones();
    this.getLocationType();
  },
  computed: {
    toUpdate() {
      return { ...this.location };
    },
  },
  watch: {
    manager(newState, lastState) {
      this.toUpdate.managerId = newState.id;
    },
    parent(newState, lastState) {
      this.toUpdate.parentId = newState.id;
    },
    group(newState, lastState) {
      this.toUpdate.groupId = newState.id;
    },
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
    async print() {
      console.log(this.$Printd.print(document.getElementById("barcode")));
    },
    formatDate(dateString) {
      // Crear un objeto de fecha a partir de la cadena de fecha

      const fecha = new Date(dateString);

      // Obtener el año, mes y día en formato de número
      const year = fecha.getFullYear();
      const month = fecha.getMonth() + 1;
      const day = fecha.getDate();

      // Crear un string con la fecha en formato "yyyy-mm-dd"
      const fechaFormateada = `${day.toString().padStart(2, "0")}-${month
        .toString()
        .padStart(2, "0")}-${year}
      `;

      return fechaFormateada;
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
    async getLocation() {
      try {
        const { data } = await this.$axios.get(`/locations/${this.id}`);
        this.location = data;
      } catch (error) {
        console.log(error);
      }
    },
    async getAssigned() {
      try {
        const { data } = await this.$axios.get(`/locations/${this.id}/assets`);
        this.assigned = data.assigned;
        this.location = data.target;
      } catch (error) {
        console.log(error);
      }
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
      try {
        const toSend = {
          params: {},
        };

        const { data, error } = await this.$axios.get("/locations/zones");

        this.zones = data;
      } catch (error) {
        console.log(error);
      }
    },
    async updateLocation() {
      try {
        const toSend = {};
        for (let item in this.toUpdate) {
          if (!(this.toUpdate[item] === this.location[item])) {
            toSend[item] = this.toUpdate[item];
          }
        }

        const { data, error } = await this.$axios.patch(
          `/locations/${this.id}`,
          toSend
        );
        this.$notify({
          message: `${this.toUpdate.type.name} actualizado correctamente`,
          type: "success",
        });
        await this.getLocation();
        this.modals.updateLocation = false;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
