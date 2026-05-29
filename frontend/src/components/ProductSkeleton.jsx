import React from "react";

const ProductSkeleton = () => {
    return (
        <div className="border rounded-sm bg-white shadow-sm overflow-hidden pointer-events-none">
            {/* مكان صورة المنتج - متموج بنفس الأبعاد */}
            <div className="w-full aspect-[3/4] bg-gray-200 animate-pulse" />
            
            <div className="p-2 space-y-2">
                {/* مكان اسم المنتج - سطر طويل رمادي */}
                <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4 mt-1" />
                
                {/* مكان السعر - سطر قصير رمادي */}
                <div className="h-4 bg-gray-200 animate-pulse rounded w-1/4 pb-1" />
            </div>
        </div>
    );
};

export default ProductSkeleton;