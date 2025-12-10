import Service from "@/service/api";

const TemplatesModule = {
  namespaced: true,

  state: {
    isReload: false,
    items: [],
  },

  mutations: {
    isReload(state, value) {
      state.isReload = value;
    },
    items(state, value) {
      state.items = value;
    },
  },

  actions: {
    // GET all templates
    fetch({ commit }, payload) {
      Service.templates("get", payload, {})
        .then((res) => {
          commit("items", res.data.data || []);
        })
        .catch(() => {});
    },

    // GET one template
    fetchOne(_, id) {
      return Service.templates("get-one", id, {});
    },

    // CREATE
    create({ commit }, payload) {
      Service.templates("post", payload, {})
        .then(() => {
          commit("isReload", true);
        })
        .catch(() => {});
    },

    // UPDATE
    update({ commit }, payload) {
      Service.templates("put", payload, {})
        .then(() => {
          commit("isReload", true);
        })
        .catch(() => {});
    },

    // DELETE
    remove({ commit }, payload) {
      Service.templates("delete", payload, {})
        .then(() => {
          commit("isReload", true);
        })
        .catch(() => {});
    },
  },

  getters: {
    items(state) {
      return state.items;
    },
    isReload(state) {
      return state.isReload;
    },
  },
};

export default TemplatesModule;
