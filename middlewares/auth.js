const jwt = require("jsonwebtoken");
const User = require("../models/User")
require("dotenv").config()

//auth
exports.auth = (req,res,next) =>{
    try{
        //extract token
    const token = req.cookies.token ||
                 req.body.token ||
                 req.header("Authorisation").replace("Bearer ","")

    //if token is missing, then return response
    if(!token){
        return res.status(400).json({
            success:false,
            message:"TOKEN is missing"
        })
    }  
    
    //verify token
    try{
       const decode = jwt.verify(token,process.env.JWT_SECRET);
       console.log(decode);

       req.user = decode;

    }catch(error){
       //verfication issue
       return res.status(400).json({
        success:false,
        message:"Token is invalid"
       })
    }
    next();
    }catch(err){
        return res.status(401).json({
            success:false,
            message:"something went wrong while validating the token"
        })
    } 
}

//isStudent
exports.isStudent = (req,res,next) =>{
    try{
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for student only"
            })
        }
      next();
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Cannot verified"
        })
    }
}


//isInstrctor
exports.isInstructor = (req,res,next) =>{
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for instrctor only"
            })
        }
    next();
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Cannot verified"
        })
    }
}

//IsAdmin
exports.isAdmin = (req,res,next) =>{
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Admin only"
            })
        }

    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Cannot verified"
        })
    }
    next();
}