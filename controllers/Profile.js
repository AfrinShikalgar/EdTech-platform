const Profile = require("../models/Profile")
const User = require("../models/User")

//hw - request ko schdule kaise krenge
//CRONJOB
exports.updateProfile = async(req,res)=>{
    try{
        //getdata
        const {dateOfBirth="",about="",contactNumber,gender} = req.vody;
        //get userid
        const id = req.user.id;
        //validate
        if(!contactNumber || !gender || !id){
            return res.status(400).json({
                 success:false,
                 message:"All field are required"
            })
        }
        //find profile
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;

        const profileDetails = await Profile.findById(profileId)

        //update profile
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.contactNumber = contactNumber;
        profileDetails.gender = gender;
        profileDetails.about = about;
        await profileDetails.save();
        //return response
        return res.status(200).json({
            success:true,
            message:"profile updtaed successfully"
        })

    }catch(error){
     return res.status(400).json({
        success:false,
        error:error.message,
     })
    }
}



//deleteAccount
exports.deleteAccount = async(req,res) =>{
    try{
        //fetch id;
        const {id} = req.user.id;
        //validate
        const userDetails = await User.findById(id);
        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:"user not found"
            })
        }
      
        //delete profile
        await Profile.findByIdAndDelete({_id:user.additionalDetails})
        //delete user
        await user.findByIdAndDelete({_id:id})
        //return response
        return res.status(400).json({
               success:true,
               message:"User deleted "
        })



    }catch(error){
        return res.status(400).json({
            success:false,
            message:"some issue "
     })
    }
}

//getAllUser Data
exports.getAllUserDetails = async(req,res)=>{
    try{
       //getId
       const id = req.user.id
       // valiadte and getUerdetails
       const userDetails = await user.findById(id).populate().exec();
       //return response
       return res.status(200).json({
        success:true,
        message:"Data fetch successfully",
        userDetails
       })
    }catch(error){
      return res.status(400).json({
        success:false,
        message:error.message,
      })
    }
}