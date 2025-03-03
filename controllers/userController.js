import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';

// ✅ تسجيل الدخول
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "يرجى توفير البريد الإلكتروني وكلمة المرور" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (user && (await user.matchPassword(password))) {
        return res.json({
            success: true,
            message: "تم تسجيل الدخول بنجاح ✅",
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        return res.status(401).json({ message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
    }
});

// ✅ تسجيل مستخدم جديد
const registerUser = asyncHandler(async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'يرجى ملء جميع الحقول المطلوبة' });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });

        if (existingUser) {
            return res.status(400).json({ message: 'هذا البريد الإلكتروني مستخدم بالفعل' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
        });

        if (user) {
            return res.status(201).json({
                success: true,
                message: "تم إنشاء الحساب بنجاح 🎉",
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            return res.status(400).json({ message: 'فشل إنشاء المستخدم' });
        }
    } catch (error) {
        console.error("خطأ في إنشاء المستخدم:", error);
        return res.status(500).json({ message: 'خطأ داخلي في السيرفر' });
    }
});

// ✅ جلب ملف المستخدم الشخصي
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        return res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    } else {
        return res.status(404).json({ message: 'لم يتم العثور على المستخدم' });
    }
});

// ✅ تحديث بيانات المستخدم
const updateUser = asyncHandler(async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'المستخدم غير موجود' });
        }

        if (email && email.toLowerCase() !== user.email) {
            const emailExists = await User.findOne({ email: email.toLowerCase() });
            if (emailExists) {
                return res.status(400).json({ message: 'البريد الإلكتروني مستخدم بالفعل' });
            }
            user.email = email.toLowerCase();
        }

        if (name) user.name = name;

        const updatedUser = await user.save();

        return res.json({
            success: true,
            message: "تم تحديث البيانات بنجاح ✅",
            name: updatedUser.name,
            email: updatedUser.email,
        });
    } catch (error) {
        console.error("خطأ في تحديث المستخدم:", error);
        return res.status(500).json({ message: 'خطأ داخلي في السيرفر' });
    }
});

export { authUser, registerUser, getUserProfile, updateUser };
