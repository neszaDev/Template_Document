<template>
  <CModal
    :show="visible"
    size="xl"
    centered
    backdrop
    @update:show="$emit('close')"
    title="Template Builder"
  >
    <!-- BODY (DEFAULT SLOT – REQUIRED) -->
    <CRow>
      <!-- ================= LEFT ================= -->
      <CCol md="6">
        <h5>Template Configuration</h5>

        <CInput
          v-model="template.templateMeta.name"
          label="Template Name"
          placeholder="Template name"
        />

        <CTextarea
          v-model="template.templateMeta.description"
          label="Template Description"
          rows="2"
        />

        <hr />

        <h6>Document Configuration</h6>

        <CInput
          v-model="template.documentMeta.name"
          label="Document Name"
          placeholder="Document title"
        />

        <CTextarea
          v-model="template.documentMeta.description"
          label="Document Description"
          rows="2"
        />

        <CInput
          v-model="template.documentMeta.dataSource"
          label="Data Source"
        />

        <hr />

        <h6>Table Configuration</h6>
        <TableManager
          :data="data"
          :tables="template.layout.tables"
          @update="template.layout.tables = $event"
        />

        <hr />

        <h6>Chart Configuration</h6>
        <ChartManager
          :data="data"
          :charts="template.layout.charts"
          @update="template.layout.charts = $event"
        />
      </CCol>

      <!-- ================= RIGHT ================= -->
      <CCol md="6">
        <h5>Live Preview</h5>

        <CCard class="mb-3">
          <CCardBody>
            <h3>{{ template.documentMeta.name || "Document Title" }}</h3>
            <p class="text-muted">
              {{ template.documentMeta.description || "Document description" }}
            </p>
            <small class="text-muted">
              <strong>Source:</strong>
              {{ template.documentMeta.dataSource || "—" }}
            </small>
          </CCardBody>
        </CCard>

        <GenericDataTable
          v-for="t in template.layout.tables"
          :key="t.id"
          :title="t.name"
          :items="data"
          :fields-config="t.fields"
        />

        <ChartGenerator
          v-if="template.layout.charts.length"
          :data="data"
          :charts="template.layout.charts"
        />
      </CCol>
    </CRow>

    <!-- FOOTER SLOT -->
    <template #footer>
      <CButton color="secondary" @click="$emit('close')">
        Cancel
      </CButton>
      <CButton color="success" class="ml-2" @click="save">
        Save Template
      </CButton>
    </template>
  </CModal>
</template>


<script>
import {
  CModal,
  CCard,
  CCardHeader,
  CCardBody,
  CCardFooter,
  CRow,
  CCol,
  CInput,
  CTextarea,
  CButton,
} from "@coreui/vue";

import TableManager from "./table.config.vue";
import ChartManager from "./ChartManager.vue";
import GenericDataTable from "./GenericDataTable.vue";
import ChartGenerator from "./chart.generate.vue";

export default {
  name: "TemplateBuilderModal",

  components: {
    CModal,
    CCard,
    CCardHeader,
    CCardBody,
    CCardFooter,
    CRow,
    CCol,
    CInput,
    CTextarea,
    CButton,
    TableManager,
    ChartManager,
    GenericDataTable,
    ChartGenerator,
  },

  props: {
    visible: Boolean,
    data: Array,
  },

  data() {
    return {
      template: {
        templateMeta: {
          name: "",
          description: "",
        },
        documentMeta: {
          name: "",
          description: "",
          dataSource: "",
        },
        layout: {
          tables: [],
          charts: [],
        },
        createdAt: new Date().toISOString(),
      },
    };
  },

  methods: {
    save() {
      this.$emit("save", JSON.parse(JSON.stringify(this.template)));
    },
  },
};
</script>
