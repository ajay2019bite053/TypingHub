import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendar, 
  faUser, 
  faClock,
  faKeyboard,
  faGraduationCap,
  faLanguage,
  faLaptop,
  faTrophy,
  faBook,
  faCheckCircle,
  faRocket,
  faChartLine,
  faAward,
  faBrain,
  faHandshake,
  faTools,
} from '@fortawesome/free-solid-svg-icons';
import './Blog.css';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  previewPoints: string[];
  fullContent: string;
  authorRole?: string;
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: 'speed-tips-1',
    title: 'The Science Behind Touch Typing: Master the Art of Speed and Accuracy',
    content: 'Unlock the secrets of professional touch typing with our comprehensive guide. Learn how brain-muscle memory works, understand the psychology of typing, and discover scientifically proven techniques to boost your typing speed while maintaining accuracy.',
    author: 'Dr. Sarah Johnson',
    authorRole: 'Typing Research Expert',
    date: 'March 15, 2024',
    readTime: '15 min read',
    category: 'speed-tips',
    image: '/blog-images/typing-speed.jpg',
    previewPoints: [
      'Understanding cognitive processes in touch typing',
      'Ergonomic positioning for maximum efficiency',
      'Progressive training techniques backed by research',
      'Common mistakes and their neurological impact',
      'Advanced drills based on muscle memory development',
    ],
    fullContent: "Touch typing is more than just hitting keys quickly - it's a complex interplay of cognitive processes, muscle memory, and neurological pathways. This comprehensive guide delves deep into the science of typing, exploring how your brain processes typing movements and how to optimize this process for maximum efficiency. We'll examine research-backed techniques, ergonomic principles, and advanced training methodologies used by professional typists worldwide.",
  },
  {
    id: 'exam-prep-1',
    title: 'Ultimate Guide to Government Typing Test Success 2024',
    content: 'A comprehensive roadmap for conquering government typing tests. From understanding exam patterns to mastering time management, this guide covers everything you need to know for various government recruitment exams.',
    author: 'Rajesh Kumar',
    authorRole: 'Govt. Exam Preparation Expert',
    date: 'March 12, 2024',
    readTime: '20 min read',
    category: 'exam-prep',
    image: '/blog-images/exam-prep.jpg',
    previewPoints: [
      'Latest exam pattern analysis for SSC, CPCT, and state exams',
      'Detailed preparation timeline and study plan',
      'Advanced mock test strategies with real exam scenarios',
      'Speed vs. accuracy optimization techniques',
      'Expert tips for handling exam pressure',
    ],
    fullContent: 'Success in government typing tests requires a strategic approach combining speed, accuracy, and exam-specific preparation. This in-depth guide breaks down the requirements for various competitive exams, providing detailed insights into scoring patterns, qualification criteria, and preparation strategies. Learn how to optimize your practice sessions, manage exam stress, and achieve the perfect balance between speed and accuracy.',
  },
  {
    id: 'hindi-typing-1',
    title: 'Complete Hindi Typing Mastery: From Beginner to Professional',
    content: 'Master the art of Hindi typing with our comprehensive guide. Whether you are starting from scratch or looking to improve your speed, this guide covers everything from basic character mapping to advanced typing techniques.',
    author: 'Priya Sharma',
    authorRole: 'Hindi Language Expert',
    date: 'March 10, 2024',
    readTime: '25 min read',
    category: 'hindi-typing',
    image: '/blog-images/hindi-typing.jpg',
    previewPoints: [
      'Detailed guide to Hindi keyboard layouts (Remington/Inscript)',
      'Step-by-step character mapping exercises',
      'Advanced matra placement techniques',
      'Common Hindi typing challenges and solutions',
      'Professional Hindi typing tools and software',
    ],
    fullContent: 'Hindi typing presents unique challenges that require specific techniques and understanding. This comprehensive guide takes you through every aspect of Hindi typing, from understanding different keyboard layouts to mastering complex character combinations. Learn professional techniques for handling matras, half-letters, and special characters while maintaining high speed and accuracy.',
  },
  {
    id: 'keyboard-tips-1',
    title: 'Professional Keyboard Mastery: Advanced Techniques and Tools',
    content: 'Elevate your typing efficiency with advanced keyboard techniques and productivity tools. Learn how to leverage shortcuts, custom mappings, and specialized software to maximize your typing productivity.',
    author: 'Alex Chen',
    authorRole: 'Productivity Expert',
    date: 'March 8, 2024',
    readTime: '18 min read',
    category: 'keyboard-tips',
    image: '/blog-images/keyboard-shortcuts.jpg',
    previewPoints: [
      'Advanced keyboard shortcuts for all operating systems',
      'Custom keyboard mapping for maximum efficiency',
      'Text expansion and macro techniques',
      'Productivity software recommendations',
      'Ergonomic keyboard selection guide',
    ],
    fullContent: 'Modern typing efficiency goes beyond basic skills. This guide explores advanced keyboard techniques, productivity tools, and customization options that can dramatically improve your typing speed and workflow efficiency. Learn how to use text expansion, create custom macros, and optimize your keyboard setup for maximum productivity.',
  },
  {
    id: 'success-story-1',
    title: 'From Novice to Expert: A Journey to Typing Excellence',
    content: 'An inspiring story of determination and strategic practice. Follow the journey of how consistent effort and the right techniques led to remarkable improvement in typing proficiency.',
    author: 'Amit Patel',
    authorRole: 'Typing Competition Winner',
    date: 'March 5, 2024',
    readTime: '15 min read',
    category: 'success-stories',
    image: '/blog-images/success-story.jpg',
    previewPoints: [
      'Personal challenges and initial struggles',
      'Structured learning approach and milestones',
      'Practice techniques that yielded results',
      'Competition preparation strategies',
      'Tips for maintaining motivation',
    ],
    fullContent: 'Follow the inspiring journey of transformation from a two-finger typist to a typing competition winner. This story details the challenges faced, strategies employed, and lessons learned along the way. Learn about effective practice techniques, motivation strategies, and how to overcome common obstacles in your typing journey.',
  },
  {
    id: 'typing-tools-1',
    title: 'Essential Tools and Resources for Modern Typing Practice',
    content: 'Discover the best typing tools, software, and resources available for improving your typing skills. From online platforms to specialized applications, find the perfect tools for your practice.',
    author: 'Tech Team',
    authorRole: 'Software Development Team',
    date: 'March 3, 2024',
    readTime: '16 min read',
    category: 'typing-tools',
    image: '/blog-images/typing-tools.jpg',
    previewPoints: [
      'Top online typing practice platforms',
      'Specialized typing software reviews',
      'Mobile apps for typing practice',
      'Progress tracking tools comparison',
      'Free vs. premium tool analysis',
    ],
    fullContent: 'The right tools can significantly accelerate your typing progress. This comprehensive guide reviews and compares various typing practice platforms, software, and resources available for typists at all levels. Learn about features, pricing, and effectiveness of different tools to make informed decisions about your typing practice resources.',
  },
  {
    id: 'ergonomics-1',
    title: 'Ergonomic Typing: Health and Efficiency Guide',
    content: 'Learn how to maintain health and prevent injuries while typing. This guide covers ergonomic best practices, workspace setup, and exercises for typists.',
    author: 'Dr. Emily Wong',
    authorRole: 'Ergonomics Specialist',
    date: 'March 1, 2024',
    readTime: '14 min read',
    category: 'ergonomics',
    image: '/blog-images/ergonomics.jpg',
    previewPoints: [
      'Proper posture and sitting position',
      'Workspace setup optimization',
      'Exercises for preventing RSI',
      'Keyboard and chair selection guide',
      'Break timing and stretching routines',
    ],
    fullContent: 'Maintaining proper ergonomics is crucial for long-term typing success and health. This comprehensive guide covers everything from workspace setup to prevention of repetitive strain injuries. Learn about proper posture, equipment selection, and essential exercises to maintain your typing health.',
  },
];

