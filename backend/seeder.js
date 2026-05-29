import { oldProductsRaw } from './oldProducts.js';
import csv from 'csvtojson';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import productModel from './models/productModel.js'; 

dotenv.config();

const seedDatabase = async () => {
    try {
        // 1. الاتصال بقاعدة البيانات الصحيحة
        await mongoose.connect(`${process.env.MONGODB_URI}/e-commerce`);
        console.log("Connected to MongoDB successfully...");

        // 2. قراءة ملف الـ CSV (الـ 996 منتج بتوع شوبيفاي)
        const jsonArray = await csv().fromFile('./Fashion.csv');
        const productsMap = {};

        jsonArray.forEach((row) => {
            const handle = row['Handle'];
            if (!handle) return; 

            if (!productsMap[handle]) {
                const category = row['Type'] || "Men";

                // 🌟 الحل الجذري: تنظيف الـ Sub-Category واصطياد النصوص الحقيقية فقط من الـ Tags
                let subCategory = "Topwear"; // القيمة الافتراضية كحزام أمان
                if (row['Tags']) {
                    // تحويل الـ Tags لمصفوفة وتنظيف المسافات المحيطة بالكلمات
                    const tagsArray = row['Tags'].split(',').map(tag => tag.trim());
                    
                    // البحث عن أول تاغ نصي حقيقي (ليس رقماً وليس كلمة bestseller)
                    const validTextTag = tagsArray.find(tag => tag && isNaN(tag) && tag.toLowerCase() !== 'bestseller');
                    
                    if (validTextTag) {
                        subCategory = validTextTag; // اعتماد الكلمة النضيفة مباشرة (مثل Topwear أو Bottomwear)
                    }
                }

                let finalDescription = "High-quality fashion apparel, perfect for everyday style and maximum comfort.";
                if (row['Body (HTML)']) {
                    const strippedHtml = row['Body (HTML)'].replace(/<\/?[^>]+(>|$)/g, "").trim();
                    if (strippedHtml.length > 0) {
                        finalDescription = strippedHtml;
                    }
                }

                productsMap[handle] = {
                    name: row['Title'] || "Fashion Item",
                    description: finalDescription,
                    price: Number(row['Variant Price']) || 50,
                    image: [],
                    category: category,
                    subCategory: subCategory,
                    sizes: [], 
                    bestseller: row['Tags']?.includes('bestseller') || false,
                    date: Date.now()
                };
            }

            if (row['Image Src'] && !productsMap[handle].image.includes(row['Image Src'])) {
                productsMap[handle].image.push(row['Image Src']);
            }

            const size = row['Option2 Value'] || row['Option1 Value'];
            if (size && isNaN(size) && !productsMap[handle].sizes.includes(size) && size.length < 5) {
                productsMap[handle].sizes.push(size);
            }
        });

        // تحويل الـ Map إلى مصفوفة
        let finalProducts = Object.values(productsMap).filter(p => p.name && p.image.length > 0);

        // 🌟 3. التعديل السحري: دمج المنتجات وطرد الـ _id البايظ (aaaaa) عشان المونجوس يقبله
        console.log(`Merging ${oldProductsRaw.length} old products and fixing their IDs...`);
        oldProductsRaw.forEach(oldP => {
            const cleanProduct = { ...oldP };
            delete cleanProduct._id; // طرد الـ _id النصي المقفوش عشان الـ MongoDB يعوضه بـ ObjectId حقيقي

            finalProducts.push({
                ...cleanProduct,
                date: oldP.date || Date.now()
            });
        });

        // 4. الفحص الصارم للمقاسات على الـ 1048 منتج بالكامل
        finalProducts.forEach((product) => {
            if (!product.sizes || product.sizes.length === 0) {
                product.sizes = ["S", "M", "L", "XL"]; 
            }
        });

        if (finalProducts.length === 0) {
            console.log("⚠️ No products found to seed.");
            process.exit();
        }

        // 5. مسح الداتا القديمة الناقصة من قاعدة البيانات
        console.log("Cleaning old products from database...");
        await productModel.deleteMany({});

        // 6. رفع الـ 1048 منتج كاملين مكملين بنظافة تامة
        await productModel.insertMany(finalProducts);
        
        console.log(`🎉 Successfully re-seeded ${finalProducts.length} TOTAL products (52 Old + 996 Shopify) WITH guaranteed clean subCategories and valid ObjectIds!`);
        process.exit();

    } catch (error) {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    }
};

seedDatabase();