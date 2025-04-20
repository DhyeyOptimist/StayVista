require('dotenv').config();
console.log(process.env.SECRET);

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
const listingsRouter = require('./routes/listing');
const reviewsRouter = require('./routes/review');
const userRouter = require('./routes/user');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const app = express();
const port = process.env.PORT || 4000;
const User = require("./models/user");
const passport = require("passport");
const LocalStrategy = require("passport-local");

// ✅ Fix: Corrected MongoDB connection
// const MONGO_URL = "mongodb+srv://dhyeyoptimist:6YHivaJ3MJG6Ysd@cluster0.nst68mk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbURL = process.env.ATLASDB_URL;

async function main() {
  try {
    await mongoose.connect(dbURL);
    console.log('✅ Database connected successfully!');
  } catch (err) {
    console.error('❌ Database connection error:', err.message);
    // Exit the process if database connection fails
    process.exit(1);
  }
}

main();

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

const store = MongoStore.create({
  mongoUrl: dbURL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", function(err){
  console.log("Session Store Error",err);
});

const sessionOptions = {
  store,
  secret:  process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {

    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
};



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get("/demouser",async (req,res)=>{
//   let fakeUser = new User ({
//     email: "stude@example.com",
//     username: "Stalin",
//   });

//   let registeredUser = await User.register(fakeUser, "password@123");
//   res.send(registeredUser);
//   });

//middleware for flash
app.use((req,res,next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

app.get("/",(req,res)=>{
  res.redirect("/listings");
});

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/users", userRouter);

app.all("*",(req,res,next)=>{
  next(new expressError(404,"If you find this page, let us know—we lost it too"));
});

//expressError middle ware 

app.use((err,req,res,next)=>{ console.log(err);
  let{statusCode = 500, message = "Congratulations! You've discovered a secret void."} = err;
  // res.status(statusCode).send(message);
  // res.render("error.ejs",{ message });
});

// ✅ Debugging 404 errors

// ✅ Start server with error handling
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${port} is already in use. Please try a different port.`);
    process.exit(1);
  } else {
    console.error('❌ Server error:', err);
    process.exit(1);
  }
});

module.exports = app;