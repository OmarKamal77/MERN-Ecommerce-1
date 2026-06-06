import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

let cachedProductsList = null;

const List = ({ token }) => {
  const [list, setList] = useState(cachedProductsList || []);
  const [loading, setLoading] = useState(!cachedProductsList);

  // حالات الفلاتر والـ Pagination والترتيب
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubCategory, setSelectedSubCategory] = useState("All");
  const [bestsellerFilter, setBestsellerFilter] = useState("All"); 
  const [sortType, setSortType] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; 

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        const reversedProducts = response.data.products.reverse();
        cachedProductsList = reversedProducts;
        setList(reversedProducts);
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

  const removeProduct = async (id) => {
    const originalList = [...list];
    const updatedList = list.filter((item) => item._id !== id);
    setList(updatedList);
    cachedProductsList = updatedList;

    try {
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id },
        { headers: { token } }
      );
      
      if (response.data.success) {
        toast.success(response.data.message);
        fetchList(); 
      } else {
        toast.error(response.data.message);
        setList(originalList);
        cachedProductsList = originalList;
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setList(originalList);
      cachedProductsList = originalList;
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const filteredProducts = list.filter((product) => {
    if (!product) return false;

    const productName = product.name ? product.name.toLowerCase() : "";
    const matchesSearch = productName.includes(searchTerm.toLowerCase());

    const catItem = product.category ? product.category.toLowerCase() : "";
    const subItem = product.subCategory ? product.subCategory.toLowerCase() : "";

    let matchesCategory = false;
    if (selectedCategory === "All") {
      matchesCategory = true;
    } else if (selectedCategory === "Men") {
      matchesCategory = catItem.includes("men") && !catItem.includes("women");
    } else if (selectedCategory === "Women") {
      matchesCategory = catItem.includes("women") || catItem.includes("dress") || catItem.includes("lingerie") || catItem.includes("undergarments");
    } else if (selectedCategory === "Kids") {
      matchesCategory = catItem.includes("kids") || catItem.includes("boy") || catItem.includes("girls") || catItem.includes("kid");
    }

    let matchesSubCategory = false;
    if (selectedSubCategory === "All") {
      matchesSubCategory = true;
    } else if (selectedSubCategory === "Tops") {
      matchesSubCategory = catItem.includes("tops") || catItem.includes("t-shirt") || catItem.includes("shirt") || catItem.includes("button-up") || catItem.includes("knitwear") || subItem.includes("topwear");
    } else if (selectedSubCategory === "Bottoms") {
      matchesSubCategory = catItem.includes("pants") || catItem.includes("trousers") || catItem.includes("shorts") || catItem.includes("skirts") || catItem.includes("denim") || subItem.includes("bottom");
    } else if (selectedSubCategory === "Outerwear") {
      matchesSubCategory = catItem.includes("coats") || catItem.includes("jackets") || catItem.includes("outerwear") || catItem.includes("cardigans") || catItem.includes("vests") || subItem.includes("winterwear");
    } else if (selectedSubCategory === "Dresses") {
      matchesSubCategory = catItem.includes("dresses") || catItem.includes("dress") || catItem.includes("jumpsuits");
    } else if (selectedSubCategory === "Accessories") {
      matchesSubCategory = catItem.includes("bags") || catItem.includes("shoes") || catItem.includes("bracelets") || catItem.includes("rings") || catItem.includes("earrings") || catItem.includes("necklaces") || catItem.includes("belts") || catItem.includes("scarves") || catItem.includes("hats") || catItem.includes("socks") || subItem.includes("accessories") || catItem.includes("accessories") || catItem.includes("unisex");
    }

    let matchesBestseller = true;
    const isBestseller = product.bestseller === true || product.bestseller === "true";
    if (bestsellerFilter === "Featured") matchesBestseller = isBestseller;
    if (bestsellerFilter === "Standard") matchesBestseller = !isBestseller;

    return matchesSearch && matchesCategory && matchesSubCategory && matchesBestseller;
  });

  if (sortType === "low-high") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortType === "high-low") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedSubCategory, bestsellerFilter, sortType]);

  if (loading) {
    return (
      <div className="p-6 w-full max-w-6xl animate-pulse space-y-4">
        <div className="h-7 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="h-12 bg-gray-200 rounded-xl"></div>
        <div className="h-48 bg-gray-200 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="p-6 w-full max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Products Catalog</h3>
          <p className="text-xs text-gray-400 mt-0.5">Manage, filter, and monitor your store inventory.</p>
        </div>
        <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full w-max">
          Total: {filteredProducts.length} Products
        </span>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Search Product</label>
          <input 
            type="text" 
            placeholder="Type name to search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-200 text-sm rounded-lg p-2 bg-gray-50 text-gray-700 font-medium outline-none focus:border-black focus:bg-white transition-all"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-200 text-sm rounded-lg p-2 bg-gray-50 text-gray-700 font-medium outline-none cursor-pointer focus:border-black transition-all"
          >
            <option value="All">All Categories</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Product Type</label>
          <select
            value={selectedSubCategory}
            onChange={(e) => setSelectedSubCategory(e.target.value)}
            className="border border-gray-200 text-sm rounded-lg p-2 bg-gray-50 text-gray-700 font-medium outline-none cursor-pointer focus:border-black transition-all"
          >
            <option value="All">All Types</option>
            <option value="Tops">Tops & Shirts</option>
            <option value="Bottoms">Pants & Bottoms</option>
            <option value="Outerwear">Jackets & Coats</option>
            <option value="Dresses">Dresses & Jumpsuits</option>
            <option value="Accessories">Shoes & Accessories</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Highlight Status</label>
          <select
            value={bestsellerFilter}
            onChange={(e) => setBestsellerFilter(e.target.value)}
            className="border border-gray-200 text-sm rounded-lg p-2 bg-gray-50 text-gray-700 font-medium outline-none cursor-pointer focus:border-black transition-all"
          >
            <option value="All">All Products</option>
            <option value="Featured">Featured & Bestsellers</option>
            <option value="Standard">Standard Stock</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sort By Price</label>
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="border border-gray-200 text-sm rounded-lg p-2 bg-gray-50 text-gray-700 font-medium outline-none cursor-pointer focus:border-black transition-all"
          >
            <option value="default">Date: Newest first</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="hidden md:grid grid-cols-[1.5fr_3fr_1.5fr_1fr_1fr] items-center py-4 px-4 bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
          <span>Product Image</span>
          <span>Name</span>
          <span>Category</span>
          <span>Price</span>
          <span className="text-center">Action</span>
        </div>

        <div className="divide-y divide-gray-100">
          {currentItems.length === 0 ? (
            <p className="text-center text-gray-400 py-12 font-medium">No products match your filters.</p>
          ) : (
            currentItems.map((item, index) => {
              const finalImgSrc = item.image && item.image[0] ? item.image[0] : "";

              return (
                <div
                  className="grid grid-cols-[1.5fr_3fr_1fr] md:grid-cols-[1.5fr_3fr_1.5fr_1fr_1fr] items-center gap-4 py-4 px-4 text-sm hover:bg-gray-50/80 transition-colors bg-white"
                  key={index}
                >
                  <div className="w-16 h-16 flex-shrink-0 border border-gray-100 rounded-xl overflow-hidden shadow-sm bg-gray-50 relative">
                    <img 
                      className="w-full h-full object-cover" 
                      src={finalImgSrc} 
                      alt="" 
                    />
                    {item.bestseller && (
                      <span className="absolute top-1 left-1 w-2 h-2 bg-blue-500 rounded-full shadow-sm z-10"></span>
                    )}
                  </div>

                  <div>
                    <p className="text-gray-900 font-bold text-base tracking-tight truncate max-w-[130px] sm:max-w-[250px] md:max-w-none">{item.name}</p>
                    <span className="text-[10px] bg-gray-100 text-gray-500 font-bold px-2 py-0.5 rounded md:hidden uppercase mt-1 inline-block">
                      {item.category}
                    </span>
                  </div>
                  
                  <p className="text-gray-500 hidden md:block font-medium uppercase text-xs tracking-wider">
                    {item.category} <span className="text-gray-300 mx-1">/</span> <span className="text-xs text-gray-400 font-normal">{item.subCategory}</span>
                  </p>
                  
                  <p className="font-bold text-gray-900 text-base">
                    {currency}{item.price}
                  </p>
                  
                  {/* أزرار التحكم بعد استبدال الإيموجيز بأيقونات SVG تفاعلية فاخرة */}
                  <div className="text-right md:text-center flex items-center justify-center gap-3">
                    <Link
                      to={`/edit/${item._id}`}
                      className="text-gray-400 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-lg p-2 inline-flex items-center justify-center w-8 h-8 transition-all duration-200 hover:scale-110 active:scale-95 shadow-sm border border-gray-100 focus:outline-none"
                      title="Edit Product"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                      </svg>
                    </Link>

                    <button
                      onClick={() => removeProduct(item._id)}
                      className="text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-lg p-2 inline-flex items-center justify-center w-8 h-8 transition-all duration-200 hover:scale-110 active:scale-95 shadow-sm border border-gray-100 focus:outline-none"
                      title="Delete Product"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-100 pt-4 px-2">
          <p className="text-xs font-medium text-gray-400">
            Page <span className="text-gray-700 font-bold">{currentPage}</span> of <span className="text-gray-700 font-bold">{totalPages}</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg bg-white text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-colors"
            >
              Previous
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg bg-white text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;