import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import authRouter from './router/auth.js';
import profileRouter from './router/userProfile.js';
import jobRouter from './router/jobRoutes.js';

const PORT = process.env.PORT || 9065;
const app = express();



app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",jobRouter);
app.get("/",(req,res)=>{
    res.send("api running")
})

app.listen(PORT, async()=>{
    await connectDB();
    console.log(`Server is running on port ${PORT}`)
})