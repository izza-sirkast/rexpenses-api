import express from 'express';
import { PrismaClient } from './generated/prisma/index.js'; // Adjust the import path as necessary
import dotenv from 'dotenv';
dotenv.config();

const app = express();

export const prisma = new PrismaClient()


// Middlewares
app.use(express.json())

// Routers
import authRouters from "./routers/auth.routers.mts"
app.use("/auth", authRouters)


app.get('/', async(req, res) => {
  try {
    const users = await prisma.user.findMany();
    
    res.status(201).json({ data: users });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).send('Error getting users ');
    return;
  }
});

app.post('/register', async(req, res) => {
  try {
    await prisma.user.create({
        data: {
            username: "qwe",
            hashed_password: "qwe"
        }
    });
    
    res.status(201).json({ message: 'User registered successfully' });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).send('Error creating user');
    return;
  }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});