import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
import ProductSkeleton from './ProductSkeleton'; // 🌟 استيراد الـ Skeleton الجديد

const BestSeller = () => {
    const { products } = useContext(ShopContext);
    const [bestSeller, setBestSeller] = useState([]);
    
    // 🌟 تراك ذكي لحالة التحميل
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (products && products.length > 0) {
            setIsLoading(false); // إيقاف التحميل فور ملء المصفوفة
            
            // 1. فلترة المنتجات: اختيار الـ Bestsellers + تطبيق فلتر الأمان الصارم
            let filtered = products.filter((item) => {
                const isBest = item.bestseller === true;
                
                const cat = item.category ? item.category.toLowerCase() : "";
                const sub = item.subCategory ? item.subCategory.toLowerCase() : "";
                const name = item.name ? item.name.toLowerCase() : "";

                // طرد أي منتجات مكشوفة عشان هيبة الموقع في المناقشة
                const isSafe = !cat.includes("lingerie") && !cat.includes("undergarments") &&
                               !sub.includes("lingerie") && !sub.includes("undergarments") &&
                               !name.includes("lingerie") && !name.includes("undergarments");

                return isBest && isSafe;
            });

            // 2. 🌟 لوجيك القيمة مقابل السعر (Value for Money Sorting)
            // بنرتب المنتجات الأكثر مبيعاً من الأقل سعراً للأعلى عشان نعرض اللقطة الأول
            filtered.sort((a, b) => a.price - b.price);

            // 3. أخذ أفضل 5 منتجات محققة المعادلة دي للعرض في الهوم بيج
            setBestSeller(filtered.slice(0, 5));
        }
    }, [products]);

    return (
        <div className='my-10 w-full max-w-7xl mx-auto px-4'>
            {/* عنوان القسم والوصف الاحترافي الجديد بديل الـ Lorem Ipsum */}
            <div className='text-center py-8 text-3xl'>
                <Title text1={'BEST'} text2={'SELLERS'} />
                <p className='w-3/4 m-auto text-xs sm:text-sm text-gray-500 font-normal leading-relaxed'>
                    Handpicked top-selling favorites that deliver the perfect balance of premium quality and unbeatable value.
                </p>
            </div>

            {/* شبكة العرض المتناسقة */}
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6 w-full'>
                {isLoading ? (
                    /* 🌟 لو لسه بيحمل: اعرض 5 كروت هيكلية متموجة تناسب أبعاد القسم بالظبط */
                    Array(5).fill("").map((_, index) => <ProductSkeleton key={index} />)
                ) : (
                    /* لو الداتا وصلت: اعرض الـ Best Sellers الحقيقيين */
                    bestSeller.map((item, index) => (
                        <ProductItem 
                            key={index} 
                            id={item._id} 
                            name={item.name} 
                            image={item.image} 
                            price={item.price} 
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default BestSeller;