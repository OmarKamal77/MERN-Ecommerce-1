import React, { useState, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { backendUrl } from "../App"; 
import axios from "axios";

const Navbar = ({ setToken }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0); 
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const token = localStorage.getItem("token") || "";

  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const response = await axios.post(`${backendUrl}/api/order/list`, {}, { headers: { token } });
      if (response.data.success) {
        const orders = response.data.orders || [];
        
        const currentCount = orders.length;
        setTotalOrders(currentCount); 

        const latestOrders = [...orders].reverse().slice(0, 5); 

        const lastSeenCount = parseInt(localStorage.getItem("admin_last_seen_orders_count") || "0");

        let calculatedUnread = 0;
        if (currentCount > lastSeenCount) {
          calculatedUnread = currentCount - lastSeenCount;
        }

        // 🌟 سطر كاشف العيوب: هيطبع لك في الـ Console الحسبة بالظبط عشان نعرف العيب فين
        console.log(`🔔 جرس الإشعارات -> الإجمالي بالسيرفر: ${currentCount} | آخر عدد شوفته: ${lastSeenCount} | الطلبات الجديدة: ${calculatedUnread}`);

        setUnreadCount(calculatedUnread);
        setNotifications(latestOrders);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000); 
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    localStorage.setItem("admin_last_seen_orders_count", totalOrders.toString()); 
    setUnreadCount(0);
    setShowDropdown(false);
  };

  return (
    <div className="flex items-center py-3.5 px-[4%] justify-between bg-white border-b border-gray-100 shadow-sm relative z-50">
      
      <img 
        className="w-36 sm:w-44 max-h-16 object-contain mix-blend-multiply" 
        src={assets.logo} 
        alt="Logo" 
      />
      
      <div className="flex items-center gap-5 sm:gap-6" ref={dropdownRef}>
        
        {/* 🔔 أيقونة الجرس */}
        <div 
          className="relative cursor-pointer p-2 rounded-full hover:bg-gray-50 transition-colors z-10" 
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6 text-gray-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>

          {/* 🔴 النقطة الحمراء المأمنة هندسياً جوه الـ Padding ومستحيل تختفي لو الـ unreadCount أكبر من 0 */}
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-2.5 w-2.5 z-50">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border border-white"></span>
            </span>
          )}
        </div>

        {/* قائمة الإشعارات المنسدلة */}
        {showDropdown && (
          <div className="absolute right-[12%] top-16 w-80 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-fade-in flex flex-col z-50">
            <div className="p-3.5 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Recent Orders</h4>
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="text-[10px] text-blue-600 font-bold hover:underline">
                  Mark as read
                </button>
              )}
            </div>

            <div className="max-h-64 overflow-y-auto divide-y divide-gray-50">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-xs text-gray-400">
                  No store activities captured yet.
                </div>
              ) : (
                notifications.map((order, idx) => (
                  <div key={idx} className="p-3 hover:bg-gray-50/80 transition-colors flex items-start gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                    <div className="flex-1 space-y-0.5">
                      <p className="text-xs font-semibold text-gray-800">New Order Placed!</p>
                      <p className="text-[11px] text-gray-400 font-medium">
                        Amount: <span className="text-gray-900 font-bold">${order.amount}</span> | Items: {order.items?.length || 0}
                      </p>
                      <p className="text-[9px] text-gray-300">
                        {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(order.date).toDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <button 
          onClick={() => {
            localStorage.removeItem("admin_last_seen_orders_count");
            setToken('');
          }} 
          className="bg-gray-800 hover:bg-black text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all shadow-sm active:scale-95"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;