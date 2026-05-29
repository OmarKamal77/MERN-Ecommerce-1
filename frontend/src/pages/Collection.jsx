import React, { useContext, useEffect, useState } from "react";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import ProductItem from "../components/ProductItem";
import ProductSkeleton from "../components/ProductSkeleton"; // 🌟 استيراد الـ Skeleton الجديد اللّي عملناه

const Collection = () => {
    const { products, search, showSearch } = useContext(ShopContext);
    const [showFilter, setShowFilter] = useState(false);
    const [filterProducts, setFilterProducts] = useState([]);
    
    const [category, setCategory] = useState([]);
    const [subCategory, setSubCategory] = useState([]);
    const [sortType, setSortType] = useState("relavent");

    // التحكم في الصفحات (Pagination)
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;

    // 🌟 التحديث الجديد: الـ State المسؤول عن تشغيل الـ Skeleton Loader طول ما الداتا لسه بتفتح
    const [isLoading, setIsLoading] = useState(true);

    const toggleCategory = (e) => {
        if (category.includes(e.target.value)) {
            setCategory((prev) => prev.filter((item) => item !== e.target.value));
        } else {
            setCategory((prev) => [...prev, e.target.value]);
        }
    };

    const toggleSubCategory = (e) => {
        if (subCategory.includes(e.target.value)) {
            setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
        } else {
            setSubCategory((prev) => [...prev, e.target.value]);
        }
    };

    // 🌟 التحديث الجديد: أول ما المنتجات تيجي من الـ Context بنقفل الـ Skeleton فوراً
    useEffect(() => {
        if (products && products.length > 0) {
            setIsLoading(false);
        }
    }, [products]);

    // ماسورة البيانات الذكية المحدثة بترتيب الظهور الجديد
    useEffect(() => {
        let productsCopy = products.slice();

        // 1. فحص البحث
        if (showSearch && search) {
            productsCopy = productsCopy.filter((item) =>
                item.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        // 2. فحص فلاتر الـ CATEGORY (Men, Women, Kids)
        if (category.length > 0) {
            productsCopy = productsCopy.filter((item) => {
                const catItem = item.category.toLowerCase();
                return category.some((selectedCat) => {
                    if (selectedCat === "Men") return catItem.includes("men") && !catItem.includes("women");
                    if (selectedCat === "Women") return catItem.includes("women") || catItem.includes("dress") || catItem.includes("lingerie") || catItem.includes("undergarments");
                    if (selectedCat === "Kids") return catItem.includes("kids") || catItem.includes("boy") || catItem.includes("girls") || catItem.includes("kid");
                    return false;
                });
            });
        }

        // 3. فحص فلاتر الـ PRODUCT TYPE
        if (subCategory.length > 0) {
            productsCopy = productsCopy.filter((item) => {
                const catItem = item.category.toLowerCase();
                const subItem = item.subCategory.toLowerCase();
                
                return subCategory.some((selectedType) => {
                    if (selectedType === "Tops") {
                        return catItem.includes("tops") || catItem.includes("t-shirt") || catItem.includes("shirt") || catItem.includes("button-up") || catItem.includes("knitwear") || subItem.includes("topwear");
                    }
                    if (selectedType === "Bottoms") {
                        return catItem.includes("pants") || catItem.includes("trousers") || catItem.includes("shorts") || catItem.includes("skirts") || catItem.includes("denim") || subItem.includes("bottom");
                    }
                    if (selectedType === "Outerwear") {
                        return catItem.includes("coats") || catItem.includes("jackets") || catItem.includes("outerwear") || catItem.includes("cardigans") || catItem.includes("vests") || subItem.includes("winterwear");
                    }
                    if (selectedType === "Dresses") {
                        return catItem.includes("dresses") || catItem.includes("dress") || catItem.includes("jumpsuits");
                    }
                    if (selectedType === "Accessories") {
                        return catItem.includes("bags") || catItem.includes("shoes") || catItem.includes("bracelets") || catItem.includes("rings") || catItem.includes("earrings") || catItem.includes("necklaces") || catItem.includes("belts") || catItem.includes("scarves") || catItem.includes("hats") || catItem.includes("socks") || subItem.includes("accessories") || catItem.includes("accessories") || catItem.includes("unisex");
                    }
                    return false;
                });
            });
        }

        // 4. تطبيق الترتيب (Sorting)
        if (sortType === "low-high") {
            productsCopy.sort((a, b) => a.price - b.price);
        } else if (sortType === "high-low") {
            productsCopy.sort((a, b) => b.price - a.price);
        } else if (sortType === "relavent" && category.length === 0) {
            productsCopy.sort((a, b) => {
                const aCat = a.category.toLowerCase();
                const bCat = b.category.toLowerCase();
                
                const aIsMen = aCat.includes("men") && !aCat.includes("women");
                const bIsMen = bCat.includes("men") && !bCat.includes("women");
                
                if (aIsMen && !bIsMen) return -1;
                if (!aIsMen && bIsMen) return 1;
                return 0;
            });
        }

        setFilterProducts(productsCopy);
    }, [category, subCategory, search, showSearch, products, sortType]);

    // تعيين الصفحة لـ 1 عند تغيير الفلاتر
    useEffect(() => {
        setCurrentPage(1);
    }, [category, subCategory, search, showSearch, sortType]);

    // التأثير السحري: إجبار الشاشة تطلع فوق بنعومة فوراً عند تقليب الصفحات (Pagination)
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentPage]);

    // حسابات الـ Pagination
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filterProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filterProducts.length / productsPerPage);

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);
            if (currentPage <= 2) end = 3;
            else if (currentPage >= totalPages - 1) start = totalPages - 2;
            if (start > 2) pages.push("...");
            for (let i = start; i <= end; i++) pages.push(i);
            if (end < totalPages - 1) pages.push("...");
            pages.push(totalPages);
        }
        return pages;
    };

    return (
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t w-full max-w-7xl mx-auto px-4 overflow-hidden">
            
            {/* القائمة الجانبية للفلاتر */}
            <div className="min-w-60 sm:w-64">
                <p
                    onClick={() => setShowFilter(!showFilter)}
                    className="my-2 text-xl flex items-center cursor-pointer gap-2 font-medium text-gray-800"
                >
                    FILTERS
                    <img
                        src={assets.dropdown_icon}
                        className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
                        alt=""
                    />
                </p>

                {/* 1️⃣ فلاتر الـ Categories */}
                <div className={`border border-gray-200 pl-5 py-4 mt-6 ${showFilter ? "" : "hidden"} sm:block bg-white rounded-sm shadow-sm`}>
                    <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">Categories</p>
                    <div className="flex flex-col gap-2.5 text-sm font-medium text-gray-700">
                        {["Men", "Women", "Kids"].map((cat) => (
                            <label key={cat} className="flex gap-3 items-center cursor-pointer hover:text-black transition-colors">
                                <input type="checkbox" className="w-4 h-4 accent-black rounded cursor-pointer" value={cat} checked={category.includes(cat)} onChange={toggleCategory} />
                                <span>{cat}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* 2️⃣ فلاتر الـ Product Type */}
                <div className={`border border-gray-200 pl-5 py-4 my-5 ${showFilter ? "" : "hidden"} sm:block bg-white rounded-sm shadow-sm`}>
                    <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">Product Type</p>
                    <div className="flex flex-col gap-2.5 text-sm font-medium text-gray-700">
                        {[
                            { id: "Tops", label: "Tops & Shirts" },
                            { id: "Bottoms", label: "Pants & Bottoms" },
                            { id: "Outerwear", label: "Jackets & Coats" },
                            { id: "Dresses", label: "Dresses & Jumpsuits" },
                            { id: "Accessories", label: "Shoes & Accessories" }
                        ].map((type) => (
                            <label key={type.id} className="flex gap-3 items-center cursor-pointer hover:text-black transition-colors">
                                <input type="checkbox" className="w-4 h-4 accent-black rounded cursor-pointer" value={type.id} checked={subCategory.includes(type.id)} onChange={toggleSubCategory} />
                                <span>{type.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* الجانب الأيمن وعرض المنتجات */}
            <div className="flex-1 w-full">
                <div className="flex justify-between text-base sm:text-2xl mb-6 items-center">
                    <Title text1={"ALL"} text2={"COLLECTION"} />
                    
                    <select
                        onChange={(e) => setSortType(e.target.value)}
                        value={sortType}
                        className="border border-gray-300 rounded-sm text-sm p-2 bg-white font-medium text-gray-700 cursor-pointer outline-none hover:border-black transition-colors"
                    >
                        <option value="relavent">Sort by: Relevant</option>
                        <option value="low-high">Sort by: Price: Low to High</option>
                        <option value="high-low">Sort by: Price: High to Low</option>
                    </select>
                </div>
                
                {/* 🌟 شبكة العرض الذكية: تعرض الـ Skeletons الرمادية المتموجة أثناء التحميل، والمنتجات الحقيقية أول ما تجهز */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 gap-y-6 w-full">
                    {isLoading ? (
                        Array(8).fill("").map((_, idx) => <ProductSkeleton key={idx} />)
                    ) : (
                        currentProducts.map((item, index) => (
                            <ProductItem key={index} id={item._id} name={item.name} image={item.image} price={item.price} />
                        ))
                    )}
                </div>

                {/* أزرار الصفحات الذكية - تظهر فقط بعد انتهاء التحميل */}
                {!isLoading && totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-12 pb-10 w-full max-w-full flex-wrap px-2">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 border rounded text-sm bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-all font-medium text-gray-600"
                        >
                            Prev
                        </button>

                        {getPageNumbers().map((page, index) => (
                            <button
                                key={index}
                                onClick={() => typeof page === "number" && setCurrentPage(page)}
                                disabled={page === "..."}
                                className={`px-3 py-1.5 border rounded text-sm transition-all font-medium ${
                                    currentPage === page
                                        ? "bg-black text-white border-black"
                                        : page === "..."
                                        ? "bg-transparent text-gray-400 border-transparent cursor-default"
                                        : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                                }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1.5 border rounded text-sm bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-all font-medium text-gray-600"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Collection;