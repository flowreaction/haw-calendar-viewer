const express = require("express");

const coursesController = require("../controllers/courses");
const router = express.Router();

/**
 * Handling routes
 */

//GET /courses/
router.get("/allnames", coursesController.allnames);
router.get("/allnames/:degree/:semester", coursesController.specifiednames);
router.get("/events/:name", coursesController.events);

module.exports = router;
