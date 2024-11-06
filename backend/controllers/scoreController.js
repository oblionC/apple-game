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
        var rows = Number(req.query.rows)
        var cols = Number(req.query.cols)
        var timeDuration = Number(req.query.duration)
        var scores = await Score.find({
            userId: userId,
            rows: rows,
            cols: cols,
            timeDuration: timeDuration
        })
        .sort({score: -1})
        .limit(10)
        .exec()
        return res.send({scores: scores})
    }
}