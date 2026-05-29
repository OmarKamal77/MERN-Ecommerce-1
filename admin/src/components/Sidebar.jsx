import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const Sidebar = () => {
    // 🌟 دالة ذكية لتوليد ستايل التبويب النشط (Active Tab) بنعومة وبدون تكرار كود
    const navLinkStyles = ({ isActive }) => 
        `flex items-center gap-3 pl-6 py-3 rounded-l-xl font-medium text-sm transition-all duration-200 border-y border-l -mr-[2px] relative ${
            isActive 
                ? "bg-gray-50 text-black border-gray-200 border-r-white z-10 font-bold shadow-sm" 
                : "bg-transparent text-gray-500 border-transparent hover:text-gray-900 hover:pl-7"
        }`;

    return (
        // تظبيط حافة السايدبار الخارجية لتكون ناعمة ومتناسقة مع النافبار
        <div className="w-[18%] min-h-screen border-r border-gray-100 bg-white pt-6 pl-[2%] relative">
            <div className="flex flex-col gap-2.5">
                
                {/* 1️⃣ Dashboard */}
                <NavLink className={navLinkStyles} to="/">
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        strokeWidth={2} 
                        stroke="currentColor" 
                        className="w-5 h-5 transition-colors"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
                    </svg>
                    <p className="hidden md:block tracking-wide">Dashboard</p>
                </NavLink>

                {/* 2️⃣ Add Items */}
                <NavLink className={navLinkStyles} to="/add">
                    <img className="w-5 h-5 object-contain" src={assets.add_icon} alt="" />
                    <p className="hidden md:block tracking-wide">Add Items</p>
                </NavLink>
                
                {/* 3️⃣ List Items */}
                <NavLink className={navLinkStyles} to="/list">
                    <img className="w-5 h-5 object-contain" src={assets.order_icon} alt="" />
                    <p className="hidden md:block tracking-wide">List Items</p>
                </NavLink>
                
                {/* 4️⃣ Orders */}
                <NavLink className={navLinkStyles} to="/orders">
                    <img className="w-5 h-5 object-contain" src={assets.order_icon} alt="" />
                    <p className="hidden md:block tracking-wide">Orders</p>
                </NavLink>

            </div>
        </div>
    );
};

export default Sidebar;