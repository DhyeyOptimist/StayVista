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
const flash = require("connect-flash");
const app = express();
const port = 8080;
const User = require("./models/user");
const passport = require("passport");
const LocalStrategy = require("passport-local");

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


const sessionOptions = {
  secret: "mysecretcode",
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

app.get("/demouser",async (req,res)=>{
  let fakeUser = new User ({
    email: "stude@example.com",
    username: "Stalin",
  });

  let registeredUser = await User.register(fakeUser, "password@123");
  res.send(registeredUser);
  });

//middleware for flash
app.use((req,res,next) =>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// app.get("/fakeUser", async (req,res)=>{
// }

app.get("/",(req,res)=>{
  res.redirect("/listings");
});

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/users", userRouter);

// app.all("*",(req,res,next)=>{
//   next(new expressError(404,"If you find this page, let us know—we lost it too"));
// });

//expressError middle ware 

app.use((err,req,res,next)=>{ console.log(err);
  let{statusCode = 500, message = "Congratulations! You’ve discovered a secret void."} = err;
  // res.status(statusCode).send(message);
  // res.render("error.ejs",{ message });
});

// ✅ Debugging 404 errors

// ✅ Start server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});

module.exports = app;