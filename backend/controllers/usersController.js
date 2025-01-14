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
    authenticateUserWithEmail: async(req, res) => {
        var error = false
        var emailError = ''
        var passwordError= ''
        var userId = ''

        var email = req.body.email
        var password = req.body.password
        var username = ""

        var user = await User.findOne({email: email}, '_id username password').lean().exec()

        if(user === null) {
            emailError = 'Account with this email does not exist!'
            error = true
        }
        else{
            username = user.username
            userId = user._id
            if(user.password !== password) {
                passwordError = 'Incorrect password'
                error = true
            }
        }

        var response = {
            error: error,
            userId: userId,
            username: username,
            email: email,
            emailError: emailError, 
            passwordError: passwordError
        }

        return res.send(response)
    },
    newUser: async (req, res) => {
        var error = false
        var userId = '' 

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
            userId = await new User({
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                timeStamp: new Date()
            }).save()
            .then((user) => {
                console.log(user._id.toString())
                return user._id.toString()
            })
        }

        var response = {
            error: error,
            usernameError: usernameError, 
            passwordError: passwordError,
            emailError: emailError, 
            userId: userId
        }

        return res.send(response)
    },
    getUser: async (req, res, next) => {
        try {
            var userId
            try {
                userId = mongoose.Types.ObjectId.createFromHexString(req.query.userId) 
            }
            catch {
                userId = undefined
            }
            var username = req.query.username
            console.log(userId, username)

            var users

            if(userId)
                users = await User.findOne({_id: userId}).select('_id username timeStamp').exec()

            if(username) 
                users = await User.findOne({username: username}).select('_id username timeStamp').exec()
            

            console.log(users)

            return res.send(users)
        }
        catch {
            return res.sendStatus(400)
        }
    },
}