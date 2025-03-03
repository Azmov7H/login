import express from "express";
import {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost
} from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js"; // Middleware لحماية المسارات

const router = express.Router();

// 📌 إضافة منشور جديد (محمي - يجب تسجيل الدخول)
router.post("/add", protect, createPost);

// 📌 جلب جميع المنشورات
router.get("/", getAllPosts);

// 📌 جلب منشور معين حسب الـ ID
router.get("/:id", getPostById);

// 📌 تحديث منشور معين (محمي - يجب أن يكون الناشر نفسه)
router.put("/:id", protect, updatePost);
router.get("/",protect,getAllPosts)
// 📌 حذف منشور معين (محمي - يجب أن يكون الناشر نفسه)
router.delete("/:id", protect, deletePost);

export default router;
