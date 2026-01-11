const { error } = require('console');
const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    firstname:{
        type: String,
        required: true,
        maxlength: 50,
        minlength: 3
        
    },
    lastname:{
        type: String,
        required: true,
        maxlength: 50,
        minlength: 3
    },
    age:{
        type: Number,
        required: true,
        min:18,
        max: 60 
    },
    emailId:{
        type: String,
        required: true,
        lowercase: true,
    },
    password:{
        type: String,
        required: true,
    },
    gender:{
        type: String,
        required: true,
        lowercase: true,
        validate: {
            validator: (value)=>{
                return ["male", "female", "others"].includes(value);
                },
                message: "gender must be male, female or others"
            }
        },
    photoUrl:{
        type: String,
        default: "https://www.cornwallbusinessawards.co.uk/2018-judging-panel/dummy450x450/"
    },
    about:{
        type: String,
        default: "This is the default about of the user!",
    },
    bio:{
        type: String,
        required: true,
        
    },
    skills:{
        type: [String],
        required: true
    }                    
    },
    {
        timestamps: true
    }
      );

const userModel = mongoose.model('userModel', UserSchema);

module.exports = userModel;
