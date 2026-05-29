import React from 'react';

const ProfileSkeleton = () => {
    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10 animate-pulse">
            {/* Header Skeleton */}
            <div className="flex items-center gap-4 border-b pb-4 mb-6">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                    <div className="h-5 w-32 bg-gray-200 rounded"></div>
                    <div className="h-3 w-20 bg-gray-200 rounded"></div>
                </div>
            </div>

            {/* Inputs Skeleton */}
            <div className="space-y-6">
                {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="space-y-2">
                        <div className="h-3 w-24 bg-gray-200 rounded"></div>
                        <div className="h-10 w-full bg-gray-100 rounded"></div>
                    </div>
                ))}
            </div>

            {/* Button Skeleton */}
            <div className="mt-6 flex justify-end">
                <div className="h-10 w-28 bg-gray-200 rounded"></div>
            </div>
        </div>
    );
};

export default ProfileSkeleton;