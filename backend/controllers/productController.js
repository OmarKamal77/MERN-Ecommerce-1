import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// function for add product
const addProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            subCategory,
            sizes,
            bestseller,
        } = req.body;

        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter(
            (item) => item !== undefined
        );

        const imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, {
                    resource_type: "image",
                });
                return result.secure_url;
            })
        );

        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true",
            sizes: JSON.parse(sizes),
            image: imagesUrl,
            date: Date.now(),
        };

        console.log(productData);
        const product = new productModel(productData);
        await product.save();

        res.json({ success: true, message: "Product Added" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// function for list product
const listProducts = async (req, res) => {
    try {
        // 🌟 تعديل الأداء الكاسح: استثناء الوصف والمقاسات والمراجعات لأن جدول العرض في الأدمن لا يحتاجهم
        const products = await productModel.find({}).select("-description -sizes -reviews");
        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// function for removing product
const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Product Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// function for single product info
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await productModel.findById(productId);
        res.json({ success: true, product });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Function to add a new review to a product
const addProductReview = async (req, res) => {
    try {
        const { productId, customerName, rating, comment } = req.body;

        if (!productId || !customerName || !rating || !comment) {
            return res.json({ success: false, message: "All fields are required" });
        }

        const updatedProduct = await productModel.findByIdAndUpdate(
            productId,
            {
                $push: {
                    reviews: { customerName, rating: Number(rating), comment }
                }
            },
            { new: true }
        );

        if (!updatedProduct) {
            return res.json({ success: false, message: "Product not found" });
        }

        res.json({ success: true, message: "Review added successfully", reviews: updatedProduct.reviews });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API للاقتراحات الفورية أثناء الكتابة
const getSearchSuggestions = async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query || query.trim() === "") {
            return res.json({ success: true, products: [] });
        }

        const products = await productModel.find({
            name: { $regex: query, $options: "i" }
        })
        .limit(5)
        .select("name image price category _id"); 

        res.json({ success: true, products });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

export { listProducts, addProduct, removeProduct, singleProduct, addProductReview, getSearchSuggestions };