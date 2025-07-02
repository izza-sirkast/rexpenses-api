import { Router, type Request, type Response } from "express"
import { verifyAuth } from "../middlewares/auth.middlewares.mts"
import { validatePostExpense } from "../utils/validation.mts";
import { prisma } from "../index.mts";
const router = Router();

router.post("/", verifyAuth, async (req: Request, res: Response) => {
    const id = req.user?.id;

    const { error, value } = validatePostExpense(req.body);

    if(error){
        console.log(error)
        res.status(400).json({ message: "invalid input data" });
        return;
    }

    try {
        const newExpenseData: any = {
            user_id: id as number,
            amount: value.amount as number,
            description: value.description
        }

        if (value.date) {
            newExpenseData.date = new Date(value.date);
        }

        const expense = await prisma.expenses.create({
            data: newExpenseData
        })

        res.status(201).json({
            message: "expense created successfully",
            data: expense
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "internal server error" })
    }
})

export default router;