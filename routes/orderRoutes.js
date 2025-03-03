import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import { 
    addOrderItems, 
    getAllOrders, 
    getOrderById, 
    getMyOrders, 
    updateOrderToPaid, 
    updateOrderToDelivered 
} from '../controllers/orderController.js';

const router = express.Router();

// إنشاء طلب جديد + جلب كل الطلبات (للمدير فقط)
router.route('/').post(protect, addOrderItems).get(protect, admin, getAllOrders);

// جلب الطلبات الخاصة بالمستخدم
router.route("/myorders").get(protect, getMyOrders);

// جلب طلب معين عن طريق ID
router.route("/:id").get(protect, getOrderById);

// تحديث الطلب إلى مدفوع
router.route("/:id/pay").put(protect, updateOrderToPaid);

// تحديث الطلب إلى تم التسليم (للمدير فقط)
router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);

export default router;
