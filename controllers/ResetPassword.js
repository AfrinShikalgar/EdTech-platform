const User = require("../models/User")
const mailSender = require("../utils/mailSender")

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
        {new:true}
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
