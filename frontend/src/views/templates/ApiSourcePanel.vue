<template>
  <CCard class="mb-3">
    <CCardBody>
      <CInput
        v-model="url"
        label="API URL"
        placeholder="https://api.example.com/data"
      />

      <div class="mt-3 d-flex align-items-center">
        <CButton color="primary" :disabled="loading || !url" @click="preview">
          Preview Data
        </CButton>

        <CButton
          class="mx-2"
          color="success"
          :disabled="!previewData.length || loading"
          @click="apply"
        >
          Apply Data
        </CButton>

        <!-- LOADING -->
        <div v-if="loading" class="ml-3 d-flex align-items-center text-info">
          <CSpinner size="sm" class="mr-2" />
          Loading data...
        </div>
      </div>

      <!-- WARNING / ERROR -->
      <div v-if="errorMessage" class="mt-3 text-warning">
        ⚠️ {{ errorMessage }}
      </div>

      <!-- SUCCESS -->
      <div v-if="successMessage" class="mt-3 text-success">
        {{ successMessage }}
      </div>

      <!-- PREVIEW TABLE -->
      <div v-if="previewData.length" class="mt-3">
        <p><strong>Total records:</strong> {{ previewData.length }}</p>

        <CDataTable
          :items="previewData.slice(0, 5)"
          :fields="Object.keys(previewData[0])"
          small
        />

        <p class="text-muted mt-2">Showing first 5 records only</p>
      </div>
    </CCardBody>
  </CCard>
</template>

<script>
import {
  CCard,
  CCardBody,
  CInput,
  CButton,
  CSpinner,
  CDataTable,
} from "@coreui/vue";

export default {
  components: {
    CCard,
    CCardBody,
    CInput,
    CButton,
    CSpinner,
    CDataTable,
  },

  data() {
    return {
      url: "",
      previewData: [],
      loading: false,

      errorMessage: "",
      successMessage: "",
    };
  },

  methods: {
    async preview() {
      this.loading = true;
      this.errorMessage = "";
      this.successMessage = "";
      this.previewData = [];

      try {
        const res = await fetch(this.url);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
          throw new Error("API must return an array of objects");
        }

        this.previewData = data;
        this.successMessage = "Preview loaded successfully.";
      } catch (err) {
        this.errorMessage = `Failed to load data: ${err.message}`;
      } finally {
        this.loading = false;
      }
    },

    apply() {
      this.successMessage = "Data applied to document.";
      this.errorMessage = "";
      this.$emit("loaded", this.previewData);
      this.$emit("api-url", this.url);
    },
  },
};
</script>
