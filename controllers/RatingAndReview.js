const RatingAndReview = require("../models/RatingAndReview")
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");

//create rating and review
exports.createRating = async(req,res) =>{
    try{
        //fetch user id
        const{userId} = req.user.id;
        //fetch data from body
        const {rating, review, courseId} = req.body;

        //check is user is enrolled or not
        const courseDetails = await Course.findOne({_id:courseId},{
            studentEnrolled:{$eleMatch: {$eq: userId}}
        })

        if(!courseDetails){
            return res.status(400).json({
                success:false,
                message:"user not enrolled"
            })
        }

        //check if user already reviewd course
        const alreadyReviewed = await RatingAndReview.findOne({user:userId,
            course:courseId,
        })

        if(alreadyReviewed){
            return res.status(403).json({
                success:false,
                message:"user already reviewd"
            })
        }

        //create rating and review
        const ratingReview = await RatingAndReview.create({
            user:userId,rating,review,course:courseId
        })


        //update course with this rating
        await Course.findByIdAndUpdate({_id:courseId},{
            $push:{
              ratingAndReviews:ratingReview._id,
            }
        },{new:true})

        //return response
        return res.status(200).json({
            success:true,
            message:"rating n review created successfully"
        })


    }catch(error){
        return res.status(403).json({
            success:false,
            message:error.message
        })

    }
}


//getAvgRating
exports.getAverageRating = async(req,res)=>{
    try{
        //get courseId
        const courseId = req.body.courseId;

        //calculate avg rating
        const result = await RatingAndReview.aggregate([{$match:{
            course:new mongoose.Types.ObjectId(courseId),
        }},{
            $group:{
                _id:null,
                averageRating:{$avg :"$rating"}
            }
        }])

        if(result.length > 0){
            return res.status(200).json({
                success:true,
                averageRating:result[0].averageRating,
            })
        }
        //if no rating exist
        return res.status(200).json({
            success:true,
           message:"no rating till now",
           averageRating:0,
        })
    


    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
    }




    //getAll rating and reviews
    exports.getAllRating = async(req,res)=>{
        try{
           const allReviews = await RatingAndReview.find({},).sort({rating:"desc"})
           .populate({
            path :"user",
            select:"firstName lastName email image"
           })
           .populate({
            path:"course",
            select:"courseName"
           })
           .exec();

        
           return res.status(200).json({
            success:true,
           message:"fetched scuuessful",
        })
       
        }catch(error){
            return res.status(500).json({
                success:false,
                message:error.message,
            })
        }
        }
    
