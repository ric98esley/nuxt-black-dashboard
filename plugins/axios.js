export default function ({ $axios, redirect }) {
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
}