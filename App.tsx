import React, { useState, useCallback, useEffect } from 'react';
import { User, UserRole, QuizSubmission, ScheduleEvent, Announcement, Course, Message, Transaction } from './types';
import { users as initialUsers, quizSubmissions as initialSubmissions, scheduleEvents as initialScheduleEvents, announcements as initialAnnouncements, courses, messages as initialMessages, transactions as initialTransactions } from './data';
import LoginScreen from './components/LoginScreen';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LearnerDashboard from './components/LearnerDashboard';
import InstructorDashboard from './components/InstructorDashboard';
import AdminDashboard from './components/AdminDashboard';
import MessagingModal from './components/MessagingModal';

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [submissions, setSubmissions] = useState<QuizSubmission[]>(initialSubmissions);
  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>(initialScheduleEvents);
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const handleToggleTheme = useCallback(() => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  }, []);

  const handleLogin = useCallback((user: User) => {
    setCurrentUser(user);
    setActiveView('dashboard'); // Reset to dashboard on login
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const handleRegister = useCallback((newUser: Omit<User, 'id' | 'avatar'>) => {
    const newId = Math.max(...users.map(u => u.id)) + 1;
    const userWithId: User = {
      ...newUser,
      id: newId,
      avatar: `https://picsum.photos/seed/${newId}/100/100`,
    };
    setUsers(prevUsers => [...prevUsers, userWithId]);
    handleLogin(userWithId);
  }, [users, handleLogin]);

  const handleUpdateProfile = useCallback((updates: Partial<User> & { currentPassword?: string, newPassword?: string }) => {
    if (!currentUser) return;

    const { currentPassword, newPassword, ...profileUpdates } = updates;

    // Password change logic
    if (newPassword) {
      if (currentPassword !== currentUser.password) {
        alert('Incorrect current password.');
        return;
      }
      profileUpdates.password = newPassword;
    }
    
    const updatedUser = { ...currentUser, ...profileUpdates };

    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    alert('Profile updated successfully!');

  }, [currentUser]);


  const handleQuizSubmit = useCallback((submissionData: Omit<QuizSubmission, 'id' | 'timestamp' | 'studentId'>) => {
    if (!currentUser) return;
    const newSubmission: QuizSubmission = {
      ...submissionData,
      studentId: currentUser.id,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    };
    setSubmissions(prev => {
        // Avoid duplicate submissions if user re-submits quickly
        const existing = prev.find(s => s.moduleId === newSubmission.moduleId && s.studentId === newSubmission.studentId);
        if (existing) {
            return prev.map(s => s.id === existing.id ? newSubmission : s);
        }
        return [...prev, newSubmission];
    });
    alert(`Quiz submitted! Your score: ${newSubmission.score}/${newSubmission.totalQuestions}`);
  }, [currentUser]);

  const handleSaveAnnouncement = useCallback((ann: Announcement | (Omit<Announcement, 'id'> & { id?: number })) => {
      if (ann.id) { // Editing existing
          setAnnouncements(prev => prev.map(a => a.id === ann.id ? (ann as Announcement) : a));
      } else { // Creating new
          const newAnn: Announcement = {
              ...(ann as Omit<Announcement, 'id'>),
              id: Date.now(),
          }
          setAnnouncements(prev => [...prev, newAnn]);
      }
  }, []);

  const handleDeleteAnnouncement = useCallback((id: number) => {
      if(window.confirm('Are you sure you want to delete this announcement?')) {
          setAnnouncements(prev => prev.filter(a => a.id !== id));
      }
  }, []);

  const handleSaveSchedule = useCallback((event: ScheduleEvent | (Omit<ScheduleEvent, 'id'> & { id?: number })) => {
      let savedEvent: ScheduleEvent;
      if (event.id) {
          savedEvent = event as ScheduleEvent;
          setScheduleEvents(prev => prev.map(e => e.id === event.id ? savedEvent : e));
      } else {
          savedEvent = {
              ...(event as Omit<ScheduleEvent, 'id'>),
              id: Date.now(),
          };
          setScheduleEvents(prev => [...prev, savedEvent]);

          // Auto-create an announcement
          const course = courses.find(c => c.id === savedEvent.courseId);
          const eventDate = new Date(savedEvent.startTime).toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
          const eventTime = new Date(savedEvent.startTime).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' });
          
          const newAnn: Omit<Announcement, 'id'> = {
              title: `New Schedule: ${savedEvent.type} for ${course?.title}`,
              content: `A new event, "${savedEvent.title}", has been scheduled for ${eventDate} at ${eventTime}. Please check your schedule for details. You will also receive an email notification.`,
              authorId: savedEvent.instructorId,
              date: new Date().toISOString().split('T')[0],
              courseId: savedEvent.courseId,
          }
          handleSaveAnnouncement(newAnn);
      }
  }, [handleSaveAnnouncement]);

  const handleSendMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const handlePaymentSuccess = useCallback((transactionId: number) => {
    setTransactions(prev =>
      prev.map(t => (t.id === transactionId ? { ...t, status: 'Paid' } : t))
    );
    alert('Payment successful! Your records have been updated.');
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);
  
  const openMessaging = useCallback(() => {
    setIsMessagingOpen(true);
  }, []);

  const closeMessaging = useCallback(() => {
    setIsMessagingOpen(false);
  }, []);
  
  const handleNavClick = useCallback((viewId: string) => {
    setActiveView(viewId);
    if(window.innerWidth < 768) { // Close sidebar on mobile after navigation
      setSidebarOpen(false);
    }
  }, []);

  const renderDashboard = () => {
    if (!currentUser) return null;
    switch (currentUser.role) {
      case UserRole.Learner:
        return <LearnerDashboard 
                    user={currentUser} 
                    users={users} 
                    activeView={activeView} 
                    onQuizSubmit={handleQuizSubmit} 
                    scheduleEvents={scheduleEvents}
                    announcements={announcements}
                    submissions={submissions}
                    onUpdateProfile={handleUpdateProfile}
                    theme={theme}
                    onToggleTheme={handleToggleTheme}
                    transactions={transactions}
                    onPaymentSuccess={handlePaymentSuccess}
                />;
      case UserRole.Instructor:
        return <InstructorDashboard 
                    user={currentUser} 
                    users={users} 
                    activeView={activeView} 
                    submissions={submissions}
                    announcements={announcements}
                    scheduleEvents={scheduleEvents}
                    onSaveAnnouncement={handleSaveAnnouncement}
                    onDeleteAnnouncement={handleDeleteAnnouncement}
                    onSaveSchedule={handleSaveSchedule}
                    onUpdateProfile={handleUpdateProfile}
                    theme={theme}
                    onToggleTheme={handleToggleTheme}
                />;
      case UserRole.Admin:
        return <AdminDashboard 
                    user={currentUser} 
                    users={users} 
                    activeView={activeView} 
                    onUpdateProfile={handleUpdateProfile}
                    theme={theme}
                    onToggleTheme={handleToggleTheme}
                />;
      default:
        return <div className="p-6">Dashboard not found.</div>;
    }
  };

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} onRegister={handleRegister} users={users} />;
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900 font-sans">
      <Sidebar 
        user={currentUser} 
        isSidebarOpen={isSidebarOpen} 
        onMessagesClick={openMessaging} 
        activeView={activeView}
        onNavClick={handleNavClick}
      />
      <div className={`transition-all duration-300 ease-in-out md:ml-64`}>
        <Header user={currentUser} onLogout={handleLogout} toggleSidebar={toggleSidebar} activeView={activeView} />
        <main>
          {renderDashboard()}
        </main>
      </div>
       {isSidebarOpen && <div onClick={toggleSidebar} className="fixed inset-0 bg-black opacity-50 z-10 md:hidden"></div>}
       {isMessagingOpen && <MessagingModal currentUser={currentUser} onClose={closeMessaging} users={users} messages={messages} onSendMessage={handleSendMessage} />}
    </div>
  );
};

export default App;