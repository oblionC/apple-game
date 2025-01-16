const Score = require('../models/score')
const User = require('../models/user')

module.exports = {
    all: async (req, res, next) => {
        var rows = req.query.rows
        var cols = req.query.cols
        var duration = req.query.duration

        var scores = await Score.find({
            rows: rows,
            cols: cols,
            timeDuration: duration,
        })
        .select("userId score timeStamp")
        .sort({score: -1})
        .limit(10)
        .exec()

        var result = await Promise.all(await scores.map(async (score) => {
            var userId = score.userId
            var user = await User.findOne({_id: userId}, "username")
            return {
                score: score.score,
                timeStamp: score.timeStamp,
                userId: user.userId,
                username: user.username,
            }
        }))

        return res.send(result) 
    },
    uniqueUsers: async (req, res, next) => {
        var rows = parseInt(req.query.rows)
        var cols = parseInt(req.query.cols)
        var duration = parseInt(req.query.duration)

        // var globalBests = GlobalBests.find({
        //     rows: rows,
        //     cols: cols,
        //     timeDuration: duration
        // })
        // .sort({score: -1})
        // .limit(10)
        // .exec()

        var result = await Score.aggregate([
            {
                $match: {
                    rows: rows,
                    cols: cols,
                    timeDuration: duration,
                },
            },
            {
                $group: {
                    _id: "$userId",
                    score: {$max: "$score"},
                    timeStamp: {$first: "$timeStamp"}
                },
            },
            {
                $sort: {
                    score: -1
                }
            }
        ])

        result = await Promise.all(await result.map(async (score) => {
            var userId = score._id
            var user = await User.findOne({_id: userId}, "username")
            return {
                ...score,
                _id: undefined, 
                userId: user._id,
                username: user.username
            }
        }))

        return res.send(result)
    }
}