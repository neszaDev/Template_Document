export default [
  {
    id: 1,
    templateMeta: {
      name: "Revenue Overview",
      description: "Revenue & profit by month",
      ownerDepartment: ["Finance", "Sales"],
      status: true,
    },
    documentMeta: {
      name: "Revenue Report",
      description: "Monthly revenue & profit",
      dataSource: "Uploaded CSV",
    },
    layout: {
      tables: [
        {
          id: "t1",
          name: "Revenue Table",
          fields: [
            { key: "month", label: "Month" },
            { key: "revenue", label: "Revenue" },
            { key: "profit", label: "Profit" },
          ],
        },
      ],
      charts: [
        {
          id: "c1",
          type: "bar",
          name: "Revenue Chart",
          labelKey: "month",
          valueKeys: ["revenue", "profit"],
        },
      ],
    },
  },

  {
    id: 2,
    templateMeta: {
      name: "Sales Performance",
      description: "Units sold per month",
      ownerDepartment: ["IT", "Management"],
      status: false,
    },
    documentMeta: {
      name: "Sales Report",
      description: "Sales performance overview",
      dataSource: "Uploaded CSV",
    },
    layout: {
      tables: [
        {
          id: "t2",
          name: "Sales Table",
          fields: [
            { key: "month", label: "Month" },
            { key: "units_sold", label: "Units Sold" },
          ],
        },
      ],
      charts: [
        {
          id: "c2",
          type: "line",
          name: "Sales Trend",
          labelKey: "month",
          valueKeys: ["units_sold"],
        },
      ],
    },
  },

  // ✅ NEW TEMPLATE (FULL MULTI-CHART)
  {
    id: 3,
    templateMeta: {
      name: "Test1",
      description: "Test2",
      ownerDepartment: ["Finance", "IT"],
      status: true,
    },
    documentMeta: {
      name: "Test3",
      description: "Test4",
      dataSource: "Test5",
    },
    layout: {
      tables: [
        {
          id: 1764789210762,
          name: "Table Test",
          fields: [
            { key: "month", label: "month" },
            { key: "profit", label: "profit" },
            { key: "revenue", label: "revenue" },
            { key: "units_sold", label: "units_sold" },
          ],
        },
      ],
      charts: [
        {
          id: 1764789221110,
          name: "Chart1",
          type: "bar",
          labelKey: "month",
          valueKeys: ["revenue", "profit", "units_sold"],
        },
        {
          id: 1764789238619,
          name: "Chart2",
          type: "line",
          labelKey: "month",
          valueKeys: ["revenue", "profit", "units_sold"],
        },
        {
          id: 1764789273331,
          name: "Chart3",
          type: "radar",
          labelKey: "month",
          valueKeys: ["revenue", "profit", "units_sold"],
        },
        {
          id: 1764789313391,
          name: "Chart4",
          type: "pie",
          labelKey: "month",
          valueKey: "profit",
        },
        {
          id: 1764789328997,
          name: "Chart5",
          type: "doughnut",
          labelKey: "month",
          valueKey: "profit",
        },
        {
          id: 1764789329256,
          name: "Chart6",
          type: "polarArea",
          labelKey: "month",
          valueKey: "profit",
        },
      ],
    },
  },
];
