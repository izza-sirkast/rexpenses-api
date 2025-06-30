import express, { type Request, type Response } from "express"
import bcrypt from "bcryptjs";
import { prisma } from "../index.mts";
import { validateRegister } from "../utils/validation.mts"

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

export default router