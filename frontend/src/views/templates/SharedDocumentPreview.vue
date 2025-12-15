<template>
  <div class="shared-document p-3">
    <!-- ================= LOADING ================= -->
    <div
      v-if="loading"
      class="text-center p-5 vh-100 d-flex justify-content-center align-items-center"
    >
      <CSpinner style="width: 4rem; height: 4rem" />
    </div>

    <!-- ================= ERROR ================= -->
    <div
      v-else-if="error"
      class="text-center p-5 text-danger vh-100 d-flex justify-content-center align-items-center"
    >
      <h5>{{ error }}</h5>
    </div>

    <!-- ================= CONTENT ================= -->
    <div v-else-if="template">
      <!-- HEADER -->
      <CCard class="mb-4">
        <CCardBody>
          <h3>{{ template.documentMeta.name }}</h3>
          <div v-html="template.documentMeta.description"></div>
        </CCardBody>
      </CCard>

      <!-- TABLES -->
      <GenericDataTable
        v-for="t in template.layout.tables"
        :key="t._id || t.id"
        :title="t.name"
        :items="data"
        :fields-config="t.fields"
        class="mb-4"
      />

      <!-- CHARTS -->
      <ChartGenerator
        v-if="template.layout.charts && template.layout.charts.length"
        :data="data"
        :charts="template.layout.charts"
      />
    </div>
  </div>
</template>

<script>
import { CCard, CCardBody, CSpinner } from "@coreui/vue";
import GenericDataTable from "@/views/templates/GenericDataTable.vue";
import ChartGenerator from "@/views/templates/chart.generate.vue";
import Service from "@/service/api";

export default {
  name: "SharedDocumentPreview",

  components: {
    CCard,
    CCardBody,
    CSpinner,
    GenericDataTable,
    ChartGenerator,
  },

  data() {
    return {
      template: null,
      data: [],
      loading: true,
      error: null,
      reloadTimer: null,
    };
  },

  async mounted() {
    await this.loadDocument();

    this.reloadTimer = setInterval(() => {
      this.loadDocument(false);
    }, 30000);
  },

  beforeDestroy() {
    if (this.reloadTimer) {
      clearInterval(this.reloadTimer);
      this.reloadTimer = null;
    }
  },

  methods: {
    async loadDocument(showLoading = true) {
      try {
        const id = this.$route.params.id;
        if (!id) throw new Error("Missing document id");

        if (showLoading) this.loading = true;

        /* ===== TEMPLATE + META ===== */
        const res = await Service.templateAndData("get-one", id);
        const doc = res?.data?.data;

        if (!doc || !doc.templateId) {
          throw new Error("Document not found");
        }

        this.template = doc.templateId;

        /* ===== DATA ===== */
        const dataRes = await Service.templateAndData("fetch-data", id);
        this.data = Array.isArray(dataRes?.data?.data)
          ? dataRes.data.data
          : [];

        this.error = null;
      } catch (err) {
        console.error("SharedDocumentPreview error:", err);
        this.error = "Failed to load shared document.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.shared-document {
  padding: 1rem;
}
</style>
