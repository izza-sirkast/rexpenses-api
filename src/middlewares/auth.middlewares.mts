import { type Request, type Response, type NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifyAuth = (req: Request, res: Response, next: NextFunction) => {    
    const { acc } = req.cookies;

    if(!acc){
        res.status(401).json({ message: "unauthorized" });
        return;
    }

    try {
        const decoded = jwt.verify(acc, process.env.ACCESS_TOKEN_SECRET || "");

        if (typeof decoded !== "object" || !("id" in decoded) || !("username" in decoded)) {
            res.status(401).json({ message: "invalid token payload" });
            return;
        }

        req.user = {
            id: (decoded as JwtPayload).id as number,
            username: (decoded as JwtPayload).username as string,
        };
        
        next();
    } catch (error) {
        console.log(error)
        res.status(401).json({ message: "internal server error"});
        return;
    }

}