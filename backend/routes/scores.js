var express = require('express');
var router = express.Router();

var scoreController = require("../controllers/scoreController");

router.post('/new-score', scoreController.newScore)

router.get('/user-bests', scoreController.userBests)

module.exports = router
