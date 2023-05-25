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
              {{ new Date().toLocaleString() }}
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
    <div class="col-md-6">
    </div>
    <div class="col-md-6">
      <card>
        <h4>Asignaciones actuales</h4>
        <el-table :data="location?.assignments">
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
            <template slot-scope="scope">
              {{ formatDate(scope.row.checkoutAt) }}
            </template>
          </el-table-column>
          <el-table-column label="Asignado a">
            <template slot-scope="{ row }">
              <div v-if="row.assignmentType === 'location'">
                {{ row.location?.code }}- {{ row.location?.name }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </card>
    </div>
    <div class="col-md-6">
      <card>
        <h4>Historial mantenimientos</h4>
        <el-table></el-table>
      </card>
    </div>
    <!-- Modals -->
    <div>
      <modal
        :show.sync="modals.updatelocation"
        body-classes="p-0"
        modal-classes="modal-dialog-centered"
      >
        <card class="p-3">
          <h5 slot="header" class="title">Editar activo</h5>
          <form @submit.prevent="updatelocation">
            <div class="row">
              <div class="col-md-12">
                <base-input
                  type="text"
                  label="Serial"
                  v-model="location.serial"
                  disabled
                >
                </base-input>
              </div>
            </div>

            <div class="row">
              <div class="col-md-12">
                <base-input type="text" label="Modelo">
                  <el-select
                    v-model="toUpdate.modelId"
                    filterable
                    class="select-success"
                    placeholder="Selecciona una categoria"
                    label="Categoria"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="option in models"
                      :key="option.id"
                      :value="option.id"
                      :label="`${option.category.name} - ${option.name} - ${option.brand?.name}`"
                    >
                    </el-option>
                  </el-select>
                </base-input>
              </div>
            </div>

            <div class="row">
              <div class="col-md-12">
                <base-input type="text" label="Estado">
                  <el-select
                    v-model="toUpdate.locationStateId"
                    class="select-success"
                    placeholder="Selecciona un estado"
                    label="Categoria"
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

            <base-button native-type="submit" type="primary" class="btn-fill">
              Crear activo
            </base-button>
          </form>
        </card>
      </modal>
    </div>
  </div>
</template>

<script>
import { Select, Option, Table, TableColumn, Pagination } from "element-ui";
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
    barcode: VueBarcode,
    Modal,
  },
  data() {
    return {
      id: this.$route.params.id,
      modals: {
        updatelocation: false,
      },
      location: {},
      place: {},
      toUpdate: {},
      states: [],
      models: [],
    };
  },
  mounted() {
    this.getLocation();
  },
  methods: {
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
    async getLocation() {
      const { data } = await this.$axios.get(`/locations/${this.id}`);
      this.location = data;
      console.log(data);
    },
    async updateLocation() {
      try {
        const toSend = { ...this.toUpdate };
        const { data, error } = await this.$axios.patch(
          `/locations/${this.id}`,
          toSend
        );
        this.$notify({
          message: `activo actualizado correctamente`,
          type: "success",
        });
        this.toUpdate = {};
        this.getlocation();
        this.modals.updateLocation = false;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
