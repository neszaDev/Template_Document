<template>
  <div class="document-preview">
    <!-- ================= HEADER BAR ================= -->
    <CCard class="mb-3">
      <CCardBody class="d-flex align-items-center">
        <CButton color="link" class="p-0 mr-3" @click="$emit('back')">
          ← Back
        </CButton>

        <div>
          <h4 class="mb-0">{{ documentTitle }}</h4>
          <small class="text-muted">{{ documentDescription }}</small>
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
    template: {
      type: Object,
      required: true,
    },
    data: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    documentTitle() {
      return this.template.documentMeta
        ? this.template.documentMeta.name
        : "Document Preview";
    },

    documentDescription() {
      return this.template.documentMeta
        ? this.template.documentMeta.description
        : "";
    },

    tables() {
      return this.template.layout ? this.template.layout.tables || [] : [];
    },

    charts() {
      return this.template.layout ? this.template.layout.charts || [] : [];
    },
  },
};
</script>

<style scoped>
.document-preview {
  padding: 1rem;
}
</style>
