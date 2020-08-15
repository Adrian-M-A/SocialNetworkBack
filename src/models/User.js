import mongoose from 'mongoose';
import validator from 'validator';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surnames: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    profession: {
        type: String,
        required: true
    },
    hobbies: {
        type: [String]
    },
    socialGroup:{
        type: [String]
    },
    city:{
        type: String,
        required: true
    },
    country:{
        type: String,
        required: true
    },
    friends:{
        type: [Object]
    },
    pendingFriends:{
        type: [Object]
    },
    imagesPath:{
        type: [String]
    },
    email: {
        type: String,
        unique: [true, "The email is in use."],
        required: [true, "Email required."],
        validate: {
            validator: function(email) {
                return validator.isEmail(email)
            },
            message: props => `${props.value} is not a valid Email!`
        },
    },
    password: {
        type: String,
        required: [true, "Password required."],
        minlength: 8
    },  
    token: [String]  
},{
    timestamps: true
});

UserSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    delete user.token;
    return user;
}

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;