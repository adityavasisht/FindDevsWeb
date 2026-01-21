const mongoose = require('mongoose');
const connectionRequestModel =  new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,

    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId
    },
    status:{
        type: String,
        enum: {
            values: ["ignore", "accepted","interested","rejected"],
            message: "status is not valid "
        }
    }

},{
    timestamps: true,
});

const connectionReq = new mongoose.model('connectionRequest', connectionRequestModel);

module.exports= connectionReq;