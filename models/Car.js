const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const carSchema = new Schema({
    make: String,
    model: String,
    carId: String,
    name: String,
    fuelType: String,
    earlyTime: String,
    lateTime: String,
    maxTime: Number,
    price: Number,
    pricePerMinute: Number
});

module.exports = mongoose.model("Car", carSchema)