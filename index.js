const express=require("express")
const dotEnv=require("dotenv")
const mongoose=require("mongoose")
const vendorRoutes=require("./routes/vendorRoutes")
const bodyParser=require("body-parser")
const firmRoutes=require("./routes/FirmRoutes")
const productRoutes=require('./routes/ProductRoutes')
const cors=require("cors")
const app=require("path")

const app=express();
const PORT=4000;

dotEnv.config()
app.use(cors())

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("Mongodb connected successfully..!"))
.catch((err)=>console.log(err))

app.use(bodyParser.json())
app.use('/vendor',vendorRoutes);
app.use('/firm',firmRoutes);
app.use('/product',productRoutes)
app.use('/uploads',express.static('uploads'))

app.listen(PORT,()=>{
    console.log(`Server Started at ${PORT}`)
})

app.use('/home',(req,res)=>{
    res.send("welcome to india")
})                                 