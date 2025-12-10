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
            <CSelect
              :value="chart.type"
              :options="chartTypes"
              @input="chart.type = $event"
            />
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
            <CButton
              size="sm"
              color="danger"
              variant="outline"
              class="d-flex"
              @click="localCharts.splice(i, 1)"
            >
              Delete
            </CButton>
          </CCol>
        </CRow>

        <!-- DATASETS -->
        <CRow>
          <!-- MULTI DATASET -->
          <CCol md="12" v-if="isMulti(chart.type)">
            <div
              v-for="(key, k) in chart.valueKeys"
              :key="k"
              class="d-flex align-items-center position-relative"
            >
              <CSelect
                :value="key"
                class="pt-3"
                :options="numericKeys"
                style="max-width: 180px"
                @input="chart.valueKeys[k] = $event"
              />

              <input
                type="text"
                class="form-control ml-2"
                style="width: 100px"
                v-model="chart.colors[k]"
              />

              <div
                class="color-box ml-2"
                :style="{ backgroundColor: chart.colors[k] }"
                @click="togglePicker(chart, k)"
              />

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

          <!-- SINGLE DATASET (FIXED) -->
          <CCol md="12" v-else>
            <CSelect
              :value="chart.valueKeys[0]"
              :options="numericKeys"
              placeholder="Value"
              style="max-width: 240px"
              @input="chart.valueKeys = [$event]"
            />
          </CCol>
        </CRow>
        <!-- SHOW TABLE -->
        <CRow class="mt-4">
          <CCol md="12" class="d-flex align-items-center">
            <CSwitch
              class="mx-1"
              color="primary"
              variant="3d"
              shape="square"
              :checked="chart.showTable"
              @update:checked="chart.showTable = $event"
            />
            <span class="ml-2">Show data table below chart</span>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>

    <div class="text-right">
      <CButton color="success" @click="applyChanges"> Apply Charts </CButton>
    </div>
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
  CSelect,
  CSwitch,
} from "@coreui/vue";
import { Chrome } from "vue-color";

export default {
  components: {
    CButton,
    CCard,
    CCardBody,
    CRow,
    CCol,
    CInput,
    CSelect,
    CSwitch,
    "chrome-picker": Chrome,
  },

  props: {
    data: Array,
    charts: Array,
  },

  data() {
    return {
      localCharts: [],
      chartTypes: ["bar", "line", "radar", "pie", "doughnut", "polarArea"],
    };
  },

  computed: {
    dataKeys() {
      if (!Array.isArray(this.data) || !this.data.length) return [];
      return Object.keys(this.data[0]);
    },

    // ✅ FIX: numeric strings ARE numeric
    numericKeys() {
      if (!this.data.length) return [];
      return this.dataKeys.filter((k) => {
        const v = this.data[0][k];
        return v !== null && v !== "" && !isNaN(Number(v));
      });
    },
  },

  watch: {
    charts: {
      immediate: true,
      deep: true,
      handler(v) {
        this.localCharts = JSON.parse(JSON.stringify(v || []));
      },
    },
  },

  methods: {
    isMulti(type) {
      return ["bar", "line", "radar"].includes(type);
    },

    addChart() {
      if (!this.numericKeys.length || !this.dataKeys.length) return;

      this.localCharts.push({
        id: Date.now(),
        name: "New Chart",
        type: "bar",
        labelKey: "month",
        valueKeys: [this.numericKeys[0]],
        colors: ["#321FDB"],
        showPicker: [false],
        showTable: false,
      });
    },

    addDataset(chart) {
      chart.valueKeys.push(this.numericKeys[0]);
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
    },
  },
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
  bottom: 70px;
  left: 110px;
}
</style>
