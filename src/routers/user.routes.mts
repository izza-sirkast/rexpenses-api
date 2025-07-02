import { Router, type Request, type Response } from "express"
import { verifyAuth } from "../middlewares/auth.middlewares.mts"

const router = Router()

router.get("/profile", verifyAuth, (req: Request, res: Response) => {
    const user = req.user;
    if (!user) {
        res.status(401).json({message: "unauthorized"})
        return
    }

    res.status(200).json({message: "oke", data: {id: user.id, username: user.username} })
})

export default router