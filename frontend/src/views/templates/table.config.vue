<template>
  <div>
    <!-- ADD TABLE (LOCAL ONLY) -->
    <CButton color="primary" class="mb-3" @click="addTable">
      + Add Table
    </CButton>

    <!-- TABLE CONFIG LIST -->
    <CCard
      v-for="(table, tableIndex) in localTables"
      :key="table.id"
      class="mb-4"
    >
      <CCardBody>
        <!-- TABLE HEADER -->
        <CRow class="mb-3 align-items-center">
          <CCol md="8">
            <CInput v-model="table.name" placeholder="Table name" />
          </CCol>

          <CCol md="4" class="text-right">
            <CButton
              color="danger"
              size="sm"
              variant="outline"
              @click="removeTable(tableIndex)"
            >
              Delete
            </CButton>
          </CCol>
        </CRow>

        <h6>Select Columns</h6>

        <CRow>
          <CCol v-for="key in dataKeys" :key="key" md="4" class="mb-2">
            <CInputCheckbox
              :label="key"
              :checked="hasColumn(table, key)"
              @update:checked="toggleColumn(tableIndex, key)"
            />
          </CCol>
        </CRow>

        <!-- Rename -->
        <div v-if="table.fields.length" class="mt-3">
          <h6>Rename Columns</h6>

          <CRow
            v-for="(field, fieldIndex) in table.fields"
            :key="field.key"
            class="mb-2"
          >
            <CCol md="6">
              <CInput v-model="field.label" placeholder="Column label" />
            </CCol>

            <CCol md="6">
              <CInput :value="field.key" disabled />
            </CCol>
          </CRow>
        </div>
      </CCardBody>
    </CCard>

    <!-- ACTION BUTTONS -->
    <CRow class="mt-4">
      <CCol class="text-right">
        <CButton
          color="secondary"
          variant="outline"
          class="mr-2"
          @click="resetChanges"
        >
          Cancel
        </CButton>

        <CButton color="success" @click="applyChanges">
          Apply Changes
        </CButton>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import {
  CButton,
  CCard,
  CCardBody,
  CRow,
  CCol,
  CInput,
  CInputCheckbox,
} from "@coreui/vue";

export default {
  name: "TableManager",

  components: {
    CButton,
    CCard,
    CCardBody,
    CRow,
    CCol,
    CInput,
    CInputCheckbox,
  },

  props: {
    data: {
      type: Array,
      required: true,
    },
    tables: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      localTables: [], // STAGING AREA
    };
  },

  watch: {
    tables: {
      immediate: true,
      handler(v) {
        const safe = Array.isArray(v) ? v : [];
        this.localTables = JSON.parse(JSON.stringify(safe));
      },
    },
  },

  computed: {
    dataKeys() {
      if (!this.data.length) return [];
      return Object.keys(this.data[0]);
    },
  },

  methods: {
    /* ---------- local mutations ---------- */

    addTable() {
      this.localTables.push({
        id: Date.now(),
        name: "New Table",
        fields: [],
      });
    },

    removeTable(index) {
      this.localTables.splice(index, 1);
    },

    hasColumn(table, key) {
      return table.fields.some((f) => f.key === key);
    },

    toggleColumn(tableIndex, key) {
      const table = this.localTables[tableIndex];
      const idx = table.fields.findIndex((f) => f.key === key);

      if (idx >= 0) {
        table.fields.splice(idx, 1);
      } else {
        table.fields.push({ key, label: key });
      }
    },

    /* ---------- commit / rollback ---------- */

    applyChanges() {
      this.$emit("update", JSON.parse(JSON.stringify(this.localTables)));
    },

    resetChanges() {
      this.localTables = JSON.parse(JSON.stringify(this.tables));
    },
  },
};
</script>
