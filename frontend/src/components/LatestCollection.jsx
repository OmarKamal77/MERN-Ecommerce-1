import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
import ProductSkeleton from './ProductSkeleton'; // 🌟 استيراد الـ Skeleton الجديد

const LatestCollection = () => {
    const { products } = useContext(ShopContext);
    const [latestProducts, setLatestProducts] = useState([]);
    
    // 🌟 تراك ذكي لحالة التحميل لمنع الشاشة البيضاء في الصفحة الرئيسية
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (products && products.length > 0) {
            setIsLoading(false); // إيقاف السكيلتون فوراً عند وصول المنتجات
            
            // 1. 🌟 فلتر الأمان الصارم: طرد أي منتجات مكشوفة تماماً من الصفحة الرئيسية
            let safeProducts = products.filter((item) => {
                const cat = item.category ? item.category.toLowerCase() : "";
                const sub = item.subCategory ? item.subCategory.toLowerCase() : "";
                const name = item.name ? item.name.toLowerCase() : "";

                // لو المنتج جواه أي كلمة من دول.. بيطير فوراً ومبيظهرش في الـ Homepage
                return (
                    !cat.includes("lingerie") && !cat.includes("undergarments") &&
                    !sub.includes("lingerie") && !sub.includes("undergarments") &&
                    !name.includes("lingerie") && !name.includes("undergarments")
                );
            });

            // 2. 🌟 الترتيب العبقري: بنرتب المصفوفة كاملة الأول عشان نضمن سحب كل المنتجات الرجالي فوق
            safeProducts.sort((a, b) => {
                const aCat = a.category.toLowerCase();
                const bCat = b.category.toLowerCase();
                
                const aIsMen = aCat.includes("men") && !aCat.includes("women");
                const bIsMen = bCat.includes("men") && !bCat.includes("women");
                
                if (aIsMen && !bIsMen) return -1; // تقديم الرجالي في الأول خالص
                if (!aIsMen && bIsMen) return 1;  // تأخير الباقي وراهم
                return 0;
            });

            // 3. قَطْع أول 10 منتجات نظيفة ومترتبة ومضمونة لعين الدكتور
            setLatestProducts(safeProducts.slice(0, 10));
        }
    }, [products]);

    return (
        <div className='my-10 w-full max-w-7xl mx-auto px-4'>
            {/* عنوان القسم */}
            <div className='text-center py-8 text-3xl'>
                <Title text1={'LATEST'} text2={'COLLECTIONS'} />
                <p className='w-3/4 m-auto text-xs sm:text-sm text-gray-500 font-normal leading-relaxed'>
                    Explore our newest arrivals, freshly dropped and styled to elevate your everyday look with premium comfort.
                </p>
            </div>

            {/* شبكة عرض المنتجات الذكية */}
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6 w-full'>
                {isLoading ? (
                    /* 🌟 لو لسه بيحمل: اعرض 10 كروت هيكلية متموجة فخمة */
                    Array(10).fill("").map((_, index) => <ProductSkeleton key={index} />)
                ) : (
                    /* لو الداتا وصلت: اعرض المنتجات الحقيقية المترتبة */
                    latestProducts.map((item, index) => (
                        <ProductItem 
                            key={index} 
                            id={item._id} 
                            image={item.image} 
                            name={item.name} 
                            price={item.price} 
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default LatestCollection;