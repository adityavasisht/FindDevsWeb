const express = require('express');
const app = express();
const { connectDB} = require("./config/database");
const User = require('./models/user.js')
const jwt = require('jsonwebtoken');
const {authuser} = require("./middlewares/auth.js")
const cookieparser = require('cookie-parser');



const bcrypt = require('bcrypt');



app.use(express.json());
app.use(cookieparser());


app.get("/userInfo", async(req,res)=>{
    const email = req.body.emailId;
    const user = await User.find ({ email});
    res.send(user);

})

app.post("/login", async (req, res) => {
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


app.post("/signup",async(req,res)=>{
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
app.patch("/update", async(req,res)=>{
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
app.get("/profile", authuser,(req,res)=>{
    try {
        const user = req.user;
        res.send(user);

        
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
