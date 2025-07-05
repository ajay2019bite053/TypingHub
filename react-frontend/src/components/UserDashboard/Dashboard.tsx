import React, { useState } from 'react';
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
  IconDefinition
} from '@fortawesome/free-solid-svg-icons';
import './Dashboard.css';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: any;
}

interface User {
  id: number;
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

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);

  // Mock user data
  const user: User = {
    id: 1,
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

  // Mock courses data
  const availableCourses: Course[] = [
    {
      id: 1,
      title: 'Screen Typing Mastery',
      description: 'Master typing on digital screens with advanced techniques',
      level: 'Intermediate',
      duration: '4 weeks',
      progress: 0,
      icon: faKeyboard,
      type: 'screen'
    },
    {
      id: 2,
      title: 'Paper Typing Excellence',
      description: 'Learn traditional paper typing methods',
      level: 'Beginner',
      duration: '3 weeks',
      progress: 0,
      icon: faFileAlt,
      type: 'paper'
    },
    {
      id: 3,
      title: 'Speed Typing Challenge',
      description: 'Improve your typing speed with timed challenges',
      level: 'Advanced',
      duration: '2 weeks',
      progress: 0,
      icon: faChartLine,
      type: 'exam',
      isPremium: true
    },
    {
      id: 4,
      title: 'Railway Typing Test',
      description: 'Railway exam specific typing practice',
      level: 'Advanced',
      duration: '4 weeks',
      progress: 0,
      icon: faCertificate,
      type: 'exam',
      isPremium: true
    }
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
      id: 1, 
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
      id: 2, 
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
      id: 3, 
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
      id: 4, 
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
      id: 5, 
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

  // Course card component
  const CourseCard: React.FC<{ course: Course }> = ({ course }) => (
    <div className="course-card">
      {course.isPremium && (
        <div className="premium-badge">
          <FontAwesomeIcon icon={faCrown} />
          Premium
        </div>
      )}
      <div className="course-icon">
        <FontAwesomeIcon icon={course.icon} />
      </div>
      <div className="course-content">
        <h3>{course.title}</h3>
        <p>{course.description}</p>
        <div className="course-meta">
          <span className="course-level">
            <FontAwesomeIcon icon={faChartLine} />
            {course.level}
          </span>
          <span className="course-duration">
            <FontAwesomeIcon icon={faClock} />
            {course.duration}
          </span>
        </div>
        <div className="course-progress">
          <div 
            className="course-progress-bar" 
            style={{ width: `${course.progress}%` }}
          />
        </div>
        <button className="course-button">
          {course.progress > 0 ? 'Continue' : 'Start Course'}
        </button>
      </div>
    </div>
  );

  // Empty state component
  const EmptyState: React.FC<{ icon: any; message: string }> = ({ icon, message }) => (
    <div className="empty-state">
      <FontAwesomeIcon icon={icon} className="empty-state-icon" />
      <p className="empty-state-text">{message}</p>
    </div>
  );

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowUserProfile(false);
  };

  const toggleUserProfile = () => {
    setShowUserProfile(!showUserProfile);
    setShowNotifications(false);
  };

  const handleLogout = () => {
    // Implement logout logic
    console.log("Logging out...");
  };

  return (
    <div className="dashboard-container">
      <Helmet>
        <title>Dashboard | TypingMaster</title>
        <meta name="description" content="Track your typing progress and access learning resources" />
        <meta name="keywords" content="typing, dashboard, progress, learning" />
      </Helmet>

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>RDx</h2>
        </div>
        <nav className="sidebar-nav">
          <a href="#" className="nav-item active">
            <i className="fas fa-home"></i>
            <span>Dashboard</span>
          </a>
          <a href="#" className="nav-item">
            <i className="fas fa-keyboard"></i>
            <span>Practice Tests</span>
          </a>
          <a href="#" className="nav-item">
            <i className="fas fa-file-alt"></i>
            <span>My Tests</span>
          </a>
          <a href="#" className="nav-item">
            <i className="fas fa-book"></i>
            <span>Courses</span>
          </a>
          <a href="#" className="nav-item">
            <i className="fas fa-chart-line"></i>
            <span>Progress</span>
          </a>
          <a href="#" className="nav-item">
            <i className="fas fa-history"></i>
            <span>History</span>
          </a>
          <a href="#" className="nav-item">
            <i className="fas fa-trophy"></i>
            <span>Achievements</span>
          </a>
          <a href="#" className="nav-item">
            <i className="fas fa-cog"></i>
            <span>Settings</span>
          </a>
          <a href="#" className="nav-item">
            <i className="fas fa-question-circle"></i>
            <span>Help</span>
          </a>
          <a href="#" className="nav-item">
            <i className="fas fa-headset"></i>
            <span>Support</span>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1>Welcome back, {user.name}!</h1>
            <p>Level {user.level} • {user.stats.testsCompleted} Tests</p>
          </div>
          <div className="header-actions">
            <button 
              className="notification-button"
              onClick={toggleNotifications}
            >
              <i className="fas fa-bell"></i>
              {notifications.length > 0 && (
                <span className="notification-badge">{notifications.length}</span>
              )}
            </button>
            <button 
              className="profile-button"
              onClick={toggleUserProfile}
            >
              <img src={user.avatar} alt={user.name} />
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Progress Overview */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Your Progress</h2>
            </div>
            <div className="progress-stats">
              <div className="stat-item">
                <FontAwesomeIcon icon={faTachometerAlt} />
                <div>
                  <h3>Average WPM</h3>
                  <p>{user.wpm} WPM</p>
                </div>
              </div>
              <div className="stat-item">
                <FontAwesomeIcon icon={faClock} />
                <div>
                  <h3>Time Spent</h3>
                  <p>{user.stats.streak} Days</p>
                </div>
              </div>
              <div className="stat-item">
                <FontAwesomeIcon icon={faListCheck} />
                <div>
                  <h3>Tests Completed</h3>
                  <p>{user.stats.testsCompleted}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Progress */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Weekly Progress</h2>
            </div>
            <div className="progress-graph">
              {/* Placeholder for graph */}
              <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FontAwesomeIcon icon={faChartLine} style={{ fontSize: '48px', color: '#1976d2' }} />
              </div>
            </div>
          </div>

          {/* Recommended Courses */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Recommended Courses</h2>
            </div>
            <div className="courses-grid">
              {availableCourses
                .filter(course => course.isRecommended)
                .map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
            </div>
          </div>

          {/* Screen Typing Courses */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Screen Typing Courses</h2>
            </div>
            <div className="courses-grid">
              {availableCourses
                .filter(course => course.type === 'screen')
                .map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
            </div>
          </div>

          {/* Paper Typing Courses */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Paper Typing Courses</h2>
            </div>
            <div className="courses-grid">
              {availableCourses
                .filter(course => course.type === 'paper')
                .map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
            </div>
          </div>

          {/* Exam Preparation */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Exam Preparation</h2>
            </div>
            <div className="courses-grid">
              {availableCourses
                .filter(course => course.type === 'exam')
                .map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Your Achievements</h2>
            </div>
            <div className="achievements-grid">
              {achievements.map(achievement => (
                <div key={achievement.id} className={`achievement-card ${achievement.unlocked ? '' : 'locked'}`}>
                  <div className="achievement-icon">
                    <FontAwesomeIcon icon={achievement.icon} />
                  </div>
                  <div className="achievement-content">
                    <h3>{achievement.title}</h3>
                    <p>{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Top Performers</h2>
            </div>
            <div className="leaderboard-grid">
              {leaderboard.map((user, index) => (
                <div key={user.id} className="leaderboard-card">
                  <div className="leaderboard-rank">{index + 1}</div>
                  <img src={user.avatar} alt={user.name} className="leaderboard-avatar" />
                  <div className="leaderboard-content">
                    <h3>{user.name}</h3>
                    <p>
                      <FontAwesomeIcon icon={faTachometerAlt} />
                      {user.wpm} WPM
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Milestones */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Streak & Milestones</h2>
            </div>
            <div className="milestones-grid">
              {milestones.map(milestone => (
                <div key={milestone.id} className="milestone-card">
                  <div className="milestone-icon">
                    <FontAwesomeIcon icon={milestone.icon} />
                  </div>
                  <div className="milestone-content">
                    <h3>{milestone.title}</h3>
                    <p>{milestone.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certificates */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Your Certificates</h2>
            </div>
            <div className="certificates-grid">
              {certificates.map(certificate => (
                <div key={certificate.id} className="certificate-card">
                  <div className="certificate-icon">
                    <FontAwesomeIcon icon={certificate.icon} />
                  </div>
                  <div className="certificate-content">
                    <h3>{certificate.title}</h3>
                    <p>{certificate.level}</p>
                    <span>{certificate.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dropdowns */}
        {showNotifications && (
          <div className="dropdown notifications-dropdown">
            <div className="dropdown-header">
              <h3>Notifications</h3>
              <button onClick={toggleNotifications}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="dropdown-content">
              {notifications.map(notification => (
                <div key={notification.id} className="notification-item">
                  <i className={notification.icon}></i>
                  <div>
                    <p>{notification.message}</p>
                    <span>{notification.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showUserProfile && (
          <div className="dropdown profile-dropdown">
            <div className="dropdown-header">
              <h3>Profile</h3>
              <button onClick={toggleUserProfile}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="dropdown-content">
              <div className="profile-info">
                <img src={user.avatar} alt={user.name} />
                <div>
                  <h3>{user.name}</h3>
                  <p>Level {user.level}</p>
                </div>
              </div>
              <div className="dropdown-actions">
                <button>
                  <i className="fas fa-user"></i>
                  View Profile
                </button>
                <button>
                  <i className="fas fa-cog"></i>
                  Settings
                </button>
                <button onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i>
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboard; 