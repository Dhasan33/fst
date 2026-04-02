const express = require('express');
const mongoose = require('mongoose');
const multer=require('multer');
const app=express();
app.use('/uploads',express.static('uploads'));
app.use(express.json());
const storage=multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'uploads/');
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+'-'+file.originalname);
    }
});
const upload = multer({storage});

mongoose.connect('mongodb://localhost/productdb')
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));
const Product=new mongoose.model('Product',{
    name:String,
    price:Number,
     stock: Number,
     image: String
});
app.post('/products',upload.single('image'),async(req,res)=>{
    const product=new Product({...req.body,image:req.file.filename});
    await product.save();
    res.json({message:"Product created"});
});
app.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      price: req.body.price,
      stock: req.body.stock
    };

    // If new image uploaded
    if (req.file) {
      updateData.image = req.file.filename;
    }

    await Product.findByIdAndUpdate(req.params.id, updateData);

    res.send("Product Updated");
  } catch (err) {
    res.status(500).send("Update failed");
  }
});
app.get('/products',async(req,res)=>{
    const products=await Product.find();
    res.json(products);
});
app.delete('/:id', async (req, res) => {
   try {
    await Product.findByIdAndDelete(req.params.id);
    res.send("Product Deleted");
  } catch (err) {
    res.status(500).send("Error deleting product");
  }
});
app.listen(3002, () => console.log("Product service running"));