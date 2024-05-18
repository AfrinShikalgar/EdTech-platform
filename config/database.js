const mongoose = require('mongoose');
require('dotenv').config();

exports.connect = () =>{
    mongoose.connect(process.env.MONGODB_URL,{})
    .then(()=>{console.log("DB connection successfully")})
    .catch((er)=>{
        console.log("DB Connection Failed");
        console.error(er);
        process.exit(1);
    })
};