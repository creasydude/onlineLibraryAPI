import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    isAdmin: {
        type: Boolean,
        default: false
    },
    nationalID: {
        type: String,
        required: true,
        unique: true,
        minlength: 10,
        maxlength: 10
    },
    phoneNumber: {
        type: String,
        required: false,
        unique: true,
        minlength: 10,
        maxlength: 10
    },
    otp: {
        type: String,
        required: false,
        minlength: 4,
        maxlength: 4
    },
    otpExpire: {
        type: Date,
        required: false
    }
});

userSchema.methods.createToken = function () {
    const _id = this._id;
    const accesstoken = jwt.sign({ _id }, process.env.AT_JWT_SECRET, { expiresIn: '30m' });
    const refreshToken = jwt.sign({ _id }, process.env.RT_JWT_SECRET, { expiresIn: '30d' });
    return { accesstoken, refreshToken };
};

const User = mongoose.model('User', userSchema);
export default User;