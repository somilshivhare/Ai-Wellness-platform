import Contact from '../models/Contact.js';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const createContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validate
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const contact = new Contact({
      name,
      email,
      phone,
      subject,
      message,
    });

    await contact.save();

    // Send acknowledgment email
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'We received your message - MindBridge AI',
        html: `
          <h2>Thank you for contacting MindBridge AI</h2>
          <p>Hi ${name},</p>
          <p>We have received your message and will get back to you as soon as possible.</p>
          <p>Your message: "${subject}"</p>
          <p>Best regards,<br>MindBridge AI Team</p>
        `,
      });
    } catch (emailError) {
      console.log('[v0] Email send failed:', emailError.message);
      // Continue even if email fails - don't block the contact creation
    }

    res.status(201).json({
      message: 'Message sent successfully',
      contact,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const respondToMessage = async (req, res) => {
  try {
    const { response } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        response,
        status: 'responded',
        respondedAt: new Date(),
      },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Send response email
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: contact.email,
        subject: `Re: ${contact.subject} - MindBridge AI`,
        html: `
          <h2>Response from MindBridge AI</h2>
          <p>Hi ${contact.name},</p>
          <p>Thank you for your message. Here is our response:</p>
          <p>${response}</p>
          <p>Best regards,<br>MindBridge AI Team</p>
        `,
      });
    } catch (emailError) {
      console.log('[v0] Email send failed:', emailError.message);
    }

    res.status(200).json({
      message: 'Response sent successfully',
      contact,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.status(200).json({
      message: 'Message deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
