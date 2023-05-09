<template>
  <div class="row">
    <div class="col-md-12">
      <h1>Activos</h1>
    </div>

    <card class="col-md-12">
      <base-input label="Buscar activo" v-model="search"></base-input>
    </card>
    <!-- table -->
    <card class="col-md-9">
      <h4 slot="header" class="card-title">Lista de activos</h4>
      <el-table :data="assets.assets" class="table-striped">
        <el-table-column min-width="150" sortable label="Serial" property="serial"></el-table-column>
        <el-table-column min-width="120" sortable label="Estado" property="state.name"></el-table-column>
        <el-table-column min-width="100" sortable label="Modelo" property="model.name"></el-table-column>
        <el-table-column min-width="100" sortable label="Tipo" property="model.category.name"></el-table-column>
        <el-table-column min-width="90" header-align="right" label="Detalles">
          <div slot-scope="{row}" class="text-right">
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
          </div>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page.sync="currentPage" :page-sizes="[10, 20]" :page-size="10"
        layout="total, sizes, prev, pager, next, jumper" :total="assets.total">
      </el-pagination>
    </card>
    <!-- buttons -->
    <div class="col-md-3">
      <card>
        <base-button block type="success" class="mb-3" @click="modals.createAsset = true">
          Crear activo
        </base-button>
      </card>
      <card>
        <base-button block type="primary" class="mb-3" @click="modals.createState = true">
          Crear Estado
        </base-button>
        <base-button block type="primary" class="mb-3" @click="modals.createCategory = true">
          Crear categoría
        </base-button>
        <base-button block type="primary" class="mb-3" @click="modals.createBrand = true">
          Crear marca
        </base-button>
        <base-button block type="primary" class="mb-3" @click="modals.createModel = true">
          Crear modelo
        </base-button>
      </card>
    </div>
    <!-- modals -->
    <div>
      <modal :show.sync="modals.createAsset" body-classes="p-0" modal-classes="modal-dialog-centered">
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
                  <el-select v-model="asset.modelId" filterable class="select-success" placeholder="Selecciona una categoria"
                    label="Categoria" style="width: 100%">
                    <el-option v-for="option in models" :key="option.id" :value="option.id" :label="`${option.category.name} - ${option.name} - ${option.brand?.name}`">
                    </el-option>
                  </el-select>
                </base-input>
              </div>
            </div>

            <div class="row">
              <div class="col-md-12">
                <base-input type="text" label="Estado">
                  <el-select v-model="asset.assetStateId" class="select-success" placeholder="Selecciona un estado"
                    label="Categoria" style="width: 100%">
                    <el-option v-for="option in states" :key="option.id" :value="option.id" :label="option.name">
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
      <modal :show.sync="modals.createState" body-classes="p-0" modal-classes="modal-dialog-centered modal-sm">
        <card class="p-3">
          <h5 slot="header" class="title">Crear estado</h5>
          <form @submit.prevent="addState">
            <div class="row">
              <div class="col-md-12">
                <base-input type="text" label="Nombre del estado" v-model="state.name">
                </base-input>
              </div>
            </div>

            <div class="row">
              <div class="col-md-12">
                <base-input type="text" label="Estado">
                  <el-select v-model="state.state" class="select-success" placeholder="Selecciona una categoria"
                    label="Categoria" style="width: 100%">
                    <el-option v-for="option in stateOptions" :key="option" :value="option" :label="option">
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
      <modal :show.sync="modals.createCategory" body-classes="p-0" modal-classes="modal-dialog-centered modal-sm">
        <card class="p-3">
          <h5 slot="header" class="title">Crear categoria</h5>
          <form @submit.prevent="addCategory">
            <div class="row">
              <div class="col-md-12">
                <base-input type="text" label="Nombre de la categoria" v-model="category.name">
                </base-input>
              </div>
            </div>

            <base-button native-type="submit" type="primary" class="btn-fill">
              Crear categoria
            </base-button>
          </form>
        </card>
      </modal>
      <modal :show.sync="modals.createModel" body-classes="p-0" modal-classes="modal-dialog-centered modal-sm">
        <card class="p-3">
          <h5 slot="header" class="title">Crear modelo</h5>
          <form @submit.prevent="addModel">
            <div class="row">
              <div class="col-md-12">
                <base-input type="text" label="Nombre del modelo" v-model="model.name">
                </base-input>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <base-input type="text" label="Categoria">
                  <el-select v-model="model.categoryId" class="select-success" placeholder="Selecciona una categoria"
                    label="Categoria" style="width: 100%">
                    <el-option v-for="option in categories" :key="option.id" :value="option.id" :label="option.name">
                    </el-option>
                  </el-select>
                </base-input>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <base-input type="text" label="Marca">
                  <el-select v-model="model.brandId" class="select-success" placeholder="Selecciona una categoria"
                    label="Categoria" style="width: 100%">
                    <el-option v-for="option in brands" :key="option.id" :value="option.id" :label="option.name">
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
      <modal :show.sync="modals.createBrand" body-classes="p-0" modal-classes="modal-dialog-centered modal-sm">
        <card class="p-3">
          <h5 slot="header" class="title">Crear Marca</h5>
          <form @submit.prevent="addBrand">
            <div class="row">
              <div class="col-md-12">
                <base-input type="text" label="Nombre de la marca" v-model="brand.name">
                </base-input>
              </div>
            </div>

            <base-button native-type="submit" type="primary" class="btn-fill">
              Crear marca
            </base-button>
          </form>
        </card>
      </modal>
    </div>
  </div>
