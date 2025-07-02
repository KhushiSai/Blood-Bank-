import express from 'express';
import Donor from '../models/Donor.js';
import User from '../models/User.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get all donors (admin/staff only)
router.get('/', authenticateToken, requireRole(['admin', 'staff']), async (req, res) => {
  try {
    const { bloodType, status, search, page = 1, limit = 10 } = req.query;
    
    // Build query
    let query = {};
    if (bloodType) query.bloodType = bloodType;
    if (status) query.eligibilityStatus = status;

    const donors = await Donor.find(query)
      .populate('user', 'name email phone address')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Donor.countDocuments(query);

    res.json({
      success: true,
      donors,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch donors',
      error: error.message
    });
  }
});

// Get donor by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id).populate('user');
    
    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor not found'
      });
    }

    res.json({
      success: true,
      donor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch donor',
      error: error.message
    });
  }
});

// Update donor profile
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const {
      bloodType,
      medicalHistory,
      eligibilityStatus,
      notes,
      emergencyContact
    } = req.body;

    const donor = await Donor.findByIdAndUpdate(
      req.params.id,
      {
        bloodType,
        medicalHistory,
        eligibilityStatus,
        notes,
        emergencyContact
      },
      { new: true, runValidators: true }
    ).populate('user');

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor not found'
      });
    }

    res.json({
      success: true,
      message: 'Donor updated successfully',
      donor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update donor',
      error: error.message
    });
  }
});

// Record a donation
router.post('/:id/donation', authenticateToken, requireRole(['admin', 'staff']), async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    
    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor not found'
      });
    }

    // Update donation history
    donor.lastDonation = new Date();
    donor.totalDonations += 1;
    await donor.save();

    res.json({
      success: true,
      message: 'Donation recorded successfully',
      donor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to record donation',
      error: error.message
    });
  }
});

// Get donors by blood type
router.get('/blood-type/:type', authenticateToken, async (req, res) => {
  try {
    const { type } = req.params;
    const validBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    
    if (!validBloodTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blood type'
      });
    }

    const donors = await Donor.find({ 
      bloodType: type,
      eligibilityStatus: 'eligible'
    }).populate('user', 'name email phone');

    res.json({
      success: true,
      donors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch donors by blood type',
      error: error.message
    });
  }
});

export default router;