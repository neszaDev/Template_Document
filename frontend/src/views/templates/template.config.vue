<template>
  <CRow>
    <!-- ================= LEFT ================= -->
    <CCol md="6">
      <h5>Template Configuration</h5>

      <CInput v-model="template.templateMeta.name" label="Template Name" />
      <CTextarea v-model="template.templateMeta.description" rows="2" label="Template description"/>

      <hr />

      <h6>Document Configuration</h6>
      <CInput v-model="template.documentMeta.name" label="Document Name" />
      <CTextarea v-model="template.documentMeta.description" rows="2" label="Document description"/>
      <CInput v-model="template.documentMeta.dataSource" label="Data Source" />

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

      <Crow>
        <CCard class="mb-4">
          <CCardBody>
            <h5>Document Name: {{ template.documentMeta.name }}</h5>
            <small>Document Description: {{ template.documentMeta.description }}</small>
          </CCardBody>
        </CCard>

      </Crow>
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
</template>

<script>
import TableManager from "./table.config.vue";
import ChartManager from "./ChartManager.vue";
import GenericDataTable from "./GenericDataTable.vue";
import ChartGenerator from "./chart.generate.vue";

export default {
  name: "TemplateBuilder",

  components: {
    TableManager,
    ChartManager,
    GenericDataTable,
    ChartGenerator,
  },

  props: {
    data: Array,
  },

  data() {
    return {
      template: {
        templateMeta: { name: "", description: "" },
        documentMeta: { name: "", description: "", dataSource: "" },
        layout: { tables: [], charts: [] },
        createdAt: new Date().toISOString(),
      },
    };
  },

  methods: {
    getPayload() {
      return JSON.parse(JSON.stringify(this.template));
    },
  },
};
</script>
