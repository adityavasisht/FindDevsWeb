const express = require('express');
const profileRouter = express.Router();
const {authuser} = require("../middlewares/auth.js")
const User = require('../models/user.js')


profileRouter.get("/profile", authuser,(req,res)=>{
    try {
        const user = req.user;
        res.send(user);

        
    } catch (error) {
        res.send(error);
    }

});


profileRouter.patch("/update", async(req,res)=>{
    try {

        const ALLOWED_UPDATES = [
            "photoUrl","bio","about","skills","gender","password"
        ]
        const {emailId,...data} = req.body;
        if(!emailId){
            res.status(400).send("You need to give your emailId.");
        }
        const updates = {};

        for(const key of ALLOWED_UPDATES){
            if(data[key]!== undefined){
                updates[key] = data[key];
            }
        }

        
        await User.findOneAndUpdate({emailId},{$set: updates});
        console.log(updates);
        res.send("user's emailId updated successfully");
        
    } catch (error) {
        res.send(error);
        
    }
});

profileRouter.get("/userInfo", async(req,res)=>{
    const email = req.body.emailId;
    const user = await User.find ({ email});
    res.send(user);

});

module.exports = profileRouter;