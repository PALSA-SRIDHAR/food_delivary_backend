const Product=require("../models/Product")
const Firm=require("../models/Firm");
const multer=require("multer");

const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
      cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    },
});
const upload=multer({storage: storage});

const addProduct=async(req,res)=>{
    try{
        const {productName,price,category,bestSeller,description}=req.body;
        const image=req.file?req.file.filename:undefined;

        const firmId=req.params.firmId;
        const firm= await Firm.findById(firmId);

        if(!firm){
            return res.status(404).json({error:"No firm exist"});
        }

        const product=new Product({
            productName,price,category,bestSeller,description,image,firm:firm._id
        })

        const savedProduct=await product.save();
        firm.product.push(savedProduct);
        await firm.save();

        res.status(200).json(savedProduct);

    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Internal server error"});
    }
}

const getProductByFirm=async(req,res)=>{
    try{
        const firmId=req.params.firmId;
        const firm=await Firm.findById(firmId);
        const firmName=firm.firmName;

        if(!firm){
            return res.status(404).json({error:"no firm found"});
        }

        const products=await Product.find({firm:firmId});
        res.status(200).json(firmName,products);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Internal server error"})
    }
}

const deleteProductById=async(req,res)=>{
    try{
        const productId=req.params.productId;
        const deletedProduct=await Product.findByIdAndDelete(productId);
        if(!deletedProduct){
            res.status(404).json({error:"No product found..!"})
        }
        res.status(200).json({message:"product deleted successfully..!"})
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Internal server error"})
    }
}

module.exports={addProduct:[upload.single('image'),addProduct],getProductByFirm,deleteProductById}