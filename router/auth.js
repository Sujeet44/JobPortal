import  express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();



const authRouter = express.Router();

authRouter.post("/register",async (req,res)=>{
    console.log("register",req.body)
    try {
        const {name,email,password,phoneNo} = req.body;
        
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({message:"User already exists"});
        }

        const hashPasswrod = await bcrypt.hash(password,10);
        const user = await User.create({
            name,email,password:hashPasswrod,phoneNo
        });

        res.status(201).json({message:"User registered successfully"});
    } catch (error) {
        res.status(500).json({message:"Server error"})
    }
});


authRouter.post("/login",async(req,res)=>{
    console.log("login",req.body)
    try {
        const {email,password} = req.body;
        const user  = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid credentails"});
        }

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentails"});
        }

        const token = jwt.sign(
            {id: user._id,role: user.role},
            process.env.JWT_SECRET,
            {expiresIn:"7d"}
        )

        user.activeToken = token;
        await user.save();

        res.status(200).json({token,user:{id:user._id,name:user.name,email:user.email,role:user.role}})
    } catch (error) {
        res.status(500).json({message:"Server error",errorReason:error.message})
    }
})


// SEND OTP

authRouter.post("/send-otp", async (req, res) => {
    console.log(process.env.mailID,process.env.mailPass)
    console.log(req.body)
  try {
    const { userId, method } = req.body;

    const user = await User.findById(userId);
    const phoneNumber = "+91" + user.phoneNo
    if (!user) return res.status(404).json({ msg: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000);

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();

    // 📧 EMAIL
    if (method === "email") {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.mailID,
          pass: process.env.mailPass,
        },
      });

      await transporter.sendMail({
        from: process.env.mailID,
        to: user.email,
        subject: "Your OTP Code",
        text: `Your OTP is ${otp}`,
      });

      console.log("Email OTP:", otp);
    }

    // 📱 PHONE (Twilio)
    if (method === "phone") {
      const client = twilio(
        process.env.TWILIO_SID,
        process.env.TWILIO_AUTH_TOKEN
      );

      await client.messages.create({
        body: `Your OTP is ${otp}`,
        from: process.env.TWILIO_PHONE,
        to: phoneNumber, // must be +91 format
      });

      console.log("SMS OTP:", otp);
    }

    res.json({ msg: "OTP sent successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error sending OTP" });
  }
});



authRouter.post("/verify-otp", async (req, res) => {
  try {
    const { userId, otp } = req.body;

    // 1. Check user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // 2. Check OTP exists
    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({ msg: "No OTP found. Please request again." });
    }

    // 3. Check OTP expiry
    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ msg: "OTP expired" });
    }

    // 4. Check OTP match (basic version)
    if (user.otp !== Number(otp)) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    // ✅ OPTIONAL (ADVANCED - if you hashed OTP)
    /*
    const isMatch = await bcrypt.compare(otp.toString(), user.otp);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }
    */

    // 5. Generate JWT token
    // const token = jwt.sign(
    //   {
    //     id: user._id,
    //     role: user.role
    //   },
    //   process.env.JWT_SECRET || "secretkey",
    //   { expiresIn: "1d" }
    // );

    // 6. Clear OTP after success
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    // 7. Send response
    res.json({
      msg: "Login successful 🎉",

    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default authRouter;