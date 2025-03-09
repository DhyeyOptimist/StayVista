const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    Comment:{
        type: String,
    },
    Rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    CreatedAt: {
        type: Date,
        default: Date.now,
    },
});

modeule.exports = mongoose.model("Review", reviewSchema);
