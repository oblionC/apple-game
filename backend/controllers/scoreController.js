var mongoose = require("mongoose")
var Score = require("../models/score")

module.exports = {
    newScore: (req, res, next) => {
        req.body.userId = mongoose.Types.ObjectId.createFromHexString(req.body.userId) 
        new Score({
            ...req.body,
            timeStamp: new Date(),
        }).save()

        return res.send({message: "Score submitted successfully"})
    },
    userBests: async (req, res, next) => {
        var userId = mongoose.Types.ObjectId.createFromHexString(req.query.userId) 
        var scores = await Score.find({userId: userId}).exec()
        return res.send({scores: scores})
    }
}