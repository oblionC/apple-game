var Score = require("../models/score")

module.exports = {
    newScore: (req, res, next) => {
        new Score({
            ...req.body,
            timeStamp: new Date(),
        }).save()

        return res.send({message: "Score submitted successfully"})
    }
}