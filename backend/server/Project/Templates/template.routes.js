const express = require("express");
const router = express.Router();
const template = require("./service/template.service");

router.get("/test", (req, res) => {
  res.send("Template route testing");
});

router.get("/", template.onQuerys);
router.get("/:id", template.onQuery);
router.post("/", template.onCreate);
router.put("/", template.onUpdate);
router.delete("/", template.onDelete);



module.exports = router;
