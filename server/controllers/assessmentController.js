import Assessment from '../models/Assessment.js';
import Patient from '../models/Patient.js';

// Determine recommended specialization based on assessment
const getRecommendedSpecialization = (assessment) => {
  const { anxietyLevel, stressLevel, mood, suicidalThoughts, harmfulBehavior, substanceUse } = assessment;

  if (suicidalThoughts || harmfulBehavior) {
    return 'Psychiatrist';
  }

  if (substanceUse) {
    return 'Psychiatrist';
  }

  if (anxietyLevel >= 8 || stressLevel >= 8) {
    return 'Clinical Psychologist';
  }

  if (mood === 'very_sad' || mood === 'sad') {
    return 'Therapist';
  }

  return 'Counselor';
};

export const createAssessment = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user.id });

    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    const assessment = new Assessment({
      patientId: patient._id,
      ...req.body,
      // if user explicitly chose a specialization, honour it; otherwise compute one
      recommendedSpecialization:
        req.body.desiredSpecialization || getRecommendedSpecialization(req.body),
    });

    await assessment.save();

    // Update patient's wellness data
    patient.wellness = {
      stressLevel: req.body.stressLevel,
      sleepQuality: req.body.sleepQuality,
      anxiety: req.body.anxietyLevel,
      mood: req.body.mood,
      lastUpdated: new Date(),
    };
    patient.assessmentCompleted = true;
    patient.preferredDoctorSpecialization = assessment.recommendedSpecialization;
    // also optionally update demographic info on patient record
    if (req.body.age) patient.age = req.body.age;
    if (req.body.gender) patient.gender = req.body.gender;
    if (req.body.patientName) patient.fullName = req.body.patientName;

    await patient.save();

    res.status(201).json({
      message: 'Assessment completed successfully',
      assessment,
      recommendedSpecialization: assessment.recommendedSpecialization,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLatestAssessment = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user.id });

    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    const assessment = await Assessment.findOne({ patientId: patient._id }).sort({
      createdAt: -1,
    });

    if (!assessment) {
      return res.status(404).json({ message: 'No assessment found' });
    }

    res.status(200).json(assessment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAssessmentHistory = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user.id });

    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    const assessments = await Assessment.find({ patientId: patient._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(assessments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    res.status(200).json({
      message: 'Assessment updated successfully',
      assessment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
