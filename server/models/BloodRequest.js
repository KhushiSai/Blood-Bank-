import mongoose from 'mongoose';

const bloodRequestSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: [true, 'Patient name is required'],
    trim: true
  },
  bloodType: {
    type: String,
    required: [true, 'Blood type is required'],
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'fulfilled', 'rejected', 'cancelled'],
    default: 'pending'
  },
  hospitalName: {
    type: String,
    required: [true, 'Hospital name is required']
  },
  contactPerson: {
    type: String,
    required: [true, 'Contact person is required']
  },
  contactPhone: {
    type: String,
    required: [true, 'Contact phone is required']
  },
  contactEmail: {
    type: String,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  requestDate: {
    type: Date,
    default: Date.now
  },
  requiredBy: {
    type: Date,
    required: [true, 'Required by date is required']
  },
  fulfilledDate: {
    type: Date
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes must be less than 500 characters']
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for efficient queries
bloodRequestSchema.index({ 
  status: 1, 
  urgency: 1, 
  bloodType: 1,
  requiredBy: 1 
});

// Virtual for checking if request is overdue
bloodRequestSchema.virtual('isOverdue').get(function() {
  return new Date() > this.requiredBy && this.status !== 'fulfilled';
});

export default mongoose.model('BloodRequest', bloodRequestSchema);