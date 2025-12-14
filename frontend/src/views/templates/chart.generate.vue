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
    data: Array,
    charts: Array,
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

    groupByLabel(chart) {
      const map = {};
      const keys = chart.valueKeys || [];

      this.data.forEach((row) => {
        const label = row[chart.labelKey];
        if (!label) return;

        if (!map[label]) {
          map[label] = {};
          keys.forEach((k) => (map[label][k] = 0));
        }

        keys.forEach((k) => {
          map[label][k] += Number(row[k]) || 0;
        });
      });

      return map;
    },

    labels(chart) {
      return Object.keys(this.groupByLabel(chart));
    },

    autoColors(n) {
      return Array.from(
        { length: n },
        (_, i) => `hsl(${(i * 360) / n}, 70%, 55%)`
      );
    },

    datasets(chart) {
      const grouped = this.groupByLabel(chart);
      const labels = Object.keys(grouped);

      /* MULTI DATASET */
      if (["bar", "line", "radar"].includes(chart.type)) {
        return chart.valueKeys.map((k, i) => {
          const color = chart.colors[i];

          return {
            label: k,
            data: labels.map((l) => grouped[l][k]),
            borderColor: color,

            backgroundColor: chart.type === "bar" ? color : "transparent",

            fill: chart.type === "bar",

            tension: chart.type === "line" ? 0.4 : 0,
            pointRadius: chart.type === "line" ? 4 : 3,
          };
        });
      }

      /* SINGLE DATASET WITH LABEL COLORS */
      const colors =
        chart.labelColors && chart.labelColors.length
          ? chart.labelColors
          : this.autoColors(labels.length);

      return [
        {
          label: chart.name,
          data: labels.map((l) => grouped[l][chart.valueKeys[0]]),
          backgroundColor: colors,
          borderColor: colors,
        },
      ];
    },

    tableData(chart) {
      const grouped = this.groupByLabel(chart);
      return Object.keys(grouped).map((l) => ({
        [chart.labelKey]: l,
        ...grouped[l],
      }));
    },
  },
};
</script>
