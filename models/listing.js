const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.js");
//schema
const listingSchema = new Schema({
    title :{
        type:String,
        required:true
    },
    description: {
        type:String
    },
    image: {
        type: String,
        default: "https://unsplash.com/photos/trees-beside-white-house-IYfp2Ixe9nM",
        set: (v) => (v === "" ? "https://unsplash.com/photos/trees-beside-white-house-IYfp2Ixe9nM" : v)
    },  
    
    price : {
        type:Number
    },
    location : {
        type:String
    },
    country :{
        type:String
    },
    reviews:[
        {
           type:Schema.Types.ObjectId,
           ref:"Review"
        }

    ]
});

listingSchema.post("findOneAndDelete", async (listing) =>{
    if(listing)
await Review.deleteMany({_id :{$in: listing.reviews}});
    console.log(`Deleted reviews: ${listing.reviews}`);
});
//model
const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;