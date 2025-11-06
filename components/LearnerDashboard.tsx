import React, { useState, useCallback } from 'react';
import { courses, leaderboardData } from '../data';
import { Course, Announcement, LeaderboardUser, Module, User, QuizSubmission, ScheduleEvent, Transaction } from '../types';
import { Trophy, BookOpen, Megaphone, FileText, Film, Presentation, ClipboardList, Settings, Search, Calendar, GraduationCap, CreditCard, X } from './Icons';
import QuizTakerModal from './QuizTakerModal';
import SettingsView from './SettingsView';

interface LearnerDashboardProps {
  user: User;
  users: User[];
  activeView: string;
  onQuizSubmit: (submission: Omit<QuizSubmission, 'id' | 'timestamp' | 'studentId'>) => void;
  scheduleEvents: ScheduleEvent[];
  announcements: Announcement[];
  submissions: QuizSubmission[];
  onUpdateProfile: (updates: Partial<User>) => void;
  theme: string;
  onToggleTheme: () => void;
  transactions: Transaction[];
  onPaymentSuccess: (transactionId: number) => void;
}

const progressColors = ['bg-brand-green', 'bg-brand-blue', 'bg-brand-pink', 'bg-brand-yellow', 'bg-brand-purple'];

const LearnerDashboard: React.FC<LearnerDashboardProps> = ({ user, users, activeView, onQuizSubmit, scheduleEvents, announcements: allAnnouncements, submissions, onUpdateProfile, theme, onToggleTheme, transactions, onPaymentSuccess }) => {
  const [takingQuiz, setTakingQuiz] = useState<Module | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [payingTransaction, setPayingTransaction] = useState<Transaction | null>(null);

  const learnerCourseIds = courses.map(c => c.id); // In a real app, this would be user-specific
  const announcements = allAnnouncements.filter(
    ann => !ann.courseId || learnerCourseIds.includes(ann.courseId)
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleQuizSubmit = (result: Omit<QuizSubmission, 'id' | 'timestamp' | 'studentId'>) => {
    onQuizSubmit(result);
    // Here you could show a confirmation message to the user
    console.log("Quiz submitted!", result);
  };

  const renderModuleIcon = useCallback((type: Module['type']) => {
    const className = "h-5 w-5 text-black";
    switch (type) {
      case 'PDF': return <div className="p-1 bg-brand-pink border border-black rounded-sm"><FileText className={className} /></div>;
      case 'Video': return <div className="p-1 bg-brand-blue border border-black rounded-sm"><Film className={className} /></div>;
      case 'PPT': return <div className="p-1 bg-brand-yellow border border-black rounded-sm"><Presentation className={className} /></div>;
      case 'Quiz': return <div className="p-1 bg-brand-purple border border-black rounded-sm"><ClipboardList className={className} /></div>;
      default: return null;
    }
  }, []);

  const CourseCard: React.FC<{ course: Course }> = ({ course }) => (
    <div className="bg-cream dark:bg-gray-800 p-4 rounded-lg border-2 border-black dark:border-gray-600 flex flex-col">
      <img src={`https://picsum.photos/seed/${course.id}/400/200`} alt={course.title} className="w-full h-32 object-cover rounded-md mb-4 border-2 border-black dark:border-gray-600"/>
      <div className="flex-grow">
        <h3 className="font-bold font-display text-xl text-black dark:text-cream">{course.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{course.instructor}</p>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 border-2 border-black dark:border-gray-600">
          <div className={`${progressColors[course.id % progressColors.length]} h-full rounded-full`} style={{ width: `${course.progress}%` }}></div>
        </div>
        <p className="text-right text-xs text-gray-600 dark:text-gray-400 mt-1">{course.progress}% Complete</p>
      </div>
      <div className="mt-4 border-t-2 border-black dark:border-gray-600 pt-3">
        <h4 className="font-semibold text-lg font-display mb-2 text-black dark:text-cream">Modules</h4>
        <ul className="space-y-2">
            {course.modules.map(module => (
                <li key={module.id}>
                    <button 
                        onClick={() => module.type === 'Quiz' && setTakingQuiz(module)}
                        disabled={module.type !== 'Quiz'}
                        className="w-full text-left flex items-center p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {renderModuleIcon(module.type)}
                        <span className="ml-2 font-medium text-black dark:text-cream flex-grow">{module.title}</span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">{module.duration} min</span>
                    </button>
                </li>
            ))}
        </ul>
      </div>
    </div>
  );
  
  const CoursesView = () => {
    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );
      
    return (
        <div className="p-6">
            <div className="bg-brand-yellow border-2 border-black rounded-lg p-4 mb-6 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center">
                    <div className="bg-brand-pink p-2 rounded-md border-2 border-black mr-4">
                        <BookOpen className="h-6 w-6 text-black"/>
                    </div>
                    <h2 className="text-3xl font-bold font-display text-black">My Courses</h2>
                </div>
                <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full sm:w-64 pl-10 pr-4 py-2 border-2 border-black dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-yellow bg-cream dark:bg-gray-700 text-black dark:text-cream"
                    />
                </div>
            </div>

            {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredCourses.map(course => <CourseCard key={course.id} course={course} />)}
                </div>
            ) : (
                <div className="text-center py-10 text-gray-600 dark:text-gray-400 col-span-full">
                    <p className="font-semibold text-lg">No courses found</p>
                    <p>Try adjusting your search query.</p>
                </div>
            )}
        </div>
    );
  };

  const AnnouncementItem: React.FC<{ announcement: Announcement }> = ({ announcement }) => {
    const author = users.find(u => u.id === announcement.authorId);
    return (
        <div className="bg-cream dark:bg-gray-800 p-4 rounded-lg border-2 border-black dark:border-gray-600">
            <p className="font-bold font-display text-black dark:text-cream">{announcement.title}</p>
            <p className="text-sm text-gray-800 dark:text-gray-300 mt-1">{announcement.content}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 text-right mt-2">- {author?.name || 'System'}</p>
        </div>
    );
  };
  
  const AnnouncementsView = () => (
    <div className="p-6">
        <div className="bg-brand-yellow border-2 border-black rounded-lg p-4 mb-6 flex items-center">
             <div className="bg-brand-purple p-2 rounded-md border-2 border-black mr-4">
                <Megaphone className="h-6 w-6 text-black"/>
            </div>
            <h2 className="text-3xl font-bold font-display text-black">Announcements</h2>
        </div>

        <div className="bg-brand-purple p-4 rounded-lg border-2 border-black">
            <div className="space-y-4 max-w-2xl mx-auto">
                {announcements.map(ann => <AnnouncementItem key={ann.id} announcement={ann} />)}
            </div>
        </div>
    </div>
  );
  
  const LeaderboardItem: React.FC<{ user: LeaderboardUser, rank: number }> = ({ user, rank }) => (
      <li className="flex items-center justify-between p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
          <div className="flex items-center">
              <span className="text-lg font-bold text-gray-500 dark:text-gray-400 w-6">{rank}</span>
              <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full ml-4 mr-3 border-2 border-black dark:border-gray-600" />
              <span className="font-medium text-black dark:text-cream">{user.name}</span>
          </div>
          <span className="font-bold text-brand-green font-display">{user.points} pts</span>
      </li>
  );
  
  const LeaderboardView = () => (
    <div className="p-6">
        <div className="bg-brand-yellow border-2 border-black rounded-lg p-4 mb-6 flex items-center">
             <div className="bg-brand-pink p-2 rounded-md border-2 border-black mr-4">
                <Trophy className="h-6 w-6 text-black"/>
            </div>
            <h2 className="text-3xl font-bold font-display text-black">Leaderboard</h2>
        </div>
      <div className="bg-cream dark:bg-gray-800 p-4 rounded-lg border-2 border-black dark:border-gray-600 max-w-md mx-auto">
        <ul className="space-y-2">
          {leaderboardData.map((user, index) => <LeaderboardItem key={user.id} user={user} rank={index + 1}/>)}
        </ul>
      </div>
    </div>
  );

  const ScheduleView = () => {
    const mySchedule = scheduleEvents
        .filter(event => learnerCourseIds.includes(event.courseId))
        .sort((a,b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    
    return (
        <div className="p-6">
            <div className="bg-brand-yellow border-2 border-black rounded-lg p-4 mb-6 flex items-center">
                <div className="bg-brand-blue p-2 rounded-md border-2 border-black mr-4">
                    <Calendar className="h-6 w-6 text-black"/>
                </div>
                <h2 className="text-3xl font-bold font-display text-black">My Schedule</h2>
            </div>
            <div className="bg-cream dark:bg-gray-800 p-4 rounded-lg border-2 border-black dark:border-gray-600 max-w-2xl mx-auto">
                {mySchedule.length > 0 ? (
                    <ul className="space-y-4">
                        {mySchedule.map(event => {
                             const course = courses.find(c => c.id === event.courseId);
                             return (
                                <li key={event.id} className={`p-4 rounded-lg border-2 border-black ${event.type === 'Exam' ? 'bg-brand-pink' : 'bg-brand-purple'}`}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className={`font-bold font-display text-black`}>{event.title}</p>
                                            <p className="text-sm text-gray-800 font-medium">{course?.title}</p>
                                        </div>
                                        <span className={`text-xs font-semibold px-2 py-1 rounded-md border border-black bg-cream text-black`}>{event.type}</span>
                                    </div>
                                    <p className="text-sm text-black mt-2">{new Date(event.startTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })} - {new Date(event.endTime).toLocaleTimeString([], { timeStyle: 'short' })}</p>
                                    <p className="text-sm text-gray-800 mt-1">{event.description}</p>
                                </li>
                             )
                        })}
                    </ul>
                ) : (
                    <p className="text-center text-gray-600 dark:text-gray-400 py-4">You have no upcoming scheduled events.</p>
                )}
            </div>
        </div>
    )
  };

  const AssessmentsView = () => {
    const myAssessments = courses
        .filter(c => learnerCourseIds.includes(c.id))
        .flatMap(course => 
            course.modules
                .filter(module => module.type === 'Quiz')
                .map(module => ({ ...module, courseTitle: course.title, courseId: course.id }))
        );

    return (
        <div className="p-6">
            <div className="bg-brand-yellow border-2 border-black rounded-lg p-4 mb-6 flex items-center">
                <div className="bg-brand-purple p-2 rounded-md border-2 border-black mr-4">
                    <ClipboardList className="h-6 w-6 text-black"/>
                </div>
                <h2 className="text-3xl font-bold font-display text-black">My Assessments</h2>
            </div>
            {myAssessments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myAssessments.map(quizModule => {
                        const lastSubmission = submissions
                            .filter(s => s.moduleId === quizModule.id && s.studentId === user.id)
                            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
                        
                        return (
                            <div key={quizModule.id} className="bg-cream dark:bg-gray-800 p-4 rounded-lg border-2 border-black dark:border-gray-600 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-bold font-display text-xl text-black dark:text-cream">{quizModule.title}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{quizModule.courseTitle}</p>
                                    <p className="text-xs text-gray-700 dark:text-gray-300">{quizModule.questions?.length || 0} Questions • {quizModule.duration} min</p>
                                </div>
                                <div className="mt-4">
                                    {lastSubmission && (
                                        <div className="mb-3 text-sm p-2 bg-brand-purple/30 rounded-md border border-black dark:border-gray-600">
                                            <p className="font-semibold text-black dark:text-cream">Last Score: {lastSubmission.score}/{lastSubmission.totalQuestions} ({Math.round((lastSubmission.score / lastSubmission.totalQuestions) * 100)}%)</p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Taken on: {new Date(lastSubmission.timestamp).toLocaleDateString()}</p>
                                        </div>
                                    )}
                                    <button 
                                        onClick={() => setTakingQuiz(quizModule)} 
                                        className="w-full bg-brand-blue text-black py-2 px-3 rounded-md border-2 border-black hover:bg-blue-300 text-center font-bold font-display transition-colors"
                                    >
                                        {lastSubmission ? 'Retake Quiz' : 'Take Quiz'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-10 text-gray-600 dark:text-gray-400">
                    <p className="font-semibold text-lg">No assessments found</p>
                    <p>Your instructors have not assigned any quizzes or exams yet.</p>
                </div>
            )}
        </div>
    );
  };
  
  const GradesView = () => {
    const courseGrades = courses.map(course => {
      const courseQuizModules = course.modules.filter(m => m.type === 'Quiz');
      const courseSubmissions = submissions.filter(sub => 
        sub.studentId === user.id && courseQuizModules.some(m => m.id === sub.moduleId)
      );

      if (courseSubmissions.length === 0) {
        return { course, average: null, submissions: [] };
      }

      const totalPercentage = courseSubmissions.reduce((acc, sub) => {
        return acc + (sub.score / sub.totalQuestions) * 100;
      }, 0);
      
      const average = totalPercentage / courseSubmissions.length;

      const detailedSubmissions = courseSubmissions.map(sub => {
        const module = course.modules.find(m => m.id === sub.moduleId);
        return { ...sub, moduleTitle: module?.title || 'Unknown Quiz' };
      });
      
      return { course, average, submissions: detailedSubmissions };
    });

    const overallAverage = courseGrades.reduce((acc, grade) => {
        return grade.average !== null ? acc + grade.average : acc;
    }, 0) / (courseGrades.filter(g => g.average !== null).length || 1);

    const getGradeColor = (grade: number | null) => {
        if (grade === null) return 'text-black dark:text-cream';
        if (grade >= 80) return 'text-brand-green';
        if (grade >= 60) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <div className="p-6">
            <div className="bg-brand-yellow border-2 border-black rounded-lg p-4 mb-6 flex items-center">
                <div className="bg-brand-green p-2 rounded-md border-2 border-black mr-4">
                    <GraduationCap className="h-7 w-7 text-black"/>
                </div>
                <h2 className="text-3xl font-bold font-display text-black">My Grades</h2>
            </div>
            
            <div className="bg-cream dark:bg-gray-800 p-6 rounded-lg border-2 border-black dark:border-gray-600 mb-6">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Overall Performance</h3>
                <p className={`text-5xl font-bold font-display ${getGradeColor(overallAverage)}`}>
                    {overallAverage > 0 ? `${overallAverage.toFixed(1)}%` : 'N/A'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Average score across all courses.</p>
            </div>
            
            <div className="space-y-6">
                {courseGrades.map(({ course, average, submissions: courseSubmissions }) => (
                    <div key={course.id} className="bg-cream dark:bg-gray-800 p-5 rounded-lg border-2 border-black dark:border-gray-600">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-xl font-bold font-display text-black dark:text-cream">{course.title}</h4>
                            <div className="text-right">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Course Average</p>
                                <p className={`text-2xl font-bold font-display ${getGradeColor(average)}`}>
                                    {average !== null ? `${average.toFixed(1)}%` : 'N/A'}
                                </p>
                            </div>
                        </div>
                        {courseSubmissions.length > 0 ? (
                            <ul className="divide-y-2 divide-black dark:divide-gray-600">
                                {courseSubmissions.map(sub => (
                                    <li key={sub.id} className="py-3 flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold text-black dark:text-cream">{sub.moduleTitle}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Completed: {new Date(sub.timestamp).toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-black dark:text-cream">{sub.score}/{sub.totalQuestions}</p>
                                            <span className="text-xs font-medium bg-brand-purple text-black px-2 py-1 rounded border border-black">
                                                {((sub.score / sub.totalQuestions) * 100).toFixed(0)}%
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center text-gray-600 dark:text-gray-400 py-4">No graded assessments completed for this course yet.</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
  };
  
  const PaymentModal: React.FC<{ transaction: Transaction; onClose: () => void; onSuccess: (id: number) => void; }> = ({ transaction, onClose, onSuccess }) => {
    const [activeTab, setActiveTab] = useState<'card' | 'gcash'>('card');
    const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '', name: '' });
    const [isProcessing, setIsProcessing] = useState(false);
    
    const isCardFormValid = cardDetails.number.length === 16 && cardDetails.expiry.length === 5 && cardDetails.cvc.length === 3 && cardDetails.name.trim() !== '';

    const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let { name, value } = e.target;
      if (name === 'number' && value.length > 16) value = value.slice(0, 16);
      if (name === 'cvc' && value.length > 3) value = value.slice(0, 3);
      if (name === 'expiry' && value.length === 2 && cardDetails.expiry.length < 3) value += '/';
      if (name === 'expiry' && value.length > 5) value = value.slice(0, 5);

      setCardDetails(prev => ({ ...prev, [name]: value }));
    };

    const handlePay = () => {
      setIsProcessing(true);
      // Simulate API call
      setTimeout(() => {
        setIsProcessing(false);
        onSuccess(transaction.id);
        onClose();
      }, 2000);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4">
        <div className="bg-cream dark:bg-gray-800 rounded-lg shadow-xl border-2 border-black dark:border-gray-600 w-full max-w-md flex flex-col">
          <header className="p-4 border-b-2 border-black dark:border-gray-600 flex justify-between items-center bg-brand-yellow">
            <h2 className="text-xl font-bold font-display text-black">Complete Payment</h2>
            <button onClick={onClose} className="text-black hover:text-gray-600" disabled={isProcessing}>
              <X className="h-6 w-6" />
            </button>
          </header>

          <main className="p-6">
            <div className="text-center mb-4">
              <p className="text-gray-700 dark:text-gray-300">You are paying for:</p>
              <p className="font-semibold text-lg text-black dark:text-cream">{transaction.description}</p>
              <p className="font-bold font-display text-3xl text-brand-green">₱{transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div className="flex border-b-2 border-black dark:border-gray-600 mb-4">
              <button onClick={() => setActiveTab('card')} className={`flex-1 py-2 font-bold font-display ${activeTab === 'card' ? 'border-b-4 border-brand-green text-black dark:text-cream' : 'text-gray-600 dark:text-gray-400'}`}>Credit/Debit Card</button>
              <button onClick={() => setActiveTab('gcash')} className={`flex-1 py-2 font-bold font-display ${activeTab === 'gcash' ? 'border-b-4 border-brand-green text-black dark:text-cream' : 'text-gray-600 dark:text-gray-400'}`}>GCash</button>
            </div>
            {activeTab === 'card' ? (
              <div className="space-y-3">
                <input type="number" name="number" placeholder="Card Number (16 digits)" value={cardDetails.number} onChange={handleCardInputChange} className="w-full p-2 border-2 border-black dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-cream" />
                <div className="flex gap-3">
                  <input type="text" name="expiry" placeholder="MM/YY" value={cardDetails.expiry} onChange={handleCardInputChange} className="w-1/2 p-2 border-2 border-black dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-cream" />
                  <input type="number" name="cvc" placeholder="CVC" value={cardDetails.cvc} onChange={handleCardInputChange} className="w-1/2 p-2 border-2 border-black dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-cream" />
                </div>
                <input type="text" name="name" placeholder="Name on Card" value={cardDetails.name} onChange={handleCardInputChange} className="w-full p-2 border-2 border-black dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-cream" />
              </div>
            ) : (
              <div className="text-center">
                 <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Scan the QR code with your GCash app to pay.</p>
                 <svg className="w-48 h-48 mx-auto border-2 border-black p-2 bg-white" viewBox="0 0 200 200"><path fill="#000" d="M0 0h60v60H0zm140 0h60v60h-60zm-140 140h60v60H0z M20 20h20v20H20z m140 0h20v20h-20zm-140 140h20v20H20zm140-100h20v20h-20z m-40-40h20v20h-20zm-20 20h20v20h-20z M60 60h20v20H60z m20 20h20v20H80z m20-20h20v20h-20z m20 20h20v20h-20zm-40 40h20v20H80zm20 20h20v20h-20zm-60 20h20v20H40z m20 20h20v20H60z m80-80h20v20h-20z m20 20h20v20h-20z M40 100h20v20H40z m80 40h20v20h-20z m20 20h20v20h-20z M80 20h20v20H80z" /></svg>
                 <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Merchant: Learning Module System<br />Amount: ₱{transaction.amount.toLocaleString()}</p>
              </div>
            )}
          </main>
          <footer className="p-4 border-t-2 border-black dark:border-gray-600 bg-gray-100 dark:bg-gray-900 rounded-b-lg">
             <button
                onClick={handlePay}
                disabled={(activeTab === 'card' && !isCardFormValid) || isProcessing}
                className="w-full bg-brand-green text-white py-3 px-4 rounded-lg font-bold font-display border-2 border-black hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : `Pay ₱${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </button>
          </footer>
        </div>
      </div>
    );
  };
  
  const BillingView = () => {
    const unpaidTransactions = transactions.filter(t => t.status === 'Unpaid');
    const totalOutstanding = unpaidTransactions.reduce((sum, t) => sum + t.amount, 0);

    return (
      <div className="p-6">
        <div className="bg-brand-yellow border-2 border-black rounded-lg p-4 mb-6 flex items-center">
            <div className="bg-brand-green p-2 rounded-md border-2 border-black mr-4">
                <CreditCard className="h-7 w-7 text-black"/>
            </div>
            <h2 className="text-3xl font-bold font-display text-black">Billing & Payments</h2>
        </div>
        
        <div className="bg-cream dark:bg-gray-800 p-6 rounded-lg border-2 border-black dark:border-gray-600 mb-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Outstanding Balance</h3>
            <p className={`text-5xl font-bold font-display ${totalOutstanding > 0 ? 'text-red-500' : 'text-brand-green'}`}>
                ₱{totalOutstanding.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total amount due for payment.</p>
        </div>
        
        <div className="bg-cream dark:bg-gray-800 p-5 rounded-lg border-2 border-black dark:border-gray-600">
            <h4 className="text-xl font-bold font-display text-black dark:text-cream mb-4">Transaction History</h4>
            <ul className="divide-y-2 divide-black dark:divide-gray-600">
                {transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(t => (
                    <li key={t.id} className="py-3 flex justify-between items-center flex-wrap gap-2">
                        <div>
                            <p className="font-semibold text-black dark:text-cream">{t.description}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Date: {new Date(t.date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                           <p className="font-semibold text-lg text-black dark:text-cream">₱{t.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                           {t.status === 'Unpaid' ? (
                             <button onClick={() => setPayingTransaction(t)} className="text-sm font-bold bg-brand-pink text-black px-3 py-1 rounded border-2 border-black hover:bg-pink-300 transition-colors">
                                Pay Now
                             </button>
                           ) : (
                              <span className="text-sm font-medium bg-brand-green text-white px-2 py-1 rounded border border-black">
                                Paid
                              </span>
                           )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
      </div>
    );
  };


  const renderContent = () => {
    switch (activeView) {
        case 'dashboard':
            return (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 bg-brand-green dark:bg-gray-900">
                    <div className="lg:col-span-2 space-y-6">
                        <CoursesView />
                    </div>
                    <div className="lg:col-span-1 space-y-6">
                       <AnnouncementsView />
                       <LeaderboardView />
                    </div>
                </div>
            );
        case 'courses':
            return <CoursesView />;
        case 'schedule':
            return <ScheduleView />;
        case 'billing':
            return <BillingView />;
        case 'assessments':
            return <AssessmentsView />;
        case 'grades':
            return <GradesView />;
        case 'announcements':
            return <AnnouncementsView />;
        case 'settings':
            return <SettingsView user={user} onUpdateProfile={onUpdateProfile} theme={theme} onToggleTheme={onToggleTheme} />;
        default:
            return <p>View not found.</p>;
    }
  }

  return (
    <>
      {renderContent()}
      {takingQuiz && (
        <QuizTakerModal
            module={takingQuiz}
            onClose={() => setTakingQuiz(null)}
            onSubmit={handleQuizSubmit}
        />
      )}
      {payingTransaction && (
        <PaymentModal
            transaction={payingTransaction}
            onClose={() => setPayingTransaction(null)}
            onSuccess={onPaymentSuccess}
        />
      )}
    </>
  );
};

export default LearnerDashboard;