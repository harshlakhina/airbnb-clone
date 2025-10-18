if(process.env.NODE_ENV!="production"){
  require("dotenv").config();
}

// connection with database
const db_URL=process.env.ATLAS_DB_URL;

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodoverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js"); 
const session=require("express-session");
const Mongostore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const Localstrategy=require("passport-local");
const User=require("./modules/user.js");





const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodoverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const store=Mongostore.create({
    mongoUrl:db_URL,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
})

const sessionoption={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitalized:true,
    cookie:{
        expires:Date.now()+8*24*60*60*1000,
        maxAge:1000*60*60*24*8,
        httpOnly:true
    }
};


app.use(session(sessionoption));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(User.authenticate()));
app.use(flash());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});




async function main(){
    await mongoose.connect(db_URL);
}

main().then(()=>{
    console.log("connection succesful");
})
.catch((err)=>{
    console.log(err)
});   // coonection part end here


app.listen(8080,()=>{
    console.log("port is listening");
});



app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);


app.get("/demouser",async(req,res)=>{
    let fakeuser=new User({
        email:"harsh@123",
        username:"harsh@213"
    })

     let a=await User.register(fakeuser,"password");
     res.send(a);
});






// page not found middleware
app.use((req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});


//error handle middleware
app.use((err,req,res,next)=>{
    let {status=500,message}=err;
    res.status(status).render("error.ejs",{message});
});
