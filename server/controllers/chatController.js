import ChatSession from '../models/ChatSession.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getChatSession = async (req, res) => {
  try {
    const chatSession = await ChatSession.findById(req.params.id)
      .populate('patientId')
      .populate('doctorId')
      .populate('messages.senderId', 'fullName email');

    if (!chatSession) {
      return res.status(404).json({ message: 'Chat session not found' });
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

    // Generate AI summary if not already done
    if (!chatSession.summaryGenerated && chatSession.messages.length > 0) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const messageText = chatSession.messages
          .map((m) => `${m.senderRole}: ${m.message}`)
          .join('\n');

        const prompt = `
Please provide a brief clinical summary of this therapy conversation. Focus on:
1. Main concerns discussed
2. Key insights or patterns
3. Recommendations for next steps

Conversation:
${messageText}

Summary:`;

        const result = await model.generateContent(prompt);
        const summary = result.response.text();

        chatSession.summary = summary;
        chatSession.summaryGenerated = true;
        await chatSession.save();
      } catch (aiError) {
        console.log('[v0] AI summary generation failed:', aiError.message);
        // Continue without summary if AI fails
      }
    }

    res.status(200).json({
      message: 'Chat session ended successfully',
      chatSession,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const generateChatSummary = async (req, res) => {
  try {
    const chatSession = await ChatSession.findById(req.params.id);

    if (!chatSession) {
      return res.status(404).json({ message: 'Chat session not found' });
    }

    if (chatSession.messages.length === 0) {
      return res.status(400).json({ message: 'No messages to summarize' });
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const messageText = chatSession.messages
        .map((m) => `${m.senderRole}: ${m.message}`)
        .join('\n');

      const prompt = `
Please provide a comprehensive clinical summary of this therapy conversation. Include:
1. Main concerns and presenting issues
2. Key insights and patterns identified
3. Therapeutic approach used
4. Patient progress and breakthroughs
5. Recommendations for follow-up care

Conversation:
${messageText}

Summary:`;

      const result = await model.generateContent(prompt);
      const summary = result.response.text();

      chatSession.summary = summary;
      chatSession.summaryGenerated = true;
      await chatSession.save();

      res.status(200).json({
        message: 'Summary generated successfully',
        summary,
      });
    } catch (aiError) {
      res.status(500).json({
        message: 'Failed to generate summary',
        error: aiError.message,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSummary = async (req, res) => {
  try {
    const chatSession = await ChatSession.findById(req.params.id);

    if (!chatSession) {
      return res.status(404).json({ message: 'Chat session not found' });
    }

    res.status(200).json({
      summary: chatSession.summary,
      summaryGenerated: chatSession.summaryGenerated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
