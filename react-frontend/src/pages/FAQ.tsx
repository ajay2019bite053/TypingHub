import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import './FAQ.css';

const FAQ: React.FC = () => {
  useEffect(() => {
    // Smooth scrolling for navigation
    const handleNavClick = (e: MouseEvent) => {
      const link = e.target as HTMLAnchorElement;
      if (link.matches('.faq-nav-list a')) {
        e.preventDefault();
        const targetId = link.getAttribute('href')?.substring(1);
        if (targetId) {
          const targetSection = document.getElementById(targetId);
          targetSection?.scrollIntoView({ behavior: 'smooth' });

          // Update active link
          document.querySelectorAll('.faq-nav-list a').forEach(a => a.classList.remove('active'));
          link.classList.add('active');
        }
      }
    };

    // Highlight current section on scroll
    const handleScroll = () => {
      const sections = document.querySelectorAll('.faq-section');
      let currentSection = '';

      sections.forEach((section) => {
        const sectionElement = section as HTMLElement;
        const sectionTop = sectionElement.offsetTop;
        const sectionHeight = sectionElement.clientHeight;
        if (window.pageYOffset >= sectionTop - 100) {
          currentSection = sectionElement.getAttribute('id') || '';
        }
      });

      document.querySelectorAll('.faq-nav-list a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href')?.substring(1) === currentSection) {
          link.classList.add('active');
        }
      });
    };

    document.addEventListener('click', handleNavClick);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('click', handleNavClick);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <main className="main-content faq-page">
      <Helmet>
        <title>FAQs - TypingHub.in ❓</title>
        <meta name="description" content="Find answers to frequently asked questions about TypingHub.in's typing tests and courses." />
        <meta name="keywords" content="TypingHub FAQs, typing test help, typing course questions" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Serif:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Helmet>

      <div className="faq-hero-section">
        <div className="faq-hero-content">
          <h1>Frequently Asked Questions ❓</h1>
          <p>Find answers to common questions about TypingHub.in's typing tests, courses, and features.</p>
        </div>
      </div>

      <div className="faq-modern-content">
        <aside className="faq-modern-sidebar">
          <div className="faq-modern-sidebar-card">
            <h2>Contents</h2>
            <ul>
              <li><a href="#general" className="active">General Questions</a></li>
              <li><a href="#tests">Typing Tests</a></li>
              <li><a href="#courses">Typing Courses</a></li>
              <li><a href="#certificates">Certificates</a></li>
              <li><a href="#account">Account & Profile</a></li>
              <li><a href="#technical">Technical Issues</a></li>
              <li><a href="#payment">Payment & Billing</a></li>
              <li><a href="#support">Support & Help</a></li>
            </ul>
          </div>
        </aside>

        <div className="faq-modern-sections">
          <section id="general" className="faq-modern-section modern-panel-card">
            <h2>General Questions</h2>
            <div className="faq-item">
              <div className="faq-question">
                <FontAwesomeIcon icon={faQuestionCircle} />
                <span>What is TypingHub.in?</span>
              </div>
              <div className="faq-answer">
          <p>TypingHub.in is a comprehensive online platform designed to help users improve their typing skills. We offer:</p>
          <ul>
            <li>Free typing tests and practice sessions</li>
            <li>Exam-specific typing tests (SSC, CHSL,RRB-NTPC etc.)</li>
            <li>Structured typing courses</li>
            <li>Performance tracking and analytics</li>
            <li>Typing certificates</li>
          </ul>
              </div>
            </div>

            <div className="faq-item">
              <div className="faq-question">
                <FontAwesomeIcon icon={faQuestionCircle} />
                <span>Is TypingHub.in free to use?</span>
              </div>
              <div className="faq-answer">
          <p>Yes, most of our features are free to use, including:</p>
          <ul>
            <li>Basic typing tests</li>
            <li>Practice sessions</li>
            <li>Performance tracking</li>
          </ul>
          <p>We also offer premium features for advanced users who need additional resources and features.</p>
              </div>
            </div>

            <div className="faq-item">
              <div className="faq-question">
                <FontAwesomeIcon icon={faQuestionCircle} />
                <span>Do I need to create an account?</span>
              </div>
              <div className="faq-answer">
          <p>While you can access basic typing tests without an account, we recommend creating one to:</p>
          <ul>
            <li>Track your progress over time</li>
            <li>Save your test results</li>
            <li>Access premium features</li>
            <li>Generate typing certificates</li>
          </ul>
          <div className="tip-box">
            <h4>Pro Tip</h4>
            <p>Creating an account is free and takes less than a minute!</p>
          </div>
              </div>
            </div>
          </section>

          <section id="tests" className="faq-modern-section modern-panel-card">
            <h2>Typing Tests</h2>
            <div className="faq-item">
              <div className="faq-question">
                <FontAwesomeIcon icon={faQuestionCircle} />
                <span>How are typing speed and accuracy calculated?</span>
              </div>
              <div className="faq-answer">
          <p>We use standard metrics to calculate your typing performance:</p>
          <ul>
            <li>WPM (Words Per Minute) = (Total Characters / 5) / Time in Minutes</li>
            <li>Accuracy = (Correct Characters / Total Characters) × 100</li>
            <li>Net WPM = WPM × (Accuracy / 100)</li>
          </ul>
          <div className="tip-box">
            <h4>Important Note</h4>
            <p>Our calculations follow international standards and are accepted by most examination boards.</p>
          </div>
              </div>
            </div>

            <div className="faq-item">
              <div className="faq-question">
                <FontAwesomeIcon icon={faQuestionCircle} />
                <span>Which typing tests are available?</span>
              </div>
              <div className="faq-answer">
                <p>We offer various types of typing tests:</p>
                <ul>
                  <li>General typing tests</li>
                  <li>SSC CGL typing test</li>
                  <li>SSC CHSL typing test</li>
                  <li>RRB NTPC typing test</li>
                  <li>CPCT typing test</li>
                  <li>Custom duration tests</li>
                </ul>
              </div>
            </div>

            <div className="faq-item">
              <div className="faq-question">
                <FontAwesomeIcon icon={faQuestionCircle} />
                <span>Can I practice with exam-specific content?</span>
              </div>
              <div className="faq-answer">
                <p>Yes, we provide exam-specific practice materials that match the format and difficulty level of various government exams.</p>
                <div className="tip-box">
                  <h4>Pro Tip</h4>
                  <p>Use our exam-wise practice tests to familiarize yourself with the exact format of your target examination.</p>
                </div>
              </div>
            </div>
          </section>

          <section id="courses" className="faq-modern-section modern-panel-card">
            <h2>Typing Courses</h2>
            <div className="faq-item">
              <div className="faq-question">
                <FontAwesomeIcon icon={faQuestionCircle} />
                <span>What typing courses do you offer?</span>
              </div>
              <div className="faq-answer">
                <p>Our courses cater to different skill levels:</p>
                <ul>
                  <li>Beginner's Touch Typing Course</li>
                  <li>Advanced Speed Building Course</li>
                  <li>Exam Preparation Courses</li>
                  <li>Professional Typing Course</li>
                </ul>
                <div className="tip-box">
                  <h4>Course Selection Tip</h4>
                  <p>Take our free typing assessment to determine the best course for your skill level.</p>
                </div>
              </div>
            </div>

            <div className="faq-item">
              <div className="faq-question">
                <FontAwesomeIcon icon={faQuestionCircle} />
                <span>How long does it take to complete a course?</span>
              </div>
              <div className="faq-answer">
                <p>Course duration varies based on:</p>
                <ul>
                  <li>Your current typing speed</li>
                  <li>Practice frequency</li>
                  <li>Target speed goals</li>
                  <li>Course complexity</li>
                </ul>
                <p>On average, most users see significant improvement within 4-6 weeks of regular practice.</p>
              </div>
            </div>
          </section>

          <section id="certificates" className="faq-modern-section modern-panel-card">
            <h2>Certificates</h2>
            <div className="faq-item">
              <div className="faq-question">
                <FontAwesomeIcon icon={faQuestionCircle} />
                <span>How do I get a typing certificate?</span>
              </div>
              <div className="faq-answer">
                <p>To obtain a typing certificate:</p>
                <ol>
                  <li>Complete a certificate test</li>
                  <li>Achieve the minimum required speed and accuracy</li>
                  <li>Verify your account details</li>
                  <li>Download your certificate</li>
                </ol>
                <div className="tip-box">
                  <h4>Certificate Validity</h4>
                  <p>Our certificates include a unique verification code and QR code for authenticity verification.</p>
                </div>
              </div>
            </div>

            <div className="faq-item">
              <div className="faq-question">
                <FontAwesomeIcon icon={faQuestionCircle} />
                <span>Are your certificates recognized?</span>
              </div>
              <div className="faq-answer">
                <p>Our certificates are designed for personal achievement and skill verification. While they demonstrate your typing proficiency, please check with your target organization about their specific requirements.</p>
              </div>
            </div>
          </section>

          <section id="account" className="faq-modern-section modern-panel-card">
            <h2>Account & Profile</h2>
            <div className="faq-item">
              <div className="faq-question">
                <FontAwesomeIcon icon={faQuestionCircle} />
                <span>How do I update my profile information?</span>
              </div>
              <div className="faq-answer">
                <p>To update your profile:</p>
                <ol>
                  <li>Log in to your account</li>
                  <li>Click on your profile picture/name</li>
                  <li>Select "Edit Profile"</li>
                  <li>Update your information</li>
                  <li>Save changes</li>
                </ol>
              </div>
            </div>

            <div className="faq-item">
              <div className="faq-question">
                <FontAwesomeIcon icon={faQuestionCircle} />
                <span>Can I delete my account?</span>
              </div>
              <div className="faq-answer">
                <p>Yes, you can delete your account and all associated data by:</p>
                <ol>
                  <li>Going to Account Settings</li>
                  <li>Selecting "Delete Account"</li>
                  <li>Confirming your decision</li>
                </ol>
                <div className="tip-box">
                  <h4>Important</h4>
                  <p>Account deletion is permanent and cannot be undone. Please download any certificates or results you want to keep before deleting your account.</p>
                </div>
              </div>
            </div>
          </section>

          <section id="technical" className="faq-modern-section modern-panel-card">
            <h2>Technical Issues</h2>
            <div className="faq-item">
              <div className="faq-question">
                <FontAwesomeIcon icon={faQuestionCircle} />
                <span>What browsers are supported?</span>
              </div>
              <div className="faq-answer">
                <p>We support all modern browsers including:</p>
                <ul>
                  <li>Google Chrome (recommended)</li>
                  <li>Mozilla Firefox</li>
                  <li>Microsoft Edge</li>
                  <li>Safari</li>
                </ul>
                <div className="tip-box">
                  <h4>Best Performance</h4>
                  <p>For the best experience, use the latest version of Google Chrome or Firefox.</p>
                </div>
        </div>
      </div>

            <div className="faq-item">
              <div className="faq-question">
                <FontAwesomeIcon icon={faQuestionCircle} />
                <span>Why isn't my keyboard working correctly?</span>
              </div>
              <div className="faq-answer">
                <p>If you're experiencing keyboard issues:</p>
                <ol>
                  <li>Check your keyboard language settings</li>
                  <li>Clear your browser cache</li>
                  <li>Disable browser extensions</li>
                  <li>Try a different browser</li>
                </ol>
                <div className="tip-box">
                  <h4>Quick Fix</h4>
                  <p>Most keyboard issues can be resolved by refreshing the page or restarting your browser.</p>
                </div>
              </div>
            </div>
          </section>

          <section id="payment" className="faq-modern-section modern-panel-card">
            <h2>Payment & Billing</h2>
            <div className="faq-item">
              <div className="faq-question">
                <FontAwesomeIcon icon={faQuestionCircle} />
                <span>What payment methods do you accept?</span>
              </div>
              <div className="faq-answer">
                <p>We accept various payment methods:</p>
                <ul>
                  <li>Credit/Debit Cards</li>
                  <li>UPI</li>
                  <li>Net Banking</li>
                  <li>Digital Wallets</li>
                </ul>
                <div className="tip-box">
                  <h4>Secure Payments</h4>
                  <p>All payments are processed securely through our payment gateway partners.</p>
                </div>
              </div>
            </div>

            <div className="faq-item">
              <div className="faq-question">
                <FontAwesomeIcon icon={faQuestionCircle} />
                <span>How do refunds work?</span>
              </div>
              <div className="faq-answer">
                <p>Our refund policy:</p>
                <ul>
                  <li>7-day refund window for courses</li>
                  <li>Must request refund in writing</li>
                  <li>Processed within 5-7 business days</li>
                  <li>Original payment method used for refund</li>
            </ul>
          </div>
            </div>
          </section>

          <section id="support" className="faq-modern-section modern-panel-card">
            <h2>Support & Help</h2>
            <div className="faq-item">
              <div className="faq-question">
                <FontAwesomeIcon icon={faQuestionCircle} />
                <span>How can I get help?</span>
              </div>
              <div className="faq-answer">
                <p>We offer multiple support channels:</p>
                <ul>
                  <li>Email: support@typinghub.in</li>
                  <li>Live Chat (9 AM - 6 PM IST)</li>
                  <li>Help Documentation</li>
                  <li>Video Tutorials</li>
                </ul>
                <div className="tip-box">
                  <h4>Quick Response</h4>
                  <p>We aim to respond to all queries within 24 hours.</p>
                </div>
              </div>
            </div>

            <div className="faq-item">
                    <div className="faq-question">
                      <FontAwesomeIcon icon={faQuestionCircle} />
                <span>Can I suggest new features?</span>
                    </div>
                    <div className="faq-answer">
                <p>Yes! We welcome user feedback and suggestions. You can:</p>
                <ul>
                  <li>Use the feedback form in your account</li>
                  <li>Email your suggestions to feedback@typinghub.in</li>
                  <li>Participate in our user surveys</li>
                </ul>
                    </div>
                  </div>
            </section>
        </div>
      </div>
    </main>
  );
};

export default FAQ; 