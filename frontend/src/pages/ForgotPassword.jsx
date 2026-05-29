import React, { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    // 🌟 سحبنا الـ navigate كمان من الـ Context عشان نروق على تجربة المستخدم ويقدر يرجع للـ Login
    const { backendUrl, navigate } = useContext(ShopContext);
    
    // 🌟 ضفنا الـ State دي لضبط لفة التحميل ومنع الـ Spam عند إرسال الرابط
    const [loading, setLoading] = useState(false);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${backendUrl}/api/user/forgot-password`, { email });
            
            if (response.data.success) {
                toast.success(response.data.message);
                setEmail(''); 
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[75vh] flex items-center justify-center px-4 py-10 bg-gradient-to-b from-transparent to-gray-50/50">
            <form 
                onSubmit={onSubmitHandler} 
                className="flex flex-col items-center w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100 transition-all duration-300 gap-5 text-gray-800"
            >
                {/* الرأس الأنيق المتناسق مع صفحة الـ Login */}
                <div className="flex flex-col items-center gap-1 mb-2">
                    <p className="prata-regular text-3xl font-medium tracking-wide text-gray-900">Forgot Password</p>
                    <div className="h-[2px] w-12 bg-black rounded-full mt-1 animate-pulse" />
                </div>
                
                {/* رسالة التوجيه الشيك المريحة للعين */}
                <p className="text-xs text-gray-400 text-center leading-relaxed max-w-[280px]">
                    Enter your email address and we will send you a secure link to reset your password.
                </p>
                
                {/* حقل الإيميل الفخم */}
                <div className="w-full space-y-1 mt-2">
                    <label className="text-xs font-semibold text-gray-500 tracking-wide uppercase">Email Address</label>
                    <input 
                        type="email" 
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none bg-gray-50/50 focus:bg-white focus:border-black focus:ring-1 focus:ring-black/10 transition-all duration-200 placeholder:text-gray-400 font-light" 
                        placeholder="your@email.com" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                
                {/* زرار الإرسال العريض التفاعلي بالأنيميشن اللحظي */}
                <button 
                    disabled={loading}
                    className="w-full bg-black hover:bg-gray-900 text-white font-medium py-3 rounded-xl mt-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-200"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Sending Link...</span>
                        </>
                    ) : (
                        "Send Reset Link"
                    )}
                </button>

                {/* زرار العودة للخلف بتصميم شيك هادي يربط الصفحات ببعضها */}
                <div 
                    onClick={() => navigate('/login')} 
                    className="group flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-black cursor-pointer transition-colors mt-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 transform group-hover:-translate-x-0.5 transition-transform">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    Back to Login
                </div>
            </form>
        </div>
    );
};

export default ForgotPassword;