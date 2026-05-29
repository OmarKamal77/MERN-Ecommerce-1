import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, price }) => {
    const { currency, wishlist, toggleWishlist } = useContext(ShopContext);
    const isFavorite = wishlist ? wishlist.includes(id) : false;

    return (
        // 🌟 لمسة بريميوم: إضافة تأثير الـ Hover Lift الفخم (hover:-translate-y-1) وتنعيم حركة الكارت بالكامل
        <div className="relative group border rounded-sm bg-white shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 ease-in-out overflow-hidden">
            {/* زرار القلب */}
            <div 
                onClick={(e) => {
                    e.preventDefault();   
                    e.stopPropagation();  
                    toggleWishlist(id);   
                }} 
                className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-sm cursor-pointer transition-all duration-300 hover:scale-110 hover:bg-white"
            >
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill={isFavorite ? "red" : "none"} 
                    viewBox="0 0 24 24" 
                    strokeWidth={1.5} 
                    stroke={isFavorite ? "red" : "currentColor"} 
                    className={`w-5 h-5 transition-colors duration-300 ${isFavorite ? "text-red-500" : "text-gray-600 hover:text-black"}`}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
            </div>

            <Link className="text-gray-700 cursor-pointer" to={`/product/${id}`}>
                <div className="w-full aspect-[3/4] overflow-hidden bg-white">
                    <img
                        className="w-full h-full object-cover object-top hover:scale-110 transition-transform ease-in-out duration-300"
                        src={image[0]} 
                        alt={name}
                        loading="lazy" // 🌟 ميزة خارقة لتسريع الموقع: الصورة مش هتحمل إلا لما العميل يقرب منها بالسكرول
                    />
                </div>
                <p className="px-2 pt-3 pb-1 text-sm font-medium truncate transition-colors duration-300 group-hover:text-black">{name}</p>
                <p className="px-2 pb-2 text-sm font-semibold text-gray-900">
                    {currency}{price}
                </p>
            </Link>
        </div>
    );
};

export default ProductItem;