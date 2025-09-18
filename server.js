import dotenv from "dotenv";
dotenv.config();
import express from 'express'
import cors from 'cors'
import { initialization } from './config/db.connect.js'
import authRouter from './routes/authRoute.js'
import cookieParser from 'cookie-parser'
import transporter from './config/nodemailer.js'
import nodemailer from 'nodemailer'



const app = express()
app.use(express.json())
app.use(cookieParser())

const allowedOrigins = ['http://localhost:5173']

const corsOptions = {
    origin: allowedOrigins,
    credential: true,
    optionSuccessStatus: 200
}
app.use(cors(corsOptions))

await initialization()


app.use('/v1/auth', authRouter)



app.get('/', (req, res) => {
    res.send("API Working")
})

const PORT = 3000
app.listen(PORT, (req, res) => {
    console.log(`Sever connected on port http://localhost:${PORT}`)
})