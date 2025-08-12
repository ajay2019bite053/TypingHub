// Centralized FontAwesome icon imports to reduce bundle size
import { 
  faKeyboard, 
  faFileAlt, 
  faGraduationCap,
  faCheckCircle,
  faBook,
  faCertificate,
  faChalkboardTeacher,
  faArrowRight,
  faStar,
  faPenToSquare,
  faLaptopCode,
  faRocket,
  faSearch,
  faUserPlus,
  faClipboardCheck,
  faHeadset,
  faShieldAlt,
  faGlobe,
  faAward,
  faUserGraduate,
  faHandshake,
  faChartBar,
  faLaptop,
  faLightbulb,
  faHome,
  faCog,
  faBars,
  faTimes,
  faGavel,
  faBriefcase,
  faUserTie,
  faHospital,
  faBalanceScale,
  faTrain,
  faShield,
  faGraduationCap as faGraduationCapAlt
} from '@fortawesome/free-solid-svg-icons';

import {
  faWhatsapp,
  faInstagram,
  faTwitter,
  faYoutube,
  faTelegram
} from '@fortawesome/free-brands-svg-icons';

// Export all icons for use across components
export const icons = {
  // Solid icons
  faKeyboard,
  faFileAlt,
  faGraduationCap,
  faCheckCircle,
  faBook,
  faCertificate,
  faChalkboardTeacher,
  faArrowRight,
  faStar,
  faPenToSquare,
  faLaptopCode,
  faRocket,
  faSearch,
  faUserPlus,
  faClipboardCheck,
  faHeadset,
  faShieldAlt,
  faGlobe,
  faAward,
  faUserGraduate,
  faHandshake,
  faChartBar,
  faLaptop,
  faLightbulb,
  faHome,
  faCog,
  faBars,
  faTimes,
  faGavel,
  faBriefcase,
  faUserTie,
  faHospital,
  faBalanceScale,
  faTrain,
  faShield,
  faGraduationCapAlt,
  
  // Brand icons
  faWhatsapp,
  faInstagram,
  faTwitter,
  faYoutube,
  faTelegram
};

// Icon mapping for exam types
export const examIcons = {
  'SSC CGL': faGraduationCap,
  'SSC CHSL': faGraduationCap,
  'RRB NTPC': faTrain,
  'Police': faShieldAlt,
  'Junior Assistant': faUserTie,
  'Court Assistant': faGavel,
  'Superintendent': faBriefcase,
  'Hospital': faHospital,
  'Court': faBalanceScale
};
