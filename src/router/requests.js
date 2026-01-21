const express = require('express');
const {authuser} = require("../middlewares/auth.js");
const reqRouter = express.Router();
const connectionReq = require("../models/connectionreq.js");

reqRouter.post("/request/send/interested/:toUserId",authuser, async(req,res)=>{
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.toUserId;

    const connectionRequest = new connectionReq({
        fromUserId,
        toUserId,
        status
    })

});

module.exports = reqRouter;