import express from 'express'
import {
    placeOrder,
    placeOrderStripe,
    placeOrderRazorpay,
    allOrders,
    userOrders,
    updateStatus,
    verifyStripe,
    getDashboardAnalytics // 🌟 ضفنا استيراد الدالة الجديدة هنا
} from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'

const orderRouter = express.Router()

// Admin Features
orderRouter.post('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, updateStatus)
orderRouter.post('/dashboard-analytics', adminAuth, getDashboardAnalytics) // 🌟 السطر السحري اللّي هيقفل الـ 404 نهائياً!

// Payment Features
orderRouter.post('/place', authUser, placeOrder)
orderRouter.post('/stripe', authUser, placeOrderStripe)
orderRouter.post('/razorpay', authUser, placeOrderRazorpay)

// User Features 
orderRouter.post('/userorders', authUser, userOrders)

// verify payment 
orderRouter.post('/verifyStripe', authUser, verifyStripe)

export default orderRouter