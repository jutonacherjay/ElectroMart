import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient, ObjectId } from 'mongodb';
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import productRoutes from './routes/products.js';
import adminRoutes from './routes/admin.js';
import notificationRoutes from './routes/notifications.js';

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const client = new MongoClient(process.env.MONGODB_URI);
let db;

client.connect()
  .then(() => {
    db = client.db('ElectroMarketDB');
    console.log('✅ MongoDB Connected to ElectroMarketDB');

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/profile', profileRoutes);
    app.use('/api/products', productRoutes);
    app.use('/api/admin', adminRoutes);

    app.get('/', (req, res) => res.send('Backend is working!'));

    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`\n🚀 Server running on port ${port}`);
      console.log('\n📍 Available Routes:');
      console.log('   User Routes:');
      console.log('     POST /api/auth/signup');
      console.log('     POST /api/auth/login');
      console.log('     GET  /api/profile');
      console.log('     PUT  /api/profile');
      console.log('   Product Routes:');
      console.log('     POST /api/products/add');
      console.log('     GET  /api/products/all');
      console.log('     GET  /api/products/my-products');
      console.log('     GET  /api/products/category/:category');
      console.log('   Admin Routes:');
      console.log('     POST /api/admin/login');
      console.log('     GET  /api/admin/stats\n');
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
  });

export { db, ObjectId };