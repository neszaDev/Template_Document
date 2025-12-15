import Service from "@/service/api";

const TemplateAndDataModule = {
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
    // ================= GET ALL =================
    fetch({ commit }, payload) {
      Service.templateAndData("get", payload, {})
        .then((res) => {
          commit("items", res.data.data || []);
        })
        .catch(() => {});
    },

    // ================= GET ONE =================
    fetchOne(_, id) {
      return Service.templateAndData("get-one", id, {});
    },

    // ================= CREATE =================
    create({ commit }, payload) {
      return Service.templateAndData("post", payload, {})
        .then((res) => {
          commit("isReload", true);
          return res.data.data; // 🔑 REQUIRED for routing
        })
        .catch(() => {});
    },

    // ================= DELETE =================
    remove({ commit }, payload) {
      Service.templateAndData("delete", payload, {})
        .then(() => {
          commit("isReload", true);
        })
        .catch(() => {});
    },

    // ================= FETCH DATA =================
    fetchData(_, id) {
      return Service.templateAndData("fetch-data", id, {});
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

export default TemplateAndDataModule;
