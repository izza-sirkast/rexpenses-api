import express from 'express';
import { PrismaClient } from './generated/prisma/index.js'; // Adjust the import path as necessary
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'

dotenv.config();
const app = express();

export const prisma = new PrismaClient()

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Routers
import authRouters from "./routers/auth.routers.mts"
app.use("/auth", authRouters)


app.get('/', async(req, res) => {
  res.send("hello bang");
});

const port = process.env.PORT
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});