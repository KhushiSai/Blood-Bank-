import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  bloodType: {
    type: String,
    required: [true, 'Blood type is required'],
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    unique: true
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
    default: 0
  },
  reserved: {
    type: Number,
    default: 0,
    min: [0, 'Reserved quantity cannot be negative']
  },
  expiryAlerts: [{
    unitId: String,
    expiryDate: Date,
    alertLevel: {
      type: String,
      enum: ['warning', 'critical'],
      default: 'warning'
    }
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Method to get available quantity
inventorySchema.methods.getAvailable = function() {
  return this.quantity - this.reserved;
};

// Method to reserve blood
inventorySchema.methods.reserve = function(amount) {
  if (this.getAvailable() >= amount) {
    this.reserved += amount;
    return true;
  }
  return false;
};

// Method to release reserved blood
inventorySchema.methods.release = function(amount) {
  this.reserved = Math.max(0, this.reserved - amount);
  this.quantity = Math.max(0, this.quantity - amount);
};

export default mongoose.model('Inventory', inventorySchema);