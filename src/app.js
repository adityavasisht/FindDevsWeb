const express = require('express');
const app = express();
const {authAdmin,authUser} = require("./middlewares/auth")
const { connectDB} = require("./config/database");
const userisntance = require('./models/user.js')

app.post("/signup",async(req,res)=>{
    const user = new userisntance({
        firstname: "Aditya",
        lastname: "Vasisht",
        age: "22",
        emailId: "aditya@gmai;.com",
        password:"1234",
        gender: "male"
    })
    try {
        await user.save();
    res.send("user created successfully");
        
    } catch (error) {
        res.send(error);
        
    }
})

connectDB().then(()=>{
    app.listen(3000,()=>{
    console.log("server running on the port 3000...");
})
    console.log("connected to cluster");
})
