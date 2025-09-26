const router = require("express").Router();
const ctrl = require("../controllers/statsController");

router.get("/progress", ctrl.progressBySubject);

module.exports = router;
