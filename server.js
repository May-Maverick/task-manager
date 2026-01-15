
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import app from "./app.js";


dotenv.config();

const startServer = async () => {
    try {
        await connectDB();
        const port = process.env.PORT || 8000;
        app.listen(port, () => {
            console.log(`Server listening on port: ${port}`);
        });
    } catch(error){
        console.log("Server failed to start: ", error.message);
        process.exit(1);
    }
}

startServer();