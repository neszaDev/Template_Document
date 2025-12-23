<template>
  <CCard>
    <CCardBody>
      <h5 v-if="title" class="mb-3">{{ title }}</h5>

      <CDataTable
        v-if="items.length"
        :items="paginatedItems"
        :fields="resolvedFields"
        hover
        striped
        :loading="loading"
        :table-filter="{ external: true }"
        :sorter="{ external: true }"
        :items-per-page="itemsPerPage"
        :active-page="activePage"
        @update:table-filter-value="tableFilterValue = $event"
        @update:column-filter-value="columnFilterValue = $event"
        @update:sorter-value="sorterValue = $event"
      />

      <CPagination
        v-if="pages > 1"
        :pages="pages"
        :active-page.sync="activePage"
        align="center"
        class="mt-3"
      />
    </CCardBody>
  </CCard>
</template>

<script>
import { CCard, CCardBody, CDataTable, CPagination } from "@coreui/vue";

export default {
  name: "GenericDataTable",

  components: {
    CCard,
    CCardBody,
    CDataTable,
    CPagination,
  },

  props: {
    items: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      default: "",
    },
    fieldsConfig: {
      type: Array,
      default: null,
    },
    itemsPerPage: {
      type: Number,
      default: 10,
    },
  },

  data() {
    return {
      activePage: 1,
      tableFilterValue: "",
      columnFilterValue: {},
      sorterValue: {},
      loading: false,
    };
  },

  computed: {
    resolvedFields() {
      if (this.fieldsConfig?.length) {
        return this.fieldsConfig;
      }

      if (!this.items.length) return [];
      return Object.keys(this.items[0]).map((k) => ({
        key: k,
        label: k,
        sorter: true,
        filter: true,
      }));
    },

    filteredItems() {
      let data = [...this.items];

      /* GLOBAL SEARCH */
      if (this.tableFilterValue) {
        const search = this.tableFilterValue.toLowerCase();
        data = data.filter((row) =>
          Object.values(row)
            .join(" ")
            .toLowerCase()
            .includes(search)
        );
      }

      /* COLUMN FILTER */
      Object.entries(this.columnFilterValue || {}).forEach(
        ([key, value]) => {
          if (!value) return;
          const search = String(value).toLowerCase();
          data = data.filter((row) =>
            String(row[key]).toLowerCase().includes(search)
          );
        }
      );

      return data;
    },

    sortedItems() {
      const { column, asc } = this.sorterValue || {};
      if (!column) return this.filteredItems;

      return [...this.filteredItems].sort((a, b) => {
        if (a[column] > b[column]) return asc ? 1 : -1;
        if (a[column] < b[column]) return asc ? -1 : 1;
        return 0;
      });
    },

    paginatedItems() {
      const start = (this.activePage - 1) * this.itemsPerPage;
      return this.sortedItems.slice(start, start + this.itemsPerPage);
    },

    pages() {
      return Math.ceil(this.sortedItems.length / this.itemsPerPage);
    },
  },

  watch: {
    tableFilterValue() {
      this.activePage = 1;
      this.fakeLoading();
    },
    columnFilterValue() {
      this.activePage = 1;
      this.fakeLoading();
    },
    sorterValue() {
      this.fakeLoading();
    },
  },

  methods: {
    fakeLoading() {
      this.loading = true;
      setTimeout(() => (this.loading = false), 250);
    },
  },
};
</script>
