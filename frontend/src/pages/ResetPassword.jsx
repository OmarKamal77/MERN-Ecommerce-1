import React, { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const { backendUrl } = useContext(ShopContext);
    const { token } = useParams(); // سحب التوكن من رابط الصفحة أوتوماتيكياً
    const navigate = useNavigate();
    
    // 🌟 ضفنا الـ State دي لتأمين العملية وعرض لفة التحميل الشيك ومنع الضغط المتكرر
    const [loading, setLoading] = useState(false);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // إرسال التوكن وكلمة المرور الجديدة للباك إند لتحديثها
            const response = await axios.post(`${backendUrl}/api/user/reset-password`, { token, newPassword });
            
            if (response.data.success) {
                toast.success(response.data.message);
                navigate('/login'); // توجيه المستخدم لصفحة تسجيل الدخول بعد النجاح
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
                {/* الرأس الفخم والخط الأنيق المتناسق مع باقي صفحات الحساب */}
                <div className="flex flex-col items-center gap-1 mb-2">
                    <p className="prata-regular text-3xl font-medium tracking-wide text-gray-900">Reset Password</p>
                    <div className="h-[2px] w-12 bg-black rounded-full mt-1 animate-pulse" />
                </div>
                
                {/* نص التوجيه الهادي والنظيف */}
                <p className="text-xs text-gray-400 text-center leading-relaxed max-w-[280px]">
                    Enter your new strong password below to secure your account access.
                </p>
                
                {/* حقل الباسورد الجديد الفخم بالتاثيرات التفاعلية */}
                <div className="w-full space-y-1 mt-2">
                    <label className="text-xs font-semibold text-gray-500 tracking-wide uppercase">New Password</label>
                    <input 
                        type="password" 
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none bg-gray-50/50 focus:bg-white focus:border-black focus:ring-1 focus:ring-black/10 transition-all duration-200 placeholder:text-gray-400 font-light" 
                        placeholder="••••••••" 
                        required 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                
                {/* زرار التحديث العريض المتفاعل مع تأثير الضغط المرتد */}
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
                            <span>Updating Password...</span>
                        </>
                    ) : (
                        "Update Password"
                    )}
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;