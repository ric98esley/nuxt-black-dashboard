<template>
  <div class="row">
    <div class="col-md-6">
      <card>
        <h4>Datos del activo</h4>
        <form @submit.prevent="">
          <div class="row">
            <div class="col-md-6">
              <label>Serial:</label>
              {{ asset?.serial }}
            </div>
            <div class="col-md-6">
              <label> Creado por:</label>
              {{ asset?.createdBy?.username }}
            </div>
            <div class="col-md-6">
              <label> Fecha de creación</label>
              {{ formatDate(asset?.createdAt) }}
            </div>
            <div class="col-md-6">
              <label> Número de entradas</label>
              {{ asset?.countChecking }}
            </div>
            <div class="col-md-6">
              <label> Modelo</label>
              {{ asset?.model?.model }}
            </div>
            <div class="col-md-6">
              <label> Categoria</label>
              {{ asset?.model?.category.name }}
            </div>
            <div class="col-md-6">
              <label> Estado</label>
              {{ asset?.state?.name }}
            </div>
          </div>
        </form>
        <base-button @click="modals.updateAsset = true">
          Editar activo
        </base-button>
      </card>
    </div>
    <div class="col-md-6">
      <card>
        <div id="barcode" @click="print">
          <barcode
            :value="asset?.serial"
            format="CODE128"
            width="1"
            height="30"
          ></barcode>
        </div>
      </card>
    </div>
    <div class="col-md-6">
      <card>
        <h4>Historial de asignaciones</h4>
        <el-table :data="asset?.assignments">
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
            <template slot-scope="{ row }">
              <div v-if="row.assignmentType === 'user'">
                {{ row.user?.name }} {{ row.user?.lastName }}
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
        :show.sync="modals.updateAsset"
        body-classes="p-0"
        modal-classes="modal-dialog-centered"
      >
        <card class="p-3">
          <h5 slot="header" class="title">Editar activo</h5>
          <form @submit.prevent="updateAsset">
            <div class="row">
              <div class="col-md-12">
                <base-input
                  type="text"
                  label="Serial"
                  v-model="asset.serial"
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
                    v-model="toUpdate.stateId"
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
  name: "AssetDetails",
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
      asset: {},
      id: this.$route.params.id,
      modals: {
        updateAsset: false,
      },
      toUpdate: {
      },
      states: [],
      models: [],
    };
  },
  mounted() {
    this.getStatus();
    this.getModels();
    this.getAsset();
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
    async getAsset() {
      const { data } = await this.$axios.get(
        `/assets/${this.id}`
      );
      this.asset = data;
    },
    async getStatus() {
      try {
        const { data, error } = await this.$axios.get("/assets/status");
        this.states = data;
      } catch (error) {
        console.log(error);
      }
    },
    async getModels() {
      try {
        const { data, error } = await this.$axios.get("/assets/models");
        this.models = data;
      } catch (error) {
        console.log(error);
      }
    },
    async updateAsset() {
      try {
        const toSend = {...this.toUpdate}
        const { data, error } = await this.$axios.patch(`/assets/${this.id}`, toSend);
        this.$notify({
          message: `activo actualizado correctamente`,
          type: "success",
        })
        this.toUpdate = {}
        this.getAsset();
        this.modals.updateAsset = false
      } catch (error) {
        console.log(error)
      }
    },
  },
};
</script>
