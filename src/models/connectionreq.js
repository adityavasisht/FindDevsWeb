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
            message: `{VALUE} is not a valid staut type.`,
        },
    }

},{
    timestamps: true,
});

const connectionReq = new mongoose.model('connectionRequest', connectionRequestModel);

module.exports= connectionReq;