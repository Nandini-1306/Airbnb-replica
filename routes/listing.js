const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing")

const validateListing = (req, res, next) => {
    console.log(req.body);
    
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400, error);
    }else{
        next();
    }
}

//Index Route
router.get("/", wrapAsync(async (req,res) => {
    const allListings =  await Listing.find({});
    res.render("listings/index.ejs", {allListings});
 }));
 
 //New Route
 router.get("/new", (req, res) => {
     res.render("listings/new.ejs");
 });  
 
 //Show Route
 router.get("/:id" , wrapAsync(async (req, res) => {
     let {id} = req.params;
     const listing = await Listing.findById(id).populate("reviews");
     if(!listing) {
        req.flash("error", "Listing does not exist");
        res.redirect("/listings");
     }
     res.render("listings/show.ejs", { listing });
 }));
 
 //Create Route
 router.post("/" , validateListing, wrapAsync(async (req,res,err) => {
     const newListing = new Listing(req.body.listing);
     await newListing.save();
     req.flash("success", "New listing created");
     res.redirect("/listings");   
 }));
 
 //Edit Route
 router.get("/:id/edit", wrapAsync(async (req,res) => {
     let {id} = req.params;
     const listing = await Listing.findById(id);
     if(!listing) {
        req.flash("error", "Listing does not exist");
        res.redirect("/listings");
     }
     res.render("listings/edit.ejs",  {listing});
 }));
 
 //Update Route
 router.put("/:id",validateListing, wrapAsync(async (req,res) => {
     if(!req.body.listing){
         throw new ExpressError(400, "Send valid data for listing");
     }
     let {id} = req.params;
     await Listing.findByIdAndUpdate(id, {...req.body.listing});
     req.flash("success", "listing updated");
     res.redirect(`/listings/${id}`);
 }));
 
 //Delete Route
 router.delete("/:id", wrapAsync(async (req,res) => {
     let {id} = req.params;
     await Listing.findByIdAndDelete(id);
     req.flash("success", "listing deleted");
     res.redirect("/listings");
 }));

module.exports=router;
