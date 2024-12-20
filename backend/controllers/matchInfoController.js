var mongoose = require('mongoose')
var MatchInfo = require('../models/matchInfo')

module.exports = {
    post: (req, res, next) => {
        new MatchInfo({
            ...req.body,
            timeStamp: new Date()
        }).save()
        return res.send({message: "Score submitted successfully"})
    },
    recentMatches: async (req, res, next) => {
        var userId = req.query.userId
        var matchInfos = await MatchInfo
            .find({userIds: userId})
            .sort({timeStamp: -1})
            .limit(10)
            .exec()
        return res.send(matchInfos)
    },
    filteredMatches: async (req, res, next) => {
        var userId = req.query.userId
        var rows = req.query.rows
        var cols = req.query.cols
        var duration = req.query.duration
        var matchInfos = await MatchInfo
            .find({
                userIds: userId,
                rows: rows,
                cols: cols,
                duration: duration,
            })
            .sort({timeStamp: -1})
            .limit(10)
            .exec()
        return res.send(matchInfos)
    }
}