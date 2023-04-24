<template>
  <div class="row">
    <h1>Lugares</h1>
    <div class="col-md-12">
      <card class="">
        <base-input label="Buscar Lugar"></base-input>
      </card>
    </div>
    <!-- table -->
    <div class="col-md-9">
      <card>
        <el-table :data="locations.locations" class="table-striped">
          <el-table-column min-width="150" sortable label="Nombre" property="name">
          </el-table-column>
          <el-table-column min-width="150" sortable label="Codigo" property="name">
          </el-table-column>
        </el-table>
      </card>
    </div>
    <!-- buttons -->
    <div class="col-md-3">
      <card>
        <base-button type="success" class=""  @click="modals.createLocation = true"> Crear lugar </base-button>
      </card>
    </div>
    <template>
      <modal :show.sync="modals.createLocation">
        <card class="p-3">
          <h5 slot="header" class="title">Crear localización</h5>
          <form @submit.prevent="addLocation">
            <div class="row">
              <div class="col-md-12">
                <base-input type="text" label="Nombre del modelo" v-model="model.model">
                </base-input>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <base-input type="text" label="Modelo">
                  <el-select v-model="model.categoryId" class="select-success" placeholder="Selecciona una categoria"
                    label="Categoria" style="width: 100%">
                    <el-option v-for="option in categories" :key="option.id" :value="option.id" :label="option.name">
                    </el-option>
                  </el-select>
                </base-input>
              </div>
            </div>

            <base-button native-type="submit" type="primary" class="btn-fill">
              Crear localizacion
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
      locations: {},
      modals: {
        createLocation: false,
      },
    };
  },
  mounted() {
    this.getLocations();
  },
  methods: {
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
  },
};
</script>