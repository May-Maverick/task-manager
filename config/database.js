import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Successful databse connection");
    } catch(error) {
        console.log("Databse connection failed: ", error.message);
    }

}

export default connectDB;
       