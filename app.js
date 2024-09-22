const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 8080;
const URL = 'mongodb://127.0.0.1:27017/WanderLust';
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const session = require("express-session");
const flash = require("connect-flash");


app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const sessionOptions ={
    secret: "mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

main().then((res)=>{
    console.log("connected");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(URL);
};



app.listen(port,()=>{
    console.log(`listening to port ${port}`);
});

app.get("/" , (req,res)=>{
    res.send("succesefull");
});


//error middleware
app.use((err,req,res,next)=>{
    let {statusCode=500 , message="soemthing went wrong"} = err;
    res.status(statusCode).render("error.ejs" , {err});
    // res.status(statusCode).send(message);
});


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.success=req.flash("error");
    next();
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);



  //to all the routes whihch are not defined beforec
app.all("*" , (req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
});
