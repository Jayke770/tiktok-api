import express, { type Response, type Request } from 'express'
import tiktok from './tiktok'
const app = express()
app.get("/user/:username", async (req: Request, res: Response) => {
    return res.send(await tiktok.fethUser(req.params['username']))
})
app.listen(1434, () => {
    console.log("Server fasfsafj")
})