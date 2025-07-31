import mongoose from "mongoose";

export async function connectDB(){
    try {
        await mongoose.connect(process.env.MONGODB_URI as string) ;
        console.log("MongoDB connected successfully") ;  
    } catch (error) {
        console.log("Error while connecting MongoDB" , error) ; 
    }
}