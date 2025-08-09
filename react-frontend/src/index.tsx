import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

// Performance monitoring
const reportWebVitals = (onPerfEntry?: (metric: any) => void) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

// Error tracking setup
const setupErrorTracking = () => {
// Add error handling for uncaught errors
window.addEventListener('error', (event) => {
    console.error('Uncaught error:', {
      message: event.error?.message || 'Unknown error',
      stack: event.error?.stack || '',
      filename: event.filename || 'Unknown file',
      lineno: event.lineno || 0,
      colno: event.colno || 0,
      timestamp: new Date().toISOString()
    });
    
    // Prevent default browser error handling
    event.preventDefault();
});

// Add error handling for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', {
      reason: event.reason?.message || event.reason || 'Unknown reason',
      stack: event.reason?.stack || '',
      timestamp: new Date().toISOString()
    });
    
    // Prevent default browser error handling
    event.preventDefault();
  });
};

// Initialize error tracking
setupErrorTracking();

// Enable React Router v7 future flags
const router = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

const root = ReactDOM.createRoot(rootElement);

// Custom error handler component
const ErrorFallback = ({ error }: { error: Error }) => (
  <div className="error-container">
    <h1>Application Error</h1>
    <p>Sorry, something went wrong while loading the application.</p>
    <details>
      <summary>Error Details</summary>
      <pre>{error.message}</pre>
      <pre>{error.stack}</pre>
    </details>
    <button onClick={() => window.location.reload()}>
      Refresh Page
    </button>
  </div>
);

try {
  root.render(
    <React.StrictMode>
      <BrowserRouter future={router.future}>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );

  // Monitor performance metrics
  reportWebVitals(console.log);
} catch (error) {
  console.error('Error rendering app:', error);
  root.render(<ErrorFallback error={error as Error} />);
}

// Enable hot module replacement in development
declare const module: any;
if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept();
}

// Register Monetag service worker in production
if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        console.log('Service worker registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.error('Service worker registration failed:', error);
      });
  });
} 
 