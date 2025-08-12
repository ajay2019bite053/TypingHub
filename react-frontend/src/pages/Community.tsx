import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faComments, 
  faLightbulb, 
  faBullhorn, 
  faTrophy, 
  faQuestionCircle,
  faTimes,
  faPaperPlane
} from '@fortawesome/free-solid-svg-icons';
import { 
  faWhatsapp as faWhatsappBrand,
  faTelegram as faTelegramBrand,
  faYoutube as faYoutubeBrand,
  faTwitter as faTwitterBrand,
  faInstagram as faInstagramBrand
} from '@fortawesome/free-brands-svg-icons';
import { Helmet } from 'react-helmet-async';

const TELEGRAM_URL = 'https://t.me/TypingHubOfficial';
const WHATSAPP_URL = 'https://whatsapp.com/channel/0029VbB5BgZIHphQNvybGU3V/?hl=en';

const buttonStyle = {
  background: 'linear-gradient(90deg, #1976d2 60%, #42a5f5 100%)',
  color: 'white',
  border: 'none',
  padding: '14px 32px',
  borderRadius: '10px',
  fontSize: '1.08rem',
  fontWeight: 700,
  fontFamily: 'inherit',
  cursor: 'pointer',
  boxShadow: '0 2px 8px #1976d233',
  transition: 'all 0.3s',
  marginTop: 'auto',
  letterSpacing: '0.5px',
  outline: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};
const buttonStyleGreen = {
  ...buttonStyle,
  background: 'linear-gradient(90deg, #4caf50 60%, #1976d2 100%)',
  boxShadow: '0 2px 8px #4caf5033',
};
const modalStyle = {
  background: 'white',
  padding: '30px',
  borderRadius: '15px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  width: '100%',
  maxWidth: '600px',
  position: 'relative',
  zIndex: 9999,
};
const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.5)',
  backdropFilter: 'blur(2px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9998,
};

