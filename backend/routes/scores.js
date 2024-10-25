var express = require('express');
var router = express.Router();

var scoreController = require("../controllers/scoreController");

router.post('/new-score', scoreController.newScore)

module.exports = router
