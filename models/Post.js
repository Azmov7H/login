import mongoose from "mongoose";
const postSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    username: { type: String, required: true }, // ✅ تغيير `name` إلى `username`
    image: { type: String, required: true },
    category: { type: String, required: true },
    content: { type: String, required: true }, // ✅ تغيير `post` إلى `content`
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema); // ✅ تغيير اسم الموديل من `Product` إلى `Post`
export default Post;
