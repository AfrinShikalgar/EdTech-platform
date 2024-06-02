const User = require("../models/User")
const mailSender = require("../utils/mailSender")
const bcrypt = require("bcrypt");
//resetPasswordToken

exports.resetPasswordToken = async(req,res) =>{
   try{ //get email from req body
    const email = req.body.email;

    //chech user exist for this moil ,emial validation
    const user = await User.findOne({
        email:email
    })

    if(!user){
        return res.status(400).json({
            sucess:false,
            message:"Your email is not registered woth us"
        });
    }

    //generate token
    const token = crypto.randomUUID();

    //update user by adding token and expire time
    const updatedDetails = await User.findOneAndUpdate({email:email},
        {
            token:token,
            resetPasswordExpires:Date.now() + 5*60*1000, 
        },
        {new:true}//return updated doc
    )

    //crate url
    const url = `http://localhost:3000/update-password/${token}`

    //send mail containing the url
    await mailSender(email,
        "Password Reset Link",
        `Password Reset Link:${url} `
    )

    return res.json({
        success:true,
        message:"Email sent successfully, plzz check mail and change password"
    });
}catch(err){
    console.log(err);
    return res.status(500).json({
        success:false,
        message:"Something went wrong while reset password"
    })
    }
}



//reset password
exports.resetPassword = async(req,res) =>{
    try{
       //data fetch
       const{password,confirmPassword,token} = req.body;

       //valiadtion
       if(password !== confirmPassword){
        return res.json({
            success:false,
            message:"Password not match"
        })
       }

       //get userdetails from db using token
       const userdetails = await User.findOne({token:token});

       //if no entry - invalid token 
       if(!userdetails){
        return res.json({
            success:false,
            message:"Token is invalid"
        })
       }

       //token time check
       if(userdetails.resetPassword < Date.now()){
               return res.json({
                success:false,
                message:"Token is expired, plzz regenerate your token"
               })
       }

       //hash pwd
       const hashedPassword = bcrypt.hash(password,10);

       //update password
       await User.findOneAndUpdate(
        {token:token},
        {password:hashedPassword},
        {new:true}
       );

       return res.status(200).json({
        success:true,
        message:"Password reset successfully"
       })
    }catch(err){
        return res.status(401).json({
            success:false,
        })
    }
}