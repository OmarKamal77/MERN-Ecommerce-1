import React, { useState } from "react";
import { assets } from "../assets/assets";

const Hero = () => {
    // 🌟 تراك لحالة اكتمال تحميل الصورة الكبيرة
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className="flex flex-col sm:flex-row border border-gray-400 overflow-hidden bg-slate-50">
            {/* Hero left side */}
            <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0">
                <div className="text-[#414141]">
                    <div className="flex items-center gap-2">
                        <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
                        <p className="font-medium text-sm md:text-base">
                            OUR BESTSELLERS
                        </p>
                    </div>
                    <h1 className="prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed">
                        Latest Arrivals
                    </h1>
                    <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm md:text-base cursor-pointer hover:text-black transition-colors duration-300">
                            SHOP NOW
                        </p>
                        <p className="w-8 md:w-11 h-[1px] bg-[#414141]"></p>
                    </div>
                </div>
            </div>
            
            {/* Hero Right Side (منطقة الصورة السحرية) */}
            <div className="w-full sm:w-1/2 bg-gray-100 relative min-h-[250px] sm:min-h-[400px] flex items-center justify-center">
                
                <img 
                    src={assets.hero_img} 
                    onLoad={() => setIsLoaded(true)} // 🌟 أول ما الصورة تحمل، بنقلب الحالة فوراً
                    className={`w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
                        isLoaded ? "opacity-100" : "opacity-0"
                    }`} 
                    fetchPriority="high" // 🌟 أمر للمتصفح ليعطيها أولوية قصوى لأنها عنصر الـ LCP الأساسي للموقع
                    alt="Latest Arrivals Banner" 
                />

                {/* 🌟 الهيكل الرمادي المتموج اللطيف يظهر فقط أثناء التحميل ويختفي تماماً بمجرد ظهور الصورة */}
                {!isLoaded && (
                    <div className="absolute inset-0 bg-gray-100 animate-pulse" />
                )}
            </div>
        </div>
    );
};

export default Hero;