<template>
  <div class="row">
    <div class="col-md-6">
      <card>
        <h4>Datos de {{ user?.username }}</h4>
        <form @submit.prevent="">
          <div class="row">
            <div class="col-md-6">
              <label>Nombre:</label>
              {{ user?.name }} {{ user?.lastName }}
            </div>
            <div class="col-md-6">
              <label> Cedula:</label>
              {{ user?.cardId }}
            </div>
            <div class="col-md-6">
              <label> Fecha de creación</label>
              {{ new Date(user?.createdAt).toLocaleString() }}
            </div>
            <div class="col-md-6">
              <label> Direccion</label>
              {{ user?.address }}
            </div>
            <div class="col-md-6">
              <label> Telefono</label>
              {{ user.phone }}
            </div>
          </div>
        </form>
        <base-button @click="modals.updateUser = true">
          Editar usuario
        </base-button>
      </card>
    </div>
    <div class="col-md-6"></div>
    <div class="col-md-6">
      <card>
        <div class="row justify-content-between mr-3 ml-3">
          <h4>Asignaciones actuales: {{ assigned.total }}</h4>
          <nuxt-link :to="{ path: `/users/print/${user.id}` }" target="_blank">
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
                <div class="col-12" v-if="row.checkingAt">
                  <p>Recibido el: {{ row.checkingAt }}</p>
                  Recibido por:
                    {{ row.checkingBy.name }}
                    {{ row.checkingBy.lastName }}
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
        <el-table :data="user?.oldAssignments">
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
    <div></div>
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
        updateUser: false,
      },
      assigned: {},
      user: {
        username: null,
        name: null,
        lastName: null,
        isActive: null,
        email: null,
        phone: null,
        cardId: null,
        address: null,
        role: null,
      },
    };
  },
  mounted() {
    this.getUser();
  },
  computed: {},
  watch: {},
  methods: {
    async getUser() {
      try {
        const { data } = await this.$axios.get(`/users/${this.id}/assets`);
        this.user = data.target;
        this.assigned = data.assigned;
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
