import React, { useState } from "react";
import axios from 'axios';
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Login = ({ setToken }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    // 🌟 1. حالة التحميل لمنع تعليق الصفحة وتكرار الضغط
    const [loading, setLoading] = useState(false);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true); // تشغيل مؤشر التحميل فوراً
        
        try {
            const response = await axios.post(backendUrl + '/api/user/admin', { email, password });
            if (response.data.success) {
                setToken(response.data.token);
                toast.success("Welcome back, Admin!");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setLoading(false); // إيقاف التحميل في كل الأحوال
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center w-full bg-gray-50 px-4">
            {/* الكارد الاحترافي المودرن */}
            <div className="bg-white border border-gray-200 shadow-xl rounded-2xl px-8 py-8 w-full max-w-md space-y-6">
                
                {/* رأس الصفحة والهوية اللفظية */}
                <div className="text-center sm:text-left">
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Admin Control Panel</h1>
                    <p className="text-xs text-gray-400 mt-1">Please enter your credentials to access the cloud core.</p>
                </div>

                <form onSubmit={onSubmitHandler} className="space-y-4">
                    
                    {/* 1. حقل البريد الإلكتروني المطور */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Email Address
                        </label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            className="w-full border border-gray-200 text-sm rounded-lg p-2.5 bg-gray-50 text-gray-700 font-medium outline-none focus:border-black focus:bg-white transition-all"
                            type="email"
                            placeholder="admin@store.com"
                            required
                        />
                    </div>

                    {/* 2. حقل كلمة المرور المطور */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Password
                        </label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            className="w-full border border-gray-200 text-sm rounded-lg p-2.5 bg-gray-50 text-gray-700 font-medium outline-none focus:border-black focus:bg-white transition-all"
                            type="password"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {/* 🌟 3. زرار تسجيل الدخول الذكي التفاعلي */}
                    <button
                        disabled={loading}
                        className={`w-full mt-2 py-3 font-semibold text-sm rounded-lg shadow-md transition-all tracking-wide uppercase flex items-center justify-center gap-2 ${
                            loading 
                                ? "bg-gray-400 text-gray-200 cursor-not-allowed" 
                                : "bg-gray-800 hover:bg-black text-white active:scale-98"
                        }`}
                        type="submit"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Authenticating...
                            </>
                        ) : (
                            "Login"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;