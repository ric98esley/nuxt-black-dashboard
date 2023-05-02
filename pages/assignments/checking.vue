<template>
  <div class="row">
    <div class="col-md-12">
      <h1>Recibir activos</h1>
    </div>
    <div class="col-md-12">
      <card>
        <base-input label="Buscar Activo asignado" v-model="search"></base-input>
      </card>
    </div>
    <div class="col-md-6">
      <card>
        <h4 slot="header" class="card-title">Lista de asiganaciones activas</h4>
        <el-table>

        </el-table>
      </card>
    </div>
    <div class="col-md-6">
      <card>
        <h4 slot="header" class="card-title">Recibir</h4>
        <el-table>

        </el-table>
      </card>
    </div>
  </div>
</template>


<script>
  export default {
    middleware: "authenticated",
    name: "checking",
    data() {
      return {
        search: ""
      }
    }
  }
</script>