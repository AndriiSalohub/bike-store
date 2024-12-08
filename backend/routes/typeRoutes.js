const express = require("express");
const {
  getTypes,
  putType,
  getType,
  softDeleteTypeRecord,
  postType,
  getDeletedTypesRecord,
  restoreTypeRecord,
} = require("../controllers/typeController");

const router = express.Router();

router.get("/types", getTypes);
router.get("/deleted_types", getDeletedTypesRecord);
router.post("/types", postType);
router.get("/types/:type_id", getType);
router.put("/types/:type_id", putType);
router.delete("/types/:type_id", softDeleteTypeRecord);
router.put("/types/restore/:type_id", restoreTypeRecord);

module.exports = router;
