import React from 'react';
import { User, UserRole } from '../types';
import { LayoutDashboard, BookOpen, Users, ClipboardList, Trophy, Megaphone, Settings, BarChart, MessageSquare, Calendar, GraduationCap, CreditCard } from './Icons';
import { Logo } from './Logo';

interface SidebarProps {
  user: User;
  isSidebarOpen: boolean;
  onMessagesClick: () => void;
  activeView: string;
  onNavClick: (viewId: string) => void;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  viewId: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps & { currentView: string, onNavClick: (viewId: string) => void }> = ({ icon, label, viewId, onClick, currentView, onNavClick }) => {
    const isActive = currentView === viewId;
    
    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            onNavClick(viewId);
        }
    };

    return (
        <button onClick={handleClick} className={`w-full flex items-center px-4 py-2.5 rounded-lg transition-colors text-left border-2 border-black dark:border-gray-600 font-display font-bold ${
            isActive ? 'bg-brand-yellow text-black shadow-md' : 'bg-cream dark:bg-gray-700 text-black dark:text-cream hover:bg-brand-yellow/80 dark:hover:bg-brand-yellow/80 dark:hover:text-black'
        }`}>
            {icon}
            <span className="ml-3">{label}</span>
        </button>
    );
}

const Sidebar: React.FC<SidebarProps> = ({ user, isSidebarOpen, onMessagesClick, activeView, onNavClick }) => {
  const commonLinks: Omit<NavItemProps, 'active'>[] = [
    { icon: <Settings className="h-5 w-5" />, label: 'Settings', viewId: 'settings' },
  ];

  let roleLinks: Omit<NavItemProps, 'active'>[] = [];

  if (user.role === UserRole.Learner) {
    roleLinks = [
      { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Dashboard', viewId: 'dashboard' },
      { icon: <BookOpen className="h-5 w-5" />, label: 'My Courses', viewId: 'courses' },
      { icon: <Calendar className="h-5 w-5" />, label: 'My Schedule', viewId: 'schedule' },
      { icon: <CreditCard className="h-5 w-5" />, label: 'Billing', viewId: 'billing' },
      { icon: <MessageSquare className="h-5 w-5" />, label: 'Messages', viewId: 'messages', onClick: onMessagesClick },
      { icon: <ClipboardList className="h-5 w-5" />, label: 'Assessments', viewId: 'assessments' },
      { icon: <GraduationCap className="h-5 w-5" />, label: 'Grades', viewId: 'grades' },
      { icon: <Trophy className="h-5 w-5" />, label: 'Achievements', viewId: 'achievements' },
      { icon: <Megaphone className="h-5 w-5" />, label: 'Announcements', viewId: 'announcements' },
    ];
  } else if (user.role === UserRole.Instructor) {
    roleLinks = [
      { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Dashboard', viewId: 'dashboard' },
      { icon: <BookOpen className="h-5 w-5" />, label: 'Course Management', viewId: 'course-management' },
      { icon: <Calendar className="h-5 w-5" />, label: 'Scheduler', viewId: 'scheduler' },
      { icon: <MessageSquare className="h-5 w-5" />, label: 'Messages', viewId: 'messages', onClick: onMessagesClick },
      { icon: <ClipboardList className="h-5 w-5" />, label: 'Assessments', viewId: 'assessments' },
      { icon: <Users className="h-5 w-5" />, label: 'My Students', viewId: 'students' },
    ];
  } else if (user.role === UserRole.Admin) {
    roleLinks = [
      { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Dashboard', viewId: 'dashboard' },
      { icon: <BarChart className="h-5 w-5" />, label: 'Analytics', viewId: 'analytics' },
      { icon: <Users className="h-5 w-5" />, label: 'User Management', viewId: 'user-management' },
      { icon: <BookOpen className="h-5 w-5" />, label: 'Course Library', viewId: 'course-library' },
    ];
  }

  const navLinks = [...roleLinks, ...commonLinks];

  return (
    <aside className={`bg-brand-green dark:bg-gray-800 text-black dark:text-cream fixed top-0 left-0 h-full z-20 transition-all duration-300 ease-in-out border-r-4 border-black dark:border-gray-600 ${isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden md:w-64'}`}>
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-center p-4 border-b-4 border-black dark:border-gray-600">
                <Logo className="h-10 w-10" />
                <h1 className="text-lg font-bold font-display ml-2">LMS</h1>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {navLinks.map(link => <NavItem key={link.label} {...link} currentView={activeView} onNavClick={onNavClick} />)}
            </nav>
        </div>
    </aside>
  );
};

export default Sidebar;