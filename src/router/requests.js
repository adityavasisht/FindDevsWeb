const express = require('express');

const reqRouter = express.Router();

reqRouter.post("/sendConnectionReq", async(req,res)=>{
    const user = req.user;


    res.send(user.firstname + " sent a request");
});

module.exports = reqRouter;