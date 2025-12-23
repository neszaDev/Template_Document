<template>
  <div class="p-3 bg-white rounded shadow-sm">
    <h3 class="mb-3 text-center">Template & Data</h3>

    <TemplateAndDataSelector
      :items="items"
      @open="openItem"
      @share="shareItem"
    />
  </div>
</template>

<script>
import TemplateAndDataSelector from "./templates/templateAndData.selector.vue";
import Service from "@/service/api";

export default {
  name: "TemplateAndData",

  components: {
    TemplateAndDataSelector,
  },

  data() {
    return {
      items: [],
      loading: true,
      error: null,
    };
  },

  async mounted() {
    try {
      const res = await Service.templateAndData("get");
      this.items = res.data?.data || [];
    } catch (err) {
      console.error(err);
      this.error = "Failed to load Template & Data list";
    } finally {
      this.loading = false;
    }
  },

  methods: {
    openItem(item) {
      this.$router.push(
        `/shared/document/${item._id}`
      );
    },

    shareItem(item) {
      const url = `${window.location.origin}/shared/document/${item._id}`;
      navigator.clipboard.writeText(url);
      alert("Share link copied");
    },
  },
};
</script>
