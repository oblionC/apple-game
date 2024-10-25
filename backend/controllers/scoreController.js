var Score = require("../models/score")

module.exports = {
    newScore: (req, res, next) => {
        console.log(req.body)
        new Score({
            ...req.body,
            timeStamp: new Date(),
        }).save()

        return res.send({message: "Score submitted successfully"})
    }
}