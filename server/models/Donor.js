import mongoose from 'mongoose';

const donorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bloodType: {
    type: String,
    required: [true, 'Blood type is required'],
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  lastDonation: {
    type: Date
  },
  totalDonations: {
    type: Number,
    default: 0,
    min: 0
  },
  medicalHistory: {
    allergies: [String],
    medications: [String],
    chronicConditions: [String]
  },
  eligibilityStatus: {
    type: String,
    enum: ['eligible', 'temporarily_ineligible', 'permanently_ineligible'],
    default: 'eligible'
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes must be less than 500 characters']
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
donorSchema.index({ bloodType: 1, eligibilityStatus: 1 });

export default mongoose.model('Donor', donorSchema);