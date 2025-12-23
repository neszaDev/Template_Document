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
          {{ item.templateMeta.ownerDepartment.join(", ")}}
        </td>
      </template>

      <!-- DATA SOURCE -->
      <template #source>
        <td>
          <CBadge color="info">Data Source</CBadge>
        </td>
      </template>

      <!-- Create at -->
      <template #createdAt="{ item }">
        <td>{{ formatDate(item.createdAt) }}</td>
      </template>

      <!-- STATUS -->
      <template #status>
        <td class="text-right">
          <CBadge color="success">READY</CBadge>
        </td>
      </template>

      <!-- ACTION -->
      <template #action="{ item }">
        <td class="text-center">
          <CButton size="sm" color="secondary" @click="$emit('share', item)">
            Share
          </CButton>

          <CButton
            size="sm"
            color="primary"
            class="ml-2"
            @click="$emit('open', item)"
          >
            Open
          </CButton>
        </td>
      </template>
    </CDataTable>
  </div>
</template>

<script>
import { CDataTable, CButton, CBadge } from "@coreui/vue";

export default {
  name: "TemplateAndDataSelector",

  components: {
    CDataTable,
    CButton,
    CBadge,
  },

  props: {
    items: {
      type: Array,
      required: true,
    },
  },

  computed: {
    tableItems() {
      return this.items.map((d) => ({
        ...d,
        templateMeta: d.templateId.templateMeta, // normalize shape
      }));
    },
  },

  data() {
    return {
      fields: [
        { key: "templateName", label: "Template", sorter: true },
        { key: "owner", label: "Owner", sorter: true },
        { key: "source", label: "Data Source" },
        { key: "createdAt", label: "Create At" },
        {
          key: "status",
          label: "Status",
          _style: "width:90px;text-align:right;",
        },
        {
          key: "action",
          label: "",
          sorter: false,
          filter: false,
          _style: "width:160px;text-align:center;",
        },
      ],
    };
  },

  methods: {
    formatDate(date) {
      if (!date) return "-";
      const d = new Date(date);
      return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    },
  },
};
</script>
