const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { ref } = require("joi");
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
    //     type: String,
    //     default: "https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-pic-design-profile-vector-png-image_40966566.jpg",
    //     set: (v) => v === ""? "https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-pic-design-profile-vector-png-image_40966566.jpg" : v,
    url: String,
    filenme: String,
},
    price: {
        type: Number,
        // min: 500,
    },
    location: {
        type: String,
        // required: true,
        unique: false,
    },
    country: {
        type: String,
        // enum: ["India","Nepal","Lakshadweep Islands","Andaban and Nicobar Islands","United States","Italy", "Mexico","Switzerland","Tanzania","Netherlands","Fiji","United Kingdom","Indonesia","Canada","Thailand","United Arab Emirates","Greece","Costa Rica", "Japan","Maldives"],
    },
    reviews: [
        {
        type: Schema.Types.ObjectId,
        ref: "Review",
        },
        
],
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    
});


listingSchema.post("findOneAndDelete", async function (listing) {
    if (listing && listing.reviews.length) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("listing",listingSchema);

module.exports = Listing;