</template>
<script>
import { BaseSwitch, Modal } from "@/components";
import { Select, Option, Table, TableColumn } from "element-ui";

export default {
  middleware: "authenticated",
  components: {
    [Option.name]: Option,
    [Select.name]: Select,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    BaseSwitch,
    Modal,
  },
  data() {
    return {
      currentPage: 1,
      limit: 10,
      offset: 0,
      search: "",
      modals: {
        createAsset: false,
        createState: false,
        createCategory: false,
        createModel: false,
        createBrand: false,
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
        name: null
      },
      asset: {
        serial: null,
        modelId: null,
        assetStateId: null,
      },
    };
  },
  watch: {
    search(newState, lastState) {
      if (newState === "") {
        this.getAssets();
        return;
      }
      if (newState.length < 3) return;

      this.getAssets();
    },
  },
  beforeMount() {
    this.getAssets()
  },
  mounted() {
    this.getModels();
      this.getStatus();
      this.getCategories();
      this.getBrands();
  },
  methods: {
    handleSizeChange(val) {
      this.limit = val;
      this.getAssets();
    },
    handleCurrentChange(val) {
      this.offset = (val - 1) * this.limit;
      console.log(this.offset);
      this.getAssets();
    },
    async getAssets() {
      try {
        let toSend = {
          params: {},
        };
        if (this.search.length > 2) {
          toSend.params.serial = this.search;
        }
        toSend.params.limit = this.limit;
        toSend.params.offset = this.offset;

        this.removeNullProps(toSend);
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
        const { data, error } = await this.$axios.get("/assets/brands")
        this.brands = data;
      } catch (error) {
        console.log(error);
      }
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
    async addAsset() {
      try {
        let toSend = { ...this.asset };
        console.log(toSend);
        this.removeNullProps(toSend);
        const { data, error } = await this.$axios.post("/assets", toSend);
        this.resetObject(this.Asset);
        this.getAssets({});
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
        this.getStatus();
      } catch (error) {
        console.log(error);
      }
    },
    async addBrand() {
      try {
        const toSend = { ...this.brand }
        const {data, error } = await this.$axios.post(
          "/assets/brands",
          toSend
        )
        this.resetObject(this.brand);
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
        this.getModels();
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>