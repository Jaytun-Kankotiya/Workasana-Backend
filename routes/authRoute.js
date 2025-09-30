import express from 'express'
import { fetchAllUser, login, logout, register, resetPassword, sendResetPasswordOtp, sendVerificationOtp, verifyEmailOtp, verifyResetOtp } from '../controllers/authController.js'
import userAuth from '../middleware/userAuth.js'


const authRouter = express.Router()

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.post('/logout', logout)
authRouter.post('/send-verify-otp', userAuth, sendVerificationOtp)
authRouter.post('/verify-acoount',userAuth, verifyEmailOtp)
authRouter.post('/send-reset-otp', sendResetPasswordOtp)
authRouter.post('/verify-reset-otp', verifyResetOtp)
authRouter.post('/reset-password', resetPassword)
authRouter.get('/users',userAuth, fetchAllUser)


export default authRouter