const Community: React.FC = () => {
  const announcementsRef = useRef<HTMLDivElement>(null);
  // Modal state
  const [showDiscussionForm, setShowDiscussionForm] = useState(false);
  const [showTipForm, setShowTipForm] = useState(false);
  const [showUpdatesModal, setShowUpdatesModal] = useState(false);
  // Discussion form state
  const [discussionData, setDiscussionData] = useState({
    name: '',
    email: '',
    content: ''
  });
  // Tip form state
  const [tipData, setTipData] = useState({
    name: '',
    email: '',
    tip: '',
  });

  // Handlers for forms
  const handleDiscussionInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setDiscussionData({ ...discussionData, [e.target.name]: e.target.value });
  };
  const handleTipInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setTipData({ ...tipData, [e.target.name]: e.target.value });
  };
  const handleDiscussionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Discussion submitted successfully! We will reply to your email soon.');
    setDiscussionData({ name: '', email: '', content: '' });
    setShowDiscussionForm(false);
  };
  const handleTipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Tip submitted successfully! Thank you for sharing. We will reply to your email soon.');
    setTipData({ name: '', email: '', tip: '' });
    setShowTipForm(false);
  };

  const handleViewUpdates = () => {
    setShowUpdatesModal(true);
  };
  
  const handleJoinWhatsApp = () => {
    window.open(WHATSAPP_URL, '_blank');
  };
  
  const handleJoinTelegram = () => {
    window.open(TELEGRAM_URL, '_blank');
  };

  return (
    <>
      <Helmet>
        <title>TypingHub Community - Connect, Learn & Share</title>
        <meta name="description" content="Join our typing community! Share tips, ask questions, and connect with fellow aspirants preparing for government exams." />
      </Helmet>
      {/* Modal overlays for forms */}
      {showDiscussionForm && (
        <div style={overlayStyle as React.CSSProperties}>
          <div style={modalStyle as React.CSSProperties}>
            <button
              onClick={() => setShowDiscussionForm(false)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'none',
                border: 'none',
                fontSize: '20px',
                color: '#666',
                cursor: 'pointer',
                padding: '5px',
                zIndex: 101
              }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1976d2', marginBottom: 20, textAlign: 'center' }}>Start a New Discussion</h2>
            <form onSubmit={handleDiscussionSubmit}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={discussionData.name}
                  onChange={handleDiscussionInput}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'border-color 0.3s',
                    fontFamily: 'inherit'
                  }}
                  placeholder="Enter your name..."
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={discussionData.email}
                  onChange={handleDiscussionInput}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'border-color 0.3s',
                    fontFamily: 'inherit'
                  }}
                  placeholder="Enter your email..."
                />
              </div>
              <div style={{ marginBottom: 25 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>
                  Discussion Content *
                </label>
                <textarea
                  name="content"
                  value={discussionData.content}
                  onChange={handleDiscussionInput}
                  required
                  rows={6}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                  placeholder="Share your thoughts, questions, or experiences..."
                />
              </div>
              <div style={{ display: 'flex', gap: 15, justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => setShowDiscussionForm(false)}
                  style={{
                    background: '#f5f5f5',
                    color: '#666',
                    border: '2px solid #e0e0e0',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    fontFamily: 'inherit'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    ...buttonStyle,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                  Post Discussion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showTipForm && (
        <div style={overlayStyle as React.CSSProperties}>
          <div style={modalStyle as React.CSSProperties}>
            <button
              onClick={() => setShowTipForm(false)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'none',
                border: 'none',
                fontSize: '20px',
                color: '#666',
                cursor: 'pointer',
                padding: '5px',
                zIndex: 101
              }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#4caf50', marginBottom: 20, textAlign: 'center' }}>
              Share Your Typing Tip
            </h2>
            <form onSubmit={handleTipSubmit}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={tipData.name}
                  onChange={handleTipInput}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'border-color 0.3s',
                    fontFamily: 'inherit'
                  }}
                  placeholder="Enter your name..."
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={tipData.email}
                  onChange={handleTipInput}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'border-color 0.3s',
                    fontFamily: 'inherit'
                  }}
                  placeholder="Enter your email..."
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>
                  Your Tip *
                </label>
                <textarea
                  name="tip"
                  value={tipData.tip}
                  onChange={handleTipInput}
                  required
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                  placeholder="Share your specific tip or technique..."
                />
              </div>
              <div style={{ display: 'flex', gap: 15, justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => setShowTipForm(false)}
                  style={{
                    background: '#f5f5f5',
                    color: '#666',
                    border: '2px solid #e0e0e0',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    fontFamily: 'inherit'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    ...buttonStyleGreen,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                  Share Tip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showUpdatesModal && (
        <div style={overlayStyle as React.CSSProperties}>
          <div style={modalStyle as React.CSSProperties}>
            <button
              onClick={() => setShowUpdatesModal(false)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'none',
                border: 'none',
                fontSize: '20px',
                color: '#666',
                cursor: 'pointer',
                padding: '5px',
                zIndex: 101
              }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1976d2', marginBottom: 20, textAlign: 'center' }}>
              Join Our Community
            </h2>
            <p style={{ color: '#666', fontSize: '1.1rem', textAlign: 'center', marginBottom: 30 }}>
              Join our Telegram and WhatsApp groups to stay updated with the latest exam notifications, new features, and important announcements.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <button
                onClick={handleJoinWhatsApp}
                style={{
                  ...buttonStyle,
                  background: '#25D366',
                  boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)'
                }}
              >
                <FontAwesomeIcon icon={faWhatsappBrand} />
                Join WhatsApp
              </button>
              <button
                onClick={handleJoinTelegram}
                style={{
                  ...buttonStyle,
                  background: '#229ED9',
                  boxShadow: '0 4px 15px rgba(34, 158, 217, 0.3)'
                }}
              >
                <FontAwesomeIcon icon={faTelegramBrand} />
                Join Telegram
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="community-page" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)', padding: '0 0 20px 0' }}>
        {/* Hero Section - smaller, no gap above */}
        <div style={{
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
          padding: '18px 20px 24px 20px',
          textAlign: 'center',
          margin: 0,
          borderRadius: '0 0 32px 32px',
          boxShadow: '0 8px 32px rgba(25,118,210,0.10)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'url("/images/Background-img.webp")',
            opacity: 0.08,
            zIndex: 0
          }} />
          <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <FontAwesomeIcon icon={faUsers} style={{ fontSize: '32px', marginBottom: '10px', filter: 'drop-shadow(0 2px 8px #0002)' }} />
            <h1 style={{ fontSize: '1.5rem', marginBottom: '8px', fontWeight: '800', letterSpacing: '0.5px' }}>
              Welcome to TypingHub Community!
            </h1>
            <p style={{ fontSize: '1rem', opacity: '0.93', lineHeight: '1.5', marginBottom: 0 }}>
              Connect with fellow aspirants, share your experiences, and get help from our growing community of typing enthusiasts.
            </p>
          </div>
        </div>
        {/* Divider */}
        <div style={{ height: 2, background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)', opacity: 0.12, margin: '0 0 32px 0' }} />
        {/* Community Stats */}
        <div style={{ maxWidth: '1200px', margin: '0 auto 40px auto', padding: '0 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '28px' }}>
          <div style={{ background: 'white', padding: '32px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', border: '1px solid rgba(25,118,210,0.08)', transition: 'box-shadow 0.3s', cursor: 'pointer' }}>
            <FontAwesomeIcon icon={faUsers} style={{ fontSize: '36px', color: '#1976d2', marginBottom: '12px' }} />
            <h3 style={{ fontSize: '2.1rem', fontWeight: '700', color: '#1976d2', marginBottom: '6px' }}>2,000+</h3>
            <p style={{ color: '#666', fontSize: '1.08rem' }}>Active Members</p>
          </div>
          <div style={{ background: 'white', padding: '32px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', border: '1px solid rgba(25,118,210,0.08)', transition: 'box-shadow 0.3s', cursor: 'pointer' }}>
            <FontAwesomeIcon icon={faComments} style={{ fontSize: '36px', color: '#4caf50', marginBottom: '12px' }} />
            <h3 style={{ fontSize: '2.1rem', fontWeight: '700', color: '#4caf50', marginBottom: '6px' }}>500+</h3>
            <p style={{ color: '#666', fontSize: '1.08rem' }}>Discussions</p>
          </div>
          <div style={{ background: 'white', padding: '32px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', border: '1px solid rgba(25,118,210,0.08)', transition: 'box-shadow 0.3s', cursor: 'pointer' }}>
            <FontAwesomeIcon icon={faTrophy} style={{ fontSize: '36px', color: '#ff9800', marginBottom: '12px' }} />
            <h3 style={{ fontSize: '2.1rem', fontWeight: '700', color: '#ff9800', marginBottom: '6px' }}>150+</h3>
            <p style={{ color: '#666', fontSize: '1.08rem' }}>Success Stories</p>
          </div>
        </div>
        {/* Divider */}
        <div style={{ height: 2, background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)', opacity: 0.12, margin: '0 0 32px 0' }} />
        {/* Community Features */}
        <div style={{ maxWidth: '1200px', margin: '0 auto 40px auto', padding: '0 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
          <div style={{ background: 'white', padding: '36px', borderRadius: '18px', boxShadow: '0 4px 20px rgba(0,0,0,0.10)', border: '1px solid rgba(25,118,210,0.10)', transition: 'box-shadow 0.3s', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 320, justifyContent: 'space-between' }}>
            <FontAwesomeIcon icon={faComments} style={{ fontSize: '40px', color: '#1976d2', marginBottom: '18px' }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '12px', color: '#333' }}>Discussion Forum</h3>
            <p style={{ color: '#666', lineHeight: '1.7', marginBottom: '24px', textAlign: 'center' }}>
              Ask questions, share your doubts, and get help from experienced members. Our community is here to support your typing journey.
            </p>
            <button onClick={() => setShowDiscussionForm(true)} style={buttonStyle}>
              <FontAwesomeIcon icon={faComments} />
              Start a Discussion
            </button>
          </div>
          <div style={{ background: 'white', padding: '36px', borderRadius: '18px', boxShadow: '0 4px 20px rgba(0,0,0,0.10)', border: '1px solid rgba(25,118,210,0.10)', transition: 'box-shadow 0.3s', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 320, justifyContent: 'space-between' }}>
            <FontAwesomeIcon icon={faLightbulb} style={{ fontSize: '40px', color: '#4caf50', marginBottom: '18px' }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '12px', color: '#333' }}>Tips & Tricks</h3>
            <p style={{ color: '#666', lineHeight: '1.7', marginBottom: '24px', textAlign: 'center' }}>
              Share your typing tips, speed improvement techniques, and exam preparation strategies with the community.
            </p>
            <button onClick={() => setShowTipForm(true)} style={buttonStyleGreen}>
              <FontAwesomeIcon icon={faLightbulb} />
              Share Tips
            </button>
          </div>
          <div ref={announcementsRef} style={{ background: 'white', padding: '36px', borderRadius: '18px', boxShadow: '0 4px 20px rgba(0,0,0,0.10)', border: '1px solid rgba(25,118,210,0.10)', transition: 'box-shadow 0.3s', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 320, justifyContent: 'space-between' }}>
            <FontAwesomeIcon icon={faBullhorn} style={{ fontSize: '40px', color: '#ff9800', marginBottom: '18px' }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '12px', color: '#333' }}>Announcements</h3>
            <p style={{ color: '#666', lineHeight: '1.7', marginBottom: '24px', textAlign: 'center' }}>
              Stay updated with the latest exam notifications, new features, and important announcements from TypingHub.
            </p>
            <button onClick={handleViewUpdates} style={{ background: 'linear-gradient(90deg, #ff9800 60%, #1976d2 100%)', color: 'white', border: 'none', padding: '14px 32px', borderRadius: '10px', fontSize: '1.08rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 2px 8px #ff980033', transition: 'all 0.3s', marginTop: 'auto', fontFamily: 'inherit' }}>View Updates</button>
          </div>
        </div>
        {/* Divider */}
        <div style={{ height: 2, background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)', opacity: 0.12, margin: '0 0 32px 0' }} />
        {/* Social Media Links */}
        <div style={{ maxWidth: '800px', margin: '0 auto 40px auto', padding: '30px', background: 'white', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', textAlign: 'center', border: '1px solid rgba(25,118,210,0.1)' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '20px', color: '#333' }}>
            Connect With Us
          </h2>
          <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '30px', lineHeight: '1.6' }}>
            Join our social media channels for daily updates, tips, and community discussions.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" style={{ background: '#25D366', color: 'white', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', textDecoration: 'none', transition: 'all 0.3s ease', boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)' }}><FontAwesomeIcon icon={faWhatsappBrand} /></a>
            <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" style={{ background: '#229ED9', color: 'white', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', textDecoration: 'none', transition: 'all 0.3s ease', boxShadow: '0 4px 15px rgba(34, 158, 217, 0.3)' }}><FontAwesomeIcon icon={faTelegramBrand} /></a>
            <a href="https://www.instagram.com/typinghub.in/?hl=en" target="_blank" rel="noopener noreferrer" style={{ background: '#C13584', color: 'white', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', textDecoration: 'none', transition: 'all 0.3s ease', boxShadow: '0 4px 15px rgba(193, 53, 132, 0.3)' }}><FontAwesomeIcon icon={faInstagramBrand} /></a>
            <a href="https://www.youtube.com/@TypingHub-TypingPracticeforSSC" target="_blank" rel="noopener noreferrer" style={{ background: '#FF0000', color: 'white', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', textDecoration: 'none', transition: 'all 0.3s ease', boxShadow: '0 4px 15px rgba(255, 0, 0, 0.3)' }}><FontAwesomeIcon icon={faYoutubeBrand} /></a>
            <a href="https://x.com/typinghub?t=iMSzEgwq3aHVyKXyYtZ6NA&s=09" target="_blank" rel="noopener noreferrer" style={{ background: '#1DA1F2', color: 'white', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', textDecoration: 'none', transition: 'all 0.3s ease', boxShadow: '0 4px 15px rgba(29, 161, 242, 0.3)' }}><FontAwesomeIcon icon={faTwitterBrand} /></a>
          </div>
        </div>
        {/* FAQ Section */}
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '30px', background: 'white', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid rgba(25,118,210,0.1)' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '25px', color: '#333', textAlign: 'center' }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <FontAwesomeIcon icon={faQuestionCircle} style={{ fontSize: '20px', color: '#1976d2' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#333' }}>How do I join the community?</h3>
          </div>
          <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '25px', paddingLeft: '35px' }}>
            Simply click on any of our social media links above or use the community features on this page. All our channels are free to join!
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <FontAwesomeIcon icon={faQuestionCircle} style={{ fontSize: '20px', color: '#1976d2' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#333' }}>Can I ask questions about typing?</h3>
          </div>
          <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '25px', paddingLeft: '35px' }}>
            Absolutely! Our community is specifically designed for typing aspirants. Feel free to ask about speed improvement, accuracy tips, exam preparation, and more.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <FontAwesomeIcon icon={faQuestionCircle} style={{ fontSize: '20px', color: '#1976d2' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#333' }}>Are there any rules for the community?</h3>
          </div>
          <p style={{ color: '#666', lineHeight: '1.6', paddingLeft: '35px' }}>
            Yes, we maintain a respectful and supportive environment. Be kind, helpful, and avoid spam. We're here to help each other succeed!
          </p>
        </div>
      </div>
    </>
  );
};

export default Community; 