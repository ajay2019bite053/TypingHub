import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faClock,
  faComments,
  faShareAlt,
  faPaperPlane
} from '@fortawesome/free-solid-svg-icons';
import {
  faWhatsapp,
  faInstagram,
  faTwitter,
  faYoutube,
  faTelegram
} from '@fortawesome/free-brands-svg-icons';
import './ContactUs.css';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  attachment?: File | null;
}

const ContactUs: React.FC = () => {
  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: '',
    attachment: null
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should not exceed 5MB.');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      // Check file type
      const allowedTypes = ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!allowedTypes.includes(fileExtension || '')) {
        alert('Invalid file type. Please upload JPG, PNG, PDF, or DOC files.');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      setFormData(prev => ({
        ...prev,
        attachment: file
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form UI remains visible, but submission is disabled for now
    alert('Form submission is temporarily disabled. Please contact us via email.');
  };

  return (
    <main className="main-content contact-page">
      <Helmet>
        <title>Contact Us - TypingHub.in 📞</title>
        <meta name="description" content="Get in touch with TypingHub.in for any questions, support, or feedback about our typing tests and courses." />
        <meta name="keywords" content="contact TypingHub, typing test support, typing course help" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Serif:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Helmet>

      <div className="contact-hero-section">
        <div className="contact-hero-content">
          <h1>Contact Us 📞</h1>
          <p>Get in touch with us for any questions, support, or feedback. We're here to help!</p>
        </div>
      </div>

      <div className="contact-modern-content">
        <div className="contact-modern-sidebar-card">
          <h2>Contact Information</h2>
          <div className="contact-method">
            <h3><FontAwesomeIcon icon={faEnvelope} /> Email Support</h3>
            <p>General Inquiries:</p>
            <p><a href="mailto:Contact@typinghub.in">Contact@typinghub.in</a></p>
            <p>Technical Support:</p>
            <p><a href="mailto:tech@typinghub.in">tech@typinghub.in</a></p>
          </div>

          <div className="contact-method">
            <h3><FontAwesomeIcon icon={faClock} /> Support Hours</h3>
            <p>Monday - Friday: 9:00 AM - 6:00 PM (IST)</p>
            <p>Saturday: 10:00 AM - 2:00 PM (IST)</p>
            <p>Sunday: Closed</p>
          </div>

          <div className="contact-method">
            <h3><FontAwesomeIcon icon={faComments} /> Live Chat</h3>
            <p>Available during support hours</p>
            <p>Average response time: 5 minutes</p>
          </div>

          <div className="contact-method">
            <h3><FontAwesomeIcon icon={faShareAlt} /> Social Media</h3>
            <div className="social-links">
              <a href="https://whatsapp.com/channel/0029VbB5BgZIHphQNvybGU3V/?hl=en" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <FontAwesomeIcon icon={faWhatsapp} />
              </a>
              <a href="https://www.instagram.com/typinghub.in/?hl=en" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="https://x.com/typinghub?t=iMSzEgwq3aHVyKXyYtZ6NA&s=09" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href="https://www.youtube.com/@TypingHub-TypingPracticeforSSC" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <FontAwesomeIcon icon={faYoutube} />
              </a>
              <a href="https://t.me/TypingHubOfficial"  target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                <FontAwesomeIcon icon={faTelegram} />
              </a>
            </div>
          </div>

          <div className="important-notice">
            <h4>Quick Response Guarantee</h4>
            <p>We aim to respond to all inquiries within 24 hours during business days.</p>
          </div>
        </div>

        <div className="contact-modern-form-card">
          <h2>Send Us a Message</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name<span className="required">*</span></label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address<span className="required">*</span></label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject<span className="required">*</span></label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              >
                <option value="">Select a subject</option>
                <option value="general">General Inquiry</option>
                <option value="support">Technical Support</option>
                <option value="feedback">Feedback</option>
                <option value="billing">Billing Question</option>
                <option value="bug">Report a Bug</option>
                <option value="feature">Feature Request</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message<span className="required">*</span></label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="attachment">Attachment (Optional)</label>
              <input
                type="file"
                id="attachment"
                name="attachment"
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                ref={fileInputRef}
              />
            </div>

            <button type="submit" className="submit-btn">
                  Send Message
                  <FontAwesomeIcon icon={faPaperPlane} />
            </button>

            <div className="important-notice" style={{ marginTop: '20px' }}>
              <h4>Privacy Notice</h4>
              <p>By submitting this form, you agree to our <Link to="/privacy-policy">Privacy Policy</Link> and consent to the processing of your personal data.</p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default ContactUs;
