import express, { type Request, type Response } from "express"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { prisma } from "../index.mts";
import { validateRegister } from "../utils/validation.mts"

dotenv.config();
const router = express.Router();

router.post("/register", async (req: Request, res: Response) => {
    const { error, value } = validateRegister(req.body)

    if (error) {
        console.log("error :",error)
        res.status(400).json({
            error: "invalid input data",
            details: error.details
        })
        return
    }

    try {
        // Check if username has been used
        const userMatchUsername = await prisma.user.findFirst({
            where: {
                username: value.username
            }
        })

        if (userMatchUsername) {
            throw new Error("Username has been used")
        }

        // hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(value.password, salt);

        // Save the new user to the database
        const newUser = await prisma.user.create({
            data: {
                username: value.username,
                hashed_password: hashedPassword
            }
        })

        res.status(201).json({
            message: "user successfully created",
            user: newUser
        })        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "something went wrong", details: error})
    }
})

router.post("/login", async (req: Request, res: Response) => {
    const { error, value } = validateRegister(req.body)

    if (error) {
        console.log("error :",error)
        res.status(400).json({
            error: "invalid input data",
            details: error.details
        })
        return
    }

    try {
        // find the user with matching username 
        const foundUser = await prisma.user.findUnique({
            where: {
                username: value.username
            }
        })

        if (!foundUser) {
            res.status(403).json({
                error: "invalid username or password"
            })
            return
        }

        // compare the password
        const correctPassword = await bcrypt.compare(value.password, foundUser.hashed_password);

        if (!correctPassword) {
            res.status(403).json({
                error: "invalid username or password"
            })
            return
        }

        
        // generate json token
        if (!process.env.ACCESS_TOKEN_SECRET) {
            return;
        }
        const accessToken = jwt.sign({ 
            id: foundUser.id, 
            username: foundUser.username,
            fromLogin: true },
            process.env.ACCESS_TOKEN_SECRET, 
            { expiresIn : '30m'}
        )

        res.cookie('acc', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 30 // 30 minutes
        })

        res.status(200).json({
            message: "login success",
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "something went wrong", details: error})
    }
})

export default router