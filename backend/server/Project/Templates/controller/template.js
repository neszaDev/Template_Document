const Template = require("../models/template.model");
const createBaseService = require("../../../../helpers/base.service");

const defaultPopulate = [
  { path: "createdBy", select: "username email" },
  { path: "updatedBy", select: "username email" },
];

module.exports = createBaseService(Template, defaultPopulate);
