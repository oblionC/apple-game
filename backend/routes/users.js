var express = require('express');
var router = express.Router();

var controller = require('../controllers/usersController')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/new-user', controller.post)

router.post('/login', controller.authenticateUserWithEmail)

module.exports = router;
