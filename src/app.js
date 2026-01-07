const express = require('express');
const app = express();
const {authAdmin,authUser} = require("../middlewares/auth")

app.get("/user/getData",authUser,(req,res)=>{
    
    res.send("user found");
    
    

})
app.get("/admin/getData",authAdmin, (req,res)=>{
    
    res.send("admin data sent");
})

app.listen(3000,()=>{
    console.log("server running on the port 3000...");
})