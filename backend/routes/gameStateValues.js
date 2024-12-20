var express = require('express');
var router = express.Router();

router.get("/", (req, res) => {
    let result = []
    let rows = Number(req.query.rows)
    let cols = Number(req.query.cols)

    for(let i = 0; i < rows; i++) {
        result.push([])
        for(let j = 0; j < cols; j++) {
            result[i].push((Math.floor(Math.random() * (10 - 1))) + 1)
        }
    }
    return res.send({gameStateValues: result})
    // wowo
})

module.exports = router;