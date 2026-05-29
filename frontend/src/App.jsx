import React, { useEffect } from "react"; 
import { Routes, Route, useLocation } from "react-router-dom"; 
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import Orders from "./pages/Orders";
import Profile from './pages/Profile';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from './pages/Verify';
import Wishlist from "./pages/Wishlist";
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';



const App = () => {
    const location = useLocation(); 

    // تأثير لتحديث عناوين الصفحات وصعود الشاشة عند تنقل المسارات الفعلي
    useEffect(() => {
        const pageTitles = {
            "/": "Shopping fashion | Home",
            "/collection": "Collection | Shopping fashion",
            "/about": "About Us | Shopping fashion",
            "/contact": "Contact Us | Shopping fashion",
            "/cart": "Your Cart | Shopping fashion",
            "/login": "Login | Shopping fashion",
            "/place-order": "Checkout | Shopping fashion",
            "/orders": "My Orders | Shopping fashion",
            "/profile": "My Profile | Shopping fashion",
            "/verify": "Verify Payment | Shopping fashion",
            "/wishlist": "My Wishlist | Shopping fashion",
            "/forgot-password": "Forgot Password | Shopping fashion"
        };

        const currentPath = location.pathname;

        if (pageTitles[currentPath]) {
            document.title = pageTitles[currentPath];
        } else if (currentPath.startsWith("/product/")) {
            document.title = "Product Details | Shopping fashion";
        } else if (currentPath.startsWith("/reset-password/")) {
            document.title = "Reset Password | Shopping fashion";
        } else {
            document.title = "404 Not Found | Shopping fashion";
        }

        // صعود تلقائي آمن عند الانتقال لصفحة جديدة
        window.scrollTo({ top: 0, behavior: "instant" });
    }, [location.pathname]); // المراقبة هنا على pathname فقط لمنع الكراشات

    return (
        <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
            <ToastContainer/>
            <Navbar />
            <SearchBar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/collection" element={<Collection />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} /> 
                <Route path="/product/:productId" element={<Product />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/place-order" element={<PlaceOrder />} />
                <Route path="/orders" element={<Orders />} />
                <Route path='/profile' element={<Profile />} />
                <Route path="/verify" element={<Verify />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path='/forgot-password' element={<ForgotPassword />} />
                <Route path='/reset-password/:token' element={<ResetPassword />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
        </div>
    );
};

export default App;