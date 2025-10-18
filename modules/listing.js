const mongoose=require("mongoose");
const schema=mongoose.Schema;
const Review=require("./review.js");
const { required } = require("joi");


// listing schema
const listingSchema=new schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        url:String,
        filename:String       
    },
    price:{
       type: Number,
       min:100
    },
    location:String,
    country:String,
    reviews:[
        {
            type:schema.Types.ObjectId,
            ref:"review"
        }
    ],
    owner:{
         type:schema.Types.ObjectId,
         ref:'User'
    },
    geometry:{
        type:{
            type:String,
            enum:['point'],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    }
});   // listing schema end

// mongoose middleware
listingSchema.post("findOneAndDelete",async(listing)=>{
    console.log('hello');
    if(listing){
     await Review.deleteMany({_id:{$in:listing.reviews}});
    }
});


const Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;


