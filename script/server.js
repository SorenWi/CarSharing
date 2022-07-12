const express = require('express')
const app = express()
const session = require("express-session")
const MongoDBSession = require("connect-mongodb-session")(session)
const mongoose = require("mongoose")
const bcrypt = require('bcrypt')
const cors = require("cors")

const TimeManager = require("./TimeManager.js");

const port = 3000;
const mongoURI = "mongodb://localhost:27017/CarSharing";

const UserModel = require("../models/User.js");
const CarModel = require("../models/Car.js");
const BookingModel = require("../models/Booking.js");

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
  res.render("search", {isAuth: req.session.isAuth});
});

app.get("/admin", (req, res) => { //TODO add middleware to check if user is admin  
  res.render("admin", {isAuth: req.session.isAuth});
});

app.get("/login", (req, res) => { //TODO middleware for redirect to profile if already logged in
  res.render("login");
});

app.get("/register", (req, res) => { //TODO middleware for redirect to profile if already logged in
  res.render("register");
});

app.get("/profile", isAuth, async (req, res) => {
  let user = await UserModel.findOne({_id: req.session.userId});
  const costInfo = await getUserCostInfo(req.session.userId);
  res.render("profile", { username: user.username, isAuth: req.session.isAuth, totalCost: costInfo.totalCost, averageCost: costInfo.averageCost.toFixed(2), totalBookings: costInfo.totalBookings});
});

app.post("/register", async (req, res) => { 
  const { username, password } = req.body;
  let user = await UserModel.findOne({username});

  if(user) {
    return res.render("register", { message: "Username already exists, try a different one"})
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  user = new UserModel({
    username: username,
    password: hashedPassword,
    isAdmin: false
  });

  await user.save()
  console.log("created new user:", username)
  res.redirect("/login")
})


app.post("/login", async (req, res) => { //TODO middleware for redirect to profile if already logged in
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

  req.session.isAuth = true
  req.session.userId = user._id
  res.redirect("/")
})

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if(err) throw err;
    res.redirect("/");
  });
});


app.post("/admin", async (req, res) => {
  const {carId, carName, fuelType, earlyTime, lateTime, maxTime, flatrate, costPerMinute } = req.body;

  let response = { isAuth: req.session.isAuth }

  if(await CarModel.findOne({carId})) {
    response.message = "Failed: Car ID already exists";
    return res.render("admin", response);
  }

  if (!(/^\w+$/gm.test(carName))) {
    response.message = "Failed: Car name has to be alphanumerical, no special characters and/or spaces (except _)";
    return res.render("admin", response);
  }

  if (!(/^[\w\-]+$/gm.test(carId))) {
    response.message = "Failed: Car id has to be alphanumerical, no special characters and/or spaces (except _ and -)";
    return res.render("admin", response);
  }

  if (!TimeManager.timeBeforeTime(earlyTime, lateTime)) {
    response.message = "Failed: earlyTime has to be before lateTime";
    return res.render("admin", response);
  }

  if (!TimeManager.durationFitTimeFrame(earlyTime, lateTime, maxTime)) {
    response.message = "Failed: maxTime has to fit within early and late time";
    return res.render("admin", response);
  }

  car = new CarModel({
    carId: carId,
    make: "",
    model: "",
    name: carName,
    fuelType: fuelType,
    earlyTime: earlyTime,
    lateTime: lateTime,
    maxTime: maxTime,
    price: flatrate,
    pricePerMinute: costPerMinute
  });

  car.save();

  response.message = "Successfully added car"
  res.render("admin", response);
});

