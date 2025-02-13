const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type: String,
        required: true,
    },
    description: {
        type: String,
        // trim: true,
    },
    image: {
        type: String,
        default: "https://www.vectorstock.com/royalty-free-vectors/picture-not-available-vectors",
        set: (v) => v === ""? "https://www.vectorstock.com/royalty-free-vectors/picture-not-available-vectors" : v,
    },
    price: {
        type: Number,
        // min: 500,
    },
    location: {
        type: String,
        // required: true,
        // unique: true,
    },
    country: {
        type: String,
        // enum: ["India","Nepal","Lakshadweep Islands","Andaban and Nicobar Islands","United States","Italy", "Mexico","Switzerland","Tanzania","Netherlands","Fiji","United Kingdom","Indonesia","Canada","Thailand","United Arab Emirates","Greece","Costa Rica", "Japan","Maldives"],
    },
});

const Listing = mongoose.model("listing",listingSchema);

module.exports = Listing;