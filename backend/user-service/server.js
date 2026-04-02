const express = require('express');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app=express();
app.use(express.json());
dotenv.config();
mongoose.connect('mongodb://localhost/userdb')
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));
const User=new mongoose.model('User',{
    email:String,
    password:String
});
app.post('/register', async (req, res) => {
  try {
    console.log(req.body); // DEBUG

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Missing fields");
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({ email, password: hashed });

    await user.save();

    res.send("User registered");

  } catch (err) {
    console.error(err); // 👈 THIS WILL SHOW REAL ERROR
    res.status(500).send("Server error");
  }
});
app.post('/login',async(req,res)=>{
    const user=await User.findOne({email:req.body.email});
    if(!user) return res.status(404).json({message:"User not found"});
    const valid=await bcrypt.compare(req.body.password,user.password);
    if(!valid) return res.status(401).json({message:"Invalid password"});
    const jwtToken=jwt.sign({_id:user._id},"secret");
    res.json({jwtToken});
  
});
app.listen(3005,()=>console.log("User Service running on 3005"));