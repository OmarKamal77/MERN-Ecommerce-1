import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
    try {
        const { token } = req.headers;
        
        if (!token) {
            return res.json({ success: false, message: "Not Authorized, Login Again" });
        }

        // فك تشفير التوكن
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        
        // 🌟 التصليح السحري: بنربط الـ userId بالـ req مباشرة لحمايته من الـ undefined
        req.userId = token_decode.id; 
        
        // كخطوة أمان إضافية لو الكود القديم لسه بيقرا من الـ body في حتة تانية:
        if (!req.body) req.body = {};
        req.body.userId = token_decode.id;

        next(); // كمل طريقك للـ Controller بسلام
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export default authUser;