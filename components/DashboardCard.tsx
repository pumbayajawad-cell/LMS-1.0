import React from 'react';

interface DashboardCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  color?: 'green' | 'blue' | 'pink' | 'yellow' | 'purple';
}

const DashboardCard: React.FC<DashboardCardProps> = ({ icon, title, value, description, color = 'green' }) => {
  const colorClasses = {
    green: 'bg-brand-green text-white',
    blue: 'bg-brand-blue text-black',
    pink: 'bg-brand-pink text-black',
    yellow: 'bg-brand-yellow text-black',
    purple: 'bg-brand-purple text-white',
  };
  
  return (
    <div className="bg-cream dark:bg-gray-800 p-6 rounded-lg border-2 border-black dark:border-gray-600 flex items-start space-x-4">
      <div className={`p-3 rounded-md border-2 border-black ${colorClasses[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-black dark:text-cream font-display">{value}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
      </div>
    </div>
  );
};

export default DashboardCard;