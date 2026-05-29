import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import nodemailer from "nodemailer"; 

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Route For User login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = createToken(user._id);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Route for user registration
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Check if user already exists
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }
        // Validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: "Please enter a valid email",
            });
        }
        if (password.length < 8) {
            return res.json({
                success: false,
                message: "Please enter a strong password",
            });
        }
        // Hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
        });
        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Route for admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (
            email === process.env.ADMIN_EMAIL &&
            password === process.env.ADMIN_PASSWORD
        ) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}; 

// Request password reset link
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.SENDER_EMAIL,
                pass: process.env.SENDER_PASSWORD,
            },
        });

        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Password Reset Request",
            html: `
                <div style="font-family: sans-serif; padding: 20px; max-width: 600px;">
                    <h2>Password Reset</h2>
                    <p>You requested to reset your password. Click the button below to set a new password. This link will expire in 15 minutes.</p>
                    <a href="${resetLink}" style="background: black; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Reset Password</a>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: "Reset link sent to your email" });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Reset password using token
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.json({ success: false, message: "All fields are required" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.json({ success: false, message: "New password cannot be the same as your old password" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        res.json({ success: true, message: "Password updated successfully" });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Link is invalid or has expired" });
    }
};

// Fetch current user profile data (Clean production-ready version without artificial delay)
const getUserProfile = async (req, res) => {
    try {
        // Read userId from req.userId secured by middleware
        const userId = req.userId || req.body.userId; 
        const user = await userModel.findById(userId).select("-password"); 
        
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        
        // 🌟 تم إزالة التأخير الصناعي والبيانات ستعود الآن فوراً بسرعة الصاروخ
        res.json({ success: true, user });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Update user profile data in MongoDB
const updateUserProfile = async (req, res) => {
    try {
        const userId = req.userId || req.body.userId; 
        const { name, phone, address } = req.body; 
        
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { name, phone, address },
            { new: true } 
        ).select("-password");

        res.json({ success: true, message: "Profile updated successfully!", user: updatedUser });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { loginUser, registerUser, adminLogin, forgotPassword, resetPassword, getUserProfile, updateUserProfile };