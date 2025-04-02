const express = require('express');
const router = express.Router();
const User = require("../models/user");
const WrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/", (req, res) => {
  res.render("users/auth.ejs");
});
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});


router.post("/signup", WrapAsync(async(req, res) => {
  try{
    const {username, email, password} = req.body;
    const newUser = new User({username, email});
    const registerUser = await User.register(newUser, password);
    console.log(registerUser);
    req.login(registerUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to StayVista!");
    res.redirect("/listings");
      
    });

    
  }
  catch(err){
  req.flash("error", "User Already exists!");
    res.redirect("/users/signup");
  }
 }
));

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(

  "/login",
  saveRedirectUrl,
  passport.authenticate("local",{
    failureRedirect: "/users/login",
    failureFlash: true,
  }),
  async(req, res) => {
    req.flash("success","Logged in successfully, Welcome back!");
    res.redirect(req.locals.redirectUrl);
}
);

router.get("/logout", (req, res,next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged out successfully!");
    res.redirect("/listings");
  });
});


module.exports = router;