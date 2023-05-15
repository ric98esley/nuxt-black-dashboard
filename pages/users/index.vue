<template>
  <div class="row">
    <div class="col-md-12">
      <h1>Usuarios</h1>
    </div>
    <div class="col-md-12">
      <card>
        <base-input label="Buscar Usuario" v-model="search"></base-input>
      </card>
    </div>
    <!-- table -->
    <div class="col-md-9">
      <card>
        <h4 slot="header" class="card-title">Lista de usuarios</h4>
        <el-table :data="users.users" class="table-striped">
          <el-table-column
            min-width="100"
            sortable
            label="User"
            property="username"
          ></el-table-column>
          <el-table-column
            min-width="100"
            sortable
            label="Cedula"
            property="cardId"
          ></el-table-column>
          <el-table-column
            min-width="150"
            sortable
            label="Correo"
            property="email"
          ></el-table-column>
          <el-table-column min-width="80" sortable label="Activar">
            <template slot-scope="props">
              <base-switch
                @click.native="updateUserStatus(props.row)"
                v-model="props.row.isActive"
                color="black"
              ></base-switch>
            </template>
          </el-table-column>
          <el-table-column min-width="60" header-align="right" label="Detalles">
            <div slot-scope="{ row }" class="text-right">
              <el-tooltip
                content="Información"
                :open-delay="300"
                placement="top"
              >
                <base-button type="info" size="sm" icon @click="viewUser(row)">
                  <i class="fa fa-regular fa-eye"></i>
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
          :total="users.total"
        >
        </el-pagination>
      </card>
    </div>

    <!-- buttons -->
    <div class="col-md-3">
      <card>
        <base-button
          block
          type="success"
          class="mb-3"
          @click="modals.createUser = true"
        >
          Crear Usuario
        </base-button>
      </card>
    </div>

    <modal
      :show.sync="modals.createUser"
      body-classes="p-0"
      modal-classes="modal-dialog-centered modal-lg"
    >
      <card class="p-3">
        <h5 slot="header" class="title">Crear usuario</h5>
        <form @submit.prevent="addUser">
          <div class="row">
            <div class="col-md-4">
              <base-input type="text" label="Usuario" v-model="user.username">
              </base-input>
            </div>
            <div class="col-md-3">
              <base-input type="text" label="Nombre" v-model="user.name">
              </base-input>
            </div>
            <div class="col-md-3">
              <base-input type="text" label="Apellido" v-model="user.lastName">
              </base-input>
            </div>
            <div class="col-md-2">
              <label>Activar</label>
              <base-switch v-model="user.isActive" color="black"></base-switch>
            </div>
          </div>

          <div class="row">
            <div class="col-md-5">
              <base-input
                type="email"
                label="Correo"
                placeholder="ejemplo@email.com"
                v-model="user.email"
              >
              </base-input>
            </div>
            <div class="col-md-4">
              <base-input
                type="phone"
                label="Telefono"
                placeholder="04241112233"
                v-model="user.phone"
              >
              </base-input>
            </div>
            <div class="col-md-3">
              <base-input type="number" label="Cedula" v-model="user.cardId">
              </base-input>
            </div>
          </div>

          <div class="row">
            <div class="col-md-12">
              <base-input
                type="text"
                label="Dirección"
                placeholder="Calle Falsa 123"
                v-model="user.address"
              >
              </base-input>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <base-input
                type="text"
                label="Clave"
                placeholder="password"
                v-model="user.password"
              >
              </base-input>
            </div>
            <div class="col-md-6">
              <base-input type="text" label="Rol">
                <el-select
                  v-model="user.role"
                  class="select-success"
                  placeholder="Selecciona una categoria"
                  label="Categoria"
                  style="width: 100%"
                >
                  <el-option
                    v-for="option in roles"
                    :key="option.name"
                    :value="option.value"
                    :label="option.label"
                  >
                  </el-option>
                </el-select>
              </base-input>
            </div>
          </div>

          <base-button native-type="submit" type="primary" class="btn-fill">
            Guardar
          </base-button>
        </form>
      </card>
    </modal>
  </div>
</template>
<script>
import { BaseSwitch, Modal, BasePagination } from "@/components";
import { Select, Option, Table, TableColumn, Pagination } from "element-ui";

export default {
  middleware: "authenticated",
  components: {
    BaseSwitch,
    Modal,
    BasePagination,
    [Option.name]: Option,
    [Select.name]: Select,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Pagination.name]: Pagination,
  },
  data() {
    return {
      currentPage: 1,
      search: "",
      limit: 10,
      offset: 0,
      modals: {
        createUser: false,
      },
      roles: [
        { label: "Taquilla", value: "taquilla" },
        { label: "Técnico", value: "tecnico" },
        { label: "Auditor", value: "auditor" },
      ],
      users: [],
      user: {
        email: null,
        password: null,
        username: null,
        name: null,
        lastName: null,
        cardId: null,
        phone: null,
        address: null,
        isActive: false,
        role: "taquilla",
      },
    };
  },
  watch: {
    search(newState, lastState) {
      if (newState === "") {
        this.getUsers();
        return;
      }
      if (newState.length < 3) return;

      this.getUsers();
    },
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    handleSizeChange(val) {
      this.limit = val;
      this.getUsers();
    },
    handleCurrentChange(val) {
      this.offset = (val - 1) * this.limit;
      this.getUsers();
    },
    async getUsers() {
      try {
        let toSend = {
          params: {},
        };
        if (this.search.length > 2) {
          toSend.params.username = this.search;
        }
        toSend.params.limit = this.limit;
        toSend.params.offset = this.offset;
        const { data, error } = await this.$axios.get("/users", toSend);
        console.log(data);
        this.users = data;
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
    async addUser() {
      try {
        let toSend = { ...this.user };
        this.removeNullProps(toSend);
        const { data, error } = await this.$axios.post("/users", toSend);
        this.resetObject(this.user);
        this.$notify({
          message: `Usuario creado correctamente,
          ${data.username}`
        })
        this.getUsers();
      } catch (error) {
        console.log(error);
      }
    },
    async updateUserStatus(user) {
      try {
        let toSend = {
          isActive: user.isActive,
        };
        const { data, error } = await this.$axios.patch(
          `/users/${user.id}`,
          toSend
        );
      } catch (error) {
        console.log(error);
      }
    },
    async updateUser() {
      try {
        let toSend = { ...this.user };
        this.removeNullProps(toSend);
        const { data, error } = await this.$axios.patch(
          `/users/${this.user.id}`,
          toSend
        );
        this.resetObject(this.user);
        this.getUsers();
      } catch (error) {
        console.log(error);
      }
    },
    viewUser(row) {
      console.log(row);
    },
  },
};
</script>
<style>
.el-pagination .el-pager li {
  background-color: transparent !important;
}
.el-pagination .btn-next,
.el-pagination .btn-prev {
  background-color: transparent !important;
}
</style>
