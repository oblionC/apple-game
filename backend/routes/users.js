var express = require('express');
var router = express.Router();

var controller = require('../controllers/usersController')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', controller.post)

module.exports = router;
