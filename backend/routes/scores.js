var express = require('express');
var jwtAuth = require('../middleware/jwtAuth')
var router = express.Router();

var scoreController = require("../controllers/scoreController");

router.post('/new-score', jwtAuth, scoreController.newScore)

router.get('/user-bests', scoreController.userBests)

module.exports = router
