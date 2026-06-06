import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Add = ({ token }) => {
    const [image1, setImage1] = useState(false);
    const [image2, setImage2] = useState(false);
    const [image3, setImage3] = useState(false);
    const [image4, setImage4] = useState(false);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("Men");
    const [subCategory, setSubCategory] = useState("Topwear");
    const [bestseller, setBestseller] = useState(false);
    const [sizes, setSizes] = useState([]);

    // 🌟 1. حالة التحميل لمنع البطء وتعليق الزرار
    const [loading, setLoading] = useState(false);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true); // تشغيل مؤشر التحميل فوراً عند الضغط

        try {
            // 🌟 2. الفحص الصارم للحقول الإجبارية (Required Validation)
            
            // أ- إجبار رفع الصورة الأولى على الأقل
            if (!image1) {
                toast.error("Please upload at least the first image (Main Image)");
                setLoading(false);
                return;
            }

            // ب- إجبار اختيار مقاس واحد على الأقل
            if (sizes.length === 0) {
                toast.error("Please select at least one available size");
                setLoading(false);
                return;
            }

            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", description);
            formData.append("price", price);
            formData.append("category", category);
            formData.append("subCategory", subCategory);
            formData.append("bestseller", bestseller);
            formData.append("sizes", JSON.stringify(sizes)); 

            image1 && formData.append("image1", image1);
            image2 && formData.append("image2", image2);
            image3 && formData.append("image3", image3);
            image4 && formData.append("image4", image4);

            const response = await axios.post(backendUrl + "/api/product/add", formData, { headers: { token } });
            
            if (response.data.success) {
                toast.success(response.data.message);
                // تصفير كل الخانات بعد النجاح
                setName('');
                setDescription('');
                setPrice('');
                setImage1(false);
                setImage2(false);
                setImage3(false);
                setImage4(false);
                setSizes([]);
                setBestseller(false);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setLoading(false); // قفل مؤشر التحميل في كل الأحوال (نجاح أو فشل)
        }
    };

    const handleSizeToggle = (size) => {
        setSizes(prev => prev.includes(size) ? prev.filter(item => item !== size) : [...prev, size]);
    };

    return (
        <form onSubmit={onSubmitHandler} className="p-6 w-full max-w-3xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm space-y-6">
            
            <div>
                <h3 className="text-xl font-semibold text-gray-800">Add New Product</h3>
                <p className="text-xs text-gray-400 mt-0.5">All details are dynamically secured and validated.</p>
            </div>

            {/* سكشن رفع الصور - مع تمييز المربع الأول كإجباري */}
            <div className="space-y-2">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Upload Product Images <span className="text-red-500">*</span>
                </p>
                <div className="flex gap-3 flex-wrap">
                    {[
                        { id: "image1", state: image1, setter: setImage1, label: "Main" },
                        { id: "image2", state: image2, setter: setImage2, label: "Optional" },
                        { id: "image3", state: image3, setter: setImage3, label: "Optional" },
                        { id: "image4", state: image4, setter: setImage4, label: "Optional" }
                    ].map((img, idx) => (
                        <label key={img.id} htmlFor={img.id} className="cursor-pointer group relative">
                            <div className={`w-20 h-24 border rounded-xl overflow-hidden shadow-sm bg-gray-50 flex items-center justify-center transition-all transform group-hover:scale-105 ${idx === 0 && !image1 ? "border-dashed border-gray-400" : "border-gray-200"}`}>
                                <img 
                                    className="w-full h-full object-cover" 
                                    src={!img.state ? assets.upload_area : URL.createObjectURL(img.state)} 
                                    alt="" 
                                />
                            </div>
                            {idx === 0 && !image1 && (
                                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] bg-red-50 text-red-600 px-1 rounded font-bold border border-red-200">Required</span>
                            )}
                            <input onChange={(e) => img.setter(e.target.files[0])} type="file" id={img.id} hidden />
                        </label>
                    ))}
                </div>
            </div>

            {/* اسم المنتج */}
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Product Name <span className="text-red-500">*</span></label>
                <input 
                    onChange={(e) => setName(e.target.value)} 
                    value={name} 
                    className="w-full max-w-xl border border-gray-200 text-sm rounded-lg p-2.5 bg-gray-50 text-gray-700 font-medium outline-none focus:border-black focus:bg-white transition-all" 
                    type="text" 
                    placeholder="e.g., Slim Fit Summer Shirt" 
                    required 
                />
            </div>

            {/* وصف المنتج */}
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Product Description <span className="text-red-500">*</span></label>
                <textarea 
                    onChange={(e) => setDescription(e.target.value)} 
                    value={description} 
                    className="w-full max-w-xl border border-gray-200 text-sm rounded-lg p-2.5 bg-gray-50 text-gray-700 font-medium outline-none min-h-[100px] resize-y focus:border-black focus:bg-white transition-all" 
                    placeholder="Write detailed product information here..." 
                    required 
                />
            </div>

            {/* سكشن الفلاتر الثلاثي */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl">
                
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category <span className="text-red-500">*</span></label>
                    <select 
                        onChange={(e) => setCategory(e.target.value)} 
                        value={category}
                        className="w-full border border-gray-200 text-sm rounded-lg p-2.5 bg-gray-50 text-gray-700 font-medium outline-none cursor-pointer focus:border-black transition-all"
                    >
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                        <option value="Kids">Kids</option>
                    </select>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sub Category <span className="text-red-500">*</span></label>
                    <select 
                        onChange={(e) => setSubCategory(e.target.value)} 
                        value={subCategory}
                        className="w-full border border-gray-200 text-sm rounded-lg p-2.5 bg-gray-50 text-gray-700 font-medium outline-none cursor-pointer focus:border-black transition-all"
                    >
                        <option value="Topwear">Topwear</option>
                        <option value="Bottomwear">Bottomwear</option>
                        <option value="Winterwear">Winterwear</option>
                        <option value="Dresses">Dresses</option>
                        <option value="Accessories">Accessories</option>
                    </select>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Product Price <span className="text-red-500">*</span></label>
                    <input 
                        onChange={(e) => setPrice(e.target.value)} 
                        value={price} 
                        className="w-full border border-gray-200 text-sm rounded-lg p-2.5 bg-gray-50 text-gray-700 font-medium outline-none focus:border-black focus:bg-white transition-all" 
                        type="Number" 
                        placeholder="25" 
                        required
                    />
                </div>
            </div>

            {/* اختيار المقاسات - مع علامة إجباري */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Available Sizes <span className="text-red-500">*</span></label>
                <div className="flex gap-2.5">
                    {["S", "M", "L", "XL", "XXL"].map((size) => (
                        <div 
                            key={size}
                            onClick={() => handleSizeToggle(size)}
                            className={`px-4 py-2 border rounded-lg text-xs font-bold cursor-pointer transition-all shadow-sm active:scale-95 ${
                                sizes.includes(size) 
                                    ? "bg-black text-white border-black animate-none" 
                                    : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                            }`}
                        >
                            {size}
                        </div>
                    ))}
                </div>
            </div>

            {/* الـ Bestseller Checkbox */}
            <div className="flex items-center gap-2.5 py-2">
                <input 
                    onChange={() => setBestseller(prev => !prev)} 
                    checked={bestseller} 
                    type="checkbox" 
                    id="bestseller" 
                    className="w-4 h-4 accent-black rounded cursor-pointer border-gray-300"
                />
                <label className="text-sm font-semibold text-gray-700 cursor-pointer select-none" htmlFor="bestseller">
                    Mark as Store Bestseller
                </label>
            </div>

            {/* 🌟 زرار الإضافة الذكي: يتغير شكله ويقفل نفسه تلقائياً وقت الرفع لمنع تكرار الإرسال */}
            <button 
                disabled={loading}
                className={`w-full max-w-xs py-3 font-semibold text-sm rounded-lg shadow-md transition-all tracking-wide uppercase flex items-center justify-center gap-2 ${
                    loading 
                        ? "bg-gray-400 text-gray-200 cursor-not-allowed" 
                        : "bg-gray-800 hover:bg-black text-white active:scale-98"
                }`} 
                type="submit"
            >
                {loading ? (
                    <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Deploying to Cloud...
                    </>
                ) : (
                    "Add Product"
                )}
            </button>
        </form>
    );
};

export default Add;