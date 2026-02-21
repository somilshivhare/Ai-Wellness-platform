const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
    // Medicine name recommended by the doctor.
    name: {
        type: String,
        required: true,
        trim: true
    },
    // Dosage instructions for the medication.
    dosage: {
        type: String,
        trim: true
    },
    // Duration to take the medicine.
    duration: {
        type: String,
        trim: true
    }
}, { _id: false });

const doctorNotesSchema = new mongoose.Schema({
    // Appointment that generated these notes.
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true,
        unique: true
    },
    // Doctor authoring the notes.
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Patient the notes belong to.
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Diagnosis string the doctor recorded.
    diagnosis: {
        type: String,
        trim: true
    },
    // Suggestions or next steps for the patient.
    suggestions: {
        type: String,
        trim: true
    },
    // Medicines prescribed along with metadata.
    medicines: {
        type: [medicineSchema],
        default: []
    },
    // Scheduled follow-up date.
    followUpDate: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('DoctorNotes', doctorNotesSchema);
