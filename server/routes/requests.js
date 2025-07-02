import express from 'express';
import BloodRequest from '../models/BloodRequest.js';
import Inventory from '../models/Inventory.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get all blood requests
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { 
      status, 
      urgency, 
      bloodType, 
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    // Build query
    let query = {};
    if (status) query.status = status;
    if (urgency) query.urgency = urgency;
    if (bloodType) query.bloodType = bloodType;

    const requests = await BloodRequest.find(query)
      .populate('processedBy', 'name email')
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await BloodRequest.countDocuments(query);

    res.json({
      success: true,
      requests,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch requests',
      error: error.message
    });
  }
});

// Create new blood request
router.post('/', authenticateToken, async (req, res) => {
  try {
    const requestData = {
      ...req.body,
      processedBy: req.user.userId
    };

    const bloodRequest = new BloodRequest(requestData);
    await bloodRequest.save();

    res.status(201).json({
      success: true,
      message: 'Blood request created successfully',
      request: bloodRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create request',
      error: error.message
    });
  }
});

// Get request by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id)
      .populate('processedBy', 'name email');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    res.json({
      success: true,
      request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch request',
      error: error.message
    });
  }
});

// Update request status
router.put('/:id/status', authenticateToken, requireRole(['admin', 'staff']), async (req, res) => {
  try {
    const { status, notes } = req.body;
    const validStatuses = ['pending', 'approved', 'fulfilled', 'rejected', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const request = await BloodRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // If approving, check inventory availability
    if (status === 'approved' && request.status === 'pending') {
      const inventory = await Inventory.findOne({ bloodType: request.bloodType });
      if (!inventory || inventory.getAvailable() < request.quantity) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient blood inventory for this request'
        });
      }

      // Reserve the blood
      inventory.reserve(request.quantity);
      await inventory.save();
    }

    // If fulfilling, update inventory
    if (status === 'fulfilled' && request.status === 'approved') {
      const inventory = await Inventory.findOne({ bloodType: request.bloodType });
      if (inventory) {
        inventory.release(request.quantity);
        await inventory.save();
      }
      request.fulfilledDate = new Date();
    }

    request.status = status;
    if (notes) request.notes = notes;
    request.processedBy = req.user.userId;

    await request.save();

    res.json({
      success: true,
      message: 'Request status updated successfully',
      request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update request status',
      error: error.message
    });
  }
});

// Get urgent requests
router.get('/urgent/list', authenticateToken, async (req, res) => {
  try {
    const urgentRequests = await BloodRequest.find({
      urgency: { $in: ['high', 'critical'] },
      status: { $in: ['pending', 'approved'] }
    })
      .sort({ urgency: -1, requiredBy: 1 })
      .populate('processedBy', 'name email');

    res.json({
      success: true,
      requests: urgentRequests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch urgent requests',
      error: error.message
    });
  }
});

// Get overdue requests
router.get('/overdue/list', authenticateToken, async (req, res) => {
  try {
    const overdueRequests = await BloodRequest.find({
      requiredBy: { $lt: new Date() },
      status: { $ne: 'fulfilled' }
    })
      .sort({ requiredBy: 1 })
      .populate('processedBy', 'name email');

    res.json({
      success: true,
      requests: overdueRequests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch overdue requests',
      error: error.message
    });
  }
});

export default router;