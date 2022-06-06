const express = require("express");
const router = express.Router();

const lessonsController = require('../controllers/lessons.controller');
const postLessonsValidation = require('../middleware/post-lessons.validation');
const getLessonsValidation = require('../middleware/get-lessons.validation');

router
    .post("/lessons", postLessonsValidation, lessonsController.createLessons)
    .get("/", getLessonsValidation, lessonsController.getLessons);

module.exports = router;