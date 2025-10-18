const express=require("express");
const router=express.Router({mergeParams:true});
const Review=require("../modules/review.js");
const WrapAsync=require("../utils/WrapAsync.js");
const Listing = require("../modules/listing.js");
const { validatereview, isloggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController=require("../controllers/reviews.js");


// review post route
router.post("/",validatereview,isloggedIn,WrapAsync(reviewController.createReview));

// delete review route
router.delete("/:reviewId",isloggedIn,isReviewAuthor,WrapAsync(reviewController.destroyReview));

module.exports=router;