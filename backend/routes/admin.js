// routes/admin.js
import express from 'express';
import jwt from 'jsonwebtoken';
import { db, ObjectId } from '../server.js';

const router = express.Router();

// Predefined admin credentials
const ADMIN_EMAIL = 'admin@electromart.com';
const ADMIN_PASSWORD = 'admin123'; // Change this to a secure password

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if credentials match predefined admin
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { email: ADMIN_EMAIL, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ 
      token, 
      admin: { 
        email: ADMIN_EMAIL,
        role: 'admin' 
      } 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin middleware
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token missing' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Get dashboard statistics
router.get('/stats', verifyAdmin, async (req, res) => {
  try {
    // Count users
    const userCount = await db.collection('users').countDocuments();

    // Count products
    const productCount = await db.collection('products').countDocuments();

    // Count unique categories
    const categories = await db.collection('products').distinct('category');
    const categoryCount = categories.length;

    // Get recent users (last 5)
    const recentUsers = await db.collection('users')
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .project({ password: 0 }) // Don't send passwords
      .toArray();

    // Get recent products (last 5)
    const recentProducts = await db.collection('products')
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    // Category wise product count
    const categoryStats = await db.collection('products').aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]).toArray();

    // User registration trend (monthly)
    const userRegistrationTrend = await db.collection('users').aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ]).toArray();

    // Format month names
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedUserTrend = userRegistrationTrend.map(item => ({
      month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      users: item.count
    }));

    res.json({
      stats: {
        totalUsers: userCount,
        totalProducts: productCount,
        totalCategories: categoryCount
      },
      recentUsers,
      recentProducts,
      categoryStats,
      userRegistrationTrend: formattedUserTrend
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
router.get('/users', verifyAdmin, async (req, res) => {
  try {
    const users = await db.collection('users')
      .find({})
      .project({ password: 0 })
      .sort({ createdAt: -1 })
      .toArray();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all products
router.get('/products', verifyAdmin, async (req, res) => {
  try {
    const products = await db.collection('products')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user
router.delete('/users/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('users').deleteOne({ _id: new ObjectId(id) });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product
router.delete('/products/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('products').deleteOne({ _id: new ObjectId(id) });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;