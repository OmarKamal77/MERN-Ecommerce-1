import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 
import { products as localProducts } from "../assets/assets"; 

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = "$";
    const delivery_fee = 10;
    
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
    
    const [search, setSearch] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const [wishlist, setWishlist] = useState([]);

    // 🌟 الحل السحري: التوكن بيبدأ فوراً بقيمته الحقيقية من الذاكرة وقت الريفريش ومبيبدأش رمادي أبداً
    const [token, setToken] = useState(sessionStorage.getItem("token") || "");

    const clearCart = () => {
        setCartItems({});
    };

    useEffect(() => {
        if (token) {
            try {
                const payload = token.split('.')[1];
                const decoded = JSON.parse(atob(payload));
                if (decoded && decoded.id) {
                    const savedWishlist = localStorage.getItem(`wishlist_${decoded.id}`);
                    setWishlist(savedWishlist ? JSON.parse(savedWishlist) : []);
                }
            } catch (error) {
                console.error("Error decoding token:", error);
                setWishlist([]);
            }
        } else {
            setWishlist([]); 
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            try {
                const payload = token.split('.')[1];
                const decoded = JSON.parse(atob(payload));
                if (decoded && decoded.id) {
                    localStorage.setItem(`wishlist_${decoded.id}`, JSON.stringify(wishlist));
                }
            } catch (error) {
                console.error("Error saving wishlist:", error);
            }
        }
    }, [wishlist, token]);

    const toggleWishlist = (productId) => {
        if (!token) {
            toast.error("Please login to add items to wishlist");
            navigate('/login');
            return; 
        }

        setWishlist((prev) => {
            if (prev.includes(productId)) {
                toast.info("Removed from Wishlist");
                return prev.filter(id => id !== productId);
            } else {
                toast.success("Added to Wishlist");
                return [...prev, productId];
            }
        });
    };

    const addToCart = async (itemId, size) => {
        if (!token) {
            toast.error("Please login to add items to cart");
            navigate('/login');
            return; 
        }

        if (!size) {
            toast.error("Select Product Size");
            return;
        }
        
        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/add', { itemId, size }, { headers: { token } });
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
    };

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            if (!itemInfo) continue; 

            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                } catch (error) {}
            }
        }
        return totalAmount;
    };

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {}
            }
        }
        return totalCount;
    };

    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId][size] = quantity;
        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity }, { headers: { token } });
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
    };

    const getProductsData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list');
            if (response.data.success) {
                const cleanProducts = response.data.products.map((item) => {
                    if (item.image && item.image[0] && !item.image[0].startsWith("http")) {
                        const localP = localProducts.find((p) =>
                            p.image && p.image.some(img => typeof img === 'string' && img.includes(item.image[0]))
                        );
                        if (localP && localP.image) {
                            return { ...item, image: localP.image }; 
                        }
                    }
                    return item;
                });
                setProducts(cleanProducts);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const getUserCart = async (userToken) => {
        try {
            const response = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { token: userToken } });
            if (response.data.success) {
                setCartItems(response.data.cartData);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // 🌟 دمج وترتيب الاستدعاءات النظيفة وقت التحميل المبدئي لضمان التزامن
    useEffect(() => {
        getProductsData();
        const savedToken = sessionStorage.getItem("token");
        if (savedToken) {
            getUserCart(savedToken);
        }
    }, []);

    const value = {
        products,
        currency,
        delivery_fee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItems,
        addToCart,
        setCartItems,
        clearCart, 
        getCartCount,
        updateQuantity,
        getCartAmount,
        navigate,
        backendUrl,
        setToken,
        token,
        wishlist,        
        toggleWishlist,   
        setWishlist
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;