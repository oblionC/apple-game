var express = require('express')
var router = express.Router()
var globalBestsController = require('../controllers/globalBestsController.')

router.get('/all', globalBestsController.all)
router.get('/uniqueUsers', globalBestsController.uniqueUsers)

module.exports = router