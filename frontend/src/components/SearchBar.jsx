import React, { useContext, useEffect, useState, useRef } from "react"; // 🌟 ضفنا useRef هنا
import { ShopContext } from "../context/ShopContext";
import { assets, products as localProducts } from "../assets/assets"; 
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const SearchBar = () => {
    const { search, setSearch, showSearch, setShowSearch, backendUrl } = useContext(ShopContext);
    const [visible, setVisible] = useState(false);
    const [suggestions, setSuggestions] = useState([]); 
    const location = useLocation();
    const navigate = useNavigate(); 

    // 🌟 عمل مرجع (Ref) عشان نراقب صندوق البحث ونعرف لو الضغطة حصلت بره وجوه
    const searchWrapperRef = useRef(null);

    // التحكم في ظهور حقل البحث بالصفحة
    useEffect(() => {
        if (location.pathname.includes("collection")) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    }, [location]);

    // 🌟 لوجيك الـ Click Outside: إغلاق الاقتراحات عند الضغط في أي مكان خارج صندوق البحث
    useEffect(() => {
        const handleClickOutside = (event) => {
            // لو المرجع موجود والضغطة اللّي حصلت مش جواه (بره المربع)
            if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target)) {
                setSuggestions([]); // إخفاء لستة الاقتراحات فوراً
            }
        };

        // تسجيل الحدث في الـ document
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // تنظيف الحدث عند خروج المكون من الصفحة لأمان الأداء
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // لوجيك جلب الاقتراحات الفورية أثناء الكتابة
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (search.trim() === "") {
                setSuggestions([]);
                return;
            }
            try {
                const response = await axios.get(`${backendUrl}/api/product/suggestions?query=${search}`);
                if (response.data.success) {
                    const cleanSuggestions = response.data.products.map((item) => {
                        if (item.image && item.image[0] && !item.image[0].startsWith("http")) {
                            const localP = localProducts.find((p) =>
                                p.image && p.image.some(img => typeof img === 'string' && img.includes(item.image[0]))
                            );
                            if (localP && localP.image) {
                                return { ...item, image: localP.image }; 
                            }
                        }
                        return item;
                    });

                    setSuggestions(cleanSuggestions);
                }
            } catch (error) {
                console.error("Error fetching suggestions:", error);
            }
        };

        const delayDebounceFn = setTimeout(() => {
            fetchSuggestions();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [search, backendUrl]);

    return showSearch && visible ? (
        <div className="border-t border-b bg-gray-50 text-center py-6 relative z-30">
            
            {/* 🌟 ربطنا الـ Ref بالـ div الشايل الـ input والاقتراحات عشان نقفش أي ضغطة بره النطاق ده */}
            <div 
                ref={searchWrapperRef} 
                className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 mx-3 rounded-full w-3/4 sm:w-1/2 bg-white relative"
            >
                <input
                    type="text"
                    placeholder="Search products..."
                    className="flex-1 outline-none bg-inherit text-sm w-full"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    // 🌟 لوجيك الـ Enter الحاسم والمريح جداً للعميل
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            setSuggestions([]); // إخفاء قائمة الاقتراحات فوراً
                            e.target.blur();    // سحب الفوكس من الـ Input عشان يقفل كيبورد المبايل والـ Focus Ring
                        }
                    }}
                />
                <img className="w-4" src={assets.search_icon} alt="search" />

                {/* قائمة الاقتراحات الفورية الذكية */}
                {suggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto text-left flex flex-col w-full z-50">
                        {suggestions.map((item) => (
                            <div
                                key={item._id}
                                onClick={() => {
                                    setSuggestions([]);      
                                    setSearch("");           
                                    setShowSearch(false);    
                                    navigate(`/product/${item._id}`); 
                                }}
                                className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-0"
                            >
                                <img src={item.image[0]} className="w-10 h-10 object-cover object-top rounded border bg-white" alt={item.name} />
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-800 line-clamp-1">{item.name}</span>
                                    <span className="text-xs text-gray-500 font-semibold">${item.price}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <img
                className="inline w-4 cursor-pointer hover:scale-110 transition-transform"
                src={assets.cross_icon}
                alt="close"
                onClick={() => {
                    setSuggestions([]); 
                    setShowSearch(false);
                }}
            />
        </div>
    ) : null;
};

export default SearchBar;