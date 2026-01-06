const express = require('express');
const app = express();

app.use("/hello",(req,res,next)=>{
    next();
    res.send("hello world");
    
},(req,res)=>{
    res.send("2nd response");
    next();
},
(req,res)=>{
    res.send("3rd response");
}
);

app.listen(3000,()=>{
    console.log("server running on the port 3000...");
})