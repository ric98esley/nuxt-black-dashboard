<template>
  <div class="row">
    <div class="col-md-12">
      <h1>Activos</h1>
    </div>

    <card class="col-md-12">
      <base-input label="Buscar activo"></base-input>
    </card>
    <!-- table -->
    <card class="col-md-9">
      <h4 slot="header" class="card-title">Lista de activos</h4>
      <el-table :data="assets" class="table-striped">
        <el-table-column min-width="150" sortable label="Serial" property="serial"></el-table-column>
        <el-table-column min-width="150" sortable label="Estado" property="state.name"></el-table-column>
        <el-table-column min-width="150" sortable label="Modelo" property="model.model"></el-table-column>
      </el-table>
    </card>
    <!-- buttons -->
    <div class="col-md-3">
      <card>
        <base-button block type="success" class=" mb-3" @click="modals.createAsset = true">
          Crear activo
        </base-button>
      </card>
      <card>
        <base-button block type="primary" class=" mb-3" @click="modals.createState = true">
          Crear Estado
        </base-button>
        <base-button block type="primary" class=" mb-3" @click="modals.createCategory = true">
          Crear categoría
        </base-button>
        <base-button block type="primary" class=" mb-3" @click="modals.createModel = true">
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
                  <el-select v-model="asset.modelId" class="select-success" placeholder="Selecciona una categoria"
                    label="Categoria" style="width: 100%;">
                    <el-option v-for="option in models" :key="option.id" :value="option.id" :label="option.model">
                    </el-option>
                  </el-select>
                </base-input>
              </div>
            </div>

            <div class="row">
              <div class="col-md-12">
                <base-input type="text" label="Estado">
                  <el-select v-model="asset.assetStateId" class="select-success" placeholder="Selecciona un estado"
                    label="Categoria" style="width: 100%;">
                    <el-option v-for="option in states" :key="option.id" :value="option.id" :label="option.name">
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
                <base-input type="text" label="Modelo">
                  <el-select v-model="state.state" class="select-success" placeholder="Selecciona una categoria"
                    label="Categoria" style="width: 100%;">
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
                <base-input type="text" label="Nombre del modelo" v-model="model.model">
                </base-input>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <base-input type="text" label="Modelo">
                  <el-select v-model="model.categoryId" class="select-success" placeholder="Selecciona una categoria"
                    label="Categoria" style="width: 100%;">
                    <el-option v-for="option in categories" :key="option.id" :value="option.id" :label="option.name">
                    </el-option>
                  </el-select>
                </base-input>
              </div>
            </div>

            <base-button native-type="submit" type="primary" class="btn-fill">
              Crear categoria
            </base-button>
          </form>
        </card>
      </modal>
    </div>
  </div>
</template>
<script>
import { BaseSwitch, Modal } from "@/components"
import { Select, Option, Table, TableColumn } from "element-ui";

export default {
  middleware: "authenticated",
  components: {
    [Option.name]: Option,
    [Select.name]: Select,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    BaseSwitch,
    Modal
  },
  data() {
    return {
      modals: {
        createAsset: false,
        createState: false,
        createCategory: false,
        createModel: false
      },
      assets: [],
      categories: [],
      models: [],
      states: [],
      stateOptions: ['asignado', 'desplegable', 'pendiente', 'archivado'],
      roles: [
        { label: 'Taquilla', value: 'taquilla' },
        { label: 'Técnico', value: 'tecnico' },
        { label: 'Auditor', value: 'auditor' },
        { label: 'Superusuario', value: 'superusuario' },
      ],
      model: {
        model: null,
        categoryId: null
      },
      category: {
        name: null
      },
      state: {
        name: null,
        state: null
      },
      asset: {
        serial: null,
        modelId: null,
        assetStateId: null
      }
    };
  },
  mounted() {
    this.getAssets(),
      this.getModels(),
      this.getStatus(),
      this.getCategories()
  },
  methods: {
    async getAssets() {
      try {
        console.log(this.$store.state.auth)
        this.$axios.setToken(this.$store.state.auth.token, 'Bearer')
        const { data, error } = await this.$axios.get('/assets')
        this.assets = data;
      } catch (error) {
        console.log(error)
      }
    },
    async getModels() {
      try {
        console.log(this.$store.state.auth)
        this.$axios.setToken(this.$store.state.auth.token, 'Bearer')
        const { data, error } = await this.$axios.get('/assets/models')
        this.models = data;
      } catch (error) {
        console.log(error)
      }
    },
    async getCategories() {
      try {
        console.log(this.$store.state.auth)
        this.$axios.setToken(this.$store.state.auth.token, 'Bearer')
        const { data, error } = await this.$axios.get('/assets/categories')
        this.categories = data;
      } catch (error) {
        console.log(error)
      }
    },
    async getStatus() {
      try {
        console.log(this.$store.state.auth)
        this.$axios.setToken(this.$store.state.auth.token, 'Bearer')
        const { data, error } = await this.$axios.get('/assets/status')
        this.states = data;
      } catch (error) {
        console.log(error)
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
        obj[prop] = null
      }
      return obj;
    },
    async addAsset() {
      try {
        let toSend = { ...this.asset }
        this.removeNullProps(toSend);
        this.$axios.setToken(this.$store.state.auth.token, 'Bearer');
        const { data, error } = await this.$axios.post('/assets', toSend);
        this.resetObject(this.Asset);
        this.getAssets();
      } catch (error) {
        console.log(error)
      }
    },
    async addState() {
      try {
        let toSend = { ...this.state }
        this.$axios.setToken(this.$store.state.auth.token, 'Bearer');
        const { data, error } = await this.$axios.post('/assets/status', toSend);
        this.resetObject(this.state);
        this.getStatus();
      } catch (error) {
        console.log(error)
      }
    },
    async addCategory() {
      try {
        let toSend = { ...this.category }
        this.$axios.setToken(this.$store.state.auth.token, 'Bearer');
        const { data, error } = await this.$axios.post('/assets/categories', toSend);
        this.resetObject(this.category);
        this.getCategories();
      } catch (error) {
        console.log(error)
      }
    },
    async addModel() {
      try {
        let toSend = { ...this.model }
        this.$axios.setToken(this.$store.state.auth.token, 'Bearer');
        const { data, error } = await this.$axios.post('/assets/models', toSend);
        this.resetObject(this.model);
        this.getModels();
      } catch (error) {
        console.log(error)
      }
    },

  }
};
</script>
<style>
.table-transparent {
  background-color: transparent !important;
}
</style>
  