<template>
  <div class="row">
    <div class="col-12">
      <h1>Crear varios activos</h1>
    </div>

    <card class="col-md-4">
      <el-form @submit.native.prevent="addAsset">
        <div class="row">
          <div class="col-md-12">
            <base-input type="text" label="Serial" v-model="asset.serial">
            </base-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <base-input type="text" label="Modelo">
              <el-select
                v-model="asset.modelId"
                filterable
                class="select-success"
                placeholder="Selecciona una modelo"
                label="Modelo"
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
                v-model="asset.stateId"
                class="select-success"
                placeholder="Selecciona un estado"
                label="Estado"
                style="width: 100%"
                filterable
              >
                <el-option
                  v-for="option in states"
                  :key="option.id"
                  :value="option.id"
                  :label="`${option.id} - ${option.name}`"
                >
                  {{ option.id }} - {{ option.name }}
                </el-option>
              </el-select>
            </base-input>
          </div>
        </div>

        <base-button @click="addAsset" type="success" class="btn-fill" :disabled="!asset.serial || !asset.modelId || !asset.stateId">
          Añadir activo
        </base-button>
      </el-form>
    </card>
    <card class="col-md-8">
      <el-table :data="assets"
        >
        <el-table-column sortable label="Serial" property="serial">
        </el-table-column>
        <el-table-column sortable label="Modelo">


        </el-table-column>
        <el-table-column min-width="100" header-align="right" label="Borrar">
          <div slot-scope="{ row }" class="text-right">
            <el-tooltip content="Eliminar" :open-delay="300" placement="top">
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
</template>
<script>
import { BaseSwitch, Modal } from "@/components";
import {
  Select,
  Option,
  Table,
  TableColumn,
  Pagination,
  Form,
  DatePicker,
} from "element-ui";

export default {
  middleware: "authenticated",
  components: {
    [Option.name]: Option,
    [Select.name]: Select,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Pagination.name]: Pagination,
    [Form.name]: Form,
    [DatePicker.name]: DatePicker,
    BaseSwitch,
    Modal,
  },
  data() {
    return {
      asset: {
        serial: null,
        modelId: null,
        stateId: null,
      },
      assets: [],
      brands: [],
      categories: [],
      models: [],
      states: [],
    };
  },
  mounted() {
    this.getModels();
    this.getStatus();
    this.getCategories();
    this.getBrands();
  },
  methods: {
    async getModels() {
      try {
        const { data, error } = await this.$axios.get("/assets/models");
        this.models = data;
      } catch (error) {
        console.log(error);
      }
    },
    async getCategories() {
      try {
        const { data, error } = await this.$axios.get("/assets/categories");
        this.categories = data;
      } catch (error) {
        console.log(error);
      }
    },
    async getStatus() {
      try {
        const { data, error } = await this.$axios.get("/assets/status");
        this.states = data;
      } catch (error) {
        console.log(error);
      }
    },
    async getBrands() {
      try {
        const { data, error } = await this.$axios.get("/assets/brands");
        this.brands = data;
      } catch (error) {
        console.log(error);
      }
    },
    removeNullProps(obj) {
      for (let prop in obj) {
        if (obj[prop] === null || obj[prop] === undefined || obj[prop] === "") {
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
    addAsset() {
      const toAdd = { ...this.asset };
      if(!toAdd.serial || !toAdd.modelId || !toAdd.stateId) return;
      this.assets.push(toAdd);
    },
  },
};
</script>
