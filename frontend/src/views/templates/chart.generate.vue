<template>
  <div>
    <CCard v-for="chart in charts" :key="chart.id" class="mb-4">
      <CCardBody>
        <h5>{{ chart.name }}</h5>

        <component
          :is="resolveChart(chart.type)"
          :labels="labels(chart)"
          :datasets="datasets(chart)"
        />

        <TableSimpleRenderer
          v-if="chart.showTable"
          :chart="chart"
          :data="tableData(chart)"
          class="mt-3"
        />
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import { CCard, CCardBody } from "@coreui/vue";
import TableSimpleRenderer from "./table.simple.generate.vue";
import {
  CChartBar,
  CChartLine,
  CChartRadar,
  CChartPie,
  CChartDoughnut,
  CChartPolarArea,
} from "@coreui/vue-chartjs";
import { Tab } from "bootstrap";

export default {
  name: "ChartGenerator",

  components: {
    CCard,
    CCardBody,
    CChartBar,
    CChartLine,
    CChartRadar,
    CChartPie,
    CChartDoughnut,
    CChartPolarArea,
    TableSimpleRenderer,
  },

  props: {
    data: {
      type: Array,
      default: () => [],
    },
    charts: {
      type: Array,
      default: () => [],
    },
  },

  methods: {
    resolveChart(type) {
      return {
        bar: "CChartBar",
        line: "CChartLine",
        radar: "CChartRadar",
        pie: "CChartPie",
        doughnut: "CChartDoughnut",
        polarArea: "CChartPolarArea",
      }[type];
    },

    /* GROUP DATA BY LABEL */
    groupByLabel(chart) {
      const map = {};
      const valueKeys = chart.valueKeys || [];

      this.data.forEach((row) => {
        const label = row[chart.labelKey];
        if (!label) return;

        if (!map[label]) {
          map[label] = {};
          valueKeys.forEach((k) => (map[label][k] = 0));
        }

        valueKeys.forEach((k) => {
          map[label][k] += Number(row[k]) || 0;
        });
      });

      return map;
    },

    labels(chart) {
      if (!this.data.length) return [];
      return Object.keys(this.groupByLabel(chart));
    },

    autoColors(count) {
      return Array.from(
        { length: count },
        (_, i) => `hsl(${(i * 360) / count}, 70%, 55%)`
      );
    },

    datasets(chart) {
      if (!this.data || !this.data.length) return [];
      if (!chart || !chart.type) return [];
      if (!Array.isArray(chart.valueKeys) || !chart.valueKeys.length) return [];

      const grouped = this.groupByLabel(chart);
      const labels = Object.keys(grouped);
      if (!labels.length) return [];

      /* ================= MULTI DATASET ================= */
      if (["bar", "line", "radar"].includes(chart.type)) {
        const auto = this.autoColors(chart.valueKeys.length);

        return chart.valueKeys.map((key, i) => ({
          label: key,
          data: labels.map((l) => grouped[l]?.[key] ?? 0),
          backgroundColor:
            chart.colors && chart.colors[i] ? chart.colors[i] : auto[i],
          borderColor:
            chart.colors && chart.colors[i] ? chart.colors[i] : auto[i],
          fill: false,
        }));
      }

      /* ================= SINGLE DATASET ================= */
      const valueKey = chart.valueKeys[0];
      if (!valueKey) return [];

      return [
        {
          label: chart.name,
          data: labels.map((l) => grouped[l]?.[valueKey] ?? 0),
          backgroundColor: this.autoColors(labels.length),
        },
      ];
    },

    tableData(chart) {
      const grouped = this.groupByLabel(chart);
      const labels = Object.keys(grouped);

      return labels.map((label) => {
        const row = { [chart.labelKey]: label };
        chart.valueKeys.forEach((k) => {
          row[k] = grouped[label]?.[k] ?? 0;
        });
        return row;
      });
    },
  },
};
</script>
