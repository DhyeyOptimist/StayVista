const Listing = require("./models/listing");


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be signed in first!");
        return res.redirect("/users/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    };
    next();
};


module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;  //to id ne extract kari then ene
    const listing = await Listing.findById(id); // database ma find kari
    if (!listing.owner.equals(res.locals.currentUser._id)) {
        req.flash("error", "You don't have permission to do that!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};



