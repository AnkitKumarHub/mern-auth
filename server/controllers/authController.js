import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodeMailer.js";
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from '../config/emailTemplates.js';


export const register = async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const hashedPassowrd = await bcrypt.hash(password, 10);

    const user = new userModel({ name, email, password: hashedPassowrd });

    // console.log(user);

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    //sending welcome email to the user
    const mailOptions = {
      from:process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to our Stack",
      text: `Hello ${name}, Welcome to our website. We are happy to have you here!`,
    };
    await transporter.sendMail(mailOptions);

    return res
      .status(200)
      .json({ success: true, message: "User registered successfully" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email Credentials" });
    }

    const isPassword = await bcrypt.compare(password, user.password);

    if (!isPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ success: true, message: "Login Success" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.status(200).json({ success: true, message: "Logout Success" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

//send verification OTP to the user's Email
export const sendVerifyOtp = async (req, res) => {
  try {
     const {userId} = req.body;

     const user = await userModel.findById(userId);

     if(user.isAccountVerified){
        return res.status(400).json({success:false, message:"User is already verified"});
     }

     const otp = String(Math.floor(100000 + Math.random()*900000));

     user.verifyOtp = otp;
     user.verifyOtpExpireAt = Date.now() + 24*60*60*1000;

     await user.save();

     const mailOptions = {
      from:process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      // text: `Hello ${user.name}, Your OTP for account verification is ${otp}`,
      html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email),
    };
    await transporter.sendMail(mailOptions);

    return res.status(200).json({success:true, message:"OTP sent successfully"});

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

//verify OTP and verify the user's account
export const verifyEmail = async (req,res)=>{
  const {userId, otp} = req.body;

  if (!userId || !otp) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    
    const user = await  userModel.findById(userId);

    if(!user){
      return res.status(400).json({success:false, message:"Invalid User"});
    }

    if(user.verifyOtp !== otp){
      return res.status(400).json({success:false, message:"Invalid OTP"});
    }

    if(user.verifyOtpExpireAt < Date.now()){
      return res.status(400).json({success:false, message:"OTP Expired"});
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    await user.save();

    return res.status(200).json({success:true, message:"Account verified successfully"});

  } catch (error) {
    return res.status(500).json({success: false, message : error.message});
  }
}

//check if user is authenticated
export const isAuthenticated = async(req,res)=>{
  try {
    return res.status(200).json({success:true, message:"User is authenticated"});
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}


//send password Reset OTP to the user's Email
export const sendResetOtp = async (req,res)=>{
  const {email} = req.body;

  if(!email){
    return res.status(400).json({success:false, message:"Email is required"});
  }

  try {
    const user = await userModel.findOne({email});
    
    if(!user){
      return res.status(400).json({success:false, message:"User Not Found"});
    }

    const otp = String(Math.floor(100000 + Math.random()*900000));

     user.resetOtp = otp;
     user.resetOtpExpireAt = Date.now() + 15*60*1000;

     await user.save();

     const mailOptions = {
      from:process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      // text: `Hello ${user.name}, Your OTP for password reset is ${otp}`,
      html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({success:true, message:"OTP sent successfully"});

  } catch (error) {
    return res.status(500).json({success: false, message : error.message});
  }
}

//reset User password
export const resetPassword = async (req,res)=>{
  const{email, otp, newPassword} = req.body;

  if(!email || !otp || !newPassword){
    return res.status(400).json({success:false, message:"All fields are required"});
  }

  try {
    
    const user = await userModel.findOne({email});

    if(!user){
      return res.status(400).json({success:false, message:"User Not Found"});
    }

    if(user.resetOtp !== otp){
      return res.status(400).json({success:false, message:"Invalid OTP"});
    }

    if(user.resetOtpExpireAt < Date.now()){
      return res.status(400).json({success:false, message:"OTP Expired"});
    }

    const hashedPassowrd = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassowrd;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;

    await user.save();  

    return res.status(200).json({success:true, message:"Password reset successfully"});

  } catch (error) {
    return res.status(500).json({success: false, message : error.message});
  }
}
