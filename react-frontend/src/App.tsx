import React, { Suspense, lazy, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import { AdminProvider } from './contexts/AdminContext';
import { AuthProvider } from './contexts/AuthContext';
import { DeleteRequestProvider } from './contexts/DeleteRequestContext';
import { TypingProvider } from './contexts/TypingContext';
import ReactDOM, { createPortal } from 'react-dom';
import Community from './pages/Community';

// Lazy load all pages
const Home = lazy(() => import('./pages/Home'));
const TypingTest = lazy(() => import('./pages/TypingTest'));
const SSCCGLTest = lazy(() => import('./pages/SSCCGLTest'));
const SSCCHSLTest = lazy(() => import('./pages/SSCCHSLTest'));
const RRBNTPCTest = lazy(() => import('./pages/RRBNTPCTest'));
const TypingCertificateTest = lazy(() => import('./pages/TypingCertificateTest'));
const JuniorCourtAssistantTest = lazy(() => import('./pages/JuniorCourtAssistantTest'));
const JuniorAssistantTest = lazy(() => import('./pages/JuniorAssistantTest'));
const SuperintendentTest = lazy(() => import('./pages/SuperintendentTest'));
const ExamWiseTest = lazy(() => import('./pages/ExamWiseTest'));
const CreateTest = lazy(() => import('./pages/CreateTest'));
const TypingCourseLanding = lazy(() => import('./pages/TypingCourseLanding'));
const Certificate = lazy(() => import('./pages/Certificate'));
const Blog = lazy(() => import('./pages/Blog'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const Declaration = lazy(() => import('./pages/Declaration'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const FAQ = lazy(() => import('./pages/FAQ'));
const UserDashboard = lazy(() => import('./components/UserDashboard/Dashboard'));
const TypingLevelPractice = lazy(() => import('./pages/TypingLevelPractice'));
const TypingEnginePractice = lazy(() => import('./pages/TypingEnginePractice'));
const LiveTypingTest = lazy(() => import('./pages/LiveTypingTest'));
const UPPoliceTest = lazy(() => import('./pages/UPPoliceTest'));
const BiharPoliceTest = lazy(() => import('./pages/BiharPoliceTest'));
const AIIMSCRCTest = lazy(() => import('./pages/AIIMSCRCTest'));
const AllahabadHighCourtTest = lazy(() => import('./pages/AllahabadHighCourtTest'));
const LiveExamTest = lazy(() => import('./pages/LiveExamTest'));
const CertificateVerification = lazy(() => import('./pages/CertificateVerification'));

// Admin Components
const AdminLoginPage = lazy(() => import('./admin/components/Login/LoginPage'));
const AdminDashboard = lazy(() => import('./admin/components/Dashboard/Dashboard'));
const AdminRequests = lazy(() => import('./admin/components/AdminRequests/AdminRequests'));
const DeleteRequests = lazy(() => import('./admin/components/DeleteRequests/DeleteRequests'));
const AssignedPassagesPage = lazy(() => import('./admin/components/Dashboard/AssignedPassagesPage'));
const ProtectedRoute = lazy(() => import('./admin/components/ProtectedRoute/ProtectedRoute'));

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({
      error,
      errorInfo
    });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error);
      console.error('Component stack:', errorInfo.componentStack);
    }
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          marginTop: '50px'
        }}>
          <h1>Something went wrong</h1>
          <p>We're sorry - we're working on getting this fixed as soon as we can.</p>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              window.location.reload();
            }}
            style={{
              padding: '10px 20px',
              marginTop: '20px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: '#1976d2',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre style={{
              marginTop: '20px',
              padding: '20px',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
              overflow: 'auto',
              textAlign: 'left'
            }}>
              {this.state.error.toString()}
              {this.state.errorInfo?.componentStack}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading fallback component
const LoadingFallback = () => (
  <div className="loading-container">
    <LoadingSpinner />
    <p>Loading...</p>
  </div>
);

const App = () => {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <Suspense fallback={<LoadingFallback />}>
          <AuthProvider>
            <AdminProvider>
              <DeleteRequestProvider>
                <TypingProvider>
                  <div className="app">
                    <Header />
                    <main>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/typing-test" element={<TypingTest />} />
                        <Route path="/ssc-cgl-test" element={<SSCCGLTest />} />
                        <Route path="/ssc-chsl-test" element={<SSCCHSLTest />} />
                        <Route path="/rrb-ntpc-test" element={<RRBNTPCTest />} />
                        <Route path="/typing-certificate-test" element={<TypingCertificateTest />} />
                        <Route path="/junior-court-assistant-test" element={<JuniorCourtAssistantTest />} />
                        <Route path="/junior-assistant-test" element={<JuniorAssistantTest />} />
                        <Route path="/superintendent-test" element={<SuperintendentTest />} />
                        <Route path="/exam-wise-test" element={<ExamWiseTest />} />
                        <Route path="/create-test" element={<CreateTest />} />
                        <Route path="/typing-course" element={<TypingCourseLanding />} />
                        <Route path="/certificate" element={<Certificate />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/about-us" element={<AboutUs />} />
                        <Route path="/declaration" element={<Declaration />} />
                        <Route path="/terms-of-service" element={<TermsOfService />} />
                        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                        <Route path="/contact-us" element={<ContactUs />} />
                        <Route path="/faqs" element={<FAQ />} />
                        <Route path="/user/dashboard" element={<UserDashboard />} />
                        <Route path="/typing-level-practice" element={<TypingLevelPractice />} />
                        <Route path="/typing-engine-practice" element={<TypingEnginePractice />} />
                        <Route path="/live-typing-test" element={<LiveTypingTest />} />
                        <Route path="/up-police-test" element={<UPPoliceTest />} />
                        <Route path="/bihar-police-test" element={<BiharPoliceTest />} />
                        <Route path="/aiims-crc-test" element={<AIIMSCRCTest />} />
                        <Route path="/allahabad-high-court-test" element={<AllahabadHighCourtTest />} />
                        <Route path="/live-exam/:id" element={<LiveExamTest />} />
                        <Route path="/verify-certificate" element={<CertificateVerification />} />
<<<<<<< HEAD
                        <Route path="/community" element={<Community />} />
=======
>>>>>>> 152898b79f4d33325090133ecbbb60905ce6bd4e

                        {/* Admin Routes */}
                        <Route path="/admin-secret-9382xj" element={
                          <Suspense fallback={<LoadingFallback />}>
                            <AdminLoginPage />
                          </Suspense>
                        } />
                        <Route
                          path="/admin/*"
                          element={
                            <Suspense fallback={<LoadingFallback />}>
                              <ProtectedRoute>
                                <Routes>
                                  <Route path="dashboard" element={<AdminDashboard />} />
                                  <Route path="admin-requests" element={<AdminRequests />} />
                                  <Route path="delete-requests" element={<DeleteRequests />} />
                                  <Route path="assigned-passages" element={<AssignedPassagesPage />} />
                                  <Route path="*" element={<Navigate to="dashboard" replace />} />
                                </Routes>
                              </ProtectedRoute>
                            </Suspense>
                          }
                        />
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                </TypingProvider>
              </DeleteRequestProvider>
            </AdminProvider>
          </AuthProvider>
        </Suspense>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export default App; 