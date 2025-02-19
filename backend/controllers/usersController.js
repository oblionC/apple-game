const mongoose = require('mongoose')
const passwordValidator = require('password-validator')
const emailValidator = require('email-validator') 
const User = require('../models/user')
var jwt = require('jsonwebtoken')


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
        try {
            var error = false
            var emailError = ''
            var passwordError= ''
            var userId = ''
            var createdAt = ''

            var email = req.body.email
            var password = req.body.password
            var username = ""

            var user = await User.findOne({email: email}, '_id username password createdAt').lean().exec()

            if(user === null) {
                emailError = 'Account with this email does not exist!'
                error = true
            }
            else{
                username = user.username
                userId = user._id
                createdAt = user.createdAt
                if(user.password !== password) {
                    passwordError = 'Incorrect password'
                    error = true
                }
            }

            var token = jwt.sign({username: username, userId: userId, createdAt: createdAt}, process.env.JWT_SECRET, {expiresIn: "2d"} )

            var response = {
                error: error,
                userId: userId,
                username: username,
                createdAt: createdAt,
                email: email,
                emailError: emailError, 
                passwordError: passwordError,
                accessToken: token
            }

            return res.send(response)
        }
        catch (e) {
            console.log(e)
            return res.status(400).send({message: "Bad request"})
        }
    },
    newUser: async (req, res) => {
        try {
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
                var user = await new User({
                    username: req.body.username,
                    password: req.body.password,
                    email: req.body.email,
                    createdAt: new Date(),
                }).save()
                userId = user.userId
            }

            var response = {
                error: error,
                usernameError: usernameError, 
                passwordError: passwordError,
                emailError: emailError, 
                userId: userId
            }

            return res.send(response)
        }
        catch {
            return res.status(400).send({message: "Bad Request"})
        }
    },
    getUser: async (req, res, next) => {
        try {
            var userId
            if(req.query.userId)
                userId = mongoose.Types.ObjectId.createFromHexString(req.query.userId) 
            var username = req.query.username

            var user

            if(userId)
                user = await User.findOne({_id: userId}).select('_id username createdAt').exec()

            if(username) 
                user = await User.findOne({username: username}).select('_id username createdAt').exec()


            return res.send({
                userId: user._id,
                username: user.username,
                createdAt: user.createdAt,
            })
        }
        catch (e) {
            console.log(e)
            return res.sendStatus(400)
        }
    },
    // isValid: (req, res, next) => {
    //     try {
    //        req. 
    //     }
    //     catch {
    //         return res.sendStatus(400)
    //     }
    // }
}