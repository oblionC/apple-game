var mongoose = require('mongoose')

module.exports = function convertUserIdHexToObjectId(req, res, next) {
    req.body.userId = mongoose.Types.ObjectId.createFromHexString(req.body.userId) 
    next() 
}