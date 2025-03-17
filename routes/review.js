var express = require('express');
const router = express.Router({ mergeParams: true });
const Review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema  } = require("../schema.js");
const expressError = require("../utils/expressErrors.js");
const Listing = require("../models/listing");

const validatereview = (req,res,next)=>{
  let {error} = reviewSchema.validate(req.body);

  if(error){
    let errMsg = error.details.map(el => el.message).join(",");
    throw new expressError(400, errMsg);
  }else{ 
    next();
  }
};


//review 
//post route
router.post("/", validatereview, wrapAsync(async (req, res, next) => {
    try {
        let listing = await Listing.findById(req.params.id);
        
        let newReview = new Review(req.body.review);
        console.log(req.body);
        listing.reviews.push(newReview);

        await newReview.save();
        await listing.save();

        res.redirect(`/listings/${listing._id}`);
    } catch (err) {
        next(err); // Pass error to Express error middleware
    }
}));
  
//delete Route review
  
router.delete("/:reviewId",  async (req, res) => { console.log("deleting review");
    let { id, reviewId } = req.params;  //to id ne extract kari then ene
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    let deletedResult = await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
  });

module.exports = router;
