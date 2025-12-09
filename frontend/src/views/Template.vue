<template>
  <div>
    <!-- TEMPLATE LIST -->
    <TemplateSelector
      v-if="view === 'templates'"
      @select="selectTemplate"
      @create="openBuilder"
    />

    <!-- BUILDER MODAL -->
    <CModal
      :show="showBuilder"
      size="xl"
      centered
      :close-on-backdrop="false"
    >
      <template #header>
        <h5>Create Template</h5>
      </template>

      <ApiSourcePanel @data="apiData = $event" />

      <TemplateBuilder ref="builder" :data="apiData" />

      <template #footer>
        <CButton color="secondary" @click="showBuilder = false">
          Cancel
        </CButton>
        <CButton color="success" @click="saveTemplate">
          Save Template
        </CButton>
      </template>
    </CModal>
  </div>
</template>

<script>
import { CModal, CButton } from "@coreui/vue";
import TemplateSelector from "./templates/TemplateSelector.vue";
import TemplateBuilder from "./templates/template.config.vue";
import ApiSourcePanel from "./templates/ApiSourcePanel.vue";

export default {
  components: {
    CModal,
    CButton,
    TemplateSelector,
    TemplateBuilder,
    ApiSourcePanel,
  },

  data() {
    return {
      view: "templates",
      showBuilder: false,
      apiData: [],
    };
  },

  methods: {
    openBuilder() {
      this.showBuilder = true;
    },

    saveTemplate() {
      const payload = this.$refs.builder.getPayload();
      console.log("Save to DB:", payload);
      this.showBuilder = false;
    },

    selectTemplate(template) {
      console.log("Selected:", template);
    },
  },
};
</script>
