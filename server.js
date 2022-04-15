// if (process.env.NODE_ENV !== 'production') {
//     require('dotenv').parse()
// }

const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const { use } = require('express/lib/application');

const bcrypt = require('bcrypt')
const expressLayouts = require('express-ejs-layouts')

const homeRouter = require('./routes/home')
const signupRouter = require('./routes/signup')

const passport = require('passport')
const initializePassport = require('./passport-config')
// initializePassport(passport, email => asdf)

/*
 ulrEncodedParser middleware is used to invoke below function 
 to parse posted data to POST functions
 var urlEncodedParser = bodyParser.urlencoded({extended : false});
 var jsonParser = bodyParser.json();
 */

//set view engine to be able to visit views 
app.set('view engine', 'ejs');


// ADDED BY BILLY
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))

app.use('/', homeRouter)
app.use('/signup', signupRouter)

const dotenv = require('dotenv')
const mongoose = require('mongoose')
const DB_USER = "billy"
const PASSWORD = encodeURIComponent("M2uwMlTFDS0ugrov")
const DB_URL = 'mongodb+srv://billy:M2uwMlTFDS0ugrov@cluster0.jgdpz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
mongoose.connect(DB_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

//

//middleware for styles to be loaded on pages when req made by views
app.use('/stylesheets', express.static('stylesheets'));

// middleware to parse application/json
//app.use(express.json());

// middleware to parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


/*middleware to set req headers to text/html 
app.use(function (req, res, next) {
    req.headers['content-type'] = 'text/html';
    next();
  });*/


//GET "/" req, fires up home page
app.get('/', function(req, res){
    res.render('home');

});


//GET "/home" req, aslo fires up home page
app.get('/home', function(req, res){
    res.render('home');

});


//GET "/signup" req, fires up sign up page
app.get('/signup', function(req, res){
    res.render('signup');

});

//POST information enetered on sign up form
app.post('/signup', async (req, res) => {
    console.log(req.body);

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({

        })
        res.render('signup_success', {accountData: req.body});
    } catch {
        res.redirect('/signup')
    }



});

//GET "/login" req, fires up log in page
app.get('/login', function(req, res){
    res.render('login');

});

//POST information enetered on sign up form
app.post('/login', function(req, res){
    console.log(req.body);
    //res.render('signup_success', {accountData: req.body});

});


//server to run on port 3000
app.listen(3000, function(){
    console.log('server listening on port 3000');
});