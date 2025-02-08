const Vendor=require("../models/Vendor");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcryptjs");
const dotEnv=require("dotenv");

dotEnv.config();

const secreteKey=process.env.NAME

 
const vendorRegister=async(req,res)=>{
    const {username,email,password}=req.body;
    try{
        const vendorEmail=await Vendor.find({email}); 
        if(vendorEmail!=""){
            return res.status(400).json("Email already exist");
        }
        const hashedPassword=await bcrypt.hash(password,10);

        const newVendor=new Vendor({
            username,
            email,
            password:hashedPassword
        });

        await newVendor.save();

        res.status(201).json({message:"vendor registered successfully"})
        console.log("Registered successfully..!");
    }
    catch(err){
        console.log(err)
        res.status(500).json({message:"Internal server error"});
    }
}

const vendorLogin=async(req,res)=>{
    const {email,password}=req.body;
    try{
        const vendor=await Vendor.findOne({email});
        if(!vendor || !(await bcrypt.compare(password,vendor.password))){
            return res.status(401).json({message:"Invalid Credentials..!"});
        }

        const token=jwt.sign({vendorId:vendor._id},secreteKey,{expiresIn:"1h"})
        res.status(200).json({success:"Login Successful..!",token});
        console.log(token);

    }
    catch(err){
        res.status(400).json({message:"Internal server error"});
    }
}   
const getAllVendors=async(req,res)=>{
    try{
        const vendors=await Vendor.find().populate('firm');
        res.json({vendors});
    }
    catch(err){
        res.status(400).json({message: "Internal server Error"});
    }
}  

const getVendorById=async(req,res)=>{
    const vendorId=req.params.id;

    try{
        const vendor=await Vendor.findById(vendorId);
        if(!vendor){
            return res.status(404).json({error:"vendor not found..!"})
        }
        res.status(200).json({vendor});
    }
    catch(err){
        console.log("internal error")
        res.status(500).json({error:"Internal server error"})
    }
}


module.exports={vendorRegister,vendorLogin,getAllVendors,getVendorById} 