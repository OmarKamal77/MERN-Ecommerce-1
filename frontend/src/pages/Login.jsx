import React, { useContext, useState , useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
    const [currentState, setCurrentState] = useState("Login");
    const {token ,setToken ,navigate ,backendUrl} = useContext(ShopContext);

    const [name,setName] = useState('');
    const [password,setPassword] = useState('');
    const [email,setEmail] = useState('');
    
    const [loading, setLoading] = useState(false);

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setLoading(true); 
        
        try {
            if (currentState === "Sign Up") {
                const response = await axios.post(backendUrl + "/api/user/register", {
                    name,
                    email,
                    password,
                });

                if (response.data.success) {
                    setToken(response.data.token);
                    sessionStorage.setItem("token", response.data.token);
                } else {
                    toast.error(response.data.message);
                }
            } else {
                const response = await axios.post(backendUrl + "/api/user/login", {
                    email,
                    password,
                });

                if (response.data.success) {
                    setToken(response.data.token);
                    sessionStorage.setItem("token", response.data.token);
                } else {
                    toast.error(response.data.message);
                }
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setLoading(false); 
        }
    };

    useEffect(() => {
        if (token) {
            navigate("/");
        }
    }, [token]);

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-10 bg-gradient-to-b from-transparent to-gray-50/50">
            <form
                onSubmit={onSubmitHandler}
                className="flex flex-col items-center w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100 transition-all duration-300 gap-4 text-gray-800"
            >
                {/* الرأس الفخم والخط الأنيق */}
                <div className="flex flex-col items-center gap-1 mb-4">
                    <p className="prata-regular text-3xl font-medium tracking-wide text-gray-900">{currentState}</p>
                    <div className="h-[2px] w-12 bg-black rounded-full mt-1 animate-pulse" />
                </div>

                {/* حقل الاسم (يظهر بنعومة في الـ Sign Up فقط) */}
                {currentState !== "Login" && (
                    <div className="w-full space-y-1 animate-fade-in">
                        <label className="text-xs font-semibold text-gray-500 tracking-wide uppercase">Full Name</label>
                        <input
                            onChange={(e)=>setName(e.target.value)}
                            value={name}
                            type="text"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none bg-gray-50/50 focus:bg-white focus:border-black focus:ring-1 focus:ring-black/10 transition-all duration-200 placeholder:text-gray-400 font-light"
                            placeholder="Omar Kamal"
                            required
                        />
                    </div>
                )}

                {/* حقل الإيميل */}
                <div className="w-full space-y-1">
                    <label className="text-xs font-semibold text-gray-500 tracking-wide uppercase">Email Address</label>
                    <input
                        type="email"
                        onChange={(e)=>setEmail(e.target.value)}
                        value={email}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none bg-gray-50/50 focus:bg-white focus:border-black focus:ring-1 focus:ring-black/10 transition-all duration-200 placeholder:text-gray-400 font-light"
                        placeholder="your@email.com"
                        required
                    />
                </div>

                {/* حقل الباسورد */}
                <div className="w-full space-y-1">
                    <label className="text-xs font-semibold text-gray-500 tracking-wide uppercase">Password</label>
                    <input 
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none bg-gray-50/50 focus:bg-white focus:border-black focus:ring-1 focus:ring-black/10 transition-all duration-200 placeholder:text-gray-400 font-light" 
                        placeholder="••••••••" 
                        required 
                        type="password" 
                        autoComplete="current-password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {/* روابط التبديل ونسيان كلمة السر بتوزيع شيك ونظيف */}
                <div className="w-full flex justify-between items-center text-xs font-medium mt-1">
                    <p 
                        onClick={() => navigate('/forgot-password')} 
                        className="cursor-pointer text-gray-400 hover:text-black transition-colors"
                    >
                        Forgot password?
                    </p>

                    {currentState === "Login" ? (
                        <p
                            onClick={() => setCurrentState("Sign Up")}
                            className="cursor-pointer text-blue-600 hover:text-blue-800 transition-colors font-bold bg-blue-50/50 px-2.5 py-1 rounded-lg"
                        >
                            Create an account
                        </p>
                    ) : (
                        <p
                            onClick={() => setCurrentState("Login")}
                            className="cursor-pointer text-gray-500 hover:text-black transition-colors font-bold bg-gray-100 px-2.5 py-1 rounded-lg"
                        >
                            Login Here
                        </p>
                    )}
                </div>
                
                {/* زرار الإرسال الفخم العريض بعزل شادو تفاعلي وحركة ناعمة عند الضغط */}
                <button 
                    disabled={loading} 
                    className="w-full bg-black hover:bg-gray-900 text-white font-medium py-3 rounded-xl mt-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-200"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Processing...</span>
                        </>
                    ) : (
                        currentState === "Login" ? "Sign In" : "Sign Up"
                    )}
                </button>
            </form>
        </div>
    );
};

export default Login;