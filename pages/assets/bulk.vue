<template>
  <div class="row">
    <div class="col-12">
      <h1>Crear varios activos</h1>
    </div>
    <div class="col-md-4">
      <card>
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

          <base-button
            @click="addAsset"
            type="success"
            class="btn-fill"
            :disabled="!asset.serial || !asset.modelId || !asset.stateId"
          >
            Añadir activo
          </base-button>
        </el-form>
      </card>
      <card>
        <h2>Datos de la factura</h2>
        <el-form @submit.native.prevent="">
          <base-input
            label="Codigo de la factura"
            v-model="invoice.code"
            type="text"
            clearable
          ></base-input>
          <base-input label="Proveedor">
            <el-autocomplete
              type="text"
              clearable
              :fetch-suggestions="searchProvider"
              placeholder="Buscar Provedor"
              @select="handleSelectProvider"
              v-model="provider.name"
              class="w-100"
            >
              <template #default="{ item }">
                <div class="value">
                  <b>{{ item.name }}</b
                  >, <span class="link">{{ item.rif }}</span>
                </div>
              </template>
            </el-autocomplete>
          </base-input>
          <base-input
            label="Total de la factura"
            type="number"
            v-model="invoice.total"
          >
          </base-input>
          <base-input label="Fecha de la factura">
            <el-date-picker
              v-model="invoice.invoiceDate"
              type="date"
              placeholder="Elige la fecha de facturacion"
            ></el-date-picker>
          </base-input>
        </el-form>
      </card>
      <card>
        <base-button @click="addAssets">Guardar</base-button>
      </card>
      <card>
        <base-input label="Buscar factura">
          <el-autocomplete
            type="text"
            clearable
            :fetch-suggestions="searchInvoice"
            placeholder="Buscar factura"
            @select="handleSelectInvoice"
            v-model="invoice.code"
            class="w-100"
          >
            <template #default="{ item }">
              <div class="value">
                <b>{{ item.code }}</b
                >, <span class="link">{{ item.provider?.name }}</span>
              </div>
            </template>
          </el-autocomplete>
        </base-input>
      </card>
    </div>
    <div class="col-md-8">
      <card>
        <el-table :data="assets">
          <el-table-column sortable label="Serial" property="serial">
          </el-table-column>
          <el-table-column sortable label="Modelo">
            <div slot-scope="{ row }">
              {{ printModel({ id: row.modelId }) }}
            </div>
          </el-table-column>
          <el-table-column min-width="100" header-align="right" label="Borrar">
            <div slot-scope="{ row }" class="text-right">
              <el-tooltip content="Eliminar" :open-delay="300" placement="top">
                <base-button
                  type="danger"
                  size="sm"
                  icon
                  @click="removeAsset(row)"
                >
                  <i class="fa fa-solid fa-trash"></i>
                </base-button>
              </el-tooltip>
            </div>
          </el-table-column>
        </el-table>
      </card>
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
  Autocomplete,
} from "element-ui";
import BaseInput from "~/components/Inputs/BaseInput.vue";

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
    [Autocomplete.name]: Autocomplete,
    BaseSwitch,
    Modal,
    BaseInput,
  },
  data() {
    return {
      asset: {
        serial: null,
        modelId: null,
        stateId: null,
      },
      invoice: {
        id: null,
        code: null,
        providerId: null,
        total: null,
        invoiceDate: null,
      },
      provider: {},
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
    handleSelectInvoice(item) {
      this.invoice = item;
      this.invoice.providerId = item.id;
    },
    handleSelectProvider(item) {
      this.provider = item;
      this.invoice.providerId = item.id;
    },
    async searchInvoice(queryString, cb) {
      try {
        let toSend = {
          params: {
            ...(queryString && queryString.length > 0 && { code: queryString }),
          },
        };

        const { data, error } = await this.$axios.get("/invoices", toSend);
        cb(data.rows);
      } catch (error) {
        console.log(error);
      }
    },
    async searchProvider(queryString, cb) {
      try {
        let toSend = {
          params: {
            ...(queryString && queryString.length > 0 && { name: queryString }),
          },
        };

        const { data, error } = await this.$axios.get(
          "/invoices/providers",
          toSend
        );
        cb(data.rows);
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
    addAsset() {
      const toAdd = { ...this.asset };
      if (!toAdd.serial || !toAdd.modelId || !toAdd.stateId) return;
      if (this.assets.find(({ serial }) => serial === toAdd.serial)) {
        this.$notify({
          message: `Activo ya agregado,
              serial: ${toAdd.serial}`,
          type: "danger",
        });
        return;
      }
      this.asset.serial = null;
      this.assets.push(toAdd);
    },
    removeAsset(row) {
      const index = this.assets.indexOf(row);
      if (index !== -1) {
        this.assets.splice(index, 1);
      }
    },
    printModel({ id }) {
      const obj = this.models.find((objeto) => {
        return objeto.id === id;
      });
      return `${obj?.category?.name} - ${obj?.brand?.name} - ${obj?.name}`;
    },
    async addAssets() {
      try {
        const assets = this.assets;
        const invoice = this.invoice;
        const invoiceId = invoice.id;

        delete invoice.id;


        const toSend = {};
        if (invoiceId) toSend.invoiceId = invoiceId;
        else if (invoice.invoiceDate && invoice.providerId && invoice.code)
          toSend.invoice = invoice;
        toSend.assets = assets;

        const { data, error } = await this.$axios.post("/assets", toSend);

        for (const asset of data.created) {
          console.log(asset);
          this.$notify({
            message: `Activo creado correctamente,
              serial: ${asset.serial}`,
            type: "success",
          });
        }
        for (const asset of data.errors) {
          console.log(asset);
          this.$notify({
            message: `Activo duplicado,
              serial: ${asset.serial}`,
            type: "danger",
          });
        }

        this.resetObject(this.invoice);
        this.resetObject(this.provider);
        this.assets = [];
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
