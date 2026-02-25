import mongoose from 'mongoose';

const videoSessionSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true,
    },
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
    status: {
      type: String,
      enum: ['pending', 'active', 'completed', 'cancelled'],
      default: 'pending',
    },
    startedAt: Date,
    endedAt: Date,
    duration: Number, // in seconds
    patientJoined: {
      type: Boolean,
      default: false,
    },
    doctorJoined: {
      type: Boolean,
      default: false,
    },
    recordingUrl: String,
  },
  { timestamps: true }
);

export default mongoose.model('VideoSession', videoSessionSchema);
