<template>
  <div class="row">
    <div class="col-md-12">
      <h1>Activos</h1>
    </div>
    <div class="col-12">
      <card>
        <div class="row">
          <div class="col-11">
            <base-input label="Buscar activo" v-model="search"></base-input>
          </div>
          <div class="col-1 row justify-content-center align-items-center">
            <el-tooltip content="Filtrar" :open-delay="300" placement="top">
              <base-button
                type="info"
                size="sm"
                icon
                @click="modals.filter = true"
              >
                <i class="fa fa-solid fa-filter"></i>
              </base-button>
            </el-tooltip>
          </div>
        </div>
      </card>
    </div>
    <!-- table -->
    <card class="col-md-9">
      <h4 slot="header" class="card-title">Lista de activos</h4>
      <el-table :data="assets.assets" class="table-striped">
        <el-table-column type="expand">
          <template slot-scope="props">
            <p>
              Creado por: {{ props.row.createdBy.name }}
              {{ props.row.createdBy.lastName }}
            </p>
            <p>
              Creado el : {{ new Date(props.row.createdAt).toLocaleString() }}
            </p>
          </template>
        </el-table-column>
        <el-table-column sortable label="Serial" property="serial">
        </el-table-column>
        <el-table-column
          sortable
          label="Estado"
          property="state.name"
        ></el-table-column>
        <el-table-column label="Descripción">
          <template slot-scope="{ row }">
            <div>
              {{ row.model?.category.name }} - {{ row.model?.brand?.name }} -
              {{ row.model.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column header-align="right">
          <div slot-scope="{ row }" class="text-right">
            <el-tooltip content="Información" :open-delay="300" placement="top">
              <base-button
                type="info"
                size="sm"
                icon
                @click="$nuxt.$router.push(`/assets/${row.id}`)"
              >
                <i class="fa fa-regular fa-eye"></i>
              </base-button>
            </el-tooltip>
            <el-tooltip content="Editar" :open-delay="300" placement="top">
              <base-button
                type="danger"
                size="sm"
                icon
                @click="showUpdateStateModal(row.id)"
              >
                <i class="fa fa-regular fa-pen"></i>
              </base-button>
            </el-tooltip>
          </div>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[10, 20]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="assets.total"
      >
      </el-pagination>
    </card>
    <!-- buttons -->
    <div class="col-md-3">
      <card>
        <base-button
          block
          type="success"
          class="mb-3"
          @click="modals.createAsset = true"
        >
          Crear activo
        </base-button>
      </card>
      <card>
        <base-button
          block
          type="primary"
          class="mb-3"
          @click="modals.createState = true"
        >
          Crear Estado
        </base-button>
        <base-button
          block
          type="primary"
          class="mb-3"
          @click="modals.createCategory = true"
        >
          Crear categoría
        </base-button>
        <base-button
          block
          type="primary"
          class="mb-3"
          @click="modals.createBrand = true"
        >
          Crear marca
        </base-button>
        <base-button
          block
          type="primary"
          class="mb-3"
          @click="modals.createModel = true"
        >
          Crear modelo
        </base-button>
      </card>
    </div>
    <!-- modals -->
    <div>
      <modal
        :show.sync="modals.createAsset"
        body-classes="p-0"
        modal-classes="modal-dialog-centered"
      >
        <card class="p-3">
          <h5 slot="header" class="title">Agregar activo</h5>
          <form @submit.prevent="addAsset">
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

            <base-button native-type="submit" type="primary" class="btn-fill">
              Crear activo
            </base-button>
            <base-button link>¿Agregar Varios?</base-button>
          </form>
        </card>
      </modal>
      <modal
        :show.sync="modals.createState"
        body-classes="p-0"
        modal-classes="modal-dialog-centered modal-sm"
      >
        <card class="p-3">
          <h5 slot="header" class="title">Crear estado</h5>
          <form @submit.prevent="addState">
            <div class="row">
              <div class="col-md-12">
                <base-input
                  type="text"
                  label="Nombre del estado"
                  v-model="state.name"
                >
                </base-input>
              </div>
            </div>

            <div class="row">
              <div class="col-md-12">
                <base-input type="text" label="Estado">
                  <el-select
                    v-model="state.state"
                    class="select-success"
                    placeholder="Selecciona una opcion"
                    label="Estado"
                    style="width: 100%"
                    filterable
                  >
                    <el-option
                      v-for="option in stateOptions"
                      :key="option"
                      :value="option"
                      :label="option"
                    >
                    </el-option>
                  </el-select>
                </base-input>
              </div>
            </div>

            <base-button native-type="submit" type="primary" class="btn-fill">
              Crear estado
            </base-button>
          </form>
        </card>
      </modal>
      <modal
        :show.sync="modals.createCategory"
        body-classes="p-0"
        modal-classes="modal-dialog-centered modal-sm"
      >
        <card class="p-3">
          <h5 slot="header" class="title">Crear categoria</h5>
          <form @submit.prevent="addCategory">
            <div class="row">
              <div class="col-md-12">
                <base-input
                  type="text"
                  label="Nombre de la categoria"
                  v-model="category.name"
                >
                </base-input>
              </div>
            </div>

            <base-button native-type="submit" type="primary" class="btn-fill">
              Crear categoria
            </base-button>
          </form>
        </card>
      </modal>
      <modal
        :show.sync="modals.createModel"
        body-classes="p-0"
        modal-classes="modal-dialog-centered modal-sm"
      >
        <card class="p-3">
          <h5 slot="header" class="title">Crear modelo</h5>
          <form @submit.prevent="addModel">
            <div class="row">
              <div class="col-md-12">
                <base-input
                  type="text"
                  label="Nombre del modelo"
                  v-model="model.name"
                >
                </base-input>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <base-input type="text" label="Categoria">
                  <el-select
                    v-model="model.categoryId"
                    class="select-success"
                    placeholder="Selecciona una categoria"
                    label="Categoria"
                    style="width: 100%"
                    filterable
                  >
                    <el-option
                      v-for="option in categories"
                      :key="option.id"
                      :value="option.id"
                      :label="option.name"
                    >
                    </el-option>
                  </el-select>
                </base-input>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <base-input type="text" label="Marca">
                  <el-select
                    v-model="model.brandId"
                    class="select-success"
                    placeholder="Selecciona una marca"
                    filterable
                    label="Marca"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="option in brands"
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
              Crear modelo
            </base-button>
          </form>
        </card>
      </modal>
      <modal
        :show.sync="modals.createBrand"
        body-classes="p-0"
        modal-classes="modal-dialog-centered modal-sm"
      >
        <card class="p-3">
          <h5 slot="header" class="title">Crear Marca</h5>
          <form @submit.prevent="addBrand">
            <div class="row">
              <div class="col-md-12">
                <base-input
                  type="text"
                  label="Nombre de la marca"
                  v-model="brand.name"
                >
                </base-input>
              </div>
            </div>

            <base-button native-type="submit" type="primary" class="btn-fill">
              Crear marca
            </base-button>
          </form>
        </card>
      </modal>

      <modal
        :show.sync="modals.filter"
        body-classes="p-0"
        modal-classes="modal-dialog-centered modal-sm"
      >
        <card>
          <el-form @submit.native.prevent>
            <base-input label="Modelo">
              <el-select
                v-model="filters.modelId"
                clearable
                filterable
                class="select-success"
                placeholder="Selecciona una modelo"
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
            <base-input type="text" label="Categoria">
              <el-select
                v-model="filters.categoryId"
                class="select-success"
                placeholder="Selecciona una categoria"
                label="Categoria"
                style="width: 100%"
                filterable
                clearable
              >
                <el-option
                  v-for="option in categories"
                  :key="option.id"
                  :value="option.id"
                  :label="option.name"
                >
                </el-option>
              </el-select>
            </base-input>
            <base-input type="text" label="Estado">
              <el-select
                v-model="filters.stateId"
                class="select-success"
                placeholder="Selecciona un estado"
                label="Estado"
                style="width: 100%"
                filterable
                clearable
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
            <base-input type="text" label="Marca">
              <el-select
                v-model="filters.brandId"
                class="select-success"
                placeholder="Selecciona una marca"
                filterable
                label="Marca"
                style="width: 100%"
                clearable
              >
                <el-option
                  v-for="option in brands"
                  :key="option.id"
                  :value="option.id"
                  :label="option.name"
                >
                </el-option>
              </el-select>
            </base-input>
            <base-input label="Desde">
              <el-date-picker
                type="daterange"
                class="bg-transparent"
                size="large"
                clearable
                v-model="dateFilter"
                @change="updateDateFilter"
              >
              </el-date-picker>
            </base-input>
          </el-form>
        </card>
      </modal>
      <modal
        :show.sync="modals.updateAssetState"
        body-classes="p-0"
        modal-classes="modal-dialog-centered modal-sm"
      >
        <card>
          <el-form
            ref="formRef"
            @submit.native.prevent="updateAsset(assetToUpdate)"
            :model="assetToUpdate"
          >
            <div class="row">
              <div class="col-md-12">
                <base-input type="text" label="Estado">
                  <el-select
                    v-model="assetToUpdate.stateId"
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
              <div class="col-md-12">
                <base-button
                  native-type="submit"
                  type="primary"
                  class="btn-fill"
                >
                  Actualizar
                </base-button>
              </div>
            </div>
          </el-form>
        </card>
      </modal>
    </div>
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
      currentPage: 1,
      search: "",
      modals: {
        createAsset: false,
        createState: false,
        createCategory: false,
        createModel: false,
        createBrand: false,
        updateAssetState: false,
        filter: false,
      },
      dateFilter: null,
      filters: {
        serial: null,
        limit: 10,
        offset: 0,
        sort: null,
        order: null,
        all: null,
        stateId: null,
        modelId: null,
        categoryId: null,
        brandId: null,
        startDate: null,
        endDate: null,
      },
      assets: [],
      brands: [],
      categories: [],
      models: [],
      states: [],
      stateOptions: ["asignado", "desplegable", "pendiente", "archivado"],
      roles: [
        { label: "Taquilla", value: "taquilla" },
        { label: "Técnico", value: "tecnico" },
        { label: "Auditor", value: "auditor" },
        { label: "Superusuario", value: "superusuario" },
      ],
      model: {
        name: null,
        brandId: null,
        categoryId: null,
      },
      category: {
        name: null,
      },
      state: {
        name: null,
        state: null,
      },
      brand: {
        name: null,
      },
      asset: {
        serial: null,
        modelId: null,
        stateId: null,
      },
      assetToUpdate: {
        id: null,
        stateId: null,
      },
    };
  },
  watch: {
    search(newState, lastState) {
      this.filters.serial = newState;
      if (newState.length < 1) this.filters.serial = null;
      this.getAssets();
    },
    filter() {
      this.getAssets();
    },
  },
  computed: {
    filter() {
      this.getAssets();
      return this.filters;
    },
  },
  beforeMount() {
    this.getAssets();
  },
  mounted() {
    this.getModels();
    this.getStatus();
    this.getCategories();
    this.getBrands();
  },
  methods: {
    updateDateFilter() {
      if (
        this.dateFilter === null ||
        this.dateFilter === undefined ||
        this.dateFilter === ""
      ) {
        this.filters.startDate = null;
        this.filters.endDate = null;
        return;
      }
      this.filters.startDate = this.dateFilter[0];
      this.filters.endDate = this.dateFilter[1];
    },
    showUpdateStateModal(id) {
      this.modals.updateAssetState = true;
      this.assetToUpdate.id = id;
    },
    handleSizeChange(val) {
      this.filters.limit = val;
      this.getAssets();
    },
    handleCurrentChange(val) {
      this.filters.offset = (val - 1) * this.filters.limit;
      this.getAssets();
    },
    async getAssets() {
      try {
        const params = { ...this.filters };
        this.removeNullProps(params);
        const toSend = {
          params,
        };
        const { data, error } = await this.$axios.get("/assets", toSend);
        this.assets = data;
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
    async addAsset() {
      try {
        let toSend = { ...this.asset };
        this.removeNullProps(toSend);
        const { data, error } = await this.$axios.post("/assets", {
          assets: [toSend],
        });

        for (const asset of data.created) {
          console.log(asset)
          this.$notify({
            message: `Activo creado correctamente,
              serial: ${asset.serial}`,
            type: "success",
          });
        }
        for (const asset of data.errors) {
          console.log(asset)
          this.$notify({
            message: `Activo duplicado,
              serial: ${asset.serial}`,
            type: "danger",
          });
        }
        this.asset.serial = null;
        this.getAssets();
      } catch (error) {
        console.log(error);
      }
    },
    async addState() {
      try {
        let toSend = { ...this.state };
        const { data, error } = await this.$axios.post(
          "/assets/status",
          toSend
        );
        this.resetObject(this.state);
        this.$notify({
          message: `Estado creado correctamente:
          ${data.name}`,
          type: "success",
        });
        this.getStatus();
      } catch (error) {
        console.log(error);
      }
    },
    async addBrand() {
      try {
        const toSend = { ...this.brand };
        const { data, error } = await this.$axios.post(
          "/assets/brands",
          toSend
        );
        this.resetObject(this.brand);
        this.$notify({
          message: `Marca creado correctamente:
          ${data.name}`,
          type: "success",
        });
        this.getBrands();
      } catch (error) {
        console.log(error);
      }
    },
    async addCategory() {
      try {
        let toSend = { ...this.category };
        const { data, error } = await this.$axios.post(
          "/assets/categories",
          toSend
        );
        this.resetObject(this.category);
        this.getCategories();
        this.$notify({
          message: `Categoria creada correctamente:
          ${data.name}`,
          type: "success",
        });
      } catch (error) {
        console.log(error);
      }
    },
    async addModel() {
      try {
        let toSend = { ...this.model };
        const { data, error } = await this.$axios.post(
          "/assets/models",
          toSend
        );
        this.resetObject(this.model);
        this.$notify({
          message: `Modelo creado correctamente:
          ${data.name}`,
          type: "success",
        });
        this.getModels();
      } catch (error) {
        console.log(error);
      }
    },
    async updateAsset(form) {
      try {
        const { stateId, id } = this.assetToUpdate;
        const { data, error } = await this.$axios.patch(`/assets/${id}`, {
          stateId,
        });
        this.$notify({
          message: `activo actualizado correctamente`,
          type: "success",
        });
        this.toUpdate = {};
        this.getAssets();
        this.modals.updateAsset = false;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style>
.el-table__expanded-cell {
  background-color: transparent;
}
.el-range-input {
  background-color: transparent;
}
</style>