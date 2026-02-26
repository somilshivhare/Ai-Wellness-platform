import mongoose from 'mongoose';

const assessmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    stressLevel: {
      type: Number,
      min: 1,
      max: 10,
      required: true,
    },
    sleepQuality: {
      type: Number,
      min: 1,
      max: 10,
      required: true,
    },
    sleepHours: Number,
    anxietyLevel: {
      type: Number,
      min: 1,
      max: 10,
      required: true,
    },
    mood: {
      type: String,
      enum: ['very_sad', 'sad', 'neutral', 'happy', 'very_happy'],
      required: true,
    },
    mainConcerns: [String],
    exerciseFrequency: {
      type: String,
      enum: ['never', 'rarely', 'sometimes', 'regularly', 'daily'],
    },
    dietQuality: {
      type: String,
      enum: ['poor', 'fair', 'good', 'excellent'],
    },
    socialConnections: {
      type: String,
      enum: ['isolated', 'few', 'moderate', 'strong'],
    },
    workLifeBalance: {
      type: Number,
      min: 1,
      max: 10,
    },
    suicidalThoughts: Boolean,
    harmfulBehavior: Boolean,
    substanceUse: Boolean,
    // additional patient details collected during assessment
    patientName: String,
    age: Number,
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    desiredSpecialization: String,
    recommendedSpecialization: String,
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Assessment', assessmentSchema);
