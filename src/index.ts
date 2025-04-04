import express from 'express';
import dotenv from 'dotenv';
import connectDB from './components/config/database';
import authRoutes from './components/auth/auth.routes';
import cors from 'cors';
import roleRoutes from './components/role/role.routes';


dotenv.config(); // Load .env variables

const app = express();

app.use(
    cors({
      origin: ["http://localhost:5173", "https://scanxperts.vercel.app", "https://www.scanxperts.in"],
      methods: ["GET", "POST", "PATCH", "DELETE"], 
      credentials: true, 
    })
  );
connectDB(); // ⬅️ Connect to MongoDB

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes)
app.use('/api/role', roleRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
