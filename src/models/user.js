const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    firstname:{
        type: String
    },
    lastname:{
        type: String
    },
    age:{
        type: Number
    },
    emailId:{
        type: String
    },
    password:{
        type: String
    },
    gender:{
        type: String
    }
});

const userModel = mongoose.model('userModel', UserSchema);

module.exports = userModel;
