import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";
import {hash,compare} from "bcrypt";
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    // get all users
    try {
        const users = await User.find();
        return res.status(200).json({ message: "OK", users });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", cause: error.message });
        
    }
};

export const userSignup = async (req: Request, res: Response, next: NextFunction) => {
    // get user signup
    try {
        const { name, email, password } = req.body;
        const existinguser = await User.findOne({ email });
        if (existinguser) return res.status(401).send("User already exist");
        const hashedPassword = await hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        // create token and store a cookie
        res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            domain: "localhost",
            signed: true,
            path:"/",
        }); 

        const token = createToken(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);

        res.cookie(COOKIE_NAME, token, {
            path: "/",
            domain: "localhost",
            expires,
            httpOnly: true,
            signed: true,
        });
        /////=================change domain name from localhost to deploy domain
        
        return res.status(201).json({ message: "OK", name:user.name, email: user.email });
    } catch (error) {
        console.log(error);
if (error.code === 11000) {
        return res.status(400).json({ message: "Email address already in use" });
    } else {
        return res.status(500).json({ message: "Internal server error", cause: error.message });
    }        
    }
};

export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //user login
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send("User not registered");
    }
    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(403).send("Incorrect Password");
    }

    // create token and store cookie

    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      domain: "localhost",
      signed: true,
      path: "/",
    });

    const token = createToken(user._id.toString(), user.email, "7d");
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    res.cookie(COOKIE_NAME, token, {
      path: "/",
      domain: "localhost",
      expires,
      httpOnly: true,
      signed: true,
    });

    return res
      .status(200)
      .json({ message: "OK", name: user.name, email: user.email });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
    // user oken check
    try {
        

        const user = await User.findById(res.locals.jwtData.id );
        if (!user) {
            return res.status(401).send("User not found or Token malfunctioned");
        }
        console.log(user._id.toString(), res.locals.jwtData.id);
        
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permission didnt match");

        }
              

        return res.status(200).json({ message: "OK",name:user.name, email: user.email });
    } catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR" ,cause:error.message });           
    }
};

export const userLogout = async (req: Request, res: Response, next: NextFunction) => {
    // user oken check
    try {
        

        const user = await User.findById(res.locals.jwtData.id );
        if (!user) {
            return res.status(401).send("User not found or Token malfunctioned");
        }
        console.log(user._id.toString(), res.locals.jwtData.id);
        
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permission didnt match");

        }
             
      res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      domain: "localhost",
      signed: true,
      path: "/",
    });

        return res.status(200).json({ message: "OK",name:user.name, email: user.email });
    } catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR" ,cause:error.message });           
    }
};