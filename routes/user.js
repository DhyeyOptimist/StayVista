const express = require('express');
const router = express.Router();
const User = require("../models/user");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});


router.post("/signup", async(req, res) => {
  const {username, email, password} = req.body;
  const newUser = new User({username, email});
  const registerUser = await User.register(newUser, password);
  console.log(registerUser);
  req.flash("success", "Welcome to StayVista!");
  res.redirect("/listings");
}
);
module.exports = router;