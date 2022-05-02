const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('home')
})

// router.get('/signup')

module.exports = router