const express = require('express');
const app = express();
const {authAdmin,authUser} = require("./middlewares/auth")
const { connectDB} = require("./config/database");
const User = require('./models/user.js')



app.use(express.json());

app.get("/userInfo", async(req,res)=>{
    const email = req.body.emailId;
    const user = await User.find ({emailId : email});
    res.send(user);

})
app.post("/signup",async(req,res)=>{
    

    try {
        const user = new User(req.body);

    // console.log(user);
        await user.save(user);
    res.send("user created successfully");
        
    } catch (error) {
        res.send(error);
        
    }
});
app.patch("/updateEmailId", async(req,res)=>{
    try {
        const emailId = req.body.emailId;
        const newEmailId = req.body.newEmailId;
        await User.findOneAndUpdate({emailId}, {emailId: newEmailId});
        res.send("user's emailId updated successfully");
        
    } catch (error) {
        res.send(error);
        
    }
});

connectDB().then(()=>{
    app.listen(3000,()=>{
    console.log("server running on the port 3000...");
})
    console.log("connected to cluster");
})
