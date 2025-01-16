var mongoose = require("mongoose")
var Score = require("../models/score")
var User = require("../models/user")

function setGlobalBests() {

}

module.exports = {
    newScore: async (req, res, next) => {
        req.body.userId = mongoose.Types.ObjectId.createFromHexString(req.body.userId) 
        console.log(req.body)
        new Score({
            ...req.body,
            timeStamp: new Date(),
        }).save()

        return res.send({message: "Score submitted successfully"})
    },
    userBests: async (req, res, next) => {
        try {
            var userId = mongoose.Types.ObjectId.createFromHexString(req.query.userId) 
        }
        catch {
            return res.sendStatus(400)
        }
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

        scores = await Promise.all(await scores.map(async score => {
            // var userId = mongoose.Types.ObjectId.createFromHexString(score.userId)
            var userInfo = await User.findOne({_id: score.userId}).select("_id username").exec()
            return {
                _id: score._id,
                userId: undefined,
                username: userInfo.username,
                score: score.score,
                rows: score.rows,
                cols: score.cols,
                timeStamp: score.timeStamp,
                timeDuration: score.timeDuration,
            }
        }))

        console.log(scores)
        return res.send({scores: scores})
    },
    getScore: (req, res, next) => {
        var scoreId = mongoose.Types.ObjectId.createFromHexString(req.query.scoreId)

        var result = Score.findOne({
            _id: scoreId 
        })
        .exec()

        return result
    }
}