import  express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const authRouter = express.Router();

authRouter.post("/register",async (req,res)=>{
    try {
        const {name,email,password} = req.body;
        
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({message:"User already exists"});
        }

        const hashPasswrod = await bcrypt.hash(password,10);
        const user = await User.create({
            name,email,password:hashPasswrod
        });

        res.status(201).json({message:"User registered successfully"});
    } catch (error) {
        res.status(500).json({message:"Server error"})
    }
});


authRouter.post("/login",async(req,res)=>{
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

        res.status(200).json({token,user:{id:user._id,name:user.name,email:user.email,role:user.role}})
    } catch (error) {
        res.status(500).json({message:"Server error",errorReason:error.message})
    }
})

export default authRouter;