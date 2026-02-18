import type { Request, Response } from "express";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../model/userModel.ts";
import mongoose from "mongoose";
import path from "node:path";



export const createUser = async(req:Request,res:Response)=>{
    try {
        const {name,email,password,courseid ,courseEndDate} = req.body

  if (!name || !email || !password || !courseid || !courseEndDate) {
      return res.status(400).json({ message: "All fields are required" });
    }



   if (password.length < 6 || password.length > 26) {
      return res
        .status(400)
        .json({ message: "Password must be between 6 and 26 characters" });
    }
    const alreadyUser = await User.findOne({ email });

if(alreadyUser){
      return res.status(400).json({ message: "User already exists" });
}


const hashpassword = await bcrypt.hash(password,10)
    const expireDate = new Date();
    expireDate.setMonth(expireDate.getMonth() + Number(courseEndDate));
   const newUser = await User.create({
    name,email,password:hashpassword,course:[
          {
          course: courseid,
          enrolledAt: new Date(),
          expireAt: expireDate,
        },
    ]
})
 return res.status(201).json({
      message: "User created successfully",
      user: newUser,
    
    });

    } catch (error) {
            return res.status(500).json({ message: "Server Error" });
  
    }
}



export const getAllStudent = async (req: Request, res: Response) => {
  try {
    const students = await User.find().select("-password").populate({
    path: "course.course",
    model: "course",
   });

    return res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const  id  = req.params.id;

 
    const user = await User.findById(id);


    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }


    await user.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });

  } catch (error: any) {

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;


    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const verifyPassword = await bcrypt.compare(password, user.password);

    if (!verifyPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // ✅ Check JWT secret
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not defined");
    }

    // ✅ Generate token
    const token = jwt.sign(
      { id: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "20d" }
    );

    res.cookie("user_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 1000 * 60 * 60 * 24 * 20, 
    });

    return res.status(200).json({
      success: true,
      message: "Login successful"
    });

  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

interface UserAuth extends Request{
    user: any
}
export const getUser = async(req:UserAuth,res:Response)=>{
try {
    const user = req.user;
    return res.json({
        success:true,
    })
} catch (error) {
     return res.status(500).json({
      success: false,
      message: "Server error",
    });
}
}

export const getCourse = async(req:UserAuth,res:Response)=>{
    try {
          const user = req.user


const getUser = await User.findById(user._id).populate({
    path: "course.course",
    model: "course",
    populate: {
      path: "chapters.lectures",
      model: "Lesson",
    },
  });
   if (!getUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
 return res.status(200).json({
      success: true,
      user: getUser,
    });
    } catch (error) {
           return res.status(500).json({
      success: false,
      message: "Server error",
    }); 
    }
}

export const logoutUser = async (req: UserAuth, res: Response) => {
  try {
    res.clearCookie("user_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });

  } catch (error) {
    console.error("Logout Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
