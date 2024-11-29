import mongoose from "mongoose";

let isConnected: boolean = false;

export const connect2DB = async(): Promise<void> => {
    mongoose.set("strictQuery", true)

    if (isConnected) {
        console.log("MongoDB already connected");
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URL || "", {dbName: "Borcella_Admin"})
        isConnected = true;
        console.log("MongoDB is now connected")
        
    } catch (error) {
        console.log(error)
    }
}