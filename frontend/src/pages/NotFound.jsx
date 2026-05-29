import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[65vh] text-center px-4">
            {/* الأيرور كود بشكل ضخم وشيك */}
            <h1 className="text-9xl font-black text-gray-200 tracking-widest">404</h1>
            
            <div className="bg-black text-white px-2 text-sm rounded rotate-12 absolute mb-20 select-none">
                Page Not Found
            </div>

            <div className="mt-5">
                <p className="text-2xl font-semibold text-gray-800 md:text-3xl mt-4">
                    Looking for something?
                </p>
                <p className="text-gray-500 mt-2 max-w-md mx-auto text-sm md:text-base">
                    The page you are looking for doesn't exist or has been moved. Let's get you back on track!
                </p>
            </div>

            {/* زرار الرجوع للرئيسية متناسق مع ستايل موقعك */}
            <Link 
                to="/" 
                className="mt-8 px-6 py-3 bg-black text-white font-medium text-sm rounded shadow hover:bg-opacity-90 transition-all duration-200 uppercase tracking-wider"
            >
                Go Back Home
            </Link>
        </div>
    );
};

export default NotFound;