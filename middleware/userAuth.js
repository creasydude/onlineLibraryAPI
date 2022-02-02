import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ErrorResponse from '../utils/ErrorResponse.js';
export const userAuth = (req, res, next) => {
    try {
        const accessToken = req.get('Authorization');
        if (!accessToken) return next(new ErrorResponse('Access Token is missing', 401));
        const decoded = jwt.verify(accessToken, process.env.AT_JWT_SECRET);
        req.user = decoded;
        console.log(req.user)
        next();
    } catch (err) {
        next(new ErrorResponse('Invalid Access Token', 401));
    }
};

export const adminAuth = async (req, res, next) => {
    try {
        const accessToken = req.get('Authorization');
        if (!accessToken) return next(new ErrorResponse('Access Token is missing', 401));
        const decoded = jwt.verify(accessToken, process.env.AT_JWT_SECRET);
        const admin = await User.findById(decoded._id);
        if (!admin) return next(new ErrorResponse('Invalid Access Token', 401));
        if (!admin.isAdmin) return next(new ErrorResponse('You are not an admin', 401));
        req.user = decoded;
        next();
    } catch (err) {
        next(new ErrorResponse('Invalid Access Token', 401));
    }
};