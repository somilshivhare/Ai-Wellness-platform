import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    age: Number,
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer_not_to_say'],
    },
    medicalHistory: [String],
    currentMedications: [String],
    allergies: [String],
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String,
    },
    wellness: {
      stressLevel: Number, // 1-10
      sleepQuality: Number, // 1-10
      anxiety: Number, // 1-10
      mood: String,
      lastUpdated: Date,
    },
    assessmentCompleted: {
      type: Boolean,
      default: false,
    },
    preferredDoctorSpecialization: String,
  },
  { timestamps: true }
);

export default mongoose.model('Patient', patientSchema);