const CATEGORIES = [
  { id: 'speed-tips', name: 'Speed Improvement', ref: 'speed-tips', icon: faRocket },
  { id: 'exam-prep', name: 'Exam Preparation', ref: 'exam-prep', icon: faGraduationCap },
  { id: 'hindi-typing', name: 'Hindi Typing', ref: 'hindi-typing', icon: faLanguage },
  { id: 'keyboard-tips', name: 'Keyboard Tips', ref: 'keyboard-tips', icon: faKeyboard },
  { id: 'success-stories', name: 'Success Stories', ref: 'success-stories', icon: faTrophy },
  { id: 'typing-tools', name: 'Typing Tools', ref: 'typing-tools', icon: faTools },
  { id: 'ergonomics', name: 'Ergonomics', ref: 'ergonomics', icon: faBrain },
];

const Blog: React.FC = () => {
  useEffect(() => {
    // Smooth scrolling for navigation
    const handleNavClick = (e: MouseEvent) => {
      const link = e.target as HTMLAnchorElement;
      if (link.matches('.blog-nav-list a')) {
        e.preventDefault();
        const targetId = link.getAttribute('href')?.substring(1);
        if (targetId) {
          const targetSection = document.getElementById(targetId);
          targetSection?.scrollIntoView({ behavior: 'smooth' });

          // Update active link
          document.querySelectorAll('.blog-nav-list a').forEach(a => a.classList.remove('active'));
          link.classList.add('active');
        }
      }
    };

    // Highlight current section on scroll
    const handleScroll = () => {
      const sections = document.querySelectorAll('.blog-section');
      let currentSection = '';

      sections.forEach((section) => {
        const sectionElement = section as HTMLElement;
        const sectionTop = sectionElement.offsetTop;
        const sectionHeight = sectionElement.clientHeight;
        if (window.pageYOffset >= sectionTop - 100) {
          currentSection = sectionElement.getAttribute('id') || '';
        }
      });

      document.querySelectorAll('.blog-nav-list a').forEach(link => {
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
    <main className="main-content">
      <Helmet>
        <title>Blog - TypingHub.in 📚</title>
        <meta name="description" content="Explore expert guides, tutorials, and success stories about typing skills, exam preparation, and professional development." />
        <meta name="keywords" content="typing tutorials, typing guides, exam preparation, typing success stories" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Serif:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Helmet>

      <div className="blog-hero-section">
        <div className="blog-hero-content">
          <h1>TypingHub Learning Center 📚</h1>
          <p>Explore expert guides, comprehensive tutorials, and success stories to master typing and excel in your career.</p>
        </div>
      </div>

      <div className="blog-content">
        <aside className="blog-nav">
          <div className="blog-nav-list">
          <h2>Categories</h2>
          <ul>
            {CATEGORIES.map(category => (
              <li key={category.id}>
                  <a href={`#${category.ref}`} className={category.id === 'speed-tips' ? 'active' : ''}>
                  <FontAwesomeIcon icon={category.icon} />
                  {category.name}
                </a>
              </li>
            ))}
          </ul>
          </div>
        </aside>

        <div className="blog-sections">
          {CATEGORIES.map(category => {
            const categoryPosts = BLOG_POSTS.filter(post => post.category === category.id);
            return (
              <section key={category.id} id={category.ref} className="blog-section">
              <h2>
                  <FontAwesomeIcon icon={category.icon} />
                  {category.name}
              </h2>
                {categoryPosts.map(post => (
                  <div key={post.id} className="blog-card">
                <img src={post.image} alt={post.title} />
                <div className="blog-meta">
                <span>
                  <FontAwesomeIcon icon={faCalendar} />
                    {post.date}
                </span>
                <span>
                  <FontAwesomeIcon icon={faUser} />
                  {post.author}
                    {post.authorRole && <span className="author-role">({post.authorRole})</span>}
                </span>
                  <span>
                    <FontAwesomeIcon icon={faClock} />
                    {post.readTime}
                  </span>
                </div>
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <div className="preview-points">
                  <h4>Key Takeaways:</h4>
                  <ul>
                    {post.previewPoints.map((point, index) => (
                      <li key={index}>
                        <FontAwesomeIcon icon={faCheckCircle} />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="full-content">
                  <p>{post.fullContent}</p>
                </div>
              </div>
                ))}
            </section>
            );
          })}
          <p className="last-updated">Last Updated: March 15, 2024</p>
        </div>
    </div>
    </main>
  );
};

export default Blog; 