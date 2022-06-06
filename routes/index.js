const express = require('express');

const router = express.Router();

router.use('/', require('./lessons.router'));

module.exports = router;