const Review=require("../modules/review.js");
const Listing = require("../modules/listing.js");


module.exports.createReview=async(req,res)=>{

    const listing=await Listing.findById(req.params.id);
    const newreview=new Review(req.body.review);
    listing.reviews.push(newreview);

    newreview.author=req.user._id;

    await listing.save();
    await newreview.save();
    req.flash("success"," new review created!");

    res.redirect(`/listings/${listing._id}`);

};

module.exports.destroyReview=async(req,res)=>{
   let {id,reviewId}=req.params;
    
   await Listing.findByIdAndUpdate(id, {$pull: {reviews:reviewId}});
   await Review.findByIdAndDelete(reviewId);

   req.flash("success"," Review deleted!");
   res.redirect(`/listings/${id}`);

};