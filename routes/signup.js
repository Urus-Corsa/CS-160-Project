const express = require('express')
const router = express.Router()
const Signup = require('../models/signup')

// All Logins Route
router.get('/', (req, res) => {
    res.render('signup')
})

// New Logins Route
router.get('/new', (req, res) => {
    res.render('signup/new', {signup: new Signup() })
})

// Create Signup Route
router.post('/', async (req, res) => {
    // res.send('Create')
    const signup = new Signup({
        firstName: req.body
    })
    try {
        console.log("BEFORE SAVE")
        const newSignup = await signup.save()
        console.log(signup)
        console.log("AFTER SAVE")
        res.redirect('signup_success')
    } catch {
        res.redirect('signup_success')
    }
    // login.save((err, newLog) => {
    //     // if (err)
    //     res.redirect('logins')
    // })
})

module.exports = router