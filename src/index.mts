import express from 'express';
import { PrismaClient } from './generated/prisma/index.js'; // Adjust the import path as necessary
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'

declare module "express-serve-static-core" {
    interface Request {
        user? : {
            id: number,
            username: string
        }
    }
}

dotenv.config();
const app = express();

export const prisma = new PrismaClient()

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Routers
import authRoutes from "./routers/auth.routes.mts"
import userRoutes from "./routers/user.routes.mts"
app.use("/auth", authRoutes)
app.use("/user", userRoutes)
app.get('/', async(req, res) => {
  res.send("welcome to rexpenses-api");
});

const port = process.env.PORT
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});