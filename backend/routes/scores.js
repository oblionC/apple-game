var express = require('express');
var router = express.Router();

var scoreController = require("../controllers/scoreController");

router.get('/', (req, res, next) => res.send("hi"))
router.post('/new-score', scoreController.newScore)


module.exports = router
