const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const createError = require('http-errors');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const Listing = require("./models/listing");

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
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Fixed routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(express.urlencoded({extended: true}));

app.get("/listings", async(req,res)=>{
  let allListings = await Listing.find({});
  res.render("listings/index.ejs", {allListings});
});


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

app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
})

//show route
app.get("/listings/:id", async (req, res) => {
  let {id} = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", {listing});
});





// ✅ Debugging 404 errors
app.all("*", (req, res, next) => {
  console.log(`❌ Route not found: ${req.originalUrl}`);
  next(createError(404));
});

// ✅ Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// ✅ Start server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});

module.exports = app;