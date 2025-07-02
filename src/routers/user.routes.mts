import { Router, type Request, type Response } from "express"
import { verifyAuth } from "../middlewares/auth.middlewares.mts"

const router = Router()

router.get("/profile", verifyAuth, (req: Request, res: Response) => {
    // const { id, username } = req.user;

    // console.log(id, username)

    res.status(200).json({data: "oke"})
})

export default router