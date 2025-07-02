import express from 'express';
import Inventory from '../models/Inventory.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get all inventory
router.get('/', authenticateToken, async (req, res) => {
  try {
    const inventory = await Inventory.find().sort({ bloodType: 1 });
    
    res.json({
      success: true,
      inventory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inventory',
      error: error.message
    });
  }
});

// Update inventory quantity
router.put('/:bloodType', authenticateToken, requireRole(['admin', 'staff']), async (req, res) => {
  try {
    const { bloodType } = req.params;
    const { quantity, operation = 'set' } = req.body; // operation: 'set', 'add', 'subtract'

    let inventory = await Inventory.findOne({ bloodType });
    
    if (!inventory) {
      // Create new inventory record if it doesn't exist
      inventory = new Inventory({ bloodType, quantity: 0 });
    }

    switch (operation) {
      case 'add':
        inventory.quantity += quantity;
        break;
      case 'subtract':
        inventory.quantity = Math.max(0, inventory.quantity - quantity);
        break;
      case 'set':
      default:
        inventory.quantity = quantity;
        break;
    }

    inventory.lastUpdated = new Date();
    inventory.updatedBy = req.user.userId;
    
    await inventory.save();

    res.json({
      success: true,
      message: 'Inventory updated successfully',
      inventory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update inventory',
      error: error.message
    });
  }
});

// Reserve blood for a request
router.post('/reserve', authenticateToken, requireRole(['admin', 'staff']), async (req, res) => {
  try {
    const { bloodType, quantity } = req.body;

    const inventory = await Inventory.findOne({ bloodType });
    
    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Blood type not found in inventory'
      });
    }

    if (!inventory.reserve(quantity)) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient blood available for reservation'
      });
    }

    await inventory.save();

    res.json({
      success: true,
      message: 'Blood reserved successfully',
      inventory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to reserve blood',
      error: error.message
    });
  }
});

// Release reserved blood
router.post('/release', authenticateToken, requireRole(['admin', 'staff']), async (req, res) => {
  try {
    const { bloodType, quantity } = req.body;

    const inventory = await Inventory.findOne({ bloodType });
    
    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Blood type not found in inventory'
      });
    }

    inventory.release(quantity);
    await inventory.save();

    res.json({
      success: true,
      message: 'Blood released successfully',
      inventory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to release blood',
      error: error.message
    });
  }
});

// Get low stock alerts
router.get('/alerts', authenticateToken, async (req, res) => {
  try {
    const { threshold = 20 } = req.query;
    
    const lowStockItems = await Inventory.find({
      quantity: { $lt: threshold }
    }).sort({ quantity: 1 });

    res.json({
      success: true,
      alerts: lowStockItems.map(item => ({
        bloodType: item.bloodType,
        currentQuantity: item.quantity,
        status: item.quantity < 10 ? 'critical' : 'low',
        lastUpdated: item.lastUpdated
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch alerts',
      error: error.message
    });
  }
});

export default router;