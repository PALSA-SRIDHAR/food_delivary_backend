const Firm=require("../models/Firm");
const Vendor=require("../models/Vendor");
const multer=require("multer");


const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
      cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    },
});
const upload=multer({storage: storage});

const addFirm=async(req,res)=>{
    try{
        const {firmName,area,category,region,offer}=req.body;

        const image=req.file?req.file.filename:undefined;
    
        const vendor=await Vendor.findById(req.vendorId);
    
        if(!vendor){
            return res.status(404).json({message:"vendor not founf"})
        }
        const firm=new Firm({
            firmName,area,category,region,offer,image,vendor:vendor._id
        })
    
        const savedFirm=await firm.save();
        vendor.firm.push(savedFirm);
        await vendor.save();
        
        return res.status(200).json({success:"firm added successfully..!"});
    }
    catch(err){
        console.error(err);
        return res.status(404).json({message:"internal server error"});
    }
}
const deleteFirmById=async(req,res)=>{
    try{
        const firmId=req.params.productId;
        const deletedFirm=await Firm.findByIdAndDelete(firmId);
        if(!deletedFirm){
            res.status(404).json({error:"No firm found..!"})
        }
        res.status(200).json({message:"firm deleted successfully..!"})
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Internal server error"})
    }
}

module.exports={addFirm:[upload.single('image'),addFirm],deleteFirmById}