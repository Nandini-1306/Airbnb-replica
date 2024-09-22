const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema ({
     email: {
        type:String,
        required:true
     }
});

User.plugin(passportLocalMongoose);

modules.export = mongoose.model('User',userSchema);