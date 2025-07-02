import User from '../models/user.model.js';
import bcrypt from 'bcryptjs'
import {generateToken} from '../lib/utils.js'
import cloudinary from '../lib/cloudinary.js'

export const signup = async (req,res) => {
    const {fullName, email, password} = req.body
    try{
        if(!fullName || !email || !password){
            return res.status(400).json({message: "Full name, email and password are required"});
        }
        // hash password
        if(password.length < 6){
            return res.status(400).json({message: "Password must be at least 6 characters"});
        }
        const user = await User.findOne({email});
        if(user) return res.status(400).json({message: "Email already exists"});

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        })
        if(newUser){
            // generate jwt token here
            generateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                // profilePic: newUser.profilePic,
                isProfileComplete: newUser.isProfileComplete,
            });
        }else{
            res.status(400).json({message: "Invalid user data"});
        }
    }catch(error){
        console.log("Error in signup controller",error.message);
        res.status(500).json({message: "Internal server error"});
    }
}

export const login = async (req,res) => {
    const {email, password} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "Invalid credentials"})
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        console.log(isPasswordCorrect, password, user.password, "isPasswordCorrect");
        if(!isPasswordCorrect){
            return res.status(400).json({message: "Invalid credentials here"});
        }
        // generate jwt token here
        generateToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
            userName: user.userName,
            bio: user.bio,
            mobile: user.mobile,
            dob: user.dob,
            location: user.location,
            gender: user.gender,
            isProfileComplete: user.isProfileComplete,
        })
    }catch(error){
        console.log("Error in login controller",error.message);
        res.status(500).json({message: "Internal server error"});
    }
}

export const logout = (req,res) => {
    try{
        res.cookie("jwt","",{maxAge: 0});
        res.status(200).json({message: "Logged out successfully"});
    }catch(error){
        console.log("Error in logout controller",error.message);
        res.status(500).json({message: "Internal server error"});
    }
};

export const updateProfile = async (req, res) => {
    const {userName, bio, mobile, dob, location,gender, profilePic} = req.body;
    const userId = req.user._id;
    try{
        if(!profilePic){
            return res.status(400).json({message: "Profile picture is required"});
        }
        if(mobile && !/^\d{10,15}$/.test(mobile)){
            return res.status(400).json({message: "Mobile number must be between 10 digits"})
        }
        if (dob) {
            const dobDate = new Date(dob);
            if (isNaN(dobDate.getTime())) {
                return res.status(400).json({ message: "Invalid date of birth" });
            }
            
            const today = new Date();
            let age = today.getFullYear() - dobDate.getFullYear();
            const monthDiff = today.getMonth() - dobDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
                age--;
            }
            
            if (age < 14) {
                return res.status(400).json({ message: "You must be at least 14 years old" });
            }
        }
        if(!gender){
            return res.status(400).json({message: "Gender is required"});
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updateData = {
            userName,
            bio,
            mobile,
            dob: dob ? new Date(dob) : undefined,
            location,
            gender,
            profilePic: uploadResponse.secure_url,
            isProfileComplete: true, // mark profile as complete
        };
        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
        const updateUser = await User.findByIdAndUpdate(userId, 
            updateData,
            // {profilePic: uploadResponse.secure_url},
            // {new: true}
            { new: true, runValidators: true } 
        ).select('-password');
        if (!updateUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(updateUser);
    }catch{
        console.log("error in update profile", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        if (error.message.includes('File size too large')) {
            return res.status(400).json({ message: "Profile picture size too large" });
        }
        res.status(500).json({message: "Internal server error"});
    }
}

export const checkAuth = (req, res) => {
    try{
        res.status(200).json(req.user);
    }catch(error){
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({message: "Internal server error"});
    }
}
