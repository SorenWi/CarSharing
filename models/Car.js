const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const carSchema = new Schema({
    carId: String,
    carName: String,
    fuelType: String,
    earlyTime: String,
    lateTime: String,
    maxTime: Number,
    flatrate: Number,
    costPerMinute: Number
});

module.exports = mongoose.model("Car", carSchema)