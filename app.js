const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const createError = require('http-errors');
const methodOverride = require('method-override');
const indexRouter = require('./routes/review');
const usersRouter = require('./routes/review.js');
const Listing = require("./models/listing");
const ejsMate = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressErrors.js");
const listings = require('./routes/listing');
const reviews = require('./routes/review');
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

// ✅ Fixed routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

app.all("*",(req,res,next)=>{
  next(new expressError(404,"If you find this page, let us know—we lost it too"));
});

//expressError middle ware 

app.use((err,req,res,next)=>{ console.log(err);
  let{statusCode = 500, message = "Congratulations! You’ve discovered a secret void."} = err;
  // res.status(statusCode).send(message);
  res.render("error.ejs",{ message });
  console.log(err);
});

// ✅ Debugging 404 errors

// ✅ Start server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});

module.exports = app;