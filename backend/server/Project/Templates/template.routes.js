const express = require("express");
const router = express.Router();
const template = require("./service/template.service");
const service = require("./service/templateAndData.service");

router.get("/test", (req, res) => {
  res.send("Template route testing");
});

/* ================= TEMPLATE AND DATA ROUTES (FIRST) ================= */
router.get("/templateAndData", service.onQuerys);
router.get("/templateAndData/:id/data", service.onFetchData);
router.get("/templateAndData/:id", service.onQuery);
router.post("/templateAndData", service.onCreate);
router.delete("/templateAndData", service.onDelete);

/* ================= TEMPLATE ROUTES ================= */
router.get("/", template.onQuerys);
router.get("/:id", template.onQuery);
router.post("/", template.onCreate);
router.put("/", template.onUpdate);
router.delete("/", template.onDelete);

module.exports = router;
