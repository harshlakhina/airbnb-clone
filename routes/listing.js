const express=require("express");
const router=express.Router();
const WrapAsync=require("../utils/WrapAsync.js");
const Listing=require("../modules/listing.js");
const {isloggedIn, isOwner,validateschema}=require("../middleware.js");
const listingcontroller=require("../controllers/listings.js");
const multer =require("multer");
const {storage}=require("../cloudconfig.js");
const upload=multer({storage});

// index and crate route
router
.route("/")
.get(WrapAsync(listingcontroller.index))
.post(isloggedIn,upload.single("listing[image]"),validateschema,WrapAsync(listingcontroller.createListing));


// new route
router.get("/new",isloggedIn,listingcontroller.renderNewForm);


// show , update and delete route
router
.route("/:id")
.get(WrapAsync(listingcontroller.showListing))
.put(isloggedIn,isOwner,upload.single("listing[image]"),validateschema,WrapAsync(listingcontroller.updateListing))
.delete(isloggedIn,isOwner,WrapAsync(listingcontroller.destroyListing));


// Edit route
router.get("/:id/edit",isloggedIn,isOwner,WrapAsync(listingcontroller.renderEditForm));




module.exports=router;