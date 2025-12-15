const TemplateAndData = require("../models/templateAndData.model");
const ResMessage = require("../../Settings/service/message");

/* GET ALL */
exports.onQuerys = async (req, res) => {
  try {
    const docs = await TemplateAndData.find({})
      .populate("templateId");
    return ResMessage.sendResponse(res, 0, 20000, docs);
  } catch (err) {
    return ResMessage.sendResponse(res, 0, 40400);
  }
};

/* GET ONE */
exports.onQuery = async (req, res) => {
  try {
    const doc = await TemplateAndData.findById(req.params.id)
      .populate("templateId");

    return ResMessage.sendResponse(res, 0, 20000, doc);
  } catch (err) {
    return ResMessage.sendResponse(res, 0, 40400);
  }
};

/* CREATE */
exports.onCreate = async (req, res) => {
  try {
    const doc = await TemplateAndData.create(req.body);
    return ResMessage.sendResponse(res, 0, 20000, doc);
  } catch (err) {
    return ResMessage.sendResponse(res, 0, 40400);
  }
};

/* DELETE */
exports.onDelete = async (req, res) => {
  try {
    const doc = await TemplateAndData.findByIdAndDelete(req.body._id);
    return ResMessage.sendResponse(res, 0, 20000, doc);
  } catch (err) {
    return ResMessage.sendResponse(res, 0, 40400);
  }
};

/* FETCH DATA FROM EXTERNAL API */
exports.onFetchData = async (req, res) => {
  try {
    const doc = await TemplateAndData.findById(req.params.id);
    if (!doc) {
      return ResMessage.sendResponse(res, 0, 40400);
    }

    const apiRes = await fetch(doc.dataSource, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    });

    if (!apiRes.ok) {
      throw new Error("External API failed");
    }

    const json = await apiRes.json();

    return ResMessage.sendResponse(res, 0, 20000, json.data ?? json);

  } catch (err) {
    console.error("Proxy fetch error:", err.message);
    return ResMessage.sendResponse(res, 0, 50000, "Data fetch failed");
  }
};


