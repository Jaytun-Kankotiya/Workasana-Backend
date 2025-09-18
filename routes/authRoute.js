import express from 'express'
import { login, logout, register, resetPassword, sendResetPasswordOtp, sendVerificationOtp, verifyEmailOtp, verifyResetOtp } from '../controllers/authController.js'
import userAuth from '../middleware/userAuth.js'


const authRouter = express.Router()

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.post('/logout', logout)
authRouter.post('/send-verify-otp', userAuth, sendVerificationOtp)
authRouter.post('/verify-acoount',userAuth, verifyEmailOtp)
authRouter.post('/send-reset-otp',userAuth, sendResetPasswordOtp)
authRouter.post('/verify-reset-otp',userAuth, verifyResetOtp)
authRouter.post('/reset-password',userAuth, resetPassword)


export default authRouter