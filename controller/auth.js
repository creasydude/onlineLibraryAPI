import ErrorResponse from '../utils/ErrorResponse.js';
import SuccessResponse from '../utils/SuccessResponse.js';
import refreshTokenCookie from '../utils/refreshTokenCookie.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const otpAuth = async (req, res, next) => {
    try {
        const { nationalID, phoneNumber } = req.body;
        if (!nationalID || !phoneNumber) return next(new ErrorResponse('Missing nationalID or phoneNumber', 400));
        const otp = Math.floor(Math.random() * (9999 - 1000) + 1000);
        const otpExpire = new Date(Date.now() + (5 * 60 * 1000)) // 5 minutes
        const nowDate = new Date().toISOString();
        const user = await User.findOne({
            $or: [
                { nationalID },
                { phoneNumber }
            ]
        });
        if (user && user.phoneNumber != phoneNumber) return next(new ErrorResponse('nationalID exist but phoneNumber not match', 400));
        if (user && ((new Date(user.otpExpire) - new Date(nowDate)) / 60e3) > 0) return next(new ErrorResponse('OTP is already sent', 400));
        if (!user) {
            await User.create({
                nationalID,
                phoneNumber,
                otp,
                otpExpire
            });
            SuccessResponse(res, 201, { message: 'User Created & OTP Sent' });
        } else if (user) {
            await user.updateOne({
                otp,
                otpExpire
            })
            SuccessResponse(res, 201, { message: 'OTP Sent' });
        }
        //OTP Phone Logic
        console.log(otp);
    } catch (err) {
        next(err);
    }
}

export const otpAuthValidate = async (req, res, next) => {
    const { otp, phoneNumber } = req.body;
    const nowDate = new Date().toISOString();
    if (!otp || !phoneNumber) return next(new ErrorResponse('Missing otp or phoneNumber', 400));
    try {
        const user = await User.findOne({ phoneNumber });
        if (!user) return next(new ErrorResponse('User not found', 404));
        if (user.otp !== otp) return next(new ErrorResponse('Wrong OTP', 400));
        if (new Date(user.otpExpire) < new Date(nowDate)) return next(new ErrorResponse('OTP expired', 400));
        const { accesstoken, refreshToken } = user.createToken();
        refreshTokenCookie(res, refreshToken);
        SuccessResponse(res, 200, { message: 'OTP Validated', accesstoken });
    } catch (err) {
        next(err);
    }
};

export const refreshToken = async (req, res, next) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return next(new ErrorResponse('Missing refreshToken', 400));
    try {
        const { _id } = jwt.verify(refreshToken, process.env.RT_JWT_SECRET);
        const user = await User.findById(_id);
        if (!user) return next(new ErrorResponse('User not found', 404));
        const { accesstoken } = user.createToken();
        SuccessResponse(res, 200, { message: 'Refresh Token Validated', accesstoken });
    } catch (err) {
        next(err);
    }
};

export const logout = async (req, res, next) => {
    try {
        if (!req.cookies.refreshToken) return next(new ErrorResponse('Missing refreshToken', 400));
        res.clearCookie('refreshToken');
        SuccessResponse(res, 200, { message: 'Logged Out' });
    } catch (err) {
        next(err);
    }
};

export const editInfo = async (req, res, next) => {
    try {
        const { phoneNumber } = req.body;
        if (!phoneNumber) return next(new ErrorResponse('Missing phoneNumber', 400));
        const user = await User.findById(req.user._id);
        if (!user) return next(new ErrorResponse('User not found', 404));
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (req.cookies.refreshToken) res.clearCookie('refreshToken');
        await user.save();
        SuccessResponse(res, 200, { message: 'User Updated' });
    } catch (err) {
        next(err);
    }
};