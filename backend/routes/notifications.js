// routes/notifications.js
import express from 'express';
import { db, ObjectId } from '../server.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Send notification when customer contacts seller
router.post('/whatsapp-contact', verifyToken, async (req, res) => {
  try {
    const { sellerId, productName, productId, customerName } = req.body;

    const notification = {
      type: 'whatsapp_contact',
      sellerId: new ObjectId(sellerId),
      customerId: new ObjectId(req.user.userId),
      customerName: customerName || 'A customer',
      productName,
      productId: productId ? new ObjectId(productId) : null,
      message: `${customerName || 'A customer'} wants to talk to you on WhatsApp about "${productName}"`,
      isRead: false,
      createdAt: new Date()
    };

    await db.collection('notifications').insertOne(notification);

    res.json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Notification error:', error);
    res.status(500).json({ message: 'Error sending notification' });
  }
});

// Get seller notifications
router.get('/seller', verifyToken, async (req, res) => {
  try {
    const notifications = await db.collection('notifications')
      .find({ sellerId: new ObjectId(req.user.userId) })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark notification as read
router.put('/:id/read', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.collection('notifications').updateOne(
      { _id: new ObjectId(id), sellerId: new ObjectId(req.user.userId) },
      { $set: { isRead: true, readAt: new Date() } }
    );

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get unread count
router.get('/unread-count', verifyToken, async (req, res) => {
  try {
    const count = await db.collection('notifications').countDocuments({
      sellerId: new ObjectId(req.user.userId),
      isRead: false
    });

    res.json({ count });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;