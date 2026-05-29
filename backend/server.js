import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

// App Config
const app = express();
const port = process.env.PORT || 4000;

// الاتصال بقواعد البيانات والخدمات السحابية
connectDB();
connectCloudinary();

// 🌟 نظام الـ CORS الذكي والمؤمن
const allowedOrigins = [
    "https://mern-ecommerce-1-frontend.vercel.app",
    "https://mern-ecommerce-1-admin.vercel.app",
    "http://localhost:5173",
    "http://localhost:5174"  
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS - Secured by Omar Kamal"));
        }
    },
    credentials: true,
};

// Middlewares
app.use(express.json());
app.use(cors(corsOptions));

// 🌟 الربطة السحرية: جعل فولدر الـ uploads متاح كملفات ثابتة (Static)
// ده هيخلي أي صورة في فولدر uploads تظهر على الرابط: http://localhost:4000/images/p_img1.png
app.use('/images', express.static('uploads'));

// API Endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// نقطة فحص جودة وحالة السيرفر
app.get("/", (req, res) => {
    res.status(200).json({ success: true, message: "API Working Perfectly" });
});

// حزام الأمان العالمي: Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("❌ Backend Error:", err.message);
    
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

// تشغيل السيرفر
app.listen(port, () => console.log("🚀 Server started with high security on PORT : " + port));