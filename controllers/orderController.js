import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';

// إنشاء طلب جديد
const addOrderItems = asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
        res.status(400);
        throw new Error('لا يوجد عناصر في الطلب');
    }

    const order = new Order({
        user: req.user._id,
        orderItems,
        shippingAddress,
        paymentMethod,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
});

// جلب جميع الطلبات (للمدير فقط)
const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
});

// جلب طلب معين
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
        res.json(order);
    } else {
        res.status(404);
        throw new Error('لم يتم العثور على الطلب');
    }
});

// جلب الطلبات الخاصة بالمستخدم
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
});

// تحديث الطلب إلى مدفوع
const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address,
        };

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('لم يتم العثور على الطلب');
    }
});

// تحديث الطلب إلى تم التسليم
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('لم يتم العثور على الطلب');
    }
});

export { addOrderItems, getAllOrders, getOrderById, getMyOrders, updateOrderToPaid, updateOrderToDelivered };
