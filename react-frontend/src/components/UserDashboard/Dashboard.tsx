import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell, faUser, faCog, faSignOutAlt, 
  faKeyboard, faTrophy, faFileAlt, faGraduationCap,
  faLock, faStar, faBook, faCode, faLaptopCode, 
  faChartLine, faArrowRight, faCheckCircle, faClock,
  faDesktop, faFileLines, faCertificate, faHistory,
  faCrown, faMedal, faAward, faUserGraduate,
  faHome, faListCheck, faBookOpen, faChartBar,
  faGear, faQuestionCircle, faHeadset,
  faChevronLeft, faChevronRight, faTimesCircle,
  faFire, faCalendarAlt, faUsers, faTachometerAlt,
  faGavel,
  faQuoteLeft,
  IconDefinition,
  faTrain
} from '@fortawesome/free-solid-svg-icons';
import './Dashboard.css';
import MainLogo from '../../assets/images/Background-img.jpg'; // Use your main logo or landing page image
import { useAuth } from '../../contexts/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import typingCourse from '../../assets/typingCourse.json';
import TypingEngine from '../common/TypingEngine';
import TypingTest from '../../pages/TypingTest';
import axios from 'axios';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: any;
}

interface User {
  id: string;
  name: string;
  level: number;
  experience: number;
  nextLevelExp: number;
  avatar?: string;
  wpm?: number;
  stats: {
    accuracy: number;
    speed: number;
    streak: number;
    testsCompleted: number;
    certificates: number;
  };
}

interface Course {
  id: number;
  title: string;
  description: string;
  level: string;
  duration: string;
  progress: number;
  icon: any;
  type: 'screen' | 'paper' | 'exam';
  isPremium?: boolean;
  isRecommended?: boolean;
  price: number;
  isTrial?: boolean;
}

interface TestHistory {
  id: number;
  testName: string;
  date: string;
  score: number;
  accuracy: number;
  speed: number;
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: any;
  unlocked: boolean;
}

interface Certificate {
  id: number;
  title: string;
  date: string;
  level: string;
  icon: any;
}

interface Milestone {
  id: number;
  title: string;
  value: string | number;
  icon: IconDefinition;
}

type Announcement = { id: number; message: string; date: string };
const announcements: Announcement[] = [
  { id: 1, message: 'New offer: Get 20% off on Railway Typing Mock!', date: '2024-06-01' },
  { id: 2, message: 'SSC Typing Mock updated as per latest pattern.', date: '2024-05-28' },
  { id: 3, message: 'Court Typing Mock now available in Hindi & English.', date: '2024-05-20' },
];

const motivationalQuotes = [
  "Success is the sum of small efforts, repeated day in and day out.",
  "The secret of getting ahead is getting started.",
  "Don't watch the clock; do what it does. Keep going.",
  "Practice makes progress, not perfect.",
  "Your only limit is your mind."
];

