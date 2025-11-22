import express from 'express';
import { db, ObjectId } from '../server.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/products/');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Add product with image
router.post('/add', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const { name, category, price, description, phone, email } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({ message: 'Name, category, and price are required' });
    }

    const newProduct = {
      name,
      category,
      price: parseFloat(price),
      description: description || '',
      image: req.file ? `/uploads/products/${req.file.filename}` : null,
      seller: {
        userId: req.user.userId,
        email,
        phone
      },
      createdAt: new Date()
    };

    const result = await db.collection('products').insertOne(newProduct);
    
    res.status(201).json({ 
      message: 'Product added successfully', 
      productId: result.insertedId,
      product: newProduct
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all products
router.get('/all', async (req, res) => {
  try {
    const products = await db.collection('products').find().sort({ createdAt: -1 }).toArray();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const products = await db.collection('products')
      .find({ category })
      .sort({ createdAt: -1 })
      .toArray();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's products
router.get('/my-products', verifyToken, async (req, res) => {
  try {
    const products = await db.collection('products')
      .find({ 'seller.userId': req.user.userId })
      .sort({ createdAt: -1 })
      .toArray();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;