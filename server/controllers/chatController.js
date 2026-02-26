import ChatSession from '../models/ChatSession.js';
import Appointment from '../models/Appointment.js';

export const getChatSession = async (req, res) => {
  try {
    const chatSession = await ChatSession.findById(req.params.id)
      .populate({ path: 'patientId', populate: { path: 'userId', select: 'fullName' } })
      .populate({ path: 'doctorId', populate: { path: 'userId', select: 'fullName' } })
      .populate('messages.senderId', 'fullName email');

    if (!chatSession) {
      return res.status(404).json({ message: 'Chat session not found' });
    }

    res.status(200).json(chatSession);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// new helper for retrieving a chat session by appointmentId (creates one if missing)
export const getChatByAppointment = async (req, res) => {
  try {
    let chatSession = await ChatSession.findOne({ appointmentId: req.params.id })
      .populate('patientId')
      .populate('doctorId')
      .populate('messages.senderId', 'fullName email');

    if (!chatSession) {
      // if appointment exists, create a session so front-end doesn't break
      const appointment = await Appointment.findById(req.params.id);
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
      chatSession = new ChatSession({
        appointmentId: appointment._id,
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
      });
      await chatSession.save();
      appointment.chatSessionId = chatSession._id;
      await appointment.save();

      // populate newly created session for consistency
      chatSession = await ChatSession.findById(chatSession._id)
        .populate('patientId')
        .populate('doctorId')
        .populate('messages.senderId', 'fullName email');
    }

    res.status(200).json(chatSession);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSessionMessages = async (req, res) => {
  try {
    const chatSession = await ChatSession.findById(req.params.id);

    if (!chatSession) {
      return res.status(404).json({ message: 'Chat session not found' });
    }

    res.status(200).json(chatSession.messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// clear all messages from a chat session
export const clearChat = async (req, res) => {
  try {
    const chatSession = await ChatSession.findById(req.params.id);
    if (!chatSession) {
      return res.status(404).json({ message: 'Chat session not found' });
    }
    chatSession.messages = [];
    await chatSession.save();
    res.status(200).json({ message: 'Chat cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const endChatSession = async (req, res) => {
  try {
    const chatSession = await ChatSession.findByIdAndUpdate(
      req.params.id,
      {
        status: 'ended',
        endedAt: new Date(),
      },
      { new: true }
    );

    if (!chatSession) {
      return res.status(404).json({ message: 'Chat session not found' });
    }


    res.status(200).json({
      message: 'Chat session ended successfully',
      chatSession,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

