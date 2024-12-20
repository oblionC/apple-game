var express = require('express');
var router = express.Router();

var controller = require('../controllers/usersController')

/* GET users listing. */
router.get('/', controller.getUser);

router.post('/new-user', controller.newUser)

router.post('/login', controller.authenticateUserWithEmail)


module.exports = router;
