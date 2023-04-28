export default function ({ $axios,store, redirect }) {
  $axios.onRequest(config => {
    console.log('Making request to ' + config.url)
  })


  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status)
    if (code === 401) {
      console.log("logout");

      localStorage.clear();

      const auth = {};
      this.$store.commit("setAuth", auth);

      window.location.href = "/login";
    }
  })

  $axios.interceptors.request.use(config => {
    if (config.url.includes('login')) {
      return config
    }
    const token = store.state.auth.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })
}