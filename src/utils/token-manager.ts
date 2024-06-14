import {Response,Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "./constants.js";
import { resolve } from "path";
import { rejects } from "assert";

export const createToken = (id: string, email: string, expiresIn) => {
    const payload = { id, email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn,
    });
    return token;
};

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => { 
    const token = req.signedCookies[`${COOKIE_NAME}`];
    if (!token || token.trim === "") {
        return res.status(401).json({ message: "Token is not Received" });
    }
    return new Promise<void>((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, success) => {
            if (err) {
                res.status(401).json({
                    message: "Unauthorized",
                });
                reject(err.message);
            } else {
                resolve();
                res.locals.jwtData = success;
                return next();
            }
        })
    })
    
};