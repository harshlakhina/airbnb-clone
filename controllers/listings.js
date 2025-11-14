require("dotenv").config();
const Listing=require("../modules/listing.js");
let apikey=process.env.API_KEY;

module.exports.index=async(req,res)=>{
    const alldata = await Listing.find({});
    res.render("./listings/index.ejs",{alldata});
};

module.exports.renderNewForm=(req,res)=>{
    res.render("./listings/new.ejs");
};

module.exports.createListing=async (req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    let newlisting=new Listing(req.body.listing);
    
    try{
    let address=newlisting.location;
    let encodedaddress=encodeURIComponent(address);
    let response=await fetch(`https://us1.locationiq.com/v1/search?key=${apikey}&q=${encodedaddress}&format=json`);
    let data=await response.json();
    newlisting.geometry={
        type:'point',
        coordinates:[data[0].lon,data[0].lat],
    };
    }catch(err){
        console.log(err);
        req.flash("error","try again later");
    }
    newlisting.owner=req.user._id;
    newlisting.image={url,filename};
    await newlisting.save();
    console.log(newlisting);
    req.flash("success","New listing is created!");
    res.redirect("/listings");

};

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listings=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    console.log(listings);
    if(!listings){
        req.flash("error","the listings you request for does't exits ");
       return res.redirect("/listings");
    }
    res.render("./listings/show.ejs",{listings});
};

module.exports.renderEditForm=async (req,res)=>{

    let {id}=req.params;
    const data=await Listing.findById(id);
     if(!data){
        req.flash("error","the listings you request for does't exits ");
        return res.redirect("/listings");
    }
    let originalimageurl=data.image.url;
    originalimageurl=originalimageurl.replace("/upload","/upload/h_300,w_250")
    res.render("./listings/edit.ejs",{data,originalimageurl});
};

module.exports.updateListing=async(req,res)=>{
    
    let {id}=req.params;
    console.log(req.body);
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing},{new:true});

    if( typeof req.file!="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
    req.flash("success"," listing updated!!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=async(req,res)=>{
     let {id}=req.params;
     await Listing.findByIdAndDelete(id);
     req.flash("success"," listing deleted!");
     res.redirect("/listings");
};

module.exports.searchListing= async (req,res)=>{
    let {location}=req.query;
    location=location.trim();
    const regex=new RegExp(location,"i");
    let alldata=await Listing.find({location:regex});
    
    if(alldata.length) res.render("./listings/index.ejs",{alldata});
    else res.render("./listings/search.ejs",{location});

}



 