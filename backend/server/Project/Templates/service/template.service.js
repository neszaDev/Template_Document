const mongo = require("mongodb");
const TemplateModel = require("../models/template.model");
const ResMessage = require("../../Settings/service/message");

/* GET ALL */
exports.onQuerys = async (req, res) => {
  try {
    const docs = await TemplateModel.find({});
    return ResMessage.sendResponse(res, 0, 20000, docs);
  } catch (err) {
    console.error("Query Error:", err);
    return ResMessage.sendResponse(res, 0, 40400);
  }
};

/* GET ONE BY ID */
exports.onQuery = async (req, res) => {
  try {
    const doc = await TemplateModel.findById(req.params.id);
    return ResMessage.sendResponse(res, 0, 20000, doc);
  } catch (err) {
    console.error("Find error:", err);
    return ResMessage.sendResponse(res, 0, 40400);
  }
};

/* CREATE */
exports.onCreate = async (req, res) => {
  try {
    const doc = await TemplateModel.create(req.body);
    return ResMessage.sendResponse(res, 0, 20000, doc);
  } catch (err) {
    console.error("Create error:", err);
    return ResMessage.sendResponse(res, 0, 40400);
  }
};

/* UPDATE */
exports.onUpdate = async (req, res) => {
  try {
    const doc = await TemplateModel.findByIdAndUpdate(
      req.body._id,
      req.body,
      { new: true }
    );
    return ResMessage.sendResponse(res, 0, 20000, doc);
  } catch (err) {
    console.error("Update error:", err);
    return ResMessage.sendResponse(res, 0, 40400);
  }
};  

/* DELETE */
exports.onDelete = async (req, res) => {
  try {
    const doc = await TemplateModel.findByIdAndDelete(req.body._id);
    return ResMessage.sendResponse(res, 0, 20000, doc);
  } catch (err) {
    console.error("Delete error:", err);
    return ResMessage.sendResponse(res, 0, 40400);
  }
};
