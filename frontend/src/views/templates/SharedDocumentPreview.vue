<template>
  <div class="shared-document p-3">
    <!-- ================= LOADING ================= -->
    <div v-if="loading" class="text-center p-5 vh-100 d-flex justify-content-center align-items-center">
      <CSpinner class="mr-2" style="width:4rem;height:4rem;"/>
    </div>

    <!-- ================= ERROR ================= -->
    <div v-else-if="error" class="text-center p-5 text-danger vh-100 d-flex justify-content-center align-items-center">
      <h5>{{ error }}</h5>
    </div>

    <!-- ================= CONTENT ================= -->
    <div v-else-if="template">
      <CCard class="mb-4">
        <CCardBody>
          <h3>{{ template.documentMeta.name }}</h3>
          <div v-html="template.documentMeta.description" />
        </CCardBody>
      </CCard>

      <!-- TABLES -->
      <GenericDataTable
        v-for="t in template.layout.tables"
        :key="t.id"
        :title="t.name"
        :items="data"
        :fields-config="t.fields"
        class="mb-4"
      />

      <!-- CHARTS -->
      <ChartGenerator
        v-if="template.layout.charts.length"
        :data="data"
        :charts="template.layout.charts"
      />
    </div>
  </div>
</template>

<script>
import GenericDataTable from "@/views/templates/GenericDataTable.vue";
import ChartGenerator from "@/views/templates/chart.generate.vue";
import Service from "@/service/api";

export default {
  components: { GenericDataTable, ChartGenerator },

  data() {
    return {
      template: null,
      data: [],
      loading: true,
      error: null,
    };
  },

  async mounted() {
    const { id } = this.$route.params;
    const api = this.$route.query.api;

    try {
      /* ---------------- Template Fetch ---------------- */
      const t = await Service.templates("get-one", id);

      if (!t.data?.data) {
        throw new Error("Template not found.");
      }

      this.template = t.data.data;

      /* ---------------- API Fetch (Optional) ---------------- */
      if (api) {
        try {
          const res = await fetch(api);

          if (!res.ok) {
            throw new Error(`API error (${res.status})`);
          }

          const json = await res.json();
          this.data = Array.isArray(json.data) ? json.data : json;
        } catch (apiErr) {
          this.error = `⚠️ Failed to load API data: ${apiErr.message}`;
          this.data = []; // fallback to empty
        }
      }
    } catch (err) {
      console.error("Load error:", err);
      this.error = "Failed to load document.";
    } finally {
      this.loading = false;
    }
  },
};
</script>

<style scoped>
.shared-document {
  padding: 1rem;
}
</style>
