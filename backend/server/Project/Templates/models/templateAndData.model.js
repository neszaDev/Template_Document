const mongoose = require("mongoose");

const TemplateAndDataSchema = new mongoose.Schema(
  {
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Template",
      required: true,
    },

    dataSource: {
      type: String,
      required: true, // API URL or identifier
    },

    // Optional snapshot / metadata
    dataMeta: {
      description: String,
      lastFetchedAt: Date,
      fields: [String],
    },

    createdBy: String,
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TemplateAndData", TemplateAndDataSchema);
