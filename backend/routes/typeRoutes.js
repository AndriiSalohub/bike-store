const express = require("express");
const {
  getTypes,
  putType,
  getType,
  deleteTypeRecord,
  postType,
} = require("../controllers/typeController");

const router = express.Router();

router.get("/types", getTypes);
router.post("/types", postType);
router.get("/types/:type_id", getType);
router.put("/types/:type_id", putType);
router.delete("/types/:type_id", deleteTypeRecord);

module.exports = router;
