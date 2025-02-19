var jwt = require('jsonwebtoken')

const jwtAuth = (req, res, next) => {
    try{
        var token = req.headers['x-access-token']
        var userInfo = jwt.verify(token, process.env.JWT_SECRET)    
        req.userInfo = userInfo
        console.log(userInfo)
        next()
    }
    catch (err) {
        return res.sendStatus(403)
    }
}

module.exports = jwtAuth