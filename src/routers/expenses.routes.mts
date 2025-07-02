import { Router, type Request, type Response } from "express"
import { verifyAuth } from "../middlewares/auth.middlewares.mts"
import { validatePostExpense, validateUpdateExpense } from "../utils/validation.mts";
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

router.put("/:post_id", verifyAuth, async (req: Request, res: Response) => {
    const { post_id } = req.params;
    const { error, value } = validateUpdateExpense(req.body);

    if (error) {
        console.log(error);
        res.status(400).json({ message: "invalid input data" });
        return;
    }

    try {
        const updatedExpense = await prisma.expenses.update({
            where: {
                id: parseInt(post_id),
            }, 
            data: {
                amount: value.amount,
                description: value.description
            }
        });

        res.status(200).json({
            message: "expense updated successfully",
            data: updatedExpense
        });
        return;
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal server error" });
        return;
    }
})

router.delete("/:post_id", verifyAuth, async (req: Request, res: Response) => {
    const { post_id } = req.params;

    try {
        const deletedExpense = await prisma.expenses.delete({
            where: {
                id: parseInt(post_id),
            }
        });

        res.status(200).json({
            message: "expense updated successfully",
            data: deletedExpense
        });
        return;
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal server error" });
        return;
    }
})

router.get("/", verifyAuth, async (req: Request, res: Response) => {
    const id = req.user?.id;
    const filter = req.query.filter
    // const allowedFilters = ['today', 'past_week', 'past_month', 'past_three_months', 'past_year'];

    try {
        var dateGreaterThan;
        var dateLessThan;
        switch (filter) {
            case 'today':
                const today = new Date();
                dateGreaterThan = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                dateLessThan = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
                break;
            case 'past_week':
                dateLessThan = new Date();
                dateGreaterThan = new Date(dateLessThan.getFullYear(), dateLessThan.getMonth(), dateLessThan.getDate() - 7, dateLessThan.getHours(), dateLessThan.getMinutes(), dateLessThan.getSeconds());
                break;
            case 'past_month':
                dateLessThan = new Date();
                dateGreaterThan = new Date(dateLessThan.getFullYear(), dateLessThan.getMonth(), dateLessThan.getDate() - 30, dateLessThan.getHours(), dateLessThan.getMinutes(), dateLessThan.getSeconds());
                break;
            case 'past_three_months':
                dateLessThan = new Date();
                dateGreaterThan = new Date(dateLessThan.getFullYear(), dateLessThan.getMonth(), dateLessThan.getDate() - 90, dateLessThan.getHours(), dateLessThan.getMinutes(), dateLessThan.getSeconds());
                break;
            case 'past_year':
                dateLessThan = new Date();
                dateGreaterThan = new Date(dateLessThan.getFullYear(), dateLessThan.getMonth(), dateLessThan.getDate() - 365, dateLessThan.getHours(), dateLessThan.getMinutes(), dateLessThan.getSeconds());
                break;
            default:
                dateGreaterThan = new Date(0); // start of time
                dateLessThan = new Date(); // current time
                break;
        }

        const expenses = await prisma.expenses.findMany({
            where: {
                user_id: id as number,
                date: {
                    gte: dateGreaterThan,
                    lt: dateLessThan
                }
            },
            orderBy: {
                date: 'desc'
            }
        });

        res.status(200).json({
            message: "expenses retrieved successfully",
            data: expenses
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal server error" });
    }
});

export default router;