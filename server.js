// if (process.env.NODE_ENV !== 'production') {
//     require('dotenv').parse()
// }
const bcrypt = require("bcrypt");
const Bcrypt = require("bcryptjs");
const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const User = require("./models/signup.model");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

var bodyParser = require("body-parser");
const { use } = require("express/lib/application");

const indexRouter = require("./routes/index");
const signupRouter = require("./routes/signup");
const homeRouter = require("./routes/home");

app.use("/", indexRouter);
app.use("/signup", signupRouter);
app.use("/landing", homeRouter);

const passport = require("passport");
const initializePassport = require("./passport-config");
// initializePassport(passport, email => asdf)

/*
 ulrEncodedParser middleware is used to invoke below function 
 to parse posted data to POST functions
 var urlEncodedParser = bodyParser.urlencoded({extended : false});
 var jsonParser = bodyParser.json();
 */

//set view engine to be able to visit views
app.set("view engine", "ejs");

// ADDED BY BILLY
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.static("public"));

const DB_USER = "billy";
const PASSWORD = encodeURIComponent("M2uwMlTFDS0ugrov");
const DB_URL =
  "mongodb+srv://billy:M2uwMlTFDS0ugrov@cluster0.jgdpz.mongodb.net/Medical?retryWrites=true&w=majority";
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Mongoose"));

//

//middleware for styles to be loaded on pages when req made by views
app.use("/stylesheets", express.static("stylesheets"));

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
app.get("/", function (req, res) {
  res.render("index");
});

//GET "/home" req, aslo fires up home page
app.get("/index", function (req, res) {
  res.render("index");
});

//GET "/signup" req, fires up sign up page
app.get("/signup", function (req, res) {
  res.render("signup");
});

//POST information enetered on sign up form
app.post("/signup", async (req, res) => {
  //   console.log(req.body.firstName);
  console.log(req.body);

  const { body } = req;
  const { firstName, lastName, password } = body;
  let { email } = body;

  // Save new user
  const newUser = new User();

  newUser.email = email;
  newUser.firstName = firstName;
  newUser.lastName = lastName;
  newUser.password = bcrypt.hashSync(password, 10);

  await newUser.save();

  try {
    // const hashedPassword = await bcrypt.hash(req.body.password, 10)
    // users.push({

    // })
    res.render("signup_success", { accountData: req.body });
  } catch {
    res.redirect("/signup");
  }
});

//GET "/login" req, fires up log in page
app.get("/login", function (req, res) {
  res.render("login");
});

//POST information entered on log in form
app.post("/login", async (req, res) => {
  try {
    User.countDocuments({ email: req.body.email }, function (err, count) {
      if (count > 0) {
        User.findOne(
          {
            email: req.body.email,
          },
          function (err, userInfo) {
            if (err) {
              next(err);
            } else {
              if (bcrypt.compareSync(req.body.password, userInfo.password)) {
                console.log("CORRECT PASSWORD");
                res.redirect("/home");
              } else {
                console.log("INCORRECT PASSWORD");
                res.redirect("/login_fail");
              }
            }
          }
        )
          .clone()
          .catch(function (err) {
            console.log(err);
          });
      } else {
        console.log("user not found");
        res.redirect("/login_fail");
      }
    });
    // var user = await User.findOne({

    // console.log(user.password);
    // if (!user) {
    //   console.log("Invalid email");
    //   console.log(req.body.email);
    //   res.redirect("/login_fail");
    //   // return res.status(400).send({ message: "The username does not exist" });
    // }
    // // passwordd = bcrypt.hashSync(req.body.password, 10);
    // if (!bcrypt.compareSync(req.body.password, user.password)) {
    //   //   return res.status(400).send({ message: "The password is invalid" });
    //   console.log("Invalid password");
    //   console.log(req.body.password);
    //   res.redirect("/login_fail");
    // }
    // if (bcrypt.compareSync(req.body.password, passwordd)) {
    //   console.log("akjsdhfklja");
    //   res.redirect("/");
    // }
    // res.send({
    //   message: "The username and password combination is correct!",
    // });
    // res.redirect("/landing");
  } catch (error) {
    console.log("SOMETHING WENT WRONG");
    console.log(error);
    // res.status(500).send(error);
  }
});

//GET "/login" req, fires up log in page
app.get("/login_fail", function (req, res) {
  res.render("login_fail");
});

//POST information entered on login fail form
app.post("/login_fail", async (req, res) => {
  try {
    User.countDocuments({ email: req.body.email }, function (err, count) {
      if (count > 0) {
        User.findOne(
          {
            email: req.body.email,
          },
          function (err, userInfo) {
            if (err) {
              next(err);
            } else {
              if (bcrypt.compareSync(req.body.password, userInfo.password)) {
                console.log("CORRECT PASSWORD");
                res.redirect("/home");
              } else {
                console.log("INCORRECT PASSWORD");
                res.redirect("/login_fail");
              }
            }
          }
        )
          .clone()
          .catch(function (err) {
            console.log(err);
          });
      } else {
        console.log("user not found");
        res.redirect("/login_fail");
      }
    });
  } catch (error) {
    console.log("SOMETHING WENT WRONG");
    console.log(error);
    // res.status(500).send(error);
  }
});

//server to run on port 3000
app.listen(3000, function () {
  console.log("server listening on port 3000");
});
