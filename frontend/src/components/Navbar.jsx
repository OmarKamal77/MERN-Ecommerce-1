import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
    const [visible, setVisible] = useState(false);
    const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems } = useContext(ShopContext);

    const logout = () => {
        navigate('/login');
        sessionStorage.removeItem('token');
        setToken('');
        setCartItems({});
    };

    return (
        /* 🌟 التعديل السحري: استخدام sticky top-0 لكي يقعد في مكانه الطبيعي أول ما الصفحة تفتح وميغطيش على الصورة، ولما تعمل سكرول يتحرك معاك فوق السكاشن بثبات كامل */
        <div className="sticky top-0 left-0 w-full z-50 bg-white border-b border-gray-100 shadow-sm">
            {/* الحاوية الداخلية: متناسقة بالملّي مع أبعاد الـ Padding الأساسية للموقع */}
            <div className="flex items-center justify-between py-4 font-medium w-full max-w-7xl mx-auto px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
                
                {/* Logo */}
                <Link to="/">
                    <img src={assets.logo} className="w-28 sm:w-36 transition-transform duration-300 hover:scale-105" alt="Logo" />
                </Link>

                {/* الروابط الأساسية للشاشات الكبيرة */}
                <ul className="hidden sm:flex gap-5 text-sm text-gray-700 font-medium">
                    {["/", "/collection", "/about", "/contact"].map((path, idx) => {
                        const labels = ["HOME", "COLLECTION", "ABOUT", "CONTACT"];
                        return (
                            <NavLink 
                                key={path}
                                to={path} 
                                className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors duration-300 ${isActive ? 'text-black font-semibold' : 'text-gray-500 hover:text-black'}`}
                            >
                                <p>{labels[idx]}</p>
                                <span className="w-2/4 h-[2px] bg-black rounded-full scale-0 transition-transform duration-300 ease-in-out [.active_&]:scale-100" />
                            </NavLink>
                        );
                    })}
                </ul>
                
                {/* منطقة الأيقونات والأزرار */}
                <div className="flex items-center gap-3 sm:gap-6 flex-wrap justify-end">
                    
                    {/* 1️⃣ Search Icon */}
                    <div className="group relative flex flex-col items-center">
                        <img
                            onClick={() => setShowSearch(prev => !prev)}
                            src={assets.search_icon}
                            className="w-5 cursor-pointer hover:scale-110 transition-transform duration-300 ease-in-out"
                            alt="search"
                        />
                        <span className="absolute top-full mt-3 hidden md:group-hover:block bg-black text-white text-[10px] font-normal px-2 py-0.5 rounded shadow-lg whitespace-nowrap z-50 left-1/2 -translate-x-1/2">
                            Search
                        </span>
                    </div>
                    
                    {/* 2️⃣ Profile Icon OR Login Button */}
                    {token ? (
                        <div className="group/profile relative flex flex-col items-center">
                            <img
                                src={assets.profile_icon}
                                className="w-5 cursor-pointer hover:scale-110 transition-transform duration-300 ease-in-out"
                                alt="profile"
                            />
                            <span className="absolute bottom-full mb-3 hidden md:group-hover/profile:block bg-black text-white text-[10px] font-normal px-2 py-0.5 rounded shadow-lg whitespace-nowrap z-50 left-1/2 -translate-x-1/2">
                                Profile
                            </span>
                            
                            {/* Dropdown Menu */}
                            <div className="group-hover/profile:block hidden absolute dropdown-menu right-0 pt-4 top-full z-50">
                                <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded shadow-md border border-gray-200">
                                    <p onClick={() => navigate('/profile')} className="cursor-pointer hover:text-black transition-colors duration-300 font-medium">
                                        My Profile
                                    </p>
                                    <p onClick={() => navigate('/orders')} className="cursor-pointer hover:text-black transition-colors duration-300 font-medium">
                                        Orders
                                    </p>
                                    <p onClick={logout} className="cursor-pointer hover:text-red-600 transition-colors duration-300 font-medium border-t pt-1 mt-1">
                                        Logout
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <button 
                            onClick={() => navigate('/login')} 
                            className="bg-black text-white px-3 sm:px-4 py-1.5 text-[10px] sm:text-xs font-medium rounded hover:bg-gray-800 transition-all duration-300 uppercase tracking-wider shadow-sm active:scale-95"
                        >
                            Login
                        </button>
                    )}

                    {/* 3️⃣ Wishlist Icon */}
                    <Link to="/wishlist" className="relative group flex flex-col items-center">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            strokeWidth={1.5} 
                            stroke="currentColor" 
                            className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 cursor-pointer hover:scale-110 transition-transform duration-300 ease-in-out"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.116 60.116 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" fill="white" d="M11.25 9.75c0-.966.784-1.75 1.75-1.75s1.75.784 1.75 1.75c0 .717-.37 1.348-.925 1.63L13 12.5l-.825-.87c-.555-.282-.925-.913-.925-1.63Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" fill="currentColor" className="text-gray-700" d="M15.25 7.5c-.88 0-1.604.51-1.95 1.21-.346-.7-.104-1.21-.984-1.21-1.12 0-2.066.98-2.066 2.13 0 1.63 2.112 3.2 3.05 3.87.938-.67 3.05-2.24 3.05-3.87 0-1.15-.946-2.13-2.066-2.13Z" />
                        </svg>
                        <span className="absolute top-full mt-3 hidden md:group-hover:block bg-black text-white text-[10px] font-normal px-2 py-0.5 rounded shadow-lg whitespace-nowrap z-50 left-1/2 -translate-x-1/2">
                            Wishlist
                        </span>
                    </Link>

                    {/* 4️⃣ Cart Icon */}
                    <Link to="/cart" className="relative group flex flex-col items-center">
                        <img
                            src={assets.cart_icon}
                            className="w-5 min-w-5 hover:scale-110 transition-transform duration-300 ease-in-out"
                            alt="cart"
                        />
                        <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px] pointer-events-none transition-transform duration-300 group-hover:scale-110">
                            {getCartCount()}
                        </p>
                        <span className="absolute top-full mt-3 hidden md:group-hover:block bg-black text-white text-[10px] font-normal px-2 py-0.5 rounded shadow-lg whitespace-nowrap z-50 left-1/2 -translate-x-1/2">
                            Cart
                        </span>
                    </Link>
                    
                    {/* Mobile Menu Icon */}
                    <img
                        onClick={() => setVisible(true)}
                        src={assets.menu_icon}
                        className="w-5 cursor-pointer sm:hidden hover:scale-110 transition-transform duration-300 ml-1"
                        alt="menu"
                    />
                </div>
                
                {/* Sidebar Menu for small screens */}
                <div className={`fixed top-0 right-0 bottom-0 h-screen bg-white transition-all duration-300 ease-in-out z-50 overflow-y-auto ${visible ? "w-full" : "w-0"}`}>
                    <div className="flex flex-col text-gray-600 font-medium">
                        <div onClick={() => setVisible(false)} className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-300 border-b">
                            <img src={assets.dropdown_icon} className="h-4 rotate-180" alt="" />
                            <p className="font-bold text-gray-800">Back</p>
                        </div>
                        <NavLink onClick={() => setVisible(false)} className="py-3.5 pl-6 border-b hover:bg-gray-50 transition-colors duration-300" to="/">HOME</NavLink>
                        <NavLink onClick={() => setVisible(false)} className="py-3.5 pl-6 border-b hover:bg-gray-50 transition-colors duration-300" to="/collection">COLLECTION</NavLink>
                        <NavLink onClick={() => setVisible(false)} className="py-3.5 pl-6 border-b hover:bg-gray-50 transition-colors duration-300" to="/about">ABOUT</NavLink>
                        <NavLink onClick={() => setVisible(false)} className="py-3.5 pl-6 border-b hover:bg-gray-50 transition-colors duration-300" to="/contact">CONTACT</NavLink>
                        <NavLink onClick={() => setVisible(false)} className="py-3.5 pl-6 border-b hover:bg-gray-50 text-red-500 font-semibold transition-colors duration-300" to="/wishlist">WISHLIST ❤️</NavLink>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;