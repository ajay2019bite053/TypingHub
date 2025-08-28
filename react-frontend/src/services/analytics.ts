// Analytics service for tracking user behavior
export interface AnalyticsEvent {
  eventName: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

class AnalyticsService {
  private isInitialized = false;

  // Initialize analytics
  init() {
    if (this.isInitialized) return;
    
    try {
      // Google Analytics 4
      if (typeof window !== 'undefined' && (window as any).gtag) {
        this.isInitialized = true;
        console.log('Analytics initialized');
      }
    } catch (error) {
      console.error('Analytics initialization failed:', error);
    }
  }

  // Track page view
  trackPageView(pageTitle: string, pagePath: string) {
    this.trackEvent('page_view', {
      page_title: pageTitle,
      page_location: pagePath,
      page_referrer: document.referrer
    });
  }

  // Track product view
  trackProductView(product: any) {
    this.trackEvent('product_view', {
      product_id: product._id,
      product_name: product.title,
      product_category: product.category,
      product_vendor: product.vendor,
      product_price: product.discountedPrice,
      currency: 'INR'
    });
  }

  // Track buy button click
  trackBuyClick(product: any) {
    this.trackEvent('buy_button_click', {
      product_id: product._id,
      product_name: product.title,
      product_vendor: product.vendor,
      product_price: product.discountedPrice,
      currency: 'INR'
    });
  }

  // Track search
  trackSearch(searchTerm: string, resultsCount: number) {
    this.trackEvent('search', {
      search_term: searchTerm,
      results_count: resultsCount
    });
  }

  // Track filter usage
  trackFilter(category: string, filterType: string) {
    this.trackEvent('filter_used', {
      category: category,
      filter_type: filterType
    });
  }

  // Track image zoom
  trackImageZoom(productId: string, imageIndex: number) {
    this.trackEvent('image_zoom', {
      product_id: productId,
      image_index: imageIndex
    });
  }

  // Track user engagement
  trackEngagement(action: string, details?: Record<string, any>) {
    this.trackEvent('user_engagement', {
      action: action,
      ...details
    });
  }

  // Track error
  trackError(error: string, context?: Record<string, any>) {
    this.trackEvent('error', {
      error_message: error,
      ...context
    });
  }

  // Generic event tracking
  trackEvent(eventName: string, properties: Record<string, any> = {}) {
    try {
      // Add timestamp
      const event: AnalyticsEvent = {
        eventName,
        properties: {
          ...properties,
          timestamp: Date.now(),
          user_agent: navigator.userAgent,
          screen_resolution: `${screen.width}x${screen.height}`,
          language: navigator.language
        }
      };

      // Google Analytics 4
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', eventName, event.properties);
      }

      // Custom analytics logging
      console.log('Analytics Event:', event);

      // Send to custom analytics endpoint (if needed)
      this.sendToCustomAnalytics(event);

    } catch (error) {
      console.error('Analytics tracking failed:', error);
    }
  }

  // Send to custom analytics endpoint
  private async sendToCustomAnalytics(event: AnalyticsEvent) {
    try {
      // You can implement custom analytics endpoint here
      // await fetch('/api/analytics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(event)
      // });
    } catch (error) {
      console.error('Custom analytics failed:', error);
    }
  }

  // Track performance metrics
  trackPerformance(metric: string, value: number) {
    this.trackEvent('performance', {
      metric: metric,
      value: value
    });
  }

  // Track user session
  trackSession() {
    this.trackEvent('session_start', {
      session_id: this.generateSessionId(),
      referrer: document.referrer,
      landing_page: window.location.pathname
    });
  }

  // Generate session ID
  private generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}

// Export singleton instance
export const analytics = new AnalyticsService();

// Initialize analytics on app start
if (typeof window !== 'undefined') {
  analytics.init();
}

