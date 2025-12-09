<template>
  <table class="table table-bordered table-sm">
    <thead>
      <tr>
        <th>{{ chart.labelKey }}</th>
        <th
          v-for="(key, i) in valueKeys"
          :key="key"
        >
          {{ datasetLabel(i, key) }}
        </th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="(row, i) in data" :key="i">
        <td>{{ row[chart.labelKey] }}</td>
        <td v-for="key in valueKeys" :key="key">
          {{ row[key] }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: "TableSimpleRenderer",

  props: {
    chart: { type: Object, required: true },
    data: { type: Array, default: () => [] },
  },

  computed: {
    valueKeys() {
      return this.chart.valueKeys?.length
        ? this.chart.valueKeys
        : [this.chart.valueKey];
    }
  },

  methods: {
    datasetLabel(i, key) {
      return this.chart.datasetNames?.[i] || key;
    }
  }
};
</script>
