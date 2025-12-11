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
          <CCol>
            <CButton
              color="primary"
              size="sm"
              @click="openShare"
              class="float-right"
            >
              Share
            </CButton>
          </CCol>
        </CRow>
      </CCardHeader>
      <!-- ================= WARNINGS ================= -->
      <div v-if="missingFields.length" class="alert alert-danger p-3 mb-4">
        <h5 class="mb-2">⚠ Missing Required Fields</h5>
        <p>
          The API data does not contain the fields required by this template.
        </p>

        <ul class="mb-0">
          <li v-for="f in missingFields" :key="f">{{ f }}</li>
        </ul>

        <p class="mt-3 mb-0 text-muted">
          Charts and tables may not display correctly until these fields exist
          in the API response.
        </p>
      </div>

      <CCardBody class="d-flex align-items-center">
        <div>
          <h4 class="mb-0">{{ documentTitle }}</h4>
          <div v-html="documentDescription"></div>
        </div>
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
    <CModal :show.sync="showShare" title="Share Document">
      <div>
        <CInput :value="shareUrl" readonly />
        <CButton color="success" class="mt-2" @click="copy">
          Copy Link
        </CButton>
      </div>
    </CModal>
  </div>
</template>

<script>
import { CCard, CCardBody, CCardHeader, CButton } from "@coreui/vue";
import GenericDataTable from "./GenericDataTable.vue";
import ChartGenerator from "./chart.generate";

export default {
  name: "DocumentPreview",

  components: {
    CCard,
    CCardBody,
    CCardHeader,
    CButton,
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
      showShare: false,

      // NEW: validation states
      missingFields: [],
      requiredFields: [],
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

    shareUrl() {
      return `${window.location.origin}/shared/document/${
        this.template._id
      }?api=${encodeURIComponent(this.apiUrl)}`;
    },
  },

  methods: {
    openShare() {
      this.showShare = true;
    },

    copy() {
      navigator.clipboard.writeText(this.shareUrl);
    },

    /* ================== REQUIRED FIELD EXTRACTION ================== */

    extractRequiredFields() {
      const fields = new Set();

      // tables
      this.template?.layout?.tables?.forEach((t) => {
        t.fields.forEach((f) => fields.add(f.key));
      });

      // charts
      this.template?.layout?.charts?.forEach((c) => {
        fields.add(c.labelKey);
        c.valueKeys.forEach((v) => fields.add(v));
      });

      this.requiredFields = [...fields];
    },

    /* ================== MISSING FIELD DETECTION ================== */

    checkMissingFields() {
      if (!Array.isArray(this.data) || !this.data.length) {
        this.missingFields = [];
        return;
      }

      const sample = this.data[0];
      this.missingFields = this.requiredFields.filter((f) => !(f in sample));
    },
  },

  /* ================== WATCHERS (MUST BE OUTSIDE methods!) ================== */
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
