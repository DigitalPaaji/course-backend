import type { Request, Response } from "express";
import Admin from "../model/adminModel.ts";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const createAdmin = async (req:Request,res:Response) => {
  try {
  


    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json(
        { success: false, message: "All fields are required" }
      );
    }


    if (name.length < 3) {
      return res.status(400).json(
        { success: false, message: "Name must be at least 3 characters" }
      );
    }


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json(
        { success: false, message: "Invalid email format" }
      );
    }


    if (password.length < 8  || password.length > 25)  {
      return res.status(400).json(
        {
          success: false,
          message: "Password must be at least 8 and max 24 characters long",
        });
    }

 
    const alreadyExist = await Admin.findOne({ email });
    if (alreadyExist) {
      return res.status(409).json(
        { success: false, message: "Admin already exists" }
      );
    }
   
    const hashPassword = await bcrypt.hash(password,10)


    const admin = await Admin.create({
      name,
      email,
      password: hashPassword,
    
    });

    return res.status(201).json(
      {
        success: true,
        message: "Admin created successfully",
      }
    );
  } catch (error) {

    return res.status(500).json(
      { success: false, message: "Internal server error" }
    );
  }
};

export const adminLogin = async (req:Request,res:Response) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json(
        { success: false, message: "Email and password are required" }
        
      );
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json(
        { success: false, message: "Invalid email format" }
      );
    }
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json(
        { success: false, message: "Invalid email or password" }
      );
    }


    const isPasswordValid = await  bcrypt.compare(password,admin.password)
    


    if (!isPasswordValid) {
      return res.status(401).json(
        { success: false, message: "Invalid email or password" }
        
      );
    }

     const token = jwt.sign(
      { id: admin._id.toString() },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );




res.cookie("auth_token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
  maxAge: 1000 * 60 * 60 * 24 * 30 
});

    return res.status(200).json(
      {
        success: true,
        message: "Login successful",
  
      },
    
    );
  } catch (error) {
  
    return res.status(500).json(
      { success: false, message: "Internal server error" }
    );
  }
};

interface AuthAdmin extends Request{
     admin:any
}


export const getAdmin = async(req:AuthAdmin,res:Response)=>{
  try {
    const admin = req.admin

    return res.json({
      success:true,
    })
    
  } catch (error) {
     return res.status(500).json(
      { success: false, message: "Internal server error" }
    );
  }
}



export const logoutAdmin = async (req: AuthAdmin, res: Response) => {
  try {
    res.clearCookie("auth_token", {
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




