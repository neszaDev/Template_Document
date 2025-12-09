<template>
  <div>
    <CInput v-model="url" label="API URL (JSON Array)" />

    <CButton color="primary" class="mt-2" @click="load">
      Load API Data
    </CButton>

    <CCard v-if="rows.length" class="mt-3">
      <CCardBody>
        <strong>Total rows:</strong> {{ rows.length }}

        <GenericDataTable
          :items="rows.slice(0, 5)"
        />
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import axios from "axios";
import { CInput, CButton, CCard, CCardBody } from "@coreui/vue";
import GenericDataTable from "./GenericDataTable.vue";

export default {
  components: { CInput, CButton, CCard, CCardBody, GenericDataTable },

  data() {
    return {
      url: "",
      rows: [],
    };
  },

  methods: {
    async load() {
      const res = await axios.get(this.url);
      this.rows = Array.isArray(res.data) ? res.data : [];
      this.$emit("data", this.rows);
    },
  },
};
</script>
