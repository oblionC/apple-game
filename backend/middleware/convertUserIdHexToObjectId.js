var mongoose = require('mongoose')

module.exports = function convertUserIdHexToObjectId(req, res, next) {
    try {
        req.body.userId = mongoose.Types.ObjectId.createFromHexString(req.body.userId) 
        next() 
    }
    catch {
        return res.sendStatus(400)
    }
}