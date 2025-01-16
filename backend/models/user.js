const mongoose = require('mongoose');
const crypto = require('node:crypto')

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    createdAt: mongoose.Schema.Types.Date
});

const User = mongoose.model('User', userSchema);

module.exports = User;