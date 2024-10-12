const mongoose = require('mongoose')
const User = require('../models/user')

module.exports = {
    post: (req, res) => {
        const newUser = new User(req.body);
        newUser.save();
    }
}