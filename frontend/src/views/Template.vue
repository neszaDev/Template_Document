<template>
  <div>
    <!-- ================= TEMPLATE LIST ================= -->
    <div  v-if="!selectedTemplate" class="bg-white px-4 py-2 rounded shadow-sm text-dark">
      <h3 class="my-2 text-center">Template</h3>
      <TemplateSelector
        :templates="templateData"
        :data="currentData"
        @select="useTemplate"
        @create="openBuilder"
      />
    </div>

    <!-- ================= DOCUMENT PREVIEW ================= -->
    <div v-else>
      <!-- API FOR DOCUMENT PREVIEW -->
      <ApiSourcePanel
        class="mb-4"
        @loaded="setApiData"
        @api-url="apiUrl = $event"
      />

      <DocumentPreview
        :template="selectedTemplate"
        :data="currentData"
        :apiUrl="apiUrl"
        @back="reset"
      />
    </div>

    <!-- ================= TEMPLATE BUILDER MODAL ================= -->
    <CModal
      :show="showTemplateBuilder"
      size="xl"
      centered
      :no-close-on-backdrop="true"
    >
      <template #header>
        <h5>Create Template</h5>
      </template>

      <!-- API FOR TEMPLATE BUILDER -->
      <ApiSourcePanel
        class="mb-4"
        @loaded="setApiData"
        @api-url="apiUrl = $event"
      />

      <TemplateBuilder ref="builder" :data="apiData" />

      <template #footer>
        <CButton color="secondary" @click="closeBuilder"> Cancel </CButton>
        <CButton color="success" @click="saveTemplate"> Save Template </CButton>
      </template>
    </CModal>
  </div>
</template>

<script>
import { CModal, CButton } from "@coreui/vue";

import TemplateSelector from "./templates/template.selector.vue";
import TemplateBuilder from "./templates/template.config.vue";
import ApiSourcePanel from "./templates/ApiSourcePanel.vue";
import DocumentPreview from "./templates/document.preview.vue";
import { generateMockData } from "./templates/utils/mockData";

export default {
  components: {
    CModal,
    CButton,
    TemplateSelector,
    TemplateBuilder,
    ApiSourcePanel,
    DocumentPreview,
  },

  data() {
    return {
      selectedTemplate: null,
      showTemplateBuilder: false,
      apiUrl: null,
      apiData: [],
      mockData: [],
    };
  },

  computed: {
    templateData() {
      return this.$store.getters["templates/items"] || [];
    },

    currentData() {
      return this.apiData.length ? this.apiData : this.mockData;
    },
  },

  methods: {
    /* ================= TEMPLATE FLOW ================= */

    useTemplate(template) {
      this.selectedTemplate = template;
      this.mockData = generateMockData(template);
      this.apiData = [];
    },

    reset() {
      this.selectedTemplate = null;
      this.apiData = [];
      this.mockData = [];
    },

    /* ================= BUILDER MODAL ================= */

    openBuilder() {
      this.apiData = [];
      this.showTemplateBuilder = true;
    },

    closeBuilder() {
      this.showTemplateBuilder = false;
    },

    async saveTemplate() {
      const payload = this.$refs.builder.getPayload();
      if (!payload) return;

      await this.$store.dispatch("templates/create", payload);
      await this.$store.dispatch("templates/fetch");

      this.showTemplateBuilder = false;
      this.$refs.builder?.reset?.();
    },

    /* ================= API DATA ================= */

    setApiData(data) {
      this.apiData = Array.isArray(data) ? data : [];
    },
  },

  mounted() {
    this.$store.dispatch("templates/fetch");
  },
};
</script>

