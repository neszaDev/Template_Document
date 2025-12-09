<template>
  <div>
    <CButton color="primary" class="mb-3" @click="addChart">
      + Add Chart
    </CButton>

    <CCard v-for="(chart, i) in localCharts" :key="chart.id" class="mb-3">
      <CCardBody>

        <!-- META -->
        <CRow class="align-items-center">
          <CCol md="3">
            <CInput v-model="chart.name" placeholder="Chart name" />
          </CCol>

          <CCol md="2">
            <CSelect :value="chart.type" :options="chartTypes"
              @input="chart.type = $event" />
          </CCol>

          <CCol md="3">
            <CSelect
              :value="chart.labelKey"
              :options="dataKeys"
              placeholder="Label"
              @input="chart.labelKey = $event"
            />
          </CCol>

          <CCol md="2" class="text-right mb-3">
            <CButton size="sm" color="danger" variant="outline" class="d-flex"
              @click="localCharts.splice(i,1)">
              Delete
            </CButton>
          </CCol>
        </CRow>

        <!-- DATASETS -->
        <CRow>
          <CCol md="12" v-if="isMulti(chart.type)">
            <div
              v-for="(key, k) in chart.valueKeys"
              :key="k"
              class="d-flex align-items-center position-relative"
            >
              <!-- VALUE -->
              <CSelect
                :value="key"
                class="pt-3"
                :options="numericKeys"
                style="max-width:180px"
                @input="chart.valueKeys[k] = $event"
              />

              <!-- COLOR INPUT -->
              <input
                type="text"
                class="form-control ml-2"
                style="width:100px"
                v-model="chart.colors[k]"
              />

              <!-- COLOR PREVIEW -->
              <div
                class="color-box ml-2"
                :style="{ backgroundColor: chart.colors[k] }"
                @click="togglePicker(chart, k)"
              />

              <!-- COLOR PICKER -->
              <div v-if="chart.showPicker[k]" class="picker-pop">
                <chrome-picker
                  :value="chart.colors[k]"
                  @input="chart.colors[k] = $event.hex"
                />
              </div>

              <CButton
                size="sm"
                color="danger"
                variant="outline"
                class="ml-2"
                :disabled="chart.valueKeys.length === 1"
                @click="removeDataset(chart, k)"
              >
                ✕
              </CButton>
            </div>

            <CButton size="sm" variant="outline" @click="addDataset(chart)">
              + Dataset
            </CButton>
          </CCol>

          <!-- SINGLE DATASET -->
          <CCol md="12" v-else>
            <CSelect
              :value="chart.valueKey"
              :options="numericKeys"
              placeholder="Value"
              style="max-width:240px"
              @input="chart.valueKey = $event"
            />
          </CCol>
        </CRow>

      </CCardBody>
    </CCard>

    <div class="text-right">
      <CButton color="success" @click="applyChanges">
        Apply Charts
      </CButton>
    </div>
  </div>
</template>

<script>
import {
  CButton, CCard, CCardBody, CRow, CCol, CInput, CSelect
} from "@coreui/vue";
import { Chrome } from "vue-color";

export default {
  components: {
    CButton, CCard, CCardBody, CRow, CCol, CInput, CSelect,
    "chrome-picker": Chrome
  },

  props: {
    data: Array,
    charts: Array
  },

  data() {
    return {
      localCharts: [],
      chartTypes: ["bar","line","radar","pie","doughnut","polarArea"]
    };
  },

  computed: {
    dataKeys() {
      return this.data.length ? Object.keys(this.data[0]) : [];
    },
    numericKeys() {
      return this.data.length
        ? this.dataKeys.filter(k => typeof this.data[0][k] === "number")
        : [];
    }
  },

  watch: {
    charts: {
      immediate: true,
      deep: true,
      handler(v) {
        this.localCharts = JSON.parse(JSON.stringify(v));
      }
    }
  },

  methods: {
    isMulti(type) {
      return ["bar","line","radar"].includes(type);
    },

    addChart() {
      this.localCharts.push({
        id: Date.now(),
        name: "New Chart",
        type: "bar",
        labelKey: this.dataKeys[0] || "",
        valueKeys: [this.numericKeys[0]],
        colors: ["#321FDB"],
        showPicker: [false],
        valueKey: "",
        style: "default"
      });
    },

    addDataset(chart) {
      chart.valueKeys.push(this.numericKeys[0] || "");
      chart.colors.push("#E5533D");
      chart.showPicker.push(false);
    },

    removeDataset(chart, index) {
      chart.valueKeys.splice(index, 1);
      chart.colors.splice(index, 1);
      chart.showPicker.splice(index, 1);
    },

    togglePicker(chart, index) {
      chart.showPicker = chart.showPicker.map((v, i) =>
        i === index ? !v : false
      );
    },

    applyChanges() {
      this.$emit("update", JSON.parse(JSON.stringify(this.localCharts)));
    }
  }
};
</script>

<style scoped>
.color-box {
  width: 28px;
  height: 28px;
  border: 1px solid #ccc;
  cursor: pointer;
}

.picker-pop {
  position: absolute;
  z-index: 10;
  top: 36px;
  left: 110px;
}
</style>
