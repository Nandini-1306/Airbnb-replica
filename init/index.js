//database initilization
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initdata = require("./data.js");
const URL = 'mongodb://127.0.0.1:27017/WanderLust';


main().then((res)=>{
    console.log("connected");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(URL);
}

const initDB = async ()=>{
    await Listing.deleteMany({});//pehle se agr data ho to clear kr do
    await Listing.insertMany(initdata.data);//initdata is object
    console.log("initilized");
};

initDB();//calling initaDB