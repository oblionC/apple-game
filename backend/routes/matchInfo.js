var express = require('express')
var router = express.Router()
var controller = require('../controllers/matchInfoController')

router.post('/', controller.post)
router.get('/recentMatches', controller.recentMatches)
router.get('/filteredMatches', controller.filteredMatches)

module.exports = router