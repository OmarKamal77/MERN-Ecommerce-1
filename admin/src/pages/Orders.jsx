import React, { useEffect, useState } from "react";
import axios from 'axios';
import { backendUrl, currency } from "../App";
import { toast } from 'react-toastify';
import { assets } from "../assets/assets";

// 🌟 الذاكرة السحرية خارج المكون لمنع مسح الأوردرات عند التنقل بين السكاشن
let cachedOrdersList = null;

const Orders = ({ token }) => {
    // إذا كان هناك كاش قديم، يتم عرضه فوراً لإلغاء أي تأخير في الشبكة
    const [orders, setOrders] = useState(cachedOrdersList || []);
    const [loading, setLoading] = useState(!cachedOrdersList);

    const fetchAllOrders = async () => {
        if (!token) {
            return null;
        }
        try {
            const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } }); 
            if (response.data.success) {
                const fetchedOrders = response.data.orders.reverse();
                // تحديث الكاش والـ State بنعومة في الخلفية
                cachedOrdersList = fetchedOrders;
                setOrders(fetchedOrders);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const statusHandler = async (event, orderId) => {
        const nextStatus = event.target.value;
        // 🌟 تكتيك الـ Optimistic UI: حفظ النسخة الأصلية لحمايتها في حال حدوث خطأ بالشبكة
        const originalOrders = [...orders];

        // تحديث حالة الأوردر فوراً في الواجهة والكاش بدون انتظار رد السيرفر
        const updatedOrders = orders.map(order => 
            order._id === orderId ? { ...order, status: nextStatus } : order
        );
        setOrders(updatedOrders);
        cachedOrdersList = updatedOrders;

        try {
            const response = await axios.post(
                backendUrl + '/api/order/status', 
                { orderId, status: nextStatus }, 
                { headers: { token } }
            );
            
            if (response.data.success) {
                toast.success("Status Updated");
                // تحديث تأكيدي صامت في الخلفية لضمان المزامنة بدون جلب عطل للشاشة
                fetchAllOrders(); 
            } else {
                toast.error(response.data.message);
                // التراجع عن التعديل فوراً إذا رفض السيرفر الطلب
                setOrders(originalOrders);
                cachedOrdersList = originalOrders;
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
            // التراجع عن التعديل في حال انقطاع اتصال الإنترنت
            setOrders(originalOrders);
            cachedOrdersList = originalOrders;
        }
    };

    useEffect(() => {
        fetchAllOrders();
    }, [token]);

    // 🌟 الـ Skeleton Loader الأنيق لصفحة الأوردرات أثناء التحميل لأول مرة فقط
    if (loading) {
        return (
            <div className="p-4 w-full max-w-6xl animate-pulse space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
                <div className="h-32 bg-gray-200 rounded-xl"></div>
                <div className="h-32 bg-gray-200 rounded-xl"></div>
                <div className="h-32 bg-gray-200 rounded-xl"></div>
            </div>
        );
    }

    return (
        <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Order Page</h3>
            <div>
                {orders.length === 0 ? (
                    <p className="text-center text-gray-500 py-10 font-medium">No orders available.</p>
                ) : (
                    orders.map((order, index) => (
                        <div className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700 bg-white rounded-xl shadow-sm" key={index}>
                            <img className="w-12" src={assets.parcel_icon} alt="" />
                            <div>
                                <div>
                                    {order.items.map((item, idx) => {
                                        if (idx === order.items.length - 1) {
                                            return <p className="py-0.5 font-medium" key={idx}> {item.name} x {item.quantity} <span className="text-gray-400">({item.size})</span> </p>
                                        } else {
                                            return <p className="py-0.5 font-medium" key={idx}> {item.name} x {item.quantity} <span className="text-gray-400">({item.size})</span> ,</p>
                                        }
                                    })}
                                </div>
                                <p className="mt-3 mb-1 font-semibold text-gray-900">{order.address.firstName + " " + order.address.lastName}</p>
                                <div className="text-gray-500 space-y-0.5">
                                    <p>{order.address.street + ","}</p>
                                    <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
                                </div>
                                <p className="mt-2 text-gray-600 font-medium">{order.address.phone}</p>
                            </div>
                            <div className="space-y-1 text-gray-600">
                                <p className="text-sm sm:text-[15px] font-medium text-gray-800">Items : {order.items.length}</p>
                                <p className="mt-3">Method : {order.paymentMethod}</p>
                                <p>Payment : <span className={`font-medium ${order.payment ? 'text-green-600' : 'text-amber-600'}`}>{order.payment ? 'Done' : 'Pending'}</span></p>
                                <p>Date : {new Date(order.date).toLocaleDateString()}</p>
                            </div>
                            <p className="text-sm sm:text-[15px] font-bold text-gray-900">{currency}{order.amount}</p>
                            <select 
                                onChange={(event) => statusHandler(event, order._id)} 
                                value={order.status} 
                                className="p-2 font-semibold border border-gray-300 bg-gray-50 rounded-lg outline-none cursor-pointer hover:border-black transition-colors"
                            >
                                <option value="Order Placed">Order Placed</option>
                                <option value="Packing">Packing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Out for delivery">Out for delivery</option>
                                <option value="Delivered">Delivered</option>
                            </select>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Orders;