import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "../components/ProductItem";

const Wishlist = () => {
    // 🌟 استدعاء الداتا والتحكم من الـ Context (مع إضافة navigate)
    const { products, wishlist, toggleWishlist, setWishlist, navigate } = useContext(ShopContext);

    // فلترة المنتجات عشان نجيب اللي متسيفة في المفضلة بس
    const wishlistProducts = products.filter((item) => wishlist.includes(item._id));

    // دالة مسح القائمة بالكامل
    const handleClearAll = () => {
        if (window.confirm("Are you sure you want to clear your entire wishlist?")) {
            if (setWishlist) {
                setWishlist([]); // تفريغ مصفوفة المفضلة فوراً
            } else {
                wishlist.forEach(id => toggleWishlist(id));
            }
        }
    };

    return (
        <div className="border-t pt-14 w-full max-w-7xl mx-auto px-4">
            {/* الجزء العلوي: العنوان + زرار مسح القائمة كلها */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b">
                <div className="flex items-center gap-3">
                    <p className="text-gray-500 text-2xl">
                        YOUR <span className="text-gray-700 font-medium">WISHLIST</span>
                    </p>
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        className="w-6 h-6 fill-red-500 stroke-red-500"
                    >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                </div>

                {/* زرار مسح الكل يظهر فقط لو فيه منتجات */}
                {wishlistProducts.length > 0 && (
                    <button 
                        onClick={handleClearAll}
                        className="text-xs font-medium text-red-500 border border-red-500 px-3 py-1.5 rounded hover:bg-red-50 active:bg-red-100 transition duration-200"
                    >
                        CLEAR ALL
                    </button>
                )}
            </div>

            {/* عرض المنتجات المفضلّة أو حالة الفراغ الأنيقة */}
            {wishlistProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 gap-y-6">
                    {wishlistProducts.map((item, index) => (
                        <div key={index} className="relative group">
                            <ProductItem
                                id={item._id}
                                image={item.image}
                                name={item.name}
                                price={item.price}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                /* 🌟 حالة الفراغ الأنيقة للمفضلة (Upgraded Empty State) */
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    {/* أيقونة قلب لاين رقيقة تعبر عن الفراغ */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-20 h-20 text-gray-300">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                    <p className="text-lg font-medium text-gray-700 mt-5">Your wishlist is empty</p>
                    <p className="text-sm text-gray-400 mt-2 max-w-sm leading-relaxed">
                        Tap the heart icon on any product while browsing to save it here. Build your ultimate wishlist today!
                    </p>
                    <button 
                        onClick={() => navigate("/collection")} 
                        className="bg-black text-white text-xs font-medium tracking-widest uppercase mt-6 px-10 py-3.5 hover:bg-gray-800 transition-all active:scale-95"
                    >
                        Explore Products
                    </button>
                </div>
            )}
        </div>
    );
};

export default Wishlist;