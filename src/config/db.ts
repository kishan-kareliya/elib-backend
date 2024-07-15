import mongoose from "mongoose";
import { config } from "./config";

const connectDB = async () => {

    try{
        mongoose.connection.on('connected', () => {
            console.log("database connected successfully!");
        })
    
        mongoose.connection.on('error', (err) => {
            console.log("Failed to connect to the database", err);
        })
        
        await mongoose.connect(config.databaseUrl as string);
    }
    catch(err){
        console.error("Failed to connect to the database", err);
        process.exit(1);
    }
}

export default connectDB;