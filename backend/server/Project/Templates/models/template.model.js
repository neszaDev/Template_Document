const mongoose = require("mongoose");

/* Chart schema */
const ChartSchema = new mongoose.Schema({
  name: String,

  type: {
    type: String,
    enum: ["bar", "line", "radar", "pie", "doughnut", "polarArea"],
    required: true,
  },

  labelKey: { type: String, required: true },

  valueKeys: {
    type: [String],
    default: [],
  },

  valueKey: {
    type: String,
    default: "",
  },

  colors: {
    type: [String],
    default: [],
  },

  style: { type: String, default: "default" },
});

/* Table schema */
const TableSchema = new mongoose.Schema({
  name: String,
  fields: [
    {
      key: String,
      label: String,
    },
  ],
});

/* Template schema */
const TemplateSchema = new mongoose.Schema(
  {
    templateMeta: {
      name: { type: String, required: true },
      description: String,
      ownerDepartment: [String],
      status: { type: Boolean, default: true },
    },

    documentMeta: {
      name: String,
      description: String,
      dataSource: String,
    },

    layout: {
      tables: [TableSchema],
      charts: [ChartSchema],
    },

    /* ADD THIS */
    public: {
      type: Boolean,
      default: true,
    },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Template", TemplateSchema);
