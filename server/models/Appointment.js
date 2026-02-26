import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      default: 60, // in minutes
    },
    consultationType: {
      type: String,
      enum: ['video', 'chat', 'phone'],
      required: true,
    },
    status: {
      type: String,
      enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
      default: 'scheduled',
    },
    notes: String,
    cancellationReason: String,
    cancelledBy: String, // 'patient' or 'doctor'
    cancelledAt: Date,
    cost: Number,
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    chatSessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChatSession',
    },
    videoSessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VideoSession',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Appointment', appointmentSchema);
