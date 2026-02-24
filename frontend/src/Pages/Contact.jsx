import React, { useState } from 'react';
import Navbar from '../Components/NavBar';
import Footer from '../Components/Footer';

const Contact = () => (
  <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100">
    <Navbar />
    <div className="max-w-4xl mx-auto p-8 pt-20">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="mb-6">
        We'd love to hear from you. Fill out the form below, give us a call, or visit our office. We're here to help with any questions about MindBridge and our services.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              type="text"
              className="w-full border border-slate-300 dark:border-slate-700 rounded-xl p-3 bg-white dark:bg-slate-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full border border-slate-300 dark:border-slate-700 rounded-xl p-3 bg-white dark:bg-slate-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              rows="5"
              className="w-full border border-slate-300 dark:border-slate-700 rounded-xl p-3 bg-white dark:bg-slate-800"
            ></textarea>
          </div>
          <button className="bg-primary text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">
            Send Message
          </button>
        </form>
        <div className="space-y-4">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            <p><strong>Phone:</strong> (415) 555-1234</p>
            <p><strong>Hours:</strong> Mon – Fri, 9 AM – 6 PM PST</p>
          </div>
          <h2 className="text-xl font-semibold">Office Location</h2>
          <div className="w-full h-60 rounded-xl overflow-hidden">
            {/* embed google map iframe to show location */}
            <iframe
              title="office-location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0195402334124!2d-122.41941508468027!3d37.77492977975945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c0e1d886d%3A0x4e0ad9e8b1f6d6e9!2s123%20MindBridge%20Way%2C%20San%20Francisco%2C%20CA%2094105!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
              className="w-full h-full border-0"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
          <p className="text-sm">
            123 MindBridge Way<br />San Francisco, CA 94105
          </p>
          <div>
            <h3 className="font-semibold">Request a demo</h3>
            <p className="text-sm">
              Interested in seeing the platform in action? Please reach out and
              we'll schedule a walkthrough.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Connect with us</h3>
            <p className="text-sm">Follow us on social media:</p>
            <div className="flex space-x-4 mt-1">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 fill-current text-blue-600">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.99 3.657 9.128 8.438 9.878v-6.99h-2.54V12h2.54V9.797c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.465h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.888h-2.33v6.99C18.343 21.128 22 16.99 22 12z"/>
                </svg>
              </a>
              <a href="https://api.whatsapp.com/send?phone=14155551234" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 fill-current text-green-500">
                  <path d="M20.52 3.48A11.95 11.95 0 0012 0C5.373 0 0 5.373 0 12c0 2.11.55 4.08 1.52 5.81L0 24l6.39-1.67A11.938 11.938 0 0012 24c6.627 0 12-5.373 12-12 0-3.21-1.25-6.22-3.48-8.52zM12 22.08c-1.84 0-3.64-.5-5.18-1.43l-.37-.22-3.79.99.96-3.73-.24-.38A9.95 9.95 0 012.4 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.5-7.5c-.3-.15-1.75-.87-2.02-.97-.27-.1-.47-.15-.67.15-.2.3-.78.97-.96 1.18-.18.2-.35.22-.65.07-.3-.15-1.26-.47-2.4-1.48-.89-.79-1.48-1.78-1.65-2.08-.17-.3-.02-.46.13-.6.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.92-2.19-.24-.58-.49-.5-.67-.51-.17-.02-.37-.02-.57-.02-.2 0-.52.07-.8.37-.28.3-1.07 1.05-1.07 2.57s1.1 2.98 1.25 3.19c.15.2 2.17 3.31 5.26 4.64.74.32 1.32.51 1.77.65.74.24 1.41.2 1.94.12.59-.09 1.75-.72 2-1.42.25-.7.25-1.3.17-1.42-.08-.12-.27-.2-.57-.35z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 fill-current text-blue-700">
                  <path d="M20.45 20.45h-3.55v-5.4c0-1.29-.03-2.95-1.8-2.95-1.8 0-2.07 1.4-2.07 2.85v5.5H9.01V9h3.4v1.56h.05c.47-.9 1.62-1.85 3.33-1.85 3.56 0 4.22 2.34 4.22 5.38v6.36zM5.34 7.43c-1.14 0-2.06-.93-2.06-2.07 0-1.14.92-2.06 2.06-2.06 1.14 0 2.07.92 2.07 2.06 0 1.14-.93 2.07-2.07 2.07zm1.78 13.02H3.56V9h3.56v11.45z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* move FAQs here so they appear below both columns and centered */}
      <div className="mt-12 w-full flex justify-center">
        <div className="w-full max-w-3xl">
          <h2 className="text-2xl font-bold mb-4 border-b-2 border-primary inline-block text-center w-full">
            Frequently Asked Questions
          </h2>
          <FAQAccordion />
        </div>
      </div>
    </div>
    <Footer />
  </div>
);


// small accordion component inside same file for simplicity
function FAQAccordion() {
  const items = [
    {
      question: "How quickly will someone respond to my message?",
      answer:
        "Our team typically replies within 1–2 business days. If it's urgent, feel free to give us a call during office hours.",
    },
    {
      question: "Can I schedule a demo online?",
      answer:
        "Yes—just mention it in your message or call us and we’ll set one up at a time that works for you.",
    },
    {
      question: "Do you offer telehealth sessions?",
      answer:
        "Absolutely. Most therapists offer video and phone sessions so you can meet from anywhere.",
    },
    {
      question: "What insurance do you accept?",
      answer:
        "We currently accept major providers; please check with your therapist or our support team for details.",
    },
    {
      question: "Is my information confidential?",
      answer:
        "Yes. All conversations and data are encrypted and handled according to HIPAA standards.",
    },
  ];
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="space-y-4">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow cursor-pointer"
          onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
        >
          <div className="flex justify-between items-center">
            <p className="font-semibold">{item.question}</p>
            <span className="material-icons-outlined text-gray-500">
              {openIndex === idx ? 'expand_less' : 'expand_more'}
            </span>
          </div>
          {openIndex === idx && (
            <p className="text-sm mt-2 text-slate-600 dark:text-slate-400">
              {item.answer}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export default Contact;
