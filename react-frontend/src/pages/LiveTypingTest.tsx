import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faClock, 
  faKeyboard, 
  faFileAlt, 
  faPenToSquare, 
  faUsers,
  faTrophy,
  faCheckCircle,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { 
  faWhatsapp, 
  faTelegram, 
  faInstagram, 
  faTwitter, 
  faYoutube 
} from '@fortawesome/free-brands-svg-icons';
import TypingEngine from '../components/common/TypingEngine';
import './LiveTypingTest.css';

interface LiveExam {
  _id: string;
  name: string;
  date: string; // ISO
  isLive: boolean;
  joinLink: string;
  timeLimit: number; // minutes
  startTime?: string; // HH:mm
  endTime?: string; // HH:mm
  passage?: string;
}

const formatTime = (time?: string) => {
  if (!time) return '';
  const [h, m] = time.split(':');
  const hour = parseInt(h, 10);
  const minute = parseInt(m, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
};

const LiveTypingTest: React.FC = () => {
  const [exams, setExams] = useState<LiveExam[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedExam, setSelectedExam] = useState<LiveExam | null>(null);
  const [showTypingTest, setShowTypingTest] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const fetchExams = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/live-exams');
        if (!isMounted) return;
        const live = (res.data as LiveExam[]).filter((e) => e.isLive);
        setExams(live);
      } catch (error) {
        console.error('Error fetching live exams:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchExams();
    return () => { isMounted = false; };
  }, []);

  const buildTestConfig = useMemo(() => {
    if (!selectedExam) return null;
    return {
      testName: selectedExam.name,
      timeLimit: selectedExam.timeLimit * 60,
      passageCategory: 'Live Typing Test',
      qualificationCriteria: { minWpm: 25, minAccuracy: 85 },
      customPassage: selectedExam.passage || 'Welcome to the live typing test! Type accurately and maintain good speed.',
      onTestComplete: (results: any) => {
        setShowTypingTest(false);
        setSelectedExam(null);
        console.log('Live typing test completed:', results);
      },
    };
  }, [selectedExam]);

  if (showTypingTest && selectedExam && buildTestConfig) {
    return (
      <div className="lt-fullscreen">
        <TypingEngine
          config={buildTestConfig}
          hideFeedbackModal={false}
          hideDurationSelector={true}
          onTestComplete={buildTestConfig.onTestComplete}
        />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Live Typing Test | TypingHub</title>
        <meta name="description" content="Join real-time typing competitions with a professional, distraction-free interface. Practice, compete, and improve with TypingHub." />
        <meta name="keywords" content="live typing test, typing competition, real-time typing, typing practice, typinghub" />
      </Helmet>

      <div className="live-typing-test-page">
        <div className="lt-container">
          {/* Sliding Banner */}
          <section className="lt-sliding-banner">
            <div className="lt-banner-container">
              <div className="lt-banner-slide">
                <div className="lt-banner-content">
                  <div className="lt-quote">
                    <span className="lt-quote-text">"Practice makes perfect. Every keystroke brings you closer to your goal."</span>
                    <span className="lt-quote-author">-TypingHub</span>
                  </div>
                </div>
              </div>
              <div className="lt-banner-slide">
                <div className="lt-banner-content">
                  <div className="lt-social-links">
                    <span className="lt-social-text">Join our community for updates:</span>
                    <a href="https://t.me/TypingHubOfficial" target="_blank" rel="noopener noreferrer" className="lt-social-link telegram">
                      <FontAwesomeIcon icon={faTelegram} />
                      <span>Telegram Group</span>
                    </a>
                    <a href="https://whatsapp.com/channel/0029VbB5BgZIHphQNvybGU3V/?hl=en" target="_blank" rel="noopener noreferrer" className="lt-social-link whatsapp">
                      <FontAwesomeIcon icon={faWhatsapp} />
                      <span>WhatsApp Group</span>
                    </a>
                  </div>
                </div>
              </div>
              <div className="lt-banner-slide">
                <div className="lt-banner-content">
                  <div className="lt-quote">
                    <span className="lt-quote-text">"Speed comes with practice, accuracy comes with focus."</span>
                    <span className="lt-quote-author">-TypingHub</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Upcoming Live Exams */}
          <section className="lt-section" aria-labelledby="upcoming-exams">
            <h2 id="upcoming-exams" className="lt-section-title">Upcoming Exams</h2>

            {loading ? (
              <div className="lt-skeleton-list" aria-busy="true" aria-live="polite">
                <div className="lt-skeleton-row" />
                <div className="lt-skeleton-row" />
                <div className="lt-skeleton-row" />
              </div>
            ) : (
              <div className="lt-exams">
                {exams.length === 0 ? (
                  <div className="lt-empty">
                    <FontAwesomeIcon icon={faExclamationTriangle} style={{ fontSize: '24px', marginBottom: '10px', color: '#f39c12' }} />
                    <div>No live exams at the moment.</div>
                    <div style={{ fontSize: '14px', marginTop: '8px', color: '#999' }}>
                      Check back later for upcoming competitions!
                    </div>
                  </div>
                ) : (
                  exams.map((exam) => {
                    const now = new Date();
                    const currentMinutes = now.getHours() * 60 + now.getMinutes();
                    let showJoin = true;
                    let liveTiming = 'N/A';
                    let statusColor = '#666';
                    
                    if (exam.startTime && exam.endTime) {
                      liveTiming = `${formatTime(exam.startTime)} - ${formatTime(exam.endTime)}`;
                      const [sh, sm] = exam.startTime.split(':').map(Number);
                      const [eh, em] = exam.endTime.split(':').map(Number);
                      const startMinutes = sh * 60 + sm;
                      const endMinutes = eh * 60 + em;
                      showJoin = currentMinutes >= startMinutes && currentMinutes <= endMinutes;
                      
                      if (currentMinutes < startMinutes) {
                        statusColor = '#f39c12'; // Orange for upcoming
                      } else if (currentMinutes > endMinutes) {
                        statusColor = '#e74c3c'; // Red for ended
                      } else {
                        statusColor = '#27ae60'; // Green for live
                      }
                    }

                    return (
                      <div key={exam._id} className="lt-exam-card">
                        <div className="lt-exam-left">
                          <div className="lt-exam-title">
                            {exam.name}
                            <span className="lt-exam-status">
                              {showJoin ? (
                                <span className="lt-status-live">LIVE</span>
                              ) : (
                                <span className="lt-status-closed">CLOSED</span>
                              )}
                            </span>
                          </div>
                          <div className="lt-exam-date">
                            Official Exam Date: {new Date(exam.date).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="lt-exam-right">
                          <div className="lt-exam-timing">
                            Live Timing: {liveTiming}
                          </div>
                          {showJoin ? (
                            <button
                              className="lt-start-btn"
                              onClick={() => { setSelectedExam(exam); setShowTypingTest(true); }}
                              aria-label={`Start ${exam.name} live typing test`}
                            >
                              Start Typing Test
                            </button>
                          ) : (
                            <span className="lt-start-btn-disabled" aria-disabled="true">
                              Test Closed
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Join for more updates section */}
            <div className="lt-join-updates">
              <div className="lt-join-text">Join for more updates:</div>
              <div className="lt-social-icons">
                <a 
                  href="https://whatsapp.com/channel/0029VbB5BgZIHphQNvybGU3V/?hl=en" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  title="WhatsApp" 
                  aria-label="Join on WhatsApp"
                  className="lt-social-icon whatsapp"
                >
                  <FontAwesomeIcon icon={faWhatsapp} />
                </a>
                <a 
                  href="https://t.me/TypingHubOfficial" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  title="Telegram" 
                  aria-label="Join on Telegram"
                  className="lt-social-icon telegram"
                >
                  <FontAwesomeIcon icon={faTelegram} />
                </a>
                <a 
                  href="https://www.instagram.com/typinghub.in/?hl=en" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  title="Instagram" 
                  aria-label="Follow on Instagram"
                  className="lt-social-icon instagram"
                >
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
                <a 
                  href="https://x.com/typinghub?t=iMSzEgwq3aHVyKXyYtZ6NA&s=09" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  title="Twitter" 
                  aria-label="Follow on Twitter"
                  className="lt-social-icon twitter"
                >
                  <FontAwesomeIcon icon={faTwitter} />
                </a>
                <a 
                  href="https://www.youtube.com/@TypingHub-TypingPracticeforSSC" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  title="YouTube" 
                  aria-label="Subscribe on YouTube"
                  className="lt-social-icon youtube"
                >
                  <FontAwesomeIcon icon={faYoutube} />
                </a>
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="lt-section" aria-labelledby="features">
            <h2 id="features" className="lt-section-title">Why Practice Live?</h2>
            <div className="lt-grid features">
              <div className="lt-card">
                <div className="icon trophy-icon"><FontAwesomeIcon icon={faTrophy} /></div>
                <div className="title">Real-Time Competition</div>
                <div className="desc">Compete with users worldwide with live leaderboards and instant results.</div>
              </div>
              <div className="lt-card">
                <div className="icon check-circle-icon"><FontAwesomeIcon icon={faCheckCircle} /></div>
                <div className="title">Private Results</div>
                <div className="desc">See your WPM, accuracy, and performance privately with detailed analytics.</div>
              </div>
              <div className="lt-card">
                <div className="icon users-icon"><FontAwesomeIcon icon={faUsers} /></div>
                <div className="title">Community</div>
                <div className="desc">Join Telegram and WhatsApp groups for updates, tips, and community support.</div>
              </div>
            </div>
          </section>

          {/* How it works */}
          <section className="lt-section" aria-labelledby="how-it-works">
            <h2 id="how-it-works" className="lt-section-title">How It Works</h2>
            <div className="lt-grid steps">
              <div className="lt-card">
                <div className="icon clock-icon"><FontAwesomeIcon icon={faClock} /></div>
                <div className="title">1. Join Exam</div>
                <div className="desc">Select any live exam during the active window and get ready to compete.</div>
              </div>
              <div className="lt-card">
                <div className="icon keyboard-icon"><FontAwesomeIcon icon={faKeyboard} /></div>
                <div className="title">2. Type & Compete</div>
                <div className="desc">Type the passage within the time limit with real-time performance tracking.</div>
              </div>
              <div className="lt-card">
                <div className="icon trophy-icon"><FontAwesomeIcon icon={faTrophy} /></div>
                <div className="title">3. Get Results</div>
                <div className="desc">View speed, accuracy, and key metrics instantly with detailed feedback.</div>
              </div>
            </div>
          </section>

          {/* Video Tutorial */}
          <section className="lt-section" aria-labelledby="video-tutorial">
            <h2 id="video-tutorial" className="lt-section-title">Live Exam Guide</h2>
            <p className="lt-section-subtitle">Learn how to join live exams, get notifications, and participate in real-time competitions.</p>
            <div className="lt-video-container">
              <div className="lt-video-wrapper">
                <iframe
                  src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
                  title="Live Exam Tutorial"
                  frameBorder="0"
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="lt-video"
                ></iframe>
              </div>
              <div className="lt-video-info">
                <h3 className="lt-video-title">How to Join Live Typing Exams</h3>
                <p className="lt-video-desc">
                  Complete guide on how to get live exam notifications, join competitions on time, and participate in real-time typing tests with other users.
                </p>
              </div>
            </div>
          </section>

          {/* Related Links */}
          <section className="lt-section" aria-labelledby="related-links">
            <h2 id="related-links" className="lt-section-title">Explore More</h2>
            <div className="lt-grid features">
              <Link to="/typing-test" className="lt-card" aria-label="Free Typing Test">
                <div className="icon keyboard-icon"><FontAwesomeIcon icon={faKeyboard} /></div>
                <div className="title">Free Typing Test</div>
                <div className="desc">Practice anytime, any device with unlimited attempts.</div>
              </Link>
              <Link to="/exam-wise-test" className="lt-card" aria-label="Exam Wise Tests">
                <div className="icon file-icon"><FontAwesomeIcon icon={faFileAlt} /></div>
                <div className="title">Exam Wise Tests</div>
                <div className="desc">Mock tests specifically designed for popular government exams.</div>
              </Link>
              <Link to="/create-test" className="lt-card" aria-label="Create Custom Test">
                <div className="icon pen-icon"><FontAwesomeIcon icon={faPenToSquare} /></div>
                <div className="title">Create Custom Test</div>
                <div className="desc">Build personalized tests tailored to your specific needs.</div>
              </Link>
            </div>
          </section>

          {/* Social */}
          <section className="lt-section" aria-labelledby="social-links">
            <h2 id="social-links" className="lt-section-title">Join the Community</h2>
            <p className="lt-section-subtitle" style={{ textAlign: 'center' }}>
              Connect with fellow typists, get updates on competitions, and share your progress!
            </p>
            <div className="lt-social-icons">
              <a 
                href="https://whatsapp.com/channel/0029VbB5BgZIHphQNvybGU3V/?hl=en" 
                target="_blank" 
                rel="noopener noreferrer" 
                title="WhatsApp" 
                aria-label="Join on WhatsApp"
                className="lt-social-icon whatsapp"
              >
                <FontAwesomeIcon icon={faWhatsapp} />
              </a>
              <a 
                href="https://t.me/TypingHubOfficial" 
                target="_blank" 
                rel="noopener noreferrer" 
                title="Telegram" 
                aria-label="Join on Telegram"
                className="lt-social-icon telegram"
              >
                <FontAwesomeIcon icon={faTelegram} />
              </a>
              <a 
                href="https://www.instagram.com/typinghub.in/?hl=en" 
                target="_blank" 
                rel="noopener noreferrer" 
                title="Instagram" 
                aria-label="Follow on Instagram"
                className="lt-social-icon instagram"
              >
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a 
                href="https://x.com/typinghub?t=iMSzEgwq3aHVyKXyYtZ6NA&s=09" 
                target="_blank" 
                rel="noopener noreferrer" 
                title="Twitter" 
                aria-label="Follow on Twitter"
                className="lt-social-icon twitter"
              >
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a 
                href="https://www.youtube.com/@TypingHub-TypingPracticeforSSC" 
                target="_blank" 
                rel="noopener noreferrer" 
                title="YouTube" 
                aria-label="Subscribe on YouTube"
                className="lt-social-icon youtube"
              >
                <FontAwesomeIcon icon={faYoutube} />
              </a>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default LiveTypingTest;
