import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js"; // الـ Import ده مهم عشان حساب عدد المنتجات
import Stripe from "stripe";

// global variables
const currency = "usd";
const deliveryCharge = 10;
// gateway initialization
const stripe = new Stripe(process.env.STRIP_SECRET_KEY);


// Placing orders using COD Method
const placeOrder = async(req,res) =>{
    try {
        const { userId, items, amount, address, paymentMethod } = req.body;

        const orderData ={
            userId,
            items,
            address,
            amount,
            paymentMethod:"COD",
            payment:false,
            date: Date.now()
        }

        const newOrder =new orderModel(orderData)
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId,{cartData:{}})

        res.json({success:true,message:'Order Placed'})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

// Placing orders using Stripe Method
const placeOrderStripe =async (req,res) =>{
    try {
        const { userId, items, amount, address } = req.body;
        const {origin} = req.headers;

        const orderData ={
            userId,
            items,
            address,
            amount,
            paymentMethod:"Stripe",
            payment:false,
            date: Date.now()
        }

        const newOrder =new orderModel(orderData)
        await newOrder.save()

        const line_items = items.map((item)=>({
            price_data:{
                currency:currency,
                product_data :{
                    name:item.name,
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }))
        line_items.push({
            price_data:{
                currency:currency,
                product_data :{
                    name:"Delivery Charges",
                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items: line_items,
            mode: 'payment',
        });
        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// verifying stripe 
const verifyStripe =async (req,res) => {
    const {orderId,success,userId} = req.body
    try{
        if(success === 'true'){
            await orderModel.findByIdAndUpdate(orderId,{payment:true})
            await userModel.findByIdAndUpdate(userId,{cartData:{}})
            res.json({success:true})
        }
        else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({success:false})
        }
    }catch (error) { 
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Placing orders using Razorpay Method 
const placeOrderRazorpay =async (req,res) =>{
    
}

// All Orders Data For Admin Panel 
const allOrders =async (req,res) =>{
    try {
        const orders = await orderModel.find({})
        res.json({success:true,orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

// User Order Data For Frontend
const userOrders =async (req,res) =>{
    try {
        const {userId} = req.body
        const orders = await orderModel.find({userId})
        res.json({success:true,orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

// Update Order Status from Admin Panel 
const updateStatus =async (req,res) =>{
    try {
        const {orderId,status} = req.body
        await orderModel.findByIdAndUpdate(orderId,{status})
        res.json({success:true,message:'Status Updated'})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

// الدالة المخصصة والفائقة السرعة للـ Dashboard Analytics بـ Field Projection ذكي
const getDashboardAnalytics = async (req, res) => {
    try {
        // سحب البيانات اللّي محتاجينها للشارت والكروت فقط وإسقاط الحقول الضخمة لتسريع الشبكة
        const orders = await orderModel.find({})
            .select("amount date status items.category items.price items.quantity");

        // حساب إجمالي المنتجات بكفاءة تامة مباشرة من الداتا بيز دون جلب مصفوفة المنتجات كاملة
        const productsCount = await productModel.countDocuments({});

        res.json({
            success: true,
            orders,
            productsCount
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { 
    verifyStripe, 
    placeOrder, 
    placeOrderStripe, 
    placeOrderRazorpay, 
    allOrders, 
    userOrders, 
    updateStatus, 
    getDashboardAnalytics 
};