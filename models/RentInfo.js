const mongoose = require("mongoose");
const Schema  = mongoose.Schema;

const rentInfoSchema = new Schema({
    carId: String,
    startTime: String,
    endTime: String,
    date: String
});

module.exports = mongoose.model("RentInfo", rentInfoSchema);