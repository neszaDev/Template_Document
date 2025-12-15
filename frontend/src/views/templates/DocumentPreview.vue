<template>
  <div class="document-preview">
    <!-- ================= HEADER BAR ================= -->
    <CCard class="mb-3">
      <CCardHeader>
        <CRow>
          <CCol>
            <CButton color="link" class="p-0 mr-3" @click="$emit('back')">
              ← Back
            </CButton>
          </CCol>
          <CCol class="text-right">
            <CButton
              color="success"
              :disabled="saving"
              @click="saveTemplateAndData"
            >
              {{ saving ? "Saving..." : "Save & Share" }}
            </CButton>
          </CCol>
        </CRow>
      </CCardHeader>

      <!-- ================= API URL WARNING ================= -->
      <div v-if="apiUrlError" class="alert alert-danger p-3 mb-0 rounded-0">
        ⚠ API URL is required before saving this document.
      </div>

      <!-- ================= MISSING FIELDS WARNING ================= -->
      <div
        v-if="missingFields.length"
        class="alert alert-warning p-3 mb-0 rounded-0"
      >
        <h6 class="mb-2">Missing Required Fields</h6>
        <ul class="mb-0">
          <li v-for="f in missingFields" :key="f">{{ f }}</li>
        </ul>
      </div>

      <CCardBody>
        <h4 class="mb-0">{{ documentTitle }}</h4>
        <div v-html="documentDescription"></div>
      </CCardBody>
    </CCard>

    <!-- ================= TABLES ================= -->
    <div v-for="table in tables" :key="table.id" class="mb-4">
      <GenericDataTable
        :title="table.name"
        :items="data"
        :fields-config="table.fields"
      />
    </div>

    <!-- ================= CHARTS ================= -->
    <CCard v-for="chart in charts" :key="chart.id" class="mb-4">
      <CCardHeader>
        <strong>{{ chart.name }}</strong>
      </CCardHeader>
      <CCardBody>
        <ChartGenerator :data="data" :charts="[chart]" />
      </CCardBody>
    </CCard>

    <!-- ================= SUCCESS MODAL ================= -->
    <CModal :show="showSuccess" centered>
      <template #header>
        <h5>Saved Successfully</h5>
      </template>

      <p class="mb-2">Your document has been saved and is ready to share.</p>

      <template #footer>
        <CButton color="secondary" @click="showSuccess = false">
          Close
        </CButton>
        <CButton color="primary" @click="goToTemplateAndData">
          Open Document
        </CButton>
      </template>
    </CModal>
  </div>
</template>

<script>
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CModal,
  CRow,
  CCol,
} from "@coreui/vue";

import GenericDataTable from "./GenericDataTable.vue";
import ChartGenerator from "./chart.generate";

export default {
  name: "DocumentPreview",

  components: {
    CCard,
    CCardBody,
    CCardHeader,
    CButton,
    CModal,
    CRow,
    CCol,
    GenericDataTable,
    ChartGenerator,
  },

  props: {
    template: Object,
    data: Array,
    apiUrl: String,
  },

  data() {
    return {
      missingFields: [],
      requiredFields: [],
      apiUrlError: false,
      showSuccess: false,
      createdId: null,
      saving: false,
    };
  },

  computed: {
    documentTitle() {
      return this.template?.documentMeta?.name || "Document Preview";
    },
    documentDescription() {
      return this.template?.documentMeta?.description || "";
    },
    tables() {
      return this.template?.layout?.tables || [];
    },
    charts() {
      return this.template?.layout?.charts || [];
    },
  },

  methods: {
    /* ================= REQUIRED FIELD EXTRACTION ================= */

    extractRequiredFields() {
      const fields = new Set();

      this.template?.layout?.tables?.forEach((t) => {
        t.fields.forEach((f) => fields.add(f.key));
      });

      this.template?.layout?.charts?.forEach((c) => {
        fields.add(c.labelKey);
        c.valueKeys.forEach((v) => fields.add(v));
      });

      this.requiredFields = [...fields];
    },

    /* ================= MISSING FIELD CHECK ================= */

    checkMissingFields() {
      if (!this.data?.length) {
        this.missingFields = [];
        return;
      }

      const sample = this.data[0];
      this.missingFields = this.requiredFields.filter((f) => !(f in sample));
    },

    /* ================= SAVE ================= */
    async saveTemplateAndData() {
      if (this.saving) return;
      this.saving = true;

      try {
        if (!this.apiUrl) {
          this.apiUrlError = true;
          return;
        }

        if (!this.template?._id) return;

        const payload = {
          templateId: this.template._id,
          dataSource: this.apiUrl,
          dataMeta: {
            fields: this.data.length ? Object.keys(this.data[0]) : [],
            lastFetchedAt: new Date(),
          },
        };

        const created = await this.$store.dispatch(
          "templateAndData/create",
          payload
        );

        if (!created?._id) return;

        this.createdId = created._id;
        this.showSuccess = true;
      } catch (err) {
        console.error("Save TemplateAndData failed", err);
      } finally {
        this.saving = false; 
      }
    },

    goToTemplateAndData() {
      this.showSuccess = false;
      this.$router.push(`/templates/TemplateAndData`);
    },
  },

  watch: {
    data: {
      handler() {
        this.extractRequiredFields();
        this.checkMissingFields();
      },
      immediate: true,
    },
    template: {
      handler() {
        this.extractRequiredFields();
        this.checkMissingFields();
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style scoped>
.document-preview {
  padding: 1rem;
}
</style>
