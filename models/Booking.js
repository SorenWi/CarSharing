const mongoose = require("mongoose");
const Schema  = mongoose.Schema;

const bookingSchema = new Schema({
    carId: String,
    userId: String,
    time: String,
    duration: Number,
    date: String,
    price: Number
});

module.exports = mongoose.model("Booking", bookingSchema);