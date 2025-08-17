// Utility functions for scrolling

export const scrollToTop = () => {
  // Use multiple methods for better browser compatibility
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
  
  // Fallback for older browsers
  if ('scrollBehavior' in document.documentElement.style === false) {
    window.scrollTo(0, 0);
  }
  
  // Also scroll the document element for better compatibility
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
};

export const scrollToElement = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
};

export const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    const headerHeight = 80; // Approximate header height
    const elementPosition = element.offsetTop - headerHeight;
    
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    });
  }
};






