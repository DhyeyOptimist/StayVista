const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type: String,
        required: true,
    },
    description: {
        type: String,
        trim: true,
    },
    image: {
        type: String,
        set: (v) => v === ""? "https://www.vectorstock.com/royalty-free-vectors/picture-not-available-vectors" : v,
    },
    price: {
        type: Number,
        min: 3000,
    },
    location: {
        type: String,
        required: true,
        unique: true,
    },
    country: {
        type: String,
        enum: ["India","Nepal","Lakshadweep Islands","Andaban and Nicobar Islands"],
    },
});

const Listing = mongoose.model("listing",listingSchema);

module.exports = Listing;