var express = require('express');
var router = express.Router();
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
router.post("/reviews", validatereview , wrapAsync(async (req, res) =>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    console.log(req.body);
    listing.reviews.push(newReview);
  
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
  }));
  
  
  //delete Route review
  
  router.delete("/:id",  async (req, res) => { console.log("deleting lisitng")
    let { id } = req.params;  //to id ne extract kari then ene
    await Listing.findByIdAndDelete(id); // database ma find and delete
    res.redirect("/listings");
  });
  

module.exports = router;
