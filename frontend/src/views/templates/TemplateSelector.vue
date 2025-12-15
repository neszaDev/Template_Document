<template>
  <div>
    <CDataTable
      :items="tableItems"
      :fields="fields"
      hover
      striped
      bordered
      table-filter
      sorter
      pagination
      :items-per-page="10"
    >
      <!-- TEMPLATE COLUMN -->
      <template #templateName="{ item }">
        <td>
          <strong>{{ item.templateMeta.name }}</strong>
          <div
            class="text-muted small"
            v-html="item.templateMeta.description"
          ></div>
        </td>
      </template>

      <!-- OWNER -->
      <template #owner="{ item }">
        <td>
          {{ item.templateMeta.ownerDepartment.join(", ") }}
        </td>
      </template>

      <!-- STATUS -->
      <template #status="{ item }">
        <td class="text-right">
          <CBadge :color="item.templateMeta.status ? 'success' : 'secondary'">
            {{ item.templateMeta.status ? "ON" : "OFF" }}
          </CBadge>
        </td>
      </template>

      <!-- ACTION -->
      <template #action="{ item }">
        <td class="text-center">
          <CButton
            size="sm"
            color="primary"
            :disabled="!item.templateMeta.status"
            @click="useTemplate(item)"
          >
            Use
          </CButton>
        </td>
      </template>
      <!-- DELETE -->
      <!-- <template #delete="{ item }">
        <td class="text-center">
          <CButton
            size="sm"
            color="danger"
            :disabled="!item.templateMeta.status"
            @click="deleteTemplate(item)"
          >
            <CIcon name="cil-trash" />
          </CButton>
        </td>
      </template> -->
    </CDataTable>

    <!-- CREATE BUTTON -->
    <CButton color="primary" block class="mt-3" @click="$emit('create')">
      + Create New Template
    </CButton>
  </div>
</template>

<script>
import { CDataTable, CButton, CModal, CBadge } from "@coreui/vue";

export default {
  name: "TemplateSelector",

  components: {
    CDataTable,
    CButton,
    CModal,
    CBadge,
  },

  props: {
    templates: {
      type: Array,
      required: true,
    },
    data: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      showWarning: false,
      pendingTemplate: null,

      fields: [
        { key: "templateName", label: "Template", sorter: true },
        { key: "owner", label: "Owner", sorter: true },
        { key: "source", label: "Data Source", sorter: true },
        {
          key: "status",
          label: "Status",
          sorter: true,
          _style: "width:90px;text-align:right;",
        },
        {
          key: "action",
          label: "",
          sorter: false,
          filter: false,
          _style: "width:110px;text-align:center;",
        },
        // {
        //   key: "delete",
        //   label: "",
        //   sorter: false,
        //   filter: false,
        //   _style: "width:110px;text-align:center;",
        // },
      ],
    };
  },

  computed: {
    tableItems() {
      return this.templates.map((t) => ({
        ...t,
        templateName: t.templateMeta.name,
        owner: t.templateMeta.ownerDepartment.join(", "),
        source: t.documentMeta.dataSource,
        status: t.templateMeta.status ? "ON" : "OFF",
      }));
    },
  },

  methods: {
    getDataKeys() {
      if (!Array.isArray(this.data) || !this.data.length) return [];
      return Object.keys(this.data[0]);
    },

    validateTemplate(template) {
      const dataKeys = this.getDataKeys();
      if (!dataKeys.length) return false;

      const tableKeys = template.layout.tables.flatMap((t) =>
        t.fields.map((f) => f.key)
      );

      const chartKeys = template.layout.charts.flatMap((c) => [
        c.labelKey,
        ...(c.valueKeys || []),
      ]);

      return [...tableKeys, ...chartKeys].every((k) => dataKeys.includes(k));
    },

    useTemplate(template) {
      if (!template.templateMeta.status) return;

      if (!this.data.length) {
        this.$emit("select", template);
        return;
      }

      const isValid = this.validateTemplate(template);

      if (!isValid) {
        this.pendingTemplate = template;
        this.showWarning = true;
        return;
      }

      this.$emit("select", template);
    },

    forceSelect() {
      this.showWarning = false;
      this.$emit("select", this.pendingTemplate);
      this.pendingTemplate = null;
    },

    deleteTemplate(template) {
      this.$emit("delete", template);
    },
  },
};
</script>
