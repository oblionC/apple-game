const mongoose = require('mongoose');

var scoreSchema = mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    score: mongoose.Schema.Types.Number, 
    rows: mongoose.Schema.Types.Number,
    cols: mongoose.Schema.Types.Number,
    timeDuration: mongoose.Schema.Types.Number,
    timeStamp: mongoose.Schema.Types.Date
})

var Score = new mongoose.model('Score', scoreSchema)

module.exports = Score
