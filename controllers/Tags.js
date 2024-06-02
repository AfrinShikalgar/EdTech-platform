const Tag = require("../models/Tags");
const User = require("../models/User");

//creating handler fun for Tags

exports.createTag = async(req,res) =>{
    try{
        //fetch data
        const{name, description} = req.body;

        //validation
        if(!name || !description){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        //create entry in DB
        const tagDetails = await tag.createTag({
            name:name,
            description:description,
        })
        console.log(tagDetails);

        //return response
        return res.status(200).json({
            success:true,
            message:"Entry created successfully"
        })

    }catch(error){
        return res.status(400).json({
            success:false,
            message:error.message
        })
    }
}


//getALLtags handler function

exports.showAlltags = async(req,res) =>{
    try{
        const allTags = await Tag.find({},{name:true, description:true});

        res.status(200).json({
            success:true,
            message:"All data return successfully",
            allTags
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}