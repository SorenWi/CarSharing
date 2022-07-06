const express = require('express')
const app = express()
const session = require("express-session")
const MongoDBSession = require("connect-mongodb-session")(session)
const mongoose = require("mongoose")
const bcrypt = require('bcrypt')
const cors = require("cors")

const port = 3000;
const mongoURI = "mongodb://localhost:27017/CarSharing";

const UserModel = require("../models/User.js");
const CarModel = require("../models/Car.js");
const RentInfoModel = require("../models/RentInfo.js");
const { response } = require('express')

//Connect to MongoDB database
mongoose.connect(mongoURI).then((res) => {
  console.log("MongoDB connected");
});

const store = new MongoDBSession({
  uri: mongoURI,
  collection: "sessions"
})

app.use(session({
  secret: "sign key for cookie",
  resave: false,
  saveUninitialized: false,
  store: store
}))

const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next()
  } else {
    res.redirect("/login")
  }
}

app.use("/public", express.static("public"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));

app.get("/", async (req, res) => {
  //CarModel.find().skip()
  res.render("carSearch", {isAuth: req.session.isAuth});
});

app.post("/search", async (req, res) => {
  const { searchText, fuelType } = req.body;
  results = await CarModel.find({carName: searchText, fuelType: fuelType}).limit(10);
  //return first 10 results as json
  res.json( { results: results });
});

app.get("/admin", (req, res) => { //TODO add middleware to check if user is admin
  res.render("admin", {isAuth: req.session.isAuth});
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/profile", isAuth, async (req, res) => {
  let user = await UserModel.findOne({_id: req.session.userId})
  res.render("profile", { username: user.username, isAuth: req.session.isAuth})
})

app.post("/register", async (req, res) => {
  const { username, password } = req.body
  let user = await UserModel.findOne({username})

  if(user) {
    console.log("username already exists")
    return res.render("register", { message: "Username already exists, try a different one"})
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  user = new UserModel({
    username: username,
    password: hashedPassword,
    rentedCars: [],
    isAdmin: false
  });

  await user.save()
  console.log("created new user:", username)
  res.redirect("/login")
})


app.post("/login", async (req, res) => {
  const { username, password } = req.body

  const user = await UserModel.findOne({username})
  if(!user){
    console.log("user doesnt exist ")    
    return res.render("login", { message: "Login failed, try again"})
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    console.log("wrong password for login")
    return res.render("login", { message: "Login failed, try again"})
  }

  console.log("successful login")
  req.session.isAuth = true
  req.session.userId = user._id
  res.redirect("/")
})

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if(err) throw err
    console.log("logout user")
    res.redirect("/")
  })
})

app.post("/admin", async (req, res) => {
  const {carId, carName, fuelType, earlyTime, lateTime, maxTime, flatrate, costPerMinute } = req.body;
  
  if(await CarModel.findOne({carId})) {
    return res.render("admin", { isAuth: req.session.isAuth, message: "ERROR: Car ID already exists" });
  }

  car = new CarModel({
    carId: carId,
    carName: carName,
    fuelType: fuelType,
    earlyTime: earlyTime,
    lateTime: lateTime,
    maxTime: maxTime,
    flatrate: flatrate,
    costPerMinute: costPerMinute
  });

  car.save();

  res.render("admin", { isAuth: req.session.isAuth, message: "Successfully added car" });
});

app.listen(port, () => {
  console.log('Server running on http://localhost:' + port)
})