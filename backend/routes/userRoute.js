import express from "express";
import {
    loginUser,
    registerUser,
    adminLogin,
    forgotPassword, 
    resetPassword,  
    getUserProfile,    // 🌟 ضفنا دالة جلب بيانات البروفايل
    updateUserProfile  // 🌟 ضفنا دالة تحديث بيانات البروفايل
} from "../controllers/userController.js";
import authUser from "../middleware/auth.js"; // 🌟 استدعاء ميدل وير الأمان للتأكد من التوكن

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);

// المسارات الخاصة بنسيان وإعادة تعيين كلمة المرور
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password", resetPassword);

// 🌟 المسارات الديناميكية الجديدة للبروفايل (محمية بالـ authUser)
userRouter.get("/profile", authUser, getUserProfile);
userRouter.post("/update-profile", authUser, updateUserProfile);

export default userRouter;