import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name) {
    return res.json(400).json({ success: false, message: "Name is required" });
  }

  if (!email) {
    return res.json(400).json({ success: false, message: "Email is required" });
  }

  if (!password) {
    return res
      .json(400)
      .json({ success: false, message: "Password is required" });
  }

  try {
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User Already Exist" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const user = new userModel({ name, email, password: hashPassword })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    const mailOptions = {
      from: `"Workasana Team" <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: `Welcome to Workasana APP!`,
      text: `Hello ${name},
      Welcome to Workasana! We're thrilled to have you on board.
      You can now start managing your tasks efficiently and collaborate seamlessly with your team.
      If you have any questions, feel free to reply to this email or reach out to our support team.
      Best regards,
      The Workasana Team`,
      html: `
      <p>Hi ${name},</p>
      <p>Welcome to <strong>Workasana</strong>! We're thrilled to have you on board.</p>
      <p>You can now start managing your tasks efficiently and collaborate seamlessly with your team.</p>
      <p>If you have any questions, feel free to reply to this email or reach out to our support team.</p>
      <br/>
      <p>Best regards,<br/>The Workasana Team</p>
      `
    };

    await transporter.sendMail(mailOptions);

    await user.save();
    return res.json({
      success: true,
      message: "User registered successfully",
      user,
      token: token
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  if (!password) {
    return res
      .status(400)
      .json({ success: false, message: "Password is required" });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "Email not registered." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ success: true, message: "Login Successfully", data: user, token: token });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const sendVerificationOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Please Enter Valid Email Address" });
  }

  try {
    const userId = req.userId;
    const user = await userModel.findById(userId);

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 10  * 60 * 1000;

    await user.save();

    const otpEmail = {
      from: `"Workasana Team" <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: `Your Workasana Account Verification OTP`,
      html: `
      <div style="font-family: 'Helvetica', 'Arial', sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
      <h2 style="color: #333333; font-weight: 600;">Hello ${user.name || "User"},</h2>
      <p style="font-size: 16px; color: #555555; line-height: 1.5;">
        Thank you for signing up on <strong>Workasana</strong>! To complete your account setup, please use the One-Time Password (OTP) below:
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="display: inline-block; font-size: 32px; font-weight: bold; color: #222222; padding: 15px 25px; border: 2px dashed #4CAF50; border-radius: 8px;">
          ${otp}
        </span>
      </div>
      <p style="font-size: 14px; color: #555555; line-height: 1.5;">
        This OTP is valid for <strong>10 Minutes</strong>. Please do not share it with anyone.
      </p>
      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
      <p style="font-size: 12px; color: #777777; text-align: center;">
        If you did not request this OTP, you can safely ignore this email.
      </p>
      <p style="font-size: 12px; color: #777777; text-align: center;">
        &copy; ${new Date().getFullYear()} Workasana. All rights reserved.
      </p>

    </div>
      `,
    };
    await transporter.sendMail(otpEmail);

    return res
      .status(200)
      .json({ success: true, message: "Verification OTP sent on your email" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyEmailOtp = async (req, res) => {
  const { otp } = req.body;
  const userId = req.userId;

  if (!userId || !otp) {
    return res.status(404).json({ success: false, message: "Missing Details" });
  }

  try {
    const user = await userModel.findById( userId );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.status(404).json({ success: false, message: "Invalid OTP" });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.status(404).json({ success: false, message: "OTP Expired." });
    }

    user.isVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;
    await user.save();

    const accountVerifiedEmail = {
      from: `"Workasana Team" <${process.env.SENDER_EMAIL}>`,
      to: user.email,
      subject: "Your Workasana Account is Now Verified",
      html: `
      <div style="font-family: 'Helvetica', 'Arial', sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9">
      <h2 style="color: #333333; font-weight: 600;">Hello ${user.name || "User"}</h2>
      <p style="font-size: 16px; color: #555555; line-height: 1.5;">
        Congratulations! Your account on <strong>Workasana</strong> has been successfully verified.
      </p>
      <p style="font-size: 16px; color: #555555; line-height: 1.5;">
        You can now log in and start managing your tasks, collaborating with your team, and making the most of Workasana’s features.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.APP_URL || "#"}" 
           style="display: inline-block; padding: 12px 25px; font-size: 16px; color: #ffffff; background-color: #4CAF50; text-decoration: none; border-radius: 5px; font-weight: bold;">
          Go to Workasana
        </a>
      </div>
      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
      <p style="font-size: 12px; color: #777777; text-align: center;">
        If you did not verify this account, please contact our support immediately.
      </p>
      <p style="font-size: 12px; color: #777777; text-align: center;">
        &copy; ${new Date().getFullYear()} Workasana. All rights reserved.
      </p>
      </div>
      `
    }
    await transporter.sendMail(accountVerifiedEmail)

    return res.status(200).json({ success: true, message: "Email Verified successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const sendResetPasswordOtp = async (req, res) => {
  const {email} = req.body

  if(!email){
    return res.status(404).json({success: false, message: "Email is required"})
  }

  try {
    const user = await userModel.findOne({email})
    if(!user){
      return res.status(404).json({success: false, message: "User not found"})
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000))
    user.resetOtp = otp
    user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000

    await user.save()

    const resetOtpMailOption = {
      from: `"Workasana Team" <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: `Your Password Reset OTP`,
      html: `
      <div style="font-family: 'Helvetica', 'Arial', sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
      <h2 style="color: #333333; font-weight: 600;">Hello ${user.name || "User"},</h2>
      <p>We received a request to reset your password for your <strong>Workasana Account</strong>.</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="display: inline-block; font-size: 32px; font-weight: bold; color: #222222; padding: 15px 25px; border: 2px dashed #4CAF50; border-radius: 8px;">
          ${otp}
        </span>
      </div>
      <p style="font-size: 14px; color: #555555; line-height: 1.5;">
        This OTP is valid for <strong>10 minutes</strong>. Please do not share it with anyone.
      </p>
      <p>Please do not share this OTP with anyone.</p>
      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
      <p style="font-size: 12px; color: #777777; text-align: center;">
        If you did not request this OTP, you can safely ignore this email.
      </p>
      <p style="font-size: 12px; color: #777777; text-align: center;">
        &copy; ${new Date().getFullYear()} Workasana. All rights reserved.
      </p>

    </div>
      `
    }
    await transporter.sendMail(resetOtpMailOption)

    return res.status(200).json({success: true, message: 'Password Reset OTP has been sent to your email'})
  } catch (error) {
    return res.status(500).json({success: false, message: error.message})
  }
}


export const verifyResetOtp = async (req, res) => {
  const {otp, email} = req.body

  if(!otp || !email){
    return res.status(404).json({success: false, message: "Email and OTP are required"})
  }

  try {
    const user = await userModel.findOne({email})
    if(!user) {
      return res.status(404).json({success: false, message: 'User not found'})
    }

    if(!user.resetOtp || String(user.resetOtp) !== String(otp)){
      return res.status(404).json({success: false, message: "Invalid OTP"})
    }

    if(user.resetOtpExpireAt < Date.now()){
      return res.status(404).json({success: false, message: "OTP Expired"})
    }

    user.resetOtp = ""
    user.resetOtpExpireAt = 0
    await user.save()
    return res.status(200).json({success: true, message: "OTP Verified Successfully"})

  } catch (error) {
    return res.status(500).json({success: false, message: error.message})
  }
}


export const resetPassword = async (req, res) => {
  const {email, newPassword} = req.body

  if(!email || !newPassword){
    return res.status(404).json({success: false, message: "Email and Password are required"})
  }

  try {
    const user = await userModel.findOne({email})

    if(!user){
      return res.status(404).json({success: false, message: "User not found"})
    }

    const hashPassword = await bcrypt.hash(newPassword, 10)
    user.password = hashPassword

    await user.save()

    const resetPasswordEmail = {
      from: `"Workasana Team" <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: "Your password has been reset successfully",
      text: `Hello ${user.name || "User"},\n\n
      Your Workasana account password has been successfully reset. You can now log in with your new password.\n\n
      If you did not request this change, please contact our support team immediately.\n\n
      - The Workasana Team`,
      html: `
      <div style="font-family: 'Helvetica', 'Arial', sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
      
      <h2 style="color: #333333; font-weight: 600;">Hello ${user.name || "User"},</h2>

      <p style="font-size: 16px; color: #555555; line-height: 1.5;">
        Your password for <strong>Workasana</strong> has been successfully reset.
      </p>

      <p style="font-size: 16px; color: #555555; line-height: 1.5;">
        You can now log in with your new password and continue managing your tasks and collaborating with your team.
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.APP_URL || "#"}"
           style="display: inline-block; padding: 12px 25px; font-size: 16px; color: #ffffff; background-color: #4CAF50; text-decoration: none; border-radius: 5px; font-weight: bold;">
          Go to Workasana
        </a>
      </div>

      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">

      <p style="font-size: 12px; color: #777777; text-align: center;">
        If you did not request this change, please contact our support team immediately.
      </p>

      <p style="font-size: 12px; color: #777777; text-align: center;">
        &copy; ${new Date().getFullYear()} Workasana. All rights reserved.
      </p>
      </div>
      `
    }
    await transporter.sendMail(resetPasswordEmail)

    return res.status(200).json({success: true, message: "Password has been reset successfully. Please Login to your account"})
  } catch (error) {
    return res.status(500).json({success: false, message: error.message})
  }
}


export const fetchAllUser = async (req, res) => {
  try {
    const users = await userModel.find({}, "name _id")

    if(!users || users.length === 0){
      return res.status(400).json({success: false, message: "Users not found"})
    }

    return res.status(200).json({success: true, message: "Users Fetched Successfully", data: users})
  } catch (error) {
    return res.status(500).json({success: false, message: error.message})
  }
}

