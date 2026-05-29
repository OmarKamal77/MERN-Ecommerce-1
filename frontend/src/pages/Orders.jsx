import React, { useContext, useState, useEffect } from "react"; 
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { toast } from "react-toastify"; 
import axios from "axios";

const Orders = () => {
    const { backendUrl, token, currency, navigate } = useContext(ShopContext);
    const [orderData, setorderData] = useState([]); 
    
    // 🌟 ستايت ذكي لمراقبة أنهي أوردر العميل فاتح التتبع بتاعه دلوقتي
    const [openTrackerIndex, setOpenTrackerIndex] = useState(null);

    useEffect(() => {
        if (!token) {
            toast.error("Please login to view your orders");
            navigate('/login');
        }
    }, [token, navigate]);

    const loadOrderData = async () => {
        try {
            if (!token) return null;

            const response = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } });
            if (response.data.success) {
                let allOrdersItem = [];
                response.data.orders.map((order) => {
                    order.items.map((item) => {
                        item['status'] = order.status;
                        item['payment'] = order.payment;
                        item['paymentMethod'] = order.paymentMethod;
                        item['date'] = order.date;
                        // نمرر الـ ID بتاع الأوردر الكبير عشان التتبع يكون دقيق
                        item['orderId'] = order._id; 
                        allOrdersItem.push(item);
                    });
                });
                setorderData(allOrdersItem.reverse());
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        loadOrderData();
    }, [token]);

    // 🌟 دالة هندسية ذكية لتحديد مستوى الخطوات بناءً على حالة الأوردر القادمة من الباك إند
    const getStepLevel = (status) => {
        const currentStatus = status ? status.toLowerCase() : "";
        if (currentStatus.includes("delivered")) return 3; // المرحلة الثالثة والأخيرة
        if (currentStatus.includes("shipped")) return 2;   // المرحلة الثانية
        return 1;                                         // المرحلة الأولى (Placed)
    };

    // دالة لفتح وقفل شريط التتبع بنعومة عند الضغط على الزرار
    const toggleTracker = (index) => {
        setOpenTrackerIndex(openTrackerIndex === index ? null : index);
    };

    return (
        <div className="border-t pt-16 max-w-6xl mx-auto px-4">
            <div className="text-2xl mb-6">
                <Title text1={"MY "} text2={"ORDERS"} />
            </div>
            
            <div className="space-y-4">
                {orderData.map((item, index) => {
                    const currentStep = getStepLevel(item.status);
                    const isTrackerOpen = openTrackerIndex === index;

                    return (
                        <div key={index} className="bg-white border border-gray-150 rounded-xl shadow-sm overflow-hidden transition-all duration-300">
                            
                            {/* الصف الأساسي للمنتج */}
                            <div className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-white">
                                <div className="flex items-start gap-6 text-sm flex-1">
                                    <img className="w-20 h-24 object-cover rounded-lg border border-gray-100 shadow-sm" src={item.image[0]} alt="" />
                                    <div className="space-y-1">
                                        <p className="text-base font-semibold text-gray-800 tracking-tight">{item.name}</p>
                                        <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-gray-500">
                                            <p className="text-gray-900 font-bold text-sm">{currency}{item.price}</p>
                                            <span className="text-gray-300">|</span>
                                            <p>Qty: {item.quantity}</p>
                                            <span className="text-gray-300">|</span>
                                            <p className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-bold">Size: {item.size}</p>
                                        </div>
                                        <p className="text-xs text-gray-400 pt-1">
                                            Date: <span className="font-medium text-gray-600">{new Date(item.date).toDateString()}</span>
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            Method: <span className="font-semibold text-gray-600 uppercase text-[10px] bg-gray-50 px-1.5 py-0.5 border rounded">{item.paymentMethod}</span>
                                        </p>
                                    </div>
                                </div>

                                {/* قسم الحالة والزرار التفاعلي */}
                                <div className="md:w-1/2 flex items-center justify-between md:justify-end gap-8 border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
                                    <div className="flex items-center gap-2.5">
                                        {/* الدائرة الملونة الديناميكية حسب الحالة */}
                                        <p className={`w-2.5 h-2.5 rounded-full ${currentStep === 3 ? "bg-green-500 animate-pulse" : currentStep === 2 ? "bg-blue-500 animate-pulse" : "bg-amber-500"}`}></p>
                                        <p className="text-sm font-semibold text-gray-700 capitalize">{item.status}</p>
                                    </div>
                                    
                                    <button 
                                        type="button"
                                        onClick={() => toggleTracker(index)} 
                                        className={`border px-5 py-2 text-xs font-bold rounded-lg transition-all shadow-sm active:scale-95 ${
                                            isTrackerOpen 
                                                ? "bg-black text-white border-black" 
                                                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                                        }`}
                                    >
                                        {isTrackerOpen ? "Hide Tracking" : "Track Order"}
                                    </button>
                                </div>
                            </div>

                            {/* 🌟 شريط التتبع السحري (Horizontal Live Stepper) يفتح بنعومة */}
                            {isTrackerOpen && (
                                <div className="bg-gray-50 border-t border-gray-100 px-6 py-8 animate-fade-in">
                                    <div className="max-w-xl mx-auto relative flex items-center justify-between">
                                        
                                        {/* خط الخلفية الثابت الرمادي */}
                                        <div className="absolute left-0 right-0 top-3.5 h-1 bg-gray-200 -z-0 rounded" />
                                        
                                        {/* خط التحميل الديناميكي الملون المتناسب مع الخطوات */}
                                        <div 
                                            className="absolute left-0 top-3.5 h-1 bg-black transition-all duration-500 rounded" 
                                            style={{ width: currentStep === 1 ? "0%" : currentStep === 2 ? "50%" : "100%" }}
                                        />

                                        {/* الخطوة 1: Placed */}
                                        <div className="flex flex-col items-center z-10">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm transition-all border-2 ${
                                                currentStep >= 1 ? "bg-black text-white border-black" : "bg-white text-gray-400 border-gray-300"
                                            }`}>
                                                ✓
                                            </div>
                                            <p className="text-[11px] font-bold text-gray-800 mt-2 tracking-wide uppercase">Order Placed</p>
                                            <p className="text-[9px] text-gray-400">Confirmed</p>
                                        </div>

                                        {/* الخطوة 2: Shipped */}
                                        <div className="flex flex-col items-center z-10">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm transition-all border-2 ${
                                                currentStep >= 2 
                                                    ? "bg-black text-white border-black" 
                                                    : currentStep === 1 ? "bg-white text-black border-black animate-pulse" : "bg-white text-gray-400 border-gray-300"
                                            }`}>
                                                {currentStep >= 2 ? "✓" : "2"}
                                            </div>
                                            <p className={`text-[11px] font-bold mt-2 tracking-wide uppercase ${currentStep >= 2 ? "text-gray-800" : "text-gray-400"}`}>On The Way</p>
                                            <p className="text-[9px] text-gray-400">Shipped Out</p>
                                        </div>

                                        {/* الخطوة 3: Delivered */}
                                        <div className="flex flex-col items-center z-10">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm transition-all border-2 ${
                                                currentStep === 3 
                                                    ? "bg-green-500 text-white border-green-500" 
                                                    : currentStep === 2 ? "bg-white text-blue-500 border-blue-500 animate-pulse" : "bg-white text-gray-400 border-gray-300"
                                            }`}>
                                                {currentStep === 3 ? "🎉" : "3"}
                                            </div>
                                            <p className={`text-[11px] font-bold mt-2 tracking-wide uppercase ${currentStep === 3 ? "text-green-600 font-extrabold" : "text-gray-400"}`}>Delivered</p>
                                            <p className="text-[9px] text-gray-400">Ready / Handed</p>
                                        </div>

                                    </div>
                                </div>
                            )}

                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Orders;