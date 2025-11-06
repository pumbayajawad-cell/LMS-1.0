import React, { useState } from 'react';
import { courses as initialCourses } from '../data';
import { Course, User, UserRole, Announcement, QuizSubmission, Module, Question, ScheduleEvent } from '../types';
import { BookOpen, Users, Megaphone, Edit, Trash2, Plus, Settings, ClipboardList, Calendar } from './Icons';
import CourseEditorModal from './CourseEditorModal';
import AnnouncementEditorModal from './AnnouncementEditorModal';
import QuizBuilder from './QuizBuilder';
import ScheduleEditorModal from './ScheduleEditorModal';
import SettingsView from './SettingsView';

interface InstructorDashboardProps {
  user: User;
  users: User[];
  activeView: string;
  submissions: QuizSubmission[];
  announcements: Announcement[];
  scheduleEvents: ScheduleEvent[];
  onSaveAnnouncement: (ann: Announcement | (Omit<Announcement, 'id'> & { id?: number })) => void;
  onDeleteAnnouncement: (id: number) => void;
  onSaveSchedule: (event: ScheduleEvent | (Omit<ScheduleEvent, 'id'> & { id?: number })) => void;
  onUpdateProfile: (updates: Partial<User>) => void;
  theme: string;
  onToggleTheme: () => void;
}

