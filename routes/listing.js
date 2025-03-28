var express = require('express');
var router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema  } = require("../schema.js");
const expressError = require("../utils/expressErrors.js");
const Listing = require("../models/listing");

const validateListing = (req,res,next)=>{
  let {error} = listingSchema.validate(req.body);
  console.log(req.body);

  if(error){
    let errMsg = error.details.map(el => el.message).join(",");
    throw new expressError(400, errMsg);
  }else{ 
    next();
  }
};

router.get("/", wrapAsync(async(req,res)=>{ 
  let allListings = await Listing.find({});
  // console.log(allListings);
  res.render("listings/index.ejs", {allListings});

}));

//new route
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

//show route
router.get("/:id", wrapAsync(async (req, res) => {
  let {id} = req.params; //to id ne extract kari then ene 
  const listing = await Listing.findById(id).populate("reviews");
  if(!listing){
    req.flash("error", "Listing Doesn't Exist!");
    res.redirect("/listings");
  }
  // database ma find kari
  res.render("listings/show.ejs", {listing});
}));

//create route --> db ma data pass thase and save thase (add data ma)
router.post(
  "/", 
  validateListing,
  wrapAsync(async (req, res ,next) => {
  
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "Successfully made a new listing!");
    res.redirect("/listings");
})
);

//Update Route 2 methods to update
//edit route
 router.get("/:id/edit", wrapAsync(async (req, res) => {
  let {id} = req.params;  //to id ne extract kari then ene
  const listing = await Listing.findById(id); // database ma find kari
  if(!listing){
    req.flash("error", "Listing Doesn't Exist!");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs", {listing});
 }));

//for updating (put request)

router.put("/:id", wrapAsync(async (req, res) => {
  let {id} = req.params;  //to id ne extract kari then ene
  await Listing.findByIdAndUpdate(id, { ...req.body.listing }); 
  req.flash("success", "Successfully Edited a listing!");
  // database ma find and update
  res.redirect(`/listings/${id}`);
}));

//delete route

router.delete("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;  //to id ne extract kari then ene
  await Listing.findByIdAndDelete(id); // database ma find and delete
  req.flash("success", "Successfully Deleted a listing!");
  res.redirect("/listings");
}));


module.exports = router;
