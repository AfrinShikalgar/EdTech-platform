const {instance} =  require("../config/razorpay")
const Course = require("../models/Course")
const User = require("../models/User")
const mailSender = require("../utils/mailSender")
const {courseEnrollmentEmail} = require("../")
const  mongoose = require("mongoose")


//capture the payment and initiate the razorpay order
exports.capturePayment = async(req,res) =>{
    //get CourseId and Userzid
    const {course_id} = req.body;
    const user_id = req.user.id;

    //validate
    if(!course_id){
        return res.status(400).json({
            success:false,
            message:"Please provide valid course ID"
        })
    }

    //valid courseDetail
    let course;
    try{
     course = await Course.findById(course_id);
     if(!course){
        return res.json({
            success:false,
            messsage:"Could not find course"
        })
     }

     //useralready pay for same course
     const uid = new mongoose.Types.ObjectId(user_id);
     if(course.studentEnrolled.includes(uid)){
        return res.status(400).json({
            success:false,
            messsage:"Already enrolled to course"
        })
     }
    }catch(error){
      console.error(error);
      return res.status(400).json({
          success:false,
          message:error.message,
      })
    }



    //order create
    const amount = course.price;
    const currency = "INR";

    const options = {
        amount : amount * 100,
        currency,
        receipt:Math.random(date.now()).toString(),
        notes:{
            courseId : course_id,
            userId,
        }
    }

    try{
        //initiate payment using razorpay
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);

        return res.status(200).json({
            success:true,
            courseName:course.courseName,
            courseDescription:course.courseDescription,
            thumbnail:course.thumbnail,
            orderId:paymentResponse.id,
            currency:paymentResponse.currency,
            amount:paymentResponse.amount
        })

    }catch(error){
       console.log(error);
       return res.status(400).json({
        message:false,
        message:"Could not initiate order"
       })
    }
}



//verify signature of Razorpay
exports.verifySignature = async(req,res) =>{
   try{ const webhookSecret = 12345678;
    const signature = req.headers("x-razorpay-signature");

    const shasum = crypto.createHmac("sha256",webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");
 
    if(signature === digest){
        console.log("Payment is Authorized")

        const enrolledCourse = await Course.findOneAndUpdate({_id:courseId},
            {$push:{studentEnrolled:userId}},
        {new:true}
        );}
    
        if(!enrolledCourse){
            return res.status(500).json({
                success:false,
                message:"Course not found"
            })
        }
        console.log(enrolledCourse);


        //find student and add to course to theire enrolled courses

        const enrolledStudent= await User.findOneAndUpdate({_id:userId},
            {$push:{course:courseId}},{new:true}
        )

        console.log(enrolledCourse);

        //mail send kro confirmation ka
        const emailResponse = await mailSender(enrolledStudent.email,
            "Congats yo are onboard new course","hruhr"
        )

        return res.status(200).json({
            success:true,
            message:"Signature verified and course added"
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }

}