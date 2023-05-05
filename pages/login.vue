<template>
  <div class="container login-page">
    <div class="col-lg-4 col-md-6 ml-auto mr-auto">
      <card class="card-login card-white">
        <template slot="header">
          <img src="img//card-primary.png" alt="" />
          <h1 class="card-title">Inventario </h1>
        </template>

        <div>
          <base-input name="email" v-model="user.email" placeholder="Email" addon-left-icon="tim-icons icon-email-85">
          </base-input>

          <base-input name="password" v-model="user.password" type="password" placeholder="Password"
            addon-left-icon="tim-icons icon-lock-circle">
          </base-input>
        </div>

        <div slot="footer">
          <base-button native-type="submit" type="primary" class="mb-3" size="lg" @click="logon" block>
            Ingresa
          </base-button>
          <div class="pull-left">
          </div>

          <div class="pull-right">
            <h6><a href="#help!!!" class="link footer-link">¿Necesitas ayuda?</a></h6>
          </div>
        </div>
      </card>
    </div>
  </div>
</template>
<script>
// import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = process.env.supabaseUrl
// const supabaseKey = process.env.supabaseKey
// const supabase = createClient(supabaseUrl, supabaseKey)

export default {
  middleware: 'notAuthenticated',
  name: "login-page",
  layout: "auth",
  data() {
    return {
      user: {
        email: "",
        password: ""
      }
    };
  },
  mounted() {
  },
  methods: {
    async logon() {
      try {
        let { data, error } = await this.$axios.post('/login', {
          user: this.user.email,
          password: this.user.password
        })
        if (!data.error) {

          this.$notify({
            type: "success",
            icon: "tim-icons icon-check-2",
            message: "Bienvenido " + data.user.username
          });

          const auth = {
            token: data.token,
            userData: data.user
          }

          //token to de store - token a la tienda
          this.$store.commit('setAuth', auth);

          //set auth object in localStorage - Grabamos el token en localStorage
          localStorage.setItem('auth', JSON.stringify(auth));

          $nuxt.$router.push('/');

          return;
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style>
.navbar-nav .nav-item p {
  line-height: inherit;
  margin-left: 5px;
}
</style>