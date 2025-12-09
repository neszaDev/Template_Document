<template>
  <CContainer>
    <CRow class="justify-content-center">
      <CCol md="8">
        <CCard
          class="text-center p-4"
          :class="{ 'border-primary': isDragOver }"
          style="border-style: dashed"
          @dragover.prevent="handleDragOver"
          @dragleave.prevent="handleDragLeave"
          @drop.prevent="handleDrop"
        >
          <CCardBody>
            <CIcon icon="cilCloudUpload"  class="mb-3 text-primary" />

            <h5 class="mb-2">Drag & Drop file here</h5>
            <p class="text-muted mb-3">or</p>

            <CButton
              color="primary"
              variant="outline"
              @click="triggerFileInput"
            >
              Browse Files
            </CButton>

            <input
              ref="fileInput"
              type="file"
              :accept="accept"
              class="d-none"
              @change="handleManualSelect"
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </CContainer>
</template>

<script>
import { CContainer, CRow, CCol, CCard, CCardBody, CButton } from "@coreui/vue";
import { CIcon } from "@coreui/icons-vue";
import { cilCloudUpload } from "@coreui/icons";

export default {
  name: "DragDropUpload",
  components: {
    CContainer,
    CRow,
    CCol,
    CCard,
    CCardBody,
    CButton,
    CIcon,
  },
  props: {
    accept: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      isDragOver: false,
    };
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleDragOver() {
      this.isDragOver = true;
    },
    handleDragLeave() {
      this.isDragOver = false;
    },
    handleDrop(event) {
      this.isDragOver = false;
      const files = event.dataTransfer.files;
      if (files?.length) {
        this.$emit("file-selected", files[0]);
      }
    },
    handleManualSelect(event) {
      const file = event.target.files[0];
      if (file) {
        this.$emit("file-selected", file);
      }
    },
  },
};
</script>
