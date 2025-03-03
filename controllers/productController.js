import Post from "../models/Post.js";

// 📌 إنشاء منشور جديد
export const createPost = async (req, res) => {
    try {
        const { title, content, category, image } = req.body;

        if (!title || !content || !category) {
            return res.status(400).json({ message: "الرجاء ملء جميع الحقول المطلوبة" });
        }

        const post = new Post({
            user: req.user._id, // ID المستخدم المسجل الدخول
            username: req.user.name, // اسم المستخدم
            title,
            content,
            category,
            image,
        });

        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ أثناء إنشاء المنشور", error: error.message });
    }
};

// 📌 جلب جميع المنشورات مع بيانات الناشر
export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate("user", "name email");
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ أثناء جلب المنشورات", error: error.message });
    }
};

// 📌 جلب منشور معين عبر الـ ID
export const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate("user", "name email");
        if (!post) {
            return res.status(404).json({ message: "لم يتم العثور على المنشور" });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ أثناء جلب المنشور", error: error.message });
    }
};

// 📌 تحديث منشور معين
export const updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "لم يتم العثور على المنشور" });
        }

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "غير مسموح لك بتعديل هذا المنشور" });
        }

        post.title = req.body.title || post.title;
        post.content = req.body.content || post.content;
        post.category = req.body.category || post.category;
        post.image = req.body.image || post.image;

        const updatedPost = await post.save();
        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ أثناء تحديث المنشور", error: error.message });
    }
};

// 📌 حذف منشور معين
export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "لم يتم العثور على المنشور" });
        }

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "غير مسموح لك بحذف هذا المنشور" });
        }

        await post.deleteOne();
        res.json({ message: "تم حذف المنشور بنجاح" });
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ أثناء حذف المنشور", error: error.message });
    }
};
