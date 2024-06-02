const Section = require("../models/Section");
const Course = require("../models/Course")

exports.createSection = async(req,res) =>{
    try{
       //data fetch
       const {SectionName,courseId} = req.body;

       //data validation
       if(!SectionName || !courseId){
        return res.status(400).json({
            success:false,
            message:"Missing properties"
        })
       }

       //section create
       const newSection = await Section.create({sectionName})
       //update course schema
       const updatedCourseDetils = await Course.findByIdAndUpdate(courseId,
                         {
                            $push:{
                                courseContent:newSection._id
                            }
                         },
                         {new:true}
       )
       //HW populate ka kaise use karu jo ki section our subsection dono ko add kr pau
       //return response
       return res.status(200).json({
        success:true,
        message:"Section add successfuly",
        updatedCourseDetils
       })


    }catch(error){
   return res.status(500).json({
    succes:false,
    message:"Unable to craete section"
   })
    }
}



exports.updateSection = async(req,res) =>{
    try{
         //data input
          const {sectionName, sectionId} = req.body;
         //data validation
         if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:"Missing properties"
            })
         }
         //update data
         const section = await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true})

         //return response
         return res.status(200).json({
            success:true,
            message:"Updated successfully"
         })
    }catch(error){
        return res.status(500).json({
            succes:false,
            message:"Unable to craete section"
           })
    }
}


//DeleteSection
exports.deleteSection = async(req,res) =>{
  try{
    //fetch id
     const {sectionId} = req.params;

     //find and delete
     await Section.findByIdAndDelete(sectionId)

      //return response
      return res.status(200).json({
        success:true,
        message:"Deleted successfully"
     })
  }catch(error){
    return res.status(500).json({
        succes:false,
        message:"Unable to craete section"
       })
  }
}