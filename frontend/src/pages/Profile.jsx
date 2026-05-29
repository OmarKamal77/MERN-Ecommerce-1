import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom'; // 🌟 ضفنا دي عشان التوجيه اللّي كان ناقص
import axios from 'axios';
import ProfileSkeleton from '../components/ProfileSkeleton'; 

const Profile = () => {
    const { token, backendUrl } = useContext(ShopContext);
    const navigate = useNavigate(); // 🌟 تعريف الـ navigate لمنع كراش الصفحة
    
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        phone: "",
        address: ""
    });
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(true); // 🌟 خليناها true كبداية عشان السكيلتون يظهر فوراً أول ما تفتح الصفحة

    // 1️⃣ Fetch Profile Data
    const fetchUserProfile = async () => {
        // التأكد من التوكن الحالي سواء من الـ Context أو الـ sessionStorage ديركت
        const currentToken = token || sessionStorage.getItem('token'); // 🌟 تعديل هنا
        
        if (!currentToken) {
            setLoading(false);
            navigate('/login'); // لو مفيش توكن خالص يرجعه لصفحة اللوجن
            return;
        }
        
        try {
            const response = await axios.get(`${backendUrl}/api/user/profile`, {
                headers: { token: currentToken }
            });

            if (response.data.success) {
                setUserData({
                    name: response.data.user.name || "",
                    email: response.data.user.email || "",
                    phone: response.data.user.phone || "",
                    address: response.data.user.address || ""
                });
            } else {
                alert("Server Error: " + response.data.message);
            }
        } catch (error) {
            console.error("Axios Error:", error);
            alert("Failed to connect to server! Please check your backend connection.");
        } finally {
            setLoading(false); // أول ما الداتا تيجي يقفل السكيليتون وينور البيانات
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, [token, backendUrl]);

    // 🌟 لو الـ loading بـ true، السكيليتون هيشتغل هنا ويفرش الصفحة بنبضات الـ Pulse
    if (loading) {
        return <ProfileSkeleton />;
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
            <div className="flex items-center gap-4 border-b pb-4 mb-6">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-xl font-bold">
                    {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 capitalize">{userData.name || "User"}</h2>
                    <p className="text-xs text-gray-400 tracking-wider">ACTIVE ACCOUNT</p>
                </div>
            </div>

            <div className="space-y-4">
                {/* Full Name */}
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Full Name</label>
                    {isEdit ? (
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-800 rounded outline-none"
                            value={userData.name}
                            onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                        />
                    ) : (
                        <p className="w-full p-2 bg-gray-50 text-gray-700 border border-transparent rounded h-10 flex items-center capitalize">
                            {userData.name || "—"}
                        </p>
                    )}
                </div>

                {/* Email Address */}
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email Address</label>
                    <p className="w-full p-2 bg-gray-50 text-gray-500 border border-gray-100 rounded h-10 flex items-center cursor-not-allowed">
                        {userData.email || "—"}
                    </p>
                </div>

                {/* Phone Number */}
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Phone Number</label>
                    {isEdit ? (
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-800 rounded outline-none"
                            value={userData.phone}
                            onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                        />
                    ) : (
                        <p className="w-full p-2 bg-gray-50 text-gray-700 border border-transparent rounded h-10 flex items-center">
                            {userData.phone || "—"}
                        </p>
                    )}
                </div>

                {/* Default Shipping Address */}
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Default Shipping Address</label>
                    {isEdit ? (
                        <textarea
                            rows="3"
                            className="w-full p-2 border border-gray-800 rounded outline-none resize-none"
                            value={userData.address}
                            onChange={(e) => setUserData(prev => ({ ...prev, address: e.target.value }))}
                        />
                    ) : (
                        <p className="w-full p-2 bg-gray-50 text-gray-700 border border-transparent rounded min-h-[80px] pt-2">
                            {userData.address || "—"}
                        </p>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end gap-3">
                {isEdit ? (
                    <>
                        <button
                            onClick={() => setIsEdit(false)}
                            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={updateUserProfile}
                            className="px-4 py-2 bg-black text-white rounded hover:bg-opacity-90 transition"
                        >
                            Save Changes
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => setIsEdit(true)}
                        className="px-4 py-2 bg-black text-white rounded hover:bg-opacity-90 transition"
                    >
                        Edit Profile
                    </button>
                )}
            </div>
        </div>
    );
};

export default Profile;