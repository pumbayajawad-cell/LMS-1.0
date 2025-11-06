import React from 'react';
import { User, UserRole } from '../types';
import { LogOut } from './Icons';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  toggleSidebar: () => void;
  activeView: string;
}

const getSubtitle = (role: UserRole, activeView: string): string => {
    const viewMap: { [key: string]: string } = {
        'dashboard': `Here's your overview for today.`,
        'courses': 'Here are your courses to complete.',
        'assessments': 'Check your upcoming assessments.',
        'grades': 'Review your performance and scores.',
        'achievements': 'View your earned achievements.',
        'announcements': 'Catch up on the latest announcements.',
        'course-management': 'Here are your courses to manage.',
        'students': 'Review your students\' progress.',
        'analytics': 'Review system-wide analytics.',
        'user-management': 'Manage all system users.',
        'course-library': 'Browse and manage all courses.',
        'settings': 'Adjust your account settings.',
    };

    return viewMap[activeView] || `Let's continue learning.`;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, toggleSidebar, activeView }) => {
  return (
    <header className="bg-cream dark:bg-gray-800 border-b-4 border-black dark:border-gray-600 p-4 flex items-center justify-between sticky top-0 z-10">
       <div className="flex items-center">
            <button onClick={toggleSidebar} className="md:hidden mr-4 text-black dark:text-cream">
                <svg xmlns="http://www.w.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
            </button>
            <div>
                <h1 className="text-2xl font-bold text-black dark:text-cream font-display">
                    Welcome back, {user.name.split(' ')[0]}!
                </h1>
                <p className="text-sm text-gray-700 dark:text-gray-400">{getSubtitle(user.role, activeView)}</p>
            </div>
       </div>

      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="font-semibold text-black dark:text-cream">{user.name}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">{user.role}</p>
        </div>
        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border-2 border-black dark:border-gray-500" />
        <button onClick={onLogout} className="text-black dark:text-cream hover:text-red-600 dark:hover:text-red-500" title="Logout">
          <LogOut className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;