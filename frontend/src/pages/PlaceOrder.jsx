import React, { useContext, useState, useEffect } from "react"; 
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";

const PlaceOrder = () => {
    // 🌟 استدعاء clearCart بدلاً من التلاعب بالـ State مباشرة
    const { navigate, backendUrl, token, orderItems, clearCart, getCartAmount, delivery_fee, products, cartItems } = useContext(ShopContext);
    
    const [method, setMethod] = useState("cod");
    const [formData ,setFormData] = useState({
        firstName:"",
        lastName:"",
        email:"",
        street:"",
        city:"",
        state:"",
        zipcode:"",
        country:"",
        phone:""
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token) {
            toast.error("Please login to proceed to checkout");
            navigate('/login');
        }
    }, [token]);

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setFormData(data => ({ ...data, [name]: value }));
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setLoading(true); 
        
        try {
            let orderItems = [];
            
            for (const items in cartItems) {
                for (const item in cartItems[items]) {
                    if (cartItems[items][item] > 0) {
                        const itemInfo = structuredClone(products.find(product => product._id === items));
                        if (itemInfo) {
                            itemInfo.size = item;
                            itemInfo.quantity = cartItems[items][item];
                            orderItems.push(itemInfo);
                        }
                    }
                }
            }
            
            let orderData = {
                address: formData,
                items: orderItems,
                amount: getCartAmount() + delivery_fee,
                paymentMethod: method
            };

            switch (method) {
                case 'cod':
                    const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } });
                    if (response.data.success) {
                        clearCart(); // 🌟 استخدام دالة التصفير المركزية المأمنة
                        toast.success("Order Placed Successfully!");
                        navigate('/orders');
                    } else {
                        toast.error(response.data.message);
                    }
                    break;

                case 'stripe':
                    const responseStripe = await axios.post(backendUrl + '/api/order/stripe', orderData, { headers: { token } });
                    if (responseStripe.data.success) {
                        const { session_url } = responseStripe.data;
                        window.location.replace(session_url);
                    } else {
                        toast.error(responseStripe.data.message);
                    }
                    break;

                default:
                    break;
            }
            
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setLoading(false); 
        }
    };

    // كلاس موحد مجهز بالكامل لمنح الـ Inputs شكلاً فخماً يطابق لوحة الأدمن
    const inputStyle = "w-full border border-gray-200 text-sm rounded-lg p-2.5 bg-gray-50 text-gray-700 font-medium outline-none focus:border-black focus:bg-white transition-all";

    return (
        <form onSubmit={onSubmitHandler} className="flex flex-col lg:flex-row justify-between gap-10 pt-5 sm:pt-14 min-h-[80vh] border-t max-w-7xl mx-auto px-4 w-full">
            
            {/* -------------------------- Left Side (Delivery Info) ----------------------- */}
            <div className="flex flex-col gap-4 w-full lg:max-w-[480px]">
                <div className="text-xl sm:text-2xl my-3">
                    <Title text1={"DELIVERY"} text2={"INFORMATION"} />
                </div>
                <div className="flex gap-3">
                    <input required onChange={onChangeHandler} name="firstName" value={formData.firstName} className={inputStyle} placeholder="First name" type="text" />
                    <input required onChange={onChangeHandler} name="lastName" value={formData.lastName} className={inputStyle} placeholder="Last name" type="text" />
                </div>
                <input required onChange={onChangeHandler} name="email" value={formData.email} className={inputStyle} placeholder="Email address" type="email" />
                <input required onChange={onChangeHandler} name="street" value={formData.street} className={inputStyle} placeholder="Street Address" type="text" />
                <div className="flex gap-3">
                    <input required onChange={onChangeHandler} name="city" value={formData.city} className={inputStyle} placeholder="City" type="text" />
                    <input required onChange={onChangeHandler} name="state" value={formData.state} className={inputStyle} placeholder="State" type="text" />
                </div>
                <div className="flex gap-3">
                    <input required onChange={onChangeHandler} name="zipcode" value={formData.zipcode} className={inputStyle} placeholder="Zipcode" type="number" />
                    <input required onChange={onChangeHandler} name="country" value={formData.country} className={inputStyle} placeholder="Country" type="text" />
                </div>
                <input required onChange={onChangeHandler} name="phone" value={formData.phone} className={inputStyle} placeholder="Phone Number" type="number" />
            </div>

            {/*------------------------------ Right Side (Payment & Total) -------------------------------------- */}
            <div className="flex-1 lg:max-w-[500px] w-full">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <CartTotal />
                </div>
                
                <div className="mt-10">
                    <Title text1={"PAYMENT"} text2={"METHOD"} />
                    
                    {/* بطاقات اختيار الدفع المحدثة كلياً لتكون تفاعلية ومودرن بامتياز */}
                    <div className="flex gap-3 flex-col sm:flex-row mt-4">
                        
                        {/* خيار الـ Stripe */}
                        <div
                            onClick={() => !loading && setMethod("stripe")}
                            className={`flex items-center gap-3 border p-3 px-4 rounded-xl cursor-pointer transition-all flex-1 ${
                                method === "stripe" ? "border-black bg-gray-50 shadow-sm" : "border-gray-200 hover:bg-gray-50/50"
                            }`}
                        >
                            <div className={`w-4 h-4 border rounded-full flex items-center justify-center transition-all ${method === "stripe" ? "border-black" : "border-gray-300"}`}>
                                {method === "stripe" && <div className="w-2 h-2 bg-black rounded-full" />}
                            </div>
                            <img className="h-5 mx-2 object-contain" src={assets.stripe_logo} alt="Stripe" />
                        </div>
                        
                        {/* خيار الـ Cash on Delivery */}
                        <div
                            onClick={() => !loading && setMethod("cod")}
                            className={`flex items-center gap-3 border p-3 px-4 rounded-xl cursor-pointer transition-all flex-1 ${
                                method === "cod" ? "border-black bg-gray-50 shadow-sm" : "border-gray-200 hover:bg-gray-50/50"
                            }`}
                        >
                            <div className={`w-4 h-4 border rounded-full flex items-center justify-center transition-all ${method === "cod" ? "border-black" : "border-gray-300"}`}>
                                {method === "cod" && <div className="w-2 h-2 bg-black rounded-full" />}
                            </div>
                            <p className="text-gray-600 text-xs font-bold uppercase tracking-wider mx-2">
                                Cash On Delivery
                            </p>
                        </div>
                    </div>
                    
                    {/* زرار تاكيد الطلب الحركي الفخم المعزز بمؤشر التحميل */}
                    <div className="w-full text-end mt-8">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-auto bg-gray-800 hover:bg-black text-white font-semibold tracking-wider text-xs uppercase px-12 py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[220px] sm:ml-auto"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>PLACING ORDER...</span>
                                </>
                            ) : (
                                "PLACE ORDER"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default PlaceOrder;