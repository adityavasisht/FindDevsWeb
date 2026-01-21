const express = require('express');
const {authuser} = require("../middlewares/auth.js");
const reqRouter = express.Router();
const connectionReq = require("../models/connectionreq.js");

reqRouter.post("/request/send/:status/:toUserId",authuser, async(req,res)=>{
    try {

        
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;
    const ALLOWED_STATUS = ["interested","ignore"];
    if(!ALLOWED_STATUS.includes(status)){
        return res.status(400).send("status is not valid");
    }
    const checkReqValidity = await connectionReq.findOne({
        $or:[
            {fromUserId,toUserId},
            {fromUserId:toUserId, toUserId:fromUserId},
        ],
    });
    if(checkReqValidity){
        return res.status(400).send("You can't re send them request/ They have already sent u a req");
    }

    const connectionRequest = new connectionReq({
        fromUserId,
        toUserId,
        status
    });
    const reqData  = await connectionRequest.save();
    res.json({
        message: "connection request sent",
        reqData,
    });
        
    } catch (error) {
        res.send(error);
        
    }

});

module.exports = reqRouter;