<template>
  <div class="row">
    <div class="col-md-12">
      <h1>Usuarios</h1>
    </div>
  
    <card class="col-md-12">
      <base-input label="Buscar activo"></base-input>
    </card>
    <!-- table -->
    <card class="col-md-9">
      <h4 slot="header" class="card-title">Lista de activos</h4>
      <el-table :data="users" class="table-striped">
        <el-table-column min-width="100" sortable label="User" property="username"></el-table-column>
        <el-table-column min-width="100" sortable label="Cedula" property="cardId"></el-table-column>
        <el-table-column min-width="150" sortable label="Correo" property="email"></el-table-column>
        <el-table-column min-width="100" sortable label="Modelo">
          <template slot-scope="props">
            <base-switch v-model="props.row.isActive" color="black"></base-switch>
          </template>
        </el-table-column>
      </el-table>
    </card>
    <!-- buttons -->
    <div class="col-md-3">
      <card>
        <base-button block type="success" class=" mb-3" @click="modals.createUser = true">
          Crear Usuario
        </base-button>
      </card>
    </div>

    <modal :show.sync="modals.createUser" body-classes="p-0" modal-classes="modal-dialog-centered modal-lg">

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
              <base-input type="email" label="Correo" placeholder="ejemplo@email.com" v-model="user.email">
              </base-input>
            </div>
            <div class="col-md-4">
              <base-input type="phone" label="Telefono" placeholder="04241112233" v-model="user.phone">
              </base-input>
            </div>
            <div class="col-md-3">
              <base-input type="number" label="Cedula" v-model="user.cardId">
              </base-input>
            </div>
          </div>


          <div class="row">
            <div class="col-md-12">
              <base-input type="text" label="Dirección" placeholder="Calle Falsa 123" v-model="user.address">
              </base-input>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <base-input type="text" label="Clave" placeholder="password" v-model="user.password">
              </base-input>
            </div>
            <div class="col-md-6">
                <base-input type="text" label="Modelo">
                  <el-select v-model="user.role" class="select-success" placeholder="Selecciona una categoria"
                    label="Categoria" style="width: 100%;">
                    <el-option v-for="option in roles" :key="option.name" :value="option.value" :label="option.label">
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
        createUser: false,
      },
      roles: [
        { label: 'Taquilla', value: 'taquilla' },
        { label: 'Técnico', value: 'tecnico' },
        { label: 'Auditor', value: 'auditor' },
        { label: 'Superusuario', value: 'superusuario' },
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
        role: 'taquilla'
      }
    };
  },
  mounted() {
    this.getUsers()
  },
  methods: {
    updateProfile() {
      alert('Your data: ' + JSON.stringify(this.user));
    },
    async getUsers() {
      try {
        console.log(this.$store.state.auth)
        this.$axios.setToken(this.$store.state.auth.token, 'Bearer')
        const { data, error } = await this.$axios.get('/users')
        this.users = data;
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
    async addUser() {
      try {
        let toSend = { ...this.user }
        this.removeNullProps(toSend);
        this.$axios.setToken(this.$store.state.auth.token, 'Bearer');
        const { data, error } = await this.$axios.post('/users', toSend);
        this.resetObject(this.user);
        this.getUsers();
      } catch (error) {
        console.log(error)
      }
    },
    async updateUser() {
      try {
        let toSend = { ...this.user };
        this.removeNullProps(toSend);
        this.$axios.setToken(this.$store.state.auth.token, 'Bearer');
        const { data, error } = await this.$axios.patch('/users', toSend);
        this.resetObject(this.user);
        this.getUsers();
      } catch (error) {
        console.log(error)
      }
    },
  }
};
</script>
<style></style>
