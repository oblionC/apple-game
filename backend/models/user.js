const mongoose = require('mongoose');
const crypto = require('node:crypto')

const userSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.UUID,
        default: () => crypto.randomUUID(),
    },
    username: String,
    email: String,
    password: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;