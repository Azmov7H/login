import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import connectDB from './config/db.js';
import orderRoutes from './routes/orderRoutes.js';
import cors from "cors"
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());



app.use('/api/post', productRoutes);
app.use('/api/users', userRoutes);


app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running on port ${PORT}`.green.bold));
