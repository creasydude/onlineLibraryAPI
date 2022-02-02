import express from 'express';
import bodyParser from 'body-parser';
import { config as dotenvConfig } from 'dotenv';

import connectDB from './config/connectDB.js';
import errorHandler from './middleware/errorHandler.js';
import authRoute from './routes/auth.js';
import adminRoute from './routes/admin.js';
import cookieParser from 'cookie-parser';


//Deps
const app = express();
app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
dotenvConfig({ path: "./config.env" })
connectDB()

//Routes
app.use('/api/auth/', authRoute);
app.use('/api/admin/', adminRoute);

//404 Route
app.use("*", (_, res) => res.status(404).json({success : false , message : "Page Not Found."}));

//Error Handler
app.use(errorHandler);

//Listen
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT);
process.on("unhandledRejection", (err) => {
    console.log(err);
    server.close(process.exit(1));
})