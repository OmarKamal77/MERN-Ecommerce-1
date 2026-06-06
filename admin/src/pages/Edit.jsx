import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Edit = ({ token }) => {
  const { id } = useParams(); // لقط الـ ID من رابط الصفحة
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // حالات تخزين بيانات المنتج الحالية
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Tops");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  
  // حالات رفع الصور الجديدة (اختيارية)
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);
  const [existingImages, setExistingImages] = useState([]); // لحفظ الصور القديمة وعرضها

  // 1. جلب بيانات المنتج من الداتا بيز أول ما الصفحة تفتح
  const fetchProductData = async () => {
    try {
      const response = await axios.post(backendUrl + "/api/product/single", { productId: id });
      if (response.data.success) {
        const product = response.data.product;
        setName(product.name);
        setDescription(product.description);
        setPrice(product.price);
        setCategory(product.category);
        setSubCategory(product.subCategory);
        setBestseller(product.bestseller === true || product.bestseller === "true");
        setSizes(product.sizes || []);
        setExistingImages(product.image || []);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [id]);

  // لوجيك تفعيل وإلغاء اختيار المقاسات
  const toggleSize = (size) => {
    setSizes(prev => prev.includes(size) ? prev.filter(item => item !== size) : [...prev, size]);
  };

  // 2. معالجة إرسال الفورم وتحديث البيانات في السحاب
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("id", id); // تمرير الـ ID للباك إند
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));

      // لو الأدمن اختار صور جديدة، نرفقها في الـ Request
      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(backendUrl + "/api/product/update", formData, { headers: { token } });

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/list"); // يرجعه تلقائيًا لجدول المنتجات بعد الحفظ بنجاح
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="p-6 w-full max-w-2xl mx-auto text-center py-20 animate-pulse font-medium text-gray-400">
        Loading Product Details From Database...
      </div>
    );
  }

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-4 p-6 bg-white rounded-xl border border-gray-200 shadow-sm max-w-2xl mx-auto">
      <div>
        <h3 className="text-xl font-semibold text-gray-800">Edit Product Blueprint</h3>
        <p className="text-xs text-gray-400 mt-0.5">Modify database attributes for "{name}"</p>
      </div>

      {/* قسم إدارة الصور التفاعلي */}
      <div className="w-full">
        <p className="mb-2 text-sm font-semibold text-gray-600">Product Images (Click to change)</p>
        <div className="flex gap-3">
          <label htmlFor="image1" className="cursor-pointer border-2 border-dashed border-gray-200 p-2 rounded-xl hover:border-black transition-all">
            <img className="w-16 h-16 object-cover rounded-lg" src={image1 ? URL.createObjectURL(image1) : existingImages[0] || assets.upload_area} alt="" />
            <input onChange={(e) => setImage1(e.target.files[0])} type="file" id="image1" hidden />
          </label>
          <label htmlFor="image2" className="cursor-pointer border-2 border-dashed border-gray-200 p-2 rounded-xl hover:border-black transition-all">
            <img className="w-16 h-16 object-cover rounded-lg" src={image2 ? URL.createObjectURL(image2) : existingImages[1] || assets.upload_area} alt="" />
            <input onChange={(e) => setImage2(e.target.files[0])} type="file" id="image2" hidden />
          </label>
          <label htmlFor="image3" className="cursor-pointer border-2 border-dashed border-gray-200 p-2 rounded-xl hover:border-black transition-all">
            <img className="w-16 h-16 object-cover rounded-lg" src={image3 ? URL.createObjectURL(image3) : existingImages[2] || assets.upload_area} alt="" />
            <input onChange={(e) => setImage3(e.target.files[0])} type="file" id="image3" hidden />
          </label>
          <label htmlFor="image4" className="cursor-pointer border-2 border-dashed border-gray-200 p-2 rounded-xl hover:border-black transition-all">
            <img className="w-16 h-16 object-cover rounded-lg" src={image4 ? URL.createObjectURL(image4) : existingImages[3] || assets.upload_area} alt="" />
            <input onChange={(e) => setImage4(e.target.files[0])} type="file" id="image4" hidden />
          </label>
        </div>
        <p className="text-[10px] text-gray-400 mt-1.5">* Leaving these images as they are preserves current cloud assets.</p>
      </div>

      {/* اسم المنتج */}
      <div className="w-full flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-600">Product Title</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full max-w-[500px] px-3 py-2 border rounded-lg outline-none focus:border-black transition-all text-sm font-medium" type="text" required />
      </div>

      {/* وصف المنتج */}
      <div className="w-full flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-600">Product Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full max-w-[500px] px-3 py-2 border rounded-lg outline-none focus:border-black transition-all text-sm font-medium h-24 resize-none" required />
      </div>

      {/* الخصائص الفرعية والسعر */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-[500px]">
        <div className="flex-1 flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 border rounded-lg outline-none cursor-pointer text-sm font-medium bg-gray-50 focus:bg-white focus:border-black">
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        <div className="flex-1 flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600">Sub Category</label>
          <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} className="w-full px-3 py-2 border rounded-lg outline-none cursor-pointer text-sm font-medium bg-gray-50 focus:bg-white focus:border-black">
            <option value="Tops">Tops & Shirts</option>
            <option value="Bottoms">Pants & Bottoms</option>
            <option value="Outerwear">Jackets & Coats</option>
            <option value="Dresses">Dresses & Jumpsuits</option>
            <option value="Accessories">Shoes & Accessories</option>
          </select>
        </div>

        <div className="flex-1 flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600">Price</label>
          <input value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-3 py-2 border rounded-lg outline-none text-sm font-medium focus:border-black" type="Number" required />
        </div>
      </div>

      {/* اختيار المقاسات الديناميكي */}
      <div className="w-full">
        <p className="mb-2 text-sm font-semibold text-gray-600">Product Sizes</p>
        <div className="flex gap-2">
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <div key={size} onClick={() => toggleSize(size)} className={`px-3 py-1.5 border rounded-lg text-xs font-bold cursor-pointer transition-all ${sizes.includes(size) ? "bg-black text-white border-black" : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"}`}>
              {size}
            </div>
          ))}
        </div>
      </div>

      {/* حالة التميز */}
      <label className="flex gap-2 items-center cursor-pointer mt-2 text-sm font-semibold text-gray-700">
        <input type="checkbox" className="w-4 h-4 accent-black cursor-pointer rounded" checked={bestseller} onChange={() => setBestseller(prev => !prev)} />
        <span>Mark as Store Bestseller</span>
      </label>

      {/* زر الحفظ */}
      <button type="submit" className="w-full max-w-[200px] py-2.5 bg-black text-white text-sm font-bold rounded-lg shadow-sm hover:bg-gray-900 active:scale-[0.98] transition-all mt-4">
        SAVE CHANGES
      </button>
    </form>
  );
};

export default Edit;