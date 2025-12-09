<template>
  <div>
    <!-- ================= UPLOAD PAGE ================= -->
    <div v-if="view === 'upload'">
      <DragDropUpload @file-selected="handleFileUpload" />

      <!-- TEMPLATE SELECTOR MODAL -->
      <CModal
        :show="showTemplateSelector"
        centered
        backdrop
        :no-close-on-backdrop="true"
        size="xl"
      >
        <template #header>
          <h5 class="modal-title">Select Template</h5>
        </template>

        <TemplateSelector
          :data="uploadedData"
          @select="onTemplateSelected"
          @create="openBuilder"
        />

        <template #footer>
          <CButton color="secondary" @click="showTemplateSelector = false">
            Cancel
          </CButton>
        </template>
      </CModal>

      <!-- TEMPLATE BUILDER MODAL -->
      <TemplateBuilderModal
        :visible="showTemplateBuilder"
        :data="uploadedData"
        @close="closeBuilder"
        @save="onTemplateSaved"
      />
    </div>

    <!-- ================= DOCUMENT PREVIEW ================= -->
    <DocumentPreview
      v-if="view === 'preview'"
      :template="selectedTemplate"
      :data="uploadedData"
      @back="goBackToUpload"
    />
  </div>
</template>

<script>
import { CModal, CButton } from "@coreui/vue";
import DragDropUpload from "./templates/DragDropUpload.vue";
import TemplateSelector from "./templates/TemplateSelector.vue";
import TemplateBuilderModal from "./templates/template.config.vue";
import DocumentPreview from "./templates/DocumentPreview.vue";

export default {
  name: "Template",

  components: {
    CModal,
    CButton,
    DragDropUpload,
    TemplateSelector,
    TemplateBuilderModal,
    DocumentPreview,
  },

  data() {
    return {
      uploadedData: [],
      showTemplateSelector: false,
      showTemplateBuilder: false,
      selectedTemplate: null,
      view: "upload",
    };
  },

  methods: {
    handleFileUpload(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.uploadedData = JSON.parse(e.target.result);
        this.showTemplateSelector = true;
      };
      reader.readAsText(file);
    },

    // ✅ FIX HERE
    openBuilder() {
      // 1) ปิด selector ก่อน
      this.showTemplateSelector = false;

      // 2) รอ DOM update แล้วค่อยเปิด builder
      this.$nextTick(() => {
        this.showTemplateBuilder = true;
      });
    },

    closeBuilder() {
      this.showTemplateBuilder = false;
    },

    onTemplateSelected(template) {
      this.selectedTemplate = template;
      this.showTemplateSelector = false;
      this.view = "preview";
    },

    onTemplateSaved(template) {
      console.log("Saved template:", template);
      this.showTemplateBuilder = false;
    },

    goBackToUpload() {
      this.view = "upload";
      this.selectedTemplate = null;
    },
  },
};
</script>
