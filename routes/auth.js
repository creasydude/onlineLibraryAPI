import express from 'express';
import { userAuth } from '../middleware/userAuth.js';
import { otpAuth, refreshToken, editInfo, logout, otpAuthValidate } from '../controller/auth.js';
const Router = express.Router();

//Ham OTP Ham Register!

Router.post('/otpAuth', otpAuth);
Router.post('/otpValidate', otpAuthValidate);
Router.get('/refreshToken', refreshToken);
Router.patch('/editInfo', userAuth, editInfo);
Router.delete('/logout', logout);

export default Router;