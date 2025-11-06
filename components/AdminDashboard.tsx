import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { courses, announcements as initialAnnouncements, analyticsData } from '../data';
import { User, UserRole, Announcement } from '../types';
import DashboardCard from './DashboardCard';
import { Users, BookOpen, BarChart as BarChartIcon, Edit, Trash2, Plus, Megaphone, Settings } from './Icons';
import AnnouncementEditorModal from './AnnouncementEditorModal';
import SettingsView from './SettingsView';

interface AdminDashboardProps {
  user: User;
  users: User[];
  activeView: string;
  onUpdateProfile: (updates: Partial<User>) => void;
  theme: string;
  onToggleTheme: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, users, activeView, onUpdateProfile, theme, onToggleTheme }) => {
    const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
    const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

    const handleCreateAnnouncement = () => {
        setSelectedAnnouncement(null);
        setIsAnnouncementModalOpen(true);
    };
    
    const handleEditAnnouncement = (announcement: Announcement) => {
        setSelectedAnnouncement(announcement);
        setIsAnnouncementModalOpen(true);
    };

    const handleDeleteAnnouncement = (id: number) => {
        setAnnouncements(announcements.filter(a => a.id !== id));
    };
    
    const handleSaveAnnouncement = (ann: Announcement) => {
        if (selectedAnnouncement) { // Editing
            setAnnouncements(announcements.map(a => a.id === ann.id ? ann : a));
        } else { // Creating
            setAnnouncements([...announcements, { ...ann, id: Date.now() }]);
        }
        setIsAnnouncementModalOpen(false);
        setSelectedAnnouncement(null);
    };
    
    const getUserName = (id: number) => users.find(u => u.id === id)?.name || 'Unknown';
    const getCourseName = (id: number) => courses.find(c => c.id === id)?.title || 'Unknown';

    const AnalyticsView = () => (
        <div className="p-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DashboardCard icon={<Users />} title="Total Users" value={users.length.toString()} description="+2 this week" color="blue" />
                <DashboardCard icon={<BookOpen />} title="Total Courses" value={courses.length.toString()} description="1 new course" color="pink" />
                <DashboardCard icon={<BarChartIcon />} title="Active Learners" value={users.filter(u => u.role === UserRole.Learner).length.toString()} description={`${Math.round((users.filter(u => u.role === UserRole.Learner).length / users.length) * 100)}% of users`} color="green"/>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-cream dark:bg-gray-800 p-6 rounded-lg border-2 border-black dark:border-gray-600">
                    <h3 className="font-bold font-display text-lg text-black dark:text-cream mb-4">User Activity (Last 7 Days)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analyticsData.userActivity}>
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                            <XAxis dataKey="name" tick={{ fill: theme === 'dark' ? '#FAF8E9' : '#000' }} />
                            <YAxis tick={{ fill: theme === 'dark' ? '#FAF8E9' : '#000' }} />
                            <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#374151' : '#FAF8E9', border: '2px solid #000', color: theme === 'dark' ? '#FAF8E9' : '#000' }} />
                            <Legend wrapperStyle={{ color: theme === 'dark' ? '#FAF8E9' : '#000' }} />
                            <Bar dataKey="Learners" fill="#34A65F" />
                            <Bar dataKey="Instructors" fill="#86D2F9" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-cream dark:bg-gray-800 p-6 rounded-lg border-2 border-black dark:border-gray-600">
                    <h3 className="font-bold font-display text-lg text-black dark:text-cream mb-4">Module Completions (This Year)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={analyticsData.moduleCompletions}>
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                            <XAxis dataKey="name" tick={{ fill: theme === 'dark' ? '#FAF8E9' : '#000' }} />
                            <YAxis tick={{ fill: theme === 'dark' ? '#FAF8E9' : '#000' }} />
                            <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#374151' : '#FAF8E9', border: '2px solid #000', color: theme === 'dark' ? '#FAF8E9' : '#000' }} />
                            <Legend wrapperStyle={{ color: theme === 'dark' ? '#FAF8E9' : '#000' }} />
                            <Line type="monotone" dataKey="completions" stroke="#A996E2" strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
    
    const UserManagementView = () => (
        <div className="p-6">
            <div className="bg-brand-yellow border-2 border-black rounded-lg p-4 mb-6 flex items-center">
                 <div className="bg-brand-pink p-2 rounded-md border-2 border-black mr-4">
                    <Users className="h-6 w-6 text-black"/>
                </div>
                <h2 className="text-3xl font-bold font-display text-black">User Management</h2>
            </div>
            <div className="bg-cream dark:bg-gray-800 rounded-lg border-2 border-black dark:border-gray-600 overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                <tr className="border-b-2 border-black dark:border-gray-600">
                    <th className="p-3 font-display text-black dark:text-cream">User</th>
                    <th className="p-3 font-display text-black dark:text-cream">Role</th>
                    <th className="p-3 font-display text-black dark:text-cream">Last Login</th>
                    <th className="p-3 font-display text-black dark:text-cream">Actions</th>
                </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                         <tr key={u.id} className="border-b-2 border-black dark:border-gray-600 last:border-b-0 hover:bg-gray-200 dark:hover:bg-gray-700">
                            <td className="p-3">
                                <div className="flex items-center">
                                    <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full mr-3 border-2 border-black dark:border-gray-600"/>
                                    <div>
                                        <p className="font-medium text-black dark:text-cream">{u.name}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{u.email}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="p-3">
                                <span className={`px-2 py-1 text-xs font-bold rounded-md border border-black ${
                                    u.role === UserRole.Admin ? 'bg-brand-green text-white' :
                                    u.role === UserRole.Instructor ? 'bg-brand-blue text-black' :
                                    'bg-brand-pink text-black'
                                }`}>
                                    {u.role}
                                </span>
                            </td>
                            <td className="p-3 text-sm text-gray-600 dark:text-gray-400">2024-07-21</td>
                            <td className="p-3">
                                <button className="text-sm text-black dark:text-cream hover:underline">Edit</button>
                                <span className="mx-2 text-gray-400">|</span>
                                <button className="text-sm text-black dark:text-cream hover:underline">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
    );
    
    const AnnouncementManagementView = () => (
         <div className="p-6">
            <div className="bg-brand-yellow border-2 border-black rounded-lg p-4 mb-6 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center">
                    <div className="bg-brand-purple p-2 rounded-md border-2 border-black mr-4">
                        <Megaphone className="h-6 w-6 text-black"/>
                    </div>
                    <h2 className="text-3xl font-bold font-display text-black">Announcements</h2>
                </div>
                <button onClick={handleCreateAnnouncement} className="flex items-center bg-brand-green text-white py-2 px-4 rounded-lg font-bold font-display border-2 border-black hover:bg-green-700 transition-colors">
                    <Plus className="h-5 w-5 mr-1" />
                    Create Announcement
                </button>
            </div>
            <div className="bg-cream dark:bg-gray-800 rounded-lg border-2 border-black dark:border-gray-600 overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b-2 border-black dark:border-gray-600">
                            <th className="p-3 font-display text-black dark:text-cream">Title</th>
                            <th className="p-3 font-display text-black dark:text-cream">Audience</th>
                            <th className="p-3 font-display text-black dark:text-cream">Author</th>
                            <th className="p-3 font-display text-black dark:text-cream">Date</th>
                            <th className="p-3 font-display text-black dark:text-cream">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {announcements.map(ann => (
                            <tr key={ann.id} className="border-b-2 border-black dark:border-gray-600 last:border-b-0 hover:bg-gray-200 dark:hover:bg-gray-700">
                                <td className="p-3 font-medium text-black dark:text-cream">{ann.title}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-md border border-black ${ann.courseId ? 'bg-brand-blue text-black' : 'bg-gray-300 dark:bg-gray-600 text-black dark:text-cream'}`}>
                                        {ann.courseId ? getCourseName(ann.courseId) : 'System-Wide'}
                                    </span>
                                </td>
                                <td className="p-3 text-black dark:text-cream">{getUserName(ann.authorId)}</td>
                                <td className="p-3 text-sm text-gray-600 dark:text-gray-400">{ann.date}</td>
                                <td className="p-3 space-x-2">
                                    <button onClick={() => handleEditAnnouncement(ann)} className="text-black dark:text-cream hover:underline">Edit</button>
                                    <span className="text-gray-400">|</span>
                                    <button onClick={() => handleDeleteAnnouncement(ann.id)} className="text-black dark:text-cream hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
    
    const renderContent = () => {
        switch (activeView) {
            case 'dashboard':
                return (
                    <div className="p-6 space-y-8 bg-brand-green dark:bg-gray-900">
                        <AnalyticsView />
                        <AnnouncementManagementView />
                        <UserManagementView />
                    </div>
                );
            case 'analytics':
                return <AnalyticsView />;
            case 'user-management':
                return <UserManagementView />;
            case 'settings':
                return <SettingsView user={user} onUpdateProfile={onUpdateProfile} theme={theme} onToggleTheme={onToggleTheme} />;
            default:
                return (
                     <div className="p-6 space-y-8 bg-brand-green dark:bg-gray-900">
                        <AnalyticsView />
                        <AnnouncementManagementView />
                        <UserManagementView />
                    </div>
                );
        }
    }


  return (
    <>
        {renderContent()}
         {isAnnouncementModalOpen && (
            <AnnouncementEditorModal
                announcement={selectedAnnouncement}
                user={user}
                onClose={() => {
                    setIsAnnouncementModalOpen(false);
                    setSelectedAnnouncement(null);
                }}
                onSave={handleSaveAnnouncement}
            />
        )}
    </>
  );
};

export default AdminDashboard;