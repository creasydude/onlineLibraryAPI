import mongoose from 'mongoose';

const connectDB = async () => {
    const dbUri = process.env.DB_URI;
    await mongoose.connect(dbUri);
    console.log("Db Connected!");
};

export default connectDB;