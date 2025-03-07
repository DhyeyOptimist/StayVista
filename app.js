const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const createError = require('http-errors');
const methodOverride = require('method-override');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const Listing = require("./models/listing");
const ejsMate = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync");
const expressError = require("./utils/expressErrors.js");
const { ListingSchema } = require("./schema.js");

const app = express();
const port = 8080;



// ✅ Fix: Corrected MongoDB connection
const MONGO_URL = "mongodb://127.0.0.1:27017/stayvista";

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("✅ Connected to DB");
}

main().catch(err => console.log("❌ DB Connection Error:", err));

// ✅ View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);

const validateListing = (req,res,next)=>{
  let {error} = ListingSchema.validate(req.body);

  if(error){
    let errMsg = error.details.map(el => el.message).join(",");
    throw new expressError(400, errMsg);
  }else{ 
    next();
  }
};

// ✅ Fixed routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get("/listings", wrapAsync(async(req,res)=>{ 
  let allListings = await Listing.find({});
  // console.log(allListings);
  res.render("listings/index.ejs", {allListings});

}));


// app.get("/testListings", async (req, res) => {
//   try {
//     if (mongoose.connection.readyState !== 1) {
//       return res.status(500).send("Database not connected ❌");
//     }

//     let sampleListing = new Listing({
//       title: "JK farm",
//       description: "This is the best weekend farm for your family",
//       image: "",
//       price: 5000,
//       location: "Bakrol Vadtal Road, near Atmiya Empire",
//       country: "India",
//     });

//     await sampleListing.save();
//     console.log("✅ Data saved successfully");
//     res.send("Successful testing ✅");
//   } catch (err) {
//     console.error("❌ Error saving data:", err);
//     res.status(500).send("Error saving data");
//   }
// });

//new route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//show route
app.get("/listings/:id", wrapAsync(async (req, res) => {
  let {id} = req.params; //to id ne extract kari then ene 
  const listing = await Listing.findById(id); // database ma find kari
  res.render("listings/show.ejs", {listing});
}));

//create route --> db ma data pass thase and save thase (add data ma)
app.post(
  "/listings", 
  validateListing,
  wrapAsync(async (req, res ,next) => {
  

    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");

})
);

//Update Route 2 methods to update
//edit route
 app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  let {id} = req.params;  //to id ne extract kari then ene
  const listing = await Listing.findById(id); // database ma find kari
  res.render("listings/edit.ejs", {listing});
 }));

//for updating (put request)

app.put("/listings/:id", wrapAsync(async (req, res) => {
  let {id} = req.params;  //to id ne extract kari then ene
  await Listing.findByIdAndUpdate(id, { ...req.body.listing }); // database ma find and update
  res.redirect(`/listings/${id}`);
}));

//delete route

app.delete("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;  //to id ne extract kari then ene
  await Listing.findByIdAndDelete(id); // database ma find and delete
  res.redirect("/listings");
}));

app.all("*",(req,res,next)=>{
  next(new expressError(404,"If you find this page, let us know—we lost it too"));
});

//expressError middle ware 

app.use((err,req,res,next)=>{
  let{statusCode = 500, message = "Congratulations! You’ve discovered a secret void."} = err;
  // res.status(statusCode).send(message);
  res.render("error.ejs",{ message });
});  



// ✅ Debugging 404 errors2
// app.all("*", (req, res, next) => {
//   console.log(`❌ Route not found: ${req.originalUrl}`);
//   next(createError(404));
// });


// ✅ Error handler
// app.use(function (err, req, res, next) {
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//   res.status(err.status || 500);
//   res.render('error');
// });


// ✅ Start server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});

module.exports = app;