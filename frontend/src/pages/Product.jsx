import React, { useContext, useEffect, useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets, products as localProducts } from "../assets/assets"; 
import RelatedProducts from "../components/RelatedProducts";

const Product = () => {
    const { productId } = useParams();
    const { products, currency, addToCart, token, navigate, wishlist, toggleWishlist, backendUrl } = useContext(ShopContext);
    const [productData, setProductData] = useState(false);
    const [image, setImage] = useState("");
    const [size, setSize] = useState("");
    
    // فخامة أمازون: حالات التحكم في الزووم الديناميكي للموس
    const [zoomStyle, setZoomStyle] = useState({ transformOrigin: "center" });
    const [isZoomed, setIsZoomed] = useState(false);

    // خانات الفورم الخاصة بالتقييمات
    const [customerName, setCustomerName] = useState('');
    const [rating, setRating] = useState(5); 
    const [comment, setComment] = useState('');

    // الدالة لحساب تتبع حركة الماوس داخل مربع الصورة
    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setZoomStyle({ transformOrigin: `${x}% ${y}%` });
    };

    const fetchProductData = async () => {
    try {
        // 🌟 نطلب بيانات المنتج ده بالذات من الباك إند مباشرة لضمان التكامل
        const response = await axios.post(backendUrl + '/api/product/single', { productId });
        
        if (response.data.success) {
            let itemCopy = { ...response.data.product };

            // حزام أمان للمصفوفات عشان لو المنتج من شوبيفاي ومعندوش تقييمات لسه
            if (!itemCopy.image) itemCopy.image = [];
            if (!itemCopy.sizes || itemCopy.sizes.length === 0) itemCopy.sizes = ["S", "M", "L", "XL"];
            if (!itemCopy.reviews) itemCopy.reviews = [];

            // ربط صور الـ 52 منتج المحلية لو الاسم مش رابط أونلاين
            if (itemCopy.image.length > 0 && !itemCopy.image[0].startsWith("http")) {
                const originalLocal = localProducts.find((p) => p.name === itemCopy.name);
                if (originalLocal && originalLocal.image) {
                    itemCopy.image = originalLocal.image; 
                }
            }

            setProductData(itemCopy);
            setImage(itemCopy.image[0] || "");
        } else {
            toast.error(response.data.message);
        }
    } catch (error) {
        console.log(error);
        toast.error("Error fetching product details");
    }
};

    const handleAddReview = async (e) => {
        e.preventDefault();
        if (!customerName || !comment) {
            toast.error("Please fill all fields");
            return;
        }

        try {
            const response = await axios.post('http://localhost:4000/api/product/review', {
                productId,
                customerName,
                rating,
                comment
            }, {
                headers: { token } 
            });

            if (response.data.success) {
                toast.success("Review added successfully!");
                setProductData(prev => ({
                    ...prev,
                    reviews: response.data.reviews
                }));
                setCustomerName('');
                setComment('');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    // 🌟 مراقبة تغيير الـ productId وتصليح السكرول أوتوماتيكياً
    useEffect(() => {
        fetchProductData();
        window.scrollTo(0, 0); // 👈 السطر السحري: بيطير بالصفحة لفوق أول ما يضغط على منتج جديد
    }, [productId, products]);

    if (!productData) {
        return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading Product Details...</div>;
    }

    const averageRating = productData.reviews && productData.reviews.length > 0
        ? Math.round(productData.reviews.reduce((sum, rev) => sum + Number(rev.rating), 0) / productData.reviews.length)
        : 5;

    return productData ? (
        <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100 w-full max-w-7xl mx-auto px-4">
            {/*---------------------------- Product Data--------------------------------------------*/}
            <div className="flex gap-12 flex-col sm:flex-row">
                {/*-------------------------------------- Product Image------------------------------------ */}
                <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
                    {/* الصور المصغرة الجانبية */}
                    <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full max-h-[450px] scrollbar-none">
                        {productData.image.map((item, index) => (
                            <img
                                onClick={() => setImage(item)}
                                src={item}
                                key={index}
                                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer border rounded-sm hover:border-black transition-colors aspect-[3/4] object-cover object-top"
                                alt=""
                            />
                        ))}
                    </div>
                    
                    {/* كبسولة زووم أمازون السحرية */}
                    <div 
                        onMouseMove={handleMouseMove}
                        onMouseEnter={() => setIsZoomed(true)}
                        onMouseLeave={() => {
                            setIsZoomed(false);
                            setZoomStyle({ transformOrigin: "center" }); 
                        }}
                        className="w-full sm:w-[80%] aspect-[3/4] border rounded-sm overflow-hidden bg-white cursor-zoom-in relative"
                    >
                        <img 
                            className="w-full h-full object-cover object-top transition-transform duration-150 ease-out" 
                            src={image} 
                            alt="" 
                            style={{
                                ...zoomStyle,
                                transform: isZoomed ? "scale(2.2)" : "scale(1)" 
                            }}
                        />
                    </div>
                </div>
                
                {/* ----------------------------------Product Info ---------------------------------------- */}
                <div className="flex-1">
                    <h1 className="font-medium text-2xl mt-2 text-gray-900">
                        {productData.name}
                    </h1>
                    
                    {/* ⭐ النجوم الديناميكية */}
                    <div className="flex items-center gap-1 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                                key={star}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                className="w-4 h-4"
                                style={{ fill: star <= averageRating ? "#FF6B50" : "transparent", stroke: "#FF6B50" }}
                            >
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                        ))}
                        <p className="pl-2 text-sm text-gray-500 font-medium">({productData.reviews ? productData.reviews.length : 0})</p>
                    </div>

                    <p className="mt-5 text-3xl font-medium text-gray-900">
                        {currency}{productData.price}
                    </p>
                    <p className="mt-5 text-gray-600 md:w-4/5 leading-relaxed">
                        {productData.description}
                    </p>
                    
                    {/* اختيار المقاسات */}
                    <div className="flex flex-col gap-4 my-8">
                        <p className="font-medium text-gray-800">Select Size</p>
                        <div className="flex gap-2">
                            {productData.sizes.map((item, index) => (
                                <button
                                    onClick={() => setSize(item)}
                                    className={`border py-2 px-4 rounded-sm text-sm font-medium transition-all ${
                                        item === size 
                                            ? "border-black bg-black text-white" 
                                            : "border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700"
                                    }`}
                                    key={index}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {/* أزرار الشراء والمفضلة */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => addToCart(productData._id, size)}
                            className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700 font-medium rounded-sm tracking-wider hover:opacity-90 transition"
                        >
                            ADD TO CART
                        </button>

                        <button
                            onClick={() => toggleWishlist(productData._id)}
                            className="border p-2.5 px-3.5 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition rounded-sm flex items-center justify-center group"
                            title={wishlist.includes(productData._id) ? "Remove from Wishlist" : "Add to Wishlist"}
                        >
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 24 24" 
                                className={`w-6 h-6 transition-all duration-300 transform group-hover:scale-110 ${
                                    wishlist.includes(productData._id) 
                                        ? "fill-red-500 stroke-red-500 scale-105" 
                                        : "fill-transparent stroke-black stroke-2"
                                }`}
                            >
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                        </button>
                    </div>

                    <hr className="mt-8 sm:w-4/5 border-gray-200" />
                    <div className="text-sm text-gray-500 mt-5 flex flex-col gap-2 font-normal">
                        <p>✓ 100% Original product.</p>
                        <p>✓ Cash on delivery is available on this product.</p>
                        <p>✓ Easy return and exchange policy within 7 days.</p>
                    </div>
                </div>
            </div>

            {/*------------------------------------------ Description & Reviews Section ---------------------------------------- */}
            <div className="mt-20">
                <div className="flex">
                    <b className="border-t border-x px-5 py-3 text-sm bg-white text-black border-gray-200">Description</b>
                    <p className="border-b border-gray-200 px-5 py-3 text-sm text-gray-500 flex-1">Reviews ({productData.reviews ? productData.reviews.length : 0})</p>
                </div>
                
                <div className="flex flex-col gap-6 border border-gray-200 px-6 py-6 text-sm text-gray-500 bg-white shadow-sm rounded-b-sm">
                    {/* عرض التقييمات */}
                    <div className="flex flex-col gap-4 max-h-60 overflow-y-auto pr-2">
                        {productData.reviews && productData.reviews.length > 0 ? (
                            productData.reviews.map((rev, index) => (
                                <div key={index} className="border-b pb-3 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-2 mb-1 w-full">
                                        <span className="font-bold text-gray-800">{rev.customerName}</span>
                                        <div className="flex items-center gap-0.5">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <svg
                                                    key={star}
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    className="w-3.5 h-3.5"
                                                    style={{ 
                                                        fill: star <= rev.rating ? "#FF6B50" : "transparent", 
                                                        stroke: "#FF6B50",
                                                        opacity: star <= rev.rating ? 1 : 0.4
                                                    }}
                                                >
                                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <span className="text-xs text-gray-400 ml-auto font-medium">
                                            {new Date(rev.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 font-normal pl-1">{rev.comment}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 italic">No reviews yet. Be the first to review this product!</p>
                        )}
                    </div>

                    {/* فورم إضافة تقييم */}
                    {token ? (
                        <form onSubmit={handleAddReview} className="mt-6 border-t pt-6 flex flex-col gap-3 max-w-lg">
                            <h3 className="font-medium text-gray-800 text-base">Write a Customer Review</h3>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input 
                                    type="text" 
                                    placeholder="Your Name" 
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    className="border border-gray-300 px-3 py-2 rounded-sm w-full outline-none text-gray-700 focus:border-black transition"
                                    required
                                />
                                <select 
                                    value={rating} 
                                    onChange={(e) => setRating(e.target.value)}
                                    className="border border-gray-300 px-3 py-2 rounded-sm bg-white outline-none cursor-pointer text-gray-700 focus:border-black transition"
                                >
                                    <option value="5">5 Stars</option>
                                    <option value="4">4 Stars</option>
                                    <option value="3">3 Stars</option>
                                    <option value="2">2 Stars</option>
                                    <option value="1">1 Star</option>
                                </select>
                            </div>
                            <textarea 
                                placeholder="Write your comment here..." 
                                rows="3"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="border border-gray-300 px-3 py-2 rounded-sm w-full outline-none resize-none text-gray-700 focus:border-black transition"
                                required
                            ></textarea>
                            <button type="submit" className="bg-black text-white px-6 py-2 text-xs font-medium max-w-max self-start active:bg-gray-700 rounded-sm hover:opacity-90 transition tracking-wider">
                                SUBMIT REVIEW
                            </button>
                        </form>
                    ) : (
                        <div className="mt-6 border-t pt-6 text-gray-400 italic">
                            Please <span className="text-black font-medium underline cursor-pointer hover:text-orange-700 transition" onClick={() => navigate('/login')}>Login</span> to write a customer review.
                        </div>
                    )}
                </div>
            </div>

            {/*------------------------------- Display Related Product-------------------------- */}
            <RelatedProducts
                category={productData.category}
                subCategory={productData.subCategory} 
            />
        </div>
    ) : (
        <div className="opacity-0"></div>
    );
};

export default Product;