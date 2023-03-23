export const state = () => ({
  auth: null,
  notifications: [],
});

export const mutations = {
  setAuth(state, auth) {
    state.auth = auth;
  },

  setNotifications(state, notifications) {
    state.notifications = notifications;
  },
};

export const actions = {
  readToken() {
    let auth = null;
    try {
      auth = JSON.parse(localStorage.getItem("auth"));
    } catch (error) {
      console.log(error);
    }
    //saving auth in state
    this.commit("setAuth", auth);
  },
  getNotifications() {
    console.log('notificaciones')
}
}