// Reusable DashboardHero component
const DashboardHero = ({
  userData,
  user,
  quote,
  notifications,
  showNotifications,
  setShowNotifications,
  logout,
  handleLogout
}: {
  userData: User;
  user: any;
  quote: string;
  notifications: Notification[];
  showNotifications: boolean;
  setShowNotifications: React.Dispatch<React.SetStateAction<boolean>>;
  logout: any;
  handleLogout: () => void;
}) => (
  <div className="user-dashboard-header redesigned-hero">
    <div className="dashboard-topbar">
      <div className="hero-avatar">
        {userData.avatar ? (
          <img src={userData.avatar} alt="Avatar" className="hero-avatar-img" />
        ) : (
          <div className="hero-avatar-fallback">
            {userData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </div>
        )}
      </div>
      <button className="hero-bell-btn" onClick={() => setShowNotifications(v => !v)}>
        <FontAwesomeIcon icon={faBell} />
        {notifications.some(n => !n.read) && <span className="hero-bell-dot" />}
      </button>
      {showNotifications && (
        <div className="hero-notification-dropdown">
          <div className="hero-notification-title-row-flex">
            <div className="hero-notification-title">Notifications</div>
            <button className="hero-notification-close-btn" onClick={() => setShowNotifications(false)}>
              <FontAwesomeIcon icon={faTimesCircle} />
            </button>
          </div>
          {notifications.length === 0 ? (
            <div className="hero-notification-empty">No notifications</div>
          ) : notifications.map(n => (
            <div key={n.id} className={`hero-notification-item${n.read ? '' : ' unread'}`}>
              <FontAwesomeIcon icon={n.icon} className="hero-notification-icon" />
              <div className="hero-notification-content">
                <div className="hero-notification-title-row">{n.title}</div>
                <div className="hero-notification-message">{n.message}</div>
                <div className="hero-notification-time">{n.time}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      <button className="dashboard-logout-btn hero-logout" onClick={handleLogout}>Logout</button>
    </div>
    <h1 className="dashboard-welcome hero-welcome">Welcome, <span className="hero-username">{user?.name || 'User'}</span>!</h1>
    <div className="hero-quote hero-quote-below">
      <FontAwesomeIcon icon={faQuoteLeft} className="hero-quote-icon" />
      <span>{quote}</span>
    </div>
    <p className="dashboard-subtitle hero-subtitle">Track your progress, continue your courses, and master typing for government exams.</p>
    <div className="hero-user-row">
      <div className="hero-avatar-quote"></div>
    </div>
  </div>
);

interface UserDashboardProps {
  typingCourseOnly?: boolean;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ typingCourseOnly }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'purchased' | 'expiring' | 'announcements'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'screen' | 'paper' | 'exam'>('all');
  const [selectedLevel, setSelectedLevel] = useState<any | null>(null);
  const [selectedSubLevel, setSelectedSubLevel] = useState<any | null>(null);
  const [showFullTypingCourseDashboard, setShowFullTypingCourseDashboard] = useState(false);
  const [selectedTypingCourseLevel, setSelectedTypingCourseLevel] = useState<{ level: number; title: string; content: string } | null>(null);
  const [backendCards, setBackendCards] = useState<any[]>([]);
  const [cardsLoading, setCardsLoading] = useState(false);
  const [cardsError, setCardsError] = useState<string | null>(null);
  const [purchasedCourses, setPurchasedCourses] = useState<any[]>([]);
  const [purchasedLoading, setPurchasedLoading] = useState(false);
  const [purchasedError, setPurchasedError] = useState<string | null>(null);

  // Fetch backend cards
  useEffect(() => {
    const fetchBackendCards = async () => {
      setCardsLoading(true);
      setCardsError(null);
      try {
        const res = await axios.get('/api/cards');
        setBackendCards(res.data.map((c: any) => ({
          id: c._id,
          title: c.title,
          description: c.description,
          price: c.offerPrice ?? c.originalPrice,
          originalPrice: c.originalPrice,
          offerPrice: c.offerPrice,
          isActive: c.isActive,
        })));
      } catch (err) {
        setCardsError('Failed to load courses');
      } finally {
        setCardsLoading(false);
      }
    };
    fetchBackendCards();
  }, []);

  // Fetch purchased courses
  const fetchPurchasedCourses = async () => {
    if (!user || !user.id) return;
    setPurchasedLoading(true);
    setPurchasedError(null);
    try {
      const res = await axios.get(`/api/users/${user.id}/purchased-courses`);
      setPurchasedCourses(res.data.map((c: any) => ({
        id: c._id,
        title: c.title,
        description: c.description,
        price: c.offerPrice ?? c.originalPrice,
        originalPrice: c.originalPrice,
        offerPrice: c.offerPrice,
        isActive: c.isActive,
      })));
    } catch (err) {
      setPurchasedError('Failed to load purchased courses');
    } finally {
      setPurchasedLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchasedCourses();
    // eslint-disable-next-line
  }, [user]);

  // Buy Now handler
  const handleBuyNow = async (courseId: string) => {
    if (!user || !user.id) return;
    try {
      await axios.post(`/api/users/${user.id}/purchase`, { courseId });
      fetchPurchasedCourses();
      alert('Course purchased successfully!');
    } catch (err) {
      alert('Failed to purchase course');
    }
  };

  // Mock user data
  const userData: User = {
    id: 'mock-user-id',
    name: 'Neeraj Mehra',
    level: 5,
    experience: 750,
    nextLevelExp: 1000,
    avatar: "https://ui-avatars.com/api/?name=Neeraj+Mehra&background=1976d2&color=fff",
    wpm: 65,
    stats: {
      accuracy: 85,
      speed: 65,
      streak: 7,
      testsCompleted: 25,
      certificates: 3
    }
  };

  // Mock notifications data
  const notifications: Notification[] = [
    {
      id: 1,
      title: 'New Course Available',
      message: 'Advanced Typing Techniques is now available!',
      time: '2 hours ago',
      read: false,
      icon: faBookOpen
    },
    {
      id: 2,
      title: 'Achievement Unlocked',
      message: "You've completed 10 typing tests!",
      time: '1 day ago',
      read: true,
      icon: faTrophy
    }
  ];

  // Mock courses data (add Complete Typing Course)
  const availableCourses: Course[] = [
    {
      id: 10,
      title: 'Complete Typing Course',
      description: 'Master typing from basics to advanced. Covers finger placement, posture, speed, and accuracy drills for proficient typing.',
      level: '',
      duration: '8 weeks',
      progress: 0,
      icon: faBookOpen,
      type: 'screen',
      isPremium: true,
      price: 999
    },
    {
      id: 1,
      title: 'Screen Typing Mastery',
      description: 'Master typing on digital screens with advanced techniques',
      level: '',
      duration: '4 weeks',
      progress: 0,
      icon: faKeyboard,
      type: 'screen',
      price: 499,
      isTrial: true
    },
    {
      id: 2,
      title: 'Paper Typing Excellence',
      description: 'Learn traditional paper typing methods',
      level: '',
      duration: '3 weeks',
      progress: 0,
      icon: faFileAlt,
      type: 'paper',
      price: 399,
      isTrial: true
    }
    // Removed: Railway Typing Test
  ];

  // Mock test history
  const testHistory: TestHistory[] = [
    {
      id: 1,
      testName: 'Basic Typing Test',
      date: '2024-03-15',
      score: 85,
      accuracy: 92,
      speed: 45
    },
    {
      id: 2,
      testName: 'Advanced Speed Test',
      date: '2024-03-14',
      score: 78,
      accuracy: 88,
      speed: 60
    }
  ];

  // Mock achievements
  const achievements: Achievement[] = [
    {
      id: 1,
      title: "Speed Demon",
      description: "Achieve 60 WPM in any test",
      icon: faTachometerAlt,
      unlocked: true
    },
    {
      id: 2,
      title: "Perfect Score",
      description: "Complete a test with 100% accuracy",
      icon: faStar,
      unlocked: true
    },
    {
      id: 3,
      title: "Consistent Learner",
      description: "Complete 7 days of practice",
      icon: faCalendarAlt,
      unlocked: false
    },
    {
      id: 4,
      title: "Master Typist",
      description: "Complete all advanced courses",
      icon: faCrown,
      unlocked: false
    }
  ];

  // Mock leaderboard
  const leaderboard: User[] = [
    { 
      id: 'leaderboard-user-1',
      name: "John Doe", 
      level: 5,
      experience: 450,
      nextLevelExp: 500,
      avatar: "https://ui-avatars.com/api/?name=John+Doe&background=1976d2&color=fff",
      wpm: 85,
      stats: {
        accuracy: 98,
        speed: 85,
        streak: 12,
        testsCompleted: 45,
        certificates: 4
      }
    },
    { 
      id: 'leaderboard-user-2',
      name: "Jane Smith", 
      level: 4,
      experience: 380,
      nextLevelExp: 450,
      avatar: "https://ui-avatars.com/api/?name=Jane+Smith&background=1976d2&color=fff",
      wpm: 82,
      stats: {
        accuracy: 95,
        speed: 82,
        streak: 10,
        testsCompleted: 40,
        certificates: 3
      }
    },
    { 
      id: 'leaderboard-user-3',
      name: "Mike Johnson", 
      level: 4,
      experience: 350,
      nextLevelExp: 450,
      avatar: "https://ui-avatars.com/api/?name=Mike+Johnson&background=1976d2&color=fff",
      wpm: 80,
      stats: {
        accuracy: 93,
        speed: 80,
        streak: 8,
        testsCompleted: 38,
        certificates: 2
      }
    },
    { 
      id: 'leaderboard-user-4',
      name: "Sarah Wilson", 
      level: 3,
      experience: 300,
      nextLevelExp: 350,
      avatar: "https://ui-avatars.com/api/?name=Sarah+Wilson&background=1976d2&color=fff",
      wpm: 78,
      stats: {
        accuracy: 90,
        speed: 78,
        streak: 6,
        testsCompleted: 35,
        certificates: 2
      }
    },
    { 
      id: 'leaderboard-user-5',
      name: "David Brown", 
      level: 3,
      experience: 280,
      nextLevelExp: 350,
      avatar: "https://ui-avatars.com/api/?name=David+Brown&background=1976d2&color=fff",
      wpm: 75,
      stats: {
        accuracy: 89,
        speed: 75,
        streak: 5,
        testsCompleted: 32,
        certificates: 1
      }
    }
  ];

  // Mock certificates
  const certificates: Certificate[] = [
    {
      id: 1,
      title: "Basic Typing Certification",
      date: "2024-02-15",
      level: "Beginner",
      icon: faCertificate
    },
    {
      id: 2,
      title: "Intermediate Typing Master",
      date: "2024-03-01",
      level: "Intermediate",
      icon: faCertificate
    }
  ];

  // Mock milestones
  const milestones: Milestone[] = [
    {
      id: 1,
      title: "Current Streak",
      value: "9 days",
      icon: faFire
    },
    {
      id: 2,
      title: "Tests Completed",
      value: "45",
      icon: faFileAlt
    },
    {
      id: 3,
      title: "Certificates",
      value: "2",
      icon: faCertificate
    },
    {
      id: 4,
      title: "Fastest WPM",
      value: "75",
      icon: faTachometerAlt
    }
  ];

  // 1. STATS ROW (replace milestones with modern cards)
  const stats = [
    {
      label: 'WPM',
      value: userData.wpm || 0,
      icon: faTachometerAlt,
      color: '#1976d2',
    },
    {
      label: 'Accuracy',
      value: userData.stats.accuracy + '%',
      icon: faChartLine,
      color: '#00e0ff',
    },
    {
      label: 'Tests Taken',
      value: userData.stats.testsCompleted,
      icon: faFileAlt,
      color: '#ffd700',
    },
    {
      label: 'Certificates',
      value: userData.stats.certificates,
      icon: faCertificate,
      color: '#10b981',
    },
  ];

  // Instead, initialize with useState:
  const [allCourses, setAllCourses] = useState([
    ...availableCourses
    // Removed: Railway Typing Test, SSC-CGL/CHSL Mock Tests, Supreme Court Typing Tests
  ]);

  // Exam-wise test cards (from ExamWiseTest)
  const examWiseCourses = [
    {
      id: 'ssc-cgl',
      icon: 'fas fa-graduation-cap',
      title: 'SSC-CGL Mock Test',
      description: 'Practice for SSC-CGL with 2000 key depressions in 15 minutes.',
      link: '/ssc-cgl-test',
      category: 'SSC'
    },
    {
      id: 'ssc-chsl',
      icon: 'fas fa-graduation-cap',
      title: 'SSC-CHSL Mock Test',
      description: 'Prepare for SSC-CHSL with real exam passages and speed goals.',
      link: '/ssc-chsl-test',
      category: 'SSC'
    },
    {
      id: 'rrb-ntpc',
      icon: 'fas fa-train',
      title: 'RRB-NTPC Mock Test',
      description: 'Master RRB-NTPC typing with Hindi and English passages.',
      link: '/rrb-ntpc-test',
      category: 'Railway'
    },
    {
      id: 'junior-assistant',
      icon: 'fas fa-briefcase',
      title: 'Junior Assistant Mock Test',
      description: 'Excel in Junior Assistant typing with accurate practice.',
      link: '/junior-assistant-test',
      category: 'Government'
    },
    {
      id: 'superintendent',
      icon: 'fas fa-user-tie',
      title: 'Superintendent Mock Test',
      description: 'Practice for Superintendent typing with exam-like conditions.',
      link: '/superintendent-test',
      category: 'Government'
    },
    {
      id: 'junior-court-assistant',
      icon: 'fas fa-gavel',
      title: 'Jr. Court Assistant Mock Test',
      description: 'Master Junior Court Assistant typing with legal terms.',
      link: '/junior-court-assistant-test',
      category: 'Court'
    },
    {
      id: 'up-police',
      icon: 'fas fa-shield-alt',
      title: 'UP Police Mock Test',
      description: 'Practice for UP Police typing test with real exam patterns.',
      link: '/up-police-test',
      category: 'Police'
    },
    {
      id: 'bihar-police',
      icon: 'fas fa-shield-alt',
      title: 'Bihar Police Mock Test',
      description: 'Prepare for Bihar Police typing test with exam-like passages.',
      link: '/bihar-police-test',
      category: 'Police'
    },
    {
      id: 'aiims-crc',
      icon: 'fas fa-hospital',
      title: 'AIIMS CRC Mock Test',
      description: 'Practice for AIIMS CRC typing test with medical terminology.',
      link: '/aiims-crc-test',
      category: 'Medical'
    },
    {
      id: 'allahabad-high-court',
      icon: 'fas fa-balance-scale',
      title: 'Allahabad High Court Mock Test',
      description: 'Prepare for Allahabad High Court typing test with legal passages.',
      link: '/allahabad-high-court-test',
      category: 'Court'
    }
  ];

  // Dummy purchase handler
  // const handleBuyNow = (courseId: number) => {
  //   if (window.confirm('Are you sure you want to purchase this course?')) {
  //     setAllCourses(prev =>
  //       prev.map(course =>
  //         course.id === courseId ? { ...course, progress: 1 } : course
  //       )
  //     );
  //     // Optionally, show a toast or alert here
  //     // alert('Course purchased successfully!');
  //   }
  // };

  // Purchased courses filter
  // const purchasedCourses = allCourses.filter(c => c.progress > 0);

  // Pick a random motivational quote
  const idNum = typeof userData.id === 'string'
    ? userData.id.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
    : Number(userData.id) || 0;
  const quote = motivationalQuotes[(idNum + userData.level) % motivationalQuotes.length];

  // Mock expiring courses data
  const expiringCourses = [
    {
      id: 1,
      title: 'Screen Typing Mastery',
      expiresIn: 3, // days
      icon: faKeyboard,
      price: 499
    },
    {
      id: 2,
      title: 'Railway Typing Test',
      expiresIn: 1,
      icon: faCertificate,
      price: 799
    }
  ];

  // Mock typing stats data for chart
  const typingStats = [
    { date: 'Mon', wpm: 55, accuracy: 92 },
    { date: 'Tue', wpm: 60, accuracy: 94 },
    { date: 'Wed', wpm: 58, accuracy: 91 },
    { date: 'Thu', wpm: 62, accuracy: 95 },
    { date: 'Fri', wpm: 65, accuracy: 93 },
    { date: 'Sat', wpm: 68, accuracy: 96 },
    { date: 'Sun', wpm: 70, accuracy: 97 },
  ];

  // Filtered courses logic
  const filteredCourses = allCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || course.type === filterType;
    return matchesSearch && matchesType;
  });

  // --- Dashboard Tabs ---
  const renderTabs = () => (
    <div className="dashboard-tabs-row">
      <button className={activeTab === 'all' ? 'tab-btn active' : 'tab-btn'} onClick={() => setActiveTab('all')}>All Courses</button>
      <button className={activeTab === 'purchased' ? 'tab-btn active' : 'tab-btn'} onClick={() => setActiveTab('purchased')}>Purchased Courses</button>
      <button className={activeTab === 'expiring' ? 'tab-btn active' : 'tab-btn'} onClick={() => setActiveTab('expiring')}>Expiring Soon</button>
      <button className={activeTab === 'announcements' ? 'tab-btn active' : 'tab-btn'} onClick={() => setActiveTab('announcements')}>Announcements</button>
    </div>
  );

  // --- LOGOUT HANDLER ---
  const handleLogout = async () => {
    await logout();
    navigate('/typing-course'); // Redirect to Typing Course Landing page
  };

  // --- Section Renderers ---
  const renderAllCourses = () => (
    <>
      <div className="course-search-filter-row">
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="course-search-input"
        />
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value as any)}
          className="course-type-filter"
        >
          <option value="all">All Types</option>
          <option value="screen">Screen</option>
          <option value="paper">Paper</option>
          <option value="exam">Exam</option>
        </select>
      </div>
      {cardsLoading && <div style={{ color: '#1976d2', marginBottom: 12 }}>Loading courses...</div>}
      {cardsError && <div style={{ color: 'red', marginBottom: 12 }}>{cardsError}</div>}
      <div className="user-dashboard-courses-modern four-col-layout">
        {/* Backend cards only */}
        {backendCards.map((course) => (
          <div className="course-card-modern not-enrolled" key={course.id}>
            <div className="course-icon-modern">
              <span role="img" aria-label="Course">📚</span>
            </div>
            <div className="course-content-modern">
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <div className="course-bottom-row">
                {course.offerPrice < course.originalPrice ? (
                  <>
                    <span className="course-price" style={{ textDecoration: 'line-through', color: '#d6001c', marginRight: 8 }}>₹{course.originalPrice}</span>
                    <span className="course-price" style={{ color: '#43a047', fontWeight: 600 }}>₹{course.offerPrice}</span>
                  </>
                ) : (
                  <span className="course-price">₹{course.originalPrice}</span>
                )}
                <button className="course-action-btn-modern primary" onClick={() => handleBuyNow(course.id)}>
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        ))}
        {/* Old static courses removed */}
      </div>
    </>
  );

  const renderPurchasedCourses = () => (
    <div className="user-dashboard-courses-modern four-col-layout">
      {purchasedLoading && <div style={{ color: '#1976d2', marginBottom: 12 }}>Loading purchased courses...</div>}
      {purchasedError && <div style={{ color: 'red', marginBottom: 12 }}>{purchasedError}</div>}
      {purchasedCourses.length === 0 ? (
        <div className="empty-state-modern">You have not purchased any courses yet.</div>
      ) : (
        purchasedCourses.map((course: any) => (
          <div
            className="course-card-modern enrolled"
            key={course.id}
            style={{ cursor: 'pointer' }}
          >
            <div className="course-icon-modern">
              <span role="img" aria-label="Course">📚</span>
            </div>
            <div className="course-content-modern">
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <div className="course-bottom-row">
                {course.offerPrice < course.originalPrice ? (
                  <>
                    <span className="course-price" style={{ textDecoration: 'line-through', color: '#d6001c', marginRight: 8 }}>₹{course.originalPrice}</span>
                    <span className="course-price" style={{ color: '#43a047', fontWeight: 600 }}>₹{course.offerPrice}</span>
                  </>
                ) : (
                  <span className="course-price">{course.originalPrice === 0 ? <span style={{ color: '#43a047', fontWeight: 600 }}>Free</span> : `₹${course.originalPrice}`}</span>
                )}
                <button className="course-action-btn-modern primary" disabled>
                  Purchased
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const handlePurchasedCourseClick = (course: Course) => {
    if (course.title === 'Complete Typing Course') {
      setShowFullTypingCourseDashboard(true);
      setSelectedTypingCourseLevel(null);
    }
  };

  const FullTypingCourseDashboard: React.FC = () => {
    const navigate = useNavigate();
    return (
      <div className="ftc-dashboard-layout">
        <aside className="ftc-sidebar">
          <div className="ftc-sidebar-title">Complete Typing Course</div>
          <div className="ftc-sidebar-levels-list">
            {typingCourse.map((level: { level: number; title: string; content: string }) => (
              <div
                key={level.level}
                className={`ftc-sidebar-level${selectedTypingCourseLevel?.level === level.level ? ' current' : ''}`}
                onClick={() => {
                  if (level.level >= 1 && level.level <= 19) {
                    navigate('/typing-level-practice', { state: { level } });
                  } else if (level.level >= 20 && level.level <= 30) {
                    navigate('/typing-engine-practice', { state: { level } });
                  } else {
                    setSelectedTypingCourseLevel(level);
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <span className="ftc-sidebar-level-index">{level.level}.</span>
                <span className="ftc-sidebar-level-name">{level.title}</span>
              </div>
            ))}
          </div>
        </aside>
        <main className="ftc-main-content">
          <button className="ftc-back-btn" onClick={() => setShowFullTypingCourseDashboard(false)}>
            &larr; Back to Dashboard
          </button>
          {!selectedTypingCourseLevel && (
            <div className="ftc-progress-summary">
              <h2>Typing Course Progress</h2>
              <div className="ftc-progress-bar-outer">
                <div className="ftc-progress-bar-inner" style={{ width: '0%' }} />
              </div>
              <div className="ftc-progress-label">0/30 Levels Completed</div>
              <div className="ftc-welcome-tip">
                Select a level from the sidebar to begin your typing journey!
              </div>
            </div>
          )}
          {selectedTypingCourseLevel && selectedTypingCourseLevel.level > 19 && (
            <div className="ftc-practice-area">
              <h3>{selectedTypingCourseLevel.title}</h3>
              <div className="ftc-practice-content">
                <div className="ftc-practice-text">
                  {selectedTypingCourseLevel.content}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  };

  if (showFullTypingCourseDashboard) {
    return <FullTypingCourseDashboard />;
  }

  if (typingCourseOnly) {
    return (
      <div className="user-dashboard-container">
        <Helmet>
          <title>User Dashboard</title>
        </Helmet>
        <DashboardHero
          userData={userData}
          user={user}
          quote={quote}
          notifications={notifications}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          logout={logout}
          handleLogout={handleLogout}
        />
        <div className="user-dashboard-content">
          {renderTabs()}
          {activeTab === 'all' && renderAllCourses()}
          {activeTab === 'purchased' && renderPurchasedCourses()}
          {activeTab === 'expiring' && renderAllCourses()}
          {activeTab === 'announcements' && renderAllCourses()}
        </div>
      </div>
    );
  }

  return (
    <div className="user-dashboard-container">
      <Helmet>
        <title>User Dashboard</title>
      </Helmet>
      <DashboardHero
        userData={userData}
        user={user}
        quote={quote}
        notifications={notifications}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        logout={logout}
        handleLogout={handleLogout}
      />
      <div className="user-dashboard-content">
        {renderTabs()}
        {activeTab === 'all' && renderAllCourses()}
        {activeTab === 'purchased' && renderPurchasedCourses()}
        {activeTab === 'expiring' && renderAllCourses()}
        {activeTab === 'announcements' && renderAllCourses()}
      </div>
    </div>
  );
};

// Shared landing courses for use in TypingCourseLanding and Dashboard
export const sharedLandingCourses = [
  {
    id: 10,
    title: 'Complete Typing Course',
    description: 'Master typing from basics to advanced. Covers finger placement, posture, speed, and accuracy drills for proficient typing.',
    icon: faBookOpen,
    price: 999
  },
  {
    id: 'ssc-cgl',
    title: 'SSC-CGL Mock Test',
    description: 'Practice for SSC-CGL with 2000 key depressions in 15 minutes.',
    icon: faGraduationCap,
    price: 499
  },
  {
    id: 'ssc-chsl',
    title: 'SSC-CHSL Mock Test',
    description: 'Prepare for SSC-CHSL with real exam passages and speed goals.',
    icon: faGraduationCap,
    price: 499
  },
  {
    id: 'rrb-ntpc',
    title: 'RRB-NTPC Mock Test',
    description: 'Master RRB-NTPC typing with Hindi and English passages.',
    icon: faTrain,
    price: 399
  }
];

export default UserDashboard; 