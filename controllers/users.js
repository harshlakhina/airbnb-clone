const { model } = require("mongoose");
const User=require("../modules/user.js");

module.exports.renderSignupForm=(req,res)=>{
    res.render("../views/users/signup.ejs");
};

module.exports.signUp=async(req,res)=>{
    try{
    let {username,email,password}=req.body;
    const newUser=new User({username,email});

    let registeredUser=await User.register(newUser,password);

    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to Wanderlust");
        res.redirect("/listings");
    });
    }catch(e){
        req.flash("failure",e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm=(req,res)=>{
    res.render("../views/users/login.ejs"); 
};

module.exports.login=async(req,res)=>{
     req.flash("success","Welcome back to Wanderlust!.you are logged in!");
     let redirect1=res.locals.redirectUrl || "/listings";
     console.log(redirect1);
     res.redirect(redirect1);
};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    })
};