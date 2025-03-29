import express from 'express';
import dotenv from 'dotenv';
import connectDB from './components/config/database';
import authRoutes from './components/auth/auth.routes';
import cors from 'cors';
import roleRoutes from './components/role/role.routes';
import multer from 'multer';
import { storage } from './components/utils/multer';

dotenv.config(); // Load .env variables

const app = express();

app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PATCH", "DELETE"], 
      credentials: true, 
    })
  );
connectDB(); // ⬅️ Connect to MongoDB

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const upload = multer({ storage });
app.use(upload.any());

app.use('/api/auth', authRoutes)
app.use('/api/role', roleRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
