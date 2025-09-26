const router = require("express").Router();
const ctrl = require("../controllers/assignmentController");

router.get("/stats", ctrl.getStats);


router.get("/", ctrl.getAssignments);
router.get("/:id", ctrl.getAssignmentById);
router.post("/", ctrl.createAssignment);
router.put("/:id", ctrl.updateAssignment);
router.delete("/:id", ctrl.deleteAssignment);



module.exports = router;
