const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config();

//sendOTP
exports.sendMail = async (req,res) =>{
   try{ //Fetch mail from request body
    const{email} = req.body;

    //check if user already exist or not
    const checkUserExistance = await User.findOne({email});

    //If already present ,send response
    if(checkUserExistance){
       return res.status(401).json({
        success: false,
        message: "User Already registered!!"
       })
    }


    //generate OTP
    var otp = otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,
    })

    console.log("Generated OTP",otp);

    //check unique or not
    let result = await OTP.findOne({otp:otp});

    while(result){
        otp = otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,
        });
        result = await OTP.findOne({otp:otp})
    }

    const otpPayload = {email,otp};//createdAt bydefault value model me hai

    //create an entry for OTP
    const otpBody = await OTP.create(otpPayload);
    console.log("Otp body ",otpBody);

    res.status(200).json({
        success:true,
        message:"OTP sent successfully",
        otp
    })


}catch(err){
    console.loh(err);
        return res.status(500).json({
            success:false,
            message:err.message,
        })
    }
}


//signup
exports.signup = async(req,res) =>{
    try{

        //fetch data
     const{
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        contactNumber,
        otp
     } = req.body;

      //validate
     if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
        return res.status(400).json({
            success:false,
            message:"All fields are required"
        })
    }
   //check 2 password same or not
    if(password !== confirmPassword){
       return res.status(400).json({
        success:false,
        message:"Password and confirmPassword not matched"
       })
    }

    //check user exist or not
    const existUser = await User.findOne({email});

    if(existUser){
        return res.status(400).json({
            success:false,
            message:"User is already registred"
        })
    }

    //find most recent OTP
    const recentOtp = User.find({email}).sort({createdAt:-1}).limit(1);
    console.log("RecentOTP",recentOtp);

    if(recentOtp.length == 0){
        //otp not found
        return res.status(400).json({
            success:false,
            message:"OTP not found"
        })
    }
    else if(otp !== recentOtp){
         //invalid OTP
        return res.status(400).json({
            success:false,
            message:"Invalid OTP"
        })
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password,10);//10 round hashing

    //create entry in DB
    const profileDetails = Profile.create({
        gender:null,
        dateOfBirth:null,
        about:null,
        contactNumber:null
    });

    const user = await User.create({
        firstName,
        lastName,
        email,
        contactNumber,
        password:hashedPassword,
        accountType,
        additionalDetails:profileDetails._id,
        image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
    })

    //response return
    return res.status(200).json({
        success:true,
        message:"User is registred successfulle",
        user,
    })
    }catch(err){
       console.log(error);
       return res.status(400).json({
        success:false,
        message:"User not registred plzz try again"
       })
    }
}

//login
exports.login = async(req,res)=>{
    try{
      //fetch data
      const{email,password} = req.body;

      //valiadte data
      if(!email || !password){
        return res.status(403).json({
            success:false,
            message:"Plzz fill all required data"
        })
      }

      //user exist
      const user = await User.findOne({email});
      if(!user){
        return res.status(403).json({
            success:false,
            message:"Plzz signup first"
        })
      }

      //generate jwt token after password matching
       if(await bcrypt.compare(password,user.password)){
         const payload = {
            email:user.email,
            id:user._id,
            role:user.role,
         }
          const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"2h"})

          user.token = token;
          user.password = undefined;

          //craete cookie and send msg
          const options = {
            expires:new Date(Date.now() +3*24*50*60*1000),
            httpOnly:true,
          }
          res.cookie("token",token,options).status(200).json({
            success:true,
            token,
            user,
            message:'Logged in successfully'
          })

       }
       else{
        return res.status(401).json({
            success:false,
            message:"password is incorrect"
        })
       }
       
    
    }catch(err){
       console.log(err);
       return res.status(500).json({
        success:false,
        message:"Login failure, try again"
       })
    }
};

//change password
exports.changePassword = async(req,res)=>{
    
}

