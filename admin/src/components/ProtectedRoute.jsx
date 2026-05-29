import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ token }) => {
    // 🌟 حزام الأمان: لو مفيش توكن، اطرده لصفحة اللوجين فوراً وامسح تاريخ الهوية المكسورة
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // لو التوكن موجود وسليم، خليه يكمل ويفتح الصفحات اللي جوه عادي جداً
    return <Outlet />;
};

export default ProtectedRoute;