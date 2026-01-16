const express = require('express');

const authRouter = express.Router();
const User = require('../models/user.js')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



authRouter.post("/signup",async(req,res)=>{
    try {
        const {firstname, lastname, emailId, password} = req.body;
        
            const hashed = await bcrypt.hash(password, 10);
        const user  = new User({
            firstname,
            lastname,
            emailId,
            password: hashed
        });
        
        console.log(user);
        await user.save(user);
        res.send("user created successfully");
        
    } catch (error) {
        res.send(error);
        
    }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ emailId:email });
    if (!user) {
      console.log("USER NOT FOUND");
      return res.status(404).send("user not found");
    }
    
    const passwordCorrect = await bcrypt.compare(
      password,
      user.password
    );


    if (!passwordCorrect) {
      return res.status(401).send("invalid credentials");
    }
    const token = jwt.sign({userId:user._id},'secretkey99');
    res.cookie("token",token);
    res.send("user login successfull");

  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).send("something went wrong");
  }
});

module.exports = authRouter;