const resultsPerSearch = 10;
app.post("/search", async (req, res) => {

  const { showAll, useFilter, index } = req.body;

  if (!useFilter) {
    if (showAll) {
      let results = await CarModel.find().skip(index).limit(resultsPerSearch);
      return res.json({ results: results, index: index + resultsPerSearch });
    } else {
      const { searchText, fuelType } = req.body;
      let results = await CarModel.find({name: {$regex: `.*${searchText}.*`}, fuelType: fuelType}).skip(index).limit(resultsPerSearch);    
      return res.json({ results: results, index: index + resultsPerSearch });
    }
  } else {
    const { filterDate, filterTime, filterDuration } = req.body;
    
    let results = [];
    let checkedAmount = 0;
    
    while(results.length != resultsPerSearch) {
      const neededResults = resultsPerSearch - results.length;
      let cars; 
      if (showAll) {
        cars = await CarModel.find().skip(index + checkedAmount).limit(neededResults);
      } else {
        const { searchText, fuelType } = req.body;
        cars = await CarModel.find({name: {$regex: `.*${searchText}.*`}, fuelType: fuelType}).skip(index + checkedAmount).limit(neededResults);
      }
     
      if (!cars) {
        break;
      }

      for(let i = 0; i < cars.length; i++) {
        if (await isAvailable(cars[i].carId, filterDate, filterTime, filterDuration)) {
          results.push(cars[i]);
        }
      }
      checkedAmount += neededResults;
    }

    return res.json({results: results, index: index + checkedAmount});
  }

});

app.post("/checkAvailability", async (req, res) => {
  const {carId, date, time, duration} = req.body;
  
  car = await CarModel.findOne({carId: carId}); 
  price = await getCarPrice(carId, duration);

  const availableResponseMessage = `The car is available, the cost for ${duration} minutes is ${price}€`;
  const unavailableResponseMessage = `The car is not available for the specified time, the cost for ${duration} minutes would be ${price}€`;

  if(!(await isAvailable(carId, date, time, duration))) {
    res.json({ message: unavailableResponseMessage});
  } else {
    res.json({ message: availableResponseMessage});
  }
});

app.post("/bookCar", async (req, res) => {
  const {carId, date, time, duration} = req.body;

  if (!req.session.isAuth) {
    return res.json({ message: 'You have to login first to book a car'});
  } 

  if(!(await isAvailable(carId, date, time, duration))) {
    return res.json({ message: "Can't book; not available for specified time" });
  }

  booking = new BookingModel({
    carId: carId,
    userId: req.session.userId,
    time: time,
    duration: duration,
    date: date,
    price: await getCarPrice(carId, duration)
  });

  booking.save();

  res.json({ message: "Successfully booked car"})
});

app.post("/getBookings", async (req, res) => {
  bookings = await BookingModel.find({userId: req.session.userId});
  
  let pastBookings = [];
  let upcomingBookings = [];

  bookings.forEach((booking) => {
    if (TimeManager.isPast(booking.date, booking.time)) {
      pastBookings.push(booking);
    } else {
      upcomingBookings.push(booking);
    }
  });

  res.json({ pastBookings: pastBookings, upcomingBookings: upcomingBookings });
});

//Returns if a car is available for the specified time
async function isAvailable(carId, date, rentTime, rentDuration) {
  alreadyExisting = await BookingModel.find({carId: carId, date: date});
  car = await CarModel.findOne({carId: carId}); 

  //Check if duration is legit
  if(rentDuration > car.maxTime) {
    return false;
  }

  //Check if time frame is legit for that car
  if (!TimeManager.timeFrameWithinTimeFrame(car.earlyTime, car.lateTime, rentTime, rentDuration)) {
    return false;
  }

  //If there is no other booking that day (and didnt already fail previous checks), has to be available
  if (!alreadyExisting) {
    return true;
  }

  //Check all other bookings, if one of them overlaps it is not available
  for (let i = 0; i < alreadyExisting.length; i++) {
    const { time, duration } = alreadyExisting[i];
    if (TimeManager.isTimeOverlap(rentTime, rentDuration, time, duration)) {
      return false;
    }
  }

  return true;
}

async function getUserCostInfo(userId) {
  bookings = await BookingModel.find({userId: userId});

  let totalCost = 0;
  const totalBookings = bookings.length;
 

  bookings.forEach((booking) => {
    totalCost += booking.price;
  });
  
  const averageCost = totalBookings == 0 ? 0 : totalCost / totalBookings;

  return { totalCost: totalCost, averageCost: averageCost, totalBookings: totalBookings };
}

async function getCarPrice(carId, duration) {
  car = await CarModel.findOne({carId: carId});
  return car.price + car.pricePerMinute * duration;
}

app.listen(port, () => {
  console.log('Server running on http://localhost:' + port)
})