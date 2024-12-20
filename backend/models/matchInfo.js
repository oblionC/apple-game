var mongoose = require('mongoose')

var matchInfoSchema = mongoose.Schema({
    rows: mongoose.Schema.Types.Number,
    cols : mongoose.Schema.Types.Number,
    duration : mongoose.Schema.Types.Number,
    scores: mongoose.Schema.Types.Array,
    timeStamp: mongoose.Schema.Types.Date,
    userIds: mongoose.Schema.Types.Array,
    usernames: mongoose.Schema.Types.Array
})

var MatchInfo = new mongoose.model('MatchInfo', matchInfoSchema)

module.exports = MatchInfo