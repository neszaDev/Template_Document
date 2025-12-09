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
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import { CCard, CCardBody } from "@coreui/vue";
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

    isMulti(type) {
      return ["bar", "line", "radar"].includes(type);
    },

    defaultColors() {
      return [
        "#321FDB",
        "#E5533D",
        "#2EB85C",
        "#F9B115",
        "#3399FF",
        "#6F42C1",
      ];
    },

    labels(chart) {
      if (!this.data.length) return [];

      return this.data.map((r) => r[chart.labelKey]);
    },

    datasets(chart) {
      if (!this.data.length) return [];

      const palette = chart.colors && chart.colors.length
        ? chart.colors
        : this.defaultColors();

      // bar / line / radar
      if (this.isMulti(chart.type)) {
        return (chart.valueKeys || []).map((key, i) => ({
          label: key,
          data: this.data.map((r) => Number(r[key]) || 0),
          backgroundColor: palette[i % palette.length],
          borderColor: palette[i % palette.length],
          fill: false,
        }));
      }

      // pie / doughnut / polarArea
      return [
        {
          data: this.data.map((r) => Number(r[chart.valueKey]) || 0),
          backgroundColor: palette,
        },
      ];
    },
  },
};
</script>
