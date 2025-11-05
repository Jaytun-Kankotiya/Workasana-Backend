import dotenv from "dotenv";
dotenv.config();
import express from 'express'
import cors from 'cors'
import { initialization } from './config/db.connect.js'
import authRouter from './routes/authRoute.js'
import cookieParser from 'cookie-parser'
import projectRouter from "./routes/projectRoute.js";
import teamRouter from "./routes/teamRoute.js";
import tagRouter from "./routes/tagRoute.js";
import taskRouter from "./routes/taskRoute.js";
import userRouter from "./routes/userRoute.js";



const app = express()
app.use(express.json())
app.use(cookieParser())

const allowedOrigins = ['http://localhost:5173', 'https://workasana-frontend-gamma.vercel.app']

const corsOptions = {
    origin: allowedOrigins,
    credentials: true,
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

await initialization()


app.use('/v1/auth', authRouter)

app.use('/v1/projects', projectRouter)

app.use('/v1/teams', teamRouter)

app.use('/v1/tags', tagRouter)

app.use('/v1/tasks', taskRouter)

app.use('/v1/user', userRouter)




app.get('/', (req, res) => {
    res.send("API Working")
})

const PORT = 3000
app.listen(PORT, (req, res) => {
    console.log(`Sever connected on port http://localhost:${PORT}`)
})