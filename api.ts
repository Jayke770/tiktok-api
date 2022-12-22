import express, { type Response, type Request } from 'express'
import tiktok from './tiktok'
const app = express()
app.get("/user/:username", async (req: Request, res: Response) => {
    try {
        const data = await tiktok.fethUser(req.params['username'])
        return res.send(data)
    } catch (e) {
        return res.send(e)
    }
})
app.listen(1434, () => {
    console.log("Server fasfsafj")
})