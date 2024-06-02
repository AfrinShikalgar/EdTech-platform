const SubSection = require("../models/SubSection")
const Section = require("../models/Section")

//create SubSection
exports.createSubSection = async(req,res) =>{
   try{ //fetch data
    const{sectionId,title,timeDuration,description} = req.body;

    //extract video
    const video = req.file.videoFile;

    //validation
    if(!sectionId || !title || !timeDuration || !video || !description){
       return res.status(400).json({
        success:false,
        message:"All fields are required"
       })
    }

    //upload video to cloudinary
    const uploadDetails = await uploadImageToCloudinary(video,process.env.FOLDER_NAME)

    //create subsection
    const subSectionDetails = await SubSection.create({
        title:title,
        timeDuration:timeDuration,
        description:description,
        videoUrl:uploadDetails.secure_url,
    })

    //update section with subsection object
    const updatedSection = await Section.findByIdAndUpdate({_id:sectionId},
                     {
                        $push:{
                             subSection:SubSectionDetails._id
                        }
                     },{new:true}
    )
    //Hw- log updatde section here, after adding populate query
    //send response
    return res.status(200).json({
        success:true,
        message:"Dtaa update successfully",
        updatedSection
    })}catch(error){

    }


}


//update subsection
exports.updateSubSection = async(req,res)=>{
    try{
   const {title,timeDuration,description,videoUrl} = req.body;

   //validate
   if(!title || !timeDuration || !description || !videoUrl){
     return res.status(400).json({
        success:false,
        message:"Fill all fields"
     })
   }

   //


    }catch(error){

    }
}


//delete subsection