const InstructorDashboard: React.FC<InstructorDashboardProps> = ({ user, users, activeView, submissions, announcements, scheduleEvents, onSaveAnnouncement, onDeleteAnnouncement, onSaveSchedule, onUpdateProfile, theme, onToggleTheme }) => {
  const [managedCourses, setManagedCourses] = useState<Course[]>(initialCourses);
  const instructorCourses = managedCourses.filter(c => c.instructor.includes(user.name));
  const learners = users.filter(u => u.role === UserRole.Learner);

  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleEvent | null>(null);

  const myAnnouncements = announcements.filter(a => a.authorId === user.id);
  const myScheduleEvents = scheduleEvents.filter(e => e.instructorId === user.id)
    .sort((a,b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  const handleManageCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsCourseModalOpen(true);
  };

  const handleCreateCourse = () => {
    setSelectedCourse({
      id: 0, // Indicator for a new course
      title: '',
      subject: 'New Subject',
      instructor: user.name,
      progress: 0,
      modules: [],
    });
    setIsCourseModalOpen(true);
  };
  
  const handleSaveCourse = (updatedCourse: Course) => {
    if (updatedCourse.id === 0) { // New course
        setManagedCourses([
            ...managedCourses,
            { ...updatedCourse, id: Date.now() } // Assign a new unique ID
        ]);
    } else { // Existing course
        setManagedCourses(
            managedCourses.map(c => (c.id === updatedCourse.id ? updatedCourse : c))
        );
    }
    handleCloseCourseModal();
  }
  
  const handleDeleteCourse = (courseId: number) => {
    if (window.confirm('Are you sure you want to delete this course and all its modules?')) {
        setManagedCourses(managedCourses.filter(c => c.id !== courseId));
    }
  };

  const handleCloseCourseModal = () => {
    setIsCourseModalOpen(false);
    setSelectedCourse(null);
  };

  const handleCreateAnnouncement = () => {
    setSelectedAnnouncement(null);
    setIsAnnouncementModalOpen(true);
  };
  
  const handleEditAnnouncement = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setIsAnnouncementModalOpen(true);
  };
  
  const handleSaveNewAssessment = (courseId: number, newModule: Module) => {
    setManagedCourses(prevCourses => {
      return prevCourses.map(course => {
        if (course.id === courseId) {
          return {
            ...course,
            modules: [...course.modules, newModule],
          };
        }
        return course;
      });
    });
  };

  const handleCreateSchedule = () => {
    setSelectedSchedule(null);
    setIsScheduleModalOpen(true);
  };

  const SchedulerView = () => (
    <div className="p-6">
        <div className="bg-brand-yellow border-2 border-black rounded-lg p-4 mb-6 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center">
                <div className="bg-brand-pink p-2 rounded-md border-2 border-black mr-4">
                    <Calendar className="h-6 w-6 text-black"/>
                </div>
                <h2 className="text-3xl font-bold font-display text-black">Scheduler</h2>
            </div>
            <button onClick={handleCreateSchedule} className="flex items-center bg-brand-green text-white py-2 px-4 rounded-lg font-bold font-display border-2 border-black hover:bg-green-700 transition-colors">
                <Plus className="h-5 w-5 mr-1" />
                Create Schedule
            </button>
        </div>
        <div className="bg-cream dark:bg-gray-800 p-4 rounded-lg border-2 border-black dark:border-gray-600">
            {myScheduleEvents.length > 0 ? (
                <ul className="space-y-4">
                    {myScheduleEvents.map(event => {
                         const course = managedCourses.find(c => c.id === event.courseId);
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
                <p className="text-center text-gray-600 dark:text-gray-400 py-4">You have not scheduled any events.</p>
            )}
        </div>
    </div>
  );

  const CourseManagementView = () => (
    <div className="p-6">
        <div className="bg-brand-yellow border-2 border-black rounded-lg p-4 mb-6 flex items-center">
            <div className="bg-brand-blue p-2 rounded-md border-2 border-black mr-4">
                <BookOpen className="h-6 w-6 text-black"/>
            </div>
            <h2 className="text-3xl font-bold font-display text-black">Course Management</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {instructorCourses.map(course => (
            <div key={course.id} className="bg-cream dark:bg-gray-800 p-4 rounded-lg border-2 border-black dark:border-gray-600 flex flex-col justify-between">
                <div>
                    <h3 className="font-bold font-display text-xl text-black dark:text-cream">{course.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{course.modules.length} modules</p>
                </div>
                <div className="mt-4 flex space-x-2">
                    <button onClick={() => handleManageCourse(course)} className="font-bold font-display text-sm bg-brand-blue text-black py-2 px-3 rounded-md border-2 border-black hover:bg-blue-300 flex-grow text-center">Manage</button>
                    <button onClick={() => handleDeleteCourse(course.id)} className="text-sm bg-brand-pink text-black p-2 rounded-md border-2 border-black hover:bg-pink-300 transition-colors" title="Delete Course">
                        <Trash2 className="h-5 w-5"/>
                    </button>
                </div>
            </div>
        ))}
        <button onClick={handleCreateCourse} className="border-2 border-dashed border-black dark:border-gray-500 rounded-lg flex flex-col items-center justify-center p-4 text-black dark:text-gray-300 hover:bg-brand-yellow/50 dark:hover:bg-gray-700 hover:border-black transition-colors cursor-pointer">
            <Plus className="h-8 w-8 mb-2" />
            <span className="font-semibold font-display">Create New Course</span>
        </button>
        </div>
    </div>
  );

  const AnnouncementsView = () => (
    <div className="p-6">
        <div className="bg-brand-yellow border-2 border-black rounded-lg p-4 mb-6 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center">
                <div className="bg-brand-purple p-2 rounded-md border-2 border-black mr-4">
                    <Megaphone className="h-6 w-6 text-black"/>
                </div>
                <h2 className="text-3xl font-bold font-display text-black">My Announcements</h2>
            </div>
            <button onClick={handleCreateAnnouncement} className="flex items-center bg-brand-green text-white py-2 px-4 rounded-lg font-bold font-display border-2 border-black hover:bg-green-700 transition-colors">
                <Plus className="h-5 w-5 mr-1" />
                Create
            </button>
        </div>
        <div className="bg-cream dark:bg-gray-800 rounded-lg border-2 border-black dark:border-gray-600 p-4 space-y-3">
            {myAnnouncements.length > 0 ? myAnnouncements.map(ann => (
                <div key={ann.id} className="flex items-center justify-between p-3 bg-cream dark:bg-gray-700 border-2 border-black dark:border-gray-600 rounded-md">
                    <div>
                        <p className="font-semibold font-display text-black dark:text-cream">{ann.title}</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{ann.content.substring(0, 50)}...</p>
                    </div>
                    <div className="flex items-center space-x-3 flex-shrink-0">
                        <span className="text-xs text-gray-600 dark:text-gray-400">{ann.date}</span>
                        <button onClick={() => handleEditAnnouncement(ann)} className="text-black dark:text-gray-300 hover:text-blue-500"><Edit className="h-5 w-5" /></button>
                        <button onClick={() => onDeleteAnnouncement(ann.id)} className="text-black dark:text-gray-300 hover:text-red-500"><Trash2 className="h-5 w-5" /></button>
                    </div>
                </div>
            )) : (
                <p className="text-center text-gray-600 dark:text-gray-400 py-4">You haven't posted any announcements yet.</p>
            )}
        </div>
    </div>
  );

  const StudentProgressView = () => (
    <div className="p-6">
        <div className="bg-brand-yellow border-2 border-black rounded-lg p-4 mb-6 flex items-center">
            <div className="bg-brand-pink p-2 rounded-md border-2 border-black mr-4">
                <Users className="h-6 w-6 text-black"/>
            </div>
            <h2 className="text-3xl font-bold font-display text-black">Student Progress</h2>
        </div>
        <div className="bg-cream dark:bg-gray-800 rounded-lg border-2 border-black dark:border-gray-600 overflow-x-auto">
        <table className="w-full text-left">
            <thead>
            <tr className="border-b-2 border-black dark:border-gray-600">
                <th className="p-3 font-display text-black dark:text-cream">Student</th>
                <th className="p-3 font-display text-black dark:text-cream">Course</th>
                <th className="p-3 font-display text-black dark:text-cream">Progress</th>
                <th className="p-3 font-display text-black dark:text-cream">Modules Completed</th>
            </tr>
            </thead>
            <tbody>
            {learners.slice(0, 5).map(student => {
                const course = managedCourses[learners.indexOf(student) % managedCourses.length] || instructorCourses[0];
                if (!course) return null;
                return (
                    <tr key={student.id} className="border-b-2 border-black dark:border-gray-600 last:border-b-0 hover:bg-gray-200 dark:hover:bg-gray-700">
                        <td className="p-3">
                        <div className="flex items-center">
                            <img src={student.avatar} alt={student.name} className="w-8 h-8 rounded-full mr-3 border-2 border-black dark:border-gray-600"/>
                            <span className="text-black dark:text-cream">{student.name}</span>
                        </div>
                        </td>
                        <td className="p-3 text-gray-700 dark:text-gray-300">{course.title}</td>
                        <td className="p-3">
                        <div className="flex items-center">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 border-2 border-black dark:border-gray-600 mr-2">
                                <div className="bg-brand-green h-full rounded-full" style={{ width: `${course.progress}%` }}></div>
                            </div>
                            <span className="text-sm font-medium text-black dark:text-cream">{course.progress}%</span>
                        </div>
                        </td>
                        <td className="p-3 text-sm text-gray-700 dark:text-gray-300">
                        {course.modules.filter(m => m.completed).length} / {course.modules.length}
                        </td>
                    </tr>
                );
            })}
            </tbody>
        </table>
        </div>
    </div>
  );

  const AssessmentsView = () => {
    const [viewingResultsFor, setViewingResultsFor] = useState<Module | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newAssessmentTitle, setNewAssessmentTitle] = useState('');
    const [newAssessmentCourseId, setNewAssessmentCourseId] = useState<number | null>(instructorCourses[0]?.id || null);
    const [newAssessmentDuration, setNewAssessmentDuration] = useState('');
    const [newAssessmentQuestions, setNewAssessmentQuestions] = useState<Question[]>([]);

    const assessments = instructorCourses.flatMap(course => 
      course.modules.filter(m => m.type === 'Quiz').map(m => ({ ...m, courseTitle: course.title, courseId: course.id }))
    );

    const handleCreateNewAssessment = () => {
      if (!newAssessmentCourseId || !newAssessmentTitle || !newAssessmentDuration || newAssessmentQuestions.length === 0) {
        alert("Please fill all fields and add at least one question.");
        return;
      }
      const newModule: Module = {
        id: Date.now(),
        title: newAssessmentTitle,
        type: 'Quiz',
        completed: false,
        duration: parseInt(newAssessmentDuration, 10),
        questions: newAssessmentQuestions,
      };
      handleSaveNewAssessment(newAssessmentCourseId, newModule);
      setShowCreateForm(false);
      // Reset form
      setNewAssessmentTitle('');
      setNewAssessmentCourseId(instructorCourses[0]?.id || null);
      setNewAssessmentDuration('');
      setNewAssessmentQuestions([]);
    };


    if (viewingResultsFor) {
      const results = submissions.filter(s => s.moduleId === viewingResultsFor.id);
      const course = instructorCourses.find(c => c.modules.some(m => m.id === viewingResultsFor.id));
      
      return (
        <div className="p-6">
          <button onClick={() => setViewingResultsFor(null)} className="text-black dark:text-cream font-semibold mb-4 hover:underline">&larr; Back to Assessments</button>
          <h2 className="text-2xl font-bold font-display text-black dark:text-cream">Results for: <span className="text-brand-green">{viewingResultsFor.title}</span></h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Course: {course?.title}</p>
           <div className="bg-cream dark:bg-gray-800 rounded-lg border-2 border-black dark:border-gray-600 overflow-x-auto">
              <table className="w-full text-left">
                  <thead>
                      <tr className="border-b-2 border-black dark:border-gray-600">
                          <th className="p-3 font-display text-black dark:text-cream">Student</th>
                          <th className="p-3 font-display text-black dark:text-cream">Score</th>
                          <th className="p-3 font-display text-black dark:text-cream">Percentage</th>
                          <th className="p-3 font-display text-black dark:text-cream">Date Taken</th>
                      </tr>
                  </thead>
                  <tbody>
                      {results.length > 0 ? results.map(sub => {
                          const student = users.find(u => u.id === sub.studentId);
                          return (
                              <tr key={sub.id} className="border-b-2 border-black dark:border-gray-600 last:border-b-0 hover:bg-gray-200 dark:hover:bg-gray-700">
                                  <td className="p-3">
                                      <div className="flex items-center">
                                          <img src={student?.avatar} alt={student?.name} className="w-8 h-8 rounded-full mr-3 border-2 border-black dark:border-gray-600" />
                                          <span className="text-black dark:text-cream">{student?.name || 'Unknown Student'}</span>
                                      </div>
                                  </td>
                                  <td className="p-3 font-medium text-black dark:text-cream">{sub.score} / {sub.totalQuestions}</td>
                                  <td className="p-3 font-medium text-brand-green">{((sub.score / sub.totalQuestions) * 100).toFixed(0)}%</td>
                                  <td className="p-3 text-sm text-gray-600 dark:text-gray-400">{new Date(sub.timestamp).toLocaleString()}</td>
                              </tr>
                          )
                      }) : (
                        <tr><td colSpan={4} className="text-center p-4 text-gray-600 dark:text-gray-400">No submissions yet for this assessment.</td></tr>
                      )}
                  </tbody>
              </table>
           </div>
        </div>
      );
    }
    
    if (showCreateForm) {
      return (
        <div className="p-6">
           <button onClick={() => setShowCreateForm(false)} className="text-black dark:text-cream font-semibold mb-4 hover:underline">&larr; Back to Assessments</button>
          <h2 className="text-2xl font-bold font-display text-black dark:text-cream mb-4">Create New Assessment</h2>
          <div className="bg-cream dark:bg-gray-800 p-6 rounded-lg border-2 border-black dark:border-gray-600 space-y-4">
              <div>
                <label className="block text-sm font-medium text-black dark:text-cream mb-1">Course</label>
                <select 
                  value={newAssessmentCourseId || ''} 
                  onChange={e => setNewAssessmentCourseId(Number(e.target.value))}
                  className="w-full p-2 border-2 border-black dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-cream"
                >
                  {instructorCourses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
              <input type="text" placeholder="Assessment Title" value={newAssessmentTitle} onChange={e => setNewAssessmentTitle(e.target.value)} className="w-full p-2 border-2 border-black dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-cream" />
              <input type="number" placeholder="Duration (minutes)" value={newAssessmentDuration} onChange={e => setNewAssessmentDuration(e.target.value)} className="w-full p-2 border-2 border-black dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-cream" />
              <QuizBuilder value={newAssessmentQuestions} onChange={setNewAssessmentQuestions} />
              <div className="flex justify-end space-x-2">
                 <button onClick={() => setShowCreateForm(false)} className="bg-gray-200 dark:bg-gray-600 text-black dark:text-cream py-2 px-4 rounded-lg font-bold font-display border-2 border-black dark:border-gray-500 hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                 <button onClick={handleCreateNewAssessment} className="bg-brand-green text-white py-2 px-4 rounded-lg font-bold font-display border-2 border-black hover:bg-green-700">Save Assessment</button>
              </div>
          </div>
        </div>
      );
    }

    return (
       <div className="p-6">
        <div className="bg-brand-yellow border-2 border-black rounded-lg p-4 mb-6 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center">
                <div className="bg-brand-purple p-2 rounded-md border-2 border-black mr-4">
                    <ClipboardList className="h-6 w-6 text-black"/>
                </div>
                <h2 className="text-3xl font-bold font-display text-black">Assessments</h2>
            </div>
             <button onClick={() => setShowCreateForm(true)} className="flex items-center bg-brand-green text-white py-2 px-4 rounded-lg font-bold font-display border-2 border-black hover:bg-green-700 transition-colors">
                <Plus className="h-5 w-5 mr-1" />
                Create New Assessment
            </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assessments.map(quiz => (
                <div key={quiz.id} className="bg-cream dark:bg-gray-800 p-4 rounded-lg border-2 border-black dark:border-gray-600 flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold font-display text-xl text-black dark:text-cream">{quiz.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Course: {quiz.courseTitle}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{quiz.questions?.length || 0} Questions</p>
                    </div>
                    <button onClick={() => setViewingResultsFor(quiz)} className="mt-4 text-sm font-bold font-display bg-brand-blue text-black py-2 px-3 rounded-md border-2 border-black hover:bg-blue-300 text-center">
                      View Results
                    </button>
                </div>
            ))}
        </div>
    </div>
    );
  };

  const renderContent = () => {
    switch (activeView) {
        case 'dashboard':
            return (
                <div className="p-6 space-y-8 bg-brand-green dark:bg-gray-900">
                    <CourseManagementView />
                    <SchedulerView />
                    <AnnouncementsView />
                    <StudentProgressView />
                </div>
            );
        case 'course-management':
            return <CourseManagementView />;
        case 'scheduler':
            return <SchedulerView />;
        case 'assessments':
            return <AssessmentsView />;
        case 'students':
            return <StudentProgressView />;
         case 'settings':
            return <SettingsView user={user} onUpdateProfile={onUpdateProfile} theme={theme} onToggleTheme={onToggleTheme} />;
        default:
             return (
                <div className="p-6 space-y-8 bg-brand-green dark:bg-gray-900">
                    <CourseManagementView />
                    <SchedulerView />
                    <AnnouncementsView />
                    <StudentProgressView />
                </div>
            );
    }
  };

  return (
    <>
      {renderContent()}
      
      {isCourseModalOpen && selectedCourse && (
        <CourseEditorModal
          course={selectedCourse}
          onClose={handleCloseCourseModal}
          onSave={handleSaveCourse}
        />
      )}
      {isAnnouncementModalOpen && (
        <AnnouncementEditorModal
          announcement={selectedAnnouncement}
          user={user}
          onClose={() => {
            setIsAnnouncementModalOpen(false);
            setSelectedAnnouncement(null);
          }}
          onSave={onSaveAnnouncement}
        />
      )}
      {isScheduleModalOpen && (
        <ScheduleEditorModal
            schedule={selectedSchedule}
            user={user}
            instructorCourses={instructorCourses}
            onClose={() => setIsScheduleModalOpen(false)}
            onSave={(event) => {
                onSaveSchedule(event);
                setIsScheduleModalOpen(false);
            }}
        />
      )}
    </>
  );
};

export default InstructorDashboard;