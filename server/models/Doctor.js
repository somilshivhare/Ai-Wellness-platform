import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    specialization: {
      type: String,
      required: true,
      enum: ['Clinical Psychologist', 'Psychiatrist', 'Therapist', 'Counselor', 'Life Coach'],
    },
    license: {
      type: String,
      default: '',
    },
    experience: {
      type: Number,
      default: 0,
    },
    bio: String,
    qualifications: [String],
    hourlyRate: {
      type: Number,
      default: 0,
    },
    availability: [
      {
        day: String,
        startTime: String,
        endTime: String,
      },
    ],
    rating: {
      type: Number,
      default: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    languages: [String],
    consultationMode: {
      type: [String],
      enum: ['video', 'chat', 'phone'],
      default: ['video', 'chat'],
    },
    verified: {
      type: Boolean,
      default: false,
    },
    notifications: [
      {
        message: String,
        appointmentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Appointment',
        },
        seen: {
          type: Boolean,
          default: false,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Doctor', doctorSchema);
