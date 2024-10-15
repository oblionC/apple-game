const mongoose = require('mongoose')
const passwordValidator = require('password-validator')
const emailValidator = require('email-validator') 
const User = require('../models/user')

var passwordSchema = new passwordValidator()
passwordSchema.is().min(8)
passwordSchema.is().max(20)

var usernameSchema = new passwordValidator()
usernameSchema.is().min(4)
usernameSchema.is().max(12)

async function usernameIsAlreadyUsed(username) {
    var result = await User.findOne({username: username}, 'username').exec()
    if(result === null) return false
    return true
}

async function emailIsAlreadyUsed(email) {
    var result = await User.findOne({email: email}, 'email').exec()
    if(result === null) return false
    return true
}

module.exports = {
    post: async (req, res) => {
        var error = false

        var usernameError = ''
        var passwordError = ''
        var emailError = ''

        if(await usernameIsAlreadyUsed(req.body.username)) {
            usernameError = 'Username is already in use!'
            error = true
        }

        if(!usernameSchema.validate(req.body.username)) {
            usernameError = 'Username must 4-12 characters!'
            error = true
        }

        if(await emailIsAlreadyUsed(req.body.email)) {
            emailError = 'Email is already in use!'
            error = true
        }

        if(!emailValidator.validate(req.body.email)) {
            emailError = 'Email is not valid'
            error = true
        }

        if(!passwordSchema.validate((req.body.password))) {
            passwordError = 'Password must be 8-20 characters!'
            error = true
        }

        if(!error) {
            new User({
                username: req.body.username,
                password: req.body.password,
                email: req.body.email
            }).save()
        }

        return res.send({
            usernameError: usernameError, 
            passwordError: passwordError,
            emailError: emailError, 
        })
    }
}