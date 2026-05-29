import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Routes, Route, useLocation, Navigate } from "react-router-dom"; 
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute"; // حارس البوابة الذكي
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './pages/Dashboard';

// 🌟 تعديل مأمن: يقرأ المتغير الحي من Vercel، ويفك على السيرفر المحلي لو شغال لوكال
export const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
export const currency = '$'

const App = () => {
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '');
    const location = useLocation(); 

    useEffect(() => {
        localStorage.setItem('token', token)
    }, [token])

    // تأثير ذكي لتغيير عنوان تابة المتصفح في الأدمن أوتوماتيكياً
    useEffect(() => {
        if (token === "") {
            document.title = "Admin Login | Shopping fashion";
            return;
        }

        const adminTitles = {
            "/": "Dashboard | Admin Panel | Shopping fashion",
            "/add": "Add Items | Admin Panel | Shopping fashion",
            "/list": "List Items | Admin Panel | Shopping fashion",
            "/orders": "Manage Orders | Admin Panel | Shopping fashion"
        };

        const currentPath = location.pathname;
        document.title = adminTitles[currentPath] || "Admin Panel | Shopping fashion";
    }, [location, token]);

    return (
        <div className="bg-gray-50 min-h-screen">
            <ToastContainer />
            
            {token === "" ? (
                <Login setToken={setToken} />
            ) : (
                <>
                    <Navbar setToken={setToken} />
                    <hr />
                    <div className="flex w-full ">
                        <Sidebar />
                        <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
                            <Routes>
                                {/* 🛡️ خط الحماية الشامل للمسارات الحساسة */}
                                <Route element={<ProtectedRoute token={token} />}>
                                    <Route path="/" element={<Dashboard token={token} />} />
                                    <Route path="/add" element={<Add token={token} />} />
                                    <Route path="/list" element={<List token={token} />} />
                                    <Route path="/orders" element={<Orders token={token} />} />
                                </Route>

                                {/* 🔄 التوجيه التلقائي الفوري للرئيسية عند كتابة مسار عشوائي */}
                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default App;