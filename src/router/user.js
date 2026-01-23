const express = require('express');
const { authuser } = require('../middlewares/auth');
const connectionReq = require('../models/connectionreq');
const userRouter = express.Router();

const SAFE_DATA = "firstname lastname gender photoUrl about bio skills";

userRouter.get("/user/requests/recieved",authuser, async(req,res)=>{
    try {
        const loggedinUser = req.user;

        const connectionRequests = await connectionReq.find({
            toUserId: loggedinUser._id,
            status: "interested",
        }).populate("fromUserId", SAFE_DATA);
        res.send(connectionRequests);


        
    } catch (error) {
        res.status(400).send(error);
    }

});
userRouter.get("/user/connections", authuser, async(req,res)=>{
    try {
        const loggedinUser = req.user;
        const connectionRequests = await connectionReq.find({
            $or:[
                {fromUserId : loggedinUser._id, status: "accepted"},
                {toUserId: loggedinUser._id, status: "accepted"},
            ]
        }).populate("fromUserId", SAFE_DATA).populate("toUserId", SAFE_DATA);
        const data = connectionRequests.map((row)=>{
            if(fromUserId._id.toString() === loggedinUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId});
        res.send(data);
        
    } catch (error) {
        res.status(400).send(error);
    }
})

module.exports = {

    userRouter
}