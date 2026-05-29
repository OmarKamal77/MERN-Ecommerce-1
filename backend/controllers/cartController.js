import userModel from "../models/userModel.js"

// add product to user cart
const addToCart = async (req, res) => {
    try {
        const { userId, itemId, size } = req.body;

        // 🌟 تحسين طلقة: سحب حقل السلة فقط من غير تحميل داتا اليوزر كاملة لتسريع الاستجابة
        const userData = await userModel.findById(userId).select("cartData");
        let cartData = userData.cartData || {};

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

        await userModel.findByIdAndUpdate(userId, { cartData });

        // 🌟 تم تصليح الـ Typo من massage إلى message لضمان ظهور التنبيهات في الـ Frontend بالملّي
        res.json({ success: true, message: "Added To Cart" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// update to user cart
const updateCart = async (req, res) => {
    try {
        const { userId, itemId, size, quantity } = req.body;

        const userData = await userModel.findById(userId).select("cartData");
        let cartData = userData.cartData || {};

        if (cartData[itemId]) {
            cartData[itemId][size] = quantity;
        }

        await userModel.findByIdAndUpdate(userId, { cartData });

        // 🌟 تم تصليح الـ Typo هنا أيضاً ليعمل الـ Toast بنجاح
        res.json({ success: true, message: "Cart Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// get user cart data
const getUserCart = async (req, res) => {
    try {
        const { userId } = req.body;

        const userData = await userModel.findById(userId).select("cartData");
        let cartData = userData.cartData || {};

        res.json({ success: true, cartData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { addToCart, updateCart, getUserCart };