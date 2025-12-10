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

  /* =====================================================
     ✅ NEW TEMPLATE (YOUR JSON — FIXED & NORMALIZED)
     ===================================================== */
  {
    id: 3,

    templateMeta: {
      name: "AB",
      description: "CD",
      ownerDepartment: ["Finance", "IT"],
      status: true,
    },

    documentMeta: {
      name: "ASD",
      description: "WEQW",
      dataSource: "QWEdAS",
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
          id: 1765374539874,
          name: "sdawd",
          type: "bar",
          labelKey: "month",
          valueKeys: ["revenue", "profit"],
          colors: ["#321FDB", "#E5533D"],
        },
        {
          id: 1765374654531,
          name: "dasdwad",
          type: "line",
          labelKey: "month",
          valueKeys: ["revenue", "profit"],
          colors: ["#3E3874", "#B09692"],
        },
        {
          id: 1765374671945,
          name: "dawdawdNew Chart",
          type: "radar",
          labelKey: "month",
          valueKeys: ["revenue", "profit"],
          colors: ["#321FDB", "#E5533D"],
        },
        {
          id: 1765374683092,
          name: "dawd212312",
          type: "pie",
          labelKey: "month",
          valueKeys: ["profit"], // ✅ FIXED
        },
        {
          id: 1765374692290,
          name: "2sadwdasdwa",
          type: "doughnut",
          labelKey: "month",
          valueKeys: ["revenue"], // ✅ FIXED
        },
        {
          id: 1765374709010,
          name: "1212New Chart",
          type: "polarArea",
          labelKey: "month",
          valueKeys: ["units_sold"], // ✅ FIXED
        },
      ],
    },

    createdAt: "2025-12-10T13:47:47.624Z",
  },
];
